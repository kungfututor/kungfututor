/*!
 * KungfuTutor partner figure — kt-partner.js
 * Draws a second, grey figure (opponent / training partner) facing the main
 * figure, for combat sports and partner drills. Driven entirely by numeric
 * pose keys so it interpolates with the main clip:
 *   ox        partner hip x (pre-scale, same space as the main figure's x)
 *   ot, oh    torso lean / head tilt (+ = leaning towards the main figure)
 *   oa1, oa2  partner near arm upper / forearm (90 = reaching towards the main figure)
 *   ob1, ob2  partner far arm
 *   ola, olb  partner near leg thigh / shin (kicks: 90 = towards the main figure)
 *   ol        partner far-leg stride
 *   g         0..1 — near hand grabs the main figure's joint `grab`
 *   olift     raises the partner off the floor (throws); 0 = standing on the floor
 *   olf       optional far-leg shin (+ = towards the main figure); default follows ol (kneeling needs it)
 * draw() options: { cx, grab, gloves, wraps } — gloves draws boxing gloves, wraps draws taped bare fists.
 * Every frame of a clip must carry every key (use KTPartner.base).
 */
(function (w) {
  'use strict';
  var F = w.KTFigure, S = F.S;
  var COL = '#AEB3BE', COL_F = '#CDD0D7';
  var base = { ox: 270, ot: 0, oh: 0, oa1: 10, oa2: 15, ob1: -8, ob2: -2, ola: 4, olb: 1, ol: 4, g: 0, olift: 0 };

  function reach(sh, tg, L1, L2) {          // 2-bone arm in screen space, elbow hangs down
    var dx = tg.x - sh.x, dy = tg.y - sh.y, d0 = Math.sqrt(dx * dx + dy * dy) || 1;
    var d = Math.max(Math.abs(L1 - L2) + 0.01, Math.min(L1 + L2 - 0.01, d0));
    var ux = dx / d0, uy = dy / d0;
    var a = (L1 * L1 - L2 * L2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, L1 * L1 - a * a));
    var b = { x: sh.x + ux * a, y: sh.y + uy * a };
    var e1 = { x: b.x - uy * h, y: b.y + ux * h }, e2 = { x: b.x + uy * h, y: b.y - ux * h };
    return { e: e1.y > e2.y ? e1 : e2, h: { x: sh.x + ux * d, y: sh.y + uy * d } };
  }

  // J: main figure joints (screen); c: player ctx; opt: { cx, grab }
  function draw(J, c, opt) {
    var p = c.pose, sc = c.scale;
    var q = { x: p.ox, t: p.ot, h: p.oh, su: p.oa1, sl: p.oa2, fu: p.ob1, fl: p.ob2,
      tu: p.ola, tl: p.olb, bu: -p.ol, bl: typeof p.olf === 'number' ? -p.olf : -p.ol * 0.6, lift: p.olift || 0 };
    var O = F.solve(q, { groundY: c.gy, scale: sc, cx: opt.cx });
    var X = O.hip.x;
    for (var n in O) O[n] = { x: 2 * X - O[n].x, y: O[n].y };      // turn to face the main figure
    var hand = O.hN, elbow = O.eN;
    if (opt.grab && p.g > 0.02) {
      var want = S.mid(O.hN, J[opt.grab], Math.min(1, p.g));
      var r = reach(O.shN, want, F.DIM.upper * sc, F.DIM.fore * sc);
      hand = r.h; elbow = r.e;
    }
    var wd = 7.5 * sc, out = '';
    out += S.poly([O.hipF, O.kF, O.aF, O.tF], COL_F, wd);
    out += S.poly([O.shF, O.eF, O.hF], COL_F, wd);
    out += S.poly([O.hipN, O.kN, O.aN, O.tN], COL, wd);
    out += S.poly([O.hip, O.sh], COL, wd);
    out += S.circle(O.head, F.DIM.head * sc, '#fff', COL, 3.2);
    out += S.poly([O.shN, elbow, hand], COL, wd);
    if (opt.grab && p.g > 0.5) out += S.circle(hand, 5, COL, '#fff', 1.5);
    if (opt.gloves) out = S.circle(O.hF, 6.5 * sc, COL_F, '#fff', 1.2) + out + S.circle(hand, 6.5 * sc, COL, '#fff', 1.2);
    if (opt.wraps) out = S.circle(O.hF, 4.2 * sc, '#F4EFE6', COL_F, 1.6) + out + S.circle(hand, 4.2 * sc, '#F4EFE6', COL, 1.6);
    O.hN = hand; O.eN = elbow;
    return { svg: out, O: O };
  }

  // contact flash: a red ring that grows with `k` (0..1)
  function hit(pt, k) {
    if (!pt || k <= 0.15) return '';
    return S.circle(pt, 5 + 9 * k, 'none', S.col.red, 2.5, ' opacity="' + Math.min(1, k) + '"') + S.circle(pt, 5, S.col.red, '#fff', 1.5);
  }

  w.KTPartner = { base: base, draw: draw, hit: hit, reach: reach };
})(window);
