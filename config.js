/* Edita este archivo para conectar tu identidad, reservas y vídeos propios.
   Todos los recursos multimedia deben ser locales: assets/nombre.webm / .mp4.
   No escribas datos personales que no quieras publicar. */
window.PORTFOLIO_CONFIG = {
  name: 'Esteban Bonet',
  alias: 'BNZOEDIT',
  role: 'Editor y postproductor de vídeo',
  email: 'esteban@bnzoedit.online',
  location: 'Mallorca',
  whatsapp: '34656913425', // Número en formato internacional, sin + ni espacios.
  whatsappMessage: 'Hola Esteban, vi tu web y me gustaría reservar 15 minutos para hablar de un proyecto de vídeo.',
  instagram: 'bnzoedit', // Usuario de Instagram, sin @.
  bookingUrl: '', // URL HTTPS de tu evento de Calendly. Se abre solo al pulsar, sin widget.
  legal: { holder: 'Esteban Bonet', taxId: '41659109Z', address: "C/ Ca'n Serinyà, 5B, Palma de Mallorca (Illes Balears)", registry: 'No inscrito (actividad ejercida como autónomo, persona física)' },
  sessionMinutes: 15,
  // Short de presentación con voz (26 s, subtítulos quemados). Proyecto: E:\BNZO_SISTEMA\proyectos\short_web_sobremi
  story: { poster: 'assets/sobre-mi-poster.jpg', webm: '', mp4: 'assets/sobre-mi.mp4', captions: '' },
  projects: [
    // Horizontal (16:9): wide = fila entera; wide + pair = media fila (spots.css). Cambia el marco de «La pieza y sus decisiones».
    // discipline (spot, edicion, motion; una o varias) alimenta el filtro de «Trabajos». note = aviso visible en la tarjeta.
    { id:'06', category:'pulse', discipline:['motion'], title:'Eventos', subtitle:'Motion para eventos · 16:9', label:'Motion · tipografía', summary:'Ocho ideas tipográficas en 15 segundos. Cada corte cae en el golpe.', description:'Pieza propia para promotoras, DJs y salas. Tipografía cinética a 160 BPM: palabras que caen de golpe, una marquesina que se estira con el bombo, un contador de fotogramas, un túnel y un montaje rápido que termina en el cierre. La animación, la música y el diseño sonoro son originales.', poster:'assets/eventos-spot-poster.jpg', mp4:'assets/eventos-spot.mp4', wide:true, pair:true },
    { id:'05', category:'pulse', discipline:['spot', 'edicion', 'motion'], note:'Spot conceptual · marca ficticia', pair:true, title:'Fisiofamily', subtitle:'Spot de marca · 16:9', label:'Spot de marca', summary:'Cada mañana cuenta: una rutina que se repite y avanza.', description:'Spot de portfolio para una marca ficticia de fisioterapia. Una mañana que se repite como ancla, con algo que cambia cada vez, hasta cerrar con la marca. Planos de stock de Pexels; la música, las animaciones del móvil, la marca y el diseño sonoro son originales.', credit:'Vídeo: Pexels (Kampus Production, Ekaterina Bolovtsova, Klaus Nielsen). Efectos de sonido: freesound.', poster:'assets/fisiofamily-spot-poster.jpg', mp4:'assets/fisiofamily-spot.mp4', wide:true },
    // ASALTO 25 s 9:16 (FINAL\BOXEO_spot_25s_9x16.mp4) sustituye a Tren y Café (30-10). Si se renderiza otra versión, repetir preparar_spot_web.py --vertical.
    { id:'07', category:'pulse', discipline:['spot', 'edicion', 'motion'], title:'ASALTO', subtitle:'Spot de marca · 9:16', label:'Spot de marca', summary:'Cada golpe en el compás.', note:'Spot conceptual · marca ficticia', description:'Spot conceptual para una marca de boxeo inventada. Golpes que caen en el compás, rebobinados en las acciones, ráfagas de cortes y efectos de glitch. Planos de stock de Pexels; la música, la marca, los efectos y el diseño sonoro son originales.', credit:'Vídeo: Pexels.', poster:'assets/asalto-spot-poster.jpg', mp4:'assets/asalto-spot.mp4' },
    { id:'03', category:'oasis', discipline:['edicion'], title:'Gimnasio', subtitle:'Muestra de edición para gimnasios', label:'Autopromoción', summary:'Esfuerzo al ritmo de la música, sin cierre comercial.', description:'Proyecto personal de autopromoción. Monté planos de entrenamiento sobre la subida de la música y cerré en el último tirón del ejercicio, sin llamada a contratar. Planos de stock de Pexels.', credit:'Música: «Pa Ta», Infraction y Emerel Gray.', poster:'assets/gimnasio-pata-poster.jpg', mp4:'assets/gimnasio-pata.mp4' }
  ]
};
