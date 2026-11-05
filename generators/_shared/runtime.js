// Base común de generadores: bucle de render, validación desde `controls`, GLSL compartido.
// Un generador de shader puro solo declara DEFAULTS, controls, frag y apply (ver defineShader).

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.min.js';
export { THREE };

export { makeNormalize } from './schema.js';
import { makeNormalize } from './schema.js';

// Montaje genérico. init(renderer, U) devuelve { scene, camera, resize?(w,h), frame?(ph,t), apply?(cfg), dispose? }.
// U trae uRes (px CSS), uDpr, uPh (0..2π por loop), uMouse (px CSS, -1e4 = fuera), uC[6]/uN (colores).
export function createMount({ normalize, loopSeconds, init, uniforms }) {
  return async function mount(host, config, opts = {}) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: !!opts.preserve, powerPreference: 'high-performance' });
    const dpr = opts.dpr ?? Math.min(devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);
    const canvas = renderer.domElement;
    canvas.style.cssText = 'display:block;width:100%;height:100%';
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);

    const U = {
      uRes: { value: new THREE.Vector2(1, 1) }, uDpr: { value: dpr }, uPh: { value: 0 },
      uMouse: { value: new THREE.Vector2(-1e4, -1e4) },
      uC: { value: Array.from({ length: 6 }, () => new THREE.Color()) }, uN: { value: 2 },
    };
    // uniforms propios: '#hex' -> Color, arrays de hex -> Color[], números tal cual
    const first = uniforms(normalize(config));
    for (const [k, v] of Object.entries(first)) U[k] = { value: typeof v === 'string' ? new THREE.Color(v) : v };
    const view = init(renderer, U);

    let cfg, w = 1, h = 1;
    function resize(nw, nh) {
      w = Math.max(1, Math.round(nw)); h = Math.max(1, Math.round(nh));
      renderer.setSize(w, h, false);
      U.uRes.value.set(w, h);
      view.resize?.(w, h);
    }
    function set(c) {
      cfg = normalize(c);
      (cfg.colors || []).forEach((x, i) => i < 6 && U.uC.value[i].set(x));
      U.uN.value = Math.min(6, (cfg.colors || []).length || 1);
      for (const [k, v] of Object.entries(uniforms(cfg))) {
        if (U[k].value?.isColor) U[k].value.set(v); else U[k].value = v;
      }
      view.apply?.(cfg);
      if (!running) renderAt(time);
    }
    function renderAt(t) {
      const L = loopSeconds(cfg);
      U.uPh.value = ((((t % L) + L) % L) / L) * Math.PI * 2;
      view.frame?.(U.uPh.value, t);
      renderer.render(view.scene, view.camera);
    }

    let time = 0, running = false, last = 0;
    const tick = now => { time += Math.min(0.05, (now - (last || now)) / 1000); last = now; renderAt(time); };
    const play = () => { if (running) return; running = true; last = 0; renderer.setAnimationLoop(tick); };
    const pause = () => { running = false; renderer.setAnimationLoop(null); };

    const onMove = e => { const r = canvas.getBoundingClientRect(); U.uMouse.value.set(e.clientX - r.left, e.clientY - r.top); if (!running) renderAt(time); };
    const onLeave = () => { U.uMouse.value.set(-1e4, -1e4); if (!running) renderAt(time); };
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
        view.dispose?.();
        view.scene.traverse(o => { o.geometry?.dispose(); o.material?.dispose(); });
        renderer.dispose(); renderer.forceContextLoss();
        canvas.remove();
      },
    };
  };
}

// Generador de shader a pantalla completa: arma todos los exports del contrato.
export function defineGenerator({ DEFAULTS, controls, uniforms, loop = c => 12 / c.speed, describe, frag, init }) {
  const normalize = makeNormalize(DEFAULTS, controls);
  const loopSeconds = c => loop(normalize(c));
  const embedConfig = c => { const n = normalize(c), o = {}; for (const k of Object.keys(DEFAULTS)) o[k] = n[k]; return o; };
  init ??= (renderer, U) => {
    const scene = new THREE.Scene(), camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
      uniforms: U, fragmentShader: GLSL + frag, depthTest: false, depthWrite: false,
      vertexShader: 'void main(){ gl_Position = vec4(position.xy, 0., 1.); }',
    })));
    return { scene, camera };
  };
  return {
    DEFAULTS, controls, normalize, loopSeconds, embedConfig,
    describe: c => describe(normalize(c)),
    mount: createMount({ normalize, loopSeconds, init, uniforms }),
  };
}

export { NOISE, GLSL } from './glsl.js';
import { GLSL } from './glsl.js';
