/* Learnio Theme Engine — LOADER
   One tag per page, placed in <head> AFTER the page's own stylesheet(s):
       <script src="theme-engine/theme-loader.js"></script>
   (from /fun/ or a game use ../theme-engine/... or ../../../theme-engine/...)
   It resolves its own folder, writes the CSS + scripts in order, so every
   page picks up the engine with a single line and no flash of old theme. */
(function () {
  var s = document.currentScript; if (!s) return;
  var base = s.src.replace(/theme-loader\.js(\?.*)?$/, '');
  var css = ['theme-base.css', 'day-mode.css', 'night-mode.css']   /* festival stylesheets load on demand (only the active one) */;
  var js  = ['theme-config.js', 'festival-engine.js', 'day-night-engine.js', 'theme-art.js', 'theme-people.js', 'theme-scenes.js', 'theme-effects.js', 'theme-controller.js'];
  var out = ''; window.LearnioTheme = window.LearnioTheme || {}; window.LearnioTheme.base = base;
  css.forEach(function (f) { out += '<link rel="stylesheet" href="' + base + 'themes/' + f + '">'; });
  js.forEach(function (f)  { out += '<script src="' + base + f + '"><\/script>'; });
  if (document.readyState === 'loading') { document.write(out); }
  else { /* injected late: load sequentially */
    css.forEach(function (f) { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = base + 'themes/' + f; document.head.appendChild(l); });
    (function next(i) { if (i >= js.length) return; var e = document.createElement('script'); e.src = base + js[i]; e.onload = function () { next(i + 1); }; document.head.appendChild(e); })(0);
  }
})();
