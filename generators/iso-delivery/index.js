// Escena iso "Entrega por fases" (elaniin.com · engagement · Project delivery):
// bloques que suben como escalones (descubrimiento → lanzamiento); el avance recorre cada fase hasta la meta.
import { defineIso, SCENE_DEFAULTS, sceneSection, ink, slab, glassSlab, pill, pulse, line, project, pointAt, clamp01, ease, envelope, wave } from '../_shared/iso-kit.js';

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineIso({
  DEFAULTS: {
    ...SCENE_DEFAULTS, theme: 'dark', background: '#141414', grid: 'none', labels: 'off',
    phases: [{ label: 'Discovery', icon: 'review' }, { label: 'Build', icon: 'code' }, { label: 'Launch', icon: 'rocket' }],
  },
  controls: [
    { title: 'Fases', hint: 'Cada fase es un escalón más alto. La última es la meta.', items: [
      { type: 'list', key: 'phases', itemName: 'Fase', min: 2, max: 6, item: { label: 'Fase', icon: 'box' }, fields: [
        { type: 'text', key: 'label', label: 'Etiqueta', max: 12 },
        { type: 'select', key: 'icon', label: 'Icono', options: { review: 'Revisión', code: 'Código', rocket: 'Lanzamiento', box: 'Módulo', layers: 'Capas', chart: 'Datos', flask: 'Pruebas', shield: 'Seguridad' } },
      ] },
      { type: 'seg', key: 'labels', label: 'Etiquetas sobre las fases', options: { off: 'No', on: 'Sí' } },
    ] },
    sceneSection(),
  ],
  describe: c => c.phases.map(p => p.label).join(' → '),
  build(c) {
    const n = c.phases.length, W = Math.max(46, Math.round(240 / n)), D = 150;
    // de adelante-izquierda (baja) a atrás-derecha (alta): escalones que suben
    const blocks = c.phases.map((p, i) => ({ ...p, box: { x: i * W, y: 0, z: 8, w: W, d: D, h: Math.round(22 + (i / Math.max(1, n - 1)) * 78) } }));
    const plate = { x: -24, y: -24, z: 0, w: n * W + 48, d: D + 48, h: 8 };
    const route = blocks.map(b => ({ x: b.box.x + b.box.w / 2, y: D + 14, z: 8 }));
    const per = 7000 / n;
    const bounds = [
      ...[[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => ({ x: plate.x + x * plate.w, y: plate.y + y * plate.d, z: -36 })),
      { x: blocks.at(-1).box.x, y: 0, z: 8 + 100 + 50 },
    ];
    return { blocks, plate, route, per, bounds };
  },
  draw(ctx, env) {
    const { cfg: c, S, t, o } = env;
    const n = S.blocks.length, k = (t - 1200) / S.per;
    slab(ctx, 'plate', S.plate, o);
    line(ctx, S.route, o, { dash: [4, 4], color: ink(0.35) });
    if (k > 0 && k < n) pulse(ctx, pointAt(S.route.map(p => project(p, o)), ease(clamp01(k / Math.max(1, n - 1)))));
    const goal = clamp01((t - 1200 - S.per * (n - 0.3)) / 400) * (1 - clamp01((t - 10800) / 700));
    S.blocks.forEach((b, i) => {
      const reach = envelope(t, 1200 + i * S.per, 300, Math.max(300, S.per - 600), 400);
      const isGoal = i === n - 1;
      glassSlab(ctx, env, isGoal ? 'brand' : 'software', b.box, { glow: Math.max(reach, isGoal ? goal : 0) });
      if (c.labels === 'on') pill(ctx, { box: b.box, label: b.label, icon: b.icon, tile: { x: b.box.x + b.box.w / 2, y: b.box.d / 2 }, room: b.box.d, scale: 0.8, check: isGoal ? goal : undefined }, o, -4 * wave(t, 4000, i * 400));
    });
  },
});
