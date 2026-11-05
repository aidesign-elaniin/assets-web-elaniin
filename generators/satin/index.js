// Generador "Satén Líquido": superficie satinada con deformación de dominio y brillo especular suave.
// Ref. Pinterest: MotionHUB (1115063189023266937), 1115063189023267085, 1115063189023266692.
// Se distingue de Barridos por la forma orgánica y el especular (no hay bandas rectas).
import { defineGenerator } from '../_shared/lite.js';   // WebGL puro, sin Three.js

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineGenerator({
  DEFAULTS: {
    colors: ['#01172e', '#022b63', '#1054ff', '#b9cefb'], scale: 1.1, warp: 1.4,
    shine: 0.55, shineColor: '#ffffff', light: 135, grain: 0.04, speed: 1,
  },
  controls: [
    { title: 'Color', hint: 'Rampa de los valles a las crestas.', items: [
      { type: 'colors', key: 'colors', min: 2, max: 6 },
    ] },
    { title: 'Tela', items: [
      { type: 'range', key: 'scale', label: 'Escala', min: 0.3, max: 4, step: 0.05 },
      { type: 'range', key: 'warp', label: 'Deformación', min: 0, max: 3, step: 0.01 },
      { type: 'range', key: 'speed', label: 'Velocidad', min: 0.1, max: 4, step: 0.1, digits: 1, unit: '×' },
    ] },
    { title: 'Brillo', items: [
      { type: 'range', key: 'shine', label: 'Especular', min: 0, max: 1.5, step: 0.01 },
      { type: 'range', key: 'light', label: 'Dirección de luz', min: 0, max: 360, step: 5, digits: 0, unit: '°' },
      { type: 'color', key: 'shineColor', label: 'Color del brillo' },
      { type: 'range', key: 'grain', label: 'Grano', min: 0, max: 0.2, step: 0.005, digits: 3 },
    ] },
  ],
  loop: c => 14 / c.speed,
  describe: c => `${c.colors.length} colores · deformación ${c.warp.toFixed(1)}`,
  uniforms: c => ({ uScale: c.scale, uWarp: c.warp, uShine: c.shine, uShineC: c.shineColor, uLight: c.light, uGrain: c.grain }),
  frag: /* glsl */`
    uniform float uScale, uWarp, uShine, uLight, uGrain; uniform vec3 uShineC;
    float f3(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 3; i++) { s += a * lnoise(p, uPh, .5 + float(i) * .3); p = p * 2.01 + 7.3; a *= .5; } return s / .875; }
    void main(){
      vec2 px = cssPx(); float m = min(uRes.x, uRes.y);
      vec2 p = px / m * uScale;
      vec2 q = vec2(f3(p), f3(p + vec2(5.2, 1.3)));
      float h = f3(p + uWarp * (q - .5) * 2.);
      vec2 g = vec2(dFdx(h), dFdy(h)) * m * .9 / uDpr;
      vec3 n = normalize(vec3(-g, 1.));
      float la = radians(uLight);
      vec3 L = normalize(vec3(cos(la), sin(la), 1.2));
      float spec = pow(max(dot(reflect(-L, n), vec3(0., 0., 1.)), 0.), 18.);
      vec3 col = pal(smoothstep(.15, .85, h));
      col += uShineC * spec * uShine;
      col += (hash2(px + floor(uPh * 24.)) - .5) * uGrain;
      gl_FragColor = vec4(col, 1.);
      #include <colorspace_fragment>
    }`,
});
