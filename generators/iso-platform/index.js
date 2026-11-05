// Escena iso "Plataforma" (elaniin.com · solutions · Build and modernize: Platform, Web app, Mobile):
// una plataforma base; las apps bajan una por una y se acoplan encima.
import { defineIso, SCENE_DEFAULTS, sceneSection, textField, iconSelect, ICON_NAMES, slab, glassSlab, pill, clamp01, ease, envelope, wave } from '../_shared/iso-kit.js';

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineIso({
  DEFAULTS: {
    ...SCENE_DEFAULTS, label: 'Plataforma', icon: 'layers',
    apps: [{ label: 'Web app', icon: 'window' }, { label: 'Móvil', icon: 'smartphone' }],
  },
  controls: [
    { title: 'Plataforma', items: [textField('label'), iconSelect('icon')] },
    { title: 'Apps', hint: 'Bajan en orden y se acoplan sobre la plataforma.', items: [
      { type: 'list', key: 'apps', itemName: 'App', ends: ['primera', 'última'], min: 0, max: 3, item: { label: 'App', icon: 'window' }, fields: [
        { type: 'text', key: 'label', label: 'Etiqueta', max: 12 },
        { type: 'select', key: 'icon', label: 'Icono', options: ICON_NAMES },
      ] },
    ] },
    sceneSection(),
  ],
  describe: c => [c.label, ...c.apps.map(a => a.label)].join(' · '),
  build(c) {
    const plate = { x: -20, y: -20, z: 0, w: 280, d: 260, h: 10 };
    const base = { x: 0, y: 0, z: 10, w: 240, d: 220, h: 24 };
    const apps = c.apps.map((a, i) => ({ ...a, box: { x: 18 + i * 66, y: 24, z: base.z + base.h, w: 54, d: 150, h: 12 }, start: 1600 + i * 1700 }));
    const bounds = [
      ...[[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => ({ x: plate.x + x * plate.w, y: plate.y + y * plate.d, z: -36 })),
      { x: 0, y: 0, z: base.z + base.h + 130 }, { x: base.w, y: 0, z: base.z + base.h + 40 },
    ];
    return { plate, base, apps, bounds };
  },
  draw(ctx, env) {
    const { cfg: c, S, t, o } = env;
    slab(ctx, 'plate', S.plate, o);
    const glow = Math.max(0, ...S.apps.map(a => envelope(t, a.start + 1100, 250, 350, 600)));
    glassSlab(ctx, env, 'software', S.base, { glow });
    pill(ctx, { box: S.base, label: c.label, icon: c.icon, tile: { x: S.base.w - 26, y: S.base.d / 2 } }, o, -4 * wave(t, 4000));
    S.apps.forEach((a, i) => {
      const down = ease(clamp01((t - a.start) / 1200)), up = ease(clamp01((t - 10200 - i * 250) / 900));
      const alpha = clamp01((t - a.start) / 300) * (1 - up);
      if (alpha <= 0) return;
      const b = { ...a.box, z: a.box.z + (1 - down) * 90 + up * 60 };
      glassSlab(ctx, env, 'brand', b, { a: alpha });
      ctx.save(); ctx.globalAlpha = alpha;
      pill(ctx, { box: b, label: a.label, icon: a.icon, tile: { x: b.x + b.w / 2, y: b.y + b.d / 2 }, room: b.d, scale: 0.8 }, o, -4 * wave(t, 4000, (i + 1) * 400));
      ctx.restore();
    });
  },
});
