# Bnzo — Manifiesto asimétrico

Web estática sin dependencias: HTML, CSS y JavaScript. Desplegar esta carpeta como raíz en Vercel, sin build. Cabeceras en vercel.json; alternativa Netlify en netlify.toml.

## Composición

Cabecera simétrica y tagline. Manifiesto en dos columnas: espacio de historia 9:16 a la izquierda y texto a la derecha. En móvil se apilan. Animación con IntersectionObserver y cubic-bezier(0.16,1,0.3,1), respetando movimiento reducido.

## Vídeos

El Pulso Invisible usa assets/pulso-tren.mp4 y su poster. Copia H.264/AAC de FINAL_1.mp4 de la carpeta facilitada; duración 11,8 segundos, 720 × 1280 y 4.666.160 bytes. Original intacto. Carga diferida y reproducción por interacción. El café está retirado del flujo y del paquete. Las copias anteriores se conservan fuera del directorio desplegable.

Para tu historia, coloca el MP4 en assets/ y configura story.mp4 en config.js; story.poster, story.webm y story.captions son opcionales. El vídeo usa controles nativos, carga diferida y encuadre sin recorte. Mientras no haya archivo, se muestra Mi historia / Próximamente sin solicitar archivos inexistentes. Oasis Orgánico y Forma y Fricción aún no tienen piezas.

## Contacto y legal

Correo directo: esteban@bnzoedit.online. bookingUrl espera tu URL real HTTPS del evento; al configurarla aparece el botón directo de reserva sin incrustar trackers. No hay URL de Calendly inventada.

legal.html es estático y accesible sin JavaScript. Completar directamente en esa página NIF, domicilio y demás datos pendientes; los campos legales de config.js no actualizan automáticamente el HTML legal. Indexación preparada con index, follow, canonical, robots.txt y sitemap.xml.

## Entrega

Revisión preparada para publicación mediante GitHub y Vercel. Para probar: servidor HTTP en esta carpeta. No hay promesa de carga instantánea o 60 fps universal; depende de dispositivo y red.
