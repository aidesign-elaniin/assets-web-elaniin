// Generador "Glass Grid": cuadrícula fija de vidrio esmerilado sobre formas y gradientes en movimiento.
// La geometría del cubo sale de Blender (make_tile.py -> tiles.json).
// Contrato de generador: ver README.md en la raíz.

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.min.js';

export const SHAPES = {
  circle: 'Círculo', square: 'Cuadrado', triangle: 'Triángulo', ring: 'Anillo',
  diamond: 'Rombo', cross: 'Cruz', blob: 'Orgánico',
};
const SHAPE_IDS = Object.keys(SHAPES);
const SHAPE_ICONS = {
  circle: '<circle cx="12" cy="12" r="7"/>',
  square: '<rect x="5" y="5" width="14" height="14" rx="2"/>',
  triangle: '<path d="M12 5l7.5 13h-15z"/>',
  ring: '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="3.5"/>',
  diamond: '<path d="M12 3.5l8.5 8.5-8.5 8.5L3.5 12z"/>',
  cross: '<path d="M9.5 4h5v5.5H20v5h-5.5V20h-5v-5.5H4v-5h5.5z"/>',
  blob: '<path d="M12 4.5c3 0 7 1.5 7 6s-2.5 9-7 9-7.5-3-7-7.5 4-7.5 7-7.5z"/>',
};
export const PROFILES = { suave: 'Suave', redondo: 'Redondo', pildora: 'Píldora' };

export const DEFAULTS = {
  colors: ['#1aa7ff', '#22d3ee', '#16c24a', '#5b8cff'],
  background: '#f1f2f4',
  shapes: ['circle', 'square', 'triangle', 'ring', 'diamond'],
  hold: 3.5,          // segundos por forma
  size: 1.05,
  softness: 0.28,
  speed: 1,
  grid: { cols: 8, rows: 7, gap: 0.08, profile: 'redondo', depth: 0.3 },
  glass: { frost: 0.55, refraction: 1, ior: 1.4 },
  fit: 'contain',     // contain = cuadrícula completa con aire · cover = llena el contenedor
};

// Esquema del panel del editor (lo dibuja la app; ver README → Controles).
export const controls = [
  { title: 'Gradiente', items: [
    { type: 'colors', key: 'colors', min: 2, max: 6 },
    { type: 'color', key: 'background', label: 'Fondo' },
  ] },
  { title: 'Formas', hint: 'El orden en que las eliges es la secuencia de la animación.', items: [
    { type: 'multi', key: 'shapes', options: SHAPES, icons: SHAPE_ICONS, min: 1 },
    { type: 'range', key: 'hold', label: 'Tiempo por forma', min: 1, max: 12, step: 0.5, digits: 1, unit: ' s' },
    { type: 'range', key: 'size', label: 'Tamaño', min: 0.2, max: 2, step: 0.05 },
    { type: 'range', key: 'softness', label: 'Difuminado', min: 0.01, max: 1, step: 0.01 },
    { type: 'range', key: 'speed', label: 'Velocidad', min: 0.1, max: 4, step: 0.1, digits: 1, unit: '×' },
  ] },
  { title: 'Cuadrícula', items: [
    { type: 'range', key: 'grid.cols', label: 'Columnas', min: 1, max: 24, step: 1, digits: 0 },
    { type: 'range', key: 'grid.rows', label: 'Filas', min: 1, max: 24, step: 1, digits: 0 },
    { type: 'range', key: 'grid.gap', label: 'Separación', min: 0, max: 0.5, step: 0.01 },
    { type: 'seg', key: 'grid.profile', label: 'Perfil del cubo (Blender)', options: PROFILES },
    { type: 'range', key: 'grid.depth', label: 'Grosor', min: 0.05, max: 0.9, step: 0.01 },
    { type: 'seg', key: 'fit', label: 'Encuadre', options: { contain: 'Contener', cover: 'Llenar' } },
  ] },
  { title: 'Vidrio', items: [
    { type: 'range', key: 'glass.frost', label: 'Esmerilado', min: 0, max: 1, step: 0.01 },
    { type: 'range', key: 'glass.refraction', label: 'Refracción', min: 0, max: 3, step: 0.05 },
    { type: 'range', key: 'glass.ior', label: 'IOR', min: 1, max: 2.2, step: 0.01 },
  ] },
];

