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
  { k: 'fit', n: P('健身', 'Fitness') }, { k: 'golf', n: P('高爾夫', 'Golf') }
];
var LIB = {
  STANCES: [P('功夫步型', 'Kung fu stances'), '../../kungfu/stances/'], STRIKES: [P('功夫拳腳', 'Kung fu strikes'), '../../kungfu/strikes/'],
  TAICHI: [P('太極拳', 'Tai Chi'), '../../kungfu/tai-chi/'], LETHWEI: [P('緬甸拳', 'Lethwei'), '../../combat/lethwei/'],
  MUAYTHAI: [P('泰拳', 'Muay Thai'), '../../combat/muay-thai/'], BOXING: [P('拳擊', 'Boxing'), '../../combat/boxing/'],
  MMA: [P('綜合格鬥', 'MMA'), '../../combat/mma/'], JUDO: [P('柔道', 'Judo'), '../../combat/judo/'],
  BJJ: [P('巴西柔術', 'BJJ'), '../../combat/bjj/'], WRESTLING: [P('摔跤', 'Wrestling'), '../../combat/wrestling/'],
  SELFDEF: [P('防身術', 'Self-defence'), '../../self-defence/basics/'], KRAV: [P('以色列格鬥術', 'Krav Maga'), '../../self-defence/krav-maga/'],
  GYM: [P('健身房', 'Gym'), '../../fitness/gym/'], WINGCHUN: [P('詠春', 'Wing Chun'), '../../kungfu/wing-chun/'],
  SAMBO: [P('桑搏', 'Sambo'), '../../combat/sambo/'], FMA: [P('菲律賓武術', 'Filipino Martial Arts'), '../../combat/fma/'],
  GOLF: [P('高爾夫', 'Golf'), '../../sports/golf/'], HYROX: [P('HYROX', 'HYROX'), '../../hyrox/']
};
// Which side a move shows first. The 2D lessons draw the near (right) limbs in front; these say what is correct:
// the striking arts teach right-handers to stand left foot forward (orthodox), and each Tai Chi posture has its
// own side in the 24-form ('legs' = only the legs are mirrored, where the form uses the opposite hand and foot).
var SIDE = { BOXING: 'l', MUAYTHAI: 'l', LETHWEI: 'l', MMA: 'l', KRAV: 'l', SELFDEF: 'l' };
// Postures 16 and 17 (drop stance, then up on one leg): the lesson places the legs exactly — the stretched foot slides out along the
// floor, as it does in the form, and the hips travel on to it — so steps are planned only for the walk back to the start (these stretches).
var TC_STEPS = { 16: [4, 5, 6], 17: [3, 4, 5] };
var TC_SIDE = { 2: 'l', 3: 'legs', 4: 'legs', 5: 'l', 7: 'l', 9: 'l', 11: 'l', 12: 'legs', 15: 'l', 16: 'l', 19: 'legs', 20: 'legs', 21: 'legs', 22: 'l' };
// judo grips (3D holds): your right hand on their left lapel, your left hand on their right sleeve below the elbow — and theirs
// the same on you — for the key frames listed (null = that grip not used)
function judoGrips(meLapel, meSleeve, pLapel, pSleeve) {
  var g = [];
  if (meLapel) g.push({ by: 'me', hand: 'N', bone: 'Spine2', at: [0.16, 0.06, -0.08], bend: [0, -1, 0], on: meLapel });
  if (meSleeve) g.push({ by: 'me', hand: 'F', bone: 'RightForeArm', at: [0, -0.05, 0], on: meSleeve });
  if (pLapel) g.push({ by: 'partner', hand: 'N', bone: 'Spine2', at: [0.16, 0.06, -0.08], bend: [0, -1, 0], on: pLapel });
  if (pSleeve) g.push({ by: 'partner', hand: 'F', bone: 'RightForeArm', at: [0, -0.05, 0], on: pSleeve });
  return g;
}
// HYROX keeps its stations as STATIONS + CLIPS (its page has its own engine): give it the LIST / makeClip the lab reads
if (window.HYROX && !window.HYROX.LIST) {
  window.HYROX.LIST = window.HYROX.STATIONS.map(function (s) { var o = { id: s.clip }, k; for (k in s) o[k] = s[k]; return o; });
  window.HYROX.makeClip = function (s) { return window.HYROX.CLIPS[s.clip]; };
}
function mv(cat, lib, key, extra) { var o = { cat: cat, lib: lib, key: key }; for (var k in extra || {}) o[k] = extra[k]; return o; }
var MOVES = [
  mv('kungfu', 'STANCES', 'horse', { mode: 'both', toes: 0.25 }), mv('kungfu', 'STANCES', 'bow'), mv('kungfu', 'STANCES', 'drop', { mode: 'front' }),
  mv('kungfu', 'STANCES', 'empty'), mv('kungfu', 'STANCES', 'cross'), mv('kungfu', 'STRIKES', 'punch'), mv('kungfu', 'STRIKES', 'palm'),
  // (the side kick is drawn side-on to its target, i.e. seen from the kicker's front: it needs a front-view drawing before it
  //  can be shown in 3D — as a side-view lesson it came out as a front kick)
  // side kick: the 2D drawing is the kicker seen from the front (the leg goes out sideways from the hip, the body leans away) —
  // read as a side view it came out as a front kick. Fists at the waist: arms close, forearms pointing forward (la < 1)
  mv('kungfu', 'STRIKES', 'side', { mode: 'front', fix: { 0: { su: 12, sl: 4, laN: 0.45, fu: -12, fl: -4, laF: 0.45 }, 1: { su: 12, sl: 4, laN: 0.45, fu: -12, fl: -4, laF: 0.45 }, 2: { su: 12, sl: 4, laN: 0.45, fu: -12, fl: -4, laF: 0.45 }, 3: { su: 12, sl: 4, laN: 0.45, fu: -12, fl: -4, laF: 0.45 }, 4: { su: 12, sl: 4, laN: 0.45, fu: -12, fl: -4, laF: 0.45 } } }), mv('kungfu', 'STRIKES', 'snap'), mv('kungfu', 'STRIKES', 'heel'), mv('kungfu', 'STRIKES', 'stretch'),
  mv('kungfu', 'WINGCHUN', 'stance', { mode: 'both', gait: false, pivots: true }), mv('kungfu', 'WINGCHUN', 'punch'), mv('kungfu', 'WINGCHUN', 'chain'), mv('kungfu', 'WINGCHUN', 'tan'),
  mv('kungfu', 'WINGCHUN', 'bong', { mode: 'front' }), mv('kungfu', 'WINGCHUN', 'fuk'), mv('kungfu', 'WINGCHUN', 'pak', { mode: 'front' }), mv('kungfu', 'WINGCHUN', 'kick'),
  mv('kungfu', 'TAICHI', 1), mv('kungfu', 'TAICHI', 2), mv('kungfu', 'TAICHI', 3), mv('kungfu', 'TAICHI', 4), mv('kungfu', 'TAICHI', 5), mv('kungfu', 'TAICHI', 6), mv('kungfu', 'TAICHI', 7), mv('kungfu', 'TAICHI', 8), mv('kungfu', 'TAICHI', 9), mv('kungfu', 'TAICHI', 10, { mode: 'front' }), mv('kungfu', 'TAICHI', 11), mv('kungfu', 'TAICHI', 12),
  mv('kungfu', 'TAICHI', 13), mv('kungfu', 'TAICHI', 14), mv('kungfu', 'TAICHI', 15), mv('kungfu', 'TAICHI', 16), mv('kungfu', 'TAICHI', 17), mv('kungfu', 'TAICHI', 18), mv('kungfu', 'TAICHI', 19), mv('kungfu', 'TAICHI', 20), mv('kungfu', 'TAICHI', 21), mv('kungfu', 'TAICHI', 22), mv('kungfu', 'TAICHI', 23), mv('kungfu', 'TAICHI', 24),
  mv('strike', 'BOXING', 'stance'), mv('strike', 'BOXING', 'jab'), mv('strike', 'BOXING', 'cross'), mv('strike', 'BOXING', 'onetwo'),
  mv('strike', 'BOXING', 'hook'), mv('strike', 'BOXING', 'upper'), mv('strike', 'BOXING', 'slip'), mv('strike', 'BOXING', 'weave'),
  mv('strike', 'BOXING', 'parry'), mv('strike', 'BOXING', 'footwork'),
  mv('strike', 'MUAYTHAI', 'stance'), mv('strike', 'MUAYTHAI', 'jab'), mv('strike', 'MUAYTHAI', 'cross'), mv('strike', 'MUAYTHAI', 'teep'),
  mv('strike', 'MUAYTHAI', 'kick'), mv('strike', 'MUAYTHAI', 'lowkick'), mv('strike', 'MUAYTHAI', 'elbow'), mv('strike', 'MUAYTHAI', 'knee'),
  mv('strike', 'MUAYTHAI', 'check'), mv('strike', 'MUAYTHAI', 'clinch', { duo: 1, fix: { 2: { ot: 50, oh: 14, ox: 240 }, 3: { ot: 50, oh: 14, ox: 240 } }, holds: [   // both hands cupped behind their head, elbows down on the collarbones
    { by: 'me', hand: 'N', bone: 'Neck', at: [-0.08, 0.04, -0.05], bend: [0, -1, 0], on: [2, 3] }, { by: 'me', hand: 'F', bone: 'Neck', at: [-0.1, 0.01, 0.04], bend: [0, -1, 0], on: [2, 3] },
    // (your right hand goes to their left side and the other way round: you face each other)
    // (their hands on your hips, trying to keep you away)
    { by: 'partner', hand: 'N', bone: 'Spine', at: [0.1, 0, -0.16], on: [1, 2, 3] }, { by: 'partner', hand: 'F', bone: 'Spine', at: [0.1, 0, 0.16], on: [1, 2, 3] }] }),
  mv('strike', 'LETHWEI', 'stance'), mv('strike', 'LETHWEI', 'straight'), mv('strike', 'LETHWEI', 'hook'), mv('strike', 'LETHWEI', 'headbutt'),
  mv('strike', 'LETHWEI', 'elbow'), mv('strike', 'LETHWEI', 'flyknee'), mv('strike', 'LETHWEI', 'kick'), mv('strike', 'LETHWEI', 'push'),
  mv('strike', 'LETHWEI', 'cover'),
  // MMA: the opponent is drawn in every lesson (strikes: a little further off than the stick figures — bodies have thickness); in the mount (ground and pound) your knees are on the mat either side of them
  mv('strike', 'MMA', 'stance', { duo: 1 }), mv('strike', 'MMA', 'onetwo', { duo: 1, odx: 30 }), mv('strike', 'MMA', 'overhand', { duo: 1, odx: 30 }), mv('strike', 'MMA', 'lowkick', { duo: 1, odx: 16 }),
  mv('strike', 'MMA', 'double', { duo: 1 }), mv('strike', 'MMA', 'sprawl', { duo: 1 }),
  mv('strike', 'MMA', 'gnp', { duo: 1, fix: { 0: { kzN: 26, kzF: -26, fzN: 2.6, fzF: 2.6 }, 1: { kzN: 26, kzF: -26, fzN: 2.6, fzF: 2.6 }, 2: { kzN: 26, kzF: -26, fzN: 2.6, fzF: 2.6 }, 3: { kzN: 26, kzF: -26, fzN: 2.6, fzF: 2.6 } } }), mv('strike', 'MMA', 'standup', { duo: 1 }),
  mv('strike', 'FMA', 'stance', { stick: 1 }), mv('strike', 'FMA', 'forehand', { stick: 1 }), mv('strike', 'FMA', 'backhand', { stick: 1 }),
  mv('strike', 'FMA', 'thrust', { stick: 1 }), mv('strike', 'FMA', 'eight', { stick: 1 }), mv('strike', 'FMA', 'roof', { stick: 1 }),
  mv('strike', 'FMA', 'disarm', { stick: 1 }), mv('strike', 'FMA', 'empty'),
  // (double-leg takedown and sprawl lean on an opponent, and the technical stand-up props the body on a hand behind the hips:
  //  they come back with the two-person / ground moves, which need their own floor-support handling)
  // wrestling: a 2D 'lying' pose leaning forward (UP, FLAT) is face down in 3D — the turns onto the back are rolls (oroll)
  mv('grapple', 'WRESTLING', 'stance', { duo: 1 }), mv('grapple', 'WRESTLING', 'double', { duo: 1 }), mv('grapple', 'WRESTLING', 'sprawl', { duo: 1 }),
  mv('grapple', 'WRESTLING', 'armdrag', { duo: 1 }), mv('grapple', 'WRESTLING', 'bodylock', { duo: 1 }),
  mv('grapple', 'WRESTLING', 'gutwrench', { duo: 1, fix: { 0: { oroll: 0 }, 1: { oroll: 0 }, 2: { oroll: 90, oa1: 40, oa2: 70, ob1: 30, ob2: 60 }, 3: { oroll: 180 } } }),   // (rolled over, their arms stay in at the chest)
  mv('grapple', 'WRESTLING', 'standup', { duo: 1 }),
  mv('grapple', 'WRESTLING', 'halfnelson', { duo: 1, fix: { 0: { oroll: 0 }, 1: { oroll: 0 }, 2: { oroll: 90 }, 3: { oroll: 180 } } }),
  mv('grapple', 'JUDO', 'stance', { duo: 1, oz: 10, fix: { 0: { ox: 296 }, 1: { ox: 296 } }, holds:   // (bow further apart: heads have size)
    judoGrips([3, 4, 5], [3, 4, 5], [3, 4, 5], [3, 4, 5]) }),
  mv('grapple', 'JUDO', 'breakfall'),
  // foot sweep: your right foot sweeps their left ankle from the outside, so their left foot is just inside your right
  mv('grapple', 'JUDO', 'deashi', { duo: 1, oz: -6, holds: judoGrips([0, 1, 2, 3], [0, 1, 2, 3, 4], [0, 1, 2], [0, 1, 2]) }),
  // minor inner reap: your right foot hooks their left heel from between their feet
  mv('grapple', 'JUDO', 'kouchi', { duo: 1, oz: 12, holds: judoGrips([0, 1, 2, 3], [0, 1, 2, 3, 4, 5], [0, 1, 2, 3], [0, 1, 2, 3]) }),
  // hip throw: your right arm round their waist (on their back), left hand keeps the sleeve
  mv('grapple', 'JUDO', 'ogoshi', { duo: 1, oz: 0,
    // (bodies with thickness: your back against their front needs more room than the drawn lines, and they land a little
    //  further in front of your feet; lifted and rolling over your hip they rest on your back — carry)
    fix: { 2: { ox: 230, ot: 24 }, 3: { ot: 66, ola: -10, olb: -30, ol: -16, olf: -36, olift: 40, oa1: 70, oa2: 40, ob1: 60, ob2: 30 }, 4: { ot: 128, ola: -120, olb: -130, ol: 128, olf: 120, olift: 48 }, 5: { ox: 92 } }, carry: [3, 4], onBack: [3], holds: [{ by: 'me', hand: 'N', bone: 'Spine', at: [-0.14, 0.02, 0.04], on: [2, 3] }].concat(judoGrips([0, 1], [0, 1, 2, 3, 4, 5], [0, 1], [0, 1])) }), mv('grapple', 'JUDO', 'osoto', { duo: 1, oz: 30, holds: [   // right hand on their left lapel, left hand on their right sleeve — and theirs the same on you
    { by: 'me', hand: 'N', bone: 'Spine2', at: [0.16, 0.06, -0.08], bend: [0, -1, 0], on: [0, 1, 2, 3] }, { by: 'me', hand: 'F', bone: 'RightForeArm', at: [0, -0.05, 0], on: [0, 1, 2, 3, 4, 5] },
    { by: 'partner', hand: 'N', bone: 'Spine2', at: [0.16, 0.06, -0.08], bend: [0, -1, 0], on: [0, 1, 2, 3] }, { by: 'partner', hand: 'F', bone: 'RightForeArm', at: [0, -0.05, 0], on: [0, 1, 2, 3] }] }), mv('grapple', 'JUDO', 'kesa', { duo: 1, oz: 42,
    // you sit at their right side and lean sideways on to their chest (the drawing's forward lean), right arm round the neck,
    // left hand on their right sleeve, their right arm trapped against your side
    // (both legs spread out on the side away from them: right leg forward, left leg back)
    fix: { 0: { t: 18, lz: 26, fzN: -1, fzF: 3.5, kzN: -24, kzF: -6 }, 1: { t: 22, lz: 34, fzN: -1, fzF: 3.5, kzN: -24, kzF: -6 }, 2: { t: 22, lz: 36, fzN: -1, fzF: 3.5, kzN: -24, kzF: -6 }, 3: { t: 20, lz: 36, fzN: -1, fzF: 3.5, kzN: -24, kzF: -6 } }, holds: [
    { by: 'me', hand: 'N', bone: 'Neck', at: [-0.06, 0.02, -0.1], bend: [1, 0.5, 0], on: [1, 2, 3] }, { by: 'me', hand: 'F', bone: 'RightForeArm', at: [0, -0.05, 0], on: [1, 2, 3] },
    { by: 'partner', hand: 'N', bone: 'Spine1', at: [0.02, 0.1, -0.2], on: [0, 1, 2, 3] }] }), // cross armlock: they lie across you — their shoulder at your crotch, your legs over their face and chest, their arm along
  // your body to your chest (the side view can only draw them in line: oyaw turns them, all but that arm)
  mv('grapple', 'JUDO', 'juji', { duo: 1, oyaw: 90, opivot: 'shF', okeep: ['eF', 'hF'], odx: 24, holds: [
    // their left arm stretched along your body, wrist at your chest; you hug the forearm with both hands, thumb up
    { by: 'partner', hand: 'F', bone: 'Spine2', at: [0.16, 0.04, 0.02], on: [0, 1, 2, 3] },
    { by: 'me', hand: 'N', bone: 'LeftForeArm', at: [0, 0.02, 0], on: [0, 1, 2, 3] }, { by: 'me', hand: 'F', bone: 'LeftForeArm', at: [0, -0.06, 0], on: [0, 1, 2, 3] }],
    fix: { 0: { fN: { x: 306, y: 179 }, fF: { x: 300, y: 181 }, fzN: 34, fzF: -30, kzN: 24, kzF: -20 }, 1: { fN: { x: 306, y: 179 }, fF: { x: 300, y: 181 }, fzN: 34, fzF: -30, kzN: 24, kzF: -20 }, 2: { fN: { x: 306, y: 179 }, fF: { x: 300, y: 181 }, fzN: 34, fzF: -30, kzN: 24, kzF: -20 }, 3: { fN: { x: 306, y: 179 }, fF: { x: 300, y: 181 }, fzN: 34, fzF: -30, kzN: 24, kzF: -20 } } }),
  mv('grapple', 'SAMBO', 'stance', { duo: 1, oz: 10, holds: judoGrips([2, 3, 4], [2, 3, 4], [2, 3, 4], [2, 3, 4]) }),
  mv('grapple', 'SAMBO', 'breakfall'),
  mv('grapple', 'SAMBO', 'footsweep', { duo: 1, oz: -6, holds: judoGrips([0, 1, 2, 3], [0, 1, 2, 3, 4], [0, 1, 2], [0, 1, 2]) }),
  // back trip: your lead leg steps deep behind their lead leg, from the outside
  mv('grapple', 'SAMBO', 'backtrip', { duo: 1, oz: 30, holds: judoGrips([0, 1, 2, 3], [0, 1, 2, 3, 4], [0, 1, 2], [0, 1, 2]) }),
  // single-leg pick-up: both hands behind their lead (left) knee
  mv('grapple', 'SAMBO', 'legpick', { duo: 1, oz: 8, holds: [
    { by: 'me', hand: 'N', bone: 'LeftLeg', at: [-0.07, 0.06, -0.03], on: [2, 3] }, { by: 'me', hand: 'F', bone: 'LeftLeg', at: [-0.07, 0.1, 0.04], on: [2, 3] }] }),
  // side hold-down: you kneel at their side, chest across their chest — they lie across you, not in line (oyaw)
  mv('grapple', 'SAMBO', 'holddown', { duo: 1, oyaw: 90, opivot: 'sh', odx: -10, oz: 18, holds: [
    // (turned across you their right side is nearest: your right arm goes round under their head, your left hand holds their near arm;
    //  reach: 1 — reached for while you settle, left as they were before the grip correction, which unsettled this move)
    { by: 'me', hand: 'N', bone: 'Head', at: [-0.04, 0.27, 0], on: [0, 1, 2, 3], reach: 1 }, { by: 'me', hand: 'F', bone: 'RightArm', at: [0, 0.02, 0], on: [0, 1, 2, 3], reach: 1 }], fix: { 0: { oa1: 96, oa2: 100, ob1: 94, ob2: 98 }, 1: { oa1: 96, oa2: 100, ob1: 94, ob2: 98 }, 2: { oa1: 96, oa2: 100, ob1: 94, ob2: 98 }, 3: { oa1: 96, oa2: 100, ob1: 94, ob2: 98 } } }),   // (their arms down by their sides on the mat, not up in the air)
  mv('grapple', 'SAMBO', 'anklelock', { duo: 1, fix: { 0: { oa1: 96, oa2: 100, ob1: 94, ob2: 98 }, 1: { oa1: 96, oa2: 100, ob1: 94, ob2: 98 }, 2: { oa1: 96, oa2: 100, ob1: 94, ob2: 98 }, 3: { oa1: 96, oa2: 100, ob1: 94, ob2: 98 } } }),   // (lying back, arms on the mat by their sides)
  mv('grapple', 'SAMBO', 'combat', { duo: 1, oz: 10, holds: judoGrips([3, 4], [3, 4, 5], null, null) }), // BJJ (ground): in the guard your knees go out round their waist, ankles crossed behind; in the mount your knees are on the
  // mat either side of them; in side control you are turned across their chest (myaw); on top of you they kneel astride (ospread)
  mv('grapple', 'BJJ', 'guard', { duo: 1, odx: 14, fix: { 0: { kzN: 12, kzF: -12, fzN: 0.6, fzF: 0.6, myaw: 0 }, 1: { kzN: 12, kzF: -12, fzN: 0.6, fzF: 0.6, myaw: 0 }, 2: { kzN: 12, kzF: -12, fzN: 0.6, fzF: 0.6, myaw: 0 }, 3: { kzN: 12, kzF: -12, fzN: 0.6, fzF: 0.6, myaw: 0 } } }), mv('grapple', 'BJJ', 'shrimp'),
  // mount escape: you bridge and turn onto your shoulder, and they roll over SIDEWAYS onto their back (oroll) — the 2D
  // drawing can only show it as a dive over your head, and its last frame drawn in 3D would be them face down
  mv('grapple', 'BJJ', 'upa', { duo: 1, carry: [0, 1, 2, 3], fix: { 0: { ola: 70, olb: -90, ol: -70, olf: 90, kzN: 0, kzF: 0, fzN: 1, fzF: 1, myaw: 0, ospread: 24, oroll: 0 }, 1: { ola: 70, olb: -90, ol: -70, olf: 90, kzN: 0, kzF: 0, fzN: 1, fzF: 1, myaw: 0, ospread: 24, oroll: 0 }, 2: { kzN: 0, kzF: 0, fzN: 1, fzF: 1, myaw: 0, oa1: 70, oa2: 40, ob1: 64, ob2: 36, olift: 8, ospread: 24, oroll: 0 }, 3: { ot: 88, oh: 0, ola: -88, olb: -92, ol: 88, olf: 92, oa1: 150, oa2: 130, ob1: 140, ob2: 120, kzN: 0, kzF: 0, fzN: 1, fzF: 1, myaw: 0, ox: 168, olift: 10, ospread: 0, oroll: 90, face: -1, x: 228, y: 176, t: 30, fN: { x: 196, y: 209 }, fF: { x: 190, y: 209 }, ftN: -90, ftF: -90, su: 60, sl: 80, fu: 50, fl: 70 }, 4: { kzN: 0, kzF: 0, fzN: 1, fzF: 1, myaw: 0, ospread: 0, oroll: 180 } } }),
  mv('grapple', 'BJJ', 'hipbump', { duo: 1, odx: 14, fix: { 0: { kzN: 12, kzF: -12, fzN: 0.6, fzF: 0.6, myaw: 0 }, 1: { kzN: 0, kzF: 0, fzN: 1, fzF: 1, myaw: 0 }, 2: { kzN: 0, kzF: 0, fzN: 1, fzF: 1, myaw: 0 }, 3: { kzN: 0, kzF: 0, fzN: 1, fzF: 1, myaw: 0 }, 4: { kzN: 26, kzF: -26, fzN: 2.6, fzF: 2.6, myaw: 0 } } }),
  mv('grapple', 'BJJ', 'kneecut', { duo: 1, fix: { 0: { kzN: 0, kzF: 0, fzN: 1, fzF: 1, myaw: 0 }, 1: { kzN: 0, kzF: 0, fzN: 1, fzF: 1, myaw: 0 }, 2: { kzN: 0, kzF: 0, fzN: 1, fzF: 1, myaw: 0 }, 3: { kzN: 0, kzF: 0, fzN: 1, fzF: 1, myaw: 90 } } }),
  mv('grapple', 'BJJ', 'mount', { duo: 1, fix: { 0: { kzN: 0, kzF: 0, fzN: 1, fzF: 1, myaw: 90 }, 1: { kzN: 0, kzF: 0, fzN: 1, fzF: 1, myaw: 45 }, 2: { kzN: 26, kzF: -26, fzN: 2.6, fzF: 2.6, myaw: 0 }, 3: { kzN: 26, kzF: -26, fzN: 2.6, fzF: 2.6, myaw: 0 } } }),
  mv('grapple', 'BJJ', 'armbar', { duo: 1, odx: 14, fix: { 0: { kzN: 12, kzF: -12, fzN: 0.6, fzF: 0.6, myaw: 0 }, 1: { kzN: 0, kzF: 0, fzN: 1, fzF: 1, myaw: 0 }, 2: { kzN: 0, kzF: 0, fzN: 1, fzF: 1, myaw: 0 }, 3: { kzN: 12, kzF: -12, fzN: 0.6, fzF: 0.6, myaw: 0 } } }), mv('grapple', 'BJJ', 'rnc', { duo: 1 }),
  mv('defence', 'SELFDEF', 'fence'), mv('defence', 'SELFDEF', 'distance'), mv('defence', 'SELFDEF', 'palm'), mv('defence', 'SELFDEF', 'hammer'),
  mv('defence', 'SELFDEF', 'elbow'), mv('defence', 'SELFDEF', 'kick'), mv('defence', 'SELFDEF', 'cover'),
  mv('defence', 'KRAV', 'stance'), mv('defence', 'KRAV', 'burst'), mv('defence', 'KRAV', 'inside'), mv('defence', 'KRAV', 'outside'),
  mv('defence', 'KRAV', 'kick'), mv('defence', 'KRAV', 'escape'),
  mv('fit', 'GYM', 'squat', { bar: 'back' }), mv('fit', 'GYM', 'deadlift', { bar: 'hands' }),
  // bench press: lying on a flat bench (top 0.39 m, as the 2D lesson places it), the barbell in the hands; pull-up: hanging
  // from a bar 2 m up on a frame
  mv('fit', 'GYM', 'bench', { bar: 'hands', kit: 'bench' }), mv('fit', 'GYM', 'pullup', { kit: 'pullbar', gait: false }), mv('fit', 'GYM', 'press', { bar: 'hands' }),
  mv('fit', 'GYM', 'row', { bar: 'hands' }), mv('fit', 'GYM', 'lunge'),
  // (hands and toes on the floor the whole time: nothing steps, so the planted-feet planner is left out)
  mv('fit', 'GYM', 'pushup', { gait: false }), mv('fit', 'GYM', 'plank', { gait: false }), mv('fit', 'GYM', 'bridge'),
  // golf: the golfer model, a club and a ball; drawn face-on, with the forward bend taken from the lesson's side-view setup
  mv('golf', 'GOLF', 'setup', { mode: 'front', golf: 1 }), mv('golf', 'GOLF', 'takeaway', { mode: 'front', golf: 1 }), mv('golf', 'GOLF', 'top', { mode: 'front', golf: 1 }),
  mv('golf', 'GOLF', 'downswing', { mode: 'front', golf: 1 }), mv('golf', 'GOLF', 'impact', { mode: 'front', golf: 1 }), mv('golf', 'GOLF', 'finish', { mode: 'front', golf: 1 }),
  mv('golf', 'GOLF', 'full', { mode: 'front', golf: 1 }), mv('golf', 'GOLF', 'driver', { mode: 'front', golf: 1 }), mv('golf', 'GOLF', 'chip', { mode: 'front', golf: 1 }),
  mv('golf', 'GOLF', 'putt', { mode: 'front', golf: 1 }),
  // HYROX: each station with its equipment (kit). The walking stations (belt) are drawn like the 2D lesson: the athlete stays in
  // the middle and the mat slides back under the feet like a treadmill belt — the markings on it show the travel.
  mv('fit', 'HYROX', 'ski', { kit: 'ski' }), mv('fit', 'HYROX', 'push', { kit: 'push', belt: 1, gait: false }),
  mv('fit', 'HYROX', 'pull', { kit: 'pull' }), mv('fit', 'HYROX', 'burpee', { belt: 1, gait: false }),
  mv('fit', 'HYROX', 'row', { kit: 'row', gait: false }), mv('fit', 'HYROX', 'carry', { kit: 'carry', belt: 1, gait: false }),
  mv('fit', 'HYROX', 'lunge', { kit: 'lunge', belt: 1, gait: false }), mv('fit', 'HYROX', 'wallball', { kit: 'wall' })
].filter(function (m) { return window[m.lib] && LIB[m.lib]; }).map(function (m) {
  if (m.side === undefined) m.side = m.lib === 'TAICHI' ? TC_SIDE[m.key] : SIDE[m.lib];
  if (m.lib === 'TAICHI' && TC_STEPS[m.key]) { m.gaitOnly = TC_STEPS[m.key]; m.slides = true; }
  if (m.golf) { m.model = 'golfer'; m.pivots = true; }   // (the back foot turns on its toes in the finish)
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
var cur = null, clip = null, x0 = 0, OPT = { groundY: FLOOR + 3, scale: 1, cx: 0 }, GOLFREF = null;
var KTFigure_BASE = { x: 200, lift: 0, t: 0, h: 0, su: 8, sl: 14, fu: -8, fl: -2, tu: 3, tl: 0, bu: -3, bl: 0 };

function build(m, view) {
  var L = window[m.lib], lang = KT.getLang();
  var c = m.lib === 'STANCES' ? L.makeClip(m.s.id, view, 1, lang) : L.makeClip(m.s, view, 1, lang);
  // `fix` (3D only, per move): lesson pose keys changed at some key frames — { frame: { key: value } } — for what bodies with
  // thickness need and thin drawn lines do not (a partner bending further so the head meets your chest, not your face)
  if (!m.fix || view !== (m.mode === 'front' ? 'front' : 'side')) return c;   // (a front-view move's fixes apply to its front drawing)
  var c2 = {}, k0; for (k0 in c) c2[k0] = c[k0];
  c2.frames = c.frames.map(function (fr, i) {
    if (!m.fix[i]) return fr;
    var o = {}, k; for (k in fr) o[k] = fr[k]; o.p = {}; for (k in fr.p) o.p[k] = fr.p[k]; for (k in m.fix[i]) o.p[k] = m.fix[i][k]; return o;
  });
  return c2;
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
  GOLFREF = null;
  if (m.golf) {                                             // the address posture seen from the side and from the front
    var setup = window.GOLF.LIST.filter(function (s) { return s.id === 'setup'; })[0];
    var sc = window.GOLF.makeClip(setup, 'side', 1, KT.getLang()), fc = window.GOLF.makeClip(setup, 'front', 1, KT.getLang());
    var addrF = fc.frames[fc.frames.length - 1].p, addrS = sc.frames[sc.frames.length - 1].p;
    GOLFREF = { side: KTFigure.solve(Object.assign({}, KTFigure_BASE, addrS), OPT), front: KTFigure.solve(Object.assign({}, KTFigure_BASE, addrF), OPT) };
  }
  useModel(m.model);
  planGait();
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
// a rattan stick held in the right hand (Filipino martial arts): 64 lesson units above the grip, 10 below (the butt shows under the fist)
var stickGeo = new THREE.CylinderGeometry(0.012, 0.013, 74 * K, 12); stickGeo.translate(0, (64 - 10) / 2 * K, 0);
var stick = new THREE.Mesh(stickGeo, std('#8B5A2B', 0.7)); stick.castShadow = true; stick.visible = false; scene.add(stick);
// a golf club (shaft along +Y from the grip, head at the far end) and a ball
var club = new THREE.Group(); club.visible = false; scene.add(club);
var clubShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.0075, 0.0055, 1, 10), std('#B8BCC4', 0.35)); clubShaft.castShadow = true; club.add(clubShaft);
var clubGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.011, 0.26, 10), std('#222222', 0.8)); club.add(clubGrip);
var clubHead = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.045, 0.025), std('#8E939B', 0.3)); clubHead.castShadow = true; club.add(clubHead);
var golfBall = new THREE.Mesh(new THREE.SphereGeometry(0.0214, 16, 12), std('#FFFFFF', 0.5)); golfBall.castShadow = true; golfBall.visible = false; scene.add(golfBall);
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

