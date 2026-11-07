/* UMBRAL · la línea. Sin dependencias.
   Presets propios adaptados: regla de progreso, manifiesto, galería horizontal, zoom a través,
   acordeón con muelle, interruptor de muelle, copiar con confirmación, botón magnético. */
(function () {
  'use strict';
  var d = document, raiz = d.documentElement;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var animar = raiz.classList.contains('anim');
  var limite = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var mezcla = function (a, b, k) { return a + (b - a) * k; };
  var salida = function (k) { return 1 - Math.pow(1 - k, 3); };

  /* ---------- Vídeo: solo suena la imagen que se ve ---------- */
  var enVista = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.preload = 'auto';
        if (animar) { var p = e.target.play(); if (p && p.catch) p.catch(function () {}); }
      } else e.target.pause();
    });
  }, { rootMargin: '25% 0px' });
  $$('video[data-bucle]').forEach(function (v) { enVista.observe(v); });

  /* ---------- Fundido lento del arco de la portada ---------- */
  var arcoV = $$('.arco video');
  if (animar && arcoV.length > 1) {
    var i = 0;
    setInterval(function () {
      if (d.hidden) return;
      arcoV[i].classList.remove('on');
      i = (i + 1) % arcoV.length;
      arcoV[i].classList.add('on');
    }, 6000);
  }

  /* ---------- La duda: palabra a palabra ---------- */
  var seccionDuda = $('.duda'), palabras = [];
  if (animar) {
    $$('[data-palabras]').forEach(function (el) {
      var t = el.textContent.trim().split(/\s+/);
      el.setAttribute('aria-label', el.textContent.trim());
      el.textContent = '';
      t.forEach(function (w, n) {
        var s = d.createElement('span');
        s.className = 'w apagada';
        s.setAttribute('aria-hidden', 'true');
        s.textContent = w;
        el.appendChild(s);
        if (n < t.length - 1) el.appendChild(d.createTextNode(' '));
        palabras.push(s);
      });
    });
  }

  /* ---------- Tu línea: interruptores, plano, recorrido y hoja de ruta ---------- */
  var interruptores = $$('[data-interruptores] input');
  var paradas = function () { return $$('[data-parada]').filter(function (p) { return !p.hidden; }); };

  function leerUrl() {
    var q = new URLSearchParams(location.search).get('linea');
    if (q === null) return;
    var marcados = q.split(',');
    interruptores.forEach(function (c) { c.checked = marcados.indexOf(c.value) > -1; });
  }

  function aplicarLinea(guardar) {
    var si = {};
    interruptores.forEach(function (c) { si[c.value] = c.checked; });
    $$('[data-opc]').forEach(function (el) {
      var antes = el.hidden;
      el.hidden = !si[el.dataset.opc];
      if (guardar && antes && !el.hidden && el.matches('.mapa li')) { el.classList.remove('brota'); void el.offsetWidth; el.classList.add('brota'); }
    });
    $$('[data-para]').forEach(function (li) {
      var opc = interruptores.filter(function (c) { return c.value === li.dataset.para; })[0];
      li.hidden = !!opc && !opc.checked;
    });
    var grupoEmb = $('[data-grupo=embalaje]');
    if (grupoEmb) grupoEmb.hidden = !si.embalaje;
    var visibles = $$('[data-mapa] li').filter(function (li) { return !li.hidden; });
    visibles.forEach(function (li, n) { li.classList.toggle('arriba', n % 2 === 0); });

    var lista = paradas(), total = lista.length;
    var contigo = lista.filter(function (p) { return p.dataset.quien === 'Contigo'; }).length;
    var cuenta = $('[data-cuenta]');
    if (cuenta) cuenta.textContent = total + ' paradas en tu línea';
    var bal = $('[data-balance]');
    if (bal) bal.textContent = 'Tu línea tiene ' + total + ' paradas. En ' + contigo + ' te necesitamos un rato. Del resto nos ocupamos nosotros.';

    if (guardar) {
      var u = new URL(location.href);
      u.searchParams.set('linea', interruptores.filter(function (c) { return c.checked; }).map(function (c) { return c.value; }).join(','));
      history.replaceState(null, '', u);
    }
    construirRegla();
    medir();
    alScroll();
  }
  interruptores.forEach(function (c) { c.addEventListener('change', function () { aplicarLinea(true); }); });

  /* ---------- Copiar la hoja de ruta ---------- */
  var botonCopiar = $('[data-copiar]');
  if (botonCopiar) {
    var tCopiar = $('[data-copiar-t]'), vCopiar = $('[data-copiar-v]'), reloj;
    botonCopiar.addEventListener('click', function () {
      var lineas = ['Mi hoja de ruta con UMBRAL', ''];
      paradas().forEach(function (p) { lineas.push(p.dataset.cuando + ' · ' + p.dataset.parada + ': ' + p.dataset.resumen + '.'); });
      var texto = lineas.join('\n');
      var hecho = function (msg) {
        tCopiar.textContent = msg; vCopiar.textContent = msg;
        clearTimeout(reloj);
        reloj = setTimeout(function () { tCopiar.textContent = 'Copiar mi hoja de ruta'; vCopiar.textContent = ''; }, 2000);
      };
      var aMano = function () {
        var t = d.createElement('textarea');
        t.value = texto; t.setAttribute('readonly', ''); t.className = 'invisible';
        d.body.appendChild(t); t.select();
        var ok = false;
        try { ok = d.execCommand('copy'); } catch (e) {}
        t.remove(); botonCopiar.focus();
        hecho(ok ? 'Copiada' : 'No se ha podido copiar');
      };
      if (navigator.clipboard) navigator.clipboard.writeText(texto).then(function () { hecho('Copiada'); }, aMano);
      else aMano();
    });
  }

  /* ---------- Acordeón con muelle ---------- */
  $$('.despliega').forEach(function (det) {
    $('summary', det).addEventListener('click', function (e) {
      e.preventDefault();
      if (det.open) { det.classList.remove('on'); setTimeout(function () { det.open = false; }, 420); }
      else { det.open = true; void det.offsetHeight; det.classList.add('on'); }
    });
  });

  /* ---------- Botón magnético ---------- */
  if (animar && matchMedia('(hover:hover)').matches) {
    $$('[data-magnetico]').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .22) + 'px,' + ((e.clientY - r.top - r.height / 2) * .32) + 'px)';
      });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
  }

  /* ---------- Regla y pantalla del vagón ---------- */
  var regla = $('[data-regla]'), enlaces = [], actual = null;
  function construirRegla() {
    if (!regla) return;
    regla.textContent = '';
    enlaces = paradas().map(function (p) {
      var a = d.createElement('a');
      a.href = '#' + p.id;
      a.setAttribute('aria-label', p.dataset.parada);
      a.appendChild(d.createElement('i'));
      var s = d.createElement('span'); s.setAttribute('aria-hidden', 'true'); s.textContent = p.dataset.parada; a.appendChild(s);
      regla.appendChild(a);
      return a;
    });
    regla.classList.add('lista');
    actual = null;
  }
  var pAhora = $('[data-ahora]'), pProx = $('[data-prox]');
  function rodar(el, texto) {
    if (el.textContent === texto) return;
    el.textContent = texto;
    if (animar && el.animate) el.animate([{ transform: 'translateY(70%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.16,1,.3,1)' });
  }

  /* ---------- Entradas por partes ---------- */
  if (animar && innerWidth >= 1100) {
    var vista = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); vista.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.plano-cab > *, .sw, .hoja-ruta-txt > *, .siempre-txt h2, .puntos li').forEach(function (el) {
      el.classList.add('aparece');
      var hermanos = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.setProperty('--d', Math.min(hermanos, 6) * 70 + 'ms');
      vista.observe(el);
    });
  }

  /* ---------- Medidas: la ruta y el cruce ---------- */
  var ruta = $('[data-ruta]'), tira = $('[data-tira]'), lineaH = $('[data-linea-h]'), recorrer = 0;
  var cruce = $('[data-cruce]');
  var cFoto = $('[data-cruce-foto]'), cMarco = $('[data-cruce-marco]'), cUmbral = $('[data-cruce-umbral]'), cHecho = $('[data-cruce-hecho]'),
    cCaja = $('[data-cruce-caja]'), cVelo = $('[data-cruce-velo]'), cAntes = $('[data-cruce-antes]'), cDespues = $('[data-cruce-despues]');
  var viajera = $('[data-viajera]');

  function medir() {
    if (!animar) return;
    tira.style.transform = '';
    recorrer = Math.max(0, tira.scrollWidth - innerWidth);
    ruta.style.height = (recorrer + innerHeight) + 'px';
    lineaH.style.width = recorrer + 'px';
    var xLinea = parseFloat(getComputedStyle(raiz).getPropertyValue('--x')) || 32;
    $('.ruta-codo.salida').style.left = (xLinea + recorrer) + 'px';
  }

  /* ---------- El bucle del scroll ---------- */
  var pliegos = [], cintas = [], lineas = [], lineaHI = null, velTope = 0, antesY = scrollY, letreros = [];

  function refrescarListas() {
    pliegos = $$('.pliego').map(function (p) { return { c: p, a: $('.hoja', p), b: $('.hoja2', p) }; });
    cintas = $$('.cinta');
    lineas = $$('[data-linea]').map(function (l) { return { l: l, i: $('i', l) }; });
    lineaHI = lineaH ? $('i', lineaH) : null;
    letreros = $$('.parada .letrero');
    letreros.forEach(function (l) {
      if ($('.masc', l)) return;
      var m = d.createElement('span'), s = d.createElement('span');
      m.className = 'masc'; s.textContent = l.textContent; l.textContent = ''; m.appendChild(s); l.appendChild(m);
    });
  }

  function dibujarCruce(k) {
    var w = innerWidth, h = innerHeight, mid = h / 2;
    var movil = w < 700;
    var ancho0 = movil ? w * .46 : Math.min(w * .17, 260);
    var alto0 = ancho0 * 1.18;
    var cx = movil ? w * .62 : w / 2;
    var kZoom = limite((k - .34) / .46, 0, 1), e = kZoom * kZoom * kZoom;
    var mitad = mezcla(ancho0 / 2, w * .95, e);
    var abajo = mezcla(mid, h * 1.25, e);
    var arriba = mezcla(mid - alto0, -w * .75, e);
    var radio = mitad;
    var izq = cx - mitad, der = cx + mitad;
    cFoto.style.clipPath = 'inset(' + arriba + 'px ' + (w - der) + 'px ' + (h - abajo) + 'px ' + izq + 'px round ' + radio + 'px ' + radio + 'px 0 0)';
    var grueso = mitad * .35;
    cMarco.style.left = (izq - grueso) + 'px';
    cMarco.style.top = (arriba - grueso) + 'px';
    cMarco.style.width = (mitad * 2 + grueso * 2) + 'px';
    cMarco.style.height = (abajo - arriba + grueso) + 'px';
    cMarco.style.borderWidth = grueso + 'px ' + grueso + 'px 0 ' + grueso + 'px';
    var x0 = parseFloat(getComputedStyle(raiz).getPropertyValue('--x')) || 32;
    var finUmbral = der + grueso + (movil ? 8 : 40);
    cUmbral.style.left = x0 + 'px';
    cUmbral.style.width = Math.max(0, finUmbral - x0) + 'px';
    cUmbral.style.transform = 'translateY(' + (abajo - 5) + 'px)';
    var caja = cCaja.offsetWidth || 30;
    var kPaso = salida(limite(k / .32, 0, 1));
    var cajaX = mezcla(x0 + 5 - caja / 2, cx - caja / 2, kPaso);
    var cajaY = mezcla(mid - caja / 2, mid - caja - 9, kPaso);
    var escala = 1 + e * 34;
    cCaja.style.transform = 'translate(' + cajaX + 'px,' + (cajaY + (abajo - mid)) + 'px) scale(' + escala + ')';
    cCaja.style.transformOrigin = '50% 100%';
    cCaja.style.opacity = kZoom > .34 ? 0 : 1;
    cHecho.style.transform = 'scaleX(' + limite((cajaX + caja / 2 - x0) / Math.max(1, finUmbral - x0), 0, 1) + ')';
    cAntes.style.opacity = 1 - limite(kZoom / .25, 0, 1);
    cAntes.style.transform = 'translateY(' + (abajo - mid) + 'px)';
    var kFin = limite((k - .74) / .14, 0, 1);
    cDespues.style.opacity = kFin;
    cDespues.style.transform = 'translateY(' + (1 - salida(kFin)) * 28 + 'px)';
    cVelo.style.opacity = .42 * kFin;
  }

  var pedido = false;
  function alScroll() { if (!pedido) { pedido = true; requestAnimationFrame(pintar); } }

  function pintar() {
    pedido = false;
    var vh = innerHeight, mid = vh / 2, vw = innerWidth;

    if (animar) {
      /* Palabra a palabra */
      var rd = seccionDuda.getBoundingClientRect();
      var kd = limite(-rd.top / Math.max(1, rd.height - vh), 0, 1);
      var nd = limite(kd / .78, 0, 1) * palabras.length;
      palabras.forEach(function (s, n) { s.classList.toggle('apagada', n >= nd); });

      /* Los pliegos: la hoja baja y la segunda se abre en sentido contrario */
      pliegos.forEach(function (p) {
        var t = p.c.getBoundingClientRect().top;
        /* Lejos de la pantalla queda abierto: se pliega al acercarse, justo antes de verse */
        var k = t > vh * 1.4 ? 1 : limite((vh * 1.02 - t) / (vh * .74), 0, 1);
        k = k * k * (3 - 2 * k);
        var k2 = t > vh * 1.4 ? 1 : limite((vh * .78 - t) / (vh * .6), 0, 1);
        p.a.style.transform = k >= 1 ? 'none' : 'rotateX(' + (-68 * (1 - k)) + 'deg)';
        p.a.style.setProperty('--s', ((1 - k) * .55).toFixed(3));
        if (p.b) {
          p.b.style.transform = k2 >= 1 ? 'none' : 'rotateX(' + (82 * (1 - k2)) + 'deg)';
          p.b.style.setProperty('--s', ((1 - k2) * .4).toFixed(3));
        }
      });

      /* Los letreros suben desde su máscara al entrar (preset: máscara de líneas) */
      letreros.forEach(function (l) {
        var t = l.getBoundingClientRect().top;
        l.classList.toggle('oculto', t > vh * .94 && t < vh * 1.4);
      });

      /* La cinta se tira de lado a lado */
      cintas.forEach(function (c) {
        if (c.hidden) return;
        var t = c.getBoundingClientRect().top;
        var k = t > vh * 1.4 ? 1 : salida(limite((vh * 1.02 - t) / (vh * .36), 0, 1));
        c.style.clipPath = 'inset(-20px ' + ((1 - k) * 100) + '% -20px 0)';
      });

      /* La línea recorrida se pinta de naranja hasta donde va la caja */
      lineas.forEach(function (o) {
        var r = o.l.getBoundingClientRect();
        if (r.height) o.i.style.transform = 'scaleY(' + limite((mid - r.top) / r.height, 0, 1) + ')';
      });

      /* La ruta: una sección fija que se mueve de lado */
      var rr = ruta.getBoundingClientRect();
      var kr = limite(-rr.top / Math.max(1, rr.height - vh), 0, 1);
      tira.style.transform = 'translateX(' + (-kr * recorrer) + 'px)';
      if (lineaHI) lineaHI.style.transform = 'scaleX(' + kr + ')';

      /* El cruce */
      var rc = cruce.getBoundingClientRect();
      var kc = limite(-rc.top / Math.max(1, rc.height - vh), 0, 1);
      dibujarCruce(kc);

      /* La viajera aparece con la línea y se apea en el cruce */
      var primera = $('[data-tramo]').getBoundingClientRect();
      viajera.classList.toggle('on', primera.top < mid && rc.top > 0);
      var vel = scrollY - antesY; antesY = scrollY;
      velTope = mezcla(velTope, limite(vel * .16, -7, 7), .25);
      viajera.style.transform = 'rotate(' + velTope + 'deg)';
    }

    /* Paradas alcanzadas: regla y pantalla */
    var lista = paradas(), n = -1;
    lista.forEach(function (p, idx) {
      var r = p.getBoundingClientRect();
      var ok = r.top < mid && r.left < vw * .5;
      var est = $('.estacion', p);
      if (est) est.classList.toggle('llegada', ok);
      if (ok) n = idx;
    });
    if (n !== actual) {
      actual = n;
      enlaces.forEach(function (a, idx) {
        a.classList.toggle('hecha', idx < n);
        if (idx === n) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
      rodar(pAhora, n < 0 ? 'Inicio' : lista[n].dataset.parada);
      rodar(pProx, lista[n + 1] ? lista[n + 1].dataset.parada : 'Tu casa');
    }
  }

  addEventListener('scroll', alScroll, { passive: true });
  addEventListener('resize', function () { medir(); alScroll(); });
  addEventListener('load', function () { medir(); alScroll(); });
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { medir(); alScroll(); });

  leerUrl();
  refrescarListas();
  aplicarLinea(false);
})();
