// Antes de pintar: «js» activa los controles y «anim» las escenas fijas y los trazos.
(function () {
  var h = document.documentElement;
  h.classList.add('js');
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) h.classList.add('anim');
})();