// which limbs are shown mirrored right now: the move's own side, swapped again by the Mirror button
function sidesNow() {
  var sde = cur ? cur.side : null, f = !!(state && state.flip), legs = sde === 'l' || sde === 'legs', arms = sde === 'l' || sde === 'arms';
  return { legs: legs !== f, arms: arms !== f };
}
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
  // Left and right: a side-view lesson cannot say which leg is the left one, so each move carries the side it
  // should show (cur.side: 'l' = whole body mirrored, 'legs' / 'arms' = only those) and the Mirror button swaps it.
  // Mirroring = the right limb takes the left limb's place on the other side of the body.
  var sd = sidesNow();
  // golf: the turn of the shoulders and hips. A face-on drawing shows it as narrower shoulders / hips (sw 16 and hw 9 when square);
  // the body turns away from the side the hands are on (back on the backswing, towards the target on the follow-through)
  var gTurn = 0, hTurn = 0;
  if (cur.golf && Jf) {
    var gside = (Jf.hN.x + Jf.hF.x) / 2 - Jf.hip.x >= 0 ? 1 : -1;
    gTurn = Math.acos(Math.min(1, (typeof P0.sw === 'number' ? P0.sw : 16) / 16)) * gside;
    hTurn = Math.acos(Math.min(1, (typeof P0.hw === 'number' ? P0.hw : 9) / 9)) * gside;
  }
  function V(name, pt) {
    var src = name, flip = false;
    if (!pt && ((sd.legs && /^(hip|k|a|t)[NF]$/.test(name)) || (sd.arms && /^(sh|e|h)[NF]$/.test(name)))) {
      src = name.slice(0, -1) + (name.slice(-1) === 'N' ? 'F' : 'N'); flip = true;
    }
    var j = pt || Js[src];
    var x = mode === 'front' ? 0 : (j.x - x0) * K - hx, y = (FLOOR - j.y) * K;
    var z = Jf && !pt ? (Jf[src].x - Jf.hip.x) * K : (DEPTH[src] || 0);
    if (!Jf && !pt && (src === 'hN' || src === 'hF')) {
      // A side-view lesson cannot show how far apart the hands are; the pose key `hz` says it: 1 = each hand on its own
      // side (the default), 0 = both on the centre line, below 0 = crossed over.
      // (hzN / hzF place one hand on its own: single whip's hook hand out behind, a stick hand crossing the body)
      var hz = P0['hz' + src.charAt(1)];
      if (typeof hz !== 'number') hz = typeof P0.hz === 'number' ? P0.hz : 1;
      z *= hz;
      // A hand hanging beside the body sits outside the hip, not inside it (the hips are wider than the hands' usual spacing).
      var tp = Js.sh, bt = Js.hip;
      if (bt.y - tp.y > 20) {                                 // (upright enough to have a "beside")
        var yy = Math.max(tp.y, Math.min(bt.y, j.y)), bodyX = tp.x + (bt.x - tp.x) * (yy - tp.y) / (bt.y - tp.y);
        var beside = (1 - smooth(6, 15, Math.abs(j.x - bodyX))) * smooth(tp.y + 10, tp.y + 26, j.y) * smooth(0.5, 0.9, Math.abs(hz));
        z += ((src === 'hN' ? 0.25 : -0.25) * (hz < 0 ? -1 : 1) - z) * beside;      // (a hand crossed over hangs beside the other hip)
      }
    }
    // …nor how far apart the feet are: `fz` says it (1 = each foot under its own hip, the default; about 1.8 = shoulder-width;
    // 0.5 = feet together). A single foot can be placed with fzN / fzF — below 0 it crosses the centre line (cross stance).
    if (!Jf && !pt && /^[akt][NF]$/.test(src)) {
      var fzk = P0['fz' + src.charAt(1)];
      if (typeof fzk !== 'number') fzk = typeof P0.fz === 'number' ? P0.fz : 1;
      z *= src.charAt(0) === 'k' ? (1 + fzk) / 2 : fzk;
    }
    // front-view lessons: an arm drawn shorter than its real length points towards the viewer, so in 3D it reaches forward by the missing length
    if (mode === 'front' && !pt && !cur.golf && /^[eh][NF]$/.test(src)) {
      var q = src.charAt(1), s0 = Js['sh' + q], e0 = Js['e' + q], h0 = Js['h' + q];
      x = Math.sqrt(Math.max(0, 900 - (e0.x - s0.x) * (e0.x - s0.x) - (e0.y - s0.y) * (e0.y - s0.y))) * K;
      if (src.charAt(0) === 'h') x += Math.sqrt(Math.max(0, 784 - (h0.x - e0.x) * (h0.x - e0.x) - (h0.y - e0.y) * (h0.y - e0.y))) * K;
    }
    // golf: the swing is drawn face-on; the forward bend of the address posture comes from the lesson's side-view setup.
    // Every joint keeps the forward position and height difference it has at address; the hands come back towards the body
    // as they rise above the shoulders (at the top of the swing they are up beside the head, not out in front).
    if (cur.golf && GOLFREF && !pt) {
      var GS = GOLFREF.side, GF = GOLFREF.front, arm = /^[eh][NF]$/.test(src), ref = arm ? 'sh' + src.charAt(1) : src;
      var rs = GS[ref] || GS[ref.replace(/[NF]$/, '')] || GS.hip, rf = GF[ref] || GF.hip;
      x = (rs.x - GS.hip.x) * K;
      if (!/^[at][NF]$/.test(src)) y += (rf.y - rs.y) * K;
      if (arm) {
        var hd = (GS['h' + src.charAt(1)].x - GS['sh' + src.charAt(1)].x) * K, rise = Jf['sh' + src.charAt(1)].y - Jf['h' + src.charAt(1)].y;
        x += hd * (src.charAt(0) === 'e' ? 0.55 : 1) * (1 - 0.75 * smooth(-45, 15, rise));
      }
    }
    // …and the same for a thigh drawn shorter (lT): the knee bends towards the viewer, i.e. forward — not sideways
    if (mode === 'front' && !pt && !cur.golf && (src === 'kN' || src === 'kF')) {
      var lT = typeof P0.lT === 'number' ? Math.min(1, P0.lT) : 1;
      x = 44 * Math.sqrt(1 - lT * lT) * K;
      if (lT > 0.999) {
        // A front drawing with full-length thighs can only show a bent knee poking out sideways — a knee cannot bend that way.
        // The same bend is turned to the front: straight ahead for a shallow bend, more and more out over the (turned-out)
        // toes the deeper it is — the rule the toes themselves follow in planFoot.
        var qk = src.charAt(1), hp2 = Js['hip' + qk], an2 = Js['a' + qk], ldx = an2.x - hp2.x, ldy = an2.y - hp2.y, ll = Math.hypot(ldx, ldy) || 1;
        var along = ((j.x - hp2.x) * ldx + (j.y - hp2.y) * ldy) / ll, px = hp2.x + ldx / ll * along, py = hp2.y + ldy / ll * along;
        var offx = j.x - px, offy = j.y - py, off = Math.hypot(offx, offy);
        var cb = ((j.x - hp2.x) * (an2.x - j.x) + (j.y - hp2.y) * (an2.y - j.y)) / ((Math.hypot(j.x - hp2.x, j.y - hp2.y) * Math.hypot(an2.x - j.x, an2.y - j.y)) || 1);
        var outw = 0.75 * smooth(20 * DEG, 70 * DEG, Math.acos(Math.max(-1, Math.min(1, cb))));
        x = Math.sqrt(1 - outw * outw) * off * K;
        y = (FLOOR - (py + offy * outw)) * K;
        z = ((px + offx * outw) - Jf.hip.x) * K;
      }
    }
    // `kzN` / `kzF` (3D only): that knee bends out sideways by that many lesson units (+ = towards the near side) instead of up —
    // a leg lying on its side on the mat (sitting in a hold, a guard) — the knee goes beside the hip→ankle line, not above it
    var kzk = !pt && !Jf && /^k[NF]$/.test(src) ? P0['kz' + src.charAt(1)] : undefined;
    if (typeof kzk === 'number' && kzk) {
      var hq = Js['hip' + src.charAt(1)], aq = Js['a' + src.charAt(1)];
      x = (mode === 'front' ? 0 : ((hq.x + aq.x) / 2 - x0) * K - hx); y = (FLOOR - (hq.y + aq.y) / 2) * K; z = (DEPTH[src] || 0) + kzk * K;
    }
    if (wide && (src === 'hN' || src === 'hF')) z = src === 'hN' ? wide : -wide;
    // push-up hands (lesson gives luN/luF): planted on the floor at shoulder width, straight under the shoulders
    else if (!Jf && (src === 'hN' || src === 'hF') && typeof P0.luN === 'number' && y < 0.04) {
      // …or further out when the forearm is drawn shortened too (arms slapping the mat at 45° in a breakfall)
      var la = P0[src === 'hN' ? 'laN' : 'laF']; la = typeof la === 'number' ? Math.min(1, la) : 1;
      z = la < 0.999 ? elbowZ(src === 'hN' ? 'eN' : 'eF') + 28 * K * Math.sqrt(1 - la * la) : 0.2;
      if (src === 'hF') z = -z;
    }
    if ((wide || (!Jf && typeof P0[src === 'eN' ? 'luN' : 'luF'] === 'number')) && (src === 'eN' || src === 'eF')) z = src === 'eN' ? elbowZ(src) : -elbowZ(src);
    // `ez`: how far apart the elbows are (1 = each in front of its own shoulder, 0 = on the centre line — an uppercut elbow)
    if (!Jf && !pt && (src === 'eN' || src === 'eF') && typeof P0.ez === 'number') z *= P0.ez;
    if (flip) z = -z;
    // (the shoulders and arms turn about the base of the neck, the hips about their centre; the head stays over the ball)
    var up = !pt && cur.golf && /^(shN|shF|eN|eF|hN|hF)$/.test(name), tq = up ? gTurn : !pt && cur.golf && /^hip[NF]$/.test(name) ? hTurn : 0;
    if (tq) {
      var px = up ? (GOLFREF.side.sh.x - GOLFREF.side.hip.x) * K : 0, pz = up ? (Jf.sh.x - Jf.hip.x) * K * (flip ? -1 : 1) : 0;
      var cq = Math.cos(tq), sq = Math.sin(tq), x1 = px + (x - px) * cq - (z - pz) * sq; z = pz + (x - px) * sq + (z - pz) * cq; x = x1;
    }
    // `lz`: the upper body leans sideways by that many degrees (+ = towards the lesson's near side: slipping a punch, bobbing
    // and weaving) — a side-view drawing cannot show it. Everything above the hips turns about the hips as one piece.
    if (!pt && typeof P0.lz === 'number' && P0.lz && /^(sh|head|shN|shF|eN|eF|hN|hF)$/.test(name)) {
      var la0 = P0.lz * DEG * (sd.arms ? -1 : 1), hy0 = (FLOOR - Js.hip.y) * K, dy0 = y - hy0, cl = Math.cos(la0), sl0 = Math.sin(la0);
      y = hy0 + dy0 * cl - z * sl0; z = dy0 * sl0 + z * cl;
    }
    return new THREE.Vector3(hx + x * cos + z * sin, y, -x * sin + z * cos);
  }
  var at = (S ? sideP : frontP).poseAt(t);
  return { J: Js, V: V, theta: theta, pose: S ? S.pose : F.pose, seg: at.seg, k: at.k, gTurn: gTurn };
}

