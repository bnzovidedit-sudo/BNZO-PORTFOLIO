# Esteban Bonet / Bnzo — Edición y postproducción vertical

Landing estática en español: HTML5 semántico, CSS propio y JavaScript sin dependencias. No requiere instalación ni compilación. Se ha elegido CSS propio en lugar de Tailwind para entregar archivos directamente desplegables, sin CDN ni herramientas de construcción.

## Archivos

- `index.html`: estructura, metadatos y diálogos accesibles.
- `styles.css`: diseño responsive, colores y movimiento reducido.
- `config.js`: nombre, alias, rol, correo, URL de Calendly, duración de sesión y catálogo de vídeos.
- `app.js`: filtros, reproductores, preferencias y borradores legales.
- `assets/cover.webp`: imagen conceptual de la primera versión, conservada pero ya no usada en la página.
- `assets/cover.png`: original de la imagen de la primera versión. No se descarga al navegar.
- `netlify.toml` y `vercel.json`: configuración de cabeceras de seguridad.
- `robots.txt`: bloqueo provisional de rastreo. No constituye control de acceso.

## Personalización

1. Edita `config.js`: `name`, `email`, `bookingUrl` y `legal`. La identidad Esteban Bonet / Bnzo ya está incorporada. Correo, Calendly, NIF, domicilio y registro están pendientes de datos reales.
2. Cambia también el título estático de `index.html` y la descripción para los buscadores. La identidad está también en el HTML inicial, antes de ejecutar JavaScript.
3. Añade los vídeos y sus posters a `assets/`. Rellena `webm`, `mp4` y `poster` de cada proyecto con rutas como `assets/comercial-01.mp4`. Se admiten ambas fuentes; WebM se intenta antes que MP4. Los nombres de archivos deben usar letras sin acentos, números, guiones y guiones bajos.
4. Añade `captions: 'assets/comercial-01.es.vtt'` cuando haya voz. Usa subtítulos reales revisados. Edita título, categoría, etiqueta y descripción de cada trabajo. Puedes añadir más entradas al array.
5. En `hero`, configura un bucle de portada propio. Su reproducción será silenciosa, en bucle y dentro de la página; el visitante puede pausarlo. No se reproduce automáticamente con movimiento reducido o ahorro de datos. Hasta entonces se muestra un esquema estático de montaje con pistas de imagen y sonido; no se presenta como vídeo ni como trabajo de cliente. Puedes definir un poster local en hero.poster.
6. Revisa los tres textos legales en `app.js` y complétalos según tu actividad real, alojamiento, correo y reservas. El marcador del registro solo debe sustituirse por «No procede» si efectivamente no aplica.
7. Cuando la web esté preparada para publicarse e indexarse, elimina `noindex,nofollow` de `index.html` y sustituye `Disallow: /` por `Allow: /` en `robots.txt`. Añade un canonical absoluto y sitemap al conocer el dominio definitivo.

## Vídeos y rendimiento

No se han incluido vídeos de terceros ni se han presentado imágenes conceptuales como trabajos realizados. Los tres bloques iniciales describen las áreas de postproducción; se indica expresamente que las piezas reales se incorporarán después. La reproducción con archivos reales debe validarse al incorporarlos.

- Exporta vertical 9:16 a 720 × 1280 o 1080 × 1920 según el contenido.
- Usa MP4 H.264 con píxel `yuv420p`, audio AAC para piezas con sonido y metadatos `faststart`; WebM VP9 como alternativa.
- Para la portada, prepara un corte breve sin audio. Empieza con 8–15 segundos; ajusta la compresión al detalle real y a la calidad visual.
- El código utiliza `preload="none"`, carga las fuentes cuando se requieren, detiene los vídeos fuera de vista y al ocultar la pestaña. Los previews del portfolio se activan con hover o foco; en móvil el toque abre el reproductor con controles.
- No hay garantía de carga instantánea: depende del peso de los vídeos, red y dispositivo. Comprueba el resultado con red móvil antes de publicar.

## Contacto

`bookingUrl` acepta una URL HTTPS de tu calendario real. Configura un evento de 15 minutos en Calendly; el texto de la web no configura la duración del evento externo. El botón abre primero un diálogo informativo y después el visitante puede abrir el proveedor en una nueva pestaña. No se precarga ni incrusta ese servicio. `email` habilita una alternativa por correo. Sin ambos datos, se muestra que el contacto aún no está disponible; no se simula una reserva.

