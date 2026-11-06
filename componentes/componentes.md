# Componentes Elaniin

> 68 componentes de interfaz (los de daisyUI) rehechos solo con tokens Elaniin, en HTML y React. Biblioteca con vista en vivo: https://aidesign-elaniin.github.io/assets-web-elaniin/#/componentes

Archivo generado desde la biblioteca (Componentes → componentes.md). No lo edites a mano.

## Requisitos

1. Tailwind CSS v4.
2. `elaniin.css` (tokens Elaniin + clases de componentes), guardado junto al CSS global:

```bash
curl -o src/styles/elaniin.css https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/elaniin.css
```

```css
/* CSS global (p. ej. src/styles/globals.css) */
@import "tailwindcss";
@import "./elaniin.css";
```

   Si el proyecto ya tiene `tokens.css` de Elaniin, reemplázalo por `elaniin.css` (lo incluye).
3. Fuentes: Instrument Sans (títulos y botones), DM Sans (texto) y Geist Mono (etiquetas y código).

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,400;9..40,500&family=Geist+Mono:wght@400;500&display=swap">
```

## Instrucciones para la IA

- Crea el componente tal cual: no cambies clases, colores, radios ni tamaños.
- `elaniin.css` quita la paleta por defecto de Tailwind: una clase como `bg-red-500` no compila. Usa solo los tokens Elaniin.
- Cambia solo textos, enlaces e imágenes. Las imágenes del ejemplo son de la biblioteca de assets de Elaniin.
- Conserva los atributos de accesibilidad (`aria-*`, `alt`, `label`, `role`).
- Si el proyecto usa React, usa la versión JSX; si no, la HTML.

## Índice

- **Acciones:** Botón (`button`), Menú desplegable (`dropdown`), Botón flotante (FAB) (`fab`), Modal (`modal`), Intercambio (Swap) (`swap`), Control de tema (`theme-controller`)
- **Datos:** Acordeón (`accordion`), Avatar (`avatar`), Aura (`aura`), Badge (`badge`), Card (`card`), Carrusel (`carousel`), Burbuja de chat (`chat`), Colapsable (`collapse`), Cuenta regresiva (`countdown`), Comparador (Diff) (`diff`), Card 3D (`hover-3d`), Galería al pasar el cursor (`hover-gallery`), Tecla (Kbd) (`kbd`), Lista (`list`), Estadística (`stat`), Estado (`status`), Tabla (`table`), Texto rotativo (`text-rotate`), Línea de tiempo (`timeline`)
- **Navegación:** Migas de pan (`breadcrumbs`), Dock (barra inferior) (`dock`), Enlace (`link`), Megamenú (`megamenu`), Menú (`menu`), Barra de navegación (`navbar`), Paginación (`pagination`), Pasos (`steps`), Pestañas (`tab`)
- **Feedback:** Alerta (`alert`), Carga (`loading`), Barra de progreso (`progress`), Progreso circular (`radial-progress`), Skeleton (`skeleton`), Aviso (Toast) (`toast`), Tooltip (`tooltip`)
- **Formularios:** Calendario (`calendar`), Casilla (`checkbox`), Fieldset (`fieldset`), Carga de archivos (`file-input`), Filtro (`filter`), Etiqueta (`label`), Opción (Radio) (`radio`), Rango (`range`), Calificación (`rating`), Selector (`select`), Campo de texto (`input`), Área de texto (`textarea`), Interruptor (`toggle`), Validación (`validator`), Código (OTP) (`otp`)
- **Layout:** Divisor (`divider`), Panel lateral (Drawer) (`drawer`), Footer (`footer`), Hero (`hero`), Indicador (`indicator`), Grupo (Join) (`join`), Formas (Mask) (`mask`), Pila (Stack) (`stack`)
- **Mockups:** Navegador (mockup) (`mockup-browser`), Código (mockup) (`mockup-code`), Teléfono (mockup) (`mockup-phone`), Ventana (mockup) (`mockup-window`)

# Acciones

## Botón (`button`)

> Acciones principales y secundarias. Un solo botón primario por vista.

### HTML

```html
<div class="flex flex-col items-start gap-6">
  <div class="flex flex-wrap items-center gap-3">
    <button type="button" class="btn btn-primary btn-arrow">Hablemos <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button>
    <button type="button" class="btn btn-secondary">Ver casos</button>
    <button type="button" class="btn btn-dark">Descargar</button>
    <button type="button" class="btn btn-ghost">Cancelar</button>
    <button type="button" class="btn btn-secondary btn-square" aria-label="Agregar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>
  </div>
  <div class="flex flex-wrap items-center gap-3">
    <button type="button" class="btn btn-primary btn-sm">Pequeño</button>
    <button type="button" class="btn btn-primary">Normal</button>
    <button type="button" class="btn btn-primary btn-lg">Grande</button>
    <button type="button" class="btn btn-primary" aria-busy="true"><span class="spinner border-white/40 border-t-white"></span>Enviando</button>
    <button type="button" class="btn btn-primary" disabled>Deshabilitado</button>
  </div>
  <div class="flex flex-wrap items-center gap-3 rounded-card bg-surface-dark p-6">
    <button type="button" class="btn btn-on-dark btn-arrow">Sobre banda oscura <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button>
    <button type="button" class="btn border-border-on-dark-strong text-white hover:bg-white/10">Secundario</button>
  </div>
</div>
```

### React (JSX)

```jsx
export default function Button() {
  return (
    <div className="flex flex-col items-start gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-primary btn-arrow">Hablemos <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></button>
        <button type="button" className="btn btn-secondary">Ver casos</button>
        <button type="button" className="btn btn-dark">Descargar</button>
        <button type="button" className="btn btn-ghost">Cancelar</button>
        <button type="button" className="btn btn-secondary btn-square" aria-label="Agregar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-primary btn-sm">Pequeño</button>
        <button type="button" className="btn btn-primary">Normal</button>
        <button type="button" className="btn btn-primary btn-lg">Grande</button>
        <button type="button" className="btn btn-primary" aria-busy="true"><span className="spinner border-white/40 border-t-white" />Enviando</button>
        <button type="button" className="btn btn-primary" disabled>Deshabilitado</button>
      </div>
      <div className="flex flex-wrap items-center gap-3 rounded-card bg-surface-dark p-6">
        <button type="button" className="btn btn-on-dark btn-arrow">Sobre banda oscura <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></button>
        <button type="button" className="btn border-border-on-dark-strong text-white hover:bg-white/10">Secundario</button>
      </div>
    </div>
  );
}
```

### Reglas de uso

- Un solo `btn-primary` por vista o sección.
- `btn-arrow` (flecha que se desplaza) solo en CTAs que llevan a otra página.
- Alto mínimo 44 px; `btn-sm` solo en tablas o barras densas de escritorio.
- Botón de solo ícono: siempre `aria-label`.

## Menú desplegable (`dropdown`)

> Abre una lista de opciones o enlaces al hacer clic. Sin JavaScript: usa <details>.

### HTML

```html
<details class="dropdown">
  <summary class="btn btn-secondary">Servicios <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary>
  <ul class="dropdown-panel">
    <li><a href="#" class="menu-item">Desarrollo de software</a></li>
    <li><a href="#" class="menu-item">Equipos dedicados</a></li>
    <li><a href="#" class="menu-item">Modernización</a></li>
    <li><a href="#" class="menu-item">IA aplicada</a></li>
  </ul>
</details>
```

### React (JSX)

```jsx
export default function Dropdown() {
  return (
    <details className="dropdown">
      <summary className="btn btn-secondary">Servicios <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
      <ul className="dropdown-panel">
        <li>
          <a href="#" className="menu-item">Desarrollo de software</a>
        </li>
        <li>
          <a href="#" className="menu-item">Equipos dedicados</a>
        </li>
        <li>
          <a href="#" className="menu-item">Modernización</a>
        </li>
        <li>
          <a href="#" className="menu-item">IA aplicada</a>
        </li>
      </ul>
    </details>
  );
}
```

### Reglas de uso

- Máximo 7 opciones; con más, usa Megamenú.
- Para cerrarlo al hacer clic fuera, usa la API popover o tu librería (Radix, Headless UI).
- Alinéalo a la derecha con `left-auto right-0` en el panel.

## Botón flotante (FAB) (`fab`)

> Botón fijo en la esquina que despliega acciones rápidas.

### HTML

```html
<details class="fab">
  <summary class="btn btn-primary btn-square size-14 rounded-full shadow-product" aria-label="Acciones rápidas"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></summary>
  <div class="flex flex-col items-end gap-3">
    <a href="#" class="btn btn-secondary rounded-full shadow-menu"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 5h16v11H8l-4 4z"/></svg> Escríbenos</a>
    <a href="#" class="btn btn-secondary rounded-full shadow-menu"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg> Correo</a>
  </div>
</details>
```

### React (JSX)

```jsx
export default function Fab() {
  return (
    <details className="fab">
      <summary className="btn btn-primary btn-square size-14 rounded-full shadow-product" aria-label="Acciones rápidas">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </summary>
      <div className="flex flex-col items-end gap-3">
        <a href="#" className="btn btn-secondary rounded-full shadow-menu"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 5h16v11H8l-4 4z" /></svg> Escríbenos</a>
        <a href="#" className="btn btn-secondary rounded-full shadow-menu"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg> Correo</a>
      </div>
    </details>
  );
}
```

### Reglas de uso

- Uno por página, para la acción más frecuente.
- Deja unos 96 px libres al final de la página para que no tape contenido.

## Modal (`modal`)

> Diálogo que pide una decisión sin salir de la página. Usa <dialog> nativo.

### HTML

```html
<button type="button" class="btn btn-primary" onclick="document.getElementById('modal-demo').showModal()">Abrir modal</button>
<dialog id="modal-demo" class="modal" closedby="any" aria-labelledby="modal-demo-title">
  <form method="dialog"><button class="btn btn-ghost btn-square absolute right-3 top-3" aria-label="Cerrar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></form>
  <div class="pad-card">
    <p class="mono-label text-caption text-text-muted">Propuesta</p>
    <h2 id="modal-demo-title" class="mt-2 font-display text-h3 font-medium">¿Agendamos una llamada?</h2>
    <p class="mt-3 text-body text-text-secondary">30 minutos con un líder técnico para entender tu proyecto. Sin compromiso.</p>
    <form method="dialog" class="mt-8 flex justify-end gap-3">
      <button class="btn btn-ghost">Ahora no</button>
      <button class="btn btn-primary">Agendar</button>
    </form>
  </div>
</dialog>
```

### React (JSX)

```jsx
export default function Modal() {
  return (
    <>
      <button type="button" className="btn btn-primary" onClick={(event) => { document.getElementById('modal-demo').showModal(); }}>Abrir modal</button>
      <dialog id="modal-demo" className="modal" closedby="any" aria-labelledby="modal-demo-title">
        <form method="dialog">
          <button className="btn btn-ghost btn-square absolute right-3 top-3" aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </form>
        <div className="pad-card">
          <p className="mono-label text-caption text-text-muted">Propuesta</p>
          <h2 id="modal-demo-title" className="mt-2 font-display text-h3 font-medium">¿Agendamos una llamada?</h2>
          <p className="mt-3 text-body text-text-secondary">30 minutos con un líder técnico para entender tu proyecto. Sin compromiso.</p>
          <form method="dialog" className="mt-8 flex justify-end gap-3">
            <button className="btn btn-ghost">Ahora no</button>
            <button className="btn btn-primary">Agendar</button>
          </form>
        </div>
      </dialog>
    </>
  );
}
```

### Reglas de uso

- `showModal()` trae foco atrapado, Esc y fondo inerte sin código extra.
- Título conectado con `aria-labelledby`.
- Máximo 2 acciones; la primaria a la derecha.
- `closedby="any"` cierra al hacer clic fuera (Chrome y Firefox recientes).

## Intercambio (Swap) (`swap`)

> Alterna entre dos estados visuales con un checkbox: menú/cerrar, seguir/siguiendo.

### HTML

```html
<div class="flex items-center gap-6">
  <label class="btn btn-secondary btn-square has-focus-visible:shadow-focus">
    <input type="checkbox" class="peer sr-only" aria-label="Abrir menú">
    <span class="peer-checked:hidden"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></span>
    <span class="hidden peer-checked:inline"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></span>
  </label>
  <label class="btn btn-secondary has-checked:border-excellence-blue has-checked:bg-excellence-blue has-checked:text-white has-focus-visible:shadow-focus">
    <input type="checkbox" class="peer sr-only">
    <span class="peer-checked:hidden">Seguir</span>
    <span class="hidden items-center gap-2 peer-checked:inline-flex"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg> Siguiendo</span>
  </label>
</div>
```

### React (JSX)

```jsx
export default function Swap() {
  return (
    <div className="flex items-center gap-6">
      <label className="btn btn-secondary btn-square has-focus-visible:shadow-focus">
        <input type="checkbox" className="peer sr-only" aria-label="Abrir menú" />
        <span className="peer-checked:hidden">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </span>
        <span className="hidden peer-checked:inline">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </span>
      </label>
      <label className="btn btn-secondary has-checked:border-excellence-blue has-checked:bg-excellence-blue has-checked:text-white has-focus-visible:shadow-focus">
        <input type="checkbox" className="peer sr-only" />
        <span className="peer-checked:hidden">Seguir</span>
        <span className="hidden items-center gap-2 peer-checked:inline-flex"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m5 12 5 5L20 7" /></svg> Siguiendo</span>
      </label>
    </div>
  );
}
```

### Reglas de uso

- Checkbox real (`sr-only`) para que funcione con teclado.
- El `aria-label` describe la acción, no el ícono.

## Control de tema (`theme-controller`)

> Cambia una sección entre fondo claro y banda oscura Excellence Blue, solo con CSS.

### HTML

```html
<section class="group w-full max-w-xl rounded-card border border-border-default bg-white pad-card transition-colors duration-slow has-checked:border-surface-dark has-checked:bg-surface-dark">
  <div class="flex items-center justify-between gap-6">
    <div>
      <p class="mono-label text-caption text-text-muted group-has-checked:text-text-on-dark-muted">Tema</p>
      <h3 class="mt-2 font-display text-h4 font-medium group-has-checked:text-white">Banda clara u oscura</h3>
    </div>
    <label class="flex items-center gap-3 text-body-sm text-text-secondary group-has-checked:text-text-on-dark-secondary">
      Oscuro
      <input type="checkbox" class="toggle" role="switch">
    </label>
  </div>
  <p class="mt-4 text-body-sm text-text-secondary group-has-checked:text-text-on-dark-secondary">Elaniin alterna fondos blancos con bandas Excellence Blue. El acento Elevate Blue es el mismo en los dos.</p>
</section>
```

### React (JSX)

```jsx
export default function ThemeController() {
  return (
    <section className="group w-full max-w-xl rounded-card border border-border-default bg-white pad-card transition-colors duration-slow has-checked:border-surface-dark has-checked:bg-surface-dark">
      <div className="flex items-center justify-between gap-6">
        <div>
          <p className="mono-label text-caption text-text-muted group-has-checked:text-text-on-dark-muted">Tema</p>
          <h3 className="mt-2 font-display text-h4 font-medium group-has-checked:text-white">Banda clara u oscura</h3>
        </div>
        <label className="flex items-center gap-3 text-body-sm text-text-secondary group-has-checked:text-text-on-dark-secondary">Oscuro <input type="checkbox" className="toggle" role="switch" /></label>
      </div>
      <p className="mt-4 text-body-sm text-text-secondary group-has-checked:text-text-on-dark-secondary">Elaniin alterna fondos blancos con bandas Excellence Blue. El acento Elevate Blue es el mismo en los dos.</p>
    </section>
  );
}
```

### Reglas de uso

- Cambia la sección, no la marca: en oscuro usa los tokens `text-on-dark-*`.
- Para todo el sitio, pon el estado en `<html>` y guarda la preferencia.

# Datos

## Acordeón (`accordion`)

> Preguntas frecuentes: solo una respuesta abierta a la vez.

### HTML

```html
<div class="w-full max-w-2xl border-t border-border-strong">
  <details class="accordion" name="faq" open>
    <summary>¿Cuánto tarda un proyecto?</summary>
    <p>Un MVP sale en 8 a 12 semanas. Lo definimos juntos en la fase de descubrimiento.</p>
  </details>
  <details class="accordion" name="faq">
    <summary>¿Trabajan con equipos internos?</summary>
    <p>Sí. Nos integramos a tu equipo con tus herramientas y tus rituales.</p>
  </details>
  <details class="accordion" name="faq">
    <summary>¿Qué pasa después del lanzamiento?</summary>
    <p>Seguimos con soporte, métricas y mejoras por sprint.</p>
  </details>
</div>
```

### React (JSX)

```jsx
export default function Accordion() {
  return (
    <div className="w-full max-w-2xl border-t border-border-strong">
      <details className="accordion" name="faq" open>
        <summary>¿Cuánto tarda un proyecto?</summary>
        <p>Un MVP sale en 8 a 12 semanas. Lo definimos juntos en la fase de descubrimiento.</p>
      </details>
      <details className="accordion" name="faq">
        <summary>¿Trabajan con equipos internos?</summary>
        <p>Sí. Nos integramos a tu equipo con tus herramientas y tus rituales.</p>
      </details>
      <details className="accordion" name="faq">
        <summary>¿Qué pasa después del lanzamiento?</summary>
        <p>Seguimos con soporte, métricas y mejoras por sprint.</p>
      </details>
    </div>
  );
}
```

### Reglas de uso

- El mismo `name` en los `<details>` hace que solo uno quede abierto.
- Preguntas cortas; respuestas de 3 líneas como máximo.

## Avatar (`avatar`)

> Foto o iniciales de una persona o empresa, solo o en grupo.

### HTML

```html
<div class="flex flex-wrap items-center gap-8">
  <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/satin.webp" alt="Ana Rivera" class="size-14 rounded-full object-cover">
  <div class="relative">
    <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/glass.webp" alt="Carlos Méndez" class="size-14 rounded-full object-cover">
    <span class="absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-white bg-success-dot" role="img" aria-label="En línea"></span>
  </div>
  <span class="grid size-14 place-items-center rounded-full bg-blue-tint-50 font-display text-body font-medium text-blue-700" role="img" aria-label="Lucía Pérez">LP</span>
  <div class="flex -space-x-3">
    <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/topo.webp" alt="Equipo: Diego" class="size-11 rounded-full border-2 border-white object-cover">
    <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/ribs.webp" alt="Sofía" class="size-11 rounded-full border-2 border-white object-cover">
    <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/rubik.webp" alt="Mateo" class="size-11 rounded-full border-2 border-white object-cover">
    <span class="grid size-11 place-items-center rounded-full border-2 border-white bg-excellence-blue font-mono text-caption text-white">+12</span>
  </div>
