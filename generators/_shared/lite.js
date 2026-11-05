// Mini motor WebGL2 para generadores de shader a pantalla completa (sin Three.js, ~3 KB).
// Misma API que defineGenerator de runtime.js y el mismo manejo de color que Three.js:
// colores hex -> lineal (sRGB EOTF) en los uniforms; salida lineal -> sRGB (OETF) al final del shader.
import { makeNormalize } from './schema.js';
import { GLSL } from './glsl.js';

const PREFIX = `#version 300 es
precision highp float;
precision highp int;
out highp vec4 pc_fragColor;
#define gl_FragColor pc_fragColor
vec3 elaniinOETF(vec3 c){ return mix(pow(c, vec3(.41666)) * 1.055 - vec3(.055), c * 12.92, vec3(lessThanEqual(c, vec3(.0031308)))); }
`;
const VERT = '#version 300 es\nin vec2 p;\nvoid main(){ gl_Position = vec4(p, 0., 1.); }';
const OUT = 'gl_FragColor = vec4(elaniinOETF(gl_FragColor.rgb), gl_FragColor.a);';

const toLinear = c => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const rgb = hex => [1, 3, 5].map(i => toLinear(parseInt(hex.slice(i, i + 2), 16) / 255));
const isHex = v => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v);

function compile(gl, frag) {
  const sh = (type, src) => {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, PREFIX + GLSL + frag.replace('#include <colorspace_fragment>', OUT)));
  gl.bindAttribLocation(prog, 0, 'p');
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  // mapa nombre -> { loc, type, size } (los arrays vienen como "uC[0]")
  const uni = {};
  for (let i = 0, n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS); i < n; i++) {
    const info = gl.getActiveUniform(prog, i), name = info.name.replace(/\[0\]$/, '');
    uni[name] = { loc: gl.getUniformLocation(prog, info.name), type: info.type, size: info.size };
  }
  return { prog, uni };
}

function setUniform(gl, u, v) {
  if (!u) return;   // uniform que el shader no usa (el compilador lo eliminó)
  const T = gl, flat = Array.isArray(v) ? v.flatMap(x => (isHex(x) ? rgb(x) : x)) : isHex(v) ? rgb(v) : [v];
  switch (u.type) {
    case T.FLOAT: return gl.uniform1fv(u.loc, flat);
    case T.FLOAT_VEC2: return gl.uniform2fv(u.loc, flat);
    case T.FLOAT_VEC3: return gl.uniform3fv(u.loc, flat);
    case T.FLOAT_VEC4: return gl.uniform4fv(u.loc, flat);
    case T.INT: case T.BOOL: return gl.uniform1iv(u.loc, flat.map(Math.round));
    default: return undefined;
  }
}

export function defineGenerator({ DEFAULTS, controls, uniforms, loop = c => 12 / c.speed, describe, frag }) {
  const normalize = makeNormalize(DEFAULTS, controls);
  const loopSeconds = c => loop(normalize(c));
  const embedConfig = c => { const n = normalize(c), o = {}; for (const k of Object.keys(DEFAULTS)) o[k] = n[k]; return o; };

  async function mount(host, config, opts = {}) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;height:100%';
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, preserveDrawingBuffer: !!opts.preserve, powerPreference: 'high-performance' });
    if (!gl) throw new Error('Este navegador no tiene WebGL2.');
    const dpr = opts.dpr ?? Math.min(devicePixelRatio, 2);
    const { prog, uni } = compile(gl, frag);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);   // un triángulo cubre la pantalla
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    let cfg, w = 1, h = 1, ph = 0, mouse = [-1e4, -1e4];
    function resize(nw, nh) {
      w = Math.max(1, Math.round(nw)); h = Math.max(1, Math.round(nh));
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    function set(c) {
      cfg = normalize(c);
      const colors = (cfg.colors || []).slice(0, 6);
      setUniform(gl, uni.uC, [...colors, ...Array(6 - colors.length).fill('#000000')]);
      setUniform(gl, uni.uN, Math.max(1, colors.length));
      for (const [k, v] of Object.entries(uniforms(cfg))) setUniform(gl, uni[k], v);
      if (!running) renderAt(time);
    }
    function renderAt(t) {
      const L = loopSeconds(cfg);
      ph = ((((t % L) + L) % L) / L) * Math.PI * 2;
      setUniform(gl, uni.uRes, [w, h]); setUniform(gl, uni.uDpr, dpr);
      setUniform(gl, uni.uPh, ph); setUniform(gl, uni.uMouse, mouse);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    let time = 0, running = false, last = 0, raf = 0;
    const tick = now => { time += Math.min(0.05, (now - (last || now)) / 1000); last = now; renderAt(time); raf = requestAnimationFrame(tick); };
    const play = () => { if (running) return; running = true; last = 0; raf = requestAnimationFrame(tick); };
    const pause = () => { running = false; cancelAnimationFrame(raf); };

    const onMove = e => { const r = canvas.getBoundingClientRect(); mouse = [e.clientX - r.left, e.clientY - r.top]; if (!running) renderAt(time); };
    const onLeave = () => { mouse = [-1e4, -1e4]; if (!running) renderAt(time); };
    if (!opts.size) { host.addEventListener('pointermove', onMove, { passive: true }); host.addEventListener('pointerleave', onLeave); }

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
        host.removeEventListener('pointermove', onMove); host.removeEventListener('pointerleave', onLeave);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        canvas.remove();
      },
    };
  }

  return { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe: c => describe(normalize(c)), mount };
}
