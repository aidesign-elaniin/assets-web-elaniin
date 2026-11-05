// Generador "Halftone Fluido": grilla de puntos cuyo tamaño sigue un ruido que fluye.
// Ref. Pinterest: fffunction.studio (1115063189023266953), 1115063189023266880, 1115063189023267002.
import { defineGenerator } from '../_shared/lite.js';   // WebGL puro, sin Three.js

const SHAPES = { circle: 'Círculo', square: 'Cuadrado', rounded: 'Redondeado' };

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineGenerator({
  DEFAULTS: {
    colors: ['#6a9aff', '#1054ff'], background: '#ffffff', cell: 14, shape: 'circle',
    minSize: 0.05, maxSize: 1, scale: 1.8, flow: 0.4, angle: 35, contrast: 2.6, speed: 1,
  },
  controls: [
    { title: 'Color', items: [
      { type: 'colors', key: 'colors', min: 2, max: 4 },
      { type: 'color', key: 'background', label: 'Fondo' },
    ] },
    { title: 'Puntos', items: [
      { type: 'range', key: 'cell', label: 'Celda', min: 6, max: 48, step: 1, digits: 0, unit: ' px' },
      { type: 'seg', key: 'shape', label: 'Forma', options: SHAPES },
      { type: 'range', key: 'minSize', label: 'Tamaño mínimo', min: 0, max: 1, step: 0.01 },
      { type: 'range', key: 'maxSize', label: 'Tamaño máximo', min: 0.1, max: 1.2, step: 0.01 },
    ] },
    { title: 'Flujo', items: [
      { type: 'range', key: 'scale', label: 'Escala del ruido', min: 0.2, max: 5, step: 0.05 },
      { type: 'range', key: 'flow', label: 'Desplazamiento', min: 0, max: 1.5, step: 0.01 },
      { type: 'range', key: 'angle', label: 'Dirección', min: 0, max: 360, step: 5, digits: 0, unit: '°' },
      { type: 'range', key: 'contrast', label: 'Contraste', min: 0.5, max: 5, step: 0.05 },
      { type: 'range', key: 'speed', label: 'Velocidad', min: 0.1, max: 4, step: 0.1, digits: 1, unit: '×' },
    ] },
  ],
  describe: c => `${c.cell}px · ${SHAPES[c.shape].toLowerCase()} · ${c.colors.length} colores`,
  uniforms: c => ({
    uBg: c.background, uCell: c.cell, uShape: Object.keys(SHAPES).indexOf(c.shape), uMin: c.minSize, uMax: c.maxSize,
    uScale: c.scale, uFlow: c.flow, uAngle: c.angle, uContrast: c.contrast,
  }),
  frag: /* glsl */`
    uniform vec3 uBg; uniform float uCell, uMin, uMax, uScale, uFlow, uAngle, uContrast; uniform int uShape;
    void main(){
      vec2 px = cssPx(); float m = min(uRes.x, uRes.y);
      vec2 id = floor(px / uCell), c = (id + .5) * uCell, l = px - c;
      float a = radians(uAngle);
      vec2 p = c / m * uScale + vec2(cos(a), sin(a)) * uFlow * sin(uPh);
      float v = clamp((lfbm(p, uPh) - .5) * uContrast + .5, 0., 1.);
      float r = mix(uMin, uMax, v) * uCell * .5;
      float d = uShape == 0 ? length(l) - r
              : uShape == 1 ? max(abs(l.x), abs(l.y)) - r
              : length(max(abs(l) - r * .55, 0.)) - r * .45;
      float mask = 1. - smoothstep(-.75, .75, d);
      gl_FragColor = vec4(mix(uBg, pal(v), mask), 1.);
      #include <colorspace_fragment>
    }`,
});
