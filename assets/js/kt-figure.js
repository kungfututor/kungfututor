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

  w.KTFigure = { Player: Player, S: S, DIM: DIM, COL: COL, VB: VB, solve: solve };
})(window);
