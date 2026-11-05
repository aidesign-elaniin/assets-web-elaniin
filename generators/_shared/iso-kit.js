// Kit isométrico Elaniin en Canvas2D: proyección 30°, losas de vidrio, frost 14px, pastillas, pulsos,
// encuadre automático, levitación 6px con sombra fija y reloj de 12 s.
// Fuente: elaniin-style (references/isometric.md, templates/iso-stack.js) y las escenas de elaniin.com (canary).
// Lo usan todos los generadores iso/ e iso-*/. Canvas2D => exportan PNG/MP4 como el resto.
import { makeNormalize } from './schema.js';   // sin Three.js: los isométricos son Canvas2D

export const COS30 = Math.cos(Math.PI / 6);
export const ELEVATE = '#1054ff', NAVY = '#01172e', GREEN = '#1f9d61';
export const LIFT = 36, PILL_H = 38, PERIOD = 12000;

// Tema: 'light' (hero, routes, solutions) u 'oscuro' (engagement: vidrio ahumado sobre #141414).
// Se fija en cada cuadro antes de dibujar; el dibujo es síncrono, así que varias escenas en la página no chocan.
let THEME = 'light';
export const isDark = () => THEME === 'dark';
export const ink = a => (THEME === 'dark' ? `rgba(255,255,255,${(a * 0.6).toFixed(3)})` : `rgba(1,23,46,${a})`);
// Vidrio ahumado medido en elaniin.com (#engagement): blanco con fill-opacity .07 / .18 / .12, arista blanco 24 %
const SMOKE = { left: 0.07, right: 0.18, top: 0.12 };
const SMOKE_TINT = { brand: '#6a9aff', ai: '#4d75fd' };
const logoColor = () => (THEME === 'dark' ? '#7b9bff' : ELEVATE);

