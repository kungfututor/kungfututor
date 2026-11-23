/* KungfuTutor 3D Movement Lab — a 3D instructor (cream hooded jacket, black
 * trousers, white trainers) that follows the same keyframes as the 2D lessons.
 * kt-figure.js works out the joint positions for every moment of a clip; this
 * file turns them into a three.js body you can orbit 360°, slow down and scrub.
 * The lessons are side-view, so movement happens in the side plane; turning
 * moves (roundhouse kicks) are simplified. All text is KT.pick pairs.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

var KT = window.KT, P = function (zh, en) { return KT.pick(zh, en); };
var K = 0.0095;          // metres per lesson unit (torso 58 units ≈ 0.55 m)
var FLOOR = 211;         // lesson floor line

/* ---------- the moves (reused from the lesson pages) ---------- */
var MOVES = [
  { lib: 'LETHWEI', id: 'flyknee', href: '../../combat/lethwei/', cat: P('緬甸拳', 'Lethwei') },
  { lib: 'MUAYTHAI', id: 'kick', href: '../../combat/muay-thai/', cat: P('泰拳', 'Muay Thai') },
  { lib: 'MUAYTHAI', id: 'teep', href: '../../combat/muay-thai/', cat: P('泰拳', 'Muay Thai') },
  { lib: 'BOXING', id: 'onetwo', href: '../../combat/boxing/', cat: P('拳擊', 'Boxing') },
  { lib: 'STRIKES', id: 'punch', href: '../../kungfu/strikes/', cat: P('功夫', 'Kung Fu') },
  { lib: 'STRIKES', id: 'side', href: '../../kungfu/strikes/', cat: P('功夫', 'Kung Fu') },
  { lib: 'GYM', id: 'squat', href: '../../fitness/gym/', cat: P('健身', 'Gym') },
  { lib: 'GYM', id: 'lunge', href: '../../fitness/gym/', cat: P('健身', 'Gym') }
].filter(function (m) { return window[m.lib]; }).map(function (m) {
  m.s = window[m.lib].LIST.filter(function (s) { return s.id === m.id; })[0];
  return m;
}).filter(function (m) { return m.s; });

/* ---------- pose sampling with the 2D engine (hidden) ---------- */
var hidden = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
hidden.setAttribute('aria-hidden', 'true');
hidden.style.cssText = 'position:fixed;width:1px;height:1px;left:0;top:0;opacity:0;pointer-events:none;overflow:hidden';
document.body.appendChild(hidden);
var sampler = new KTFigure.Player(hidden, { autoplay: false });
var clip = null, x0 = 0;

function loadMove(m) {
  clip = window[m.lib].makeClip(m.s, 'side', 1, KT.getLang());
  sampler.load(clip);
  var first = sampler.poseAt(0).pose, f1 = {}, k;
  for (k in first) f1[k] = first[k];
  f1.face = 1;
  x0 = KTFigure.solve(f1, { groundY: FLOOR + 3, scale: 1, cx: 0 }).hip.x;
}

/* ---------- three.js scene ---------- */
var box = document.getElementById('lab-stage');
var renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true });
} catch (e) {
  box.innerHTML = '<p class="lab-fail">' + P('你的瀏覽器無法顯示 3D 畫面，請改用 2D 課程頁面。', 'Your browser cannot show 3D graphics — please use the 2D lesson pages instead.') + '</p>';
  throw e;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
box.appendChild(renderer.domElement);
renderer.domElement.setAttribute('aria-label', P('可旋轉的 3D 教練動畫', '3D instructor animation you can rotate'));
renderer.domElement.setAttribute('role', 'img');

var scene = new THREE.Scene();
scene.background = new THREE.Color('#F4EFE6');
scene.fog = new THREE.Fog('#F4EFE6', 7, 14);
var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
camera.position.set(3.1, 1.6, 3.6);
var controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.85, 0);
controls.enableDamping = true;
controls.minDistance = 1.6;
controls.maxDistance = 8;
controls.maxPolarAngle = Math.PI * 0.495;
controls.update();

scene.add(new THREE.HemisphereLight('#FFFFFF', '#CBBFA8', 1.4));
var sun = new THREE.DirectionalLight('#FFFFFF', 2.2);
sun.position.set(3, 6, 4);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
var sc = sun.shadow.camera; sc.left = -3; sc.right = 3; sc.top = 3; sc.bottom = -3;
scene.add(sun);
var floor = new THREE.Mesh(new THREE.CircleGeometry(3.2, 64), new THREE.MeshStandardMaterial({ color: '#E9E1D2', roughness: 1 }));
floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
var ring = new THREE.Mesh(new THREE.RingGeometry(1.05, 1.08, 64), new THREE.MeshBasicMaterial({ color: '#4E7060', transparent: true, opacity: 0.35 }));
ring.rotation.x = -Math.PI / 2; ring.position.y = 0.002; scene.add(ring);

