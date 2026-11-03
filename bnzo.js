// Bnzo · web 2026 (demo local). Sin dependencias.
document.documentElement.classList.add('js');

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wide = window.matchMedia('(min-width: 761px)');

// Entradas por partes: cada bloque marcado entra con un pequeño desfase
const revealed = document.querySelectorAll('[data-reveal]');
revealed.forEach((el, i) => el.style.setProperty('--d', `${(i % 3) * 80}ms`));
// Se comprueba en cada scroll (no con IntersectionObserver) para que nada se quede oculto si se salta de golpe al final
let pending = [...revealed];
function reveal() {
  const limit = window.innerHeight * 0.98;
  pending = pending.filter((el) => {
    if (el.getBoundingClientRect().top < limit) { el.classList.add('in'); return false; }
    return true;
  });
}

// Vídeos en bucle: se cargan y reproducen solo cuando se ven
const autos = document.querySelectorAll('video.auto');
const vio = new IntersectionObserver((entries) => {
  entries.forEach(({ target: v, isIntersecting }) => {
    if (isIntersecting) {
      if (!v.src && v.dataset.src) v.src = v.dataset.src;
      if (!reduce) v.play().catch(() => {});
    } else if (!v.paused) v.pause();
  });
}, { threshold: 0.2 });
autos.forEach((v) => vio.observe(v));

// Scroll: la tarjeta de portada se encoge y las tarjetas de KAIRO cruzan la imagen
const card = document.querySelector('.hero-card');
const run = document.querySelector('.case-run');
const track = document.querySelector('.case-track');
let ticking = false;
function onScroll() {
  ticking = false;
  reveal();
  const vh = window.innerHeight;
  if (card && !reduce) {
    const p = Math.min(Math.max(window.scrollY / vh, 0), 1);
    card.style.transform = `translateY(${p * 12}vh) scale(${1 - p * 0.18})`;
  }
  if (run && track && wide.matches && !reduce) {
    const r = run.getBoundingClientRect();
    const total = run.offsetHeight - vh;
    const p = Math.min(Math.max(-r.top / total, 0), 1);
    const distance = track.scrollWidth - window.innerWidth;
    track.style.transform = `translateX(${-p * distance}px)`;
  } else if (track) {
    track.style.transform = '';
  }
}
window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

// Un logo para cada fondo
const stage = document.getElementById('try-stage');
const logo = document.getElementById('try-logo');
const fileOut = document.getElementById('try-file');
const variants = { noche: 'oscuro', hueso: 'claro', bermellon: 'una_tinta_blanco' };
const bgNames = { noche: 'fondo oscuro', hueso: 'fondo claro', bermellon: 'bermellón, a una tinta en blanco' };
const formNames = { horizontal: 'horizontal', vertical: 'vertical', simbolo: 'símbolo' };
const state = { bg: 'noche', form: 'horizontal' };
function paintLogo() {
  const file = `kairo_${state.form}_${variants[state.bg]}.svg`;
  stage.dataset.bg = state.bg;
  logo.classList.add('swap');
  setTimeout(() => {
    logo.src = `assets/${file}`;
    logo.alt = `Logo KAIRO ${formNames[state.form]}, versión para ${bgNames[state.bg]}`;
    logo.classList.remove('swap');
  }, reduce ? 0 : 160);
  fileOut.textContent = file;
}
document.querySelectorAll('.try .chip').forEach((b) => {
  b.addEventListener('click', () => {
    const key = b.dataset.bg ? 'bg' : 'form';
    state[key] = b.dataset[key];
    b.parentElement.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
    paintLogo();
  });
});

// Trabajos: el índice cambia la pieza grande
const tabs = [...document.querySelectorAll('.work-index [role="tab"]')];
const panel = document.getElementById('work-media');
const video = document.getElementById('work-video');
const note = document.getElementById('work-note');
const sound = document.getElementById('work-sound');
function select(tab, focus) {
  tabs.forEach((t) => { const on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
  panel.setAttribute('aria-labelledby', tab.id);
  video.poster = tab.dataset.poster;
  video.src = tab.dataset.video;
  note.textContent = tab.dataset.note;
  video.classList.remove('wipe'); void video.offsetWidth; video.classList.add('wipe');
  if (!reduce) video.play().catch(() => {});
  if (focus) tab.focus();
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => select(t));
  t.addEventListener('keydown', (e) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
    else if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
    else if (step) { e.preventDefault(); select(tabs[(i + step + tabs.length) % tabs.length], true); }
  });
});
const wio = new IntersectionObserver(([e]) => {
  if (e.isIntersecting) { if (!reduce) video.play().catch(() => {}); } else video.pause();
}, { threshold: 0.3 });
wio.observe(video);
sound.addEventListener('click', () => {
  video.muted = !video.muted;
  sound.setAttribute('aria-pressed', String(!video.muted));
  sound.textContent = video.muted ? 'Activar sonido' : 'Silenciar';
  if (!video.muted) video.play().catch(() => {});
});