export const LOOKS = { software: 'Software', brand: 'Marca (azul)', ai: 'AI', cloud: 'Cloud', wire: 'Por construir' };
// colores de los tokens Elaniin (isometric.md §1): cada entidad tiene el suyo
export const FACES = {
  software: { top: '#e7eeff', left: '#d7e2f8', right: '#b9cefb' },
  brand: { top: '#d7e2f8', left: '#b9cefb', right: '#6a9aff' },
  ai: { top: '#022b63', left: '#01172e', right: '#010f20' },
  cloud: { top: '#f0f0f3', left: '#e4e4ea', right: '#d3d4dc' },
  plate: { top: '#ffffff', left: '#e7eeff', right: '#d7e2f8' },
  wire: { top: '#ffffff', left: '#ffffff', right: '#ffffff' },
};

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
Object.assign(ICONS, {
  user: ['M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2', 'M8 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0'],
  users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0', 'M22 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
  smartphone: ['M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z', 'M12 18h.01'],
  window: ['M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'M10 4v4', 'M2 8h20', 'M6 4v4'],
  activity: ['M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2'],
  flask: ['M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2', 'M8.5 2h7', 'M7 16h10'],
  review: ['M18 15a3 3 0 1 0 0 6a3 3 0 1 0 0-6', 'M6 3a3 3 0 1 0 0 6a3 3 0 1 0 0-6', 'M13 6h3a2 2 0 0 1 2 2v7', 'M6 9v12'],
  landmark: ['M3 22h18', 'M6 18v-7', 'M10 18v-7', 'M14 18v-7', 'M18 18v-7', 'M12 2l8 5H4z'],
  refresh: ['M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8', 'M21 3v5h-5', 'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16', 'M8 16H3v5'],
});
export { ICONS };
export const ICON_NAMES = {
  cloud: 'Nube', code: 'Código', sparkles: 'IA', database: 'Base de datos', shield: 'Seguridad', layers: 'Capas',
  server: 'Servidor', chart: 'Datos', rocket: 'Lanzamiento', box: 'Módulo', user: 'Persona', users: 'Equipo',
  smartphone: 'Móvil', window: 'Web app', activity: 'Actividad', flask: 'Pruebas', review: 'Revisión', landmark: 'Institución', refresh: 'Respaldo',
};
const LOGO = 'M41.42,59.92c.48-.5.79-.85.79-.85l8.06,5.28s-.25.53-.67,1.13c-5.63,7.9-15.43,11.26-25.28,10.25-11.26-1.15-20.35-9.09-23.18-19.59-1.59-5.91-1.52-12.11.29-17.93,1.36-4.38,3.81-8.15,7.21-11.37,5.09-4.82,11.61-7.14,18.75-7.02,15.03.25,25.49,11.65,25.49,26.29,0,4.22-.07,5.79-.07,5.79H10.41c1.24,8.21,7.61,13.56,16.36,13.82,5.64.16,10.81-1.79,14.64-5.79h0ZM35.95,32.59c-3.09-1.87-6.35-2.5-10.01-2.46-7.67.09-14.12,5.52-15.17,12.83l32.43-.02c-.77-4.48-3.4-8.15-7.24-10.35ZM129.19,74.78h-9.73l-.13-6.07c-3.67,4.24-8.58,6.7-14.17,7.11-4.34.32-8.69-.18-12.63-1.96-7.45-3.36-12.85-9.89-14.88-17.53-1.56-5.86-1.5-12.02.21-17.81,1.47-4.98,4.25-9.38,8.25-12.88,4.99-4.36,11.08-6.27,17.78-6.01,6.11.23,11.64,2.47,15.47,7.24l.03-6.46,11.21.02v54.35h-1.4ZM115.49,61.31c2.26-2.18,3.85-4.7,4.72-7.67,1.81-6.2.67-12.65-3.33-17.71-2.78-3.52-6.81-5.6-11.36-5.99-11.37-.96-19.09,7.9-18.82,18.56.27,10.39,8.34,18.42,19.22,17.24,3.7-.4,6.93-1.87,9.57-4.42h0ZM160.38,29.59c-5.76.84-10,5.14-11.11,10.58-.46,2.26-.5,4.39-.49,6.78l.04,27.82h-10.68l-.05-54.35h10.66s.05,6.46.05,6.46c5.12-6.32,11.41-7.79,19.47-7.07,8.1.72,14.91,5.87,17.71,13.24,1.08,2.83,1.59,5.79,1.6,8.98l.1,32.76h-10.76v-29.8c0-2.36-.23-4.45-.94-6.61-2.16-6.58-8.48-9.83-15.6-8.78h0ZM206.07,20.4h-10.78v54.37h10.86s-.07-54.37-.07-54.37ZM254.15,29.59c-5.76.84-10,5.14-11.11,10.58-.46,2.26-.5,4.39-.49,6.78l.04,27.82h-10.68l-.05-54.35h10.66s.05,6.46.05,6.46c5.12-6.32,11.41-7.79,19.47-7.07,8.1.72,14.91,5.87,17.71,13.24,1.08,2.83,1.59,5.79,1.6,8.98l.1,32.76h-10.76v-29.8c0-2.36-.23-4.45-.94-6.61-2.16-6.58-8.48-9.83-15.6-8.78h0ZM224.9,20.4h-10.78v54.37h10.86s-.07-54.37-.07-54.37ZM59.63,74.76 L59.61,.06 L70.15,0 L70.16,74.77 L59.63,74.76ZM195.25,9.03a5.47,5.47 0 1,0 10.94,0a5.47,5.47 0 1,0 -10.94,0ZM214.08,9.03a5.47,5.47 0 1,0 10.94,0a5.47,5.47 0 1,0 -10.94,0Z';

// ---------- matemática ----------
export const project = (p, o) => ({ x: o.x + (p.x - p.y) * COS30, y: o.y + (p.x + p.y) / 2 - p.z });
export const clamp01 = v => Math.min(1, Math.max(0, v));
export const ease = v => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
export const wave = (t, period, delay = 0) => 0.5 - 0.5 * Math.cos((2 * Math.PI * (t - delay)) / period);   // 0..1..0, periódica
export function pointAt(line, k) {
  const L = []; let tot = 0;
  for (let i = 1; i < line.length; i++) { const l = Math.hypot(line[i].x - line[i - 1].x, line[i].y - line[i - 1].y); L.push(l); tot += l; }
  let left = clamp01(k) * tot;
  for (let i = 0; i < L.length; i++) {
    if (left <= L[i] || i === L.length - 1) { const f = L[i] ? left / L[i] : 0; return { x: line[i].x + (line[i + 1].x - line[i].x) * f, y: line[i].y + (line[i + 1].y - line[i].y) * f }; }
    left -= L[i];
  }
  return line[0];
}
// subida (up) · se mantiene (hold) · baja (down) a partir del instante a
export function envelope(t, a, up = 700, hold = 900, down = 700) {
  const s = t - a;
  if (s <= 0) return 0;
  if (s < up) return ease(s / up);
  if (s < up + hold) return 1;
  if (s < up + hold + down) return 1 - ease((s - up - hold) / down);
  return 0;
}

// ---------- dibujo ----------
export const poly = (ctx, list, o) => { ctx.beginPath(); list.forEach((p, i) => { const q = project(p, o); i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }); ctx.closePath(); };
export const topFace = b => [{ x: b.x, y: b.y, z: b.z + b.h }, { x: b.x + b.w, y: b.y, z: b.z + b.h }, { x: b.x + b.w, y: b.y + b.d, z: b.z + b.h }, { x: b.x, y: b.y + b.d, z: b.z + b.h }];
export const silhouette = b => [{ x: b.x, y: b.y, z: b.z + b.h }, { x: b.x + b.w, y: b.y, z: b.z + b.h }, { x: b.x + b.w, y: b.y, z: b.z }, { x: b.x + b.w, y: b.y + b.d, z: b.z }, { x: b.x, y: b.y + b.d, z: b.z }, { x: b.x, y: b.y + b.d, z: b.z + b.h }];
export const corners = b => [0, 1].flatMap(i => [0, 1].flatMap(j => [0, 1].map(k => ({ x: b.x + i * b.w, y: b.y + j * b.d, z: b.z + k * b.h }))));
export const plane = (ctx, o, z) => ctx.transform(COS30, 0.5, -COS30, 0.5, o.x, o.y - z);
const PATHS = {};
export const path = d => (PATHS[d] ??= new Path2D(d));

export function slab(ctx, look, b, o) {
  if (THEME === 'dark') return smokeSlab(ctx, look, b, o);
  const dark = look === 'ai', wire = look === 'wire', f = FACES[look] || FACES.software;
  const left = [{ x: b.x, y: b.y + b.d, z: b.z }, { x: b.x + b.w, y: b.y + b.d, z: b.z }, { x: b.x + b.w, y: b.y + b.d, z: b.z + b.h }, { x: b.x, y: b.y + b.d, z: b.z + b.h }];
  const right = [{ x: b.x + b.w, y: b.y, z: b.z }, { x: b.x + b.w, y: b.y + b.d, z: b.z }, { x: b.x + b.w, y: b.y + b.d, z: b.z + b.h }, { x: b.x + b.w, y: b.y, z: b.z + b.h }];
  const a0 = ctx.globalAlpha;
  ctx.save();
  ctx.lineWidth = 1; ctx.lineJoin = 'round';
  ctx.strokeStyle = dark ? 'rgba(255,255,255,.24)' : wire ? 'rgba(1,23,46,.55)' : 'rgba(1,23,46,.9)';
  if (wire) ctx.setLineDash([4, 4]);
  for (const [face, fill] of [[left, f.left], [right, f.right], [topFace(b), f.top]]) {
    poly(ctx, face, o);
    ctx.globalAlpha = a0 * (wire ? 0.35 : dark ? 0.82 : 0.78); ctx.fillStyle = fill; ctx.fill();
    ctx.globalAlpha = a0; ctx.stroke();
  }
  ctx.restore();
  if (look === 'plate' || wire || b.h < 1) return;
  ctx.save(); plane(ctx, o, b.z + b.h);   // textura fina en la cara superior
  if (look === 'software' || look === 'brand') {
    ctx.fillStyle = look === 'brand' ? 'rgba(16,84,255,.45)' : 'rgba(77,117,253,.6)';
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

function smokeSlab(ctx, look, b, o) {
  const wire = look === 'wire', tint = SMOKE_TINT[look] || '#ffffff', k = look === 'ai' || look === 'brand' ? 1.5 : 1;
  const left = [{ x: b.x, y: b.y + b.d, z: b.z }, { x: b.x + b.w, y: b.y + b.d, z: b.z }, { x: b.x + b.w, y: b.y + b.d, z: b.z + b.h }, { x: b.x, y: b.y + b.d, z: b.z + b.h }];
  const right = [{ x: b.x + b.w, y: b.y, z: b.z }, { x: b.x + b.w, y: b.y + b.d, z: b.z }, { x: b.x + b.w, y: b.y + b.d, z: b.z + b.h }, { x: b.x + b.w, y: b.y, z: b.z + b.h }];
  const a0 = ctx.globalAlpha;
  ctx.save(); ctx.lineWidth = 1; ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(255,255,255,.24)';
  if (wire) ctx.setLineDash([4, 4]);
  for (const [face, op] of [[left, SMOKE.left], [right, SMOKE.right], [topFace(b), SMOKE.top]]) {
    poly(ctx, face, o);
    if (!wire) { ctx.globalAlpha = a0 * Math.min(1, op * k); ctx.fillStyle = tint; ctx.fill(); }
    ctx.globalAlpha = a0; ctx.stroke();
  }
  ctx.restore();
}

export function lit(ctx, b, o, a, look) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = look === 'ai' ? '#7b9bff' : ELEVATE; ctx.lineWidth = 2; ctx.lineJoin = 'round';
  poly(ctx, topFace(b), o); ctx.stroke(); ctx.restore();
}

function icon(ctx, name, x, y, size, color = ELEVATE) {
  ctx.save(); ctx.translate(x, y); ctx.scale(size / 24, size / 24);
  ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const d of ICONS[name] || []) ctx.stroke(path(d));
  ctx.restore();
}
function checkBadge(ctx, cx, cy, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(cx, cy, 9, 0, 7); ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(cx - 4, cy); ctx.lineTo(cx - 1, cy + 3); ctx.lineTo(cx + 4.5, cy - 3.5); ctx.stroke();
  ctx.restore();
}

// Pastilla: tendida sobre la cara superior de s.box, centrada en s.tile, leyendo hacia arriba a la derecha.
// s.scale ≤ 1 la achica para franjas angostas; s.check (0..1) muestra el badge verde.
export function pill(ctx, s, o, floatY = 0) {
  const b = s.box, extra = s.check != null ? 24 : 0, len = 56 + s.label.length * 9 + extra;
  const k = Math.min(s.scale ?? 1, ((s.room ?? b.d) - 12) / len);
  const at = () => { plane(ctx, o, b.z + b.h); ctx.transform(0, -1, 1, 0, s.tile.x - (PILL_H * k) / 2, s.tile.y + (len * k) / 2); ctx.scale(k, k); };
  const rr = () => { ctx.beginPath(); ctx.roundRect(0, 0, len, PILL_H, 8); };
  ctx.save(); at(); rr(); ctx.globalAlpha *= 0.35; ctx.fillStyle = '#6a9aff'; ctx.fill(); ctx.restore();   // sombra de la pastilla
  ctx.save(); ctx.translate(0, floatY); at(); rr();
  ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.lineWidth = s.active ? 2 : 1; ctx.strokeStyle = s.active ? ELEVATE : 'rgba(1,23,46,.9)'; ctx.stroke();
  icon(ctx, s.icon, 12, (PILL_H - 20) / 2, 20);
  ctx.fillStyle = '#141414'; ctx.font = '500 15px "Instrument Sans", "DM Sans", system-ui, sans-serif'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(s.label, 42, PILL_H / 2 + 5);
  if (extra) checkBadge(ctx, len - 18, PILL_H / 2, s.check);
  ctx.restore();
}

// Ficha redonda tendida en un plano (personas, nodos externos).
export function chip(ctx, x, y, z, o, name, { r = 13, a = 1, active = 0 } = {}) {
  ctx.save(); ctx.globalAlpha *= a; plane(ctx, o, z);
  ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = '#fff'; ctx.fill();
  ctx.lineWidth = 1 + active; ctx.strokeStyle = active ? ELEVATE : 'rgba(1,23,46,.7)'; ctx.stroke();   // la ficha es blanca en ambos temas
  ctx.transform(0, -1, 1, 0, x, y);
  icon(ctx, name, -r * 0.55, -r * 0.55, r * 1.1);
  ctx.restore();
}

// Logotipo azul: sobre la cara derecha (como el hero) o tendido sobre la cara superior.
export function logoRight(ctx, b, o) {
  const width = Math.min(88, (b.h - 6) * (281.45 / 75.91)), height = width * (75.91 / 281.45), u = (b.d - width) / 2;
  if (width < 20) return;
  const zTop = b.z + b.h - (b.h - height) / 2;
  ctx.save();
  ctx.transform(COS30, -0.5, 0, 1, o.x + (b.w - b.d) * COS30, o.y + (b.w + b.d) / 2 - zTop);
  ctx.translate(u, 0); ctx.scale(width / 281.45, width / 281.45);
  ctx.fillStyle = logoColor(); ctx.fill(path(LOGO));
  ctx.restore();
}
export function logoTop(ctx, b, o, width = 96) {
  const height = width * (75.91 / 281.45);
  ctx.save(); plane(ctx, o, b.z + b.h);
  ctx.transform(0, -1, 1, 0, b.x + b.w / 2 - height / 2, b.y + b.d / 2 + width / 2);
  ctx.scale(width / 281.45, width / 281.45);
  ctx.fillStyle = logoColor(); ctx.fill(path(LOGO));
  ctx.restore();
}

export function pulse(ctx, p, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 14);
  g.addColorStop(0, 'rgba(77,117,253,.55)'); g.addColorStop(1, 'rgba(77,117,253,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, 14, 0, 7); ctx.fill();
  ctx.fillStyle = ELEVATE; ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, 7); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, 7); ctx.fill();
  ctx.restore();
}