const HEX = /^#[0-9a-f]{6}$/i;
const num = (v, lo, hi, d) => (Number.isFinite(+v) ? Math.min(hi, Math.max(lo, +v)) : d);

export function normalize(c = {}) {
  const d = DEFAULTS;
  const g = { ...d.grid, ...(c.grid || {}) }, gl = { ...d.glass, ...(c.glass || {}) };
  let colors = (Array.isArray(c.colors) ? c.colors : d.colors).filter(x => HEX.test(x)).slice(0, 6);
  if (colors.length === 1) colors = [colors[0], colors[0]];
  if (!colors.length) colors = d.colors.slice();
  let shapes = (Array.isArray(c.shapes) ? c.shapes : d.shapes).filter(s => s in SHAPES);
  if (!shapes.length) shapes = ['circle'];
  return {
    ...c,
    colors,
    background: HEX.test(c.background) ? c.background : d.background,
    shapes,
    hold: num(c.hold, 1, 12, d.hold),
    size: num(c.size, 0.2, 2, d.size),
    softness: num(c.softness, 0.01, 1, d.softness),
    speed: num(c.speed, 0.1, 4, d.speed),
    grid: {
      cols: Math.round(num(g.cols, 1, 24, d.grid.cols)),
      rows: Math.round(num(g.rows, 1, 24, d.grid.rows)),
      gap: num(g.gap, 0, 0.5, d.grid.gap),
      profile: g.profile in PROFILES ? g.profile : d.grid.profile,
      depth: num(g.depth, 0.05, 0.9, d.grid.depth),
    },
    glass: {
      frost: num(gl.frost, 0, 1, d.glass.frost),
      refraction: num(gl.refraction, 0, 3, d.glass.refraction),
      ior: num(gl.ior, 1, 2.2, d.glass.ior),
    },
    fit: c.fit === 'cover' ? 'cover' : 'contain',
  };
}

// Duración de un loop perfecto (todas las animaciones son periódicas en este tiempo).
export function loopSeconds(c) {
  const n = c.shapes.length;
  return (n > 1 ? n * c.hold : Math.max(c.hold * 3, 8)) / c.speed;
}

// Solo los campos que viajan en el embed.
export function embedConfig(c) {
  const { colors, background, shapes, hold, size, softness, speed, grid, glass, fit } = normalize(c);
  return { colors, background, shapes, hold, size, softness, speed, grid, glass, fit };
}

// Línea de resumen para las cards de la biblioteca.
export const describe = c => `${c.grid.cols}×${c.grid.rows} · ${c.colors.length} colores`;

// ---------- geometría Blender ----------
const TILES_URL = new URL('./tiles.json', import.meta.url);
let tilesPromise;
function loadTiles() {
  return (tilesPromise ??= fetch(TILES_URL).then(r => {
    if (!r.ok) throw new Error('No se pudo cargar ' + TILES_URL);
    return r.json();
  }).then(d => {
    const geos = {};
    for (const [k, v] of Object.entries(d.profiles)) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(v.p, 3));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(v.n, 3));
      geo.setIndex(v.i);
      geos[k] = geo;
    }
    return { depth: d.depth, geos };
  }));
}

// ---------- shader del fondo ----------
const VERT = /* glsl */`
  varying vec2 vP;
  void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`;

