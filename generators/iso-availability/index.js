// Escena iso "Disponibilidad" (elaniin.com · solutions · Built for real demand):
// una losa cloud con su monitoreo; ante la demanda aparecen réplicas y luego se retiran.
import { defineIso, SCENE_DEFAULTS, sceneSection, textField, iconSelect, slab, glassSlab, pill, pulse, project, clamp01, ease, wave } from '../_shared/iso-kit.js';

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineIso({
  DEFAULTS: { ...SCENE_DEFAULTS, label: 'Disponibilidad', icon: 'activity', replicas: 4 },
  controls: [
    { title: 'Servicio', items: [
      textField('label'), iconSelect('icon'),
      { type: 'range', key: 'replicas', label: 'Réplicas en el pico', min: 1, max: 9, step: 1, digits: 0 },
    ] },
    sceneSection(),
  ],
  describe: c => `${c.label} · ${c.replicas} réplicas`,
  build(c) {
    const plate = { x: -20, y: -20, z: 0, w: 330, d: 260, h: 10 };
    const main = { x: 0, y: 0, z: 10, w: 62, d: 220, h: 30 };
    const reps = Array.from({ length: c.replicas }, (_, i) => ({ x: 92 + (i % 3) * 40, y: 6 + Math.floor(i / 3) * 40, z: 10, w: 28, d: 28, h: 28, start: 2200 + i * (5000 / c.replicas) }));
    const bounds = [
      ...[[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => ({ x: plate.x + x * plate.w, y: plate.y + y * plate.d, z: -36 })),
      { x: 0, y: 0, z: 10 + 30 + 50 },
    ];
    return { plate, main, reps, bounds };
  },
  draw(ctx, env) {
    const { cfg: c, S, t, o } = env;
    slab(ctx, 'plate', S.plate, o);
    const peak = clamp01((t - 2000) / 600) * (1 - clamp01((t - 9600) / 900));
    glassSlab(ctx, env, 'cloud', S.main, { glow: peak * 0.7 });
    // el monitoreo recorre la losa de punta a punta, dos veces por loop
    const k = (t % 6000) / 6000, z = S.main.z + S.main.h;
    pulse(ctx, project({ x: S.main.w / 2, y: S.main.d * (1 - k), z }, o), Math.sin(Math.PI * k));
    pill(ctx, { box: S.main, label: c.label, icon: c.icon, tile: { x: S.main.w / 2, y: S.main.d / 2 } }, o, -4 * wave(t, 4000));
    // réplicas: de atrás hacia adelante para pintar bien
    [...S.reps].sort((a, b) => a.x + a.y - (b.x + b.y)).forEach(r => {
      const grow = ease(clamp01((t - r.start) / 700)) * (1 - ease(clamp01((t - 9800 - (r.x + r.y) * 2) / 700)));
      const ghost = grow < 1;
      if (grow > 0) glassSlab(ctx, env, 'brand', { ...r, h: r.h * grow });
      if (ghost) { ctx.save(); ctx.globalAlpha = 0.6; slab(ctx, 'wire', r, o); ctx.restore(); }
    });
  },
});
