'use strict';
(() => {
  const config = window.PORTFOLIO_CONFIG;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = navigator.connection?.saveData;
  const key = 'portfolio-consent-v1';
  const maxAge = 180 * 24 * 60 * 60 * 1000;
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
  const pendingProjects = config.projects.filter(p => !localAsset(p.webm) && !localAsset(p.mp4));
  $('#portfolio-note').hidden = pendingProjects.length === 0;
  $('#portfolio-note').textContent = pendingProjects.length ? `${pendingProjects.map(p => p.title).join(' y ')}: ${pendingProjects.length === 1 ? 'pieza próximamente.' : 'piezas próximamente.'}` : '';

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
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) target.pause();
      else if (!saveData) { target.preload = 'metadata'; hydrate(target); }
    });
  }, { threshold: .2 }) : { observe() {}, unobserve() {} };
  // Empty configuration reserves the story's space without fetching a missing file.
  const story = config.story || {};
  if (localAsset(story.webm) || localAsset(story.mp4)) {
    const video = createVideo(story, true); video.id = 'story-video';
    video.setAttribute('aria-label', 'La historia de Bnzo');
    $('#story-video').replaceWith(video); $('#story-placeholder').hidden = true;
    const loadButton = $('#story-load');
    const activate = () => { hydrate(video); loadButton.hidden = true; };
    if (saveData || !('IntersectionObserver' in window)) {
      loadButton.hidden = false; loadButton.addEventListener('click', activate);
    } else observer.observe(video);
    video.addEventListener('error', () => {
      video.hidden = true; loadButton.hidden = true; $('#story-placeholder').hidden = false;
      $('#story-status').textContent = 'El vídeo no está disponible en este momento.';
    });
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
      if (project.fit === 'contain') visual.classList.add('preserve-frame');
      visual.setAttribute('aria-label', `${real ? 'Ver vídeo' : 'Ver enfoque'}: ${project.title}`);
      if (localAsset(project.poster)) {
        const img = document.createElement('img'); img.src = project.poster; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async'; img.width = 720; img.height = 1280; visual.append(img);
      }
      if (real) {
        const video = createVideo(project); visual.append(video); observer.observe(video);
        // Return Natur to its opening wave whenever the preview is paused.
        if (project.restorePoster) {
          video.classList.add('preview-resting');
          video.addEventListener('playing', () => video.classList.remove('preview-resting'));
          video.addEventListener('pause', () => video.classList.add('preview-resting'));
        }
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

  // Direct navigation only: no calendar iframe, prefetch or third-party script.
  const booking = safeBooking(config.bookingUrl);
  if (booking) {
    $('#direct-booking').href = booking;
    $('#direct-booking').hidden = false;
    $('#booking-pending').hidden = true;
  }

  if ('IntersectionObserver' in window && !reduced.matches) {
    const reveals = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('revealed'); reveals.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    $$('.reveal').forEach(el => reveals.observe(el));
  }

})();
