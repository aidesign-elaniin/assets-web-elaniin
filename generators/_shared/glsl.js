// GLSL común de los generadores (sin dependencias): ruido 4D en loop, rampa de color, px CSS.
// Lo usan runtime.js (Three.js) y lite.js (WebGL puro).

// n4/lnoise/lfbm: ruido muestreado sobre un círculo en 4D => evoluciona y vuelve exacto al inicio del loop.
export const NOISE = /* glsl */`
  const float TAU = 6.2831853;
  float hash4(vec4 p){ p = fract(p * vec4(.1031, .1030, .0973, .1099)); p += dot(p, p.wzxy + 33.33); return fract((p.x + p.y) * (p.z + p.w)); }
  float hash2(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
  float n4(vec4 p){
    vec4 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f);
    #define H(a,b,c,d) hash4(i + vec4(a,b,c,d))
    float z0 = mix(mix(mix(H(0.,0.,0.,0.), H(1.,0.,0.,0.), u.x), mix(H(0.,1.,0.,0.), H(1.,1.,0.,0.), u.x), u.y),
                   mix(mix(H(0.,0.,1.,0.), H(1.,0.,1.,0.), u.x), mix(H(0.,1.,1.,0.), H(1.,1.,1.,0.), u.x), u.y), u.z);
    float z1 = mix(mix(mix(H(0.,0.,0.,1.), H(1.,0.,0.,1.), u.x), mix(H(0.,1.,0.,1.), H(1.,1.,0.,1.), u.x), u.y),
                   mix(mix(H(0.,0.,1.,1.), H(1.,0.,1.,1.), u.x), mix(H(0.,1.,1.,1.), H(1.,1.,1.,1.), u.x), u.y), u.z);
    #undef H
    return mix(z0, z1, u.w);
  }
  float lnoise(vec2 p, float ph, float r){ return n4(vec4(p, r * cos(ph), r * sin(ph))); }
  float lfbm(vec2 p, float ph){
    float s = 0., a = .5;
    for (int i = 0; i < 4; i++) { s += a * lnoise(p, ph, .6 + float(i) * .35); p = p * 2.03 + 11.7; a *= .5; }
    return s / .9375;
  }`;

export const GLSL = /* glsl */`
  uniform vec2 uRes, uMouse; uniform float uDpr, uPh; uniform vec3 uC[6]; uniform int uN;
  ${NOISE}
  vec2 cssPx(){ vec2 p = gl_FragCoord.xy / uDpr; return vec2(p.x, uRes.y - p.y); }   // px CSS, y hacia abajo
  vec3 pal(float t){
    t = clamp(t, 0., 1.) * float(uN - 1);
    vec3 c = uC[0];
    for (int i = 1; i < 6; i++) { if (i >= uN) break; c = mix(c, uC[i], clamp(t - float(i - 1), 0., 1.)); }
    return c;
  }
  vec4 outColor(vec3 c){ return vec4(c, 1.); }
`;