// Línea en el mundo (puntos 3D). dash: [4,4] para conexiones punteadas.
export function line(ctx, pts, o, { color = ink(0.4), width = 1, dash = null } = {}) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath();
  pts.forEach((p, i) => { const q = project(p, o); i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); });
  ctx.stroke(); ctx.restore();
}

// Frost: blur de 14 u recortado a la silueta, aplicado solo a su rectángulo (barato aunque haya muchas losas).
export function frost(ctx, env, b) {
  const { canvas, o, k, dpr } = env;
  if (!('filter' in ctx)) return;
  const sil = silhouette(b);
  ctx.save();
  poly(ctx, sil, o); ctx.clip();
  const m = ctx.getTransform(), q = sil.map(p => { const v = project(p, o); return m.transformPoint(new DOMPoint(v.x, v.y)); });
  const blur = 14 * k * dpr, pad = blur * 2;
  const x0 = Math.max(0, Math.floor(Math.min(...q.map(p => p.x)) - pad)), y0 = Math.max(0, Math.floor(Math.min(...q.map(p => p.y)) - pad));
  const x1 = Math.min(canvas.width, Math.ceil(Math.max(...q.map(p => p.x)) + pad)), y1 = Math.min(canvas.height, Math.ceil(Math.max(...q.map(p => p.y)) + pad));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.filter = `blur(${blur}px)`;
  if (x1 > x0 && y1 > y0) ctx.drawImage(canvas, x0, y0, x1 - x0, y1 - y0, x0, y0, x1 - x0, y1 - y0);
  ctx.restore();
}

