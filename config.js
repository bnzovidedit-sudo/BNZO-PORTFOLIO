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
    // Horizontal (16:9): ocupa una fila entera en «Trabajos» y cambia el marco de «La pieza y sus decisiones».
    { id:'05', category:'pulse', title:'Fisiofamily', subtitle:'Spot de marca · 16:9', label:'Spot de marca', summary:'Cada mañana cuenta: una rutina que se repite y avanza.', description:'Spot de portfolio para una marca ficticia de fisioterapia. Una mañana que se repite como ancla, con algo que cambia cada vez, hasta cerrar con la marca. Planos de stock de Pexels; la música, las animaciones del móvil, la marca y el diseño sonoro son originales.', credit:'Vídeo: Pexels (Kampus Production, Ekaterina Bolovtsova, Klaus Nielsen). Efectos de sonido: freesound.', poster:'assets/fisiofamily-spot-poster.jpg', mp4:'assets/fisiofamily-spot.mp4', wide:true },
    { id:'03', category:'oasis', title:'Gimnasio', subtitle:'Muestra de edición para gimnasios', label:'Autopromoción', summary:'Esfuerzo al ritmo de la música, sin cierre comercial.', description:'Proyecto personal de autopromoción. Monté planos de entrenamiento sobre la subida de la música y cerré en el último tirón del ejercicio, sin llamada a contratar. Planos de stock de Pexels.', credit:'Música: «Pa Ta», Infraction y Emerel Gray.', poster:'assets/gimnasio-pata-poster.jpg', mp4:'assets/gimnasio-pata.mp4' },
    { id:'01', category:'form', title:'Café', subtitle:'Pieza de producto', label:'Pieza de producto', summary:'Del ingrediente a la taza.', description:'Montaje de detalles y etapas de preparación del café, desde el ingrediente hasta la taza. Una pieza centrada en el producto y su proceso.', poster:'assets/cafe-reel-poster.jpg', mp4:'assets/cafe-reel.mp4', fit:'contain', restorePoster:true },
    { id:'04', category:'form', title:'Tren', subtitle:'Pieza conceptual', label:'Pieza conceptual', summary:'Imagen, texto y espera en un plano sostenido.', description:'Una frase en tres apariciones sobre un plano sostenido. Un ejercicio de relación entre imagen, texto y espera.', poster:'assets/pulso-tren-poster.jpg', mp4:'assets/pulso-tren.mp4', fit:'contain', restorePoster:true }
  ]
};
