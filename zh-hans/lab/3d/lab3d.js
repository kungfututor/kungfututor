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
  var wide = cur.bar && cur.bar !== 'back' ? 0.25 : cur.bar === 'back' ? 0.3 : 0;
  function V(name, pt) {
    var j = pt || Js[name];
    var x = mode === 'front' ? 0 : (j.x - x0) * K - hx, y = (FLOOR - j.y) * K;
    var z = Jf && !pt ? (Jf[name].x - Jf.hip.x) * K : (DEPTH[name] || 0);
    if (wide && (name === 'hN' || name === 'hF')) z = name === 'hN' ? wide : -wide;
    if (wide && (name === 'eN' || name === 'eF')) z = name === 'eN' ? wide + 0.04 : -wide - 0.04;
    return new THREE.Vector3(hx + x * cos + z * sin, y, -x * sin + z * cos);
  }
  return { J: Js, V: V, theta: theta, pose: S ? S.pose : F.pose, seg: (S ? sideP : frontP).poseAt(t).seg };
}

/* ---------- the skinned instructor model (made for KungfuTutor with Meshy, private licence) ----------
 * One .glb file: the textured instructor (cream hooded jacket, black joggers, white
 * trainers) with a standard humanoid skeleton (Mixamo bone names). Each frame the bones
 * are aimed at the same 3D joint points the simple figure uses: spine → shoulders,
 * neck → head, upper arm → elbow, forearm → hand, thigh → knee, shin → ankle,
 * foot → toes. N (near, +z) is the body's right side, F its left.
 */
var MODEL_URL = '/assets/models/instructor/kt-instructor.glb';
var avatar = null;
var AV = { v1: new THREE.Vector3(), v2: new THREE.Vector3(), q1: new THREE.Quaternion(), q2: new THREE.Quaternion(), q3: new THREE.Quaternion() };
// three.js drops the colon from "mixamorig:Hips", so match on the part after the prefix
function boneKey(name) { return name.replace(/^mixamorig[:_]?/i, ''); }
var NEED = ['Hips', 'Spine', 'Neck', 'Head', 'RightArm', 'RightForeArm', 'RightHand', 'LeftArm', 'LeftForeArm', 'LeftHand',
  'RightUpLeg', 'RightLeg', 'RightFoot', 'RightToeBase', 'LeftUpLeg', 'LeftLeg', 'LeftFoot', 'LeftToeBase'];
