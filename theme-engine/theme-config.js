/* ==========================================================================
   Learnio Theme Engine — CONFIG
   Single place to edit festival dates, day/night hours and storage keys.
   Plain browser script (no modules) so it works on every existing page.
   ========================================================================== */
(function (global) {
  'use strict';

  var LT = global.LearnioTheme = global.LearnioTheme || {};

  LT.config = {
    storageKey: 'learnio.themeMode',          // 'auto' | 'day' | 'night'
    defaultMode: 'auto',

    /* Day / night boundaries in the user's LOCAL time (24h clock).
       Day = [dayStartHour, nightStartHour)  → 06:00–17:59 */
    dayStartHour: 6,
    nightStartHour: 18,

    /* Outside a festival window the website keeps its ORIGINAL look,
       so day/night styling is not applied either. Set true to let the
       day/night engine run year-round in the future. */
    dayNightOutsideFestival: false,

    /* Festival calendar.
       - Recurring windows use "MM-DD" and repeat every year.
       - Add `year: 2027` to pin a window to one year (exact lunar dates,
         e.g. real Diwali / Durga Puja days). Year-specific windows win
         over recurring ones.
       - `regions` is reserved for regional variants (e.g. ['IN-WB']);
         an empty list means "everyone".
       - Later entries win when windows overlap and priority is equal. */
    festivals: [
      { id: 'durga-puja', name: 'Durga Puja', start: '09-01', end: '10-31', priority: 1, regions: [] },
      { id: 'diwali',     name: 'Diwali',     start: '11-01', end: '11-30', priority: 1, regions: [] }
      /* Examples for later:
      { id: 'diwali', start: '11-08', end: '11-14', year: 2026, priority: 5 },
      { id: 'holi',   start: '03-01', end: '03-14', priority: 1 }                */
    ],

    /* Festivals that actually have CSS in /themes. Unknown ids are ignored
       (site simply keeps its default look) so the calendar can grow safely. */
    availableThemes: ['durga-puja', 'diwali'],

    /* Decorative particles (kept tiny for mobile performance). */
    particles: { desktop: 22, mobile: 12, stars: 38, starsMobile: 20 },

    /* Pages whose body is a game/canvas: engine runs in "calm" mode there
       (colours + thin ribbon only, no floating effects) so gameplay,
       webcam/canvas and timing are never touched. */
    calmPathPattern: '/assets/games/',

    /* Query-string hooks for QA, e.g. ?theme-date=2026-10-12&theme-time=night
       They are session-only and never written to storage. */
    allowPreviewParams: true
  };
})(window);
