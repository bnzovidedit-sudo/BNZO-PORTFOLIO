# Bnzo — Montaje, ritmo y emoción

Portfolio de Esteban Bonet / Bnzo en HTML, CSS y JavaScript sin dependencias. Diseño oscuro, apertura vertical con el corto del café, línea de montaje SVG y tres pilares: Oasis Orgánico, El Pulso Invisible y Forma y Fricción.

## Estructura

- index.html: estructura semántica, SVGs, diálogos y CSP.
- styles.css: paleta piedra oscura, alineación, responsive y apariciones.
- config.js: identidad, contacto, Calendly, vídeos y proyectos.
- app.js: reproducción diferida, IntersectionObserver, diálogos y privacidad.
- assets/coffee-sensory.webm: apertura VP9 con audio Opus, empieza silenciada y dispone de control de sonido. Alternativa H.264: coffee-film.mp4.
- assets/coffee-film.mp4: pieza de portfolio con sonido y controles.
- assets/coffee-poster.jpg: poster comprimido.
- assets/cover.png y cover.webp: imágenes de la primera versión, conservadas pero sin uso en el diseño actual.
- vercel.json y netlify.toml: cabeceras HTTP del alojamiento.
- DESIGN-UPDATE.md: especificaciones, tamaños y comprobaciones de esta versión.

## Personalización

Edita config.js para incorporar correo, URL HTTPS de tu evento de Calendly de 15 minutos y los datos legales pendientes. Los dos primeros pilares aún no tienen vídeos; sus diagramas no se presentan como piezas realizadas. Para añadir uno, usa rutas locales assets/nombre.mp4, assets/nombre.webm y, cuando corresponda, assets/nombre.es.vtt en captions.

La portada mantiene 9:16 a cualquier tamaño. No hay bibliotecas externas ni fuentes remotas. El vídeo se pausa fuera de pantalla y al ocultar la pestaña. Movimiento reducido y ahorro de datos desactivan la reproducción automática; se puede reproducir manualmente.

## Privacidad y seguridad

Sin trackers, analítica ni calendarios incrustados. Calendly se abre únicamente si está configurado y el visitante pulsa el enlace externo. El aviso guarda la elección en localStorage durante una validez de 180 días. «Preferencias» permite cambiarla. Los textos legales son borradores pendientes de completar según la actividad real.

Los datos de configuración se insertan con textContent; no se interpretan como HTML. La CSP permite recursos locales. X-Frame-Options, X-Content-Type-Options y frame-ancestors se sirven como cabeceras HTTP mediante la configuración del alojamiento, no mediante etiquetas meta. No hay backend, formulario ni firewall simulado.

## Publicación

Vercel: proyecto estático, sin comando de build, raíz de esta carpeta como directorio de salida. Mantén vercel.json. Netlify: raíz de esta carpeta y publicación en punto (.), usando netlify.toml. Verifica las cabeceras en el alojamiento real después del despliegue.

Se conservan noindex y robots.txt con Disallow mientras faltan los datos de lanzamiento. Cuando estén completos, retira noindex y permite el rastreo. Añade canonical y sitemap al confirmar el dominio definitivo.

El repositorio publica la web mediante Vercel. Para revisar una copia local, sirve esta carpeta con un servidor HTTP. La vista preparada durante la edición usa http://127.0.0.1:4173/.
