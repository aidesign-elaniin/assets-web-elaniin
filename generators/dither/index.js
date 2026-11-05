// Generador "Píxel Dither": gradiente pixelado con dither Bayer y un borde que se disuelve.
// Ref. Pinterest: skyryedesign.com (1115063189023236693), Uniqode/underconsideration (1115063189023266965), 1115063189023236518.
import { defineGenerator } from '../_shared/lite.js';   // WebGL puro, sin Three.js

const MATRIX = { bayer2: 'Bayer 2', bayer4: 'Bayer 4', bayer8: 'Bayer 8' };

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineGenerator({
  DEFAULTS: {
    colors: ['#1054ff', '#f0f0f3'], pixel: 8, matrix: 'bayer4',
    angle: 180, edge: 0.55, spread: 0.35, noise: 0.5, scale: 1.6, speed: 1,
  },
  controls: [
    { title: 'Color', hint: 'El primer color va del lado del ángulo; el último, del otro.', items: [
      { type: 'colors', key: 'colors', min: 2, max: 4 },
    ] },
    { title: 'Píxel', items: [
      { type: 'range', key: 'pixel', label: 'Tamaño de píxel', min: 2, max: 40, step: 1, digits: 0, unit: ' px' },
      { type: 'seg', key: 'matrix', label: 'Matriz', options: MATRIX },
    ] },
    { title: 'Borde', items: [
      { type: 'range', key: 'angle', label: 'Ángulo', min: 0, max: 360, step: 5, digits: 0, unit: '°' },
      { type: 'range', key: 'edge', label: 'Posición', min: 0, max: 1, step: 0.01 },
      { type: 'range', key: 'spread', label: 'Ancho de disolución', min: 0.02, max: 1.5, step: 0.01 },
      { type: 'range', key: 'noise', label: 'Ruido del borde', min: 0, max: 1.5, step: 0.01 },
      { type: 'range', key: 'scale', label: 'Escala del ruido', min: 0.2, max: 6, step: 0.05 },
      { type: 'range', key: 'speed', label: 'Velocidad', min: 0.1, max: 4, step: 0.1, digits: 1, unit: '×' },
    ] },
  ],
  describe: c => `${c.pixel}px · ${MATRIX[c.matrix].toLowerCase()} · ${Math.round(c.angle)}°`,
  uniforms: c => ({
    uPixel: c.pixel, uMatrix: Object.keys(MATRIX).indexOf(c.matrix), uAngle: c.angle,
    uEdge: c.edge, uSpread: c.spread, uNoise: c.noise, uScale: c.scale,
  }),
  frag: /* glsl */`
    uniform float uPixel, uAngle, uEdge, uSpread, uNoise, uScale; uniform int uMatrix;
    float b2(vec2 a){ a = floor(a); return fract(dot(a, vec2(.5, a.y * .75))); }
    float b4(vec2 a){ return b2(.5 * a) * .25 + b2(a); }
    float b8(vec2 a){ return b4(.5 * a) * .25 + b2(a); }
    void main(){
      vec2 px = cssPx(); float m = min(uRes.x, uRes.y);
      vec2 q = floor(px / uPixel), c = (q + .5) * uPixel;
      float a = radians(uAngle);
      vec2 dir = vec2(sin(a), -cos(a));
      vec2 uv = (c - uRes * .5) / uRes;
      float g = dot(uv, dir) + .5;
      float t = (g - uEdge - .04 * sin(uPh)) / uSpread + .5;
      t += (lfbm(c / m * uScale, uPh) - .5) * uNoise;
      float th = uMatrix == 0 ? b2(q) : uMatrix == 1 ? b4(q) : b8(q);
      float tt = clamp(t, 0., .9999) * float(uN - 1);
      int i = int(floor(tt));
      int k = min(i + (fract(tt) > th ? 1 : 0), uN - 1);
      vec3 col = uC[0];
      for (int j = 1; j < 6; j++) if (j == k) col = uC[j];
      gl_FragColor = vec4(col, 1.);
      #include <colorspace_fragment>
    }`,
});
