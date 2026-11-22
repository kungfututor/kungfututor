/* HYROX station data + animation clips for KungfuTutor.com
 * Weights and standards checked against the official HYROX page
 * (hyrox.com/the-fitness-race) and the HYROX Single Rulebook 26/27.
 * Rules are written in our own words (summaries, not copied text).
 */
(function (w) {
  'use strict';
  var S = w.KTFigure.S, C = S.col;

  /* ---------------- divisions ---------------- */
  var WO = { push: '102', pull: '78', fc: '2 × 16', lunge: '10', wb: '4', tgt: '2.70', tgtM: [2.7] };
  var MO = { push: '152', pull: '103', fc: '2 × 24', lunge: '20', wb: '6', tgt: '3.00', tgtM: [3.0] };
  var WP = { push: '152', pull: '103', fc: '2 × 24', lunge: '20', wb: '6', tgt: '2.70', tgtM: [2.7] };
  var MP = { push: '202', pull: '153', fc: '2 × 32', lunge: '30', wb: '9', tgt: '3.00', tgtM: [3.0] };
  var MIXD = { push: '152', pull: '103', fc: '2 × 24', lunge: '20', wb: '6', tgt: '2.70 / 3.00', tgtM: [2.7, 3.0] };
  var MIXR = { push: '102 / 152', pull: '78 / 103', fc: '2 × 16 / 2 × 24', lunge: '10 / 20', wb: '4 / 6', tgt: '2.70 / 3.00', tgtM: [2.7, 3.0] };

  var DIVS = [
    { id: 'wo', zh: '女子公開', en: 'Women Open', w: WO, time: '1:20–1:50',
      desc: { zh: '最多人參加的入門組別', en: 'the most popular entry division' } },
    { id: 'wp', zh: '女子菁英', en: 'Women Pro', w: WP, time: '1:10–1:35',
      desc: { zh: '高強度女子競技組別', en: 'high-intensity competitive division' } },
    { id: 'mo', zh: '男子公開', en: 'Men Open', w: MO, time: '1:10–1:40',
      desc: { zh: '最多人參加的入門組別', en: 'the most popular entry division' } },
    { id: 'mp', zh: '男子菁英', en: 'Men Pro', w: MP, time: '1:05–1:30',
      desc: { zh: '高強度競技組別', en: 'high-intensity competitive division' } },
    { id: 'du', zh: '雙人組', en: 'Doubles', time: '1:00–1:30',
      desc: { zh: '兩人一起跑，每站工作量自由分配', en: 'run together, split every station as you like' },
      subs: [{ id: 'w', zh: '女子', en: 'Women', w: WO }, { id: 'm', zh: '男子', en: 'Men', w: MO }, { id: 'x', zh: '混合', en: 'Mixed', w: MIXD }] },
    { id: 're', zh: '四人接力', en: 'Relay', time: '0:55–1:20',
      desc: { zh: '四人各跑 2 × 1 km、各完成 2 站', en: 'each of 4 runs 2 × 1 km and does 2 stations' },
      subs: [{ id: 'w', zh: '女子', en: 'Women', w: WO }, { id: 'm', zh: '男子', en: 'Men', w: MO }, { id: 'x', zh: '混合（女 / 男）', en: 'Mixed (F / M)', w: MIXR }] }
  ];

  /* ---------------- helpers for props painters ---------------- */
  function handsMid(J) { return S.mid(J.hN, J.hF); }
  function knotMarker(p, label) {
    return S.circle(p, 6, C.red, '#fff', 2) + (label ? S.text(p.x, p.y - 12, label, { size: 10, fill: C.red, anchor: 'middle' }) : '');
  }

  /* ---------------- animation clips ---------------- */
  var CLIPS = {};

  // 01 SkiErg — reach tall, hinge and pull down, return
  CLIPS.ski = {
    scale: 0.78, base: { x: 160 }, labelAt: [340, 70],
    frames: [
      { d: 650, p: { t: -4, su: 168, sl: 172, fu: 162, fl: 168, tu: 2, tl: 0, bu: -2, bl: 0 } },
      { d: 260, p: { t: 22, h: -8, su: 95, sl: 60, fu: 90, fl: 55, tu: 22, tl: -14, bu: 18, bl: -14 } },
      { d: 220, p: { t: 46, h: -14, su: -6, sl: 10, fu: -12, fl: 6, tu: 40, tl: -30, bu: 36, bl: -30 } },
      { d: 520, p: { t: 44, h: -14, su: -4, sl: 12, fu: -10, fl: 8, tu: 38, tl: -28, bu: 34, bl: -28 } }
    ],
    still: 0.55,
    props: function (J, c) {
      var gy = c.gy, b = '', fr = '';
      var tx = 238;
      b += S.rect(110, gy - 8, 150, 8, '#D9D7D0', C.ink, 1.5);                   // base plate
      b += S.rect(tx, 30, 16, gy - 38, '#E9E7E1', C.ink, 2);                      // tower
      b += S.rect(tx + 18, 84, 22, 16, '#fff', C.ink, 1.5);                       // monitor
      b += S.circle({ x: tx + 4, y: 44 }, 5, '#fff', C.ink, 2);                   // pulley
      [J.hF, J.hN].forEach(function (h, i) {
        b += S.line({ x: tx + 4, y: 44 }, h, i ? '#555' : '#999', 1.5);
        fr += S.line({ x: h.x, y: h.y - 5 }, { x: h.x, y: h.y + 9 }, i ? C.red : '#c77', 5);
      });
      return { back: b, front: fr };
    }
  };

  // 02 Sled push — 4-step drive, sled travels with the hands
  function runLegs(a, b) { return { tu: a[0], tl: a[1], bu: b[0], bl: b[1] }; }
  function merge(x, y) { var o = {}, k; for (k in x) o[k] = x[k]; for (k in y) o[k] = y[k]; return o; }
  var PUSH_ARMS = { t: 58, h: -32, su: 100, sl: 96, fu: 97, fl: 93 };
  CLIPS.push = {
    scale: 0.78, base: merge({ x: 140 }, PUSH_ARMS), advance: 44, labelAt: [330, 64],
    frames: [
      { d: 230, p: merge(runLegs([58, 6], [-30, -36]), { s: 0 }) },
      { d: 230, p: merge(runLegs([20, -18], [34, -52]), { s: 11 }) },
      { d: 230, p: merge(runLegs([-30, -36], [58, 6]), { s: 22 }) },
      { d: 230, p: merge(runLegs([34, -52], [20, -18]), { s: 33 }) }
    ],
    props: function (J, c) {
      var gy = c.gy, h = handsMid(J), x0 = h.x + 2, out = '';
      out += S.line({ x: x0, y: h.y - 4 }, { x: x0, y: gy - 14 }, C.ink, 4);     // upright poles
      out += S.rect(x0 - 6, gy - 16, 82, 13, '#D9D7D0', C.ink, 2);                 // sled tray
      out += S.line({ x: x0 + 76, y: gy - 16 }, { x: x0 + 84, y: gy - 3 }, C.ink, 3);
      out += S.rect(x0 + 24, gy - 46, 12, 30, C.ink, 'none', 0, ' rx="2"');        // plates
      out += S.rect(x0 + 40, gy - 50, 12, 34, C.red, 'none', 0, ' rx="2"');
      out += S.rect(x0 + 56, gy - 42, 10, 26, C.ink, 'none', 0, ' rx="2"');
      out += S.line({ x: x0 - 6, y: gy - 2 }, { x: x0 + 80, y: gy - 2 }, C.ink, 3);
      return { front: out };
    }
  };

  // 03 Sled pull — hand-over-hand, sled comes closer, then resets
  var pullFrames = [];
  (function () {
    var n = 10, i;
    for (i = 0; i <= n; i++) {
      var odd = i % 2;
      pullFrames.push({ d: i === n ? 300 : 360, p: {
        t: odd ? -24 : -14, h: 8,
        su: odd ? -28 : 78, sl: odd ? 42 : 84, fu: odd ? 78 : -28, fl: odd ? 84 : 42,
        sledX: 392 - i * 15, sledO: i === n ? 0 : 1
      } });
    }
    pullFrames[0].p.sledO = 0.0001;
    pullFrames[1].p.sledO = 1;
  })();
  CLIPS.pull = {
    scale: 0.78, base: { x: 120, tu: 24, tl: 12, bu: -20, bl: -8 }, labelAt: [330, 64],
    frames: pullFrames, still: 0.3,
    props: function (J, c) {
      var gy = c.gy, p = c.pose, sx = p.sledX, op = Math.max(0, Math.min(1, p.sledO));
      var h = handsMid(J), b = '', fr = '';
      // racers box
      b += S.rect(58, gy - 2, 118, 6, 'rgba(217,45,32,.12)', C.red, 1, ' stroke-dasharray="4 3"');
      b += S.text(117, gy + 20, 'RACERS BOX', { size: 9, fill: C.red, anchor: 'middle', ls: '0.08em' });
      // rope pile behind athlete grows as the sled comes in
      var len = Math.max(0, 392 - sx) * 0.28, pile = [], x;
      for (x = 0; x <= len; x += 6) pile.push({ x: 92 - x, y: gy - 3 - (Math.floor(x / 6) % 2 ? 4 : 0) });
      if (pile.length > 1) b += S.poly(pile, '#8a6d3b', 2.5);
      b += S.line(h, { x: 92, y: gy - 3 }, '#8a6d3b', 2.5);
      // rope to sled + sled
      fr += S.line(h, { x: sx, y: gy - 12 }, '#8a6d3b', 2.5, ' opacity="' + op + '"');
      fr += '<g opacity="' + op + '">' +
        S.rect(sx, gy - 16, 54, 13, '#D9D7D0', C.ink, 2) +
        S.rect(sx + 14, gy - 44, 12, 28, C.ink, 'none', 0, ' rx="2"') +
        S.rect(sx + 30, gy - 40, 12, 24, C.red, 'none', 0, ' rx="2"') + '</g>';
      return { back: b, front: fr };
    }
  };

  // 04 Burpee broad jump — chest to floor, jump forward
  CLIPS.burpee = {
    scale: 0.72, base: { x: 160 }, advance: 92, labelAt: [340, 64], still: 0.3,
    frames: [
      { d: 260, p: { t: 0, su: 5, sl: 8, fu: -5, fl: -2, tu: 2, tl: 0, bu: -2, bl: 0, s: 0 } },
      { d: 220, p: { t: 66, h: -20, su: 4, sl: -4, fu: 0, fl: -8, tu: 96, tl: -32, bu: 92, bl: -30, s: 0 } },
      { d: 300, p: { t: 92, h: -40, su: -150, sl: 14, fu: -146, fl: 18, tu: -88, tl: -90, bu: -88, bl: -90, s: 0 } },
      { d: 160, p: { t: 92, h: -40, su: -150, sl: 14, fu: -146, fl: 18, tu: -88, tl: -90, bu: -88, bl: -90, s: 0 } },
      { d: 240, p: { t: 66, h: -20, su: 4, sl: -4, fu: 0, fl: -8, tu: 96, tl: -32, bu: 92, bl: -30, s: 0 } },
      { d: 200, p: { t: 40, h: -10, su: -45, sl: -35, fu: -50, fl: -40, tu: 72, tl: -46, bu: 70, bl: -46, s: 0 }, e: 'in' },
      { d: 230, p: { lift: 40, t: 18, su: 122, sl: 116, fu: 116, fl: 110, tu: 46, tl: -42, bu: 42, bl: -42, s: 46 }, e: 'out' },
      { d: 260, p: { t: 40, h: -8, su: 70, sl: 60, fu: 64, fl: 54, tu: 74, tl: -36, bu: 70, bl: -36, s: 92 } }
    ],
    props: function (J, c) {
      var chest = S.mid(J.sh, J.hip, 0.2);
      if (Math.abs(chest.y - c.gy) < 7) return { front: knotMarker({ x: chest.x, y: c.gy - 4 }) };
      return {};
    }
  };

  // 05 Row — legs, body, arms; then arms, body, legs
  var FOOT = { x: 300, y: 194 };
  function row(x, t, hx, hy) { return { x: x, y: 184, t: t, hN: { x: hx, y: hy }, hF: { x: hx + 3, y: hy + 1 }, fN: FOOT, fF: { x: 303, y: 194 } }; }
  CLIPS.row = {
    scale: 1, ground: false, ticks: false, base: { x: 230, y: 184 }, labelAt: [110, 60], still: 0.35,
    frames: [
      { d: 380, p: row(262, 28, 344, 160) },
      { d: 260, p: row(222, 18, 318, 158) },
      { d: 260, p: row(215, -22, 232, 150) },
      { d: 160, p: row(215, -22, 232, 150) },
      { d: 300, p: row(216, -18, 300, 160) },
      { d: 300, p: row(228, 24, 330, 160) },
      { d: 420, p: row(262, 28, 344, 160) }
    ],
    props: function (J, c) {
      var b = '', fr = '', hip = J.hip, h = handsMid(J);
      b += S.line({ x: 140, y: 200 }, { x: 382, y: 200 }, C.ink, 4);                 // rail
      b += S.line({ x: 150, y: 200 }, { x: 150, y: 214 }, C.ink, 3);
      b += S.line({ x: 372, y: 200 }, { x: 372, y: 214 }, C.ink, 3);
      b += S.line({ x: 120, y: 214 }, { x: 410, y: 214 }, C.ink, 2.5);                // floor
      b += S.circle({ x: 366, y: 176 }, 22, '#E9E7E1', C.ink, 2.5);                   // flywheel
      b += S.line({ x: 366, y: 154 }, { x: 350, y: 112 }, C.ink, 3);                  // monitor arm
      b += S.rect(334, 98, 30, 18, '#fff', C.ink, 2);
      b += S.line({ x: 292, y: 202 }, { x: 306, y: 182 }, C.ink, 4);                  // footplate
      b += S.rect(hip.x - 14, hip.y + 3, 28, 8, C.ink, 'none', 0, ' rx="2"');         // seat
      fr += S.line({ x: 350, y: 172 }, h, '#555', 1.5);                                // chain
      fr += S.line({ x: h.x, y: h.y - 7 }, { x: h.x, y: h.y + 7 }, C.red, 5);          // handle
      return { back: b, front: fr };
    }
  };

  // 06 Farmers carry — walking with two kettlebells
  CLIPS.carry = {
    scale: 0.78, base: { x: 170, t: 3, h: -3, su: 2, sl: 0, fu: -2, fl: 0 }, advance: 52, labelAt: [330, 64],
    frames: [
      { d: 270, p: merge(runLegs([24, 6], [-18, -28]), { s: 0 }) },
      { d: 270, p: merge(runLegs([4, -2], [22, -38]), { s: 13 }) },
      { d: 270, p: merge(runLegs([-18, -28], [24, 6]), { s: 26 }) },
      { d: 270, p: merge(runLegs([22, -38], [4, -2]), { s: 39 }) }
    ],
    props: function (J) {
      function kb(h, col) {
        var c = { x: h.x, y: h.y + 13 };
        return S.line({ x: h.x - 5, y: h.y + 4 }, { x: h.x - 5, y: h.y - 1 }, col, 2.5) +
          S.line({ x: h.x - 5, y: h.y - 1 }, { x: h.x + 5, y: h.y - 1 }, col, 2.5) +
          S.line({ x: h.x + 5, y: h.y - 1 }, { x: h.x + 5, y: h.y + 4 }, col, 2.5) +
          S.circle(c, 9, col === C.ink ? C.red : '#E3B4AF', col, 2);
      }
      return { back: kb(J.hF, '#8F95A3'), front: kb(J.hN, C.ink) };
    }
  };

  // 07 Sandbag lunges — knee kisses the floor, alternate legs
  var BAG = { su: 30, sl: 168, fu: 24, fl: 164 };
  CLIPS.lunge = {
    scale: 0.78, base: merge({ x: 170, t: 0, h: -2 }, BAG), advance: 140, labelAt: [330, 64], still: 0.2,
    frames: [
      { d: 320, p: { tu: 2, tl: 0, bu: -2, bl: 0, s: 0 } },
      { d: 260, p: { tu: 90, tl: 1, bu: -1, bl: -100, s: 35 } },
      { d: 220, p: { tu: 90, tl: 1, bu: -1, bl: -100, s: 35 } },
      { d: 320, p: { tu: 2, tl: 0, bu: -2, bl: 0, s: 70 } },
      { d: 260, p: { bu: 90, bl: 1, tu: -1, tl: -100, s: 105 } },
      { d: 220, p: { bu: 90, bl: 1, tu: -1, tl: -100, s: 105 } }
    ],
    props: function (J, c) {
      var sh = J.sh, out = S.rect(sh.x - 22, sh.y - 7, 34, 13, C.red, C.ink, 1.5, ' rx="3"');
      var k = J.kN.y > J.kF.y ? J.kN : J.kF;
      if (c.gy - k.y < 8) out += knotMarker({ x: k.x, y: c.gy - 4 });
      return { front: out };
    }
  };

  // 08 Wall balls — squat below parallel, throw to target, catch
  CLIPS.wallball = {
    scale: 0.56, base: { x: 160 }, labelAt: [90, 50], still: 0.4,
    frames: [
      { d: 300, p: { t: 2, su: 24, sl: 166, fu: 20, fl: 160, ballIn: 1 } },
      { d: 360, p: { t: 34, h: -16, su: 46, sl: 176, fu: 40, fl: 170, tu: 102, tl: -24, bu: 98, bl: -24, ballIn: 1 } },
      { d: 180, p: { t: 4, h: -26, su: 155, sl: 150, fu: 150, fl: 146, ballIn: 1 }, e: 'out' },
      { d: 380, p: { t: 2, h: -26, su: 150, sl: 152, fu: 146, fl: 148, ballIn: 0 }, e: 'out' },
      { d: 280, p: { t: 2, h: -10, su: 120, sl: 150, fu: 116, fl: 146, ballIn: 1 }, e: 'in' }
    ],
    props: function (J, c) {
      var gy = c.gy, pxm = 174 / 3.0, b = '', fr = '';
      var tg = (c.info.targets || [3.0]);
      b += S.rect(292, 18, 14, gy - 18, '#E9E7E1', C.ink, 2);
      tg.forEach(function (m, i) {
        var y = gy - m * pxm;
        b += S.line({ x: 270, y: y }, { x: 292, y: y }, C.red, 3);
        b += S.circle({ x: 281, y: y }, 7, 'none', C.red, 2);
        b += S.text(312, y + 4, m.toFixed(2) + ' m', { size: 11, fill: C.red });
      });
      var top = gy - tg[tg.length - 1] * pxm;
      var hm = S.mid(J.hN, J.hF), ballIn = Math.max(0, Math.min(1, c.pose.ballIn));
      var target = { x: 272, y: top };
      var bp = S.mid(target, { x: hm.x + 4, y: hm.y - 6 }, ballIn);
      if (ballIn < 1) bp.y -= Math.sin(Math.PI * (1 - ballIn)) * 18;  // a little arc
      fr += S.circle(bp, 8, C.red, C.ink, 2);
      var hipBelow = J.hip.y > Math.min(J.kN.y, J.kF.y) + 1;
      if (hipBelow) fr += knotMarker(J.hip);
      return { back: b, front: fr };
    }
  };

  /* ---------------- stations (bilingual) ---------------- */
  var STATIONS = [
    { n: 1, clip: 'ski', zh: '滑雪機', en: 'SkiErg',
      spec: function (d, L) { return '1,000 m · ' + (KT.pick('無負重限制', 'no added load')); },
      dist: '1,000 m',
      load: function (d, L) { return KT.pick('阻力 6（可自行調整）', 'Damper 6 (adjustable)'); },
      tags: { zh: ['基礎動作：雙臂下拉 (Double Pole)', '上肢拉力 · 全身協調'], en: ['Base move: double-pole pull', 'Upper-body pull · coordination'] },
      ability: { zh: '背闊肌與核心爆發', en: 'Lats and core power' },
      note: 'BOTH FEET STAY ON THE BASE',
      move: {
        zh: '雙腳站在滑雪機底座，雙手由頭頂握住把手向下拉，同時屈髖、微屈膝，把身體重量「壓」進把手；拉到大腿兩側後，手臂與身體回到頂端再重複。力量主要來自髖部折疊，不是只靠手臂。',
        en: 'Stand on the SkiErg base, grab the handles overhead and drive them down while you hinge at the hips and soften the knees, dropping your bodyweight into the pull. Finish with the hands beside the thighs, then ride back up tall. The power comes from the hip hinge, not just the arms.' },
      rules: {
        zh: '開始前由裁判重設顯示器。全程雙腳須留在底座上，腳跟可懸空但不可碰地；可以做跳躍式動作，但落地須回到底座。完成 1,000 m 後須雙腳仍在底座並舉手示意，等裁判確認後才可離開。違規：第一次警告，之後每次加罰 15 秒。',
        en: 'A judge resets the monitor first. Both feet must stay on the base the whole time — heels may hang off but must not touch the floor; jumping is fine if you land back on the base. After 1,000 m, keep both feet on the base and raise a hand until the judge confirms. Infringements: a warning first, then +15 s each.' },
      train: {
        zh: '以 4 × 250 m 間歇找出穩定配速；練習「髖部折疊＋手臂下拉」同步；第一站不要衝太快，保留跑步能量。',
        en: 'Use 4 × 250 m intervals to find a pace you can hold; drill the hip-hinge-plus-pull timing; don\'t sprint the first station — save legs for the runs.' },
      bars: [['背闊肌／上背', 'Lats / upper back', 92], ['核心', 'Core', 80], ['心肺', 'Cardio', 85], ['三頭肌', 'Triceps', 68]] },

    { n: 2, clip: 'push', zh: '推雪橇', en: 'Sled Push',
      spec: function (d) { return '50 m (4×12.5 m) · ' + d.push + ' kg'; },
      dist: '50 m',
      load: function (d, L) { return d.push + ' kg' + (KT.pick('（含雪橇）', ' incl. sled')); },
      tags: { zh: ['基礎動作：前傾推進 (Drive)', '下肢爆發 · 最重關卡'], en: ['Base move: leaning drive', 'Leg power · heaviest station'] },
      ability: { zh: '股四頭肌與小腿推蹬力', en: 'Quads and calf drive' },
      note: 'STAY IN YOUR LANE · 4 × 12.5 m',
      move: {
        zh: '雙手握住雪橇直立桿，手臂打直或微彎，身體前傾約 45°，像短跑起步一樣用前腳掌小步、快速地推蹬。背部保持平直、核心收緊，讓雪橇持續移動，避免停下再起動。',
        en: 'Grip the upright poles with straight or slightly bent arms, lean about 45° and drive with short, quick steps on the balls of your feet like a sprint start. Keep the back flat and the core braced, and keep the sled moving — restarting a stopped sled costs the most energy.' },
      rules: {
        zh: '使用裁判指定的賽道；開始前雪橇和選手都須完全在 Racers Box 內；共 4 × 12.5 m，雪橇須整個越過每段終點線才可換方向；不可干擾隔壁賽道。違規：警告後每次加罰 15 秒。',
        en: 'Use the lane the judge assigns; sled and athlete start fully inside the Racers Box; it is 4 × 12.5 m and the whole sled must cross each end line before changing direction; never interfere with the next lane. Infringements: a warning, then +15 s each.' },
      train: {
        zh: '重訓做後蹲舉、保加利亞分腿蹲；練習低姿勢小步推蹬；不同場地地毯摩擦力不同，練習時可用比比賽更重的負荷。',
        en: 'Build with back squats and Bulgarian split squats; drill low, short steps; carpet friction varies by venue, so train heavier than race weight.' },
      bars: [['股四頭肌', 'Quads', 98], ['臀肌', 'Glutes', 90], ['小腿', 'Calves', 84], ['核心', 'Core', 75]] },

    { n: 3, clip: 'pull', zh: '拉雪橇', en: 'Sled Pull',
      spec: function (d) { return '50 m (4×12.5 m) · ' + d.pull + ' kg'; },
      dist: '50 m',
      load: function (d, L) { return d.pull + ' kg' + (KT.pick('（含雪橇）', ' incl. sled')); },
      tags: { zh: ['基礎動作：雙手交替拉繩', '握力 · 後側鏈'], en: ['Base move: hand-over-hand pull', 'Grip · posterior chain'] },
      ability: { zh: '握力、背肌與後側鏈', en: 'Grip, back and posterior chain' },
      note: 'STAND UP · STAY INSIDE THE BOX',
      move: {
        zh: '站在 Racers Box 內，身體略為後傾、雙腳穩穩站開，雙手交替把繩索往後拉，讓雪橇滑向自己；可以後退一步借用體重與腿部力量，把拉過的繩索整理在身後。雪橇過線後，跑到賽道另一端再拉回來。',
        en: 'Stand in the Racers Box, lean back slightly with a solid stance and pull the rope hand over hand so the sled slides to you. Step back to use your bodyweight and legs, and keep the slack rope tidy behind you. When the sled crosses the line, run to the other end and pull it back.' },
      rules: {
        zh: '全程須站立，不可坐著或跪著拉；手持繩索時不可踩到 Racers Box 前後的實線；繩索須留在自己賽道（可延伸到賽道後方）；雪橇須整個越過 12.5 m 線才算完成一段，共 4 段。違規：警告後每次加罰 15 秒。',
        en: 'Stay standing — no sitting or kneeling pulls; while holding the rope don\'t step on the front or back line of the Racers Box; keep the rope in your lane (it may run out of the back); the whole sled must pass the 12.5 m line, 4 times. Infringements: a warning, then +15 s each.' },
      train: {
        zh: '划船、引體向上與死懸垂練握力；用「坐後」的姿勢以腿和體重拉，而不是只靠手臂；練習把繩索整理在身後，避免絆倒。',
        en: 'Rows, pull-ups and dead hangs for grip; sit back and pull with legs and bodyweight, not arms alone; practise stacking the rope behind you so you don\'t trip.' },
      bars: [['握力／前臂', 'Grip / forearms', 95], ['背闊肌', 'Lats', 90], ['腿後肌與臀', 'Hamstrings & glutes', 80], ['核心', 'Core', 74]] },

    { n: 4, clip: 'burpee', zh: '波比跳遠', en: 'Burpee Broad Jumps',
      spec: function (d, L) { return '80 m · ' + (KT.pick('徒手自身體重', 'bodyweight')); },
      dist: '80 m',
      load: function (d, L) { return KT.pick('自身體重', 'Bodyweight'); },
      tags: { zh: ['基礎動作：波比＋立定跳遠', '全身爆發 · 心肺試煉'], en: ['Base move: burpee + broad jump', 'Full-body power · cardio test'] },
      ability: { zh: '全身爆發與心肺耐力', en: 'Full-body power and stamina' },
      note: 'CHEST MUST TOUCH THE GROUND',
      move: {
        zh: '雙手撐地、身體俯臥讓胸口貼地，再跳（或踏）回蹲姿，接著雙腳同時起跳向前跳遠，落地後直接進入下一下波比。重點是保持節奏，跳遠距離適中即可，不必每次跳最遠。',
        en: 'Hands down, lower until your chest touches the floor, jump or step the feet back in, then broad-jump forward taking off and landing on both feet together. Land straight into the next burpee. Rhythm matters more than distance — a medium jump you can repeat beats a huge one.' },
      rules: {
        zh: '每次波比胸口須明確觸地（乳頭線碰地）；起跳和落地須雙腳同時，兩腳前後差不可超過 5 cm，不可多踏小步；下一個波比雙手須放在前腳腳尖前 30 cm 內；從波比起身時腳不可超過指尖；最後須雙腳完全跳過終點線。可以用膝蓋輔助起身。',
        en: 'Chest must clearly touch the floor every rep; take off and land with both feet together (max 5 cm stagger), no extra steps; hands go down within 30 cm of your front toes; when you come out of the burpee your feet may not pass your fingertips; finish by jumping fully over the line. Using a knee to get up is allowed.' },
      train: {
        zh: '用 EMOM（每分鐘固定次數）練習穩定節奏；找出自己最省力的跳遠距離；跑完 1 km 後直接接波比跳遠，習慣疲勞下的動作。',
        en: 'Practise steady EMOM sets; find your most economical jump length; rehearse 1 km run straight into burpee broad jumps.' },
      bars: [['心肺', 'Cardio', 95], ['股四頭／臀肌', 'Quads / glutes', 85], ['胸與三頭肌', 'Chest & triceps', 74], ['核心', 'Core', 80]] },

    { n: 5, clip: 'row', zh: '划船機', en: 'Rowing',
      spec: function (d, L) { return '1,000 m · ' + (KT.pick('無負重限制', 'no added load')); },
      dist: '1,000 m',
      load: function (d, L) { return KT.pick('阻力 6 · 腳踏板第 4 格', 'Damper 6 · footplate 4'); },
      tags: { zh: ['基礎動作：腿 → 身體 → 手', '全身拉力 · 呼吸調節'], en: ['Base move: legs → body → arms', 'Full-body pull · breathing reset'] },
      ability: { zh: '腿推、背拉與心肺耐力', en: 'Leg drive, back pull, stamina' },
      note: 'STAY SEATED UNTIL 1,000 m',
      move: {
        zh: '划槳順序是「腿 → 身體 → 手」：腳先用力推踏板，身體由前傾擺到略為後仰，最後把把手拉到下胸。回程反過來「手 → 身體 → 腿」。大部分力量來自雙腿。',
        en: 'The stroke goes legs → body → arms: push the footplate, swing from a forward lean to a slight lean back, then draw the handle to the lower ribs. Recover in reverse: arms → body → legs. Most of the power comes from the legs.' },
      rules: {
        zh: '開始前由裁判重設顯示器；必須坐在划船機上直到完成 1,000 m；可以停下並把把手放回架上休息，但在裁判確認完成前不可站起或離開座位。阻力預設 6、腳踏板預設第 4 格，可自行調整。',
        en: 'A judge resets the monitor; stay seated until 1,000 m is done; you may stop and rest with the handle in its holder, but don\'t stand or leave the seat until the judge confirms. Damper is preset to 6 and footplates to position 4 — both adjustable.' },
      train: {
        zh: '以 500 m 間歇找出可維持的配速；槳頻約每分鐘 26–30 下；利用這站調整呼吸，為後面的農夫走路做準備。',
        en: 'Use 500 m intervals to learn your sustainable split; aim for about 26–30 strokes per minute; use this station to reset your breathing before the carry.' },
      bars: [['股四頭肌', 'Quads', 86], ['背闊肌', 'Lats', 84], ['心肺', 'Cardio', 90], ['核心', 'Core', 70]] },

    { n: 6, clip: 'carry', zh: '農夫走路', en: 'Farmers Carry',
      spec: function (d) { return '200 m · ' + d.fc + ' kg'; },
      dist: '200 m',
      load: function (d, L) { return d.fc + ' kg' + (KT.pick(' 壺鈴', ' kettlebells')); },
      tags: { zh: ['基礎動作：負重行走', '握力 · 核心穩定'], en: ['Base move: loaded walk', 'Grip · core stability'] },
      ability: { zh: '握力與核心穩定', en: 'Grip and core stability' },
      note: 'ARMS STRAIGHT BY YOUR SIDES',
      move: {
        zh: '雙手各提一個壺鈴，手臂自然垂在身側，挺胸、肩膀下沉、收緊核心，用小而快的步伐前進。眼睛看前方，不要讓壺鈴撞到大腿。可以快走或小跑。',
        en: 'One kettlebell in each hand, arms hanging by your sides, chest up, shoulders down, core tight, and move with short quick steps. Eyes forward and keep the bells off your thighs. Fast walking or a light jog both work.' },
      rules: {
        zh: '由工作站旁的標示框取出並歸還壺鈴；移動時須同時提著兩個壺鈴，手臂伸直在身側；可放下休息，但放下時壺鈴不可往前移；完成後壺鈴須放回正確的框並把手朝上，否則罰 30 秒；用錯重量須重做整站，否則取消資格。',
        en: 'Take and return the bells from the marked box by the station; carry both bells at all times with arms straight by your sides; you may put them down to rest but not move them forward; return them upright in the right box or take a 30 s penalty; using the wrong weight means redoing the station or disqualification.' },
      train: {
        zh: '死懸垂與重壺鈴行走練握力；比賽時盡量一次走完不放下；用短而快的步伐減少晃動。',
        en: 'Dead hangs and heavy carries for grip; try to go unbroken on race day; short quick steps reduce swing.' },
      bars: [['握力', 'Grip', 98], ['斜方肌／上背', 'Traps / upper back', 85], ['核心', 'Core', 80], ['心肺', 'Cardio', 64]] },

    { n: 7, clip: 'lunge', zh: '負重弓箭步', en: 'Sandbag Lunges',
      spec: function (d, L) { return '100 m · ' + d.lunge + ' kg ' + (KT.pick('沙袋', 'sandbag')); },
      dist: '100 m',
      load: function (d, L) { return d.lunge + ' kg' + (KT.pick(' 沙袋', ' sandbag')); },
      tags: { zh: ['基礎動作：弓箭步 (Lunge)', '雙腿交替 · 肌耐力試煉'], en: ['Base move: walking lunge', 'Alternating legs · endurance test'] },
      ability: { zh: '下肢股四頭與臀肌耐力', en: 'Quad and glute endurance' },
      note: 'KNEE MUST TOUCH GROUND',
      move: {
        zh: '把指定重量的沙袋扛在雙肩後方（上背斜方肌處），雙手抓穩兩側，交替向前跨出弓箭步，垂直下蹲到後膝輕碰地面，再站直推進，連續完成 100 公尺。',
        en: 'Rest the sandbag across the back of both shoulders (on the upper traps), hold it steady, and step forward into alternating lunges, dropping straight down until the back knee touches the floor. Stand up tall and keep moving for 100 m.' },
      rules: {
        zh: '每一下後膝須明確觸地；每下結束須站直（膝與髖完全伸直）；左右腳須交替；兩下之間不可多踏小步；沙袋須全程由雙肩承托，不可放在地上或其他地方卸重（每次罰 15 秒）；最後前腳須完全越過終點線，沙袋須放回指定區，否則罰 30 秒。',
        en: 'The back knee must clearly touch the floor each rep; finish each rep standing tall (knees and hips straight); alternate legs; no extra steps between reps; the bag stays on both shoulders — never rested on the floor or anything else (+15 s each time); the front foot must fully cross the finish line and the bag goes back to its area or +30 s.' },
      train: {
        zh: '練習 50 m 行走弓箭步不休息；保持上身直立、步幅一致；這是最後一站前的大腿耐力關鍵。',
        en: 'Build to 50 m of unbroken walking lunges; stay upright with an even stride; this is the leg-endurance gate before the final station.' },
      bars: [['股四頭肌', 'Quads', 98], ['臀大肌耐力', 'Glute endurance', 90], ['平衡與核心', 'Balance & core', 80], ['意志抗壓', 'Mental grit', 90]] },

    { n: 8, clip: 'wallball', zh: '藥球投擲', en: 'Wall Balls',
      spec: function (d, L) { return '100 ' + (KT.pick('次', 'reps')) + ' · ' + d.wb + ' kg'; },
      dist: '100 reps',
      load: function (d, L) { return d.wb + ' kg' + (KT.pick(' 藥球 · 目標 ', ' ball · target ')) + d.tgt + ' m'; },
      tags: { zh: ['基礎動作：深蹲＋上拋', '全身協調 · 最後衝刺'], en: ['Base move: squat + throw', 'Coordination · final push'] },
      ability: { zh: '全身協調與意志力', en: 'Coordination and willpower' },
      note: 'HIPS BELOW KNEES · HIT THE TARGET',
      move: {
        zh: '雙手抱球在胸前站直，深蹲到髖部低於膝蓋，然後用雙腿爆發站起，順勢把球拋向上方目標。接住球後直接進入下一下深蹲。',
        en: 'Stand tall holding the ball at your chest, squat until the hips are below the knees, then drive up with the legs and throw the ball to the target above. Catch it and flow straight into the next squat.' },
      rules: {
        zh: '開始時須站直抱球，不可從地上撿起就直接拋；深蹲時髖部須低於膝蓋；球須擊中自己的目標（女子 2.70 m、男子 3.00 m）；接住球後再開始下一下，或讓球落地後重新站直再開始；不可接彈地球直接續做。違規該下不計（No-rep）。',
        en: 'Start each set standing tall with the ball — no scooping it off the floor straight into a throw; hips must go below the knees; hit your own target (women 2.70 m, men 3.00 m); catch and go, or let it drop and stand tall before the next rep — no catching off the bounce. Any fault is a no-rep.' },
      train: {
        zh: '拆組完成，例如 4 × 25 或 5 × 20，組間休息要短；練習深蹲耐力與呼吸節奏；疲勞時特別注意深蹲深度，避免 No-rep。',
        en: 'Break it up — 4 × 25 or 5 × 20 with short rests; train squat endurance and breathing rhythm; watch your depth when tired to avoid no-reps.' },
      bars: [['股四頭／臀肌', 'Quads / glutes', 90], ['肩膀', 'Shoulders', 85], ['心肺', 'Cardio', 92], ['意志抗壓', 'Mental grit', 95]] }
  ];

  w.HYROX = { DIVS: DIVS, STATIONS: STATIONS, CLIPS: CLIPS };
})(window);