/* ---------- feet that stay where they are planted ----------
 * The 2D lessons place the feet relative to the hips ("treadmill" style): stepping into a bow stance is drawn as the
 * back foot sliding away while the hips stay put. In 3D that would be a foot sliding across the floor. So for every
 * stretch between two key frames one foot is chosen as the anchor — a foot the lesson itself keeps still, otherwise
 * the one carrying more of the weight when the stretch begins — and the whole body is moved so that this foot stays
 * on its spot. The other foot then really steps: it lifts, travels and lands a little before the weight arrives.
 * Both feet AND the hips travelling together (a retreat drawn as a glide) become two steps, or a hop when it is
 * fast; a very small glide is simply left out. The stretch that returns to the first frame picks the anchor that
 * brings the body back to where it started, so the loop does not creep across the floor.
 */
var GAIT = null;
var JOINTS = ['hip', 'sh', 'head', 'hipN', 'hipF', 'kN', 'kF', 'aN', 'aF', 'tN', 'tF', 'shN', 'shF', 'eN', 'eF', 'hN', 'hF'];
function rawJoints(t) {
  var r = pose3d(t), n = {};
  JOINTS.forEach(function (k) { n[k] = r.V(k); });
  // `myaw` (3D only, a lesson key set per frame with fix): you turned that many degrees about the partner's chest — side
  // control has you across their chest, the mount in line with them; a side view can only draw you in line. Between frames
  // the turn is shared out, so you swing round them as you move from one to the other.
  if (cur && cur.duo && cur.mode !== 'front') {
    var p = sideP.poseAt(t).pose, yaw = typeof p.myaw === 'number' ? p.myaw * DEG : 0;
    if (Math.abs(yaw) > 1e-4) {
      var X = p.ox + (cur.odx || 0), st = Math.sin((p.ot || 0) * DEG);
      var pv = v3((X - 29 * st - x0) * K, 0, (typeof p.oz === 'number' ? p.oz : cur.oz || 0) * K);
      Object.keys(n).forEach(function (k) { var y = n[k].y; n[k].y = 0; n[k].sub(pv).applyAxisAngle(UPV, yaw).add(pv); n[k].y = y; });
      r.theta += yaw;
    }
  }
  return { r: r, n: n };
}
// where a foot meets the floor (under the ankle, or under the toes when the heel is up) and how firmly it is down (0…1)
function footSpot(n, k) {
  var a = n['a' + k], t = n['t' + k], toe = 1 - smooth(0.005, 0.03, t.y - a.y);     // toes up → the heel is what touches
  return { x: a.x + (t.x - a.x) * toe, z: a.z + (t.z - a.z) * toe, g: 1 - smooth(0.035, 0.08, Math.max(0, Math.min(a.y, t.y))) };
}
function planGait() {
  GAIT = null;
  if (!cur || cur.gait === false) return;
  var pl = cur.mode === 'front' ? frontP : sideP, fr = pl.frames, nF = fr.length, key = [], acc = 0, i;
  for (i = 0; i < nF; i++) {
    var q = rawJoints(acc), n = q.n;
    key.push({ N: footSpot(n, 'N'), F: footSpot(n, 'F'), hip: { x: n.hip.x, z: n.hip.z }, fw: { x: Math.cos(q.r.theta), z: -Math.sin(q.r.theta) } });
    acc += fr[i].d;
  }
  function sub(a, b) { return { x: a.x - b.x, z: a.z - b.z }; }
  function len(v) { return Math.hypot(v.x, v.z); }
  var STEP = 0.10;                                           // feet that move less than this against each other do not step: they stay planted
  var C = [{ x: 0, z: 0 }], segs = [];
  for (i = 0; i < nF; i++) {
    var A = key[i], B = key[(i + 1) % nF], wrap = i === nF - 1, C0 = C[i];
    var gN = Math.min(A.N.g, B.N.g) > 0.8, gF = Math.min(A.F.g, B.F.g) > 0.8;        // firmly down at both ends of the stretch
    var dN = sub(B.N, A.N), dF = sub(B.F, A.F), dH = sub(B.hip, A.hip), mN = len(dN), mF = len(dF);
    var S = { anchor: null, N: 'lesson', F: 'lesson', drift: null, late: false }, both = gN && gF;
    var plain = cur.gaitOnly && cur.gaitOnly.indexOf(i) < 0;   // this stretch is left exactly as the lesson draws it
    if (plain) { both = gN = gF = false; S.plain = true; }
    var homeIf = function (d) { return len({ x: C0.x - d.x, z: C0.z - d.z }); };    // how far from the start the body would be with this foot as anchor
    if (both) {
      var big = Math.max(mN, mF), rel = len(sub(dN, dF)), less = mN <= mF ? 'N' : 'F';
      var glide = dN.x * dF.x + dN.z * dF.z > 0 && rel < 0.35 * big && len(sub(dH, { x: (dN.x + dF.x) / 2, z: (dN.z + dF.z) / 2 })) < 0.35 * big;
      // how much of the weight each foot carries as the stretch begins: where the hips sit between the feet
      var ax = A.N.x - A.F.x, az = A.N.z - A.F.z, L2 = ax * ax + az * az;
      var raw = L2 > 1e-6 ? ((A.hip.x - A.F.x) * ax + (A.hip.z - A.F.z) * az) / L2 : 0.5, shareN = Math.max(0, Math.min(1, raw));
      var known = L2 > 1e-6 && raw > -0.3 && raw < 1.3;       // hips far outside the feet (sitting behind them): the share says nothing
      var apart = L2 > 0.09;                                  // feet side by side (closer than 30 cm): the weight can go to either in an instant, so it does not decide who steps
      if (glide && big >= 0.08 && !(homeIf(dN) < len(C0) - 0.03)) {
        // feet and hips travel together (a retreat drawn as a glide): two steps, or a hop when it is fast
        // (not when it undoes travel that was left out earlier — leaving this out too brings the body home)
        if (fr[i].d < 350 && big > 0.25) S.N = S.F = 'hop';
        else { var lead = (A.N.x - A.F.x) * dN.x + (A.N.z - A.F.z) * dN.z >= 0 ? 'N' : 'F'; S[lead] = 'first'; S[lead === 'N' ? 'F' : 'N'] = 'second'; }
      } else if (rel <= STEP) S.anchor = less;                // the feet keep their places: the one the lesson moves least is the reference
      else if (less === 'N' ? mN < 0.02 && len(dH) > 0.02 : mF < 0.02 && len(dH) > 0.02) S.anchor = less;   // the lesson itself moves the hips against a foot it keeps still
      else if (!known) S.anchor = less;
      else if (len(dH) > 0.08 && Math.min(mN, mF) < 0.12 && Math.min(mN, mF) < 0.4 * Math.max(mN, mF)) {
        // the lesson carries the hips past a foot it keeps (nearly) where it is — walking through: that foot stays and the
        // other steps; if the weight is still on the stepping foot it shifts across first and the foot steps late
        S.anchor = less;
        if (apart && (less === 'N' ? shareN < 0.3 : shareN > 0.7)) S.late = true;
      }
      else if (apart && (shareN > 0.7 || shareN < 0.3)) {     // one foot steps: not the one carrying the weight…
        S.anchor = shareN > 0.7 ? 'N' : 'F';
        // …except on the way back to the first frame, if only the other choice brings the body home: then the weight
        // shifts first and the foot steps late
        var heavy = S.anchor === 'N' ? dN : dF, light = S.anchor === 'N' ? dF : dN;
        if (wrap && homeIf(heavy) > 0.03 && homeIf(light) <= 0.03) { S.anchor = S.anchor === 'N' ? 'F' : 'N'; S.late = true; }
      } else {
        // weight fairly even: come back towards the starting spot if the body has travelled, otherwise step forward
        var hN = homeIf(dN), hF = homeIf(dF);
        if (len(C0) > 0.03 && Math.abs(hN - hF) > 0.03) S.anchor = hN < hF ? 'N' : 'F';
        else if (Math.min(mN, mF) < 0.4 * Math.max(mN, mF)) S.anchor = less;   // the lesson moves one foot far more than the other ("step one foot back"): that one steps
        else if (apart && shareN > 0.56) S.anchor = 'N';
        else if (apart && shareN < 0.44) S.anchor = 'F';
        else {                                                // the foot that ends up behind stays
          var pN = B.N.x * B.fw.x + B.N.z * B.fw.z, pF = B.F.x * B.fw.x + B.F.z * B.fw.z;
          S.anchor = Math.abs(pN - pF) > 0.03 ? (pN < pF ? 'N' : 'F') : less;
        }
      }
      if (S.anchor && rel > STEP) S[S.anchor === 'N' ? 'F' : 'N'] = S.late ? 'late' : 'step';   // the other foot really steps
    } else if (gN) S.anchor = 'N';
    else if (gF) S.anchor = 'F';
    // a foot that is in the air at the start and firmly down at the end, next to an anchored foot: it lands ahead of the weight
    // …and a foot that is firmly down at the start and in the air at the end stays down until the weight has moved off it
    ['N', 'F'].forEach(function (f) {
      if (!S.anchor || S.anchor === f) return;
      if (A[f].g <= 0.8 && B[f].g > 0.8) S[f] = 'land';
      else if (A[f].g > 0.8 && B[f].g <= 0.8) S[f] = 'lift';
    });
    var dA = S.anchor === 'N' ? dN : S.anchor === 'F' ? dF : { x: 0, z: 0 };
    var C1 = { x: C0.x - dA.x, z: C0.z - dA.z };
    if (wrap) { if (len(C1) > 0.005) S.drift = { x: -C1.x, z: -C1.z }; C1 = { x: 0, z: 0 }; }
    segs.push(S); C.push(C1);
  }
  var Ts = [], t0 = 0;
  for (i = 0; i < nF; i++) { Ts.push(t0); t0 += fr[i].d; }
  GAIT = { key: key, seg: segs, C: C, pin: null, T: Ts, fr: fr };
  // A step normally lands at 70% of its stretch, before the weight arrives. A long reaching step (a drop stance) cannot:
  // the hips are still too high for the leg to reach that far. Find the earliest moment from 70% on when it can.
  var REACH = 0.82, tAcc = 0;
  for (i = 0; i < nF; i++) {
    var Sg = segs[i];
    ['N', 'F'].forEach(function (f) {
      if (Sg[f] !== 'step' && Sg[f] !== 'land') return;
      var Bk = key[(i + 1) % nF], wx = Bk[f].x + C[i + 1].x, wz = Bk[f].z + C[i + 1].z, land = 1, ok = true;
      for (var sI = 10; sI >= 1; sI--) {                      // walk back from the end of the stretch
        var qs = rawJoints(tAcc + fr[i].d * sI / 10 - 0.5), ks = qs.r.k, sp = footSpot(qs.n, Sg.anchor);
        var hx2 = qs.n['hip' + f].x + C[i].x - (sp.x - key[i][Sg.anchor].x), hz2 = qs.n['hip' + f].z + C[i].z - (sp.z - key[i][Sg.anchor].z);
        var can = Math.hypot(hx2 - wx, hz2 - wz, Math.max(0, qs.n.hip.y)) < REACH;   // (the model's ankle sits about as high above the floor as its hips are raised over the lesson's)
        if (!can) ok = false;
        if (ok && ks >= 0.7) land = ks;
      }
      Sg['land' + f] = Math.max(0.7, land);
    });
    tAcc += fr[i].d;
  }
  if (!avatar) return;
  // Which feet stay down through each stretch? (the anchor, or a foot that hardly moves; a small leftover drift of the
  // body on the way back to the first frame is taken up by the legs, the feet stay)
  var held = [], T;
  for (i = 0; i < nF; i++) {
    var A2 = key[i], B2 = key[(i + 1) % nF], S2 = segs[i], h = {};
    ['N', 'F'].forEach(function (f) {
      var down = Math.min(A2[f].g, B2[f].g) > 0.8, moved = len(sub({ x: B2[f].x + C[i + 1].x, z: B2[f].z + C[i + 1].z }, { x: A2[f].x + C[i].x, z: A2[f].z + C[i].z }));
      h[f] = !S2.plain && down && S2[f] === 'lesson' && (!S2.drift || len(S2.drift) <= STEP) && (S2.anchor === f || moved <= STEP);
    });
    held.push(h);
  }
  // every stretch of the loop during which a foot stays down forms a run; runs[f][j] = index of the run's first key frame
  var runs = { N: [], F: [] };
  ['N', 'F'].forEach(function (f) {
    var start = -1;
    for (i = 0; i < nF; i++) { runs[f].push(-1); if (start < 0 && !held[i][f]) start = i; }
    if (start < 0) { for (i = 0; i < nF; i++) runs[f][i] = 0; return; }                  // down the whole time
    var run = -1;
    for (var c2 = 1; c2 <= nF; c2++) { var j = (start + c2) % nF; if (held[j][f]) { if (run < 0) run = j; runs[f][j] = run; } else run = -1; }
  });
  function poseKeys(pinAt) {                                // pose the model at every key frame and read both feet
    var out = [];
    T = 0;
    for (i = 0; i < nF; i++) {
      var qq = lessonJoints(T), inf = poseAvatar(qq.n, qq.r.theta, cur, pinAt ? pinAt(i) : null);
      var bN = wpos(avatar.B.RightToeBase), bF = wpos(avatar.B.LeftToeBase), aN2 = wpos(avatar.B.RightFoot), aF2 = wpos(avatar.B.LeftFoot);
      out.push({ N: { x: bN.x, z: bN.z, ax: aN2.x, az: aN2.z, turn: inf.feet.N.turn }, F: { x: bF.x, z: bF.z, ax: aF2.x, az: aF2.z, turn: inf.feet.F.turn } });
      T += fr[i].d;
    }
    return out;
  }
  // 1) the turn-out a planted foot needs: the most it needs at any key frame of its run (both ends of every stretch)
  var free = poseKeys(null), turn = [];
  for (i = 0; i < nF; i++) turn.push({ N: null, F: null });
  ['N', 'F'].forEach(function (f) {
    var most = {};
    for (i = 0; i < nF; i++) { var r0 = runs[f][i]; if (r0 < 0) continue; most[r0] = Math.max(most[r0] || 0, free[i][f].turn, free[(i + 1) % nF][f].turn); }
    for (i = 0; i < nF; i++) if (runs[f][i] >= 0) turn[i][f] = most[runs[f][i]];
  });
  // 2) where the ball of the foot lands with that turn-out, at every key frame (a foot keeps the turn-out of the run it is
  //    in, or of the run it has just finished): a run is pinned to where its first key frame put it
  var landed = poseKeys(function (j) { var o = { N: null, F: null }; ['N', 'F'].forEach(function (f) { var k2 = runs[f][j] >= 0 ? j : (runs[f][(j + nF - 1) % nF] >= 0 ? (j + nF - 1) % nF : -1); if (k2 >= 0) o[f] = { turn: turn[k2][f] }; }); return o; });
  var pin = [];
  for (i = 0; i < nF; i++) {
    var o2 = { N: null, F: null };
    ['N', 'F'].forEach(function (f) { var r0 = runs[f][i]; if (r0 >= 0) o2[f] = { x: landed[r0][f].x, z: landed[r0][f].z, ax: landed[r0][f].ax, az: landed[r0][f].az, turn: turn[i][f] }; });
    pin.push(o2);
  }
  // how the pin acts in each stretch: 'hold' (stays down), 'switch' (a step: lifts off from the old spot, lands on the new one),
  // 'prev' (leaving the floor from its spot), 'next' (coming down on its next spot)
  var pm = [];
  for (i = 0; i < nF; i++) {
    var A3 = key[i], B3 = key[(i + 1) % nF], o3 = {};
    ['N', 'F'].forEach(function (f) {
      var d0 = A3[f].g > 0.8, d1 = B3[f].g > 0.8;            // firmly down at the start / at the end
      o3[f] = segs[i].plain ? 'none' : held[i][f] ? 'hold' : segs[i][f] === 'land' ? 'next' : segs[i][f] === 'lift' ? 'prev' : segs[i][f] !== 'lesson' ? 'switch' : d0 && !d1 ? 'prev' : !d0 && d1 ? 'next' : 'none';
    });
    pm.push(o3);
  }
  GAIT.pin = pin; GAIT.pm = pm; GAIT.ball = landed;
}
// the lesson's joints at time t, moved so that planted feet stay planted and stepping feet step
function lessonJoints(t) {
  var q = rawJoints(t), n = q.n, r = q.r, G = GAIT;
  if (cur && cur.belt) beltSteps(t, n);
  if (!G) return q;
  var nF = G.key.length, j = Math.min(nF - 1, r.seg), k = r.k, S = G.seg[j], A = G.key[j], B = G.key[(j + 1) % nF], C0 = G.C[j], C1 = G.C[j + 1];
  var cx = C0.x, cz = C0.z;
  if (S.anchor) { var sp = footSpot(n, S.anchor); cx -= sp.x - A[S.anchor].x; cz -= sp.z - A[S.anchor].z; }
  if (S.drift) { cx += S.drift.x * k; cz += S.drift.z * k; }
  Object.keys(n).forEach(function (m) { n[m].x += cx; n[m].z += cz; });
  // While a foot is still coming down from the air (stepping down out of a raised knee) the hips hold back — they have
  // covered only half of what the lesson has by then — and catch up once it has landed. The anchor foot never moves.
  if (S.anchor && S[S.anchor === 'N' ? 'F' : 'N'] === 'land') {
    var Lf = S['land' + (S.anchor === 'N' ? 'F' : 'N')] || 0.7, hk = k * (0.5 + 0.5 * smooth(Lf - 0.25, 1, k));
    var hx = (B.hip.x + C1.x - A.hip.x - C0.x) * (hk - k), hz = (B.hip.z + C1.z - A.hip.z - C0.z) * (hk - k);
    Object.keys(n).forEach(function (m) {
      var mine = m === 'a' + S.anchor || m === 't' + S.anchor ? 0 : m === 'k' + S.anchor ? 0.5 : 1;   // the anchor foot stays; its knee follows half-way
      n[m].x += hx * mine; n[m].z += hz * mine;
    });
  }
  var prog = { N: k, F: k }, go = { N: k, F: k }, stepping = 0;
  ['N', 'F'].forEach(function (f) {
    if (S[f] !== 'land' && S[f] !== 'lift') return;
    // A foot on its way down is where the lesson would have it a little later, so it is down before the weight arrives.
    // A foot about to leave the floor is where the lesson had it a little earlier, so it stays down while the weight moves off it.
    var kq = S[f] === 'land' ? Math.min(1, k / (S['land' + f] || 0.7)) : Math.max(0, (k - 0.3) / 0.7), lo = 0, hi = 1;
    for (var bi = 0; bi < 14; bi++) { var md = (lo + hi) / 2; if (G.fr[j].e(md) < kq) lo = md; else hi = md; }
    var q2 = rawJoints(G.T[j] + G.fr[j].d * Math.min(0.9999, (lo + hi) / 2)), c2x = C0.x, c2z = C0.z;
    if (S.anchor) { var sp2 = footSpot(q2.n, S.anchor); c2x -= sp2.x - A[S.anchor].x; c2z -= sp2.z - A[S.anchor].z; }
    ['a', 't', 'k'].forEach(function (p2) { var v = q2.n[p2 + f]; n[p2 + f].set(v.x + c2x, v.y, v.z + c2z); });
    prog[f] = kq;
  });
  ['N', 'F'].forEach(function (f) {
    var mode = S[f];
    if (mode === 'lesson' || mode === 'land' || mode === 'lift') return;
    var u = mode === 'step' ? k / (S['land' + f] || 0.7) : mode === 'late' ? (k - 0.3) / 0.7 : mode === 'first' ? k / 0.5 : mode === 'second' ? (k - 0.5) / 0.5 : k;
    u = Math.max(0, Math.min(1, u)); prog[f] = u; stepping++;
    go[f] = mode === 'hop' ? u : smooth(0.18, 0.82, u);                              // across the floor only while the foot is in the air
  });
  // two steps in a row (a retreat): the hips stay between the feet instead of running ahead of the foot still on the floor
  if (stepping === 2 && S.N !== 'hop') {
    var bx = (B.hip.x - A.hip.x) * ((go.N + go.F) / 2 - k), bz = (B.hip.z - A.hip.z) * ((go.N + go.F) / 2 - k);
    Object.keys(n).forEach(function (m) { n[m].x += bx; n[m].z += bz; });
  }
  ['N', 'F'].forEach(function (f) {
    var mode = S[f];
    if (mode === 'lesson' || mode === 'land' || mode === 'lift') return;
    var u = prog[f];
    var w0x = A[f].x + C0.x, w0z = A[f].z + C0.z, w1x = B[f].x + C1.x, w1z = B[f].z + C1.z, now = footSpot(n, f);
    var dx = w0x + (w1x - w0x) * go[f] - now.x, dz = w0z + (w1z - w0z) * go[f] - now.z;
    var H = mode === 'hop' ? 0.11 : Math.max(0.055, Math.min(0.1, 0.3 * Math.hypot(w1x - w0x, w1z - w0z))), h = H * Math.sin(Math.PI * u);
    ['a', 't'].forEach(function (p2) { var v = n[p2 + f]; v.x += dx; v.z += dz; v.y += h; });
    var kn = n['k' + f]; kn.x += dx * 0.5; kn.z += dz * 0.5; kn.y += h * 0.5;
  });
  q.shift = { x: cx, z: cz };
  // Pins: a foot that stays down keeps its spot. A foot that is leaving the floor or stepping lifts off FROM the spot
  // it was pinned to and sets down ON the spot it will be pinned to next (the pin only acts while the foot is still
  // touching the floor, so it fades out by itself as the foot rises).
  q.pins = null;
  if (G.pin) {
    q.pins = { N: null, F: null };
    ['N', 'F'].forEach(function (f) {
      var m = G.pm[j][f], before = G.pin[(j + nF - 1) % nF][f] || G.ball[j][f], after = G.pin[(j + 1) % nF][f] || G.ball[(j + 1) % nF][f], here = null;
      var u = prog[f];
      function faded(src, w) { return src ? { x: src.x, z: src.z, ax: src.ax, az: src.az, turn: src.turn, w: w } : null; }
      if (m === 'hold') here = G.pin[j][f];
      else if (m === 'prev') { here = faded(before, 1 - smooth(0, 0.5, u)) || {}; here.free = smooth(0.02, 0.2, u); }       // leaving the floor: lets go of its spot as it rises
      else if (m === 'next') { here = faded(after, smooth(0.5, 1, u)) || {}; here.free = 1 - smooth(0.7, 0.93, u); here.down = smooth(0.4, 0.9, u); }       // coming down: settles on to its next spot
      else if (m === 'switch') {                                                   // a step: both, and free of the floor in between
        here = (u < 0.5 ? faded(before, 1 - smooth(0, 0.45, u)) : faded(after, smooth(0.55, 1, u))) || {};
        here.free = smooth(0.04, 0.22, Math.sin(Math.PI * u));
        here.down = smooth(0.45, 0.85, u);                                           // on its way down: the hips come down in time for the leg to reach
      }
      q.pins[f] = here || null;
    });
  }
  return q;
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
// two models: the instructor for every lesson, and the golfer (made for KungfuTutor with Meshy, private licence) for golf
var MODELS = { instructor: '/assets/models/instructor/kt-instructor.glb', golfer: '/assets/models/golfer/kt-golfer.glb', partner: '/assets/models/instructor/kt-instructor.glb' };
var avatar = null, AVS = {}, avKey = null, avLoading = {};
var AV = { v1: new THREE.Vector3(), v2: new THREE.Vector3(), q1: new THREE.Quaternion(), q2: new THREE.Quaternion(), q3: new THREE.Quaternion() };
// three.js drops the colon from "mixamorig:Hips", so match on the part after the prefix
function boneKey(name) { return name.replace(/^mixamorig[:_]?/i, ''); }
var NEED = ['Hips', 'Spine', 'Neck', 'Head', 'RightArm', 'RightForeArm', 'RightHand', 'RightHandMiddle1', 'LeftArm', 'LeftForeArm', 'LeftHand', 'LeftHandMiddle1',
  'RightUpLeg', 'RightLeg', 'RightFoot', 'RightToeBase', 'LeftUpLeg', 'LeftLeg', 'LeftFoot', 'LeftToeBase'];
var SIDES = [{ X: 'Right', k: 'N', foot: 1, hand: 3, arm: 7, leg: 9 }, { X: 'Left', k: 'F', foot: 2, hand: 4, arm: 8, leg: 10 }];   // skin regions (0 = trunk and head)
var DEG = Math.PI / 180, IDQ = new THREE.Quaternion();
var BAR_R = 0.014 * 1.155;                                 // barbell shaft radius at the model's size
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
  // how far forward of upright the model's neck sits when its face is level (its own rest pose)
  var nk0 = wpos(B.Head).sub(wpos(B.Neck)), neckLean = Math.atan2(nk0.dot(fwd), nk0.y);
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
  return { rig: rig, B: B, rest: rest, RQ: RQ, D: D, fist: fist, open: open, fwd: fwd, right: right, mesh: body3d, neckLean: neckLean,
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
var BAR_GRIP = 0.14;                                         // wrist to the finger crease (where a bar sits in the hand)
function barCrease(B, X) {
  var w = wpos(B[X + 'Hand']), m1 = wpos(B[X + 'HandMiddle1']), m4 = wpos(B[X + 'HandMiddle4']);
  return m1.clone().lerp(m4, 0.12).addScaledVector(w.clone().sub(m1).normalize(), 0.014);
}
function barWrist(hold) { return hold.at.clone().addScaledVector(UPV, -BAR_GRIP).addScaledVector(hold.palm, -0.025); }
/* n: lesson joints in metres (floor at y = 0), theta: facing, move: the move being shown.
 * The lesson's own joint angles are kept wherever they can be; contact with the floor is then made exact.
 * Returns what was done, for the barbell and the self-check. */
function poseAvatar(n, theta, move, pins, who) {
  var A = who || avatar, B = A.B, D = A.D, info = { feet: {}, hands: {}, pitch: 0 };
  var frontView = move && move.mode && move.mode !== 'side', bar = move && move.bar;
  var face = new THREE.Quaternion().setFromUnitVectors(A.fwd, v3(1, 0, 0).applyAxisAngle(UPV, theta));
  var FW = A.fwd.clone().applyQuaternion(face), RT = A.right.clone().applyQuaternion(face), LF = RT.clone().negate();
  var tw = function (v) { return v.clone().applyQuaternion(face); };          // a rest-pose vector, turned to the facing
  var W0 = function (name) { return face.clone().multiply(A.RQ[name]); };     // a bone's rest orientation, turned
  var g = 1e9, n0 = n;                                      // n0: the lesson as written (n may be tipped or hinged below)
  Object.keys(n).forEach(function (k) { if (k !== 'head') g = Math.min(g, n[k].y); });
  g = Math.max(0, g);
  var grounded = move && move.air ? 0 : 1 - smooth(0.09, 0.16, g);   // lessons draw floor contact a few units above the line (a sitting hip ~7)
  // (move.air: a partner being thrown — nothing of theirs rests on the floor, whatever is near it)

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
    // The lesson draws the neck as a straight continuation of the spine. A real neck leans forward of that line while the
    // face stays level (this model: about 23°), so aiming the neck bone straight up the lesson's line tipped the face up by
    // that much. The lean is put back for an upright body; lying down, the head keeps the lesson's line (it rests on the floor).
    var nd = n.head.clone().sub(n.sh), tilt = A.neckLean * smooth(0.30, 0.70, up.y);
    if (tilt > 1e-4 && nd.lengthSq() > 1e-8) nd.applyAxisAngle(hr, -tilt);
    aimBone(B.Neck, B.Head, nd);
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
    f.w = w === undefined ? (move && move.air ? 0 : f.touch) : w;
    f.rel = a.clone().sub(hp);                               // the lesson's hip → ankle
    f.ext = Math.min(1, f.rel.length() / (d.thigh + d.shin));
    f.bendDir = perp(kn.clone().sub(hp), f.rel.clone().normalize());
    var h = flat(t.clone().sub(a)), braw;                    // braw: + = toes lower than the ankle (heel lifted)
    if (frontView) {                                         // front-view stances: toes follow a bent knee, point forward on a straight leg
      // (a move may say how far: the horse stance keeps its feet parallel — move.toes)
      var th = kn.clone().sub(hp), thh = flat(th), kf = (move && typeof move.toes === 'number' ? move.toes : 0.75) * smooth(20 * DEG, 70 * DEG, th.angleTo(a.clone().sub(kn))) * smooth(0.05, 0.15, thh.length());
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
    if (A.hold && A.hold[s.k]) H.w *= 1 - A.hold[s.k].w;     // a hand holding the other person is not on the floor
    H.rel = h.clone().sub(sh).multiplyScalar((d.upper + d.fore) / ((KTFigure.DIM.upper + KTFigure.DIM.fore) * K));   // the lesson's shoulder → hand, at this arm's length
    H.bendDir = perp(n['e' + s.k].clone().sub(sh), H.rel.clone().normalize());
    H.at = v3(S.x + H.rel.x, 0, S.z + H.rel.z);              // the spot on the floor under that hand
    var dl = H.rel.length(), hd = Math.hypot(H.rel.x, H.rel.z);
    H.c = d.wristH + Math.sqrt(Math.max(0, dl * dl - hd * hd)) - S.y;   // body lift that keeps the lesson's elbow angle with this hand down
    var h0 = n0['h' + s.k];
    H.barX = h0.x + barShift;
    H.barY = Math.max(h0.y, PLATE_R) + BAR_GRIP * Math.max(0, -H.rel.y / Math.max(dl, 1e-4));  // wrist height that puts the bar in the finger crease
    H.barW = Math.max(h0.y, PLATE_R) + BAR_GRIP;                          // the same with the arm hanging straight down
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
      // (a foot pinned to its spot may be further from the hips than the lesson drew: the hips then come down to it)
      var pn = pins && pins[f.k], hlPin = hl;
      if (pn && typeof pn.x === 'number') {
        var fq = tw(d.fromBall).applyQuaternion(f.rot), hs = C.Hs[f.X];
        hlPin = Math.hypot(pn.x + fq.x - hs.x, pn.z + fq.z - hs.z);
        hl += (hlPin - hl) * (pn.w === undefined ? 1 : pn.w);
      }
      var top = f.Ay + (d.ballH + Math.hypot(d.fromBall.y, d.ballFwd) - f.Ay) * f.toes;        // a foot on its toes can still raise its heel
      lift -= Math.max(0, lift - (top + Math.sqrt(Math.max(0, reach * reach - hl * hl)) - C.Hs[f.X].y + (hlPin !== hl || (pn && typeof pn.x === 'number') ? 0.001 : 0.006))) * smooth(0.6, 1, f.w);   // (a pinned foot is exactly where it is: no allowance)
      // a foot on its way down: the hips are already low enough for the leg to reach its landing spot when it gets there
      if (pn && pn.down) lift -= Math.max(0, lift - (top + Math.sqrt(Math.max(0, reach * reach - hlPin * hlPin)) - C.Hs[f.X].y + 0.006)) * pn.down;
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
    var wFt = Math.max(feet[0].w, feet[1].w), Rf = v3(0, 0, 0), Rk = v3(0, 0, 0), cK = 0, wK = 0, sf = 0, sk = 0, kMin = 1;
    feet.forEach(function (f, i) { Rf.addScaledVector(flat(n['a' + SIDES[i].k]), f.w); sf += f.w; });
    SIDES.forEach(function (s) {
      var k = n['k' + s.k], w = 1 - smooth(0.035, 0.06, Math.max(0, n0['k' + s.k].y));
      Rk.addScaledVector(flat(k), w); sk += w; cK += (A.kneeR - k.y) * w; wK = Math.max(wK, w); kMin = Math.min(kMin, w);
    });
    wFt *= 1 - kMin * Math.min(feet[0].toes, feet[1].toes);   // both knees down on tucked toes (knee plank): the knees carry the body, not the toes
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
    if (f.toes > 0) {
      // On the ball of the foot the heel keeps the angle the lesson draws, so it moves as smoothly as the lesson does.
      // Only when the leg could not reach the foot that way does the heel go to the height that makes the leg fit
      // (working the heel angle out from the leg length alone is far too twitchy: 5 cm of ankle height = 45° of heel).
      var fb = tw(d.fromBall), R = Math.hypot(fb.y, fb.dot(FW)), th0 = Math.atan2(fb.y, -fb.dot(FW));
      var q = Math.asin(Math.max(-1, Math.min(1, (Tfree.y + kneeDrop - d.ballH) / R)));
      var bs = Math.max(3 * DEG, Math.min(88 * DEG, (f.beta0 + th0 > Math.PI / 2 ? Math.PI - q : q) - th0));
      var ayL = d.ballH + R * Math.sin(f.beta0 + th0), need = smooth(reach + 0.004, reach + 0.04, Math.hypot(hl, S.y - ayL));   // (a leg that is simply straight is not out of reach)
      // (hands on the floor as well — push-up, plank: the body's line is fixed by hands and toes, so there the heel always fits the leg)
      need = Math.max(need, Math.max(hands[0].w, hands[1].w));
      f.beta = f.beta0 + (bs - f.beta0) * need * f.toes; footShape(f);
    }
    var pin = pins && pins[f.k], fixedTurn = pin && typeof pin.turn === 'number' && !frontView;   // (in a front-view stance the toes already follow the knee)
    if (fixedTurn && f.turn !== pin.turn) { f.turn = pin.turn; footShape(f); }   // turned out once, when it was planted
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
      // A foot that is staying where it was planted has the ball of the foot pinned to that spot, so raising or lowering
      // the heel pivots on the ball (the ankle travels over it) instead of swinging the toes across the floor.
      // pin.w fades it: a foot lifting off leaves its spot gradually, a foot coming down settles on to its next one.
      if (pin && typeof pin.x === 'number') {
        var fbp = tw(d.fromBall).applyQuaternion(f.rot), pw = pin.w === undefined ? 1 : pin.w;
        // (front-view stances turn the toes out as the knees open: there the heel stays and the toes swing, so the ankle is pinned)
        var px = frontView && typeof pin.ax === 'number' ? pin.ax : pin.x + fbp.x, pz = frontView && typeof pin.az === 'number' ? pin.az : pin.z + fbp.z;
        T.x += (px - T.x) * pw; T.z += (pz - T.z) * pw;
        if (pw > 0.999) f.slide = 0;
      }
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
        if (!fixedTurn && flex0 > 26 * DEG && Math.abs(f.beta) < 3 * DEG) { f.turn = Math.min(50 * DEG, (flex0 - 26 * DEG) * 2.6); footShape(f); continue; }
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
      // each hand on the bar out at the grip: the wrist below and a little behind it, so the fingers come up round the bar
      T = wpos(B.Neck).addScaledVector(C.pFwd, -0.1).addScaledVector(C.up, -0.02).addScaledVector(C.hr, 0.36 * side).addScaledVector(C.up, -BAR_GRIP).addScaledVector(C.pFwd, -0.025);
      bend = C.up.clone().multiplyScalar(-1).addScaledVector(C.pFwd, -0.4);
    }
    if (wb) { T.y += (H.barW - T.y) * wb; T.x += (H.barX - T.x) * wb; }   // bar resting on the floor: hands on the bar itself
    var hold = A.hold && A.hold[H.k];                        // a hand holding the other person: on that spot of their body
    if (hold && hold.w > 0 && hold.barGrip) {                // a hand round a bar: the bar in the crease where the fingers meet the palm —
      // the hand rises from the wrist and the fingers curl over: the wrist 14 cm straight below that spot and a little behind it
      // (the palm faces hold.palm), wherever the shoulder is
      var gpB = barWrist(hold); T.lerp(gpB, hold.w);
      bend = bend.clone().lerp(hold.bend || bend, hold.w);
    } else if (hold && hold.w > 0) { var gp = hold.at.clone().addScaledVector(hold.at.clone().sub(S).normalize(), -(d.grip + 0.02)); T.lerp(gp, hold.w);   // (the palm on the spot, so the wrist stops short of it)
      bend = bend.clone().lerp(hold.bend || bend, hold.w); }
    if (barPush) T.addScaledVector(FW, barPush);             // the bar kept just in front of the model's legs (they have thickness, the lesson's lines do not)
    if (H.w > 0) {                                           // hand on the floor: under where the lesson's arm reaches, as far as the arm allows
      var wy = d.wristH + H.adj, dy = S.y - wy, hl = Math.hypot(H.rel.x, H.rel.z), far = Math.sqrt(Math.max(0, reach * reach - dy * dy)), hd = Math.min(hl, far);
      H.slide = (hl - hd) * H.w;
      T.lerp(v3(S.x + (hl > 1e-4 ? H.rel.x * hd / hl : 0), wy, S.z + (hl > 1e-4 ? H.rel.z * hd / hl : 0)), H.w);
    }
    // hand on the floor a few millimetres closer than the lesson's arm length (the two shoulders never sit at
    // exactly the height each arm wants): the shoulder blade moves the shoulder out, so the elbow keeps the lesson's angle
    // (the same for hands holding a barbell: arms the lesson keeps straight stay straight)
    var wBlade = Math.max(H.w, bar === 'hands' ? 1 : 0);
    if (sb && wBlade > 0) {
      var gapA = Math.min(0.02, Math.min(H.rel.length(), d.upper + d.fore - 0.0002) - S.distanceTo(T)) * wBlade;
      if (gapA > 0.0003) {
        var P = wpos(sb), a0 = S.clone().sub(P), a1 = S.clone().addScaledVector(S.clone().sub(T).normalize(), gapA).sub(P);
        setWQ(sb, new THREE.Quaternion().setFromUnitVectors(a0.normalize(), a1.normalize()).multiply(wquat(sb)));
        S = wpos(B[H.X + 'Arm']);                        // the hand stays on its spot
      }
    }
    var fdn = n['h' + H.k].clone().sub(n['e' + H.k]).normalize().y;
    var hf = d.wristH + Math.max(0, H.adj) + Math.min(0, H.adj) * H.w + (0.03 + 0.1 * Math.max(0, -fdn)) * (1 - H.w);   // a hand cannot go under the floor (a planted palm seen hovering may come down to it) (a fist hanging below the wrist needs more room than a flat palm)
    if (T.y < hf) T.y = hf;
    if (H.up) T.y += H.up;                                    // lifted clear of the floor by the final hand check
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
    if (hold && hold.w > 0 && hold.barGrip) {                // round the bar: the hand straight on from the forearm, palm facing hold.palm, so the
      // curled fingers wrap over the bar (the back of the hand faces the other way; palms face down in the T-pose: rest 'up' = back)
      // (the fingers cross the bar: the forearm's lean along the bar is taken up by the wrist)
      var fdir = hold.at.clone().sub(barWrist(hold)); if (hold.axis) fdir.addScaledVector(hold.axis, -fdir.dot(hold.axis)); fdir.normalize();
      setWQ(hand, wquat(hand).slerp(frameRot(tw(d.finger), UPV, fdir, hold.palm.clone().negate()).multiply(W0(H.X + 'Hand')), hold.w));
    }
    A.fist[H.X].forEach(function (p) { p[0].quaternion.copy(p[2]).multiply(IDQ.clone().slerp(p[1], 1 - H.w)); });
    if (H.w > 0) A.open[H.X].forEach(function (p) { p[0].quaternion.multiply(IDQ.clone().slerp(p[1], H.w)); });
    hand.updateMatrixWorld(true);
    H.elbow = ud.angleTo(fd); H.short = r.short; H.T = T;
    info.hands[H.k] = H;
  }

  var barShift = 0;                                        // a barbell on the floor moved forward over the model's mid-foot
  var kneeDrop = 0;                                        // how much deeper than the lesson the body went for a low knee
  var barPush = 0;                                         // how far the bar was moved forward to clear the model's legs
  var C = core(n), hands = SIDES.map(function (s) { return planHand(s, n, C); });
  var feet = SIDES.map(function (s) {
    var f = planFoot(s, n), pn = pins && pins[s.k];
    if (pn && pn.free) { f.w *= 1 - pn.free; f.touch *= 1 - pn.free; }             // mid-step
    return f;
  });
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
  // standing on one leg: the body's weight moves sideways over that foot, as a person's hips do; the foot itself stays put.
  // (each foot starts under its own hip joint, so without this the weight would hang 11 cm to the side of a single standing foot)
  if (rest < 0.5 && Math.max(wH[0], wH[1]) < 0.5) {
    var sway = v3(0, 0, 0);
    SIDES.forEach(function (s, i) {
      var o = SIDES[1 - i], up = smooth(0.03, 0.16, Math.max(0, Math.min(n0['a' + o.k].y, n0['t' + o.k].y)));   // how far the other foot is off the floor
      sway.addScaledVector(i === 0 ? RT : LF, 0.08 * wF[i] * (1 - wF[1 - i]) * up * (1 - rest * 2));
    });
    if (sway.lengthSq() > 1e-8) {
      var st = wF[0] >= wF[1] ? SIDES[0].k : SIDES[1].k, n4 = {};
      Object.keys(n).forEach(function (k) { n4[k] = (k === 'a' + st || k === 't' + st) ? n[k] : n[k].clone().add(sway); });
      n = n4; info.sway = sway.length(); replan();
    }
  }
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
  // (lying on a bench the bar comes down to the chest, not to the floor: never rested on the floor there)
  var wb = bar === 'hands' && !(move && move.kit === 'bench') ? 1 - smooth(PLATE_R + 0.02, PLATE_R + 0.2, Math.min(n0.hN.y, n0.hF.y)) : 0;
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
    hands.forEach(function (H) { pen = Math.min(pen, lows[H.region + 4]); });   // arms never carry the resting body (a sunk hand is lifted on its own, below)
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
        if (e < -0.002) { f.adj -= e; again = true; } else if (e > 0.003 && (it === 0 || f.w > 0.98)) { f.adj -= e * smooth(0.8, 0.98, f.w); again = again || f.w > 0.8; }   // (never cancel the other foot's correction)
      });
      hands.forEach(function (H) {
        var e = Math.min(lows[H.region], lows[H.region + 2]), ea = Math.min(e, lows[H.region + 4]);   // the forearm lying on the floor counts too
        if (H.w < 0.5) { if (e < -0.002) { H.adj -= e * step; again = true; } return; }   // a hand on its way down (or just passing) can never go under the floor either
        if (ea < -0.002) { H.adj -= ea * step / Math.max(0.5, H.w); again = true; } else if (e > 0.003 && H.fore < 0.5 && (it === 0 || H.w > 0.98)) { H.adj -= e * step * smooth(0.8, 0.98, H.w); again = again || H.w > 0.8; }
      });
    }
    if (Math.abs(dl) < 0.0015 && !again) break;
    if (Math.abs(dl) >= 0.0015) lift += dl;
    if (low < 0) liftMin = Math.max(liftMin, lift);
  }
  // last word on hands: whatever happened above, no hand finishes under the floor (only that arm moves, never the body)
  for (var hk = 0; hk < 3; hk++) {
    var lw = A.skin.lows(), fixedHand = false;
    hands.forEach(function (H) {
      var e = Math.min(lw[H.region], lw[H.region + 2]);
      if (e < -0.002) { H.up = (H.up || 0) - e * 1.05; solveArm(H, n, C, wb); fixedHand = true; }
    });
    if (!fixedHand) break;
  }
  // a barbell in the hands can touch the legs but not pass through them: find the front of the legs (and belly)
  // at the bar's height and move the hands forward until the bar sits just in front of it
  if (bar === 'hands') {
    var sk = A.full, vv = AV.v1;                             // every vertex: a kneecap is small
    for (var bp = 0; bp < 4; bp++) {
      var gr = SIDES.map(function (s) { var w = wpos(B[s.X + 'Hand']); return w.add(wpos(B[s.X + 'HandMiddle1']).sub(w).multiplyScalar(0.62)); });
      var bc = gr[0].add(gr[1]).multiplyScalar(0.5), front = -1e9;
      sk.refresh();
      for (var j = 0; j < sk.count; j++) {
        var rg = sk.region[j];
        if (rg !== 0 && rg !== 9 && rg !== 10) continue;
        sk.at(j, vv);
        if (Math.abs(vv.y - bc.y) < 0.02) front = Math.max(front, vv.dot(FW));
      }
      var need = Math.max(-barPush, front + BAR_R + 0.002 - bc.dot(FW));   // (may also come back if an earlier step went too far)
      if (Math.abs(need) < 0.002) break;
      barPush += need;
      hands.forEach(function (H) { solveArm(H, n, C, wb); });
    }
  }
  info.barPush = barPush;
  info.kneeDrop = kneeDrop; info.rest = rest; info.g = g; info.wb = wb; info.C = C; info.n = n;
  return info;
}
function redJacket(mat, geo) {
  var tex = mat.map, img = tex && tex.image;
  if (!img || !img.width) { mat.color.setRGB(0.85, 0.35, 0.35); return; }
  var cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
  var cx = cv.getContext('2d'); cx.drawImage(img, 0, 0);
  var d = cx.getImageData(0, 0, cv.width, cv.height), p = d.data;
  // only the upper body (the jacket): the parts of the picture used by triangles below the hips of the model as built (trousers,
  // shoes) are kept, a few pixels wider so their edges stay clean; everything else may turn red (so the jacket has no pale seams)
  var M = null, pos = geo && geo.attributes.position, uv = geo && geo.attributes.uv;
  if (pos && uv) {
    var mk = document.createElement('canvas'); mk.width = cv.width; mk.height = cv.height;
    var mx2 = mk.getContext('2d'); mx2.fillStyle = mx2.strokeStyle = '#fff'; mx2.lineWidth = 6;
    geo.computeBoundingBox();
    var y0 = geo.boundingBox.min.y, cut = y0 + 0.49 * (geo.boundingBox.max.y - y0), idx = geo.index, nT = (idx ? idx.count : pos.count) / 3;
    var U = function (v) { return [uv.getX(v) * cv.width, (tex.flipY ? 1 - uv.getY(v) : uv.getY(v)) * cv.height]; };
    for (var f = 0; f < nT; f++) {
      var a = idx ? idx.getX(3 * f) : 3 * f, b2 = idx ? idx.getX(3 * f + 1) : 3 * f + 1, c2 = idx ? idx.getX(3 * f + 2) : 3 * f + 2;
      if ((pos.getY(a) + pos.getY(b2) + pos.getY(c2)) / 3 >= cut) continue;
      var A = U(a), B = U(b2), Cc = U(c2);
      mx2.beginPath(); mx2.moveTo(A[0], A[1]); mx2.lineTo(B[0], B[1]); mx2.lineTo(Cc[0], Cc[1]); mx2.closePath(); mx2.fill(); mx2.stroke();
    }
    M = mx2.getImageData(0, 0, cv.width, cv.height).data;
  }
  for (var i = 0; i < p.length; i += 4) {
    if (M && M[i] >= 128) continue;                              // trousers and shoes stay
    var r = p[i], gg = p[i + 1], b = p[i + 2], mx = Math.max(r, gg, b), mn = Math.min(r, gg, b), l = (r + gg + b) / 765;
    var sat = mx ? (mx - mn) / mx : 0;
    if (l < 0.42 || sat > 0.22) continue;                      // dark cloth, skin and hair stay
    var w = Math.min(1, (l - 0.42) / 0.12) * Math.min(1, (0.22 - sat) / 0.08), s = l * 1.05;
    p[i] = r + (Math.min(255, 255 * s * 0.95) - r) * w; p[i + 1] = gg + (255 * s * 0.18 - gg) * w; p[i + 2] = b + (255 * s * 0.16 - b) * w;
  }
  cx.putImageData(d, 0, 0);
  var t2 = new THREE.CanvasTexture(cv);
  t2.flipY = tex.flipY; t2.colorSpace = tex.colorSpace; t2.wrapS = tex.wrapS; t2.wrapT = tex.wrapT; t2.channel = tex.channel;
  mat.map = t2; mat.needsUpdate = true;
}
function loadAvatar(key, done) {
  if (AVS[key]) { if (done) done(); return; }
  if (avLoading[key]) { if (done) avLoading[key].push(done); return; }
  avLoading[key] = done ? [done] : [];
  new GLTFLoader().load(MODELS[key], function (g) {
    // the partner is a second copy of the instructor in a red jacket: the light, colourless parts of the picture wrapped round the
    // model (the jacket) are turned red with their shading kept; skin (warm colours), dark trousers and the shoes stay as they are
    if (key === 'partner') g.scene.traverse(function (o) { if (o.isMesh && o.material) { o.material = o.material.clone(); redJacket(o.material, o.geometry); } });
    var a = setupAvatar(g.scene);
    if (!a) return;
    AVS[key] = a; a.rig.visible = false;
    if (key === 'instructor') { barbell.scale.setScalar(1.155); PLATE_R = 0.225 * 1.155; }   // the barbell at the instructor's size
    if (avKey === key) useModel(key, true);
    if (key === 'partner' && clip) draw();
    avLoading[key].forEach(function (f) { f(); }); avLoading[key] = null;
  }, undefined, function (e) { console.error('3D model could not be loaded:', key, e && (e.stack || e.message || e)); });
}
// show the model a move uses (loading it the first time); the simple figure stands in while it loads
function useModel(key, force) {
  key = key || 'instructor';
  if (avKey === key && !force) return;
  avKey = key;
  Object.keys(AVS).forEach(function (k) { AVS[k].rig.visible = k === key; });
  avatar = AVS[key] || null; body.visible = !avatar;
  if (!avatar) { loadAvatar(key); return; }
  if (clip && force) { planGait(); draw(); }               // (the step plan needs the model to know where its feet land)
}
(function startModels() {
  // the self-check needs every model in memory before it starts
  if (/[?&]check\b/.test(location.search)) {
    loadAvatar('instructor', function () { loadAvatar('golfer', function () { loadAvatar('partner', function () { useModel(cur && cur.model, true); import('./lab3d-check.js').then(function (m) { m.run(CHECK_API); }); }); }); });
  } else loadAvatar(cur && cur.model === 'golfer' ? 'golfer' : 'instructor');
})();

