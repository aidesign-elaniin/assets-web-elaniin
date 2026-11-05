// Generador "Iso Stack": pila isométrica de losas de vidrio con etiquetas, riser, brazos y pulso de luz.
// Porta a Canvas2D el kit oficial (elaniin-style · references/isometric.md · templates/iso-stack.js):
// misma proyección 30°, geometría, materiales, frost 14px, reloj de 12 s, levitación 6px y sombra fija.
// Rasgo firma del diseñador (rogenizar · elaniin-website desktop-01/04). Canvas2D => exporta PNG/MP4 como el resto.
import { makeNormalize } from '../_shared/runtime.js';

const COS30 = Math.cos(Math.PI / 6);
const LOOKS = { software: 'Software', ai: 'AI', cloud: 'Cloud', wire: 'Por construir' };
const ICONS = {   // lucide (ISC), genéricos: nunca logos de marcas de terceros
  cloud: ['M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z'],
  code: ['M16 18L22 12L16 6', 'M8 6L2 12L8 18'],
  sparkles: ['M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z', 'M20 3v4', 'M22 5h-4', 'M4 17v2', 'M5 18H3'],
  database: ['M3 5a9 3 0 1 0 18 0a9 3 0 1 0 -18 0', 'M3 5V19A9 3 0 0 0 21 19V5', 'M3 12A9 3 0 0 0 21 12'],
  shield: ['M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'],
  layers: ['M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z', 'M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12', 'M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17'],
  server: ['M4 2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z', 'M4 14h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z', 'M6 6h.01', 'M6 18h.01'],
  chart: ['M3 3v16a2 2 0 0 0 2 2h16', 'M18 17V9', 'M13 17V5', 'M8 17v-3'],
  rocket: ['M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z', 'm12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z', 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0', 'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5'],
  box: ['M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z', 'm3.3 7 8.7 5 8.7-5', 'M12 22V12'],
};
const ICON_NAMES = { cloud: 'Nube', code: 'Código', sparkles: 'IA', database: 'Base de datos', shield: 'Seguridad', layers: 'Capas', server: 'Servidor', chart: 'Datos', rocket: 'Lanzamiento', box: 'Módulo' };
const LOGO = 'M41.42,59.92c.48-.5.79-.85.79-.85l8.06,5.28s-.25.53-.67,1.13c-5.63,7.9-15.43,11.26-25.28,10.25-11.26-1.15-20.35-9.09-23.18-19.59-1.59-5.91-1.52-12.11.29-17.93,1.36-4.38,3.81-8.15,7.21-11.37,5.09-4.82,11.61-7.14,18.75-7.02,15.03.25,25.49,11.65,25.49,26.29,0,4.22-.07,5.79-.07,5.79H10.41c1.24,8.21,7.61,13.56,16.36,13.82,5.64.16,10.81-1.79,14.64-5.79h0ZM35.95,32.59c-3.09-1.87-6.35-2.5-10.01-2.46-7.67.09-14.12,5.52-15.17,12.83l32.43-.02c-.77-4.48-3.4-8.15-7.24-10.35ZM129.19,74.78h-9.73l-.13-6.07c-3.67,4.24-8.58,6.7-14.17,7.11-4.34.32-8.69-.18-12.63-1.96-7.45-3.36-12.85-9.89-14.88-17.53-1.56-5.86-1.5-12.02.21-17.81,1.47-4.98,4.25-9.38,8.25-12.88,4.99-4.36,11.08-6.27,17.78-6.01,6.11.23,11.64,2.47,15.47,7.24l.03-6.46,11.21.02v54.35h-1.4ZM115.49,61.31c2.26-2.18,3.85-4.7,4.72-7.67,1.81-6.2.67-12.65-3.33-17.71-2.78-3.52-6.81-5.6-11.36-5.99-11.37-.96-19.09,7.9-18.82,18.56.27,10.39,8.34,18.42,19.22,17.24,3.7-.4,6.93-1.87,9.57-4.42h0ZM160.38,29.59c-5.76.84-10,5.14-11.11,10.58-.46,2.26-.5,4.39-.49,6.78l.04,27.82h-10.68l-.05-54.35h10.66s.05,6.46.05,6.46c5.12-6.32,11.41-7.79,19.47-7.07,8.1.72,14.91,5.87,17.71,13.24,1.08,2.83,1.59,5.79,1.6,8.98l.1,32.76h-10.76v-29.8c0-2.36-.23-4.45-.94-6.61-2.16-6.58-8.48-9.83-15.6-8.78h0ZM206.07,20.4h-10.78v54.37h10.86s-.07-54.37-.07-54.37ZM254.15,29.59c-5.76.84-10,5.14-11.11,10.58-.46,2.26-.5,4.39-.49,6.78l.04,27.82h-10.68l-.05-54.35h10.66s.05,6.46.05,6.46c5.12-6.32,11.41-7.79,19.47-7.07,8.1.72,14.91,5.87,17.71,13.24,1.08,2.83,1.59,5.79,1.6,8.98l.1,32.76h-10.76v-29.8c0-2.36-.23-4.45-.94-6.61-2.16-6.58-8.48-9.83-15.6-8.78h0ZM224.9,20.4h-10.78v54.37h10.86s-.07-54.37-.07-54.37ZM59.63,74.76 L59.61,.06 L70.15,0 L70.16,74.77 L59.63,74.76ZM195.25,9.03a5.47,5.47 0 1,0 10.94,0a5.47,5.47 0 1,0 -10.94,0ZM214.08,9.03a5.47,5.47 0 1,0 10.94,0a5.47,5.47 0 1,0 -10.94,0Z';   // logotipo-elaniin-blue.svg (viewBox 281.45 × 75.91): solo sobre la losa de software

// colores de los tokens Elaniin (isometric.md §1): cada entidad tiene el suyo
const FACES = {
  software: { top: '#e7eeff', left: '#d7e2f8', right: '#b9cefb' },
  ai: { top: '#022b63', left: '#01172e', right: '#010f20' },
  cloud: { top: '#f0f0f3', left: '#e4e4ea', right: '#d3d4dc' },
  plate: { top: '#ffffff', left: '#e7eeff', right: '#d7e2f8' },
  wire: { top: '#ffffff', left: '#ffffff', right: '#ffffff' },
};
const NAVY = '#01172e', ELEVATE = '#1054ff';
const LIFT = 36, D = 200, SLIDE = 28, DIM = 0.4, PILL_H = 38, PERIOD = 12000;
const T = { trace: 1000, traceDur: 1000, rise: 900, branch: 1000, up: 700, hold: 900, down: 700 };

const layerControls = n => ({ title: `Capa ${n}${n === 1 ? ' (abajo)' : ''}`, items: [
  { type: 'select', key: `l${n}Look`, label: 'Material', options: LOOKS },
  { type: 'text', key: `l${n}Label`, label: 'Etiqueta', max: 16 },
  { type: 'select', key: `l${n}Icon`, label: 'Icono', options: ICON_NAMES },
] });

export const DEFAULTS = {
  layers: 3, logo: 'on', background: '#ffffff', grid: 'dots', zoom: 1, speed: 1,
  l1Look: 'cloud', l1Label: 'Cloud', l1Icon: 'cloud',
  l2Look: 'software', l2Label: 'Software', l2Icon: 'code',
  l3Look: 'ai', l3Label: 'AI delivery', l3Icon: 'sparkles',
  l4Look: 'wire', l4Label: 'Por construir', l4Icon: 'box',
};
export const controls = [
  { title: 'Escena', hint: 'Solo se dibujan las primeras capas, según el número elegido.', items: [
    { type: 'range', key: 'layers', label: 'Capas', min: 1, max: 4, step: 1, digits: 0 },
    { type: 'seg', key: 'logo', label: 'Logotipo en la losa Software', options: { on: 'Sí', off: 'No' } },
    { type: 'seg', key: 'grid', label: 'Trama de fondo', options: { dots: 'Puntos', none: 'Ninguna' } },
    { type: 'color', key: 'background', label: 'Fondo' },
    { type: 'range', key: 'zoom', label: 'Zoom', min: 0.5, max: 1.6, step: 0.01 },
    { type: 'range', key: 'speed', label: 'Velocidad', min: 0.25, max: 3, step: 0.05, digits: 2, unit: '×' },
  ] },
  layerControls(1), layerControls(2), layerControls(3), layerControls(4),
];
export const normalize = makeNormalize(DEFAULTS, controls);
export const loopSeconds = c => 12 / normalize(c).speed;
export function embedConfig(c) { const n = normalize(c), o = {}; for (const k of Object.keys(DEFAULTS)) o[k] = n[k]; return o; }
export const describe = c => { const n = normalize(c); return Array.from({ length: n.layers }, (_, i) => n[`l${i + 1}Label`]).join(' · '); };

// ---------- geometría (generaliza la escena del hero a 1–4 losas) ----------
const project = (p, o) => ({ x: o.x + (p.x - p.y) * COS30, y: o.y + (p.x + p.y) / 2 - p.z });
const clamp01 = v => Math.min(1, Math.max(0, v));
const ease = v => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
function pointAt(line, k) {
  const L = []; let tot = 0;
  for (let i = 1; i < line.length; i++) { const l = Math.hypot(line[i].x - line[i - 1].x, line[i].y - line[i - 1].y); L.push(l); tot += l; }
  let left = clamp01(k) * tot;
  for (let i = 0; i < L.length; i++) {
    if (left <= L[i] || i === L.length - 1) { const f = L[i] ? left / L[i] : 0; return { x: line[i].x + (line[i + 1].x - line[i].x) * f, y: line[i].y + (line[i + 1].y - line[i].y) * f }; }
    left -= L[i];
  }
  return line[0];
}
function scene(c) {
  const n = c.layers, st = [];
  let z = 12;
  for (let i = 0; i < n; i++) {
    const look = c[`l${i + 1}Look`], w = 90 + 70 * (n - 1 - i), h = look === 'software' ? 80 : 40;
    st.push({ look, label: c[`l${i + 1}Label`], icon: c[`l${i + 1}Icon`], box: { x: 0, y: 0, z, w, d: D, h }, tile: { x: w > 120 ? w - 35 : w / 2, y: 100 } });
    z += h + 20;
  }
  const PLATE = { x: -90, y: -30, z: 0, w: st[0].box.w + 120, d: 260, h: 12 };
  const top = st.at(-1).box;
  const RISER = { x: -68, y: 192, z: 12, w: 16, d: 16, h: top.z + top.h / 2 + 20 - 12 };
  const RX = RISER.x + RISER.w, RY = RISER.y + RISER.d / 2;
  let r = T.trace + T.traceDur;
  const times = st.map(() => { const row = { R: r, B: r + T.rise, A: r + T.rise + T.branch }; r = row.B; return row; });
  const trace3 = [{ x: PLATE.x + PLATE.w, y: PLATE.y + PLATE.d - 12, z: PLATE.h }, { x: RX, y: PLATE.y + PLATE.d - 12, z: PLATE.h }, { x: RX, y: RY, z: PLATE.h }];
  // caja de encuadre en coordenadas de pantalla (origen 0,0)
  const pts = [];
  for (const [x, y] of [[0, 0], [1, 0], [1, 1], [0, 1]]) pts.push(project({ x: PLATE.x + x * PLATE.w, y: PLATE.y + y * PLATE.d, z: -LIFT }, { x: 0, y: 0 }));
  pts.push(project({ x: RISER.x, y: RISER.y, z: RISER.z + RISER.h }, { x: 0, y: 0 }));
  for (const s of st) pts.push(project({ x: s.box.x + s.box.w + SLIDE, y: 0, z: s.box.z + s.box.h + 30 }, { x: 0, y: 0 }));
  const bb = { x0: Math.min(...pts.map(p => p.x)), x1: Math.max(...pts.map(p => p.x)), y0: Math.min(...pts.map(p => p.y)) - 10, y1: Math.max(...pts.map(p => p.y)) };
  return { st, PLATE, RISER, RX, RY, times, trace3, bb };
}

function envelope(t, a) {
  const s = t - a;
  if (s <= 0) return 0;
  if (s < T.up) return ease(s / T.up);
  if (s < T.up + T.hold) return 1;
  if (s < T.up + T.hold + T.down) return 1 - ease((s - T.up - T.hold) / T.down);
  return 0;
}

// ---------- dibujo ----------
const poly = (ctx, list, o) => { ctx.beginPath(); list.forEach((p, i) => { const q = project(p, o); i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }); ctx.closePath(); };
const topFace = b => [{ x: b.x, y: b.y, z: b.z + b.h }, { x: b.x + b.w, y: b.y, z: b.z + b.h }, { x: b.x + b.w, y: b.y + b.d, z: b.z + b.h }, { x: b.x, y: b.y + b.d, z: b.z + b.h }];
const plane = (ctx, o, z) => ctx.transform(COS30, 0.5, -COS30, 0.5, o.x, o.y - z);
const PATHS = {};
const path = d => (PATHS[d] ??= new Path2D(d));

function slab(ctx, look, b, o) {
  const dark = look === 'ai', wire = look === 'wire', f = FACES[look];
  const left = [{ x: b.x, y: b.y + b.d, z: b.z }, { x: b.x + b.w, y: b.y + b.d, z: b.z }, { x: b.x + b.w, y: b.y + b.d, z: b.z + b.h }, { x: b.x, y: b.y + b.d, z: b.z + b.h }];
  const right = [{ x: b.x + b.w, y: b.y, z: b.z }, { x: b.x + b.w, y: b.y + b.d, z: b.z }, { x: b.x + b.w, y: b.y + b.d, z: b.z + b.h }, { x: b.x + b.w, y: b.y, z: b.z + b.h }];
  ctx.save();
  ctx.lineWidth = 1; ctx.lineJoin = 'round';
  ctx.strokeStyle = dark ? 'rgba(255,255,255,.24)' : wire ? 'rgba(1,23,46,.55)' : 'rgba(1,23,46,.9)';
  if (wire) ctx.setLineDash([4, 4]);
  for (const [face, fill] of [[left, f.left], [right, f.right], [topFace(b), f.top]]) {
    poly(ctx, face, o);
    ctx.globalAlpha = wire ? 0.35 : dark ? 0.82 : 0.78; ctx.fillStyle = fill; ctx.fill();
    ctx.globalAlpha = 1; ctx.stroke();
  }
  ctx.restore();
  if (look === 'plate' || wire) return;
  ctx.save(); plane(ctx, o, b.z + b.h);   // textura fina en la cara superior
  if (look === 'software') {
    ctx.fillStyle = 'rgba(77,117,253,.6)';
    for (let i = 12; i <= b.w - 12; i += 12) for (let j = 12; j <= b.d - 12; j += 12) ctx.fillRect(b.x + i - 1.5, b.y + j - 1.5, 3, 3);
  } else {
    ctx.lineWidth = 1; ctx.strokeStyle = dark ? 'rgba(255,255,255,.14)' : 'rgba(140,143,155,.5)';
    ctx.beginPath();
    if (dark) for (let i = 12; i < b.w; i += 12) { ctx.moveTo(b.x + i, b.y); ctx.lineTo(b.x + i, b.y + b.d); }
    for (let j = dark ? 12 : 10; j < b.d; j += dark ? 12 : 10) { ctx.moveTo(b.x, b.y + j); ctx.lineTo(b.x + b.w, b.y + j); }
    ctx.stroke();
  }
  ctx.restore();
}

function pill(ctx, s, o, floatY) {
  const b = s.box, len = 56 + s.label.length * 9;
  const at = () => { plane(ctx, o, b.z + b.h); ctx.transform(0, -1, 1, 0, s.tile.x - PILL_H / 2, s.tile.y + len / 2); };
  const rr = () => { ctx.beginPath(); ctx.roundRect(0, 0, len, PILL_H, 8); };
  ctx.save(); at(); rr(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#6a9aff'; ctx.fill(); ctx.restore();   // sombra de la pastilla
  ctx.save(); ctx.translate(0, floatY); at(); rr();
  ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(1,23,46,.9)'; ctx.stroke();
  ctx.save(); ctx.translate(12, (PILL_H - 20) / 2); ctx.scale(20 / 24, 20 / 24);
  ctx.strokeStyle = ELEVATE; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const d of ICONS[s.icon] || []) ctx.stroke(path(d));
  ctx.restore();
  ctx.fillStyle = '#141414'; ctx.font = '500 15px "Instrument Sans", "DM Sans", system-ui, sans-serif'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(s.label, 42, PILL_H / 2 + 5);
  ctx.restore();
}

function logo(ctx, b, o) {
  const width = 88, height = width * (75.91 / 281.45), u = (b.d - width) / 2;
  const zTop = b.z + b.h - (b.h - height) / 2;
  ctx.save();
  ctx.transform(COS30, -0.5, 0, 1, o.x + (b.w - b.d) * COS30, o.y + (b.w + b.d) / 2 - zTop);
  ctx.translate(u, 0); ctx.scale(width / 281.45, width / 281.45);
  ctx.fillStyle = ELEVATE; ctx.fill(path(LOGO));
  ctx.restore();
}

function pulse(ctx, p, a) {
  ctx.save(); ctx.globalAlpha = a;
  const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 14);
  g.addColorStop(0, 'rgba(77,117,253,.55)'); g.addColorStop(1, 'rgba(77,117,253,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, 14, 0, 7); ctx.fill();
  ctx.fillStyle = ELEVATE; ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, 7); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, 7); ctx.fill();
  ctx.restore();
}

