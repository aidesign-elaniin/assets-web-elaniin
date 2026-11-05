// Generador "Topografía": curvas de nivel de ruido que se mueven, con bandas opcionales.
// Ref. Pinterest: Adobe Stock "White topographic animated background" (1115063189023266914), 1115063189023267085.
// Encaja con el line art técnico de 1px del diseñador (rogenizar · Firma).
import { defineGenerator } from '../_shared/lite.js';   // WebGL puro, sin Three.js

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineGenerator({
  DEFAULTS: {
    colors: ['#b9cefb', '#1054ff'], background: '#ffffff', levels: 14, line: 1, index: 5,
    scale: 1.1, warp: 0.5, bands: 0, speed: 1,
  },
  controls: [
    { title: 'Color', hint: 'De las zonas bajas a las altas.', items: [
      { type: 'colors', key: 'colors', min: 2, max: 6 },
      { type: 'color', key: 'background', label: 'Fondo' },
    ] },
    { title: 'Curvas', items: [
      { type: 'range', key: 'levels', label: 'Niveles', min: 3, max: 40, step: 1, digits: 0 },
      { type: 'range', key: 'line', label: 'Grosor de línea', min: 0.5, max: 4, step: 0.1, digits: 1, unit: ' px' },
      { type: 'range', key: 'index', label: 'Curva maestra cada', min: 0, max: 10, step: 1, digits: 0 },
      { type: 'range', key: 'bands', label: 'Relleno por bandas', min: 0, max: 1, step: 0.01 },
    ] },
    { title: 'Terreno', items: [
      { type: 'range', key: 'scale', label: 'Escala', min: 0.2, max: 4, step: 0.05 },
      { type: 'range', key: 'warp', label: 'Deformación', min: 0, max: 2, step: 0.01 },
      { type: 'range', key: 'speed', label: 'Velocidad', min: 0.1, max: 4, step: 0.1, digits: 1, unit: '×' },
    ] },
  ],
  loop: c => 16 / c.speed,
  describe: c => `${c.levels} niveles · ${c.bands > 0 ? 'bandas' : 'líneas'}`,
  uniforms: c => ({ uBg: c.background, uLevels: c.levels, uLine: c.line, uIndex: c.index, uScale: c.scale, uWarp: c.warp, uBands: c.bands }),
  frag: /* glsl */`
    uniform vec3 uBg; uniform float uLevels, uLine, uIndex, uScale, uWarp, uBands;
    void main(){
      vec2 px = cssPx(); float m = min(uRes.x, uRes.y);
      vec2 p = px / m * uScale;
      vec2 w = vec2(lnoise(p * .7 + 3.1, uPh, .5), lnoise(p * .7 + 8.3, uPh, .5)) - .5;
      float hgt = clamp((lfbm(p + w * uWarp, uPh) - .5) * 2.4 + .5, 0., 1.);   // el fbm vive cerca de .5: estirar
      float f = hgt * uLevels;
      float aa = fwidth(f);
      float n = floor(f + .5);
      bool major = uIndex > .5 && mod(n, uIndex) < .5;
      float lw = uLine * (major ? 2. : 1.) * .5 * uDpr;
      float e = abs(f - n) / max(aa, 1e-4);
      float line = 1. - smoothstep(lw - .5, lw + .5, e);
      vec3 base = mix(uBg, pal(floor(f) / uLevels), uBands * .35);
      gl_FragColor = vec4(mix(base, pal(hgt), line), 1.);
      #include <colorspace_fragment>
    }`,
});