</div>
```

### React (JSX)

```jsx
export default function Avatar() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/satin.webp" alt="Ana Rivera" className="size-14 rounded-full object-cover" />
      <div className="relative">
        <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/glass.webp" alt="Carlos Méndez" className="size-14 rounded-full object-cover" />
        <span className="absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-white bg-success-dot" role="img" aria-label="En línea" />
      </div>
      <span className="grid size-14 place-items-center rounded-full bg-blue-tint-50 font-display text-body font-medium text-blue-700" role="img" aria-label="Lucía Pérez">LP</span>
      <div className="flex -space-x-3">
        <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/topo.webp" alt="Equipo: Diego" className="size-11 rounded-full border-2 border-white object-cover" />
        <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/ribs.webp" alt="Sofía" className="size-11 rounded-full border-2 border-white object-cover" />
        <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/rubik.webp" alt="Mateo" className="size-11 rounded-full border-2 border-white object-cover" />
        <span className="grid size-11 place-items-center rounded-full border-2 border-white bg-excellence-blue font-mono text-caption text-white">+12</span>
      </div>
    </div>
  );
}
```

### Reglas de uso

- Fotos reales; si no hay, iniciales sobre `blue-tint-50`.
- El indicador de estado necesita texto (`aria-label`).

## Aura (`aura`)

> Borde de luz azul que gira alrededor de un botón o card para destacarlo.

### HTML

```html
<div class="flex flex-wrap items-center gap-10">
  <a href="#" class="aura btn btn-dark btn-arrow rounded-full px-6">Nuevo: agentes de IA <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a>
  <article class="aura w-72 rounded-card bg-white pad-card">
    <p class="mono-label text-caption text-text-muted">Recomendado</p>
    <h3 class="mt-2 font-display text-h4 font-medium">Plan Scale</h3>
    <p class="mt-2 text-body-sm text-text-secondary">El borde de luz marca la opción que más conviene.</p>
  </article>
</div>
```

### React (JSX)

```jsx
export default function Aura() {
  return (
    <div className="flex flex-wrap items-center gap-10">
      <a href="#" className="aura btn btn-dark btn-arrow rounded-full px-6">Nuevo: agentes de IA <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></a>
      <article className="aura w-72 rounded-card bg-white pad-card">
        <p className="mono-label text-caption text-text-muted">Recomendado</p>
        <h3 className="mt-2 font-display text-h4 font-medium">Plan Scale</h3>
        <p className="mt-2 text-body-sm text-text-secondary">El borde de luz marca la opción que más conviene.</p>
      </article>
    </div>
  );
}
```

### Reglas de uso

- Una sola aura por vista, en la oferta o CTA que más importa.
- Se detiene con “reducir movimiento”.

## Badge (`badge`)

> Etiqueta corta de estado o categoría.

### HTML

```html
<div class="flex flex-wrap items-center gap-3">
  <span class="badge">Borrador</span>
  <span class="badge badge-info">En revisión</span>
  <span class="badge badge-success"><span class="size-1.5 rounded-full bg-success-dot"></span>Publicado</span>
  <span class="badge badge-warning">Pendiente</span>
  <span class="badge badge-error">Bloqueado</span>
  <span class="badge badge-dark">Nuevo</span>
  <span class="badge badge-outline">v1.4</span>
</div>
```

### React (JSX)

```jsx
export default function Badge() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="badge">Borrador</span>
      <span className="badge badge-info">En revisión</span>
      <span className="badge badge-success"><span className="size-1.5 rounded-full bg-success-dot" />Publicado</span>
      <span className="badge badge-warning">Pendiente</span>
      <span className="badge badge-error">Bloqueado</span>
      <span className="badge badge-dark">Nuevo</span>
      <span className="badge badge-outline">v1.4</span>
    </div>
  );
}
```

### Reglas de uso

- Los colores de estado comunican estado; nunca decoran.
- 1 o 2 palabras.

## Card (`card`)

> Agrupa un tema: caso, servicio o artículo. Clara o sobre banda oscura.

### HTML

```html
<div class="grid w-full max-w-3xl gap-6 sm:grid-cols-2">
  <a href="#" class="card lift focus-ring">
    <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/glass.webp" alt="" class="aspect-4/3 w-full object-cover" loading="lazy">
    <div class="pad-card">
      <p class="mono-label text-caption text-text-muted">Caso · Fintech</p>
      <h3 class="mt-2 font-display text-h4 font-medium">Banca digital para 2 M de usuarios</h3>
      <p class="mt-2 text-body-sm text-text-secondary">Migramos el core a la nube sin detener la operación.</p>
      <span class="mt-6 inline-flex items-center gap-2 text-body-sm font-medium text-text-link">Ver caso <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span>
    </div>
  </a>
  <article class="card card-dark justify-between pad-card">
    <div>
      <p class="mono-label text-caption text-text-on-dark-muted">Servicio</p>
      <h3 class="mt-2 font-display text-h3 font-medium">Equipos dedicados</h3>
      <p class="mt-3 text-body-sm text-text-on-dark-secondary">Ingenieros senior integrados a tu producto en 2 semanas.</p>
    </div>
    <a href="#" class="btn btn-on-dark btn-arrow mt-8 self-start">Armar equipo <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a>
  </article>
</div>
```

### React (JSX)

```jsx
export default function Card() {
  return (
    <div className="grid w-full max-w-3xl gap-6 sm:grid-cols-2">
      <a href="#" className="card lift focus-ring">
        <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/glass.webp" alt="" className="aspect-4/3 w-full object-cover" loading="lazy" />
        <div className="pad-card">
          <p className="mono-label text-caption text-text-muted">Caso · Fintech</p>
          <h3 className="mt-2 font-display text-h4 font-medium">Banca digital para 2 M de usuarios</h3>
          <p className="mt-2 text-body-sm text-text-secondary">Migramos el core a la nube sin detener la operación.</p>
          <span className="mt-6 inline-flex items-center gap-2 text-body-sm font-medium text-text-link">Ver caso <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></span>
        </div>
      </a>
      <article className="card card-dark justify-between pad-card">
        <div>
          <p className="mono-label text-caption text-text-on-dark-muted">Servicio</p>
          <h3 className="mt-2 font-display text-h3 font-medium">Equipos dedicados</h3>
          <p className="mt-3 text-body-sm text-text-on-dark-secondary">Ingenieros senior integrados a tu producto en 2 semanas.</p>
        </div>
        <a href="#" className="btn btn-on-dark btn-arrow mt-8 self-start">Armar equipo <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></a>
      </article>
    </div>
  );
}
```

### Reglas de uso

- Si lleva a un detalle, toda la card es el enlace (un solo enlace por card).
- Imagen con `aspect-ratio` fijo para no mover el layout.

## Carrusel (`carousel`)

> Fila desplazable con scroll-snap. Funciona con trackpad, táctil y botones.

### HTML

```html
<div class="w-full max-w-3xl">
  <div class="flex items-end justify-between gap-4">
    <h3 class="font-display text-h4 font-medium">Assets recientes</h3>
    <div class="flex gap-2">
      <button type="button" class="btn btn-secondary btn-square" aria-label="Anterior" onclick="document.getElementById('carousel-demo').scrollBy({ left: -280 })"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg></button>
      <button type="button" class="btn btn-secondary btn-square" aria-label="Siguiente" onclick="document.getElementById('carousel-demo').scrollBy({ left: 280 })"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></button>
    </div>
  </div>
  <ul id="carousel-demo" class="carousel mt-4" aria-label="Assets recientes">
    <li class="w-64"><img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/glass.webp" alt="" class="aspect-4/3 w-full rounded-media object-cover"><p class="mt-3 text-body-sm font-medium">Glass Grid</p></li>
    <li class="w-64"><img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/ribs.webp" alt="" class="aspect-4/3 w-full rounded-media object-cover"><p class="mt-3 text-body-sm font-medium">Glass Ribs</p></li>
    <li class="w-64"><img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/rubik.webp" alt="" class="aspect-4/3 w-full rounded-media object-cover"><p class="mt-3 text-body-sm font-medium">Cubo Rubik</p></li>
    <li class="w-64"><img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/satin.webp" alt="" class="aspect-4/3 w-full rounded-media object-cover"><p class="mt-3 text-body-sm font-medium">Satén</p></li>
    <li class="w-64"><img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/topo.webp" alt="" class="aspect-4/3 w-full rounded-media object-cover"><p class="mt-3 text-body-sm font-medium">Topografía</p></li>
    <li class="w-64"><img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/sweeps.webp" alt="" class="aspect-4/3 w-full rounded-media object-cover"><p class="mt-3 text-body-sm font-medium">Barridos</p></li>
  </ul>
</div>
```

### React (JSX)

```jsx
export default function Carousel() {
  return (
    <div className="w-full max-w-3xl">
      <div className="flex items-end justify-between gap-4">
        <h3 className="font-display text-h4 font-medium">Assets recientes</h3>
        <div className="flex gap-2">
          <button type="button" className="btn btn-secondary btn-square" aria-label="Anterior" onClick={(event) => { document.getElementById('carousel-demo').scrollBy({ left: -280 }); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="m15 6-6 6 6 6" />
            </svg>
          </button>
          <button type="button" className="btn btn-secondary btn-square" aria-label="Siguiente" onClick={(event) => { document.getElementById('carousel-demo').scrollBy({ left: 280 }); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
      <ul id="carousel-demo" className="carousel mt-4" aria-label="Assets recientes">
        <li className="w-64">
          <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/glass.webp" alt="" className="aspect-4/3 w-full rounded-media object-cover" />
          <p className="mt-3 text-body-sm font-medium">Glass Grid</p>
        </li>
        <li className="w-64">
          <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/ribs.webp" alt="" className="aspect-4/3 w-full rounded-media object-cover" />
          <p className="mt-3 text-body-sm font-medium">Glass Ribs</p>
        </li>
        <li className="w-64">
          <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/rubik.webp" alt="" className="aspect-4/3 w-full rounded-media object-cover" />
          <p className="mt-3 text-body-sm font-medium">Cubo Rubik</p>
        </li>
        <li className="w-64">
          <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/satin.webp" alt="" className="aspect-4/3 w-full rounded-media object-cover" />
          <p className="mt-3 text-body-sm font-medium">Satén</p>
        </li>
        <li className="w-64">
          <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/topo.webp" alt="" className="aspect-4/3 w-full rounded-media object-cover" />
          <p className="mt-3 text-body-sm font-medium">Topografía</p>
        </li>
        <li className="w-64">
          <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/sweeps.webp" alt="" className="aspect-4/3 w-full rounded-media object-cover" />
          <p className="mt-3 text-body-sm font-medium">Barridos</p>
        </li>
      </ul>
    </div>
  );
}
```

### Reglas de uso

- Deja ver parte del siguiente ítem para que se entienda que hay más.
- Sin autoplay.
- Si usas dos carruseles en la página, cambia el `id`.

## Burbuja de chat (`chat`)

> Conversación con autor, hora e indicador de escritura.

### HTML

```html
<div class="flex w-full max-w-lg flex-col gap-4">
  <div class="flex items-end gap-3">
    <span class="grid size-8 shrink-0 place-items-center rounded-full bg-excellence-blue font-mono text-caption text-white" aria-hidden="true">E</span>
    <div>
      <p class="mb-1 text-caption text-text-muted">Elaniin · 10:24</p>
      <p class="chat-bubble">Hola, ¿en qué etapa está tu proyecto?</p>
    </div>
  </div>
  <div class="flex flex-col items-end">
    <p class="mb-1 text-caption text-text-muted">Tú · 10:25</p>
    <p class="chat-bubble chat-bubble-end">Tenemos un MVP y queremos escalarlo.</p>
  </div>
  <div class="flex items-end gap-3">
    <span class="grid size-8 shrink-0 place-items-center rounded-full bg-excellence-blue font-mono text-caption text-white" aria-hidden="true">E</span>
    <p class="chat-bubble"><span class="typing-dots" role="status" aria-label="Elaniin está escribiendo"><i></i><i></i><i></i></span></p>
  </div>
</div>
```

### React (JSX)

```jsx
export default function Chat() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <div className="flex items-end gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-excellence-blue font-mono text-caption text-white" aria-hidden="true">E</span>
        <div>
          <p className="mb-1 text-caption text-text-muted">Elaniin · 10:24</p>
          <p className="chat-bubble">Hola, ¿en qué etapa está tu proyecto?</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="mb-1 text-caption text-text-muted">Tú · 10:25</p>
        <p className="chat-bubble chat-bubble-end">Tenemos un MVP y queremos escalarlo.</p>
      </div>
      <div className="flex items-end gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-excellence-blue font-mono text-caption text-white" aria-hidden="true">E</span>
        <p className="chat-bubble">
          <span className="typing-dots" role="status" aria-label="Elaniin está escribiendo">
            <i />
            <i />
            <i />
          </span>
        </p>
      </div>
    </div>
  );
}
```

### Reglas de uso

- Mensajes propios a la derecha en Elevate Blue; los demás en gris.
- Autor y hora en texto pequeño, fuera de la burbuja.

## Colapsable (`collapse`)

> Muestra u oculta un bloque de contenido. Cada uno se abre por su cuenta.

### HTML

```html
<div class="flex w-full max-w-xl flex-col gap-3">
  <details class="collapsible" open>
    <summary>Detalles técnicos</summary>
    <p>Next.js, Node y PostgreSQL en AWS. Despliegue continuo con revisión en cada pull request.</p>
  </details>
  <details class="collapsible">
    <summary>Equipo asignado</summary>
    <p>Un líder técnico, dos ingenieros full stack y una diseñadora de producto.</p>
  </details>
</div>
```

### React (JSX)

```jsx
export default function Collapse() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <details className="collapsible" open>
        <summary>Detalles técnicos</summary>
        <p>Next.js, Node y PostgreSQL en AWS. Despliegue continuo con revisión en cada pull request.</p>
      </details>
      <details className="collapsible">
        <summary>Equipo asignado</summary>
        <p>Un líder técnico, dos ingenieros full stack y una diseñadora de producto.</p>
      </details>
    </div>
  );
}
```

### Reglas de uso

- Si solo uno debe quedar abierto, usa Acordeón.
- No escondas información crítica dentro.

## Cuenta regresiva (`countdown`)

> Tiempo restante hasta un evento, con dígitos que no saltan.

### HTML

```html
<div class="flex items-start gap-3" role="timer" aria-label="Tiempo restante para el evento">
  <div class="text-center"><span data-cd="d" class="block font-display text-display-lg font-medium tabular-nums">--</span><span class="mono-label text-caption text-text-muted">días</span></div>
  <span class="font-display text-display-lg text-text-disabled" aria-hidden="true">:</span>
  <div class="text-center"><span data-cd="h" class="block font-display text-display-lg font-medium tabular-nums">--</span><span class="mono-label text-caption text-text-muted">horas</span></div>
  <span class="font-display text-display-lg text-text-disabled" aria-hidden="true">:</span>
  <div class="text-center"><span data-cd="m" class="block font-display text-display-lg font-medium tabular-nums">--</span><span class="mono-label text-caption text-text-muted">min</span></div>
  <span class="font-display text-display-lg text-text-disabled" aria-hidden="true">:</span>
  <div class="text-center"><span data-cd="s" class="block font-display text-display-lg font-medium tabular-nums">--</span><span class="mono-label text-caption text-text-muted">seg</span></div>
</div>
<script>
  // Fecha del evento: cámbiala por la tuya.
  const end = new Date('2027-01-15T09:00:00-06:00');
  const pad = n => String(n).padStart(2, '0');
  const tick = () => {
    const s = Math.max(0, Math.floor((end - Date.now()) / 1000));
    const v = { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 };
    for (const k in v) document.querySelector('[data-cd="' + k + '"]').textContent = pad(v[k]);
  };
  tick();
  setInterval(tick, 1000);
</script>
```

### React (JSX)

```jsx
'use client';
import { Fragment, useEffect, useState } from 'react';

const pad = (n) => String(n).padStart(2, '0');

