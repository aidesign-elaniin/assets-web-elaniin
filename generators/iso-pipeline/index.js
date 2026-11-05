// Escena iso "Pipeline" (elaniin.com · solutions · AI across the pipeline):
// escalones en diagonal (Pruebas → Revisión → Staging → Producción); un pulso los recorre y cada uno se aprueba.
import { defineIso, SCENE_DEFAULTS, sceneSection, ICON_NAMES, slab, glassSlab, pill, pulse, line, project, pointAt, clamp01, ease, wave } from '../_shared/iso-kit.js';

const STEP_LOOKS = { software: 'Software', brand: 'Marca (azul)', ai: 'AI', cloud: 'Cloud' };

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineIso({
  DEFAULTS: {
    ...SCENE_DEFAULTS, look: 'software',
    steps: [
      { label: 'Pruebas', icon: 'flask' }, { label: 'Revisión', icon: 'review' },
      { label: 'Staging', icon: 'layers' }, { label: 'Producción', icon: 'rocket' },
    ],
  },
  controls: [
    { title: 'Etapas', hint: 'De la primera a la última. Un pulso las recorre y cada una se aprueba con un check.', items: [
      { type: 'list', key: 'steps', itemName: 'Etapa', min: 2, max: 7, item: { label: 'Etapa', icon: 'box' }, fields: [
        { type: 'text', key: 'label', label: 'Etiqueta', max: 14 },
        { type: 'select', key: 'icon', label: 'Icono', options: ICON_NAMES },
      ] },
      { type: 'select', key: 'look', label: 'Material de los escalones', options: STEP_LOOKS },
    ] },
    sceneSection(),
  ],
  describe: c => c.steps.map(s => s.label).join(' → '),
  build(c) {
    const n = c.steps.length, STEP = 58;
    const steps = c.steps.map((s, i) => ({ ...s, box: { x: i * STEP, y: 0, z: 10 + (n - 1 - i) * 10, w: 46, d: 200, h: 10 } }));
    const plate = { x: -30, y: -24, z: 0, w: n * STEP + 40, d: 248, h: 10 };
    const route = steps.map(s => ({ x: s.box.x + s.box.w / 2, y: s.box.d + 14, z: 10 }));
    const per = 8400 / n;
    const bounds = [
      ...[[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => ({ x: plate.x + x * plate.w, y: plate.y + y * plate.d, z: -36 })),
      { x: 0, y: 0, z: 10 + n * 10 + 50 },
    ];
    return { steps, plate, route, per, bounds };
  },
  draw(ctx, env) {
    const { cfg: c, S, t, o } = env;
    const n = S.steps.length, k = (t - 1000) / S.per, active = t >= 1000 && t < 1000 + S.per * n ? Math.floor(k) : -1;
    const fade = 1 - clamp01((t - 10800) / 700);
    slab(ctx, 'plate', S.plate, o);
    const r2 = S.route.map(p => project(p, o));
    line(ctx, S.route, o, { dash: [4, 4] });
    if (active >= 0) pulse(ctx, pointAt(r2, ease(clamp01(k / Math.max(1, n - 1)))));
    S.steps.forEach((s, i) => {
      const done = t >= 1000 + S.per * (i + 0.7) ? fade : 0, on = i === active;
      glassSlab(ctx, env, c.look, s.box, { glow: on ? 1 : 0 });
      pill(ctx, { box: s.box, label: s.label, icon: s.icon, tile: { x: s.box.x + s.box.w / 2, y: 100 }, scale: 1, check: done, active: on }, o, -4 * wave(t, 4000, i * 400));
    });
  },
});
