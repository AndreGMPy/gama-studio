# Gama Studio — sitio web

Sitio estático (HTML + CSS + JS, sin build) de Gama Studio, fotografía y video en Moroleón.
Publicado en https://www.gamastudiomx.com (Vercel, despliegue automático desde `main`).

## Editar contenido

Todo el contenido vive en **`js/datos.js`** (objeto `window.GAMA`): datos de contacto, horario,
especialidades, paquetes, portafolio, preguntas frecuentes. Para agregar una foto o un paquete
basta con editar ese archivo; no hace falta tocar las animaciones.

Las fotos optimizadas van en `assets/web/fotos/<categoria>/*.webp` (máx. 1400 px).

## Desarrollo local

```bash
npm install
npm run dev        # http://127.0.0.1:4321
npm run revisar    # capturas en validation/ (escritorio, móvil y movimiento reducido)
```

`node tools/revisar.mjs --url=https://www.gamastudiomx.com/` valida el sitio publicado.

## Versión anterior

La versión anterior en Next.js está guardada en la rama `version-nextjs`.
