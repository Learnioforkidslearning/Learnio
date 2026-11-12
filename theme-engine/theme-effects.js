/* Learnio Theme Engine — DECORATIVE EFFECTS
   One fixed, click-through layer (#lt-fx). Mostly CSS animation; JS only
   builds a handful of nodes when the theme changes. Never touches page DOM
   other than appending this single container to <body>. */
(function (global) {
  'use strict';
  var LT = global.LearnioTheme;
  var fx = null, top = null, swapTimer = null;

  var SVG = {
    moon: '<svg viewBox="0 0 120 120" aria-hidden="true"><defs><radialGradient id="ltMoonG" cx="38%" cy="35%" r="70%"><stop offset="0" stop-color="#FFFDF0"/><stop offset=".6" stop-color="#F6E7B4"/><stop offset="1" stop-color="#E2C877"/></radialGradient><mask id="ltMoonM"><rect width="120" height="120" fill="#fff"/><circle cx="82" cy="46" r="40" fill="#000"/></mask></defs><circle cx="52" cy="62" r="42" fill="url(#ltMoonG)" mask="url(#ltMoonM)"/><circle cx="34" cy="70" r="4" fill="#D9BE6C" opacity=".45"/><circle cx="44" cy="88" r="3" fill="#D9BE6C" opacity=".4"/><circle cx="28" cy="52" r="2.5" fill="#D9BE6C" opacity=".4"/></svg>',
    lotus: '<svg viewBox="0 0 160 90" aria-hidden="true" fill="currentColor"><path d="M80 8c10 16 14 32 0 62-14-30-10-46 0-62z"/><path d="M52 22c14 8 24 24 28 48-22-8-34-24-28-48z" opacity=".85"/><path d="M108 22c-14 8-24 24-28 48 22-8 34-24 28-48z" opacity=".85"/><path d="M26 40c16 2 34 14 54 30-24 4-44-4-54-30z" opacity=".7"/><path d="M134 40c-16 2-34 14-54 30 24 4 44-4 54-30z" opacity=".7"/><path d="M10 62c20-2 42 2 70 10-26 10-52 8-70-10z" opacity=".55"/><path d="M150 62c-20-2-42 2-70 10 26 10 52 8 70-10z" opacity=".55"/></svg>',
    dhak: '<svg viewBox="0 0 120 70" aria-hidden="true" fill="currentColor"><path d="M14 14c14-8 78-8 92 0 6 10 6 32 0 42-14 8-78 8-92 0-6-10-6-32 0-42zm6 6c-3 8-3 22 0 30 12 5 68 5 80 0 3-8 3-22 0-30-12-5-68-5-80 0z" fill-rule="evenodd"/><path d="M26 14l8 42M44 12l6 46M62 12v46M80 12l-6 46M98 14l-8 42" stroke="currentColor" stroke-width="2.5" fill="none" opacity=".7"/><circle cx="6" cy="35" r="4"/><circle cx="114" cy="35" r="4"/></svg>',
    lantern: '<svg viewBox="0 0 60 120" aria-hidden="true"><defs><linearGradient id="ltLanG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD166"/><stop offset=".5" stop-color="#FF9933"/><stop offset="1" stop-color="#C2410C"/></linearGradient></defs><line x1="30" y1="0" x2="30" y2="26" stroke="#D4AF37" stroke-width="2"/><rect x="20" y="24" width="20" height="6" rx="2" fill="#D4AF37"/><path d="M18 32h24c8 10 8 40 0 58H18c-8-18-8-48 0-58z" fill="url(#ltLanG)" stroke="#D4AF37" stroke-width="1.5"/><path d="M30 32v58M22 34c-6 18-6 38 0 54M38 34c6 18 6 38 0 54" stroke="#671E32" stroke-width="1.2" fill="none" opacity=".55"/><rect x="20" y="90" width="20" height="6" rx="2" fill="#D4AF37"/><path d="M30 96v10m-5 0h10" stroke="#D4AF37" stroke-width="2.5"/><circle cx="30" cy="110" r="3.5" fill="#FFD166"/></svg>',
    diya: '<svg viewBox="0 0 64 44" aria-hidden="true"><defs><linearGradient id="ltDiyaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4A261"/><stop offset="1" stop-color="#9A3412"/></linearGradient></defs><path d="M4 22c4 14 16 20 28 20s24-6 28-20c-18 6-38 6-56 0z" fill="url(#ltDiyaG)" stroke="#D4AF37" stroke-width="1.2"/><path d="M12 28c14 5 26 5 40 0" stroke="#FFD166" stroke-width="1.2" fill="none" opacity=".8"/><g class="lt-flame"><path d="M32 3c5 7 6 11 0 17-6-6-5-10 0-17z" fill="#FFB020"/><path d="M32 9c2.5 3.5 3 6 0 9-3-3-2.5-5.5 0-9z" fill="#FFF3B0"/></g></svg>',
    rangoli: '<svg viewBox="0 0 200 200" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="100" cy="100" r="92" stroke-dasharray="2 8" stroke-linecap="round"/><circle cx="100" cy="100" r="70"/><g id="ltPetal"><path d="M100 30c14 18 14 36 0 52-14-16-14-34 0-52z"/></g><use href="#ltPetal" transform="rotate(45 100 100)"/><use href="#ltPetal" transform="rotate(90 100 100)"/><use href="#ltPetal" transform="rotate(135 100 100)"/><use href="#ltPetal" transform="rotate(180 100 100)"/><use href="#ltPetal" transform="rotate(225 100 100)"/><use href="#ltPetal" transform="rotate(270 100 100)"/><use href="#ltPetal" transform="rotate(315 100 100)"/><circle cx="100" cy="100" r="34"/><circle cx="100" cy="100" r="14" fill="currentColor" opacity=".5"/><path d="M100 64l10 36-10 36-10-36z" opacity=".7"/><path d="M64 100l36-10 36 10-36 10z" opacity=".7"/></svg>'
  };

  function el(cls, html) { var d = document.createElement('div'); d.className = cls; if (html) d.innerHTML = html; return d; }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function isSmall() { return global.matchMedia && global.matchMedia('(max-width: 768px)').matches; }
  function reduced() { return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  function sky(time) {
    var wrap = el('lt-sky lt-' + time);
    if (time === 'day') {
      wrap.appendChild(el('lt-sun'));
    } else {
      wrap.appendChild(el('lt-moon', SVG.moon));
      var n = isSmall() ? LT.config.particles.starsMobile : LT.config.particles.stars;
      for (var i = 0; i < n; i++) {
        var s = document.createElement('i'); s.className = 'lt-star';
        s.style.cssText = 'left:' + rnd(1, 99).toFixed(1) + '%;top:' + rnd(1, 62).toFixed(1) + '%;--s:' + rnd(1.4, 3.2).toFixed(1) + 'px;--d:' + rnd(2.5, 6).toFixed(1) + 's;--w:' + rnd(0, 6).toFixed(1) + 's';
        wrap.appendChild(s);
      }
    }
    return wrap;
  }

  function ornaments(festival, time) {
    var wrap = el('lt-orn lt-orn-' + festival);
    if (festival === 'durga-puja') {
      wrap.appendChild(el('lt-alpana'));
      wrap.appendChild(el('lt-lotus lt-lotus-l', SVG.lotus));
      wrap.appendChild(el('lt-lotus lt-lotus-r', SVG.lotus));
      wrap.appendChild(el('lt-dhak', SVG.dhak));
    } else if (festival === 'diwali') {
      wrap.appendChild(el('lt-lantern lt-lantern-l', SVG.lantern));
      wrap.appendChild(el('lt-lantern lt-lantern-r', SVG.lantern));
      wrap.appendChild(el('lt-rangoli lt-rangoli-a', SVG.rangoli));
      wrap.appendChild(el('lt-rangoli lt-rangoli-b', SVG.rangoli));
      var row = el('lt-diyas');
      for (var i = 0; i < (isSmall() ? 3 : 5); i++) row.appendChild(el('lt-diya', SVG.diya));
      wrap.appendChild(row);
      if (time === 'night' && !reduced() && !isSmall()) { wrap.appendChild(el('lt-burst lt-burst-a')); wrap.appendChild(el('lt-burst lt-burst-b')); }
    }
    return wrap;
  }

  function particles(festival, time) {
    var wrap = el('lt-particles lt-pt-' + festival);
    if (reduced()) return wrap;                       // no motion → no particles
    var n = isSmall() ? LT.config.particles.mobile : LT.config.particles.desktop;
    for (var i = 0; i < n; i++) {
      var p = document.createElement('i');
      p.className = 'lt-p' + (i % 5 === 0 ? ' lt-p-gold' : '');
      p.style.cssText = 'left:' + rnd(0, 100).toFixed(1) + '%;--sz:' + rnd(5, 11).toFixed(1) + 'px;--dur:' + rnd(14, 28).toFixed(1) + 's;--del:-' + rnd(0, 28).toFixed(1) + 's;--sway:' + rnd(-40, 40).toFixed(0) + 'px';
      wrap.appendChild(p);
    }
    return wrap;
  }

  function build(state) {
    var f = document.createDocumentFragment();
    f.appendChild(sky(state.time));
    f.appendChild(ornaments(state.festival, state.time));
    f.appendChild(particles(state.festival, state.time));
    return f;
  }

  function mount(id, z) {
    var n = document.createElement('div');
    n.id = id; n.setAttribute('aria-hidden', 'true');
    /* Mounted on <html>, not <body>: body uses CSS perspective, which would make
       position:fixed children scroll with the page. */
    document.documentElement.appendChild(n);
    return n;
  }

  function swapIn(container, build, keepMs) {
    var old = Array.prototype.slice.call(container.children);
    var layer = el('lt-layer lt-in');
    layer.appendChild(build());
    container.appendChild(layer);
    requestAnimationFrame(function () { requestAnimationFrame(function () { layer.classList.remove('lt-in'); }); });
    old.forEach(function (o) { o.classList.add('lt-out'); });
    setTimeout(function () { old.forEach(function (o) { if (o.parentNode) o.parentNode.removeChild(o); }); }, keepMs);
  }

  /* Cross-fade: old layer fades out while the new one fades in. */
  function render(state) {
    if (!document.body) return;
    if (!state || !state.festival || state.calm) { remove(); return; }
    if (!fx) fx = mount('lt-fx');
    if (!top) top = mount('lt-top');
    swapIn(fx, function () { return build(state); }, 1300);
    swapIn(top, function () { return el('lt-strip lt-strip-' + state.festival); }, 1300);
  }

  function remove() {
    [fx, top].forEach(function (n) { if (n && n.parentNode) n.parentNode.removeChild(n); });
    fx = top = null;
  }

  LT.effects = { render: render, remove: remove };
})(window);
