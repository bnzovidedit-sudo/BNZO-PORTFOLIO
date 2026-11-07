/* FIRME. Sin dependencias.
   Presets propios adaptados: contador rodillo, persiana, lista con vista previa, descifrado,
   pila de tarjetas, manifiesto (como subrayado), rastro de tinta (la firma), botón magnético. */
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

  /* ---------- Contador rodillo: once pisos ---------- */
  $$('[data-odo]').forEach(function (el) {
    var v = String(el.dataset.odo);
    var total = +v;
    el.textContent = v;
    if (!animar) return;
    /* Rueda piso a piso: empieza deprisa y los últimos cuestan más, como cuando ya estás harto */
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      var n = 1;
      var paso = function () {
        el.textContent = n;
        if (el.animate) el.animate([{ transform: 'translateY(55%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 170, easing: 'cubic-bezier(.16,1,.3,1)' });
        if (n++ < total) setTimeout(paso, 70 + Math.pow(n / total, 3) * 340);
      };
      paso();
    }, { threshold: .5 });
    io.observe(el);
  });

  /* ---------- Persiana: luz de piso vacío sobre la tinta ---------- */
  var lienzoLuz = $('[data-persiana]');
  if (lienzoLuz) {
    var gl = lienzoLuz.getContext('webgl', { antialias: false });
    if (gl) {
      var frag = 'precision highp float;uniform vec2 r;uniform float t;' +
        'void main(){vec2 uv=gl_FragCoord.xy/r;vec2 q=vec2(uv.x-uv.y*.5,uv.y);' +
        'float s=fract(q.y*11.+q.x*3.+sin(t*.2)*.5);float sl=smoothstep(.15,.3,s)*smoothstep(.85,.7,s);' +
        'float w=smoothstep(.95,.1,length((uv-vec2(.72+.04*sin(t*.17),.62))*vec2(1.,1.4)));' +
        'vec3 bg=vec3(.106,.141,.2);vec3 c=bg+vec3(.95,.71,.27)*sl*w*.34+vec3(.95,.71,.27)*w*.04;gl_FragColor=vec4(c,1.);}';
      var sh = function (tp, src) { var o = gl.createShader(tp); gl.shaderSource(o, src); gl.compileShader(o); return o; };
      var pr = gl.createProgram();
      gl.attachShader(pr, sh(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'));
      gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, frag));
      gl.linkProgram(pr); gl.useProgram(pr);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      var uR = gl.getUniformLocation(pr, 'r'), uT = gl.getUniformLocation(pr, 't');
      var dibLuz = function (ms) {
        var w = Math.round(lienzoLuz.clientWidth * .6), h = Math.round(lienzoLuz.clientHeight * .6);
        if (lienzoLuz.width !== w || lienzoLuz.height !== h) { lienzoLuz.width = w; lienzoLuz.height = h; gl.viewport(0, 0, w, h); }
        gl.uniform2f(uR, w, h); gl.uniform1f(uT, ms / 1000); gl.drawArrays(gl.TRIANGLES, 0, 3);
      };
      var vivaLuz = false, bucleLuz = function (ms) { if (!vivaLuz) return; dibLuz(ms); requestAnimationFrame(bucleLuz); };
      dibLuz(0);
      if (animar) new IntersectionObserver(function (es) {
        var ant = vivaLuz; vivaLuz = es[0].isIntersecting;
        if (vivaLuz && !ant) requestAnimationFrame(bucleLuz);
      }).observe(lienzoLuz);
    }
  }

  /* ---------- Traductor de anuncios ---------- */
  var SIGNOS = 'abcdefghilmnoprstuvz·-';
  function descifrar(el) {
    if (!animar) return;
    var final = el.dataset.final || (el.dataset.final = el.textContent);
    var q = final.split('').map(function (ch, i) { return { ch: ch, fin: i + 6 + Math.floor(Math.random() * 10) }; });
    var f = 0;
    cancelAnimationFrame(el._raf);
    (function tick() {
      var fuera = 0, txt = '';
      q.forEach(function (c) {
        if (f >= c.fin || c.ch === ' ') { txt += c.ch; fuera++; }
        else txt += SIGNOS[Math.floor(Math.random() * SIGNOS.length)];
      });
      el.textContent = txt; f++;
      if (fuera < q.length) el._raf = requestAnimationFrame(tick);
    })();
  }
  var filas = $$('[data-frases] .frase');
  filas.forEach(function (li) {
    var b = $('button', li), vt = $('.v-t', li);
    vt.setAttribute('aria-label', vt.textContent);
    b.addEventListener('click', function () {
      var abrir = !li.classList.contains('abierta');
      filas.forEach(function (o) { o.classList.remove('abierta'); $('button', o).setAttribute('aria-expanded', 'false'); });
      if (abrir) { li.classList.add('abierta'); b.setAttribute('aria-expanded', 'true'); descifrar(vt); }
    });
  });
  if (filas[0]) { filas[0].classList.add('abierta'); $('button', filas[0]).setAttribute('aria-expanded', 'true'); }

  /* La imagen que sigue al ratón por las frases */
  var vista = $('[data-vista]');
  if (vista && animar && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var vImg = $('img', vista), vx = 0, vy = 0, mx = 0, my = 0, ultima = 0, corriendo = false;
    var mover = function () {
      vx += (mx + 30 - vx) * .12; vy += (my - 130 - vy) * .12;
      var inc = limite((vx - ultima) * .5, -10, 10); ultima = vx;
      vista.style.transform = 'translate(' + vx + 'px,' + vy + 'px) rotate(' + inc + 'deg)';
      if (corriendo) requestAnimationFrame(mover);
    };
    filas.forEach(function (li) {
      li.addEventListener('pointerenter', function (e) {
        vImg.src = li.dataset.prev; mx = e.clientX; my = e.clientY; vista.classList.add('on');
        if (!corriendo) { corriendo = true; requestAnimationFrame(mover); }
      });
      li.addEventListener('pointermove', function (e) { mx = e.clientX; my = e.clientY; });
      li.addEventListener('pointerleave', function () { vista.classList.remove('on'); corriendo = false; });
    });
  }

  /* ---------- Subrayado palabra a palabra ---------- */
  var subrayados = $$('[data-subraya]').map(function (el) {
    var txt = el.textContent.trim().split(/\s+/); el.textContent = '';
    var ws = txt.map(function (w, n) {
      var s = d.createElement('span'); s.className = 'w'; s.textContent = w;
      el.appendChild(s);
      if (n < txt.length - 1) el.appendChild(d.createTextNode(' '));
      return s;
    });
    if (!animar) ws.forEach(function (s) { s.classList.add('on'); });
    return { el: el, ws: ws };
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

  /* ---------- Entradas por partes ---------- */
  if (animar && innerWidth >= 1100) {
    var vistoIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); vistoIO.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.anuncios-cab > *, .papeles-cab > *, .firmar-cab > *, .clausula').forEach(function (el) {
      el.classList.add('aparece');
      el.style.setProperty('--d', Math.min(Array.prototype.indexOf.call(el.parentElement.children, el), 6) * 70 + 'ms');
      vistoIO.observe(el);
    });
  }

  /* ---------- El camino y la pila: lo que depende del scroll ---------- */
  var camino = $('[data-camino]'), caps = $$('.cap', camino), fotosCam = $$('.camino-foto video', camino);
  var hojas = $$('.hoja-doc'), trazoNav = $('[data-trazo-nav]'), subNav = $('[data-subraya-nav]');
  var capActual = -1, pedido = false;

  function pintar() {
    pedido = false;
    var vh = innerHeight, mid = vh * .55;

    /* El logo de la barra se firma a medida que lees */
    var k = limite(scrollY / Math.max(1, raiz.scrollHeight - vh), 0, 1);
    trazoNav.style.strokeDashoffset = 1 - limite(k / .92, 0, 1);
    subNav.style.strokeDashoffset = 1 - limite((k - .92) / .08, 0, 1);

    /* Color por capítulo */
    var n = -1;
    caps.forEach(function (c, i) { if (c.getBoundingClientRect().top < mid) n = i; });
    var rc = camino.getBoundingClientRect();
    if (rc.bottom < vh * .3 || rc.top > vh * .7) n = rc.top > 0 ? -1 : caps.length - 1;
    if (n !== capActual) {
      capActual = n;
      var fondo = n >= 0 ? caps[n].dataset.fondo : 'crema';
      camino.classList.toggle('f-tinta', fondo === 'tinta');
      camino.classList.toggle('f-amarillo', fondo === 'amarillo');
      fotosCam.forEach(function (v, i) { v.classList.toggle('on', i === Math.max(n, 0)); });
    }

    if (animar) {
      /* La pila: las de atrás se encogen */
      hojas.forEach(function (h, i) {
        var sig = hojas[i + 1];
        if (!sig) return;
        var solape = limite(1 - (sig.getBoundingClientRect().top - h.getBoundingClientRect().top) / h.offsetHeight, 0, 1);
        h.style.transform = 'scale(' + (1 - solape * .05) + ')';
        var borde = sig.getBoundingClientRect().top;
        Array.prototype.forEach.call(h.children, function (el) { el.style.visibility = el.getBoundingClientRect().bottom > borde ? 'hidden' : ''; });
      });
      /* El subrayado avanza con la hoja */
      subrayados.forEach(function (o) {
        var t = o.el.getBoundingClientRect().top;
        var a = limite((vh * .86 - t) / (vh * .3), 0, 1) * o.ws.length;
        o.ws.forEach(function (w, i) { w.classList.toggle('on', i < a); });
      });
    }
  }
  function alScroll() { if (!pedido) { pedido = true; requestAnimationFrame(pintar); } }
  addEventListener('scroll', alScroll, { passive: true });
  addEventListener('resize', alScroll);
  addEventListener('load', alScroll);

  /* ---------- La firma ---------- */
  var cont = $('[data-contrato]');
  var marcas = $$('.clausula input', cont), zona = $('[data-firma-zona]'), aviso = $('[data-firma-aviso]');
  var lienzo = $('[data-lienzo]'), ctx = lienzo.getContext('2d'), bFirmar = $('[data-firmar]'), bBorrar = $('[data-borrar]'), llaves = $('[data-llaves]');
  var abierta = false, trazando = false, largo = 0, lx = 0, ly = 0, grosor = 3;

  function ajustarLienzo() {
    var r = lienzo.getBoundingClientRect(), z = Math.min(devicePixelRatio || 1, 2);
    lienzo.width = Math.round(r.width * z); lienzo.height = Math.round(r.height * z);
    ctx.setTransform(z, 0, 0, z, 0, 0);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#1B2433';
    largo = 0; bFirmar.disabled = true;
  }
  function comprobar() {
    var faltan = marcas.filter(function (m) { return !m.checked; }).length;
    abierta = faltan === 0;
    zona.classList.toggle('abierta', abierta);
    aviso.textContent = abierta ? 'Ahora sí. Firma cuando quieras.' : (faltan === 1 ? 'Aún no. Te falta 1.' : 'Aún no. Te faltan ' + faltan + '.');
    if (!abierta) bFirmar.disabled = true; else if (largo > 80) bFirmar.disabled = false;
  }
  marcas.forEach(function (m) { m.addEventListener('change', comprobar); });

  function punto(e) { var r = lienzo.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
  lienzo.addEventListener('pointerdown', function (e) {
    if (!abierta) return;
    trazando = true; lienzo.setPointerCapture(e.pointerId);
    var p = punto(e); lx = p[0]; ly = p[1]; grosor = 3;
    e.preventDefault();
  });
  lienzo.addEventListener('pointermove', function (e) {
    if (!trazando) return;
    var p = punto(e), v = Math.hypot(p[0] - lx, p[1] - ly);
    /* Como la tinta del preset, pero al revés: la pluma afina cuando corre */
    grosor += (limite(5.2 - v * .16, 1.8, 5.2) - grosor) * .35;
    ctx.lineWidth = grosor;
    ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(p[0], p[1]); ctx.stroke();
    lx = p[0]; ly = p[1]; largo += v;
    if (largo > 80) bFirmar.disabled = false;
  });
  var soltar = function () { trazando = false; };
  lienzo.addEventListener('pointerup', soltar);
  lienzo.addEventListener('pointercancel', soltar);
  bBorrar.addEventListener('click', function () {
    var r = lienzo.getBoundingClientRect();
    ctx.clearRect(0, 0, r.width, r.height); largo = 0; bFirmar.disabled = true;
    llaves.hidden = true;
  });
  bFirmar.addEventListener('click', function () {
    llaves.hidden = false;
    var v = $('video', llaves);
    v.preload = 'auto';
    if (animar) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    llaves.scrollIntoView({ behavior: animar ? 'smooth' : 'auto', block: 'center' });
    alScroll();
  });
  addEventListener('resize', function () { if (largo === 0) ajustarLienzo(); });
  ajustarLienzo();
  comprobar();

  pintar();
})();
