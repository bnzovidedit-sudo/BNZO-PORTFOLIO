// Antes de pintar: «js» activa los controles y «anim» los pliegues y las escenas fijas.
(function () {
  var h = document.documentElement;
  h.classList.add('js');
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) h.classList.add('anim');
})();