## Consentimiento y RGPD/LSSI

Esta versión no carga analítica, publicidad, fuentes remotas, vídeos incrustados ni widgets externos. El banner solicitado guarda exclusivamente `portfolio-consent-v1` en localStorage, con elección, fecha y versión. No es una cookie HTTP. Se descarta una preferencia de más de 180 días en la siguiente visita. Rechazar y aceptar tienen la misma presentación. «Cambiar consentimiento» permite reabrir el aviso y rechazar.

Sin tecnologías no esenciales no se necesita instalar analítica ni añadir un widget para justificar un banner. Se mantiene aquí por requisito del encargo, explicando qué hace realmente. Aceptar no activa servicios inexistentes. Si se añaden servicios opcionales, será necesario implementar categorías y carga condicionada, actualizar el inventario real de cookies, cambiar la versión de consentimiento y volver a solicitarlo. No pegues scripts de terceros directamente en el HTML.

Los textos incluidos son borradores contextualizados, no una certificación de cumplimiento. Antes de usar la web comercialmente, completa identidad, NIF, dirección, contacto, datos registrales aplicables, destinatarios, plazos y garantías de transferencias; verifica contratos con encargados, derechos de uso de vídeo/música/imagen y las condiciones de contratación. El NIF/domicilio que introduzcas serán públicos.

Fuentes oficiales consultadas:

- AEPD, Guía sobre el uso de cookies: https://www.aepd.es/guias/guia-cookies.pdf
- BOE, Ley 34/2002 (LSSI), artículo 10: https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758
- AEPD, consentimiento e información: https://www.aepd.es/preguntas-frecuentes/2-tus-obligaciones-como-responsable-del-tratamiento/6-el-deber-de-informacion/FAQ-0248-sobre-si-el-usuario-tiene-que-dar-consentimiento-a-clausula-de-privacidad

## Seguridad

La CSP permite recursos locales y bloquea scripts, iframes y conexiones externas. Los valores configurables se insertan con `textContent`, sin interpretarlos como HTML. Se validan rutas de medios y protocolo HTTPS de reservas. No existen campos de entrada, backend ni envío de formularios. Si se añaden, necesitan validación del servidor, límites de tamaño y frecuencia, protección CSRF cuando corresponda y gestión segura de datos; sanitizar solo en el navegador no basta.

`frame-ancestors`, `X-Frame-Options` y `X-Content-Type-Options` deben enviarse como cabeceras HTTP. No funcionan como sustitutos mediante etiquetas meta. Por eso están en las configuraciones del alojamiento. La CSP del HTML es una defensa adicional. HSTS solo tiene efecto con HTTPS. Esto no es un firewall: cualquier WAF se configura en el alojamiento.

## Despliegue

**Netlify:** usa esta carpeta como raíz de un proyecto estático, sin comando de build, y directorio de publicación `.`. El archivo `netlify.toml` define cabeceras para un despliegue procesado por Netlify.

**Vercel:** importa esta carpeta como proyecto estático («Other»), sin comando de build y con la raíz como directorio de salida. Conserva `vercel.json`.

Tras desplegar, verifica que HTML, CSS, JS, WebP, MP4, WebM y VTT devuelven el MIME correcto, que las cabeceras de ambos archivos se aplican realmente y que los vídeos permiten peticiones por rangos. La entrega no ha sido desplegada en una cuenta de Netlify/Vercel ni se han verificado sus cabeceras en producción.

## Vista previa y comprobación

Puedes abrir `index.html` para una revisión sencilla. Para validar medios y comportamiento de origen, sirve la carpeta por HTTP local. Ejemplo con Python instalado:

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory "E:\codex\2026-09-30\h\outputs\portfolio"
```

Abre http://127.0.0.1:4173/ . El servidor de vista previa no es un alojamiento público.

Comprobado en el navegador: renderizado de escritorio y móvil, filtrado, apertura/cierre de proyecto, estado de reservas sin configurar, aviso legal y cierre con Escape, rechazo, aceptación y persistencia tras recargar. Sin errores de consola durante esas comprobaciones. Sintaxis de ambos archivos JS validada con Node. Pendientes: reproducción con tus medios, reservas reales, accesibilidad completa, Lighthouse y cabeceras del alojamiento final.

