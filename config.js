/* Edita este archivo para conectar tu identidad, reservas y vídeos propios.
   Todos los recursos multimedia deben ser locales: assets/nombre.webm / .mp4.
   No escribas datos personales que no quieras publicar. */
window.PORTFOLIO_CONFIG = {
  name: 'Esteban Bonet',
  alias: 'Bnzo',
  role: 'Editor y postproductor de vídeo vertical',
  email: 'esteban@bnzoedit.online',
  location: 'Mallorca',
  bookingUrl: '', // URL HTTPS de tu evento de Calendly. Se abre solo al pulsar, sin widget.
  legal: { holder: 'Esteban Bonet', taxId: '', address: '', registry: '' },
  sessionMinutes: 15,
  story: { poster: '', webm: '', mp4: '', captions: '' }, // Añade aquí tu vídeo personal.
  projects: [
    { id:'01', category:'oasis', title:'Oasis Orgánico', subtitle:'Naturaleza / Libertad', statement:'Respirar.', label:'SENSORIAL', description:'Natur. Espacio, textura y una cadencia que deja respirar.', poster:'assets/natur-poster.jpg', webm:'', mp4:'assets/natur-final.mp4', captions:'', fit:'contain', restorePoster:true },
    { id:'02', category:'pulse', title:'El Pulso Invisible', subtitle:'Humanidad / Inmersión', statement:'Sentir.', label:'EMOCIONAL', description:'El Pulso Invisible. Una historia entre trayectos.', poster:'assets/pulso-tren-poster.jpg', webm:'', mp4:'assets/pulso-tren.mp4', captions:'' },
    { id:'03', category:'form', title:'Forma y Fricción', subtitle:'Producto / Alquimia', statement:'Desear.', label:'COMERCIAL', description:'Producto, precisión de corte y diseño sonoro.', poster:'', webm:'', mp4:'', captions:'' }
  ]
};