/* ---------- the partner (two-person lessons) ----------
 * The 2D lessons draw the partner with kt-partner.js from the pose keys ox (hip x), ot / oh (lean), oa1 / oa2 and ob1 / ob2
 * (near and far arm), ola / olb (near leg), ol / olf (far leg) and olift: the same stick figure, solved and then turned
 * round to face you. Here the same joints are turned into 3D and a second model is posed on them. Facing you, the limbs the
 * lesson draws nearest the viewer are the partner's left ones. The partner moves with you when your steps move the body.
 */
var PARTNER_MOVE = { mode: 'side' }, PARTNER_AIR = { mode: 'side', air: 1 };
function partnerJoints(t, q, raw) {
  var p = sideP.poseAt(t).pose;
  var pq = { x: p.ox + (cur.odx || 0), t: p.ot || 0, h: p.oh || 0, su: p.oa1, sl: p.oa2, fu: p.ob1, fl: p.ob2, tu: p.ola, tl: p.olb, bu: -(p.ol || 0),
    bl: typeof p.olf === 'number' ? -p.olf : -(p.ol || 0) * 0.6, lift: p.olift || 0 };
  var O = KTFigure.solve(pq, OPT), X = O.hip.x, sd = sidesNow(), sh = q.shift || { x: 0, z: 0 }, n = {};
  // `odx` (3D only, per move): the partner that many lesson units nearer (−) or further — bodies with thickness stand further
  // apart at the same hip distance than the drawn lines do, so a chest-to-chest clinch needs them closer.
  // `oz` (3D only): the partner stands or lies that many lesson units to the side (+ = towards the viewer of the 2D lesson) —
  // a flat drawing cannot show that you sit beside them, or that your foot steps outside theirs
  var oz = (typeof p.oz === 'number' ? p.oz : cur.oz || 0) * K * (sd.legs ? -1 : 1);
  JOINTS.forEach(function (k) {
    var j = O[k], z = DEPTH[k] || 0, name = k;
    // facing you, the limbs drawn nearest the viewer are the partner's left ones; shown mirrored (with you), they are its right
    // ones on the far side
    var mir = (sd.legs && /^(hip|k|a|t)[NF]$/.test(k)) || (sd.arms && /^(sh|e|h)[NF]$/.test(k));
    if (mir) z = -z;
    else if (/^(hip|k|a|t|sh|e|h)[NF]$/.test(k)) name = k.slice(0, -1) + (k.slice(-1) === 'N' ? 'F' : 'N');
    n[name] = new THREE.Vector3((2 * X - j.x - x0) * K + sh.x, (FLOOR - j.y) * K, z + sh.z + oz);
  });
  // `oyaw` (3D only, per move): the partner turned that many degrees about the shoulder `opivot`, all but the arm `okeep` (which
  // stays as drawn) — the armlock has them lying across you, their arm along your body; a side view can only draw them in line
  // `ospread` (3D only, move or per frame): the partner's knees and feet that many lesson units out to each side — kneeling
  // astride you (the mount) a flat drawing has their knees inside your body
  var spr = (typeof p.ospread === 'number' ? p.ospread : cur.ospread || 0) * K;
  if (spr) ['N', 'F'].forEach(function (f) {
    var out = Math.sign(n['hip' + f].z - n.hip.z) || (f === 'N' ? 1 : -1);
    n['k' + f].z += out * spr; n['a' + f].z += out * spr * 0.9; n['t' + f].z += out * spr * 0.9;
  });
  // `oroll` (3D only, per frame): the partner rolled that many degrees about the line of their own trunk — falling over
  // sideways (the mount escape rolls them over onto their back). A side view can only show it as a dive over your head.
  var roll = typeof p.oroll === 'number' ? p.oroll * DEG : 0;
  if (Math.abs(roll) > 1e-4) {
    var ax = n.sh.clone().sub(n.hip).normalize(), pc = n.sh.clone().add(n.hip).multiplyScalar(0.5), low = 1e9;
    Object.keys(n).forEach(function (k) { n[k].sub(pc).applyAxisAngle(ax, roll).add(pc); });
    Object.keys(n).forEach(function (k) { if (k !== 'head') low = Math.min(low, n[k].y); });
    // turned over, their lowest point rests on the mat (plus any lift the lesson gives) — rolled sideways, legs and arms that
    // hung down now stick out at hip height, so without this the body would float; eased in over the first 30° of roll
    var want = 0.02 + Math.max(0, (p.olift || 0) * K), ease = Math.min(1, Math.abs(roll) / (30 * DEG));
    var dy = low < 0.02 ? 0.02 - low : (want - low) * ease;
    if (low + dy < 0.02) dy = 0.02 - low;
    Object.keys(n).forEach(function (k) { n[k].y += dy; });
  }
  if (cur.oyaw) {
    var pv = n[cur.opivot || 'shF'].clone(), yaw = cur.oyaw * DEG, keep = cur.okeep || [];
    Object.keys(n).forEach(function (k) { if (keep.indexOf(k) < 0) n[k].sub(pv).applyAxisAngle(UPV, yaw).add(pv); });
  }
  if (!raw) partnerSteps(t, n);
  return n;
}
// closest points of segments a→a+ab and b→b+bb: returns their distance and the two points
function segSeg(a, ab, b, bb) {
  var r = a.clone().sub(b), A2 = ab.dot(ab), E = bb.dot(bb), f = bb.dot(r), s = 0, t = 0;
  if (A2 < 1e-9 && E < 1e-9) { s = t = 0; }
  else if (A2 < 1e-9) t = Math.max(0, Math.min(1, f / E));
  else {
    var c = ab.dot(r);
    if (E < 1e-9) s = Math.max(0, Math.min(1, -c / A2));
    else {
      var bq = ab.dot(bb), den = A2 * E - bq * bq;
      s = den > 1e-9 ? Math.max(0, Math.min(1, (bq * f - c * E) / den)) : 0;
      t = (bq * s + f) / E;
      if (t < 0) { t = 0; s = Math.max(0, Math.min(1, -c / A2)); } else if (t > 1) { t = 1; s = Math.max(0, Math.min(1, (bq - c) / A2)); }
    }
  }
  var p = a.clone().addScaledVector(ab, s), q = b.clone().addScaledVector(bb, t);
  return { d: p.distanceTo(q), p: p, q: q };
}
// how much of a per-frame setting applies now: 1 on the key frames listed, fading in and out between them (like holds)
function framesW(list, r) {
  if (!list || !list.length) return 0;
  var nF = clip.frames.length, j = Math.min(nF - 1, r.seg), j2 = (j + 1) % nF;
  var w = (list.indexOf(j) >= 0 ? 1 - r.k : 0) + (list.indexOf(j2) >= 0 ? r.k : 0);
  return w * w * (3 - 2 * w);
}
/* On your back (3D only, per move: `onBack: [frames]`): the partner lifted on your hip lies with their front along your back —
 * hips on your hips, chest on your shoulder blades, head the same way as yours. The drawing only says "over the hip"; the
 * whole partner is turned and moved there (fading in and out like a hold), and carryApart then clears what still touches. */