// to: fecha del evento (ISO). Muestra "--" hasta montar, así no hay diferencias al hidratar.
export default function Countdown({ to = '2027-01-15T09:00:00-06:00' }) {
  const [left, setLeft] = useState(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, Math.floor((new Date(to) - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [to]);
  const s = left ?? 0;
  const parts = [['días', Math.floor(s / 86400)], ['horas', Math.floor(s / 3600) % 24], ['min', Math.floor(s / 60) % 60], ['seg', s % 60]];
  return (
    <div className="flex items-start gap-3" role="timer" aria-label="Tiempo restante para el evento">
      {parts.map(([label, value], i) => (
        <Fragment key={label}>
          {i > 0 && <span className="font-display text-display-lg text-text-disabled" aria-hidden="true">:</span>}
          <div className="text-center">
            <span className="block font-display text-display-lg font-medium tabular-nums">{left === null ? '--' : pad(value)}</span>
            <span className="mono-label text-caption text-text-muted">{label}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
```

### Reglas de uso

- `tabular-nums` evita que los dígitos cambien de ancho.
- `role="timer"` no anuncia cada segundo en lectores de pantalla.
- Cambia la fecha del evento (en HTML: `end`; en React: prop `to`).

## Comparador (Diff) (`diff`)

> Compara dos imágenes con un control deslizable: antes y después, claro y oscuro.

### HTML

```html
<div class="diff aspect-4/3 w-full max-w-2xl" style="--pos: 50">
  <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/iso-dark.webp" alt="Ilustración isométrica en tema oscuro">
  <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/iso.webp" alt="Ilustración isométrica en tema claro">
  <input type="range" min="0" max="100" value="50" aria-label="Comparar tema claro y oscuro" oninput="event.currentTarget.parentElement.style.setProperty('--pos', event.currentTarget.value)">
</div>
```

### React (JSX)

```jsx
export default function Diff() {
  return (
    <div className="diff aspect-4/3 w-full max-w-2xl" style={{ '--pos': '50' }}>
      <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/iso-dark.webp" alt="Ilustración isométrica en tema oscuro" />
      <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/iso.webp" alt="Ilustración isométrica en tema claro" />
      <input type="range" min="0" max="100" defaultValue="50" aria-label="Comparar tema claro y oscuro" onInput={(event) => { event.currentTarget.parentElement.style.setProperty('--pos', event.currentTarget.value); }} />
    </div>
  );
}
```

### Reglas de uso

- Las dos imágenes con el mismo encuadre y tamaño.
- La segunda imagen es la de la izquierda.
- El control es un `<input type="range">`: funciona con flechas del teclado.

## Card 3D (`hover-3d`)

> La card se inclina hacia el cursor. Solo CSS: 9 zonas invisibles detectan la posición.

### HTML

```html
<div class="hover-3d w-full max-w-sm">
  <figure class="card">
    <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/rubik.webp" alt="Cubo Rubik con el texto ELAN" class="aspect-4/3 w-full object-cover">
    <figcaption class="flex items-center justify-between pad-card">
      <span class="font-display text-h4 font-medium">Cubo Rubik</span>
      <span class="badge badge-info">3D</span>
    </figcaption>
  </figure>
  <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
</div>
```

### React (JSX)

```jsx
export default function Hover3d() {
  return (
    <div className="hover-3d w-full max-w-sm">
      <figure className="card">
        <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/rubik.webp" alt="Cubo Rubik con el texto ELAN" className="aspect-4/3 w-full object-cover" />
        <figcaption className="flex items-center justify-between pad-card">
          <span className="font-display text-h4 font-medium">Cubo Rubik</span>
          <span className="badge badge-info">3D</span>
        </figcaption>
      </figure>
      <i />
      <i />
      <i />
      <i />
      <i />
      <i />
      <i />
      <i />
      <i />
    </div>
  );
}
```

### Reglas de uso

- Las 9 zonas `<i>` van al final y tapan la card: no pongas enlaces dentro. Si debe navegar, envuelve todo en un `<a>`.
- Sin efecto con “reducir movimiento”.

## Galería al pasar el cursor (`hover-gallery`)

> Varias imágenes en el mismo espacio: se cambian al mover el cursor de lado a lado.

### HTML

```html
<figure class="w-full max-w-sm">
  <div class="hover-gallery aspect-4/3">
    <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/satin.webp" alt="Fondo Satén líquido en cuatro variantes">
    <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/topo.webp" alt="">
    <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/sweeps.webp" alt="">
    <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/ribs.webp" alt="">
    <i></i><i></i><i></i><i></i>
  </div>
  <figcaption class="mt-3 flex justify-between text-body-sm"><span class="font-medium">Fondos de la biblioteca</span><span class="font-mono text-text-muted">4 variantes</span></figcaption>
</figure>
```

### React (JSX)

```jsx
export default function HoverGallery() {
  return (
    <figure className="w-full max-w-sm">
      <div className="hover-gallery aspect-4/3">
        <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/satin.webp" alt="Fondo Satén líquido en cuatro variantes" />
        <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/topo.webp" alt="" />
        <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/sweeps.webp" alt="" />
        <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/ribs.webp" alt="" />
        <i />
        <i />
        <i />
        <i />
      </div>
      <figcaption className="mt-3 flex justify-between text-body-sm">
        <span className="font-medium">Fondos de la biblioteca</span>
        <span className="font-mono text-text-muted">4 variantes</span>
      </figcaption>
    </figure>
  );
}
```

### Reglas de uso

- Una zona `<i>` por imagen (máximo 6).
- La primera imagen es la que se ve sin cursor y en táctil: lleva el `alt` principal.

## Tecla (Kbd) (`kbd`)

> Muestra atajos de teclado.

### HTML

```html
<div class="flex flex-col items-center gap-4 text-body-sm text-text-secondary">
  <p>Buscar: <kbd class="kbd">⌘</kbd> <kbd class="kbd">K</kbd></p>
  <p>Guardar: <kbd class="kbd">Ctrl</kbd> + <kbd class="kbd">S</kbd></p>
  <p><kbd class="kbd">↑</kbd> <kbd class="kbd">↓</kbd> para moverte</p>
</div>
```

### React (JSX)

```jsx
export default function Kbd() {
  return (
    <div className="flex flex-col items-center gap-4 text-body-sm text-text-secondary">
      <p>Buscar: <kbd className="kbd">⌘</kbd> <kbd className="kbd">K</kbd></p>
      <p>Guardar: <kbd className="kbd">Ctrl</kbd> + <kbd className="kbd">S</kbd></p>
      <p><kbd className="kbd">↑</kbd> <kbd className="kbd">↓</kbd> para moverte</p>
    </div>
  );
}
```

### Reglas de uso

- Usa `<kbd>` para que se anuncie como tecla.
- Muestra ⌘ en Mac y Ctrl en Windows.

## Lista (`list`)

> Filas con miniatura, texto, estado y acción.

### HTML

```html
<ul class="w-full max-w-xl divide-y divide-border-default rounded-card border border-border-default bg-white">
  <li class="flex items-center gap-4 px-5 py-4">
    <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/glass.webp" alt="" class="size-12 rounded-button object-cover">
    <div class="min-w-0 flex-1">
      <p class="truncate font-medium">Glass Grid · Hero</p>
      <p class="truncate text-body-sm text-text-muted">Actualizado hace 2 h</p>
    </div>
    <span class="badge badge-success">Publicado</span>
    <button type="button" class="btn btn-ghost btn-square" aria-label="Más opciones de Glass Grid"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg></button>
  </li>
  <li class="flex items-center gap-4 px-5 py-4">
    <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/topo.webp" alt="" class="size-12 rounded-button object-cover">
    <div class="min-w-0 flex-1">
      <p class="truncate font-medium">Topografía · Fondo</p>
      <p class="truncate text-body-sm text-text-muted">Actualizado ayer</p>
    </div>
    <span class="badge badge-info">En revisión</span>
    <button type="button" class="btn btn-ghost btn-square" aria-label="Más opciones de Topografía"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg></button>
  </li>
  <li class="flex items-center gap-4 px-5 py-4">
    <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/rubik.webp" alt="" class="size-12 rounded-button object-cover">
    <div class="min-w-0 flex-1">
      <p class="truncate font-medium">Cubo Rubik · Card</p>
      <p class="truncate text-body-sm text-text-muted">Actualizado hace 3 días</p>
    </div>
    <span class="badge">Borrador</span>
    <button type="button" class="btn btn-ghost btn-square" aria-label="Más opciones de Cubo Rubik"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg></button>
  </li>
</ul>
```

### React (JSX)

```jsx
export default function List() {
  return (
    <ul className="w-full max-w-xl divide-y divide-border-default rounded-card border border-border-default bg-white">
      <li className="flex items-center gap-4 px-5 py-4">
        <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/glass.webp" alt="" className="size-12 rounded-button object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">Glass Grid · Hero</p>
          <p className="truncate text-body-sm text-text-muted">Actualizado hace 2 h</p>
        </div>
        <span className="badge badge-success">Publicado</span>
        <button type="button" className="btn btn-ghost btn-square" aria-label="Más opciones de Glass Grid">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
          </svg>
        </button>
      </li>
      <li className="flex items-center gap-4 px-5 py-4">
        <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/topo.webp" alt="" className="size-12 rounded-button object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">Topografía · Fondo</p>
          <p className="truncate text-body-sm text-text-muted">Actualizado ayer</p>
        </div>
        <span className="badge badge-info">En revisión</span>
        <button type="button" className="btn btn-ghost btn-square" aria-label="Más opciones de Topografía">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
          </svg>
        </button>
      </li>
      <li className="flex items-center gap-4 px-5 py-4">
        <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/rubik.webp" alt="" className="size-12 rounded-button object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">Cubo Rubik · Card</p>
          <p className="truncate text-body-sm text-text-muted">Actualizado hace 3 días</p>
        </div>
        <span className="badge">Borrador</span>
        <button type="button" className="btn btn-ghost btn-square" aria-label="Más opciones de Cubo Rubik">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
          </svg>
        </button>
      </li>
    </ul>
  );
}
```

### Reglas de uso

- Una acción principal por fila; el resto en un menú.
- Textos largos con `truncate` y el texto completo en el detalle.

## Estadística (`stat`)

> Números clave con etiqueta y contexto.

### HTML

```html
<dl class="grid w-full max-w-4xl overflow-hidden rounded-card border border-border-default bg-white sm:grid-cols-3">
  <div class="border-border-default pad-card max-sm:border-b sm:border-r">
    <dt class="mono-label text-caption text-text-muted">Proyectos entregados</dt>
    <dd class="mt-3 font-display text-display-lg font-medium">350+</dd>
    <dd class="mt-2 text-body-sm text-text-secondary">Desde 2012</dd>
  </div>
  <div class="border-border-default pad-card max-sm:border-b sm:border-r">
    <dt class="mono-label text-caption text-text-muted">Satisfacción</dt>
    <dd class="mt-3 font-display text-display-lg font-medium">4.9/5</dd>
    <dd class="mt-2 text-body-sm text-success-text">↑ 0.2 este año</dd>
  </div>
  <div class="pad-card">
    <dt class="mono-label text-caption text-text-muted">Tiempo a producción</dt>
    <dd class="mt-3 font-display text-display-lg font-medium">8 sem</dd>
    <dd class="mt-2 text-body-sm text-text-secondary">Promedio de un MVP</dd>
  </div>
</dl>
```

### React (JSX)

```jsx
export default function Stat() {
  return (
    <dl className="grid w-full max-w-4xl overflow-hidden rounded-card border border-border-default bg-white sm:grid-cols-3">
      <div className="border-border-default pad-card max-sm:border-b sm:border-r">
        <dt className="mono-label text-caption text-text-muted">Proyectos entregados</dt>
        <dd className="mt-3 font-display text-display-lg font-medium">350+</dd>
        <dd className="mt-2 text-body-sm text-text-secondary">Desde 2012</dd>
      </div>
      <div className="border-border-default pad-card max-sm:border-b sm:border-r">
        <dt className="mono-label text-caption text-text-muted">Satisfacción</dt>
        <dd className="mt-3 font-display text-display-lg font-medium">4.9/5</dd>
        <dd className="mt-2 text-body-sm text-success-text">↑ 0.2 este año</dd>
      </div>
      <div className="pad-card">
        <dt className="mono-label text-caption text-text-muted">Tiempo a producción</dt>
        <dd className="mt-3 font-display text-display-lg font-medium">8 sem</dd>
        <dd className="mt-2 text-body-sm text-text-secondary">Promedio de un MVP</dd>
      </div>
    </dl>
  );
}
```

### Reglas de uso

- Número en `display`, etiqueta en `mono-label`.
- Los cambios llevan flecha y texto, no solo color.

## Estado (`status`)

> Punto de color que indica el estado de un sistema o elemento.

### HTML

```html
<ul class="flex flex-col gap-3 text-body-sm">
  <li class="flex items-center gap-3"><span class="live-dot"></span>Sistema operativo</li>
  <li class="flex items-center gap-3"><span class="size-2 rounded-full bg-info-dot"></span>En despliegue</li>
  <li class="flex items-center gap-3"><span class="size-2 rounded-full bg-warning-dot"></span>Mantenimiento programado</li>
  <li class="flex items-center gap-3"><span class="size-2 rounded-full bg-error-dot"></span>Incidente en pagos</li>
  <li class="flex items-center gap-3"><span class="size-2 rounded-full bg-neutral-dot"></span>Sin datos</li>
</ul>
```

### React (JSX)

```jsx
export default function Status() {
  return (
    <ul className="flex flex-col gap-3 text-body-sm">
      <li className="flex items-center gap-3"><span className="live-dot" />Sistema operativo</li>
      <li className="flex items-center gap-3"><span className="size-2 rounded-full bg-info-dot" />En despliegue</li>
      <li className="flex items-center gap-3"><span className="size-2 rounded-full bg-warning-dot" />Mantenimiento programado</li>
      <li className="flex items-center gap-3"><span className="size-2 rounded-full bg-error-dot" />Incidente en pagos</li>
      <li className="flex items-center gap-3"><span className="size-2 rounded-full bg-neutral-dot" />Sin datos</li>
    </ul>
  );
}
```

### Reglas de uso

- El punto nunca va solo: siempre con texto.
- `live-dot` (con pulso) solo para “en vivo” u “operativo”.

## Tabla (`table`)

> Datos en filas y columnas, con encabezado mono y filas que responden al cursor.

### HTML

```html
<div class="w-full max-w-3xl overflow-x-auto rounded-card border border-border-default bg-white">
  <table class="data-table min-w-xl">
    <caption class="sr-only">Proyectos activos</caption>
    <thead>
      <tr><th scope="col">Proyecto</th><th scope="col">Equipo</th><th scope="col">Estado</th><th scope="col">Avance</th></tr>
    </thead>
    <tbody>
      <tr><td class="font-medium">Banca digital</td><td class="text-text-secondary">8 personas</td><td><span class="badge badge-success">En curso</span></td><td class="font-mono">72%</td></tr>
      <tr><td class="font-medium">Portal de salud</td><td class="text-text-secondary">5 personas</td><td><span class="badge badge-info">Descubrimiento</span></td><td class="font-mono">15%</td></tr>
      <tr><td class="font-medium">App de retail</td><td class="text-text-secondary">6 personas</td><td><span class="badge badge-warning">En pausa</span></td><td class="font-mono">48%</td></tr>
    </tbody>
  </table>
</div>
```

### React (JSX)

```jsx
export default function Table() {
  return (
    <div className="w-full max-w-3xl overflow-x-auto rounded-card border border-border-default bg-white">
      <table className="data-table min-w-xl">
        <caption className="sr-only">Proyectos activos</caption>
        <thead>
          <tr>
            <th scope="col">Proyecto</th>
            <th scope="col">Equipo</th>
            <th scope="col">Estado</th>
            <th scope="col">Avance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="font-medium">Banca digital</td>
            <td className="text-text-secondary">8 personas</td>
            <td>
              <span className="badge badge-success">En curso</span>
            </td>
            <td className="font-mono">72%</td>
          </tr>
          <tr>
            <td className="font-medium">Portal de salud</td>
            <td className="text-text-secondary">5 personas</td>
            <td>
              <span className="badge badge-info">Descubrimiento</span>
            </td>
            <td className="font-mono">15%</td>
          </tr>
          <tr>
            <td className="font-medium">App de retail</td>
            <td className="text-text-secondary">6 personas</td>
            <td>
              <span className="badge badge-warning">En pausa</span>
            </td>
            <td className="font-mono">48%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
```

### Reglas de uso

- Envuélvela en `overflow-x-auto` para móvil.
- Números en `font-mono`; encabezados con `scope`.

## Texto rotativo (`text-rotate`)

> Una palabra del titular cambia en loop. Solo CSS.

### HTML

```html
<h2 class="max-w-2xl text-center font-display text-display-lg font-medium">
  Construimos
  <span class="text-rotate text-elevate-blue" aria-hidden="true"><span><span>software</span><span>equipos</span><span>productos</span><span>software</span></span></span>
  <span class="sr-only">software, equipos y productos</span>
  que escalan.
</h2>
```

### React (JSX)

```jsx
export default function TextRotate() {
  return (
    <h2 className="max-w-2xl text-center font-display text-display-lg font-medium">Construimos <span className="text-rotate text-elevate-blue" aria-hidden="true"><span><span>software</span><span>equipos</span><span>productos</span><span>software</span></span></span> <span className="sr-only">software, equipos y productos</span> que escalan.</h2>
  );
}
```

### Reglas de uso

- Exactamente 3 palabras y la primera repetida al final: así el loop no salta.
- La animación va con `aria-hidden` y el texto completo en `sr-only`.
- Se detiene con “reducir movimiento”.

## Línea de tiempo (`timeline`)

> Etapas en orden: lo hecho en azul, lo que falta en gris.

### HTML

```html
<ol class="w-full max-w-xl border-l border-border-strong">
  <li class="relative pb-10 pl-8">
    <span class="absolute -left-1.5 top-1.5 size-2.5 rounded-full bg-elevate-blue" aria-hidden="true"></span>
    <p class="mono-label text-caption text-text-muted">Semanas 1–2</p>
    <h3 class="mt-1 font-display text-h4 font-medium">Descubrimiento</h3>
    <p class="mt-1 text-body-sm text-text-secondary">Objetivos, usuarios y alcance del MVP.</p>
  </li>
  <li class="relative pb-10 pl-8">
    <span class="absolute -left-1.5 top-1.5 size-2.5 rounded-full bg-elevate-blue" aria-hidden="true"></span>
    <p class="mono-label text-caption text-text-muted">Semanas 3–4</p>
    <h3 class="mt-1 font-display text-h4 font-medium">Diseño</h3>
    <p class="mt-1 text-body-sm text-text-secondary">Flujos, prototipo y sistema de diseño.</p>
  </li>
  <li class="relative pb-10 pl-8">
    <span class="absolute -left-1.5 top-1.5 size-2.5 rounded-full border border-border-strong bg-white" aria-hidden="true"></span>
    <p class="mono-label text-caption text-text-muted">Semanas 5–10</p>
    <h3 class="mt-1 font-display text-h4 font-medium">Desarrollo</h3>
    <p class="mt-1 text-body-sm text-text-secondary">Sprints de 2 semanas con demo al final de cada uno.</p>
  </li>
  <li class="relative pl-8">
    <span class="absolute -left-1.5 top-1.5 size-2.5 rounded-full border border-border-strong bg-white" aria-hidden="true"></span>
    <p class="mono-label text-caption text-text-muted">Semanas 11–12</p>
    <h3 class="mt-1 font-display text-h4 font-medium">Lanzamiento</h3>
    <p class="mt-1 text-body-sm text-text-secondary">Salida a producción y métricas.</p>
  </li>
</ol>
```

### React (JSX)

```jsx
export default function Timeline() {
  return (
    <ol className="w-full max-w-xl border-l border-border-strong">
      <li className="relative pb-10 pl-8">
        <span className="absolute -left-1.5 top-1.5 size-2.5 rounded-full bg-elevate-blue" aria-hidden="true" />
        <p className="mono-label text-caption text-text-muted">Semanas 1–2</p>
        <h3 className="mt-1 font-display text-h4 font-medium">Descubrimiento</h3>
        <p className="mt-1 text-body-sm text-text-secondary">Objetivos, usuarios y alcance del MVP.</p>
      </li>
      <li className="relative pb-10 pl-8">
        <span className="absolute -left-1.5 top-1.5 size-2.5 rounded-full bg-elevate-blue" aria-hidden="true" />
        <p className="mono-label text-caption text-text-muted">Semanas 3–4</p>
        <h3 className="mt-1 font-display text-h4 font-medium">Diseño</h3>
        <p className="mt-1 text-body-sm text-text-secondary">Flujos, prototipo y sistema de diseño.</p>
      </li>
      <li className="relative pb-10 pl-8">
        <span className="absolute -left-1.5 top-1.5 size-2.5 rounded-full border border-border-strong bg-white" aria-hidden="true" />
        <p className="mono-label text-caption text-text-muted">Semanas 5–10</p>
        <h3 className="mt-1 font-display text-h4 font-medium">Desarrollo</h3>
        <p className="mt-1 text-body-sm text-text-secondary">Sprints de 2 semanas con demo al final de cada uno.</p>
      </li>
      <li className="relative pl-8">
        <span className="absolute -left-1.5 top-1.5 size-2.5 rounded-full border border-border-strong bg-white" aria-hidden="true" />
        <p className="mono-label text-caption text-text-muted">Semanas 11–12</p>
        <h3 className="mt-1 font-display text-h4 font-medium">Lanzamiento</h3>
        <p className="mt-1 text-body-sm text-text-secondary">Salida a producción y métricas.</p>
      </li>
    </ol>
  );
}
```

### Reglas de uso

- Hecho: punto Elevate Blue. Pendiente: punto hueco gris.
- Fechas en `mono-label`.

# Navegación

## Migas de pan (`breadcrumbs`)

> Muestra dónde está el usuario dentro del sitio.

### HTML

```html
<nav aria-label="Ruta" class="text-body-sm">
  <ol class="flex flex-wrap items-center gap-2 text-text-muted">
    <li><a href="#" class="rounded-button underline-offset-4 transition-colors duration-base hover:text-text-primary hover:underline focus-ring">Inicio</a></li>
    <li aria-hidden="true">/</li>
    <li><a href="#" class="rounded-button underline-offset-4 transition-colors duration-base hover:text-text-primary hover:underline focus-ring">Servicios</a></li>
    <li aria-hidden="true">/</li>
    <li><span aria-current="page" class="font-medium text-text-primary">Equipos dedicados</span></li>
  </ol>
</nav>
```

### React (JSX)

```jsx
export default function Breadcrumbs() {
  return (
    <nav aria-label="Ruta" className="text-body-sm">
      <ol className="flex flex-wrap items-center gap-2 text-text-muted">
        <li>
          <a href="#" className="rounded-button underline-offset-4 transition-colors duration-base hover:text-text-primary hover:underline focus-ring">Inicio</a>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <a href="#" className="rounded-button underline-offset-4 transition-colors duration-base hover:text-text-primary hover:underline focus-ring">Servicios</a>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <span aria-current="page" className="font-medium text-text-primary">Equipos dedicados</span>
        </li>
      </ol>
    </nav>
  );
}
```

### Reglas de uso

- El último elemento es la página actual: texto con `aria-current`, sin enlace.
- Separadores con `aria-hidden`.

## Dock (barra inferior) (`dock`)

> Navegación fija abajo para móvil, con ícono y texto.

### HTML

```html
<nav class="dock fixed inset-x-0 bottom-0 z-30" aria-label="Principal">
  <a href="#" aria-current="page"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/></svg><span>Inicio</span></a>
  <a href="#"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></svg><span>Proyectos</span></a>
  <a href="#"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 16v-5a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 21h4"/></svg><span>Avisos</span></a>
  <a href="#"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg><span>Perfil</span></a>
</nav>
```

### React (JSX)

```jsx
export default function Dock() {
  return (
    <nav className="dock fixed inset-x-0 bottom-0 z-30" aria-label="Principal">
      <a href="#" aria-current="page">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z" />
        </svg>
        <span>Inicio</span>
      </a>
      <a href="#">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="4" y="4" width="7" height="7" />
          <rect x="13" y="4" width="7" height="7" />
          <rect x="4" y="13" width="7" height="7" />
          <rect x="13" y="13" width="7" height="7" />
        </svg>
        <span>Proyectos</span>
      </a>
      <a href="#">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M6 16v-5a6 6 0 1 1 12 0v5l2 2H4z" />
          <path d="M10 21h4" />
        </svg>
        <span>Avisos</span>
      </a>
      <a href="#">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
        </svg>
        <span>Perfil</span>
      </a>
    </nav>
  );
}
```

### Reglas de uso

- Solo en móvil (agrega `md:hidden`); en escritorio usa Navbar.
- 3 a 5 destinos, siempre con ícono y texto.
- Deja `pb-16` en el contenido para que no quede debajo.

## Enlace (`link`)

> Enlaces en texto, de navegación y de acción, en fondo claro y oscuro.

### HTML

```html
<div class="flex max-w-xl flex-col items-start gap-6">
  <p class="text-body text-text-secondary">Lee nuestra <a href="#" class="link">guía de modernización</a> antes de migrar.</p>
  <a href="#" class="nav-link font-medium">Enlace de navegación</a>
  <a href="#" class="btn-arrow inline-flex items-center gap-2 font-display font-medium text-text-link">Ver todos los casos <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a>
  <p class="rounded-card bg-surface-dark p-6 text-body text-text-on-dark-secondary">Sobre banda oscura: <a href="#" class="link link-on-dark">contáctanos</a>.</p>
</div>
```

### React (JSX)

```jsx
export default function Link() {
  return (
    <div className="flex max-w-xl flex-col items-start gap-6">
      <p className="text-body text-text-secondary">Lee nuestra <a href="#" className="link">guía de modernización</a> antes de migrar.</p>
      <a href="#" className="nav-link font-medium">Enlace de navegación</a>
      <a href="#" className="btn-arrow inline-flex items-center gap-2 font-display font-medium text-text-link">Ver todos los casos <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></a>
      <p className="rounded-card bg-surface-dark p-6 text-body text-text-on-dark-secondary">Sobre banda oscura: <a href="#" className="link link-on-dark">contáctanos</a>.</p>
    </div>
  );
}
```

### Reglas de uso

- Dentro de un párrafo, siempre subrayado (`link`).
- El texto dice a dónde lleva; nunca “clic aquí”.

## Megamenú (`megamenu`)

> Menú amplio con columnas de enlaces y un destacado.

### HTML

```html
<nav class="relative w-full max-w-4xl rounded-card border border-border-default bg-white px-4" aria-label="Principal">
  <ul class="flex h-16 items-center gap-1">
    <li class="mr-4 flex items-center gap-2 font-display text-h4 font-medium"><span class="size-2.5 bg-elevate-blue" aria-hidden="true"></span>Elaniin</li>
    <li>
      <details class="dropdown static">
        <summary class="nav-link-pill cursor-pointer gap-1">Servicios <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary>
        <div class="dropdown-panel inset-x-0 top-full mt-2 grid gap-8 p-6 sm:grid-cols-3">
          <div>
            <p class="mono-label text-caption text-text-muted">Construir</p>
            <ul class="mt-3 space-y-1">
              <li><a href="#" class="menu-item -mx-3 flex-col items-start justify-center gap-0 py-2"><span class="font-medium text-text-primary">Producto digital</span><span class="text-caption text-text-muted">De la idea al lanzamiento</span></a></li>
              <li><a href="#" class="menu-item -mx-3 flex-col items-start justify-center gap-0 py-2"><span class="font-medium text-text-primary">Apps móviles</span><span class="text-caption text-text-muted">iOS y Android</span></a></li>
            </ul>
          </div>
          <div>
            <p class="mono-label text-caption text-text-muted">Escalar</p>
            <ul class="mt-3 space-y-1">
              <li><a href="#" class="menu-item -mx-3 flex-col items-start justify-center gap-0 py-2"><span class="font-medium text-text-primary">Equipos dedicados</span><span class="text-caption text-text-muted">Ingenieros en tu producto</span></a></li>
              <li><a href="#" class="menu-item -mx-3 flex-col items-start justify-center gap-0 py-2"><span class="font-medium text-text-primary">Modernización</span><span class="text-caption text-text-muted">Sistemas críticos a la nube</span></a></li>
            </ul>
          </div>
          <a href="#" class="card card-dark lift focus-ring">
            <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/iso-dark.webp" alt="" class="aspect-video w-full object-cover">
            <span class="flex items-center gap-2 p-4 text-body-sm font-medium">Caso: banca digital <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span>
          </a>
        </div>
      </details>
    </li>
    <li><a href="#" class="nav-link-pill">Casos</a></li>
    <li><a href="#" class="nav-link-pill">Nosotros</a></li>
    <li class="ml-auto"><a href="#" class="btn btn-primary">Hablemos</a></li>
  </ul>
</nav>
```

### React (JSX)

```jsx
export default function Megamenu() {
  return (
    <nav className="relative w-full max-w-4xl rounded-card border border-border-default bg-white px-4" aria-label="Principal">
      <ul className="flex h-16 items-center gap-1">
        <li className="mr-4 flex items-center gap-2 font-display text-h4 font-medium"><span className="size-2.5 bg-elevate-blue" aria-hidden="true" />Elaniin</li>
        <li>
          <details className="dropdown static">
            <summary className="nav-link-pill cursor-pointer gap-1">Servicios <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
            <div className="dropdown-panel inset-x-0 top-full mt-2 grid gap-8 p-6 sm:grid-cols-3">
              <div>
                <p className="mono-label text-caption text-text-muted">Construir</p>
                <ul className="mt-3 space-y-1">
                  <li>
                    <a href="#" className="menu-item -mx-3 flex-col items-start justify-center gap-0 py-2">
                      <span className="font-medium text-text-primary">Producto digital</span>
                      <span className="text-caption text-text-muted">De la idea al lanzamiento</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="menu-item -mx-3 flex-col items-start justify-center gap-0 py-2">
                      <span className="font-medium text-text-primary">Apps móviles</span>
                      <span className="text-caption text-text-muted">iOS y Android</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="mono-label text-caption text-text-muted">Escalar</p>
                <ul className="mt-3 space-y-1">
                  <li>
                    <a href="#" className="menu-item -mx-3 flex-col items-start justify-center gap-0 py-2">
                      <span className="font-medium text-text-primary">Equipos dedicados</span>
                      <span className="text-caption text-text-muted">Ingenieros en tu producto</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="menu-item -mx-3 flex-col items-start justify-center gap-0 py-2">
                      <span className="font-medium text-text-primary">Modernización</span>
                      <span className="text-caption text-text-muted">Sistemas críticos a la nube</span>
                    </a>
                  </li>
                </ul>
              </div>
              <a href="#" className="card card-dark lift focus-ring">
                <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/iso-dark.webp" alt="" className="aspect-video w-full object-cover" />
                <span className="flex items-center gap-2 p-4 text-body-sm font-medium">Caso: banca digital <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></span>
              </a>
            </div>
          </details>
        </li>
        <li>
          <a href="#" className="nav-link-pill">Casos</a>
        </li>
        <li>
          <a href="#" className="nav-link-pill">Nosotros</a>
        </li>
        <li className="ml-auto">
          <a href="#" className="btn btn-primary">Hablemos</a>
        </li>
      </ul>
    </nav>
  );
}
```

### Reglas de uso

- Máximo 3 columnas más 1 destacado.
- Cada columna con título en `mono-label`.
- En móvil, la misma navegación va en un Drawer.

## Menú (`menu`)

> Lista vertical de enlaces con grupos, íconos y contadores.

### HTML

```html
<nav class="w-64 rounded-card border border-border-default bg-white p-2" aria-label="Proyecto">
  <p class="mono-label px-3 pb-2 pt-2 text-caption text-text-disabled">Proyecto</p>
  <ul class="space-y-0.5">
    <li><a href="#" class="menu-item" aria-current="page"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/></svg> Resumen</a></li>
    <li><a href="#" class="menu-item"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></svg> Entregables</a></li>
    <li><a href="#" class="menu-item"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg> Equipo</a></li>
    <li><a href="#" class="menu-item"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 16v-5a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 21h4"/></svg> Avisos <span class="badge badge-info ml-auto">3</span></a></li>
  </ul>
  <p class="mono-label px-3 pb-2 pt-5 text-caption text-text-disabled">Cuenta</p>
  <ul class="space-y-0.5">
    <li><a href="#" class="menu-item">Facturación</a></li>
    <li><a href="#" class="menu-item">Cerrar sesión</a></li>
  </ul>
</nav>
```

### React (JSX)

```jsx
export default function Menu() {
  return (
    <nav className="w-64 rounded-card border border-border-default bg-white p-2" aria-label="Proyecto">
      <p className="mono-label px-3 pb-2 pt-2 text-caption text-text-disabled">Proyecto</p>
      <ul className="space-y-0.5">
        <li>
          <a href="#" className="menu-item" aria-current="page"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z" /></svg> Resumen</a>
        </li>
        <li>
          <a href="#" className="menu-item"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="4" y="4" width="7" height="7" /><rect x="13" y="4" width="7" height="7" /><rect x="4" y="13" width="7" height="7" /><rect x="13" y="13" width="7" height="7" /></svg> Entregables</a>
        </li>
        <li>
          <a href="#" className="menu-item"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg> Equipo</a>
        </li>
        <li>
          <a href="#" className="menu-item"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M6 16v-5a6 6 0 1 1 12 0v5l2 2H4z" /><path d="M10 21h4" /></svg> Avisos <span className="badge badge-info ml-auto">3</span></a>
        </li>
      </ul>
      <p className="mono-label px-3 pb-2 pt-5 text-caption text-text-disabled">Cuenta</p>
      <ul className="space-y-0.5">
        <li>
          <a href="#" className="menu-item">Facturación</a>
        </li>
        <li>
          <a href="#" className="menu-item">Cerrar sesión</a>
        </li>
      </ul>
    </nav>
  );
}
```

### Reglas de uso

- `aria-current="page"` en el ítem activo.
- Íconos de 20 px con el mismo trazo (1.5).

## Barra de navegación (`navbar`)

> Encabezado fijo con logo, enlaces y un CTA.

### HTML

```html
<header class="sticky top-0 z-30 w-full border-b border-border-default bg-white/90 backdrop-blur">
  <div class="container-site flex h-16 items-center justify-between gap-6">
    <a href="#" class="flex items-center gap-2 rounded-button font-display text-h4 font-medium focus-ring"><span class="size-2.5 bg-elevate-blue" aria-hidden="true"></span>Elaniin</a>
    <nav aria-label="Principal" class="hidden md:block">
      <ul class="flex items-center gap-1">
        <li><a href="#" class="nav-link-pill">Servicios</a></li>
        <li><a href="#" class="nav-link-pill">Casos</a></li>
        <li><a href="#" class="nav-link-pill">Nosotros</a></li>
        <li><a href="#" class="nav-link-pill">Blog</a></li>
      </ul>
    </nav>
    <div class="flex items-center gap-2">
      <a href="#" class="btn btn-primary hidden sm:inline-flex">Hablemos</a>
      <button type="button" class="btn btn-ghost btn-square md:hidden" aria-label="Abrir menú"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
    </div>
  </div>
</header>
```

### React (JSX)

```jsx
export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border-default bg-white/90 backdrop-blur">
      <div className="container-site flex h-16 items-center justify-between gap-6">
        <a href="#" className="flex items-center gap-2 rounded-button font-display text-h4 font-medium focus-ring"><span className="size-2.5 bg-elevate-blue" aria-hidden="true" />Elaniin</a>
        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            <li>
              <a href="#" className="nav-link-pill">Servicios</a>
            </li>
            <li>
              <a href="#" className="nav-link-pill">Casos</a>
            </li>
            <li>
              <a href="#" className="nav-link-pill">Nosotros</a>
            </li>
            <li>
              <a href="#" className="nav-link-pill">Blog</a>
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a href="#" className="btn btn-primary hidden sm:inline-flex">Hablemos</a>
          <button type="button" className="btn btn-ghost btn-square md:hidden" aria-label="Abrir menú">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
```

### Reglas de uso

- Alto 64 px, `sticky`, fondo blanco al 90 % con blur.
- Un solo CTA primario, a la derecha.
- Reemplaza el texto “Elaniin” por el SVG oficial del logo.

## Paginación (`pagination`)

> Navega entre páginas de resultados.

### HTML

```html
<nav aria-label="Paginación" class="join">
  <a href="#" class="btn btn-secondary btn-square" aria-label="Página anterior"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg></a>
  <a href="#" class="btn btn-secondary btn-square">1</a>
  <a href="#" class="btn btn-secondary btn-square" aria-current="page">2</a>
  <a href="#" class="btn btn-secondary btn-square">3</a>
  <span class="btn btn-secondary btn-square pointer-events-none text-text-muted" aria-hidden="true">…</span>
  <a href="#" class="btn btn-secondary btn-square">12</a>
  <a href="#" class="btn btn-secondary btn-square" aria-label="Página siguiente"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></a>
</nav>
```

### React (JSX)

```jsx
export default function Pagination() {
  return (
    <nav aria-label="Paginación" className="join">
      <a href="#" className="btn btn-secondary btn-square" aria-label="Página anterior">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="m15 6-6 6 6 6" />
        </svg>
      </a>
      <a href="#" className="btn btn-secondary btn-square">1</a>
      <a href="#" className="btn btn-secondary btn-square" aria-current="page">2</a>
      <a href="#" className="btn btn-secondary btn-square">3</a>
      <span className="btn btn-secondary btn-square pointer-events-none text-text-muted" aria-hidden="true">…</span>
      <a href="#" className="btn btn-secondary btn-square">12</a>
      <a href="#" className="btn btn-secondary btn-square" aria-label="Página siguiente">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="m9 6 6 6-6 6" />
        </svg>
      </a>
    </nav>
  );
}
```

### Reglas de uso

- `aria-current="page"` en la página actual.
- En móvil muestra solo anterior, actual y siguiente.

## Pasos (`steps`)

> Progreso de un proceso en etapas.

### HTML

```html
<ol class="grid w-full max-w-3xl grid-cols-4 text-center text-body-sm">
  <li class="relative flex flex-col items-center gap-3 after:absolute after:left-1/2 after:top-4 after:h-px after:w-full after:bg-elevate-blue">
    <span class="relative z-1 grid size-8 place-items-center rounded-full bg-elevate-blue text-white"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg></span>
    <span>Brief</span>
  </li>
  <li class="relative flex flex-col items-center gap-3 after:absolute after:left-1/2 after:top-4 after:h-px after:w-full after:bg-border-strong">
    <span class="relative z-1 grid size-8 place-items-center rounded-full bg-elevate-blue text-white"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg></span>
    <span>Propuesta</span>
  </li>
  <li class="relative flex flex-col items-center gap-3 after:absolute after:left-1/2 after:top-4 after:h-px after:w-full after:bg-border-strong" aria-current="step">
    <span class="relative z-1 grid size-8 place-items-center rounded-full border-2 border-elevate-blue bg-white font-mono text-elevate-blue">3</span>
    <span class="font-medium">Desarrollo</span>
  </li>
  <li class="flex flex-col items-center gap-3 text-text-muted">
    <span class="grid size-8 place-items-center rounded-full border border-border-strong bg-white font-mono">4</span>
    <span>Lanzamiento</span>
  </li>
</ol>
```

### React (JSX)

```jsx
export default function Steps() {
  return (
    <ol className="grid w-full max-w-3xl grid-cols-4 text-center text-body-sm">
      <li className="relative flex flex-col items-center gap-3 after:absolute after:left-1/2 after:top-4 after:h-px after:w-full after:bg-elevate-blue">
        <span className="relative z-1 grid size-8 place-items-center rounded-full bg-elevate-blue text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="m5 12 5 5L20 7" />
          </svg>
        </span>
        <span>Brief</span>
      </li>
      <li className="relative flex flex-col items-center gap-3 after:absolute after:left-1/2 after:top-4 after:h-px after:w-full after:bg-border-strong">
        <span className="relative z-1 grid size-8 place-items-center rounded-full bg-elevate-blue text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="m5 12 5 5L20 7" />
          </svg>
        </span>
        <span>Propuesta</span>
      </li>
      <li className="relative flex flex-col items-center gap-3 after:absolute after:left-1/2 after:top-4 after:h-px after:w-full after:bg-border-strong" aria-current="step">
        <span className="relative z-1 grid size-8 place-items-center rounded-full border-2 border-elevate-blue bg-white font-mono text-elevate-blue">3</span>
        <span className="font-medium">Desarrollo</span>
      </li>
      <li className="flex flex-col items-center gap-3 text-text-muted">
        <span className="grid size-8 place-items-center rounded-full border border-border-strong bg-white font-mono">4</span>
        <span>Lanzamiento</span>
      </li>
    </ol>
  );
}
```

### Reglas de uso

- `aria-current="step"` en el paso actual.
- Completado: check en Elevate Blue. Pendiente: número en gris.

## Pestañas (`tab`)

> Cambia entre paneles de contenido. Sin JavaScript: radios con el mismo name.

### HTML

```html
<div class="tabs w-full max-w-2xl">
  <label class="tab"><input type="radio" name="tabs-demo" class="sr-only" checked>Diseño</label>
  <div class="tab-panel text-body text-text-secondary">Investigación, UX y sistema de diseño para tu producto.</div>
  <label class="tab"><input type="radio" name="tabs-demo" class="sr-only">Desarrollo</label>
  <div class="tab-panel text-body text-text-secondary">Web, móvil y backend con despliegue continuo.</div>
  <label class="tab"><input type="radio" name="tabs-demo" class="sr-only">IA</label>
  <div class="tab-panel text-body text-text-secondary">Agentes, automatización y datos conectados a tus sistemas.</div>
</div>
```

### React (JSX)

```jsx
export default function Tab() {
  return (
    <div className="tabs w-full max-w-2xl">
      <label className="tab"><input type="radio" name="tabs-demo" className="sr-only" defaultChecked />Diseño</label>
      <div className="tab-panel text-body text-text-secondary">Investigación, UX y sistema de diseño para tu producto.</div>
      <label className="tab"><input type="radio" name="tabs-demo" className="sr-only" />Desarrollo</label>
      <div className="tab-panel text-body text-text-secondary">Web, móvil y backend con despliegue continuo.</div>
      <label className="tab"><input type="radio" name="tabs-demo" className="sr-only" />IA</label>
      <div className="tab-panel text-body text-text-secondary">Agentes, automatización y datos conectados a tus sistemas.</div>
    </div>
  );
}
```

### Reglas de uso

- Cada grupo de pestañas con su propio `name`.
- Las flechas del teclado cambian de pestaña (comportamiento nativo del radio).
- Para pestañas ARIA completas (`role="tablist"`), usa tu librería.

# Feedback

## Alerta (`alert`)

> Mensajes de información, éxito, advertencia y error.

### HTML

```html
<div class="flex w-full max-w-xl flex-col gap-3">
  <div role="status" class="alert alert-info"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg><div><p class="font-medium">Nueva versión disponible</p><p class="mt-0.5">Elaniin Assets 1.4 trae 68 componentes.</p></div></div>
  <div role="status" class="alert alert-success"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg><p>Cambios guardados.</p></div>
  <div role="alert" class="alert alert-warning"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17h.01"/></svg><p>Tu sesión vence en 5 minutos.</p></div>
  <div role="alert" class="alert alert-error"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/></svg><p class="flex-1">No pudimos enviar el formulario.</p><button type="button" class="font-medium underline underline-offset-4">Reintentar</button></div>
</div>
```

### React (JSX)

```jsx
export default function Alert() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <div role="status" className="alert alert-info">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" />
        </svg>
        <div>
          <p className="font-medium">Nueva versión disponible</p>
          <p className="mt-0.5">Elaniin Assets 1.4 trae 68 componentes.</p>
        </div>
      </div>
      <div role="status" className="alert alert-success">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 3 3 5-6" />
        </svg>
        <p>Cambios guardados.</p>
      </div>
      <div role="alert" className="alert alert-warning">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M12 3 2 20h20L12 3Z" />
          <path d="M12 10v4M12 17h.01" />
        </svg>
        <p>Tu sesión vence en 5 minutos.</p>
      </div>
      <div role="alert" className="alert alert-error">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="m9 9 6 6M15 9l-6 6" />
        </svg>
        <p className="flex-1">No pudimos enviar el formulario.</p>
        <button type="button" className="font-medium underline underline-offset-4">Reintentar</button>
      </div>
    </div>
  );
}
```

### Reglas de uso

- `role="alert"` solo para lo urgente; el resto `role="status"`.
- Ícono y texto: el color nunca es la única señal.

## Carga (`loading`)

> Indicadores de espera: spinner, puntos y botón ocupado.

### HTML

```html
<div class="flex flex-wrap items-center gap-10">
  <span class="spinner" role="status" aria-label="Cargando"></span>
  <span class="spinner size-8" role="status" aria-label="Cargando"></span>
  <span class="typing-dots" role="status" aria-label="Escribiendo"><i></i><i></i><i></i></span>
  <button type="button" class="btn btn-primary" aria-busy="true"><span class="spinner border-white/40 border-t-white"></span>Procesando</button>
</div>
```

### React (JSX)

```jsx
export default function Loading() {
  return (
    <div className="flex flex-wrap items-center gap-10">
      <span className="spinner" role="status" aria-label="Cargando" />
      <span className="spinner size-8" role="status" aria-label="Cargando" />
      <span className="typing-dots" role="status" aria-label="Escribiendo">
        <i />
        <i />
        <i />
      </span>
      <button type="button" className="btn btn-primary" aria-busy="true"><span className="spinner border-white/40 border-t-white" />Procesando</button>
    </div>
  );
}
```

### Reglas de uso

- Spinner solo para esperas cortas (menos de 3 s); para más, Skeleton o Progreso.
- Siempre `role="status"` con `aria-label`.

## Barra de progreso (`progress`)

> Avance de una tarea con porcentaje visible.

### HTML

```html
<div class="w-full max-w-md space-y-6">
  <div>
    <div class="flex justify-between text-body-sm"><label for="progress-files" class="font-medium">Subiendo archivos</label><span class="font-mono text-text-muted">72%</span></div>
    <progress id="progress-files" class="progress mt-2" value="72" max="100">72%</progress>
  </div>
  <div>
    <div class="flex justify-between text-body-sm"><label for="progress-sprint" class="font-medium">Sprint 4 de 6</label><span class="font-mono text-text-muted">67%</span></div>
    <progress id="progress-sprint" class="progress mt-2 text-success-dot" value="4" max="6">4 de 6</progress>
  </div>
</div>
```

### React (JSX)

```jsx
export default function Progress() {
  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <div className="flex justify-between text-body-sm">
          <label htmlFor="progress-files" className="font-medium">Subiendo archivos</label>
          <span className="font-mono text-text-muted">72%</span>
        </div>
        <progress id="progress-files" className="progress mt-2" value="72" max="100">72%</progress>
      </div>
      <div>
        <div className="flex justify-between text-body-sm">
          <label htmlFor="progress-sprint" className="font-medium">Sprint 4 de 6</label>
          <span className="font-mono text-text-muted">67%</span>
        </div>
        <progress id="progress-sprint" className="progress mt-2 text-success-dot" value="4" max="6">4 de 6</progress>
      </div>
    </div>
  );
}
```

### Reglas de uso

- Muestra el porcentaje en texto al lado.
- Si no sabes cuánto falta, usa Carga.

## Progreso circular (`radial-progress`)

> Porcentaje en un anillo. El valor va en la variable --value.

### HTML

```html
<div class="flex flex-wrap items-center gap-8">
  <div class="radial-progress" style="--value: 72" role="progressbar" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100" aria-label="Avance del proyecto">72%</div>
  <div class="radial-progress font-display text-h4" style="--value: 40; --size: 7rem; --thickness: 8px" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" aria-label="Presupuesto usado">40%</div>
  <div class="radial-progress text-success-text" style="--value: 100" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" aria-label="Pruebas completas"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg></div>
</div>
```

### React (JSX)

```jsx
export default function RadialProgress() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <div className="radial-progress" style={{ '--value': '72' }} role="progressbar" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100" aria-label="Avance del proyecto">72%</div>
      <div className="radial-progress font-display text-h4" style={{ '--value': '40', '--size': '7rem', '--thickness': '8px' }} role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" aria-label="Presupuesto usado">40%</div>
      <div className="radial-progress text-success-text" style={{ '--value': '100' }} role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" aria-label="Pruebas completas">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="m5 12 5 5L20 7" />
        </svg>
      </div>
    </div>
  );
}
```

### Reglas de uso

- Actualiza `--value` y `aria-valuenow` juntos.
- Hasta 3 por fila; con más datos, usa Estadística.

## Skeleton (`skeleton`)

> Silueta del contenido mientras carga.

### HTML

```html
<div class="card w-full max-w-sm" aria-busy="true" aria-label="Cargando caso">
  <div class="skeleton aspect-4/3 rounded-none"></div>
  <div class="space-y-3 pad-card">
    <div class="skeleton h-3 w-24"></div>
    <div class="skeleton h-6 w-4/5"></div>
    <div class="skeleton h-4 w-full"></div>
    <div class="skeleton h-4 w-2/3"></div>
  </div>
</div>
```

### React (JSX)

```jsx
export default function Skeleton() {
  return (
    <div className="card w-full max-w-sm" aria-busy="true" aria-label="Cargando caso">
      <div className="skeleton aspect-4/3 rounded-none" />
      <div className="space-y-3 pad-card">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-6 w-4/5" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
      </div>
    </div>
  );
}
```

### Reglas de uso

- Copia la forma real del contenido para que el layout no salte.
- `aria-busy="true"` en el contenedor mientras carga.

## Aviso (Toast) (`toast`)

> Confirmación breve en la esquina. Usa la API popover: sin JavaScript.

### HTML

```html
<button type="button" class="btn btn-primary" popovertarget="toast-demo">Guardar cambios</button>
<div id="toast-demo" popover class="toast">
  <div role="status" class="flex items-center gap-3 rounded-button bg-excellence-blue py-2 pl-4 pr-2 text-body-sm text-white shadow-menu">
    <span class="text-text-on-dark-accent"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg></span>
    <p class="flex-1">Cambios guardados.</p>
    <button type="button" class="btn btn-square text-white hover:bg-white/10" popovertarget="toast-demo" popovertargetaction="hide" aria-label="Cerrar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
  </div>
</div>
```

### React (JSX)

```jsx
export default function Toast() {
  return (
    <>
      <button type="button" className="btn btn-primary" popoverTarget="toast-demo">Guardar cambios</button>
      <div id="toast-demo" popover="auto" className="toast">
        <div role="status" className="flex items-center gap-3 rounded-button bg-excellence-blue py-2 pl-4 pr-2 text-body-sm text-white shadow-menu">
          <span className="text-text-on-dark-accent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="m8 12 3 3 5-6" />
            </svg>
          </span>
          <p className="flex-1">Cambios guardados.</p>
          <button type="button" className="btn btn-square text-white hover:bg-white/10" popoverTarget="toast-demo" popoverTargetAction="hide" aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
```

### Reglas de uso

- Una línea sobre algo que el usuario acaba de hacer.
- Ciérralo solo a los 4–6 s con `hidePopover()` o deja el botón cerrar.
- En React, `popoverTarget` necesita React 19.

## Tooltip (`tooltip`)

> Texto de ayuda al pasar el cursor o enfocar. Solo CSS, con data-tip.

### HTML

```html
<div class="flex items-center gap-8">
  <button type="button" class="tooltip btn btn-secondary btn-square" data-tip="Copiar enlace" aria-label="Copiar enlace"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/></svg></button>
  <span class="tooltip tooltip-bottom" data-tip="Tiempo promedio hasta producción"><span class="link cursor-help" tabindex="0">8 semanas</span></span>
</div>
```

### React (JSX)

```jsx
export default function Tooltip() {
  return (
    <div className="flex items-center gap-8">
      <button type="button" className="tooltip btn btn-secondary btn-square" data-tip="Copiar enlace" aria-label="Copiar enlace">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="8" y="8" width="12" height="12" rx="2" />
          <path d="M16 8V4H4v12h4" />
        </svg>
      </button>
      <span className="tooltip tooltip-bottom" data-tip="Tiempo promedio hasta producción">
        <span className="link cursor-help" tabIndex="0">8 semanas</span>
      </span>
    </div>
  );
}
```

### Reglas de uso

- Solo información extra: repite el texto en `aria-label` del control.
- Máximo 60 caracteres.

# Formularios

## Calendario (`calendar`)

> Piel Elaniin para un selector de fecha, más el input de fecha nativo.

### HTML

```html
<div class="flex flex-wrap items-start gap-8">
  <div class="w-fit rounded-card border border-border-default bg-white p-4">
    <div class="mb-2 flex items-center justify-between">
      <button type="button" class="btn btn-ghost btn-square" aria-label="Mes anterior"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg></button>
      <p class="font-display font-medium" aria-live="polite">Noviembre 2026</p>
      <button type="button" class="btn btn-ghost btn-square" aria-label="Mes siguiente"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></button>
    </div>
    <div class="calendar">
      <abbr title="lunes">L</abbr><abbr title="martes">M</abbr><abbr title="miércoles">X</abbr><abbr title="jueves">J</abbr><abbr title="viernes">V</abbr><abbr title="sábado">S</abbr><abbr title="domingo">D</abbr>
  <button type="button" class="col-start-7" aria-label="1 de noviembre">1</button>
  <button type="button" aria-label="2 de noviembre">2</button>
  <button type="button" aria-label="3 de noviembre">3</button>
  <button type="button" aria-label="4 de noviembre">4</button>
  <button type="button" aria-label="5 de noviembre">5</button>
  <button type="button" aria-current="date" aria-label="6 de noviembre">6</button>
  <button type="button" aria-label="7 de noviembre">7</button>
  <button type="button" aria-label="8 de noviembre">8</button>
  <button type="button" aria-label="9 de noviembre">9</button>
  <button type="button" aria-label="10 de noviembre">10</button>
  <button type="button" aria-label="11 de noviembre">11</button>
  <button type="button" aria-label="12 de noviembre">12</button>
  <button type="button" aria-label="13 de noviembre">13</button>
  <button type="button" aria-label="14 de noviembre">14</button>
  <button type="button" aria-label="15 de noviembre">15</button>
  <button type="button" aria-label="16 de noviembre">16</button>
  <button type="button" aria-label="17 de noviembre">17</button>
  <button type="button" aria-pressed="true" aria-label="18 de noviembre">18</button>
  <button type="button" aria-label="19 de noviembre">19</button>
  <button type="button" aria-label="20 de noviembre">20</button>
  <button type="button" aria-label="21 de noviembre">21</button>
  <button type="button" aria-label="22 de noviembre">22</button>
  <button type="button" aria-label="23 de noviembre">23</button>
  <button type="button" aria-label="24 de noviembre">24</button>
  <button type="button" aria-label="25 de noviembre">25</button>
  <button type="button" aria-label="26 de noviembre">26</button>
  <button type="button" aria-label="27 de noviembre">27</button>
  <button type="button" aria-label="28 de noviembre">28</button>
  <button type="button" aria-label="29 de noviembre">29</button>
  <button type="button" aria-label="30 de noviembre">30</button>
    </div>
  </div>
  <label class="block w-64">
    <span class="text-body-sm font-medium">Fecha de inicio</span>
    <input type="date" class="input mt-2" value="2026-11-18">
  </label>
</div>
```

### React (JSX)

```jsx
export default function Calendar() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <div className="w-fit rounded-card border border-border-default bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <button type="button" className="btn btn-ghost btn-square" aria-label="Mes anterior">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="m15 6-6 6 6 6" />
            </svg>
          </button>
          <p className="font-display font-medium" aria-live="polite">Noviembre 2026</p>
          <button type="button" className="btn btn-ghost btn-square" aria-label="Mes siguiente">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </button>
        </div>
        <div className="calendar">
          <abbr title="lunes">L</abbr>
          <abbr title="martes">M</abbr>
          <abbr title="miércoles">X</abbr>
          <abbr title="jueves">J</abbr>
          <abbr title="viernes">V</abbr>
          <abbr title="sábado">S</abbr>
          <abbr title="domingo">D</abbr>
          <button type="button" className="col-start-7" aria-label="1 de noviembre">1</button>
          <button type="button" aria-label="2 de noviembre">2</button>
          <button type="button" aria-label="3 de noviembre">3</button>
          <button type="button" aria-label="4 de noviembre">4</button>
          <button type="button" aria-label="5 de noviembre">5</button>
          <button type="button" aria-current="date" aria-label="6 de noviembre">6</button>
          <button type="button" aria-label="7 de noviembre">7</button>
          <button type="button" aria-label="8 de noviembre">8</button>
          <button type="button" aria-label="9 de noviembre">9</button>
          <button type="button" aria-label="10 de noviembre">10</button>
          <button type="button" aria-label="11 de noviembre">11</button>
          <button type="button" aria-label="12 de noviembre">12</button>
          <button type="button" aria-label="13 de noviembre">13</button>
          <button type="button" aria-label="14 de noviembre">14</button>
          <button type="button" aria-label="15 de noviembre">15</button>
          <button type="button" aria-label="16 de noviembre">16</button>
          <button type="button" aria-label="17 de noviembre">17</button>
          <button type="button" aria-pressed="true" aria-label="18 de noviembre">18</button>
          <button type="button" aria-label="19 de noviembre">19</button>
          <button type="button" aria-label="20 de noviembre">20</button>
          <button type="button" aria-label="21 de noviembre">21</button>
          <button type="button" aria-label="22 de noviembre">22</button>
          <button type="button" aria-label="23 de noviembre">23</button>
          <button type="button" aria-label="24 de noviembre">24</button>
          <button type="button" aria-label="25 de noviembre">25</button>
          <button type="button" aria-label="26 de noviembre">26</button>
          <button type="button" aria-label="27 de noviembre">27</button>
          <button type="button" aria-label="28 de noviembre">28</button>
          <button type="button" aria-label="29 de noviembre">29</button>
          <button type="button" aria-label="30 de noviembre">30</button>
        </div>
      </div>
      <label className="block w-64">
        <span className="text-body-sm font-medium">Fecha de inicio</span>
        <input type="date" className="input mt-2" defaultValue="2026-11-18" />
      </label>
    </div>
  );
}
```

### Reglas de uso

- En formularios, prefiere `<input type="date">`: accesible y nativo en móvil.
- El grid es la piel: conéctalo a react-day-picker o Cally para la lógica.
- `aria-current="date"` en hoy y `aria-pressed="true"` en el día elegido.

## Casilla (`checkbox`)

> Selección múltiple dentro de un grupo.

### HTML

```html
<fieldset>
  <legend class="mb-2 font-display font-medium">¿Qué necesitas?</legend>
  <label class="flex min-h-11 items-center gap-3 text-body-sm"><input type="checkbox" class="checkbox" checked>Sitio web</label>
  <label class="flex min-h-11 items-center gap-3 text-body-sm"><input type="checkbox" class="checkbox">App móvil</label>
  <label class="flex min-h-11 items-center gap-3 text-body-sm"><input type="checkbox" class="checkbox">Equipo dedicado</label>
  <label class="flex min-h-11 items-center gap-3 text-body-sm text-text-disabled"><input type="checkbox" class="checkbox" disabled>Hardware (no disponible)</label>
</fieldset>
```

### React (JSX)

```jsx
export default function Checkbox() {
  return (
    <fieldset>
      <legend className="mb-2 font-display font-medium">¿Qué necesitas?</legend>
      <label className="flex min-h-11 items-center gap-3 text-body-sm"><input type="checkbox" className="checkbox" defaultChecked />Sitio web</label>
      <label className="flex min-h-11 items-center gap-3 text-body-sm"><input type="checkbox" className="checkbox" />App móvil</label>
      <label className="flex min-h-11 items-center gap-3 text-body-sm"><input type="checkbox" className="checkbox" />Equipo dedicado</label>
      <label className="flex min-h-11 items-center gap-3 text-body-sm text-text-disabled"><input type="checkbox" className="checkbox" disabled />Hardware (no disponible)</label>
    </fieldset>
  );
}
```

### Reglas de uso

- Toda la fila es clicable: el `label` envuelve al input.
- Agrupa con `fieldset` y `legend`.

## Fieldset (`fieldset`)

> Agrupa campos relacionados bajo un título.

### HTML

```html
<form class="w-full max-w-md">
  <fieldset class="rounded-card border border-border-default bg-white px-6 pb-6 pt-2">
    <legend class="px-2 font-display text-h4 font-medium">Datos de contacto</legend>
    <div class="space-y-4">
      <label class="block"><span class="text-body-sm font-medium">Nombre</span><input type="text" class="input mt-2" autocomplete="name"></label>
      <label class="block"><span class="text-body-sm font-medium">Empresa</span><input type="text" class="input mt-2" autocomplete="organization"></label>
      <p class="text-caption text-text-muted">Usamos estos datos solo para responderte.</p>
    </div>
  </fieldset>
</form>
```

### React (JSX)

```jsx
export default function Fieldset() {
  return (
    <form className="w-full max-w-md">
      <fieldset className="rounded-card border border-border-default bg-white px-6 pb-6 pt-2">
        <legend className="px-2 font-display text-h4 font-medium">Datos de contacto</legend>
        <div className="space-y-4">
          <label className="block">
            <span className="text-body-sm font-medium">Nombre</span>
            <input type="text" className="input mt-2" autoComplete="name" />
          </label>
          <label className="block">
            <span className="text-body-sm font-medium">Empresa</span>
            <input type="text" className="input mt-2" autoComplete="organization" />
          </label>
          <p className="text-caption text-text-muted">Usamos estos datos solo para responderte.</p>
        </div>
      </fieldset>
    </form>
  );
}
```

### Reglas de uso

- Un `fieldset` por grupo lógico; el `legend` es su título.

## Carga de archivos (`file-input`)

> Campo de archivo y zona grande para subir imágenes.

### HTML

```html
<div class="w-full max-w-md space-y-6">
  <label class="block">
    <span class="text-body-sm font-medium">Brief del proyecto</span>
    <input type="file" class="file-input mt-2" accept=".pdf,.doc,.docx">
    <span class="mt-2 block text-caption text-text-muted">PDF o Word, máximo 10 MB.</span>
  </label>
  <label class="flex cursor-pointer flex-col items-center gap-2 rounded-card border border-dashed border-border-strong bg-surface-subtle px-6 py-10 text-center transition-colors duration-base hover:border-elevate-blue has-focus-visible:shadow-focus">
    <span class="text-text-muted"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 16V4m0 0-4 4m4-4 4 4M4 20h16"/></svg></span>
    <span class="font-medium">Elige imágenes</span>
    <span class="text-caption text-text-muted">PNG, JPG o WebP</span>
    <input type="file" class="sr-only" multiple accept="image/*">
  </label>
</div>
```

### React (JSX)

```jsx
export default function FileInput() {
  return (
    <div className="w-full max-w-md space-y-6">
      <label className="block">
        <span className="text-body-sm font-medium">Brief del proyecto</span>
        <input type="file" className="file-input mt-2" accept=".pdf,.doc,.docx" />
        <span className="mt-2 block text-caption text-text-muted">PDF o Word, máximo 10 MB.</span>
      </label>
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-card border border-dashed border-border-strong bg-surface-subtle px-6 py-10 text-center transition-colors duration-base hover:border-elevate-blue has-focus-visible:shadow-focus">
        <span className="text-text-muted">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M12 16V4m0 0-4 4m4-4 4 4M4 20h16" />
          </svg>
        </span>
        <span className="font-medium">Elige imágenes</span>
        <span className="text-caption text-text-muted">PNG, JPG o WebP</span>
        <input type="file" className="sr-only" multiple accept="image/*" />
      </label>
    </div>
  );
}
```

### Reglas de uso

- `accept` y tamaño máximo también en el texto de ayuda.
- Arrastrar y soltar necesita JS (`dragover` / `drop`).

## Filtro (`filter`)

> Elige una opción y las demás se ocultan; la × la quita. Sin JavaScript.

### HTML

```html
<form class="filter-group" aria-label="Filtrar casos">
  <input type="reset" value="×" class="chip w-11 justify-center px-0 text-body" aria-label="Quitar filtro">
  <label class="chip"><input type="radio" name="industria" class="sr-only">Fintech</label>
  <label class="chip"><input type="radio" name="industria" class="sr-only">Salud</label>
  <label class="chip"><input type="radio" name="industria" class="sr-only">Retail</label>
  <label class="chip"><input type="radio" name="industria" class="sr-only">Gobierno</label>
</form>
```

### React (JSX)

```jsx
export default function Filter() {
  return (
    <form className="filter-group" aria-label="Filtrar casos">
      <input type="reset" value="×" className="chip w-11 justify-center px-0 text-body" aria-label="Quitar filtro" />
      <label className="chip"><input type="radio" name="industria" className="sr-only" />Fintech</label>
      <label className="chip"><input type="radio" name="industria" className="sr-only" />Salud</label>
      <label className="chip"><input type="radio" name="industria" className="sr-only" />Retail</label>
      <label className="chip"><input type="radio" name="industria" className="sr-only" />Gobierno</label>
    </form>
  );
}
```

### Reglas de uso

- La × aparece solo con una opción elegida.
- Para varias opciones a la vez, usa checkboxes con `chip`.

## Etiqueta (`label`)

> Etiqueta arriba, prefijo dentro del campo y etiqueta flotante.

### HTML

```html
<div class="w-full max-w-md space-y-6">
  <label class="block">
    <span class="text-body-sm font-medium">Correo</span>
    <input type="email" class="input mt-2" placeholder="tu@empresa.com" autocomplete="email">
  </label>
  <label class="input gap-2">
    <span class="shrink-0 text-text-muted">https://</span>
    <input type="text" placeholder="tusitio.com" aria-label="Sitio web">
  </label>
  <label class="relative block">
    <input type="text" class="input peer h-14 pt-5" placeholder=" " autocomplete="organization">
    <span class="pointer-events-none absolute left-3 top-2 text-caption text-text-muted transition-all duration-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-body peer-focus:top-2 peer-focus:text-caption">Empresa</span>
  </label>
</div>
```

### React (JSX)

```jsx
export default function Label() {
  return (
    <div className="w-full max-w-md space-y-6">
      <label className="block">
        <span className="text-body-sm font-medium">Correo</span>
        <input type="email" className="input mt-2" placeholder="tu@empresa.com" autoComplete="email" />
      </label>
      <label className="input gap-2">
        <span className="shrink-0 text-text-muted">https://</span>
        <input type="text" placeholder="tusitio.com" aria-label="Sitio web" />
      </label>
      <label className="relative block">
        <input type="text" className="input peer h-14 pt-5" placeholder=" " autoComplete="organization" />
        <span className="pointer-events-none absolute left-3 top-2 text-caption text-text-muted transition-all duration-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-body peer-focus:top-2 peer-focus:text-caption">Empresa</span>
      </label>
    </div>
  );
}
```

### Reglas de uso

- Siempre una etiqueta visible: el placeholder no la reemplaza.
- Etiqueta flotante: `placeholder=" "` (un espacio) es obligatorio.

## Opción (Radio) (`radio`)

> Una sola opción dentro de un grupo, en lista o como cards.

### HTML

```html
<div class="flex flex-wrap items-start gap-10">
  <fieldset>
    <legend class="mb-2 font-display font-medium">Presupuesto</legend>
    <label class="flex min-h-11 items-center gap-3 text-body-sm"><input type="radio" name="presupuesto" class="radio" checked>Menos de USD 25 k</label>
    <label class="flex min-h-11 items-center gap-3 text-body-sm"><input type="radio" name="presupuesto" class="radio">USD 25 k a 75 k</label>
    <label class="flex min-h-11 items-center gap-3 text-body-sm"><input type="radio" name="presupuesto" class="radio">Más de USD 75 k</label>
  </fieldset>
  <fieldset class="grid w-72 gap-3">
    <legend class="mb-2 font-display font-medium">Modalidad</legend>
    <label class="card cursor-pointer flex-row items-start gap-3 p-4 has-checked:border-elevate-blue has-checked:bg-blue-tint-50"><input type="radio" name="modalidad" class="radio mt-0.5" checked><span><span class="block font-medium">Proyecto cerrado</span><span class="block text-body-sm text-text-secondary">Alcance y precio fijos</span></span></label>
    <label class="card cursor-pointer flex-row items-start gap-3 p-4 has-checked:border-elevate-blue has-checked:bg-blue-tint-50"><input type="radio" name="modalidad" class="radio mt-0.5"><span><span class="block font-medium">Equipo dedicado</span><span class="block text-body-sm text-text-secondary">Capacidad mensual</span></span></label>
  </fieldset>
</div>
```

### React (JSX)

```jsx
export default function Radio() {
  return (
    <div className="flex flex-wrap items-start gap-10">
      <fieldset>
        <legend className="mb-2 font-display font-medium">Presupuesto</legend>
        <label className="flex min-h-11 items-center gap-3 text-body-sm"><input type="radio" name="presupuesto" className="radio" defaultChecked />Menos de USD 25 k</label>
        <label className="flex min-h-11 items-center gap-3 text-body-sm"><input type="radio" name="presupuesto" className="radio" />USD 25 k a 75 k</label>
        <label className="flex min-h-11 items-center gap-3 text-body-sm"><input type="radio" name="presupuesto" className="radio" />Más de USD 75 k</label>
      </fieldset>
      <fieldset className="grid w-72 gap-3">
        <legend className="mb-2 font-display font-medium">Modalidad</legend>
        <label className="card cursor-pointer flex-row items-start gap-3 p-4 has-checked:border-elevate-blue has-checked:bg-blue-tint-50">
          <input type="radio" name="modalidad" className="radio mt-0.5" defaultChecked />
          <span>
            <span className="block font-medium">Proyecto cerrado</span>
            <span className="block text-body-sm text-text-secondary">Alcance y precio fijos</span>
          </span>
        </label>
        <label className="card cursor-pointer flex-row items-start gap-3 p-4 has-checked:border-elevate-blue has-checked:bg-blue-tint-50">
          <input type="radio" name="modalidad" className="radio mt-0.5" />
          <span>
            <span className="block font-medium">Equipo dedicado</span>
            <span className="block text-body-sm text-text-secondary">Capacidad mensual</span>
          </span>
        </label>
      </fieldset>
    </div>
  );
}
```

### Reglas de uso

- El mismo `name` en todo el grupo y una opción marcada por defecto.
- Opciones como card: `has-checked:` pinta el borde.

## Rango (`range`)

> Elige un valor arrastrando, con el valor visible.

### HTML

```html
<label class="block w-full max-w-md">
  <span class="flex justify-between text-body-sm"><span class="font-medium">Tamaño del equipo</span><output id="range-out" class="font-mono text-text-muted">6 personas</output></span>
  <input type="range" class="range mt-3" min="1" max="20" value="6" oninput="document.getElementById('range-out').textContent = event.currentTarget.value + ' personas'">
  <span class="mt-1 flex justify-between font-mono text-caption text-text-muted"><span>1</span><span>20</span></span>
</label>
```

### React (JSX)

```jsx
export default function Range() {
  return (
    <label className="block w-full max-w-md">
      <span className="flex justify-between text-body-sm">
        <span className="font-medium">Tamaño del equipo</span>
        <output id="range-out" className="font-mono text-text-muted">6 personas</output>
      </span>
      <input type="range" className="range mt-3" min="1" max="20" defaultValue="6" onInput={(event) => { document.getElementById('range-out').textContent = event.currentTarget.value + ' personas'; }} />
      <span className="mt-1 flex justify-between font-mono text-caption text-text-muted">
        <span>1</span>
        <span>20</span>
      </span>
    </label>
  );
}
```

### Reglas de uso

- Muestra el valor actual en texto (`output`).
- Para valores exactos, usa un input numérico.

## Calificación (`rating`)

> Estrellas como radios: accesibles con teclado.

### HTML

```html
<div class="flex flex-col items-center gap-3">
  <div class="rating" role="radiogroup" aria-label="Calificación">
    <input type="radio" name="calificacion" aria-label="1 estrella">
    <input type="radio" name="calificacion" aria-label="2 estrellas">
    <input type="radio" name="calificacion" aria-label="3 estrellas">
    <input type="radio" name="calificacion" aria-label="4 estrellas" checked>
    <input type="radio" name="calificacion" aria-label="5 estrellas">
  </div>
  <p class="text-body-sm text-text-muted">4.0 · 128 reseñas</p>
</div>
```

### React (JSX)

```jsx
export default function Rating() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rating" role="radiogroup" aria-label="Calificación">
        <input type="radio" name="calificacion" aria-label="1 estrella" />
        <input type="radio" name="calificacion" aria-label="2 estrellas" />
        <input type="radio" name="calificacion" aria-label="3 estrellas" />
        <input type="radio" name="calificacion" aria-label="4 estrellas" defaultChecked />
        <input type="radio" name="calificacion" aria-label="5 estrellas" />
      </div>
      <p className="text-body-sm text-text-muted">4.0 · 128 reseñas</p>
    </div>
  );
}
```

### Reglas de uso

- Cada estrella es un radio con `aria-label`.
- Para mostrar un promedio (solo lectura) usa el número, no estrellas interactivas.

## Selector (`select`)

> Lista desplegable nativa con el estilo de los campos.

### HTML

```html
<label class="block w-full max-w-md">
  <span class="text-body-sm font-medium">Industria</span>
  <select class="select mt-2">
    <option value="">Elige una opción</option>
    <option>Fintech</option>
    <option selected>Salud</option>
    <option>Retail</option>
    <option>Sector público</option>
  </select>
</label>
```

### React (JSX)

```jsx
export default function Select() {
  return (
    <label className="block w-full max-w-md">
      <span className="text-body-sm font-medium">Industria</span>
      <select className="select mt-2" defaultValue="Salud">
        <option value="">Elige una opción</option>
        <option>Fintech</option>
        <option>Salud</option>
        <option>Retail</option>
        <option>Sector público</option>
      </select>
    </label>
  );
}
```

### Reglas de uso

- Nativo: funciona con teclado y en móvil.
- Con más de 15 opciones, usa un combobox con búsqueda.

## Campo de texto (`input`)

> Campos de texto, búsqueda y deshabilitado.

### HTML

```html
<div class="w-full max-w-md space-y-5">
  <label class="block">
    <span class="text-body-sm font-medium">Nombre</span>
    <input type="text" class="input mt-2" placeholder="Ana Rivera" autocomplete="name">
  </label>
  <label class="block">
    <span class="text-body-sm font-medium">Buscar</span>
    <span class="relative mt-2 block">
      <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></span>
      <input type="search" class="input pl-10" placeholder="Buscar casos">
    </span>
  </label>
  <label class="block">
    <span class="text-body-sm font-medium text-text-disabled">Código del proyecto</span>
    <input type="text" class="input mt-2" value="ELN-2026" disabled>
  </label>
</div>
```

### React (JSX)

```jsx
export default function Input() {
  return (
    <div className="w-full max-w-md space-y-5">
      <label className="block">
        <span className="text-body-sm font-medium">Nombre</span>
        <input type="text" className="input mt-2" placeholder="Ana Rivera" autoComplete="name" />
      </label>
      <label className="block">
        <span className="text-body-sm font-medium">Buscar</span>
        <span className="relative mt-2 block">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>
          <input type="search" className="input pl-10" placeholder="Buscar casos" />
        </span>
      </label>
      <label className="block">
        <span className="text-body-sm font-medium text-text-disabled">Código del proyecto</span>
        <input type="text" className="input mt-2" defaultValue="ELN-2026" disabled />
      </label>
    </div>
  );
}
```

### Reglas de uso

- Alto mínimo 44 px.
- `autocomplete` correcto en datos personales.

## Área de texto (`textarea`)

> Texto de varias líneas con límite visible.

### HTML

```html
<label class="block w-full max-w-md">
  <span class="text-body-sm font-medium">Cuéntanos del proyecto</span>
  <textarea class="textarea mt-2" rows="4" maxlength="500" placeholder="Objetivo, plazos y presupuesto aproximado"></textarea>
  <span class="mt-2 block text-right font-mono text-caption text-text-muted">Máximo 500 caracteres</span>
</label>
```

### React (JSX)

```jsx
export default function Textarea() {
  return (
    <label className="block w-full max-w-md">
      <span className="text-body-sm font-medium">Cuéntanos del proyecto</span>
      <textarea className="textarea mt-2" rows="4" maxLength="500" placeholder="Objetivo, plazos y presupuesto aproximado" />
      <span className="mt-2 block text-right font-mono text-caption text-text-muted">Máximo 500 caracteres</span>
    </label>
  );
}
```

### Reglas de uso

- Solo se redimensiona en vertical.
- Indica el límite de caracteres.

## Interruptor (`toggle`)

> Activa o desactiva una opción al instante.

### HTML

```html
<div class="w-full max-w-md divide-y divide-border-default rounded-card border border-border-default bg-white">
  <label class="flex items-center justify-between gap-6 px-5 py-4">
    <span><span class="block font-medium">Correos de avance</span><span class="block text-body-sm text-text-muted">Resumen semanal del proyecto</span></span>
    <input type="checkbox" class="toggle" role="switch" checked>
  </label>
  <label class="flex items-center justify-between gap-6 px-5 py-4">
    <span><span class="block font-medium">Alertas de despliegue</span><span class="block text-body-sm text-text-muted">Cada vez que sale una versión</span></span>
    <input type="checkbox" class="toggle" role="switch">
  </label>
  <label class="flex items-center justify-between gap-6 px-5 py-4 text-text-disabled">
    <span><span class="block font-medium">Modo beta</span><span class="block text-body-sm">Próximamente</span></span>
    <input type="checkbox" class="toggle" role="switch" disabled>
  </label>
</div>
```

### React (JSX)

```jsx
export default function Toggle() {
  return (
    <div className="w-full max-w-md divide-y divide-border-default rounded-card border border-border-default bg-white">
      <label className="flex items-center justify-between gap-6 px-5 py-4">
        <span>
          <span className="block font-medium">Correos de avance</span>
          <span className="block text-body-sm text-text-muted">Resumen semanal del proyecto</span>
        </span>
        <input type="checkbox" className="toggle" role="switch" defaultChecked />
      </label>
      <label className="flex items-center justify-between gap-6 px-5 py-4">
        <span>
          <span className="block font-medium">Alertas de despliegue</span>
          <span className="block text-body-sm text-text-muted">Cada vez que sale una versión</span>
        </span>
        <input type="checkbox" className="toggle" role="switch" />
      </label>
      <label className="flex items-center justify-between gap-6 px-5 py-4 text-text-disabled">
        <span>
          <span className="block font-medium">Modo beta</span>
          <span className="block text-body-sm">Próximamente</span>
        </span>
        <input type="checkbox" className="toggle" role="switch" disabled />
      </label>
    </div>
  );
}
```

### Reglas de uso

- `role="switch"`: el cambio aplica al instante, sin botón Guardar.
- Si hay que confirmar, usa Casilla.

## Validación (`validator`)

> Marca errores con la validación nativa, solo después de que el usuario escribe.

### HTML

```html
<form class="w-full max-w-md space-y-5">
  <label class="block">
    <span class="text-body-sm font-medium">Correo de trabajo</span>
    <input type="email" class="input peer mt-2" required placeholder="tu@empresa.com" autocomplete="email">
    <span class="mt-2 hidden items-center gap-2 text-caption text-error-text peer-user-invalid:flex"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/></svg> Escribe un correo válido.</span>
  </label>
  <label class="block">
    <span class="text-body-sm font-medium">Teléfono</span>
    <input type="tel" class="input peer mt-2" required pattern="[0-9 +()-]{8,}" placeholder="+503 0000 0000" autocomplete="tel">
    <span class="mt-2 hidden items-center gap-2 text-caption text-error-text peer-user-invalid:flex"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/></svg> Mínimo 8 dígitos.</span>
  </label>
  <button class="btn btn-primary">Enviar</button>
</form>
```

### React (JSX)

```jsx
export default function Validator() {
  return (
    <form className="w-full max-w-md space-y-5">
      <label className="block">
        <span className="text-body-sm font-medium">Correo de trabajo</span>
        <input type="email" className="input peer mt-2" required placeholder="tu@empresa.com" autoComplete="email" />
        <span className="mt-2 hidden items-center gap-2 text-caption text-error-text peer-user-invalid:flex"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6M15 9l-6 6" /></svg> Escribe un correo válido.</span>
      </label>
      <label className="block">
        <span className="text-body-sm font-medium">Teléfono</span>
        <input type="tel" className="input peer mt-2" required pattern="[0-9 +()-]{8,}" placeholder="+503 0000 0000" autoComplete="tel" />
        <span className="mt-2 hidden items-center gap-2 text-caption text-error-text peer-user-invalid:flex"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6M15 9l-6 6" /></svg> Mínimo 8 dígitos.</span>
      </label>
      <button className="btn btn-primary">Enviar</button>
    </form>
  );
}
```

### Reglas de uso

- Valida con atributos nativos (`required`, `type`, `pattern`).
- `:user-invalid` marca el error solo después de interactuar.
- El mensaje dice cómo corregir.

## Código (OTP) (`otp`)

> Código de verificación de 6 dígitos; el foco avanza solo.

### HTML

```html
<fieldset class="text-center">
  <legend class="mx-auto font-display text-h4 font-medium">Código de verificación</legend>
  <p class="mt-2 text-body-sm text-text-secondary">Lo enviamos a ana@empresa.com</p>
  <div class="mt-6 flex justify-center gap-2">
<input class="otp-cell" inputmode="numeric" maxlength="1" autocomplete="one-time-code" aria-label="Dígito 1" oninput="if (event.currentTarget.value) event.currentTarget.nextElementSibling?.focus()" onkeydown="if (event.key === 'Backspace' && !event.currentTarget.value) event.currentTarget.previousElementSibling?.focus()">
<input class="otp-cell" inputmode="numeric" maxlength="1" aria-label="Dígito 2" oninput="if (event.currentTarget.value) event.currentTarget.nextElementSibling?.focus()" onkeydown="if (event.key === 'Backspace' && !event.currentTarget.value) event.currentTarget.previousElementSibling?.focus()">
<input class="otp-cell" inputmode="numeric" maxlength="1" aria-label="Dígito 3" oninput="if (event.currentTarget.value) event.currentTarget.nextElementSibling?.focus()" onkeydown="if (event.key === 'Backspace' && !event.currentTarget.value) event.currentTarget.previousElementSibling?.focus()">
<input class="otp-cell" inputmode="numeric" maxlength="1" aria-label="Dígito 4" oninput="if (event.currentTarget.value) event.currentTarget.nextElementSibling?.focus()" onkeydown="if (event.key === 'Backspace' && !event.currentTarget.value) event.currentTarget.previousElementSibling?.focus()">
<input class="otp-cell" inputmode="numeric" maxlength="1" aria-label="Dígito 5" oninput="if (event.currentTarget.value) event.currentTarget.nextElementSibling?.focus()" onkeydown="if (event.key === 'Backspace' && !event.currentTarget.value) event.currentTarget.previousElementSibling?.focus()">
<input class="otp-cell" inputmode="numeric" maxlength="1" aria-label="Dígito 6" oninput="if (event.currentTarget.value) event.currentTarget.nextElementSibling?.focus()" onkeydown="if (event.key === 'Backspace' && !event.currentTarget.value) event.currentTarget.previousElementSibling?.focus()">
  </div>
</fieldset>
```

### React (JSX)

```jsx
export default function Otp() {
  return (
    <fieldset className="text-center">
      <legend className="mx-auto font-display text-h4 font-medium">Código de verificación</legend>
      <p className="mt-2 text-body-sm text-text-secondary">Lo enviamos a ana@empresa.com</p>
      <div className="mt-6 flex justify-center gap-2">
        <input className="otp-cell" inputMode="numeric" maxLength="1" autoComplete="one-time-code" aria-label="Dígito 1" onInput={(event) => { if (event.currentTarget.value) event.currentTarget.nextElementSibling?.focus(); }} onKeyDown={(event) => { if (event.key === 'Backspace' && !event.currentTarget.value) event.currentTarget.previousElementSibling?.focus(); }} />
        <input className="otp-cell" inputMode="numeric" maxLength="1" aria-label="Dígito 2" onInput={(event) => { if (event.currentTarget.value) event.currentTarget.nextElementSibling?.focus(); }} onKeyDown={(event) => { if (event.key === 'Backspace' && !event.currentTarget.value) event.currentTarget.previousElementSibling?.focus(); }} />
        <input className="otp-cell" inputMode="numeric" maxLength="1" aria-label="Dígito 3" onInput={(event) => { if (event.currentTarget.value) event.currentTarget.nextElementSibling?.focus(); }} onKeyDown={(event) => { if (event.key === 'Backspace' && !event.currentTarget.value) event.currentTarget.previousElementSibling?.focus(); }} />
        <input className="otp-cell" inputMode="numeric" maxLength="1" aria-label="Dígito 4" onInput={(event) => { if (event.currentTarget.value) event.currentTarget.nextElementSibling?.focus(); }} onKeyDown={(event) => { if (event.key === 'Backspace' && !event.currentTarget.value) event.currentTarget.previousElementSibling?.focus(); }} />
        <input className="otp-cell" inputMode="numeric" maxLength="1" aria-label="Dígito 5" onInput={(event) => { if (event.currentTarget.value) event.currentTarget.nextElementSibling?.focus(); }} onKeyDown={(event) => { if (event.key === 'Backspace' && !event.currentTarget.value) event.currentTarget.previousElementSibling?.focus(); }} />
        <input className="otp-cell" inputMode="numeric" maxLength="1" aria-label="Dígito 6" onInput={(event) => { if (event.currentTarget.value) event.currentTarget.nextElementSibling?.focus(); }} onKeyDown={(event) => { if (event.key === 'Backspace' && !event.currentTarget.value) event.currentTarget.previousElementSibling?.focus(); }} />
      </div>
    </fieldset>
  );
}
```

### Reglas de uso

- `autocomplete="one-time-code"` en la primera casilla: el móvil sugiere el código.
- Para pegar el código completo, reparte el valor en un handler `onpaste`.

# Layout

## Divisor (`divider`)

> Separa contenido en horizontal o vertical, con o sin texto.

### HTML

```html
<div class="w-full max-w-md space-y-8">
  <div class="divider" role="separator">Fase 2</div>
  <div class="divider" role="separator"></div>
  <div class="flex h-12 items-center justify-center gap-4 text-body-sm">
    <span>Diseño</span>
    <div class="divider divider-vertical" role="separator" aria-orientation="vertical"></div>
    <span>Desarrollo</span>
    <div class="divider divider-vertical" role="separator" aria-orientation="vertical"></div>
    <span>IA</span>
  </div>
</div>
```

### React (JSX)

```jsx
export default function Divider() {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="divider" role="separator">Fase 2</div>
      <div className="divider" role="separator" />
      <div className="flex h-12 items-center justify-center gap-4 text-body-sm">
        <span>Diseño</span>
        <div className="divider divider-vertical" role="separator" aria-orientation="vertical" />
        <span>Desarrollo</span>
        <div className="divider divider-vertical" role="separator" aria-orientation="vertical" />
        <span>IA</span>
      </div>
    </div>
  );
}
```

### Reglas de uso

- Texto del divisor: una palabra.
- Entre secciones grandes usa espacio (`section-y`), no divisores.

## Panel lateral (Drawer) (`drawer`)

> Navegación que entra desde el costado. Usa <dialog>.

### HTML

```html
<button type="button" class="btn btn-secondary" onclick="document.getElementById('drawer-demo').showModal()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg> Abrir menú</button>
<dialog id="drawer-demo" class="sheet" closedby="any" aria-label="Menú">
  <div class="flex h-full flex-col">
    <div class="flex h-16 items-center justify-between border-b border-border-default px-5">
      <span class="font-display text-h4 font-medium">Menú</span>
      <form method="dialog"><button class="btn btn-ghost btn-square" aria-label="Cerrar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></form>
    </div>
    <nav class="flex-1 space-y-1 p-3" aria-label="Principal">
      <a href="#" class="menu-item" aria-current="page">Inicio</a>
      <a href="#" class="menu-item">Servicios</a>
      <a href="#" class="menu-item">Casos</a>
      <a href="#" class="menu-item">Nosotros</a>
    </nav>
    <div class="border-t border-border-default p-5"><a href="#" class="btn btn-primary w-full">Hablemos</a></div>
  </div>
</dialog>
```

### React (JSX)

```jsx
export default function Drawer() {
  return (
    <>
      <button type="button" className="btn btn-secondary" onClick={(event) => { document.getElementById('drawer-demo').showModal(); }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg> Abrir menú</button>
      <dialog id="drawer-demo" className="sheet" closedby="any" aria-label="Menú">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-border-default px-5">
            <span className="font-display text-h4 font-medium">Menú</span>
            <form method="dialog">
              <button className="btn btn-ghost btn-square" aria-label="Cerrar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </form>
          </div>
          <nav className="flex-1 space-y-1 p-3" aria-label="Principal">
            <a href="#" className="menu-item" aria-current="page">Inicio</a>
            <a href="#" className="menu-item">Servicios</a>
            <a href="#" className="menu-item">Casos</a>
            <a href="#" className="menu-item">Nosotros</a>
          </nav>
          <div className="border-t border-border-default p-5">
            <a href="#" className="btn btn-primary w-full">Hablemos</a>
          </div>
        </div>
      </dialog>
    </>
  );
}
```

### Reglas de uso

- `<dialog>` con `showModal()`: foco atrapado y Esc sin código extra.
- En escritorio la navegación vive en el Navbar; el drawer es para móvil.

## Footer (`footer`)

> Cierre del sitio sobre banda Excellence Blue.

### HTML

```html
<footer class="w-full bg-surface-dark text-text-on-dark">
  <div class="container-site grid gap-10 py-16 md:grid-cols-12">
    <div class="md:col-span-4">
      <p class="flex items-center gap-2 font-display text-h3 font-medium"><span class="size-2.5 bg-elevate-blue" aria-hidden="true"></span>Elaniin</p>
      <p class="mt-4 max-w-xs text-body-sm text-text-on-dark-secondary">Software, equipos e IA para empresas que necesitan resultados.</p>
    </div>
    <nav class="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8" aria-label="Pie de página">
      <div>
        <p class="mono-label text-caption text-text-on-dark-muted">Servicios</p>
        <ul class="mt-4 space-y-3 text-body-sm">
          <li><a href="#" class="text-text-on-dark-secondary transition-colors duration-base hover:text-white focus-ring-on-dark">Desarrollo</a></li>
          <li><a href="#" class="text-text-on-dark-secondary transition-colors duration-base hover:text-white focus-ring-on-dark">Equipos dedicados</a></li>
          <li><a href="#" class="text-text-on-dark-secondary transition-colors duration-base hover:text-white focus-ring-on-dark">IA aplicada</a></li>
        </ul>
      </div>
      <div>
        <p class="mono-label text-caption text-text-on-dark-muted">Empresa</p>
        <ul class="mt-4 space-y-3 text-body-sm">
          <li><a href="#" class="text-text-on-dark-secondary transition-colors duration-base hover:text-white focus-ring-on-dark">Nosotros</a></li>
          <li><a href="#" class="text-text-on-dark-secondary transition-colors duration-base hover:text-white focus-ring-on-dark">Casos</a></li>
          <li><a href="#" class="text-text-on-dark-secondary transition-colors duration-base hover:text-white focus-ring-on-dark">Carreras</a></li>
        </ul>
      </div>
      <div>
        <p class="mono-label text-caption text-text-on-dark-muted">Contacto</p>
        <ul class="mt-4 space-y-3 text-body-sm">
          <li><a href="#" class="text-text-on-dark-secondary transition-colors duration-base hover:text-white focus-ring-on-dark">hola@elaniin.com</a></li>
          <li><a href="#" class="text-text-on-dark-secondary transition-colors duration-base hover:text-white focus-ring-on-dark">LinkedIn</a></li>
        </ul>
      </div>
    </nav>
  </div>
  <div class="container-site flex flex-col gap-3 border-t border-border-on-dark py-6 text-caption text-text-on-dark-muted sm:flex-row sm:justify-between">
    <p>© 2026 Elaniin. Todos los derechos reservados.</p>
    <p class="flex gap-6"><a href="#" class="hover:text-white">Privacidad</a><a href="#" class="hover:text-white">Términos</a></p>
  </div>
</footer>
```

### React (JSX)

```jsx
export default function Footer() {
  return (
    <footer className="w-full bg-surface-dark text-text-on-dark">
      <div className="container-site grid gap-10 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="flex items-center gap-2 font-display text-h3 font-medium"><span className="size-2.5 bg-elevate-blue" aria-hidden="true" />Elaniin</p>
          <p className="mt-4 max-w-xs text-body-sm text-text-on-dark-secondary">Software, equipos e IA para empresas que necesitan resultados.</p>
        </div>
        <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8" aria-label="Pie de página">
          <div>
            <p className="mono-label text-caption text-text-on-dark-muted">Servicios</p>
            <ul className="mt-4 space-y-3 text-body-sm">
              <li>
                <a href="#" className="text-text-on-dark-secondary transition-colors duration-base hover:text-white focus-ring-on-dark">Desarrollo</a>
              </li>
              <li>
                <a href="#" className="text-text-on-dark-secondary transition-colors duration-base hover:text-white focus-ring-on-dark">Equipos dedicados</a>
              </li>
              <li>
                <a href="#" className="text-text-on-dark-secondary transition-colors duration-base hover:text-white focus-ring-on-dark">IA aplicada</a>
              </li>
            </ul>
          </div>
          <div>
            <p className="mono-label text-caption text-text-on-dark-muted">Empresa</p>
            <ul className="mt-4 space-y-3 text-body-sm">
              <li>
                <a href="#" className="text-text-on-dark-secondary transition-colors duration-base hover:text-white focus-ring-on-dark">Nosotros</a>
              </li>
              <li>
                <a href="#" className="text-text-on-dark-secondary transition-colors duration-base hover:text-white focus-ring-on-dark">Casos</a>
              </li>
              <li>
                <a href="#" className="text-text-on-dark-secondary transition-colors duration-base hover:text-white focus-ring-on-dark">Carreras</a>
              </li>
            </ul>
          </div>
          <div>
            <p className="mono-label text-caption text-text-on-dark-muted">Contacto</p>
            <ul className="mt-4 space-y-3 text-body-sm">
              <li>
                <a href="#" className="text-text-on-dark-secondary transition-colors duration-base hover:text-white focus-ring-on-dark">hola@elaniin.com</a>
              </li>
              <li>
                <a href="#" className="text-text-on-dark-secondary transition-colors duration-base hover:text-white focus-ring-on-dark">LinkedIn</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="container-site flex flex-col gap-3 border-t border-border-on-dark py-6 text-caption text-text-on-dark-muted sm:flex-row sm:justify-between">
        <p>© 2026 Elaniin. Todos los derechos reservados.</p>
        <p className="flex gap-6">
          <a href="#" className="hover:text-white">Privacidad</a>
          <a href="#" className="hover:text-white">Términos</a>
        </p>
      </div>
    </footer>
  );
}
```

### Reglas de uso

- Fondo Excellence Blue: es la banda oscura de cierre.
- Enlaces en `text-on-dark-secondary`, blancos al pasar el cursor.

## Hero (`hero`)

> Primera sección: titular, bajada, CTAs y un asset de la biblioteca de fondo.

### HTML

```html
<section class="relative w-full overflow-hidden bg-surface-dark text-text-on-dark">
  <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/glass.webp" alt="" class="absolute inset-0 h-full w-full object-cover opacity-60" fetchpriority="high">
  <div class="absolute inset-0 bg-linear-to-r from-surface-dark via-surface-dark/80 to-transparent" aria-hidden="true"></div>
  <div class="container-site relative section-y">
    <p class="mono-label rise text-caption text-text-on-dark-accent">Software · Equipos · IA</p>
    <h1 class="rise mt-4 max-w-[16ch] font-display text-display-xl font-medium" style="--i: 1">Construimos el software que mueve tu negocio</h1>
    <p class="rise mt-6 max-w-[48ch] text-lead text-text-on-dark-secondary" style="--i: 2">Equipos senior que diseñan, desarrollan y escalan productos digitales en semanas, no en años.</p>
    <div class="rise mt-10 flex flex-wrap gap-3" style="--i: 3">
      <a href="#" class="btn btn-primary btn-lg btn-arrow">Hablemos <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a>
      <a href="#" class="btn btn-lg border-border-on-dark-strong text-white hover:bg-white/10">Ver casos</a>
    </div>
  </div>
</section>
```

### React (JSX)

```jsx
export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-surface-dark text-text-on-dark">
      <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/glass.webp" alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" fetchPriority="high" />
      <div className="absolute inset-0 bg-linear-to-r from-surface-dark via-surface-dark/80 to-transparent" aria-hidden="true" />
      <div className="container-site relative section-y">
        <p className="mono-label rise text-caption text-text-on-dark-accent">Software · Equipos · IA</p>
        <h1 className="rise mt-4 max-w-[16ch] font-display text-display-xl font-medium" style={{ '--i': '1' }}>Construimos el software que mueve tu negocio</h1>
        <p className="rise mt-6 max-w-[48ch] text-lead text-text-on-dark-secondary" style={{ '--i': '2' }}>Equipos senior que diseñan, desarrollan y escalan productos digitales en semanas, no en años.</p>
        <div className="rise mt-10 flex flex-wrap gap-3" style={{ '--i': '3' }}>
          <a href="#" className="btn btn-primary btn-lg btn-arrow">Hablemos <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></a>
          <a href="#" className="btn btn-lg border-border-on-dark-strong text-white hover:bg-white/10">Ver casos</a>
        </div>
      </div>
    </section>
  );
}
```

### Reglas de uso

- Un solo `h1` por página.
- Fondo: un asset de la biblioteca como imagen o video, decorativo (`alt=""`).
- Entrada con `rise` escalonada con `--i`.

## Indicador (`indicator`)

> Contador o etiqueta en la esquina de otro elemento.

### HTML

```html
<div class="flex flex-wrap items-center gap-12">
  <button type="button" class="btn btn-secondary btn-square relative" aria-label="Avisos, 3 nuevos">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 16v-5a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 21h4"/></svg>
    <span class="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-elevate-blue px-1 font-mono text-caption leading-none text-white" aria-hidden="true">3</span>
  </button>
  <div class="relative">
    <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/topo.webp" alt="Diego Ramírez" class="size-14 rounded-full object-cover">
    <span class="absolute right-0 top-0 size-3.5 rounded-full border-2 border-white bg-success-dot" role="img" aria-label="En línea"></span>
  </div>
  <div class="relative w-56">
    <div class="card pad-card"><p class="font-medium">Glass Ribs</p><p class="mt-1 text-body-sm text-text-muted">Vidrio acanalado</p></div>
    <span class="badge badge-dark absolute -top-3 left-4">Nuevo</span>
  </div>
