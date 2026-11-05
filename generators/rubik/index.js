// Generador "Cubo Rubik": cubo 3×3 en estilo lineal (caras planas + aristas finas) con un texto por cara.
// Cada cubito lleva su fragmento del glifo: los giros de capa desarman el texto y los giros inversos lo arman.
// Ciclo por cara lateral: armado → desarma (giros + separación) → arma (giros inversos) → gira 90° a la siguiente.
// Tras 4 caras vuelve exacto al inicio => loop perfecto. Ref.: video ref1 (tipografía en cubo Rubik).
import { defineGenerator, THREE } from '../_shared/runtime.js';

const FACES = ['front', 'right', 'back', 'left', 'top', 'bottom'];
// ejes "derecha" y "arriba" de cada cara vista desde afuera (para que el glifo quede derecho en el cubo armado)
const FRAME = {
  front: { n: [0, 0, 1], r: [1, 0, 0], u: [0, 1, 0] },
  back: { n: [0, 0, -1], r: [-1, 0, 0], u: [0, 1, 0] },
  right: { n: [1, 0, 0], r: [0, 0, -1], u: [0, 1, 0] },
  left: { n: [-1, 0, 0], r: [0, 0, 1], u: [0, 1, 0] },
  top: { n: [0, 1, 0], r: [1, 0, 0], u: [0, 0, -1] },
  bottom: { n: [0, -1, 0], r: [1, 0, 0], u: [0, 0, 1] },
};
// orden de las caras de BoxGeometry: +x, -x, +y, -y, +z, -z
const BOX = ['right', 'left', 'top', 'bottom', 'front', 'back'];
const SIDES = ['front', 'right', 'back', 'left'];
// fracciones de cada tramo dentro del segmento de una cara (suman 1)
const T = { hold: 0.18, out: 0.27, mid: 0.07, back: 0.27, rest: 0.11, turn: 0.10 };

