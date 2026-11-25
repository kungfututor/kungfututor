/*!
 * KungfuTutor Figure Engine — kt-figure.js
 * Original code written for KungfuTutor.com. No third-party assets.
 *
 * A 2D side-view stick figure, posed with joint angles and played as a
 * looping keyframe clip. Every sport / kung fu technique on the site is a
 * "clip": a list of poses + an optional props() painter (sled, ball, rower…).
 *
 * Angle convention (degrees, absolute, not relative to parent):
 *   0 = limb points straight down, +90 = points forward (the way the figure
 *   faces, +x), 180 = straight up, -90 = points backwards.
 * Torso angle t: 0 = upright, +ve = leaning forward.
 *
 * Pose keys
 *   x, y        hip position. If y is omitted the figure is auto-placed on
 *               the ground (lowest joint touches the floor) and `lift` raises it.
 *   t, h        torso lean, extra head tilt
 *   su, sl      near arm: upper arm, forearm      (fu, fl = far arm)
 *   tu, tl      near leg: thigh, shin             (bu, bl = far leg)
 *   hN, hF      optional hand targets {x,y} (solved with 2-bone IK)
 *   fN, fF      optional foot targets {x,y}
 *               Targets are absolute when y is given, else relative to the hip.
 *   s           ground scroll (px) — makes travelling moves look like travel
 *   face        1 = faces +x (default), -1 = turned round (mirrored about the hip);
 *               tweening between them squeezes the figure, which reads as a turn
 *   any other numeric key is interpolated and handed to props() as ctx.pose
 * KTFigure.balance(pose) / balanceClip(frames): move the hips over the standing foot (see below).
 */
