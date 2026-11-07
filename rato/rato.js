/* RATO. Sin dependencias.
   Presets propios adaptados: humo (el vapor), doble marquesina (que frena), contador rodillo (los minutos),
   corredor de imágenes (se ralentiza), botón magnético. */
(function () {
  'use strict';
  var d = document, raiz = d.documentElement;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var animar = raiz.classList.contains('anim');
  var limite = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ---------- Vídeo: solo se mueve lo que se ve ---------- */
  var enVista = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.preload = 'auto'; if (animar) { var p = e.target.play(); if (p && p.catch) p.catch(function () {}); } }
      else e.target.pause();
    });
  }, { rootMargin: '25% 0px' });
  $$('video[data-bucle]').forEach(function (v) { enVista.observe(v); });

  /* ---------- El tiempo que llevas aquí, de verdad ---------- */
  var reloj = $('[data-reloj]'), inicioPagina = Date.now();
  function marcarReloj() {
    var m = Math.floor((Date.now() - inicioPagina) / 60000);
    reloj.textContent = m < 1 ? 'Acabas de sentarte' : (m === 1 ? 'Llevas 1 minuto aquí' : (m < 5 ? 'Llevas ' + m + ' minutos aquí' : 'Llevas ' + m + ' minutos. Ya te lo has ganado'));
  }
  setInterval(marcarReloj, 15000);

  /* ---------- El vapor (preset humo, solo el humo y sobre la tinta) ---------- */
  var lienzoV = $('[data-vapor]');
  if (lienzoV) {
    var gl = lienzoV.getContext('webgl', { antialias: false });
    if (gl) {
      var frag = 'precision highp float;uniform vec2 r;uniform float t;' +
        'float h(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}' +
        'float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),u.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),u.x),u.y);}' +
        'float b(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<5;i++){v+=a*n(p);p=m*p;a*=.5;}return v;}' +
        'void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=uv*vec2(r.x/r.y,1.)*2.2;float s=t*.07;p.y-=s*2.;' +
        'vec2 q=vec2(b(p+s),b(p+vec2(5.2,1.3)-s));float f=b(p+2.6*q);' +
        'float zona=smoothstep(.1,.9,uv.y)*smoothstep(.05,.7,uv.x);' +
        'vec3 bg=vec3(.165,.11,.078);vec3 c=bg+vec3(1.,.77,.55)*smoothstep(.42,1.,f)*.17*zona;gl_FragColor=vec4(c,1.);}';
      var sh = function (tp, src) { var o = gl.createShader(tp); gl.shaderSource(o, src); gl.compileShader(o); return o; };
      var pr = gl.createProgram();
      gl.attachShader(pr, sh(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'));
      gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, frag));
      gl.linkProgram(pr); gl.useProgram(pr);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      var uR = gl.getUniformLocation(pr, 'r'), uT = gl.getUniformLocation(pr, 't');
      var dibV = function (ms) {
        var w = Math.round(lienzoV.clientWidth * .5), h = Math.round(lienzoV.clientHeight * .5);
        if (lienzoV.width !== w || lienzoV.height !== h) { lienzoV.width = w; lienzoV.height = h; gl.viewport(0, 0, w, h); }
        gl.uniform2f(uR, w, h); gl.uniform1f(uT, ms / 1000); gl.drawArrays(gl.TRIANGLES, 0, 3);
      };
      var vivo = false, bucleV = function (ms) { if (!vivo) return; dibV(ms); requestAnimationFrame(bucleV); };
      dibV(0);
      if (animar) new IntersectionObserver(function (es) {
        var ant = vivo; vivo = es[0].isIntersecting;
        if (vivo && !ant) requestAnimationFrame(bucleV);
      }).observe(lienzoV);
    }
  }

  /* ---------- La cinta que frena: empieza con prisa y se va parando al bajar ---------- */
  var cinta = $('[data-cinta]');
  if (cinta && animar) {
    var filasC = $$('.cinta-fila', cinta).map(function (f) {
      var base = f.innerHTML, html = '';
      for (var i = 0; i < 6; i++) html += base;
      f.innerHTML = html;
      return { el: f, x: 0, dir: +f.dataset.dir, w: 0 };
    });
    var enPantalla = false, parada = false, prev = performance.now();
    cinta.addEventListener('pointerenter', function () { parada = true; });
    cinta.addEventListener('pointerleave', function () { parada = false; });
    var moverC = function (ahora) {
      var dt = Math.min(.05, (ahora - prev) / 1000); prev = ahora;
      var r = cinta.getBoundingClientRect();
      var k = limite(1 - r.top / innerHeight, 0, 1);
      var v = parada ? 0 : 340 * Math.pow(1 - k, 2) + 9;
      filasC.forEach(function (f) {
        f.w = f.w || f.el.scrollWidth / 6;
        f.x = (f.x + v * dt) % f.w;
        f.el.style.transform = 'translateX(' + (f.dir > 0 ? f.x - f.w : -f.x) + 'px)';
      });
      if (enPantalla) requestAnimationFrame(moverC);
    };
    new IntersectionObserver(function (es) {
      var ant = enPantalla; enPantalla = es[0].isIntersecting;
      if (enPantalla && !ant) { prev = performance.now(); requestAnimationFrame(moverC); }
    }).observe(cinta);
  }

  /* ---------- Pared de imágenes: despacio, y más despacio al pasar por encima ---------- */
  var pared = $('[data-pared]');
  if (pared && animar) {
    var cols = $$('.pared-col', pared).map(function (c, i) {
      c.innerHTML += c.innerHTML;
      return { el: c, y: 0, v: i ? -22 : 16 };
    });
    var lento = 1, objetivo = 1, parVista = false, pPrev = performance.now();
    pared.addEventListener('pointerenter', function () { objetivo = .15; });
    pared.addEventListener('pointerleave', function () { objetivo = 1; });
    var moverP = function (ahora) {
      var dt = Math.min(.05, (ahora - pPrev) / 1000); pPrev = ahora;
      lento += (objetivo - lento) * .04;
      cols.forEach(function (c) {
        var h = c.el.scrollHeight / 2;
        c.y = (c.y + Math.abs(c.v) * dt * lento) % h;
        c.el.style.transform = 'translateY(' + (c.v > 0 ? c.y - h : -c.y) + 'px)';
      });
      if (parVista) requestAnimationFrame(moverP);
    };
    new IntersectionObserver(function (es) {
      var ant = parVista; parVista = es[0].isIntersecting;
      if (parVista && !ant) { pPrev = performance.now(); requestAnimationFrame(moverP); }
    }).observe(pared);
  }

  /* ---------- Botón magnético ---------- */
  if (animar && matchMedia('(hover:hover)').matches) {
    $$('[data-magnetico]').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .18) + 'px,' + ((e.clientY - r.top - r.height / 2) * .28) + 'px)';
      });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
  }

  /* ---------- Entradas lentas ---------- */
  if (animar && innerWidth >= 1100) {
    var vistoIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); vistoIO.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.prisa-txt > *, .carta-cab > *, .sitio-txt > *, .pieza-txt > *').forEach(function (el) {
      el.classList.add('aparece');
      el.style.setProperty('--d', Math.min(Array.prototype.indexOf.call(el.parentElement.children, el), 6) * 160 + 'ms');
      vistoIO.observe(el);
    });
  }

  /* ---------- Cinco minutos: la taza se llena con el scroll ---------- */
  var cinco = $('[data-cinco]'), minutos = $$('.minuto', cinco), nivel = $('[data-nivel]'), rueda = $('[data-rueda]'), actual = -1;
  var pintarNivel = function (rect, k) {
    /* El interior de la taza va de y=110 (vacía) a y=58 (llena) */
    var y = 110 - 52 * k;
    rect.setAttribute('y', y.toFixed(2));
    rect.setAttribute('height', (116 - y).toFixed(2));
  };
  var pedido = false;
  function pintar() {
    pedido = false;
    if (!animar) return;
    var vh = innerHeight, r = cinco.getBoundingClientRect();
    var k = limite(-r.top / Math.max(1, r.height - vh), 0, 1);
    pintarNivel(nivel, k);
    var n = Math.min(minutos.length - 1, Math.floor(k * minutos.length));
    if (n !== actual) {
      actual = n;
      minutos.forEach(function (m, i) { m.classList.toggle('on', i === n); });
      rueda.style.setProperty('--paso', n);
    }
  }
  function alScroll() { if (!pedido) { pedido = true; requestAnimationFrame(pintar); } }
  addEventListener('scroll', alScroll, { passive: true });
  addEventListener('resize', alScroll);
  addEventListener('load', alScroll);
  if (nivel) pintarNivel(nivel, 0);

  /* ---------- La carta: cuánto tienes ---------- */
  var radios = $$('[data-tengo] input'), platos = $$('[data-platos] li'), recomienda = $('[data-recomienda]'), tEmpezar = $('[data-empezar-t]');
  var FRASES = { 5: 'Con 5 minutos te llega para un café con leche.', 10: 'Con 10 minutos, pide también la tostada.', 20: 'Con 20 minutos ya es un desayuno sentado.', 45: 'Con 45 minutos, la mesa de la ventana es tuya.' };
  var minutosElegidos = 5;
  function aplicarCarta(guardar) {
    var r = radios.filter(function (x) { return x.checked; })[0];
    minutosElegidos = r ? +r.value : 5;
    platos.forEach(function (p) { p.classList.toggle('fuera', +p.dataset.min > minutosElegidos); });
    recomienda.textContent = FRASES[minutosElegidos];
    tEmpezar.textContent = 'Empezar mis ' + minutosElegidos + ' minutos';
    if (guardar) {
      var u = new URL(location.href);
      u.searchParams.set('tengo', minutosElegidos);
      history.replaceState(null, '', u);
    }
  }
  var q = new URLSearchParams(location.search).get('tengo');
  if (q) radios.forEach(function (x) { x.checked = x.value === q; });
  radios.forEach(function (x) { x.addEventListener('change', function () { aplicarCarta(true); }); });
  aplicarCarta(false);

  /* ---------- Tu rato: un temporizador de verdad ---------- */
  var dlg = $('[data-rato]'), rNivel = $('[data-rato-nivel]'), rTiempo = $('[data-rato-tiempo]'), rFrase = $('[data-rato-frase]'), rCerrar = $('[data-rato-cerrar]');
  var tituloBase = d.title, intervalo = 0, finRato = 0, duracion = 0;
  var MENSAJES = ['El móvil puede esperar.', 'Mira por la ventana. Hay gente corriendo.', 'Nadie sabe que estás aquí.', 'Ese correo seguirá ahí.', 'Da otro sorbo.', 'Esto también es hacer algo.'];
  function mmss(s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  function tic() {
    var queda = (finRato - Date.now()) / 1000;
    var k = limite(queda / duracion, 0, 1);
    pintarNivel(rNivel, k);
    rTiempo.textContent = mmss(queda);
    d.title = mmss(queda) + ' · Tu rato';
    var i = Math.min(MENSAJES.length - 1, Math.floor((1 - k) * MENSAJES.length));
    if (rFrase.textContent !== MENSAJES[i]) rFrase.textContent = MENSAJES[i];
    if (queda <= 0) {
      clearInterval(intervalo); intervalo = 0;
      rTiempo.textContent = '0:00';
      rFrase.textContent = 'Ya está. Y llegas.';
      rCerrar.textContent = 'Volver';
      d.title = 'Ya está · RATO';
    }
  }
  function empezar(mins) {
    duracion = mins * 60; finRato = Date.now() + duracion * 1000;
    rCerrar.textContent = 'Ya me voy';
    rFrase.textContent = MENSAJES[0];
    pintarNivel(rNivel, 1);
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    tic();
    clearInterval(intervalo); intervalo = setInterval(tic, 500);
  }
  $('[data-empezar]').addEventListener('click', function () { empezar(minutosElegidos); });
  rCerrar.addEventListener('click', function () { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); });
  dlg.addEventListener('close', function () { clearInterval(intervalo); intervalo = 0; d.title = tituloBase; });

  pintar();
})();
