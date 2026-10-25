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
  whatsappMessage: 'Hola Esteban, vi tu web y quiero hablar de un proyecto de edición de video.',
  instagram: 'bnzoedit', // Usuario de Instagram, sin @.
  bookingUrl: '', // URL HTTPS de tu evento de Calendly. Se abre solo al pulsar, sin widget.
  legal: { holder: 'Esteban Bonet', taxId: '41659109Z', address: "C/ Ca'n Serinyà, 5B, Palma de Mallorca (Illes Balears)", registry: 'No inscrito (actividad ejercida como autónomo, persona física)' },
  sessionMinutes: 15,
  // Short de presentación con voz (26 s, subtítulos quemados). Proyecto: E:\BNZO_SISTEMA\proyectos\short_web_sobremi
  story: { poster: 'assets/sobre-mi-poster.jpg', webm: '', mp4: 'assets/sobre-mi.mp4', captions: '' },
  projects: [
    { id:'02', category:'pulse', title:'Barbería', subtitle:'Muestra de edición para barberías', label:'Autopromoción', summary:'Proceso, resultado y cierre comercial.', description:'Proyecto personal de autopromoción. Monté el proceso de un corte y cerré con una llamada a contratar mis servicios de edición. Planos de stock de Pexels (cottonbro).', credit:'Música: «Newer Wave», Kevin MacLeod (incompetech.com), licencia CC BY 4.0.', poster:'assets/barberia-reel-poster.jpg', mp4:'assets/barberia-reel.mp4' },
    { id:'03', category:'oasis', title:'Gimnasio', subtitle:'Muestra de edición para gimnasios', label:'Autopromoción', summary:'Montaje de entrenamiento y mensaje de marca.', description:'Proyecto personal de autopromoción. Seleccioné planos de entrenamiento, construí una progresión visual y añadí textos y un cierre para presentar mis servicios. Planos de stock de Pexels.', credit:'Música de Pixabay.', poster:'assets/gimnasio-reel-poster.jpg', mp4:'assets/gimnasio-reel.mp4' },
    { id:'01', category:'form', title:'Café', subtitle:'Pieza de producto', label:'Pieza de producto', summary:'Del ingrediente a la taza.', description:'Montaje de detalles y etapas de preparación del café, desde el ingrediente hasta la taza. Una pieza centrada en el producto y su proceso.', poster:'assets/cafe-reel-poster.jpg', mp4:'assets/cafe-reel.mp4', fit:'contain', restorePoster:true },
    { id:'04', category:'form', title:'Tren', subtitle:'Pieza conceptual', label:'Pieza conceptual', summary:'Imagen, texto y espera en un plano sostenido.', description:'Una frase en tres apariciones sobre un plano sostenido. Un ejercicio de relación entre imagen, texto y espera.', poster:'assets/pulso-tren-poster.jpg', mp4:'assets/pulso-tren.mp4', fit:'contain', restorePoster:true }
  ]
};
