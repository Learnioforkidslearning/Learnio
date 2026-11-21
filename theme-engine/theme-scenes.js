/* Learnio Theme Engine — SCENES for: Christmas, New Year, Winter, Holi, Eid, Netaji Jayanti, Republic Day
   Same flat-cartoon style as the other themes. Plugs into LT.art.banner / LT.art.crowd (falls back to the earlier scenes). */
(function (global) {
  'use strict';
  var LT = global.LearnioTheme, A = LT.art, H = A && A._h, person = A && A.person, n = A && A._n;
  if (!A || !H || !person) return;
  var sk = H.sk, oldBanner = A.banner, oldCrowd = A.crowd, Y = 392, CY = 512;
  var OPEN = function (w, h) { return '<svg class="lt-art-svg" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true" focusable="false">'; };
  function P(o, y) { return person(Object.assign({ y: y || Y }, o)); }

  /* ------------------------------------------------------------ shared drawing helpers */
  function snowGround(w, y) { return '<ellipse cx="' + w / 2 + '" cy="' + y + '" rx="' + w * 0.52 + '" ry="16" fill="#FFFFFF" stroke="#C9DDEE" stroke-width="1.2"/>'; }
  function lights(x1, y1, x2, y2, sag, count) {
    var cols = ['#E53935', '#FFC107', '#43A047', '#1E88E5'], mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + sag * 2, o = '<path d="M' + x1 + ' ' + y1 + 'Q' + mx + ' ' + my + ' ' + x2 + ' ' + y2 + '" stroke="#2c3e2c" stroke-width="1.6" fill="none"/>';
    for (var i = 0; i < count; i++) {
      var t = (i + 0.5) / count, x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2, y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2;
      o += '<ellipse cx="' + n(x) + '" cy="' + n(y + 6) + '" rx="4.5" ry="6" fill="' + cols[i % 4] + '" stroke="#222" stroke-width=".7"/><ellipse cx="' + n(x) + '" cy="' + n(y + 6) + '" rx="9" ry="11" fill="' + cols[i % 4] + '" opacity=".22"/>';
    }
    return o;
  }
  function gift(x, y, w, h, c1, c2) {
    return '<rect x="' + x + '" y="' + (y - h) + '" width="' + w + '" height="' + h + '" rx="3" fill="' + c1 + '" stroke="#3a1a1a" stroke-width="1.4"/><rect x="' + n(x + w / 2 - 4) + '" y="' + (y - h) + '" width="8" height="' + h + '" fill="' + c2 + '"/><rect x="' + x + '" y="' + n(y - h / 2 - 4) + '" width="' + w + '" height="8" fill="' + c2 + '"/><path d="M' + n(x + w / 2) + ' ' + (y - h) + 'q-14-14-16-2 8 6 16 2zM' + n(x + w / 2) + ' ' + (y - h) + 'q14-14 16-2-8 6-16 2z" fill="' + c2 + '" stroke="#3a1a1a" stroke-width="1"/>';
  }
  function snowman(x, y, s) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><ellipse cx="0" cy="2" rx="40" ry="6" fill="#000" opacity=".12"/><path d="M-34 -66L-70 -90M34 -66L70 -90" stroke="#6B4226" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="0" cy="-30" r="34" fill="#fff" stroke="#BFD6EA" stroke-width="1.6"/><circle cx="0" cy="-82" r="26" fill="#fff" stroke="#BFD6EA" stroke-width="1.6"/><circle cx="0" cy="-122" r="19" fill="#fff" stroke="#BFD6EA" stroke-width="1.6"/>' +
      '<circle cx="-6" cy="-126" r="2.4" fill="#222"/><circle cx="6" cy="-126" r="2.4" fill="#222"/><path d="M0 -121l17 4-17 3z" fill="#F28C28"/><path d="M-7 -114q7 5 14 0" stroke="#222" stroke-width="1.6" fill="none"/>' +
      '<circle cx="0" cy="-86" r="2.6" fill="#222"/><circle cx="0" cy="-74" r="2.6" fill="#222"/><circle cx="0" cy="-30" r="2.8" fill="#222"/><circle cx="0" cy="-18" r="2.8" fill="#222"/>' +
      '<rect x="-15" y="-150" width="30" height="24" rx="3" fill="#222"/><rect x="-22" y="-130" width="44" height="6" rx="3" fill="#222"/><rect x="-15" y="-136" width="30" height="5" fill="#C62828"/>' +
      '<path d="M-20 -104q20 10 40 0l0 8q-20 10-40 0z" fill="#C62828"/><path d="M14 -98l8 26-9 2z" fill="#C62828"/></g>';
  }
  function pine(x, base, h) {
    var w = h * 0.55, o = '<rect x="' + (x - 5) + '" y="' + (base - h * 0.14) + '" width="10" height="' + h * 0.14 + '" fill="#6B4226"/>';
    [[0.14, 1.0], [0.38, 0.78], [0.62, 0.56]].forEach(function (t) {
      var yb = base - h * t[0], yt = yb - h * 0.34, hw = w * t[1] / 2;
      o += '<path d="M' + x + ' ' + n(yt) + 'L' + n(x - hw) + ' ' + n(yb) + 'L' + n(x + hw) + ' ' + n(yb) + 'Z" fill="#1F6B45" stroke="#0E3D25" stroke-width="1.4"/><path d="M' + x + ' ' + n(yt) + 'L' + n(x - hw * 0.42) + ' ' + n(yt + h * 0.12) + 'Q' + x + ' ' + n(yt + h * 0.09) + ' ' + n(x + hw * 0.42) + ' ' + n(yt + h * 0.12) + 'Z" fill="#fff"/>';
    });
    return o;
  }
  function tree(cx, base, k) {
    var o = '<rect x="' + (cx - 16 * k) + '" y="' + (base - 42 * k) + '" width="' + 32 * k + '" height="' + 44 * k + '" fill="#7A4B22" stroke="#3b230f" stroke-width="1.6"/>';
    [[60, 160, 110], [110, 215, 150], [162, 278, 192], [222, 345, 234]].forEach(function (t) {
      var top = base - (390 - t[0]) * k * 0.86 - 10, bot = base - (390 - t[1]) * k * 0.86 - 10, w = t[2] * k;
      o += '<path d="M' + cx + ' ' + n(top) + 'L' + n(cx - w / 2) + ' ' + n(bot) + 'Q' + cx + ' ' + n(bot + 12 * k) + ' ' + n(cx + w / 2) + ' ' + n(bot) + 'Z" fill="#1B7A3A" stroke="#0E4D22" stroke-width="2"/>';
    });
    [[-28, 150, '#E53935'], [30, 188, '#FFC107'], [-58, 248, '#1E88E5'], [22, 262, '#E53935'], [68, 312, '#FFC107'], [-86, 318, '#E53935'], [-6, 214, '#FFC107'], [-32, 296, '#1E88E5'], [44, 236, '#E53935']].forEach(function (b) {
      o += '<circle cx="' + n(cx + b[0] * k) + '" cy="' + n(base - (390 - b[1]) * k * 0.86 - 10) + '" r="' + 9 * k + '" fill="' + b[2] + '" stroke="#5a1010" stroke-width="1.2"/><circle cx="' + n(cx + b[0] * k - 3) + '" cy="' + n(base - (390 - b[1]) * k * 0.86 - 13) + '" r="' + 2.2 * k + '" fill="#fff" opacity=".7"/>';
    });
    var ty = base - 330 * k * 0.86 - 22, r = 20 * k, st = '';
    for (var i = 0; i < 10; i++) { var a = (-90 + i * 36) * Math.PI / 180, rr = i % 2 ? r * 0.45 : r; st += (i ? 'L' : 'M') + n(cx + Math.cos(a) * rr) + ' ' + n(ty + Math.sin(a) * rr); }
    return o + '<path d="' + st + 'Z" fill="#FFD54F" stroke="#B8860B" stroke-width="2" stroke-linejoin="round"/>';
  }
  function firework(cx, cy, r, col) {
    var o = '<g stroke="' + col + '" stroke-linecap="round" fill="' + col + '">';
    for (var i = 0; i < 16; i++) { var a = i * 22.5 * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); o += '<line x1="' + n(cx + c * r * 0.4) + '" y1="' + n(cy + s * r * 0.4) + '" x2="' + n(cx + c * r * 0.82) + '" y2="' + n(cy + s * r * 0.82) + '" stroke-width="3"/><circle cx="' + n(cx + c * r) + '" cy="' + n(cy + s * r) + '" r="3" stroke="none"/>'; }
    return o + '<circle cx="' + cx + '" cy="' + cy + '" r="4" stroke="none"/></g>';
  }
  function clock(cx, cy, r) {
    var o = '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 8) + '" fill="#D4A017" stroke="#7a5a10" stroke-width="3"/><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#FFFEF4" stroke="#7a5a10" stroke-width="2"/>';
    for (var i = 0; i < 12; i++) { var a = i * 30 * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), big = i % 3 === 0; o += '<line x1="' + n(cx + c * r * (big ? 0.78 : 0.86)) + '" y1="' + n(cy + s * r * (big ? 0.78 : 0.86)) + '" x2="' + n(cx + c * r * 0.94) + '" y2="' + n(cy + s * r * 0.94) + '" stroke="#3a2a10" stroke-width="' + (big ? 5 : 2.6) + '" stroke-linecap="round"/>'; }
    return o + '<path d="M' + cx + ' ' + cy + 'L' + cx + ' ' + n(cy - r * 0.78) + '" stroke="#3a2a10" stroke-width="5" stroke-linecap="round"/><path d="M' + cx + ' ' + cy + 'L' + n(cx - r * 0.05) + ' ' + n(cy - r * 0.5) + '" stroke="#C2185B" stroke-width="7" stroke-linecap="round"/><circle cx="' + cx + '" cy="' + cy + '" r="7" fill="#C2185B" stroke="#3a2a10" stroke-width="2"/>';
  }
  function confetti(w, h, count) {
    var cols = ['#FFD54F', '#E91E63', '#7C4DFF', '#26C6DA', '#C0C7D0'], o = '';
    for (var i = 0; i < count; i++) { var x = (Math.sin(i * 12.9898) * 43758.5453 % 1 + 1) % 1 * w, y = (Math.sin(i * 78.233) * 12345.678 % 1 + 1) % 1 * h; o += '<rect x="' + n(x) + '" y="' + n(y) + '" width="6" height="12" rx="1.5" fill="' + cols[i % 5] + '" transform="rotate(' + (i * 37 % 180) + ' ' + n(x) + ' ' + n(y) + ')" opacity=".85"/>'; }
    return o;
  }
  function gulal(x, y, r, col) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + col + '" opacity=".16"/><circle cx="' + x + '" cy="' + y + '" r="' + n(r * 0.72) + '" fill="' + col + '" opacity=".26"/><circle cx="' + x + '" cy="' + y + '" r="' + n(r * 0.4) + '" fill="' + col + '" opacity=".38"/><circle cx="' + n(x + r * 0.9) + '" cy="' + n(y - r * 0.5) + '" r="' + n(r * 0.18) + '" fill="' + col + '" opacity=".5"/><circle cx="' + n(x - r * 0.8) + '" cy="' + n(y + r * 0.6) + '" r="' + n(r * 0.14) + '" fill="' + col + '" opacity=".5"/>'; }
  function bowl(x, y) {
    var o = '<ellipse cx="' + x + '" cy="' + y + '" rx="70" ry="13" fill="#D4AF37" stroke="#7a5a10" stroke-width="2"/><ellipse cx="' + x + '" cy="' + (y - 3) + '" rx="60" ry="9" fill="#F2D27A"/>';
    [['#E91E63', -42], ['#FFD600', -21], ['#1E88E5', 0], ['#43A047', 21], ['#FF9800', 42]].forEach(function (c) { o += '<path d="M' + (x + c[1] - 13) + ' ' + (y - 3) + 'Q' + (x + c[1]) + ' ' + (y - 38) + ' ' + (x + c[1] + 13) + ' ' + (y - 3) + 'Z" fill="' + c[0] + '" stroke="rgba(0,0,0,.2)" stroke-width="1"/>'; });
    return o;
  }
  function crescent(cx, cy, r, col) {
    return '<path d="M' + n(cx + r * 0.25) + ' ' + n(cy - r) + 'A' + r + ' ' + r + ' 0 1 0 ' + n(cx + r * 0.25) + ' ' + n(cy + r) + 'A' + n(r * 1.3) + ' ' + n(r * 1.3) + ' 0 0 1 ' + n(cx + r * 0.25) + ' ' + n(cy - r) + 'Z" fill="' + (col || '#F2D27A') + '" stroke="#B8860B" stroke-width="1.6"/>';
  }
  function star5(cx, cy, r, col) {
    var p = '';
    for (var i = 0; i < 10; i++) { var a = (-90 + i * 36) * Math.PI / 180, rr = i % 2 ? r * 0.45 : r; p += (i ? 'L' : 'M') + n(cx + Math.cos(a) * rr) + ' ' + n(cy + Math.sin(a) * rr); }
    return '<path d="' + p + 'Z" fill="' + (col || '#F2D27A') + '" stroke="#B8860B" stroke-width="1.2" stroke-linejoin="round"/>';
  }
  function mosque(cx, base) {
    var o = '';
    [-118, 118].forEach(function (dx) {
      var x = cx + dx;
      o += '<rect x="' + (x - 13) + '" y="150" width="26" height="' + (base - 150) + '" fill="#F6ECD2" stroke="#B8860B" stroke-width="2"/><rect x="' + (x - 17) + '" y="196" width="34" height="9" rx="3" fill="#D4AF37" stroke="#7a5a10" stroke-width="1.2"/><rect x="' + (x - 17) + '" y="150" width="34" height="9" rx="3" fill="#D4AF37" stroke="#7a5a10" stroke-width="1.2"/><path d="M' + (x - 15) + ' 150Q' + x + ' 108 ' + (x + 15) + ' 150Z" fill="#1E8F6A" stroke="#0B5D45" stroke-width="2"/><line x1="' + x + '" y1="112" x2="' + x + '" y2="96" stroke="#B8860B" stroke-width="2.4"/>' + crescent(x + 3, 90, 8) +
           '<path d="M' + (x - 5) + ' 250h10v-16a5 5 0 0 0-10 0z" fill="#0B5D45"/><path d="M' + (x - 5) + ' 300h10v-16a5 5 0 0 0-10 0z" fill="#0B5D45"/>';
    });
    o += '<rect x="' + (cx - 92) + '" y="250" width="184" height="' + (base - 250) + '" fill="#F6ECD2" stroke="#B8860B" stroke-width="2.4"/><path d="M' + (cx - 100) + ' 252Q' + (cx - 100) + ' 150 ' + cx + ' 150Q' + (cx + 100) + ' 150 ' + (cx + 100) + ' 252Z" fill="#1E8F6A" stroke="#0B5D45" stroke-width="3"/><path d="M' + (cx - 76) + ' 232Q' + cx + ' 168 ' + (cx + 76) + ' 232" fill="none" stroke="#F2D27A" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round"/><line x1="' + cx + '" y1="152" x2="' + cx + '" y2="128" stroke="#B8860B" stroke-width="3"/>' + crescent(cx + 4, 120, 13) + star5(cx + 14, 104, 6);
    [-62, -24, 24, 62].forEach(function (dx) { o += '<path d="M' + (cx + dx - 10) + ' 322v-34a10 10 0 0 1 20 0v34z" fill="#0B5D45" stroke="#B8860B" stroke-width="1.6"/>'; });
    o += '<path d="M' + (cx - 20) + ' ' + base + 'v-62a20 20 0 0 1 40 0v62z" fill="#0B3B2E" stroke="#B8860B" stroke-width="2.4"/><rect x="' + (cx - 100) + '" y="' + (base - 10) + '" width="200" height="10" fill="#D8C99A" stroke="#B8860B" stroke-width="1.4"/>';
    return o;
  }
  function portrait(cx, cy, r) {
    var o = '<defs><clipPath id="ltNJclip"><circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 8) + '"/></clipPath></defs>';
    o += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#D4AF37" stroke="#7a5a10" stroke-width="3"/><circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 8) + '" fill="#E9DDB0"/>';
    o += '<g clip-path="url(#ltNJclip)"><path d="M' + (cx - 80) + ' ' + (cy + 96) + 'Q' + (cx - 76) + ' ' + (cy + 40) + ' ' + cx + ' ' + (cy + 36) + 'Q' + (cx + 76) + ' ' + (cy + 40) + ' ' + (cx + 80) + ' ' + (cy + 96) + 'Z" fill="#6F7240" stroke="#3E4022" stroke-width="2"/>' +
      '<path d="M' + (cx - 20) + ' ' + (cy + 38) + 'L' + cx + ' ' + (cy + 74) + 'L' + (cx + 20) + ' ' + (cy + 38) + 'Z" fill="#F4F1E4" stroke="#3E4022" stroke-width="1.6"/><path d="M' + (cx - 30) + ' ' + (cy + 40) + 'L' + (cx - 6) + ' ' + (cy + 86) + 'L' + (cx - 40) + ' ' + (cy + 70) + 'Z M' + (cx + 30) + ' ' + (cy + 40) + 'L' + (cx + 6) + ' ' + (cy + 86) + 'L' + (cx + 40) + ' ' + (cy + 70) + 'Z" fill="#585B30" stroke="#3E4022" stroke-width="1.4"/>' +
      '<rect x="' + (cx - 10) + '" y="' + (cy + 18) + '" width="20" height="24" fill="#D69E72"/><ellipse cx="' + (cx - 36) + '" cy="' + (cy - 6) + '" rx="6" ry="10" fill="#D69E72"/><ellipse cx="' + (cx + 36) + '" cy="' + (cy - 6) + '" rx="6" ry="10" fill="#D69E72"/><ellipse cx="' + cx + '" cy="' + (cy - 8) + '" rx="31" ry="40" fill="#E2AE82" stroke="#8A5A3A" stroke-width="1.4"/>' +
      '<circle cx="' + (cx - 14) + '" cy="' + (cy - 10) + '" r="11" fill="rgba(255,255,255,.35)" stroke="#2a2a2a" stroke-width="2.4"/><circle cx="' + (cx + 14) + '" cy="' + (cy - 10) + '" r="11" fill="rgba(255,255,255,.35)" stroke="#2a2a2a" stroke-width="2.4"/><path d="M' + (cx - 3) + ' ' + (cy - 10) + 'h6" stroke="#2a2a2a" stroke-width="2"/><circle cx="' + (cx - 14) + '" cy="' + (cy - 9) + '" r="2.4" fill="#2a1a12"/><circle cx="' + (cx + 14) + '" cy="' + (cy - 9) + '" r="2.4" fill="#2a1a12"/>' +
      '<path d="M' + cx + ' ' + (cy - 6) + 'v14q-3 2-6 0" stroke="#8A5A3A" stroke-width="1.8" fill="none"/><path d="M' + (cx - 11) + ' ' + (cy + 15) + 'Q' + cx + ' ' + (cy + 9) + ' ' + (cx + 11) + ' ' + (cy + 15) + 'Q' + cx + ' ' + (cy + 18) + ' ' + (cx - 11) + ' ' + (cy + 15) + 'Z" fill="#2a1a12"/><path d="M' + (cx - 7) + ' ' + (cy + 24) + 'Q' + cx + ' ' + (cy + 28) + ' ' + (cx + 7) + ' ' + (cy + 24) + '" stroke="#8A2F1F" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<path d="M' + (cx - 34) + ' ' + (cy - 32) + 'L' + (cx - 30) + ' ' + (cy - 62) + 'Q' + cx + ' ' + (cy - 76) + ' ' + (cx + 30) + ' ' + (cy - 62) + 'L' + (cx + 34) + ' ' + (cy - 32) + 'Z" fill="#6F7240" stroke="#3E4022" stroke-width="1.6"/><path d="M' + (cx - 36) + ' ' + (cy - 34) + 'Q' + cx + ' ' + (cy - 22) + ' ' + (cx + 36) + ' ' + (cy - 34) + 'L' + (cx + 44) + ' ' + (cy - 26) + 'Q' + cx + ' ' + (cy - 10) + ' ' + (cx - 44) + ' ' + (cy - 26) + 'Z" fill="#2E2E1A"/><circle cx="' + cx + '" cy="' + (cy - 50) + '" r="6" fill="#D4AF37" stroke="#7a5a10" stroke-width="1"/></g>';
    for (var i = 0; i < 17; i++) { var a = (12 + i * 9.4) * Math.PI / 180; o += '<circle cx="' + n(cx + (r + 1) * Math.cos(a)) + '" cy="' + n(cy + (r + 1) * Math.sin(a)) + '" r="7.5" fill="' + (i % 2 ? '#FF9933' : '#FFC04D') + '" stroke="#b8630a" stroke-width=".7"/>'; }
    return o;
  }
  function indiaGate(cx, base) {
    var o = '<rect x="' + (cx - 84) + '" y="' + (base - 16) + '" width="168" height="16" fill="#B98A50" stroke="#7a5a28" stroke-width="1.6"/><rect x="' + (cx - 72) + '" y="' + (base - 30) + '" width="144" height="14" fill="#C99A5B" stroke="#7a5a28" stroke-width="1.6"/>';
    o += '<rect x="' + (cx - 58) + '" y="' + (base - 200) + '" width="116" height="172" fill="#C99A5B" stroke="#7a5a28" stroke-width="2.4"/><rect x="' + (cx - 66) + '" y="' + (base - 218) + '" width="132" height="20" fill="#B98A50" stroke="#7a5a28" stroke-width="2"/><rect x="' + (cx - 48) + '" y="' + (base - 234) + '" width="96" height="18" fill="#C99A5B" stroke="#7a5a28" stroke-width="2"/><path d="M' + (cx - 30) + ' ' + (base - 234) + 'Q' + cx + ' ' + (base - 266) + ' ' + (cx + 30) + ' ' + (base - 234) + 'Z" fill="#B98A50" stroke="#7a5a28" stroke-width="2"/>';
    o += '<path d="M' + (cx - 28) + ' ' + (base - 28) + 'v-100a28 28 0 0 1 56 0v100z" fill="#3A2410" stroke="#7a5a28" stroke-width="2"/><path d="M' + (cx - 20) + ' ' + (base - 28) + 'v-98a20 20 0 0 1 40 0v98z" fill="#5A3A1A"/>';
    for (var i = 0; i < 5; i++) o += '<path d="M' + (cx - 52) + ' ' + (base - 186 + i * 9) + 'h16M' + (cx + 36) + ' ' + (base - 186 + i * 9) + 'h16" stroke="#8a6330" stroke-width="2" stroke-linecap="round"/>';
    return o + '<path d="M' + (cx - 54) + ' ' + (base - 204) + 'h108" stroke="#E8C98B" stroke-width="2"/>';
  }
  function jet(x, y, rot, flip) {
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + (flip ? -1 : 1) + ' 1)"><path d="M0 0l30-4 12 4-12 4z" fill="#EDEFF2" stroke="#6B7480" stroke-width="1.4"/><path d="M12 0l-14-13h6l18 12z" fill="#D7DCE2" stroke="#6B7480" stroke-width="1.2"/><path d="M12 0l-14 13h6l18-12z" fill="#D7DCE2" stroke="#6B7480" stroke-width="1.2"/><circle cx="28" cy="-1" r="2.6" fill="#3A6EA5"/></g>';
  }
  function trails(x0, y0, x1, y1, bend) {
    var o = '', cols = ['#FF9933', '#FFFFFF', '#138808'], i;
    for (i = 0; i < 3; i++) { var dy = (i - 1) * 9, p = 'M' + x0 + ' ' + (y0 + dy) + 'Q' + n((x0 + x1) / 2) + ' ' + (y0 + dy - bend) + ' ' + x1 + ' ' + (y1 + dy); o += (i === 1 ? '<path d="' + p + '" stroke="#152238" stroke-opacity=".25" stroke-width="9" fill="none" stroke-linecap="round"/>' : '') + '<path d="' + p + '" stroke="' + cols[i] + '" stroke-width="' + (i === 1 ? 6 : 7) + '" fill="none" stroke-linecap="round" opacity=".92"/>'; }
    return o;
  }

  /* ------------------------------------------------------------ BANNERS (760 × 400) and SIDE CROWDS (340 × 520) */
  var NEW = {}, SM = ['#E91E63', '#FFD600', '#1E88E5', '#43A047'];
  NEW['christmas'] = { b: function () {
    var s = OPEN(760, 400) + lights(0, 10, 760, 10, 12, 24) + snowGround(760, 396) + tree(380, 386, 1) + gift(292, Y, 48, 40, '#C62828', '#F4C542') + gift(436, Y, 42, 34, '#1E88E5', '#FFFFFF') + gift(478, Y, 34, 46, '#1B7A3A', '#C62828');
    s += P({ x: 70, s: 0.64, kind: 'casualW', kid: true, top: '#1B7A3A', bottom: '#C62828', hat: 'santa', pose: 'waveB', skin: sk(1) });
    s += P({ x: 122, s: 0.64, kind: 'casual', kid: true, top: '#E53935', bottom: '#2F4A7A', hat: 'santa', pose: 'clap', skin: sk(2) });
    s += P({ x: 200, s: 1.1, kind: 'casual', top: '#D32F2F', bottom: '#D32F2F', belt: 1, hat: 'santa', beard: '#FFFFFF', hair: '#fff', pose: 'wave', skin: sk(0) });
    s += P({ x: 552, kind: 'casualW', top: '#C62828', bottom: '#1B7A3A', hat: 'santa', pose: 'wave', skin: sk(1) });
    s += P({ x: 606, s: 0.64, kind: 'casual', kid: true, top: '#1E88E5', bottom: '#37474F', scarf: '#C62828', hat: 'woolcap', hatc: '#C62828', pose: 'waveB', skin: sk(3) });
    s += snowman(690, Y, 0.78);
    return s + '</svg>'; },
    c: function (L) { var s = OPEN(340, 520) + snowGround(340, 514); s += L ? lights(0, 22, 340, 70, 9, 11) + pine(26, CY, 300) : lights(340, 22, 0, 70, 9, 11) + pine(314, CY, 300);
      s += L ? P({ x: 62, s: 1.3, kind: 'casual', top: '#D32F2F', bottom: '#D32F2F', belt: 1, hat: 'santa', beard: '#fff', hair: '#fff', pose: 'wave', skin: sk(0) }, CY) + P({ x: 156, s: 1.3, kind: 'casualW', top: '#C62828', bottom: '#1B7A3A', hat: 'santa', pose: 'waveB', skin: sk(1) }, CY) + P({ x: 236, s: 0.82, kind: 'casualW', kid: true, top: '#1B7A3A', bottom: '#C62828', hat: 'santa', pose: 'clap', skin: sk(2) }, CY)
             : P({ x: 112, s: 0.82, kind: 'casual', kid: true, top: '#E53935', bottom: '#2F4A7A', hat: 'santa', pose: 'clap', skin: sk(1) }, CY) + P({ x: 196, s: 1.3, kind: 'casual', top: '#1B7A3A', bottom: '#37474F', scarf: '#C62828', hat: 'santa', pose: 'wave', skin: sk(2) }, CY) + P({ x: 282, s: 1.3, kind: 'casualW', top: '#C62828', bottom: '#2F4A7A', hat: 'santa', pose: 'waveB', skin: sk(3) }, CY);
      return s + '</svg>'; } };

  NEW['new-year'] = { b: function () {
    var s = OPEN(760, 400) + H.bunting(0, 12, 760, 12, 14, ['#FFD54F', '#DDE3EA', '#C2185B', '#7C4DFF'], 26) + confetti(760, 392, 38) + H.ground(760, 394);
    s += firework(150, 120, 70, '#FFD54F') + firework(612, 104, 80, '#FF4081') + firework(262, 56, 40, '#7C4DFF') + firework(512, 62, 38, '#26C6DA');
    s += '<rect x="346" y="296" width="68" height="96" rx="4" fill="#5B1F8C" stroke="#D4A017" stroke-width="3"/><rect x="332" y="374" width="96" height="18" rx="3" fill="#3E1470" stroke="#D4A017" stroke-width="2.4"/>' + clock(380, 196, 88);
    s += H.balloon(44, 130, 18, '#FFD54F') + H.balloon(78, 112, 18, '#C2185B') + H.balloon(706, 124, 18, '#7C4DFF') + H.balloon(676, 142, 18, '#26C6DA');
    s += P({ x: 92, s: 0.64, kind: 'casualW', kid: true, top: '#E91E63', bottom: '#7C4DFF', hat: 'party', hatc: '#FFD54F', pose: 'waveB', skin: sk(1) });
    s += P({ x: 170, kind: 'casualW', top: '#7C4DFF', bottom: '#212121', hat: 'party', hatc: '#E91E63', pose: 'wave', spark: 1, skin: sk(2) });
    s += P({ x: 248, s: 0.64, kind: 'casual', kid: true, top: '#FFD54F', bottom: '#2F4A7A', hat: 'party', hatc: '#7C4DFF', pose: 'wave', spark: 1, skin: sk(1) });
    s += P({ x: 520, kind: 'casual', top: '#212121', bottom: '#37474F', hat: 'party', hatc: '#26C6DA', pose: 'waveB', skin: sk(3) });
    s += P({ x: 598, kind: 'casualW', top: '#FFD54F', bottom: '#C2185B', hat: 'party', hatc: '#7C4DFF', pose: 'clap', skin: sk(1) });
    s += P({ x: 666, s: 0.64, kind: 'casualW', kid: true, top: '#26C6DA', bottom: '#E91E63', hat: 'party', hatc: '#FFD54F', pose: 'wave', spark: 1, skin: sk(2) });
    s += P({ x: 718, s: 0.64, kind: 'casual', kid: true, top: '#E91E63', bottom: '#2F4A7A', hat: 'party', hatc: '#C0C7D0', pose: 'waveB', skin: sk(1) });
    return s + '</svg>'; },
    c: function (L) { var s = OPEN(340, 520) + H.ground(340, 514) + confetti(340, 500, 18);
      s += L ? firework(90, 150, 62, '#FFD54F') + H.balloon(250, 220, 20, '#C2185B') + H.balloon(284, 198, 20, '#7C4DFF') + H.bunting(0, 20, 340, 70, 8, ['#FFD54F', '#DDE3EA', '#C2185B', '#7C4DFF'], 11)
             : firework(250, 140, 64, '#FF4081') + H.balloon(90, 220, 20, '#FFD54F') + H.balloon(56, 198, 20, '#26C6DA') + H.bunting(340, 20, 0, 70, 8, ['#FFD54F', '#DDE3EA', '#C2185B', '#7C4DFF'], 11);
      s += L ? P({ x: 62, s: 1.3, kind: 'casualW', top: '#7C4DFF', bottom: '#212121', hat: 'party', hatc: '#E91E63', pose: 'wave', spark: 1, skin: sk(2) }, CY) + P({ x: 152, s: 1.3, kind: 'casual', top: '#212121', bottom: '#37474F', hat: 'party', hatc: '#FFD54F', pose: 'waveB', skin: sk(1) }, CY) + P({ x: 236, s: 0.82, kind: 'casualW', kid: true, top: '#E91E63', bottom: '#7C4DFF', hat: 'party', hatc: '#26C6DA', pose: 'clap', skin: sk(1) }, CY)
             : P({ x: 112, s: 0.82, kind: 'casual', kid: true, top: '#FFD54F', bottom: '#2F4A7A', hat: 'party', hatc: '#7C4DFF', pose: 'wave', spark: 1, skin: sk(1) }, CY) + P({ x: 196, s: 1.3, kind: 'casualW', top: '#FFD54F', bottom: '#C2185B', hat: 'party', hatc: '#7C4DFF', pose: 'clap', skin: sk(3) }, CY) + P({ x: 282, s: 1.3, kind: 'casual', top: '#C2185B', bottom: '#212121', hat: 'party', hatc: '#C0C7D0', pose: 'waveB', skin: sk(2) }, CY);
      return s + '</svg>'; } };

  NEW['winter'] = { b: function () {
    var s = OPEN(760, 400) + snowGround(760, 396);
    [[70, 170], [146, 130], [238, 150], [548, 140], [640, 182], [716, 128]].forEach(function (p) { s += pine(p[0], 384, p[1]); });
    s += snowman(380, Y, 1.2);
    s += P({ x: 122, kind: 'casual', top: '#6B4226', bottom: '#37474F', scarf: '#C62828', hat: 'woolcap', hatc: '#C62828', pose: 'wave', skin: sk(2) });
    s += P({ x: 196, kind: 'casualW', top: '#C62828', bottom: '#2F4A7A', tights: '#2F4A7A', scarf: '#F4C542', hat: 'woolcap', hatc: '#F4C542', pose: 'waveB', skin: sk(1) });
    s += P({ x: 290, s: 0.64, kind: 'casual', kid: true, top: '#2F6FA8', bottom: '#37474F', hat: 'monkey', hatc: '#F28C28', pose: 'clap', skin: sk(1) });
    s += P({ x: 478, s: 0.64, kind: 'casualW', kid: true, top: '#C62828', bottom: '#37474F', tights: '#37474F', hat: 'monkey', hatc: '#2F6FA8', pose: 'waveB', skin: sk(3) });
    s += P({ x: 548, kind: 'casual', top: '#2F6FA8', bottom: '#2B2B33', scarf: '#F4C542', hat: 'woolcap', hatc: '#2F6FA8', pose: 'wave', skin: sk(1) });
    s += P({ x: 628, kind: 'casualW', top: '#7B1FA2', bottom: '#2B2B33', tights: '#2B2B33', scarf: '#E0E0E0', hat: 'monkey', hatc: '#7B1FA2', pose: 'clap', skin: sk(2) });
    return s + '</svg>'; },
    c: function (L) { var s = OPEN(340, 520) + snowGround(340, 514);
      s += L ? pine(24, CY, 330) + pine(104, CY, 250) + pine(176, CY, 190) : pine(316, CY, 330) + pine(236, CY, 250) + pine(164, CY, 190);
      s += L ? P({ x: 64, s: 1.3, kind: 'casual', top: '#6B4226', bottom: '#37474F', scarf: '#C62828', hat: 'woolcap', hatc: '#C62828', pose: 'wave', skin: sk(2) }, CY) + P({ x: 154, s: 1.3, kind: 'casualW', top: '#C62828', bottom: '#2F4A7A', tights: '#2F4A7A', scarf: '#F4C542', hat: 'monkey', hatc: '#F4C542', pose: 'waveB', skin: sk(1) }, CY) + P({ x: 236, s: 0.82, kind: 'casual', kid: true, top: '#2F6FA8', bottom: '#37474F', hat: 'monkey', hatc: '#F28C28', pose: 'clap', skin: sk(1) }, CY)
             : P({ x: 110, s: 0.82, kind: 'casualW', kid: true, top: '#C62828', bottom: '#37474F', tights: '#37474F', hat: 'monkey', hatc: '#2F6FA8', pose: 'waveB', skin: sk(3) }, CY) + P({ x: 196, s: 1.3, kind: 'casual', top: '#2F6FA8', bottom: '#2B2B33', scarf: '#F4C542', hat: 'woolcap', hatc: '#2F6FA8', pose: 'wave', skin: sk(1) }, CY) + P({ x: 282, s: 1.3, kind: 'casualW', top: '#7B1FA2', bottom: '#2B2B33', tights: '#2B2B33', scarf: '#E0E0E0', hat: 'monkey', hatc: '#7B1FA2', pose: 'clap', skin: sk(2) }, CY);
      return s + '</svg>'; } };

  NEW['holi'] = { b: function () {
    var s = OPEN(760, 400) + H.bunting(0, 12, 760, 12, 14, ['#E91E63', '#FFD600', '#43A047', '#1E88E5', '#FF9800'], 26);
    [[110, 150, 62, '#E91E63'], [214, 88, 50, '#FFD600'], [316, 140, 56, '#1E88E5'], [450, 112, 58, '#43A047'], [560, 70, 52, '#FF9800'], [660, 142, 62, '#8E24AA']].forEach(function (g2) { s += gulal(g2[0], g2[1], g2[2], g2[3]); });
    s += H.ground(760, 394) + bowl(380, 386);
    s += P({ x: 70, kind: 'woman', top: '#E91E63', smear: SM, splash: 1, pose: 'waveB', skin: sk(1) });
    s += P({ x: 142, kind: 'man', top: '#FFFFFF', smear: SM, splash: 1, gun: '#1E88E5', pose: 'wave', skin: sk(2) });
    s += P({ x: 212, s: 0.64, kind: 'boy', top: '#FFFFFF', smear: SM, splash: 1, pose: 'clap', skin: sk(1) });
    s += P({ x: 264, s: 0.64, kind: 'girl', top: '#FFD600', smear: SM, splash: 1, pose: 'waveB', skin: sk(3) });
    s += P({ x: 500, s: 0.64, kind: 'girl', top: '#E91E63', smear: SM, splash: 1, pose: 'waveB', skin: sk(2) });
    s += P({ x: 556, kind: 'woman', top: '#1E88E5', smear: SM, splash: 1, pose: 'wave', skin: sk(1) });
    s += P({ x: 638, kind: 'man', top: '#FFFFFF', smear: SM, splash: 1, gun: '#E91E63', pose: 'wave', skin: sk(3) });
    s += P({ x: 712, s: 0.64, kind: 'boy', top: '#FFFFFF', smear: SM, splash: 1, pose: 'clap', skin: sk(1) });
    return s + '</svg>'; },
    c: function (L) { var s = OPEN(340, 520) + H.ground(340, 514);
      s += L ? gulal(70, 190, 60, '#E91E63') + gulal(180, 130, 52, '#FFD600') + gulal(250, 220, 56, '#1E88E5') + H.bunting(0, 20, 340, 70, 8, ['#E91E63', '#FFD600', '#43A047', '#1E88E5'], 11)
             : gulal(270, 190, 60, '#43A047') + gulal(160, 130, 52, '#FF9800') + gulal(90, 220, 56, '#8E24AA') + H.bunting(340, 20, 0, 70, 8, ['#E91E63', '#FFD600', '#43A047', '#1E88E5'], 11);
      s += L ? P({ x: 62, s: 1.3, kind: 'woman', top: '#E91E63', smear: SM, splash: 1, pose: 'waveB', skin: sk(1) }, CY) + P({ x: 152, s: 1.3, kind: 'man', top: '#FFFFFF', smear: SM, splash: 1, gun: '#1E88E5', pose: 'wave', skin: sk(2) }, CY) + P({ x: 234, s: 0.82, kind: 'boy', top: '#FFFFFF', smear: SM, splash: 1, pose: 'clap', skin: sk(1) }, CY)
             : P({ x: 112, s: 0.82, kind: 'girl', top: '#FFD600', smear: SM, splash: 1, pose: 'waveB', skin: sk(3) }, CY) + P({ x: 196, s: 1.3, kind: 'man', top: '#FFFFFF', smear: SM, splash: 1, gun: '#E91E63', pose: 'wave', skin: sk(2) }, CY) + P({ x: 282, s: 1.3, kind: 'woman', top: '#1E88E5', smear: SM, splash: 1, pose: 'waveB', skin: sk(1) }, CY);
      return s + '</svg>'; } };

  NEW['eid'] = { b: function () {
    var s = OPEN(760, 400) + H.bunting(0, 12, 760, 12, 12, ['#0F7B5A', '#F2D27A', '#FFFFFF', '#1E8F6A'], 26) + H.lantern(118, 40, '#1E8F6A') + H.lantern(642, 40, '#D4AF37');
    s += crescent(86, 86, 30) + star5(116, 70, 9) + star5(40, 140, 7) + star5(700, 110, 8) + star5(660, 70, 6) + star5(214, 54, 6);
    s += H.ground(760, 394) + mosque(380, Y);
    s += P({ x: 56, kind: 'salwar', top: '#0F7B5A', dupatta: '#F2D27A', pose: 'namaste', skin: sk(1) });
    s += P({ x: 128, kind: 'man', pyjama: 1, top: '#FFFFFF', hat: 'skull', pose: 'hugR', skin: sk(2) });
    s += P({ x: 176, kind: 'man', pyjama: 1, top: '#7BC6A4', hat: 'skull', pose: 'hugL', skin: sk(1) });
    s += P({ x: 236, s: 0.64, kind: 'boy', top: '#F2D27A', hat: 'skull', plate: 1, pose: 'hold', skin: sk(1) });
    s += P({ x: 532, s: 0.64, kind: 'girl', top: '#E8A0BF', dupatta: '#F2D27A', pose: 'waveB', skin: sk(2) });
    s += P({ x: 592, kind: 'salwar', top: '#7A2E8E', dupatta: '#FFFFFF', plate: 1, pose: 'hold', skin: sk(3) });
    s += P({ x: 668, kind: 'man', pyjama: 1, top: '#2E7D6B', hat: 'skull', pose: 'clap', skin: sk(2) });
    s += P({ x: 722, s: 0.64, kind: 'boy', top: '#FFFFFF', hat: 'skull', pose: 'waveB', skin: sk(1) });
    return s + '</svg>'; },
    c: function (L) { var s = OPEN(340, 520) + H.ground(340, 514);
      s += L ? H.bunting(0, 24, 340, 80, 8, ['#0F7B5A', '#F2D27A', '#FFFFFF', '#1E8F6A'], 11) + H.lantern(44, 90, '#1E8F6A') + H.lantern(120, 150, '#D4AF37') + crescent(250, 130, 22) + star5(286, 110, 8)
             : H.bunting(340, 24, 0, 80, 8, ['#0F7B5A', '#F2D27A', '#FFFFFF', '#1E8F6A'], 11) + H.lantern(296, 90, '#D4AF37') + H.lantern(220, 150, '#1E8F6A') + crescent(90, 130, 22) + star5(54, 110, 8);
      s += L ? P({ x: 58, s: 1.3, kind: 'salwar', top: '#0F7B5A', dupatta: '#F2D27A', pose: 'namaste', skin: sk(1) }, CY) + P({ x: 142, s: 1.3, kind: 'man', pyjama: 1, top: '#FFFFFF', hat: 'skull', pose: 'hugR', skin: sk(2) }, CY) + P({ x: 202, s: 1.3, kind: 'man', pyjama: 1, top: '#7BC6A4', hat: 'skull', pose: 'hugL', skin: sk(1) }, CY) + P({ x: 272, s: 0.82, kind: 'boy', top: '#F2D27A', hat: 'skull', plate: 1, pose: 'hold', skin: sk(1) }, CY)
             : P({ x: 76, s: 0.82, kind: 'girl', top: '#E8A0BF', dupatta: '#F2D27A', pose: 'waveB', skin: sk(2) }, CY) + P({ x: 170, s: 1.3, kind: 'salwar', top: '#7A2E8E', dupatta: '#FFFFFF', plate: 1, pose: 'hold', skin: sk(3) }, CY) + P({ x: 262, s: 1.3, kind: 'man', pyjama: 1, top: '#2E7D6B', hat: 'skull', pose: 'clap', skin: sk(2) }, CY);
      return s + '</svg>'; } };

  NEW['netaji-jayanti'] = { b: function () {
    var s = OPEN(760, 400) + H.bunting(0, 10, 330, 40, 10, ['#FF9933', '#FFFFFF', '#138808'], 11) + H.bunting(760, 10, 430, 40, 10, ['#FF9933', '#FFFFFF', '#138808'], 11);
    s += H.balloon(52, 96, 17, '#FF9933') + H.balloon(80, 80, 17, '#FFFFFF') + H.balloon(106, 106, 17, '#138808') + H.balloon(690, 92, 17, '#138808') + H.balloon(718, 110, 17, '#FF9933') + H.balloon(664, 110, 17, '#FFFFFF') + H.ground(760, 394);
    s += '<rect x="226" y="372" width="308" height="20" rx="3" fill="#8A8A46" stroke="#4A4A1A" stroke-width="2"/><rect x="226" y="372" width="102" height="6" fill="#FF9933"/><rect x="328" y="372" width="102" height="6" fill="#fff"/><rect x="430" y="372" width="104" height="6" fill="#138808"/><rect x="344" y="296" width="72" height="76" fill="#F2E9C9" stroke="#8A6D1D" stroke-width="2.4"/><rect x="334" y="288" width="92" height="14" rx="3" fill="#D4AF37" stroke="#7a5a10" stroke-width="2"/>' + portrait(380, 186, 98);
    s += P({ x: 44, s: 1.05, kind: 'man', top: '#FFFFFF', elder: 1, topi: 1, hair: '#ddd', pose: 'wave', skin: sk(0) });
    s += P({ x: 108, kind: 'student', pose: 'salute', skin: sk(2) });
    s += P({ x: 168, kind: 'studentG', pose: 'flag', flagIn: 1, skin: sk(1) });
    s += P({ x: 214, kind: 'soldier', top: '#6F7240', hat: 'peak', hatc: '#5B5B25', pose: 'salute', skin: sk(2) });
    s += P({ x: 548, kind: 'soldier', top: '#6F7240', hat: 'peak', hatc: '#5B5B25', pose: 'salute', skin: sk(1) });
    s += P({ x: 604, kind: 'student', pose: 'salute', skin: sk(3) });
    s += P({ x: 664, kind: 'woman', top: '#FF9933', pose: 'namaste', skin: sk(2) });
    s += P({ x: 722, s: 0.64, kind: 'boy', top: '#138808', flagIn: 1, pose: 'flag', skin: sk(1) });
    return s + '</svg>'; },
    c: function (L) { var s = OPEN(340, 520) + H.ground(340, 514);
      s += L ? H.balloon(46, 220, 20, '#FF9933') + H.balloon(80, 196, 20, '#FFFFFF') + H.balloon(114, 232, 20, '#138808') + H.flagpole(290, 160, '#FF9933') + H.bunting(0, 20, 340, 70, 8, ['#FF9933', '#FFFFFF', '#138808'], 12)
             : H.balloon(294, 220, 20, '#138808') + H.balloon(260, 196, 20, '#FFFFFF') + H.balloon(226, 232, 20, '#FF9933') + H.flagpole(50, 160, '#138808') + H.bunting(340, 20, 0, 70, 8, ['#FF9933', '#FFFFFF', '#138808'], 12);
      s += L ? P({ x: 58, s: 1.3, kind: 'man', top: '#FFFFFF', elder: 1, topi: 1, hair: '#ddd', pose: 'wave', skin: sk(0) }, CY) + P({ x: 148, s: 1.3, kind: 'student', pose: 'salute', skin: sk(2) }, CY) + P({ x: 232, s: 1.3, kind: 'studentG', pose: 'flag', flagIn: 1, skin: sk(1) }, CY)
             : P({ x: 118, s: 0.82, kind: 'boy', top: '#138808', flagIn: 1, pose: 'flag', skin: sk(1) }, CY) + P({ x: 196, s: 1.3, kind: 'student', pose: 'salute', skin: sk(3) }, CY) + P({ x: 282, s: 1.3, kind: 'soldier', top: '#6F7240', hat: 'peak', hatc: '#5B5B25', pose: 'salute', skin: sk(2) }, CY);
      return s + '</svg>'; } };

  NEW['republic-day'] = { b: function () {
    var s = OPEN(760, 400) + H.bunting(0, 10, 760, 10, 12, ['#FF9933', '#FFFFFF', '#138808'], 28);
    s += trails(0, 150, 322, 78, 24) + jet(326, 76, -14) + trails(760, 150, 438, 78, 24) + jet(434, 76, 194, true);
    s += H.balloon(40, 96, 16, '#FF9933') + H.balloon(68, 112, 16, '#138808') + H.balloon(716, 96, 16, '#138808') + H.balloon(692, 112, 16, '#FF9933') + H.ground(760, 394) + indiaGate(380, Y);
    s += P({ x: 56, s: 1.05, kind: 'man', top: '#FFFFFF', elder: 1, topi: 1, hair: '#ddd', pose: 'wave', skin: sk(0) });
    s += P({ x: 118, kind: 'student', pose: 'salute', skin: sk(2) });
    s += P({ x: 176, s: 0.64, kind: 'boy', top: '#FF9933', flagIn: 1, pose: 'flag', skin: sk(1) });
    s += P({ x: 230, kind: 'soldier', top: '#55603A', hat: 'peak', hatc: '#3E4A2A', pose: 'salute', skin: sk(2) });
    s += P({ x: 292, kind: 'soldier', top: '#55603A', hat: 'peak', hatc: '#3E4A2A', pose: 'salute', skin: sk(1) });
    s += P({ x: 468, kind: 'soldier', top: '#55603A', hat: 'peak', hatc: '#3E4A2A', pose: 'salute', skin: sk(3) });
    s += P({ x: 530, kind: 'soldier', top: '#55603A', hat: 'peak', hatc: '#3E4A2A', pose: 'salute', skin: sk(2) });
    s += P({ x: 586, s: 0.64, kind: 'girl', top: '#138808', flagIn: 1, pose: 'flag', skin: sk(2) });
    s += P({ x: 646, kind: 'studentG', pose: 'salute', skin: sk(1) });
    s += P({ x: 716, kind: 'woman', top: '#FF9933', pose: 'wave', skin: sk(3) });
    return s + '</svg>'; },
    c: function (L) { var s = OPEN(340, 520) + H.ground(340, 514);
      s += L ? H.bunting(0, 20, 340, 70, 8, ['#FF9933', '#FFFFFF', '#138808'], 12) + H.balloon(46, 220, 20, '#FF9933') + H.balloon(80, 196, 20, '#FFFFFF') + H.balloon(114, 232, 20, '#138808') + trails(0, 150, 220, 118, 18) + jet(224, 116, -10)
             : H.bunting(340, 20, 0, 70, 8, ['#FF9933', '#FFFFFF', '#138808'], 12) + H.balloon(294, 220, 20, '#138808') + H.balloon(260, 196, 20, '#FFFFFF') + H.balloon(226, 232, 20, '#FF9933') + trails(340, 150, 120, 118, 18) + jet(116, 116, 190, true);
      s += L ? P({ x: 58, s: 1.3, kind: 'soldier', top: '#55603A', hat: 'peak', hatc: '#3E4A2A', pose: 'salute', skin: sk(2) }, CY) + P({ x: 148, s: 1.3, kind: 'student', pose: 'salute', skin: sk(1) }, CY) + P({ x: 232, s: 0.82, kind: 'boy', top: '#FF9933', flagIn: 1, pose: 'flag', skin: sk(1) }, CY)
             : P({ x: 112, s: 0.82, kind: 'girl', top: '#138808', flagIn: 1, pose: 'flag', skin: sk(2) }, CY) + P({ x: 196, s: 1.3, kind: 'studentG', pose: 'salute', skin: sk(2) }, CY) + P({ x: 282, s: 1.3, kind: 'soldier', top: '#55603A', hat: 'peak', hatc: '#3E4A2A', pose: 'salute', skin: sk(3) }, CY);
      return s + '</svg>'; } };

  A.banner = function (f) { return NEW[f] ? NEW[f].b() : oldBanner(f); };
  A.crowd = function (f, side) { return NEW[f] ? NEW[f].c(side === 'l') : oldCrowd(f, side); };
  A._newScenes = NEW;
})(window);
