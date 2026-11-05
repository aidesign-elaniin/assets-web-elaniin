# assets-web-elaniin

Biblioteca de assets animados para los sitios de Elaniin. Cada tipo de asset es un **generador** con su propio editor, y todos exportan embed, imagen, video en loop y JSON.

- Sitio: https://aidesign-elaniin.github.io/assets-web-elaniin/
- Generadores actuales: **Glass Grid** (vidrio esmerilado + cubo de Blender) y **Barridos** (lenguaje de CTA y cards del sitio Elaniin, vía `rogenizar`).

## Correr local

```bash
python3 -m http.server 5173
```

Abrir http://localhost:5173. Sitio estático, sin build. Cada push a `main` se publica en GitHub Pages.

## Embed en un sitio

```html
<script type="module" src="https://aidesign-elaniin.github.io/assets-web-elaniin/elaniin-assets.js"></script>
<elaniin-asset type="glass-grid" style="display:block;width:100%;aspect-ratio:16/9" config='{"colors":["#1054ff","#22d3ee"]}'></elaniin-asset>
```

| Atributo | Qué hace |
|---|---|
| `type` | Generador (`glass-grid`, `sweeps`, …). Solo se descarga ese generador. |
| `config` | JSON del asset. Cambiarlo actualiza en vivo. |
| `src` | URL a un `.json` exportado, en lugar de `config`. |

Se pausa fuera de pantalla y queda quieto con "reducir movimiento". Los embeds apuntan a `main`: un cambio que rompa la config de un generador rompe los sitios que lo usan. Cambios compatibles hacia atrás siempre (`normalize` rellena lo que falte).

## Estructura

```
index.html              app: Biblioteca, Generadores, Editor, Paletas, Guía (estilo Elaniin 2027)
elaniin-assets.js       loader: registro de generadores, exportación, web component <elaniin-asset>
library.json            assets y paletas del equipo
generators/<id>/        un generador por carpeta, autocontenido
  glass-grid/           index.js · tiles.json · make_tile.py (Blender) · tile-*.glb
  sweeps/               index.js
```

## Agregar un generador

1. Crea `generators/<id>/index.js` que exporte:

   | Export | Qué es |
   |---|---|
   | `DEFAULTS` | Config inicial (sin `name`, `tags`, `aspect`: eso lo maneja la app). |
   | `controls` | Secciones del panel: `[{ title, hint?, items: [...] }]`. |
   | `normalize(c)` | Devuelve `{...c, ...valores validados}`. Nunca lanza error. |
   | `loopSeconds(c)` | Duración de un loop perfecto (todo lo animado debe ser periódico en ese tiempo). |
   | `embedConfig(c)` | Solo los campos que viajan en el embed. |
   | `describe(c)` | Resumen corto para la card ("8×7 · 4 colores"). |
   | `mount(host, config, opts)` | Dibuja en `host`. `opts`: `size:[w,h]`, `dpr`, `autoplay`, `preserve`. Devuelve `{ canvas, set, play, pause, renderAt(t), resize, playing, time, config, destroy }`. |

2. Regístralo en `GENERATORS` de `elaniin-assets.js` (nombre + descripción).
3. Agrega 2–3 presets en `library.json` con `"type": "<id>"`.

La biblioteca, el editor, las miniaturas y la exportación (PNG, MP4, embed, JSON) lo toman solos.

**Controles disponibles** (`items`):

| `type` | Campos |
|---|---|
| `range` | `key`, `label`, `min`, `max`, `step`, `digits?`, `unit?` |
| `seg` | `key`, `label`, `options: { valor: 'Etiqueta' }` |
| `color` | `key`, `label` |
| `colors` | `key`, `min`, `max` (lista de stops + paletas) |
| `multi` | `key`, `options`, `icons?` (SVG interno 24×24), `min` (selección ordenada) |

`key` acepta rutas con punto (`grid.cols`).

**Estilo de los assets:** partir del ADN del diseñador de planta (`/rogenizar`): un acento `#1054FF`, rampa azul `#D7E2F8 → #01172E`, barridos 115°/65°/150°, tramas de puntos, grilla y rayas, materiales por concepto.

## Compartir assets

Lo guardado vive en el navegador. Biblioteca → **Exportar biblioteca** → reemplazar `library.json` → commit.

## Regenerar el cubo (Glass Grid)

```bash
/Applications/Blender.app/Contents/MacOS/Blender -b -P generators/glass-grid/make_tile.py
```