(function (w) {
  'use strict';
  var D2R = Math.PI / 180;
  var DIM = { torso: 58, neck: 17, head: 11, upper: 30, fore: 28, thigh: 44, shin: 44, foot: 10 };
  var BASE = { x: 200, lift: 0, t: 0, h: 0, su: 8, sl: 14, fu: -8, fl: -2, tu: 3, tl: 0, bu: -3, bl: 0, s: 0 };
  var COL = { ink: '#191D28', far: '#8F95A3', red: '#D92D20', jade: '#059669', paper: '#FFFFFF', line: '#191D28' };
  var VB = { w: 420, h: 260 };

  function P(o, L, a) { return { x: o.x + L * Math.sin(a * D2R), y: o.y + L * Math.cos(a * D2R) }; }
  function ang(a, b) { return Math.atan2(b.x - a.x, b.y - a.y) / D2R; }

  function ik(base, tgt, L1, L2, bend) {
    var dx = tgt.x - base.x, dy = tgt.y - base.y;
    var d = Math.sqrt(dx * dx + dy * dy);
    d = Math.max(Math.abs(L1 - L2) + 0.01, Math.min(L1 + L2 - 0.01, d));
    var a0 = Math.atan2(dx, dy) / D2R;
    var c = (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d);
    var alpha = Math.acos(Math.max(-1, Math.min(1, c))) / D2R;
    var ua = a0 + bend * alpha;
    var mid = P(base, L1, ua);
    return [ua, ang(mid, tgt)];
  }

  function lerpPose(a, b, k) {
    var out = {}, keys = {}, key;
    for (key in a) keys[key] = 1;
    for (key in b) keys[key] = 1;
    for (key in keys) {
      var va = a[key], vb = b[key];
      if (va === undefined) va = vb;
      if (vb === undefined) vb = va;
      if (typeof va === 'number' && typeof vb === 'number') out[key] = va + (vb - va) * k;
      else if (va && vb && typeof va === 'object') out[key] = { x: va.x + (vb.x - va.x) * k, y: va.y + (vb.y - va.y) * k };
      else out[key] = k < 0.5 ? va : vb;
    }
    return out;
  }

  function solve(p, o) {
    var abs = typeof p.y === 'number';
    var hip = { x: p.x, y: abs ? p.y : 0 };
    var sh = P(hip, DIM.torso, 180 - p.t);
    var head = P(sh, DIM.neck, 180 - (p.t + p.h));
    // front-view support: hip / shoulder half-widths (0 in side view)
    var hw = p.hw || 0, sw = p.sw || 0, ct = Math.cos(p.t * D2R), stt = Math.sin(p.t * D2R);
    var shN = { x: sh.x + sw * ct, y: sh.y + sw * stt }, shF = { x: sh.x - sw * ct, y: sh.y - sw * stt };
    var hipN = { x: hip.x + hw, y: hip.y }, hipF = { x: hip.x - hw, y: hip.y };
    function T(v) { return abs ? v : { x: hip.x + v.x, y: hip.y + v.y }; }
    // la = apparent forearm length (front-view foreshortening, default 1)
    function arm(base, u, l, tg, la, lu) {
      var LF = DIM.fore * (typeof la === 'number' ? la : 1);
      var LU = DIM.upper * (typeof lu === 'number' ? lu : 1);   // lu = apparent upper-arm length
      if (tg) { var r = ik(base, T(tg), LU, LF, -1); u = r[0]; l = r[1]; }
      var e = P(base, LU, u);
      return { e: e, h: P(e, LF, l) };
    }
    // lT = apparent thigh length (front view foreshortening), kb = knee bend side (+1 forward/out to +x, -1 to -x)
    var LT = DIM.thigh * (typeof p.lT === 'number' ? p.lT : 1);
    function leg(base, u, l, tg, ft, kb) {
      if (tg) { var r = ik(base, T(tg), LT, DIM.shin, kb || 1); u = r[0]; l = r[1]; }
      var k = P(base, LT, u), a = P(k, DIM.shin, l);
      return { k: k, a: a, t: P(a, DIM.foot, typeof ft === 'number' ? ft : l + 90) };
    }
    var aN = arm(shN, p.su, p.sl, p.hN, p.laN, p.luN), aF = arm(shF, p.fu, p.fl, p.hF, p.laF, p.luF);
    var lN = leg(hipN, p.tu, p.tl, p.fN, p.ftN, p.kbN), lF = leg(hipF, p.bu, p.bl, p.fF, p.ftF, p.kbF);
    // A foot standing on its toes (heel raised) has those toes ON the floor, never under it. Poses written with the raised-heel
    // ankle at the flat foot's height pushed the toes below the floor line, and placing the figure on its lowest point then
    // lifted the flat foot off the ground instead. So when the other foot is flat on the floor and this one's toes dip below
    // it, this ankle is raised until the toes are level with the flat foot. The correction fades out as the flat foot leaves the
    // floor (a kick, a step): then this foot simply stands on its toes. (Feet placed by angles, and absolute poses, are left as drawn.)
    if (!abs) {
      [[lN, lF, p.fN, hipN, p.ftN, p.kbN], [lF, lN, p.fF, hipF, p.ftF, p.kbF]].forEach(function (q) {
        var me = q[0], ot = q[1], tg = q[2], drop = me.t.y - me.a.y;
        if (!tg || drop <= 0 || ot.t.y > ot.a.y + 1.5) return;
        var otFloor = Math.max(ot.a.y, ot.t.y), dip = Math.min(drop, me.t.y - otFloor);
        var up = (me.a.y - otFloor - 2.5) / 6.5; up = up < 0 ? 0 : up > 1 ? 1 : up;          // how far the flat foot has left the floor
        var over = dip * (1 - up * up * (3 - 2 * up));
        if (over <= 0.05) return;
        var r = leg(q[3], 0, 0, { x: tg.x, y: tg.y - over }, q[4], q[5]);
        me.k = r.k; me.a = r.a; me.t = r.t;
      });
    }
    var J = { hip: hip, sh: sh, head: head, shN: shN, shF: shF, hipN: hipN, hipF: hipF,
      eN: aN.e, hN: aN.h, eF: aF.e, hF: aF.h,
      kN: lN.k, aN: lN.a, tN: lN.t, kF: lF.k, aF: lF.a, tF: lF.t };
    var n, gy = o.groundY, s = o.scale, cx = o.cx;
    // face: 1 = facing +x (default), -1 = turned round; values in between squeeze the figure (reads as a turn)
    if (typeof p.face === 'number' && p.face !== 1) for (n in J) J[n] = { x: hip.x + (J[n].x - hip.x) * p.face, y: J[n].y };
    if (!abs) {
      var m = -1e9;
      for (n in J) if (n !== 'head') m = Math.max(m, J[n].y);
      var dy = gy - 3 - (p.lift || 0) - m;
      for (n in J) J[n] = { x: J[n].x, y: J[n].y + dy };
    }
    if (s !== 1) for (n in J) J[n] = { x: cx + (J[n].x - cx) * s, y: gy + (J[n].y - gy) * s };
    return J;
  }

  /* ---- balance: keep the body's weight over the feet it stands on ----
   * balance(pose) returns the same pose with the hips moved along x until the centre of the body's weight sits
   * over the standing foot (or feet). Those feet stay exactly where they were; the trunk, the arms and a leg in
   * the air move with the hips. Poses that are not simply standing come back unchanged: in the air (lift),
   * placed by x and y, half-way through a turn, or with a hand, an elbow, a knee, the hips or the shoulders
   * near the floor.
   * balanceClip(frames) does it for every frame of a clip and then moves the partner (ox) by one amount in ALL
   * frames — the shift of the frame where the strike lands (hit), else the largest — so the partner stands still
   * and the contact the lesson drew still meets. With { partner: 'follow' } the partner moves frame by frame with
   * your hips instead (for a clinch, where you hold them the whole time).
   * Body-mass shares follow the usual anthropometric tables (trunk 50%, head 8%, each leg 16%, each arm 5%). */
  var MASS = [['hip', 'sh', 0.497, 0.5], ['head', 'head', 0.081, 0],
    ['shN', 'eN', 0.028, 0.44], ['eN', 'hN', 0.016, 0.43], ['hN', 'hN', 0.006, 0],
    ['shF', 'eF', 0.028, 0.44], ['eF', 'hF', 0.016, 0.43], ['hF', 'hF', 0.006, 0],
    ['hipN', 'kN', 0.1, 0.43], ['kN', 'aN', 0.0465, 0.43], ['aN', 'tN', 0.0145, 0.5],
    ['hipF', 'kF', 0.1, 0.43], ['kF', 'aF', 0.0465, 0.43], ['aF', 'tF', 0.0145, 0.5]];
  function comX(J) { var c = 0; MASS.forEach(function (g) { c += g[2] * (J[g[0]].x + (J[g[1]].x - J[g[0]].x) * g[3]); }); return c; }
  // where the standing feet carry weight: [from, to] along x, or null when the body is not simply standing
  function support(J) {
    var floor = -1e9, n, lo = 1e9, hi = -1e9, feet = [];
    for (n in J) if (n !== 'head') floor = Math.max(floor, J[n].y);
    if (['hip', 'sh', 'kN', 'kF', 'hN', 'hF', 'eN', 'eF'].some(function (q) { return J[q].y > floor - 6; })) return null;
    ['N', 'F'].forEach(function (sd) {
      var a = J['a' + sd], t = J['t' + sd];
      if (Math.max(a.y, t.y) < floor - 4) return;                          // this foot is in the air
      var d = t.x >= a.x ? 1 : -1, flat = Math.abs(a.y - t.y) < 3.5, along = Math.abs(t.x - a.x) > 3;
      var x1 = flat ? a.x - 5 * d : t.x - 4 * d;                           // the heel, or the ball of a foot standing on its toes
      var x2 = (along ? t.x : a.x + 6 * d) + 8 * d;                        // a little past the drawn toe (real toes are longer)
      lo = Math.min(lo, x1, x2); hi = Math.max(hi, x1, x2); feet.push(sd);
    });
    return feet.length ? { lo: lo, hi: hi, feet: feet } : null;
  }
  function balance(p0, opt) {
    opt = opt || {};
    var p = {}, k, i, J, sup, moved = 0;
    for (k in BASE) p[k] = BASE[k];
    for (k in (opt.base || {})) p[k] = opt.base[k];
    for (k in p0) p[k] = p0[k];
    if (typeof p.y === 'number' || (p.lift || 0) > 2) return p0;
    if (typeof p.face === 'number' && Math.abs(Math.abs(p.face) - 1) > 0.01) return p0;
    var face = p.face < 0 ? -1 : 1, set = {};
    for (i = 0; i < 6; i++) {
      J = solve(p, { groundY: 0, scale: 1, cx: 0 });
      sup = support(J);
      if (!sup) return p0;
      var m = Math.min(6, (sup.hi - sup.lo) * 0.3), c = comX(J), dx = Math.max(sup.lo + m, Math.min(sup.hi - m, c)) - c;
      if (Math.abs(dx) < 0.4) break;
      dx /= 0.9;                                                            // the standing leg stays behind, so the weight moves a little less than the hips
      sup.feet.forEach(function (sd) {
        var key = 'f' + sd, tg = p[key];
        if (!tg) {                                                          // a standing leg given by angles: pin its foot where it is
          var hp = J['hip' + sd], a = J['a' + sd], t = J['t' + sd], kn = J['k' + sd];
          tg = { x: (a.x - J.hip.x) * face, y: a.y - J.hip.y };
          var a0 = Math.atan2((a.x - hp.x) * face, a.y - hp.y), ua = Math.atan2((kn.x - hp.x) * face, kn.y - hp.y), df = ua - a0;
          while (df > Math.PI) df -= 2 * Math.PI; while (df < -Math.PI) df += 2 * Math.PI;
          p['kb' + sd] = df >= 0 ? 1 : -1; set['kb' + sd] = 1;
          if (typeof p['ft' + sd] !== 'number') { p['ft' + sd] = Math.atan2((t.x - a.x) * face, t.y - a.y) / D2R; set['ft' + sd] = 1; }
        }
        p[key] = { x: tg.x - dx * face, y: tg.y }; set[key] = 1;
      });
      p.x += dx; moved += dx;
    }
    if (Math.abs(moved) < 0.4) return p0;
    var out = {};
    for (k in p0) out[k] = p0[k];
    out.x = p.x;
    for (k in set) out[k] = p[k];
    if (opt.partner !== false && typeof out.ox === 'number') out.ox += moved;
    return out;
  }
  function balanceClip(frames, opt) {
    var o = { partner: false, base: opt && opt.base }, ref = 0, best = -1;
    var dxs = frames.map(function (f) { var q = balance(f.p, o), base = (o.base && typeof f.p.x !== 'number') ? o.base.x : f.p.x, d = q === f.p ? 0 : q.x - (typeof base === 'number' ? base : BASE.x); f.p = q; return d; });
    dxs.forEach(function (d, i) { var sc = Math.abs(d) + (frames[i].p.hit > 0.5 ? 1000 : 0); if (d && sc > best) { best = sc; ref = d; } });
    // (opt.partner 'follow': a partner you are holding — a clinch — moves with your hips frame by frame instead)
    var follow = opt && opt.partner === 'follow';
    if (ref) frames.forEach(function (f, i) {
      if (typeof f.p.ox !== 'number') return;
      var q = {}, k; for (k in f.p) q[k] = f.p[k]; q.ox += follow ? dxs[i] : ref; f.p = q;
    });
    return { shifts: dxs, partner: follow ? 'follow' : ref };
  }

  var EASE = {
    io: function (k) { return 0.5 - 0.5 * Math.cos(Math.PI * k); },
    lin: function (k) { return k; },
    out: function (k) { return 1 - (1 - k) * (1 - k); },
    'in': function (k) { return k * k; }
  };

  /* --- tiny SVG string helpers, also used by clip props() painters --- */
  function f(v) { return Math.round(v * 10) / 10; }
  var S = {
    line: function (a, b, col, wd, extra) {
      return '<line x1="' + f(a.x) + '" y1="' + f(a.y) + '" x2="' + f(b.x) + '" y2="' + f(b.y) +
        '" stroke="' + (col || COL.ink) + '" stroke-width="' + (wd || 3) + '" stroke-linecap="round"' + (extra || '') + '/>';
    },
    poly: function (pts, col, wd, fill, extra) {
      var s = pts.map(function (p) { return f(p.x) + ',' + f(p.y); }).join(' ');
      return '<polyline points="' + s + '" fill="' + (fill || 'none') + '" stroke="' + (col || COL.ink) +
        '" stroke-width="' + (wd || 3) + '" stroke-linecap="round" stroke-linejoin="round"' + (extra || '') + '/>';
    },
    rect: function (x, y, wd, ht, fill, stroke, sw, extra) {
      return '<rect x="' + f(x) + '" y="' + f(y) + '" width="' + f(wd) + '" height="' + f(ht) + '" fill="' + (fill || 'none') +
        '" stroke="' + (stroke || 'none') + '" stroke-width="' + (sw || 0) + '"' + (extra || '') + '/>';
    },
    circle: function (c, r, fill, stroke, sw, extra) {
      return '<circle cx="' + f(c.x) + '" cy="' + f(c.y) + '" r="' + f(r) + '" fill="' + (fill || 'none') +
        '" stroke="' + (stroke || 'none') + '" stroke-width="' + (sw || 0) + '"' + (extra || '') + '/>';
    },
    text: function (x, y, str, opt) {
      opt = opt || {};
      return '<text x="' + f(x) + '" y="' + f(y) + '" fill="' + (opt.fill || COL.ink) + '" font-size="' + (opt.size || 12) +
        '" font-weight="' + (opt.weight || 700) + '" text-anchor="' + (opt.anchor || 'start') +
        '" font-family="' + (opt.family || "'Space Grotesk','Noto Sans TC',sans-serif") + '"' +
        (opt.ls ? ' letter-spacing="' + opt.ls + '"' : '') + '>' + esc(str) + '</text>';
    },
    mid: function (a, b, k) { k = k === undefined ? 0.5 : k; return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k }; },
    col: COL
  };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var NS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  /* ------------------------------------------------------------------ */
  function Player(svg, opt) {
    opt = opt || {};
    this.svg = svg;
    this.speed = 1;
    this.info = {};
    this.elapsed = 0;
    this.last = 0;
    this.visible = true;
    this.reduced = !!(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches);
    this.playing = opt.autoplay !== false && !this.reduced;
    this.onstate = opt.onstate || null;
    svg.setAttribute('viewBox', '0 0 ' + VB.w + ' ' + VB.h);
    svg.innerHTML = '';
    this.gWorld = el('g', {}, svg);            // everything that mirrors
    this.gGround = el('g', {}, this.gWorld);
    this.gBack = el('g', {}, this.gWorld);
    var limb = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
    function L(col, parent) { var a = {}; for (var k in limb) a[k] = limb[k]; a.stroke = col; return el('polyline', a, parent); }
    this.gFig = el('g', {}, this.gWorld);
    this.farLeg = L(COL.far, this.gFig);
    this.farArm = L(COL.far, this.gFig);
    this.nearLeg = L(COL.ink, this.gFig);
    this.torso = L(COL.ink, this.gFig);
    this.head = el('circle', { fill: COL.paper, stroke: COL.ink }, this.gFig);
    this.nearArm = L(COL.ink, this.gFig);
    this.gFront = el('g', {}, this.gWorld);
    this.gInfo = el('g', {}, svg);             // labels never mirror
    var self = this;
    this._tick = function (now) { self.frame(now); };
    if ('IntersectionObserver' in w) {
      new IntersectionObserver(function (es) { self.visible = es[0].isIntersecting; }).observe(svg);
    }
    w.requestAnimationFrame(this._tick);
  }

  Player.prototype.load = function (clip) {
    var base = {}, k;
    for (k in BASE) base[k] = BASE[k];
    for (k in (clip.base || {})) base[k] = clip.base[k];
    this.frames = clip.frames.map(function (fr) {
      var p = {}, q;
      for (q in base) p[q] = base[q];
      for (q in fr.p) p[q] = fr.p[q];
      return { d: fr.d || 400, e: EASE[fr.e || 'io'], p: p };
    });
    this.total = this.frames.reduce(function (a, b) { return a + b.d; }, 0);
    this.clip = clip;
    this.opt = { groundY: clip.groundY || 214, scale: clip.scale || 0.8, cx: clip.cx || base.x };
    this.advance = clip.advance || 0;
    this.elapsed = this.reduced ? (clip.still || 0) * this.total : 0;
    this.drawAt(this.elapsed);
  };

  Player.prototype.setMirror = function (on) {
    this.mirror = !!on;
    if (on) this.gWorld.setAttribute('transform', 'translate(' + VB.w + ',0) scale(-1,1)');
    else this.gWorld.removeAttribute('transform');
  };
  Player.prototype.setInfo = function (info) { this.info = info || {}; if (this.clip) this.drawAt(this.elapsed); };
  Player.prototype.setSpeed = function (s) { this.speed = s; };
  Player.prototype.toggle = function (force) {
    this.playing = typeof force === 'boolean' ? force : !this.playing;
    if (this.onstate) this.onstate(this.playing);
    return this.playing;
  };

  Player.prototype.frame = function (now) {
    var dt = this.last ? Math.min(now - this.last, 64) : 0;
    this.last = now;
    if (this.clip && this.playing && this.visible && !document.hidden) {
      this.elapsed += dt * this.speed;
      this.drawAt(this.elapsed);
    }
    w.requestAnimationFrame(this._tick);
  };

  Player.prototype.poseAt = function (time) {
    var fr = this.frames, n = fr.length, total = this.total;
    var cyc = Math.floor(time / total), tt = time - cyc * total, i = 0, acc = 0;
    while (i < n - 1 && acc + fr[i].d <= tt) { acc += fr[i].d; i++; }
    var k = fr[i].e(Math.min(1, (tt - acc) / fr[i].d));
    var a = fr[i].p, b = fr[(i + 1) % n].p;
    if (i === n - 1 && this.advance) { var c = {}; for (var q in b) c[q] = b[q]; c.s = b.s + this.advance; b = c; }
    var pose = lerpPose(a, b, k);
    return { pose: pose, seg: i, k: k, cycle: cyc, sWorld: cyc * this.advance + pose.s, phase: tt / total };
  };

  Player.prototype.drawAt = function (time) {
    var st = this.poseAt(time), o = this.opt, clip = this.clip;
    var J = solve(st.pose, o);
    var sw = 7.5 * o.scale;
    var pts = function (arr) { return arr.map(function (p) { return f(p.x) + ',' + f(p.y); }).join(' '); };
    var farCol = clip.farColor || COL.far;
    this.farLeg.setAttribute('stroke', farCol);
    this.farArm.setAttribute('stroke', farCol);
    this.farLeg.setAttribute('points', pts([J.hipF, J.kF, J.aF, J.tF]));
    this.farArm.setAttribute('points', pts([J.shF, J.eF, J.hF]));
    this.nearLeg.setAttribute('points', pts([J.hipN, J.kN, J.aN, J.tN]));
    this.torso.setAttribute('points', pts([J.hipN, J.hipF, J.hip, J.sh, J.shF, J.shN]));
    this.nearArm.setAttribute('points', pts([J.shN, J.eN, J.hN]));
    [this.farLeg, this.farArm, this.nearLeg, this.torso, this.nearArm].forEach(function (e) { e.setAttribute('stroke-width', f(sw)); });
    this.head.setAttribute('cx', f(J.head.x));
    this.head.setAttribute('cy', f(J.head.y));
    this.head.setAttribute('r', f(DIM.head * o.scale));
    this.head.setAttribute('stroke-width', f(Math.max(2.5, 3.6 * o.scale)));

    // ground + moving ticks
    var gy = o.groundY, g = '';
    if (clip.ground !== false) {
      g += S.line({ x: 0, y: gy }, { x: VB.w, y: gy }, COL.ink, 2.5, ' stroke-linecap="butt"');
      if (clip.ticks !== false) {
        var step = 26, off = clip.advance ? ((st.sWorld % step) + step) % step : 0;
        for (var x = -off; x < VB.w + step; x += step) g += S.line({ x: x, y: gy + 5 }, { x: x - 6, y: gy + 12 }, '#B9BCC4', 1.5);
      }
    }
    this.gGround.innerHTML = g;

    var ctx = { pose: st.pose, seg: st.seg, k: st.k, phase: st.phase, s: st.sWorld, gy: gy, scale: o.scale, info: this.info, S: S, vb: VB };
    var pr = clip.props ? clip.props(J, ctx) : {};
    this.gBack.innerHTML = pr.back || '';
    this.gFront.innerHTML = (pr.front || '');

    // labels: a = distance (ink), b = load (red), note = rule under the floor
    var inf = this.info, la = clip.labelAt || [330, 70], h = '';
    if (inf.a) h += S.text(la[0], la[1], inf.a, { size: 15, anchor: 'middle' });
    if (inf.b) h += S.text(la[0], la[1] + 17, inf.b, { size: 12, fill: COL.red, anchor: 'middle' });
    if (inf.note && clip.ground !== false) h += S.text(VB.w / 2, gy + 34, inf.note, { size: 11, fill: COL.red, anchor: 'middle', ls: '0.06em' });
    else if (inf.note) h += S.text(VB.w / 2, VB.h - 10, inf.note, { size: 11, fill: COL.red, anchor: 'middle', ls: '0.06em' });
    if (pr.hud) h += pr.hud;
    this.gInfo.innerHTML = h;

    // ghost trail: the recent path of one joint (e.g. the punching fist)
    if (clip.trail) {
      if (!this._trail || Math.abs(time - (this._tLast || 0)) > 90) this._trail = [];
      this._tLast = time;
      this._trail.push(J[clip.trail]);
      if (this._trail.length > 16) this._trail.shift();
      var tr = '', n = this._trail.length;
      for (var i = 1; i < n; i++) tr += S.line(this._trail[i - 1], this._trail[i], COL.jade, 3, ' opacity="' + f(i / n * 0.8) + '"');
      this.gFront.innerHTML = tr + this.gFront.innerHTML;
    }
  };

  w.KTFigure = { Player: Player, S: S, DIM: DIM, COL: COL, VB: VB, solve: solve, balance: balance, balanceClip: balanceClip, comX: comX, support: support };
})(window);