/* ---------- the instructor ---------- */
function std(c, r) { return new THREE.MeshStandardMaterial({ color: c, roughness: r === undefined ? 0.75 : r }); }
var M = { skin: std('#B88466', 0.6), hair: std('#161616', 0.9), jacket: std('#D9CDB7'), trim: std('#3A3D44'), pants: std('#1E2026', 0.9), shoe: std('#ECEDE9', 0.5), sole: std('#9EA2A8', 0.8) };
var body = new THREE.Group(); scene.add(body);
var UPV = new THREE.Vector3(0, 1, 0);
function mesh(geo, mat) { var m = new THREE.Mesh(geo, mat); m.castShadow = true; body.add(m); return m; }
function limb(r1, r2, mat) { return mesh(new THREE.CylinderGeometry(r2, r1, 1, 18), mat); }   // r1 at the start joint, r2 at the end
function ball(r, mat) { return mesh(new THREE.SphereGeometry(r, 20, 14), mat); }

var parts = {
  thighN: limb(0.088, 0.066, M.pants), shinN: limb(0.064, 0.05, M.pants),
  thighF: limb(0.088, 0.066, M.pants), shinF: limb(0.064, 0.05, M.pants),
  kneeN: ball(0.066, M.pants), kneeF: ball(0.066, M.pants),
  cuffN: ball(0.054, M.pants), cuffF: ball(0.054, M.pants),
  shoeN: limb(0.05, 0.045, M.shoe), shoeF: limb(0.05, 0.045, M.shoe),
  heelN: ball(0.05, M.shoe), heelF: ball(0.05, M.shoe),
  upN: limb(0.06, 0.05, M.jacket), foreN: limb(0.05, 0.042, M.jacket),
  upF: limb(0.06, 0.05, M.jacket), foreF: limb(0.05, 0.042, M.jacket),
  elbN: ball(0.05, M.jacket), elbF: ball(0.05, M.jacket),
  shN: ball(0.072, M.jacket), shF: ball(0.072, M.jacket),
  handN: ball(0.046, M.skin), handF: ball(0.046, M.skin),
  hipN: ball(0.09, M.pants), hipF: ball(0.09, M.pants),
  neck: limb(0.05, 0.045, M.skin)
};
// torso frame: an unscaled group that carries the jacket, zip, hood and the 拳 badge
var torso = new THREE.Group(); body.add(torso);
var jacket = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.155, 1, 24), M.jacket); jacket.castShadow = true; torso.add(jacket);
var hem = new THREE.Mesh(new THREE.CylinderGeometry(0.158, 0.158, 0.05, 24), M.trim); torso.add(hem);
var zip = new THREE.Mesh(new THREE.BoxGeometry(0.008, 1, 0.008), M.trim); torso.add(zip);
var hood = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), M.jacket); hood.castShadow = true; torso.add(hood);
var badgeCv = document.createElement('canvas'); badgeCv.width = badgeCv.height = 128;
var bx = badgeCv.getContext('2d'); bx.fillStyle = '#26231F'; bx.font = '700 96px "Noto Serif TC","Noto Sans TC",serif'; bx.textAlign = 'center'; bx.textBaseline = 'middle'; bx.fillText('拳', 64, 70);
var badgeTex = new THREE.CanvasTexture(badgeCv); badgeTex.colorSpace = THREE.SRGBColorSpace;
var badge = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.07), new THREE.MeshBasicMaterial({ map: badgeTex, transparent: true })); torso.add(badge);
// head frame: head, hair, ears and a nose so the facing direction reads at any angle
var head = new THREE.Group(); body.add(head);
var skull = new THREE.Mesh(new THREE.SphereGeometry(0.105, 24, 18), M.skin); skull.scale.set(0.95, 1.12, 0.88); skull.castShadow = true; head.add(skull);
var hair = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.48), M.hair); hair.scale.set(0.97, 1.1, 0.92); hair.position.set(-0.008, 0.012, 0); head.add(hair);
var nose = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), M.skin); nose.position.set(0.1, -0.005, 0); head.add(nose);
[0.092, -0.092].forEach(function (z) { var e = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), M.skin); e.position.set(-0.005, 0, z); head.add(e); });

