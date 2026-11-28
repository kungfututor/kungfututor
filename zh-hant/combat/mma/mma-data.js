/* MMA basics — 8 core techniques that join striking and grappling: stance,
 * jab-cross, overhand, low kick, double-leg takedown, sprawl, ground and pound
 * from mount, and the technical stand-up. Side view; the grey figure
 * (kt-partner.js) is the opponent. Our own wording of widely taught MMA
 * fundamentals. All text goes through KT.pick / cap pairs for 17 languages.
 */
(function (w) {
  'use strict';
  var S = w.KTFigure.S, C = S.col, KP = w.KTPartner, D2R = Math.PI / 180;
  function m() { var o = {}; for (var i = 0; i < arguments.length; i++) for (var k in arguments[i]) o[k] = arguments[i][k]; return o; }
  function cap(zh, en) { return { zh: zh, en: en }; }
  var ang = function (a, b) { return Math.atan2(b.x - a.x, b.y - a.y) / D2R; };

  var X0 = 140;
  // wider and lower than the boxing stance (feet 46 apart, hips 82 up), hands a little lower and further forward
  var LEGS = { x: X0, t: 10, h: 6, fN: { x: 27, y: 76 }, fF: { x: -29, y: 76 }, ftN: 90, ftF: 70, kbN: 1, kbF: 1, lift: 0 };
  var GUARD = { su: 52, sl: 140, fu: 38, fl: 146, laN: 1, hz: 1, lz: 0 };
  var BASE = m(KP.base, { hit: 0, oa1: 45, oa2: 162, ob1: 30, ob2: 167, ola: 18, olb: 4, ol: 20, oh: 4 });
  function P() { return m.apply(null, [BASE, LEGS, GUARD].concat([].slice.call(arguments))); }
  // the opponent lying on their back, head away from you, hands up to cover
  var DOWN = { ot: -88, oh: 0, ola: 88, olb: 92, ol: -88, olf: -92, oa1: 170, oa2: 175, ob1: 165, ob2: 172 };

  // Technical stand-up, in absolute positions (a flat foot rests at y 211, a hand at y 209).
  // The posted hand really is on the floor (hF = the spot it presses on). The hips lift high on that straight arm and the
  // opposite foot — high enough for the free leg to fold underneath with its knee clear of the mat — and its foot is
  // planted BEHIND, on the toes, before the hand leaves. Both feet then stay exactly where they are while the body comes
  // up between them, so the stance at the end is simply the two planted feet.
  function standup(k) {
    var G = 211, post = { x: X0 - 45, y: 209 }, near = { x: X0 + 40, y: G }, toe = { x: X0 - 0.6, y: 213.5 };
    function hips(sh, t) { return { x: sh.x - 58 * Math.sin(t * D2R), y: sh.y + 58 * Math.cos(t * D2R) }; }      // hips hanging from a shoulder
    function onToes(ft) { return { x: toe.x - 10 * Math.sin(ft * D2R), y: toe.y - 10 * Math.cos(ft * D2R) }; }   // back ankle, toes staying on one spot
    var over = { x: post.x + 2, y: post.y - 57.96 };                                                             // the shoulder straight above the posted hand
    var poses = [
      { hip: { x: X0, y: 205 }, t: -28, h: 10, fF: { x: X0 + 84, y: 209 }, ftF: 140, posted: 1 },   // sitting, heel of the straight leg on the mat
      { hip: hips(over, -74), t: -74, h: 36, fF: { x: X0 + 10, y: 197 }, ftF: 20, posted: 1 },      // hips up on hand + foot, the leg folding under
      { hip: hips(over, -80), t: -80, h: 40, fF: onToes(15), ftF: 15, posted: 1 },                  // foot planted behind on the ball, heel up, hand still down
      { hip: { x: X0 + 16, y: 152 }, t: 10, h: 0, fF: onToes(25), ftF: 25, posted: 0 },             // hand off: a deep split squat between the two feet
      { hip: { x: X0 + 16, y: 129 }, t: 8, h: 6, fF: onToes(70), ftF: 70, posted: 0 }               // stance
    ];
    var p = poses[k], sh = { x: p.hip.x + 58 * Math.sin(p.t * D2R), y: p.hip.y - 58 * Math.cos(p.t * D2R) };
    // the far hand: on its spot while posted, otherwise up by the chin (the same place the guard angles 30 / 167 give)
    var hand = p.posted ? post : { x: sh.x + 21.3, y: sh.y - 1.3 };
    return { x: p.hip.x, y: p.hip.y, t: p.t, h: p.h, fN: near, fF: p.fF, ftN: 90, ftF: p.ftF, kbN: 1, kbF: 1,
      su: 45, sl: 162, fu: 30, fl: 167, hF: hand };
  }

  var CLIPS = {
    stance: { frames: [
      { d: 900, p: P({ ox: 262 }), c: cap('雙腳比拳擊稍寬、膝蓋更彎，重心較低', 'Feet a little wider than boxing, knees more bent, hips lower') },
      { d: 500, p: P({ ox: 262, x: X0 + 4 }), c: cap('雙手護臉但稍低，隨時可以擋摔', 'Hands guard the face but sit a little lower, ready to stop takedowns') },
      { d: 900, p: P({ ox: 262 }), c: cap('同時防拳、防踢、防摔', 'Ready for punches, kicks and takedowns at once') }
    ] },
    onetwo: { hit: 'hNF', trail: 'hF', frames: [
      { d: 600, p: P({ ox: 220 }), c: cap('站架', 'Stance') },
      { d: 240, p: P({ x: X0 + 5, t: 10, su: 90, sl: 90, ox: 220, ot: -5, hit: 1 }), e: 'out', c: cap('前手直拳', 'Jab') },
      { d: 120, p: P({ ox: 220 }) },
      { d: 280, p: P({ t: 20, fu: 92, fl: 90, fF: { x: -25, y: 76 }, ftF: 35, ox: 220, ot: -9, oh: -10, hit: 1 }), e: 'out', c: cap('後手直拳，轉腳轉髖', 'Cross — pivot the back foot and turn the hips') },
      { d: 600, p: P({ ox: 224 }), c: cap('雙手回防，準備移動', 'Hands back up, ready to move') }
    ] },
    overhand: { hit: 'hF', trail: 'hF', frames: [
      { d: 700, p: P({ ox: 220 }), c: cap('站架', 'Stance') },
      { d: 200, p: P({ t: 14, h: -6, lz: 10, fu: 70, fl: 150, ox: 220 }), c: cap('頭往前側移出中線', 'Dip the head forward and off the centre line') },
      { d: 180, p: P({ t: 18, h: -6, lz: 12, fu: 100, fl: 221, fF: { x: -25, y: 76 }, ftF: 40, ox: 220 }), c: cap('後手由上方畫弧打出', 'The rear hand loops up and over') },
      { d: 220, p: P({ t: 26, h: -6, lz: 8, fu: 125, fl: 80, fF: { x: -25, y: 76 }, ftF: 35, ox: 220, ot: -6, oh: 14, hit: 1 }), e: 'out', c: cap('從上方越過對方的手，打在頭側', 'Come down over their guard onto the side of the head') },
      { d: 600, p: P({ ox: 222 }), c: cap('回到站架', 'Back to stance') }
    ] },
    lowkick: { hit: 'shinF', trail: 'aF', frames: [
      { d: 700, p: P({ ox: 222 }), c: cap('站架', 'Stance') },
      { d: 180, p: P({ t: -6, fF: { x: 4, y: 56 }, ftF: 40, fu: -15, fl: -5, ftN: 60, ox: 222 }), c: cap('轉前腳、後腿甩起', 'Pivot the lead foot and swing the rear leg') },
      { d: 160, p: P({ t: -16, h: 12, fF: { x: 70, y: 52 }, ftF: 100, fu: -45, fl: -30, ftN: 60, ox: 222, ola: 30, olb: -8, hit: 1 }), e: 'out', c: cap('用脛骨踢對方大腿或小腿', 'Land the shin on their thigh or calf') },
      { d: 260, p: P({ t: -6, fF: { x: 10, y: 55 }, ftF: 40, ox: 224 }), c: cap('收腿，雙手護頭', 'Recover the leg, hands up') },
      { d: 600, p: P({ ox: 224 }), c: cap('回到站架', 'Back to stance') }
    ] },
    double: { hit: 'hN', trail: 'head', frames: [
      { d: 700, p: P({ ox: 226 }), c: cap('站架，對方在出拳距離', 'Stance, at punching range') },
      { d: 260, p: P({ t: 26, h: -12, fN: { x: 24, y: 64 }, fF: { x: -28, y: 66 }, su: 55, sl: 90, fu: 45, fl: 95, ox: 226 }), c: cap('降低重心：彎膝、背挺直、眼睛向前', 'Level change: bend the knees, back straight, eyes forward') },
      { d: 300, p: P({ x: X0 + 30, t: 52, h: -22, fN: { x: -8, y: 50 }, ftN: 0, fF: { x: -76, y: 32 }, ftF: 10, su: 62, sl: 78, fu: 58, fl: 82, ox: 226 }), e: 'out', c: cap('穿透步：前膝跪到對方雙腳之間，頭貼對方身側', 'Penetration step: drop the lead knee between their feet, head tight to their side') },
      { d: 300, p: P({ x: X0 + 44, t: 42, h: -18, fN: { x: -8, y: 50 }, ftN: 0, fF: { x: -60, y: 40 }, ftF: 10, su: 60, sl: 80, fu: 56, fl: 84, ox: 236, ot: -40, ola: 40, hit: 1 }), c: cap('雙手抱住大腿後側，用腳往前推', 'Grab behind both thighs and drive forward off your feet') },
      { d: 900, p: P(DOWN, { x: X0 + 105, t: 20, h: 0, fN: { x: -34, y: 44 }, fF: { x: -38, y: 44 }, ftN: -90, ftF: -90, ox: 230, hit: 0 }), c: cap('對方倒地，你在上方控制', 'They go down; you land on top in control') }
    ] },
    // (sprawled on, the shooter is flattened: both knees on the mat, hips sunk back, chest low — your weight is on their back)
    sprawl: { hit: null, trail: 'hip', frames: [
      { d: 700, p: P({ ox: 236 }), c: cap('站架，看對方的髖部', 'Stance; watch their hips') },
      { d: 220, p: P({ ox: 206, ot: 55, oh: -20, oa1: 62, oa2: 50, ob1: 58, ob2: 46, ola: 70, olb: 0 }), c: cap('對方低身衝向你的腳', 'They shoot low for your legs') },
      { d: 260, p: P({ t: 78, h: -30, fN: { x: -62, y: 36 }, fF: { x: -72, y: 38 }, ftN: 10, ftF: 10, su: 40, sl: 70, fu: 35, fl: 75, ox: 212, ot: 80, oh: -10, oa1: 62, oa2: 50, ob1: 58, ob2: 46, ola: 60, olb: -90, ol: -60, olf: 90 }), e: 'out', c: cap('雙腳往後甩、髖部壓下，用體重壓在對方背上', 'Throw the legs back and drop the hips, putting your weight on their back') },
      { d: 700, p: P({ t: 78, h: -30, fN: { x: -62, y: 36 }, fF: { x: -72, y: 38 }, ftN: 10, ftF: 10, su: 40, sl: 70, fu: 35, fl: 75, ox: 212, ot: 80, oh: -10, oa1: 62, oa2: 50, ob1: 58, ob2: 46, ola: 60, olb: -90, ol: -60, olf: 90 }), c: cap('雙手壓住對方頭與肩，不讓對方抓到腳', 'Hands push down on their head and shoulders so they can\'t reach your legs') },
      { d: 600, p: P({ ox: 240 }), c: cap('站起來回到站架', 'Get back up to your stance') }
    ] },
    gnp: { hit: 'hNF', trail: 'hF', frames: [
      { d: 800, p: P(DOWN, { x: X0 + 26, t: 14, h: 0, fN: { x: -34, y: 44 }, fF: { x: -38, y: 44 }, ftN: -90, ftF: -90, su: 30, sl: 150, fu: 25, fl: 155, ox: X0 }), c: cap('騎乘位：雙膝在對方身體兩側，重心壓低', 'Mount: knees either side of their body, weight low') },
      { d: 220, p: P(DOWN, { x: X0 + 26, t: 8, h: 0, fN: { x: -34, y: 44 }, fF: { x: -38, y: 44 }, ftN: -90, ftF: -90, su: 30, sl: 150, fu: 70, fl: 175, ox: X0 }), c: cap('坐直一點，後手舉起', 'Posture up a little and raise the rear hand') },
      { d: 200, p: P(DOWN, { x: X0 + 26, t: 42, h: 0, fN: { x: -34, y: 44 }, fF: { x: -38, y: 44 }, ftN: -90, ftF: -90, su: 30, sl: 150, fu: 38, fl: 14, ox: X0, hit: 1 }), e: 'out', c: cap('短而快地往下打，打完收回', 'Short, fast strikes downward, then bring the hand back') },
      { d: 600, p: P(DOWN, { x: X0 + 26, t: 14, h: 0, fN: { x: -34, y: 44 }, fF: { x: -38, y: 44 }, ftN: -90, ftF: -90, su: 30, sl: 150, fu: 25, fl: 155, ox: X0 }), c: cap('保持平衡，不要被翻過去', 'Stay balanced so they can\'t roll you') }
    ] },
    standup: { hit: null, trail: 'hip', frames: [
      { d: 800, p: m(BASE, standup(0), { ox: 330 }), c: cap('坐在地上：一手撐地在後，同側腳伸直，另一腳踩地，前手護臉', 'Sitting: one hand posted behind, that leg straight, the other foot planted, front hand guarding the face') },
      { d: 600, p: m(BASE, standup(1), { ox: 330 }), c: cap('撐手與踩地的腳一起推，把臀部抬離地面', 'Push off the posted hand and planted foot to lift the hips') },
      { d: 550, p: m(BASE, standup(2), { ox: 330 }), c: cap('伸直的腳從身體下方往後收，踩在後方', 'Swing the straight leg back under you and plant it behind') },
      { d: 600, p: m(BASE, standup(3), { ox: 330 }) },
      { d: 900, p: m(BASE, standup(4), { ox: 330 }), c: cap('站起成站架，與對方保持距離', 'Stand up into your stance at a safe distance') },
      // …and back down the same way, so the loop never drops on to the floor without the hand
      { d: 500, p: m(BASE, standup(4), { ox: 330 }) },
      { d: 500, p: m(BASE, standup(3), { ox: 330 }) },
      { d: 600, p: m(BASE, standup(2), { ox: 330 }) }
    ] }
  };

  // one-legged moments (kicks, knees, shin blocks): the hips move over the standing foot so the figure never tips over;
  // the standing foot stays put and the partner keeps the distance the lesson drew (see KTFigure.balanceClip)
  ['lowkick'].forEach(function (k) { w.KTFigure.balanceClip(CLIPS[k].frames, { base: { x: X0 } }); });

  function makeClip(s, view, level, lang) {
    var src = CLIPS[s.id], pace = level < 1 ? 1.8 : 1;
    return {
      scale: 0.88, base: { x: X0 }, cx: X0, ticks: false, labelAt: [350, 28], still: 0.5,
      trail: src.trail || null,
      frames: src.frames.map(function (f) { return { d: Math.round(f.d * pace), p: f.p, e: f.e, c: f.c }; }),
      props: function (J, c) {
        var o = KP.draw(J, c, { cx: X0, wraps: true }), fr = '', hud = '', sc = c.scale;
        fr += S.circle(J.hF, 5 * sc, '#4A505E', '#fff', 1.2) + S.circle(J.hN, 5 * sc, C.ink, '#fff', 1.2);   // MMA gloves
        if (src.hit && c.pose.hit > 0.15) {
          var pt = src.hit === 'shinF' ? S.mid(J.kF, J.aF, 0.6) : src.hit === 'hNF' ? (s.id === 'gnp' || c.seg >= 2 ? J.hF : J.hN) : J[src.hit];
          fr += KP.hit(pt, c.pose.hit);
          if (c.pose.hit > 0.6) hud += S.text(18, 30, KT.pick('接觸點：', 'CONTACT: ') + KT.t(s.contact), { size: 12, fill: C.red, family: "'JetBrains Mono','Noto Sans TC',monospace" });
        }
        return { back: o.svg, front: fr, hud: hud };
      }
    };
  }

  var LIST = [
    { id: 'stance', n: 1, zh: 'MMA 站架', py: 'MMA Stance', en: 'MMA Stance',
      type: { zh: '基本', en: 'Foundation' }, contact: { zh: '—', en: '—' }, phase: { zh: '站立', en: 'Standing' },
      tags: { zh: ['同時防打與防摔', '比拳擊更低、更寬'], en: ['Defends strikes and takedowns', 'Lower and wider than boxing'] },
      ability: { zh: '平衡與全面防守', en: 'Balance and all-round defence' },
      note: { zh: '膝更彎 · 重心低 · 手護臉', en: 'MORE KNEE BEND · HIPS LOW · HANDS UP' },
      how: { zh: 'MMA 站架介於拳擊與摔跤之間：雙腳比拳擊稍寬，膝蓋更彎、重心更低，這樣對方抱腿時你能及時下壓。雙手護臉但比拳擊略低、手肘靠近身體，可以擋拳也可以擋對方抓腿。重心大致平均，前腳不要太重，以免被低踢。',
        en: 'The MMA stance sits between boxing and wrestling: feet a little wider than in boxing, knees more bent and hips lower, so you can react when someone shoots for your legs. Hands guard the face but sit slightly lower than in boxing, elbows close, so they can block punches and fight off grips. Keep your weight fairly even and the lead leg light against low kicks.' },
      mistakes: { zh: '像拳擊一樣站得太高（容易被抱摔）；像摔跤一樣頭太低（容易吃膝擊）；雙手垂下；前腳太重。', en: 'Standing tall like a boxer (easy to take down); head too low like a wrestler (open to knees); dropping the hands; too much weight on the lead leg.' },
      practice: { zh: '在站架中前後左右移動 3 × 1 分鐘，每聽到口令就做一次降低重心。', en: 'Move in all directions in your stance for 3 × 1 minute, dropping your level every time a partner calls it.' },
      use: { zh: 'MMA 選手要同時面對拳、踢、膝、肘和摔，站架是所有攻防的起點。', en: 'An MMA fighter faces punches, kicks, knees, elbows and takedowns at once — the stance is where every exchange starts.' },
      bars: [['平衡', 'Balance', 90], ['擋摔準備', 'Takedown readiness', 88], ['防守', 'Defence', 85], ['腳步', 'Footwork', 80]] },

    { id: 'onetwo', n: 2, zh: '一二連擊', py: 'Jab–Cross', en: 'Jab–Cross (1-2)',
      type: { zh: '打擊', en: 'Striking' }, contact: { zh: '拳面', en: 'Knuckles' }, phase: { zh: '站立', en: 'Standing' },
      tags: { zh: ['最基本的拳法組合', '打完就移動'], en: ['The basic punching combination', 'Punch, then move'] },
      ability: { zh: '速度與節奏', en: 'Speed and rhythm' },
      note: { zh: '前手開路 · 後手轉髖 · 打完移動', en: 'JAB OPENS · CROSS TURNS THE HIPS · MOVE AFTER' },
      how: { zh: '先用前手直拳量距離，收回的同時轉後腳、轉髖打出後手直拳。MMA 的小手套比拳擊手套小，雙手要更積極護臉。打完立刻移動腳步或接摔、接踢。',
        en: 'Find range with the jab and, as it returns, pivot the back foot and turn the hips to fire the cross. MMA gloves are much smaller than boxing gloves, so keep the hands working hard to protect your face. Move straight after, or chain into a kick or takedown.' },
      mistakes: { zh: '打完停在原地；兩手同時離開臉；只用手不轉身；身體往前倒，給對方抱摔機會。', en: 'Standing still afterwards; both hands away from the face; no body turn; falling forward and giving them a takedown.' },
      practice: { zh: '空擊或沙袋 3 回合 × 3 分鐘，每個 1-2 後換一個方向移動。', en: '3 × 3-minute rounds of shadowboxing or bag work, moving in a new direction after every 1-2.' },
      use: { zh: '1-2 是 MMA 站立打擊的基礎，也常用來掩護抱摔。', en: 'The 1-2 is the base of MMA striking and often hides a takedown.' },
      bars: [['速度', 'Speed', 88], ['轉體', 'Rotation', 85], ['節奏', 'Rhythm', 85], ['防守', 'Defence', 78]] },

    { id: 'overhand', n: 3, zh: '過頂拳', py: 'Overhand', en: 'Overhand',
      type: { zh: '打擊', en: 'Striking' }, contact: { zh: '拳面', en: 'Knuckles' }, phase: { zh: '站立', en: 'Standing' },
      tags: { zh: ['MMA 最常見的重拳之一', '頭同時移出中線'], en: ['One of MMA\'s most common power punches', 'The head moves off line as you throw'] },
      ability: { zh: '弧線力量與閃躲', en: 'Arcing power and head movement' },
      note: { zh: '頭往前側閃 · 拳由上畫弧 · 越過對方的手', en: 'HEAD OFF LINE · LOOP UP AND OVER · OVER THEIR GUARD' },
      how: { zh: '頭稍微往前側移出中線，同時後手由上方畫出弧線，越過對方的前手，打在頭側。轉腳轉髖讓體重跟上，另一手保持護臉。過頂拳常在對方出前手拳時同時打出。',
        en: 'Dip your head forward and off the centre line while the rear hand loops up and over the top of their lead hand onto the side of the head. Pivot and turn the hips so your weight follows, with the other hand guarding your face. It is often thrown just as they jab.' },
      mistakes: { zh: '弧線太大、預告明顯；頭留在中線上；打空後失去平衡；另一手掉下。', en: 'A huge, obvious loop; leaving the head on the centre line; losing balance on a miss; dropping the other hand.' },
      practice: { zh: '夥伴慢速出刺拳，你練「閃 + 過頂拳」反擊 3 × 10。', en: 'Partner throws slow jabs while you slip and counter with the overhand, 3 × 10.' },
      use: { zh: '因為小手套和摔的威脅，對手的護臉較低，過頂拳特別容易打中。', en: 'With small gloves and the threat of takedowns, guards sit lower in MMA — which is why the overhand lands so often.' },
      bars: [['弧線力量', 'Arcing power', 88], ['頭部移動', 'Head movement', 85], ['時機', 'Timing', 85], ['平衡', 'Balance', 78]] },

    { id: 'lowkick', n: 4, zh: '低踢', py: 'Low Kick', en: 'Low Kick',
      type: { zh: '打擊', en: 'Striking' }, contact: { zh: '小腿脛骨', en: 'Shin' }, phase: { zh: '站立', en: 'Standing' },
      tags: { zh: ['削弱對方的移動', '踢大腿或小腿'], en: ['Slows the opponent\'s movement', 'Thigh or calf'] },
      ability: { zh: '轉髖與準確', en: 'Hip turn and accuracy' },
      note: { zh: '轉前腳 · 脛骨 · 踢完護頭', en: 'PIVOT · SHIN · HANDS UP AFTER' },
      how: { zh: '前腳腳尖外轉，後腿甩起並轉髖，用脛骨踢對方大腿外側或小腿。在 MMA 中踢得太高容易被抓腿摔倒，所以低踢是最安全常用的腿法之一。踢完收腿、雙手護頭。',
        en: 'Turn the lead foot out, swing the rear leg and turn the hip to land the shin on the outside of their thigh or calf. In MMA a high kick can be caught for a takedown, so the low kick is one of the safest, most used kicks. Recover the leg with the hands up.' },
      mistakes: { zh: '在對方準備好時直接踢（被擋或被抓）；用腳背；踢完手掉下。', en: 'Throwing it when they are set (checked or caught); kicking with the foot; dropping the hands afterwards.' },
      practice: { zh: '組合「1-2 + 低踢」在沙袋上 3 回合 × 3 分鐘。', en: '1-2 plus low kick on the bag, 3 × 3-minute rounds.' },
      use: { zh: '持續低踢會讓對方腿部受傷、移動變慢，也讓對方不敢輕易進攻。', en: 'Steady low kicks hurt the legs, slow the opponent down and make them wary of stepping in.' },
      bars: [['轉髖', 'Hip rotation', 88], ['準確度', 'Accuracy', 85], ['時機', 'Timing', 82], ['平衡', 'Balance', 80]] },

    { id: 'double', n: 5, zh: '雙腿抱摔', py: 'Double-Leg Takedown', en: 'Double-Leg Takedown',
      type: { zh: '摔', en: 'Takedown' }, contact: { zh: '雙手抱大腿後側', en: 'Hands behind both thighs' }, phase: { zh: '站立 → 地面', en: 'Standing → ground' },
      tags: { zh: ['把比賽帶到地面', '降重心 → 穿透 → 推'], en: ['Takes the fight to the ground', 'Level change → penetrate → drive'] },
      ability: { zh: '爆發力與時機', en: 'Explosiveness and timing' },
      note: { zh: '降重心 · 前膝穿透 · 頭貼身側 · 往前推', en: 'LEVEL CHANGE · PENETRATE · HEAD TIGHT · DRIVE' },
      how: { zh: '先降低重心（彎膝、背挺直、眼睛看前方），接著前腳大步踏到對方雙腳之間，前膝跪地，頭貼在對方身側，雙手抱住對方大腿後側。後腳跟上，用腿往前推，讓對方失去平衡倒地，你落在上方。常接在拳之後，讓對方的手往上護頭。',
        en: 'First change levels — bend the knees with a straight back and eyes forward — then step deep between their feet, dropping the lead knee to the mat with your head tight to their side and both hands wrapping behind their thighs. Bring the back foot up and drive forward off your legs until they fall, and land on top. It works best straight after punches, when their hands come up to guard the head.' },
      mistakes: { zh: '彎腰而不是彎膝（容易被壓頭）；距離太遠才衝；低頭看地；抱住後停住不推。', en: 'Bending at the waist instead of the knees (easy to sprawl on); shooting from too far; looking at the floor; grabbing the legs and stopping instead of driving.' },
      practice: { zh: '在軟墊上練「降重心 → 穿透步」各 10 次，再和夥伴慢速完整練習。只在有教練的軟墊上進行。', en: 'On mats, drill the level change and penetration step 10 times each, then slow full reps with a partner — only on mats with a coach.' },
      use: { zh: '摔角好的選手可以決定比賽在站立還是地面進行，雙腿抱摔是最基本的摔法。', en: 'Good wrestlers decide whether the fight stays standing or goes to the ground; the double-leg is the basic takedown.' },
      bars: [['爆發力', 'Explosiveness', 90], ['時機', 'Timing', 88], ['腿部推進', 'Leg drive', 88], ['姿勢', 'Posture', 82]] },

    { id: 'sprawl', n: 6, zh: '防摔下壓', py: 'Sprawl', en: 'Sprawl',
      type: { zh: '防摔', en: 'Takedown defence' }, contact: { zh: '髖部與體重', en: 'Hips and body weight' }, phase: { zh: '站立', en: 'Standing' },
      tags: { zh: ['最基本的防摔', '腳往後甩、髖往下壓'], en: ['The basic takedown defence', 'Legs back, hips down'] },
      ability: { zh: '反應與髖部力量', en: 'Reaction and hip strength' },
      note: { zh: '腳往後甩 · 髖壓下 · 手壓頭肩', en: 'LEGS BACK · HIPS DOWN · HANDS ON HEAD AND SHOULDERS' },
      how: { zh: '對方低身衝向你的腳時，雙腳馬上往後甩，髖部往下壓到對方的上背，用全身體重壓住對方，雙手壓住對方的頭和肩膀，讓對方碰不到你的腿。穩住後再站起來回到站架。',
        en: 'The moment they shoot for your legs, throw both legs back and drive your hips down onto their upper back, putting your whole weight on them, with your hands pushing on their head and shoulders so they can\'t reach your legs. Once they stall, get back up to your stance.' },
      mistakes: { zh: '反應太慢；只彎腰不把腳往後甩；膝蓋跪地（對方仍抓得到）；壓住後忘了站起來。', en: 'Reacting late; bending forward without throwing the legs back; landing on your knees (they can still reach); staying down instead of getting up.' },
      practice: { zh: '在軟墊上聽口令練下壓再站起 3 × 10，熟練後由夥伴慢速出抱摔。', en: 'On mats, sprawl and pop back up on command, 3 × 10; then have a partner shoot slowly.' },
      use: { zh: '下壓讓擅長打擊的選手可以把比賽留在站立。', en: 'The sprawl lets a striker keep the fight standing.' },
      bars: [['反應', 'Reaction', 92], ['髖部力量', 'Hip strength', 85], ['體能', 'Conditioning', 82], ['平衡', 'Balance', 80]] },

    { id: 'gnp', n: 7, zh: '騎乘位地面打擊', py: 'Ground & Pound', en: 'Ground and Pound (Mount)',
      type: { zh: '地面', en: 'Ground' }, contact: { zh: '拳頭', en: 'Fists' }, phase: { zh: '地面', en: 'Ground' },
      tags: { zh: ['地面上的優勢位置', '先控制、再打擊'], en: ['A dominant ground position', 'Control first, then strike'] },
      ability: { zh: '控制與平衡', en: 'Control and balance' },
      note: { zh: '雙膝夾緊 · 重心壓低 · 短打', en: 'KNEES TIGHT · WEIGHT LOW · SHORT STRIKES' },
      how: { zh: '騎乘位是坐在仰躺對手的身上，雙膝貼在對方身體兩側，腳背貼地。先壓低重心、維持平衡，再坐直一點用短而快的拳往下打，打完立刻收手並保持平衡，不讓對方翻身。業餘賽事和一般訓練中常限制或禁止地面打頭。',
        en: 'In the mount you sit on an opponent lying on their back, knees tight to their sides and the tops of the feet on the mat. Get your weight low and balanced first, then posture up a little and throw short, fast strikes downward, bringing the hands back each time and staying balanced so they can\'t roll you. Many amateur events and most training sessions restrict or ban strikes to the head on the ground.' },
      mistakes: { zh: '坐太直、太高（容易被翻）；揮大拳失去平衡；只打不控制；膝蓋張開。', en: 'Sitting too tall (easy to roll); big swings that lose balance; striking without control; knees spread wide.' },
      practice: { zh: '在軟墊上用打擊假人或夥伴戴護具，練「維持騎乘位 30 秒 + 輕觸打擊」。', en: 'On mats with a grappling dummy or a padded partner: hold the mount for 30 seconds while tapping light strikes.' },
      use: { zh: '騎乘位是 MMA 中最有利的地面位置之一，很多比賽在這裡結束。', en: 'The mount is one of the best positions in MMA, and many fights end there.' },
      bars: [['控制', 'Control', 92], ['平衡', 'Balance', 88], ['髖部壓力', 'Hip pressure', 82], ['打擊精準', 'Accurate strikes', 78]] },

    { id: 'standup', n: 8, zh: '技術性起身', py: 'Technical Stand-up', en: 'Technical Stand-up',
      type: { zh: '地面', en: 'Ground' }, contact: { zh: '—', en: '—' }, phase: { zh: '地面 → 站立', en: 'Ground → standing' },
      tags: { zh: ['從地上安全站起來', '自我防衛也適用'], en: ['Getting up safely from the floor', 'Useful in self-defence too'] },
      ability: { zh: '協調與安全', en: 'Coordination and safety' },
      note: { zh: '撐手 · 抬臀 · 腳往後收 · 站起保持距離', en: 'POST · LIFT THE HIPS · LEG BACK · STAND AT DISTANCE' },
      how: { zh: '坐在地上時，一手撐在身後地面，同側的腳伸直，另一腳踩地，前手護臉。撐地的手和踩地的腳一起推，把臀部抬離地面，伸直的腳從身體下方往後收並踩穩，接著站起成站架，與對方保持距離。全程眼睛看著對方。',
        en: 'Sitting on the floor, post one hand on the mat behind you with that leg straight, plant the other foot and guard your face with the free hand. Push off the posted hand and planted foot to lift your hips, swing the straight leg back underneath you and plant it, then rise into your stance at a safe distance. Keep your eyes on the opponent the whole time.' },
      mistakes: { zh: '轉身背對對方爬起來；頭往前低著站起（容易被踢）；起身後站太近；撐地的手放在身體前方。', en: 'Turning your back to crawl up; standing up head-first (easy to kick); ending up too close; posting the hand in front instead of behind.' },
      practice: { zh: '左右兩邊各練 10 次，熟練後閉眼練習，確保動作自然流暢。', en: '10 reps each side; once smooth, try it with a partner calling the side.' },
      use: { zh: '被摔倒後安全地站起來，是 MMA 和自我防衛都很重要的技巧。', en: 'Getting up safely after going down matters in MMA and in self-defence alike.' },
      bars: [['協調', 'Coordination', 88], ['安全意識', 'Safety', 90], ['髖部力量', 'Hip strength', 78], ['平衡', 'Balance', 82]] }
  ];

  w.MMA = { LIST: LIST, makeClip: makeClip };
})(window);
