// Exportación "Código (.md)": un Markdown con el código EXACTO del asset (no una descripción),
// para que Claude Code u otra IA lo agregue al sitio sin binarios ni dependencias de esta biblioteca.
// Empaqueta el generador y sus módulos compartidos en un solo archivo ES (bundler mínimo para el estilo de este repo).

const ROOT = new URL('./', import.meta.url);

// ---------- bundler mínimo ----------
// Soporta lo que usa este repo: import { a, b as c } / import * as NS (locales o URL), export const|function|let|class,
// export const { A, B } = …, export { a, b }, export { a } from './x.js', import.meta.url.
async function bundle(entryPath, publicBase) {
  const mods = new Map(), order = [], hoisted = new Set();
  const text = async url => (await fetch(url, { cache: 'no-cache' })).text();

  async function visit(url) {
    if (mods.has(url)) return mods.get(url);
    const rec = { id: `__m${mods.size}`, url }; mods.set(url, rec);
    let src = await text(url);
    const pre = [], names = new Set(), declared = new Set();
    const local = from => /^\.\.?\//.test(from);
    // import ... from '...'
    const imports = [];
    src = src.replace(/^import\s+([^'"]+?)\s+from\s+'([^']+)';[^\n]*$/gm, (_, what, from) => { imports.push({ what: what.trim(), from }); return ''; });
    // export { … } from '...'
    const reexports = [];
    src = src.replace(/^export\s*\{([^}]*)\}\s*from\s+'([^']+)';[^\n]*$/gm, (_, list, from) => { reexports.push({ list, from }); return ''; });
    for (const im of [...imports, ...reexports.map(r => ({ what: `{${r.list}}`, from: r.from, re: true }))]) {
      if (!local(im.from)) {
        if (!im.re) hoisted.add(`import ${im.what} from '${im.from}';`);
        continue;
      }
      const dep = await visit(new URL(im.from, url).href);
      if (im.what.startsWith('* as ')) pre.push(`const ${im.what.slice(5).trim()} = ${dep.id};`);
      else {
        const binds = im.what.replace(/[{}]/g, '').split(',').map(s => s.trim()).filter(Boolean);
        for (const b of binds) {   // una declaración por nombre: import + re-export del mismo nombre no se duplica
          const [orig, alias = orig] = b.split(/\s+as\s+/).map(s => s.trim());
          if (!declared.has(alias)) { declared.add(alias); pre.push(`const ${alias} = ${dep.id}.${orig};`); }
          if (im.re) names.add(alias);
        }
      }
    }
    // exports locales
    src = src.replace(/^export\s+const\s+\{([^}]*)\}\s*=/gm, (_, list) => { list.split(',').map(s => s.trim()).filter(Boolean).forEach(n => names.add(n.split(':').pop().trim())); return `const {${list}} =`; });
    src = src.replace(/^export\s+(async\s+function|function|const|let|class)\s+([A-Za-z_$][\w$]*)/gm, (_, kw, name) => { names.add(name); return `${kw} ${name}`; });
    src = src.replace(/^export\s*\{([^}]*)\};?[^\n]*$/gm, (_, list) => { list.split(',').map(s => s.trim()).filter(Boolean).forEach(n => names.add(n.split(/\s+as\s+/).pop())); return ''; });
    // import.meta.url -> URL pública versionada del módulo original (para recursos como tiles.json)
    const rel = url.slice(ROOT.href.length).split('?')[0];
    src = src.replace(/import\.meta\.url/g, JSON.stringify(publicBase + rel));
    rec.code = `// ── ${rel} ──\nconst ${rec.id} = (() => {\n${pre.join('\n')}\n${src.trim()}\nreturn { ${[...names].join(', ')} };\n})();`;
    order.push(rec);
    return rec;
  }

  const entry = await visit(new URL(entryPath, ROOT).href);
  return { code: [...hoisted].join('\n') + (hoisted.size ? '\n\n' : '') + order.map(m => m.code).join('\n\n'), entryId: entry.id, external: [...hoisted] };
}

