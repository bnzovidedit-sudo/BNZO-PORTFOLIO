// Bnzo · página «Empezar». La CSP de la web prohíbe enviar formularios (form-action 'none'),
// así que el formulario prepara el mensaje y el visitante lo envía por WhatsApp o por correo.
// Entradas por partes: solo en escritorio (≥1081 px), sin «reducir movimiento» y con IntersectionObserver.
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (!matchMedia('(min-width: 1081px)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var groups = ['.intro-text > *', '.intro-media', '.cards > li', '.reels > li', '.steps li', '.faq details'];
  var items = [];
  groups.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el, i) {
      if (el.hasAttribute('data-reveal')) return;
      el.setAttribute('data-reveal', '');
      el.style.setProperty('--d', (i % 6) * 70 + 'ms');
      items.push(el);
    });
  });
  document.documentElement.classList.add('reveal-on');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  items.forEach(function (el) { io.observe(el); });
})();

(function () {
  var form = document.getElementById('order-form');
  if (!form) return;
  var box = document.getElementById('send-box');
  var preview = document.getElementById('preview');
  var wa = document.getElementById('send-wa');
  var mail = document.getElementById('send-mail');
  var err = document.getElementById('f-error');
  var PHONE = '34656913425';
  var EMAIL = 'esteban@bnzoedit.online';

  // «Lo quiero» marca el servicio en el formulario
  document.querySelectorAll('[data-servicio]').forEach(function (a) {
    a.addEventListener('click', function () {
      var r = form.querySelector('input[data-key="' + a.getAttribute('data-servicio') + '"]');
      if (r) r.checked = true;
    });
  });

  function val(name) {
    var el = form.elements[name];
    if (!el) return '';
    if (el.length && el[0] && el[0].type === 'radio') {
      var c = form.querySelector('input[name="' + name + '"]:checked');
      return c ? c.value : '';
    }
    return (el.value || '').trim();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var faltan = [];
    if (!val('servicio')) faltan.push('qué necesitas');
    if (!val('nombre')) faltan.push('tu nombre');
    if (!val('negocio')) faltan.push('tu negocio o canal');
    if (!val('objetivo')) faltan.push('qué quieres conseguir');
    if (!form.elements.privacidad.checked) faltan.push('la casilla de privacidad');
    if (faltan.length) {
      err.textContent = 'Falta: ' + faltan.join(', ') + '.';
      err.hidden = false;
      var first = form.querySelector(':invalid');
      if (first) first.focus();
      return;
    }
    err.hidden = true;

    var material = val('material') || 'Todavía no lo tengo';
    var texto = 'Hola, Esteban. Quiero hacer un encargo.\n\n' +
      'Qué necesito: ' + val('servicio') + '\n' +
      'Nombre: ' + val('nombre') + '\n' +
      'Negocio o canal: ' + val('negocio') + '\n' +
      'Qué quiero conseguir: ' + val('objetivo') + '\n' +
      'Material: ' + material + '\n' +
      'Para cuándo: ' + val('cuando');

    preview.textContent = texto;
    wa.href = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(texto);
    mail.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Encargo: ' + val('negocio')) + '&body=' + encodeURIComponent(texto);
    box.hidden = false;
    box.focus();
    box.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
})();