function layOnBack(np, w) {
  if (w < 0.001) return;
  var B = avatar.B, hip = wpos(B.Hips), sp = wpos(B.Neck).sub(hip).normalize();
  var fw = avatar.fwd.clone().applyQuaternion(wquat(B.Hips).multiply(avatar.RQ.Hips.clone().invert()));
  var back = fw.addScaledVector(sp, -fw.dot(sp)).normalize().negate();
  var T = hip.clone().addScaledVector(back, 0.25).addScaledVector(sp, 0.08);
  var P = np.hip.clone(), R = new THREE.Quaternion().setFromUnitVectors(np.sh.clone().sub(P).normalize(), sp);
  R.slerp(new THREE.Quaternion(), 1 - w);
  var H = P.clone().lerp(T, w);
  Object.keys(np).forEach(function (k) { if (np[k] && np[k].isVector3) np[k].sub(P).applyQuaternion(R).add(H); });
}
/* Carried (3D only, per move: `carry: [frames]`): on those key frames the partner is off the floor, lying on your back or
 * rolling over your hip. The drawing's lines run through each other there (a flat figure has no thickness), so the whole
 * partner is moved out of your body — the shortest way out, a centimetre clear — and posed again, until nothing is inside. */
function carryApart(np, AP, theta, w, PM) {
  if (w < 0.001) return;
  var M = bodyCaps(avatar), orig = {}, wv = new THREE.Vector3();
  Object.keys(np).forEach(function (k) { if (np[k] && np[k].isVector3) orig[k] = np[k].clone(); });
  function shift(dv) { Object.keys(orig).forEach(function (k) { np[k].add(dv); }); }
  // 1. the body (chest, neck, head) clear of yours: the whole partner moves, the shortest way out
  for (var it = 0; it < 8; it++) {
    poseAvatar(np, theta, PM, null, AP);
    var best = null;
    bodyCaps(AP).forEach(function (c1, i1) {
      M.forEach(function (c2, i2) {
        if (i1 > 2 && i2 > 2) return;                          // (their legs count against your body, not against your legs)
        var sg = segSeg(c1.a, c1.ab, c2.a, c2.ab), need = c1.r + c2.r + 0.01;
        if (sg.d < need && (!best || need - sg.d > best.depth)) best = { depth: need - sg.d, dir: sg.d > 1e-4 ? sg.p.clone().sub(sg.q).divideScalar(sg.d) : UPV.clone() };
      });
    });
    if (!best || best.depth < 0.004) break;
    shift(best.dir.multiplyScalar(best.depth));
  }
  // 2. then each leg on its own: knee and foot moved out of your body (a hanging leg goes round yours, it does not lift them)
  function out(p, m) {
    var q = p.clone();
    for (var r = 0; r < 3; r++) M.forEach(function (C) {
      var L2 = C.ab.lengthSq(), t = L2 > 1e-9 ? Math.max(0, Math.min(1, wv.subVectors(q, C.a).dot(C.ab) / L2)) : 0;
      wv.copy(C.a).addScaledVector(C.ab, t);
      var d = q.distanceTo(wv), need = C.r + m;
      if (d < need && d > 1e-4) q.copy(wv).addScaledVector(q.clone().sub(wv).divideScalar(d), need);
    });
    return q.sub(p);
  }
  for (var round = 0; round < 4; round++) {
    var moved = false, B = AP.B;
    SIDES.forEach(function (sd) {
      var hp = wpos(B[sd.X + 'UpLeg']), kn = wpos(B[sd.X + 'Leg']), an = wpos(B[sd.X + 'Foot']);
      var dk = out(kn, 0.075), dt = out(hp.clone().lerp(kn, 0.6), 0.085), da = out(an, 0.06), ds = out(kn.clone().lerp(an, 0.5), 0.06);
      var mk = dk.lengthSq() > dt.lengthSq() ? dk : dt, ma = da.lengthSq() > ds.lengthSq() ? da : ds;
      if (mk.lengthSq() > 1e-5) { np['k' + sd.k].addScaledVector(mk, 1.2); np['a' + sd.k].addScaledVector(mk, 1.2); np['t' + sd.k].addScaledVector(mk, 1.2); moved = true; }
      if (ma.lengthSq() > 1e-5) { np['a' + sd.k].addScaledVector(ma, 1.2); np['t' + sd.k].addScaledVector(ma, 1.2); moved = true; }
    });
    if (!moved) break;
    poseAvatar(np, theta, PM, null, AP);
  }
  // part-way in or out of a carry frame: that share of the change
  Object.keys(orig).forEach(function (k) { np[k].sub(orig[k]).multiplyScalar(w).add(orig[k]); });
}
/* The partner's feet: the lesson draws them relative to the partner's hips, so a partner pulled forward or pushed back has
 * feet that glide. Between two key frames a foot that is down at both ends either stays on its spot (the lesson moves it
 * less than 3 cm) or really steps: it lifts, travels and sets down where the next key frame has it. When both feet must
 * step, the one with further to go steps first. A partner lying or sitting (hips low) is left as drawn. */
