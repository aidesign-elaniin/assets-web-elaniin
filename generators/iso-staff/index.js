// Escena iso "Staff augmentation" (elaniin.com · engagement): una losa por persona, cada una con su nombre.
// La última persona se suma al equipo (entra deslizándose) y el foco recorre a cada una: "las conoces por nombre".
import { defineIso, SCENE_DEFAULTS, sceneSection, ICON_NAMES, slab, glassSlab, pill, clamp01, ease, envelope, wave } from '../_shared/iso-kit.js';

const W = 56, GAP = 10, D = 200, H = 26;

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineIso({
  DEFAULTS: {
    ...SCENE_DEFAULTS, theme: 'dark', background: '#141414', grid: 'none',
    people: [{ label: 'Diego', icon: 'user' }, { label: 'Lucía', icon: 'user' }, { label: 'Camila', icon: 'user' }],
  },
  controls: [
    { title: 'Personas', hint: 'Una losa por persona. La última entra al equipo durante la animación.', items: [
      { type: 'list', key: 'people', itemName: 'Persona', min: 1, max: 6, item: { label: 'Nombre', icon: 'user' }, fields: [
        { type: 'text', key: 'label', label: 'Nombre', max: 12 },
        { type: 'select', key: 'icon', label: 'Icono', options: ICON_NAMES },
      ] },
    ] },
    sceneSection(),
  ],
  describe: c => c.people.map(p => p.label).join(' · '),
  build(c) {
    const n = c.people.length, STEP = W + GAP;
    const plate = { x: -20, y: -20, z: 0, w: n * STEP - GAP + 40, d: D + 40, h: 8 };
    const slabs = c.people.map((p, i) => ({ ...p, box: { x: i * STEP, y: 0, z: 8, w: W, d: D, h: H } }));
    const bounds = [
      ...[[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => ({ x: plate.x + x * plate.w, y: plate.y + y * plate.d, z: -36 })),
      { x: 0, y: -110, z: 8 + H + 40 },
    ];
    return { plate, slabs, bounds };
  },
  draw(ctx, env) {
    const { S, t, o } = env;
    const n = S.slabs.length;
    slab(ctx, 'plate', S.plate, o);
    // la última persona entra desde atrás (1.5–2.7 s) y vuelve a salir al cerrar el loop (10.4–11.6 s)
    const join = ease(clamp01((t - 1500) / 1200)) * (1 - ease(clamp01((t - 10400) / 1200)));
    const focusStart = 3200, per = 6400 / n;
    S.slabs.forEach((p, i) => {
      const last = i === n - 1 && n > 1;
      const off = last ? (1 - join) * -110 : 0, a = last ? join : 1;
      if (a <= 0.001) return;
      const box = { ...p.box, y: p.box.y + off };
      const focus = envelope(t, focusStart + i * per, 350, Math.max(200, per - 700), 350);
      glassSlab(ctx, env, 'software', box, { a, glow: focus });
      ctx.save(); ctx.globalAlpha = a;
      pill(ctx, { box, label: p.label, icon: p.icon, tile: { x: box.x + box.w / 2, y: box.y + box.d / 2 }, active: focus > 0.5 }, o, -4 * wave(t, 4000, i * 400));
      ctx.restore();
    });
  },
});