// Losa completa: frost + vidrio + borde encendido (a = opacidad, glow = 0..1).
export function glassSlab(ctx, env, look, b, { a = 1, glow = 0 } = {}) {
  ctx.save(); ctx.globalAlpha *= a;
  if (look !== 'wire') frost(ctx, env, b);
  slab(ctx, look, b, env.o);
  lit(ctx, b, env.o, glow, look);
  ctx.restore();
}

// ---------- controles comunes ----------
export const SCENE_DEFAULTS = { theme: 'light', background: '#ffffff', grid: 'dots', zoom: 1, speed: 1 };
export const sceneSection = (extra = []) => ({ title: 'Escena', items: [
  { type: 'seg', key: 'theme', label: 'Tema', options: { light: 'Claro', dark: 'Oscuro' } },
  ...extra,
  { type: 'seg', key: 'grid', label: 'Trama de fondo', options: { dots: 'Puntos', none: 'Ninguna' } },
  { type: 'color', key: 'background', label: 'Fondo' },
  { type: 'range', key: 'zoom', label: 'Zoom', min: 0.5, max: 1.6, step: 0.01 },
  { type: 'range', key: 'speed', label: 'Velocidad', min: 0.25, max: 3, step: 0.05, digits: 2, unit: '×' },
] });
export const iconSelect = (key, label = 'Icono') => ({ type: 'select', key, label, options: ICON_NAMES });
export const textField = (key, label = 'Etiqueta', max = 16) => ({ type: 'text', key, label, max });

