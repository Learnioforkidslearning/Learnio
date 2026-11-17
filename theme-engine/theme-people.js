/* Learnio Theme Engine — FESTIVAL PEOPLE & SCENES
   A tiny flat-cartoon "person" generator (front-facing, kid-friendly) used to compose:
     LT.art.banner(festival)  — wide scene above the hero  (idol/flag/rath + people)
     LT.art.crowd(festival, 'l'|'r') — side crowds that fill the background gutters
   Attire is culturally specific: Bengali dhuti-panjabi & red-bordered white saree (lal-par), dhak players,
   school-uniform students, children, Odia devotees. Pure inline SVG, no images, decorative only. */
(function (global) {
  'use strict';
  var LT = global.LearnioTheme = global.LearnioTheme || {};
  var A = LT.art = LT.art || {};
  var INK = '#4A2A1A';
  function n(v) { return Math.round(v * 10) / 10; }

  /* ------------------------------------------------------------ one person
     o: x,y(feet),s(scale), kind: man|woman|boy|girl|student|studentG, pose, top (shirt/blouse colour), skin, hair,
        bottom (trousers/skirt), elder, topi, kid, flagIn, gamchha, dhak                                              */
  var POSES = {
    down:    [[-25, -84, -25, -62], [25, -84, 25, -62]],
    namaste: [[-27, -90, -3, -97], [27, -90, 3, -97]],
    clap:    [[-24, -92, -4, -93], [24, -92, 4, -93]],
    wave:    [[-25, -84, -25, -62], [33, -121, 32, -148]],
    waveB:   [[-33, -121, -32, -148], [33, -121, 32, -148]],
    salute:  [[-25, -84, -25, -62], [35, -113, 13, -136]],
    flag:    [[-25, -84, -25, -62], [31, -112, 28, -138]],
    rope:    [[-27, -92, -14, -82], [27, -92, 14, -82]],
    hold:    [[-26, -90, -11, -86], [26, -90, 11, -86]],
    dhak:    [[-31, -96, -28, -83], [31, -104, 37, -100]]
  };

  function person(o) {
    var s = o.s || 1, kid = o.kind === 'boy' || o.kind === 'girl' || o.kid, hk = kid ? 1.28 : 1, kind = o.kind || 'man';
    var sk = o.skin || '#E6AE84', hair = o.hair || '#1D1510', top = o.top || '#F4C542', pose = o.pose || 'down';
    var hr = 21 * hk, hcy = -112 - hr + 5, g = '<g transform="translate(' + n(o.x) + ' ' + n(o.y) + ') scale(' + s + ')">';
    g += '<ellipse cx="0" cy="1" rx="30" ry="4.5" fill="#000" opacity=".14"/>';
    var feetSk = '<ellipse cx="-9" cy="-1" rx="8" ry="3.6" fill="' + sk + '"/><ellipse cx="9" cy="-1" rx="8" ry="3.6" fill="' + sk + '"/>';
    var shoes = '<ellipse cx="-9" cy="-1.5" rx="8.5" ry="4" fill="#2B2B33"/><ellipse cx="9" cy="-1.5" rx="8.5" ry="4" fill="#2B2B33"/>';

    /* back hair / bun */
    if (kind === 'woman') g += '<circle cx="0" cy="' + n(hcy - hr - 4) + '" r="' + n(hr * 0.5) + '" fill="' + hair + '"/>';
    if (kind === 'girl' || kind === 'studentG') { [-1, 1].forEach(function (d) { g += '<circle cx="' + n(d * hr * 1.0) + '" cy="' + n(hcy + 5) + '" r="' + n(hr * 0.32) + '" fill="' + hair + '"/><circle cx="' + n(d * hr * 0.86) + '" cy="' + n(hcy - 4) + '" r="3" fill="#C62828"/>'; }); }

    /* lower garment + torso */
    if (kind === 'man') {
      g += '<path d="M-20 -66L-24 -6Q0 1 24 -6L20 -66Z" fill="#FBF7EE" stroke="#B8A88C" stroke-width="1"/><path d="M-6 -62L-8 -8M6 -62L8 -8" stroke="#DCD0B8" stroke-width="1.3"/>' + feetSk;
      g += '<path d="M-21 -112Q0 -118 21 -112L25 -52L-25 -52Z" fill="' + top + '" stroke="' + INK + '" stroke-width=".8"/><path d="M0 -112V-88" stroke="' + INK + '" stroke-width="1" opacity=".5"/>';
      if (o.gamchha) g += '<path d="M-19 -108L22 -64" stroke="#C62828" stroke-width="7" stroke-linecap="round"/><path d="M-19 -108L22 -64" stroke="#fff" stroke-width="2" stroke-dasharray="3 3" stroke-linecap="round"/>';
    } else if (kind === 'woman') {
      g += '<path d="M-19 -68L-26 -5Q0 2 26 -5L19 -68Z" fill="#FFFDF7" stroke="#C9B9A0" stroke-width="1"/><path d="M-26 -5Q0 2 26 -5L27 -12Q0 -5 -27 -12Z" fill="#C62828"/><path d="M-5 -64L-7 -14M6 -64L8 -14" stroke="#E2D6C0" stroke-width="1.2"/>' + feetSk;
      g += '<rect x="-19" y="-112" width="38" height="42" rx="11" fill="' + top + '" stroke="' + INK + '" stroke-width=".8"/>';
      g += '<path d="M-19 -108L23 -64L23 -50L8 -62L-19 -94Z" fill="#FFFDF7" stroke="#C62828" stroke-width="2.4" stroke-linejoin="round"/>';
    } else if (kind === 'boy') {
      g += '<path d="M-13 -60L-14 -2M13 -60L14 -2" stroke="#FBF7EE" stroke-width="12" stroke-linecap="round"/>' + feetSk;
      g += '<path d="M-21 -112Q0 -118 21 -112L24 -48L-24 -48Z" fill="' + top + '" stroke="' + INK + '" stroke-width=".8"/>';
    } else if (kind === 'girl') {
      g += '<path d="M-11 -38L-11 -3M11 -38L11 -3" stroke="' + sk + '" stroke-width="8" stroke-linecap="round"/><ellipse cx="-11" cy="-1.5" rx="7" ry="3.4" fill="#C62828"/><ellipse cx="11" cy="-1.5" rx="7" ry="3.4" fill="#C62828"/>';
      g += '<path d="M-18 -112L-19 -92L-34 -36L34 -36L19 -92L18 -112Z" fill="' + top + '" stroke="' + INK + '" stroke-width=".8"/><path d="M-30 -42Q0 -34 30 -42" stroke="#F4C542" stroke-width="3" fill="none"/>';
    } else {                       /* student / studentG uniform */
      var bt = o.bottom || '#1F2A5A';
      if (kind === 'student') g += '<rect x="-18" y="-64" width="14" height="62" rx="4" fill="' + bt + '"/><rect x="4" y="-64" width="14" height="62" rx="4" fill="' + bt + '"/>' + shoes;
      else g += '<path d="M-11 -34L-11 -4M11 -34L11 -4" stroke="' + sk + '" stroke-width="8" stroke-linecap="round"/>' + shoes + '<path d="M-20 -66L-28 -32L28 -32L20 -66Z" fill="' + bt + '" stroke="#12183a" stroke-width=".8"/><path d="M-9 -64L-13 -33M0 -64V-33M9 -64L13 -33" stroke="#12183a" stroke-width="1" opacity=".5"/>';
      g += '<path d="M-20 -112Q0 -118 20 -112L20 -60L-20 -60Z" fill="#FFFFFF" stroke="#C7D0DC" stroke-width="1"/><path d="M-3 -110L3 -110L5 -80L0 -74L-5 -80Z" fill="#C62828"/>';
      g += '<path d="M-20 -104L20 -104" stroke="#FF9933" stroke-width="3" opacity="0"/>';
    }

    /* arms: sleeve (upper) + skin (forearm) + hand */
    var P = POSES[pose] || POSES.down, sl = (kind === 'woman' || kind === 'girl') ? top : (kind === 'student' || kind === 'studentG' ? '#FFFFFF' : top);
    [[-19, P[0]], [19, P[1]]].forEach(function (a) {
      var sx = a[0], p = a[1];
      g += '<path d="M' + sx + ' -106L' + p[0] + ' ' + p[1] + '" stroke="' + sl + '" stroke-width="10.5" stroke-linecap="round"/><path d="M' + sx + ' -106L' + p[0] + ' ' + p[1] + '" stroke="' + INK + '" stroke-width=".01" opacity="0"/>' +
           '<path d="M' + p[0] + ' ' + p[1] + 'L' + p[2] + ' ' + p[3] + '" stroke="' + sk + '" stroke-width="7.8" stroke-linecap="round"/><circle cx="' + p[2] + '" cy="' + p[3] + '" r="5" fill="' + sk + '"/>';
      if (kind === 'woman') g += '<circle cx="' + n(p[2] + (p[2] > 0 ? -5 : 5)) + '" cy="' + n(p[3] + 4) + '" r="2.6" fill="#fff" stroke="#C62828" stroke-width="1.4"/>';   // shakha-pola bangles
    });

    /* extras: dhak drum, flag */
    if (o.dhak) {
      g += '<path d="M-17 -108L-34 -84M17 -108L34 -84" stroke="#C62828" stroke-width="3"/>';
      g += '<rect x="-38" y="-92" width="76" height="30" rx="15" fill="#9A5B2B" stroke="' + INK + '" stroke-width="1.4"/><rect x="-6" y="-92" width="12" height="30" fill="#C62828"/><rect x="-38" y="-80" width="76" height="4" fill="#F4C542" opacity=".9"/>';
      g += '<ellipse cx="-38" cy="-77" rx="6" ry="15" fill="#F2E3C6" stroke="' + INK + '" stroke-width="1.2"/><ellipse cx="38" cy="-77" rx="6" ry="15" fill="#F2E3C6" stroke="' + INK + '" stroke-width="1.2"/>';
      g += '<path d="M0 -92Q-8 -112 -20 -118M0 -92Q0 -116 -4 -124M0 -92Q8 -112 20 -118" stroke="#FFFFFF" stroke-width="3.2" fill="none" stroke-linecap="round"/>';
      g += '<path d="M37 -100L56 -126" stroke="#E8D5A8" stroke-width="3" stroke-linecap="round"/><path d="M-28 -83L-48 -96" stroke="#E8D5A8" stroke-width="3" stroke-linecap="round"/>';
    }
    if (o.flagIn) {
      g += '<path d="M28 -138V-206" stroke="#7A5A2A" stroke-width="2.6"/><g transform="translate(29 -206)"><rect width="30" height="6.7" fill="#FF9933"/><rect y="6.7" width="30" height="6.6" fill="#fff"/><rect y="13.3" width="30" height="6.7" fill="#138808"/><circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" stroke-width=".8"/></g>';
    }

    /* head */
    g += '<rect x="-5" y="' + n(hcy + hr - 4) + '" width="10" height="12" fill="' + sk + '"/>';
    g += '<circle cx="0" cy="' + n(hcy) + '" r="' + n(hr) + '" fill="' + sk + '" stroke="#8A5A3A" stroke-width=".9"/>';
    g += '<path d="M' + n(-hr) + ' ' + n(hcy - 2) + 'Q' + n(-hr) + ' ' + n(hcy - hr - 4) + ' 0 ' + n(hcy - hr - 3) + 'Q' + n(hr) + ' ' + n(hcy - hr - 4) + ' ' + n(hr) + ' ' + n(hcy - 2) + 'Q' + n(hr * 0.62) + ' ' + n(hcy - hr * 0.5) + ' 0 ' + n(hcy - hr * 0.52) + 'Q' + n(-hr * 0.62) + ' ' + n(hcy - hr * 0.5) + ' ' + n(-hr) + ' ' + n(hcy - 2) + 'Z" fill="' + (o.elder ? '#E8E8EC' : hair) + '"/>';
    if (o.topi) g += '<path d="M' + n(-hr * 0.92) + ' ' + n(hcy - hr * 0.5) + 'L' + n(-hr * 0.8) + ' ' + n(hcy - hr * 1.12) + 'L' + n(hr * 0.8) + ' ' + n(hcy - hr * 1.12) + 'L' + n(hr * 0.92) + ' ' + n(hcy - hr * 0.5) + 'Q0 ' + n(hcy - hr * 0.7) + ' ' + n(-hr * 0.92) + ' ' + n(hcy - hr * 0.5) + 'Z" fill="#FFFFFF" stroke="#C9C9C9" stroke-width="1"/>';
    var ey = hcy + hr * 0.08, ex = hr * 0.38;
    g += '<circle cx="' + n(-ex) + '" cy="' + n(ey) + '" r="' + n(1.9 * Math.sqrt(hk)) + '" fill="#2B1A12"/><circle cx="' + n(ex) + '" cy="' + n(ey) + '" r="' + n(1.9 * Math.sqrt(hk)) + '" fill="#2B1A12"/>';
    g += '<path d="M' + n(-ex - 3) + ' ' + n(ey - 5) + 'q3-2 6 0M' + n(ex - 3) + ' ' + n(ey - 5) + 'q3-2 6 0" stroke="#3a2418" stroke-width="1.1" fill="none" opacity=".7"/>';
    g += '<path d="M-5 ' + n(hcy + hr * 0.46) + 'Q0 ' + n(hcy + hr * 0.7) + ' 5 ' + n(hcy + hr * 0.46) + '" stroke="#8A2F1F" stroke-width="1.7" fill="none" stroke-linecap="round"/>';
    g += '<circle cx="' + n(-hr * 0.62) + '" cy="' + n(hcy + hr * 0.38) + '" r="3.2" fill="#F08A7A" opacity=".35"/><circle cx="' + n(hr * 0.62) + '" cy="' + n(hcy + hr * 0.38) + '" r="3.2" fill="#F08A7A" opacity=".35"/>';
    if (kind === 'woman' || kind === 'girl') g += '<circle cx="0" cy="' + n(hcy - hr * 0.4) + '" r="1.9" fill="#C62828"/>';
    if (kind === 'woman') g += '<path d="M0 ' + n(hcy - hr * 0.92) + 'V' + n(hcy - hr * 0.62) + '" stroke="#C62828" stroke-width="1.6"/>';        // sindoor
    if (o.elder && kind === 'man') g += '<path d="M-6 ' + n(hcy + hr * 0.36) + 'Q0 ' + n(hcy + hr * 0.26) + ' 6 ' + n(hcy + hr * 0.36) + '" stroke="#C5C5CC" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
    return g + '</g>';
  }


  /* ------------------------------------------------------------ scene helpers */
  var SK = ['#F2C29B', '#E2A877', '#C98C5C', '#A9693F'];
  function sk(i) { return SK[i % SK.length]; }
  function nest(svg, x, y, w, h) {
    var vb = svg.match(/viewBox="([^"]+)"/)[1];
    return svg.replace(/^<svg[^>]*>/, '<svg x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" viewBox="' + vb + '" overflow="visible">');
  }
  function bunting(x1, y1, x2, y2, sag, cols, count) {
    var mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + sag, o = '<path d="M' + x1 + ' ' + y1 + 'Q' + mx + ' ' + (my + sag) + ' ' + x2 + ' ' + y2 + '" stroke="#7A4B0A" stroke-width="1.6" fill="none"/>';
    for (var i = 0; i < count; i++) {
      var t = (i + 0.5) / count, x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2, y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * (my + sag) + t * t * y2;
      o += '<path d="M' + n(x - 8) + ' ' + n(y) + 'l16 0l-8 17z" fill="' + cols[i % cols.length] + '" stroke="#5a3a1a" stroke-width=".6"/>';
    }
    return o;
  }
  function lantern(x, y, col) {
    return '<g><path d="M' + x + ' ' + (y - 26) + 'V' + y + '" stroke="#B8860B" stroke-width="1.6"/><rect x="' + (x - 8) + '" y="' + y + '" width="16" height="4" fill="#B8860B"/><path d="M' + (x - 9) + ' ' + (y + 4) + 'h18q5 14 0 26h-18q-5-12 0-26z" fill="' + col + '" stroke="#B8860B" stroke-width="1.3"/><path d="M' + x + ' ' + (y + 4) + 'v26" stroke="#7a1a1a" stroke-width="1" opacity=".5"/><rect x="' + (x - 8) + '" y="' + (y + 30) + '" width="16" height="3" fill="#B8860B"/></g>';
  }
  function balloon(x, y, r, col) {
    return '<path d="M' + x + ' ' + (y + r * 1.25) + 'Q' + (x + 6) + ' ' + (y + r * 2.6) + ' ' + (x - 3) + ' ' + (y + r * 4) + '" stroke="#8a7a66" stroke-width="1" fill="none"/>' +
           '<ellipse cx="' + x + '" cy="' + y + '" rx="' + r + '" ry="' + n(r * 1.25) + '" fill="' + col + '" stroke="rgba(0,0,0,.18)" stroke-width="1"/><ellipse cx="' + n(x - r * 0.35) + '" cy="' + n(y - r * 0.4) + '" rx="' + n(r * 0.18) + '" ry="' + n(r * 0.3) + '" fill="#fff" opacity=".45"/><path d="M' + (x - 3) + ' ' + n(y + r * 1.25) + 'l3 4l3-4z" fill="' + col + '"/>';
  }
  function kite(x, y, col1, col2) {
    return '<path d="M' + x + ' ' + (y - 28) + 'L' + (x + 20) + ' ' + y + 'L' + x + ' ' + (y + 34) + 'L' + (x - 20) + ' ' + y + 'Z" fill="' + col1 + '" stroke="#555" stroke-width="1"/><path d="M' + x + ' ' + (y - 28) + 'V' + (y + 34) + 'M' + (x - 20) + ' ' + y + 'H' + (x + 20) + '" stroke="' + col2 + '" stroke-width="3"/>' +
           '<path d="M' + x + ' ' + (y + 34) + 'q-8 12 0 22t0 22t0 22" stroke="' + col2 + '" stroke-width="2.4" fill="none"/>';
  }
  function kaash(x, y, k) {
    var o = '<g stroke="#F8F4EA" stroke-linecap="round" fill="none" opacity=".95">';
    for (var i = -3; i <= 3; i++) o += '<path d="M' + x + ' ' + y + 'Q' + (x + i * 5) + ' ' + (y - 34 * k) + ' ' + (x + i * 9) + ' ' + (y - 62 * k) + '" stroke-width="2.4"/><path d="M' + (x + i * 9) + ' ' + (y - 62 * k) + 'l' + (i * 1.5) + ' -10" stroke-width="5" opacity=".85"/>';
    return o + '</g>';
  }
  function flagpole(x, topY, col) {
    return '<rect x="' + (x - 1.6) + '" y="' + topY + '" width="3.2" height="' + (512 - topY) + '" fill="#8B6B2E"/><path d="M' + (x + 1.6) + ' ' + (topY + 4) + 'l34 10l-34 14z" fill="' + col + '" stroke="#5a3a1a" stroke-width=".8"/><circle cx="' + x + '" cy="' + (topY - 2) + '" r="4" fill="#F4C542"/>';
  }
  function garland(x1, y1, x2, y2, sag) {
    var o = '', i, mx = (x1 + x2) / 2;
    for (i = 0; i < 14; i++) { var t = i / 13, x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2, y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * (Math.max(y1, y2) + sag * 2) + t * t * y2; o += '<circle cx="' + n(x) + '" cy="' + n(y) + '" r="5" fill="' + (i % 2 ? '#F28C28' : '#F4C542') + '" stroke="#b8630a" stroke-width=".6"/>'; }
    return o;
  }
  function ground(w, y) { return '<ellipse cx="' + w / 2 + '" cy="' + y + '" rx="' + w * 0.5 + '" ry="12" fill="#6B4A2A" opacity=".16"/>'; }

  /* ------------------------------------------------------------ BANNER (760 × 400) */
  function banner(festival) {
    var s = '<svg class="lt-art-svg" viewBox="0 0 760 400" aria-hidden="true" focusable="false">', Y = 392;
    var P = person;
    if (festival === 'durga-puja') {
      s += bunting(0, 14, 760, 14, 16, ['#C62828', '#F4C542', '#347C59', '#F28C28', '#FFFFFF'], 26) + lantern(176, 44, '#F28C28') + lantern(584, 44, '#C62828');
      s += ground(760, 394);
      s += '<rect x="196" y="334" width="368" height="46" rx="4" fill="#8E1B1B" stroke="#F4C542" stroke-width="3"/><path d="M206 358h348" stroke="#F4C542" stroke-width="2" stroke-dasharray="2 8" stroke-linecap="round"/><rect x="176" y="378" width="408" height="14" rx="3" fill="#B5502B" stroke="#6b2a14" stroke-width="2"/>';
      s += nest(A.durga(), 246, 36, 268, 301);
      s += kaash(10, Y, 1.2) + kaash(748, Y, 1.2);
      s += P({ x: 52, y: Y, kind: 'woman', top: '#C62828', pose: 'namaste', skin: sk(1) });
      s += P({ x: 132, y: Y, s: 1.05, kind: 'man', top: '#FFFFFF', pose: 'dhak', dhak: 1, gamchha: 1, skin: sk(2) });
      s += P({ x: 188, y: Y, s: 0.64, kind: 'boy', top: '#F28C28', pose: 'clap', skin: sk(1) });
      s += P({ x: 572, y: Y, s: 0.64, kind: 'girl', top: '#E5533D', pose: 'waveB', skin: sk(2) });
      s += P({ x: 628, y: Y, s: 1.05, kind: 'man', top: '#FFFFFF', pose: 'dhak', dhak: 1, gamchha: 1, skin: sk(1) });
      s += P({ x: 706, y: Y, kind: 'woman', top: '#F4C542', pose: 'namaste', skin: sk(3) });
    } else if (festival === 'independence-day') {
      s += bunting(0, 10, 330, 40, 10, ['#FF9933', '#FFFFFF', '#138808'], 11) + bunting(760, 10, 450, 40, 10, ['#FF9933', '#FFFFFF', '#138808'], 11);
      s += balloon(48, 96, 17, '#FF9933') + balloon(78, 78, 17, '#FFFFFF') + balloon(104, 104, 17, '#138808') + balloon(690, 92, 17, '#138808') + balloon(718, 112, 17, '#FF9933') + balloon(664, 112, 17, '#FFFFFF');
      s += ground(760, 394);
      /* flag on pole: exact 3:2, chakra 3/4 of white band */
      var fx = 334, fy = 26, W = 270, H = 180, b = H / 3;
      s += '<rect x="' + (fx - 5) + '" y="12" width="8" height="380" rx="3" fill="#C9B37A" stroke="#8A6D1D" stroke-width="1.2"/><circle cx="' + (fx - 1) + '" cy="10" r="8" fill="#F4C542" stroke="#8A6D1D" stroke-width="1.5"/>';
      s += '<g class="lt-flag-static" transform="translate(' + (fx + 3) + ' ' + fy + ')"><rect width="' + W + '" height="' + n(b) + '" fill="#FF9933"/><rect y="' + n(b) + '" width="' + W + '" height="' + n(b) + '" fill="#FFFFFF"/><rect y="' + n(b * 2) + '" width="' + W + '" height="' + n(b) + '" fill="#138808"/>' + A._chakra(W / 2, H / 2, n(b * 0.75 / 2), '#000080') + '<rect width="' + W + '" height="' + H + '" fill="none" stroke="#152238" stroke-opacity=".28"/></g>';
      s += P({ x: 100, y: Y, s: 1.05, kind: 'man', top: '#FFFFFF', pose: 'wave', elder: 1, topi: 1, hair: '#ddd', skin: sk(0) });
      s += P({ x: 172, y: Y, kind: 'student', pose: 'salute', skin: sk(2) });
      s += P({ x: 238, y: Y, kind: 'studentG', pose: 'flag', flagIn: 1, skin: sk(1) });
      s += P({ x: 290, y: Y, s: 0.64, kind: 'boy', top: '#FF9933', pose: 'waveB', skin: sk(1) });
      s += P({ x: 400, y: Y, kind: 'woman', top: '#FF9933', pose: 'wave', skin: sk(2) });
      s += P({ x: 462, y: Y, s: 0.64, kind: 'girl', top: '#138808', pose: 'waveB', skin: sk(3) });
      s += P({ x: 520, y: Y, kind: 'student', pose: 'flag', flagIn: 1, skin: sk(1) });
      s += P({ x: 596, y: Y, s: 1.05, kind: 'man', top: '#FF9933', pose: 'clap', skin: sk(2) });
      s += P({ x: 668, y: Y, kind: 'studentG', pose: 'salute', skin: sk(2) });
      s += P({ x: 724, y: Y, s: 0.64, kind: 'boy', top: '#138808', pose: 'wave', skin: sk(1) });
    } else if (festival === 'rath-yatra') {
      s += bunting(0, 12, 760, 12, 14, ['#C62828', '#F4C542', '#347C59', '#F28C28'], 26);
      s += ground(760, 394);
      s += nest(A.rath(), 200, 62, 520, 340);
      s += '<g stroke="#7A4B0A" stroke-width="4" fill="none" stroke-linecap="round"><path d="M208 334Q130 340 60 312"/><path d="M210 346Q130 352 62 322" stroke-width="3.4"/></g>';
      s += P({ x: 176, y: Y, s: 0.64, kind: 'boy', top: '#F4C542', pose: 'rope', skin: sk(1) });
      s += P({ x: 134, y: Y, kind: 'man', top: '#F28C28', pose: 'rope', skin: sk(2) });
      s += P({ x: 84, y: Y, kind: 'man', top: '#C62828', pose: 'rope', skin: sk(1) });
      s += P({ x: 36, y: Y, kind: 'woman', top: '#F4C542', pose: 'rope', skin: sk(3) });
      s += P({ x: 706, y: Y, kind: 'man', top: '#F4C542', pose: 'namaste', skin: sk(2) });
      s += P({ x: 748, y: Y, s: 0.64, kind: 'girl', top: '#347C59', pose: 'waveB', skin: sk(1) });
    }
    return s + '</svg>';
  }

  /* ------------------------------------------------------------ SIDE CROWDS (340 × 520) */
  function crowd(festival, side) {
    var s = '<svg class="lt-art-svg" viewBox="0 0 340 520" aria-hidden="true" focusable="false">', Y = 512, P = person, L = side === 'l';
    s += ground(340, 514);
    if (festival === 'durga-puja') {
      s += L ? bunting(0, 24, 340, 90, 8, ['#C62828', '#F4C542', '#347C59', '#F28C28'], 11) + lantern(40, 90, '#F28C28') + lantern(120, 150, '#C62828') + kaash(8, Y, 1.5)
             : bunting(340, 24, 0, 90, 8, ['#C62828', '#F4C542', '#347C59', '#F28C28'], 11) + lantern(300, 90, '#C62828') + lantern(224, 160, '#F28C28') + kaash(332, Y, 1.5);
      s += L ? P({ x: 58, y: Y, s: 1.3, kind: 'woman', top: '#C62828', pose: 'namaste', skin: sk(1) }) + P({ x: 152, y: Y, s: 1.3, kind: 'man', top: '#2E86AB', pose: 'namaste', skin: sk(2) }) + P({ x: 236, y: Y, s: 0.82, kind: 'girl', top: '#E5533D', pose: 'clap', skin: sk(1) })
             : P({ x: 112, y: Y, s: 0.82, kind: 'boy', top: '#F28C28', pose: 'clap', skin: sk(1) }) + P({ x: 200, y: Y, s: 1.28, kind: 'man', top: '#FFFFFF', pose: 'dhak', dhak: 1, gamchha: 1, skin: sk(2) }) + P({ x: 288, y: Y, s: 1.3, kind: 'woman', top: '#F4C542', pose: 'hold', skin: sk(3) });
    } else if (festival === 'independence-day') {
      s += L ? balloon(44, 220, 20, '#FF9933') + balloon(78, 196, 20, '#FFFFFF') + balloon(112, 232, 20, '#138808') + kite(250, 120, '#FF9933', '#138808') + bunting(0, 20, 340, 70, 8, ['#FF9933', '#FFFFFF', '#138808'], 12)
             : balloon(296, 220, 20, '#138808') + balloon(262, 196, 20, '#FFFFFF') + balloon(228, 232, 20, '#FF9933') + kite(90, 120, '#138808', '#FF9933') + bunting(340, 20, 0, 70, 8, ['#FF9933', '#FFFFFF', '#138808'], 12);
      s += L ? P({ x: 56, y: Y, s: 1.3, kind: 'student', pose: 'salute', skin: sk(2) }) + P({ x: 144, y: Y, s: 1.3, kind: 'studentG', pose: 'flag', flagIn: 1, skin: sk(1) }) + P({ x: 232, y: Y, s: 1.28, kind: 'woman', top: '#FF9933', pose: 'wave', skin: sk(3) })
             : P({ x: 284, y: Y, s: 1.3, kind: 'man', top: '#FFFFFF', pose: 'wave', elder: 1, topi: 1, hair: '#ddd', skin: sk(0) }) + P({ x: 196, y: Y, s: 1.3, kind: 'studentG', pose: 'salute', skin: sk(2) }) + P({ x: 118, y: Y, s: 0.82, kind: 'boy', top: '#138808', pose: 'waveB', skin: sk(1) });
    } else if (festival === 'rath-yatra') {
      s += L ? flagpole(24, 150, '#C62828') + flagpole(300, 220, '#F4C542') + bunting(0, 30, 340, 74, 8, ['#C62828', '#F4C542', '#347C59', '#F28C28'], 11) + garland(10, 100, 200, 120, 10)
             : flagpole(316, 150, '#C62828') + flagpole(40, 220, '#F4C542') + bunting(340, 30, 0, 74, 8, ['#C62828', '#F4C542', '#347C59', '#F28C28'], 11) + garland(330, 100, 140, 120, 10);
      s += L ? P({ x: 70, y: Y, s: 1.3, kind: 'man', top: '#F28C28', pose: 'namaste', skin: sk(2) }) + P({ x: 156, y: Y, s: 1.3, kind: 'woman', top: '#F4C542', pose: 'namaste', skin: sk(1) }) + P({ x: 238, y: Y, s: 0.82, kind: 'girl', top: '#347C59', pose: 'waveB', skin: sk(2) })
             : P({ x: 270, y: Y, s: 1.3, kind: 'man', top: '#C62828', pose: 'namaste', skin: sk(1) }) + P({ x: 184, y: Y, s: 1.3, kind: 'woman', top: '#E5533D', pose: 'namaste', skin: sk(3) }) + P({ x: 104, y: Y, s: 0.82, kind: 'boy', top: '#F4C542', pose: 'clap', skin: sk(1) });
    }
    return s + '</svg>';
  }

  A.banner = banner;
  A.crowd = crowd;
})(window);