function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function scramble(seed, n) {
  const r = rng(seed), out = [];
  while (out.length < n) {
    const m = { axis: Math.floor(r() * 3), layer: Math.floor(r() * 3) - 1, dir: r() < 0.5 ? -1 : 1 };
    const p = out.at(-1);
    if (p && p.axis === m.axis && p.layer === m.layer) continue;   // sin deshacer el giro anterior
    out.push(m);
  }
  return out;
}
const ease = v => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
const clamp01 = v => Math.min(1, Math.max(0, v));

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineGenerator({
  DEFAULTS: {
    front: 'E', right: 'L', back: 'A', left: 'N', top: 'I', bottom: '27',
    weight: 0.7, glyph: '#01172e', cube: '#ffffff', line: '#01172e', lineOpacity: 0.35, background: '#ffffff',
    moves: 6, explode: 0.35, seed: 11, speed: 1, yaw: 24, pitch: 18, zoom: 1,
  },
  controls: [
    { title: 'Texto por cara', hint: 'Las 4 laterales se muestran en orden; arriba y abajo aparecen al desarmarse. Hasta 3 caracteres por cara.', items: [
      { type: 'text', key: 'front', label: 'Frente', max: 3 },
      { type: 'text', key: 'right', label: 'Derecha', max: 3 },
      { type: 'text', key: 'back', label: 'Atrás', max: 3 },
      { type: 'text', key: 'left', label: 'Izquierda', max: 3 },
      { type: 'text', key: 'top', label: 'Arriba', max: 3 },
      { type: 'text', key: 'bottom', label: 'Abajo', max: 3 },
    ] },
    { title: 'Color', items: [
      { type: 'color', key: 'glyph', label: 'Texto' },
      { type: 'range', key: 'weight', label: 'Grosor del texto', min: 0, max: 1, step: 0.01 },
      { type: 'color', key: 'cube', label: 'Cubitos' },
      { type: 'color', key: 'line', label: 'Aristas' },
      { type: 'range', key: 'lineOpacity', label: 'Opacidad de aristas', min: 0, max: 1, step: 0.01 },
      { type: 'color', key: 'background', label: 'Fondo' },
    ] },
    { title: 'Armado', items: [
      { type: 'range', key: 'moves', label: 'Giros al desarmar', min: 2, max: 12, step: 1, digits: 0 },
      { type: 'range', key: 'explode', label: 'Separación de piezas', min: 0, max: 1, step: 0.01 },
      { type: 'range', key: 'seed', label: 'Variación', min: 1, max: 999, step: 1, digits: 0 },
      { type: 'range', key: 'speed', label: 'Velocidad', min: 0.25, max: 3, step: 0.05, digits: 2, unit: '×' },
    ] },
    { title: 'Cámara', items: [
      { type: 'range', key: 'yaw', label: 'Giro', min: -45, max: 45, step: 1, digits: 0, unit: '°' },
      { type: 'range', key: 'pitch', label: 'Inclinación', min: -40, max: 40, step: 1, digits: 0, unit: '°' },
      { type: 'range', key: 'zoom', label: 'Zoom', min: 0.5, max: 1.6, step: 0.01 },
    ] },
  ],
  loop: c => 24 / c.speed,
  describe: c => `${[c.front, c.right, c.back, c.left].join('·')} · ${c.moves} giros`,
  uniforms: () => ({}),
  init(renderer) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(22, 1, 0.1, 100);
    const root = new THREE.Group(); scene.add(root);

    // texturas: un canvas por cara con su glifo; cada cubito toma su tercio
    const canvases = {}, textures = {}, faceMats = {};
    for (const f of FACES) {
      const cv = document.createElement('canvas'); cv.width = cv.height = 768;
      canvases[f] = cv;
      const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4;
      textures[f] = tx;
      faceMats[f] = new THREE.MeshBasicMaterial({ map: tx, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
    }
    const innerMat = new THREE.MeshBasicMaterial({ color: 0xffffff, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
    const lineMat = new THREE.LineBasicMaterial({ color: 0x01172e, transparent: true, opacity: 0.35 });
    const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.96, 0.96, 0.96));

    // 27 cubitos con UVs calculadas desde su posición en el cubo armado
    const cubies = [];
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
      const geo = new THREE.BoxGeometry(0.96, 0.96, 0.96);
      const pos = geo.attributes.position, uv = geo.attributes.uv;
      for (let i = 0; i < pos.count; i++) {
        const face = BOX[Math.floor(i / 4)], F = FRAME[face];
        const p = [x + pos.getX(i) / 0.96, y + pos.getY(i) / 0.96, z + pos.getZ(i) / 0.96];   // ±0.48 del cubito -> ±0.5 de su celda
        const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        uv.setXY(i, (dot(p, F.r) + 1.5) / 3, (dot(p, F.u) + 1.5) / 3);
      }
      const outer = BOX.map(f => { const n = FRAME[f].n; return n[0] === x && x !== 0 || n[1] === y && y !== 0 || n[2] === z && z !== 0; });
      const mesh = new THREE.Mesh(geo, BOX.map((f, k) => (outer[k] ? faceMats[f] : innerMat)));
      mesh.add(new THREE.LineSegments(edges, lineMat));
      root.add(mesh);
      cubies.push({ mesh, home: new THREE.Vector3(x, y, z) });
    }

    let cfg, segs = [], aspect = 1;
    const AX = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];
    const q = new THREE.Quaternion(), v = new THREE.Vector3();

    function paint() {
      for (const f of FACES) {
        const cv = canvases[f], g = cv.getContext('2d'), S = cv.width, text = (cfg[f] || '').trim();
        g.fillStyle = cfg.cube; g.fillRect(0, 0, S, S);
        if (text) {
          g.fillStyle = cfg.glyph; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
          // glifo grande y pesado como en la referencia: relleno + trazo del mismo color (grosor editable)
          const font = sz => `600 ${sz}px "Instrument Sans", "Inter", "Helvetica Neue", Arial, sans-serif`;
          const stroke = k => k * 0.11 * cfg.weight;
          let size = S;
          g.font = font(size);
          let m = g.measureText(text);
          const box = S * 0.88, w0 = m.width + stroke(size), h0 = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent + stroke(size);
          size *= Math.min(box / w0, box / h0);
          g.font = font(size); m = g.measureText(text);
          const y = S / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
          g.fillText(text, S / 2, y);
          if (cfg.weight > 0) { g.strokeStyle = cfg.glyph; g.lineWidth = stroke(size); g.lineJoin = 'miter'; g.miterLimit = 3; g.strokeText(text, S / 2, y); }
        }
        textures[f].needsUpdate = true;
      }
    }
    // la fuente puede llegar después: repintar cuando cargue
    document.fonts?.load('600 100px "Instrument Sans"').then(() => cfg && paint()).catch(() => {});

    // estado de cada cubito tras aplicar giros completos (posición entera + orientación)
    function applyMoves(moves) {
      const st = cubies.map(c => ({ p: c.home.clone(), q: new THREE.Quaternion() }));
      for (const m of moves) {
        q.setFromAxisAngle(AX[m.axis], (m.dir * Math.PI) / 2);
        for (const s of st) if (Math.round(s.p.getComponent(m.axis)) === m.layer) { s.p.applyQuaternion(q).round(); s.q.premultiply(q); }
      }
      return st;
    }
    function place(st, partial, k, gap) {
      const spread = 1 + gap * 0.42;
      st.forEach((s, i) => {
        const mesh = cubies[i].mesh;
        v.copy(s.p); mesh.quaternion.copy(s.q);
        if (partial && Math.round(s.p.getComponent(partial.axis)) === partial.layer) {
          q.setFromAxisAngle(AX[partial.axis], (partial.dir * Math.PI) / 2 * k);
          v.applyQuaternion(q); mesh.quaternion.premultiply(q);
        }
        mesh.position.copy(v).multiplyScalar(spread);
      });
    }

    return {
      scene, camera,
      apply(c) {
        cfg = c;
        scene.background = new THREE.Color(c.background);
        innerMat.color.set(c.cube);
        lineMat.color.set(c.line); lineMat.opacity = c.lineOpacity; lineMat.visible = c.lineOpacity > 0.001;
        segs = SIDES.map((_, i) => scramble(c.seed * 7 + i * 131, c.moves));
        paint();
      },
      resize(w, h) { aspect = w / h; camera.aspect = aspect; camera.updateProjectionMatrix(); },
      frame(ph) {
        const u = ph / (Math.PI * 2), seg = Math.min(3, Math.floor(u * 4)), s = u * 4 - seg;
        const moves = segs[seg], M = moves.length;
        const a = T.hold, b = a + T.out, cmid = b + T.mid, d = cmid + T.back, e = d + T.rest;
        let st, partial = null, k = 0, gap = 0;
        if (s < a || s >= d) st = applyMoves([]);
        else if (s < b) {   // desarma
          const x = ((s - a) / T.out) * M, n = Math.floor(x);
          st = applyMoves(moves.slice(0, n)); partial = moves[n]; k = ease(x - n); gap = ease((s - a) / T.out);
        } else if (s < cmid) { st = applyMoves(moves); gap = 1; }
        else {   // arma: giros inversos en orden contrario
          const inv = moves.slice().reverse().map(m => ({ ...m, dir: -m.dir }));
          const x = ((s - cmid) / T.back) * M, n = Math.min(M - 1, Math.floor(x));
          st = applyMoves([...moves, ...inv.slice(0, n)]); partial = inv[n]; k = ease(x - n); gap = 1 - ease((s - cmid) / T.back);
        }
        place(st, partial, k, gap * cfg.explode);
        // giro de 90° a la siguiente cara lateral (4 caras = 360° => loop exacto)
        const turn = s >= e ? ease((s - e) / T.turn) : 0;
        root.rotation.set(0, -(seg + turn) * (Math.PI / 2), 0);
        // cámara: casi frontal, con giro e inclinación editables; encuadra el cubo con su separación máxima
        const r = 2.9 * (1 + cfg.explode * 0.42), dist = r / Math.sin(THREE.MathUtils.degToRad(11)) / cfg.zoom / Math.min(1, aspect) ** 0.5;
        const yaw = THREE.MathUtils.degToRad(cfg.yaw), pitch = THREE.MathUtils.degToRad(cfg.pitch);
        camera.position.set(Math.sin(yaw) * Math.cos(pitch) * dist, Math.sin(pitch) * dist, Math.cos(yaw) * Math.cos(pitch) * dist);
        camera.lookAt(0, 0, 0);
      },
      dispose() { Object.values(textures).forEach(t => t.dispose()); edges.dispose(); },
    };
  },
});
