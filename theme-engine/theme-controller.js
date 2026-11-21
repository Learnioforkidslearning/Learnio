/* Learnio Theme Engine — CONTROLLER
   theme = combine(detectFestival(date), resolveDayNight(mode, date))
   Applies it with data attributes on <html>, then re-evaluates on timers,
   tab focus and cross-tab storage changes. No reloads, no page state touched. */
(function (global) {
  'use strict';
  var LT = global.LearnioTheme, doc = document, root = doc.documentElement;
  var timer = null, current = {}, preview = {}, widget = null, transTimer = null, loadedCss = {};

  /* Festival stylesheets load on demand: only the active festival's CSS is ever fetched. */
  function cssHref(id) { return (LT.base || '') + 'themes/' + id + '.css'; }
  function ensureCss(id, cb) {
    if (!id || loadedCss[id]) { if (cb) cb(); return; }
    var l = doc.createElement('link'); l.rel = 'stylesheet'; l.href = cssHref(id);
    l.onload = l.onerror = function () { loadedCss[id] = true; if (cb) cb(); };
    doc.head.appendChild(l);
  }

  /* ---------- helpers ---------- */
  function readPreview() {
    if (!LT.config.allowPreviewParams) return;
    try {
      var q = new URLSearchParams(global.location.search);
      var d = q.get('theme-date'), t = q.get('theme-time'), m = q.get('theme-mode'), fe = q.get('theme-festival');
      if (d && /^\d{4}-\d{2}-\d{2}$/.test(d)) { var p = d.split('-'); preview.date = new Date(+p[0], +p[1] - 1, +p[2], 12, 0, 0); }
      if (t === 'day' || t === 'night') preview.time = t;
      if (m === 'day' || m === 'night' || m === 'auto') preview.mode = m;
      if (fe && (fe === 'none' || LT.config.availableThemes.indexOf(fe) > -1)) preview.festival = fe;
    } catch (e) {}
  }
  function now() {
    var n = new Date();
    if (preview.date) { n = new Date(preview.date.getFullYear(), preview.date.getMonth(), preview.date.getDate(), n.getHours(), n.getMinutes()); }
    return n;
  }
  function isCalm() { return global.location.pathname.indexOf(LT.config.calmPathPattern) > -1; }

  function compute() {
    var n = now(), mode = preview.mode || LT.dayNight.getMode();
    var fpref = preview.festival || LT.festival.getPref();
    var festival = fpref === 'none' ? null : (fpref !== 'auto' ? fpref : LT.festival.detect(n));
    var time = preview.time || LT.dayNight.resolve(mode, n);
    return { festival: festival, fpref: fpref, time: time, mode: mode, calm: isCalm(), emphasis: !!festival && LT.festival.emphasis(n, festival) };
  }

  /* ---------- apply ---------- */
  function apply(state, animate) {
    var active = !!state.festival;
    if (!active && !LT.config.dayNightOutsideFestival) { state.time = null; }
    var changed = state.festival !== current.festival || state.time !== current.time || state.calm !== current.calm;

    if (animate && changed && current.hasOwnProperty('festival')) {
      root.classList.add('lt-transitioning');
      clearTimeout(transTimer);
      transTimer = setTimeout(function () { root.classList.remove('lt-transitioning'); }, 1400);
    }
    function set(a, v) { if (v) root.setAttribute(a, v); else root.removeAttribute(a); }
    set('data-festival', state.festival);
    set('data-time', active || LT.config.dayNightOutsideFestival ? state.time : null);
    set('data-theme-mode', active ? state.mode : null);
    set('data-calm', state.calm && active ? 'true' : null);
    set('data-emphasis', active && state.emphasis ? 'true' : null);
    var meta = doc.querySelector('meta[name="theme-color"]');
    if (active) { var c = global.getComputedStyle(root).getPropertyValue('--lt-bar').trim(); if (c && meta) meta.setAttribute('content', c); }

    if (changed) {
      if (LT.effects) LT.effects.render(active ? state : null);
      current = { festival: state.festival, time: state.time, calm: state.calm };
      updateWidget(state);
      try { doc.dispatchEvent(new CustomEvent('learnio:themechange', { detail: { festival: state.festival, time: state.time, mode: state.mode } })); } catch (e) {}
    } else { updateWidget(state); }
    return state;
  }

  function refresh(animate) {
    var s = compute();
    if (s.festival && !loadedCss[s.festival]) { ensureCss(s.festival, function () { apply(compute(), animate !== false); }); return s; }
    return apply(s, animate !== false);
  }

  /* ---------- scheduling ---------- */
  function schedule() {
    clearTimeout(timer);
    var n = now();
    var ms = Math.min(LT.dayNight.msUntilBoundary(n), LT.festival.msUntilNextDay(n), 15 * 60 * 1000);
    timer = setTimeout(function () { refresh(true); schedule(); }, Math.max(1000, ms));
  }

  /* ---------- lazy script fonts (Bengali / Devanagari) ---------- */
  var loadedFonts = {};
  function syncScript() {
    var lang = (root.getAttribute('lang') || '').toLowerCase().slice(0, 2);
    var kind = lang === 'bn' ? 'bengali' : lang === 'hi' ? 'devanagari' : null;
    if (kind) root.setAttribute('data-script', kind); else root.removeAttribute('data-script');
    if (kind && !loadedFonts[kind] && root.hasAttribute('data-festival')) {
      loadedFonts[kind] = true;
      var l = doc.createElement('link'); l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=' + (kind === 'bengali' ? 'Noto+Sans+Bengali:wght@400;600;700' : 'Noto+Sans+Devanagari:wght@400;600;700') + '&display=swap';
      doc.head.appendChild(l);
    }
  }

  /* ---------- settings widget (Automatic / Always Day / Always Night) ---------- */
  var MODES = [
    { v: 'auto',  label: 'Automatic',    icon: '🌗' },
    { v: 'day',   label: 'Always Day',   icon: '☀️' },
    { v: 'night', label: 'Always Night', icon: '🌙' }
  ];
  function festivalChoices() {
    var out = [{ v: 'auto', label: 'Automatic (by date)', icon: '📅' }];
    LT.festival.list().forEach(function (f) { out.push({ v: f.id, label: f.name, icon: f.icon || '🎉' }); });
    out.push({ v: 'none', label: 'Original look', icon: '🌈' });
    return out;
  }
  function radios(attr, items) {
    return items.map(function (m) { return '<button type="button" role="radio" aria-checked="false" ' + attr + '="' + m.v + '"><span class="lt-ico" aria-hidden="true">' + m.icon + '</span><span>' + m.label + '</span></button>'; }).join('');
  }
  function buildWidget() {
    if (widget || !doc.body) return;
    widget = doc.createElement('div');
    widget.id = 'lt-settings';
    widget.innerHTML =
      '<button type="button" class="lt-set-btn" aria-haspopup="true" aria-expanded="false" aria-controls="lt-set-menu" aria-label="Theme settings"><span class="lt-set-ico" aria-hidden="true">🌗</span></button>' +
      '<div id="lt-set-menu" class="lt-set-menu" hidden>' +
        '<div role="radiogroup" aria-labelledby="lt-t-fest"><p class="lt-set-title" id="lt-t-fest">Festival</p><div class="lt-fest-grid">' + radios('data-fest', festivalChoices()) + '</div></div>' +
        '<div role="radiogroup" aria-labelledby="lt-t-mode"><p class="lt-set-title" id="lt-t-mode">Day / Night</p>' + radios('data-mode', MODES) + '</div>' +
      '</div>';
    root.appendChild(widget);
    var btn = widget.querySelector('.lt-set-btn'), menu = widget.querySelector('.lt-set-menu');
    function toggle(open) { btn.setAttribute('aria-expanded', open ? 'true' : 'false'); if (open) menu.removeAttribute('hidden'); else menu.setAttribute('hidden', ''); }
    btn.addEventListener('click', function (e) { e.stopPropagation(); toggle(menu.hasAttribute('hidden')); });
    menu.addEventListener('click', function (e) {
      var b = e.target.closest('[data-mode],[data-fest]'); if (!b) return;
      if (b.hasAttribute('data-fest')) { LT.festival.setPref(b.getAttribute('data-fest')); preview.festival = null; }
      else { LT.dayNight.setMode(b.getAttribute('data-mode')); preview.mode = null; }
      refresh(true); schedule();                       // menu stays open so festival + day/night can both be picked
    });
    doc.addEventListener('click', function (e) { if (!widget.contains(e.target)) toggle(false); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hasAttribute('hidden')) { toggle(false); btn.focus(); } });
  }

  /* Never sit on top of existing floating UI (AI tutor button, Maira, etc.):
     nudge upward until no other fixed, clickable element is under the button. */
  var avoidTimer = null;
  function avoidFixed() {
    if (!widget || widget.style.display === 'none') return;
    var btn = widget.querySelector('.lt-set-btn'), bottom = 104, tries = 0;
    widget.style.bottom = bottom + 'px';
    function blocked() {
      var r = btn.getBoundingClientRect(), hit = false;
      [[.5,.5],[.1,.1],[.9,.1],[.1,.9],[.9,.9]].forEach(function (p) {
        doc.elementsFromPoint(r.left + r.width * p[0], r.top + r.height * p[1]).forEach(function (e) {
          if (widget.contains(e) || e === root || e === doc.body) return;
          if (global.getComputedStyle(e).position === 'fixed') hit = true;
        });
      });
      return hit;
    }
    while (blocked() && tries++ < 8) { bottom += 64; widget.style.bottom = bottom + 'px'; }
  }
  function scheduleAvoid() { clearTimeout(avoidTimer); avoidTimer = setTimeout(avoidFixed, 250); }

  /* Hide the button while the AI tutor window is open (it must stay fully usable). */
  function watchTutor() {
    var w = doc.getElementById('aiWindow');
    if (!w) return false;
    function sync() { if (widget) widget.style.visibility = global.getComputedStyle(w).display === 'none' ? '' : 'hidden'; }
    new MutationObserver(sync).observe(w, { attributes: true, attributeFilter: ['style', 'class'] });
    sync(); return true;
  }

  function updateWidget(state) {
    if (!widget) return;
    var show = !state.calm;
    widget.style.display = show ? '' : 'none';
    if (show) scheduleAvoid();
    widget.querySelectorAll('[data-mode]').forEach(function (b) { b.setAttribute('aria-checked', b.getAttribute('data-mode') === state.mode ? 'true' : 'false'); });
    widget.querySelectorAll('[data-fest]').forEach(function (b) { b.setAttribute('aria-checked', b.getAttribute('data-fest') === state.fpref ? 'true' : 'false'); });
    var ico = widget.querySelector('.lt-set-ico');
    if (ico) ico.textContent = (MODES.filter(function (x) { return x.v === state.mode; })[0] || MODES[0]).icon;
  }

  /* ---------- init ---------- */
  function init() {
    readPreview();
    buildWidget();
    refresh(false);
    syncScript();
    schedule();
    new MutationObserver(syncScript).observe(root, { attributes: true, attributeFilter: ['lang'] });
    global.addEventListener('resize', scheduleAvoid);
    global.addEventListener('load', function () { scheduleAvoid(); setTimeout(scheduleAvoid, 1500); });
    if (!watchTutor()) { var tries = 0, iv = setInterval(function () { if (watchTutor() || ++tries > 20) clearInterval(iv); }, 500); }
    doc.addEventListener('visibilitychange', function () { if (!doc.hidden) { refresh(true); schedule(); } });
    global.addEventListener('focus', function () { refresh(true); schedule(); });
    global.addEventListener('storage', function (e) { if (e.key === LT.config.storageKey || e.key === LT.config.festivalStorageKey) refresh(true); });
    /* Smoothness: freeze decorative animation while the user is tapping / scrolling / typing,
       resume 700ms after they stop, so buttons and the chat panel always get the full frame budget. */
    var idle = null, busy = false;
    function setBusy() {
      if (!busy) { busy = true; root.classList.add('lt-busy'); }
      clearTimeout(idle); idle = setTimeout(function () { busy = false; root.classList.remove('lt-busy'); }, 700);
    }
    ['pointerdown', 'touchstart', 'keydown', 'wheel'].forEach(function (ev) { global.addEventListener(ev, setBusy, { passive: true, capture: true }); });
    global.addEventListener('scroll', setBusy, { passive: true, capture: true });
  }

  LT.refresh = refresh;
  LT.setMode = function (m) { LT.dayNight.setMode(m); refresh(true); schedule(); };
  LT.setFestival = function (f) { LT.festival.setPref(f); preview.festival = null; refresh(true); schedule(); };
  LT.preview = function (o) { preview = o || {}; if (preview.date && !(preview.date instanceof Date)) preview.date = new Date(preview.date); refresh(true); schedule(); return current; };
  LT.state = function () { return compute(); };

  /* first paint: set attributes immediately (before DOM is ready) to avoid a flash */
  readPreview();
  (function early() {
    var s = compute(); if (!s.festival) return;
    /* while the <head> is still parsing, write the festival stylesheet synchronously: it blocks first paint, so there is no flash */
    if (doc.readyState !== 'loading') return;
    doc.write('<link rel="stylesheet" href="' + cssHref(s.festival) + '">'); loadedCss[s.festival] = true;
    root.setAttribute('data-festival', s.festival); root.setAttribute('data-time', s.time); root.setAttribute('data-theme-mode', s.mode); if (s.calm) root.setAttribute('data-calm', 'true');
  })();

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})(window);