/* ---------- 2D joints → 3D points ---------- */
var tmpQ = new THREE.Quaternion(), faceQ = new THREE.Quaternion(), tmpV = new THREE.Vector3();
function place(m, a, b) {           // stretch a limb mesh from a to b
  tmpV.subVectors(b, a); var len = tmpV.length() || 0.001;
  m.position.addVectors(a, b).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(UPV, tmpV.divideScalar(len));
  m.scale.set(1, len, 1);
}
function frameGroup(g, from, to, theta) {   // orient a group: +Y along from→to, +X forward, turned by theta
  tmpV.subVectors(to, from).normalize();
  var flat = new THREE.Vector3(tmpV.x, tmpV.y, 0).normalize();
  var ang = Math.atan2(-flat.x, flat.y);
  tmpQ.setFromAxisAngle(new THREE.Vector3(0, 0, 1), ang);
  faceQ.setFromAxisAngle(UPV, theta);
  g.quaternion.copy(faceQ).multiply(tmpQ);
}

function pose3d(time) {
  var st = sampler.poseAt(time), p = {}, k;
  for (k in st.pose) p[k] = st.pose[k];
  var face = typeof p.face === 'number' ? p.face : 1;
  p.face = 1;
  var J = KTFigure.solve(p, { groundY: FLOOR + 3, scale: 1, cx: 0 });
  var theta = (1 - face) / 2 * Math.PI;
  var hx = (J.hip.x - x0) * K, cos = Math.cos(theta), sin = Math.sin(theta);
  function V(j, z) {
    var x = (j.x - x0) * K - hx, y = (FLOOR - j.y) * K;
    return new THREE.Vector3(hx + x * cos + z * sin, y, -x * sin + z * cos);
  }
  return { J: J, V: V, theta: theta, seg: st.seg };
}

function drawBody(time) {
  var r = pose3d(time), J = r.J, V = r.V;
  var hip = V(J.hip, 0), sh = V(J.sh, 0), hd = V(J.head, 0);
  var hipN = V(J.hipN, 0.1), hipF = V(J.hipF, -0.1), kN = V(J.kN, 0.1), kF = V(J.kF, -0.1);
  var aN = V(J.aN, 0.1), aF = V(J.aF, -0.1), tN = V(J.tN, 0.1), tF = V(J.tF, -0.1);
  var shN = V(J.shN, 0.19), shF = V(J.shF, -0.19), eN = V(J.eN, 0.2), eF = V(J.eF, -0.2);
  var hN = V(J.hN, 0.12), hF = V(J.hF, -0.12);
  place(parts.thighN, hipN, kN); place(parts.shinN, kN, aN); place(parts.shoeN, aN, tN);
  place(parts.thighF, hipF, kF); place(parts.shinF, kF, aF); place(parts.shoeF, aF, tF);
  parts.kneeN.position.copy(kN); parts.kneeF.position.copy(kF);
  parts.cuffN.position.copy(aN); parts.cuffF.position.copy(aF);
  parts.heelN.position.copy(aN); parts.heelF.position.copy(aF);
  parts.hipN.position.copy(hipN); parts.hipF.position.copy(hipF);
  place(parts.upN, shN, eN); place(parts.foreN, eN, hN); place(parts.upF, shF, eF); place(parts.foreF, eF, hF);
  parts.elbN.position.copy(eN); parts.elbF.position.copy(eF);
  parts.shN.position.copy(shN); parts.shF.position.copy(shF);
  parts.handN.position.copy(hN); parts.handF.position.copy(hF);
  var neckTop = sh.clone().lerp(hd, 0.55);
  place(parts.neck, sh, neckTop);
  // torso group sits at the hip, +Y towards the shoulders
  torso.position.copy(hip);
  frameGroup(torso, V(J.hip, 0), V(J.sh, 0), 0);
  // undo the turn inside frameGroup: compute in unturned space, then turn
  var flat = new THREE.Vector3((J.sh.x - J.hip.x), (J.hip.y - J.sh.y), 0).normalize();
  tmpQ.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.atan2(-flat.x, flat.y));
  faceQ.setFromAxisAngle(UPV, r.theta);
  torso.quaternion.copy(faceQ).multiply(tmpQ);
  var L = hip.distanceTo(sh);
  jacket.scale.set(0.62, L + 0.06, 1); jacket.position.set(0, L / 2 + 0.01, 0);
  hem.position.set(0, -0.015, 0); hem.scale.set(0.62, 1, 1);
  zip.scale.set(1, L * 0.92, 1); zip.position.set(0.12, L * 0.5, 0);
  hood.position.set(-0.07, L + 0.02, 0); hood.rotation.z = 0.5;
  badge.position.set(0.118, L * 0.72, 0.075); badge.rotation.set(0, Math.PI / 2, 0);
  // head
  head.position.copy(hd);
  var hf = new THREE.Vector3((J.head.x - J.sh.x), (J.sh.y - J.head.y), 0).normalize();
  tmpQ.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.atan2(-hf.x, hf.y));
  head.quaternion.copy(faceQ).multiply(tmpQ);
  return r.seg;
}

