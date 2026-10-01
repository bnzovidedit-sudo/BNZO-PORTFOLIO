/* Edita este archivo para conectar tu identidad, reservas y vídeos propios.
   Todos los recursos multimedia deben ser locales: assets/nombre.webm / .mp4.
   No escribas datos personales que no quieras publicar. */
window.PORTFOLIO_CONFIG = {
  name: 'Esteban Bonet',
  alias: 'Bnzo',
  role: 'Editor y postproductor de vídeo vertical',
  email: '',
  bookingUrl: '', // URL HTTPS de tu evento de Calendly. Se abre solo al pulsar, sin widget.
  legal: { holder: 'Esteban Bonet', taxId: '', address: '', registry: '' },
  sessionMinutes: 15,
  hero: { poster: 'assets/coffee-poster.jpg', webm: 'assets/coffee-sensory.webm', mp4: 'assets/coffee-film.mp4' },
  projects: [
    { id:'01', category:'oasis', title:'Oasis Orgánico', subtitle:'Naturaleza / Libertad', statement:'Respirar.', label:'SENSORIAL', description:'Espacio, textura y una cadencia que deja respirar.', poster:'', webm:'', mp4:'', captions:'' },
    { id:'02', category:'pulse', title:'El Pulso Invisible', subtitle:'Humanidad / Inmersión', statement:'Sentir.', label:'EMOCIONAL', description:'La emoción guía el montaje. El sonido acerca la historia.', poster:'', webm:'', mp4:'', captions:'' },
    { id:'03', category:'form', title:'Forma y Fricción', subtitle:'Producto / Alquimia', statement:'Desear.', label:'COMERCIAL', description:'Ritual de café. Materia, precisión y tensión.', poster:'assets/coffee-poster.jpg', webm:'', mp4:'assets/coffee-film.mp4', captions:'' }
  ]
};