// De dónde vengo: las piezas giran en un anillo (arrastre con inercia, flechas y camino).
// La de delante se reproduce y, al acabar, pasa a la siguiente, una detrás de otra.
const orbit = document.getElementById('orbit');
if (orbit) {
  const ring = orbit.querySelector('.log-list');
  const items = [...ring.children];
  const N = items.length;
  const step = 360 / N;
  const STILL_MS = 5000; // las piezas sin vídeo se quedan delante 5 s
  orbit.classList.add('on');
  orbit.tabIndex = 0;
  orbit.setAttribute('aria-label', `${orbit.getAttribute('aria-label')}. Arrastra o usa las flechas para girar.`);

  // Ficha, mandos y camino: solo existen con JS
  const panel = document.createElement('div');
  panel.className = 'orbit-panel';
  panel.innerHTML = `
    <div class="orbit-info" aria-hidden="true"><h3></h3><p class="log-role"></p><p></p></div>
    <div class="orbit-ctrl">
      <button type="button" data-go="-1" aria-label="Pieza anterior">←</button>
      <button type="button" data-go="1" aria-label="Pieza siguiente">→</button>
      <button type="button" class="o-pause" aria-pressed="false">Pausar</button>
      <button type="button" class="o-sound" aria-pressed="false">Sonido</button>
    </div>
    <p class="sr-only" aria-live="polite"></p>`;
  const steps = document.createElement('ol');
  steps.className = 'orbit-steps';
  steps.setAttribute('aria-label', 'Elige una pieza');
  items.forEach((it, i) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = it.querySelector('h3').textContent;
    b.addEventListener('click', () => goTo(i));
    li.appendChild(b);
    steps.appendChild(li);
  });
  orbit.after(panel, steps);
  const stepBtns = [...steps.querySelectorAll('button')];
  const info = panel.querySelector('.orbit-info');
  const live = panel.querySelector('[aria-live]');
  const pauseBtn = panel.querySelector('.o-pause');
  const soundBtn = panel.querySelector('.o-sound');

  // Radio del anillo: las piezas miran siempre al frente y se reparten en un círculo visto desde arriba
  let R = 0;
  function measure() {
    R = Math.round(Math.min(window.innerWidth * 0.38, ring.offsetWidth * 2.6));
  }

  // rot: giro actual; target: giro al que se acerca cuando nadie arrastra
  let rot = 0, target = 0, vel = 0, drag = null, active = -1, inView = false, paused = false, muted = true;
  let stillTimer = 0, stillStart = 0;
  const mod = (a, n) => ((a % n) + n) % n;

  function render() {
    items.forEach((it, i) => {
      const d = mod(i * step + rot + 180, 360) - 180; // −180…180, 0 = delante
      const a = d * Math.PI / 180;
      const c = Math.cos(a);
      it.style.transform = `translate3d(${(R * Math.sin(a)).toFixed(1)}px, ${((1 - c) * -R * 0.12).toFixed(1)}px, ${(R * (c - 1)).toFixed(1)}px) rotateY(${(d * 0.25).toFixed(2)}deg)`;
      it.style.opacity = String(0.45 + 0.55 * (c + 1) / 2);
      it.style.filter = Math.abs(d) < step / 2 ? '' : `brightness(${(0.4 + 0.3 * (c + 1) / 2).toFixed(3)})`;
    });
    const now = mod(Math.round(-rot / step), N);
    if (now !== active) setActive(now);
  }

  function stopStill() { clearTimeout(stillTimer); stillStart = 0; }

  function setActive(i) {
    const prev = items[active];
    if (prev) {
      prev.classList.remove('now');
      // La que se va vuelve a su portada y, si se vuelve a ella, empieza de cero
      const v = prev.querySelector('video');
      if (v) { v.pause(); v.classList.remove('ready'); v.currentTime = 0; }
    }
    stopStill();
    active = i;
    const it = items[i];
    it.classList.add('now');
    stepBtns.forEach((b, k) => {
      b.setAttribute('aria-current', String(k === i));
      b.classList.toggle('seen', k < i);
      if (k !== i) b.style.removeProperty('--p');
    });
    const [h, role, text] = it.querySelectorAll('.log-text > *');
    info.classList.add('swap');
    setTimeout(() => {
      info.querySelector('h3').textContent = h.textContent;
      info.querySelector('.log-role').textContent = role.textContent;
      info.querySelector('p:last-child').textContent = text.textContent;
      info.classList.remove('swap');
    }, reduce ? 0 : 180);
    live.textContent = `${i + 1} de ${N}: ${h.textContent}`;
    soundBtn.disabled = !it.dataset.video;
    play();
  }

  // Solo la pieza de delante carga su vídeo
  function videoOf(it) {
    let v = it.querySelector('video');
    if (!v && it.dataset.video) {
      v = document.createElement('video');
      v.playsInline = true;
      v.preload = 'auto';
      v.muted = true;
      v.setAttribute('aria-hidden', 'true');
      v.src = it.dataset.video;
      v.addEventListener('playing', () => v.classList.add('ready'));
      v.addEventListener('timeupdate', () => {
        if (items[active] === it && v.duration) stepBtns[active].style.setProperty('--p', (v.currentTime / v.duration).toFixed(3));
      });
      v.addEventListener('ended', () => { if (items[active] === it && !paused) goTo(active + 1); });
      it.querySelector('.log-card').appendChild(v);
    }
    return v;
  }

  function play() {
    const it = items[active];
    if (!it || !inView) return;
    const v = videoOf(it);
    if (v) {
      v.muted = muted;
      v.loop = paused; // con el recorrido en pausa, la pieza se repite en vez de pasar
      if (!reduce || !muted) v.play().catch(() => {});
    } else if (!paused && !reduce) {
      // Pieza sin vídeo: se queda unos segundos y sigue
      stopStill();
      stillStart = performance.now();
      stillTimer = setTimeout(() => goTo(active + 1), STILL_MS);
    }
  }

  function goTo(i) {
    // Gira por el camino más corto hasta la pieza i
    const cur = Math.round(-target / step);
    let diff = mod(i, N) - mod(cur, N);
    if (diff > N / 2) diff -= N;
    if (diff < -N / 2) diff += N;
    target = -(cur + diff) * step;
    if (reduce) rot = target;
    vel = 0;
  }

  // Arrastre con inercia; un toque sin moverse elige la pieza tocada
  orbit.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    drag = { x: e.clientX, last: e.clientX, moved: false, id: e.pointerId };
  });
  orbit.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.moved && Math.abs(e.clientX - drag.x) > 6) {
      drag.moved = true;
      orbit.setPointerCapture(e.pointerId);
      orbit.classList.add('grab');
    }
    if (!drag.moved) return;
    const dx = e.clientX - drag.last;
    drag.last = e.clientX;
    vel = dx * 0.22;
    rot += vel;
    target = rot;
  });
  const release = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const moved = drag.moved;
    drag = null;
    orbit.classList.remove('grab');
    if (moved) {
      // Proyecta la inercia y se asienta en la pieza más cercana
      const coast = vel / (1 - 0.92);
      target = Math.round((rot + coast) / step) * step;
      if (reduce) rot = target;
      vel = 0;
    } else {
      const hit = e.target.closest('.log-item');
      if (hit) goTo(items.indexOf(hit));
    }
  };
  orbit.addEventListener('pointerup', release);
  orbit.addEventListener('pointercancel', release);

  orbit.addEventListener('keydown', (e) => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (k) { e.preventDefault(); goTo(active + k); }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    else if (e.key === 'End') { e.preventDefault(); goTo(N - 1); }
  });
  panel.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => goTo(active + Number(b.dataset.go))));

  pauseBtn.addEventListener('click', () => {
    paused = !paused;
    pauseBtn.setAttribute('aria-pressed', String(paused));
    pauseBtn.textContent = paused ? 'Seguir' : 'Pausar';
    const v = items[active].querySelector('video');
    if (v) v.loop = paused;
    stopStill();
    if (!paused) play();
  });
  soundBtn.addEventListener('click', () => {
    muted = !muted;
    soundBtn.setAttribute('aria-pressed', String(!muted));
    const v = videoOf(items[active]);
    if (v) { v.muted = muted; v.play().catch(() => {}); }
  });

  // Solo se mueve y suena mientras se ve
  new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    if (inView) play();
    else {
      stopStill();
      items.forEach((it) => { const v = it.querySelector('video'); if (v) v.pause(); });
    }
  }, { threshold: 0.35 }).observe(orbit);

  measure();
  window.addEventListener('resize', measure);
  let last = performance.now();
  (function tick(now = performance.now()) {
    // El asentado va por tiempo, no por fotograma: igual a 60 Hz, a 120 Hz o con la pestaña frenada
    const dt = Math.min(now - last, 100);
    last = now;
    if (!drag && rot !== target) {
      rot += (target - rot) * (1 - Math.pow(0.88, dt / 16.7));
      if (Math.abs(target - rot) < 0.05) rot = target;
    }
    render();
    if (stillStart && !paused) {
      stepBtns[active].style.setProperty('--p', Math.min((performance.now() - stillStart) / STILL_MS, 1).toFixed(3));
    }
    requestAnimationFrame(tick);
  })();
}

// Al volver desde la web de KAIRO (/#marca) o entrar con un ancla, el salto nativo (suave) se calcula
// antes de que la página se asiente y acaba fuera de sitio. Se salta sin suavizado al cargar y se repite
// mientras la página se asienta, salvo que el visitante ya se esté desplazando.
if (location.hash.length > 1) {
  let userMoved = false;
  const stop = () => { userMoved = true; };
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((ev) => window.addEventListener(ev, stop, { once: true, passive: true }));
  const jump = () => {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (!target || userMoved) return;
    const root = document.documentElement;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY);
    root.style.scrollBehavior = '';
  };
  window.addEventListener('load', () => { jump(); setTimeout(jump, 350); setTimeout(jump, 900); });
}