// Validación de config a partir del esquema `controls`. Sin dependencias:
// la usan los generadores WebGL (vía runtime.js) y los isométricos Canvas2D (vía iso-kit.js) sin cargar Three.js.

const HEX = /^#[0-9a-f]{6}$/i;

// normalize() a partir del esquema del panel: rangos se acotan, segs/colores se validan.
export function makeNormalize(DEFAULTS, controls) {
  const items = controls.flatMap(s => s.items);
  return (c = {}) => {
    const out = { ...structuredClone(DEFAULTS), ...c };
    for (const it of items) {
      const v = c[it.key], d = DEFAULTS[it.key];
      if (it.type === 'range') {
        let n = Number.isFinite(+v) && v !== null && v !== '' ? Math.min(it.max, Math.max(it.min, +v)) : d;
        out[it.key] = it.digits === 0 ? Math.round(n) : n;
      } else if (it.type === 'seg' || it.type === 'select') out[it.key] = v in it.options ? v : d;
      else if (it.type === 'text') out[it.key] = typeof v === 'string' ? v.slice(0, it.max ?? 40) : d;
      else if (it.type === 'color') out[it.key] = HEX.test(v) ? v.toLowerCase() : d;
      else if (it.type === 'colors') {
        let l = (Array.isArray(v) ? v : d).filter(x => HEX.test(x)).map(x => x.toLowerCase()).slice(0, it.max ?? 6);
        if (!l.length) l = d.slice();
        while (l.length < (it.min ?? 1)) l.push(l.at(-1));
        out[it.key] = l;
      } else if (it.type === 'list') {
        // lista de objetos: cada campo se valida con su propio tipo; it.item es el elemento por defecto
        const fix = x => {
          const o = { ...it.item };
          for (const f of it.fields) {
            const fv = x?.[f.key];
            if (f.type === 'select') o[f.key] = fv in f.options ? fv : it.item[f.key];
            else if (f.type === 'text') o[f.key] = typeof fv === 'string' ? fv.slice(0, f.max ?? 40) : it.item[f.key];
          }
          return o;
        };
        const l = (Array.isArray(v) ? v : d).slice(0, it.max ?? 12).map(fix);
        out[it.key] = l.length >= (it.min ?? 0) ? l : structuredClone(d);
      } else if (it.type === 'multi') {
        const l = (Array.isArray(v) ? v : d).filter(x => x in it.options);
        out[it.key] = l.length >= (it.min ?? 0) ? l : d.slice();
      }
    }
    return out;
  };
}
