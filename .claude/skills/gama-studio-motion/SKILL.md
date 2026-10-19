---
name: gama-studio-motion
description: Reglas técnicas obligatorias de movimiento para la web cinemática de Gama Studio (Fotografia_web) — intro de visor con obturador y destello, escena estrella de equipos en scroll con GSAP/ScrollTrigger/Lenis, partículas Canvas, microinteracciones, rendimiento y accesibilidad. Úsala antes de tocar js/ o css/ de este proyecto.
---

# Gama Studio — reglas de movimiento

Proyecto estático (HTML + CSS + JS sin bundler). Datos en `js/datos.js` (un solo objeto `window.GAMA`); las animaciones nunca deben contener textos, rutas ni conteos fijos: todo se lee de ese arreglo.

## Dirección visual (resumen)
- Cuarto oscuro / galería: negro mate, bronce champaña, papel crema del logo. Verde `#22C55E` solo para el estado AF LOCK.
- Display: **Bodoni Moda** (eco del logo serif de alto contraste, eje óptico para cuerpo). Datos técnicos EXIF: **IBM Plex Mono**. Nada más.
- Mayúsculas espaciadas solo en la interfaz del visor (es UI de cámara real), no como eyebrow de secciones.

## 1. Intro interactiva de cámara (`js/visor.js`, `css/visor.css`)
- Al cargar: `html.intro-activa` bloquea el scroll (`overflow:hidden` + `lenis.stop()`). Botón discreto **"Saltar intro"** en una esquina, siempre accesible por teclado.
- Visor a pantalla completa `100dvh` con la mejor foto real (`GAMA.visor.foto`) desenfocada: `filter: blur(18px)` + `transform: scale(1.06)`.
- Superposición CSS/SVG: marcas de encuadre en 4 esquinas, nivelador de horizonte, datos mono (`GAMA STUDIO RAW`, `ISO 100`, `f/1.4`, `1/250s`, `[BATERÍA 100%]`, `AF-C`), retícula AF que sigue el cursor con lerp (solo `pointer: fine`).
- Botón obturador **"ENFOCAR Y CAPTURAR"**. Hover / `pointerdown` mantenido / foco de teclado → foto a `blur(0) scale(1)` en `0.35s`, retícula a verde con `[● AF LOCK]`.
- Clic:
  1. Cortinillas negras arriba/abajo cierran en `0.08s` (`scaleY` 0→1, nunca `height`).
  2. Destello blanco `#FFF` + gradiente radial cálido bronce (lens flare) a `opacity:1`.
  3. El destello se disipa `1.2s` `power2.out`; el visor se oculta, se desbloquea el scroll y la página queda revelada: foto capturada enmarcada en el Hero, logo real y navegación emergen.
  4. Botón **"Repetir captura 📸"** en el Hero reabre el visor (vuelve arriba, bloquea scroll).
- `sessionStorage` no se usa para saltar la intro automáticamente; la intro es la experiencia.

## 2. Scroll (GSAP + ScrollTrigger + Lenis)
- Versiones fijas por CDN: `gsap@3.13.0`, `ScrollTrigger@3.13.0` (cdnjs), `lenis@1.3.4` (unpkg).
- Lenis sincronizado: `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add(t => lenis.raf(t*1000))` + `gsap.ticker.lagSmoothing(0)`. Exponer `window.__lenis` para `tools/revisar.mjs`.
- Escena estrella (`js/escena.js`): sección fijada `pin: true`, `scrub: 1`, una línea de tiempo con N escenas = `GAMA.especialidades.length`.
  - Equipo al centro con flotación continua `yoyo` `±12px` en `3s` (en un contenedor interno para no pelear con el scrub).
  - Salida: sube 30–40 %, rota 8–15°, `opacity → 0`.
  - Entrada: cae desde `yPercent:-120`, `rotation:-20`, aterriza con `back.out(1.4)`.
  - `-ingredientes.png` en capa parallax alrededor (se mueve a distinta velocidad).
  - Palabra gigante detrás (`especialidad.palabra`), letra por letra `stagger: 0.03`.
  - Fondo interpolado: `#09090B → #1C140D → #141619 → #1A0B0E` (valor `especialidad.fondo`). Se anima el `opacity` de capas de color apiladas, no `background-color`.
- Partículas (`js/particulas.js`): Canvas 2D, 3 capas de parallax, máx. 40 en móvil / 80 escritorio, tipo por escena (`bokeh`, `destello`, `polvo`, `grano`) con crossfade de opacidad. Pausar con `IntersectionObserver` y `visibilitychange`.

## 3. Microinteracciones
- Botones magnéticos y tilt 3D en tarjetas de portafolio/paquetes solo con `matchMedia('(hover:hover) and (pointer:fine)')`.

## 4. Rendimiento y accesibilidad
- Animar exclusivamente `transform`, `opacity` y (solo en el visor) `filter` de la foto.
- `prefers-reduced-motion: reduce`: sin flash (fundido suave de 0.3s), sin pin, sin partículas, escena estrella como lista estática de 4 bloques.
- Primer cuadro completo: el HTML ya trae el visor visible y legible sin JS; si JS falla, `html:not(.js)` muestra la página sin intro.
- `<link rel="preload">` para la foto del visor y el primer equipo.
- Tras cada cambio relevante: `node tools/revisar.mjs` y revisar `validation/`.
