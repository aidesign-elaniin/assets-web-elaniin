// Generador "Constelación": nodos a la deriva unidos por líneas según distancia, con fade de profundidad.
// Ref. Pinterest: 1115063189023266974. Cada nodo sigue una trayectoria Lissajous cerrada => loop perfecto.
// Evoca los nodos azules con halo conectados por líneas finas del diseñador (rogenizar · Firma).
import { defineGenerator, THREE, GLSL } from '../_shared/runtime.js';

const MAX = 220;

function rng(seed) {   // mulberry32: misma semilla => misma constelación en editor, embed y export
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineGenerator({
  DEFAULTS: {
    colors: ['#b9cefb', '#1054ff'], lineColor: '#6a9aff', background: '#01172e', nodes: 70, link: 0.32,
    size: 4, lineOpacity: 0.45, depth: 0.6, drift: 0.12, seed: 7, speed: 1,
  },
  controls: [
    { title: 'Color', hint: 'Nodos, de cerca a lejos.', items: [
      { type: 'colors', key: 'colors', min: 2, max: 4 },
      { type: 'color', key: 'lineColor', label: 'Líneas' },
      { type: 'color', key: 'background', label: 'Fondo' },
    ] },
    { title: 'Red', items: [
      { type: 'range', key: 'nodes', label: 'Nodos', min: 10, max: MAX, step: 1, digits: 0 },
      { type: 'range', key: 'link', label: 'Distancia de enlace', min: 0.05, max: 0.8, step: 0.01 },
      { type: 'range', key: 'size', label: 'Tamaño de nodo', min: 1, max: 12, step: 0.5, digits: 1 },
      { type: 'range', key: 'lineOpacity', label: 'Opacidad de líneas', min: 0, max: 1, step: 0.01 },
      { type: 'range', key: 'seed', label: 'Variación', min: 1, max: 999, step: 1, digits: 0 },
    ] },
    { title: 'Movimiento', items: [
      { type: 'range', key: 'drift', label: 'Deriva', min: 0, max: 0.5, step: 0.005, digits: 3 },
      { type: 'range', key: 'depth', label: 'Profundidad', min: 0, max: 1, step: 0.01 },
      { type: 'range', key: 'speed', label: 'Velocidad', min: 0.1, max: 4, step: 0.1, digits: 1, unit: '×' },
    ] },
  ],
  loop: c => 20 / c.speed,
  describe: c => `${c.nodes} nodos · enlace ${c.link.toFixed(2)}`,
  uniforms: c => ({ uSize: c.size, uDepth: c.depth }),
  init(renderer, U) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
    camera.position.set(0, 0, 3);
    const pPos = new Float32Array(MAX * 3);
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.ShaderMaterial({
      uniforms: U, transparent: true, depthWrite: false,
      vertexShader: /* glsl */`
        uniform float uSize, uDpr, uDepth; varying float vT, vA;
        void main(){
          vT = clamp(.5 - position.z * .5, 0., 1.);
          vA = 1. - vT * uDepth * .85;
          vec4 mv = modelViewMatrix * vec4(position, 1.);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * uDpr * (3. / -mv.z) * (1. - vT * uDepth * .5);
        }`,
      fragmentShader: GLSL + /* glsl */`
        varying float vT, vA;
        void main(){
          float d = length(gl_PointCoord - .5);
          float core = 1. - smoothstep(.22, .3, d), halo = (1. - smoothstep(.3, .5, d)) * .35;
          float a = max(core, halo) * vA;
          if (a < .01) discard;
          gl_FragColor = vec4(pal(vT), a);
          #include <colorspace_fragment>
        }`,
    });
    const points = new THREE.Points(pGeo, pMat);
    const maxSeg = (MAX * (MAX - 1)) / 2;
    const lPos = new Float32Array(maxSeg * 6), lCol = new Float32Array(maxSeg * 8);
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3));
    lGeo.setAttribute('color', new THREE.BufferAttribute(lCol, 4));
    const lMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false });
    const lines = new THREE.LineSegments(lGeo, lMat);
    scene.add(lines, points);

    let cfg, nodes = [], aspect = 1, seedKey = '';
    const lineRGB = new THREE.Color();
    return {
      scene, camera,
      apply(c) {
        cfg = c;
        scene.background = new THREE.Color(c.background);
        lineRGB.set(c.lineColor);
        if (seedKey !== c.seed + ':' + c.nodes) {
          seedKey = c.seed + ':' + c.nodes;
          const r = rng(c.seed);
          nodes = Array.from({ length: c.nodes }, () => ({
            b: [r() * 2 - 1, r() * 2 - 1, r() * 2 - 1],
            f: [1 + Math.floor(r() * 2), 1 + Math.floor(r() * 2), 1],
            o: [r() * 6.283, r() * 6.283, r() * 6.283],
            a: .4 + r() * .6,
          }));
        }
      },
      resize(w, h) { aspect = w / h; camera.aspect = aspect; camera.updateProjectionMatrix(); },
      frame(ph) {
        const n = nodes.length, sx = Math.max(aspect, 1) * 1.35, sy = Math.max(1 / aspect, 1) * 1.35, dr = cfg.drift;
        for (let i = 0; i < n; i++) {
          const N = nodes[i];
          pPos[i * 3] = (N.b[0] + dr * N.a * Math.sin(N.f[0] * ph + N.o[0])) * sx;
          pPos[i * 3 + 1] = (N.b[1] + dr * N.a * Math.sin(N.f[1] * ph + N.o[1])) * sy;
          pPos[i * 3 + 2] = N.b[2] * .9 + dr * N.a * Math.sin(N.f[2] * ph + N.o[2]);
        }
        pGeo.setDrawRange(0, n);
        pGeo.attributes.position.needsUpdate = true;
        const L = cfg.link * 2.2, L2 = L * L;
        let s = 0;
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
          const dx = pPos[i * 3] - pPos[j * 3], dy = pPos[i * 3 + 1] - pPos[j * 3 + 1], dz = pPos[i * 3 + 2] - pPos[j * 3 + 2];
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 > L2) continue;
          const a = (1 - Math.sqrt(d2) / L) * cfg.lineOpacity;
          for (let k = 0; k < 2; k++) {
            const src = (k ? j : i) * 3, v = s * 2 + k;
            lPos[v * 3] = pPos[src]; lPos[v * 3 + 1] = pPos[src + 1]; lPos[v * 3 + 2] = pPos[src + 2];
            lCol[v * 4] = lineRGB.r; lCol[v * 4 + 1] = lineRGB.g; lCol[v * 4 + 2] = lineRGB.b; lCol[v * 4 + 3] = a;
          }
          s++;
        }
        lGeo.setDrawRange(0, s * 2);
        lGeo.attributes.position.needsUpdate = true;
        lGeo.attributes.color.needsUpdate = true;
      },
    };
  },
});