var PGAIT = null;
function partnerPlan() {
  if (PGAIT && PGAIT.src === GAIT && PGAIT.move === cur && PGAIT.flip === !!state.flip) return PGAIT;
  var fr = sideP.frames, T = [], acc = 0;
  fr.forEach(function (f) { T.push(acc); acc += f.d; });
  var spots = T.map(function (t) { var n = partnerJoints(t, lessonJoints(t), true); return { N: footSpot(n, 'N'), F: footSpot(n, 'F'), low: n.hip.y < 0.6 }; });
  var nF = T.length, seg = T.map(function (t, j) {
    var A = spots[j], B = spots[(j + 1) % nF], o = {}, dist = {};
    ['N', 'F'].forEach(function (f) {
      var a = A[f], b = B[f]; dist[f] = Math.hypot(a.x - b.x, a.z - b.z);
      o[f] = A.low || B.low ? 'free' : a.g < 0.5 && b.g < 0.5 ? 'free' : a.g < 0.5 ? 'land' : b.g < 0.5 ? 'lift' : dist[f] < 0.03 ? 'hold' : 'step';
    });
    if (o.N === 'step' && o.F === 'step') { var nf = dist.N >= dist.F; o.N = nf ? 'first' : 'second'; o.F = nf ? 'second' : 'first'; }
    return o;
  });
  PGAIT = { src: GAIT, move: cur, flip: !!state.flip, T: T, spots: spots, seg: seg, total: acc };
  return PGAIT;
}
function partnerSteps(t, n) {
  var G = partnerPlan(), nF = G.T.length, tt = ((t % G.total) + G.total) % G.total, j = 0;
  while (j < nF - 1 && G.T[j + 1] <= tt) j++;
  var k = (tt - G.T[j]) / ((j < nF - 1 ? G.T[j + 1] : G.total) - G.T[j]);
  n.restart = j === nF - 1 && (G.spots[j].low || G.spots[0].low);   // the loop's jump from lying back to standing
  ['N', 'F'].forEach(function (f) {
    var mode = G.seg[j][f];
    if (mode === 'free') return;
    var A = G.spots[j][f], B = G.spots[(j + 1) % nF][f], now = footSpot(n, f), go = 0, lift = 0;
    if (mode === 'lift' || mode === 'land') {                // leaving the floor from its spot / setting down on the next one
      var S2 = mode === 'lift' ? A : B, wg = now.g;
      ['a', 't'].forEach(function (p2) { var v = n[p2 + f]; v.x += (S2.x - now.x) * wg; v.z += (S2.z - now.z) * wg; });
      n['k' + f].x += (S2.x - now.x) * wg * 0.5; n['k' + f].z += (S2.z - now.z) * wg * 0.5;
      return;
    }
    if (mode !== 'hold') {
      var u = mode === 'first' ? k / 0.5 : mode === 'second' ? (k - 0.5) / 0.5 : k;
      u = Math.max(0, Math.min(1, u)); go = smooth(0.3, 0.85, u);                // (across the floor only once the foot is up)
      lift = Math.max(0.06, Math.min(0.1, 0.3 * Math.hypot(B.x - A.x, B.z - A.z))) * Math.sin(Math.PI * u);
    }
    var dx = A.x + (B.x - A.x) * go - now.x, dz = A.z + (B.z - A.z) * go - now.z;
    ['a', 't'].forEach(function (p2) { var v = n[p2 + f]; v.x += dx; v.z += dz; v.y += lift; });
    var kn = n['k' + f]; kn.x += dx * 0.5; kn.z += dz * 0.5; kn.y += lift * 0.5;
  });
}
function drawPartner(time, q) {
  var AP = AVS.partner;
  if (avatar) avatar.hold = null;
  if (!cur || !cur.duo || cur.mode === 'front') { if (AP) AP.rig.visible = false; return null; }
  if (!AP) { loadAvatar('partner'); return null; }
  AP.rig.visible = true;
  var np = partnerJoints(time, q);
  AP.hold = holdsNow('partner', avatar, q.r, AP);
  var restart = np.restart; delete np.restart;
  var pth = Math.PI + (cur.oyaw || 0) * DEG, cw = framesW(cur.carry, q.r), PM = cw > 0.01 ? PARTNER_AIR : PARTNER_MOVE;
  layOnBack(np, framesW(cur.onBack, q.r));
  carryApart(np, AP, pth, cw, PM);
  var pinfo = armsOutside(np, pth, PM, null, AP, bodyCaps(avatar));   // the partner's hands stop on your body (a grip)
  pinfo = fixGrips(AP, np, pth, PM, null) || pinfo;
  if (pinfo) { pinfo.restart = restart; pinfo.carried = cw > 0.01; }
  avatar.hold = holdsNow('me', AP, q.r, avatar);
  var mine = armsOutside(q.n, q.r.theta, cur, q.pins, avatar, bodyCaps(AP), !avatar.hold);   // …and yours on theirs
  mine = fixGrips(avatar, q.n, q.r.theta, cur, q.pins) || mine;
  if (mine) q.info = mine;
  return pinfo;
}
// Poses X on lesson joints n, then measures where its hands and elbows really are: any that ended inside the other body's
// capsules have their lesson joint moved by the same amount outwards and the body is posed again (up to 3 rounds).
// (The model's arms are not the lesson's length, so the lesson's hand point alone cannot be trusted.)
function armsOutside(n, theta, move, pins, X, caps, posed) {
  var info = posed ? null : poseAvatar(n, theta, move, pins, X), w = new THREE.Vector3();
  function push(p, m) {                                      // how far p must move to be m clear of every capsule
    var out = new THREE.Vector3(), q = p.clone();
    for (var it = 0; it < 3; it++) caps.forEach(function (C) {
      var L2 = C.ab.lengthSq(), t = L2 > 1e-9 ? Math.max(0, Math.min(1, w.subVectors(q, C.a).dot(C.ab) / L2)) : 0;
      w.copy(C.a).addScaledVector(C.ab, t);
      var d = q.distanceTo(w), need = C.r + m;
      if (d >= need || d < 1e-4) return;
      q.copy(w).addScaledVector(q.clone().sub(w).divideScalar(d), need);
    });
    return out.subVectors(q, p);
  }
  for (var round = 0; round < 3; round++) {
    var moved = false;
    SIDES.forEach(function (s) {
      var B = X.B, wr = wpos(B[s.X + 'Hand']), kn = wr.clone().lerp(wpos(B[s.X + 'HandMiddle1']), 1.6), el = wpos(B[s.X + 'ForeArm']), mid = el.clone().lerp(wr, 0.5);
      var dh = push(kn, 0.02), dw = push(wr, 0.035), de = push(el, 0.045), dm = push(mid, 0.04);
      var hand = dh.lengthSq() > dw.lengthSq() ? dh : dw, elb = de.lengthSq() > dm.lengthSq() ? de : dm;
      if (X.hold && X.hold[s.k] && X.hold[s.k].w > 0.5) return;   // a holding hand is where the hold puts it
      if (hand.lengthSq() > 1e-6) { n['h' + s.k].addScaledVector(hand, 1.1); moved = true; }
      if (elb.lengthSq() > 1e-6) { n['e' + s.k].addScaledVector(elb, 2); if (dm.lengthSq() > 1e-6) n['h' + s.k].addScaledVector(dm, 1); moved = true; }
    });
    if (!moved && info) break;
    if (!moved && !info) return null;
    info = poseAvatar(n, theta, move, pins, X);
  }
  return info;
}
/* Holds (3D only, per move in MOVES): a hand fixed to a spot on the other person's body for the key frames listed —
 *   { by: 'me' | 'partner', hand: 'N' | 'F', bone: 'Neck', at: [forward, up, right] metres in that body's own frame, on: [frame, …] }
 * (N / F are the holder's right / left hand.) Between two key frames the hold fades in or out. */