const FRAG = /* glsl */`
  uniform float uPh, uMix, uSize, uSoft, uScale; uniform int uA, uB, uN;
  uniform vec2 uPlane; uniform vec3 uC[6]; uniform vec3 uBg;
  varying vec2 vP;
  mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
  float sdBox(vec2 p, vec2 b){ vec2 d = abs(p) - b; return length(max(d, 0.)) + min(max(d.x, d.y), 0.); }
  float sdTri(vec2 p, float r){ const float k = 1.7320508; p.x = abs(p.x) - r; p.y = p.y + r / k;
    if (p.x + k * p.y > 0.) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.;
    p.x -= clamp(p.x, -2. * r, 0.); return -length(p) * sign(p.y); }
  float shape(int s, vec2 p, float r){
    if (s == 0) return length(p) - r;
    if (s == 1) return sdBox(p, vec2(r * .82)) - r * .1;
    if (s == 2) return sdTri(p + vec2(0., r * .2), r * 1.1) - r * .06;
    if (s == 3) return abs(length(p) - r * .78) - r * .3;
    if (s == 4) return sdBox(rot(.785398) * p, vec2(r * .74)) - r * .06;
    if (s == 5) return min(sdBox(p, vec2(r * .95, r * .3)), sdBox(p, vec2(r * .3, r * .95))) - r * .06;
    float a = atan(p.y, p.x);
    return length(p) - r * (1. + .18 * sin(3. * a + uPh) + .1 * sin(5. * a - 2. * uPh));
  }
  vec3 pal(float t){
    t = clamp(t, 0., 1.) * float(uN - 1);
    vec3 c = uC[0];
    for (int i = 1; i < 6; i++) { if (i >= uN) break; c = mix(c, uC[i], clamp(t - float(i - 1), 0., 1.)); }
    return c;
  }
  void main(){
    vec2 p = vP * uPlane / uScale;
    // todo es periódico en uPh (0..2π) => loop perfecto
    vec2 q = rot(sin(uPh) * .5) * (p - vec2(sin(uPh), cos(uPh)) * .12);
    float d = mix(shape(uA, q, uSize), shape(uB, q, uSize), uMix);
    d += .05 * sin(q.x * 3. + uPh * 2.) * sin(q.y * 3. - uPh * 2.);
    float m = 1. - smoothstep(-uSoft, uSoft, d);
    float n = .5 + .25 * sin(p.x * 2. + uPh * 2.) + .25 * sin(p.y * 1.6 - uPh * 3. + sin(p.x * 1.1 + uPh));
    float g = dot(p, vec2(cos(uPh), sin(uPh))) * .4 + .5;
    gl_FragColor = vec4(mix(uBg, pal(mix(g, n, .5)), m), 1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;

function makeEnv(renderer) {
  const s = new THREE.Scene();
  s.add(new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0x9a9ca3, side: THREE.BackSide })));
  const light = new THREE.MeshBasicMaterial({ color: new THREE.Color(6, 6, 6), side: THREE.DoubleSide });
  for (const [x, y, z, w, h, rx, ry] of [
    [0, 9.5, 0, 12, 5, Math.PI / 2, 0], [-9.5, 3, 4, 4, 8, 0, Math.PI / 2],
    [9.5, 1, 6, 3, 6, 0, -Math.PI / 2], [0, -2, 9.5, 10, 2, 0, 0],
  ]) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), light);
    m.position.set(x, y, z); m.rotation.set(rx, ry, 0); s.add(m);
  }
  const pm = new THREE.PMREMGenerator(renderer);
  const tex = pm.fromScene(s, 0.04).texture;
  pm.dispose();
  return tex;
}

// ---------- montaje ----------
// opts: { size:[w,h] (tamaño fijo, sin ResizeObserver), dpr, autoplay (true), preserve }
export async function mount(host, config, opts = {}) {
  const { geos, depth: baseDepth } = await loadTiles();
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: !!opts.preserve, powerPreference: 'high-performance' });
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.setPixelRatio(opts.dpr ?? Math.min(devicePixelRatio, 2));
  const canvas = renderer.domElement;
  canvas.style.cssText = 'display:block;width:100%;height:100%';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  scene.environment = makeEnv(renderer);
  const camera = new THREE.PerspectiveCamera(18, 1, 0.1, 400);

  const bgMat = new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG,
    uniforms: {
      uPh: { value: 0 }, uMix: { value: 0 }, uA: { value: 0 }, uB: { value: 0 }, uN: { value: 2 },
      uSize: { value: 1 }, uSoft: { value: 0.3 }, uScale: { value: 1 },
      uPlane: { value: new THREE.Vector2(1, 1) },
      uC: { value: Array.from({ length: 6 }, () => new THREE.Color()) },
      uBg: { value: new THREE.Color() },
    },
  });
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), bgMat);
  bg.position.z = -1.2;
  scene.add(bg);

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, transmission: 1, metalness: 0,
    clearcoat: 1, clearcoatRoughness: 0.2, envMapIntensity: 0.3,
  });

  let cfg, tiles, gridKey = '', W = 1, H = 1, w = 1, h = 1;

  function buildGrid() {
    const g = cfg.grid, key = JSON.stringify(g);
    if (key === gridKey) return;
    gridKey = key;
    if (tiles) { scene.remove(tiles); tiles.dispose(); }
    const step = 1 + g.gap;
    W = g.cols * step - g.gap; H = g.rows * step - g.gap;
    tiles = new THREE.InstancedMesh(geos[g.profile], glass, g.cols * g.rows);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(1, 1, g.depth / baseDepth), p = new THREE.Vector3();
    let i = 0;
    for (let r = 0; r < g.rows; r++) for (let c = 0; c < g.cols; c++) {
      p.set((c - (g.cols - 1) / 2) * step, ((g.rows - 1) / 2 - r) * step, 0);
      tiles.setMatrixAt(i++, m.compose(p, q, s));
    }
    scene.add(tiles);
    const S = Math.max(W, H) * 3 + 10;   // cubre cualquier proporción de vista (21:9 con grid alto, etc.)
    bg.scale.set(S, S, 1);
    bgMat.uniforms.uPlane.value.set(S, S);
    bgMat.uniforms.uScale.value = Math.min(W, H) / 2;
  }

  function fit() {
    const a = w / h;
    camera.aspect = a;
    camera.updateProjectionMatrix();
    const vH = cfg.fit === 'cover' ? Math.min(H, W / a) * 0.98 : Math.max(H, W / a) * 1.25;
    camera.position.set(0, 0, vH / 2 / Math.tan(THREE.MathUtils.degToRad(9)));
  }

  function resize(nw, nh) {
    w = Math.max(1, Math.round(nw)); h = Math.max(1, Math.round(nh));
    renderer.setSize(w, h, false);
    if (cfg) fit();
  }

  function set(c) {
    cfg = normalize(c);
    const u = bgMat.uniforms;
    cfg.colors.forEach((hex, i) => u.uC.value[i].set(hex));
    u.uN.value = cfg.colors.length;
    u.uBg.value.set(cfg.background);
    u.uSize.value = cfg.size;
    u.uSoft.value = cfg.softness;
    glass.roughness = cfg.glass.frost;
    glass.thickness = cfg.glass.refraction;
    glass.ior = cfg.glass.ior;
    buildGrid();
    fit();
    if (!running) renderAt(time);
  }

  function renderAt(t) {
    const L = loopSeconds(cfg), u = (((t % L) + L) % L) / L, n = cfg.shapes.length, U = bgMat.uniforms;
    U.uPh.value = u * Math.PI * 2;
    if (n === 1) {
      U.uA.value = U.uB.value = SHAPE_IDS.indexOf(cfg.shapes[0]); U.uMix.value = 0;
    } else {
      const seg = u * n, i = Math.floor(seg) % n, f = seg - Math.floor(seg);
      const span = Math.min(0.5, 0.9 / (cfg.hold / cfg.speed));
      const k = Math.min(1, Math.max(0, (f - (1 - span)) / span));
      U.uA.value = SHAPE_IDS.indexOf(cfg.shapes[i]);
      U.uB.value = SHAPE_IDS.indexOf(cfg.shapes[(i + 1) % n]);
      U.uMix.value = k * k * (3 - 2 * k);
    }
    renderer.render(scene, camera);
  }

  let time = 0, running = false, last = 0;
  function tick(now) {
    time += Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    renderAt(time);
  }
  const play = () => { if (running) return; running = true; last = 0; renderer.setAnimationLoop(tick); };
  const pause = () => { running = false; renderer.setAnimationLoop(null); };

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
    destroy() {
      pause(); ro?.disconnect();
      if (tiles) tiles.dispose();
      bg.geometry.dispose(); bgMat.dispose(); glass.dispose(); scene.environment.dispose();
      renderer.dispose(); renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
