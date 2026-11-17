/* Learnio Theme Engine — FESTIVAL ARTWORK
   Hand-built, folk-art-style SVG illustrations (no images to download, nothing external):
     LT.art.durga()  — Maa Durga murti with chalchitra arch, lion and ten arms
     LT.art.rath()   — Ratha with Balabhadra, Subhadra and Jagannath
     LT.art.flag()   — Indian National Flag on a pole (exact 3:2 proportions, 24-spoke Ashoka Chakra)
   Depicted respectfully and kept flat/stylised. All text-free, decorative and aria-hidden. */
(function (global) {
  'use strict';
  var LT = global.LearnioTheme = global.LearnioTheme || {};
  var INK = '#3A1008';

  function f(n) { return Math.round(n * 10) / 10; }

  /* ================================================================ FLAG */
  function chakra(cx, cy, r, col) {
    var s = '<g fill="none" stroke="' + col + '" stroke-linecap="round">' +
            '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" stroke-width="' + f(r * 0.1) + '"/>';
    for (var i = 0; i < 24; i++) {
      var a = i * 15 * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
      s += '<line x1="' + f(cx + ca * r * 0.16) + '" y1="' + f(cy + sa * r * 0.16) + '" x2="' + f(cx + ca * r * 0.97) + '" y2="' + f(cy + sa * r * 0.97) + '" stroke-width="' + f(r * 0.06) + '"/>';
      var b = (i * 15 + 7.5) * Math.PI / 180;
      s += '<circle cx="' + f(cx + Math.cos(b) * r * 0.86) + '" cy="' + f(cy + Math.sin(b) * r * 0.86) + '" r="' + f(r * 0.045) + '" fill="' + col + '" stroke="none"/>';
    }
    return s + '<circle cx="' + cx + '" cy="' + cy + '" r="' + f(r * 0.13) + '" fill="' + col + '" stroke="none"/></g>';
  }

  function flag() {
    /* Flag 3:2 → 300 × 200, three equal bands; chakra diameter = ¾ of the white band (50 of 66.67). Never skewed or waved. */
    var W = 300, H = 200, b = H / 3, fx = 70, fy = 38;
    return '<svg class="lt-art-svg" viewBox="0 0 400 300" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="ltPoleG" x1="0" x2="1"><stop offset="0" stop-color="#8A6D1D"/><stop offset=".5" stop-color="#F6DE8D"/><stop offset="1" stop-color="#8A6D1D"/></linearGradient></defs>' +
      '<ellipse cx="66" cy="294" rx="44" ry="5" fill="#152238" opacity=".18"/>' +
      '<g class="lt-flag-sway">' +
        '<rect x="62" y="38" width="9" height="256" rx="4.5" fill="url(#ltPoleG)"/>' +
        '<circle cx="66.5" cy="30" r="10" fill="#F4C542" stroke="#8A6D1D" stroke-width="1.5"/>' +
        '<g transform="translate(' + (fx + 5) + ' ' + fy + ')">' +
          '<rect width="' + W + '" height="' + f(b) + '" fill="#FF9933"/>' +
          '<rect y="' + f(b) + '" width="' + W + '" height="' + f(b) + '" fill="#FFFFFF"/>' +
          '<rect y="' + f(b * 2) + '" width="' + W + '" height="' + f(b) + '" fill="#138808"/>' +
          chakra(W / 2, H / 2, f(b * 0.75 / 2 * 1), '#000080') +
          '<rect width="' + W + '" height="' + H + '" fill="none" stroke="#152238" stroke-opacity=".28" stroke-width="1.2"/>' +
        '</g>' +
      '</g></svg>';
  }

  /* ================================================================ RATH */
  function deity(cx, baseY, s, o) {
    var bw = 30 * s, bh = 58 * s, top = baseY - bh, hy = top - 18 * s, g = '';
    /* arms (flat, extended — the iconic form) */
    g += '<rect x="' + f(cx - bw / 2 - 17 * s) + '" y="' + f(top + 6 * s) + '" width="' + f(bw + 34 * s) + '" height="' + f(9 * s) + '" rx="' + f(4.5 * s) + '" fill="' + o.face + '" stroke="' + INK + '" stroke-width="1.3"/>';
    /* body cloth */
    g += '<rect x="' + f(cx - bw / 2) + '" y="' + f(top) + '" width="' + f(bw) + '" height="' + f(bh) + '" rx="' + f(6 * s) + '" fill="' + o.body + '" stroke="' + INK + '" stroke-width="1.4"/>';
    g += '<rect x="' + f(cx - bw / 2) + '" y="' + f(baseY - 16 * s) + '" width="' + f(bw) + '" height="' + f(6 * s) + '" fill="' + o.trim + '"/>';
    g += '<rect x="' + f(cx - bw / 2) + '" y="' + f(baseY - 28 * s) + '" width="' + f(bw) + '" height="' + f(3 * s) + '" fill="' + o.trim + '" opacity=".8"/>';
    /* flower garland */
    var gc = ['#F28C28', '#FFFFFF', '#C62828', '#F4C542', '#FFFFFF', '#F28C28'];
    for (var i = 0; i < 6; i++) g += '<circle cx="' + f(cx - 12 * s + i * 4.8 * s) + '" cy="' + f(top + 20 * s + Math.sin(i / 5 * Math.PI) * 7 * s) + '" r="' + f(3.2 * s) + '" fill="' + gc[i] + '" stroke="' + INK + '" stroke-width=".6"/>';
    /* serpent hoods (Balabhadra) or round mukuta */
    if (o.hood) {
      for (var k = -3; k <= 3; k++) {
        var a = k * 20 * Math.PI / 180, hx = cx + Math.sin(a) * 25 * s, hyy = hy - Math.cos(a) * 20 * s + 3 * s;
        g += '<ellipse cx="' + f(hx) + '" cy="' + f(hyy) + '" rx="' + f(6.2 * s) + '" ry="' + f(9 * s) + '" transform="rotate(' + (k * 20) + ' ' + f(hx) + ' ' + f(hyy) + ')" fill="#2E3440" stroke="#D4AF37" stroke-width="1.1"/>';
      }
    }
    /* head */
    g += '<ellipse cx="' + cx + '" cy="' + f(hy) + '" rx="' + f(21 * s) + '" ry="' + f(23 * s) + '" fill="' + o.face + '" stroke="' + INK + '" stroke-width="1.5"/>';
    if (!o.hood) {
      g += '<ellipse cx="' + cx + '" cy="' + f(hy - 24 * s) + '" rx="' + f(11 * s) + '" ry="' + f(6 * s) + '" fill="#F4C542" stroke="' + INK + '" stroke-width="1.1"/>';
      g += '<path d="M' + f(cx - 6 * s) + ' ' + f(hy - 28 * s) + 'l' + f(6 * s) + ' ' + f(-8 * s) + 'l' + f(6 * s) + ' ' + f(8 * s) + 'z" fill="' + o.crown + '" stroke="' + INK + '" stroke-width="1"/>';
    }
    /* forehead mark */
    g += '<ellipse cx="' + cx + '" cy="' + f(hy - 13 * s) + '" rx="' + f(2.6 * s) + '" ry="' + f(3.4 * s) + '" fill="#C62828"/>';
    /* large round eyes */
    [-1, 1].forEach(function (d) {
      var ex = cx + d * 9.5 * s, ey = hy - 1 * s;
      g += '<circle cx="' + f(ex) + '" cy="' + f(ey) + '" r="' + f(9.2 * s) + '" fill="#F4C542" stroke="' + INK + '" stroke-width="1.2"/>' +
           '<circle cx="' + f(ex) + '" cy="' + f(ey) + '" r="' + f(7 * s) + '" fill="#FFFFFF"/>' +
           '<circle cx="' + f(ex) + '" cy="' + f(ey) + '" r="' + f(3.9 * s) + '" fill="#0E0E14"/>' +
           '<circle cx="' + f(ex - 1.2 * s) + '" cy="' + f(ey - 1.3 * s) + '" r="' + f(1.2 * s) + '" fill="#FFFFFF"/>';
    });
    g += '<path d="M' + f(cx - 2 * s) + ' ' + f(hy + 9 * s) + 'q' + f(2 * s) + ' ' + f(3 * s) + ' ' + f(4 * s) + ' 0" stroke="' + INK + '" stroke-width="1.2" fill="none" opacity=".8"/>';
    g += '<ellipse cx="' + cx + '" cy="' + f(hy + 15 * s) + '" rx="' + f(5 * s) + '" ry="' + f(2.4 * s) + '" fill="#C62828" stroke="' + INK + '" stroke-width=".8"/>';
    return g;
  }

  function rath() {
    var i, s = '<svg class="lt-art-svg" viewBox="0 0 520 340" aria-hidden="true" focusable="false">' +
      '<defs>' +
        '<pattern id="ltStripe" width="22" height="10" patternUnits="userSpaceOnUse"><rect width="22" height="10" fill="#C62828"/><rect x="5.5" width="5.5" height="10" fill="#F4C542"/><rect x="11" width="5.5" height="10" fill="#347C59"/><rect x="16.5" width="5.5" height="10" fill="#1E1E24"/></pattern>' +
        '<linearGradient id="ltWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9482B"/><stop offset="1" stop-color="#8E1B1B"/></linearGradient>' +
      '</defs>';
    s += '<ellipse cx="270" cy="326" rx="236" ry="8" fill="' + INK + '" opacity=".16"/>';
    /* ropes */
    s += '<g stroke="#7A4B0A" stroke-width="3" fill="none" stroke-linecap="round"><path d="M70 250Q40 262 6 270"/><path d="M70 258Q42 274 10 284"/></g>';
    [[28, 262], [22, 272]].forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.6" fill="#C62828"/>'; });
    /* wheels (drawn first; chassis overlaps their tops) */
    [[120], [260], [400]].forEach(function (w) {
      var cx = w[0], cy = 290, sp = '';
      for (i = 0; i < 16; i++) { var a = i * 22.5 * Math.PI / 180; sp += '<line x1="' + f(cx + Math.cos(a) * 9) + '" y1="' + f(cy + Math.sin(a) * 9) + '" x2="' + f(cx + Math.cos(a) * 31) + '" y2="' + f(cy + Math.sin(a) * 31) + '" stroke="#C62828" stroke-width="3.2" stroke-linecap="round"/>'; }
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="37" fill="#F4C542" stroke="#6B3410" stroke-width="3.5"/><circle cx="' + cx + '" cy="' + cy + '" r="31" fill="#FFF3C4" stroke="#6B3410" stroke-width="1.5"/>' + sp +
           '<circle cx="' + cx + '" cy="' + cy + '" r="9" fill="#C62828" stroke="#6B3410" stroke-width="2"/><circle cx="' + cx + '" cy="' + cy + '" r="3" fill="#F4C542"/>';
    });
    /* chassis */
    s += '<rect x="62" y="236" width="396" height="36" rx="5" fill="url(#ltWood)" stroke="' + INK + '" stroke-width="2.4"/>';
    for (i = 0; i < 17; i++) s += '<path d="M' + (82 + i * 22.5) + ' 254l7-9 7 9-7 9z" fill="#F4C542" stroke="' + INK + '" stroke-width=".9"/>';
    s += '<rect x="62" y="236" width="396" height="6" fill="#F4C542" stroke="' + INK + '" stroke-width="1.2"/>';
    /* back wall + pillars */
    s += '<rect x="102" y="128" width="316" height="108" fill="#4F1420" stroke="' + INK + '" stroke-width="2"/>' +
         '<rect x="102" y="128" width="316" height="108" fill="none" stroke="#F4C542" stroke-width="1.5" stroke-dasharray="2 6" opacity=".7"/>';
    /* deities: Balabhadra (tallest), Subhadra (smallest, centre), Jagannath */
    s += deity(172, 236, 1.12, { face: '#F7F3EA', body: '#F4C542', trim: '#C62828', crown: '#C62828', hood: true });
    s += deity(262, 236, 0.9,  { face: '#F4C542', body: '#F28C28', trim: '#C62828', crown: '#C62828' });
    s += deity(352, 236, 1.04, { face: '#1D1D26', body: '#C62828', trim: '#F4C542', crown: '#F4C542' });
    [[102], [214], [310], [418]].forEach(function (p) {
      s += '<rect x="' + (p[0] - 6) + '" y="124" width="12" height="116" fill="url(#ltWood)" stroke="' + INK + '" stroke-width="1.6"/><rect x="' + (p[0] - 9) + '" y="226" width="18" height="10" fill="#F4C542" stroke="' + INK + '" stroke-width="1.2"/>';
    });
    /* tiered striped canopy */
    var tiers = [[124, 98, 112, 408], [98, 72, 134, 386], [72, 48, 164, 356]];
    tiers.forEach(function (t, n) {
      var yb = t[0], yt = t[1], xl = t[2], xr = t[3], inset = (n === 2) ? 36 : 28;
      s += '<path d="M' + (xl - 14) + ' ' + yb + 'L' + (xl + inset) + ' ' + yt + 'H' + (xr - inset) + 'L' + (xr + 14) + ' ' + yb + 'Z" fill="url(#ltStripe)" stroke="' + INK + '" stroke-width="2"/>';
      s += '<path d="M' + (xl - 14) + ' ' + yb + 'L' + (xr + 14) + ' ' + yb + '" stroke="#F4C542" stroke-width="5"/>';
      for (var q = 0; q < 14; q++) { var bx = xl - 8 + q * ((xr - xl + 16) / 13); s += '<path d="M' + f(bx - 5) + ' ' + (yb + 2) + 'h10l-5 10z" fill="' + (q % 2 ? '#F4C542' : '#C62828') + '" stroke="' + INK + '" stroke-width=".7"/>'; }
    });
    /* kalasha + pennant */
    s += '<path d="M244 48q16-6 32 0l-4 -14h-24z" fill="#F4C542" stroke="' + INK + '" stroke-width="1.5"/><ellipse cx="260" cy="30" rx="11" ry="10" fill="#F4C542" stroke="' + INK + '" stroke-width="1.5"/>' +
         '<rect x="258.6" y="2" width="2.8" height="20" fill="' + INK + '"/>' +
         '<g class="lt-rath-flag"><path d="M261 3l30 7-30 8z" fill="#C62828" stroke="' + INK + '" stroke-width="1"/></g>';
    return s + '</svg>';
  }

  /* ================================================================ DURGA */
  function durga() {
    var i, skin = '#F2B880', s = '<svg class="lt-art-svg" viewBox="0 0 320 360" aria-hidden="true" focusable="false">' +
      '<defs>' +
        '<linearGradient id="ltGoldG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9A0"/><stop offset="1" stop-color="#D4AF37"/></linearGradient>' +
        '<linearGradient id="ltSariG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D6342E"/><stop offset="1" stop-color="#8E1B1B"/></linearGradient>' +
      '</defs>';
    /* chalchitra arch */
    s += '<path d="M24 352V162C24 70 84 12 160 12S296 70 296 162V352Z" fill="url(#ltGoldG)" stroke="#7A4B0A" stroke-width="3"/>' +
         '<path d="M46 352V166C46 90 96 36 160 36S274 90 274 166V352Z" fill="#7E1A1F" stroke="#F4C542" stroke-width="2.5"/>' +
         '<path d="M36 352V164C36 80 90 24 160 24S284 80 284 164V352" fill="none" stroke="#FFF8E7" stroke-width="2" stroke-dasharray="1 7" stroke-linecap="round"/>' +
         '<circle cx="160" cy="12" r="8" fill="#F4C542" stroke="#7A4B0A" stroke-width="2"/>';
    /* halo */
    s += '<circle class="lt-halo" cx="160" cy="104" r="48" fill="#FFD86B" stroke="#D4AF37" stroke-width="3"/><circle cx="160" cy="104" r="40" fill="none" stroke="#FFF3C4" stroke-width="1.6" stroke-dasharray="2 5"/>';
    /* ten arms with attributes */
    var L = [[74, 70], [56, 114], [54, 160], [68, 204], [96, 234]], R = [[246, 70], [264, 114], [266, 160], [252, 204], [224, 234]];
    function arm(sx, sy, hx, hy) {
      var cx = sx + (hx - sx) * 0.62, cy = sy + (hy - sy) * 0.18 - 10;
      return '<path d="M' + sx + ' ' + sy + 'Q' + f(cx) + ' ' + f(cy) + ' ' + hx + ' ' + hy + '" stroke="' + INK + '" stroke-width="12" fill="none" stroke-linecap="round"/>' +
             '<path d="M' + sx + ' ' + sy + 'Q' + f(cx) + ' ' + f(cy) + ' ' + hx + ' ' + hy + '" stroke="' + skin + '" stroke-width="8.6" fill="none" stroke-linecap="round"/>';
    }
    L.forEach(function (h) { s += arm(140, 160, h[0], h[1]); });
    R.forEach(function (h) { s += arm(180, 160, h[0], h[1]); });
    /* weapons / symbols (simplified) */
    function trishul(x, y, len) { return '<g stroke="#7A4B0A" fill="none" stroke-linecap="round"><path d="M' + x + ' ' + (y + 6) + 'V' + (y - len) + '" stroke-width="3" stroke="#B8860B"/><path d="M' + (x - 8) + ' ' + (y - len + 10) + 'q0-12 8-14q8 2 8 14M' + x + ' ' + (y - len + 2) + 'v-14" stroke="#F4C542" stroke-width="3"/></g>'; }
    s += trishul(246, 72, 46);                                                                       // R0
    s += '<g transform="translate(264 106)"><circle r="12" fill="none" stroke="#F4C542" stroke-width="4"/><circle r="4" fill="#C62828"/><path d="M0-12V12M-12 0H12M-8.5-8.5L8.5 8.5M8.5-8.5L-8.5 8.5" stroke="#F4C542" stroke-width="1.6"/></g>'; // R1 chakra
    s += '<path d="M268 160L292 112" stroke="#8C98A6" stroke-width="5" stroke-linecap="round"/><path d="M268 160L292 112" stroke="#E5EAF0" stroke-width="2" stroke-linecap="round"/><path d="M262 164l14-3" stroke="#B8860B" stroke-width="4" stroke-linecap="round"/>'; // R2 sword
    s += '<g transform="translate(252 196)"><path d="M0 0q-9-4-8-14q8 2 8 14zM0 0q9-4 8-14q-8 2-8 14zM0 0q-3-6 0-16q3 10 0 16z" fill="#F7A8C4" stroke="#B03A6B" stroke-width="1.2"/></g>'; // R3 lotus
    s += '<path d="M224 236L214 322" stroke="#B8860B" stroke-width="4" stroke-linecap="round"/><path d="M203 314q11 12 22 2M214 322v-12" stroke="#F4C542" stroke-width="3.4" fill="none" stroke-linecap="round"/>'; // R4 trident to demon
    s += '<g transform="translate(74 66)"><path d="M0 8q-14 0-14-12t12-14q10 0 12 10q-6-4-10 0q-2 8 6 10q-2 6-6 6z" fill="#FFF8E7" stroke="' + INK + '" stroke-width="1.2"/></g>';          // L0 conch
    s += '<path d="M56 114L38 82" stroke="#8B5A2B" stroke-width="4" stroke-linecap="round"/><circle cx="36" cy="78" r="8" fill="#B8860B" stroke="' + INK + '" stroke-width="1.2"/>'; // L1 mace
    s += '<circle cx="46" cy="162" r="15" fill="#F4C542" stroke="' + INK + '" stroke-width="1.6"/><circle cx="46" cy="162" r="6" fill="#C62828" stroke="' + INK + '" stroke-width="1"/>'; // L2 shield
    s += '<path d="M68 204L40 238" stroke="#8B5A2B" stroke-width="3.4" stroke-linecap="round"/><path d="M36 244l6-14l8 4z" fill="#C9D3DE" stroke="' + INK + '" stroke-width="1"/>';         // L3 spear
    s += '<circle cx="96" cy="234" r="6" fill="' + skin + '" stroke="' + INK + '" stroke-width="1.3"/>';                                                                            // L4 blessing hand
    L.concat(R).forEach(function (h) { s += '<circle cx="' + h[0] + '" cy="' + h[1] + '" r="6.4" fill="' + skin + '" stroke="' + INK + '" stroke-width="1.3"/>'; });
    /* lion (left) and demon (right) at the base */
    s += '<g><ellipse cx="108" cy="300" rx="46" ry="21" fill="#E8A33C" stroke="' + INK + '" stroke-width="2"/>' +
         '<rect x="76" y="306" width="12" height="30" rx="5" fill="#E8A33C" stroke="' + INK + '" stroke-width="1.6"/><rect x="124" y="306" width="12" height="30" rx="5" fill="#E8A33C" stroke="' + INK + '" stroke-width="1.6"/>' +
         '<path d="M152 296q26-4 22-26" stroke="#B86B1E" stroke-width="6" fill="none" stroke-linecap="round"/>' +
         '<circle cx="66" cy="292" r="25" fill="#B86B1E" stroke="' + INK + '" stroke-width="1.8"/><circle cx="66" cy="294" r="17" fill="#F0B24C" stroke="' + INK + '" stroke-width="1.6"/>' +
         '<circle cx="59" cy="289" r="2.6" fill="#1a0f0a"/><circle cx="73" cy="289" r="2.6" fill="#1a0f0a"/><path d="M62 299q4 4 8 0" stroke="' + INK + '" stroke-width="1.6" fill="none"/><path d="M66 293v4" stroke="' + INK + '" stroke-width="1.6"/></g>';
    s += '<g><ellipse cx="206" cy="332" rx="34" ry="9" fill="#5C8A4D" stroke="' + INK + '" stroke-width="1.6"/><circle cx="238" cy="326" r="10" fill="#5C8A4D" stroke="' + INK + '" stroke-width="1.6"/>' +
         '<path d="M231 318q-6-8-2-12M245 318q6-8 2-12" stroke="#F4EEDC" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="235" cy="325" r="1.6" fill="#1a0f0a"/><circle cx="242" cy="325" r="1.6" fill="#1a0f0a"/></g>';
    /* torso, blouse, sari */
    s += '<path d="M104 340Q112 262 124 196L196 196Q208 262 216 340Z" fill="url(#ltSariG)" stroke="' + INK + '" stroke-width="2"/>' +
         '<path d="M112 322Q160 334 208 322" fill="none" stroke="#F4C542" stroke-width="5"/><path d="M140 202L132 330M180 202L188 330" stroke="#F4C542" stroke-width="1.6" stroke-dasharray="2 5" fill="none"/>' +
         '<path d="M126 152Q160 140 194 152L200 198Q160 210 120 198Z" fill="#F4C542" stroke="' + INK + '" stroke-width="2"/>' +
         '<path d="M130 150L196 206" stroke="#C62828" stroke-width="9" stroke-linecap="round" opacity=".92"/><path d="M130 150L196 206" stroke="#F4C542" stroke-width="2" stroke-dasharray="3 4" fill="none"/>';
    var gc = ['#F28C28', '#FFFFFF', '#C62828', '#FFFFFF', '#F28C28', '#C62828', '#FFFFFF'];
    for (i = 0; i < 7; i++) { var t = i / 6; s += '<circle cx="' + f(138 + t * 44) + '" cy="' + f(156 + Math.sin(t * Math.PI) * 34) + '" r="4.2" fill="' + gc[i] + '" stroke="' + INK + '" stroke-width=".8"/>'; }
    /* neck + head */
    s += '<rect x="151" y="126" width="18" height="30" rx="6" fill="' + skin + '" stroke="' + INK + '" stroke-width="1.6"/>' +
         '<path d="M134 102Q130 66 160 62Q190 66 186 102Q176 80 160 80Q144 80 134 102Z" fill="#1A0F0A"/>' +
         '<ellipse cx="160" cy="104" rx="22" ry="27" fill="' + skin + '" stroke="' + INK + '" stroke-width="1.8"/>' +
         '<path d="M136 86Q160 70 184 86Q176 74 160 72Q144 74 136 86Z" fill="#1A0F0A"/>';
    /* crown (mukut) */
    s += '<path d="M128 86L132 58L148 68L160 34L172 68L188 58L192 86Z" fill="url(#ltGoldG)" stroke="#7A4B0A" stroke-width="2.2" stroke-linejoin="round"/>' +
         '<circle cx="160" cy="62" r="4.4" fill="#C62828" stroke="#7A4B0A" stroke-width="1.2"/><circle cx="143" cy="76" r="3.2" fill="#347C59"/><circle cx="177" cy="76" r="3.2" fill="#347C59"/><path d="M128 86h64" stroke="#7A4B0A" stroke-width="2.4"/>';
    /* face: two eyes + third eye, brows, nose, lips, bindi, earrings */
    s += '<path d="M141 100q9-8 18 0M161 100q9-8 18 0" stroke="#1A0F0A" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
         '<path d="M143 105q7-6 14 0q-7 5-14 0zM163 105q7-6 14 0q-7 5-14 0z" fill="#FFFFFF" stroke="#1A0F0A" stroke-width="1.3"/><circle cx="150" cy="105" r="2.6" fill="#1A0F0A"/><circle cx="170" cy="105" r="2.6" fill="#1A0F0A"/>' +
         '<path d="M160 90v6" stroke="#C62828" stroke-width="3.2" stroke-linecap="round"/><circle cx="160" cy="84" r="3" fill="#C62828"/>' +
         '<path d="M160 106v10q-3 2-5 0" stroke="#8A5A33" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
         '<path d="M151 124q9 6 18 0q-9-3-18 0z" fill="#B3262C" stroke="#7A1620" stroke-width="1.1"/>' +
         '<circle cx="137" cy="116" r="4.2" fill="#F4C542" stroke="#7A4B0A" stroke-width="1"/><circle cx="183" cy="116" r="4.2" fill="#F4C542" stroke="#7A4B0A" stroke-width="1"/>';
    /* lotus pedestal */
    s += '<path d="M44 338Q160 322 276 338L292 354H28Z" fill="url(#ltGoldG)" stroke="#7A4B0A" stroke-width="2.4"/>';
    for (i = 0; i < 11; i++) s += '<path d="M' + (46 + i * 22.4) + ' 354q11-16 22.4 0z" fill="#F7A8C4" stroke="#B03A6B" stroke-width="1.2"/>';
    return s + '</svg>';
  }

  LT.art = LT.art || {};
  LT.art.durga = durga; LT.art.rath = rath; LT.art.flag = flag; LT.art._chakra = chakra;
})(window);