function holdsNow(by, X, r, holder) {
  var hs = (cur.holds || []).filter(function (h) { return h.by === by; }), out = null;
  if (!hs.length || !X) return null;
  var nF = clip.frames.length, j = Math.min(nF - 1, r.seg), j2 = (j + 1) % nF;
  hs.forEach(function (h) {
    var w = (h.on.indexOf(j) >= 0 ? 1 - r.k : 0) + (h.on.indexOf(j2) >= 0 ? r.k : 0);
    w = w * w * (3 - 2 * w);
    if (w < 0.001) return;
    var b = X.B[h.bone], turn = wquat(b).multiply(X.RQ[h.bone].clone().invert());
    var o = X.fwd.clone().multiplyScalar(h.at[0]).addScaledVector(UPV, h.at[1]).addScaledVector(X.right, h.at[2]).applyQuaternion(turn);
    var hand = h.hand === 'N' ? 'N' : 'F', at = wpos(b).add(o);
    // a grip the arm cannot reach (the partner thrown a metre away, falling out of a leg grab) is let go: it fades out past
    // the arm's full stretch, and the hand keeps its drawn place instead of stretching into the air
    if (holder && !h.reach) {                               // (reach: 1 — always reached for, e.g. settling into a hold)
      var X2 = hand === 'N' ? 'Right' : 'Left', d = holder.D[X2], reach = d.upper + d.fore + d.grip + 0.04;
      w *= 1 - smooth(reach, reach + 0.15, wpos(holder.B[X2 + 'Arm']).distanceTo(at));
      if (w < 0.001) return;
    }
    out = out || {};
    if (out[hand]) {                                        // one hand moving from one grip to the next: the spot blends across
      var o0 = out[hand], wt = o0.w + w; o0.at.multiplyScalar(o0.w / wt).addScaledVector(at, w / wt); o0.w = Math.min(1, wt);
      if (h.bend) o0.bend = v3(h.bend[0], h.bend[1], h.bend[2]);
    } else out[hand] = { at: at, w: w, bend: h.bend ? v3(h.bend[0], h.bend[1], h.bend[2]) : null, reach: h.reach };
  });
  return out;
}
// A gripping hand aims its wrist along the arm, but the wrist bends, so the palm lands a few centimetres off the spot: where
// each gripping palm really is gets measured and its aim corrected by the miss, a few rounds (returns the last pose's info)
function palmOf(X, side) { var w = wpos(X.B[side + 'Hand']); return w.add(wpos(X.B[side + 'HandMiddle1']).sub(w).multiplyScalar(0.62)); }
function fixGrips(X, n, theta, move, pins) {
  if (!X || !X.hold) return null;
  var want = {}, info = null, any = false;
  ['N', 'F'].forEach(function (k) { if (X.hold[k] && X.hold[k].w > 0.5 && !X.hold[k].barGrip && !X.hold[k].reach) { want[k] = X.hold[k].at.clone(); any = true; } });
  if (!any) return null;
  for (var it = 0; it < 3; it++) {
    var worst = 0;
    Object.keys(want).forEach(function (k) {
      var miss = want[k].clone().sub(palmOf(X, k === 'N' ? 'Right' : 'Left')).multiplyScalar(X.hold[k].w);
      worst = Math.max(worst, miss.length()); X.hold[k].at.add(miss);
    });
    if (worst < 0.015) break;
    info = poseAvatar(n, theta, move, pins, X);
  }
  Object.keys(want).forEach(function (k) { X.hold[k].at.copy(want[k]); });   // (the spot itself, for anyone reading it later)
  return info;
}
// a body as capsules (bone to bone, radius in metres): what another body's hands must stay outside of
var CAPS = [['Hips', 'Neck', 0.12, 0, 0.86], ['Neck', 'Head', 0.055], ['Head', 'Head', 0.1, 0.09], ['RightUpLeg', 'RightLeg', 0.075], ['LeftUpLeg', 'LeftLeg', 0.075], ['RightLeg', 'RightFoot', 0.052], ['LeftLeg', 'LeftFoot', 0.052]];
function bodyCaps(X) {
  return CAPS.map(function (c) {
    var a = wpos(X.B[c[0]]), b = wpos(X.B[c[1]]);
    if (c[3]) { a.addScaledVector(wpos(X.B.Head).sub(wpos(X.B.Neck)).normalize(), c[3]); b = a.clone(); }
    if (c[4]) b.lerp(a, 1 - c[4]);                            // the chest ends below the base of the neck
    return { a: a, ab: b.sub(a), r: c[2] };
  });
}
// moves the hand targets of lesson joints n out of the capsules (to the surface, plus a hand's thickness); true if any moved
function pushOut(n, caps) {
  var moved = false, w = new THREE.Vector3();
  ['hN', 'hF'].forEach(function (k) {
    var p = n[k];
    for (var it = 0; it < 3; it++) {
      var any = false;
      caps.forEach(function (C) {
        var L2 = C.ab.lengthSq(), t = L2 > 1e-9 ? Math.max(0, Math.min(1, w.subVectors(p, C.a).dot(C.ab) / L2)) : 0;
        w.copy(C.a).addScaledVector(C.ab, t);
        var d = p.distanceTo(w), need = C.r + 0.035;
        if (d >= need) return;
        var dir = d > 1e-4 ? p.clone().sub(w).divideScalar(d) : n['sh' + k.charAt(1)].clone().sub(w).normalize();
        p.copy(w).addScaledVector(dir, need); any = moved = true;
      });
      if (!any) break;
    }
  });
  return moved;
}
var TIME_NOW = 0;
function drawBody(time) {
  TIME_NOW = time;
  var q = lessonJoints(time), r = q.r, J = r.J, V = r.V, n = q.n;
  faceQ.setFromAxisAngle(UPV, r.theta);
  if (avatar) {
    drawBar(r, J, V, poseOrHang(n, r.theta, q));
    drawPartner(time, q);
    drawStick(r); drawClub(r); drawKit(r, TIME_NOW);
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
      // through each hand's finger crease (the base of the fingers, a little towards the wrist): the curled fingers wrap round it —
      // through the middle of the palm the fists sat on top of the bar
      var gr = SIDES.map(function (s) { return barCrease(B, s.X); });
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

// the club's direction from the lesson (ca: its angle; leaning forward to the ball as it points down; turned with the body)
function clubDir(r) {
  var a = (r.pose.ca || 0) * Math.PI / 180, GS = GOLFREF && GOLFREF.side, fwd = GS ? Math.max(0, (GS.hN.y < 0 ? 0 : 1)) : 1;
  var dir = new THREE.Vector3(0.55 * Math.max(0, Math.cos(a)) * fwd, -Math.cos(a), Math.sin(a)).normalize();
  if (r.gTurn) { var cg = Math.cos(r.gTurn), sg = Math.sin(r.gTurn), dx1 = dir.x * cg - dir.z * sg; dir.z = dir.x * sg + dir.z * cg; dir.x = dx1; }
  return dir;
}
// the stick follows the right fist; its angle comes from the lesson (sk: 0 = pointing down, 90 = forward, 180 = up)
// the club: from the grip (between the two hands) along the lesson's club angle, leaning forward to the ball as it points down
function drawClub(r) {
  club.visible = golfBall.visible = !!(cur && cur.golf && avatar);
  if (!club.visible) return;
  var B = avatar.B, gr = SIDES.map(function (s) { var w = wpos(B[s.X + 'Hand']); return w.add(wpos(B[s.X + 'HandMiddle1']).sub(w).multiplyScalar(0.62)); });
  var g = gr[0].clone().add(gr[1]).multiplyScalar(0.5), L = Math.max(0.3, (r.pose.cl || 80) * K * 1.12);
  var dir = clubDir(r);
  // never into the floor: the head rests on it
  if (g.y + dir.y * L < 0.03) { var need = (0.03 - g.y) / L; dir.y = need; var hz = Math.hypot(dir.x, dir.z) || 1, k2 = Math.sqrt(Math.max(0, 1 - need * need)) / hz; dir.x *= k2; dir.z *= k2; }
  club.position.copy(g); club.quaternion.setFromUnitVectors(UPV, dir);
  clubShaft.scale.set(1, L, 1); clubShaft.position.set(0, L / 2, 0); clubGrip.position.set(0, 0.06, 0);
  clubHead.position.set(0.025, L, 0);
  var addr = cur && GOLFREF, bx = 0.62, bz = 0;
  if (addr) { var GSd = GOLFREF.side, GFd = GOLFREF.front; bx = (GSd.hip.x + 97 - GSd.hip.x) * K * 0.72; bz = 0.02; }
  golfBall.position.set(bx, 0.0214, bz);
  golfBall.visible = golfBall.visible && !(r.pose.bt > 0.05 && r.pose.bv > 0.5) && !(r.pose.bt > 0.5);
}
function drawStick(r) {
  stick.visible = !!(cur.stick && avatar && (r.pose.sv === undefined || r.pose.sv > 0.5));
  if (!stick.visible) return;
  var B = avatar.B, X = sidesNow().arms ? 'Left' : 'Right', w = wpos(B[X + 'Hand']), a = (r.pose.sk || 0) * Math.PI / 180;
  stick.position.copy(w.add(wpos(B[X + 'HandMiddle1']).sub(w).multiplyScalar(0.62)));
  // skz: the stick also leans sideways by that many degrees (+ = towards the body's other side), e.g. over the opposite shoulder
  var zt = (r.pose.skz || 0) * Math.PI / 180 * (sidesNow().arms ? 1 : -1);
  var dir = new THREE.Vector3(Math.sin(a) * Math.cos(zt), -Math.cos(a) * Math.cos(zt), Math.sin(zt)).applyAxisAngle(UPV, r.theta);
  stick.quaternion.setFromUnitVectors(UPV, dir.normalize());
}

/* ---------- golf: both hands on the grip ----------
 * The two hands of a golf grip touch: their palms sit about 8.5 cm apart along the handle. The drawing places each hand on
 * its own, which let them drift up to 31 cm apart (top of the swing, finish). The hand higher up the club keeps the lesson's
 * place; the other is held just below it on the handle, in line with the club. */
function poseGolf(n, theta, q) {
  var A = avatar, info = poseAvatar(n, theta, cur, q.pins), dir = clubDir(q.r);
  // the hand whose arm has more slack (more bent) goes to the other one — just above it on the handle if it is the lead
  // hand, just below if it is the trail hand; the straighter arm keeps the lesson's place (it cannot reach any further)
  for (var it = 0; it < 2; it++) {
    var gN = gripPoint('Right'), gF = gripPoint('Left');
    if (gN.distanceTo(gF) < 0.095) break;
    var leadIsN = gN.dot(dir) < gF.dot(dir);
    var slackN = (A.D.Right.upper + A.D.Right.fore) - wpos(A.B.RightArm).distanceTo(wpos(A.B.RightHand));
    var slackF = (A.D.Left.upper + A.D.Left.fore) - wpos(A.B.LeftArm).distanceTo(wpos(A.B.LeftHand));
    var mover = slackN >= slackF ? 'N' : 'F', other = mover === 'N' ? gF : gN, moverIsLead = (mover === 'N') === leadIsN;
    var want = other.clone().addScaledVector(dir, moverIsLead ? -0.085 : 0.085), mx = mover === 'N' ? 'Right' : 'Left';
    A.hold = {}; A.hold[mover] = { at: want.clone(), w: 1 };
    // the hold aims the wrist along the arm, but a golf grip bends the wrist: where the palm really lands is measured and the
    // aim corrected by the miss, a few rounds
    for (var k = 0; k < 4; k++) {
      info = poseAvatar(n, theta, cur, q.pins);
      var miss = want.clone().sub(gripPoint(mx));
      if (miss.length() < 0.008) break;
      A.hold[mover].at.add(miss);
    }
  }
  A.hold = null;
  return info;
}

/* ---------- the pull-up: hands on the bar, the body hanging from them ----------
 * Both palms are fixed on the bar a little wider than the shoulders (a hold on a fixed spot); the model's arms are not the
 * drawing's length, so where a hand cannot reach the bar the whole body is raised until it can — it hangs from its hands. */
// (2.25 m, a usual bar height: the model's arms are longer than the drawing's, and at 2.0 m its feet reached the floor in the dead hang)
function pullBar() { return { x: (205 - x0) * K, y: 2.25, z: 0.27 }; }
// the sandbag across the upper back (lunges): its centre, from the posed body
function bagCentre(A) {
  var B = A.B, bk = wpos(B.Neck).lerp(wpos(B.Spine2), 0.35);
  var fwd2 = A.fwd.clone().applyQuaternion(wquat(B.Spine2).multiply(A.RQ.Spine2.clone().invert()));
  return bk.addScaledVector(fwd2, -0.1);
}
function poseOrHang(n, theta, q) {
  if (cur && cur.kit === 'lunge' && avatar) {                // both hands on top of the sandbag, near its ends
    var A0 = avatar; A0.hold = null; poseAvatar(n, theta, cur, q.pins);
    var c = bagCentre(A0), side = A0.right.clone().applyQuaternion(wquat(A0.B.Spine2).multiply(A0.RQ.Spine2.clone().invert())).normalize();
    // each fist on the bag's top edge, near its end; where the palm really lands is measured and the aim corrected (the
    // wrist bends, so aiming along the arm alone left the fists hovering above the bag)
    var want = { N: c.clone().addScaledVector(side, 0.22).addScaledVector(UPV, 0.07), F: c.clone().addScaledVector(side, -0.22).addScaledVector(UPV, 0.07) };
    A0.hold = { N: { at: want.N.clone(), w: 1, bend: v3(0, -1, 0) }, F: { at: want.F.clone(), w: 1, bend: v3(0, -1, 0) } };
    var inf0;
    for (var k = 0; k < 5; k++) {
      inf0 = poseAvatar(n, theta, cur, q.pins);
      var worst = 0;
      [['N', 'Right'], ['F', 'Left']].forEach(function (h) { var miss = want[h[0]].clone().sub(gripPoint(h[1])); worst = Math.max(worst, miss.length()); A0.hold[h[0]].at.add(miss); });
      if (worst < 0.01) break;
    }
    A0.hold = null; return inf0;
  }
  if (cur && cur.golf && avatar) return poseGolf(n, theta, q);
  if (!cur || cur.kit !== 'pullbar' || !avatar) return poseAvatar(n, theta, cur, q.pins);
  var b = pullBar(), A = avatar, info;
  // elbows point down and out to the sides (a pull-up), palms on the bar
  // overhand grip: palms facing forward (away from you), thumbs inward, the bar in the finger crease
  var palm = v3(1, 0, 0), axis = v3(0, 0, 1);
  A.hold = { N: { at: v3(b.x, b.y, b.z), w: 1, bend: v3(0.15, -1, 0.55), barGrip: 1, palm: palm, axis: axis }, F: { at: v3(b.x, b.y, -b.z), w: 1, bend: v3(0.15, -1, -0.55), barGrip: 1, palm: palm, axis: axis } };
  // how bent the lesson's arms are: shoulder-to-hand distance against the drawn arm's length (1 = straight, a dead hang)
  var ratio = {};
  SIDES.forEach(function (sd) { ratio[sd.k] = Math.min(1, n['sh' + sd.k].distanceTo(n['h' + sd.k]) / ((KTFigure.DIM.upper + KTFigure.DIM.fore) * K)); });
  // pulling up, the body sits a little behind the bar (up to 11 cm, as the arms bend): the shoulders can then rise beside the
  // hands and the chin clears the bar — straight under it a fully bent arm would stop the shoulders below the wrists
  var bentAll = 1 - smooth(0.85, 0.98, (ratio.N + ratio.F) / 2);
  Object.keys(n).forEach(function (k) { n[k].x -= 0.11 * bentAll; });
  for (var it = 0; it < 8; it++) {
    info = poseAvatar(n, theta, cur, q.pins);
    var dy = 0, cnt = 0;
    SIDES.forEach(function (sd) {
      var d = A.D[sd.X], S = wpos(A.B[sd.X + 'Arm']), at = barWrist(A.hold[sd.k]);   // (measured to where the wrist goes)
      var want = ratio[sd.k] * (d.upper + d.fore - 0.004);                     // the same bend on the model's own arm
      var hz = Math.hypot(at.x - S.x, at.z - S.z), v = at.y - S.y, need = Math.sqrt(Math.max(0, want * want - hz * hz));
      var dyArm = v - need;                                 // + : the body comes up, − : it hangs lower
      // arms bent (pulling up): the shoulders where the lesson has them below the bar, so the chin clears it as drawn;
      // straight arms (the hang): by the arm's bend, so the hang stays a dead hang on the model's longer arms
      var dyLesson = (b.y - (n['h' + sd.k].y - n['sh' + sd.k].y)) - S.y, wStraight = smooth(0.85, 0.98, ratio[sd.k]);
      var dyS = dyLesson + (dyArm - dyLesson) * wStraight;
      // a fully bent arm cannot fold tighter than ~16 cm shoulder-to-wrist: the shoulder never rises closer to the wrist than that
      var Sy = S.y + dyS, close = 0.16;
      if (hz < close && Math.abs(at.y - Sy) < Math.sqrt(close * close - hz * hz)) dyS = (at.y - Math.sqrt(close * close - hz * hz)) - S.y;
      dy += dyS; cnt++;
    });
    dy /= cnt;
    if (Math.abs(dy) < 0.001) break;
    Object.keys(n).forEach(function (k) { n[k].y += dy; });
  }
  var gapMax = 0;
  // (measured at the base of the middle finger: the bar sits in that crease)
  SIDES.forEach(function (sd) { var g = wpos(A.B[sd.X + 'HandMiddle1']), c = v3(b.x, b.y, Math.max(-0.62, Math.min(0.62, g.z))); gapMax = Math.max(gapMax, g.distanceTo(c)); });
  info.barGap = gapMax;
  return info;
}

/* ---------- HYROX equipment and the treadmill mat ----------
 * Simple shapes, placed from the posed model each frame: the SkiErg tower and its cords, the push sled under the hands, the pull
 * sled and its rope, the rower, kettlebells, the sandbag on the shoulders, the wall-ball wall, target and ball.
 * belt: the mat's travel so far (the 2D lesson's advance), shown by stripes sliding back under the feet. */
var KIT = new THREE.Group(); scene.add(KIT);
var KITM = { dark: std('#2A2E38', 0.6), grey: std('#C9C6BE', 0.8), steel: std('#9AA0A8', 0.35, 0.6), red: std('#D92D20', 0.6), rope: std('#8A6D3B', 0.9), black: std('#16181D', 0.5), sand: std('#B3262A', 0.85) };
var UNIT_BOX = new THREE.BoxGeometry(1, 1, 1), UNIT_CYL = new THREE.CylinderGeometry(1, 1, 1, 20), UNIT_BALL = new THREE.SphereGeometry(1, 24, 16);
var kitParts = {};
function kp(name, geo, mat) {                                // a named part, made once
  if (!kitParts[name]) { var m = new THREE.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true; KIT.add(m); kitParts[name] = m; }
  var o = kitParts[name]; o.visible = true; o.rotation.set(0, 0, 0); o.quaternion.identity(); return o;
}
function kbox(name, mat, x, y, z, sx, sy, sz) { var m = kp(name, UNIT_BOX, mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); return m; }
function kball(name, mat, p, r) { var m = kp(name, UNIT_BALL, mat); m.position.copy(p); m.scale.setScalar(r); return m; }
function krod(name, mat, a, b, r) {                          // a round bar from a to b
  var m = kp(name, UNIT_CYL, mat), d = b.clone().sub(a), L = d.length() || 1e-4;
  m.position.copy(a).add(b).multiplyScalar(0.5); m.scale.set(r, L, r); m.quaternion.setFromUnitVectors(UPV, d.divideScalar(L)); return m;
}
var stripes = [];
for (var si = 0; si < 13; si++) { var sm = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 1.1), new THREE.MeshBasicMaterial({ color: '#B9AE98', transparent: true, opacity: 0.8 })); sm.rotation.x = -Math.PI / 2; sm.position.y = 0.003; sm.visible = false; scene.add(sm); stripes.push(sm); }
// The belt runs at whatever speed keeps the foot on the ground still on it (the 2D drawings' legs sweep back further than their
// "distance travelled", so following that would make the feet skate); with both feet in the air (the broad jump) it follows the
// lesson's distance. Worked out once per move over one loop; later loops add a whole loop's travel.
var BELT = null;
function beltTable() {
  if (BELT && BELT.move === cur) return BELT;
  var total = sideP.total, N = 240, tab = [0], prev = null, prevS = 0;
  for (var i = 0; i <= N; i++) {
    var t = total * i / N, n = rawJoints(t).n, sN = footSpot(n, 'N'), sF = footSpot(n, 'F'), ps = sideP.poseAt(t), sNow = ps.pose.s || 0;
    if (prev) {
      // the foot carrying the weight is the one on the ground travelling back against the body (a foot swinging forward
      // close to the mat is not it)
      var cand = [['N', sN], ['F', sF]].filter(function (c) { return c[1].g > 0.8 && prev[c[0]].g > 0.8; }), d;
      if (cand.length) { var dx = Math.min.apply(null, cand.map(function (c) { return c[1].x - prev[c[0]].x; })); d = -dx; }
      else d = (sNow - prevS) * K;
      tab.push(tab[tab.length - 1] + d);
    }
    prev = { N: sN, F: sF }; prevS = sNow;
  }
  BELT = { move: cur, tab: tab, total: total, N: N };
  return BELT;
}
// On the belt a foot that moves forward against the belt is stepping: the 2D drawings slide it along the floor, so it is lifted
// into a small step (higher the faster it travels: nothing at the start and end of the step, ~9 cm in the middle)
function beltSteps(t, n) {
  ['N', 'F'].forEach(function (f) {
    var dt = 14, a = rawJoints(t - dt).n, b = rawJoints(t + dt).n;
    var v = ((footSpot(b, f).x + beltAt(t + dt)) - (footSpot(a, f).x + beltAt(t - dt))) / (2 * dt / 1000);   // m/s along the belt
    var lift = Math.min(0.09, Math.max(0, v - 0.15) * 0.035);
    if (lift > 0.002) { n['a' + f].y += lift; n['t' + f].y += lift; n['k' + f].y += lift * 0.5; }
  });
}
function beltAt(t) {
  if (!cur || !cur.belt) return 0;
  var T = beltTable(), cyc = Math.floor(t / T.total), u = (t - cyc * T.total) / T.total * T.N, i = Math.min(T.N - 1, Math.floor(u));
  return cyc * T.tab[T.N] + T.tab[i] + (T.tab[i + 1] - T.tab[i]) * (u - i);
}
function gripPoint(X) { var B = avatar.B, w = wpos(B[X + 'Hand']); return w.add(wpos(B[X + 'HandMiddle1']).sub(w).multiplyScalar(0.62)); }
function drawKit(r, t) {
  Object.keys(kitParts).forEach(function (k) { kitParts[k].visible = false; });
  var on = !!(cur && avatar && (cur.kit || cur.belt));
  stripes.forEach(function (m, i) {
    m.visible = !!(on && cur.belt);
    if (m.visible) { var b = beltAt(t), x = (i - 6) * 0.5 - (((b % 0.5) + 0.5) % 0.5); m.position.x = x; m.material.opacity = 0.8 * Math.max(0, 1 - Math.abs(x) / 3); }
  });
  if (!on || !cur.kit) return;
  var B = avatar.B, gN = gripPoint('Right'), gF = gripPoint('Left'), g = gN.clone().add(gF).multiplyScalar(0.5), hip = wpos(B.Hips), p = r.pose;
  var X = function (u) { return (u - x0) * K; };
  if (cur.kit === 'ski') {
    var tx = hip.x + 0.78, top = new THREE.Vector3(tx - 0.06, 2.05, 0);
    kbox('base', KITM.grey, hip.x + 0.25, 0.03, 0, 1.25, 0.06, 0.75);
    kbox('tower', KITM.dark, tx + 0.06, 1.1, 0, 0.16, 2.2, 0.26);
    kbox('screen', KITM.black, tx - 0.03, 1.5, 0, 0.05, 0.16, 0.22);
    kball('pulley', KITM.steel, top, 0.05);
    [['N', gN], ['F', gF]].forEach(function (h) {
      krod('cord' + h[0], KITM.black, top, h[1], 0.006);
      krod('handle' + h[0], KITM.red, h[1].clone().add(v3(0, 0.07, 0)), h[1].clone().add(v3(0, -0.07, 0)), 0.018);
    });
  } else if (cur.kit === 'push') {
    var fx = g.x + 0.04, w2 = Math.max(0.25, Math.abs(gN.z - gF.z) / 2 + 0.02);
    kbox('tray', KITM.grey, fx + 0.42, 0.09, g.z, 0.9, 0.1, w2 * 2 + 0.1);
    kbox('skid', KITM.dark, fx + 0.42, 0.025, g.z, 0.95, 0.05, w2 * 2 + 0.12);
    [['N', gN], ['F', gF]].forEach(function (h) { krod('pole' + h[0], KITM.dark, h[1], v3(fx, 0.14, h[1].z), 0.02); });
    [[0.28, 0.22, KITM.black], [0.45, 0.25, KITM.red], [0.62, 0.2, KITM.black]].forEach(function (pl, i) {
      var c = v3(fx + pl[0], 0.14 + pl[1], g.z), m = kp('plate' + i, UNIT_CYL, pl[2]); m.position.copy(c); m.scale.set(pl[1], 0.06, pl[1]); m.rotation.z = Math.PI / 2;
    });
  } else if (cur.kit === 'pull') {
    var sx = X(p.sledX || 392) * 0.45 + 0.6, vis = (p.sledO === undefined ? 1 : p.sledO) > 0.5;
    if (vis) {
      kbox('tray', KITM.grey, sx + 0.3, 0.09, 0, 0.7, 0.1, 0.55); kbox('skid', KITM.dark, sx + 0.3, 0.025, 0, 0.75, 0.05, 0.6);
      var m1 = kp('plate0', UNIT_CYL, KITM.black); m1.position.set(sx + 0.22, 0.36, 0); m1.scale.set(0.22, 0.06, 0.22); m1.rotation.z = Math.PI / 2;
      var m2 = kp('plate1', UNIT_CYL, KITM.red); m2.position.set(sx + 0.38, 0.33, 0); m2.scale.set(0.19, 0.06, 0.19); m2.rotation.z = Math.PI / 2;
      krod('rope', KITM.rope, g, v3(sx, 0.12, 0), 0.012);
    }
    krod('tail', KITM.rope, g, v3(hip.x - 0.45, 0.01, 0), 0.012);           // the rope already pulled in, behind
  } else if (cur.kit === 'row') {
    kbox('rail', KITM.dark, X(262) , 0.1, 0, X(372) - X(150), 0.05, 0.12);
    kbox('legB', KITM.dark, X(150), 0.05, 0, 0.05, 0.1, 0.5); kbox('legF', KITM.dark, X(372), 0.05, 0, 0.05, 0.1, 0.5);
    var fw = kp('flywheel', UNIT_CYL, KITM.grey); fw.position.set(X(366), 0.33, 0); fw.scale.set(0.2, 0.36, 0.2); fw.rotation.x = Math.PI / 2;
    kbox('seat', KITM.black, hip.x, 0.16, 0, 0.3, 0.06, 0.3);
    kbox('foot', KITM.grey, X(300), 0.13, 0, 0.05, 0.22, 0.34).rotation.z = 0.5;
    krod('bar', KITM.black, v3(g.x, g.y, -0.22), v3(g.x, g.y, 0.22), 0.016);
    krod('chain', KITM.steel, v3(X(352), 0.36, 0), g, 0.006);
    kbox('screen', KITM.black, X(352), 0.85, 0, 0.04, 0.18, 0.26); krod('arm', KITM.dark, v3(X(362), 0.5, 0), v3(X(352), 0.78, 0), 0.015);
  } else if (cur.kit === 'carry') {
    [['N', gN], ['F', gF]].forEach(function (h) {
      krod('kbH' + h[0], KITM.black, h[1].clone().add(v3(-0.06, -0.02, 0)), h[1].clone().add(v3(0.06, -0.02, 0)), 0.014);
      kball('kb' + h[0], KITM.black, h[1].clone().add(v3(0, -0.15, 0)), 0.11);
    });
  } else if (cur.kit === 'lunge') {
    var bk = bagCentre(avatar);
    var bag = kbox('bag', KITM.sand, bk.x, bk.y, bk.z, 0.22, 0.17, 0.62);   // a flat bag lying across the shoulders
  } else if (cur.kit === 'bench') {
    var bl = X(230 - 95), br = X(230 + 18), bt = (FLOOR - 170) * K;          // the 2D lesson's bench: hip x 230, top at y 170
    kbox('pad', KITM.black, (bl + br) / 2, bt - 0.05, 0, br - bl, 0.1, 0.3);
    kbox('frame', KITM.dark, (bl + br) / 2, bt - 0.13, 0, br - bl - 0.1, 0.05, 0.16);
    kbox('legH', KITM.dark, bl + 0.12, (bt - 0.15) / 2, 0, 0.05, bt - 0.15, 0.36); kbox('legF', KITM.dark, br - 0.12, (bt - 0.15) / 2, 0, 0.05, bt - 0.15, 0.36);
  } else if (cur.kit === 'pullbar') {
    var pb = pullBar(), bx = pb.x, by = pb.y;                                 // the 2D lesson's bar: x 205, y 0 — the palms are fixed on it
    krod('bar', KITM.steel, v3(bx, by, -0.62), v3(bx, by, 0.62), 0.016);
    [-0.62, 0.62].forEach(function (z, i) { kbox('post' + i, KITM.dark, bx, (by + 0.1) / 2, z, 0.06, by + 0.1, 0.06); kbox('foot' + i, KITM.dark, bx, 0.02, z, 0.7, 0.04, 0.08); });
  } else if (cur.kit === 'wall') {
    var wx = hip.x + 0.95, tgt = 3.0;
    kbox('wall', KITM.grey, wx + 0.1, 1.75, 0, 0.2, 3.5, 0.34);           // a narrow target post (a wide wall would hide you from the front)
    var ring2 = kp('target', UNIT_CYL, KITM.red); ring2.position.set(wx - 0.005, tgt, 0); ring2.scale.set(0.17, 0.01, 0.17); ring2.rotation.z = Math.PI / 2;
    var inn = Math.max(0, Math.min(1, p.ballIn === undefined ? 1 : p.ballIn));
    var held = g.clone().add(v3(0.13, 0.01, 0)), at = v3(wx - 0.18, tgt, 0), bp = at.clone().lerp(held, inn);   // (held between the palms, just in front of the hands)
    if (inn < 1) bp.y += Math.sin(Math.PI * (1 - inn)) * 0.25;
    kball('ball', KITM.black, bp, 0.17);
  }
}

