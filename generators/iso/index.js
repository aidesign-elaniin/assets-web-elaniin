// Generador "Iso Stack": la pila del hero de elaniin.com (riser, brazos, pulso) con 1–12 losas y grosor automático.
// Fuente: elaniin-style templates/iso-stack.js. Todo el dibujo base sale de ../_shared/iso-kit.js.
import {
  defineIso, ink, LOOKS, ICON_NAMES, COS30, ELEVATE, PILL_H, project, clamp01, ease, wave, envelope, pointAt,
  slab, pill, logoRight, pulse, glassSlab, sceneSection, SCENE_DEFAULTS,
} from '../_shared/iso-kit.js';

const MAX_LAYERS = 12, D = 200, SLIDE = 28, DIM = 0.4;
const T = { trace: 1000, traceDur: 1000, rise: 900, branch: 1000 };
const LOOK_ICON = { cloud: 'cloud', software: 'code', brand: 'layers', ai: 'sparkles', wire: 'box' };
const CYCLE = ['cloud', 'software', 'ai', 'wire'];
const OLD = [['cloud', 'Cloud', 'cloud'], ['software', 'Software', 'code'], ['ai', 'AI delivery', 'sparkles'], ['wire', 'Por construir', 'box']];

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineIso({
  DEFAULTS: {
    ...SCENE_DEFAULTS, logo: 'on',
    stack: [   // de abajo hacia arriba
      { look: 'cloud', label: 'Cloud', icon: 'cloud' },
      { look: 'software', label: 'Software', icon: 'code' },
      { look: 'ai', label: 'AI delivery', icon: 'sparkles' },
    ],
  },
  controls: [
    { title: 'Capas', hint: `Hasta ${MAX_LAYERS}. El grosor, la separación y el tamaño de las etiquetas se ajustan solos según cuántas haya.`, items: [
      { type: 'list', key: 'stack', itemName: 'Capa', stackOrder: true, min: 1, max: MAX_LAYERS, item: { look: 'software', label: 'Nueva capa', icon: 'layers' },
        next: l => { const look = CYCLE[(CYCLE.indexOf(l.at(-1)?.look) + 1) % CYCLE.length]; return { look, label: LOOKS[look], icon: LOOK_ICON[look] }; },
        fields: [
          { type: 'text', key: 'label', label: 'Etiqueta', max: 16 },
          { type: 'select', key: 'look', label: 'Material', options: LOOKS },
          { type: 'select', key: 'icon', label: 'Icono', options: ICON_NAMES },
        ] },
    ] },
    sceneSection([{ type: 'seg', key: 'logo', label: 'Logotipo en la losa Software', options: { on: 'Sí', off: 'No' } }]),
  ],
  migrate(c) {   // formato anterior: layers + l1Look…l4Icon
    if (Array.isArray(c.stack) || !(c.layers || c.l1Look)) return c;
    const n = Math.min(4, Math.max(1, Math.round(+c.layers || 3)));
    return { ...c, stack: Array.from({ length: n }, (_, i) => ({ look: c[`l${i + 1}Look`] ?? OLD[i][0], label: c[`l${i + 1}Label`] ?? OLD[i][1], icon: c[`l${i + 1}Icon`] ?? OLD[i][2] })) };
  },
  describe: c => `${c.stack.length} capa${c.stack.length > 1 ? 's' : ''} · ${c.stack.at(-1).label}`,

  build(c) {
    // Grosor automático: con ≤3 capas es exactamente el hero (40/80/40, separación 20, escalón 70).
    // Con más, el alto total crece despacio y cada losa se adelgaza; separación y escalón se reducen.
    const n = c.stack.length, st = [];
    const weight = l => (l.look === 'software' || l.look === 'brand' ? 2 : 1);
    const sumW = c.stack.reduce((a, l) => a + weight(l), 0);
    const unit = Math.min(40, Math.max(8, (160 + Math.max(0, n - 3) * 14) / sumW));
    const gap = n <= 3 ? 20 : Math.max(6, Math.round(60 / n));
    const step = n <= 4 ? 70 : Math.max(34, Math.round(210 / (n - 1)));
    const scale = Math.min(1, (step - 6) / PILL_H);
    let z = 12;
    c.stack.forEach((l, i) => {
      const w = 90 + step * (n - 1 - i), h = Math.round(unit * weight(l));
      st.push({ look: l.look, label: l.label, icon: l.icon, scale, box: { x: 0, y: 0, z, w, d: D, h }, tile: { x: i < n - 1 ? w - step / 2 : w / 2, y: 100 } });
      z += h + gap;
    });
    const plate = { x: -90, y: -30, z: 0, w: st[0].box.w + 120, d: 260, h: 12 };
    const top = st.at(-1).box;
    const riser = { x: -68, y: 192, z: 12, w: 16, d: 16, h: top.z + top.h / 2 + 20 - 12 };
    const RX = riser.x + riser.w, RY = riser.y + riser.d / 2;
    const rise = Math.min(T.rise, 6500 / n);   // con muchas capas la subida se acelera para caber en 12 s
    let r = T.trace + T.traceDur;
    const times = st.map(() => { const row = { R: r, B: r + rise, A: r + rise + T.branch }; r = row.B; return row; });
    const trace3 = [{ x: plate.x + plate.w, y: plate.y + plate.d - 12, z: plate.h }, { x: RX, y: plate.y + plate.d - 12, z: plate.h }, { x: RX, y: RY, z: plate.h }];
    const bounds = [];
    for (const [x, y] of [[0, 0], [1, 0], [1, 1], [0, 1]]) bounds.push({ x: plate.x + x * plate.w, y: plate.y + y * plate.d, z: -36 });
    bounds.push({ x: riser.x, y: riser.y, z: riser.z + riser.h });
    for (const s of st) bounds.push({ x: s.box.w + SLIDE, y: 0, z: s.box.z + s.box.h + 30 });
    return { st, plate, riser, RX, RY, times, trace3, rise, bounds };
  },

  draw(ctx, env) {
    const { cfg: c, S, t, o } = env;
    const { st, plate, riser, RX, RY, times, trace3, rise } = S;
    const envs = times.map(r => envelope(t, r.A)), emph = Math.max(...envs);
    slab(ctx, 'plate', plate, o); slab(ctx, 'plate', riser, o);
    const tr = trace3.map(p => project(p, o));
    ctx.beginPath(); tr.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.strokeStyle = ink(0.4); ctx.lineWidth = 1; ctx.stroke();

    // brazos: del riser a la esquina de cada losa; se telescopan con el deslizamiento
    st.forEach((s, i) => {
      const level = s.box.z + s.box.h / 2, row = times[i];
      const from = project({ x: RX, y: RY, z: level }, o), to = project({ x: SLIDE * envs[i], y: RY, z: level }, o);
      const travelling = t >= row.B && t < row.A, prog = ease(clamp01((t - row.B) / T.branch));
      const head = project({ x: RX + (SLIDE * envs[i] - RX) * prog, y: RY, z: level }, o);
      const trail = travelling ? 1 : t >= row.A ? clamp01(1 - (t - row.A) / 700) : 0;
      ctx.strokeStyle = ink(0.5); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke();
      if (trail > 0) {
        ctx.save(); ctx.globalAlpha = trail; ctx.strokeStyle = ELEVATE; ctx.lineWidth = 2; ctx.lineCap = 'round';
        const e = travelling ? head : to; ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(e.x, e.y); ctx.stroke(); ctx.restore();
      }
      ctx.fillStyle = '#fff'; ctx.strokeStyle = ELEVATE; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(to.x, to.y, 3, 0, 7); ctx.fill(); ctx.stroke();
    });

    // pulsos: trazo en la placa → riser → cada brazo (cada trayecto empieza donde termina el anterior)
    const traceEnd = T.trace + T.traceDur, last = times.at(-1);
    if (t >= T.trace && t < traceEnd) pulse(ctx, pointAt(tr, ease((t - T.trace) / T.traceDur)), clamp01((t - T.trace) / 150));
    if (t >= traceEnd && t < last.B + 200) {
      let z = plate.h, z0 = z;
      times.forEach((row, i) => {
        const level = st[i].box.z + st[i].box.h / 2;
        if (t >= row.R && t < row.B) z = z0 + (level - z0) * ease((t - row.R) / rise); else if (t >= row.B) z = level;
        z0 = level;
      });
      pulse(ctx, project({ x: RX, y: RY, z }, o), t < last.B ? 1 : clamp01(1 - (t - last.B) / 200));
    }
    times.forEach((row, i) => {
      if (t >= row.B && t < row.A) pulse(ctx, project({ x: RX * (1 - ease((t - row.B) / T.branch)), y: RY, z: st[i].box.z + st[i].box.h / 2 }, o), 1);
    });

    // losas de abajo hacia arriba: frost + vidrio + logo + etiqueta + borde encendido
    const logoAt = st.findIndex(x => x.look === 'software');   // un solo logotipo por recurso
    st.forEach((s, i) => {
      const off = SLIDE * envs[i], op = 1 - DIM * emph * (1 - envs[i]);
      ctx.save(); ctx.translate(off * COS30, off * 0.5);
      glassSlab(ctx, env, s.look, s.box, { a: op, glow: envs[i] });
      ctx.globalAlpha = op;
      if (c.logo === 'on' && i === logoAt) logoRight(ctx, s.box, o);
      pill(ctx, s, o, -4 * wave(t, 4000, i * 400));
      ctx.restore();
    });
  },
});