</div>
```

### React (JSX)

```jsx
export default function Indicator() {
  return (
    <div className="flex flex-wrap items-center gap-12">
      <button type="button" className="btn btn-secondary btn-square relative" aria-label="Avisos, 3 nuevos">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M6 16v-5a6 6 0 1 1 12 0v5l2 2H4z" />
          <path d="M10 21h4" />
        </svg>
        <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-elevate-blue px-1 font-mono text-caption leading-none text-white" aria-hidden="true">3</span>
      </button>
      <div className="relative">
        <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/topo.webp" alt="Diego Ramírez" className="size-14 rounded-full object-cover" />
        <span className="absolute right-0 top-0 size-3.5 rounded-full border-2 border-white bg-success-dot" role="img" aria-label="En línea" />
      </div>
      <div className="relative w-56">
        <div className="card pad-card">
          <p className="font-medium">Glass Ribs</p>
          <p className="mt-1 text-body-sm text-text-muted">Vidrio acanalado</p>
        </div>
        <span className="badge badge-dark absolute -top-3 left-4">Nuevo</span>
      </div>
    </div>
  );
}
```

### Reglas de uso

- El número va también en el `aria-label` del control.
- Desde 100, muestra “99+”.

## Grupo (Join) (`join`)

> Une botones o campos en un solo bloque con bordes compartidos.

### HTML

```html
<div class="flex flex-col items-start gap-6">
  <div class="join" role="group" aria-label="Periodo">
    <button type="button" class="btn btn-secondary">Día</button>
    <button type="button" class="btn btn-secondary" aria-pressed="true">Semana</button>
    <button type="button" class="btn btn-secondary">Mes</button>
  </div>
  <form class="join w-full max-w-md">
    <input type="email" class="input min-w-0 flex-1" placeholder="tu@empresa.com" aria-label="Correo" autocomplete="email">
    <button class="btn btn-primary">Suscribirme</button>
  </form>