// ---------- montaje autocontenido (se agrega al final del bundle) ----------
const MOUNT = gen => `
// ── API pública ──
export const CONFIG = __CONFIG__;
export const loopSeconds = () => ${gen}.loopSeconds(CONFIG);
// Monta el asset dentro de "el" (ocupa todo el elemento). Solo cuando está a 200 px de la pantalla;
// se pausa fuera de ella, dibuja a fps cuadros por segundo con densidad máxima dpr y, con
// "reducir movimiento", queda quieto en el primer cuadro. Devuelve { destroy, set }.
export function mountAsset(el, overrides = {}, { fps = 30, dpr = 1.5 } = {}) {
  if (!el) throw new Error('mountAsset: falta el elemento');
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  el.style.overflow = 'hidden';
  let cfg = { ...CONFIG, ...overrides }, g = null, raf = 0, io = null, dead = false;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const start = async () => {
    g = await ${gen}.mount(el, cfg, { autoplay: false, dpr: Math.min(devicePixelRatio || 1, dpr) });
    if (dead) { g.destroy(); return; }
    if (reduce) { g.time = 0; return; }
    let last = 0, acc = 0, t = 0;
    const loop = now => {
      raf = requestAnimationFrame(loop);
      acc += last ? Math.min(0.1, (now - last) / 1000) : 0; last = now;
      if (acc >= 1 / fps - 0.002) { t += acc; acc = 0; g.time = t; }
    };
    io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !raf) { last = 0; raf = requestAnimationFrame(loop); }
      else if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0; }
    });
    io.observe(el);
  };
  const near = new IntersectionObserver(([e]) => { if (e.isIntersecting) { near.disconnect(); start(); } }, { rootMargin: '200px' });
  near.observe(el);
  return {
    destroy() { dead = true; near.disconnect(); io?.disconnect(); cancelAnimationFrame(raf); g?.destroy(); },
    set(c) { cfg = { ...cfg, ...c }; g?.set(cfg); },
  };
}
`;

const fmt = v => String(Array.isArray(v) ? (v.every(x => typeof x === 'object') ? `${v.length} elementos` : v.join(', ')) : typeof v === 'number' ? +v.toFixed(3) : v);
const getP = (o, k) => k.split('.').reduce((x, p) => x?.[p], o);
const pascal = s => (s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : '')).replace(/^./, c => c.toUpperCase()).replace(/^(\d)/, 'Asset$1')) || 'ElaniinAsset';

