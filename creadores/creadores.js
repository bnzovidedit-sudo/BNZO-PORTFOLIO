/* Bnzo · web para creadores. Sin dependencias. Todo funciona sin JS salvo el armado del mensaje del formulario. */
(() => {
  const d = document, root = d.documentElement;
  root.classList.remove('no-js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = d) => c.querySelector(s), $$ = (s, c = d) => [...c.querySelectorAll(s)];

  /* Entradas: máscara de líneas y fundido */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .05, rootMargin: '0px 0px -5% 0px' });
  $$('.rv,.ml').forEach(el => io.observe(el));

  /* Menú: sección activa */
  const links = $$('.nav ul a');
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => a.getAttribute('href') === '#' + e.target.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['trabajo', 'servicios', 'maister', 'packs', 'faq'].forEach(id => { const s = d.getElementById(id); if (s) spy.observe(s); });

  /* Botones magnéticos con relleno */
  if (!reduce && matchMedia('(pointer:fine)').matches) $$('.mag').forEach(b => {
    const s = b.querySelector('span'), F = .3;
    const at = e => { const r = b.getBoundingClientRect(); b.style.setProperty('--x', e.clientX - r.left + 'px'); b.style.setProperty('--y', e.clientY - r.top + 'px'); };
    b.addEventListener('pointerenter', at);
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      b.style.transform = `translate(${x * F}px,${y * F}px)`; if (s) s.style.transform = `translate(${x * F * .4}px,${y * F * .4}px)`; });
    b.addEventListener('pointerleave', e => { at(e); b.style.transform = ''; if (s) s.style.transform = ''; });
  });

  /* Vídeo de presentación */
  const reel = $('#reel');
  if (reel) {
    const v = $('video', reel), btn = $('.play', reel);
    btn.addEventListener('click', () => { v.controls = true; v.play(); reel.classList.add('playing'); btn.hidden = true; });
    v.addEventListener('ended', () => { reel.classList.remove('playing'); btn.hidden = false; v.controls = false; });
  }

  /* Doble marquesina (se acelera con el scroll y se para al pasar el ratón) */
  const rows = $$('.row').map(r => {
    const words = r.dataset.words.split(',');
    r.innerHTML = Array(5).fill(words.map(w => `<span>${w}</span>`).join('')).join('');
    const st = { el: r, x: 0, dir: +r.dataset.dir, paused: false };
    const band = r.closest('.band'); band.addEventListener('pointerenter', () => st.paused = true); band.addEventListener('pointerleave', () => st.paused = false);
    return st;
  });
  let lastY = scrollY, boost = 0, last = performance.now(), crossVisible = false;
  const cross = $('.cross');
  if (cross) new IntersectionObserver(es => crossVisible = es[0].isIntersecting).observe(cross);
  const loop = now => {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (crossVisible && !reduce) {
      boost += (Math.min(40, Math.abs(scrollY - lastY)) - boost) * .1; lastY = scrollY;
      rows.forEach(r => { const w = r.el.scrollWidth / 5, v = r.paused ? 0 : 50 + boost * 25; r.x = (r.x + v * dt) % w;
        r.el.style.transform = `translateX(${r.dir > 0 ? r.x - w : -r.x}px)`; });
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  /* Rejilla de focos: el borde y el fondo se iluminan con el cursor */
  const tiles = $$('.tile');
  if (matchMedia('(pointer:fine)').matches) addEventListener('pointermove', e => tiles.forEach(t => { const r = t.getBoundingClientRect();
    t.style.setProperty('--x', e.clientX - r.left + 'px'); t.style.setProperty('--y', e.clientY - r.top + 'px'); }), { passive: true });

  /* Demo 1: pistas de la línea de tiempo */
  $$('.trk').forEach(t => t.dataset.cuts.split(',').forEach(n => { const i = d.createElement('i'); i.style.flex = n; t.appendChild(i); }));
  /* Demo 2: subtítulos palabra a palabra */
  const cap = $('#cap');
  if (cap) {
    const ws = cap.dataset.text.split(' ');
    cap.innerHTML = ws.map(w => `<span>${w}</span>`).join(' ');
    const sp = $$('span', cap); let k = 0;
    if (!reduce) setInterval(() => { sp.forEach((s, i) => s.classList.toggle('on', i === k)); k = (k + 1) % (sp.length + 2); }, 420);
    else sp.forEach(s => s.classList.add('on'));
  }
  /* Demo 3: onda de voz */
  const wave = $('#wave');
  if (wave) for (let i = 0; i < 38; i++) { const b = d.createElement('i'); b.style.height = (20 + Math.abs(Math.sin(i * 1.7)) * 80) + '%'; b.style.animationDelay = (i * -.07).toFixed(2) + 's'; wave.appendChild(b); }

  /* Vídeos que se reproducen solos solo mientras se ven (pack OBS y shorts) */
  const vio = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting && !reduce) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause(); }), { threshold: .35 });
  $$('video[data-auto], .short video').forEach(v => vio.observe(v));

  /* Contador rodillo */
  $$('.odo').forEach(el => {
    const v = String(el.dataset.v), s = el.dataset.s || '';
    el.setAttribute('aria-label', v + (s ? ' ' + s : ''));
    [...v].forEach(() => { const g = d.createElement('span'); g.className = 'd'; g.setAttribute('aria-hidden', 'true');
      g.innerHTML = '<span>' + '0123456789'.split('').map(n => `<b>${n}</b>`).join('') + '</span>'; el.appendChild(g); });
    if (s) el.insertAdjacentHTML('beforeend', `<span class="suf" aria-hidden="true">${s}</span>`);
  });
  const oio = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; oio.unobserve(e.target);
    const v = e.target.dataset.v; $$('.d > span', e.target).forEach((s, i) => { s.style.transitionDelay = i * .12 + 's'; s.style.transform = `translateY(-${v[i]}em)`; }); }), { threshold: .4 });
  $$('.odo').forEach(el => oio.observe(el));

  /* Preguntas: acordeón con muelle */
  $$('.faq details').forEach(dt => {
    $('summary', dt).addEventListener('click', e => {
      e.preventDefault();
      if (dt.open) { dt.classList.remove('on'); setTimeout(() => dt.open = false, reduce ? 0 : 420); }
      else { dt.open = true; requestAnimationFrame(() => requestAnimationFrame(() => dt.classList.add('on'))); }
    });
  });

  /* Reproductor */
  const dlg = $('#player');
  if (dlg) {
    const pv = $('video', dlg), yt = $('.yt', dlg);
    $$('[data-video]').forEach(c => c.addEventListener('click', () => {
      pv.src = c.dataset.video; pv.poster = c.dataset.poster || ''; yt.href = c.dataset.yt; yt.hidden = !c.dataset.yt;
      dlg.showModal(); pv.play().catch(() => {});
    }));
    const close = () => { pv.pause(); dlg.close(); };
    $('.x', dlg).addEventListener('click', close);
    dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
    dlg.addEventListener('close', () => pv.pause());
  }

  /* «Lo quiero a medida» marca el kit en el formulario */
  $$('[data-pick]').forEach(a => a.addEventListener('click', () => { const r = d.getElementById('o-' + a.dataset.pick); if (r) r.checked = true; }));

  /* Formulario: la web no envía datos a ningún servidor; arma el mensaje y abre WhatsApp o el correo */
  const form = $('#form');
  if (form) {
    const err = $('#err'), wa = $('#send-wa'), mail = $('#send-mail');
    const val = n => (form.elements[n] && form.elements[n].value || '').trim();
    const texto = () => {
      const tipo = (form.querySelector('input[name=tipo]:checked') || {}).value || '';
      return `Hola, Esteban. Soy ${val('nombre')}.\nMi canal: ${val('canal')}\nNecesito: ${tipo}\n\n${val('mensaje')}`;
    };
    const check = e => {
      const falta = [];
      if (!val('nombre')) falta.push('tu nombre');
      if (!val('canal')) falta.push('el enlace de tu canal');
      if (!form.querySelector('input[name=tipo]:checked')) falta.push('qué necesitas');
      if (falta.length) { e.preventDefault(); err.textContent = 'Falta ' + falta.join(', ') + '.'; return false; }
      err.textContent = ''; return true;
    };
    wa.addEventListener('click', e => { if (check(e)) wa.href = 'https://wa.me/34656913425?text=' + encodeURIComponent(texto()); });
    mail.addEventListener('click', e => { if (check(e)) mail.href = 'mailto:esteban@bnzoedit.online?subject=' + encodeURIComponent('Edición para ' + val('canal')) + '&body=' + encodeURIComponent(texto()); });
    form.addEventListener('submit', e => e.preventDefault());
  }
})();
