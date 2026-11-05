// Generador "Matriz LED": grilla de puntos con niveles de brillo, varios modos y reacción al cursor.
// Ref. Pinterest: "Reacting grid" (1115063189023266945), Behance CyberMind (1115063189023266993), 1115063189023266896.
// Refuerza la trama de puntos del diseñador (rogenizar · Firma: trama #6A9AFF).
import { defineGenerator } from '../_shared/runtime.js';

const MODES = { ripple: 'Onda', scan: 'Escaneo', twinkle: 'Destellos', pulse: 'Pulso', noise: 'Ruido' };
const SHAPES = { circle: 'Círculo', square: 'Cuadrado' };

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineGenerator({
  DEFAULTS: {
    colors: ['#1054ff', '#b9cefb'], off: '#0a2547', background: '#01172e', cell: 18, dot: 0.55, shape: 'circle',
    mode: 'ripple', levels: 5, frequency: 3, glow: 0.35, cursor: 0.8, speed: 1,
  },
  controls: [
    { title: 'Color', hint: 'Del brillo bajo al alto.', items: [
      { type: 'colors', key: 'colors', min: 2, max: 4 },
      { type: 'color', key: 'off', label: 'LED apagado' },
      { type: 'color', key: 'background', label: 'Fondo' },
    ] },
    { title: 'Matriz', items: [
      { type: 'range', key: 'cell', label: 'Celda', min: 6, max: 48, step: 1, digits: 0, unit: ' px' },
      { type: 'range', key: 'dot', label: 'Tamaño del LED', min: 0.15, max: 0.95, step: 0.01 },
      { type: 'seg', key: 'shape', label: 'Forma', options: SHAPES },
      { type: 'range', key: 'levels', label: 'Niveles de brillo', min: 2, max: 16, step: 1, digits: 0 },
    ] },
    { title: 'Animación', items: [
      { type: 'seg', key: 'mode', label: 'Modo', options: MODES },
      { type: 'range', key: 'frequency', label: 'Frecuencia', min: 1, max: 8, step: 1, digits: 0 },
      { type: 'range', key: 'glow', label: 'Halo', min: 0, max: 1, step: 0.01 },
      { type: 'range', key: 'cursor', label: 'Reacción al cursor', min: 0, max: 1, step: 0.01 },
      { type: 'range', key: 'speed', label: 'Velocidad', min: 0.1, max: 4, step: 0.1, digits: 1, unit: '×' },
    ] },
  ],
  loop: c => 8 / c.speed,
  describe: c => `${MODES[c.mode].toLowerCase()} · ${c.cell}px · ${c.levels} niveles`,
  uniforms: c => ({
    uBg: c.background, uOff: c.off, uCell: c.cell, uDot: c.dot, uShape: Object.keys(SHAPES).indexOf(c.shape),
    uMode: Object.keys(MODES).indexOf(c.mode), uLevels: c.levels, uFreq: c.frequency, uGlow: c.glow, uCursor: c.cursor,
  }),
  frag: /* glsl */`
    uniform vec3 uBg, uOff; uniform float uCell, uDot, uLevels, uFreq, uGlow, uCursor; uniform int uShape, uMode;
    void main(){
      vec2 px = cssPx(); float m = min(uRes.x, uRes.y);
      vec2 id = floor(px / uCell), c = (id + .5) * uCell, l = px - c;
      vec2 q = (c - uRes * .5) / m;
      float d = length(q), v;
      if (uMode == 0) v = .5 + .5 * sin(d * uFreq * TAU - uPh * 2.);
      else if (uMode == 1) { float y = fract(c.y / uRes.y - uPh / TAU); v = exp(-pow((1. - y) * uFreq * 1.5, 2.)) + .6 * exp(-(1. - y) * uFreq * 3.); }
      else if (uMode == 2) { float h = hash2(id), k = 1. + floor(hash2(id + 7.) * uFreq); v = pow(.5 + .5 * sin(uPh * k + h * TAU), 8.); }
      else if (uMode == 3) v = (.5 + .5 * cos(d * uFreq * 2. - uPh)) * exp(-d * 1.2);
      else v = lnoise(c / m * uFreq * .6, uPh, .8);
      float md = length(c - uMouse) / (m * .18);
      v = max(clamp(v, 0., 1.), uCursor * exp(-md * md));
      v = floor(v * (uLevels - 1.) + .5) / (uLevels - 1.);
      float r = uDot * uCell * .5;
      float sd = uShape == 0 ? length(l) - r : max(abs(l.x), abs(l.y)) - r;
      float mask = 1. - smoothstep(-.75, .75, sd);
      vec3 on = pal(v);
      vec3 col = mix(uBg, mix(uOff, on, smoothstep(0., .2, v)), mask);
      col += on * v * uGlow * exp(-pow(length(l) / (uCell * .55), 2.)) * (1. - mask);
      gl_FragColor = vec4(col, 1.);
      #include <colorspace_fragment>
    }`,
});
