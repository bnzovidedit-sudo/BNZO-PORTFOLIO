'use strict';
(() => {
  const config = window.PORTFOLIO_CONFIG;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = navigator.connection?.saveData;
  const key = 'portfolio-consent-v1';
  const maxAge = 180 * 24 * 60 * 60 * 1000;
  const manualPaused = new WeakSet();
  // Only self-hosted asset paths are accepted. Never insert configuration with innerHTML.
  function localAsset(path) {
    if (typeof path !== 'string' || !/^assets\/[a-zA-Z0-9_./-]+$/.test(path) || path.includes('..')) return '';
    return path;
  }
  function safeBooking(raw) {
    try { const url = new URL(raw); return url.protocol === 'https:' && !url.username && !url.password ? url.href : ''; } catch { return ''; }
  }
  function node(tag, text, className) {
    const element = document.createElement(tag);
    if (text) element.textContent = text;
    if (className) element.className = className;
    return element;
  }
  const mediaProjects = config.projects.filter(p => localAsset(p.webm) || localAsset(p.mp4));
  document.title = `${config.alias} — Montaje, ritmo y emoción`;
  $$('[data-brand]').forEach(el => { el.replaceChildren(document.createTextNode(config.name)); el.append(node('span', `${config.alias.toUpperCase()} / EDICIÓN Y POSTPRODUCCIÓN`, 'brand-sub')); });
  $$('[data-owner]').forEach(el => { el.textContent = config.name; });
  $('#year').textContent = new Date().getFullYear();
  if (mediaProjects.length === config.projects.length) $('#portfolio-note').hidden = true;

  function createVideo(project, controls = false) {
    const video = document.createElement('video');
    video.muted = true; video.loop = !controls; video.playsInline = true;
    video.controls = controls; video.preload = 'none';
    video.setAttribute('playsinline', ''); video.setAttribute('muted', '');
    if (!controls) video.setAttribute('loop', '');
    if (localAsset(project.poster)) video.poster = project.poster;
    for (const type of ['webm', 'mp4']) {
      if (!localAsset(project[type])) continue;
      const source = document.createElement('source');
      source.dataset.src = project[type]; source.type = `video/${type}`; video.append(source);
    }
    if (localAsset(project.captions)) {
      const track = document.createElement('track'); track.kind = 'captions'; track.label = 'Español'; track.srclang = 'es'; track.src = project.captions; video.append(track);
    }
    video.addEventListener('error', () => { video.setAttribute('aria-label', 'No se pudo cargar el vídeo'); });
    return video;
  }
  function hydrate(video) {
    if (video.dataset.loaded) return;
    video.querySelectorAll('source').forEach(source => { source.src = source.dataset.src; });
    video.dataset.loaded = 'true'; video.load();
  }
  function play(video) { hydrate(video); return video.play().catch(() => {}); }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) { target.pause(); }
      else if (target.dataset.hero && !document.hidden && !$('dialog[open]') && !reduced.matches && !saveData && !manualPaused.has(target)) { play(target); }
      else if (!target.dataset.hero && !saveData) { target.preload = 'metadata'; hydrate(target); }
    });
  }, { threshold: .2 });
  const hero = config.hero;
  if (localAsset(hero.webm) || localAsset(hero.mp4)) {
    const video = createVideo(hero); video.dataset.hero = 'true';
    if (!reduced.matches && !saveData) video.autoplay = true;
    $('#hero-film').prepend(video); $('#hero-placeholder').hidden = true; $('#hero-film .film-bottom > span').textContent = 'INTRO / RITUAL';
    observer.observe(video); const button = $('#hero-play'); button.hidden = false;
    const audio = $('#hero-audio'); audio.hidden = false;
    const updateAudio = () => {
      const audible = !video.muted && video.volume > 0;
      audio.setAttribute('aria-pressed', String(audible));
      audio.setAttribute('aria-label', audible ? 'Silenciar vídeo' : 'Activar sonido');
      audio.querySelector('span').textContent = audible ? 'Sonido on' : 'Sonido off';
    };
    // The source retains its real audio. No separate audio stream or timer to drift.
    video.addEventListener('volumechange', updateAudio);
    audio.addEventListener('click', () => {
      video.muted = !video.muted;
      if (!video.muted) { video.volume = 1; manualPaused.delete(video); play(video); }
      updateAudio();
    });
    updateAudio();
    const update = () => { button.textContent = video.paused ? '▷' : 'Ⅱ'; button.setAttribute('aria-label', video.paused ? 'Reproducir vídeo de portada' : 'Pausar vídeo de portada'); };
    video.addEventListener('error', () => { video.hidden = true; $('#hero-placeholder').hidden = false; button.hidden = true; audio.hidden = true; $('#hero-film .film-bottom > span').textContent = 'VÍDEO NO DISPONIBLE'; });
    video.addEventListener('play', update); video.addEventListener('pause', update); update();
    button.addEventListener('click', () => { if (video.paused) { manualPaused.delete(video); play(video); } else { manualPaused.add(video); video.pause(); } });
  }
  function timelineGraphic(category) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 300 120');
    svg.setAttribute('class', 'pillar-graphic');
    svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
    const paths = {
      oasis: ['M0 70C35 70 37 32 75 32S113 85 150 85S190 49 220 49S260 70 300 70', 'M0 82C35 82 37 44 75 44S113 97 150 97S190 61 220 61S260 82 300 82'],
      pulse: ['M0 60H36L41 54L46 67L51 42L56 82L61 29L66 88L71 50L76 60H112L117 41L122 77L127 19L132 101L137 34L142 78L147 49L152 60H199L204 47L209 78L214 35L219 89L224 49L229 65L234 60H300', 'M150 0V120'],
      form: ['M0 31H72V89H0 M79 31H165V89H79Z M172 31H226V89H172Z M233 31H300V89H233Z', 'M190 7V113']
    };
    (paths[category] || paths.form).forEach(d => {
      const path = document.createElementNS(ns, 'path'); path.setAttribute('d',d);
      path.setAttribute('fill','none'); path.setAttribute('stroke','currentColor'); svg.append(path);
    });
    return svg;
  }
  function renderProjects(filter) {
    $('#project-grid').querySelectorAll('video').forEach(video => { video.pause(); observer.unobserve(video); });
    $('#project-grid').replaceChildren();
    const projects = config.projects.filter(p => filter === 'all' || p.category === filter);
    projects.forEach(project => {
      const real = !!(localAsset(project.webm) || localAsset(project.mp4));
      const article = node('article', '', 'project-card reveal');
      const visual = node('button', '', `project-visual ${project.category}`);
      visual.setAttribute('aria-label', `${real ? 'Ver vídeo' : 'Ver enfoque'}: ${project.title}`);
      if (localAsset(project.poster)) {
        const img = document.createElement('img'); img.src = project.poster; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async'; img.width = 720; img.height = 1280; visual.append(img);
      }
      if (real) {
        const video = createVideo(project); visual.append(video); observer.observe(video);
        visual.addEventListener('pointerenter', () => { if (!reduced.matches && !saveData) play(video); });
        visual.addEventListener('pointerleave', () => video.pause());
        visual.addEventListener('focus', () => { if (!reduced.matches && !saveData) play(video); });
        visual.addEventListener('blur', () => video.pause());
      }
      visual.append(node('span', project.label, 'card-overline'));
      if (!real) { visual.append(node('span', project.statement, 'card-statement')); visual.append(timelineGraphic(project.category)); }
      const bottom = node('span', '', 'card-bottom'); bottom.append(node('span', real ? 'VER PIEZA' : 'EXPLORAR DIRECCIÓN'), node('span', real ? '▷' : '+')); visual.append(bottom);
      visual.addEventListener('click', () => {
        $$('video').forEach(v => v.pause()); $('#project-title').textContent = project.title; $('#project-category').textContent = project.subtitle;
        $('#project-description').textContent = real ? project.description : `${project.description} Pieza próximamente.`;
        $('#project-player').replaceChildren();
        if (real) { const video = createVideo(project, true); $('#project-player').append(video); hydrate(video); }
        $('#project-dialog').showModal();
      });
      const info = node('div', '', 'project-info'); const text = node('div'); text.append(node('h3', project.title), node('p', project.subtitle)); info.append(text, node('span', project.id));
      article.append(visual, info); $('#project-grid').append(article);
    });
    $('#filter-status').textContent = `${projects.length} ${projects.length === 1 ? 'dirección mostrada' : 'direcciones mostradas'}`;
  }
  renderProjects('all');
  // A native range supplies click, touch drag and keyboard behavior without a library.
  // The playhead controls editorial atmosphere, independently of the film's playback.
  const scrubber = $('#philosophy-scrubber');
  const phases = [
    { name:'Seleccionar', text:'Escuchar lo que la imagen necesita.' },
    { name:'Sustraer', text:'Retirar lo que no cambia lo que sientes.' },
    { name:'Sentir', text:'Dejar solo aquello que permanece.' }
  ];
  let currentPhase = -1;
  function updateTimeline() {
    const value = Math.max(0, Math.min(100, Number(scrubber.value)));
    const index = Math.min(2, Math.floor(value / (100 / 3)));
    $('#interactive-playhead').setAttribute('transform', `translate(${value * 10 - 577} 0)`);
    if (index !== currentPhase) {
      currentPhase = index;
      $('#filosofia').dataset.phase = String(index);
      $('#timeline-index').textContent = `0${index + 1} / 03`;
      $('#timeline-philosophy').textContent = phases[index].text;
      scrubber.setAttribute('aria-valuetext', `${phases[index].name}: ${phases[index].text}`);
    }
  }
  scrubber.addEventListener('input', updateTimeline);
  updateTimeline();
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => {
    $$('[data-filter]').forEach(b => { const selected = b === button; b.classList.toggle('active', selected); b.setAttribute('aria-pressed', String(selected)); });
    renderProjects(button.dataset.filter);
  }));
  document.addEventListener('visibilitychange', () => { if (document.hidden) $$('video').forEach(v => v.pause()); });
  reduced.addEventListener('change', () => { if (reduced.matches) $$('video').forEach(v => v.pause()); });
  $$('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  $$('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
    dialog.addEventListener('close', () => { dialog.querySelectorAll('video').forEach(v => { v.pause(); v.remove(); }); });
  });

  // The build intentionally contains NO analytics, pixel, remote font or embedded calendar.
  // Accepting cannot load unknown third parties. Audit and update policy before adding any.
  let consent = null;
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved?.version === 1 && ['accepted','rejected'].includes(saved.choice) && Number.isFinite(saved.at) && Date.now() >= saved.at && Date.now() - saved.at < maxAge) consent = saved.choice;
    else localStorage.removeItem(key);
  } catch { /* Storage unavailable: keep a session-only choice. */ }
  $('#cookie-banner').hidden = !!consent;
  $$('[data-consent]').forEach(button => button.addEventListener('click', () => {
    consent = button.dataset.consent;
    try { localStorage.setItem(key, JSON.stringify({ version:1, choice:consent, at:Date.now() })); } catch { /* Navigation remains usable. */ }
    $('#cookie-banner').hidden = true;
    if ($('#cookie-banner').contains(document.activeElement)) $('#preferences').focus({ preventScroll:true });
  }));
  $('#preferences').addEventListener('click', () => { $('#cookie-banner').hidden = false; $('[data-consent="rejected"]').focus({ preventScroll:true }); });

  const booking = safeBooking(config.bookingUrl);
  const email = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(config.email) ? config.email : '';
  $('#booking-open').addEventListener('click', () => {
    $('#booking-description').textContent = booking ? `Reserva ${config.sessionMinutes} minutos con ${config.name} (${config.alias}) para revisar tus grabaciones, objetivos, entregables y flujo de revisiones. Calendly se abrirá en una nueva pestaña.` : email ? 'Cuéntame qué material tienes, qué piezas necesitas y para cuándo. Buscaremos 15 minutos para definir el flujo de postproducción.' : 'Las reservas todavía no están disponibles. Este portfolio está en preparación; vuelve cuando se haya habilitado el contacto.';
    $('#booking-link').hidden = !booking; if (booking) $('#booking-link').href = booking;
    $('#email-link').hidden = !email; if (email) $('#email-link').href = `mailto:${email}?subject=${encodeURIComponent('Hablemos de mi proyecto')}`;
    $('#booking-privacy').textContent = booking ? 'Al abrir el calendario visitarás un servicio externo con su propia política de privacidad y cookies.' : 'No se recogen ni envían datos desde esta página.';
    $('#booking-dialog').showModal();
  });

  if ('IntersectionObserver' in window && !reduced.matches) {
    const reveals = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('revealed'); reveals.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    $$('.reveal').forEach(el => reveals.observe(el));
  }

  const legal = config.legal;
  const pending = value => value || '[PENDIENTE DE COMPLETAR POR EL TITULAR]';
  const legalContent = {
    notice: { title:'Aviso legal', sections:[
      ['', 'Borrador para completar antes de publicar. La identidad, actividad, datos registrales y condiciones reales deben ser revisados por el titular.'],
      ['Identificación del titular', `Titular: ${pending(legal.holder)}\nAlias artístico: ${config.alias}\nActividad: ${config.role}\nNIF/CIF: ${pending(legal.taxId)}\nDomicilio profesional: ${pending(legal.address)}\nCorreo: ${pending(email)}\nRegistro mercantil o profesional, si procede: ${pending(legal.registry)}`],
      ['Objeto y condiciones de uso', 'Este sitio presenta los servicios de edición y postproducción de vídeo vertical de Esteban Bonet, conocido artísticamente como Bnzo, sobre material aportado por el cliente y facilita un primer contacto. Los presupuestos, entregables, plazos, revisiones, licencias y condiciones de contratación se acordarán por escrito antes de iniciar el servicio. La navegación no constituye una contratación.'],
      ['Propiedad intelectual', 'Las piezas audiovisuales solo deben publicarse con los permisos necesarios de sus titulares, incluyendo música, imagen y marcas. El esquema de montaje de la portada es una composición conceptual de interfaz; no representa un proyecto de cliente ni un trabajo entregado. No se autoriza la reutilización de los trabajos de terceros sin su consentimiento.'],
      ['Responsabilidad y enlaces', 'Se procura mantener la información actualizada. Los servicios enlazados son gestionados por sus respectivos proveedores. Nada en este aviso limita derechos imperativos reconocidos a consumidores y usuarios.'],
      ['Normativa aplicable', 'La actividad se somete a la normativa española aplicable y a los derechos reconocidos por la normativa de la Unión Europea. Las condiciones concretas de contratación se facilitarán antes de contratar.']
    ]},
    privacy: { title:'Política de privacidad', sections:[
      ['', 'Borrador pendiente de los datos del responsable, proveedor de alojamiento, proveedor de reservas y plazos definitivos de conservación. No acredita por sí solo el cumplimiento de toda la actividad.'],
      ['Responsable del tratamiento', `${pending(legal.holder)} (alias artístico: ${config.alias}) · NIF/CIF: ${pending(legal.taxId)}. Domicilio: ${pending(legal.address)}. Contacto para privacidad: ${pending(email)}.`],
      ['Datos y finalidades', 'Esta página no contiene un formulario, no realiza analítica y no envía solicitudes de contacto por sí misma. Si escribes por correo, se tratarán tus datos identificativos, de contacto y la información que aportes para responder a tu consulta, preparar un presupuesto y gestionar la relación profesional. No envíes información sensible innecesaria. El alojamiento puede tratar IP, fecha, ruta y datos técnicos en registros de seguridad; el titular debe documentar el proveedor y su configuración.'],
      ['Base jurídica', 'La atención de solicitudes de servicios se fundamenta en la aplicación de medidas precontractuales a petición del interesado y, cuando proceda, en la ejecución del contrato (artículo 6.1.b del RGPD). Las obligaciones fiscales y contables se basan en obligaciones legales (6.1.c). Cualquier tratamiento opcional que requiera consentimiento deberá informarse específicamente y permitir su retirada. No se realizan campañas comerciales desde esta página.'],
      ['Conservación', 'Las consultas se conservarán durante el tiempo necesario para resolverlas y gestionar las medidas precontractuales solicitadas. Si hay contratación, se aplicarán los plazos legales pertinentes y, cuando proceda, el bloqueo de datos por responsabilidades. Antes de publicar, el titular debe fijar y documentar plazos concretos o criterios adecuados para correo, calendario, registros del servidor y copias de seguridad.'],
      ['Destinatarios y transferencias', 'El titular debe identificar los proveedores de correo, alojamiento y reservas que actúen como encargados y formalizar los acuerdos correspondientes. No se carga ningún calendario externo en esta página. Si abres el enlace de reservas, accedes al servicio de un tercero. Antes de habilitarlo deben revisarse sus subencargados, ubicaciones de tratamiento y las garantías aplicables a transferencias internacionales. No se venden datos personales desde esta web.'],
      ['Tus derechos', 'Puedes solicitar acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad cuando correspondan, así como retirar tu consentimiento sin afectar al tratamiento anterior. Dirige tu solicitud al correo de privacidad indicado, identificando el derecho que deseas ejercer; solo se solicitará información adicional de identidad cuando sea necesaria. Puedes reclamar ante la Agencia Española de Protección de Datos en www.aepd.es.'],
      ['Decisiones automatizadas', 'Esta versión no realiza perfiles ni toma decisiones automatizadas con efectos jurídicos sobre las personas.']
    ]},
    cookies: { title:'Política de cookies', sections:[
      ['Qué utiliza esta versión', 'No se instalan cookies de análisis, publicidad ni calendario. No se cargan fuentes externas, píxeles ni vídeos de plataformas de terceros. Los recursos visuales se sirven desde el mismo sitio.'],
      ['Preferencia técnica del navegador', 'Nombre: portfolio-consent-v1. Tecnología: localStorage, no una cookie HTTP. Titular: el propio sitio. Finalidad: recordar si has aceptado o rechazado. Contenido: elección, versión y fecha. Validez de la elección: 180 días; al volver a visitar el sitio se descarta una elección caducada. El navegador puede conservar físicamente el registro hasta la siguiente visita o hasta que borres sus datos. No se envía este registro a terceros.'],
      ['Aceptar, rechazar y revocar', 'Puedes aceptar o rechazar con los botones del aviso. En esta versión ambas opciones mantienen desactivados todos los servicios opcionales porque no hay ninguno instalado. Puedes cambiar tu elección en cualquier momento con «Preferencias» al pie de página y pulsar «Rechazar». También puedes borrar los datos del sitio desde tu navegador. La navegación y el contacto están disponibles aunque rechaces.'],
      ['Servicios externos', 'El enlace de reservas, cuando esté configurado, abre otro sitio únicamente tras una acción tuya; no carga un widget ni cookies de ese proveedor dentro de esta página. El proveedor debe informar y gestionar los tratamientos de su propio sitio.'],
      ['Cambios en los servicios', 'Si se incorporan analítica, publicidad o un calendario incrustado, deben identificarse sus tecnologías, proveedores, finalidades y duraciones, implementar preferencias por finalidad y bloquearlos hasta el consentimiento específico correspondiente. Una aceptación de esta versión no autoriza servicios añadidos posteriormente.']
    ]}
  };
  $$('[data-legal]').forEach(button => button.addEventListener('click', () => {
    const data = legalContent[button.dataset.legal]; $('#legal-title').textContent = data.title; $('#legal-body').replaceChildren();
    data.sections.forEach(([title, body]) => { if (title) $('#legal-body').append(node('h3', title)); const p = node('p', body, title ? '' : 'draft'); $('#legal-body').append(p); });
    $('#legal-dialog').showModal(); $('#legal-dialog').scrollTop = 0;
  }));
})();
