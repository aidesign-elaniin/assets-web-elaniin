# assets-web-elaniin

Biblioteca y editor de assets 3D "glass grid" para los sitios de Elaniin: cuadrícula de vidrio esmerilado fija sobre formas y gradientes en movimiento.

## Correr local

```bash
python3 -m http.server 5173
```

Abrir http://localhost:5173. Sitio estático, sin build.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | App: Biblioteca, Editor, Paletas, Guía (estilo Elaniin 2027) |
| `elaniin-glass.js` | Motor Three.js + web component `<elaniin-glass>`. Lo usan el editor y los sitios |
| `library.json` | Assets y paletas compartidos del equipo |
| `blender/make_tile.py` | Genera la geometría del cubo (3 perfiles) |
| `assets/tiles.json` | Geometría que carga el motor |
| `assets/tile-*.glb` | El mismo cubo para Figma, Spline, Cinema 4D |

## Embed en un sitio

```html
<script type="module" src="https://<host>/elaniin-glass.js"></script>
<elaniin-glass style="display:block;width:100%;aspect-ratio:16/9" config='{"colors":["#1054ff","#22d3ee"]}'></elaniin-glass>
```

`elaniin-glass.js` y `assets/tiles.json` deben servirse juntos desde el mismo host.

## Compartir assets

Lo guardado vive en el navegador. Biblioteca → **Exportar biblioteca** → reemplazar `library.json` → commit.

## Regenerar geometría

```bash
/Applications/Blender.app/Contents/MacOS/Blender -b -P blender/make_tile.py
```
