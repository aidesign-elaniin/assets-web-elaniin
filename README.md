# assets-web-elaniin

Biblioteca de assets animados para los sitios de Elaniin. Cada tipo de asset es un **generador** con su propio editor, y todos exportan embed, imagen, video en loop y JSON.

- Sitio: https://aidesign-elaniin.github.io/assets-web-elaniin/
- 25 generadores, todos con loop perfecto. Las escenas `iso*` tienen tema **Claro** (hero/routes/solutions) y **Oscuro** (vidrio ahumado de #engagement):

| `type` | Nombre | Origen |
|---|---|---|
| `glass-grid` | Glass Grid | Referencias del equipo · cubo modelado en Blender |
| `glass-ribs` | Glass Ribs | Vidrio acanalado sobre el mismo fondo animado de Glass Grid; material editable |
| `rubik` | Cubo Rubik | Cubo 3×3 lineal con texto por cara que se desarma y se arma (ref. video) |
| `sweeps` | Barridos | ADN del diseñador (`/rogenizar`): CTA y cards de elaniin.com |
| `iso` | Iso · Stack | Pila del hero de elaniin.com: 1–12 losas, grosor automático, frost, pulso, reloj de 12 s |
| `iso-team` | Iso · Equipo | elaniin.com (canary) · routes · Scale your engineering team |
| `iso-migration` | Iso · Modernización | routes · Modernize a critical system |
| `iso-product` | Iso · Producto | routes · Build the software your business runs on |
| `iso-critical` | Iso · Crítico | routes (sector público) · Build critical software |
| `iso-service` | Iso · Servicio | routes (sector público) · Reach the people you serve |
| `iso-failover` | Iso · Primario / Respaldo | routes (sector público) · Stay available when it matters |
| `iso-pipeline` | Iso · Pipeline | solutions · AI across the pipeline (2–7 etapas) |
| `iso-platform` | Iso · Plataforma | solutions · Build and modernize (plataforma + apps) |
| `iso-availability` | Iso · Disponibilidad | solutions · Built for real demand (réplicas) |
| `iso-staff` | Iso · Staff augmentation | engagement · una losa por persona con su nombre |
| `iso-squad` | Iso · Equipo dedicado | engagement · núcleo + disciplinas alrededor |
| `iso-delivery` | Iso · Entrega por fases | engagement · escalones hasta la meta |
| `halftone` | Halftone Fluido | Board de Pinterest |
| `dither` | Píxel Dither | Board de Pinterest |
| `led` | Matriz LED (reacciona al cursor) | Board de Pinterest + trama de puntos del diseñador |
| `topo` | Topografía | Board de Pinterest + line art técnico del diseñador |
| `satin` | Satén Líquido | Board de Pinterest |
| `orb` | Orbe Luminoso | Board de Pinterest |
| `wave` | Onda de Partículas (3D) | Board de Pinterest |
| `constellation` | Constelación | Board de Pinterest + nodos con halo del diseñador |

## Correr local

```bash
python3 -m http.server 5173
```

Abrir http://localhost:5173. Sitio estático, sin build. Cada push a `main` se publica en GitHub Pages.

## Usar un asset en un sitio

| Uso | Formato | Peso | Costo |
|---|---|---|---|
| Hero o fondo animado | **Paquete para sitio**: MP4 + WebM + póster + componente React + snippet + `AGENTS.md` | 1–5 MB | Casi nulo (decodificación por hardware) |
| Secciones, fondos que cambian de tamaño, sitios hechos con IA | **Código (.md)**: el código exacto del asset + componente React + parámetros, en un Markdown | 18–35 KB (sin dependencias) | Dibuja en vivo (1–4 ms/cuadro) |
| Cards, bajo el pliegue | Imagen WebP | 30–150 KB | Nulo |
| Interacción real | Embed vivo con póster | ~175 KB + GPU | Alto, 1–2 por página |

El paquete se exporta desde el editor (Exportar → Paquete para sitio), se copia a `public/assets/elaniin/<slug>/` y no depende de esta biblioteca. El video se renderiza cuadro a cuadro con WebCodecs (Mediabunny): loop exacto y bitrate controlado. Para IA: `llms.txt` + `library.json` + el `AGENTS.md` de cada paquete.

## Embed vivo

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/aidesign-elaniin/assets-web-elaniin@v1.3.1/elaniin-assets.js"></script>
<elaniin-asset type="glass-grid" poster="/assets/elaniin/hero/poster.webp" style="display:block;width:100%;aspect-ratio:16/9" config='{"colors":["#1054ff","#6a9aff"]}'></elaniin-asset>
```

| Atributo | Qué hace |
|---|---|
| `type` | Generador (`glass-grid`, `sweeps`, …). Solo se descarga ese generador. |
| `config` | JSON del asset. Cambiarlo actualiza en vivo. |
| `src` | URL a un `.json` exportado, en lugar de `config`. |
| `poster` | Imagen mientras carga; con "reducir movimiento" se muestra solo el póster. |
| `fps` / `dpr` | Límites de costo (30 y 1.5 por defecto). |

Monta al acercarse a la pantalla, se pausa fuera de ella y corre a 30 fps. Los embeds apuntan a un **tag** servido por jsDelivr, no a `main`.

**Publicar una versión:** `git tag vX.Y.Z && git push --tags`, luego actualizar `RELEASE` en `index.html`. Mantener cambios compatibles hacia atrás (`normalize` rellena lo que falte).

## Estructura

```
index.html              app: Biblioteca, Generadores, Editor, Paletas, Guía (estilo Elaniin 2027)
elaniin-assets.js       loader: registro de generadores, exportación, web component <elaniin-asset>
library.json            assets y paletas del equipo
generators/<id>/        un generador por carpeta, autocontenido
  _shared/lite.js       mini motor WebGL2 (~3 KB, sin Three.js) para los generadores de shader
  _shared/glsl.js       GLSL común (ruido 4D en loop, rampa, px CSS)
  _shared/schema.js     validación de config desde `controls` (sin dependencias)
  _shared/runtime.js    base común: bucle de render, validación desde `controls`, GLSL (ruido 4D en loop, rampa, etc.)
  glass-grid/           index.js · tiles.json · make_tile.py (Blender) · tile-*.glb
  _shared/iso-kit.js    kit isométrico Canvas2D: proyección 30°, losas, frost, pastillas, pulsos, encuadre, defineIso
  iso/ iso-*/           escenas isométricas (una carpeta por escena)
  sweeps/ halftone/ dither/ led/ topo/ satin/ orb/ wave/ constellation/
```

## Agregar un generador

**Atajo (shader a pantalla completa):** usa `defineGenerator` de `generators/_shared/lite.js` (WebGL puro, sin Three.js; `runtime.js` solo para escenas 3D con `init`). Solo declaras `DEFAULTS`, `controls`, `uniforms(c)` (config → uniforms) y `frag` (GLSL). Validación, embed, loop y montaje salen solos. Ejemplos: `halftone/`, `led/`. Para escenas 3D pasa `init(renderer, U)` en vez de `frag` (ver `wave/`, `constellation/`). En GLSL tienes `cssPx()`, `pal(t)`, `lnoise(p, uPh, r)` y `lfbm(p, uPh)`: el ruido recorre un círculo en 4D, así que el loop cierra exacto.

**Atajo isométrico:** `defineIso` de `generators/_shared/iso-kit.js`. Declaras `DEFAULTS`, `controls`, `build(cfg)` (geometría: `plate`, `bounds`) y `draw(ctx, env)` usando `glassSlab`, `pill`, `chip`, `pulse`, `line`, `logoTop`/`logoRight`. Encuadre, fondo, levitación, sombra, reloj de 12 s y exportación salen solos. Ejemplos cortos: `iso-critical/`, `iso-team/`.

**Contrato completo** (para generadores a mano como `glass-grid/`):

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
| `select` | `key`, `label`, `options` (lista desplegable) |
| `text` | `key`, `label`, `max` |
| `list` | `key`, `itemName`, `min`, `max`, `item` (elemento por defecto), `fields` (`text`/`select`), `next?(lista)`, `stackOrder?` |

`key` acepta rutas con punto (`grid.cols`).

**Estilo de los assets:** partir del ADN del diseñador de planta (`/rogenizar`): un acento `#1054FF`, rampa azul `#D7E2F8 → #01172E`, barridos 115°/65°/150°, tramas de puntos, grilla y rayas, materiales por concepto.

## Compartir assets

Lo guardado vive en el navegador. Biblioteca → **Exportar biblioteca** → reemplazar `library.json` → commit.

## Regenerar el cubo (Glass Grid)

```bash
/Applications/Blender.app/Contents/MacOS/Blender -b -P generators/glass-grid/make_tile.py
```
