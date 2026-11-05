// "Paquete para sitio": todo lo que un proyecto (o una IA que lo construye) necesita para usar un asset
// sin depender de esta biblioteca en tiempo de ejecución: video en loop, póster, snippets y reglas.
// Recibe las funciones del loader (lib) para usar la misma instancia que la app.

const FFLATE = 'https://cdn.jsdelivr.net/npm/fflate@0.8.2/+esm';
// bitrates a 1080p: el contenido es abstracto y lento, comprime bien; 'Alto' evita banding en gradientes muy suaves
export const QUALITY = { light: ['Ligero', 1.2e6], balanced: ['Equilibrado', 2.5e6], high: ['Alto', 5e6] };

// bitrate por calidad, escalado al área del video (referencia 1080p)
export const bitrateFor = (quality, w, h) => Math.max(6e5, Math.round(QUALITY[quality][1] * ((w * h) / (1920 * 1080))));
const kb = n => (n >= 1e6 ? (n / 1e6).toFixed(1) + ' MB' : Math.round(n / 1e3) + ' KB');
const pascal = s => (s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : '')).replace(/^./, c => c.toUpperCase()).replace(/^(\d)/, 'Asset$1')) || 'ElaniinAsset';

export async function buildPack(lib, asset, { slug, generatorName, width, height, quality = 'balanced', webm = true, loops = 1, embedUrl, libraryUrl, onProgress = () => {} }) {
  const { encodeVideo, renderImage, loadGenerator } = lib;
  const gen = await loadGenerator(asset.type);
  const cfg = gen.normalize(asset), L = gen.loopSeconds(cfg), seconds = L * loops;
  const base = `public/assets/elaniin/${slug}`, url = `/assets/elaniin/${slug}`, Name = pascal(cfg.name || slug);
  const bitrate = bitrateFor(quality, width, height);
  const files = {}, sizes = {};
  const steps = webm ? [0.05, 0.55, 1] : [0.05, 1];   // reparto aproximado del progreso

  onProgress(0, 'Póster');
  const poster = await renderImage(asset, { width, height, type: 'image/webp', time: 0 });   // primer cuadro del loop
  files['poster.webp'] = new Uint8Array(await poster.arrayBuffer()); sizes.poster = poster.size;

  onProgress(steps[0], 'MP4 (H.264)');
  const mp4 = await encodeVideo(asset, { width, height, seconds, codec: 'avc', bitrate, onProgress: p => onProgress(steps[0] + (steps[1] - steps[0]) * p, 'MP4 (H.264)') });
  files[`${slug}.mp4`] = new Uint8Array(await mp4.blob.arrayBuffer()); sizes.mp4 = mp4.blob.size;

  let hasWebm = false, webmNote = '';
  if (webm) {
    try {
      onProgress(steps[1], 'WebM (VP9)');
      const w = await encodeVideo(asset, { width, height, seconds, codec: 'vp9', bitrate: Math.round(bitrate * 0.75), onProgress: p => onProgress(steps[1] + (steps[2] - steps[1]) * p, 'WebM (VP9)') });
      files[`${slug}.webm`] = new Uint8Array(await w.blob.arrayBuffer()); sizes.webm = w.blob.size; hasWebm = true;
    } catch (err) { webmNote = err.message; }   // Safari no codifica VP9: el paquete sale solo con MP4
  }

  const ratio = `${width} / ${height}`, srcWebm = hasWebm ? `\n    <source src="${url}/${slug}.webm" type="video/webm">` : '';
  const config = { type: asset.type, name: cfg.name, aspect: cfg.aspect, ...gen.embedConfig(cfg) };
  const enc = s => new TextEncoder().encode(s);

  files['asset.json'] = enc(JSON.stringify(config, null, 2));
  files['snippet.html'] = enc(`<!-- ${cfg.name} · Elaniin Assets (${generatorName}) · ${width}×${height} · loop ${seconds.toFixed(1)} s -->
<!-- Copia la carpeta a ${base}/. Para fondo de sección: contenedor position:relative y este div con position:absolute; inset:0. -->
<div class="elaniin-asset" style="position:relative;aspect-ratio:${ratio};overflow:hidden">
  <video autoplay muted loop playsinline preload="metadata" poster="${url}/poster.webp" aria-hidden="true"
    style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">${srcWebm}
    <source src="${url}/${slug}.mp4" type="video/mp4">
  </video>
</div>
<script>
  // Pausa fuera de pantalla y respeta "reducir movimiento" (queda el póster).
  document.querySelectorAll('.elaniin-asset video').forEach(v => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { v.removeAttribute('autoplay'); v.pause(); return; }
    new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause())).observe(v);
  });
</script>
`);
  files[`${Name}.tsx`] = enc(`// ${cfg.name} · Elaniin Assets (${generatorName}) · ${width}×${height} · loop ${seconds.toFixed(1)} s
// Va en components/elaniin/. Videos y póster en ${base}/. Decorativo (aria-hidden). priority = true solo si está en el primer pantallazo.
'use client';
import { useEffect, useRef } from 'react';

type Props = { className?: string; priority?: boolean; fill?: boolean };

export default function ${Name}({ className, priority = false, fill = false }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { v.pause(); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <div className={className} style={fill ? { position: 'absolute', inset: 0, overflow: 'hidden' } : { position: 'relative', aspectRatio: '${ratio}', overflow: 'hidden' }}>
      <video
        ref={ref} autoPlay muted loop playsInline aria-hidden="true"
        preload={priority ? 'auto' : 'metadata'} poster="${url}/poster.webp"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      >${hasWebm ? `\n        <source src="${url}/${slug}.webm" type="video/webm" />` : ''}
        <source src="${url}/${slug}.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
`);
  files['AGENTS.md'] = enc(`# ${cfg.name}

Asset de **Elaniin Assets** · generador ${generatorName} (\`${asset.type}\`) · ${width}×${height} (${cfg.aspect}) · loop perfecto de ${seconds.toFixed(1)} s.

## Archivos

| Archivo | Qué es | Peso |
|---|---|---|
| \`${slug}.mp4\` | H.264, funciona en todos los navegadores | ${kb(sizes.mp4)} |
${hasWebm ? `| \`${slug}.webm\` | VP9, más liviano; el navegador lo elige si puede | ${kb(sizes.webm)} |\n` : ''}| \`poster.webp\` | Primer cuadro del loop. Sirve de imagen fija | ${kb(sizes.poster)} |
| \`${Name}.tsx\` | Componente React / Next.js listo | — |
| \`snippet.html\` | Mismo resultado en HTML plano | — |
| \`asset.json\` | Configuración para regenerarlo o editarlo en la biblioteca | — |
${webmNote ? `\n> Sin WebM: ${webmNote}\n` : ''}
## Reglas para quien lo integre (persona o IA)

1. Copia los videos y \`poster.webp\` a \`${base}/\` (Next.js, Vite, Astro) o al directorio estático del proyecto. Sirve los archivos desde el propio sitio: no enlaces a URLs externas.
2. En React/Next mueve \`${Name}.tsx\` a la carpeta de componentes (por ejemplo \`components/elaniin/\`) e impórtalo desde ahí; no lo dejes en \`public/\`. En HTML usa \`snippet.html\`. No quites \`muted\`, \`loop\` ni \`playsInline\`: sin ellos el autoplay falla en iOS.
3. Es decorativo: deja \`aria-hidden\`. El significado va en el texto de la sección.
4. Reserva el espacio (\`aspect-ratio: ${ratio}\`) para no mover el layout. Como fondo de sección: contenedor \`position: relative\` y \`<${Name} fill />\`.
5. En el primer pantallazo usa \`priority\` (preload auto). Más abajo deja el valor por defecto (\`preload="metadata"\`).
6. Ya pausa fuera de pantalla y respeta "reducir movimiento" (queda el póster). No lo reimplementes.
7. Máximo 2 o 3 videos por página. Para cards o miniaturas usa \`poster.webp\` como imagen (\`<img loading="lazy">\`).
8. ¿Hace falta interacción (por ejemplo, reaccionar al cursor)? Usa el embed vivo, con poster: ver ${libraryUrl}#/guia
9. Para cambiar colores o textos, abre \`asset.json\` en ${libraryUrl} (Biblioteca → Importar), edítalo y exporta otro paquete.

## Embed vivo equivalente (solo si hace falta interacción)

\`\`\`html
<script type="module" src="${embedUrl}"></script>
<elaniin-asset type="${asset.type}" poster="${url}/poster.webp" style="display:block;width:100%;aspect-ratio:${ratio}"
  config='${JSON.stringify(gen.embedConfig(cfg)).replace(/'/g, '&#39;')}'></elaniin-asset>
\`\`\`
`);

  onProgress(1, 'Comprimiendo');
  const { zipSync } = await import(FFLATE);
  const tree = {};
  for (const [name, data] of Object.entries(files)) tree[`${slug}/${name}`] = [data, { level: /\.(mp4|webm|webp)$/.test(name) ? 0 : 6 }];
  const zip = zipSync(tree);
  return { blob: new Blob([zip], { type: 'application/zip' }), sizes, hasWebm, webmNote, seconds };
}