</div>
```

### React (JSX)

```jsx
export default function Join() {
  return (
    <div className="flex flex-col items-start gap-6">
      <div className="join" role="group" aria-label="Periodo">
        <button type="button" className="btn btn-secondary">Día</button>
        <button type="button" className="btn btn-secondary" aria-pressed="true">Semana</button>
        <button type="button" className="btn btn-secondary">Mes</button>
      </div>
      <form className="join w-full max-w-md">
        <input type="email" className="input min-w-0 flex-1" placeholder="tu@empresa.com" aria-label="Correo" autoComplete="email" />
        <button className="btn btn-primary">Suscribirme</button>
      </form>
    </div>
  );
}
```

### Reglas de uso

- Para acciones relacionadas o campo + botón.
- Los bordes se solapan 1 px: no agregues `gap`.

## Formas (Mask) (`mask`)

> Recorta imágenes en formas: squircle, isométrica, hexágono, círculo y rombo.

### HTML

```html
<div class="flex flex-wrap items-center gap-6">
  <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/satin.webp" alt="" class="shape-squircle size-28 object-cover">
  <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/topo.webp" alt="" class="shape-iso size-28 object-cover">
  <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/ribs.webp" alt="" class="shape-hexagon size-28 object-cover">
  <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/glass.webp" alt="" class="shape-circle size-28 object-cover">
  <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/sweeps.webp" alt="" class="shape-diamond size-28 object-cover">
