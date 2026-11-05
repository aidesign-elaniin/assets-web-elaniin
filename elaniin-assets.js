// Elaniin Assets — loader único. Lo usan la biblioteca y los sitios.
//
//   <script type="module" src="https://aidesign-elaniin.github.io/assets-web-elaniin/elaniin-assets.js"></script>
//   <elaniin-asset type="glass-grid" style="display:block;aspect-ratio:16/9" config='{…}'></elaniin-asset>
//
// Cada generador vive en generators/<id>/index.js y solo se descarga si una página lo usa.
// Para agregar uno: crea la carpeta y suma una línea aquí (ver README → Agregar un generador).

export const GENERATORS = {
  'glass-grid': {
    name: 'Glass Grid',
    description: 'Cuadrícula fija de vidrio esmerilado sobre formas y gradientes en movimiento. Cubo modelado en Blender.',
  },
  sweeps: {
    name: 'Barridos',
    description: 'Fondos con barridos diagonales difusos, glows de esquina y trama de puntos, grilla o rayas. El lenguaje de los CTA y cards del sitio Elaniin.',
  },
  iso: { name: 'Iso Stack', description: 'Pila isométrica de losas de vidrio con etiquetas, riser y pulso de luz. El kit oficial del hero Elaniin, editable capa por capa.' },
  halftone: { name: 'Halftone Fluido', description: 'Grilla de puntos cuyo tamaño sigue un ruido que fluye. Trama de impresión en movimiento.' },
  dither: { name: 'Píxel Dither', description: 'Gradiente pixelado con dither Bayer y un borde que se disuelve entre 2 a 4 colores.' },
  led: { name: 'Matriz LED', description: 'Grilla de LEDs con niveles de brillo: onda, escaneo, destellos, pulso o ruido. Reacciona al cursor.' },
  topo: { name: 'Topografía', description: 'Curvas de nivel animadas con curvas maestras y relleno por bandas. Line art técnico.' },
  satin: { name: 'Satén Líquido', description: 'Superficie satinada que se pliega, con brillo especular suave y grano.' },
  orb: { name: 'Orbe Luminoso', description: 'Esfera con borde ondulante, rim de color, gradiente interno y glow. Pensado para heros.' },
  wave: { name: 'Onda de Partículas', description: 'Malla 3D de puntos ondulada por ruido, en perspectiva y con niebla de profundidad.' },
  constellation: { name: 'Constelación', description: 'Nodos a la deriva unidos por líneas según distancia, con profundidad. Evoca los nodos con halo del sitio.' },
};
export const DEFAULT_TYPE = 'glass-grid';

const modules = {};
export function loadGenerator(type) {
  // el registro es solo catálogo: un sitio con este archivo en caché igual puede cargar generadores nuevos
  if (!/^[a-z0-9-]+$/.test(type || '')) return Promise.reject(new Error(`Tipo de generador inválido: "${type}"`));
  // hereda el ?t= del loader: si la app pidió versión fresca, los generadores también llegan frescos
  return (modules[type] ??= import(new URL(`./generators/${type}/index.js${new URL(import.meta.url).search}`, import.meta.url).href));
}
export const mount = async (host, asset, opts) => (await loadGenerator(asset.type || DEFAULT_TYPE)).mount(host, asset, opts);

// ---------- exportación (sirve para cualquier generador) ----------
function offscreenHost(width, height) {
  const el = document.createElement('div');
  el.style.cssText = `position:fixed;left:-20000px;top:0;width:${width}px;height:${height}px;pointer-events:none`;
  document.body.appendChild(el);
  return el;
}
const stillTime = (gen, cfg) => gen.loopSeconds(gen.normalize(cfg)) * 0.12;

// Miniaturas: un contexto WebGL por generador, reutilizado para todas sus imágenes.
export async function snapshots(assets, { width = 640, height = 480, type = 'image/webp' } = {}) {
  const out = new Array(assets.length);
  const byType = {};
  assets.forEach((a, i) => (byType[a.type || DEFAULT_TYPE] ??= []).push(i));
  for (const [t, idx] of Object.entries(byType)) {
    const gen = await loadGenerator(t), host = offscreenHost(width, height);
    const g = await gen.mount(host, assets[idx[0]], { size: [width, height], dpr: 1, autoplay: false, preserve: true });
    try {
      for (const i of idx) {
        g.set(assets[i]);
        g.renderAt(stillTime(gen, assets[i]));
        out[i] = await new Promise(r => g.canvas.toBlob(r, type, 0.9));
      }
    } finally { g.destroy(); host.remove(); }
  }
  return out;
}

