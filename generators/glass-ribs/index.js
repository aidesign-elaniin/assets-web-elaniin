// Generador "Glass Ribs": vidrio acanalado (estrías) fijo sobre formas y gradientes en movimiento.
// Mismo fondo que Glass Grid (formas que mutan + gradiente de 2–6 colores) y material editable
// (esmerilado, refracción, IOR, brillo). Shader puro: cada estría actúa como lente cilíndrica.
import { defineGenerator } from '../_shared/runtime.js';

const SHAPES = { circle: 'Círculo', square: 'Cuadrado', triangle: 'Triángulo', ring: 'Anillo', diamond: 'Rombo', cross: 'Cruz', blob: 'Orgánico' };
const SHAPE_IDS = Object.keys(SHAPES);
const ICONS = {
  circle: '<circle cx="12" cy="12" r="7"/>', square: '<rect x="5" y="5" width="14" height="14" rx="2"/>', triangle: '<path d="M12 5l7.5 13h-15z"/>',
  ring: '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="3.5"/>', diamond: '<path d="M12 3.5l8.5 8.5-8.5 8.5L3.5 12z"/>',
  cross: '<path d="M9.5 4h5v5.5H20v5h-5.5V20h-5v-5.5H4v-5h5.5z"/>', blob: '<path d="M12 4.5c3 0 7 1.5 7 6s-2.5 9-7 9-7.5-3-7-7.5 4-7.5 7-7.5z"/>',
};
const PROFILES = { round: 'Redondo', prism: 'Prisma', flat: 'Plano' };

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineGenerator({
  DEFAULTS: {
    colors: ['#1054ff', '#4d75fd', '#6a9aff', '#d7e2f8'], background: '#ffffff',
    shapes: ['blob', 'circle', 'diamond'], hold: 4, size: 1.1, softness: 0.22, speed: 1,
    rib: 30, angle: 0, profile: 'round', frost: 0.35, refraction: 1, ior: 1.45, shine: 0.5,
  },
  controls: [
    { title: 'Gradiente', items: [
      { type: 'colors', key: 'colors', min: 2, max: 6 },
      { type: 'color', key: 'background', label: 'Fondo' },
    ] },
    { title: 'Formas', hint: 'El orden en que las eliges es la secuencia de la animación.', items: [
      { type: 'multi', key: 'shapes', options: SHAPES, icons: ICONS, min: 1 },
      { type: 'range', key: 'hold', label: 'Tiempo por forma', min: 1, max: 12, step: 0.5, digits: 1, unit: ' s' },
      { type: 'range', key: 'size', label: 'Tamaño', min: 0.2, max: 2.5, step: 0.05 },
      { type: 'range', key: 'softness', label: 'Difuminado', min: 0.01, max: 1.2, step: 0.01 },
      { type: 'range', key: 'speed', label: 'Velocidad', min: 0.1, max: 4, step: 0.1, digits: 1, unit: '×' },
    ] },
    { title: 'Estrías', items: [
      { type: 'range', key: 'rib', label: 'Ancho de estría', min: 6, max: 120, step: 1, digits: 0, unit: ' px' },
      { type: 'range', key: 'angle', label: 'Ángulo', min: -90, max: 90, step: 1, digits: 0, unit: '°' },
      { type: 'seg', key: 'profile', label: 'Perfil', options: PROFILES },
    ] },
    { title: 'Vidrio', items: [
      { type: 'range', key: 'frost', label: 'Esmerilado', min: 0, max: 1, step: 0.01 },
      { type: 'range', key: 'refraction', label: 'Refracción', min: 0, max: 3, step: 0.05 },
      { type: 'range', key: 'ior', label: 'IOR', min: 1, max: 2.2, step: 0.01 },
      { type: 'range', key: 'shine', label: 'Brillo de arista', min: 0, max: 1, step: 0.01 },
    ] },
  ],
  loop: c => (c.shapes.length > 1 ? c.shapes.length * c.hold : Math.max(c.hold * 3, 8)) / c.speed,
  describe: c => `${c.rib}px · ${PROFILES[c.profile].toLowerCase()} · ${c.colors.length} colores`,
  uniforms: c => {
    const ids = c.shapes.map(s => SHAPE_IDS.indexOf(s));
    return {
      uBg: c.background, uSize: c.size, uSoft: c.softness,
      uShapes: Array.from({ length: 7 }, (_, i) => ids[i] ?? 0), uNS: ids.length,
      uMorph: Math.min(0.5, 0.9 / (c.hold / c.speed)),
      uRib: c.rib, uAngle: c.angle, uProfile: Object.keys(PROFILES).indexOf(c.profile),
      uFrost: c.frost, uRefr: c.refraction, uIor: c.ior, uShine: c.shine,
    };
  },
  frag: /* glsl */`
    uniform vec3 uBg; uniform float uSize, uSoft, uMorph, uRib, uAngle, uFrost, uRefr, uIor, uShine;
    uniform int uShapes[7]; uniform int uNS, uProfile;
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
    // fondo: la misma escena de Glass Grid (forma que muta + gradiente que fluye), periódica en uPh
    vec3 scene(vec2 px){
      float m = min(uRes.x, uRes.y);
      vec2 p = (px - uRes * .5) / (m * .5);
      int A = uShapes[0], B = A; float mx = 0.;
      if (uNS > 1) {
        float seg = uPh / TAU * float(uNS); int i = int(floor(seg)) % uNS; float f = fract(seg);
        float k = clamp((f - (1. - uMorph)) / uMorph, 0., 1.);
        A = uShapes[i]; B = uShapes[(i + 1) % uNS]; mx = k * k * (3. - 2. * k);
      }
      vec2 q = rot(sin(uPh) * .5) * (p - vec2(sin(uPh), cos(uPh)) * .15);
      float d = mix(shape(A, q, uSize), shape(B, q, uSize), mx);
      d += .05 * sin(q.x * 3. + uPh * 2.) * sin(q.y * 3. - uPh * 2.);
      float msk = 1. - smoothstep(-uSoft, uSoft, d);
      float n = .5 + .25 * sin(p.x * 2. + uPh * 2.) + .25 * sin(p.y * 1.6 - uPh * 3. + sin(p.x * 1.1 + uPh));
      float g = dot(p, vec2(cos(uPh), sin(uPh))) * .4 + .5;
      return mix(uBg, pal(mix(g, n, .5)), msk);
    }
    void main(){
      vec2 px = cssPx();
      float a = radians(uAngle);
      vec2 across = vec2(cos(a), sin(a)), along = vec2(-across.y, across.x);
      float w = uRib, t = dot(px, across) / w, local = fract(t) - .5;   // -.5 … .5 dentro de la estría
      // cada estría es una lente cilíndrica: comprime (o invierte) lo que hay detrás hacia su centro
      // y lo corre a lo largo de la estría => los bordes del color salen en dientes de sierra
      float S = 1. - uRefr * (.45 + (uIor - 1.));                       // 1 = sin lente · <0 = imagen invertida
      float lp = uProfile == 0 ? sin(local * 3.14159) * .5 : local;      // redondo: curva · prisma: lineal
      float u = dot(px, across), v = dot(px, along);
      float uS = uProfile == 2 ? u : (floor(t) + .5) * w + lp * w * S;
      float vS = v + (uProfile == 2 ? 0. : lp * w * uRefr * .9);
      vec2 sp = across * uS + along * vS;
      // esmerilado: promedio de muestras a lo largo de la estría (el vidrio estira la imagen) y un poco a lo ancho
      vec3 col = vec3(0.); float tot = 0.;
      for (int i = 0; i < 9; i++) {
        float s = float(i) / 8. - .5, wt = 1. - abs(s) * 1.2;
        vec2 o = along * s * uFrost * w * 7. + across * s * uFrost * w * .35;
        col += scene(sp + o) * wt; tot += wt;
      }
      col /= tot;
      // arista: luz en un borde, sombra suave en el otro (volumen de cada estría)
      float px1 = 1. / w;
      float hl = smoothstep(.16, 0., local + .5) + .5 * smoothstep(px1 * 2., 0., abs(local + .5));
      float sh = smoothstep(.3, 0., .5 - local);
      col = mix(col, vec3(1.), clamp(hl, 0., 1.) * uShine * .55);
      col *= 1. - sh * uShine * .18;
      // volumen de la lente: cada estría va de clara a oscura de un borde al otro
      col *= 1. + (-local) * uShine * .22;
      gl_FragColor = vec4(col, 1.);
      #include <colorspace_fragment>
    }`,
});
