/* Wrestling basics — 8 lessons across the three styles: stance and motion,
 * double-leg, sprawl, arm drag to the back, Greco-Roman body lock, gut wrench
 * (par terre), folkstyle stand-up escape and the half nelson to a pin.
 * Side view; you wear the red singlet, the grey partner (kt-partner.js) the blue.
 * Our own wording of widely taught wrestling fundamentals. All text goes
 * through KT.pick / cap pairs for 17 languages.
 */
(function (w) {
  'use strict';
  var S = w.KTFigure.S, C = S.col, KP = w.KTPartner;
  function m() { var o = {}; for (var i = 0; i < arguments.length; i++) for (var k in arguments[i]) o[k] = arguments[i][k]; return o; }
  function cap(zh, en) { return { zh: zh, en: en }; }

  var X0 = 140, RED = '#C8372D', BLUE = '#2F5DA8';
  var LEGS = { x: X0, t: 22, h: -8, fN: { x: 26, y: 72 }, fF: { x: -30, y: 74 }, ftN: 90, ftF: 70, kbN: 1, kbF: 1, lift: 0, face: 1 };
  var HANDS = { su: 52, sl: 100, fu: 42, fl: 104, laN: 1 };      // wrestling stance: hands in front, elbows in
  var PH = { oa1: 52, oa2: 100, ob1: 42, ob2: 104 };
  var BASE = m(KP.base, PH, { hit: 0, ox: 240, ot: 20, oh: -6, ola: 26, olb: 6, ol: 26, olf: 14, olift: 0 });
  function P() { return m.apply(null, [BASE, LEGS, HANDS].concat([].slice.call(arguments))); }
  var DOWN = { ot: -88, oh: 0, ola: 88, olb: 92, ol: -88, olf: -92, oa1: 150, oa2: 130, ob1: 140, ob2: 120, olift: 0 };
  var UP = { ot: 88, oh: 0, ola: -88, olb: -92, ol: 88, olf: 92, oa1: 150, oa2: 130, ob1: 140, ob2: 120, olift: 0 };
  var FALL = { ot: -55, ola: 70, olb: 62, ol: -30, olf: -20, oa1: 120, oa2: 140, ob1: 110, ob2: 130, olift: 10 };
  // partner on hands and knees, facing left (par terre / referee's position bottom)
  var FOURS = { ot: 80, oh: -8, ola: 0, olb: -90, ol: 0, olf: -90, oa1: 0, oa2: 0, ob1: 0, ob2: 0, olift: 0 };
  // partner flat on their stomach, head to the left
  var FLAT = { ot: 88, oh: 0, ola: -86, olb: -90, ol: 86, olf: 90, oa1: 20, oa2: 60, ob1: 10, ob2: 50, olift: 0 };
  // you kneeling (relative targets: shins on the mat behind you)
  var KNEEL = { fN: { x: -36, y: 44 }, fF: { x: -40, y: 44 }, ftN: -90, ftF: -90 };
  // you on hands and knees
  var FOURS_ME = { t: 78, h: 10, fN: { x: -40, y: 44 }, fF: { x: -44, y: 44 }, ftN: -90, ftF: -90, su: 2, sl: 2, fu: -2, fl: -2 };

  var CLIPS = {
    stance: { hit: null, trail: 'head', frames: [
      { d: 900, p: P({ ox: 278 }), c: cap('雙腳比肩寬、膝蓋彎、背挺直、頭抬起，雙手在前、手肘貼身', 'Feet wider than the shoulders, knees bent, back straight, head up, hands in front with elbows in') },
      { d: 500, p: P({ ox: 278, x: X0 + 14 }), c: cap('小步移動：前腳先動、後腳跟上，兩腳不交叉', 'Move in short steps: lead foot first, back foot follows, feet never cross') },
      { d: 500, p: P({ ox: 278, x: X0 + 2 }), c: cap('往後也一樣：後腳先動', 'Same going back: back foot first') },
      { d: 600, p: P({ ox: 252, x: X0 + 8, su: 70, sl: 110, oa1: 70, oa2: 110 }), c: cap('手部攻防：控制對方的手腕和頭，同時保護自己的腳', 'Hand fighting: control their wrists and head while keeping your legs safe') },
      { d: 600, p: P({ ox: 256, x: X0 + 6 }), c: cap('保持站架，等待機會', 'Keep your stance and wait for an opening') }
    ] },
    double: { hit: 'hN', trail: 'head', frames: [
      { d: 700, p: P({ ox: 248 }), c: cap('站架，靠近對方', 'Stance, close to your partner') },
      { d: 260, p: P({ t: 30, h: -12, fN: { x: 24, y: 60 }, fF: { x: -28, y: 62 }, su: 55, sl: 90, fu: 45, fl: 95, ox: 232 }), c: cap('降低重心：彎膝、背挺直、眼睛向前', 'Level change: bend the knees, back straight, eyes forward') },
      { d: 300, p: P({ x: X0 + 30, t: 52, h: -22, fN: { x: -8, y: 50 }, ftN: 0, fF: { x: -76, y: 32 }, ftF: 10, su: 62, sl: 78, fu: 58, fl: 82, ox: 232 }), e: 'out', c: cap('穿透步：前膝跪到對方雙腳之間，頭貼對方身側', 'Penetration step: drop the lead knee between their feet, head tight to their side') },
      { d: 300, p: P({ x: X0 + 44, t: 42, h: -18, fN: { x: -8, y: 50 }, ftN: 0, fF: { x: -60, y: 40 }, ftF: 10, su: 60, sl: 80, fu: 56, fl: 84, ox: 240, ot: -40, ola: 40, hit: 1 }), c: cap('雙手抱住大腿後側，後腳跟上往前推', 'Grab behind both thighs, bring the back foot up and drive forward') },
      { d: 900, p: P(DOWN, KNEEL, { x: X0 + 105, t: 20, h: 0, ox: 230, hit: 0 }), c: cap('對方背部著地，你在上方控制 —— 摔倒得分', 'They go down on their back and you land on top in control — a takedown scores') }
    ] },
    sprawl: { hit: null, trail: 'hip', frames: [
      { d: 700, p: P({ ox: 240 }), c: cap('站架，看對方的髖部', 'Stance; watch their hips') },
      { d: 220, p: P({ ox: 206, ot: 55, oh: -20, oa1: 62, oa2: 50, ob1: 58, ob2: 46, ola: 70, olb: 0 }), c: cap('對方低身衝向你的腳', 'They shoot low for your legs') },
      { d: 260, p: P({ t: 78, h: -30, fN: { x: -62, y: 36 }, fF: { x: -72, y: 38 }, ftN: 10, ftF: 10, su: 40, sl: 70, fu: 35, fl: 75, ox: 212, ot: 72, oh: -10, oa1: 62, oa2: 50, ob1: 58, ob2: 46, ola: 80, olb: 0 }), e: 'out', c: cap('雙腳往後甩、髖部壓下，用體重壓在對方背上', 'Throw the legs back and drop the hips, putting your weight on their back') },
      { d: 700, p: P({ t: 78, h: -30, fN: { x: -62, y: 36 }, fF: { x: -72, y: 38 }, ftN: 10, ftF: 10, su: 40, sl: 70, fu: 35, fl: 75, ox: 212, ot: 72, oh: -10, oa1: 62, oa2: 50, ob1: 58, ob2: 46, ola: 80, olb: 0 }), c: cap('雙手壓住對方頭與肩，不讓對方抓到腳', 'Hands push down on their head and shoulders so they can\'t reach your legs') },
      { d: 600, p: P({ ox: 240 }), c: cap('站起來回到站架', 'Get back up to your stance') }
    ] },
    armdrag: { hit: 'hN', trail: 'hF', frames: [
      { d: 700, p: P({ ox: 248 }), c: cap('站架，雙方手部攻防', 'Stance, hand fighting') },
      { d: 400, p: P({ ox: 230, x: X0 + 4, su: 74, sl: 84, fu: 84, fl: 92, oa1: 80, oa2: 100 }), c: cap('後手抓對方手腕，前手抓對方上臂後側', 'Your rear hand takes their wrist, your lead hand grabs the back of their upper arm') },
      { d: 300, p: P({ ox: 214, x: X0 + 26, t: 18, su: 40, sl: 50, fu: 30, fl: 40, ot: 34, oh: 4, oa1: 40, oa2: 40, ola: 40, olb: 10, hit: 1 }), e: 'out', c: cap('把手臂往你身後拉過去，同時往前踏到對方側面', 'Drag the arm across and past you while you step forward to their side') },
      { d: 400, p: P({ face: -1, ox: 206, x: X0 + 104, t: 30, h: -6, su: 60, sl: 90, fu: 50, fl: 84, ot: 24, oa1: 30, oa2: 40 }), c: cap('繞到對方背後', 'Circle round behind them') },
      { d: 900, p: P({ face: -1, ox: 206, x: X0 + 98, t: 34, h: -6, su: 70, sl: 100, fu: 60, fl: 96, ot: 20, oa1: 30, oa2: 40 }), c: cap('雙手扣住對方腰部 —— 你拿到背了', 'Lock your hands round their waist — you have their back') }
    ] },
    bodylock: { hit: 'hN', trail: 'hip', frames: [
      { d: 700, p: P({ ox: 248 }), c: cap('古典式：只能用上半身，不能抓腿或絆腿', 'Greco-Roman: upper body only — no leg grabs or trips') },
      { d: 400, p: P({ ox: 220, x: X0 + 22, t: 10, h: 0, su: 84, sl: 102, fu: 88, fl: 98, ot: 10, oa1: 80, oa2: 120, ob1: 76, ob2: 116 }), c: cap('雙手從對方腋下穿過（雙下把），胸貼胸', 'Get both arms under their armpits (double underhooks), chest to chest') },
      { d: 400, p: P({ ox: 220, x: X0 + 22, t: -6, h: 4, su: 90, sl: 110, fu: 92, fl: 106, ot: 22, oa1: 80, oa2: 120, ob1: 76, ob2: 116, olift: 8, hit: 1 }), c: cap('雙手在對方背後扣緊，臀部往前、身體微微後仰把對方抱起', 'Lock your hands behind their back, hips in, and lean back a little to lift them') },
      { d: 320, p: P(FALL, { ox: 236, x: X0 + 40, t: 40, h: -10, su: 70, sl: 90, fu: 70, fl: 90 }), e: 'out', c: cap('往旁邊轉，帶著對方倒下', 'Turn to the side and take them down') },
      { d: 900, p: P(DOWN, KNEEL, { ox: 232, x: X0 + 106, t: 30, h: 0, su: 30, sl: 50, fu: 20, fl: 40 }), c: cap('你壓在上面 —— 從站立摔倒得 2 分以上', 'You land on top — a takedown from standing scores 2 points or more') }
    ] },
    gutwrench: { hit: 'hN', trail: 'hip', frames: [
      { d: 900, p: P(FOURS, KNEEL, { face: -1, ox: 190, x: 236, t: 64, h: 0, su: 20, sl: 70, fu: 10, fl: 60 }), c: cap('跪撐（par terre）：對方在下面雙手雙膝著地，你在上面', 'Par terre: they are on hands and knees underneath, you are on top') },
      { d: 500, p: P(FOURS, KNEEL, { face: -1, ox: 190, x: 232, t: 82, h: 0, su: 4, sl: 50, fu: -4, fl: 40 }), c: cap('胸口貼在對方背上，雙手在對方肚子下扣緊', 'Chest on their back, hands locked under their stomach') },
      { d: 400, p: P(KNEEL, { face: -1, ox: 194, x: 232, t: 60, h: 0, su: 20, sl: 80, fu: 10, fl: 70, ot: 70, ola: -40, olb: -60, ol: 40, olf: 60, oa1: 120, oa2: 140, ob1: 110, ob2: 130, olift: 6, hit: 1 }), e: 'out', c: cap('抬起對方的髖部，往側面翻過去', 'Lift their hips and roll them over to the side') },
      { d: 900, p: P(UP, KNEEL, { face: -1, ox: 176, x: 236, t: 50, h: 0, su: 30, sl: 70, fu: 20, fl: 60 }), c: cap('對方背部翻過墊子 —— 自由式和古典式得 2 分，可以繼續翻', 'Their back crosses the mat — 2 points in freestyle and Greco-Roman, and you can keep rolling') }
    ] },
    standup: { hit: null, trail: 'head', frames: [
      { d: 900, p: P(FOURS_ME, { face: -1, x: 200, ox: 236, ot: 70, oh: -10, ola: 0, olb: -90, ol: 0, olf: -90, oa1: 10, oa2: -10, ob1: 0, ob2: -20 }), c: cap('裁判位置：你在下面雙手雙膝著地，對方在上面', 'Referee\'s position: you are on hands and knees underneath, they are on top') },
      { d: 500, p: P({ face: -1, x: 196, t: 30, h: -6, fN: { x: 18, y: 80 }, fF: { x: -40, y: 44 }, ftN: 90, ftF: -90, su: 30, sl: 60, fu: 20, fl: 50, ox: 236, ot: 60, oh: -10, ola: 0, olb: -90, ol: 0, olf: -90, oa1: 20, oa2: 0, ob1: 10, ob2: -10 }), c: cap('外側腳踩地，抬起胸口，頭往後靠向對方', 'Step your outside foot up, lift your chest and drive your head back into them') },
      { d: 500, p: P({ face: -1, x: 200, t: 2, h: 0, fN: { x: 16, y: 80 }, fF: { x: -20, y: 80 }, su: 20, sl: 70, fu: 10, fl: 60, ox: 230, ot: 30, oh: 0, ola: 20, olb: 6, ol: 20, olf: 12, oa1: 60, oa2: 70, ob1: 50, ob2: 60 }), c: cap('站起來，雙手控制對方扣在你腰上的手', 'Stand up while your hands control the hands round your waist') },
      { d: 900, p: P({ face: 1, x: 176, ox: 284, ot: 20, oa1: 52, oa2: 100, ob1: 42, ob2: 104, ola: 26, olb: 6, ol: 26, olf: 14 }), c: cap('撥開對方的手，轉身面對對方 —— 逃脫得 1 分', 'Peel their hands off and turn to face them — an escape scores 1 point') }
    ] },
    halfnelson: { hit: 'hN', trail: 'hN', frames: [
      { d: 900, p: P(FLAT, KNEEL, { face: -1, ox: 170, x: 222, t: 60, h: 0, su: 20, sl: 60, fu: 10, fl: 50 }), c: cap('對方趴在地上，你在對方身側上方', 'They are flat on their stomach; you are on top at their side') },
      { d: 600, p: P(FLAT, KNEEL, { face: -1, ox: 170, x: 220, t: 74, h: 0, su: 30, sl: 140, fu: 10, fl: 50 }), c: cap('半扣頸：手臂從對方腋下穿過，手掌放在對方後頸', 'Half nelson: slide your arm under their armpit and put your hand on the back of their neck') },
      { d: 500, p: P(KNEEL, { face: -1, ox: 168, x: 214, t: 70, h: 0, su: 40, sl: 150, fu: 20, fl: 60, ot: 88, ola: -70, olb: -80, ol: 70, olf: 80, oa1: 90, oa2: 120, ob1: 80, ob2: 110, olift: 10, hit: 1 }), e: 'out', c: cap('把對方的頭往外壓，往對方頭的方向移動，直到對方翻過來', 'Lever their head away and walk towards it until they roll onto their back') },
      { d: 1000, p: P(UP, KNEEL, { face: -1, ox: 176, x: 222, t: 84, h: 0, su: 20, sl: 120, fu: 10, fl: 60 }), c: cap('胸貼胸，把對方雙肩壓在墊上 —— 壓制（fall）直接獲勝', 'Chest on chest with both their shoulders held to the mat — a pin (fall) wins the match') }
    ] }
  };

  // singlet: a coloured band over the torso, plus a belt-line dot
  function singlet(J, col, sc) {
    return S.poly([J.hip, J.sh], col, 9.5 * sc) + S.circle(J.hip, 4 * sc, col, '#fff', 1.2);
  }

  function makeClip(s, view, level, lang) {
    var src = CLIPS[s.id], pace = level < 1 ? 1.8 : 1;
    return {
      scale: 0.88, base: { x: X0 }, cx: X0, ticks: false, labelAt: [292, 26], still: 0.5,
      trail: src.trail || null,
      frames: src.frames.map(function (f) { return { d: Math.round(f.d * pace), p: f.p, e: f.e, c: f.c }; }),
      props: function (J, c) {
        var sc = c.scale;
        var o = KP.draw(J, c, { cx: X0 }), back = o.svg + singlet(o.O, BLUE, sc), fr = singlet(J, RED, sc), hud = '';
        if (src.hit && c.pose.hit > 0.15) {
          fr += KP.hit(J[src.hit], c.pose.hit);
          if (c.pose.hit > 0.6) hud += S.text(18, 30, KT.pick('接觸點：', 'CONTACT: ') + KT.t(s.contact), { size: 12, fill: C.red, family: "'JetBrains Mono','Noto Sans TC',monospace" });
        }
        return { back: back, front: fr, hud: hud };
      }
    };
  }

  var ALL = { zh: '三種式樣', en: 'All three styles' }, FS = { zh: '自由式 · 美式學生', en: 'Freestyle · folkstyle' };
  var LIST = [
    { id: 'stance', n: 1, zh: '站架與移動', py: 'Freestyle · Greco-Roman · Folkstyle', en: 'Stance and Motion',
      type: { zh: '基本', en: 'Foundation' }, contact: { zh: '手腕與頭', en: 'Wrists and head' }, phase: { zh: '站立', en: 'Standing' }, style: ALL,
      tags: { zh: ['所有摔跤的起點', '低、穩、頭抬起'], en: ['Where all wrestling starts', 'Low, balanced, head up'] },
      ability: { zh: '平衡與步法', en: 'Balance and footwork' },
      note: { zh: '膝彎 · 背直 · 頭抬起 · 兩腳不交叉', en: 'KNEES BENT · BACK STRAIGHT · HEAD UP · FEET NEVER CROSS' },
      how: { zh: '雙腳比肩寬、一腳略前，膝蓋彎、背挺直、頭抬起，重心在兩腳中間。雙手在前、手肘貼身，保護自己的腳。移動用小步：往前時前腳先動、後腳跟上，往後時後腳先動，兩腳不交叉。雙方靠近時用手控制對方的手腕和頭，這叫手部攻防。',
        en: 'Feet wider than the shoulders with one slightly ahead, knees bent, back straight, head up and weight between both feet. Hands in front with the elbows in to protect your legs. Move in short steps: forward, the lead foot goes first and the back foot follows; backward, the back foot goes first; the feet never cross. Up close, use your hands to control their wrists and head — hand fighting.' },
      mistakes: { zh: '彎腰低頭（容易被壓頭或抱腿）；雙腳站成一直線；兩腳交叉移動；手臂張開讓對方抓到下把。', en: 'Bending at the waist with the head down (easy to snap down or shoot on); feet in one line; crossing the feet; arms wide so they get underhooks.' },
      practice: { zh: '跟著教練口令前後左右移動 3 × 1 分鐘，再和夥伴做 3 × 1 分鐘手部攻防（不摔）。', en: 'Move forward, back and to the sides on a coach\'s call for 3 × 1 minute, then hand-fight with a partner for 3 × 1 minute without shooting.' },
      use: { zh: '好的站架讓你能進攻也能防守；三種式樣都從這裡開始。', en: 'A good stance lets you attack and defend; all three styles start here.' },
      bars: [['平衡', 'Balance', 92], ['步法', 'Footwork', 88], ['姿勢', 'Posture', 86], ['手部攻防', 'Hand fighting', 80]] },

    { id: 'double', n: 2, zh: '雙腿抱摔', py: 'Freestyle · Folkstyle', en: 'Double-Leg Takedown',
      type: { zh: '摔', en: 'Takedown' }, contact: { zh: '雙手抱大腿後側', en: 'Hands behind both thighs' }, phase: { zh: '站立 → 地面', en: 'Standing → ground' }, style: FS,
      tags: { zh: ['摔跤最經典的摔法', '降重心 → 穿透 → 推'], en: ['Wrestling\'s classic takedown', 'Level change → penetrate → drive'] },
      ability: { zh: '爆發力與降重心', en: 'Explosiveness and level change' },
      note: { zh: '降重心 · 穿透步 · 頭貼身側 · 往前推', en: 'LEVEL CHANGE · PENETRATION STEP · HEAD TO THE SIDE · DRIVE' },
      how: { zh: '先彎膝降低重心（背挺直、眼睛向前），然後跨出穿透步，前膝跪到對方雙腳之間，頭貼在對方身側。雙手抱住對方兩腿的大腿後側，後腳跟上，用腳往前推，把對方推倒在背上，你在上方控制。古典式不能抓腿，所以這是自由式和美式學生摔跤的技術。',
        en: 'Bend the knees to drop your level with a straight back and eyes forward, then take a penetration step: drop the lead knee between their feet with your head tight to their side. Wrap both hands behind their thighs, bring the back foot up and drive forward off your feet, putting them on their back with you on top. Greco-Roman bans leg attacks, so this is a freestyle and folkstyle move.' },
      mistakes: { zh: '彎腰低頭衝（容易被防摔壓住）；從太遠的距離出手；頭放在對方身體正前方；抱到腿後停下不推。', en: 'Diving with the waist bent and head down (easy to sprawl on); shooting from too far; head in the middle of their chest; stopping once you have the legs instead of driving.' },
      practice: { zh: '在軟墊上練穿透步 3 × 10 次，再和夥伴慢速完整練習左右各 5 次，夥伴做好倒地。', en: 'On mats, practise penetration steps 3 × 10, then slow full reps with a partner, 5 to each side, with your partner falling safely.' },
      use: { zh: '摔倒在自由式和古典式得 2 分；美式高中規則（NFHS）從 2024–25 季起改為 3 分。', en: 'A takedown scores 2 points in freestyle and Greco-Roman; US high-school (NFHS) rules raised it to 3 points from the 2024–25 season.' },
      bars: [['爆發力', 'Explosiveness', 92], ['降重心', 'Level change', 90], ['推進', 'Drive', 88], ['時機', 'Timing', 80]] },

    { id: 'sprawl', n: 3, zh: '防摔下壓', py: 'Freestyle · Greco-Roman · Folkstyle', en: 'Sprawl',
      type: { zh: '防守', en: 'Defence' }, contact: { zh: '髖部壓在對方背上', en: 'Hips on their back' }, phase: { zh: '站立', en: 'Standing' }, style: ALL,
      tags: { zh: ['擋下抱腿的第一反應', '腳往後甩、髖壓下'], en: ['The first answer to a leg attack', 'Legs back, hips down'] },
      ability: { zh: '反應與髖部力量', en: 'Reaction and hip strength' },
      note: { zh: '看髖部 · 腳往後甩 · 髖壓下 · 手壓頭', en: 'WATCH THE HIPS · LEGS BACK · HIPS DOWN · HANDS ON THE HEAD' },
      how: { zh: '保持站架，看對方的髖部而不是手。對方低身衝向你的腳時，雙腳往後甩開，髖部往下壓在對方的背上或頭上，用體重壓住對方。雙手壓住對方的頭和肩，讓對方抓不到你的腳，然後站起來回到站架，或繞到對方背後。',
        en: 'Hold your stance and watch their hips, not their hands. When they shoot low for your legs, throw your legs back and drop your hips onto their back or head, putting your weight on them. Push down on their head and shoulders so they can\'t reach your legs, then get back up to your stance or circle behind them.' },
      mistakes: { zh: '只把上身往前倒、腳沒往後甩；反應太慢，對方已經抱到腳；壓下後膝蓋跪地（對方還能抱腿）；壓完待在原地不動。', en: 'Falling forward with the upper body while the legs stay put; reacting too late; landing on your knees (they can still grab the legs); staying there after the sprawl.' },
      practice: { zh: '夥伴慢速做穿透步，你練防摔下壓 3 × 10 次，再加上繞到背後。', en: 'Your partner shoots slowly while you sprawl 3 × 10, then add circling behind them.' },
      use: { zh: '對方的抱腿被擋下時，你常常可以繞到背後反摔得分。', en: 'Stopping a shot often lets you circle behind and score a takedown of your own.' },
      bars: [['反應', 'Reaction', 92], ['髖部力量', 'Hip strength', 88], ['平衡', 'Balance', 85], ['時機', 'Timing', 82]] },

    { id: 'armdrag', n: 4, zh: '拉臂繞背', py: 'Freestyle · Greco-Roman · Folkstyle', en: 'Arm Drag to the Back',
      type: { zh: '上身技術', en: 'Upper-body move' }, contact: { zh: '手腕與上臂', en: 'Wrist and upper arm' }, phase: { zh: '站立', en: 'Standing' }, style: ALL,
      tags: { zh: ['三種式樣都能用', '把對方拉過去、自己繞過去'], en: ['Works in all three styles', 'Drag them past, go round them'] },
      ability: { zh: '速度與角度', en: 'Speed and angles' },
      note: { zh: '抓腕 · 抓上臂 · 往身後拉 · 繞到背後', en: 'WRIST · UPPER ARM · DRAG PAST · CIRCLE BEHIND' },
      how: { zh: '手部攻防時，用後手抓住對方同側的手腕，前手抓住對方上臂的後側。把對方的手臂往你身後拉過去，同時往前踏到對方側面。對方被拉得往前失去平衡時，繞到對方背後，雙手扣住對方腰部。拿到背後是摔倒得分的好位置。',
        en: 'While hand fighting, take their wrist with your rear hand and grab the back of their upper arm with your lead hand. Drag the arm across and past you as you step forward to their side. As the drag pulls them forward off balance, circle round behind them and lock your hands round their waist. From the back you are in a great position to score a takedown.' },
      mistakes: { zh: '只用手拉，腳沒踏出去；拉的方向往下而不是往你身後；抓手腕太鬆；繞到背後太慢。', en: 'Pulling with the arms while the feet stay still; pulling down instead of past you; a loose grip on the wrist; circling behind too slowly.' },
      practice: { zh: '和夥伴輪流做拉臂繞背，左右各 10 次，先慢後快。', en: 'Take turns arm-dragging to the back with a partner, 10 times to each side, slowly at first and then faster.' },
      use: { zh: '古典式不能攻擊下半身，拉臂繞背是最常用的進攻之一；在自由式也能接抱單腿或雙腿。', en: 'In Greco-Roman, where the legs are off limits, the arm drag is one of the main attacks; in freestyle it also sets up leg attacks.' },
      bars: [['速度', 'Speed', 90], ['角度', 'Angles', 88], ['抓握', 'Gripping', 85], ['步法', 'Footwork', 84]] },

    { id: 'bodylock', n: 5, zh: '抱腰摔（古典式）', py: 'Greco-Roman', en: 'Greco-Roman Body Lock',
      type: { zh: '摔', en: 'Takedown' }, contact: { zh: '雙手在對方背後扣緊', en: 'Hands locked behind their back' }, phase: { zh: '站立 → 地面', en: 'Standing → ground' }, style: { zh: '古典式', en: 'Greco-Roman' },
      tags: { zh: ['古典式只用上半身', '雙下把 → 扣手 → 抱起 → 轉'], en: ['Greco-Roman is upper body only', 'Underhooks → lock → lift → turn'] },
      ability: { zh: '上身力量與髖部', en: 'Upper-body strength and hips' },
      note: { zh: '雙下把 · 胸貼胸 · 扣手 · 髖往前', en: 'DOUBLE UNDERHOOKS · CHEST TO CHEST · LOCK · HIPS IN' },
      how: { zh: '古典式摔跤只能攻擊腰部以上，不能抓腿也不能絆腿。靠近對方，雙手從對方腋下穿過（雙下把），胸貼胸，雙手在對方背後扣緊。臀部往前貼近、身體微微後仰，把對方抱離地面，然後往旁邊轉，帶著對方倒下，你壓在上面。',
        en: 'Greco-Roman wrestling allows attacks only above the waist — no grabbing or tripping the legs. Close in and get both arms under their armpits (double underhooks), chest to chest, and lock your hands behind their back. Bring your hips in tight and lean back a little to lift them off the mat, then turn to the side and take them down, landing on top.' },
      mistakes: { zh: '用手臂拉而不是髖部貼近（抱不起來）；扣手的位置太高；彎腰抱（傷背）；摔的時候放手。', en: 'Pulling with the arms instead of bringing the hips in (you can\'t lift); locking the hands too high; lifting with a rounded back (hurts your back); letting go during the throw.' },
      practice: { zh: '和夥伴練「雙下把 + 扣手 + 抱起一點」3 × 8 次，完整摔只在軟墊上、在教練指導下做。', en: 'Drill underhooks, lock and a small lift with a partner, 3 × 8; do full throws only on mats with a coach.' },
      use: { zh: '大幅度的抱摔在自由式和古典式可以得到比普通摔倒更多的分數。', en: 'Big, high-amplitude throws can score more than an ordinary takedown in freestyle and Greco-Roman.' },
      bars: [['上身力量', 'Upper-body strength', 90], ['髖部', 'Hips', 88], ['抓握', 'Gripping', 85], ['平衡', 'Balance', 82]] },

    { id: 'gutwrench', n: 6, zh: '抱腹翻', py: 'Freestyle · Greco-Roman', en: 'Gut Wrench',
      type: { zh: '地面翻轉', en: 'Turn' }, contact: { zh: '雙手扣在對方肚子下', en: 'Hands locked under their stomach' }, phase: { zh: '地面（上位）', en: 'Ground (top)' }, style: { zh: '自由式 · 古典式', en: 'Freestyle · Greco-Roman' },
      tags: { zh: ['跪撐位置得分', '每翻一圈得 2 分'], en: ['Scores from par terre', '2 points for each roll'] },
      ability: { zh: '核心與控制', en: 'Core and control' },
      note: { zh: '胸貼背 · 雙手扣緊 · 抬髖 · 側翻', en: 'CHEST ON BACK · HANDS LOCKED · LIFT THE HIPS · ROLL' },
      how: { zh: '在跪撐（par terre）時，對方在下面雙手雙膝著地，你在上面。胸口貼在對方背上，雙手在對方肚子下扣緊。抬起對方的髖部，往側面翻過去，讓對方的背部翻過墊子。在自由式和古典式，每讓對方背部翻過一次就得 2 分，可以連續翻。',
        en: 'In par terre your partner is on hands and knees underneath and you are on top. Put your chest on their back and lock your hands under their stomach. Lift their hips and roll them over to the side so their back crosses the mat. In freestyle and Greco-Roman each time their back is turned over the mat scores 2 points, and you can keep rolling.' },
      mistakes: { zh: '扣手的位置太低（在髖部而不是肚子）；只用手拉不用身體；胸口離開對方的背；翻到一半停下。', en: 'Locking the hands too low (on the hips, not the stomach); pulling with the arms instead of the whole body; chest coming off their back; stopping halfway.' },
      practice: { zh: '夥伴在下面放鬆配合，你練抱腹翻左右各 8 次，再讓夥伴輕微抵抗。', en: 'With your partner relaxed underneath, practise the gut wrench 8 times to each side, then with light resistance.' },
      use: { zh: '跪撐時的翻轉是快速得分的主要方法，連續翻幾次就能拉開比分。', en: 'Turns from par terre are a main way to score quickly — a few rolls in a row can open up the score.' },
      bars: [['核心', 'Core', 90], ['控制', 'Control', 88], ['抓握', 'Gripping', 85], ['爆發力', 'Explosiveness', 80]] },

    { id: 'standup', n: 7, zh: '站立逃脫', py: 'Folkstyle', en: 'Stand-Up Escape',
      type: { zh: '逃脫', en: 'Escape' }, contact: { zh: '控制對方的手', en: 'Control their hands' }, phase: { zh: '地面（下位）→ 站立', en: 'Ground (bottom) → standing' }, style: { zh: '美式學生', en: 'Folkstyle' },
      tags: { zh: ['美式學生摔跤的基本逃脫', '逃脫得 1 分'], en: ['Folkstyle\'s basic escape', 'An escape scores 1 point'] },
      ability: { zh: '爆發力與手部控制', en: 'Explosiveness and hand control' },
      note: { zh: '踩腳 · 抬胸 · 頭往後 · 控手 · 轉身', en: 'FOOT UP · CHEST UP · HEAD BACK · HANDS · TURN' },
      how: { zh: '美式學生摔跤的裁判位置：你在下面雙手雙膝著地，對方在上面。哨聲一響，外側的腳往前踩地，抬起胸口，頭往後靠向對方。站起來的同時，雙手控制對方扣在你腰上的手。撥開對方的手，轉身面對對方，這就是逃脫，得 1 分。',
        en: 'Folkstyle starts some periods in the referee\'s position: you on hands and knees underneath, your partner on top. On the whistle, step your outside foot up, lift your chest and drive your head back into them. Stand up while your hands control the hands locked round your waist. Peel their hands off and turn to face them — that is an escape, worth 1 point.' },
      mistakes: { zh: '往前站而不是往後靠（對方把你拉回去）；站起來時雙手不控制對方的手；轉身太早；頭往下看。', en: 'Standing forward instead of back into them (they pull you back down); not controlling their hands as you rise; turning too early; looking down.' },
      practice: { zh: '從裁判位置練站立逃脫 3 × 8 次，夥伴從不抵抗到輕微抵抗。', en: 'Drill the stand-up from the referee\'s position, 3 × 8, with your partner going from no resistance to light resistance.' },
      use: { zh: '美式學生摔跤中，被壓在下面時能快速逃脫，是贏得比賽的關鍵之一。', en: 'In folkstyle, escaping quickly from the bottom is one of the keys to winning.' },
      bars: [['爆發力', 'Explosiveness', 88], ['手部控制', 'Hand control', 88], ['平衡', 'Balance', 85], ['時機', 'Timing', 82]] },

    { id: 'halfnelson', n: 8, zh: '半扣頸壓制', py: 'Folkstyle', en: 'Half Nelson to a Pin',
      type: { zh: '壓制', en: 'Pin' }, contact: { zh: '手掌在對方後頸', en: 'Hand on the back of their neck' }, phase: { zh: '地面（上位）', en: 'Ground (top)' }, style: { zh: '美式學生', en: 'Folkstyle' },
      tags: { zh: ['最基本的壓制技術', '雙肩著地 = 直接獲勝'], en: ['The most basic pinning move', 'Both shoulders down = match over'] },
      ability: { zh: '控制與壓力', en: 'Control and pressure' },
      note: { zh: '手穿腋下 · 掌放後頸 · 往頭的方向走 · 胸貼胸', en: 'ARM UNDER · HAND ON NECK · WALK TO HEAD · CHEST DOWN' },
      how: { zh: '對方趴在地上，你在對方身側上方。手臂從對方腋下穿過，手掌放在對方後頸，這就是半扣頸。把對方的頭往外壓，同時往對方頭的方向移動，對方的手臂被撬起、身體會翻過來。對方翻成背部著地後，胸貼胸壓住，讓對方雙肩貼在墊上，這叫壓制（fall），直接獲勝。',
        en: 'With them flat on their stomach, get on top at their side. Slide your arm under their armpit and put your hand on the back of their neck — the half nelson. Lever their head away from you while you walk towards their head; their arm is pried up and they roll over. Once they are on their back, go chest to chest and hold both their shoulders to the mat. That is a pin, or fall, and it wins the match.' },
      mistakes: { zh: '手只穿到一半（沒有槓桿）；往對方的腳走而不是頭；扭對方的脖子（危險而且犯規）；翻過來後胸口沒壓住。', en: 'Only getting the arm in halfway (no leverage); walking towards their feet instead of their head; cranking the neck (dangerous and illegal); not getting chest to chest once they turn.' },
      practice: { zh: '夥伴趴著放鬆配合，你練半扣頸翻轉左右各 8 次，翻過來後保持壓制 5 秒。', en: 'With your partner relaxed on their stomach, practise the half nelson turn 8 times to each side and hold the pin for 5 seconds each time.' },
      use: { zh: '壓制不論比分多少都直接結束比賽，是摔跤最高的目標。', en: 'A pin ends the match whatever the score — the highest goal in wrestling.' },
      bars: [['控制', 'Control', 92], ['壓力', 'Pressure', 88], ['槓桿', 'Leverage', 85], ['耐心', 'Patience', 78]] }
  ];

  w.WRESTLING = { LIST: LIST, makeClip: makeClip };
})(window);