export async function renderImage(asset, { width, height, type = 'image/png', time } = {}) {
  const gen = await loadGenerator(asset.type || DEFAULT_TYPE), host = offscreenHost(width, height);
  const g = await gen.mount(host, asset, { size: [width, height], dpr: 1, autoplay: false, preserve: true });
  try {
    g.renderAt(time ?? stillTime(gen, asset));
    return await new Promise(r => g.canvas.toBlob(r, type, 0.95));
  } finally { g.destroy(); host.remove(); }
}

export function videoMime() {
  return ['video/mp4;codecs=avc1.640028', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm']
    .find(m => window.MediaRecorder && MediaRecorder.isTypeSupported(m)) || null;
}

// Graba en tiempo real. ponytail: si la GPU no llega a 60fps se pierden cuadros;
// render cuadro a cuadro con WebCodecs cuando haga falta calidad de estudio.
export async function recordVideo(asset, { width = 1920, height = 1080, seconds, fps = 60, bitrate = 16e6, onProgress } = {}) {
  const mime = videoMime();
  if (!mime) throw new Error('Este navegador no puede grabar video.');
  const gen = await loadGenerator(asset.type || DEFAULT_TYPE), host = offscreenHost(width, height);
  const g = await gen.mount(host, asset, { size: [width, height], dpr: 1, autoplay: false });
  const dur = seconds ?? gen.loopSeconds(g.config);
  const rec = new MediaRecorder(g.canvas.captureStream(fps), { mimeType: mime, videoBitsPerSecond: bitrate });
  const chunks = [];
  rec.ondataavailable = e => e.data.size && chunks.push(e.data);
  const done = new Promise(r => (rec.onstop = r));
  g.renderAt(0);
  rec.start(250);
  const t0 = performance.now();
  await new Promise(resolve => {
    const step = () => {
      const t = (performance.now() - t0) / 1000;
      if (t >= dur) return resolve();
      g.renderAt(t);
      onProgress?.(t / dur);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
  rec.stop();
  await done;
  g.destroy(); host.remove();
  onProgress?.(1);
  return { blob: new Blob(chunks, { type: mime.split(';')[0] }), ext: mime.startsWith('video/mp4') ? 'mp4' : 'webm' };
}

// ---------- web component ----------
class ElaniinAsset extends HTMLElement {
  static observedAttributes = ['type', 'config', 'src'];
  async connectedCallback() {
    if (this._g || this._busy) return;
    this._busy = true;
    const cs = getComputedStyle(this);
    if (cs.display === 'inline') this.style.display = 'block';
    if (cs.position === 'static') this.style.position = 'relative';
    this.style.overflow = 'hidden';
    try {
      const a = await this._read();
      this._type = a.type;
      this._g = await mount(this, a, { autoplay: false });
    } catch (err) { console.error('[elaniin-asset]', err); this._busy = false; return; }
    this._busy = false;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    this._io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !reduce.matches) this._g.play(); else this._g.pause();
    });
    this._io.observe(this);
  }
  disconnectedCallback() { this._io?.disconnect(); this._g?.destroy(); this._g = null; }
  async attributeChangedCallback() {
    if (!this._g) return;
    const a = await this._read();
    if (a.type !== this._type) { this.disconnectedCallback(); this.connectedCallback(); } else this._g.set(a);
  }
  async _read() {
    let cfg = {};
    try {
      cfg = this.getAttribute('src') ? await (await fetch(this.getAttribute('src'))).json() : JSON.parse(this.getAttribute('config') || '{}');
    } catch (err) { console.warn('[elaniin-asset] config inválida', err); }
    return { ...cfg, type: this.getAttribute('type') || cfg.type || DEFAULT_TYPE };
  }
}
if (!customElements.get('elaniin-asset')) customElements.define('elaniin-asset', ElaniinAsset);
