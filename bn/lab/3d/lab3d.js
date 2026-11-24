/* KungfuTutor 3D Movement Lab — a 3D instructor (cream hooded jacket, black
 * trousers, white trainers) that follows the same keyframes as the 2D lessons.
 * kt-figure.js works out the joint positions for every moment of a clip; this
 * file turns them into a three.js body you can orbit 360°, slow down and scrub.
 * Most lessons are side-view, so movement happens in the side plane and twisting
 * moves are simplified. Stances that also have a front view are combined:
 * forward/up from the side view, width from the front view. All text is KT.pick pairs.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

var KT = window.KT, P = function (zh, en) { return KT.pick(zh, en); };
var K = 0.0095;          // metres per lesson unit (torso 58 units ≈ 0.55 m)
var FLOOR = 211;         // lesson floor line

/* ---------- the moves (reused from the lesson pages) ---------- */
var CATS = [
  { k: 'kungfu', n: P('功夫', 'Kung Fu') }, { k: 'strike', n: P('打擊', 'Striking') },
  { k: 'grapple', n: P('摔與地面', 'Grappling') }, { k: 'defence', n: P('自我防衛', 'Self-Defence') },
  { k: 'fit', n: P('健身', 'Fitness') }
];
var LIB = {
  STANCES: [P('功夫步型', 'Kung fu stances'), '../../kungfu/stances/'], STRIKES: [P('功夫拳腳', 'Kung fu strikes'), '../../kungfu/strikes/'],
  TAICHI: [P('太極拳', 'Tai Chi'), '../../kungfu/tai-chi/'], LETHWEI: [P('緬甸拳', 'Lethwei'), '../../combat/lethwei/'],
  MUAYTHAI: [P('泰拳', 'Muay Thai'), '../../combat/muay-thai/'], BOXING: [P('拳擊', 'Boxing'), '../../combat/boxing/'],
  MMA: [P('綜合格鬥', 'MMA'), '../../combat/mma/'], JUDO: [P('柔道', 'Judo'), '../../combat/judo/'],
  BJJ: [P('巴西柔術', 'BJJ'), '../../combat/bjj/'], WRESTLING: [P('摔跤', 'Wrestling'), '../../combat/wrestling/'],
  SELFDEF: [P('防身術', 'Self-defence'), '../../self-defence/basics/'], KRAV: [P('以色列格鬥術', 'Krav Maga'), '../../self-defence/krav-maga/'],
  GYM: [P('健身房', 'Gym'), '../../fitness/gym/']
};
function mv(cat, lib, key, extra) { var o = { cat: cat, lib: lib, key: key }; for (var k in extra || {}) o[k] = extra[k]; return o; }
var MOVES = [
  mv('kungfu', 'STANCES', 'horse', { mode: 'both' }), mv('kungfu', 'STANCES', 'bow'), mv('kungfu', 'STANCES', 'drop', { mode: 'front' }),
  mv('kungfu', 'STANCES', 'empty'), mv('kungfu', 'STRIKES', 'punch'), mv('kungfu', 'STRIKES', 'palm'),
  mv('kungfu', 'STRIKES', 'snap'), mv('kungfu', 'STRIKES', 'side'), mv('kungfu', 'STRIKES', 'stretch'),
  mv('kungfu', 'TAICHI', 1), mv('kungfu', 'TAICHI', 3), mv('kungfu', 'TAICHI', 4), mv('kungfu', 'TAICHI', 9), mv('kungfu', 'TAICHI', 13),
  mv('strike', 'LETHWEI', 'flyknee'), mv('strike', 'LETHWEI', 'elbow'),
  mv('strike', 'MUAYTHAI', 'kick'), mv('strike', 'MUAYTHAI', 'teep'), mv('strike', 'MUAYTHAI', 'knee'),
  mv('strike', 'MUAYTHAI', 'elbow'), mv('strike', 'MUAYTHAI', 'check'),
  mv('strike', 'BOXING', 'jab'), mv('strike', 'BOXING', 'onetwo'), mv('strike', 'BOXING', 'hook'), mv('strike', 'BOXING', 'upper'),
  mv('strike', 'BOXING', 'slip'), mv('strike', 'BOXING', 'weave'), mv('strike', 'MMA', 'overhand'),
  mv('grapple', 'MMA', 'double'), mv('grapple', 'MMA', 'sprawl'), mv('grapple', 'MMA', 'standup'),
  mv('grapple', 'WRESTLING', 'stance'), mv('grapple', 'JUDO', 'breakfall'), mv('grapple', 'BJJ', 'shrimp'),
  mv('defence', 'SELFDEF', 'fence'), mv('defence', 'SELFDEF', 'palm'), mv('defence', 'SELFDEF', 'hammer'),
  mv('defence', 'SELFDEF', 'elbow'), mv('defence', 'SELFDEF', 'kick'), mv('defence', 'SELFDEF', 'cover'),
  mv('defence', 'KRAV', 'burst'), mv('defence', 'KRAV', 'kick'),
  mv('fit', 'GYM', 'squat', { bar: 'back' }), mv('fit', 'GYM', 'deadlift', { bar: 'hands' }), mv('fit', 'GYM', 'press', { bar: 'hands' }),
  mv('fit', 'GYM', 'row', { bar: 'hands' }), mv('fit', 'GYM', 'lunge'), mv('fit', 'GYM', 'pushup'), mv('fit', 'GYM', 'plank'), mv('fit', 'GYM', 'bridge')
].filter(function (m) { return window[m.lib] && LIB[m.lib]; }).map(function (m) {
  m.s = window[m.lib].LIST.filter(function (s) { return typeof m.key === 'number' ? s.n === m.key : s.id === m.key; })[0];
  m.slug = m.lib.toLowerCase() + '-' + m.key;
  return m;
}).filter(function (m) { return m.s; });

/* ---------- pose sampling with the 2D engine (hidden) ---------- */
function hiddenSvg() {
  var el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText = 'position:fixed;width:1px;height:1px;left:0;top:0;opacity:0;pointer-events:none;overflow:hidden';
  document.body.appendChild(el);
  return el;
}
var sideP = new KTFigure.Player(hiddenSvg(), { autoplay: false });
var frontP = new KTFigure.Player(hiddenSvg(), { autoplay: false });
var cur = null, clip = null, x0 = 0, OPT = { groundY: FLOOR + 3, scale: 1, cx: 0 };

function build(m, view) {
  var L = window[m.lib], lang = KT.getLang();
  return m.lib === 'STANCES' ? L.makeClip(m.s.id, view, 1, lang) : L.makeClip(m.s, view, 1, lang);
}
function solveAt(player, t, flat) {
  var p = {}, k, src = player.poseAt(t).pose;
  for (k in src) p[k] = src[k];
  var face = typeof p.face === 'number' ? p.face : 1;
  if (flat) p.face = 1;
  return { J: KTFigure.solve(p, OPT), face: face, pose: p };
}
function loadMove(m) {
  cur = m;
  var mode = m.mode || 'side';
  if (mode !== 'front') { clip = build(m, 'side'); sideP.load(clip); }
  if (mode !== 'side') { var fc = build(m, 'front'); frontP.load(fc); if (mode === 'front') { clip = fc; } }
  x0 = mode === 'front' ? 0 : solveAt(sideP, 0, true).J.hip.x;
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
function std(c, r, metal) { return new THREE.MeshStandardMaterial({ color: c, roughness: r === undefined ? 0.75 : r, metalness: metal || 0 }); }
var M = { skin: std('#B88466', 0.6), hair: std('#161616', 0.9), jacket: std('#D9CDB7'), trim: std('#3A3D44'), pants: std('#1E2026', 0.9), shoe: std('#ECEDE9', 0.5), steel: std('#9AA0A8', 0.35, 0.8), plate: std('#2B2E35', 0.6) };
var body = new THREE.Group(); scene.add(body);
var UPV = new THREE.Vector3(0, 1, 0), ZV = new THREE.Vector3(0, 0, 1);
function mesh(geo, mat, parent) { var m = new THREE.Mesh(geo, mat); m.castShadow = true; (parent || body).add(m); return m; }
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
var jacket = mesh(new THREE.CylinderGeometry(0.19, 0.155, 1, 24), M.jacket, torso);
var hem = new THREE.Mesh(new THREE.CylinderGeometry(0.158, 0.158, 0.05, 24), M.trim); torso.add(hem);
var zip = new THREE.Mesh(new THREE.BoxGeometry(0.008, 1, 0.008), M.trim); torso.add(zip);
var hood = mesh(new THREE.SphereGeometry(0.11, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), M.jacket, torso);
var badgeCv = document.createElement('canvas'); badgeCv.width = badgeCv.height = 128;
var bx = badgeCv.getContext('2d'); bx.fillStyle = '#26231F'; bx.font = '700 96px "Noto Serif TC","Noto Sans TC",serif'; bx.textAlign = 'center'; bx.textBaseline = 'middle'; bx.fillText('拳', 64, 70);
var badgeTex = new THREE.CanvasTexture(badgeCv); badgeTex.colorSpace = THREE.SRGBColorSpace;
var badge = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.07), new THREE.MeshBasicMaterial({ map: badgeTex, transparent: true })); torso.add(badge);
// head frame: head, hair, ears and a nose so the facing direction reads at any angle
var head = new THREE.Group(); body.add(head);
var skull = mesh(new THREE.SphereGeometry(0.105, 24, 18), M.skin, head); skull.scale.set(0.95, 1.12, 0.88);
var hair = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.48), M.hair); hair.scale.set(0.97, 1.1, 0.92); hair.position.set(-0.008, 0.012, 0); head.add(hair);
var nose = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), M.skin); nose.position.set(0.1, -0.005, 0); head.add(nose);
[0.092, -0.092].forEach(function (z) { var e = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), M.skin); e.position.set(-0.005, 0, z); head.add(e); });
// barbell (gym lifts): bar along the body's width, 20 kg-style plates
var barbell = new THREE.Group(); scene.add(barbell); barbell.visible = false;
var barRod = mesh(new THREE.CylinderGeometry(0.014, 0.014, 1.6, 12), M.steel, barbell); barRod.rotation.x = Math.PI / 2;
[0.56, -0.56].forEach(function (z) {
  var pl = mesh(new THREE.CylinderGeometry(0.225, 0.225, 0.05, 32), M.plate, barbell); pl.rotation.x = Math.PI / 2; pl.position.z = z;
  var co = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.04, 12), M.steel, barbell); co.rotation.x = Math.PI / 2; co.position.z = z - Math.sign(z) * 0.05;
});

