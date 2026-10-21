/* Edita este archivo para conectar tu identidad, reservas y vídeos propios.
   Todos los recursos multimedia deben ser locales: assets/nombre.webm / .mp4.
   No escribas datos personales que no quieras publicar. */
window.PORTFOLIO_CONFIG = {
  name: 'Esteban Bonet',
  alias: 'Bnzo',
  role: 'Editor y postproductor de vídeo vertical',
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
    // Solo se muestran los proyectos que tienen vídeo (webm o mp4).
    { id:'01', category:'form', title:'Café', subtitle:'Anuncio de producto', statement:'Desear.', label:'Anuncio de producto', description:'Qué hice: cortes precisos y diseño de sonido para que el café se sienta antes de probarlo.', useCase:'Ideal para cafeterías, restaurantes y tiendas que venden con la vista.', poster:'assets/cafe-reel-poster.jpg', webm:'', mp4:'assets/cafe-reel.mp4', captions:'', fit:'contain', restorePoster:true },
    // Barbería y gimnasio: reels de captación de Bnzo con planos de stock (Pexels). La música de barbería es CC BY 4.0: el crédito tiene que verse.
    { id:'02', category:'pulse', title:'Barbería', subtitle:'Reel de captación · Barberías', statement:'Cuidar.', label:'Reel de captación', description:'Qué hice: monté el proceso de un corte —tijera, máquina, perfil final— al pulso de la música y cerré con el resultado y la llamada a la acción. Planos de stock de Pexels (cottonbro). Música: «Newer Wave», Kevin MacLeod (incompetech.com), licencia CC BY 4.0.', useCase:'Ideal para barberías, peluquerías y centros de estética.', poster:'assets/barberia-reel-poster.jpg', webm:'', mp4:'assets/barberia-reel.mp4', captions:'' },
    { id:'03', category:'oasis', title:'Gimnasio', subtitle:'Reel de captación · Gimnasios', statement:'Empujar.', label:'Reel de captación', description:'Qué hice: subida de tensión con planos de entrenamiento, un silencio justo antes del golpe y una ráfaga de cortes al ritmo del drop. Planos de stock de Pexels; música de Pixabay.', useCase:'Ideal para gimnasios, boxes y estudios de entrenamiento.', poster:'assets/gimnasio-reel-poster.jpg', webm:'', mp4:'assets/gimnasio-reel.mp4', captions:'' }
  ]
};