// ---------- generador isométrico ----------
// build(cfg) -> S con S.plate (caja de la base) y S.bounds (puntos 3D para encuadrar).
// draw(ctx, env) dibuja la escena; env = { cfg, S, t (ms 0..12000), o, k, canvas, dpr }.
export function defineIso({ DEFAULTS, controls, describe, build, draw, migrate }) {
  const base = makeNormalize(DEFAULTS, controls);
  const normalize = c => base(migrate ? migrate(c || {}) : c);
  const loopSeconds = c => 12 / normalize(c).speed;
  const embedConfig = c => { const n = normalize(c), out = {}; for (const key of Object.keys(DEFAULTS)) out[key] = n[key]; return out; };

  function frame(ctx, canvas, cfg, S, ms, W, H, dpr) {
    const t = ms % PERIOD;
    THEME = cfg.theme === 'dark' ? 'dark' : 'light';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1; ctx.filter = 'none';
    const hex = cfg.background.replace('#', ''), lum = (parseInt(hex.slice(0, 2), 16) * 0.299 + parseInt(hex.slice(2, 4), 16) * 0.587 + parseInt(hex.slice(4, 6), 16) * 0.114) / 255;
    ctx.fillStyle = THEME === 'dark' && lum > 0.5 ? '#141414' : cfg.background;   // oscuro con fondo claro => #141414 del sitio
    ctx.fillRect(0, 0, W, H);
    if (THEME === 'dark') {   // glow navy radial abajo a la derecha (#engagement)
      const g = ctx.createRadialGradient(W * 0.8, H * 1.05, 0, W * 0.8, H * 1.05, Math.max(W, H) * 0.75);
      g.addColorStop(0, 'rgba(2,60,160,.45)'); g.addColorStop(0.5, 'rgba(2,43,99,.22)'); g.addColorStop(1, 'rgba(2,43,99,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    if (cfg.grid === 'dots') {   // grilla de puntos del hero (#D3D4DC, 2px cada 16px); en oscuro, blanco 6 %
      ctx.fillStyle = THEME === 'dark' ? 'rgba(255,255,255,.06)' : '#d3d4dc';
      for (let x = 8; x < W; x += 16) for (let y = 8; y < H; y += 16) ctx.fillRect(x - 1, y - 1, 2, 2);
    }
    const pts = S.bounds.map(p => project(p, { x: 0, y: 0 }));
    const x0 = Math.min(...pts.map(p => p.x)), x1 = Math.max(...pts.map(p => p.x)), y0 = Math.min(...pts.map(p => p.y)), y1 = Math.max(...pts.map(p => p.y));
    const k = Math.min(W / (x1 - x0), H / (y1 - y0)) * 0.86 * cfg.zoom;
    const o = { x: W / 2 / k - (x0 + x1) / 2, y: H / 2 / k - (y0 + y1) / 2 };
    ctx.scale(k, k);
    // sombra en el suelo: no levita
    const P = S.plate;
    ctx.fillStyle = THEME === 'dark' ? 'rgba(255,255,255,.03)' : '#f0f0f3';
    poly(ctx, [{ x: P.x + 10, y: P.y + 10, z: -LIFT }, { x: P.x + P.w - 10, y: P.y + 10, z: -LIFT }, { x: P.x + P.w - 10, y: P.y + P.d - 10, z: -LIFT }, { x: P.x + 10, y: P.y + P.d - 10, z: -LIFT }], o);
    ctx.fill();
    ctx.translate(0, -6 * wave(t, 6000));   // levitación 6px, 2 ciclos por loop
    draw(ctx, { cfg, S, t, o, k, canvas, dpr });
  }

  async function mount(host, config, opts = {}) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;height:100%';
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const dpr = opts.dpr ?? Math.min(devicePixelRatio, 2);
    try { await document.fonts?.load('500 15px "Instrument Sans"'); } catch { /* sin la fuente, cae a system-ui */ }

    let cfg, S, W = 1, H = 1;
    const resize = (w, h) => { W = Math.max(1, Math.round(w)); H = Math.max(1, Math.round(h)); canvas.width = W * dpr; canvas.height = H * dpr; };
    const renderAt = t => { const L = loopSeconds(cfg), u = (((t % L) + L) % L) / L; frame(ctx, canvas, cfg, S, u * PERIOD, W, H, dpr); };
    function set(c) { cfg = normalize(c); S = build(cfg); if (!running) renderAt(time); }

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

  return { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe: c => describe(normalize(c)), mount };
}