</div>
```

### React (JSX)

```jsx
export default function Mask() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/satin.webp" alt="" className="shape-squircle size-28 object-cover" />
      <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/topo.webp" alt="" className="shape-iso size-28 object-cover" />
      <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/ribs.webp" alt="" className="shape-hexagon size-28 object-cover" />
      <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/glass.webp" alt="" className="shape-circle size-28 object-cover" />
      <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/sweeps.webp" alt="" className="shape-diamond size-28 object-cover" />
    </div>
  );
}
```

### Reglas de uso

- `shape-iso` repite el hexágono de las ilustraciones isométricas de Elaniin.
- Recorta fotos o assets, nunca texto.

## Pila (Stack) (`stack`)

> Apila elementos uno sobre otro para insinuar que hay más.

### HTML

```html
<div class="flex flex-wrap items-start gap-12">
  <div class="stack w-72">
    <article class="card pad-card">
      <p class="mono-label text-caption text-text-muted">3 avisos</p>
      <p class="mt-2 font-medium">Nuevo comentario en “Banca digital”</p>
    </article>
    <div class="card" aria-hidden="true"></div>
    <div class="card" aria-hidden="true"></div>
  </div>
  <div class="stack w-48">
    <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/rubik.webp" alt="Cubo Rubik" class="aspect-4/3 rounded-media object-cover">
    <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/glass.webp" alt="" class="aspect-4/3 rounded-media object-cover">
    <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/satin.webp" alt="" class="aspect-4/3 rounded-media object-cover">
  </div>
