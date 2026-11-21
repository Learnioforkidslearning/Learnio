Learnio Theme Engine
Year-round calendar (all dates configurable in theme-config.js; each has Day (sun) and Night (moon & stars) modes):
Dates	Theme
1 Jan	New Year
2–22 Jan, 24–25 Jan, 27 Jan–Feb	Winter
23 Jan	Netaji Jayanti
26 Jan	Republic Day
March	Holi
April	Eid
May	original look (no theme)
Jun–Jul	Rath Yatra
August	Independence Day (13–15 Aug extra emphasis)
Sep–Oct	Durga Puja
November	Diwali
December	Christmas
Holi and Eid move every year: pin exact dates with a year-specific entry (see the commented example in theme-config.js). Outside these windows nothing is applied.
Outside the configured dates nothing is applied — the site keeps its original look.
Add it to a page (one line, inside <head>, after the page's own CSS)
    <script src="theme-engine/theme-loader.js"></script>        <!-- root pages -->
    <script src="../theme-engine/theme-loader.js"></script>     <!-- /fun/ -->
    <script src="../../../../theme-engine/theme-loader.js"></script>  <!-- /fun/assets/games/<game>/ -->

Already added to: index, alphabet, dashboard, signup, fun/index and the four games.
STILL TO ADD (files weren't in the upload): login.html, math.html, science.html, drawing.html, admin.html, and any other page.
Files
theme-config.js        festival calendar, day/night hours, storage key, particle counts
festival-engine.js     detectFestival(date)
day-night-engine.js    day/night detection + manual override storage
theme-controller.js    combines both, sets <html data-festival data-time>, timers, settings button
theme-art.js           hand-built SVG artwork: Durga murti, Rath + Jagannath/Balabhadra/Subhadra, Indian flag
theme-people.js        cartoon people generator (dhuti/panjabi, saree, students, kids, dhak players) + banner scenes + side crowds
theme-effects.js       the single click-through decoration layer (+ places the artwork)
theme-scenes.js        banner scenes + side crowds for Christmas, New Year, Winter, Holi, Eid, Netaji Jayanti, Republic Day
themes/                theme-base.css, day-mode.css, night-mode.css (always loaded) + one stylesheet per festival, loaded ON DEMAND
(only the active festival's CSS is fetched): winter, new-year, netaji-jayanti, republic-day, holi, eid,
rath-yatra, independence-day, durga-puja, diwali, christmas
Festival artwork & people
Durga Puja: Maa Durga murti on a stage, dhak players (dhuti, white panjabi, gamchha), women in red-bordered white sarees, kids.
Independence Day: the National Flag (exact 3:2, 24-spoke chakra) on a pole in the background; students saluting, kids with flags, elders and families below.
Rath Yatra: the ratha with Balabhadra, Subhadra and Jagannath; devotees pulling the rope, others with folded hands.
Home (and Fun) page: wide banner scene above the hero. All non-game pages on screens >1000px: side crowds fill the background gutters.
Decorative only: aria-hidden, click-through, hidden when printing, absent on game pages. Change people/outfits/poses in theme-people.js
(person({kind:'woman'|'man'|'boy'|'girl'|'student'|'studentG', pose, top, skin, dhak, topi, elder...})).
Behaviour
<html data-festival="durga-puja|diwali" data-time="day|night"> drives everything via CSS variables.
Auto-updates at 06:00 / 18:00 local time and at midnight (festival change) — no reload.
Settings button (always visible on normal pages, so any festival can be picked any time of year):
Festival:   Automatic (by date) · every festival above · Original look   (localStorage "learnio.themeFestival")
Day/Night:  Automatic · Always Day · Always Night                                                       (localStorage "learnio.themeMode", unchanged)
13–15 Aug: <html data-emphasis="true"> gives Independence Day a slightly bolder ribbon + chakra.
Smoothness: decorative motion pauses while the user taps/scrolls/types (html.lt-busy); the glass blur, 3D-Z hover and 2s button
colour fade are replaced by cheaper equivalents on festival pages only.
Game pages (/assets/games/) run in "calm" mode: colour ribbon only, no effects, no restyling.
prefers-reduced-motion: all animation and particles are off.
Adding / changing festivals (theme-config.js)
Add `{ id, start:'MM-DD', end:'MM-DD', year?:2027, priority?, regions? }` and a themes/<id>.css,
then add the id to `availableThemes` and to the loader's css list. Year-specific entries win over recurring ones.
QA without waiting for the calendar
    index.html?theme-date=2026-10-12&theme-time=night
    index.html?theme-date=2026-11-06&theme-mode=day
    index.html?theme-festival=rath-yatra&theme-time=night
    (console)  LearnioTheme.preview({date:'2026-09-20', time:'night'})