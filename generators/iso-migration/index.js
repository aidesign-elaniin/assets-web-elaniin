// Escena iso "Modernización" (elaniin.com · routes · Modernize a critical system):
// cubos que saltan del sistema legacy a la losa moderna, uno por uno, sin detener la operación.
import { defineIso, SCENE_DEFAULTS, sceneSection, textField, iconSelect, slab, glassSlab, pill, pulse, line, project, clamp01, ease, envelope, wave } from '../_shared/iso-kit.js';

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineIso({
  DEFAULTS: { ...SCENE_DEFAULTS, legacy: 'Legacy', legacyIcon: 'server', legacyLook: 'cloud', modern: 'Moderno', modernIcon: 'layers', cubes: 3 },
  controls: [
    { title: 'Sistemas', items: [
      textField('legacy', 'Etiqueta legacy'), iconSelect('legacyIcon', 'Icono legacy'),
      { type: 'seg', key: 'legacyLook', label: 'Material legacy', options: { cloud: 'Gris', wire: 'Wireframe' } },
      textField('modern', 'Etiqueta moderna'), iconSelect('modernIcon', 'Icono moderno'),
      { type: 'range', key: 'cubes', label: 'Módulos que migran', min: 1, max: 6, step: 1, digits: 0 },
    ] },
    sceneSection(),
  ],
  describe: c => `${c.legacy} → ${c.modern} · ${c.cubes} módulos`,
  build(c) {
    const plate = { x: -20, y: -20, z: 0, w: 370, d: 260, h: 10 };
    const legacy = { x: 0, y: 0, z: 10, w: 140, d: 110, h: 44 };
    const modern = { x: 180, y: 110, z: 10, w: 150, d: 110, h: 28 };
    const slot = (b, i, n) => { const cols = Math.min(3, n), r = Math.floor(i / cols), q = i % cols; return { x: b.x + 22 + q * 38, y: b.y + 20 + r * 38, z: b.z + b.h }; };
    const cubes = Array.from({ length: c.cubes }, (_, i) => ({ from: slot(legacy, i, c.cubes), to: slot(modern, i, c.cubes), start: 1500 + i * (6500 / c.cubes) }));
    const bounds = [
      ...[[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => ({ x: plate.x + x * plate.w, y: plate.y + y * plate.d, z: -36 })),
      { x: 0, y: 0, z: legacy.z + legacy.h + 80 }, { x: modern.x + modern.w, y: modern.y, z: modern.z + modern.h + 40 },
    ];
    return { plate, legacy, modern, cubes, bounds };
  },
  draw(ctx, env) {
    const { cfg: c, S, t, o } = env;
    const moved = S.cubes.filter(q => t > q.start + 1600).length / S.cubes.length;
    const reset = clamp01((t - 10800) / 900);   // al final los módulos vuelven a su origen con un fundido
    slab(ctx, 'plate', S.plate, o);
    const a = { x: S.legacy.x + S.legacy.w, y: S.legacy.y + S.legacy.d / 2, z: 10 }, b = { x: S.modern.x, y: S.modern.y + S.modern.d / 2, z: 10 };
    line(ctx, [a, { x: b.x - 20, y: a.y, z: 10 }, { x: b.x - 20, y: b.y, z: 10 }, b], o, { dash: [4, 4] });
    pulse(ctx, project({ x: S.plate.x + 24, y: S.plate.y + S.plate.d - 24, z: 10 }, o), 0.5 + 0.5 * wave(t, 3000));
    glassSlab(ctx, env, c.legacyLook, S.legacy, { a: 1 - 0.45 * moved * (1 - reset) });
    pill(ctx, { box: S.legacy, label: c.legacy, icon: c.legacyIcon, tile: { x: S.legacy.x + S.legacy.w / 2, y: S.legacy.y + S.legacy.d / 2 }, room: S.legacy.d }, o, -4 * wave(t, 4000));
    const glow = Math.max(0, ...S.cubes.map(q => envelope(t, q.start + 1500, 300, 400, 600)));
    glassSlab(ctx, env, 'software', S.modern, { glow });
    pill(ctx, { box: S.modern, label: c.modern, icon: c.modernIcon, tile: { x: S.modern.x + S.modern.w - 22, y: S.modern.y + S.modern.d / 2 }, room: S.modern.d, scale: 0.85 }, o, -4 * wave(t, 4000, 800));
    // cubos ordenados por profundidad para que el pintado sea correcto
    const items = S.cubes.map(q => {
      const k = ease(clamp01((t - q.start) / 1600));
      const p = { x: q.from.x + (q.to.x - q.from.x) * k, y: q.from.y + (q.to.y - q.from.y) * k, z: q.from.z + (q.to.z - q.from.z) * k + Math.sin(Math.PI * k) * 60 };
      return { q, p, k };
    }).sort((u, v) => u.p.x + u.p.y - (v.p.x + v.p.y));
    for (const { q, p, k } of items) {
      ctx.save(); ctx.globalAlpha = k > 0 ? 1 - reset : 1;
      slab(ctx, 'brand', { ...p, w: 22, d: 22, h: 22 }, o);
      ctx.restore();
      if (k > 0 && reset > 0) {   // el mismo módulo reaparece en el legacy: el loop cierra en el estado inicial
        ctx.save(); ctx.globalAlpha = reset; slab(ctx, 'brand', { ...q.from, w: 22, d: 22, h: 22 }, o); ctx.restore();
      }
    }
  },
});