function draw(ctx, canvas, c, S, ms, W, H, dpr) {
  const t = ms % PERIOD;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = c.background; ctx.fillRect(0, 0, W, H);
  if (c.grid === 'dots') {   // grilla de puntos del hero (#D3D4DC, 2px cada 16px)
    ctx.fillStyle = '#d3d4dc';
    for (let x = 8; x < W; x += 16) for (let y = 8; y < H; y += 16) ctx.fillRect(x - 1, y - 1, 2, 2);
  }
  const { st, PLATE, RISER, RX, RY, times, trace3, bb } = S;
  const bw = bb.x1 - bb.x0, bh = bb.y1 - bb.y0;
  const k = Math.min(W / bw, H / bh) * 0.86 * c.zoom;
  const o = { x: W / 2 / k - (bb.x0 + bw / 2), y: H / 2 / k - (bb.y0 + bh / 2) };
  ctx.scale(k, k);

  // sombra en el suelo: no levita
  ctx.fillStyle = '#f0f0f3';
  poly(ctx, [{ x: PLATE.x + 10, y: PLATE.y + 10, z: -LIFT }, { x: PLATE.x + PLATE.w - 10, y: PLATE.y + 10, z: -LIFT }, { x: PLATE.x + PLATE.w - 10, y: PLATE.y + PLATE.d - 10, z: -LIFT }, { x: PLATE.x + 10, y: PLATE.y + PLATE.d - 10, z: -LIFT }], o);
  ctx.fill();

  // levitación 6px / ciclo 6s (2 ciclos por loop de 12s)
  const lev = -6 * (0.5 - 0.5 * Math.cos((2 * Math.PI * t) / 6000));
  ctx.translate(0, lev);

  const envs = times.map(r => envelope(t, r.A)), emph = Math.max(...envs);
  slab(ctx, 'plate', PLATE, o); slab(ctx, 'plate', RISER, o);
  const tr = trace3.map(p => project(p, o));
  ctx.beginPath(); tr.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.strokeStyle = 'rgba(1,23,46,.4)'; ctx.lineWidth = 1; ctx.stroke();

  // brazos: del riser a la esquina de cada losa; se telescopan con el deslizamiento
  st.forEach((s, i) => {
    const level = s.box.z + s.box.h / 2, row = times[i];
    const from = project({ x: RX, y: RY, z: level }, o), to = project({ x: SLIDE * envs[i], y: RY, z: level }, o);
    const travelling = t >= row.B && t < row.A, prog = ease(clamp01((t - row.B) / T.branch));
    const head = project({ x: RX + (SLIDE * envs[i] - RX) * prog, y: RY, z: level }, o);
    const trail = travelling ? 1 : t >= row.A ? clamp01(1 - (t - row.A) / 700) : 0;
    ctx.strokeStyle = 'rgba(1,23,46,.5)'; ctx.lineWidth = 1;
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
    let z = PLATE.h, z0 = z;
    times.forEach((row, i) => {
      const level = st[i].box.z + st[i].box.h / 2;
      if (t >= row.R && t < row.B) z = z0 + (level - z0) * ease((t - row.R) / T.rise); else if (t >= row.B) z = level;
      z0 = level;
    });
    pulse(ctx, project({ x: RX, y: RY, z }, o), t < last.B ? 1 : clamp01(1 - (t - last.B) / 200));
  }
  times.forEach((row, i) => {
    if (t >= row.B && t < row.A) pulse(ctx, project({ x: RX * (1 - ease((t - row.B) / T.branch)), y: RY, z: st[i].box.z + st[i].box.h / 2 }, o), 1);
  });

  // losas de abajo hacia arriba: frost (blur 14px recortado a la silueta) + losa + logo + etiqueta + borde encendido
  const canFilter = 'filter' in ctx;
  st.forEach((s, i) => {
    const b = s.box, off = SLIDE * envs[i], op = 1 - DIM * emph * (1 - envs[i]);
    const dx = off * COS30, dy = off * 0.5;
    ctx.save(); ctx.translate(dx, dy); ctx.globalAlpha = op;
    if (canFilter && s.look !== 'wire') {
      ctx.save();
      poly(ctx, [{ x: b.x, y: b.y, z: b.z + b.h }, { x: b.x + b.w, y: b.y, z: b.z + b.h }, { x: b.x + b.w, y: b.y, z: b.z }, { x: b.x + b.w, y: b.y + b.d, z: b.z }, { x: b.x, y: b.y + b.d, z: b.z }, { x: b.x, y: b.y + b.d, z: b.z + b.h }], o);
      ctx.clip();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.filter = `blur(${14 * k * dpr}px)`;
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
    }
    slab(ctx, s.look, b, o);
    if (s.look === 'software' && c.logo === 'on' && i === st.findIndex(x => x.look === 'software')) logo(ctx, b, o);   // un solo logotipo por recurso
    const fl = -4 * (0.5 - 0.5 * Math.cos((2 * Math.PI * (t - i * 400)) / 4000));
    pill(ctx, s, o, fl);
    if (envs[i] > 0) {
      ctx.globalAlpha = envs[i] * op; ctx.strokeStyle = s.look === 'ai' ? '#7b9bff' : ELEVATE; ctx.lineWidth = 2; ctx.lineJoin = 'round';
      poly(ctx, topFace(b), o); ctx.stroke();
    }
    ctx.restore();
  });
}

// ---------- montaje (Canvas2D; mismo contrato que los generadores WebGL) ----------
export async function mount(host, config, opts = {}) {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'display:block;width:100%;height:100%';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const dpr = opts.dpr ?? Math.min(devicePixelRatio, 2);
  try { await document.fonts?.load('500 15px "Instrument Sans"'); } catch { /* sin la fuente, cae a system-ui */ }

  let cfg, S, W = 1, H = 1;
  const resize = (w, h) => { W = Math.max(1, Math.round(w)); H = Math.max(1, Math.round(h)); canvas.width = W * dpr; canvas.height = H * dpr; };
  const renderAt = t => {
    const L = loopSeconds(cfg), u = (((t % L) + L) % L) / L;
    draw(ctx, canvas, cfg, S, u * PERIOD, W, H, dpr);
  };
  function set(c) { cfg = normalize(c); S = scene(cfg); if (!running) renderAt(time); }

  let time = 0, running = false, last = 0, raf = 0;
  const tick = now => { time += Math.min(0.05, (now - (last || now)) / 1000); last = now; renderAt(time); raf = requestAnimationFrame(tick); };
  const play = () => { if (running) return; running = true; last = 0; raf = requestAnimationFrame(tick); };
  const pause = () => { running = false; cancelAnimationFrame(raf); };

  let ro;
  if (opts.size) resize(...opts.size);
  else {
    const r = host.getBoundingClientRect();
    resize(r.width || 300, r.height || 150);
    ro = new ResizeObserver(([e]) => { resize(e.contentRect.width, e.contentRect.height); if (!running) renderAt(time); });
    ro.observe(host);
  }
  set(config);
  if (opts.autoplay !== false) play();
  return {
    canvas, set, play, pause, renderAt, resize,
    get playing() { return running; },
    get time() { return time; },
    set time(t) { time = t; if (!running) renderAt(t); },
    get config() { return cfg; },
    destroy() { pause(); ro?.disconnect(); canvas.remove(); },
  };
}