/* ---------- 2D joints → 3D points ---------- */
var tmpQ = new THREE.Quaternion(), faceQ = new THREE.Quaternion(), tmpV = new THREE.Vector3();
function place(m, a, b) {           // stretch a limb mesh from a to b
  tmpV.subVectors(b, a); var len = tmpV.length() || 0.001;
  m.position.addVectors(a, b).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(UPV, tmpV.divideScalar(len));
  m.scale.set(1, len, 1);
}
function lean(from, to) {           // rotation about Z that points +Y along from→to (side plane)
  var fx = to.x - from.x, fy = from.y - to.y, l = Math.hypot(fx, fy) || 1;
  return tmpQ.setFromAxisAngle(ZV, Math.atan2(-fx / l, fy / l));
}

// depth (z) used when only a side view exists
var DEPTH = { hip: 0, sh: 0, head: 0, hipN: 0.1, hipF: -0.1, kN: 0.1, kF: -0.1, aN: 0.1, aF: -0.1, tN: 0.1, tF: -0.1, shN: 0.19, shF: -0.19, eN: 0.2, eF: -0.2, hN: 0.12, hF: -0.12 };

function pose3d(t) {
  var mode = cur.mode || 'side';
  var S = mode !== 'front' ? solveAt(sideP, t, true) : null;
  var F = mode !== 'side' ? solveAt(frontP, t, false) : null;
  var Js = S ? S.J : F.J, Jf = F ? F.J : null;
  var face = S ? S.face : 1, theta = (1 - face) / 2 * Math.PI;
  var hx = mode === 'front' ? 0 : (Js.hip.x - x0) * K, cos = Math.cos(theta), sin = Math.sin(theta);
  var wide = cur.bar && cur.bar !== 'back' ? 0.25 : cur.bar === 'back' ? 0.3 : 0, P0 = S ? S.pose : F.pose;
  // a lesson upper arm drawn shorter than full length (luN / luF) points out towards the viewer: put that elbow out to the side
  function elbowZ(name) {
    var lu = P0[name === 'eN' ? 'luN' : 'luF'];
    lu = typeof lu === 'number' ? Math.min(1, lu) : 1;
    return Math.max(wide + 0.04, 0.19 + 30 * K * Math.sqrt(1 - lu * lu));
  }
  function V(name, pt) {
    var j = pt || Js[name];
    var x = mode === 'front' ? 0 : (j.x - x0) * K - hx, y = (FLOOR - j.y) * K;
    var z = Jf && !pt ? (Jf[name].x - Jf.hip.x) * K : (DEPTH[name] || 0);
    if (wide && (name === 'hN' || name === 'hF')) z = name === 'hN' ? wide : -wide;
    // push-up hands (lesson gives luN/luF): planted on the floor at shoulder width, straight under the shoulders
    else if (!Jf && (name === 'hN' || name === 'hF') && typeof P0.luN === 'number' && y < 0.04) z = name === 'hN' ? 0.2 : -0.2;
    if ((wide || (!Jf && typeof P0[name === 'eN' ? 'luN' : 'luF'] === 'number')) && (name === 'eN' || name === 'eF')) z = name === 'eN' ? elbowZ(name) : -elbowZ(name);
    return new THREE.Vector3(hx + x * cos + z * sin, y, -x * sin + z * cos);
  }
  return { J: Js, V: V, theta: theta, pose: S ? S.pose : F.pose, seg: (S ? sideP : frontP).poseAt(t).seg };
}

/* ---------- the skinned instructor model (made for KungfuTutor with Meshy, private licence) ----------
 * One .glb file: the textured instructor (cream hooded jacket, black joggers, white
 * trainers) with a standard humanoid skeleton (Mixamo bone names). The lesson gives stick-figure
 * joints; the body is fitted to them so that it stays physically possible:
 *  - the pelvis and spine follow the lesson's torso; legs and arms are solved with two-bone IK
 *    (fixed bone lengths), and every bone keeps a natural twist, so knees and elbows only fold
 *    the way a real joint does and ankles stay inside their range;
 *  - a foot the lesson puts on the ground is pressed onto the floor: flat, or on the ball of the
 *    foot / the heel when the lesson lifts the heel / the toes. Hands on the floor lie flat;
 *  - the body's height is then set so nothing floats and nothing sinks through the floor. When
 *    hands and feet both carry weight (push-up, plank) the body is tipped a few degrees so both
 *    ends reach the floor with the lesson's straight line kept.
 * N (near, +z) is the body's right side, F its left.
 */
var MODEL_URL = '/assets/models/instructor/kt-instructor.glb';
var avatar = null;
var AV = { v1: new THREE.Vector3(), v2: new THREE.Vector3(), q1: new THREE.Quaternion(), q2: new THREE.Quaternion(), q3: new THREE.Quaternion() };
// three.js drops the colon from "mixamorig:Hips", so match on the part after the prefix
function boneKey(name) { return name.replace(/^mixamorig[:_]?/i, ''); }
var NEED = ['Hips', 'Spine', 'Neck', 'Head', 'RightArm', 'RightForeArm', 'RightHand', 'RightHandMiddle1', 'LeftArm', 'LeftForeArm', 'LeftHand', 'LeftHandMiddle1',
  'RightUpLeg', 'RightLeg', 'RightFoot', 'RightToeBase', 'LeftUpLeg', 'LeftLeg', 'LeftFoot', 'LeftToeBase'];
var SIDES = [{ X: 'Right', k: 'N', foot: 1, hand: 3, arm: 7, leg: 9 }, { X: 'Left', k: 'F', foot: 2, hand: 4, arm: 8, leg: 10 }];   // skin regions (0 = trunk and head)
var DEG = Math.PI / 180, IDQ = new THREE.Quaternion();
var PLATE_R = 0.225;                                     // barbell plate radius (m); scaled up with the model when it loads
function v3(x, y, z) { return new THREE.Vector3(x, y, z); }
function wpos(b) { return b.getWorldPosition(new THREE.Vector3()); }
function wquat(b) { return b.getWorldQuaternion(new THREE.Quaternion()); }
function setWQ(b, q) { b.quaternion.copy(wquat(b.parent).invert().multiply(q)); b.updateMatrixWorld(true); }
function perp(v, axis) { return v.clone().addScaledVector(axis, -v.dot(axis)); }
function flat(v) { return v3(v.x, 0, v.z); }
function smooth(a, b, x) { var t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
// rotation taking the frame (a1, a2) onto (b1, b2): a1 → b1 exactly, a2 as close as it can
var _m1 = new THREE.Matrix4(), _m2 = new THREE.Matrix4();
function frameRot(a1, a2, b1, b2) {
  var x1 = a1.clone().normalize(), y1 = perp(a2, x1).normalize(), z1 = new THREE.Vector3().crossVectors(x1, y1);
  var x2 = b1.clone().normalize(), y2 = perp(b2, x2);
  if (y2.lengthSq() < 1e-10) y2 = perp(Math.abs(x2.y) < 0.9 ? v3(0, 1, 0) : v3(1, 0, 0), x2);
  y2.normalize();
  var z2 = new THREE.Vector3().crossVectors(x2, y2);
  _m1.makeBasis(x1, y1, z1); _m2.makeBasis(x2, y2, z2);
  return new THREE.Quaternion().setFromRotationMatrix(_m2.multiply(_m1.transpose()));
}
// two-bone IK: root S reaches for T with segment lengths l1, l2; the middle joint bends towards bendDir
function ik2(S, T, l1, l2, bendDir, fallback, maxFold) {
  var st = T.clone().sub(S), d0 = st.length(), u = d0 > 1e-6 ? st.divideScalar(d0) : v3(0, -1, 0);
  var near = maxFold ? Math.sqrt(l1 * l1 + l2 * l2 + 2 * l1 * l2 * Math.cos(maxFold)) : Math.abs(l1 - l2) + 1e-4;   // closest the end can come at the joint's tightest fold
  var reach = l1 + l2 - 1e-4, d = Math.min(Math.max(d0, near), reach);
  var x = (l1 * l1 - l2 * l2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, l1 * l1 - x * x));
  var v = perp(bendDir, u);
  if (v.lengthSq() < 1e-6) v = perp(fallback.clone(), u);
  if (v.lengthSq() < 1e-8) v = perp(Math.abs(u.y) < 0.9 ? v3(0, 1, 0) : v3(1, 0, 0), u);
  v.normalize();
  var r = { S: S, u: u, v: v, x: x, h: h, d: d, short: d0 - reach };
  r.set = function () { r.M = S.clone().addScaledVector(u, x).addScaledVector(r.v, h); r.E = S.clone().addScaledVector(u, d); return r; };
  return r.set();
}
// closed fists: each finger joint turns towards the palm (palms face down in the model's T-pose)
var FINGERS = ['Index', 'Middle', 'Ring', 'Pinky'], CURL = [0.95, 0.95, 0.55], THUMB = [0.2, 0.35, 0.35];
function fistTurns(B) {
  var out = { Right: [], Left: [] }, down = v3(0, -1, 0), wq = new THREE.Quaternion();
  ['Right', 'Left'].forEach(function (side) {
    function add(name, child, ang) {
      var b = B[side + 'Hand' + name], c = B[side + 'Hand' + child];
      if (!b || !c) return;
      var dir = wpos(c).sub(wpos(b)).normalize();
      var axis = new THREE.Vector3().crossVectors(dir, down).normalize();          // turning about this moves the finger towards the palm
      axis.applyQuaternion(b.getWorldQuaternion(wq).invert());                     // into the joint's own frame
      out[side].push([b, new THREE.Quaternion().setFromAxisAngle(axis, ang), b.quaternion.clone()]);
    }
    FINGERS.forEach(function (f) { [1, 2, 3].forEach(function (j) { add(f + j, f + (j + 1), CURL[j - 1]); }); });
    [1, 2, 3].forEach(function (j) { add('Thumb' + j, 'Thumb' + (j + 1), THUMB[j - 1]); });
  });
  return out;
}
/* A light copy of the skin, so the body's lowest point can be found every frame without the GPU.
 * world position of a vertex = Σ weight · (bone.matrixWorld · boneInverse) · (bindMatrix · v) */
