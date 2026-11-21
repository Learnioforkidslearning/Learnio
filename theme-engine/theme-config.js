/* ==========================================================================
   Learnio Theme Engine — CONFIG
   Single place to edit festival dates, day/night hours and storage keys.
   Plain browser script (no modules) so it works on every existing page.
   ========================================================================== */
(function (global) {
  'use strict';

  var LT = global.LearnioTheme = global.LearnioTheme || {};

  LT.config = {
    storageKey: 'learnio.themeMode',          // 'auto' | 'day' | 'night'   (unchanged)
    defaultMode: 'auto',
    festivalStorageKey: 'learnio.themeFestival', // 'auto' | 'none' | <festival id>  (manual festival choice)
    defaultFestival: 'auto',

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
      /* Lowest priority first: Winter is the Jan–Feb backdrop; one-day festivals (priority 5) override it. */
      { id: 'winter',           name: 'Winter',           icon: '❄️', start: '01-01', end: '02-29', priority: 0, regions: [] },
      { id: 'new-year',         name: 'New Year',         icon: '🎆', start: '01-01', end: '01-01', priority: 5, regions: [] },   // use '12-31' as start for New Year's Eve too
      { id: 'netaji-jayanti',   name: 'Netaji Jayanti',   icon: '🎖️', start: '01-23', end: '01-23', priority: 5, regions: [] },
      { id: 'republic-day',     name: 'Republic Day',     icon: '🥁', start: '01-26', end: '01-26', priority: 5, regions: [] },
      { id: 'holi',             name: 'Holi',             icon: '🎨', start: '03-01', end: '03-31', priority: 1, regions: [] },   // exact Holi/Eid dates move yearly:
      { id: 'eid',              name: 'Eid',              icon: '🕌', start: '04-01', end: '04-30', priority: 1, regions: [] },   // add a year-specific entry to pin them
      { id: 'rath-yatra',       name: 'Rath Yatra',       icon: '🛕', start: '06-01', end: '07-31', priority: 1, regions: [] },
      { id: 'independence-day', name: 'Independence Day', icon: '☸️', start: '08-01', end: '08-31', priority: 1, regions: [],
        emphasis: { start: '08-13', end: '08-15' } },   // extra-festive days around 15 August
      { id: 'durga-puja', name: 'Durga Puja', icon: '🪷', start: '09-01', end: '10-31', priority: 1, regions: [] },
      { id: 'diwali',     name: 'Diwali',     icon: '🪔', start: '11-01', end: '11-30', priority: 1, regions: [] },
      { id: 'christmas',  name: 'Christmas',  icon: '🎄', start: '12-01', end: '12-31', priority: 1, regions: [] }
      /* Examples for later:
      { id: 'holi', start: '03-14', end: '03-15', year: 2027, priority: 5 }      // year-specific entries win over recurring ones
      { id: 'eid',  start: '03-10', end: '03-12', year: 2027, priority: 5 }                                                  */
    ],

    /* Festivals that actually have CSS in /themes. Unknown ids are ignored
       (site simply keeps its default look) so the calendar can grow safely. */
    availableThemes: ['winter', 'new-year', 'netaji-jayanti', 'republic-day', 'holi', 'eid', 'rath-yatra', 'independence-day', 'durga-puja', 'diwali', 'christmas'],

    /* Decorative particles (kept tiny for mobile performance). */
    particles: { desktop: 10, mobile: 6, stars: 26, starsMobile: 12 },   // kept small: smoother on phones

    /* Pages whose body is a game/canvas: engine runs in "calm" mode there
       (colours + thin ribbon only, no floating effects) so gameplay,
       webcam/canvas and timing are never touched. */
    calmPathPattern: '/assets/games/',

    /* Query-string hooks for QA, e.g. ?theme-date=2026-10-12&theme-time=night
       They are session-only and never written to storage. */
    allowPreviewParams: true
  };
})(window);