</div>
```

### React (JSX)

```jsx
export default function Stack() {
  return (
    <div className="flex flex-wrap items-start gap-12">
      <div className="stack w-72">
        <article className="card pad-card">
          <p className="mono-label text-caption text-text-muted">3 avisos</p>
          <p className="mt-2 font-medium">Nuevo comentario en “Banca digital”</p>
        </article>
        <div className="card" aria-hidden="true" />
        <div className="card" aria-hidden="true" />
      </div>
      <div className="stack w-48">
        <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/rubik.webp" alt="Cubo Rubik" className="aspect-4/3 rounded-media object-cover" />
        <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/glass.webp" alt="" className="aspect-4/3 rounded-media object-cover" />
        <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/satin.webp" alt="" className="aspect-4/3 rounded-media object-cover" />
      </div>
    </div>
  );
}
```

### Reglas de uso

- Hasta 3 capas visibles; las de atrás con `aria-hidden`.
- El primer hijo queda arriba.

# Mockups

## Navegador (mockup) (`mockup-browser`)

> Marco de navegador para mostrar un sitio.

### HTML

```html
<figure class="w-full max-w-3xl overflow-hidden rounded-card border border-border-default bg-white shadow-product">
  <div class="flex h-11 items-center gap-4 border-b border-border-default bg-surface-subtle px-4">
    <div class="flex w-12 gap-1.5" aria-hidden="true"><span class="size-2.5 rounded-full bg-border-strong"></span><span class="size-2.5 rounded-full bg-border-strong"></span><span class="size-2.5 rounded-full bg-border-strong"></span></div>
    <p class="mx-auto flex h-7 w-full max-w-sm items-center justify-center rounded-button bg-white font-mono text-caption text-text-muted">elaniin.com</p>
    <span class="w-12" aria-hidden="true"></span>
  </div>
  <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/sweeps.webp" alt="Captura del sitio con barridos azules" class="aspect-video w-full object-cover">
