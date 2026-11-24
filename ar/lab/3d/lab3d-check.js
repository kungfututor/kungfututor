/* KungfuTutor 3D Lab — self-check (loaded only when the page is opened with ?check).
 * Poses the instructor through every move and measures what a viewer would notice:
 * feet/hands the lesson puts on the floor really touch it, nothing sinks or floats,
 * and knees, ankles, elbows and hips stay inside what a body can do.
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
  var TILE = 230, vv = new THREE.Vector3();

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

  function measure(P) {
    var I = P.info, f = [], lows = A.full.lows(), all = Math.min.apply(null, lows);
    var grounded = I.g < 0.005, m = { low: all, g: I.g, pitch: I.pitch * DEG, passes: I.passes, flags: f };
    A.full.refresh();
    var part = ['body', 'R foot', 'L foot', 'R hand', 'L hand', 'R thumb', 'L thumb', 'R arm', 'L arm', 'R leg', 'L leg'][lows.indexOf(all)];
    if (all < -0.006) f.push(part + ' sinks ' + (all * 100).toFixed(1) + 'cm');
    if (grounded && all > 0.008) f.push('floats ' + (all * 100).toFixed(1) + 'cm');
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
        if (Math.abs(b) < 2) { if (Math.abs(heel) > 0.015 || Math.abs(ball) > 0.015) f.push(tag + ' foot not flat (heel ' + (heel * 100).toFixed(1) + ', ball ' + (ball * 100).toFixed(1) + 'cm)'); }
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
    return m;
  }

  function tile(ctx, x, y, P, label, view, bad) {
    var hip = api.wpos(A.B.Hips);
    if (view === 'side') cam.position.set(hip.x, 1.0, 6.2); else cam.position.set(hip.x + 4.4, 1.9, 4.4);
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
    var R = { slug: o.m.slug, name: api.name(o.m), flags: {}, max: {}, min: {}, pops: 0 };
    var prev = null;
    for (var s = 0; s < N; s++) {
      var t = total * s / N, P = api.pose(t), m = measure(P);
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
    R.ok = Object.keys(R.flags).length === 0;
    if (sheets) {
      var times = [], acc = 0;
      frames.forEach(function (fr) { times.push(acc); acc += fr.d; });
      if (times.length > 7) times = times.filter(function (_, i) { return i % Math.ceil(times.length / 7) === 0; });
      var cv = document.createElement('canvas'); cv.width = TILE * times.length; cv.height = TILE * 2 + 18;
      var ctx = cv.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height);
      times.forEach(function (t, i) {
        var P = api.pose(t), m = measure(P), lab = (t / 1000).toFixed(1) + 's ' + (m.flags[0] || '');
        tile(ctx, i * TILE, 18, P, lab, 'side', m.flags.length); tile(ctx, i * TILE, 18 + TILE, P, '', 'angle', false);
      });
      ctx.fillStyle = '#111'; ctx.font = 'bold 12px monospace'; ctx.fillText(R.slug + ' — ' + R.name + (R.ok ? '' : '   ✗ ' + Object.keys(R.flags).length + ' problem(s)'), 6, 13);
      var img = document.createElement('img'); img.setAttribute('data-sheet', R.slug); img.src = cv.toDataURL('image/jpeg', 0.82); img.style.cssText = 'display:block;max-width:100%;margin:6px 0';
      host.appendChild(img);
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
