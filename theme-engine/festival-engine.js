/* Learnio Theme Engine — FESTIVAL DETECTION
   detectFestival(date) → festival id | null  (pure function, no DOM) */
(function (global) {
  'use strict';
  var LT = global.LearnioTheme;

  function mmdd(d) { return ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }

  function inWindow(key, start, end) {
    // supports windows that wrap the new year (e.g. 12-20 → 01-05)
    return start <= end ? (key >= start && key <= end) : (key >= start || key <= end);
  }

  function detectFestival(date, region) {
    var cfg = LT.config, key = mmdd(date), year = date.getFullYear(), best = null;
    cfg.festivals.forEach(function (f, i) {
      if (f.year && f.year !== year) return;
      if (f.regions && f.regions.length && (!region || f.regions.indexOf(region) < 0)) return;
      if (!inWindow(key, f.start, f.end)) return;
      var score = (f.year ? 1000 : 0) + (f.priority || 0) * 10 + i * 0.01;
      if (!best || score > best.score) best = { id: f.id, score: score };
    });
    if (!best || cfg.availableThemes.indexOf(best.id) < 0) return null;
    return best.id;
  }

  /* Milliseconds until the festival could change (next local midnight). */
  function msUntilNextDay(now) {
    var n = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
    return n - now;
  }

  LT.festival = { detect: detectFestival, msUntilNextDay: msUntilNextDay };
})(window);
