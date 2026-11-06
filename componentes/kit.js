// Componentes Elaniin: HTML → JSX, Markdown para IA y documento de vista previa.
// Corre en el navegador (usa <template> para parsear). data.js se pide con la misma marca ?t que este módulo.
const SELF = new URL(import.meta.url);
const data = await import(new URL('./data.js' + SELF.search, SELF).href);
export const { CATS, COMPONENTS, IMG } = data;

export const SITE = 'https://aidesign-elaniin.github.io/assets-web-elaniin/';
export const CSS_URL = SITE + 'componentes/elaniin.css';
const FONTS = 'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,400;9..40,500&family=Geist+Mono:wght@400;500&display=swap';
const TW = 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.3.3';
export const catName = id => CATS.find(([k]) => k === id)?.[1] ?? id;

// Quita la sangría común del template literal de data.js.
export function html(c) {
  const lines = c.html.replace(/^\n+|\s+$/g, '').split('\n');
  const pad = Math.min(...lines.filter(l => l.trim()).map(l => l.match(/^ */)[0].length));
  return lines.map(l => l.slice(pad)).join('\n');
}

/* ---------- HTML → JSX ---------- */
const RENAME = { class: 'className', for: 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly', maxlength: 'maxLength', minlength: 'minLength', autocomplete: 'autoComplete', autofocus: 'autoFocus', inputmode: 'inputMode', colspan: 'colSpan', rowspan: 'rowSpan', srcset: 'srcSet', crossorigin: 'crossOrigin', novalidate: 'noValidate', datetime: 'dateTime', fetchpriority: 'fetchPriority', popovertarget: 'popoverTarget', popovertargetaction: 'popoverTargetAction', enterkeyhint: 'enterKeyHint', spellcheck: 'spellCheck' };
const BOOL = new Set(['disabled', 'required', 'open', 'hidden', 'multiple', 'readonly', 'autofocus', 'novalidate', 'inert', 'checked']);
const EVENTS = { click: 'onClick', input: 'onInput', change: 'onChange', keydown: 'onKeyDown', paste: 'onPaste', submit: 'onSubmit', focus: 'onFocus', blur: 'onBlur', pointermove: 'onPointerMove', pointerleave: 'onPointerLeave' };
const camel = s => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const text = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\{/g, '&#123;').replace(/\}/g, '&#125;').replace(/ /g, '&nbsp;');
const quote = (k, v) => (/["\n]/.test(v) ? `${k}={${JSON.stringify(v)}}` : `${k}="${v}"`);

function attrs(el) {
  const out = [], tag = el.localName;
  for (const { name, value } of el.attributes) {
    if (name === 'style') {
      const props = value.split(';').map(d => d.trim()).filter(Boolean).map(d => {
        const i = d.indexOf(':'), k = d.slice(0, i).trim(), v = d.slice(i + 1).trim();
        return `${k.startsWith('--') ? `'${k}'` : camel(k)}: ${JSON.stringify(v).replace(/^"|"$/g, "'")}`;
      });
      out.push(`style={{ ${props.join(', ')} }}`);
      continue;
    }
    if (name.startsWith('on')) { out.push(`${EVENTS[name.slice(2)] ?? 'on' + name[2].toUpperCase() + name.slice(3)}={(event) => { ${value.trim().replace(/;?$/, ';')} }}`); continue; }
    if (name === 'selected' && tag === 'option') continue;
    let key = RENAME[name] ?? (/^(aria|data)-/.test(name) ? name : camel(name));
    if (name === 'checked') key = 'defaultChecked';
    if (name === 'value' && (tag === 'textarea' || (tag === 'input' && !/^(checkbox|radio|submit|reset|button|hidden)$/.test(el.type)))) key = 'defaultValue';
    if (name === 'popover' && !value) { out.push('popover="auto"'); continue; }
    out.push(value === '' && BOOL.has(name) ? key : quote(key, value));
  }
  if (tag === 'select') {   // <option selected> → defaultValue en el <select>
    const o = el.querySelector('option[selected]');
    if (o) out.push(quote('defaultValue', o.getAttribute('value') ?? o.textContent));
  }
  return out;
}

function jsxNode(n, depth, compact, pre) {
  const pad = compact ? '' : '  '.repeat(depth);
  if (n.nodeType === 8) return pad + `{/* ${n.data.trim()} */}`;
  if (n.nodeType === 3) return pre && /\n/.test(n.data) ? `{${JSON.stringify(n.data)}}` : text(n.data.replace(/\s+/g, ' '));
  if (n.nodeType !== 1 || n.localName === 'script') return '';
  const tag = n.localName, a = attrs(n);
  const open = `<${tag}${a.length ? ' ' + a.join(' ') : ''}`;
  const inner = [...n.childNodes].filter(k => !(k.nodeType === 3 && !k.data.trim()));
  if (!inner.length) return pad + open + ' />';
  const inPre = pre || tag === 'pre';
  // Texto mezclado con elementos: todo en una línea, así se conservan los espacios entre ellos.
  if (compact || inner.some(k => k.nodeType === 3)) {
    const body = [...n.childNodes].map(k => jsxNode(k, 0, true, inPre)).join('').replace(/\s+/g, ' ').trim();
    return pad + open + '>' + body + `</${tag}>`;
  }
  return `${pad}${open}>\n${inner.map(k => jsxNode(k, depth + 1, false, inPre)).filter(Boolean).join('\n')}\n${pad}</${tag}>`;
}

const pascal = id => id.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());

export function jsx(c) {
  if (c.jsx) return c.jsx;
  const t = document.createElement('template');
  t.innerHTML = html(c);
  const roots = [...t.content.childNodes].filter(k => (k.nodeType === 1 && k.localName !== 'script') || (k.nodeType === 3 && k.data.trim()));
  const multi = roots.length > 1;
  const body = roots.map(k => jsxNode(k, multi ? 3 : 2, false, false)).join('\n');
  return `export default function ${pascal(c.id)}() {\n  return (\n${multi ? `    <>\n${body}\n    </>` : body}\n  );\n}\n`;
}

/* ---------- Markdown para IA ---------- */
const INSTALL = `1. Tailwind CSS v4.
2. \`elaniin.css\` (tokens Elaniin + clases de componentes), guardado junto al CSS global:

\`\`\`bash
curl -o src/styles/elaniin.css ${CSS_URL}
\`\`\`

\`\`\`css
/* CSS global (p. ej. src/styles/globals.css) */
@import "tailwindcss";
@import "./elaniin.css";
\`\`\`

   Si el proyecto ya tiene \`tokens.css\` de Elaniin, reemplázalo por \`elaniin.css\` (lo incluye).
3. Fuentes: Instrument Sans (títulos y botones), DM Sans (texto) y Geist Mono (etiquetas y código).

\`\`\`html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
\`\`\``;

const AI_RULES = `- Crea el componente tal cual: no cambies clases, colores, radios ni tamaños.
- \`elaniin.css\` quita la paleta por defecto de Tailwind: una clase como \`bg-red-500\` no compila. Usa solo los tokens Elaniin.
- Cambia solo textos, enlaces e imágenes. Las imágenes del ejemplo son de la biblioteca de assets de Elaniin.
- Conserva los atributos de accesibilidad (\`aria-*\`, \`alt\`, \`label\`, \`role\`).
- Si el proyecto usa React, usa la versión JSX; si no, la HTML.`;

const rulesMd = c => c.rules.map(r => `- ${r}`).join('\n');
const fence = (lang, code) => `\`\`\`${lang}\n${code.trim()}\n\`\`\``;

export function markdown(c) {
  return `# ${c.name} · Componente Elaniin (\`${c.id}\`)

> ${c.desc}

Categoría: ${catName(c.cat)}. Vista en vivo: ${SITE}#/componentes?c=${c.id}

## Requisitos

${INSTALL}

## Instrucciones para la IA

${AI_RULES}

## HTML

${fence('html', html(c))}

## React (JSX)

${fence('jsx', jsx(c))}

## Reglas de uso

${rulesMd(c)}
`;
}

export function markdownAll() {
  const toc = CATS.map(([k, n]) => `- **${n}:** ${COMPONENTS.filter(c => c.cat === k).map(c => `${c.name} (\`${c.id}\`)`).join(', ')}`).join('\n');
  const body = CATS.map(([k, n]) => `# ${n}\n\n` + COMPONENTS.filter(c => c.cat === k).map(c => `## ${c.name} (\`${c.id}\`)

> ${c.desc}

### HTML

${fence('html', html(c))}

### React (JSX)

${fence('jsx', jsx(c))}

### Reglas de uso

${rulesMd(c)}
`).join('\n')).join('\n');
  return `# Componentes Elaniin

> ${COMPONENTS.length} componentes de interfaz (los de daisyUI) rehechos solo con tokens Elaniin, en HTML y React. Biblioteca con vista en vivo: ${SITE}#/componentes

Archivo generado desde la biblioteca (Componentes → componentes.md). No lo edites a mano.

## Requisitos

${INSTALL}

## Instrucciones para la IA

${AI_RULES}

## Índice

${toc}

${body}`;
}

/* ---------- vista previa (iframe srcdoc con el elaniin.css real) ---------- */
let cssText = null;
export async function css() {
  return (cssText ??= await fetch(new URL('./elaniin.css' + SELF.search, SELF), { cache: 'no-cache' }).then(r => r.text()));
}

export function srcdoc(c, styles) {
  const body = html(c).replaceAll(IMG, new URL('./img/', SELF).href);
  const layout = c.full ? '' : `grid ${c.at === 'top' ? 'content-start' : 'content-center'} justify-items-center bg-surface-subtle p-6 md:p-10`;
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="${FONTS}">
<style>html{visibility:hidden}</style>
<script src="${TW}"><\/script>
<style type="text/tailwindcss">${styles}
html { visibility: visible !important; }
</style></head>
<body class="${layout}" style="min-height:${c.h || 280}px">
${body}
</body></html>`;
}
