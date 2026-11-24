/* Gym basics — 10 exercises: squat, deadlift, bench press, overhead press,
 * bent-over row, pull-up, push-up, reverse lunge, plank, glute bridge.
 * Side view, absolute positions (hip x/y + hand/foot targets) so feet, hands
 * and bodies sit exactly on the floor, bench or bar. Our own wording of
 * widely taught strength-training technique.
 */
(function (w) {
  'use strict';
  var S = w.KTFigure.S, C = S.col, D2R = Math.PI / 180;
  function cap(zh, en) { return { zh: zh, en: en }; }
  function m() { var o = {}; for (var i = 0; i < arguments.length; i++) for (var k in arguments[i]) o[k] = arguments[i][k]; return o; }
  var sin = function (a) { return Math.sin(a * D2R); }, cos = function (a) { return Math.cos(a * D2R); };

  var FX = 200, GA = 210;          // ankle x for standing lifts, ankle height on the floor
  var MF = FX + 5;                 // mid-foot: the bar should stay over this line
  var PLATE = 22;                  // plate radius (≈ 45 cm plate)

  function shoulder(hip, t) { return { x: hip.x + 58 * sin(t), y: hip.y - 58 * cos(t) }; }
  // standing pose with both feet planted at the same spot (side view)
  function stand(hip, t, extra) {
    return m({ x: hip.x, y: hip.y, t: t, h: 0, fN: { x: FX + 3, y: GA }, fF: { x: FX - 1, y: GA }, ftN: 90, ftF: 90, kbN: 1, kbF: 1 }, extra);
  }

  /* ---------- squat: bar on the upper back, kept over mid-foot ---------- */
  // legs set by the shin angle s (forward of vertical) and the thigh angle phi (from vertical: 90 = thigh level,
  // over 90 = hip below the knee), so knees travel forward steadily all the way down and are straight at the top
  function squat(s, phi, beginner, tb) {
    var knee = { x: FX + 3 + 44 * sin(s), y: GA - 44 * cos(s) };
    var hip = { x: knee.x - 44 * sin(phi), y: knee.y - 44 * cos(phi) };
    if (beginner) return stand(hip, tb, { su: 90 - tb * 0.3, sl: 90, fu: 86 - tb * 0.3, fl: 88 });
    // torso leans just enough to keep the bar (6 units behind the shoulder line) over mid-foot
    var t = Math.atan2(6, 58) / D2R + Math.asin((MF - hip.x) / Math.sqrt(58 * 58 + 36)) / D2R;
    // hands hold the bar beside the neck: elbows point down and back (angle mode)
    return stand(hip, t, { su: -40 + t, sl: 160 + t, fu: -44 + t, fl: 158 + t });
  }
  /* ---------- deadlift / row: hands on the bar, arms hanging ---------- */
  // arms hanging straight to the bar, shoulders d units in front of it, back at angle t
  function onBar(bar, d, t) {
    var sh = { x: bar.x + d, y: bar.y - Math.sqrt(57.97 * 57.97 - d * d) };
    var hip = { x: sh.x - 58 * sin(t), y: sh.y + 58 * cos(t) };
    return stand(hip, t, { hN: bar, hF: { x: bar.x - 2, y: bar.y } });
  }
  // deadlift start: shins a few degrees forward so the bar touches them, hips a little above the knees,
  // flat back, shoulders slightly in front of the bar, arms straight down to it (64.36° = straight arms)
  function pullStart() {
    var knee = { x: FX + 3 + 44 * sin(6), y: GA - 44 * cos(6) };
    var hip = { x: knee.x - Math.sqrt(44 * 44 - 6 * 6), y: knee.y - 6 };
    return stand(hip, 64.36, { hN: { x: MF, y: 192 }, hF: { x: MF - 2, y: 192 } });
  }
  // early in the pull (bar halfway up the shins): the knees are already moving back (shins 2° forward), so the bar
  // never runs into the shins
  function earlyPull() { return onBar({ x: MF, y: 176 }, 9.7, 60.0); }
  // bar just above the knees: the knees have moved back out of its way (shins upright, knee at the ankle line),
  // back a little more upright than at the start, arms still straight
  function pastKnees() { return onBar({ x: MF, y: 160 }, 8, 50.79); }
  // bar at mid-thigh: hips coming forward, knees about 36° and shins near upright, the bar sliding up the thighs
  function midThigh() { return onBar({ x: MF, y: 140 }, 12, 37.83); }
  // deadlift lockout: standing tall, hips over the feet, knees straight, arms hanging with the bar against the thighs
  function lockPose() {
    var hip = { x: FX + 3, y: GA - 87.95 }, sh = shoulder(hip, 0), bar = { x: sh.x + 5, y: sh.y + Math.sqrt(57.97 * 57.97 - 25) };
    return stand(hip, 0, { hN: bar, hF: { x: bar.x - 2, y: bar.y } });
  }
  // bent-over row: shins upright, hips back until the shoulders sit over the bar (just in front of the knees,
  // over the front of mid-foot), back flat at about 42°. Arms hang straight; the elbows drive back with the
  // forearms upright while the bar slides up the thighs, then the bar comes in to the stomach.
  function rowPose(pull) {
    var t = 42, knee = { x: FX + 3, y: GA - 44 };
    var hip = { x: MF + 4 - 58 * sin(t), y: 0 };
    hip.y = knee.y - Math.sqrt(44 * 44 - (knee.x - hip.x) * (knee.x - hip.x));
    var sh = shoulder(hip, t);
    var hang = { x: sh.x, y: sh.y + 57.9 };                                   // straight arms
    var half = { x: sh.x - 30 * sin(30), y: sh.y + 30 * cos(30) + 28 };          // upper arm 30° back, forearm upright
    var top = { x: hip.x + 0.4 * (sh.x - hip.x) + 9 * cos(t), y: hip.y + 0.4 * (sh.y - hip.y) + 9 * sin(t) };   // on the stomach
    var a = pull <= 0.5 ? hang : half, b = pull <= 0.5 ? half : top, k = pull <= 0.5 ? pull * 2 : pull * 2 - 1;
    var bar = { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
    return stand(hip, t, { hN: bar, hF: { x: bar.x - 2, y: bar.y } });
  }
  /* ---------- overhead press ---------- */
  // standing tall with locked knees; the bar starts on the front of the shoulders and ends straight overhead
  // with straight arms; the forearms stay upright under the bar the whole way (elbows slightly ahead at the start)
  function press(k, h) {          // k: 0 rack → 1 lockout
    var hip = { x: FX + 2, y: GA - 87.9 }, t = -3 - 3 * Math.sin(k * Math.PI);
    var sh = shoulder(hip, t);
    // rack: bar on the front of the shoulders, a little above the shoulder joints (collar-bone height)
    var bar = { x: sh.x + 10 - 4 * k, y: sh.y - 5 - (Math.sqrt(57.98 * 57.98 - 36) - 5) * k };
    var ex = 5 * (1 - k), el = { x: bar.x + ex, y: bar.y + Math.sqrt(28 * 28 - ex * ex) };
    // part-way up the elbows also point out to the sides, so from the side the upper arm looks shorter
    var lu = Math.min(1, Math.sqrt((el.x - sh.x) * (el.x - sh.x) + (el.y - sh.y) * (el.y - sh.y)) / 30);
    var r = limb(sh, bar, 30 * lu, 28, function (a, b) {
      return (a.x - el.x) * (a.x - el.x) + (a.y - el.y) * (a.y - el.y) < (b.x - el.x) * (b.x - el.x) + (b.y - el.y) * (b.y - el.y) ? a : b;
    });
    // angles kept on one side of "straight up" (180°) so the tween between frames never swings the arm the long way round
    var su = r[0] < -90 ? r[0] + 360 : r[0], sl = r[1] < -90 ? r[1] + 360 : r[1];
    return stand(hip, t, { h: h, su: su, sl: sl, fu: su - 1.5, fl: sl - 1.5, luN: lu, luF: lu });
  }
  // two-bone limb from base to target, picking the elbow/knee with pick(a, b) → chosen point; returns absolute angles
  function limb(base, tg, L1, L2, pick) {
    var dx = tg.x - base.x, dy = tg.y - base.y, d0 = Math.sqrt(dx * dx + dy * dy) || 1;
    var d = Math.max(Math.abs(L1 - L2) + 0.01, Math.min(L1 + L2 - 0.01, d0));
    var ux = dx / d0, uy = dy / d0, a = (L1 * L1 - L2 * L2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, L1 * L1 - a * a));
    var b = { x: base.x + ux * a, y: base.y + uy * a };
    var e = pick({ x: b.x - uy * h, y: b.y + ux * h }, { x: b.x + uy * h, y: b.y - ux * h });
    var end = { x: base.x + ux * d, y: base.y + uy * d };
    var A = function (p, q) { return Math.atan2(q.x - p.x, q.y - p.y) / D2R; };
    return [A(base, e), A(e, end)];
  }
  var lowerOf = function (a, b) { return a.y > b.y ? a : b; };
  var leftOf = function (a, b) { return a.x < b.x ? a : b; };
  // lu = apparent upper-arm length (an elbow pointing out towards the viewer looks shorter from the side)
  function arms(sh, hand, pick, lu) {
    lu = lu || 1;
    var r1 = limb(sh, hand, 30 * lu, 28, pick), r2 = limb(sh, { x: hand.x - 3, y: hand.y + 1 }, 30 * lu, 28, pick);
    return { su: r1[0], sl: r1[1], fu: r2[0], fl: r2[1], luN: lu, luF: lu };
  }

  /* ---------- bench press (lying, head to the left) ---------- */
  var BENCH = { hip: { x: 230, y: 164 }, top: 170 };
  function bench(k, arch) {      // k: 0 chest → 1 lockout
    var hip = BENCH.hip, sh = { x: hip.x - 58, y: hip.y - (arch || 0) };
    // bar over the shoulders at the top, on the lower chest at the bottom — there the forearms stand almost
    // upright with the elbows just under the bar
    var bar = { x: sh.x + 20 - 14 * k, y: sh.y - 12 - 44 * k };
    // knees bent up (about bench height), shins near upright, feet flat on the floor
    return m({ x: hip.x, y: hip.y, t: -90 + (arch ? 2 : 0), h: 0,
      fN: { x: hip.x + 46, y: GA }, fF: { x: hip.x + 42, y: GA }, ftN: 90, ftF: 90, kbN: 1, kbF: 1 },
      // elbows tucked about 45° also point out to the side, so the upper arm looks shorter part-way down;
      // that keeps the forearms upright under the bar the whole way
      arms(sh, bar, lowerOf, 0.85 + 0.15 * k - 0.37 * Math.sin(Math.PI * k)));
  }
  /* ---------- pull-up ---------- */
  // bar high enough that a body hanging with straight arms and bent knees keeps its feet off the floor
  var BAR = { x: 205, y: 0 };
  // k: 0 dead hang (straight arms) → 0.08 shoulders pulled down → 1 chin clearly over the bar, bar at the collar-bone.
  // Elbows stay under the hands (forearms upright); part-way up they point out to the sides, so from the side the
  // upper arm looks shorter. onBox: beginner's bottom position, feet resting flat on the box.
  function pullup(k, onBox) {
    var e = Math.max(0, (k - 0.08) / 0.92), t = -5 - 7 * e;
    var sh = { x: BAR.x + 2 - 10 * e, y: BAR.y + 57.96 - 52.96 * e };
    var hip = { x: sh.x - 58 * sin(t), y: sh.y + 58 * cos(t) };
    function arm(hand) {
      var el = { x: hand.x + 2, y: hand.y + 28 }, dx = el.x - sh.x, dy = el.y - sh.y;
      var lu = Math.min(1, Math.sqrt(dx * dx + dy * dy) / 30);
      var r = limb(sh, hand, 30 * lu, 28, function (a, b) {
        return (a.x - el.x) * (a.x - el.x) + (a.y - el.y) * (a.y - el.y) < (b.x - el.x) * (b.x - el.x) + (b.y - el.y) * (b.y - el.y) ? a : b;
      });
      // angles kept on one side of "straight up" so tweens never swing the arm the long way round
      return [r[0] < -90 ? r[0] + 360 : r[0], r[1] < -90 ? r[1] + 360 : r[1], lu];
    }
    var aN = arm({ x: BAR.x + 3, y: BAR.y }), aF = arm({ x: BAR.x - 3, y: BAR.y });
    var feet = onBox ? { fN: { x: 185, y: 182 }, fF: { x: 181, y: 182 }, ftN: 90, ftF: 90 }
      : { fN: { x: hip.x - 16, y: hip.y + 72 }, fF: { x: hip.x - 20, y: hip.y + 70 }, ftN: 20, ftF: 20 };
    return m({ x: hip.x, y: hip.y, t: t, h: 4 * e, su: aN[0], sl: aN[1], luN: aN[2], fu: aF[0], fl: aF[1], luF: aF[2], kbN: 1, kbF: 1 }, feet);
  }
  /* ---------- push-up (head to the right) ---------- */
  var HX = 268;
  function pushup(k, knees) {     // k: 0 top → 1 bottom
    var pivot, len, sh;
    if (knees) { pivot = { x: HX - 2 - 87.7, y: 207 }; len = 102; }
    else { pivot = { x: HX - 2 - 137.9, y: 203 }; len = 146; }
    var shAt = function (y) { return { x: pivot.x + Math.sqrt(len * len - (pivot.y - y) * (pivot.y - y)), y: y }; };
    // top: shoulders high enough that the arms are straight (body pivots on the toes / knees)
    var lo = 140, hi = 175;
    for (var i = 0; i < 30; i++) { var mid = (lo + hi) / 2, s0 = shAt(mid); if (Math.hypot(HX - s0.x, 211 - s0.y) > 57.97) lo = mid; else hi = mid; }
    sh = shAt(lo + (197 - lo) * k);
    var dy = pivot.y - sh.y, dx = sh.x - pivot.x;
    var legL = knees ? 44 : 88;
    var hip = { x: pivot.x + legL / len * dx, y: pivot.y - legL / len * dy };
    var t = Math.atan2(sh.x - hip.x, -(sh.y - hip.y)) / D2R;
    // forearms stay nearly upright (wrists under the elbows, 15° lean); the elbows point back about 45°,
    // so going down the upper arm also points out to the side and looks shorter from the side
    function arm(hand) {
      var el = { x: hand.x - 28 * sin(15), y: hand.y - 28 * cos(15) }, ex = el.x - sh.x, ey = el.y - sh.y;
      var lu = Math.min(1, Math.sqrt(ex * ex + ey * ey) / 30);
      var r = limb(sh, hand, 30 * lu, 28, function (a, b) {
        return (a.x - el.x) * (a.x - el.x) + (a.y - el.y) * (a.y - el.y) < (b.x - el.x) * (b.x - el.x) + (b.y - el.y) * (b.y - el.y) ? a : b;
      });
      return [r[0], r[1], lu];
    }
    var aN = arm({ x: HX, y: 211 }), aF = arm({ x: HX - 3, y: 212 });
    var A = { su: aN[0], sl: aN[1], luN: aN[2], fu: aF[0], fl: aF[1], luF: aF[2] };
    if (knees) {   // knee on the floor, shin raised behind
      var ank = { x: pivot.x - 41, y: pivot.y - 15 };
      var th = Math.atan2(pivot.x - hip.x, pivot.y - hip.y) / D2R, sn = Math.atan2(ank.x - pivot.x, ank.y - pivot.y) / D2R;
      return m({ x: hip.x, y: hip.y, t: t, h: -t + 80, tu: th, tl: sn, bu: th - 1, bl: sn - 2, ftN: -60, ftF: -60 }, A);
    }
    return m({ x: hip.x, y: hip.y, t: t, h: -t + 80,
      fN: { x: pivot.x, y: pivot.y }, fF: { x: pivot.x - 3, y: pivot.y }, ftN: 37, ftF: 37, kbN: 1, kbF: 1 }, A);
  }
  /* ---------- reverse lunge ---------- */
  // front leg built from its shin angle s and thigh angle phi: straight when standing, the shin stays close to
  // upright all the way down (the hips go back and down, the knee does not rock forward), front thigh just above
  // level at the bottom so the back knee stops a few centimetres off the floor
  function lunge(k) {             // k: 0 standing → 1 bottom
    var s = (1 - k) + 2 * Math.sin(Math.PI * k), phi = 2.6 + 83.4 * k;
    var knee = { x: FX + 3 + 44 * sin(s), y: GA - 44 * cos(s) };
    var hip = { x: knee.x - 44 * sin(phi), y: knee.y - 44 * cos(phi) };
    var backAnkle = { x: FX - 1 - 89 * Math.min(1, k * 1.4), y: GA - 10 * k };
    return { x: hip.x, y: hip.y, t: 3, h: 0, su: 6, sl: 10, fu: -6, fl: -4,
      fN: { x: FX + 3, y: GA }, fF: backAnkle, ftN: 90, ftF: 90 - 60 * k, kbN: 1, kbF: 1 };
  }
  /* ---------- plank (forearms) ---------- */
  var PX = 262;
  function plank(k) {             // k: 0 knees down → 1 full plank
    var sh = { x: PX, y: 177 }, ank = { x: PX - 143.7, y: 203 };
    // knees down: shoulder → knee is exactly trunk + thigh (one straight line), shins resting on the mat, toes tucked under
    var knee = { x: PX - Math.sqrt(102 * 102 - 30 * 30), y: 207 };
    var kAnk = { x: knee.x - Math.sqrt(44 * 44 - 16), y: 203 };
    var piv = k < 1 ? { x: knee.x + (ank.x - knee.x) * k, y: knee.y + (ank.y - knee.y) * k } : ank;
    var L = 58 + (k < 1 ? 44 + 44 * k : 88);
    var dx = sh.x - piv.x, dy = piv.y - sh.y, d = Math.sqrt(dx * dx + dy * dy);
    var hip = { x: sh.x - 58 / d * dx, y: sh.y + 58 / d * dy };
    var t = Math.atan2(sh.x - hip.x, -(sh.y - hip.y)) / D2R;
    var foot = { x: kAnk.x + (ank.x - kAnk.x) * k, y: ank.y };      // the toes stay tucked while the knees lift
    return { x: hip.x, y: hip.y, t: t, h: -t + 82, su: 0, sl: 90, fu: 2, fl: 92,
      fN: foot, fF: { x: foot.x, y: foot.y }, ftN: 37, ftF: 37, kbN: 1, kbF: 1 };   // both legs move together
  }
  /* ---------- glute bridge (on the back, head to the left) ---------- */
  var BX = 110;
  var BTOP = 23.2;                 // top lift: shoulders, hips and knees exactly in line with these feet (higher = arching)
  function bridge(phi) {
    var sh = { x: BX, y: 207 };
    var hip = { x: BX + 58 * cos(phi), y: 207 - 58 * sin(phi) };
    var t = -90 - phi;
    var higher = function (a, b) { return a.y < b.y ? a : b; };
    var L1 = limb(hip, { x: BX + 104, y: GA }, 44, 44, higher), L2 = limb(hip, { x: BX + 100, y: GA }, 44, 44, higher);
    // arms rest flat on the floor beside the body; knees point up
    return { x: hip.x, y: hip.y, t: t, h: -(t + 90), su: 90, sl: 90, fu: 89, fl: 90,
      tu: L1[0], tl: L1[1], bu: L2[0], bl: L2[1], ftN: 90, ftF: 90 };
  }

  /* ---------- clips ---------- */
  function clips(id, beginner) {
    var F = [], i;
    if (id === 'squat') {
      // standard: hips end just below the knees (thighs past parallel); beginner: sits back onto the box
      var top = squat(2, 3, beginner, 4), mid = beginner ? squat(6, 50, true, 18) : squat(18, 55),
        bot = beginner ? squat(8, 85, true, 30) : squat(27, 95);
      F = [{ d: 700, p: top, c: beginner ? cap('雙腳與肩同寬，腳尖微向外，手向前伸', 'Feet shoulder-width, toes slightly out, arms forward') : cap('槓鈴放在上背，吸氣、核心收緊', 'Bar on the upper back; breathe in and brace') },
        { d: 700, p: mid, c: cap('臀部往後往下坐，膝蓋朝腳尖方向', 'Sit the hips back and down; knees track over the toes') },
        { d: 350, p: bot, c: beginner ? cap('坐到箱子上輕碰即起', 'Lightly touch the box, then stand') : cap('大腿至少與地面平行，背部保持平直', 'Thighs at least parallel; back stays flat') },
        { d: 650, p: bot }, { d: 700, p: mid, c: cap('腳掌全掌踩地發力站起，吐氣', 'Drive up through the whole foot; breathe out') }];
    } else if (id === 'deadlift') {
      var start = pullStart(), early = earlyPull(), knee = pastKnees(), mid = midThigh(), lock = lockPose();
      F = [{ d: 800, p: start, c: cap('槓鈴在腳掌中間上方，背部平直、肩膀在槓前', 'Bar over mid-foot; flat back, shoulders just in front of the bar') },
        { d: 250, p: start, c: cap('吸氣收緊，把地板「推開」', 'Brace and "push the floor away"') },
        { d: 250, p: early },
        { d: 300, p: knee, c: cap('槓鈴貼著小腿往上，過膝後髖部向前', 'Bar slides up the shins; past the knees, drive the hips forward') },
        { d: 250, p: mid },
        { d: 700, p: lock, c: cap('站直鎖定，不要後仰', 'Stand tall and lock out — don\'t lean back') },
        { d: 350, p: mid, c: cap('髖部先往後，沿原路放下', 'Hips back first, lower along the same path') },
        { d: 200, p: knee }, { d: 200, p: early }];
    } else if (id === 'bench') {
      F = [{ d: 700, p: bench(1, 3), c: cap('雙腳踩地、肩胛骨收緊，手臂伸直', 'Feet planted, shoulder blades squeezed, arms straight') },
        { d: 900, p: bench(0.5, 3), c: cap('慢慢放下，手肘約 45° 而非向外張開', 'Lower under control, elbows about 45° — not flared out') },
        { d: 250, p: bench(0, 3), c: cap('輕觸下胸', 'Touch the lower chest') },
        { d: 700, p: bench(0, 3) }, { d: 700, p: bench(0.5, 3), c: cap('推回起點，槓鈴略往肩膀方向', 'Press back up, slightly towards the shoulders') }];
    } else if (id === 'press') {
      F = [{ d: 700, p: press(0, 0), c: cap('槓鈴在鎖骨前，手肘在槓下略前', 'Bar on the front of the shoulders, elbows under and slightly ahead') },
        { d: 300, p: press(0, 0), c: cap('臀部與核心收緊', 'Squeeze the glutes and brace') },
        { d: 400, p: press(0.35, -14), c: cap('頭稍微後仰讓槓鈴直線通過', 'Tip the head back so the bar travels straight up') },
        { d: 700, p: press(1, 6), c: cap('推到頭頂鎖定，頭穿過手臂之間', 'Lock out overhead, head through between the arms') },
        { d: 700, p: press(0.35, -14), c: cap('有控制地放回肩上', 'Lower back to the shoulders under control') }];
    } else if (id === 'row') {
      F = [{ d: 700, p: rowPose(0), c: cap('髖部後推前傾約 45°，背部平直，手臂垂直', 'Hinge to about 45°, flat back, arms hanging') },
        { d: 500, p: rowPose(0.5), c: cap('手肘往後拉，肩胛骨夾緊', 'Drive the elbows back and squeeze the shoulder blades') },
        { d: 500, p: rowPose(1), c: cap('槓鈴碰到上腹，身體角度不變', 'Bar touches the upper stomach; torso angle doesn\'t change') },
        { d: 700, p: rowPose(1) }, { d: 700, p: rowPose(0.5), c: cap('慢慢放回，手臂完全伸直', 'Lower slowly to straight arms') }];
    } else if (id === 'pullup') {
      if (beginner) F = [{ d: 900, p: pullup(1), c: cap('從箱子跳或站到頂點，下巴過槓', 'Jump or step up to the top, chin over the bar') },
        { d: 1800, p: pullup(1), c: cap('用 3–5 秒慢慢放下（離心）', 'Lower yourself slowly over 3–5 seconds') },
        { d: 600, p: pullup(0, true), c: cap('到底後再站回去，重複', 'At the bottom, step back up and repeat') }];
      else F = [{ d: 800, p: pullup(0), c: cap('雙手略寬於肩，掌心朝前，手臂伸直懸吊', 'Hands just wider than shoulders, palms forward, hang with straight arms') },
        { d: 300, p: pullup(0.08), c: cap('先把肩膀往下壓（肩胛下沉）', 'First pull the shoulders down away from the ears') },
        { d: 700, p: pullup(1), c: cap('手肘往下往後拉，直到下巴過槓', 'Drive the elbows down and back until the chin clears the bar') },
        { d: 500, p: pullup(1) }, { d: 900, p: pullup(0.5), c: cap('有控制地放下到手臂伸直', 'Lower under control to straight arms') }];
    } else if (id === 'pushup') {
      F = [{ d: 700, p: pushup(0, beginner), c: beginner ? cap('膝蓋著地，從膝到頭成一直線', 'Knees down; a straight line from knees to head') : cap('雙手在肩膀下方，從頭到腳跟成一直線', 'Hands under the shoulders; a straight line from head to heels') },
        { d: 800, p: pushup(0.5, beginner), c: cap('手肘往後約 45°，身體整條一起下降', 'Elbows back at about 45°; the whole body lowers as one') },
        { d: 250, p: pushup(1, beginner), c: cap('胸口接近地面', 'Chest just above the floor') },
        { d: 600, p: pushup(1, beginner) }, { d: 700, p: pushup(0.5, beginner), c: cap('推地回到起點，臀部不下垂', 'Push the floor away; hips don\'t sag') }];
    } else if (id === 'lunge') {
      F = [{ d: 700, p: lunge(0), c: cap('雙腳與髖同寬站立', 'Stand with feet hip-width') },
        { d: 700, p: lunge(0.45), c: cap('一腳往後跨一大步', 'Take a long step backwards') },
        { d: 350, p: lunge(1), c: cap('垂直往下，後膝接近地面，前膝在腳踝上方', 'Drop straight down: back knee near the floor, front knee over the ankle') },
        { d: 600, p: lunge(1) }, { d: 700, p: lunge(0.45), c: cap('前腳踩地推回站立', 'Push through the front foot to stand back up') }];
    } else if (id === 'plank') {
      F = [{ d: 700, p: plank(0), c: cap('前臂著地，手肘在肩膀正下方，先跪姿', 'Forearms down, elbows under the shoulders, start on the knees') },
        { d: 3200, p: plank(1), c: cap('膝蓋離地，頭到腳跟成一直線，收緊腹部與臀部', 'Lift the knees: head to heels in one line, squeeze stomach and glutes') },
        { d: 700, p: plank(1), c: cap('正常呼吸，保持姿勢', 'Breathe normally and hold the position') }];
    } else if (id === 'bridge') {
      F = [{ d: 700, p: bridge(0), c: cap('躺下屈膝，腳跟靠近臀部', 'Lie on your back, knees bent, heels close to the seat') },
        { d: 600, p: bridge(14), c: cap('腳跟踩地，臀部往上推', 'Press through the heels and lift the hips') },
        { d: 900, p: bridge(BTOP), c: cap('肩膀到膝蓋成一直線，臀部夾緊 1–2 秒', 'Shoulders to knees in one line; squeeze the glutes for 1–2 seconds') },
        { d: 700, p: bridge(BTOP) }, { d: 700, p: bridge(14), c: cap('慢慢放下', 'Lower slowly') }];
    }
    return F;
  }

  function makeClip(s, view, level, lang) {
    var beginner = level < 1 && s.easy;
    var F = clips(s.id, beginner);
    var barbell = s.kit === 'barbell' && !beginner;
    return {
      scale: 0.85, base: { x: FX, y: 124 }, cx: FX, ticks: false, labelAt: [350, 34], still: 0.45,
      trail: barbell ? 'bar' : null, frames: F,
      props: function (J, c) {
        var sc = c.scale, back = '', fr = '', hud = '';
        var sx = function (x) { return FX + (x - FX) * sc; }, sy = function (y) { return 214 + (y - 214) * sc; };
        if (barbell && s.id !== 'bench' && !(s.id === 'squat' && beginner)) back += S.line({ x: sx(MF), y: c.gy }, { x: sx(MF), y: c.gy - 175 }, '#C9C7C0', 1.3, ' stroke-dasharray="4 5"');
        if (s.id === 'bench') {
          var bl = sx(BENCH.hip.x - 95), br = sx(BENCH.hip.x + 18), bt = sy(BENCH.top);
          back += S.rect(bl, bt, br - bl, 7 * sc, '#5D6475') + S.line({ x: bl + 12, y: bt + 6 }, { x: bl + 12, y: c.gy }, '#5D6475', 3) + S.line({ x: br - 12, y: bt + 6 }, { x: br - 12, y: c.gy }, '#5D6475', 3);
        }
        if (s.id === 'squat' && beginner) back += S.rect(sx(FX - 64), sy(170), 34 * sc, c.gy - sy(170), '#E9E7E1', '#5D6475', 2);
        if (s.id === 'pullup') {
          back += S.line({ x: sx(BAR.x - 70), y: sy(BAR.y) }, { x: sx(BAR.x + 70), y: sy(BAR.y) }, C.ink, 4);
          back += S.line({ x: sx(BAR.x - 70), y: sy(BAR.y) }, { x: sx(BAR.x - 70), y: c.gy }, '#5D6475', 3) + S.line({ x: sx(BAR.x + 70), y: sy(BAR.y) }, { x: sx(BAR.x + 70), y: c.gy }, '#5D6475', 3);
          if (beginner) back += S.rect(sx(BAR.x - 40), sy(186), 44 * sc, c.gy - sy(186), '#E9E7E1', '#5D6475', 2);
        }
        if (s.id === 'plank' || s.id === 'pushup' || s.id === 'bridge') back += S.rect(sx(40), c.gy - 4, sx(380) - sx(40), 4, '#9FC9B6');   // mat
        if (barbell) {
          var b = s.id === 'squat' ? { x: J.sh.x - 6 * Math.cos(c.pose.t * D2R), y: J.sh.y - 6 * Math.sin(c.pose.t * D2R) } : J.hN;
          J.bar = b;
          back += S.circle(b, PLATE * sc, '#E9E7E1', C.ink, 2.5, ' opacity=".92"') + S.circle(b, 4 * sc, C.ink);
        }
        var kneesDown = s.id === 'plank' && J.kN.y > c.gy - 12 * sc;   // knees on the mat: the line runs head to knees
        if (s.id === 'plank') hud += S.text(18, 30, kneesDown ? KT.pick('綠線＝頭到膝蓋一直線', 'GREEN LINE = HEAD TO KNEES IN ONE LINE') : KT.pick('綠線＝頭到腳跟一直線', 'GREEN LINE = HEAD TO HEELS IN ONE LINE'), { size: 11, fill: C.jade, family: "'JetBrains Mono','Noto Sans TC',monospace" });
        if (s.id === 'plank' || s.id === 'pushup') fr += S.line(J.head, (beginner && s.id === 'pushup') || kneesDown ? J.kN : J.aN, C.jade, 1.6, ' stroke-dasharray="5 4" opacity=".8"');
        if (barbell && s.id !== 'bench') hud += S.text(18, 30, KT.pick('虛線＝腳掌中間（槓鈴保持在上方）', 'DASHED LINE = MID-FOOT (KEEP THE BAR OVER IT)'), { size: 11, fill: '#7C8191', family: "'JetBrains Mono','Noto Sans TC',monospace" });
        return { back: back, front: fr, hud: hud };
      }
    };
  }

  /* ---------- the ten exercises ---------- */
  function B(a) { return a; }
  var LIST = [
    { id: 'squat', n: 1, kit: 'barbell', easy: true, zh: '深蹲', py: 'Back Squat', en: 'Squat',
      type: { zh: '下肢 · 推', en: 'Legs · push' }, muscles: { zh: '股四頭肌、臀大肌、核心', en: 'Quads, glutes, core' },
      equip: { zh: '槓鈴（初學：徒手坐箱）', en: 'Barbell (beginner: bodyweight to a box)' }, dose: { zh: '3–5 組 × 5–10 次', en: '3–5 sets × 5–10 reps' },
      tags: { zh: ['動作之王', '臀往後坐、膝朝腳尖'], en: ['The king of lifts', 'Hips back, knees over toes'] },
      note: { zh: '背部平直 · 膝朝腳尖 · 全腳掌發力', en: 'FLAT BACK · KNEES OVER TOES · WHOLE-FOOT DRIVE' },
      how: { zh: '雙腳約與肩同寬、腳尖微向外。槓鈴放在上背（斜方肌上），雙手握緊。吸氣、收緊核心，臀部往後往下坐，膝蓋朝腳尖方向推出，直到大腿至少與地面平行。全程背部平直、腳跟不離地，再用整個腳掌踩地站起來並吐氣。槓鈴應該一直在腳掌中間的正上方。',
        en: 'Stand with feet about shoulder-width, toes turned slightly out, and the bar resting on your upper back. Breathe in and brace your core, then sit the hips back and down while pushing the knees out over the toes until your thighs are at least parallel to the floor. Keep your back flat and heels down, then drive up through the whole foot as you breathe out. The bar should stay over the middle of your foot.' },
      mistakes: { zh: '膝蓋往內夾；腳跟離地；圓背或抬頭過度；只蹲一半；起身時臀部先起、變成彎腰。', en: 'Knees caving in; heels lifting; rounding the back or cranking the head up; half-depth reps; hips shooting up first so it turns into a good-morning.' },
      practice: { zh: '先用徒手坐箱練習 3 組 × 10 次，動作穩定後再用空槓（20 公斤）學習，每次只加一點重量。', en: 'Start with bodyweight squats to a box, 3 × 10; once steady, learn with an empty bar (20 kg) and add weight in small steps.' },
      use: { zh: '深蹲訓練腿部與核心力量，也是坐下、站起、搬東西等日常動作的基礎。', en: 'Squats build leg and core strength and underpin everyday movements like sitting, standing and lifting.' },
      bars: [['股四頭肌', 'Quadriceps', 90], ['臀大肌', 'Glutes', 85], ['核心', 'Core', 75], ['髖踝活動度', 'Hip & ankle mobility', 70]] },

    { id: 'deadlift', n: 2, kit: 'barbell', zh: '硬舉', py: 'Deadlift', en: 'Deadlift',
      type: { zh: '後側鏈 · 拉', en: 'Posterior chain · pull' }, muscles: { zh: '臀大肌、腿後肌、背部', en: 'Glutes, hamstrings, back' },
      equip: { zh: '槓鈴', en: 'Barbell' }, dose: { zh: '3–5 組 × 3–6 次', en: '3–5 sets × 3–6 reps' },
      tags: { zh: ['從地上拿起重物', '背部平直是第一要務'], en: ['Lifting a weight off the floor', 'A flat back comes first'] },
      note: { zh: '槓在腳掌上 · 背平 · 槓貼腿', en: 'BAR OVER MID-FOOT · FLAT BACK · BAR STAYS CLOSE' },
      how: { zh: '雙腳與髖同寬，槓鈴在腳掌中間正上方。彎腰屈膝握槓，小腿碰到槓，背部平直、肩膀略在槓的前方。吸氣收緊，像把地板推開一樣站起，槓鈴貼著腿往上。過膝後髖部往前推，站直鎖定。放下時髖部先往後，沿原路放回。',
        en: 'Stand with feet hip-width and the bar over the middle of your feet. Hinge and bend the knees to grip the bar with shins touching it, back flat and shoulders just in front of the bar. Brace and stand up as if pushing the floor away, keeping the bar against your legs. Once past the knees, drive the hips forward to stand tall. To lower, push the hips back first and follow the same path down.' },
      mistakes: { zh: '圓背拉起；槓鈴離身體太遠；臀部先抬起；站直時過度後仰；用手臂拉。', en: 'Rounding the back; letting the bar drift away from the body; hips rising first; leaning back at the top; pulling with the arms.' },
      practice: { zh: '先用木棍或空槓練「髖部後推」的動作 3 × 10，再慢慢加重；每一次都從靜止開始。', en: 'Practise the hip hinge with a broomstick or empty bar, 3 × 10, before adding weight; start every rep from a dead stop.' },
      use: { zh: '硬舉訓練整個身體背面，也是安全從地上搬起重物的正確方式。', en: 'The deadlift trains the whole back of the body and is the safe way to pick heavy things off the floor.' },
      bars: [['臀大肌', 'Glutes', 90], ['腿後肌', 'Hamstrings', 85], ['豎脊肌', 'Lower back', 85], ['握力', 'Grip', 75]] },

    { id: 'bench', n: 3, kit: 'barbell', zh: '臥推', py: 'Bench Press', en: 'Bench Press',
      type: { zh: '上肢 · 推', en: 'Upper body · push' }, muscles: { zh: '胸大肌、三頭肌、前三角肌', en: 'Chest, triceps, front shoulders' },
      equip: { zh: '槓鈴、臥推椅（請找保護者）', en: 'Barbell, bench (use a spotter)' }, dose: { zh: '3–5 組 × 5–10 次', en: '3–5 sets × 5–10 reps' },
      tags: { zh: ['最經典的上半身推', '肩胛收緊、手肘 45°'], en: ['The classic upper-body press', 'Shoulder blades back, elbows 45°'] },
      note: { zh: '肩胛收緊 · 手肘約 45° · 碰下胸', en: 'BLADES SQUEEZED · ELBOWS ~45° · TOUCH THE LOWER CHEST' },
      how: { zh: '躺在臥推椅上，眼睛在槓鈴正下方，雙腳穩穩踩地。握距略寬於肩，肩胛骨往後往下收緊。把槓鈴推離架子到肩膀上方，慢慢放下碰到下胸，手肘與身體約 45°。再把槓鈴推回起點，路線略往肩膀方向。',
        en: 'Lie on the bench with your eyes under the bar and feet planted. Grip a little wider than shoulder-width and squeeze your shoulder blades back and down. Unrack the bar over your shoulders, lower it under control to touch the lower chest with elbows about 45° from your body, then press it back up, drifting slightly towards the shoulders.' },
      mistakes: { zh: '手肘向外張成 90°（傷肩）；槓鈴在胸口彈起；臀部離開椅子；手腕向後折。', en: 'Flaring elbows to 90° (hard on the shoulders); bouncing the bar off the chest; lifting the hips off the bench; bending the wrists back.' },
      practice: { zh: '先用空槓或啞鈴練 3 × 10，每次都請人在旁保護，或在有安全槓的架子內練習。', en: 'Start with an empty bar or dumbbells, 3 × 10; always use a spotter or a rack with safety bars.' },
      use: { zh: '臥推是訓練胸部與手臂推力最有效的動作之一。', en: 'The bench press is one of the most effective builders of chest and arm pushing strength.' },
      bars: [['胸大肌', 'Chest', 90], ['三頭肌', 'Triceps', 82], ['前三角肌', 'Front shoulders', 75], ['肩胛穩定', 'Shoulder-blade control', 70]] },

    { id: 'press', n: 4, kit: 'barbell', zh: '站姿肩推', py: 'Overhead Press', en: 'Overhead Press',
      type: { zh: '上肢 · 推', en: 'Upper body · push' }, muscles: { zh: '三角肌、三頭肌、核心', en: 'Shoulders, triceps, core' },
      equip: { zh: '槓鈴（或啞鈴）', en: 'Barbell (or dumbbells)' }, dose: { zh: '3–5 組 × 5–8 次', en: '3–5 sets × 5–8 reps' },
      tags: { zh: ['站著把重量推過頭', '全身收緊、不後仰'], en: ['Pressing a weight overhead standing', 'Whole body tight, no leaning back'] },
      note: { zh: '臀腹收緊 · 槓走直線 · 頭穿過手臂', en: 'GLUTES & CORE TIGHT · STRAIGHT BAR PATH · HEAD THROUGH' },
      how: { zh: '雙腳與髖同寬站立，槓鈴放在肩膀前方、鎖骨上，手肘在槓的下方略前。收緊臀部和腹部，頭稍微往後讓路，把槓鈴直線推過頭頂。槓鈴過額頭後頭往前穿過手臂之間，在頭頂正上方鎖定。',
        en: 'Stand with feet hip-width, the bar resting on the front of your shoulders and elbows under and slightly in front of it. Squeeze glutes and core, tip your head back slightly to clear a path, and press the bar straight up. Once it passes your forehead, bring your head through between your arms and lock out directly overhead.' },
      mistakes: { zh: '腰部過度後仰；槓鈴往前推出（繞過臉）；手肘太外開；膝蓋彎曲借力。', en: 'Leaning back and arching the lower back; pressing the bar forward around the face; flared elbows; dipping the knees to cheat.' },
      practice: { zh: '先用空槓或輕啞鈴練 3 × 8，對鏡從側面看槓鈴是否走直線。', en: 'Start with an empty bar or light dumbbells, 3 × 8, and check side-on in a mirror that the bar travels straight up.' },
      use: { zh: '肩推訓練肩膀與核心穩定，把行李放上置物架就是同樣的動作。', en: 'The press builds shoulder strength and core stability — the same move as lifting a case into an overhead locker.' },
      bars: [['三角肌', 'Shoulders', 90], ['三頭肌', 'Triceps', 80], ['核心穩定', 'Core stability', 82], ['上背', 'Upper back', 70]] },

    { id: 'row', n: 5, kit: 'barbell', zh: '俯身划船', py: 'Bent-over Row', en: 'Bent-over Row',
      type: { zh: '上肢 · 拉', en: 'Upper body · pull' }, muscles: { zh: '背闊肌、菱形肌、二頭肌', en: 'Lats, mid-back, biceps' },
      equip: { zh: '槓鈴（或啞鈴）', en: 'Barbell (or dumbbells)' }, dose: { zh: '3–4 組 × 8–12 次', en: '3–4 sets × 8–12 reps' },
      tags: { zh: ['背部厚度的基本動作', '身體角度不動'], en: ['The basic back builder', 'Torso angle stays fixed'] },
      note: { zh: '髖部前傾 · 背平 · 手肘往後拉', en: 'HINGE · FLAT BACK · ELBOWS DRIVE BACK' },
      how: { zh: '雙手握槓，膝蓋微彎，髖部往後推讓上身前傾約 45°，背部平直，手臂自然下垂。手肘往後往上拉，肩胛骨夾緊，讓槓鈴碰到上腹部，再慢慢放下。全程上身角度不變。',
        en: 'Hold the bar, soften the knees and hinge at the hips until your torso is about 45° with a flat back and the arms hanging. Drive the elbows back and up, squeezing the shoulder blades, until the bar touches your upper stomach, then lower slowly. Your torso angle stays the same throughout.' },
      mistakes: { zh: '用身體甩起來；圓背；聳肩用斜方肌拉；拉到一半就放。', en: 'Swinging the body to heave the weight; rounding the back; shrugging the shoulders; cutting the range short.' },
      practice: { zh: '先用單臂啞鈴划船（一手撐椅子）學會手肘往後拉的感覺，3 × 10 每邊。', en: 'Learn the elbow drive with one-arm dumbbell rows, one hand on a bench, 3 × 10 each side.' },
      use: { zh: '划船平衡推的動作（如臥推），讓肩膀更健康、姿勢更挺。', en: 'Rows balance all the pushing (like the bench press), keeping shoulders healthy and posture upright.' },
      bars: [['背闊肌', 'Lats', 88], ['中背', 'Mid-back', 85], ['二頭肌', 'Biceps', 72], ['下背穩定', 'Lower-back hold', 78]] },

    { id: 'pullup', n: 6, kit: 'bar', easy: true, zh: '引體向上', py: 'Pull-up', en: 'Pull-up',
      type: { zh: '上肢 · 拉', en: 'Upper body · pull' }, muscles: { zh: '背闊肌、二頭肌、握力', en: 'Lats, biceps, grip' },
      equip: { zh: '單槓（初學：箱子做離心）', en: 'Pull-up bar (beginner: box for negatives)' }, dose: { zh: '3–5 組 × 盡力次數', en: '3–5 sets × as many good reps as you can' },
      tags: { zh: ['自身體重的拉力王', '先沉肩、再拉'], en: ['The bodyweight pulling king', 'Shoulders down first, then pull'] },
      note: { zh: '先沉肩 · 手肘往下拉 · 下巴過槓', en: 'SHOULDERS DOWN · ELBOWS DOWN & BACK · CHIN OVER' },
      how: { zh: '雙手略寬於肩、掌心朝前握住單槓，手臂伸直懸吊。先把肩膀往下壓離耳朵，再把手肘往下往後拉，直到下巴超過單槓，然後有控制地放下到手臂伸直。',
        en: 'Grip the bar a little wider than your shoulders, palms facing forward, and hang with straight arms. First pull your shoulders down away from your ears, then drive the elbows down and back until your chin clears the bar, and lower under control to straight arms.' },
      mistakes: { zh: '用腿踢、身體擺盪借力；只拉一半；放下太快；聳肩。', en: 'Kicking and swinging for momentum; half reps; dropping down fast; shrugging the shoulders up.' },
      practice: { zh: '還做不到一下？選「初學」程度：踩箱子到頂點，用 3–5 秒慢慢放下，3 × 5；或用彈力帶輔助。', en: 'Can\'t do one yet? Choose Beginner: step up to the top and lower slowly over 3–5 seconds, 3 × 5, or use a resistance band.' },
      use: { zh: '引體向上是最好的上半身拉力訓練之一，也能大幅提升握力。', en: 'The pull-up is one of the best upper-body pulling exercises and builds a strong grip.' },
      bars: [['背闊肌', 'Lats', 92], ['二頭肌', 'Biceps', 80], ['握力', 'Grip', 82], ['核心', 'Core', 68]] },

    { id: 'pushup', n: 7, kit: 'none', easy: true, zh: '伏地挺身', py: 'Push-up', en: 'Push-up',
      type: { zh: '上肢 · 推', en: 'Upper body · push' }, muscles: { zh: '胸大肌、三頭肌、核心', en: 'Chest, triceps, core' },
      equip: { zh: '不需器材（初學：跪姿）', en: 'None (beginner: from the knees)' }, dose: { zh: '3 組 × 8–20 次', en: '3 sets × 8–20 reps' },
      tags: { zh: ['隨時隨地都能做', '身體像一塊木板'], en: ['Do it anywhere', 'Body like a plank'] },
      note: { zh: '手在肩下 · 身體一直線 · 手肘 45°', en: 'HANDS UNDER SHOULDERS · ONE STRAIGHT LINE · ELBOWS 45°' },
      how: { zh: '雙手放在肩膀正下方略寬，從頭到腳跟成一直線，收緊腹部和臀部。手肘往後約 45° 彎曲，整個身體一起下降到胸口接近地面，再把地面推開回到起點。',
        en: 'Place your hands just wider than and under your shoulders, with a straight line from head to heels and your stomach and glutes tight. Bend the elbows back at about 45° and lower your whole body together until your chest is just above the floor, then push the floor away to return.' },
      mistakes: { zh: '臀部下垂或翹太高；手肘外開成 T 字；只動頭部（點頭）；下得不夠深。', en: 'Hips sagging or piking up; elbows flared into a T; dipping only the head; not going low enough.' },
      practice: { zh: '做不到標準動作就選「初學」（跪姿），或雙手撐在桌邊做斜板伏地挺身，3 × 10。', en: 'If full push-ups are too hard, choose Beginner (from the knees) or put your hands on a table edge, 3 × 10.' },
      use: { zh: '伏地挺身同時訓練推力和核心穩定，是不需要器材的最佳上半身動作。', en: 'Push-ups train pushing strength and core stability together — the best equipment-free upper-body move.' },
      bars: [['胸大肌', 'Chest', 85], ['三頭肌', 'Triceps', 82], ['核心', 'Core', 80], ['肩胛穩定', 'Shoulder-blade control', 70]] },

    { id: 'lunge', n: 8, kit: 'none', zh: '後跨弓箭步', py: 'Reverse Lunge', en: 'Reverse Lunge',
      type: { zh: '下肢 · 單腳', en: 'Legs · single-leg' }, muscles: { zh: '股四頭肌、臀大肌、平衡', en: 'Quads, glutes, balance' },
      equip: { zh: '不需器材（可手持啞鈴）', en: 'None (dumbbells optional)' }, dose: { zh: '3 組 × 每腳 8–12 次', en: '3 sets × 8–12 per leg' },
      tags: { zh: ['比前跨更護膝', '垂直下降'], en: ['Easier on the knees than a forward lunge', 'Drop straight down'] },
      note: { zh: '往後跨 · 垂直下降 · 前膝在腳踝上', en: 'STEP BACK · DROP STRAIGHT DOWN · FRONT KNEE OVER ANKLE' },
      how: { zh: '雙腳與髖同寬站立。一腳往後跨一大步，前腳不動，身體垂直往下，直到後膝接近地面、前腿大腿約與地面平行，前膝在腳踝上方。用前腳全腳掌踩地把自己推回站立，再換腳。',
        en: 'Stand with feet hip-width. Take a long step back with one foot and, keeping the front foot planted, drop straight down until the back knee nearly touches the floor and the front thigh is about parallel, front knee over the ankle. Push through the whole front foot to return to standing, then switch legs.' },
      mistakes: { zh: '步伐太小，前膝超過腳尖太多；上身前倒；前膝往內夾；後膝重重撞地。', en: 'Too short a step so the front knee shoots far forward; folding the chest down; front knee caving in; slamming the back knee into the floor.' },
      practice: { zh: '扶著牆或椅子練習平衡，每腳 3 × 8；穩定後雙手持啞鈴增加負重。', en: 'Hold a wall or chair for balance, 3 × 8 per leg; once steady, hold dumbbells for extra load.' },
      use: { zh: '單腳動作訓練平衡與左右力量差，對跑步和上樓梯都很有幫助。', en: 'Single-leg work builds balance and evens out left–right strength — great for running and climbing stairs.' },
      bars: [['股四頭肌', 'Quadriceps', 85], ['臀大肌', 'Glutes', 85], ['平衡', 'Balance', 88], ['髖部穩定', 'Hip stability', 75]] },

    { id: 'plank', n: 9, kit: 'none', zh: '平板支撐', py: 'Plank', en: 'Plank',
      type: { zh: '核心 · 靜態', en: 'Core · hold' }, muscles: { zh: '腹肌、臀部、肩膀', en: 'Abs, glutes, shoulders' },
      equip: { zh: '瑜伽墊', en: 'Exercise mat' }, dose: { zh: '3 組 × 20–60 秒', en: '3 sets × 20–60 seconds' },
      tags: { zh: ['最基本的核心訓練', '用下方計時器練習'], en: ['The basic core exercise', 'Use the hold timer below'] },
      note: { zh: '手肘在肩下 · 頭到腳跟一直線 · 正常呼吸', en: 'ELBOWS UNDER SHOULDERS · HEAD TO HEELS IN LINE · BREATHE' },
      how: { zh: '前臂著地、手肘在肩膀正下方，先跪姿準備，再把膝蓋抬離地面，讓頭、肩、臀、腳跟成一直線。收緊腹部和臀部，眼睛看地面，正常呼吸並保持。',
        en: 'Rest on your forearms with elbows directly under your shoulders, start on your knees, then lift them so head, shoulders, hips and heels form one straight line. Squeeze your stomach and glutes, look at the floor, breathe normally and hold.' },
      mistakes: { zh: '臀部下垂（腰會痛）；臀部翹太高；憋氣；頭往上抬或垂下。', en: 'Letting the hips sag (hurts the lower back); hips piked up high; holding your breath; lifting or dropping the head.' },
      practice: { zh: '用下方的計時器從 20 秒開始，每週增加 5–10 秒；姿勢跑掉就停，品質比時間重要。', en: 'Use the timer below starting at 20 seconds and add 5–10 seconds a week; stop when your form slips — quality beats time.' },
      use: { zh: '平板支撐訓練核心「不動」的能力，能保護下背、幫助所有其他動作更穩定。', en: 'The plank trains your core to resist movement, which protects the lower back and steadies every other lift.' },
      bars: [['腹肌', 'Abs', 90], ['臀部', 'Glutes', 75], ['肩膀穩定', 'Shoulder stability', 78], ['呼吸控制', 'Breathing control', 70]] },

    { id: 'bridge', n: 10, kit: 'none', zh: '臀橋', py: 'Glute Bridge', en: 'Glute Bridge',
      type: { zh: '臀部 · 伸髖', en: 'Glutes · hip extension' }, muscles: { zh: '臀大肌、腿後肌', en: 'Glutes, hamstrings' },
      equip: { zh: '瑜伽墊', en: 'Exercise mat' }, dose: { zh: '3 組 × 12–15 次', en: '3 sets × 12–15 reps' },
      tags: { zh: ['喚醒臀部的入門動作', '頂點夾緊停 1–2 秒'], en: ['A beginner glute activator', 'Squeeze and pause at the top'] },
      note: { zh: '腳跟踩地 · 肩到膝一直線 · 不拱腰', en: 'HEELS DOWN · SHOULDERS TO KNEES IN LINE · NO ARCHING' },
      how: { zh: '仰躺、屈膝，雙腳踩地與髖同寬，腳跟靠近臀部，雙手放在身體兩側。腳跟踩地把臀部往上推，直到肩膀、髖部、膝蓋成一直線，臀部夾緊停 1–2 秒，再慢慢放下。',
        en: 'Lie on your back with knees bent, feet hip-width and heels close to your seat, arms by your sides. Press through your heels to lift the hips until shoulders, hips and knees form a straight line, squeeze the glutes for 1–2 seconds, then lower slowly.' },
      mistakes: { zh: '用腰拱起來而不是臀部發力；腳尖踩地；膝蓋向外倒或往內夾；放下太快。', en: 'Arching the lower back instead of using the glutes; pushing through the toes; knees falling out or in; dropping down fast.' },
      practice: { zh: '3 × 15，熟練後改成單腳臀橋，或把肩膀靠在椅子上做臀推。', en: '3 × 15; once easy, try single-leg bridges or hip thrusts with your shoulders on a bench.' },
      use: { zh: '久坐容易讓臀部「沉睡」；臀橋能喚醒臀肌、減輕下背和膝蓋的負擔。', en: 'Long sitting "switches off" the glutes; bridges wake them up and take strain off the lower back and knees.' },
      bars: [['臀大肌', 'Glutes', 92], ['腿後肌', 'Hamstrings', 75], ['核心', 'Core', 65], ['髖部伸展', 'Hip extension', 85]] }
  ];

  w.GYM = { LIST: LIST, makeClip: makeClip };
})(window);