function skinSampler(mesh, step) {
  var geo = mesh.geometry, pos = geo.attributes.position, si = geo.attributes.skinIndex, sw = geo.attributes.skinWeight;
  var skel = mesh.skeleton, nb = skel.bones.length;
  var region = skel.bones.map(function (b) {
    var m = /^(Right|Left)(Foot|ToeBase|Toe_End|HandThumb|Hand|ForeArm|Arm|UpLeg|Leg)/.exec(boneKey(b.name));
    if (!m) return 0;                                        // trunk, head, collar bones
    var base = { Foot: 1, ToeBase: 1, Toe_End: 1, Hand: 3, HandThumb: 5, ForeArm: 7, Arm: 7, UpLeg: 9, Leg: 9 }[m[2]];
    return base + (m[1] === 'Left' ? 1 : 0);                 // 1/2 feet, 3/4 hands, 5/6 thumbs, 7/8 arms, 9/10 legs (right/left)
  });
  function regionOf(i) {
    var best = 0, bw = -1;
    for (var c = 0; c < 4; c++) { var w = sw.getComponent(i, c); if (w > bw) { bw = w; best = si.getComponent(i, c); } }
    return region[best];
  }
  // every vertex of the hands and feet (they are what touches the floor), every step-th vertex of the rest
  var pick = [], i, j, c;
  for (i = 0; i < pos.count; i++) { var rg = regionOf(i); if (i % step === 0 || (rg >= 1 && rg <= 6)) pick.push(i); }
  var count = pick.length;
  var P = new Float32Array(count * 3), I = new Uint16Array(count * 4), Wt = new Float32Array(count * 4), R = new Uint8Array(count);
  var v = new THREE.Vector3();
  for (j = 0; j < count; j++) {
    i = pick[j];
    v.fromBufferAttribute(pos, i).applyMatrix4(mesh.bindMatrix);
    P[j * 3] = v.x; P[j * 3 + 1] = v.y; P[j * 3 + 2] = v.z;
    for (c = 0; c < 4; c++) { I[j * 4 + c] = si.getComponent(i, c); Wt[j * 4 + c] = sw.getComponent(i, c); }
    R[j] = regionOf(i);
  }
  var mats = new Float32Array(nb * 16), mt = new THREE.Matrix4();
  function refresh() { for (var b = 0; b < nb; b++) { mt.multiplyMatrices(skel.bones[b].matrixWorld, skel.boneInverses[b]); mats.set(mt.elements, b * 16); } }
  function at(j, out) {
    var x = P[j * 3], y = P[j * 3 + 1], z = P[j * 3 + 2], ox = 0, oy = 0, oz = 0;
    for (var c = 0; c < 4; c++) {
      var w = Wt[j * 4 + c]; if (!w) continue;
      var o = I[j * 4 + c] * 16;
      ox += w * (mats[o] * x + mats[o + 4] * y + mats[o + 8] * z + mats[o + 12]);
      oy += w * (mats[o + 1] * x + mats[o + 5] * y + mats[o + 9] * z + mats[o + 13]);
      oz += w * (mats[o + 2] * x + mats[o + 6] * y + mats[o + 10] * z + mats[o + 14]);
    }
    return out.set(ox, oy, oz);
  }
  // lowest height per skin region
  function lows() {
    refresh();
    var out = [1e9, 1e9, 1e9, 1e9, 1e9, 1e9, 1e9, 1e9, 1e9, 1e9, 1e9];
    for (var j = 0; j < count; j++) {
      var x = P[j * 3], y = P[j * 3 + 1], z = P[j * 3 + 2], oy = 0;
      for (var c = 0; c < 4; c++) {
        var w = Wt[j * 4 + c]; if (!w) continue;
        var o = I[j * 4 + c] * 16;
        oy += w * (mats[o + 1] * x + mats[o + 5] * y + mats[o + 9] * z + mats[o + 13]);
      }
      if (oy < out[R[j]]) out[R[j]] = oy;
    }
    return out;
  }
  return { count: count, region: R, refresh: refresh, at: at, lows: lows };
}
function setupAvatar(root) {
  var B = {}, rig = new THREE.Group(), body3d = null;
  rig.add(root);
  root.traverse(function (o) {
    if (o.isBone) B[boneKey(o.name)] = o;
    if (o.isSkinnedMesh) { o.castShadow = true; o.frustumCulled = false; body3d = body3d || o; }
  });
  if (!body3d || NEED.some(function (n) { return !B[n]; })) return null;
  rig.updateMatrixWorld(true);
  // scale the model so its legs match the lesson figure (thigh + shin = 88 units)
  var leg = wpos(B.RightUpLeg).distanceTo(wpos(B.RightLeg)) + wpos(B.RightLeg).distanceTo(wpos(B.RightFoot));
  rig.scale.setScalar((88 * K) / leg); rig.updateMatrixWorld(true);
  var right = wpos(B.RightUpLeg).sub(wpos(B.LeftUpLeg)); right.y = 0; right.normalize();
  var fwd = new THREE.Vector3().crossVectors(UPV, right).normalize();
  var rest = {}, RQ = {};
  Object.keys(B).forEach(function (n) { rest[n] = B[n].quaternion.clone(); RQ[n] = wquat(B[n]); });
  var fist = fistTurns(B), open = { Right: [], Left: [] };
  ['Right', 'Left'].forEach(function (X) {                   // thumb laid level, for a hand flat on the floor
    var t1 = B[X + 'HandThumb1'], t2 = B[X + 'HandThumb2'];
    if (!t1 || !t2) return;
    var dir = wpos(t2).sub(wpos(t1)).normalize(), wq = wquat(t1);
    open[X].push([t1, wq.clone().invert().multiply(new THREE.Quaternion().setFromUnitVectors(dir, flat(dir).normalize())).multiply(wq)]);
  });
  // rest-pose measurements (rig scaled, not turned)
  var full = skinSampler(body3d, 1), vv = new THREE.Vector3(), D = {}, kneeR = 1e9;
  full.refresh();
  SIDES.forEach(function (s) {
    var X = s.X, up = wpos(B[X + 'UpLeg']), kn = wpos(B[X + 'Leg']), an = wpos(B[X + 'Foot']), ball = wpos(B[X + 'ToeBase']);
    var sh = wpos(B[X + 'Arm']), el = wpos(B[X + 'ForeArm']), wr = wpos(B[X + 'Hand']), mid = wpos(B[X + 'HandMiddle1']);
    var heelBack = 1e9, sole = 1e9, handLow = 1e9, elbowLow = 1e9;
    for (var j = 0; j < full.count; j++) {
      var rg = full.region[j];
      if (rg === s.leg) { full.at(j, vv); kneeR = Math.min(kneeR, vv.distanceTo(kn)); continue; }
      if (rg === s.arm) { full.at(j, vv); if (vv.distanceTo(el) < 0.09) elbowLow = Math.min(elbowLow, vv.y); continue; }
      if (rg !== s.foot && rg !== s.hand) continue;
      full.at(j, vv);
      if (rg === s.foot) { sole = Math.min(sole, vv.y); heelBack = Math.min(heelBack, vv.dot(fwd)); }
      else handLow = Math.min(handLow, vv.y);
    }
    var heel = an.clone().addScaledVector(fwd, heelBack + 0.025 - an.dot(fwd)); heel.y = sole;
    var thighDir = kn.clone().sub(up), shinDir = an.clone().sub(kn), upperDir = el.clone().sub(sh), foreDir = wr.clone().sub(el);
    D[X] = {
      thigh: thighDir.length(), shin: shinDir.length(), upper: upperDir.length(), fore: foreDir.length(),
      thighDir: thighDir.clone().normalize(), shinDir: shinDir.clone().normalize(),
      legHinge: new THREE.Vector3().crossVectors(thighDir, fwd.clone().negate()).normalize(),
      upperDir: upperDir.clone().normalize(), foreDir: foreDir.clone().normalize(),
      armHinge: new THREE.Vector3().crossVectors(upperDir, fwd).normalize(),
      ankleH: an.y - sole, ballH: ball.y - sole, ballFwd: ball.clone().sub(an).dot(fwd),
      fromBall: an.clone().sub(ball), fromHeel: an.clone().sub(heel),
      finger: mid.clone().sub(wr).normalize(), wristH: wr.y - handLow + 0.004, elbowR: el.y - elbowLow, grip: mid.distanceTo(wr) * 0.62
    };
    // sole points used by the self-check: under the heel and under the ball of the foot
    var hs = [], bs = [], af = an.dot(fwd), bf = ball.dot(fwd);
    for (j = 0; j < full.count; j++) {
      if (full.region[j] !== s.foot) continue;
      full.at(j, vv);
      if (vv.y > sole + 0.03) continue;
      var fz = vv.dot(fwd);
      if (fz < af + 0.03) hs.push(j); else if (fz > bf - 0.04 && fz < bf + 0.03) bs.push(j);
    }
    D[X].heelSet = hs; D[X].ballSet = bs;
  });
  scene.add(rig);
  return { rig: rig, B: B, rest: rest, RQ: RQ, D: D, fist: fist, open: open, fwd: fwd, right: right, mesh: body3d,
    skin: skinSampler(body3d, 3), full: full, kneeR: kneeR * 1.25,
    armScale: (D.Right.upper + D.Right.fore) / ((KTFigure.DIM.upper + KTFigure.DIM.fore) * K), ankleH: D.Right.ankleH };
}
function aimBone(bone, child, dir) {
  if (!bone || !child || dir.lengthSq() < 1e-8) return;
  var bp = bone.getWorldPosition(AV.v1), cp = child.getWorldPosition(AV.v2);
  var cur = cp.sub(bp).normalize();
  AV.q1.setFromUnitVectors(cur, dir.clone().normalize());
  var wq = bone.getWorldQuaternion(AV.q2).premultiply(AV.q1);
  var pw = bone.parent.getWorldQuaternion(AV.q3).invert();
  bone.quaternion.copy(pw.multiply(wq));
  bone.updateMatrixWorld(true);
}
var RIGID = ['hip', 'sh', 'head'];
/* n: lesson joints in metres (floor at y = 0), theta: facing, move: the move being shown.
 * The lesson's own joint angles are kept wherever they can be; contact with the floor is then made exact.
 * Returns what was done, for the barbell and the self-check. */