</figure>
```

### React (JSX)

```jsx
export default function MockupBrowser() {
  return (
    <figure className="w-full max-w-3xl overflow-hidden rounded-card border border-border-default bg-white shadow-product">
      <div className="flex h-11 items-center gap-4 border-b border-border-default bg-surface-subtle px-4">
        <div className="flex w-12 gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
        </div>
        <p className="mx-auto flex h-7 w-full max-w-sm items-center justify-center rounded-button bg-white font-mono text-caption text-text-muted">elaniin.com</p>
        <span className="w-12" aria-hidden="true" />
      </div>
      <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/sweeps.webp" alt="Captura del sitio con barridos azules" className="aspect-video w-full object-cover" />
    </figure>
  );
}
```

### Reglas de uso

- Puntos de ventana en gris: sin colores de semáforo (fuera de la paleta).
- Dentro va una captura real o un asset.

## Código (mockup) (`mockup-code`)

> Bloque de terminal o editor con prefijos que no se copian.

### HTML

```html
<pre class="code-block w-full max-w-xl" aria-label="Instalación">
  <code data-prefix="$">npm install tailwindcss @tailwindcss/vite</code>
  <code data-prefix="$">curl -o src/styles/elaniin.css https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/elaniin.css</code>
  <code data-prefix=">" class="text-text-on-dark-accent">listo: tokens + 68 componentes</code>
</pre>
```

### React (JSX)

```jsx
export default function MockupCode() {
  return (
    <pre className="code-block w-full max-w-xl" aria-label="Instalación">
      <code data-prefix="$">npm install tailwindcss @tailwindcss/vite</code>
      <code data-prefix="$">curl -o src/styles/elaniin.css https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/elaniin.css</code>
      <code data-prefix=">" className="text-text-on-dark-accent">listo: tokens + 68 componentes</code>
    </pre>
  );
}
```

### Reglas de uso

- Una línea = un `<code>`; el prefijo va en `data-prefix` y no se copia al seleccionar.
- Fondo `surface-code` (Excellence Blue).

## Teléfono (mockup) (`mockup-phone`)

> Marco de teléfono para mostrar una app.

### HTML

```html
<div class="w-64 rounded-device bg-elaniin-black p-2 shadow-product">
  <div class="relative aspect-9/19 overflow-hidden rounded-[calc(var(--radius-device)-8px)] bg-white">
    <span class="absolute left-1/2 top-2 z-1 h-6 w-20 -translate-x-1/2 rounded-full bg-elaniin-black" aria-hidden="true"></span>
    <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/satin.webp" alt="" class="h-1/2 w-full object-cover">
    <div class="p-5">
      <p class="mono-label text-caption text-text-muted">App</p>
      <p class="mt-1 font-display text-h4 font-medium">Tu proyecto, en vivo</p>
      <p class="mt-2 text-body-sm text-text-secondary">Avance, entregables y equipo en un solo lugar.</p>
      <a href="#" class="btn btn-primary mt-4 w-full">Ver avance</a>
    </div>
  </div>
</div>
```

### React (JSX)

```jsx
export default function MockupPhone() {
  return (
    <div className="w-64 rounded-device bg-elaniin-black p-2 shadow-product">
      <div className="relative aspect-9/19 overflow-hidden rounded-[calc(var(--radius-device)-8px)] bg-white">
        <span className="absolute left-1/2 top-2 z-1 h-6 w-20 -translate-x-1/2 rounded-full bg-elaniin-black" aria-hidden="true" />
        <img src="https://aidesign-elaniin.github.io/assets-web-elaniin/componentes/img/satin.webp" alt="" className="h-1/2 w-full object-cover" />
        <div className="p-5">
          <p className="mono-label text-caption text-text-muted">App</p>
          <p className="mt-1 font-display text-h4 font-medium">Tu proyecto, en vivo</p>
          <p className="mt-2 text-body-sm text-text-secondary">Avance, entregables y equipo en un solo lugar.</p>
          <a href="#" className="btn btn-primary mt-4 w-full">Ver avance</a>
        </div>
      </div>
    </div>
  );
}
```

### Reglas de uso

- Contenido real de la app, no texto de relleno.
- El radio sale del token `radius-device`.

## Ventana (mockup) (`mockup-window`)

> Ventana oscura para mostrar un panel o dashboard.

### HTML

```html
<figure class="w-full max-w-2xl overflow-hidden rounded-card border border-border-on-dark bg-surface-dark text-text-on-dark shadow-product">
  <div class="flex h-10 items-center gap-1.5 border-b border-border-on-dark px-4" aria-hidden="true">
    <span class="size-2.5 rounded-full bg-white/20"></span><span class="size-2.5 rounded-full bg-white/20"></span><span class="size-2.5 rounded-full bg-white/20"></span>
    <span class="ml-auto font-mono text-caption text-text-on-dark-muted">dashboard</span>
  </div>
  <div class="grid gap-4 p-6 sm:grid-cols-3">
    <div class="rounded-button border border-border-on-dark bg-surface-dark-card p-4"><p class="mono-label text-caption text-text-on-dark-muted">Usuarios</p><p class="mt-2 font-display text-h3 font-medium">24.8 k</p></div>
    <div class="rounded-button border border-border-on-dark bg-surface-dark-card p-4"><p class="mono-label text-caption text-text-on-dark-muted">Disponibilidad</p><p class="mt-2 font-display text-h3 font-medium">99.98%</p></div>
    <div class="rounded-button border border-border-on-dark bg-surface-dark-card p-4"><p class="mono-label text-caption text-text-on-dark-muted">Despliegues</p><p class="mt-2 font-display text-h3 font-medium">312</p></div>
  </div>
</figure>
```

### React (JSX)

```jsx
export default function MockupWindow() {
  return (
    <figure className="w-full max-w-2xl overflow-hidden rounded-card border border-border-on-dark bg-surface-dark text-text-on-dark shadow-product">
      <div className="flex h-10 items-center gap-1.5 border-b border-border-on-dark px-4" aria-hidden="true">
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="ml-auto font-mono text-caption text-text-on-dark-muted">dashboard</span>
      </div>
      <div className="grid gap-4 p-6 sm:grid-cols-3">
        <div className="rounded-button border border-border-on-dark bg-surface-dark-card p-4">
          <p className="mono-label text-caption text-text-on-dark-muted">Usuarios</p>
          <p className="mt-2 font-display text-h3 font-medium">24.8 k</p>
        </div>
        <div className="rounded-button border border-border-on-dark bg-surface-dark-card p-4">
          <p className="mono-label text-caption text-text-on-dark-muted">Disponibilidad</p>
          <p className="mt-2 font-display text-h3 font-medium">99.98%</p>
        </div>
        <div className="rounded-button border border-border-on-dark bg-surface-dark-card p-4">
          <p className="mono-label text-caption text-text-on-dark-muted">Despliegues</p>
          <p className="mt-2 font-display text-h3 font-medium">312</p>
        </div>
      </div>
    </figure>
  );
}
```

### Reglas de uso

- Oscura sobre fondo claro; clara sobre banda oscura.
