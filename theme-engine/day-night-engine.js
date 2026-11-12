/* Learnio Theme Engine — DAY / NIGHT DETECTION (independent of festivals) */
(function (global) {
  'use strict';
  var LT = global.LearnioTheme;

  function detectTime(date) {
    var c = LT.config, h = date.getHours();
    return (h >= c.dayStartHour && h < c.nightStartHour) ? 'day' : 'night';
  }

  /* mode: 'auto' | 'day' | 'night' → resolved 'day' | 'night' */
  function resolve(mode, date) {
    return (mode === 'day' || mode === 'night') ? mode : detectTime(date);
  }

  function msUntilBoundary(date) {
    var c = LT.config, t = [c.dayStartHour, c.nightStartHour], best = Infinity;
    t.forEach(function (h) {
      var n = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, 0, 1);
      if (n <= date) n.setDate(n.getDate() + 1);
      best = Math.min(best, n - date);
    });
    return best;
  }

  function getMode() {
    try { var m = localStorage.getItem(LT.config.storageKey); if (m === 'day' || m === 'night' || m === 'auto') return m; }
    catch (e) { /* storage blocked → stay automatic */ }
    return LT.config.defaultMode;
  }
  function setMode(m) {
    try { localStorage.setItem(LT.config.storageKey, m); } catch (e) {}
  }

  LT.dayNight = { detect: detectTime, resolve: resolve, msUntilBoundary: msUntilBoundary, getMode: getMode, setMode: setMode };
})(window);
