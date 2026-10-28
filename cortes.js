// «Dónde corto»: los planos (medidos con ffmpeg, assets/planos.js) son botones que saltan al momento del reel.
// El reel se elige desde las tarjetas de «Mi trabajo» (app.js llama a window.cortesAbrir). Las entradas las hace .reveal de app.js.
(() => {
  const reels = window.PLANOS || [];
  const root = document.getElementById("cortes");
  if (!reels.length || !root) return;
  const q = (sel) => root.querySelector(sel);
  const video = q("#reel"), map = q("#map"), bar = q("#map-bar");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const fmt = (s) => s.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  let actual = reels[0];

  function elegir(r, cambiarUrl = true) {
    actual = r;
    q("#reel-title").textContent = r.titulo;
    
    const project = window.PORTFOLIO_CONFIG.projects.find(p => p.mp4 === r.video);
    q("#reel-hice").textContent = project?.description || r.hice;
    q("#reel-credit").textContent = project?.credit || '';
    q("details").open = false;
    root.classList.toggle("horizontal", r.formato === "horizontal");
    q("#reel-caption").textContent = `${r.titulo} · ${(project?.subtitle || r.tipo).toLowerCase()}`;
    if (video.getAttribute("src") !== r.video) { video.poster = r.poster; video.src = r.video; }
    if (cambiarUrl) history.replaceState(null, "", `#cortes-${r.id}`);
    pintarMapa(r);
  }

  // Lo llama app.js al tocar una tarjeta de «Mi trabajo». Devuelve false si el vídeo no está aquí.
  window.cortesAbrir = (mp4) => {
    const r = reels.find((x) => x.video === mp4);
    if (!r) return false;
    elegir(r);
    root.scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth", block: "start" });
    q("#reel-title").focus({ preventScroll: true });   // el foco sigue al contenido para teclado y lector de pantalla
    video.currentTime = 0;
    video.play().catch(() => {});
    return true;
  };

  function pintarMapa(r) {
    const n = r.planos.length;
    q("#reel-stats").textContent = n === 1
      ? `Un solo plano de ${fmt(r.duracion)} s, sin cortes.`
      : `${n} planos en ${fmt(r.duracion)} s · un plano dura de media ${fmt(r.duracion / n)} s.`;
    map.textContent = "";
    r.planos.forEach((p, k) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "shot";
      b.style.setProperty("--w", (p.fin - p.ini).toFixed(2));
      b.style.setProperty("--p", (((p.fin - p.ini) / r.duracion) * 100 * 0.9).toFixed(2));
      const img = document.createElement("img");
      img.src = p.img; img.decoding = "async"; img.loading = "lazy";
      img.width = r.formato === "horizontal" ? 240 : 135; img.height = r.formato === "horizontal" ? 135 : 240;
      img.alt = `Plano ${k + 1} de ${n}: de ${fmt(p.ini)} a ${fmt(p.fin)} segundos`;
      b.appendChild(img);
      b.addEventListener("click", () => { video.currentTime = p.ini + 0.01; video.play().catch(() => {}); });
      map.appendChild(b);
    });
    marcar(0);
  }

  function marcar(t) {
    const shots = map.children;
    actual.planos.forEach((p, k) => {
      const on = t >= p.ini && (t < p.fin || k === actual.planos.length - 1);
      if (shots[k]) shots[k].setAttribute("aria-current", on ? "true" : "false");
    });
    bar.style.transform = `scaleX(${Math.min(1, t / actual.duracion)})`;
  }
  video.addEventListener("timeupdate", () => marcar(video.currentTime));
  video.addEventListener("seeked", () => marcar(video.currentTime));

  const sound = q("#sound-toggle");
  function soundState() { sound.textContent = video.muted ? 'Activar sonido' : 'Silenciar'; sound.setAttribute('aria-pressed', String(!video.muted)); }
  sound.addEventListener('click', () => { video.muted = !video.muted; if (!video.muted) { video.volume = 1; video.play().catch(() => {}); } soundState(); });
  video.addEventListener('volumechange', soundState);
  soundState();
  const inicial = reels.find((r) => location.hash === `#cortes-${r.id}`);
  if (inicial) { elegir(inicial, false); root.scrollIntoView(); }
  else elegir(actual, false);
})();