function poseAvatar(n, theta, move) {
  var A = avatar, B = A.B, D = A.D, info = { feet: {}, hands: {}, pitch: 0 };
  var frontView = move && move.mode && move.mode !== 'side', bar = move && move.bar;
  var face = new THREE.Quaternion().setFromUnitVectors(A.fwd, v3(1, 0, 0).applyAxisAngle(UPV, theta));
  var FW = A.fwd.clone().applyQuaternion(face), RT = A.right.clone().applyQuaternion(face), LF = RT.clone().negate();
  var tw = function (v) { return v.clone().applyQuaternion(face); };          // a rest-pose vector, turned to the facing
  var W0 = function (name) { return face.clone().multiply(A.RQ[name]); };     // a bone's rest orientation, turned
  var g = 1e9, n0 = n;                                      // n0: the lesson as written (n may be tipped or hinged below)
  Object.keys(n).forEach(function (k) { if (k !== 'head') g = Math.min(g, n[k].y); });
  g = Math.max(0, g);
  var grounded = 1 - smooth(0.09, 0.16, g);                  // lessons draw floor contact a few units above the line (a sitting hip ~7)

  // pelvis, spine and head at the lesson's hip (no height correction yet)
  function core(n) {
    Object.keys(B).forEach(function (k) { B[k].quaternion.copy(A.rest[k]); });
    A.rig.quaternion.copy(face); A.rig.position.set(0, 0, 0); A.rig.updateMatrixWorld(true);
    var up = n.sh.clone().sub(n.hip).normalize();
    var hr = perp(n.hipN.clone().sub(n.hipF), up);
    if (hr.lengthSq() < 1e-6) hr = perp(RT, up);
    hr.normalize();
    setWQ(B.Hips, frameRot(UPV, RT, up, hr).multiply(W0('Hips')));
    aimBone(B.Spine, B.Neck, n.sh.clone().sub(n.hip));
    aimBone(B.Neck, B.Head, n.head.clone().sub(n.sh));
    var mid = wpos(B.RightUpLeg).add(wpos(B.LeftUpLeg)).multiplyScalar(0.5);
    A.rig.position.copy(n.hip).sub(mid); A.rig.updateMatrixWorld(true);
    return { up: up, hr: hr, pLeft: hr.clone().negate(), pFwd: new THREE.Vector3().crossVectors(up, hr).normalize(),
      pos0: A.rig.position.clone(), Sh: { Right: wpos(B.RightArm), Left: wpos(B.LeftArm) }, Hs: { Right: wpos(B.RightUpLeg), Left: wpos(B.LeftUpLeg) } };
  }
  // a planted foot: its direction on the floor (f.head0 turned out by f.turn) and heel-lift f.beta give the
  // foot's rotation and how high the ankle then sits (f.Ay)
  function footShape(f) {
    var d = D[f.X];
    var outward = new THREE.Vector3().crossVectors(f.head0, UPV).multiplyScalar(f.X === 'Right' ? 1 : -1);
    f.head = f.head0.clone().multiplyScalar(Math.cos(f.turn)).addScaledVector(outward, Math.sin(f.turn)).normalize();
    f.lat = new THREE.Vector3().crossVectors(UPV, f.head).normalize();
    f.sole = f.head.clone().multiplyScalar(Math.cos(f.beta)).addScaledVector(UPV, -Math.sin(f.beta));
    f.rot = frameRot(FW, LF, f.sole, f.lat); f.rotFlat = frameRot(FW, LF, f.head, f.lat);
    // heel up: the ball of the foot stays on the floor; toes up: the heel does
    f.Ay = f.beta >= 0 ? d.ballH + tw(d.fromBall).applyQuaternion(f.rot).y : tw(d.fromHeel).applyQuaternion(f.rot).y;
  }
  function planFoot(s, n, w) {
    var d = D[s.X], a = n['a' + s.k], t = n['t' + s.k], kn = n['k' + s.k], hp = n['hip' + s.k], f = { X: s.X, k: s.k, region: s.foot, turn: 0, slide: 0, adj: 0 };
    f.touch = 1 - smooth(0.035, 0.08, Math.max(0, Math.min(a.y, t.y)));   // drawn at floor level, whatever its angle
    f.w = w === undefined ? f.touch : w;
    f.rel = a.clone().sub(hp);                               // the lesson's hip → ankle
    f.ext = Math.min(1, f.rel.length() / (d.thigh + d.shin));
    f.bendDir = perp(kn.clone().sub(hp), f.rel.clone().normalize());
    var h = flat(t.clone().sub(a)), braw;                    // braw: + = toes lower than the ankle (heel lifted)
    if (frontView) {                                         // front-view stances: toes follow a bent knee, point forward on a straight leg
      var th = kn.clone().sub(hp), thh = flat(th), kf = 0.75 * smooth(20 * DEG, 70 * DEG, th.angleTo(a.clone().sub(kn))) * smooth(0.05, 0.15, thh.length());
      f.head0 = FW.clone().multiplyScalar(1 - kf).addScaledVector(thh.normalize(), kf).normalize();
      braw = Math.atan2(a.y - t.y, Math.max(h.length(), 1e-4));
    } else {                                                 // side view: the foot points along the facing; past 90° the toes point back
      f.head0 = FW.clone();
      braw = Math.atan2(a.y - t.y, h.dot(FW));
    }
    if (w === undefined) f.w *= 1 - smooth(95 * DEG, 115 * DEG, Math.abs(braw));    // toes pointing back (top of the foot down): not a standing foot
    if (w === undefined) f.w *= smooth(0.2, 0.35, f.ext);                           // ankle drawn at the hip: not a real foot position
    f.beta = Math.max(-40 * DEG, Math.min(150 * DEG, braw * smooth(6 * DEG, 16 * DEG, Math.abs(braw))));
    f.beta0 = f.beta; f.toes = smooth(8 * DEG, 20 * DEG, f.beta) * (1 - smooth(95 * DEG, 120 * DEG, f.beta));   // 1 = standing on the ball of the foot
    footShape(f);
    f.c = f.Ay - a.y;                                       // body lift that keeps the lesson's leg shape with this foot down
    return f;
  }
  function planHand(s, n, C, w) {
    var d = D[s.X], h = n['h' + s.k], sh = n['sh' + s.k], S = C.Sh[s.X], H = { X: s.X, k: s.k, region: s.hand, slide: 0, adj: 0 };
    H.w = w === undefined ? (bar ? 0 : (1 - smooth(0.045, 0.075, Math.max(0, h.y))) * grounded) : w;
    H.rel = h.clone().sub(sh).multiplyScalar((d.upper + d.fore) / ((KTFigure.DIM.upper + KTFigure.DIM.fore) * K));   // the lesson's shoulder → hand, at this arm's length
    H.bendDir = perp(n['e' + s.k].clone().sub(sh), H.rel.clone().normalize());
    H.at = v3(S.x + H.rel.x, 0, S.z + H.rel.z);              // the spot on the floor under that hand
    var dl = H.rel.length(), hd = Math.hypot(H.rel.x, H.rel.z);
    H.c = d.wristH + Math.sqrt(Math.max(0, dl * dl - hd * hd)) - S.y;   // body lift that keeps the lesson's elbow angle with this hand down
    var h0 = n0['h' + s.k];
    H.barX = h0.x + barShift;
    H.barY = Math.max(h0.y, PLATE_R) + d.grip * Math.max(0, -H.rel.y / Math.max(dl, 1e-4));  // wrist height that puts the grip on the bar
    H.barW = Math.max(h0.y, PLATE_R) + d.grip;                           // the same with the arm hanging straight down
    // forearm on the floor too (forearm plank): the shoulder sits one upper arm above the elbow
    var e = n['e' + s.k], we = H.w * (1 - smooth(0.045, 0.075, Math.max(0, n0['e' + s.k].y)));
    H.fore = we;
    if (we > 0) {
      var he = Math.hypot(e.x - sh.x, e.z - sh.z) * d.upper / (KTFigure.DIM.upper * K);
      H.c += (Math.min(H.c, d.elbowR + 0.012 + Math.sqrt(Math.max(0, d.upper * d.upper - he * he)) - S.y) - H.c) * we;
    }
    H.cBar = H.barY - S.y - H.rel.y;                                    // body lift that brings the hand down to a bar on the floor
    return H;
  }
  // body lift wanted by the planted feet: the straighter a leg, the less it can give, so it decides
  function feetLift(feet) {
    var sw = 0, sc = 0, fw = 0, fc = 0, wFlat = 0;
    feet.forEach(function (f) {
      var om = f.w * Math.exp(40 * f.ext), fl = 1 - f.toes;
      sw += om; sc += om * f.c; fw += om * fl; fc += om * fl * f.c; wFlat = Math.max(wFlat, f.w * fl);
    });
    if (sw < 1e-9) return A.ankleH;
    var c = sc / sw;
    if (fw > 1e-9) c += (fc / fw - c) * wFlat;               // a flat foot cannot adapt, so it decides; a foot on its toes moves its heel
    var lift = A.ankleH + (c - A.ankleH) * Math.max(feet[0].w, feet[1].w);
    // never higher than a planted leg can reach at full stretch (give or take the few millimetres lessons vary by)
    feet.forEach(function (f) {
      var d = D[f.X], reach = d.thigh + d.shin - 0.001, hl = Math.hypot(f.rel.x, f.rel.z);
      var top = f.Ay + (d.ballH + Math.hypot(d.fromBall.y, d.ballFwd) - f.Ay) * f.toes;        // a foot on its toes can still raise its heel
      lift -= Math.max(0, lift - (top + Math.sqrt(Math.max(0, reach * reach - hl * hl)) - C.Hs[f.X].y + 0.006)) * smooth(0.6, 1, f.w);
    });
    return lift;
  }
  // hands and feet (or knees) carry the body together: tip the lesson a few degrees so both ends land
  function pitchOf(n, feet, hands, torsoRest) {
    var wH = Math.max(hands[0].w, hands[1].w) * (1 - torsoRest);
    if (wH < 0.01) return null;
    var Hm = v3(0, 0, 0), cH = 0, sw = 0;
    hands.forEach(function (H) { Hm.addScaledVector(H.at, H.w); cH += H.c * H.w; sw += H.w; });
    Hm.divideScalar(sw); cH /= sw;
    // rear support: the feet, or the knees when the feet are off the floor
    var wFt = Math.max(feet[0].w, feet[1].w), Rf = v3(0, 0, 0), Rk = v3(0, 0, 0), cK = 0, wK = 0, sf = 0, sk = 0;
    feet.forEach(function (f, i) { Rf.addScaledVector(flat(n['a' + SIDES[i].k]), f.w); sf += f.w; });
    SIDES.forEach(function (s) {
      var k = n['k' + s.k], w = 1 - smooth(0.035, 0.06, Math.max(0, n0['k' + s.k].y));
      Rk.addScaledVector(flat(k), w); sk += w; cK += (A.kneeR - k.y) * w; wK = Math.max(wK, w);
    });
    if (sf > 1e-6) Rf.divideScalar(sf);
    if (sk > 1e-6) { Rk.divideScalar(sk); cK /= sk; }
    wK *= 1 - wFt;
    var wR = Math.max(wFt, wK);
    if (wR < 0.01) return null;
    var Rm = Rf.multiplyScalar(wFt).addScaledVector(Rk, wK).divideScalar(wFt + wK), cR = (feetLift(feet) * wFt + cK * wK) / (wFt + wK);
    var dv = Rm.sub(Hm), Dh = dv.length();
    if (Dh < 0.4) return null;
    var phi = Math.asin(Math.max(-0.22, Math.min(0.22, (cR - cH) / Dh))) * wH * wR;
    return { axis: new THREE.Vector3().crossVectors(dv.normalize(), UPV).normalize(), pivot: Hm, phi: phi };
  }
  function solveLeg(f, n, C) {
    var d = D[f.X], S = wpos(B[f.X + 'UpLeg']), reach = d.thigh + d.shin - 0.001;
    var Tfree = S.clone().add(f.rel), dl = f.rel.length(), hl = Math.hypot(f.rel.x, f.rel.z), keep = smooth(0.955, 0.99, f.ext) * smooth(0.2, 0.4, hl / Math.max(dl, 1e-4));
    var r, td, sd, hinge, h0, shinUp, p = 0, flex0 = 0;
    if (f.toes > 0) {                                        // on the ball of the foot: raise or lower the heel so the leg keeps the lesson's shape
      var fb = tw(d.fromBall), R = Math.hypot(fb.y, fb.dot(FW)), th0 = Math.atan2(fb.y, -fb.dot(FW));
      var q = Math.asin(Math.max(-1, Math.min(1, (Tfree.y + kneeDrop - d.ballH) / R)));   // (a body sunk deeper for a low knee keeps the foot as it was)
      var bs = (f.beta0 + th0 > Math.PI / 2 ? Math.PI - q : q) - th0;
      f.beta = f.beta0 + (Math.max(3 * DEG, Math.min(88 * DEG, bs)) - f.beta0) * f.toes; footShape(f);
    }
    for (var pass = 0; pass < 7; pass++) {
      // planted: the ankle stays over the spot the lesson's leg reaches, at the height the foot needs
      var ay = f.Ay + f.adj, hd = hl, dy = S.y - ay;
      if (hl > 1e-4) {
        // a straight leg stays straight: slide the foot a little rather than bend or over-stretch the knee
        hd += Math.max(-0.05, Math.min(0.05, Math.sqrt(Math.max(0, dl * dl - dy * dy)) - hl)) * keep;
        if (Math.hypot(hd, dy) > reach + 0.015) hd = Math.sqrt(Math.max(0, (reach + 0.015) * (reach + 0.015) - dy * dy));   // well out of reach: bring the foot in
      }
      var Tp = v3(S.x + (hl > 1e-4 ? f.rel.x * hd / hl : 0), ay, S.z + (hl > 1e-4 ? f.rel.z * hd / hl : 0));
      f.slide = Math.abs(hd - hl) * f.w;
      var T = Tfree.clone().lerp(Tp, f.w);
      f.wo = Math.max(f.w, 1 - smooth(0, 0.06, T.y - ay));   // how much the foot is "on the floor" for its angle (1 at contact height)
      if (T.y < ay) T.y = ay;                                // a foot cannot go under the floor, planted or not
      r = ik2(S, T, d.thigh, d.shin, f.bendDir, C.pFwd, 152 * DEG);
      for (var tries = 0; tries < 2; tries++) {
        td = r.M.clone().sub(S); sd = r.E.clone().sub(r.M);
        // the knee axis a relaxed hip would give this thigh; a real knee folds the same way round
        h0 = C.pLeft.clone().applyQuaternion(new THREE.Quaternion().setFromUnitVectors(C.up.clone().negate(), td.clone().normalize()));
        hinge = new THREE.Vector3().crossVectors(td, sd).divideScalar(d.thigh * d.shin);
        if (tries === 0 && hinge.length() > 0.03 && hinge.dot(h0) < -0.5 * hinge.length()) { r.v.negate(); r.set(); f.flipped = true; } else break;
      }
      f.bend = hinge.length();
      // a straight planted leg turns with its foot (toes out → knee out)
      var hs = perp(f.lat, td.clone().normalize());
      if (hs.lengthSq() > 0.05 && f.w > 0) h0 = h0.clone().lerp(hs.normalize(), f.w * 0.9).normalize();
      hinge.addScaledVector(h0, 0.06).normalize();
      shinUp = sd.clone().normalize().negate();
      // ankle: 0 = foot square to the shin, - = toes pulled up towards the shin, + = toes pointed away
      p = -Math.asin(Math.max(-1, Math.min(1, f.sole.dot(shinUp))));
      if (f.w > 0.5 && pass === 0) {                         // a flat foot under a far-leaning shin turns out, as a bow stance's back foot does
        flex0 = -p;
        if (flex0 > 26 * DEG && Math.abs(f.beta) < 3 * DEG) { f.turn = Math.min(50 * DEG, (flex0 - 26 * DEG) * 2.6); footShape(f); continue; }
      }
      if ((f.w > 0.5 || f.wo > 0.5) && pass < 6) {           // still past the ankle's range: lift the heel (or lower it)
        var far = f.beta > 3 * DEG ? 70 * DEG : 40 * DEG;     // a foot on its toes points further than a flat or heel-resting one
        var fix = p < -38 * DEG ? -38 * DEG - p : p > far ? far - p : 0;
        if (Math.abs(fix) > 0.3 * DEG) { f.beta = Math.max(-88 * DEG, Math.min(150 * DEG, f.beta + fix * 1.4)); footShape(f); f.ankleFix = fix; continue; }
      }
      break;
    }
    setWQ(B[f.X + 'UpLeg'], frameRot(tw(d.thighDir), tw(d.legHinge), td, hinge).multiply(W0(f.X + 'UpLeg')));
    setWQ(B[f.X + 'Leg'], frameRot(tw(d.shinDir), tw(d.legHinge), sd, hinge).multiply(W0(f.X + 'Leg')));
    // a foot in the air keeps the lesson's foot line, inside the ankle's range
    var legFwd = new THREE.Vector3().crossVectors(hinge, shinUp).normalize();
    var sf = n['t' + f.k].clone().sub(n['a' + f.k]);
    if (sf.lengthSq() < 1e-8) sf = FW.clone();
    sf.normalize();
    var pf = Math.max(-30 * DEG, Math.min(65 * DEG, Math.atan2(-sf.dot(shinUp), sf.dot(legFwd)))), out = Math.max(-0.5, Math.min(0.5, sf.dot(hinge)));
    sf = legFwd.clone().multiplyScalar(Math.cos(pf)).addScaledVector(shinUp, -Math.sin(pf)).multiplyScalar(Math.sqrt(1 - out * out)).addScaledVector(hinge, out);
    var rot = frameRot(FW, LF, sf, hinge).slerp(f.rot, f.wo);
    setWQ(B[f.X + 'Foot'], rot.clone().multiply(W0(f.X + 'Foot')));
    setWQ(B[f.X + 'ToeBase'], (f.beta > 0 ? rot.clone().slerp(f.rotFlat, f.wo * (1 - smooth(92 * DEG, 115 * DEG, f.beta))) : rot).clone().multiply(W0(f.X + 'ToeBase')));
    f.ankle = pf + (p - pf) * f.wo; f.twist = hinge.angleTo(C.pLeft.clone().applyQuaternion(new THREE.Quaternion().setFromUnitVectors(C.up.clone().negate(), td.clone().normalize())));
    f.knee = td.angleTo(sd); f.short = r.short; f.hip = C.up.clone().negate().angleTo(td);
    info.feet[f.k] = f;
  }
  function solveArm(H, n, C, wb) {
    var d = D[H.X], sb = B[H.X + 'Shoulder'], side = H.X === 'Right' ? 1 : -1, reach = d.upper + d.fore - 0.0002;
    if (sb) { sb.quaternion.copy(A.rest[H.X + 'Shoulder']); sb.updateMatrixWorld(true); }
    var S = wpos(B[H.X + 'Arm']), T = S.clone().add(H.rel), bend = H.bendDir;
    if (bar === 'back') {                                    // hands on the bar across the upper back, elbows down and back
      T = wpos(B.Neck).addScaledVector(C.pFwd, -0.1).addScaledVector(C.up, -0.02).addScaledVector(C.hr, 0.36 * side);
      bend = C.up.clone().multiplyScalar(-1).addScaledVector(C.pFwd, -0.4);
    }
    if (wb) { T.y += (H.barW - T.y) * wb; T.x += (H.barX - T.x) * wb; }   // bar resting on the floor: hands on the bar itself
    if (H.w > 0) {                                           // hand on the floor: under where the lesson's arm reaches, as far as the arm allows
      var wy = d.wristH + H.adj, dy = S.y - wy, hl = Math.hypot(H.rel.x, H.rel.z), far = Math.sqrt(Math.max(0, reach * reach - dy * dy)), hd = Math.min(hl, far);
      H.slide = (hl - hd) * H.w;
      T.lerp(v3(S.x + (hl > 1e-4 ? H.rel.x * hd / hl : 0), wy, S.z + (hl > 1e-4 ? H.rel.z * hd / hl : 0)), H.w);
    }
    // hand on the floor a few millimetres closer than the lesson's arm length (the two shoulders never sit at
    // exactly the height each arm wants): the shoulder blade moves the shoulder out, so the elbow keeps the lesson's angle
    if (sb && H.w > 0) {
      var gapA = Math.min(0.02, Math.min(H.rel.length(), d.upper + d.fore - 0.0002) - S.distanceTo(T)) * H.w;
      if (gapA > 0.0003) {
        var P = wpos(sb), a0 = S.clone().sub(P), a1 = S.clone().addScaledVector(S.clone().sub(T).normalize(), gapA).sub(P);
        setWQ(sb, new THREE.Quaternion().setFromUnitVectors(a0.normalize(), a1.normalize()).multiply(wquat(sb)));
        S = wpos(B[H.X + 'Arm']);                        // the hand stays on its spot
      }
    }
    var fdn = n['h' + H.k].clone().sub(n['e' + H.k]).normalize().y;
    var hf = d.wristH + Math.min(0, H.adj) * H.w + (0.03 + 0.1 * Math.max(0, -fdn)) * (1 - H.w);   // a hand cannot go under the floor (a planted palm seen hovering may come down to it) (a fist hanging below the wrist needs more room than a flat palm)
    if (T.y < hf) T.y = hf;
    var r = ik2(S, T, d.upper, d.fore, bend, UPV.clone().negate(), 148 * DEG);
    var ud = r.M.clone().sub(S), fd = r.E.clone().sub(r.M);
    var restUp = tw(d.upperDir), restH = tw(d.armHinge);
    var h0 = restH.clone().applyQuaternion(new THREE.Quaternion().setFromUnitVectors(restUp, ud.clone().normalize()));
    var hinge = new THREE.Vector3().crossVectors(ud, fd).divideScalar(d.upper * d.fore);
    H.bend = hinge.length();
    hinge.addScaledVector(h0, 0.06).normalize();
    setWQ(B[H.X + 'Arm'], frameRot(restUp, restH, ud, hinge).multiply(W0(H.X + 'Arm')));
    setWQ(B[H.X + 'ForeArm'], frameRot(tw(d.foreDir), restH, fd, hinge).multiply(W0(H.X + 'ForeArm')));
    var hand = B[H.X + 'Hand'];
    hand.quaternion.copy(A.rest[H.X + 'Hand']); hand.updateMatrixWorld(true);
    if (H.w > 0) {                                           // on the floor: palm flat, fingers pointing away from the body
      var hh = flat(T.clone().sub(S)).addScaledVector(FW, 0.12).normalize();
      // (a wrist held up by the forearm resting on the floor: the hand dips so the fingers still touch)
      var dip = Math.asin(Math.max(0, Math.min(0.34, H.adj / 0.16))), fd2 = hh.clone().multiplyScalar(Math.cos(dip)).addScaledVector(UPV, -Math.sin(dip));
      setWQ(hand, wquat(hand).slerp(frameRot(tw(d.finger), UPV, fd2, UPV).multiply(W0(H.X + 'Hand')), H.w));
    }
    A.fist[H.X].forEach(function (p) { p[0].quaternion.copy(p[2]).multiply(IDQ.clone().slerp(p[1], 1 - H.w)); });
    if (H.w > 0) A.open[H.X].forEach(function (p) { p[0].quaternion.multiply(IDQ.clone().slerp(p[1], H.w)); });
    hand.updateMatrixWorld(true);
    H.elbow = ud.angleTo(fd); H.short = r.short; H.T = T;
    info.hands[H.k] = H;
  }

  var barShift = 0;                                        // a barbell on the floor moved forward over the model's mid-foot
  var kneeDrop = 0;                                        // how much deeper than the lesson the body went for a low knee
  var C = core(n), feet = SIDES.map(function (s) { return planFoot(s, n); }), hands = SIDES.map(function (s) { return planHand(s, n, C); });
  var wF = feet.map(function (f) { return f.w; }), wH = hands.map(function (H) { return H.w; }), maxFoot = Math.max(wF[0], wF[1]);
  var lying = Math.max(feet[0].touch - wF[0], feet[1].touch - wF[1]);   // a foot on the floor that is not a standing foot (toes pointing back)
  function replan() {
    C = core(n);
    feet = SIDES.map(function (s, i) { return planFoot(s, n, wF[i]); }); hands = SIDES.map(function (s, i) { return planHand(s, n, C, wH[i]); });
  }
  // parts the lesson rests on the floor (hips, back, head, a knee whose foot is off the floor)
  var torsoRest = 0, rest;
  var hipHi = 0.24 - 0.12 * Math.max(wH[0], wH[1]);          // a sitting hip is drawn ~7 units up and lifts off gradually; propped on the hands (push-up) it is not sitting
  RIGID.forEach(function (k) { var hip = k === 'hip'; torsoRest = Math.max(torsoRest, 1 - smooth(hip ? 0.085 : 0.05, hip ? hipHi : 0.085, Math.max(0, n0[k].y))); });
  rest = torsoRest;
  SIDES.forEach(function (s, i) { rest = Math.max(rest, (1 - smooth(0.035, 0.055, Math.max(0, n0['k' + s.k].y))) * (1 - 0.85 * wF[i])); });
  // nothing planted but a knee, elbow, hand or the trunk drawn at floor level: the body rests on it (feet landing from a jump do not count)
  var gBody = 1e9;
  Object.keys(n0).forEach(function (k) { if (k !== 'head' && !/^[at][NF]$/.test(k)) gBody = Math.min(gBody, n0[k].y); });
  rest = Math.max(rest * grounded, Math.max(lying, 1 - smooth(0.05, 0.08, Math.max(0, gBody))) * (1 - maxFoot));
  for (var pi = 0; pi < 2; pi++) {
    var pt = pitchOf(n, feet, hands, torsoRest);
    if (!pt || Math.abs(pt.phi) < 0.002) break;
    var n2 = {};
    Object.keys(n).forEach(function (k) { n2[k] = n[k].clone().sub(pt.pivot).applyAxisAngle(pt.axis, pt.phi).add(pt.pivot); });
    n = n2; info.pitch += pt.phi; replan();
  }
  // barbell resting on the floor (deadlift start): the bar sits over the model's mid-foot and straight arms must reach it.
  // First the knees bend a little more (the hips stay above the knees, the back keeps the lesson's angle);
  // only if that is not enough does the back hinge further.
  var wb = bar === 'hands' ? 1 - smooth(PLATE_R + 0.02, PLATE_R + 0.2, Math.min(n0.hN.y, n0.hF.y)) : 0;
  var lift = feetLift(feet), barDrop = 0;
  if (wb) {
    var midX = 0, mfw = 0;
    feet.forEach(function (f, i) { midX += (n['a' + SIDES[i].k].x + f.head.x * 0.065) * f.w; mfw += f.w; });
    if (mfw > 0.5) { barShift = Math.max(0, midX / mfw - Math.max(n0.hN.x, n0.hF.x)) * wb; replan(); }
    var ax = new THREE.Vector3().crossVectors(C.up, C.pFwd).normalize(), hipC = n.hip.clone(), armReach = D.Right.upper + D.Right.fore - 0.004;
    hipC.y += lift;
    var gap = function (dlt, dd) {                           // how far the wrists are from the bar with the torso hinged dlt further and the body dd lower
      var worst = -1e9;
      hands.forEach(function (H) {
        var S = C.Sh[H.X].clone().sub(n.hip).applyAxisAngle(ax, dlt).add(hipC);
        S.y -= dd;
        worst = Math.max(worst, S.distanceTo(v3(H.barX, H.barW, S.z + H.rel.z)) - armReach);
      });
      return worst;
    };
    var hipOver = function (dd) {                            // how far the hip joints sit above the knees with the body dd lower (feet stay put, knees go forward)
      var worst = 1e9;
      feet.forEach(function (f) {
        var d = D[f.X], hl = Math.hypot(f.rel.x, f.rel.z), dy = C.Hs[f.X].y + lift - dd - f.Ay, L = Math.max(Math.hypot(hl, dy), 1e-4);
        if (L >= d.thigh + d.shin) { worst = Math.min(worst, dy * d.thigh / L); return; }
        var al = (d.thigh * d.thigh - d.shin * d.shin + L * L) / (2 * L), hh = Math.sqrt(Math.max(0, d.thigh * d.thigh - al * al));
        worst = Math.min(worst, (dy * al - hl * hh) / L);
      });
      return worst;
    };
    var most = Math.max(0, 82 * DEG - Math.acos(Math.max(-1, Math.min(1, C.up.y)))), lean = 0, drop = 0, lo, hi, bi, md;
    if (gap(0, 0) > 0) {
      var maxDrop = 0;                                       // lowest the hips may go: 3 cm above the knees
      if (hipOver(0) > 0.03) {
        lo = 0; hi = 0.25;
        if (hipOver(hi) >= 0.03) lo = hi;
        else for (bi = 0; bi < 16; bi++) { md = (lo + hi) / 2; if (hipOver(md) >= 0.03) lo = md; else hi = md; }
        maxDrop = lo;
      }
      if (gap(0, maxDrop) <= 0) {
        lo = 0; hi = maxDrop;
        for (bi = 0; bi < 16; bi++) { md = (lo + hi) / 2; if (gap(0, md) > 0) lo = md; else hi = md; }
        drop = hi;
      } else {
        drop = maxDrop;
        if (gap(most, drop) > 0) lean = most;
        else { lo = 0; hi = most; for (bi = 0; bi < 14; bi++) { md = (lo + hi) / 2; if (gap(md, drop) > 0) lo = md; else hi = md; } lean = hi; }
      }
    }
    lean *= wb; drop *= wb;
    barDrop = drop + Math.max(0, gap(lean, drop)) * 1.15 * wb;   // still short with the back as flat as it goes: sit a little lower
    info.drop = drop;
    if (lean > 0.002) {
      var n3 = {};
      Object.keys(n).forEach(function (k) { n3[k] = /^(sh|head|e|h[NF])/.test(k) ? n[k].clone().sub(n.hip).applyAxisAngle(ax, lean).add(n.hip) : n[k]; });
      n = n3; info.lean = lean; replan(); lift = feetLift(feet);
    }
  }
  hands.forEach(function (H) { lift += (Math.min(lift, H.c) - lift) * H.w * (1 - torsoRest); });   // a hand on the floor: the shoulder can be no higher than the arm is long
  lift -= barDrop;
  var noDrop = false, penFix = 0, gapLeft = 0, liftMin = -1e9;
  kneeDrop = 0;
  for (var it = 0; it < 6; it++) {
    // a planted hand lowered to touch the floor: the shoulder comes down with it, or the arm could no longer reach its spot
    // (never below a height already found to keep the body out of the floor)
    if (it > 0) hands.forEach(function (H) { if (H.w > 0 && H.adj < 0) lift += Math.min(0, Math.max(liftMin, H.c + H.adj) - lift) * H.w * (1 - torsoRest); });
    A.rig.position.copy(C.pos0); A.rig.position.y += lift; A.rig.updateMatrixWorld(true);
    feet.forEach(function (f) { solveLeg(f, n, C); });
    hands.forEach(function (H) { solveArm(H, n, C, wb); });
    // lowest point of the body, leaving out limbs that end in a planted foot or hand (those are handled below)
    var lows = A.skin.lows(), low = lows[0], pen = 0;
    feet.forEach(function (f) { if (f.wo < 0.5) low = Math.min(low, lows[f.region], lows[f.region + 8]); else pen = Math.min(pen, lows[f.region + 8]); });
    hands.forEach(function (H) { pen = Math.min(pen, lows[H.region + 4], H.w < 0.5 ? Math.min(lows[H.region], lows[H.region + 2]) : 0); });   // arms never carry the resting body
    // sunk into the floor → lift; a knee or elbow of a planted limb sunk → lift a little; meant to rest on the floor → lower until it touches
    // (the gap to leave is fixed on the first round, so the result varies smoothly with how firmly the lesson rests the body)
    if (it === 0) gapLeft = low > 0 ? low * (1 - rest * (1 - smooth(0.45, 0.6, low))) : 0;   // a body far above the floor is not resting on it
    var dl = 0;
    if (low < 0) dl = -low;
    else if (!noDrop && it < 4 && rest > 0 && low > gapLeft + 0.0015) dl = gapLeft - low;
    else if (pen < -0.003 && penFix < 3) { dl = -pen * 0.9; penFix++; noDrop = true; }
    // a knee the lesson holds just off the floor over a foot on its toes, the other foot flat (bottom of a lunge):
    // the model's knees sit higher than the lesson figure's, so the body goes a little deeper until that knee hovers ~3.5 cm up
    if (!dl && !noDrop && it < 5) {
      feet.forEach(function (f, i) {
        var o = feet[1 - i], ky = Math.max(0, n0['k' + f.k].y);
        var wk = f.w * f.toes * o.w * (1 - o.toes) * smooth(0.02, 0.035, ky) * (1 - smooth(0.05, 0.15, ky));
        if (it === 0) f.kLow0 = lows[f.region + 8];                     // the knee's height before going any deeper
        if (wk < 0.001) return;
        var e =lows[f.region + 8] - (f.kLow0 + Math.min(0, 0.035 - f.kLow0) * wk);   // aim part-way down as the lesson's knee rises
        if (e > 0.0015) dl = Math.min(dl, -e);
      });
      kneeDrop -= dl;
    }
    info.low = low; info.lift = lift; info.passes = it + 1;
    // planted feet and hands: measure the skin and press it exactly onto the floor
    // (sinking is always corrected; hovering only once the lesson has the foot or hand fully down)
    var again = false, step = it < 2 ? 1 : 0.5;              // later rounds take half steps so they settle
    if (it < 4) {
      feet.forEach(function (f) {
        if (f.wo < 0.5) return;
        var e = lows[f.region] * step;
        if (e < -0.002) { f.adj -= e; again = true; } else if (e > 0.003 && (it === 0 || f.w > 0.98)) { f.adj -= e * smooth(0.8, 0.98, f.w); again = f.w > 0.8; }
      });
      hands.forEach(function (H) {
        if (H.w < 0.5) return;
        var e = Math.min(lows[H.region], lows[H.region + 2]), ea = Math.min(e, lows[H.region + 4]);   // the forearm lying on the floor counts too
        if (ea < -0.002) { H.adj -= ea * step / Math.max(0.5, H.w); again = true; } else if (e > 0.003 && H.fore < 0.5 && (it === 0 || H.w > 0.98)) { H.adj -= e * step * smooth(0.8, 0.98, H.w); again = H.w > 0.8; }
      });
    }
    if (Math.abs(dl) < 0.0015 && !again) break;
    if (Math.abs(dl) >= 0.0015) lift += dl;
    if (low < 0) liftMin = Math.max(liftMin, lift);
  }
  info.kneeDrop = kneeDrop; info.rest = rest; info.g = g; info.wb = wb; info.C = C; info.n = n;
  return info;
}
(function loadAvatar() {
  new GLTFLoader().load(MODEL_URL, function (g) {
    var a = setupAvatar(g.scene);
    if (!a) return;
    avatar = a; body.visible = false;
    barbell.scale.setScalar(1.155); PLATE_R = 0.225 * 1.155;   // the barbell at the model's size
    if (clip) draw();
    if (/[?&]check\b/.test(location.search)) import('./lab3d-check.js').then(function (m) { m.run(CHECK_API); });
  }, undefined, function () { /* keep the simple figure */ });
})();

