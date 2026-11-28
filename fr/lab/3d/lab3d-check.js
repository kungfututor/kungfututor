/* KungfuTutor 3D Lab — self-check (loaded only when the page is opened with ?check).
 * Poses the instructor through every move and measures what a viewer would notice:
 * feet/hands the lesson puts on the floor really touch it, nothing sinks or floats,
 * knees, ankles, elbows and hips stay inside what a body can do, and the body's weight
 * stays over the feet that carry it (balance), and a foot that is planted stays where it was
 * planted (no sliding across the floor).
 * Results go into the page as JSON (#lab-check-data) plus a picture strip per move;
 * engine/lab3d_check.py reads them and prints the report.
 *   ?check            every move        ?check&moves=gym-squat,stances-bow   some moves
 *   &n=60             samples per move  &sheet=0                             no pictures
 */
export function run(api) {
  var THREE = api.THREE, A = api.avatar(), DEG = 180 / Math.PI;
  window.__lab = api;                                       // for debugging from the browser console
  var qs = new URLSearchParams(location.search);
  var only = (qs.get('moves') || '').split(',').filter(Boolean), N = +(qs.get('n') || 48), sheets = qs.get('sheet') !== '0';
  // &tile=340 picture size, &views=side,other which views (side | angle | other = a quarter turn round from the lesson's view),
  // &per=5 key moments per picture (longer moves get a second picture) — the bot's --review mode sets all three
  var TILE = +(qs.get('tile') || 230), VIEWS = (qs.get('views') || 'side,angle').split(','), PER = +(qs.get('per') || 0), vv = new THREE.Vector3();

  var host = document.createElement('section');
  host.id = 'lab-check'; host.style.cssText = 'padding:16px;font:12px/1.5 monospace;background:#fff;color:#111';
  document.body.insertBefore(host, document.body.firstChild);

  // a second small renderer for the picture strips
  var rr = null, cam = null;
  if (sheets) {
    rr = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    rr.setSize(TILE, TILE, false); rr.shadowMap.enabled = true; rr.outputColorSpace = THREE.SRGBColorSpace;
    cam = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  }

  function setMin(set) { var m = 1e9; for (var i = 0; i < set.length; i++) { A.full.at(set[i], vv); if (vv.y < m) m = vv.y; } return m; }

  // ---- balance: where the body's weight sits compared with the feet that carry it ----
  // (share of body mass, bone at the near end, bone at the far end, how far along the centre of that part sits)
  var MASS = [[0.100, 'UpLeg', 'Leg', 0.43], [0.0465, 'Leg', 'Foot', 0.43], [0.0145, 'Foot', 'ToeBase', 0.5],
    [0.028, 'Arm', 'ForeArm', 0.44], [0.016, 'ForeArm', 'Hand', 0.43], [0.006, 'Hand', 'Hand', 0]];
  function centreOfMass() {
    var B = A.B, c = new THREE.Vector3(), M = 0;
    function add(m, a, b, k) { c.addScaledVector(a.clone().lerp(b, k), m); M += m; }
    var hipC = api.wpos(B.RightUpLeg).lerp(api.wpos(B.LeftUpLeg), 0.5), neck = api.wpos(B.Neck), head = api.wpos(B.Head);
    add(0.497, hipC, neck, 0.5);
    add(0.081, head, head.clone().add(head.clone().sub(neck).normalize().multiplyScalar(0.18)), 0.5);
    ['Right', 'Left'].forEach(function (X) { MASS.forEach(function (g) { add(g[0], api.wpos(B[X + g[1]]), api.wpos(B[X + g[2]]), g[3]); }); });
    return c.divideScalar(M);
  }
  function hull(pts) {                                      // convex outline of floor points [x, z]
    pts = pts.slice().sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    function cr(o, a, b) { return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }
    var lo = [], up = [], i;
    for (i = 0; i < pts.length; i++) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], pts[i]) <= 0) lo.pop(); lo.push(pts[i]); }
    for (i = pts.length - 1; i >= 0; i--) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], pts[i]) <= 0) up.pop(); up.push(pts[i]); }
    lo.pop(); up.pop(); return lo.concat(up);
  }
  function outside(h, x, z) {                               // how far a floor point lies outside the outline (0 = inside)
    var best = 1e9, inside = true;
    for (var i = 0; i < h.length; i++) {
      var a = h[i], b = h[(i + 1) % h.length], dx = b[0] - a[0], dz = b[1] - a[1], L2 = dx * dx + dz * dz;
      if (dx * (z - a[1]) - dz * (x - a[0]) < 0) inside = false;
      var t = L2 > 1e-9 ? Math.max(0, Math.min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / L2)) : 0;
      best = Math.min(best, Math.hypot(x - a[0] - t * dx, z - a[1] - t * dz));
    }
    return inside && h.length > 2 ? 0 : best;
  }
  function footprint(X, F) {                                // heel, toes and both edges of one foot, on the floor
    var an = api.wpos(A.B[X + 'Foot']), toe = api.wpos(A.B[X + 'ToeBase']);
    var fx = toe.x - an.x, fz = toe.z - an.z, L = Math.hypot(fx, fz) || 1; fx /= L; fz /= L;
    var bx = an.x - fx * 0.07, bz = an.z - fz * 0.07, tx = toe.x + fx * 0.09, tz = toe.z + fz * 0.09, w = 0.05;
    return [[bx - fz * w, bz + fx * w], [bx + fz * w, bz - fx * w], [tx - fz * w, tz + fx * w], [tx + fz * w, tz - fx * w]];
  }
  // returns { out: metres outside the feet (0 = balanced), dir: 'behind' | 'in front of' | 'beside' } or null when it does not apply
  function balance(P) {
    var I = P.info, n = I.n, planted = [], reach = [];
    if (I.rest > 0.3 || I.hands.N.w > 0.5 || I.hands.F.w > 0.5) return null;      // lying, sitting or propped on the hands
    if (I.supported) return null;                                                 // leaning on equipment (the sled push)
    if (Math.min(n.kN.y, n.kF.y) < 0.12) return null;                             // kneeling: the knees carry weight too
    api.SIDES.forEach(function (s) {
      var F = I.feet[s.k], fp = footprint(s.X, F);
      if (F.w > 0.9) planted = planted.concat(fp);
      if (F.w > 0.9 || api.wpos(A.B[s.X + 'Foot']).y < A.ankleH + 0.22) reach = reach.concat(fp);   // a foot stepping low counts: the weight may be on its way to it
    });
    if (!planted.length) return null;                                              // in the air
    var c = centreOfMass(), h = hull(reach), o = outside(h, c.x, c.z);
    if (o < 1e-4) return { out: 0, dir: '' };
    var mx = 0, mz = 0; h.forEach(function (q) { mx += q[0]; mz += q[1]; }); mx /= h.length; mz /= h.length;
    var fw = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), P.theta || 0), along = (c.x - mx) * fw.x + (c.z - mz) * fw.z;
    var side = Math.abs(-(c.x - mx) * fw.z + (c.z - mz) * fw.x);
    return { out: o, dir: side > Math.abs(along) ? 'beside' : along < 0 ? 'behind' : 'in front of' };
  }

  // ---- two-person moves: the bodies must not pass through each other ----
  // Each body is a set of capsules (bone to bone, with a radius); every skin point of the other body is tested against them.
  // Bodies pressed together squash a little, so only overlap deeper than 4 cm is a fault.
  var CAPS = [['torso', 'Hips', 'Neck', 0.12, 0, 0.86], ['neck', 'Neck', 'Head', 0.055], ['head', 'Head', 'Head', 0.1, 0.09], ['R upper arm', 'RightArm', 'RightForeArm', 0.045], ['L upper arm', 'LeftArm', 'LeftForeArm', 0.045],
    ['R forearm', 'RightForeArm', 'RightHand', 0.038], ['L forearm', 'LeftForeArm', 'LeftHand', 0.038], ['R thigh', 'RightUpLeg', 'RightLeg', 0.075], ['L thigh', 'LeftUpLeg', 'LeftLeg', 0.075],
    ['R shin', 'RightLeg', 'RightFoot', 0.052], ['L shin', 'LeftLeg', 'LeftFoot', 0.052]];
  var REG = ['body', 'R foot', 'L foot', 'R hand', 'L hand', 'R thumb', 'L thumb', 'R arm', 'L arm', 'R leg', 'L leg'];
  function capsules(X) {
    return CAPS.map(function (c) {
      var a = api.wpos(X.B[c[1]]), b = api.wpos(X.B[c[2]]);
      if (c[4]) { var up = api.wpos(X.B.Head).sub(api.wpos(X.B.Neck)).normalize(); a = a.clone().addScaledVector(up, c[4]); b = a.clone(); }
      if (c[5]) b.lerp(a, 1 - c[5]);
      return { name: c[0], a: a, ab: b.clone().sub(a), r: c[3] };
    });
  }
  function overlap(X, Y) {                                   // deepest point of Y's skin inside X's capsules
    var caps = capsules(X), S = Y.skin, best = { d: 0 }, p = new THREE.Vector3(), w = new THREE.Vector3();
    S.refresh();
    for (var j = 0; j < S.count; j++) {
      S.at(j, p);
      for (var c = 0; c < caps.length; c++) {
        var C = caps[c], L2 = C.ab.lengthSq(), t = L2 > 1e-9 ? Math.max(0, Math.min(1, w.subVectors(p, C.a).dot(C.ab) / L2)) : 0;
        var d = C.r - p.distanceTo(w.copy(C.a).addScaledVector(C.ab, t));
        if (d > best.d) best = { d: d, into: C.name, part: REG[S.region[j]] };
      }
    }
    return best;
  }
  function measureDuo(P, f, m) {
    var Pt = api.partner();
    if (!Pt || !P.partner) return;
    var o1 = overlap(A, Pt), o2 = overlap(Pt, A), plow = Math.min.apply(null, Pt.full.lows());
    m.clash = Math.max(o1.d, o2.d);
    if (o1.d > 0.04) f.push('partner ' + o1.part + ' inside your ' + o1.into + ' ' + (o1.d * 100).toFixed(0) + 'cm');
    if (o2.d > 0.04) f.push('your ' + o2.part + ' inside partner ' + o2.into + ' ' + (o2.d * 100).toFixed(0) + 'cm');
    m.plow = plow;
    if (plow < -0.006) f.push('partner sinks ' + (plow * 100).toFixed(1) + 'cm');
    // (a partner being carried over your hip is meant to be off the floor)
    if (P.partner.g < 0.005 && plow > 0.008 && !P.partner.carried) f.push('partner floats ' + (plow * 100).toFixed(1) + 'cm');
  }

  function measure(P) {
    var I = P.info, f = [], lows = A.full.lows(), all = Math.min.apply(null, lows);
    var grounded = I.g < 0.005, m = { low: all, g: I.g, pitch: I.pitch * DEG, passes: I.passes, flags: f };
    A.full.refresh();
    var part = ['body', 'R foot', 'L foot', 'R hand', 'L hand', 'R thumb', 'L thumb', 'R arm', 'L arm', 'R leg', 'L leg'][lows.indexOf(all)];
    if (all < -0.006) f.push(part + ' sinks ' + (all * 100).toFixed(1) + 'cm');
    if (grounded && all > 0.008) f.push('floats ' + (all * 100).toFixed(1) + 'cm');
    // a pull-up: each hand must stay on the bar
    // a fixed grip (judo lapel / sleeve, clinch, holds): the palm on its spot
    if (typeof I.gripMiss === 'number' && I.gripMiss > 0.08) f.push('hand off its grip ' + (I.gripMiss * 100).toFixed(0) + 'cm');
    // golf: both hands together on the club
    if (typeof I.golfApart === 'number' && I.golfApart > 0.12) f.push('golf hands apart ' + (I.golfApart * 100).toFixed(0) + 'cm');
    // (measured at the base of the middle finger, where the bar sits in a hand wrapped round it)
    if (typeof I.barGap === 'number' && I.barGap > 0.05) f.push('hand off the bar ' + (I.barGap * 100).toFixed(0) + 'cm');
    api.SIDES.forEach(function (s) {
      var F = I.feet[s.k], H = I.hands[s.k], d = A.D[s.X], tag = s.X[0];
      var knee = F.knee * DEG, twist = F.twist * DEG, ankle = F.ankle * DEG, hip = F.hip * DEG, elbow = H.elbow * DEG;
      m['knee' + s.k] = knee; m['twist' + s.k] = F.bend > 0.15 ? twist : 0; m['ankle' + s.k] = ankle; m['hip' + s.k] = hip; m['elbow' + s.k] = elbow;
      m['slide' + s.k] = F.slide; m['w' + s.k] = F.w; m['beta' + s.k] = F.beta * DEG;
      if (F.flipped) m.kneeFixed = 1;
      if (knee > 158) f.push(tag + ' knee folded ' + knee.toFixed(0) + '°');
      if (F.bend > 0.15 && twist > 95) f.push(tag + ' knee points backwards (' + twist.toFixed(0) + '°)');
      if (ankle < -45 || ankle > 74) f.push(tag + ' ankle ' + ankle.toFixed(0) + '°');
      if (hip > 165) f.push(tag + ' hip folded ' + hip.toFixed(0) + '°');
      if (elbow > 160) f.push(tag + ' elbow folded ' + elbow.toFixed(0) + '°');
      if (F.slide > 0.06) f.push(tag + ' foot slid ' + (F.slide * 100).toFixed(0) + 'cm');
      if (F.w > 0.98 && F.beta * DEG < 95) {                  // the lesson has this foot standing on the floor
        var heel = setMin(d.heelSet), ball = setMin(d.ballSet), b = F.beta * DEG;
        m['heel' + s.k] = heel; m['ball' + s.k] = ball;
        if (Math.abs(b) < 2) { if (heel < -0.015 || heel > 0.025 || Math.abs(ball) > 0.015) f.push(tag + ' foot not flat (heel ' + (heel * 100).toFixed(1) + ', ball ' + (ball * 100).toFixed(1) + 'cm)'); }
        else if (b > 0) { var fl = lows[s.foot]; if (Math.abs(fl) > 0.02) f.push(tag + ' toes off floor ' + (fl * 100).toFixed(1) + 'cm'); }
        else if (Math.abs(heel) > 0.02) f.push(tag + ' heel off floor ' + (heel * 100).toFixed(1) + 'cm');
      }
      if (H.w > 0.98) {
        var hl = Math.min(lows[s.hand], lows[s.hand + 2]);
        m['hand' + s.k] = hl;
        if (Math.abs(hl) > 0.02) f.push(tag + ' hand off floor ' + (hl * 100).toFixed(1) + 'cm');
        if (H.slide > (I.rest > 0.9 ? 0.15 : 0.08)) f.push(tag + ' hand slid ' + (H.slide * 100).toFixed(0) + 'cm');
      }
    });
    if (api.barbell.visible && api.barbell.position.y < api.plateR() - 0.004) f.push('bar plates sink');
    measureDuo(P, f, m);
    var bal = balance(P);
    m.bal = bal ? bal.out : 0; m.balDir = bal ? bal.dir : '';
    return m;
  }

  function tile(ctx, x, y, P, label, view, bad) {
    var hip = api.wpos(A.B.Hips);
    if (view === 'side') cam.position.set(hip.x, 1.0, 6.2);
    else if (view === 'other') cam.position.set(hip.x + 6.2, 1.0, 0);       // from where a side-view lesson's figure is looking
    else cam.position.set(hip.x + 4.4, 1.9, 4.4);
    cam.lookAt(hip.x, 0.95, 0); cam.updateMatrixWorld(true);
    rr.render(api.scene, cam);
    ctx.drawImage(rr.domElement, x, y, TILE, TILE);
    ctx.fillStyle = bad ? '#B00020' : '#222'; ctx.font = '11px monospace'; ctx.fillText(label, x + 6, y + TILE - 8);
  }

  var out = { moves: [], samples: N, model: { ankleH: A.ankleH, armScale: A.armScale } };
  var list = api.MOVES.map(function (m, i) { return { m: m, i: i }; }).filter(function (o) { return !only.length || only.indexOf(o.m.slug) >= 0; });

  function one(idx) {
    if (idx >= list.length) return done();
    var o = list[idx], total = api.load(o.i), frames = api.frames();
    A = api.avatar();                                       // (golf lessons use the golfer model)
    var R = { slug: o.m.slug, name: api.name(o.m), flags: {}, max: {}, min: {}, pops: 0 };
    var prev = null, off = { n: 0, max: 0, dir: '', t: 0 };
    // a planted foot must stay where it was planted: follow the ball of each foot for as long as it is down
    var spot = { N: null, F: null }, moved = { N: { far: 0, t: 0 }, F: { far: 0, t: 0 } };
    var pspot = { N: null, F: null }, pmoved = { N: { far: 0, t: 0 }, F: { far: 0, t: 0 } };   // the partner's feet too
    for (var s = 0; s < N; s++) {
      var t = total * s / N, P = api.pose(t), m = measure(P);
      if (m.bal > 0.08) { off.n++; if (m.bal > off.max) { off.max = m.bal; off.dir = m.balDir; off.t = Math.round(t); } }
      // (a foot turning on its heel or on its ball has not slid: one of the two has to stay put)
      // (on a treadmill station the mat itself moves back: a planted foot rides with it, so it is measured on the mat)
      var belt = api.belt ? api.belt(t) : 0;
      api.SIDES.forEach(function (sd) {
        var bp = api.wpos(A.B[sd.X + 'ToeBase']), hp = api.wpos(A.B[sd.X + 'Foot']);
        bp.x += belt; hp.x += belt;
        if (P.info.feet[sd.k].w > 0.97) {
          if (!spot[sd.k]) spot[sd.k] = [];
          spot[sd.k].forEach(function (q) {
            var d = Math.min(Math.hypot(q[0] - bp.x, q[1] - bp.z), Math.hypot(q[2] - hp.x, q[3] - hp.z));
            if (d > moved[sd.k].far) { moved[sd.k].far = d; moved[sd.k].t = Math.round(t); }
          });
          spot[sd.k].push([bp.x, bp.z, hp.x, hp.z]);
        } else spot[sd.k] = null;
      });
      var Pt = api.partner();
      // (a partner lying on the floor is not standing on its feet; the loop's jump from lying back to standing is the restart)
      if (Pt && P.partner && (P.partner.rest > 0.3 || P.partner.restart)) pspot = { N: null, F: null };
      else if (Pt && P.partner) api.SIDES.forEach(function (sd) {
        var bp = api.wpos(Pt.B[sd.X + 'ToeBase']), hp = api.wpos(Pt.B[sd.X + 'Foot']);
        if (P.partner.feet[sd.k].w > 0.97) {
          if (!pspot[sd.k]) pspot[sd.k] = [];
          pspot[sd.k].forEach(function (q) {
            var d = Math.min(Math.hypot(q[0] - bp.x, q[1] - bp.z), Math.hypot(q[2] - hp.x, q[3] - hp.z));
            if (d > pmoved[sd.k].far) { pmoved[sd.k].far = d; pmoved[sd.k].t = Math.round(t); }
          });
          pspot[sd.k].push([bp.x, bp.z, hp.x, hp.z]);
        } else pspot[sd.k] = null;
      });
      Object.keys(m).forEach(function (k) {
        if (typeof m[k] !== 'number') return;
        R.max[k] = Math.max(R.max[k] === undefined ? -1e9 : R.max[k], m[k]); R.min[k] = Math.min(R.min[k] === undefined ? 1e9 : R.min[k], m[k]);
      });
      m.flags.forEach(function (fl) { var key = fl.replace(/-?[0-9.]+/g, '#'); (R.flags[key] = R.flags[key] || { n: 0, eg: fl, t: Math.round(t) }).n++; });
      // sudden jumps: a model joint moving much further than the lesson joint between samples
      var now = { hip: api.wpos(A.B.Hips), aN: api.wpos(A.B.RightFoot), aF: api.wpos(A.B.LeftFoot), hN: api.wpos(A.B.RightHand), hF: api.wpos(A.B.LeftHand), n: P.info.n, rest: P.info.rest };
      // (while the body is sitting or lying down onto the floor it is meant to move further than the stick figure's joints)
      var settling = prev && (now.rest > 0.02 && now.rest < 0.98 || prev.rest > 0.02 && prev.rest < 0.98 || Math.abs(now.rest - prev.rest) > 0.5);
      if (prev && !settling) ['hip', 'aN', 'aF', 'hN', 'hF'].forEach(function (k) {
        var dm = now[k].distanceTo(prev[k]), dls = now.n[k].distanceTo(prev.n[k]);
        if (dm > 2.2 * dls + 0.07) { R.pops++; (R.flags['jump ' + k] = R.flags['jump ' + k] || { n: 0, eg: 'jump ' + k + ' ' + (dm * 100).toFixed(0) + 'cm (lesson ' + (dls * 100).toFixed(0) + 'cm)', t: Math.round(t) }).n++; }
      });
      prev = now;
    }
    if (off.n >= Math.max(4, Math.round(N / 12))) R.flags['off balance'] = { n: off.n, eg: 'off balance: weight ' + (off.max * 100).toFixed(0) + 'cm ' + off.dir + ' the feet', t: off.t };
    // (a gap under the feet for a single sample is the instant before touchdown, not a body hovering)
    Object.keys(R.flags).forEach(function (k) { if (/^floats/.test(k) && R.flags[k].n < 2) delete R.flags[k]; });
    api.SIDES.forEach(function (sd) {
      if (moved[sd.k].far > 0.06 && !o.m.pivots && !o.m.slides) R.flags['planted ' + sd.X[0] + ' foot moved'] = { n: 1, eg: 'planted ' + sd.X[0] + ' foot moved ' + (moved[sd.k].far * 100).toFixed(0) + 'cm across the floor', t: moved[sd.k].t };
    });
    api.SIDES.forEach(function (sd) {
      if (pmoved[sd.k].far > 0.06) R.flags['partner planted ' + sd.X[0] + ' foot moved'] = { n: 1, eg: 'partner planted ' + sd.X[0] + ' foot moved ' + (pmoved[sd.k].far * 100).toFixed(0) + 'cm across the floor', t: pmoved[sd.k].t };
    });
    R.slideN = moved.N.far; R.slideF = moved.F.far;
    R.ok = Object.keys(R.flags).length === 0;
    if (sheets) {
      var times = [], acc = 0;
      frames.forEach(function (fr) { times.push(acc); acc += fr.d; });
      var groups = [];
      if (PER) for (var g0 = 0; g0 < times.length; g0 += PER) groups.push(times.slice(g0, g0 + PER));
      else groups = [times.length > 7 ? times.filter(function (_, i) { return i % Math.ceil(times.length / 7) === 0; }) : times];
      groups.forEach(function (ts, gi) {
        var cv = document.createElement('canvas'); cv.width = TILE * Math.max(ts.length, PER ? 3 : 1); cv.height = TILE * VIEWS.length + 18;
        var ctx = cv.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height);
        ts.forEach(function (t, i) {
          var P = api.pose(t), m = measure(P);
          if (m.bal > 0.08) m.flags.push('off balance ' + (m.bal * 100).toFixed(0) + 'cm ' + m.balDir);
          var lab = (t / 1000).toFixed(1) + 's ' + (m.flags[0] || '');
          VIEWS.forEach(function (v, vi) { tile(ctx, i * TILE, 18 + vi * TILE, P, vi ? '' : lab, v, vi ? false : m.flags.length); });
        });
        var part = groups.length > 1 ? '-' + (gi + 1) : '';
        ctx.fillStyle = '#111'; ctx.font = 'bold 12px monospace';
        ctx.fillText(R.slug + part + ' — ' + R.name + (groups.length > 1 ? '  (part ' + (gi + 1) + ' of ' + groups.length + ')' : '') + (R.ok ? '' : '   ✗ ' + Object.keys(R.flags).length + ' problem(s)'), 6, 13);
        var img = document.createElement('img'); img.setAttribute('data-sheet', R.slug + part); img.src = cv.toDataURL('image/jpeg', 0.85); img.style.cssText = 'display:block;max-width:100%;margin:6px 0';
        host.appendChild(img);
      });
    }
    out.moves.push(R);
    var p = document.createElement('div');
    p.textContent = (R.ok ? 'OK   ' : 'FAIL ') + R.slug + (R.ok ? '' : '  ' + Object.keys(R.flags).map(function (k) { return R.flags[k].eg + ' ×' + R.flags[k].n; }).join('; '));
    p.style.color = R.ok ? '#0a6' : '#b00020';
    host.appendChild(p);
    setTimeout(function () { one(idx + 1); }, 0);
  }
  function done() {
    var sc = document.createElement('script'); sc.type = 'application/json'; sc.id = 'lab-check-data'; sc.textContent = JSON.stringify(out);
    document.body.appendChild(sc);
    document.documentElement.setAttribute('data-check', 'done');
  }
  one(0);
}
