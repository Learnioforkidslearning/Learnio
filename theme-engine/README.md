# Learnio Theme Engine

Durga Puja (Sep–Oct) and Diwali (Nov), each with automatic Day (sun) / Night (moon + stars) modes.
Outside the configured dates nothing is applied — the site keeps its original look.

## Add it to a page (one line, inside <head>, after the page's own CSS)
    <script src="theme-engine/theme-loader.js"></script>        <!-- root pages -->
    <script src="../theme-engine/theme-loader.js"></script>     <!-- /fun/ -->
    <script src="../../../../theme-engine/theme-loader.js"></script>  <!-- /fun/assets/games/<game>/ -->

Already added to: index, alphabet, dashboard, signup, fun/index and the four games.
STILL TO ADD (files weren't in the upload): login.html, math.html, science.html, drawing.html, admin.html, and any other page.

## Files
- theme-config.js        festival calendar, day/night hours, storage key, particle counts
- festival-engine.js     detectFestival(date)
- day-night-engine.js    day/night detection + manual override storage
- theme-controller.js    combines both, sets <html data-festival data-time>, timers, settings button
- theme-effects.js       the single click-through decoration layer
- themes/                theme-base.css, durga-puja.css, diwali.css, day-mode.css, night-mode.css

## Behaviour
- <html data-festival="durga-puja|diwali" data-time="day|night"> drives everything via CSS variables.
- Auto-updates at 06:00 / 18:00 local time and at midnight (festival change) — no reload.
- Override: floating button → Automatic / Always Day / Always Night (localStorage "learnio.themeMode").
- Game pages (/assets/games/) run in "calm" mode: colour ribbon only, no effects, no restyling.
- prefers-reduced-motion: all animation and particles are off.

## Adding / changing festivals (theme-config.js)
Add `{ id, start:'MM-DD', end:'MM-DD', year?:2027, priority?, regions? }` and a themes/<id>.css,
then add the id to `availableThemes` and to the loader's css list. Year-specific entries win over recurring ones.

## QA without waiting for the calendar
    index.html?theme-date=2026-10-12&theme-time=night
    index.html?theme-date=2026-11-06&theme-mode=day
    (console)  LearnioTheme.preview({date:'2026-09-20', time:'night'})