var JOINTS = ['hip', 'sh', 'head', 'hipN', 'hipF', 'kN', 'kF', 'aN', 'aF', 'tN', 'tF', 'shN', 'shF', 'eN', 'eF', 'hN', 'hF'];
function drawBody(time) {
  var r = pose3d(time), J = r.J, V = r.V;
  var n = {};
  JOINTS.forEach(function (k) { n[k] = V(k); });
  faceQ.setFromAxisAngle(UPV, r.theta);
  if (avatar) {
    drawBar(r, J, V, poseAvatar(n, r.theta, cur));
    return r.seg;
  }
  place(parts.thighN, n.hipN, n.kN); place(parts.shinN, n.kN, n.aN); place(parts.shoeN, n.aN, n.tN);
  place(parts.thighF, n.hipF, n.kF); place(parts.shinF, n.kF, n.aF); place(parts.shoeF, n.aF, n.tF);
  parts.kneeN.position.copy(n.kN); parts.kneeF.position.copy(n.kF);
  parts.cuffN.position.copy(n.aN); parts.cuffF.position.copy(n.aF);
  parts.heelN.position.copy(n.aN); parts.heelF.position.copy(n.aF);
  parts.hipN.position.copy(n.hipN); parts.hipF.position.copy(n.hipF);
  place(parts.upN, n.shN, n.eN); place(parts.foreN, n.eN, n.hN); place(parts.upF, n.shF, n.eF); place(parts.foreF, n.eF, n.hF);
  parts.elbN.position.copy(n.eN); parts.elbF.position.copy(n.eF);
  parts.shN.position.copy(n.shN); parts.shF.position.copy(n.shF);
  parts.handN.position.copy(n.hN); parts.handF.position.copy(n.hF);
  place(parts.neck, n.sh, n.sh.clone().lerp(n.head, 0.55));
  torso.position.copy(n.hip);
  torso.quaternion.copy(faceQ).multiply(lean(J.hip, J.sh));
  var L = n.hip.distanceTo(n.sh);
  jacket.scale.set(0.62, L + 0.06, 1); jacket.position.set(0, L / 2 + 0.01, 0);
  hem.position.set(0, -0.015, 0); hem.scale.set(0.62, 1, 1);
  zip.scale.set(1, L * 0.92, 1); zip.position.set(0.12, L * 0.5, 0);
  hood.position.set(-0.07, L + 0.02, 0); hood.rotation.z = 0.5;
  badge.position.set(0.118, L * 0.72, 0.075); badge.rotation.set(0, Math.PI / 2, 0);
  head.position.copy(n.head);
  head.quaternion.copy(faceQ).multiply(lean(J.sh, J.head));
  drawBar(r, J, V);
  return r.seg;
}
// barbell: on the upper back for squats, in the hands for the other lifts
function drawBar(r, J, V, info) {
  barbell.visible = !!cur.bar;
  if (!cur.bar) return;
  if (avatar && info) {                                      // follow the model: across the upper back, or through both fists
    var B = avatar.B, C = info.C;
    if (cur.bar === 'back') {
      barbell.position.copy(wpos(B.Neck)).addScaledVector(C.pFwd, -0.1).addScaledVector(C.up, -0.02);
      barbell.quaternion.setFromUnitVectors(ZV, C.hr);
    } else {
      var gr = SIDES.map(function (s) { var w = wpos(B[s.X + 'Hand']); return w.add(wpos(B[s.X + 'HandMiddle1']).sub(w).multiplyScalar(0.62)); });
      barbell.position.copy(gr[0]).add(gr[1]).multiplyScalar(0.5);
      barbell.quaternion.setFromUnitVectors(ZV, gr[0].clone().sub(gr[1]).normalize());
    }
    barbell.position.y = Math.max(barbell.position.y, PLATE_R);
    return;
  }
  var tt = (r.pose.t || 0) * Math.PI / 180;
  var bp = cur.bar === 'back' ? { x: J.sh.x - 6 * Math.cos(tt), y: J.sh.y - 6 * Math.sin(tt) } : J.hN;
  barbell.position.copy(V('bar', bp));
  barbell.quaternion.copy(faceQ);
}

