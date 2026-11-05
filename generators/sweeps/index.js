// Generador "Barridos": fondos con barridos diagonales difusos, glows de esquina y trama.
// Lenguaje del diseñador de planta (rogenizar · Firma 2/2): barridos 115°/65°/150° sobre navy,
// trama de puntos, glows radiales #023CA0 / #022B63 (elaniin-website: CTA desktop-08, cards desktop-04).
// Contrato de generador: ver README.md en la raíz.

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.min.js';

export const TEXTURES = { dots: 'Puntos', grid: 'Grilla', stripes: 'Rayas', none: 'Ninguna' };
const TEX_IDS = Object.keys(TEXTURES);

export const DEFAULTS = {
  colors: ['#1054ff', '#0848cc'],
  background: '#01172e',
  angle: 115,          // grados, como CSS linear-gradient
  period: 0.8,         // separación entre barridos (fracción del lado corto)
  width: 0.16,         // grosor del barrido dentro del periodo
  length: 1.6,         // largo de cada tramo
  intensity: 0.55,
  speed: 1,
  glow: 0.6,
  glow1: '#023ca0',    // esquina superior derecha
  glow2: '#022b63',    // esquina inferior izquierda
  texture: 'dots',
  pitch: 16,           // px CSS
  textureColor: '#ffffff',
  textureOpacity: 0.06,
};

export const controls = [
  { title: 'Color', items: [
    { type: 'colors', key: 'colors', min: 2, max: 4 },
    { type: 'color', key: 'background', label: 'Fondo' },
  ] },
  { title: 'Barridos', items: [
    { type: 'range', key: 'angle', label: 'Ángulo', min: 0, max: 180, step: 5, digits: 0, unit: '°' },
    { type: 'range', key: 'period', label: 'Separación', min: 0.15, max: 1.2, step: 0.01 },
    { type: 'range', key: 'width', label: 'Grosor', min: 0.02, max: 0.3, step: 0.01 },
    { type: 'range', key: 'length', label: 'Largo del tramo', min: 0.3, max: 3, step: 0.05 },
    { type: 'range', key: 'intensity', label: 'Intensidad', min: 0, max: 1, step: 0.01 },
    { type: 'range', key: 'speed', label: 'Velocidad', min: 0.1, max: 4, step: 0.1, digits: 1, unit: '×' },
  ] },
  { title: 'Resplandor', items: [
    { type: 'range', key: 'glow', label: 'Glow de esquinas', min: 0, max: 1, step: 0.01 },
    { type: 'color', key: 'glow1', label: 'Arriba derecha' },
    { type: 'color', key: 'glow2', label: 'Abajo izquierda' },
  ] },
  { title: 'Textura', items: [
    { type: 'seg', key: 'texture', label: 'Trama', options: TEXTURES },
    { type: 'range', key: 'pitch', label: 'Paso', min: 6, max: 48, step: 1, digits: 0, unit: ' px' },
    { type: 'range', key: 'textureOpacity', label: 'Opacidad', min: 0, max: 1, step: 0.01 },
    { type: 'color', key: 'textureColor', label: 'Color de trama' },
  ] },
];

const HEX = /^#[0-9a-f]{6}$/i;
const num = (v, lo, hi, d) => (Number.isFinite(+v) ? Math.min(hi, Math.max(lo, +v)) : d);
const hex = (v, d) => (HEX.test(v) ? v : d);

export function normalize(c = {}) {
  const d = DEFAULTS;
  let colors = (Array.isArray(c.colors) ? c.colors : d.colors).filter(x => HEX.test(x)).slice(0, 4);
  if (colors.length === 1) colors = [colors[0], colors[0]];
  if (!colors.length) colors = d.colors.slice();
  return {
    ...c,
    colors,
    background: hex(c.background, d.background),
    angle: num(c.angle, 0, 180, d.angle),
    period: num(c.period, 0.15, 1.2, d.period),
    width: num(c.width, 0.02, 0.3, d.width),
    length: num(c.length, 0.3, 3, d.length),
    intensity: num(c.intensity, 0, 1, d.intensity),
    speed: num(c.speed, 0.1, 4, d.speed),
    glow: num(c.glow, 0, 1, d.glow),
    glow1: hex(c.glow1, d.glow1),
    glow2: hex(c.glow2, d.glow2),
    texture: c.texture in TEXTURES ? c.texture : d.texture,
    pitch: Math.round(num(c.pitch, 6, 48, d.pitch)),
    textureColor: hex(c.textureColor, d.textureColor),
    textureOpacity: num(c.textureOpacity, 0, 1, d.textureOpacity),
  };
}

export const loopSeconds = c => 12 / c.speed;

export function embedConfig(c) {
  const n = normalize(c), out = {};
  for (const k of Object.keys(DEFAULTS)) out[k] = n[k];
  return out;
}

export const describe = c => `${c.colors.length} colores · ${Math.round(c.angle)}° · ${TEXTURES[c.texture].toLowerCase()}`;