/* ---------- player state + UI ---------- */
var state = { move: 0, t: 0, playing: !window.matchMedia('(prefers-reduced-motion: reduce)').matches, speed: 1, total: 1, lastSeg: -1 };
var $ = function (id) { return document.getElementById(id); };
var elPlay = $('lab-play'), elScrub = $('lab-scrub'), elStep = $('lab-step'), elName = $('lab-name'), elCat = $('lab-cat'), elLink = $('lab-link');

function setMove(i) {
  state.move = i; var m = MOVES[i];
  loadMove(m);
  state.total = sampler.total; state.t = 0; state.lastSeg = -1;
  elName.textContent = KT.name(m.s);
  elCat.textContent = m.cat;
  elLink.href = m.href + '#s=' + m.s.n;
  [].forEach.call(document.querySelectorAll('#lab-moves button'), function (b, j) { b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
  // recentre the floor ring and camera target under the move
  draw();
}
function draw() {
  var seg = drawBody(state.t);
  if (seg !== state.lastSeg) {
    state.lastSeg = seg;
    var c = clip.frames[seg] && clip.frames[seg].c;
    elStep.textContent = (seg + 1) + ' / ' + clip.frames.length + ' · ' + (c ? KT.t(c) : '');
  }
  elScrub.value = String(Math.round(((state.t % state.total) + state.total) % state.total / state.total * 1000));
}
function setPlaying(on) {
  state.playing = on;
  elPlay.textContent = on ? P('❚❚ 暫停', '❚❚ Pause') : P('▶ 播放', '▶ Play');
  elPlay.setAttribute('aria-pressed', on ? 'true' : 'false');
}

var list = $('lab-moves');
MOVES.forEach(function (m, i) {
  var b = document.createElement('button');
  b.type = 'button';
  b.innerHTML = '<small></small><span></span>';
  b.querySelector('small').textContent = m.cat;
  b.querySelector('span').textContent = KT.name(m.s);
  b.addEventListener('click', function () { setMove(i); setPlaying(true); });
  list.appendChild(b);
});
elPlay.addEventListener('click', function () { setPlaying(!state.playing); });
$('lab-reset').addEventListener('click', function () { state.t = 0; setPlaying(false); draw(); });
$('lab-next').addEventListener('click', function () {
  setPlaying(false);
  var acc = 0, t = state.t % state.total;
  for (var i = 0; i < clip.frames.length; i++) { acc += clip.frames[i].d; if (acc > t + 1) { state.t = acc % state.total; break; } }
  draw();
});
elScrub.addEventListener('input', function () { setPlaying(false); state.t = elScrub.value / 1000 * state.total; draw(); });
[].forEach.call(document.querySelectorAll('[data-speed]'), function (b) {
  b.addEventListener('click', function () {
    state.speed = +b.getAttribute('data-speed');
    [].forEach.call(document.querySelectorAll('[data-speed]'), function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
  });
});
var VIEWS = { front: [4.4, 1.25, 0], back: [-4.4, 1.25, 0], left: [0, 1.25, 4.4], right: [0, 1.25, -4.4], angle: [3.1, 1.6, 3.6], top: [0.01, 5, 0.6] };
[].forEach.call(document.querySelectorAll('[data-view]'), function (b) {
  b.addEventListener('click', function () {
    var v = VIEWS[b.getAttribute('data-view')];
    camera.position.set(v[0], v[1], v[2]); controls.target.set(0, 0.85, 0); controls.update();
  });
});

function resize() {
  var w = box.clientWidth, h = box.clientHeight;
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);

var last = 0, visible = true;
if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(box);
function loop(now) {
  var dt = last ? Math.min(now - last, 64) : 0; last = now;
  if (visible && !document.hidden) {
    if (state.playing) { state.t += dt * state.speed; draw(); }
    controls.update();
    renderer.render(scene, camera);
  }
  requestAnimationFrame(loop);
}

if (MOVES.length) {
  resize(); setMove(0); setPlaying(state.playing); requestAnimationFrame(loop);
} else {
  box.innerHTML = '<p class="lab-fail">' + P('動作資料載入失敗。', 'The moves could not be loaded.') + '</p>';
}