/* ---------- player state + UI ---------- */
var state = { move: 0, cat: 'kungfu', t: 0, playing: !window.matchMedia('(prefers-reduced-motion: reduce)').matches, speed: 1, total: 1, lastSeg: -1 };
var $ = function (id) { return document.getElementById(id); };
var elPlay = $('lab-play'), elScrub = $('lab-scrub'), elStep = $('lab-step'), elName = $('lab-name'), elCat = $('lab-cat'), elLink = $('lab-link');
var list = $('lab-moves'), tabs = $('lab-cats');

function setMove(i, fromHash) {
  state.move = i; var m = MOVES[i];
  loadMove(m);
  state.total = (m.mode === 'front' ? frontP : sideP).total; state.t = 0; state.lastSeg = -1;
  elName.textContent = KT.name(m.s);
  elCat.textContent = LIB[m.lib][0];
  elLink.href = LIB[m.lib][1];
  if (m.cat !== state.cat) showCat(m.cat);
  [].forEach.call(list.querySelectorAll('button'), function (b) { b.setAttribute('aria-pressed', +b.getAttribute('data-i') === i ? 'true' : 'false'); });
  if (!fromHash) { try { history.replaceState(null, '', '#m=' + m.slug); } catch (e) { /* ignore */ } }
  draw();
}
function draw() {
  var seg = drawBody(state.t);
  if (seg !== state.lastSeg) {
    state.lastSeg = seg;
    var c = clip.frames[seg] && clip.frames[seg].c;
    elStep.textContent = (seg + 1) + ' / ' + clip.frames.length + (c ? ' · ' + KT.t(c) : '');
  }
  elScrub.value = String(Math.round(((state.t % state.total) + state.total) % state.total / state.total * 1000));
}
function setPlaying(on) {
  state.playing = on;
  elPlay.textContent = on ? P('❚❚ 暫停', '❚❚ Pause') : P('▶ 播放', '▶ Play');
  elPlay.setAttribute('aria-pressed', on ? 'true' : 'false');
}
function showCat(k) {
  state.cat = k;
  [].forEach.call(tabs.querySelectorAll('button'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-cat') === k ? 'true' : 'false'); });
  [].forEach.call(list.querySelectorAll('button'), function (b) { b.hidden = b.getAttribute('data-cat') !== k; });
}

CATS.forEach(function (c) {
  if (!MOVES.some(function (m) { return m.cat === c.k; })) return;
  var b = document.createElement('button');
  b.type = 'button'; b.setAttribute('data-cat', c.k); b.textContent = c.n;
  b.addEventListener('click', function () { showCat(c.k); });
  tabs.appendChild(b);
});
MOVES.forEach(function (m, i) {
  var b = document.createElement('button');
  b.type = 'button'; b.setAttribute('data-i', i); b.setAttribute('data-cat', m.cat);
  b.innerHTML = '<small></small><span></span>';
  b.querySelector('small').textContent = LIB[m.lib][0];
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

function fromHash() {
  var h = /#m=([a-z0-9-]+)/.exec(location.hash);
  if (!h) return -1;
  for (var i = 0; i < MOVES.length; i++) if (MOVES[i].slug === h[1]) return i;
  return -1;
}
window.addEventListener('hashchange', function () { var i = fromHash(); if (i >= 0 && i !== state.move) { setMove(i, true); setPlaying(true); } });

if (MOVES.length) {
  var start = fromHash();
  resize(); showCat((MOVES[start] || MOVES[0]).cat);
  var dflt = MOVES.findIndex(function (m) { return m.slug === 'lethwei-flyknee'; });
  setMove(start >= 0 ? start : Math.max(0, dflt), start >= 0);
  setPlaying(state.playing); requestAnimationFrame(loop);
} else {
  box.innerHTML = '<p class="lab-fail">' + P('動作資料載入失敗。', 'The moves could not be loaded.') + '</p>';
}

// used by lab3d-check.js (opened with ?check) — poses every move and measures floor contact and joint limits
var CHECK_API = {
  THREE: THREE, MOVES: MOVES, K: K, SIDES: SIDES, plateR: function () { return PLATE_R; }, scene: scene, barbell: barbell, wpos: wpos,
  avatar: function () { return avatar; },
  load: function (i) { setPlaying(false); setMove(i, true); return state.total; },
  frames: function () { return clip.frames; },
  name: function (m) { return KT.name(m.s); },
  pose: function (t) {
    state.t = t;
    var r = pose3d(t), n = {};
    JOINTS.forEach(function (k) { n[k] = r.V(k); });
    var info = poseAvatar(n, r.theta, cur);
    drawBar(r, r.J, r.V, info);
    return { info: info, n: n, theta: r.theta };
  }
};
