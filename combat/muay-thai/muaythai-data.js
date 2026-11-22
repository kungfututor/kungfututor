/* Muay Thai basics — 10 techniques of the "art of eight limbs": stance,
 * jab, cross, teep, roundhouse kick, low kick, elbow, clinch, knee and check.
 * Side view; the grey figure (kt-partner.js) is the opponent. Our own wording
 * of widely taught Muay Thai fundamentals.
 */
(function (w) {
  'use strict';
  var S = w.KTFigure.S, C = S.col, KP = w.KTPartner, D2R = Math.PI / 180;
  function m() { var o = {}; for (var i = 0; i < arguments.length; i++) for (var k in arguments[i]) o[k] = arguments[i][k]; return o; }
  function cap(zh, en) { return { zh: zh, en: en }; }
  var sin = function (a) { return Math.sin(a * D2R); }, cos = function (a) { return Math.cos(a * D2R); };

  var X0 = 140;
  var LEGS = { x: X0, t: 0, h: 4, fN: { x: 20, y: 86 }, fF: { x: -22, y: 85 }, ftN: 90, ftF: 72, kbN: 1, kbF: 1 };
  var GUARD = { su: 65, sl: 188, fu: 55, fl: 192 };
  var BASE = m(KP.base, { hit: 0, oa1: 62, oa2: 186, ob1: 52, ob2: 190, ola: 14, olb: 4, ol: 16 });  // opponent also in a guard
  function P() { return m.apply(null, [BASE, LEGS, GUARD].concat([].slice.call(arguments))); }

  // clinch: both hands cupped behind the opponent's head (targets relative to the hip)
  function clinchHands(ox, ot, t) {
    var hx = ox - X0 - 74 * sin(ot) + 6, hy = -74 * cos(ot) + 8;
    return { hN: { x: hx, y: hy }, hF: { x: hx - 3, y: hy + 2 }, t: t || 0 };
  }
  // the same high guard written as hand targets (for clips whose arms use targets)
  function guardHands(t) {
    var sx = 58 * sin(t), sy = -58 * cos(t);
    return { hN: { x: sx + 23, y: sy - 15 }, hF: { x: sx + 19, y: sy - 10 }, t: t };
  }

  var CLIPS = {
    stance: { hit: null, frames: [
      { d: 900, p: P({ ox: 268 }), c: cap('雙腳約與肩同寬前後站，重心偏後腳', 'Feet about shoulder-width, one in front of the other, weight mostly on the back leg') },
      { d: 500, p: P({ x: X0 + 6, fN: { x: 20, y: 84 }, ftN: 78, ox: 268 }), c: cap('前腳輕點地，隨時可提起來防守或前蹬', 'The lead foot stays light, ready to lift for a check or a teep') },
      { d: 900, p: P({ ox: 268 }), c: cap('雙手護在眉前、手肘收緊、下巴微收', 'Hands up by the brows, elbows tight, chin tucked') }
    ] },
    jab: { hit: 'hN', trail: 'hN', frames: [
      { d: 700, p: P({ ox: 218 }), c: cap('站架', 'Stance') },
      { d: 150, p: P({ ox: 218 }), e: 'in' },
      { d: 320, p: P({ x: X0 + 5, t: 6, su: 90, sl: 90, ox: 218, ot: -7, oh: -10, hit: 1 }), e: 'out', c: cap('前手直線打出，肩膀護住下巴', 'Snap the lead hand straight out, shoulder up to protect the chin') },
      { d: 500, p: P({ ox: 220 }), c: cap('原路收回護臉', 'Bring it straight back to guard the face') }
    ] },
    cross: { hit: 'hF', trail: 'hF', frames: [
      { d: 700, p: P({ ox: 218 }), c: cap('站架', 'Stance') },
      { d: 150, p: P({ ox: 218 }), e: 'in' },
      { d: 340, p: P({ t: 16, fu: 92, fl: 90, fF: { x: -18, y: 84 }, ftF: 40, ox: 218, ot: -8, oh: -12, hit: 1 }), e: 'out', c: cap('後腳跟轉起、轉髖轉肩，後手直拳打出', 'Turn the back heel, hips and shoulders and drive the rear hand straight out') },
      { d: 500, p: P({ ox: 220 }), c: cap('收回，前手一直護臉', 'Return — the lead hand guards the face the whole time') }
    ] },
    teep: { hit: 'aN', trail: 'aN', frames: [
      { d: 700, p: P({ ox: 236 }), c: cap('站架，對方逼近', 'Stance; the opponent steps in') },
      { d: 220, p: P({ t: -6, fN: { x: 32, y: 38 }, ftN: 125, ox: 236 }), c: cap('前腳提膝', 'Lift the lead knee') },
      { d: 260, p: P({ t: -14, fN: { x: 82, y: 22 }, ftN: 178, ox: 240, ot: -10, hit: 1 }), e: 'out', c: cap('髖部前推，用前腳掌把對方推開', 'Push the hips forward and drive the ball of the foot into their stomach') },
      { d: 260, p: P({ t: -6, fN: { x: 32, y: 38 }, ftN: 125, ox: 262, ot: -6 }), c: cap('收腿回提膝', 'Re-chamber the knee') },
      { d: 600, p: P({ ox: 262 }), c: cap('落回站架，距離拉開了', 'Back to stance with the distance restored') }
    ] },
    kick: { hit: 'shinF', trail: 'aF', frames: [
      { d: 700, p: P({ ox: 222 }), c: cap('站架', 'Stance') },
      { d: 180, p: P({ t: -8, fF: { x: 6, y: 50 }, ftF: 40, fu: -20, fl: -10, ftN: 60, ox: 222 }), c: cap('前腳腳尖外轉，後腿往前上方甩起', 'Pivot on the lead foot (toes turn out) and swing the rear leg up') },
      { d: 160, p: P({ t: -32, h: 22, fF: { x: 78, y: 12 }, ftF: 95, fu: -60, fl: -40, ftN: 60, ox: 222, ot: -6, hit: 1 }), e: 'out', c: cap('轉髖，用小腿脛骨踢中對方身體；後手往下往後擺', 'Turn the hip over and land with the shin on the body; the rear arm swings down and back') },
      { d: 260, p: P({ t: -12, fF: { x: 20, y: 45 }, ftF: 40, fu: -20, fl: -10, ox: 228 }), c: cap('順勢收回', 'Let the leg come back') },
      { d: 600, p: P({ ox: 228 }), c: cap('回到站架，雙手護頭', 'Back to stance, hands up') }
    ] },
    lowkick: { hit: 'shinF', trail: 'aF', frames: [
      { d: 700, p: P({ ox: 222 }), c: cap('站架', 'Stance') },
      { d: 180, p: P({ t: -6, fF: { x: 4, y: 58 }, ftF: 40, fu: -15, fl: -5, ftN: 60, ox: 222 }), c: cap('轉前腳、後腿往前甩', 'Pivot the lead foot and swing the rear leg') },
      { d: 160, p: P({ t: -16, h: 12, fF: { x: 70, y: 52 }, ftF: 100, fu: -45, fl: -30, ftN: 60, ox: 222, ola: 22, olb: -8, hit: 1 }), e: 'out', c: cap('用脛骨往下斜踢對方大腿外側', 'Chop down with the shin into the outside of their thigh') },
      { d: 260, p: P({ t: -6, fF: { x: 10, y: 55 }, ftF: 40, ox: 224 }), c: cap('收腿', 'Recover the leg') },
      { d: 600, p: P({ ox: 224 }), c: cap('回到站架', 'Back to stance') }
    ] },
    elbow: { hit: 'eN', trail: 'eN', frames: [
      { d: 700, p: P({ ox: 194 }), c: cap('近距離，對方在手臂範圍內', 'Close range — the opponent is inside punching distance') },
      { d: 230, p: P({ su: -25, sl: 70, ox: 194 }), c: cap('前手手肘往後收、準備轉身', 'Draw the lead elbow back and load the hips') },
      { d: 250, p: P({ su: 96, sl: -70, t: 18, ftF: 50, ox: 194, ot: -7, oh: -18, hit: 1 }), e: 'out', c: cap('轉髖，手肘水平劃過對方臉側', 'Turn the hips and slice the elbow level across the side of the face') },
      { d: 600, p: P({ ox: 198 }), c: cap('回到護頭', 'Back to the guard') }
    ] },
    clinch: { hit: null, trail: 'hN', frames: [
      { d: 700, p: P(guardHands(0), { ox: 205 }), c: cap('對方靠得很近', 'The opponent is chest to chest') },
      { d: 420, p: P(clinchHands(205, 5), { ox: 205, ot: 5 }), c: cap('雙手從內側伸上去，交疊扣在對方後腦', 'Slide both hands up the inside and cup them, one over the other, behind their head') },
      { d: 600, p: P(clinchHands(205, 24, -4), { ox: 205, ot: 24, oh: 12, oa1: 50, oa2: 30 }), c: cap('手肘夾緊對方鎖骨，把頭往下拉', 'Squeeze the elbows together on their collarbones and pull the head down') },
      { d: 900, p: P(clinchHands(205, 24, -4), { ox: 205, ot: 24, oh: 12, oa1: 50, oa2: 30 }), c: cap('保持控制，對方失去平衡', 'Hold the control — they lose their posture and balance') }
    ] },
    knee: { hit: 'kF', trail: 'kF', frames: [
      { d: 700, p: P(clinchHands(205, 24, -4), { ox: 205, ot: 24, oh: 12, oa1: 50, oa2: 30 }), c: cap('在箍頸中控制對方的頭', 'Control the head in the clinch') },
      { d: 200, p: P(clinchHands(205, 28, -6), { fF: { x: -30, y: 80 }, ox: 205, ot: 28, oh: 12, oa1: 50, oa2: 30 }), c: cap('後腿往後拉開、準備', 'Draw the rear leg back to load') },
      { d: 240, p: P(clinchHands(205, 30, -12), { fF: { x: 30, y: 26 }, ftF: 10, ox: 205, ot: 30, oh: 14, oa1: 50, oa2: 30, hit: 1 }), e: 'out', c: cap('髖部往前推，膝蓋向前上方頂入腹部', 'Drive the hips forward and the knee up and in to the stomach') },
      { d: 600, p: P(clinchHands(205, 24, -4), { ox: 205, ot: 24, oh: 12, oa1: 50, oa2: 30 }), c: cap('收腿，保持箍頸', 'Return the leg, keep the clinch') }
    ] },
    check: { hit: 'shinN', trail: null, frames: [
      { d: 700, p: P({ ox: 232 }), c: cap('站架，看對方的髖部', 'Stance; watch their hips') },
      { d: 200, p: P({ ox: 232, ola: 40, olb: 20, ot: 6 }), c: cap('對方起腿低踢', 'They start a low kick') },
      { d: 200, p: P({ t: -2, fN: { x: 28, y: 46 }, ftN: 115, ox: 232, ola: 66, olb: 78, ot: 14, hit: 1 }), e: 'out', c: cap('前腳提膝外翻，用脛骨擋住', 'Lift the lead knee, turn it out and block with the shin') },
      { d: 300, p: P({ t: -2, fN: { x: 28, y: 46 }, ftN: 115, ox: 236, ola: 30, olb: 10, ot: 4 }), c: cap('雙手保持護頭', 'Hands stay up the whole time') },
      { d: 600, p: P({ ox: 236 }), c: cap('落腳，準備反擊', 'Plant the foot, ready to fire back') }
    ] }
  };

  function makeClip(s, view, level, lang) {
    var src = CLIPS[s.id], pace = level < 1 ? 1.8 : 1;
    return {
      scale: 0.88, base: { x: X0 }, cx: X0, ticks: false, labelAt: [350, 28], still: 0.5,
      trail: src.trail || null,
      frames: src.frames.map(function (f) { return { d: Math.round(f.d * pace), p: f.p, e: f.e, c: f.c }; }),
      props: function (J, c) {
        var o = KP.draw(J, c, { cx: X0 }), fr = '', hud = '';
        if (src.hit && c.pose.hit > 0.15) {
          var pt = src.hit === 'shinF' ? S.mid(J.kF, J.aF, 0.6) : src.hit === 'shinN' ? S.mid(J.kN, J.aN, 0.5) : J[src.hit];
          fr += KP.hit(pt, c.pose.hit);
          if (c.pose.hit > 0.6) hud += S.text(18, 30, (KT.pick('接觸點：', 'CONTACT: ')) + KT.t(s.contact), { size: 12, fill: C.red, family: "'JetBrains Mono','Noto Sans TC',monospace" });
        }
        return { back: o.svg, front: fr, hud: hud };
      }
    };
  }

  var LIST = [
    { id: 'stance', n: 1, zh: '站架', py: 'Stance & Guard', en: 'Stance & Guard', limb: 'base',
      type: { zh: '基本', en: 'Foundation' }, contact: { zh: '—', en: '—' }, target: { zh: '—', en: '—' },
      tags: { zh: ['所有技術的起點', '高護手 · 重心偏後'], en: ['Where every technique starts', 'High guard · weight back'] },
      ability: { zh: '平衡與防守', en: 'Balance and defence' },
      note: { zh: '重心偏後 · 前腳輕 · 手在眉前', en: 'WEIGHT BACK · LIGHT LEAD FOOT · HANDS AT THE BROWS' },
      how: { zh: '雙腳約與肩同寬，一腳在前一腳在後（右撇子左腳在前），身體比拳擊更正面朝向對方。重心大約 60–70% 在後腳，前腳輕，隨時可以提起來擋踢或前蹬。雙手舉在眉毛前方，手肘收緊護住身體，下巴微收，眼睛看著對方的胸口與髖部。',
        en: 'Stand with feet about shoulder-width, one foot ahead of the other (left foot forward for right-handers), facing the opponent more squarely than in boxing. Keep roughly 60–70% of your weight on the back leg so the lead foot is light and ready to check kicks or teep. Hold your hands up at brow height, elbows tight to the body, chin tucked, eyes on their chest and hips.' },
      mistakes: { zh: '重心在前腳（難以擋低踢）；雙手放低；雙腳站成一直線而失去平衡；身體太側（腿容易被踢）。', en: 'Weight on the front foot (hard to check low kicks); dropping the hands; feet on one line so you lose balance; standing too side-on so the legs are easy targets.' },
      practice: { zh: '對鏡保持站架 1 分鐘，再在原地輕輕前後彈動，保持手不掉下來，3 回合。', en: 'Hold your stance in a mirror for a minute, then bounce lightly forward and back without dropping the hands — 3 rounds.' },
      use: { zh: '泰拳的站架要同時應付拳、腳、肘、膝，所以比拳擊更正面、更重心偏後。', en: 'A Muay Thai stance has to deal with punches, kicks, elbows and knees, so it is squarer and more weighted to the back than a boxing stance.' },
      bars: [['平衡', 'Balance', 90], ['防守', 'Defence', 88], ['腳步', 'Footwork', 75], ['放鬆', 'Relaxation', 72]] },

    { id: 'jab', n: 2, zh: '前手直拳', py: 'Jab', en: 'Jab', limb: 'fist',
      type: { zh: '拳', en: 'Punch' }, contact: { zh: '拳面（前手）', en: 'Knuckles, lead hand' }, target: { zh: '臉、下巴', en: 'Face, chin' },
      tags: { zh: ['最快、最常用的拳', '量距離、開路'], en: ['The fastest, most-used punch', 'Measures distance, sets things up'] },
      ability: { zh: '速度與距離感', en: 'Speed and distance' },
      note: { zh: '直線出 · 直線回 · 肩護下巴', en: 'STRAIGHT OUT · STRAIGHT BACK · SHOULDER COVERS CHIN' },
      how: { zh: '從站架，前手直線往前打出，出拳時手轉成拳心向下，前肩抬起護住下巴，另一手留在臉旁。打到後立刻沿原路收回護臉。可以配合前腳小步上前增加距離。',
        en: 'From your stance, shoot the lead hand straight out, turning it palm-down as it lands, with the lead shoulder raised to cover your chin and the other hand by your face. Snap it straight back to guard. A small step with the lead foot adds reach.' },
      mistakes: { zh: '出拳前先拉回（預告動作）；打完手掉下來；另一手離開臉；身體往前倒。', en: 'Pulling back before punching (telegraphing); dropping the hand afterwards; the rear hand leaving the face; leaning forward.' },
      practice: { zh: '對鏡或沙袋打單一前手 3 回合 × 2 分鐘，重點是快出快收。', en: '3 × 2-minute rounds of jabs on a bag or in a mirror — fast out, fast back.' },
      use: { zh: '前手直拳用來量距離、干擾對方視線，並帶出後手拳或踢腿。', en: 'The jab measures distance, blinds the opponent and sets up the cross or a kick.' },
      bars: [['速度', 'Speed', 90], ['距離感', 'Distance', 85], ['肩部', 'Shoulders', 70], ['防守', 'Defence', 75]] },

    { id: 'cross', n: 3, zh: '後手直拳', py: 'Cross', en: 'Cross', limb: 'fist',
      type: { zh: '拳', en: 'Punch' }, contact: { zh: '拳面（後手）', en: 'Knuckles, rear hand' }, target: { zh: '臉、下巴', en: 'Face, chin' },
      tags: { zh: ['最有力的直拳', '轉腳、轉髖、轉肩'], en: ['The power straight punch', 'Turn foot, hip and shoulder'] },
      ability: { zh: '轉體發力', en: 'Rotational power' },
      note: { zh: '後腳跟轉 · 轉髖 · 前手護臉', en: 'PIVOT THE BACK HEEL · TURN THE HIPS · LEAD HAND GUARDS' },
      how: { zh: '從站架，後腳跟往外轉起，帶動髖部與肩膀往前轉，後手沿直線打出，力量從地面經腰傳到拳頭。前手一直留在臉前。打完沿原路收回成站架。',
        en: 'From your stance, turn the back heel out so the hips and shoulders rotate forward, and drive the rear hand straight out — power travels from the floor through the hips to the fist. The lead hand stays by your face. Return along the same line to your stance.' },
      mistakes: { zh: '只用手臂；後腳跟不轉；前手掉下來；打完身體停在前面。', en: 'Arm-only punching; not turning the back heel; dropping the lead hand; leaving your weight out front.' },
      practice: { zh: '在沙袋上打「前手＋後手」組合，3 回合 × 2 分鐘。', en: 'Jab–cross combinations on the bag, 3 × 2-minute rounds.' },
      use: { zh: '後手直拳是最常見的重拳，也常用來接後腿踢擊。', en: 'The cross is the most common power punch and often leads straight into a rear kick.' },
      bars: [['轉體發力', 'Rotation', 90], ['腳步轉動', 'Pivot', 82], ['肩臂', 'Shoulder & arm', 75], ['防守', 'Defence', 72]] },

    { id: 'teep', n: 4, zh: '前蹬', py: 'Teep', en: 'Teep (Push Kick)', limb: 'foot',
      type: { zh: '腳', en: 'Kick' }, contact: { zh: '前腳掌', en: 'Ball of the foot' }, target: { zh: '腹部、髖部', en: 'Stomach, hips' },
      tags: { zh: ['泰拳的「前手拳」', '推開距離、打亂節奏'], en: ['Muay Thai\'s "jab with the leg"', 'Pushes distance, breaks rhythm'] },
      ability: { zh: '距離控制', en: 'Distance control' },
      note: { zh: '先提膝 · 髖前推 · 前腳掌', en: 'KNEE UP FIRST · PUSH THE HIPS · BALL OF THE FOOT' },
      how: { zh: '從站架，前腿提膝到腰高，接著髖部往前推，把腿伸直，用前腳掌推向對方腹部或髖部。上身稍微往後，雙手保持護頭。推完收回提膝再落地。',
        en: 'From your stance, lift the lead knee to waist height, then push the hips forward and straighten the leg, driving the ball of the foot into their stomach or hips. Lean back slightly and keep the hands up. Re-chamber the knee before setting the foot down.' },
      mistakes: { zh: '沒有提膝直接甩腿（像踢球）；只用腿不推髖；雙手掉下來；落腳太慢。', en: 'Swinging the leg without lifting the knee (like kicking a ball); no hip push; dropping the hands; slow recovery.' },
      practice: { zh: '對沙袋或踢靶每腳 3 組 × 10 下，感受髖部推送。', en: 'On a bag or pad, 3 × 10 per leg, feeling the hips push.' },
      use: { zh: '前蹬用來阻止對方前進、拉開距離、破壞平衡，是泰拳最重要的防守兼攻擊腿法。', en: 'The teep stops the opponent coming forward, restores distance and breaks balance — Muay Thai\'s key defensive and offensive kick.' },
      bars: [['距離控制', 'Distance control', 92], ['髖部推送', 'Hip drive', 85], ['單腳平衡', 'One-leg balance', 82], ['時機', 'Timing', 80]] },

    { id: 'kick', n: 5, zh: '後腿中段踢', py: 'Tae · Roundhouse Kick', en: 'Roundhouse Kick', limb: 'shin',
      type: { zh: '腳', en: 'Kick' }, contact: { zh: '小腿脛骨', en: 'Shin' }, target: { zh: '身體側面', en: 'Side of the body' },
      tags: { zh: ['泰拳的招牌踢法', '用脛骨不是腳背'], en: ['The signature Muay Thai kick', 'Shin, not the foot'] },
      ability: { zh: '轉髖爆發力', en: 'Explosive hip rotation' },
      note: { zh: '轉前腳 · 轉髖 · 脛骨踢中 · 手往後擺', en: 'PIVOT · TURN THE HIP OVER · LAND THE SHIN · ARM SWINGS BACK' },
      how: { zh: '前腳腳尖往外轉、踮起，後腿從地面往前上方甩起，同時把髖部完全翻轉過去，用小腿脛骨踢中對方身體側面。踢腿同側的手往下往後擺幫助轉身，另一手護頭。踢完順勢收回站架。',
        en: 'Turn the lead foot out onto the ball of the foot and swing the rear leg up and across while turning the hip right over, landing with the shin on the side of their body. The arm on the kicking side swings down and back to help you turn while the other hand guards your head. Let the leg return to your stance.' },
      mistakes: { zh: '前腳不轉（傷膝、沒力）；用腳背踢（易受傷）；髖部沒有轉過去；兩手都掉下來。', en: 'Not pivoting the lead foot (no power, strains the knee); kicking with the top of the foot (easy to injure); not turning the hip over; dropping both hands.' },
      practice: { zh: '扶著牆慢速練轉腳轉髖 10 次，再到沙袋每腳 3 組 × 10 下。', en: 'Slow pivots and hip turns holding a wall, 10 reps, then 3 × 10 per leg on the bag.' },
      use: { zh: '泰拳的中段踢以脛骨踢擊、力量極大，是比賽得分的主要武器。', en: 'The Muay Thai roundhouse lands with the shin and carries huge power — a main scoring weapon in fights.' },
      bars: [['轉髖', 'Hip rotation', 92], ['支撐腳轉動', 'Pivot', 85], ['柔軟度', 'Flexibility', 78], ['平衡', 'Balance', 82]] },

    { id: 'lowkick', n: 6, zh: '低踢', py: 'Tae · Low Kick', en: 'Low Kick', limb: 'shin',
      type: { zh: '腳', en: 'Kick' }, contact: { zh: '小腿脛骨', en: 'Shin' }, target: { zh: '大腿外側', en: 'Outside of the thigh' },
      tags: { zh: ['削弱對方的腿', '往下斜砍'], en: ['Breaks down the legs', 'Chops downward'] },
      ability: { zh: '轉髖與準確度', en: 'Hip turn and accuracy' },
      note: { zh: '轉前腳 · 往下斜 · 打大腿外側', en: 'PIVOT · CHOP DOWN · OUTSIDE OF THE THIGH' },
      how: { zh: '和中段踢一樣轉前腳、轉髖，但踢的角度稍微往下斜，用脛骨下半段砍向對方大腿外側。常接在拳之後，讓對方的注意力在上面。',
        en: 'Pivot and turn the hip just like the roundhouse, but angle the kick slightly downward and chop the lower shin into the outside of their thigh. It works best straight after punches, while their attention is up high.' },
      mistakes: { zh: '在對方準備好時直接踢（容易被擋）；用腳背或腳踝踢；踢完站不穩。', en: 'Throwing it when they are set to check; kicking with the foot or ankle; losing balance afterwards.' },
      practice: { zh: '打「前手＋後手＋低踢」組合，3 回合 × 2 分鐘。', en: 'Jab–cross–low kick combinations, 3 × 2-minute rounds.' },
      use: { zh: '低踢累積起來會讓對方腿部沉重、站不穩，是泰拳消耗對手的重要武器。', en: 'Low kicks add up — heavy legs and lost balance — a key way to wear an opponent down.' },
      bars: [['轉髖', 'Hip rotation', 88], ['準確度', 'Accuracy', 85], ['組合時機', 'Setting it up', 82], ['平衡', 'Balance', 80]] },

    { id: 'elbow', n: 7, zh: '橫肘', py: 'Sok · Horizontal Elbow', en: 'Horizontal Elbow', limb: 'elbow',
      type: { zh: '肘', en: 'Elbow' }, contact: { zh: '手肘前端', en: 'Point of the elbow' }, target: { zh: '臉側、眉骨', en: 'Side of the face, brow' },
      tags: { zh: ['近距離最鋒利的武器', '轉髖帶動'], en: ['The sharpest close-range weapon', 'Driven by the hips'] },
      ability: { zh: '近距離轉體', en: 'Short-range rotation' },
      note: { zh: '手臂折緊 · 手肘水平 · 轉髖', en: 'ARM FOLDED · ELBOW LEVEL · TURN THE HIPS' },
      how: { zh: '在比拳更近的距離，手臂折緊、手掌靠近自己的頭，轉髖轉肩，讓手肘水平劃過對方臉側或眉骨。另一手護頭。打完立刻回到護頭。',
        en: 'At closer than punching range, fold the arm tight with the hand near your own head, turn the hips and shoulders, and slice the elbow level across the side of their face or brow. The other hand guards your head. Return to the guard immediately.' },
      mistakes: { zh: '距離太遠（打不到）；手臂沒折緊；只甩手臂不轉身；打完手不回來。', en: 'Throwing from too far (it falls short); not folding the arm; swinging the arm without turning the body; not returning to guard.' },
      practice: { zh: '對手靶慢速練左右橫肘各 10 次，熟練後接在勾拳或箍頸之後。', en: 'Slow horizontal elbows on pads, 10 each side; later chain them after hooks or from the clinch.' },
      use: { zh: '肘擊容易造成割傷，是泰拳近戰的決勝武器。業餘賽事常禁止或限制肘擊。', en: 'Elbows cut easily and can end fights up close; many amateur events ban or restrict them.' },
      bars: [['轉體', 'Rotation', 90], ['近身距離', 'Close range', 85], ['手臂結構', 'Arm structure', 80], ['防守', 'Defence', 72]] },

    { id: 'clinch', n: 8, zh: '箍頸', py: 'Chap Kho · Clinch', en: 'The Clinch (Plum)', limb: 'grip',
      type: { zh: '纏抱', en: 'Clinch' }, contact: { zh: '雙手扣後腦', en: 'Hands behind the head' }, target: { zh: '控制頭部', en: 'Head control' },
      tags: { zh: ['泰拳獨有的纏抱技術', '控制頭就控制身體'], en: ['Muay Thai\'s unique stand-up grappling', 'Control the head, control the body'] },
      ability: { zh: '控制與平衡', en: 'Control and balance' },
      note: { zh: '手從內側 · 雙手交疊 · 手肘夾緊', en: 'HANDS INSIDE · ONE OVER THE OTHER · ELBOWS SQUEEZE' },
      how: { zh: '貼身時，雙手從對方手臂內側往上，交疊扣在對方後腦（不要十指交扣）。手肘往內夾緊，壓在對方鎖骨上，把頭往下拉，讓對方失去姿勢與平衡。',
        en: 'When chest to chest, bring both hands up the inside of their arms and cup them one over the other behind their head (don\'t interlace the fingers). Squeeze the elbows together onto their collarbones and pull the head down so they lose posture and balance.' },
      mistakes: { zh: '十指交扣（手指容易受傷）；手肘張開讓對方鑽出；只用手拉不用身體；姿勢比對方低。', en: 'Interlacing the fingers (they get hurt); flaring the elbows so they slip out; pulling with the arms only; letting your posture drop below theirs.' },
      practice: { zh: '與夥伴輪流練「進箍頸 → 拉低 → 放開」，慢速、溫和，每次 1 分鐘。', en: 'With a partner, take turns: enter the clinch → pull down → release, slowly and gently, a minute at a time.' },
      use: { zh: '箍頸讓你在近距離控制對方，並帶出膝擊與摔倒。', en: 'The clinch controls the opponent up close and sets up knees and off-balancing sweeps.' },
      bars: [['控制', 'Control', 92], ['握力與夾力', 'Grip & squeeze', 85], ['姿勢', 'Posture', 82], ['平衡', 'Balance', 80]] },

    { id: 'knee', n: 9, zh: '直膝', py: 'Khao · Straight Knee', en: 'Straight Knee', limb: 'knee',
      type: { zh: '膝', en: 'Knee' }, contact: { zh: '膝蓋前端', en: 'Point of the knee' }, target: { zh: '腹部、肋骨', en: 'Stomach, ribs' },
      tags: { zh: ['箍頸中的主要攻擊', '髖部往前推'], en: ['The main attack from the clinch', 'Drive the hips forward'] },
      ability: { zh: '髖部推送', en: 'Hip drive' },
      note: { zh: '拉頭往下 · 髖往前 · 膝往上頂', en: 'PULL THE HEAD DOWN · HIPS FORWARD · KNEE UP AND IN' },
      how: { zh: '在箍頸中把對方的頭往下拉，同時後腿往後拉開蓄力，接著髖部往前推、膝蓋往前上方頂入對方腹部或肋骨，腳尖往下。上身略後仰保持平衡，雙手一直控制頭部。',
        en: 'In the clinch, pull their head down while drawing the rear leg back to load, then drive the hips forward and the knee up and in to their stomach or ribs, toes pointing down. Lean back slightly for balance and keep controlling the head with both hands.' },
      mistakes: { zh: '只把腿抬起來、髖部不推；身體前傾撞頭；放開頭部控制；支撐腳站不穩。', en: 'Lifting the leg without pushing the hips; leaning forward into a head clash; letting go of the head; an unstable support leg.' },
      practice: { zh: '對沙袋或膝擊靶，每腳 3 組 × 10 下；再與夥伴在箍頸中輕觸練習。', en: '3 × 10 knees per leg on a bag or knee pad, then light touch knees with a partner in the clinch.' },
      use: { zh: '直膝威力大、距離近，泰拳選手常用它在箍頸中贏得比賽。', en: 'Straight knees are short and powerful; many Muay Thai fights are won with them in the clinch.' },
      bars: [['髖部推送', 'Hip drive', 92], ['單腳平衡', 'One-leg balance', 82], ['控制', 'Control', 85], ['核心', 'Core', 78]] },

    { id: 'check', n: 10, zh: '提膝擋踢', py: 'Check (Shin Block)', en: 'Check (Shin Block)', limb: 'shin',
      type: { zh: '防守', en: 'Defence' }, contact: { zh: '小腿脛骨（前腳）', en: 'Shin, lead leg' }, target: { zh: '擋住對方的踢', en: 'Block their kick' },
      tags: { zh: ['擋低踢的標準方法', '脛骨對脛骨'], en: ['The standard defence to leg kicks', 'Shin meets shin'] },
      ability: { zh: '反應與平衡', en: 'Reaction and balance' },
      note: { zh: '提膝 · 膝蓋外翻 · 手保持護頭', en: 'KNEE UP · TURN IT OUT · HANDS STAY UP' },
      how: { zh: '看到對方髖部轉動、起腿，馬上把被踢那側的膝蓋提起並稍微外翻，讓小腿脛骨擋住對方的腿。支撐腿微彎站穩，雙手保持護頭。擋完立刻落腳反擊。',
        en: 'As soon as you see their hip turn for a kick, lift the knee on that side and turn it slightly outward so your shin meets their kick. Keep the support leg slightly bent and both hands up. Plant the foot and fire back straight away.' },
      mistakes: { zh: '只看腳不看髖（太慢）；膝蓋提太低，被踢到大腿；手掉下來；擋完站不穩。', en: 'Watching the foot instead of the hips (too slow); a low knee so the thigh gets hit; dropping the hands; losing balance after the block.' },
      practice: { zh: '夥伴慢速輕踢，你練習提膝擋，左右各 10 次；熟練後加上擋完反擊。', en: 'Your partner throws slow, light kicks while you check, 10 each side; then add a counter after each check.' },
      use: { zh: '擋踢保護你的腿，也會讓踢你的人小腿痛，讓對方不敢亂踢。', en: 'Checking protects your legs and hurts the kicker\'s shin, making them think twice.' },
      bars: [['反應', 'Reaction', 90], ['單腳平衡', 'One-leg balance', 85], ['脛骨結構', 'Shin structure', 78], ['防守', 'Defence', 92]] }
  ];

  w.MUAYTHAI = { LIST: LIST, makeClip: makeClip };
})(window);
