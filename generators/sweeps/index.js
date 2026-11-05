// Generador "Barridos": fondos con barridos diagonales difusos, glows de esquina y trama.
// Lenguaje del diseñador de planta (rogenizar · Firma 2/2): barridos 115°/65°/150° sobre navy,
// trama de puntos, glows radiales #023CA0 / #022B63 (elaniin-website: CTA desktop-08, cards desktop-04).
import { defineGenerator } from '../_shared/lite.js';   // WebGL puro, sin Three.js

const TEXTURES = { dots: 'Puntos', grid: 'Grilla', stripes: 'Rayas', none: 'Ninguna' };

const D = {
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

const C = [
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

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineGenerator({
  DEFAULTS: D,
  controls: C,
  describe: c => `${c.colors.length} colores · ${Math.round(c.angle)}° · ${TEXTURES[c.texture].toLowerCase()}`,
  uniforms: c => ({
    uBg: c.background, uAngle: c.angle, uPeriod: c.period, uWidth: c.width, uLength: c.length, uIntensity: c.intensity,
    uGlow: c.glow, uG1: c.glow1, uG2: c.glow2, uTex: Object.keys(TEXTURES).indexOf(c.texture), uPitch: c.pitch,
    uTexOp: c.textureOpacity, uTexC: c.textureColor,
  }),
  frag: /* glsl */`
  uniform vec3 uBg;
  uniform float uAngle, uPeriod, uWidth, uLength, uIntensity, uGlow;
  uniform vec3 uG1, uG2;
  uniform int uTex; uniform float uPitch, uTexOp; uniform vec3 uTexC;
  void main(){
    vec2 px = cssPx();   // px CSS, y hacia abajo
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
  }`,
});
