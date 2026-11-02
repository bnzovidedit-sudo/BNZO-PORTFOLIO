// KAIRO · web de marca. Efectos adaptados de E:\ANIPULSO\plantillas-web (código propio de Bnzo).
// Todo el contenido es visible sin JavaScript; este archivo solo añade el movimiento.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const outCubic = k => 1 - Math.pow(1 - k, 3);
  const outBack = k => { const c = 1.70158; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
  const pad = n => String(n).padStart(2, '0');
  const tc = s => { const f = Math.floor(s * 60) % 60, S = Math.floor(s) % 60, M = Math.floor(s / 60) % 60, H = Math.floor(s / 3600); return `${pad(H)}:${pad(M)}:${pad(S)}:${pad(f)}`; };
  // progreso 0..1 de una sección alta con hijo sticky
  const progress = el => { const r = el.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight)); };
  // bucle que solo corre mientras el elemento está en pantalla
  function whileVisible(el, step) {
    let raf = 0, on = false, last = 0;
    const frame = now => { step(now / 1000, Math.min(.05, (now - last) / 1000)); last = now; raf = on ? requestAnimationFrame(frame) : 0; };
    new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }).observe(el);
  }

  // ---------- letras que ruedan (navegación) ----------
  $$('.roll').forEach(a => {
    const t = a.textContent.trim(); a.setAttribute('aria-label', t); a.textContent = '';
    [...t].map(ch => ch === ' ' ? ' ' : ch).forEach((ch, i) => { const c = document.createElement('span'); c.className = 'c'; c.style.setProperty('--i', i); c.setAttribute('aria-hidden', 'true');
      c.innerHTML = `<span>${ch}</span><span>${ch}</span>`; a.appendChild(c); });
  });

  // ---------- titulares por líneas ----------
  const linesIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); linesIO.unobserve(e.target); } }), { threshold: .3 });

  // ---------- portada: aro, punto en órbita, contador e impulso ----------
  const svg = $('.hero-mark svg'), CX = 413.73, CY = 327.45, MID = 131.37;
  const ticks = $('.k-ticks', svg);
  for (let i = 0; i < 8; i++) {
    const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const a = i * 45;
    r.setAttribute('x', CX - 2.5); r.setAttribute('y', CY - 196); r.setAttribute('width', 5); r.setAttribute('height', i % 2 ? 12 : 22);
    r.setAttribute('transform', `rotate(${a} ${CX} ${CY})`); r.setAttribute('opacity', i % 2 ? .35 : .7); ticks.appendChild(r);
  }
  const dot = $('.k-dot', svg), revr = $('#k-revr'), full = $('.k-full', svg), heroTc = $('.hero-mark .tc');
  let heroStart = null;
  function placeDot(deg) { const a = (deg - 90) * Math.PI / 180; dot.setAttribute('cx', CX + Math.cos(a) * MID); dot.setAttribute('cy', CY + Math.sin(a) * MID); }
  // El drop del spot: el impulso cruza en 8 fotogramas (0,133 s), resplandor que decae en 0,16 s, dos ondas y temblor.
  const mark = $('.hero-mark'), glow = $('.k-glow'), waves = $$('.k-waves circle', svg);
  function revealSwoosh() {
    if (reduce) { revr.setAttribute('width', 700); full.style.opacity = 0; return; }
    full.style.transition = 'none'; full.style.opacity = 1; revr.setAttribute('width', 0);
    const t0 = performance.now();
    mark.classList.remove('shake'); void mark.offsetWidth;
    (function f(now) {
      const s = (now - t0) / 1000;
      revr.setAttribute('width', 700 * outCubic(clamp(s / .133)));
      glow.style.opacity = s < .133 ? s / .133 : Math.max(0, 1 - (s - .133) / .16);
      waves.forEach((w, i) => { const k = clamp((s - .12 - i * .25) / .7);   // ondas en el golpe y media negra después
        w.setAttribute('r', 153 * (1 + k * 1.1)); w.setAttribute('stroke-width', 14 * (1 - k)); w.setAttribute('opacity', k > 0 && k < 1 ? 1 - k : 0); });
      if (s > .12 && !mark.classList.contains('shake')) mark.classList.add('shake');
      if (s < 1.2) requestAnimationFrame(f); else { full.style.transition = 'opacity .35s'; full.style.opacity = 0; }
    })(t0);
  }
  $('.k-replay').addEventListener('click', revealSwoosh);
  // el símbolo se inclina hacia el cursor
  if (fine && !reduce) {
    const hero = $('.hero');
    hero.addEventListener('pointermove', e => { const r = svg.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      svg.style.transform = `rotateY(${clamp(x, -.8, .8) * 16}deg) rotateX(${clamp(-y, -.8, .8) * 12}deg)`; });
    hero.addEventListener('pointerleave', () => svg.style.transform = '');
  }
  const heroBg = $('.hero-bg span');
  function startHero() {
    $$('.hero .lines').forEach(l => l.classList.add('in'));
    setTimeout(revealSwoosh, reduce ? 0 : 450);
    heroStart = performance.now() / 1000;
    if (reduce) { placeDot(30); heroTc.textContent = tc(0); return; }
    whileVisible($('.hero'), now => {
      const t = now - heroStart, beat = t / .5;          // 120 BPM: una negra cada 0,5 s
      const b = Math.floor(beat), f = beat - b;
      placeDot((b + .35 * f + .65 * outBack(clamp(f / .6))) * 15); // avance continuo + acento en cada negra
      ticks.setAttribute('transform', `rotate(${-t * 20} ${CX} ${CY})`);
      heroTc.textContent = tc(t);
      heroBg.style.setProperty('--bgx', -((t * 40 + scrollY * .6) % 2000) + 'px'); // el eslogan avanza en el eje de 12°
    });
  }
  placeDot(0);

  // ---------- precarga: el contador llega a un segundo y la cortina sale en diagonal ----------
  const pre = $('.pre'), preTc = $('.pre-tc');
  let seen = false; try { seen = sessionStorage.getItem('kairo-pre') === '1'; sessionStorage.setItem('kairo-pre', '1'); } catch (e) {}
  if (reduce || seen) { pre.remove(); startHero(); }
  else {
    const t0 = performance.now();
    (function f(now) {
      // el contador recorre un segundo de fotogramas en 0,55 s; todo termina antes de 1,2 s
      const k = clamp((now - t0) / 550);
      preTc.innerHTML = k < 1 ? tc(k).replace(/(\d\d)$/, '<i>$1</i>') : '00:00:01:<i>00</i>';
      if (k < 1) return requestAnimationFrame(f);
      setTimeout(() => { pre.classList.add('out'); startHero(); }, 60);
      setTimeout(() => pre.remove(), 700);
    })(t0);
  }
  $$('.lines').forEach(l => { if (!l.closest('.hero')) linesIO.observe(l); });

  // ---------- cintas cruzadas: la velocidad sube con el scroll ----------
  const words = ['Créalo', 'No lo esperes', 'Un segundo', 'El momento es tuyo'];
  const rows = $$('.row').map(r => {
    r.innerHTML = Array(5).fill(words.map(w => `<span>${w}</span>`).join('')).join('');
    const st = { el: r, x: 0, dir: +r.dataset.dir, hold: false };
    r.parentElement.addEventListener('pointerenter', () => st.hold = true);
    r.parentElement.addEventListener('pointerleave', () => st.hold = false);
    return st;
  });
  let lastY = scrollY, boost = 0;
  if (!reduce) whileVisible($('.bands'), (t, dt) => {
    boost += (Math.min(60, Math.abs(scrollY - lastY)) - boost) * .1; lastY = scrollY;
    rows.forEach(r => {
      const w = r.el.scrollWidth / 5; if (!r.hold) r.x = (r.x + (50 + boost * 18) * dt) % w;
      r.el.style.transform = `translateX(${r.dir > 0 ? r.x - w : -r.x}px)`;
    });
  });

  // ---------- manifiesto: se enciende palabra a palabra ----------
  const mTxt = $('.manif-txt'), mSec = $('.manif');
  const mText = mTxt.textContent.trim(); mTxt.setAttribute('aria-label', mText); mTxt.textContent = '';
  const mWords = mText.split(/\s+/).map((w, i, a) => { const s = document.createElement('span'); s.className = 'w'; s.setAttribute('aria-hidden', 'true'); s.textContent = w; mTxt.appendChild(s); if (i < a.length - 1) mTxt.append(' '); return s; });
  // aro de lectura: se llena con el scroll; el contador recorre los 15 s del spot
  const mrArc = $('.mr-arc'), mrDot = $('.mr-dot'), mrTc = $('.mr-tc');
  function manif() {
    const p = clamp(progress(mSec) / .85), n = p * mWords.length;
    mWords.forEach((w, i) => { w.classList.toggle('on', i < n); w.classList.toggle('hot', i < n && i >= n - 2); });
    mrArc.setAttribute('stroke-dasharray', `${p * 100} 100`);
    const a = (p * 360 - 90) * Math.PI / 180; mrDot.setAttribute('cx', 150 + Math.cos(a) * 118); mrDot.setAttribute('cy', 150 + Math.sin(a) * 118);
    mrTc.textContent = tc(p * 15);
  }

  // ---------- antes / después ----------
  const adFrame = $('.ad-frame'), adRange = $('.ad-range');
  const adSet = v => adFrame.style.setProperty('--p', v + '%');
  adRange.addEventListener('input', () => adSet(adRange.value));
  // pista inicial: la línea respira una vez al entrar, para que se entienda que se arrastra
  new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting || reduce) return; o.disconnect();
    const t0 = performance.now();
    (function f(now) { const s = (now - t0) / 1000; if (adRange.dataset.touched) return;
      const v = 50 + Math.sin(s * Math.PI) * 18 * Math.max(0, 1 - s / 2); adSet(v); adRange.value = v; if (s < 2) requestAnimationFrame(f); })(t0);
  }, { threshold: .6 }).observe(adFrame);
  adRange.addEventListener('pointerdown', () => adRange.dataset.touched = 1);

  // ---------- un logo para cada fondo ----------
  const lgStage = $('.lg-stage'), lgImg = $('.lg-img'), lgFile = $('.lg-file code');
  const LG_VAR = { noche: 'oscuro', hueso: 'claro', berm: 'una_tinta_negro' }, LG_NOM = { noche: 'noche', hueso: 'hueso', berm: 'bermellón' };
  const LG_DIM = { horizontal: [1818, 736], vertical: [974, 976], simbolo: [838, 600] };
  function lgUpdate() {
    const bg = $('input[name="lg-bg"]:checked').value, f = $('input[name="lg-f"]:checked').value, file = `kairo_${f}_${LG_VAR[bg]}.svg`;
    lgStage.dataset.bg = bg; lgFile.textContent = file;
    lgImg.classList.add('swap');
    setTimeout(() => {
      lgImg.src = 'assets/logos/' + file; lgImg.width = LG_DIM[f][0]; lgImg.height = LG_DIM[f][1];
      lgImg.alt = `${f === 'simbolo' ? 'Símbolo' : 'Logo ' + f} de KAIRO sobre fondo ${LG_NOM[bg]}`;
      lgImg.onload = () => lgImg.classList.remove('swap');
      setTimeout(() => lgImg.classList.remove('swap'), 600); // por si la imagen ya estaba en caché
    }, reduce ? 0 : 180);
  }
  $$('.lg input').forEach(i => i.addEventListener('change', lgUpdate));

  // ---------- temporada: inclinación y foco al pasar ----------
  if (fine && !reduce) $$('.obj-img').forEach(c => {
    c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--x', x * 100 + '%'); c.style.setProperty('--y', y * 100 + '%');
      c.style.transform = `rotateY(${(x - .5) * 14}deg) rotateX(${(.5 - y) * 10}deg)`; });
    c.addEventListener('pointerleave', () => c.style.transform = '');
  });

  // ---------- spot: el scroll atraviesa el aro ----------
  const sSec = $('.spot'), veil = $('.portal-veil'), ring = $('.portal-ring'), hint = $('.portal-hint'), portal = $('.portal'), video = $('.phone video');
  function spot(now) {
    const k = progress(sSec), open = clamp(k / .7);
    const r0 = Math.min(innerWidth, innerHeight) * .13, r1 = Math.hypot(innerWidth, innerHeight) * .62;
    const e = open * open * (3 - 2 * open), r = r0 * Math.pow(r1 / r0, e), th = r * .4;
    veil.style.setProperty('--r', r + 'px');
    ring.style.width = ring.style.height = 2 * (r + th) + 'px'; ring.style.borderWidth = th + 'px';
    ring.style.setProperty('--orb', -(r + th / 2) + 'px'); ring.style.setProperty('--dot', th * .62 + 'px');
    ring.style.setProperty('--a', (k * 540 + (reduce ? 0 : now * 30)) + 'deg');
    hint.style.opacity = 1 - clamp(open * 6);
    portal.style.visibility = open >= 1 ? 'hidden' : 'visible';
    const inView = sSec.getBoundingClientRect().bottom > 0 && sSec.getBoundingClientRect().top < innerHeight;
    if (open > .55 && inView) { if (video.paused) { video.preload = 'auto'; video.play().catch(() => {}); } }
    else if (!video.paused) video.pause();
  }
  $('.sound').addEventListener('click', e => {
    video.muted = !video.muted; e.currentTarget.setAttribute('aria-pressed', !video.muted);
    e.currentTarget.textContent = video.muted ? 'Activar sonido' : 'Silenciar';
    if (video.paused) video.play().catch(() => {});
  });

  // ---------- en redes: el scroll vertical mueve la tira ----------
  const rSec = $('.redes'), strip = $('.strip');
  const pinGallery = matchMedia('(min-width: 861px) and (pointer: fine)');
  function gallery() {
    if (!pinGallery.matches) { strip.style.transform = ''; return; }
    strip.style.transform = `translateX(${-progress(rSec) * Math.max(0, strip.scrollWidth - innerWidth)}px)`;
  }

  function onScroll(now) { manif(); spot(now || performance.now() / 1000); gallery(); }
  addEventListener('scroll', () => onScroll(), { passive: true }); addEventListener('resize', () => onScroll());
  whileVisible(sSec, now => spot(now)); // el punto sigue girando aunque no haya scroll
  onScroll();

  // ---------- carácter: foco que sigue al cursor ----------
  const tiles = $$('.tile');
  addEventListener('pointermove', e => tiles.forEach(t => { const r = t.getBoundingClientRect(); t.style.setProperty('--x', e.clientX - r.left + 'px'); t.style.setProperty('--y', e.clientY - r.top + 'px'); }), { passive: true });

  // ---------- cifras: rodillo hasta su valor ----------
  $$('.odo').forEach(el => {
    const v = el.dataset.v; el.setAttribute('aria-label', v); el.setAttribute('role', 'img');
    [...v].forEach(() => el.insertAdjacentHTML('beforeend', `<span class="d" aria-hidden="true"><span>${[...'0123456789'].map(n => `<b>${n}</b>`).join('')}</span></span>`));
  });
  const odoIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; odoIO.unobserve(e.target);
    const v = e.target.dataset.v;
    $$('.d > span', e.target).forEach((s, i) => { s.style.transitionDelay = i * .12 + 's'; s.style.transform = `translateY(-${v[i]}em)`; });
  }), { threshold: .5 });
  $$('.odo').forEach(el => odoIO.observe(el));

  // ---------- piezas: vista previa junto al cursor ----------
  const prev = $('.prev'), prevImg = $('img', prev);
  if (fine) {
    let x = 0, y = 0, lx = 0, mx = 0, my = 0, on = false, raf = 0;
    addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    const follow = () => {
      x += (mx + 28 - x) * .14; y += (my - (prev.classList.contains('wide') ? 100 : 200) - y) * .14;
      const v = x - lx; lx = x;
      prev.style.transform = `translate(${x}px,${y}px) rotate(${clamp(v * .5, -10, 10)}deg)`;
      raf = on || Math.abs(v) > .1 ? requestAnimationFrame(follow) : 0;
    };
    $$('.piezas a').forEach(a => {
      a.addEventListener('pointerenter', () => { prevImg.src = a.dataset.prev; prev.classList.toggle('wide', a.hasAttribute('data-wide')); prev.classList.add('on'); on = true; if (!raf) raf = requestAnimationFrame(follow); });
      a.addEventListener('pointerleave', () => { prev.classList.remove('on'); on = false; });
    });
  }

  // ---------- visor de piezas: abre el vídeo o el PDF encima de la web ----------
  // Sin JavaScript los enlaces siguen abriendo el archivo; con él, nunca se sale de la página.
  const viewer = $('.viewer'), vBody = $('.viewer-body'), vTitle = $('#viewer-t');
  let opener = null;
  // El PDF no entra en el visor: la CSP de bnzoedit.online prohíbe marcos, así que se abre en su pestaña (target _blank).
  $$('.piezas a:not([href$=".pdf"])').forEach(a => a.addEventListener('click', e => {
    if (!viewer.showModal) return;
    e.preventDefault(); opener = a;
    const href = a.getAttribute('href'), name = $('h3', a).textContent;
    vTitle.textContent = name; viewer.classList.add('vert');
    vBody.innerHTML = `<video src="${href}" poster="${a.dataset.prev}" controls autoplay playsinline aria-label="${name}"></video>`;
    prev.classList.remove('on');
    if (!video.paused) video.pause();
    viewer.showModal();
  }));
  $('.viewer-x').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', e => { if (e.target === viewer) viewer.close(); }); // pulsar fuera cierra
  viewer.addEventListener('close', () => { vBody.innerHTML = ''; opener && opener.focus(); });

  // ---------- color: copiar con confirmación ----------
  const live = $('#pal-live');
  $$('.sw').forEach(b => {
    let to;
    b.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(b.dataset.hex); } catch (e) {}
      $$('.sw').forEach(o => o.classList.remove('done')); b.classList.add('done');
      live.textContent = `${b.querySelector('b').textContent} ${b.dataset.hex} copiado`;
      clearTimeout(to); to = setTimeout(() => { b.classList.remove('done'); live.textContent = ''; }, 1600);
    });
  });

  // ---------- botones magnéticos con relleno desde el punto de entrada ----------
  if (fine && !reduce) $$('.mag').forEach(b => {
    const s = $('span', b), set = e => { const r = b.getBoundingClientRect(); b.style.setProperty('--x', e.clientX - r.left + 'px'); b.style.setProperty('--y', e.clientY - r.top + 'px'); };
    b.addEventListener('pointerenter', set);
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      b.style.transform = `translate(${x * .25}px,${y * .3}px)`; s.style.transform = `translate(${x * .1}px,${y * .12}px)`; });
    b.addEventListener('pointerleave', e => { set(e); b.style.transform = ''; s.style.transform = ''; });
  });
})();