/* ---------- player state + UI ---------- */
var state = { move: 0, cat: 'kungfu', t: 0, playing: !window.matchMedia('(prefers-reduced-motion: reduce)').matches, speed: 1, total: 1, lastSeg: -1 };
var $ = function (id) { return document.getElementById(id); };
var elPlay = $('lab-play'), elScrub = $('lab-scrub'), elStep = $('lab-step'), elName = $('lab-name'), elCat = $('lab-cat'), elLink = $('lab-link');
var list = $('lab-moves'), tabs = $('lab-cats');

function setMove(i, fromHash) {
  state.move = i; var m = MOVES[i];
  state.flip = false; if ($('lab-mirror')) $('lab-mirror').setAttribute('aria-pressed', 'false');   // every move starts on its own correct side
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
// Mirror: show the same move on the other side of the body (left and right limbs swap)
if ($('lab-mirror')) $('lab-mirror').addEventListener('click', function () {
  state.flip = !state.flip; this.setAttribute('aria-pressed', state.flip ? 'true' : 'false'); planGait(); draw();
});
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
  THREE: THREE, MOVES: MOVES, K: K, SIDES: SIDES, plateR: function () { return PLATE_R; }, scene: scene, barbell: barbell, wpos: wpos, stick: stick,
  avatar: function () { return avatar; },
  belt: function (t) { return beltAt(t); },
  partner: function () { return cur && cur.duo ? AVS.partner : null; },
  gait: function () { return GAIT; },
  load: function (i) { setPlaying(false); setMove(i, true); return state.total; },
  frames: function () { return clip.frames; },
  name: function (m) { return KT.name(m.s); },
  pose: function (t) {
    state.t = t; TIME_NOW = t;
    var q = lessonJoints(t), r = q.r, n = q.n;
    faceQ.setFromAxisAngle(UPV, r.theta);
    var info = poseOrHang(n, r.theta, q);
    if (info && (cur.kit === 'push' || cur.kit === 'bench')) info.supported = 1;   // (leaning into the sled / lying on the bench: not standing on the feet)
    var pinfo = drawPartner(t, q);
    if (q.info) info = q.info;
    // for the checker: how far each fixed grip's palm is from its spot (yours and the partner's), and golf hands' spacing
    if (info) {
      var gm = 0;
      [avatar, AVS.partner].forEach(function (X) { if (!X || !X.hold || (X === AVS.partner && !cur.duo)) return;
        [['N', 'Right'], ['F', 'Left']].forEach(function (h) { var o = X.hold[h[0]]; if (o && o.w > 0.9 && !o.barGrip) gm = Math.max(gm, palmOf(X, h[1]).distanceTo(o.at)); }); });
      info.gripMiss = gm;
      if (cur.golf && avatar) info.golfApart = palmOf(avatar, 'Right').distanceTo(palmOf(avatar, 'Left'));
    }
    drawBar(r, r.J, r.V, info);
    drawStick(r); drawClub(r); drawKit(r, TIME_NOW);
    return { info: info, n: n, theta: r.theta, partner: pinfo };
  }
};
