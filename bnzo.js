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