// closed fists: each finger joint turns towards the palm (palms face down in the model's T-pose)
var FINGERS = ['Index', 'Middle', 'Ring', 'Pinky'], CURL = [0.95, 0.95, 0.55], THUMB = [0.2, 0.35, 0.35];
function fistTurns(B) {
  var out = {}, down = new THREE.Vector3(0, -1, 0), wq = new THREE.Quaternion();
  ['Right', 'Left'].forEach(function (side) {
    function add(name, child, ang) {
      var b = B[side + 'Hand' + name], c = B[side + 'Hand' + child];
      if (!b || !c) return;
      var dir = c.getWorldPosition(new THREE.Vector3()).sub(b.getWorldPosition(new THREE.Vector3())).normalize();
      var axis = new THREE.Vector3().crossVectors(dir, down).normalize();          // turning about this moves the finger towards the palm
      axis.applyQuaternion(b.getWorldQuaternion(wq).invert());                     // into the joint's own frame
      out[side + 'Hand' + name] = new THREE.Quaternion().setFromAxisAngle(axis, ang);
    }
    FINGERS.forEach(function (f) { [1, 2, 3].forEach(function (j) { add(f + j, f + (j + 1), CURL[j - 1]); }); });
    [1, 2, 3].forEach(function (j) { add('Thumb' + j, 'Thumb' + (j + 1), THUMB[j - 1]); });
  });
  return out;
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
  var W = function (n) { return B[n].getWorldPosition(new THREE.Vector3()); };
  // scale the model so its legs match the lesson figure (thigh + shin = 88 units)
  var leg = W('RightUpLeg').distanceTo(W('RightLeg')) + W('RightLeg').distanceTo(W('RightFoot'));
  rig.scale.setScalar((88 * K) / leg); rig.updateMatrixWorld(true);
  var ankle = W('RightFoot').y;                                // ankle height above the floor at rest
  var right = W('RightUpLeg').sub(W('LeftUpLeg')); right.y = 0; right.normalize();
  var fwd = new THREE.Vector3().crossVectors(UPV, right).normalize();
  var rest = {};
  Object.keys(B).forEach(function (n) { rest[n] = B[n].quaternion.clone(); });
  var fist = fistTurns(B);
  scene.add(rig);
  return { rig: rig, B: B, rest: rest, fist: fist, ankle: ankle, fwd: fwd };
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
function poseAvatar(n, theta) {
  var A = avatar, B = A.B;
  Object.keys(B).forEach(function (k) { B[k].quaternion.copy(A.rest[k]); });
  Object.keys(A.fist).forEach(function (k) { B[k].quaternion.multiply(A.fist[k]); });
  // turn the whole model so it faces +X (turned round by theta)
  var want = new THREE.Vector3(1, 0, 0).applyAxisAngle(UPV, theta);
  A.rig.quaternion.setFromUnitVectors(A.fwd, want);
  A.rig.position.set(0, 0, 0);
  A.rig.updateMatrixWorld(true);
  var d = function (a, b) { return new THREE.Vector3().subVectors(b, a); };
  aimBone(B.Spine, B.Neck, d(n.hip, n.sh));
  aimBone(B.Neck, B.Head, d(n.sh, n.head));
  aimBone(B.RightArm, B.RightForeArm, d(n.shN, n.eN)); aimBone(B.RightForeArm, B.RightHand, d(n.eN, n.hN));
  aimBone(B.LeftArm, B.LeftForeArm, d(n.shF, n.eF)); aimBone(B.LeftForeArm, B.LeftHand, d(n.eF, n.hF));
  aimBone(B.RightUpLeg, B.RightLeg, d(n.hipN, n.kN)); aimBone(B.RightLeg, B.RightFoot, d(n.kN, n.aN)); aimBone(B.RightFoot, B.RightToeBase, d(n.aN, n.tN));
  aimBone(B.LeftUpLeg, B.LeftLeg, d(n.hipF, n.kF)); aimBone(B.LeftLeg, B.LeftFoot, d(n.kF, n.aF)); aimBone(B.LeftFoot, B.LeftToeBase, d(n.aF, n.tF));
  // put the hips where the lesson figure's hips are (ankles sit at their real height)
  var mid = B.RightUpLeg.getWorldPosition(new THREE.Vector3()).add(B.LeftUpLeg.getWorldPosition(new THREE.Vector3())).multiplyScalar(0.5);
  A.rig.position.set(n.hip.x - mid.x, n.hip.y - mid.y + A.ankle, n.hip.z - mid.z);
}
(function loadAvatar() {
  new GLTFLoader().load(MODEL_URL, function (g) {
    var a = setupAvatar(g.scene);
    if (!a) return;
    avatar = a; body.visible = false;
    if (clip) draw();
  }, undefined, function () { /* keep the simple figure */ });
})();

function drawBody(time) {
  var r = pose3d(time), J = r.J, V = r.V;
  var n = {};
  ['hip', 'sh', 'head', 'hipN', 'hipF', 'kN', 'kF', 'aN', 'aF', 'tN', 'tF', 'shN', 'shF', 'eN', 'eF', 'hN', 'hF'].forEach(function (k) { n[k] = V(k); });
  faceQ.setFromAxisAngle(UPV, r.theta);
  if (avatar) {
    poseAvatar(n, r.theta);
    drawBar(r, J, V);
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
  faceQ.setFromAxisAngle(UPV, r.theta);
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
function drawBar(r, J, V) {
  barbell.visible = !!cur.bar;
  if (!cur.bar) return;
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
