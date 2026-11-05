// Elaniin Glass — motor de assets "glass grid".
// Un solo archivo para el editor y para los sitios: lo que se ve en el editor es lo que se publica.
//
// Uso en un sitio:
//   <script type="module" src="https://<host>/elaniin-glass.js"></script>
//   <elaniin-glass style="display:block;aspect-ratio:16/9" config='{"colors":["#1aa7ff","#16c24a"]}'></elaniin-glass>
//
// La geometría del cubo sale de Blender (blender/make_tile.py -> assets/tiles.json).

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.min.js';

export const SHAPES = {
  circle: 'Círculo', square: 'Cuadrado', triangle: 'Triángulo', ring: 'Anillo',
  diamond: 'Rombo', cross: 'Cruz', blob: 'Orgánico',
};
const SHAPE_IDS = Object.keys(SHAPES);
export const PROFILES = { suave: 'Suave', redondo: 'Redondo', pildora: 'Píldora' };

export const DEFAULTS = {
  name: 'Sin título',
  tags: [],
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
  aspect: '16:9',
};

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
    name: String(c.name ?? d.name),
    tags: Array.isArray(c.tags) ? c.tags.map(String) : [],
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
    aspect: ['16:9', '4:5', '1:1', '9:16', '21:9'].includes(c.aspect) ? c.aspect : d.aspect,
  };
}

// Duración de un loop perfecto (todas las animaciones son periódicas en este tiempo).
export function loopSeconds(c) {
  const n = c.shapes.length;
  return (n > 1 ? n * c.hold : Math.max(c.hold * 3, 8)) / c.speed;
}

// Solo lo que viaja en el embed (sin id, fechas, etc.)
export function embedConfig(c) {
  const { name, tags, colors, background, shapes, hold, size, softness, speed, grid, glass, fit } = normalize(c);
  return { colors, background, shapes, hold, size, softness, speed, grid, glass, fit };
}

// ---------- geometría Blender ----------
const TILES_URL = new URL('./assets/tiles.json', import.meta.url);
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

// ---------- exportación ----------
function offscreenHost(width, height) {
  const el = document.createElement('div');
  el.style.cssText = `position:fixed;left:-20000px;top:0;width:${width}px;height:${height}px;pointer-events:none`;
  document.body.appendChild(el);
  return el;
}

// Varias imágenes con un solo contexto WebGL (miniaturas de la biblioteca).
export async function snapshots(configs, { width = 640, height = 400, type = 'image/webp' } = {}) {
  const host = offscreenHost(width, height);
  const g = await mount(host, configs[0] || {}, { size: [width, height], dpr: 1, autoplay: false, preserve: true });
  const out = [];
  try {
    for (const c of configs) {
      g.set(c);
      g.renderAt(loopSeconds(g.config) * 0.12);
      out.push(await new Promise(r => g.canvas.toBlob(r, type, 0.9)));
    }
  } finally { g.destroy(); host.remove(); }
  return out;
}

export async function renderImage(config, { width, height, type = 'image/png', time } = {}) {
  const host = offscreenHost(width, height);
  const g = await mount(host, config, { size: [width, height], dpr: 1, autoplay: false, preserve: true });
  try {
    g.renderAt(time ?? loopSeconds(g.config) * 0.12);
    return await new Promise(r => g.canvas.toBlob(r, type, 0.95));
  } finally { g.destroy(); host.remove(); }
}

export function videoMime() {
  return ['video/mp4;codecs=avc1.640028', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm']
    .find(m => window.MediaRecorder && MediaRecorder.isTypeSupported(m)) || null;
}

// Graba un loop en tiempo real. ponytail: tiempo real = si la GPU no llega a 60fps se pierden cuadros;
// render cuadro a cuadro con WebCodecs si hace falta calidad de estudio.
export async function recordVideo(config, { width = 1920, height = 1080, seconds, fps = 60, bitrate = 16e6, onProgress } = {}) {
  const mime = videoMime();
  if (!mime) throw new Error('Este navegador no puede grabar video.');
  const host = offscreenHost(width, height);
  const g = await mount(host, config, { size: [width, height], dpr: 1, autoplay: false });
  const dur = seconds ?? loopSeconds(g.config);
  const rec = new MediaRecorder(g.canvas.captureStream(fps), { mimeType: mime, videoBitsPerSecond: bitrate });
  const chunks = [];
  rec.ondataavailable = e => e.data.size && chunks.push(e.data);
  const done = new Promise(r => (rec.onstop = r));
  g.renderAt(0);
  rec.start(250);
  const t0 = performance.now();
  await new Promise(resolve => {
    const step = () => {
      const t = (performance.now() - t0) / 1000;
      if (t >= dur) return resolve();
      g.renderAt(t);
      onProgress?.(t / dur);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
  rec.stop();
  await done;
  g.destroy(); host.remove();
  onProgress?.(1);
  return { blob: new Blob(chunks, { type: mime.split(';')[0] }), ext: mime.startsWith('video/mp4') ? 'mp4' : 'webm' };
}

// ---------- web component ----------
class ElaniinGlass extends HTMLElement {
  static observedAttributes = ['config', 'src'];
  async connectedCallback() {
    if (this._g || this._busy) return;
    this._busy = true;
    if (getComputedStyle(this).display === 'inline') this.style.display = 'block';
    if (getComputedStyle(this).position === 'static') this.style.position = 'relative';
    this.style.overflow = 'hidden';
    const cfg = await this._read();
    this._g = await mount(this, cfg, { autoplay: false });
    this._busy = false;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    this._io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !reduce.matches) this._g.play(); else this._g.pause();
    });
    this._io.observe(this);
  }
  disconnectedCallback() { this._io?.disconnect(); this._g?.destroy(); this._g = null; }
  async attributeChangedCallback() { if (this._g) this._g.set(await this._read()); }
  async _read() {
    try {
      if (this.getAttribute('src')) return await (await fetch(this.getAttribute('src'))).json();
      return JSON.parse(this.getAttribute('config') || '{}');
    } catch (err) { console.warn('[elaniin-glass] config inválida', err); return {}; }
  }
}
if (!customElements.get('elaniin-glass')) customElements.define('elaniin-glass', ElaniinGlass);
