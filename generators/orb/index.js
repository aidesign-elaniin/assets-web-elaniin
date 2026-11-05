// Generador "Orbe Luminoso": esfera con borde deformado, rim de color, gradiente interno, glow y grano.
// Ref. Pinterest: 1115063189023267063 (un solo pin; encaje alto como hero con #1054FF).
import { defineGenerator } from '../_shared/lite.js';   // WebGL puro, sin Three.js

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineGenerator({
  DEFAULTS: {
    colors: ['#01172e', '#023ca0', '#1054ff', '#6a9aff'], rim: '#b9cefb', background: '#01172e',
    radius: 0.32, wobble: 0.1, rimWidth: 0.12, glow: 0.6, grain: 0.05, x: 0.5, y: 0.5, speed: 1,
  },
  controls: [
    { title: 'Color', hint: 'Interior, del centro de luz hacia afuera.', items: [
      { type: 'colors', key: 'colors', min: 2, max: 6 },
      { type: 'color', key: 'rim', label: 'Borde (rim)' },
      { type: 'color', key: 'background', label: 'Fondo' },
    ] },
    { title: 'Forma', items: [
      { type: 'range', key: 'radius', label: 'Radio', min: 0.08, max: 0.6, step: 0.01 },
      { type: 'range', key: 'wobble', label: 'Ondulación', min: 0, max: 0.4, step: 0.005, digits: 3 },
      { type: 'range', key: 'x', label: 'Posición X', min: 0, max: 1, step: 0.01 },
      { type: 'range', key: 'y', label: 'Posición Y', min: 0, max: 1, step: 0.01 },
      { type: 'range', key: 'speed', label: 'Velocidad', min: 0.1, max: 4, step: 0.1, digits: 1, unit: '×' },
    ] },
    { title: 'Luz', items: [
      { type: 'range', key: 'rimWidth', label: 'Ancho del rim', min: 0.01, max: 0.4, step: 0.005, digits: 3 },
      { type: 'range', key: 'glow', label: 'Glow', min: 0, max: 1.5, step: 0.01 },
      { type: 'range', key: 'grain', label: 'Grano', min: 0, max: 0.2, step: 0.005, digits: 3 },
    ] },
  ],
  loop: c => 10 / c.speed,
  describe: c => `radio ${c.radius.toFixed(2)} · ${c.colors.length} colores`,
  uniforms: c => ({ uBg: c.background, uRim: c.rim, uRadius: c.radius, uWobble: c.wobble, uRimW: c.rimWidth, uGlow: c.glow, uGrain: c.grain, uPos: [c.x, c.y] }),
  frag: /* glsl */`
    uniform vec3 uBg, uRim; uniform float uRadius, uWobble, uRimW, uGlow, uGrain; uniform vec2 uPos;
    void main(){
      vec2 px = cssPx(); float m = min(uRes.x, uRes.y);
      vec2 p = (px - uPos * uRes) / m;
      float r = length(p), ang = atan(p.y, p.x);
      float edge = uRadius * (1. + uWobble * (lnoise(vec2(cos(ang), sin(ang)) * 1.4, uPh, .7) - .5) * 2.);
      float d = r - edge, aa = 1.5 / m;
      float inside = 1. - smoothstep(-aa, aa, d);
      vec2 lc = vec2(-.35, -.35) * edge;
      float t = length(p - lc) / (edge * 1.7) + (lnoise(p / max(uRadius, .01) * 1.2 + 4., uPh, .5) - .5) * .25;
      vec3 inner = pal(t);
      float rim = smoothstep(edge * (1. - uRimW * 2.), edge, r);
      inner = mix(inner, uRim, rim * rim * .85);
      float halo = exp(-max(d, 0.) / (uRadius * .35 + 1e-3)) * uGlow * (1. - inside);
      vec3 col = mix(uBg, inner, inside) + uRim * halo * .55;
      col += (hash2(px + floor(uPh * 24.)) - .5) * uGrain;
      gl_FragColor = vec4(col, 1.);
      #include <colorspace_fragment>
    }`,
});