export async function buildCodeMd(asset, { gen, slug, generatorName, release, libraryUrl, publicBase }) {
  const cfg = gen.normalize(asset), conf = gen.embedConfig(cfg), Name = pascal(cfg.name || slug), file = `elaniin-${slug}.js`;
  const aspect = cfg.aspect || '16:9', [aw, ah] = aspect.split(':').map(Number);
  const { code, entryId, external } = await bundle(`generators/${asset.type}/index.js`, publicBase);
  const header = `// ${cfg.name} · Elaniin Assets · generador ${generatorName} (${asset.type}) · v${release}\n// Generado automáticamente por ${libraryUrl} — edita CONFIG o pasa overrides a mountAsset(); el resto es el motor.\n`;
  const js = header + code + MOUNT(entryId).replace('__CONFIG__', JSON.stringify(conf, null, 2));
  const kb = (new Blob([js]).size / 1024).toFixed(1);
  const deps = external.length ? external.map(i => i.match(/'([^']+)'/)[1]) : [];
  const three = deps.some(d => d.includes('three'));
  const params = gen.controls.flatMap(s => s.items.map(it => ({ s: s.title, it })))
    .map(({ s, it }) => {
      const range = it.type === 'range' ? `${it.min} – ${it.max}` : it.options ? Object.keys(it.options).map(k => `\`${k}\``).join(' · ') : it.type === 'colors' ? `${it.min}–${it.max} hex` : it.type === 'color' ? 'hex' : it.type === 'list' ? `${it.min}–${it.max} elementos` : it.type === 'text' ? `texto (máx. ${it.max ?? 40})` : '';
      return `| ${s} | \`${it.key}\` | ${it.label ?? (it.type === 'colors' ? 'Colores' : it.type === 'multi' ? 'Secuencia' : it.key)} | ${fmt(getP(cfg, it.key)).replace(/\|/g, '/')} | ${range} |`;
    }).join('\n');

  return `# ${cfg.name}

Asset de **Elaniin Assets** · generador **${generatorName}** (\`${asset.type}\`) · proporción ${aspect} · loop perfecto de ${gen.loopSeconds(cfg).toFixed(1)} s · v${release}.

> **Para Claude Code / IA:** este documento contiene el código EXACTO del asset. No lo reescribas ni lo "mejores": crea los archivos tal cual y sigue las reglas. Para cambiar el look, edita \`CONFIG\` o pasa \`overrides\` a \`mountAsset\` usando la tabla de parámetros.

## Pasos

1. Crea \`${file}\` con el bloque de código de abajo (en Next.js: \`components/elaniin/${file}\`; en HTML: junto a tu página).
2. Crea el componente \`components/elaniin/${Name}.tsx\` (React/Next.js) o usa el snippet HTML. En TypeScript importar \`.js\` requiere \`allowJs: true\` en \`tsconfig.json\` (Next.js lo trae por defecto).
3. Colócalo en la sección pedida. Es decorativo: \`aria-hidden="true"\` y el significado va en el texto.
${three ? `4. Dependencia: \`three@0.169.0\`. Se importa desde jsDelivr; si el proyecto usa npm, ejecuta \`npm i three@0.169.0\` y cambia esa línea a \`import * as THREE from 'three';\`.\n` : `4. No tiene dependencias: ${kb} KB de JavaScript, WebGL/Canvas nativo.\n`}
## Componente React / Next.js — \`components/elaniin/${Name}.tsx\`

\`\`\`tsx
'use client';
import { useEffect, useRef } from 'react';
import { mountAsset, CONFIG } from './${file}';

type Props = { className?: string; fill?: boolean; config?: Partial<typeof CONFIG> };

// fill: ocupa todo el contenedor (fondo de sección; el padre necesita position: relative).
export default function ${Name}({ className, fill = false, config }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const key = JSON.stringify(config ?? {});
  useEffect(() => {
    const handle = mountAsset(ref.current!, config);
    return () => handle.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={className}
      style={fill ? { position: 'absolute', inset: 0 } : { position: 'relative', width: '100%', aspectRatio: '${aw} / ${ah}' }}
    />
  );
}
\`\`\`

## HTML

\`\`\`html
<div id="${slug}" aria-hidden="true" style="position:relative;width:100%;aspect-ratio:${aw}/${ah}"></div>
<script type="module">
  import { mountAsset } from './${file}';
  mountAsset(document.getElementById('${slug}'));
</script>
\`\`\`

## Código del asset — \`${file}\` (${kb} KB${three ? ', usa three@0.169.0' : ', sin dependencias'})

\`\`\`js
${js}
\`\`\`

## Parámetros (\`CONFIG\`)

| Sección | Clave | Qué es | Valor actual | Rango / opciones |
|---|---|---|---|---|
${params}

Ejemplo: \`mountAsset(el, { colors: ['#1054ff', '#6a9aff'] })\` o \`<${Name} config={{ speed: 0.5 }} />\`. Colores: solo la paleta Elaniin (#1054FF, rampa #D7E2F8 → #01172E, #F0F0F3).

## Reglas

- Ya pausa fuera de pantalla, limita a 30 fps y densidad 1.5, y respeta "reducir movimiento". No lo reimplementes.
- Reserva el espacio (\`aspect-ratio: ${aw} / ${ah}\`) o usa \`fill\` dentro de un contenedor con alto definido.
- Máximo 2 o 3 assets animados por página. Si va en el hero y el LCP importa, considera el **Paquete para sitio** (video) de la biblioteca.
- Para cambios grandes, ábrelo en ${libraryUrl} (Biblioteca → Importar este CONFIG con \`"type": "${asset.type}"\`), edítalo y exporta otro \`.md\`.
`;
}