const FRAG = /* glsl */`
  uniform vec2 uRes; uniform float uDpr, uPh;
  uniform vec3 uBg; uniform vec3 uC[4]; uniform int uN;
  uniform float uAngle, uPeriod, uWidth, uLength, uIntensity, uGlow;
  uniform vec3 uG1, uG2;
  uniform int uTex; uniform float uPitch, uTexOp; uniform vec3 uTexC;
  const float TAU = 6.2831853;
  void main(){
    vec2 px = gl_FragCoord.xy / uDpr; px.y = uRes.y - px.y;         // px CSS, y hacia abajo
    float m = min(uRes.x, uRes.y);
    float a = radians(uAngle);
    vec2 dir = vec2(sin(a), -cos(a)), per = vec2(cos(a), sin(a));   // misma convención que CSS
    float u = dot(px, dir) / (uPeriod * m), v = dot(px, per) / m;
    vec3 col = uBg;
    // glows de esquina (CSS: 60% 55% at 100% 0% · 45% 40% at 0% 100%)
    vec2 q = px / uRes;
    float g1 = 1. - smoothstep(0., 1., length((q - vec2(1., 0.)) / vec2(.6, .55)));
    float g2 = 1. - smoothstep(0., 1., length((q - vec2(0., 1.)) / vec2(.45, .4)));
    col = mix(col, uG1, g1 * uGlow);
    col = mix(col, uG2, g2 * uGlow);
    // barridos: se desplazan exactamente un periodo por loop => loop perfecto
    for (int k = 0; k < 4; k++) {
      if (k >= uN) break;
      float fk = float(k);
      float t = fract(u - uPh / TAU - fk / float(uN) + .04 * sin(uPh + fk * 2.1));
      float dd = (t - .5) / uWidth;
      float band = exp(-dd * dd);
      float dirk = mod(fk, 2.) < .5 ? 1. : -1.;
      float streak = .55 + .45 * sin(v * TAU / uLength + uPh * dirk + fk * 1.7);
      col = mix(col, uC[k], clamp(band * streak * uIntensity, 0., 1.));
    }
    // trama
    if (uTex != 3) {
      vec2 cell = mod(px, uPitch);
      float tex = 0.;
      if (uTex == 0) tex = 1. - smoothstep(.6, 1.4, length(cell - uPitch * .5));
      else {
        vec2 e = min(cell, uPitch - cell);
        tex = 1. - smoothstep(0., 1., uTex == 1 ? min(e.x, e.y) : e.y);
      }
      col = mix(col, uTexC, tex * uTexOp);
    }
    gl_FragColor = vec4(col, 1.);
    #include <colorspace_fragment>
  }`;

// ponytail: el bucle play/resize se repite en cada generador; extraer a generators/_shared/ al tercer generador.
export async function mount(host, config, opts = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: !!opts.preserve });
  const dpr = opts.dpr ?? Math.min(devicePixelRatio, 2);
  renderer.setPixelRatio(dpr);
  const canvas = renderer.domElement;
  canvas.style.cssText = 'display:block;width:100%;height:100%';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  const scene = new THREE.Scene(), camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const U = {
    uRes: { value: new THREE.Vector2(1, 1) }, uDpr: { value: dpr }, uPh: { value: 0 },
    uBg: { value: new THREE.Color() }, uC: { value: Array.from({ length: 4 }, () => new THREE.Color()) }, uN: { value: 2 },
    uAngle: { value: 115 }, uPeriod: { value: 0.45 }, uWidth: { value: 0.09 }, uLength: { value: 1.2 },
    uIntensity: { value: 1 }, uGlow: { value: 0.6 }, uG1: { value: new THREE.Color() }, uG2: { value: new THREE.Color() },
    uTex: { value: 0 }, uPitch: { value: 16 }, uTexOp: { value: 0.1 }, uTexC: { value: new THREE.Color() },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms: U, fragmentShader: FRAG,
    vertexShader: 'void main(){ gl_Position = vec4(position.xy, 0., 1.); }',
    depthTest: false, depthWrite: false,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
  scene.add(quad);

  let cfg;
  function resize(w, h) {
    w = Math.max(1, Math.round(w)); h = Math.max(1, Math.round(h));
    renderer.setSize(w, h, false);
    U.uRes.value.set(w, h);
  }
  function set(c) {
    cfg = normalize(c);
    cfg.colors.forEach((x, i) => U.uC.value[i].set(x));
    U.uN.value = cfg.colors.length;
    U.uBg.value.set(cfg.background);
    U.uAngle.value = cfg.angle; U.uPeriod.value = cfg.period; U.uWidth.value = cfg.width;
    U.uLength.value = cfg.length; U.uIntensity.value = cfg.intensity; U.uGlow.value = cfg.glow;
    U.uG1.value.set(cfg.glow1); U.uG2.value.set(cfg.glow2);
    U.uTex.value = TEX_IDS.indexOf(cfg.texture); U.uPitch.value = cfg.pitch;
    U.uTexOp.value = cfg.textureOpacity; U.uTexC.value.set(cfg.textureColor);
    if (!running) renderAt(time);
  }
  function renderAt(t) {
    const L = loopSeconds(cfg);
    U.uPh.value = ((((t % L) + L) % L) / L) * Math.PI * 2;
    renderer.render(scene, camera);
  }

  let time = 0, running = false, last = 0;
  const tick = now => { time += Math.min(0.05, (now - (last || now)) / 1000); last = now; renderAt(time); };
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
      quad.geometry.dispose(); mat.dispose();
      renderer.dispose(); renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
