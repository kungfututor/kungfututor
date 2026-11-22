/* Boxing basics — 10 lessons: stance, jab, cross, lead hook, rear uppercut,
 * the 1-2, slip, bob & weave, parry and footwork. Side view with gloves; the
 * grey figure (kt-partner.js) is the opponent. Our own wording of widely
 * taught boxing fundamentals.
 */
(function (w) {
  'use strict';
  var S = w.KTFigure.S, C = S.col, KP = w.KTPartner;
  function m() { var o = {}; for (var i = 0; i < arguments.length; i++) for (var k in arguments[i]) o[k] = arguments[i][k]; return o; }
  function cap(zh, en) { return { zh: zh, en: en }; }

  var X0 = 140;
  var LEGS = { x: X0, t: 4, h: 10, fN: { x: 22, y: 82 }, fF: { x: -24, y: 82 }, ftN: 90, ftF: 65, kbN: 1, kbF: 1 };
  var GUARD = { su: 40, sl: 165, fu: 25, fl: 170, laN: 1, laF: 1 };
  // opponent in a boxing guard too
  var BASE = m(KP.base, { hit: 0, oa1: 40, oa2: 165, ob1: 25, ob2: 170, ola: 16, olb: 4, ol: 18, oh: 6 });
  function P() { return m.apply(null, [BASE, LEGS, GUARD].concat([].slice.call(arguments))); }
  function feet(dx, nx, fx) {      // keep the feet planted in the world while the hips move by dx
    return { x: X0 + dx, fN: { x: nx - dx, y: 82 }, fF: { x: fx - dx, y: 82 } };
  }
  var OJAB = { oa1: 90, oa2: 90 };                 // opponent's jab, aimed at head height
  var OHOOK = { oa1: 88, oa2: 100, ot: 6 };        // opponent's hook coming across

  var CLIPS = {
    stance: { frames: [
      { d: 900, p: P({ ox: 262 }), c: cap('側身站，雙腳約肩寬，膝蓋微彎，重心平均', 'Stand side-on, feet about shoulder-width, knees soft, weight even') },
      { d: 500, p: P({ ox: 262, x: X0 + 3, h: 12 }), c: cap('雙手護在臉頰兩側，手肘收在肋骨前', 'Gloves by the cheeks, elbows in front of the ribs') },
      { d: 900, p: P({ ox: 262 }), c: cap('下巴收、眼睛從手套上方看對方', 'Chin down, eyes on the opponent over your gloves') }
    ] },
    jab: { hit: 'hN', trail: 'hN', frames: [
      { d: 700, p: P({ ox: 220 }), c: cap('站架', 'Stance') },
      { d: 140, p: P({ ox: 220 }), e: 'in' },
      { d: 300, p: P({ x: X0 + 5, t: 8, su: 90, sl: 90, ox: 220, ot: -7, oh: -6, hit: 1 }), e: 'out', c: cap('前手直線打出，拳頭轉成拳心向下', 'Snap the lead hand straight out, turning it palm-down') },
      { d: 500, p: P({ ox: 222 }), c: cap('原路收回護臉', 'Bring it straight back to the face') }
    ] },
    cross: { hit: 'hF', trail: 'hF', frames: [
      { d: 700, p: P({ ox: 220 }), c: cap('站架', 'Stance') },
      { d: 140, p: P({ ox: 220 }), e: 'in' },
      { d: 330, p: P({ t: 18, fu: 92, fl: 90, fF: { x: -20, y: 81 }, ftF: 35, ox: 220, ot: -8, oh: -8, hit: 1 }), e: 'out', c: cap('後腳跟轉、髖肩轉，後手直拳打出', 'Turn the back heel, hips and shoulders and throw the rear hand straight') },
      { d: 500, p: P({ ox: 222 }), c: cap('收回，前手一直護住下巴', 'Return — the lead glove guards the chin the whole time') }
    ] },
    hook: { hit: 'hN', trail: 'hN', frames: [
      { d: 700, p: P({ ox: 212 }), c: cap('站架，近距離', 'Stance, at close range') },
      { d: 160, p: P({ t: 0, su: 55, sl: 150, ox: 212 }), c: cap('重心稍移到前腳', 'Shift a little weight onto the lead foot') },
      { d: 300, p: P({ t: 8, su: 88, sl: 90, laN: 0.35, ftN: 55, ox: 212, ot: -6, oh: -14, hit: 1 }), e: 'out', c: cap('前腳轉、髖轉，手肘抬到與拳同高，拳頭橫向勾入', 'Pivot the lead foot and turn the hips; elbow up level with the fist, which swings across') },
      { d: 500, p: P({ ox: 214 }), c: cap('收回護頭', 'Back to the guard') }
    ] },
    upper: { hit: 'hF', trail: 'hF', frames: [
      { d: 700, p: P({ ox: 212 }), c: cap('站架，近距離', 'Stance, at close range') },
      { d: 220, p: P({ t: 10, fN: { x: 22, y: 74 }, fF: { x: -24, y: 74 }, fu: 20, fl: 120, ox: 206 }), c: cap('膝蓋微蹲、後手稍微放低', 'Dip the knees and drop the rear hand slightly') },
      { d: 300, p: P({ t: 12, fu: 62, fl: 168, fF: { x: -20, y: 81 }, ftF: 35, ox: 206, ot: -7, oh: -22, hit: 1 }), e: 'out', c: cap('腿蹬地、轉髖，拳頭由下往上打向下巴', 'Drive up through the legs, turn the hips and bring the fist up under the chin') },
      { d: 500, p: P({ ox: 214 }), c: cap('收回護頭', 'Back to the guard') }
    ] },
    onetwo: { hit: 'hNF', trail: 'hF', frames: [
      { d: 600, p: P({ ox: 220 }), c: cap('站架', 'Stance') },
      { d: 240, p: P({ x: X0 + 5, t: 8, su: 90, sl: 90, ox: 220, ot: -5, hit: 1 }), e: 'out', c: cap('「一」：前手直拳', '"One": the jab') },
      { d: 120, p: P({ ox: 220 }) },
      { d: 280, p: P({ t: 18, fu: 92, fl: 90, fF: { x: -20, y: 81 }, ftF: 35, ox: 220, ot: -9, oh: -10, hit: 1 }), e: 'out', c: cap('「二」：前手收回的同時打出後手直拳', '"Two": the cross fires as the jab comes back') },
      { d: 600, p: P({ ox: 224 }), c: cap('兩手都回到護頭', 'Both hands back to the guard') }
    ] },
    slip: { hit: null, trail: null, frames: [
      { d: 700, p: P({ ox: 222 }), c: cap('站架，看對方的肩膀', 'Stance; watch their shoulders') },
      { d: 160, p: P({ ox: 222, oa1: 60, oa2: 120 }), c: cap('對方出前手拳', 'They throw a jab') },
      { d: 260, p: P({ t: 20, h: 8, x: X0 + 4, fN: { x: 22, y: 74 }, fF: { x: -24, y: 74 }, ox: 222, oa1: 90, oa2: 90, ot: 8 }), e: 'out', c: cap('膝蓋微彎、身體往前側移，讓拳頭從肩膀上方擦過', 'Bend the knees and shift forward and to the side so the punch slides over your shoulder') },
      { d: 300, p: P({ t: 20, h: 8, x: X0 + 4, fN: { x: 22, y: 74 }, fF: { x: -24, y: 74 }, ox: 222, oa1: 70, oa2: 110 }), c: cap('眼睛一直看著對方', 'Keep your eyes on them') },
      { d: 600, p: P({ ox: 222 }), c: cap('回到站架，準備反擊', 'Back to stance, ready to counter') }
    ] },
    weave: { hit: null, trail: null, frames: [
      { d: 700, p: P({ ox: 214 }), c: cap('站架', 'Stance') },
      { d: 180, p: P({ ox: 214, oa1: 40, oa2: 120, ot: 2 }), c: cap('對方揮出勾拳', 'They swing a hook') },
      { d: 340, p: P({ t: 26, h: 10, fN: { x: 22, y: 62 }, fF: { x: -24, y: 62 }, ox: 214, oa1: 88, oa2: 100, ot: 8 }), e: 'out', c: cap('彎膝蓋往下蹲，頭從拳頭下方穿過（不是彎腰）', 'Bend the knees and drop under the punch — legs, not the waist') },
      { d: 340, p: P({ t: 14, h: 8, fN: { x: 22, y: 70 }, fF: { x: -24, y: 70 }, ox: 214, oa1: 60, oa2: 130 }), c: cap('以 U 字路線移到另一側站起', 'Move in a U shape and come up on the other side') },
      { d: 600, p: P({ ox: 214 }), c: cap('回到站架，雙手一直護頭', 'Back to stance; the hands stay up throughout') }
    ] },
    parry: { hit: 'hF', trail: 'hF', frames: [
      { d: 700, p: P({ ox: 218 }), c: cap('站架', 'Stance') },
      { d: 150, p: P({ ox: 218, oa1: 60, oa2: 120 }), c: cap('對方出前手拳', 'They throw a jab') },
      { d: 230, p: P({ fu: 62, fl: 118, ox: 218, oa1: 84, oa2: 78, hit: 1 }), e: 'out', c: cap('後手短促地往前一拍，把拳頭撥偏', 'A short tap forward with the rear glove knocks the jab off line') },
      { d: 300, p: P({ ox: 218, oa1: 60, oa2: 120 }), c: cap('手立刻回到下巴', 'The glove snaps straight back to the chin') },
      { d: 600, p: P({ ox: 220 }), c: cap('拍擋後馬上反擊', 'Counter straight after the parry') }
    ] },
    footwork: { hit: null, trail: null, frames: [
      { d: 600, p: P(feet(0, 22, -24), { ox: 262 }), c: cap('站架', 'Stance') },
      { d: 200, p: P(feet(8, 42, -24), { ox: 262 }), c: cap('前進：前腳先踏出一小步', 'Advance: the lead foot steps first, a small step') },
      { d: 500, p: P(feet(20, 42, -4), { ox: 262 }), c: cap('後腳跟上同樣距離，站距不變', 'The rear foot follows the same distance — stance width stays the same') },
      { d: 200, p: P(feet(12, 42, -24), { ox: 262 }), c: cap('後退：後腳先往後踏', 'Retreat: the rear foot steps back first') },
      { d: 500, p: P(feet(0, 22, -24), { ox: 262 }), c: cap('前腳跟回來，雙腳不交叉', 'The lead foot follows — never cross the feet') }
    ] }
  };

  function makeClip(s, view, level, lang) {
    var src = CLIPS[s.id], pace = level < 1 ? 1.8 : 1;
    return {
      scale: 0.88, base: { x: X0 }, cx: X0, ticks: s.id === 'footwork', labelAt: [350, 28], still: 0.5,
      trail: src.trail || null,
      frames: src.frames.map(function (f) { return { d: Math.round(f.d * pace), p: f.p, e: f.e, c: f.c }; }),
      props: function (J, c) {
        var o = KP.draw(J, c, { cx: X0, gloves: true }), fr = '', hud = '', sc = c.scale;
        fr += S.circle(J.hF, 6.8 * sc, '#E8857C', '#fff', 1.2) + S.circle(J.hN, 6.8 * sc, C.red, '#fff', 1.2);   // gloves
        if (src.hit && c.pose.hit > 0.15) {
          var pt = src.hit === 'hNF' ? (c.seg < 2 ? J.hN : J.hF) : J[src.hit];
          fr += KP.hit(pt, c.pose.hit);
          if (c.pose.hit > 0.6) hud += S.text(18, 30, (KT.pick('目標：', 'TARGET: ')) + KT.t(s.target), { size: 12, fill: C.red, family: "'JetBrains Mono','Noto Sans TC',monospace" });
        }
        return { back: o.svg, front: fr, hud: hud };
      }
    };
  }

  var LIST = [
    { id: 'stance', n: 1, zh: '站架與防守姿勢', py: 'Stance & Guard', en: 'Stance & Guard',
      type: { zh: '基本', en: 'Foundation' }, target: { zh: '—', en: '—' }, key: { zh: '側身、下巴收', en: 'Side-on, chin down' },
      tags: { zh: ['所有動作的起點', '平衡 · 保護下巴'], en: ['Everything starts here', 'Balance · protect the chin'] },
      ability: { zh: '平衡與防守', en: 'Balance and defence' },
      note: { zh: '側身 · 膝微彎 · 手護臉頰 · 下巴收', en: 'SIDE-ON · SOFT KNEES · GLOVES AT CHEEKS · CHIN DOWN' },
      how: { zh: '右撇子左腳在前（正架），雙腳約與肩同寬，前腳尖朝前、後腳約 45° 外轉、後腳跟微微抬起。身體側一點減少被打面積，膝蓋微彎、重心平均。雙手護在臉頰兩側，手肘收在肋骨前，下巴收，眼睛從手套上方看對方。',
        en: 'Right-handers stand left foot forward (orthodox), feet about shoulder-width, lead toes pointing forward and the back foot turned out about 45° with the heel slightly raised. Turn a little side-on to present a smaller target, knees soft, weight even. Keep the gloves by your cheeks, elbows in front of the ribs, chin tucked, eyes on the opponent over your gloves.' },
      mistakes: { zh: '雙腳站成一直線（失去平衡）；下巴抬起；手肘張開露出身體；膝蓋打直。', en: 'Feet on one line (no balance); chin up; elbows flared, exposing the body; locked knees.' },
      practice: { zh: '對鏡保持站架並輕輕彈動 3 × 1 分鐘，檢查下巴與手的位置。', en: 'Hold your stance in a mirror and bounce lightly, 3 × 1 minute, checking chin and hands.' },
      use: { zh: '好的站架讓你能同時攻擊、防守和移動。', en: 'A good stance lets you attack, defend and move at the same time.' },
      bars: [['平衡', 'Balance', 90], ['防守', 'Defence', 88], ['放鬆', 'Relaxation', 75], ['腳步', 'Footwork', 78]] },

    { id: 'jab', n: 2, zh: '刺拳', py: 'Jab', en: 'Jab',
      type: { zh: '直拳', en: 'Straight punch' }, target: { zh: '臉', en: 'Face' }, key: { zh: '快出快收', en: 'Fast out, fast back' },
      tags: { zh: ['拳擊最重要的一拳', '量距離、開路'], en: ['The most important punch in boxing', 'Measures distance, sets up'] },
      ability: { zh: '速度與距離感', en: 'Speed and range' },
      note: { zh: '直線出 · 拳心轉下 · 原路收回', en: 'STRAIGHT OUT · TURN PALM-DOWN · SAME LINE BACK' },
      how: { zh: '從站架，前手直線往前打出，快到終點時拳頭轉成拳心向下，前肩抬起保護下巴，後手留在下巴旁。打完沿原路快速收回。可以配合前腳小步上前。',
        en: 'From your stance, shoot the lead hand straight out, turning it palm-down just before impact, with the lead shoulder raised to protect the chin and the rear glove by your chin. Bring it back along the same line, fast. A small step with the lead foot adds reach.' },
      mistakes: { zh: '出拳前先往後拉（預告）；打完手往下掉；手肘向外甩；身體往前倒。', en: 'Pulling back before punching (telegraphing); dropping the hand on the way back; flaring the elbow; leaning forward.' },
      practice: { zh: '空擊或沙袋只打刺拳 3 回合 × 2 分鐘，重點是收手速度和出手一樣快。', en: '3 × 2-minute rounds of jabs only, in the air or on the bag — the return as fast as the punch.' },
      use: { zh: '刺拳用來量距離、干擾對方、打斷對方節奏，並帶出所有組合拳。', en: 'The jab finds range, distracts, breaks the opponent\'s rhythm and sets up every combination.' },
      bars: [['速度', 'Speed', 92], ['距離感', 'Range', 88], ['肩部耐力', 'Shoulder endurance', 72], ['防守', 'Defence', 75]] },

    { id: 'cross', n: 3, zh: '後手直拳', py: 'Cross', en: 'Cross',
      type: { zh: '直拳', en: 'Straight punch' }, target: { zh: '下巴、臉', en: 'Chin, face' }, key: { zh: '轉腳、轉髖、轉肩', en: 'Turn foot, hip, shoulder' },
      tags: { zh: ['最主要的重拳', '力量來自地面'], en: ['The main power punch', 'Power comes from the ground'] },
      ability: { zh: '轉體發力', en: 'Rotational power' },
      note: { zh: '後腳跟轉 · 轉髖 · 前手護下巴', en: 'PIVOT THE BACK HEEL · TURN THE HIPS · LEAD GLOVE ON THE CHIN' },
      how: { zh: '從站架，後腳跟往外轉、帶動髖部與肩膀往前轉，後手沿直線打出，力量從地面經腰傳到拳頭。打出時前手留在下巴旁，打完沿原路收回。',
        en: 'From your stance, pivot the back heel out so the hips and shoulders turn forward, and drive the rear hand straight out — power travels from the floor through the hips to the fist. The lead glove stays by your chin; return along the same line.' },
      mistakes: { zh: '只用手臂；後腳跟不轉；前手掉下來；打完身體停在前方。', en: 'Arm-only punching; not turning the back heel; dropping the lead hand; leaving the weight out front.' },
      practice: { zh: '慢速練「轉腳 → 轉髖 → 出拳」10 次，再到沙袋打 3 回合。', en: '10 slow reps of pivot → hip → punch, then 3 rounds on the bag.' },
      use: { zh: '後手直拳常接在刺拳之後，是最常見的得分重拳。', en: 'The cross usually follows the jab and is the most common power punch.' },
      bars: [['轉體發力', 'Rotation', 92], ['腳步轉動', 'Pivot', 85], ['肩臂', 'Shoulder & arm', 75], ['防守', 'Defence', 72]] },

    { id: 'hook', n: 4, zh: '前手勾拳', py: 'Lead Hook', en: 'Lead Hook',
      type: { zh: '勾拳', en: 'Hook' }, target: { zh: '下巴側面', en: 'Side of the jaw' }, key: { zh: '手肘抬平、轉身', en: 'Elbow level, turn the body' },
      tags: { zh: ['近距離的重拳', '整個身體一起轉'], en: ['A short-range power punch', 'The whole body turns'] },
      ability: { zh: '近距離轉體', en: 'Short-range rotation' },
      note: { zh: '手肘與拳同高 · 前腳轉 · 手臂約 90°', en: 'ELBOW LEVEL WITH THE FIST · PIVOT · ARM AT ~90°' },
      how: { zh: '重心稍移到前腳，前腳腳尖往內轉、髖部與肩膀一起轉，手臂彎成約 90°，手肘抬到與拳頭同高，拳頭橫向勾向對方下巴側面。手臂的形狀固定，力量來自轉身。打完回到護頭。（側面動畫中，拳頭是朝畫面內橫向移動。）',
        en: 'Shift a little weight to the lead foot, pivot on it and turn the hips and shoulders together. Bend the arm to about 90° with the elbow raised level with the fist and swing it across into the side of the jaw. The arm shape stays fixed — the power comes from turning. Return to the guard. (In this side view the fist travels across, into the screen.)' },
      mistakes: { zh: '手臂拉得太開（變成大甩拳）；手肘掉下來；只用手不轉身；另一手離開下巴。', en: 'Winding up wide into a looping swing; dropping the elbow; arm-only with no body turn; the other hand leaving the chin.' },
      practice: { zh: '對手靶練勾拳 3 × 10，熟練後接在刺拳、直拳之後（1-2-3）。', en: 'Hooks on pads, 3 × 10, then add them after a jab and cross (1-2-3).' },
      use: { zh: '勾拳打的是對方視線外的角度，常常是擊倒拳。', en: 'The hook comes from outside the opponent\'s line of sight and is a classic knockout punch.' },
      bars: [['轉體', 'Rotation', 92], ['手臂結構', 'Arm structure', 82], ['前腳轉動', 'Lead-foot pivot', 85], ['防守', 'Defence', 70]] },

    { id: 'upper', n: 5, zh: '後手上勾拳', py: 'Rear Uppercut', en: 'Rear Uppercut',
      type: { zh: '上勾拳', en: 'Uppercut' }, target: { zh: '下巴下方', en: 'Under the chin' }, key: { zh: '先蹲再往上', en: 'Dip, then drive up' },
      tags: { zh: ['由下往上的近身拳', '腿部發力'], en: ['An upward close-range punch', 'Power from the legs'] },
      ability: { zh: '腿部與轉體發力', en: 'Leg drive and rotation' },
      note: { zh: '膝蓋微蹲 · 蹬地轉髖 · 拳往上', en: 'DIP THE KNEES · DRIVE AND TURN · FIST TRAVELS UP' },
      how: { zh: '在近距離，膝蓋微蹲、後手稍微放低（不要拉到身後），接著雙腿蹬地、轉髖，讓拳頭由下往上打向對方下巴，拳心朝向自己。打完立刻回到護頭。',
        en: 'At close range, dip the knees and lower the rear hand slightly (don\'t pull it behind you), then drive up through the legs and turn the hips so the fist travels upward into the chin, palm facing you. Snap back to the guard.' },
      mistakes: { zh: '手拉得太低太後面（預告）；只用手往上；距離太遠打空；打完臉沒有保護。', en: 'Dropping the hand low and back (telegraphing); lifting with the arm only; throwing from too far; leaving the face open afterwards.' },
      practice: { zh: '對手靶或上勾拳沙袋練 3 × 10，感受腿部蹬地。', en: 'On pads or an uppercut bag, 3 × 10, feeling the legs drive.' },
      use: { zh: '上勾拳專打低頭或往前靠的對手，在近身纏鬥時特別有效。', en: 'Uppercuts punish an opponent who ducks or leans in, especially in close exchanges.' },
      bars: [['腿部蹬地', 'Leg drive', 88], ['轉體', 'Rotation', 82], ['近身距離', 'Close range', 85], ['時機', 'Timing', 80]] },

    { id: 'onetwo', n: 6, zh: '一二連擊', py: 'The 1-2', en: 'The 1-2 (Jab–Cross)',
      type: { zh: '組合拳', en: 'Combination' }, target: { zh: '臉、下巴', en: 'Face, chin' }, key: { zh: '一手回、一手出', en: 'One returns as the other fires' },
      tags: { zh: ['拳擊最基本的組合', '節奏流暢'], en: ['Boxing\'s basic combination', 'Smooth rhythm'] },
      ability: { zh: '組合節奏', en: 'Combination rhythm' },
      note: { zh: '刺拳開路 · 收回的同時打直拳', en: 'THE JAB OPENS · THE CROSS FIRES AS IT RETURNS' },
      how: { zh: '先打刺拳，刺拳收回的同時轉後腳、轉髖打出後手直拳。兩拳之間不要停頓，也不要兩手同時離開臉。打完兩手都回到護頭。',
        en: 'Throw the jab, and as it comes back pivot the back foot and turn the hips to fire the cross. No pause between the two, and never have both hands away from your face at once. Finish with both hands back in the guard.' },
      mistakes: { zh: '兩拳之間停頓；刺拳沒收回就打直拳；打完沒有回防；身體往前倒失去平衡。', en: 'Pausing between punches; firing the cross before the jab returns; not guarding afterwards; falling forward off balance.' },
      practice: { zh: '空擊或沙袋 3 回合 × 2 分鐘，每次打完 1-2 立刻移動腳步。', en: '3 × 2-minute rounds in the air or on the bag, moving your feet after every 1-2.' },
      use: { zh: '1-2 是所有組合拳的基礎，後面可以接勾拳或上勾拳。', en: 'The 1-2 is the base of every combination; hooks and uppercuts follow from it.' },
      bars: [['節奏', 'Rhythm', 92], ['轉體', 'Rotation', 85], ['防守', 'Defence', 75], ['平衡', 'Balance', 80]] },

    { id: 'slip', n: 7, zh: '閃躲（側閃）', py: 'Slip', en: 'Slip',
      type: { zh: '防守', en: 'Defence' }, target: { zh: '讓拳頭落空', en: 'Make the punch miss' }, key: { zh: '小動作、用膝蓋', en: 'Small move, use the knees' },
      tags: { zh: ['不用手的防守', '閃完馬上反擊'], en: ['Defence without the hands', 'Slip, then counter'] },
      ability: { zh: '反應與時機', en: 'Reaction and timing' },
      note: { zh: '膝蓋微彎 · 頭移出直線 · 眼睛看對方', en: 'BEND THE KNEES · HEAD OFF THE LINE · EYES ON THEM' },
      how: { zh: '對方直拳打來時，膝蓋微彎、上身稍微往前側方移動，把頭移出拳頭的直線，讓拳頭從肩膀上方擦過。動作要小，眼睛一直看著對方，閃完馬上回到站架或反擊。（側面動畫看不到左右移動，只能看到身體下沉前移。）',
        en: 'As a straight punch comes, bend the knees and shift the upper body slightly forward and to the side, moving your head off the punch\'s line so it slides over your shoulder. Keep it small, keep your eyes on them, and come straight back to stance or counter. (The side view can\'t show the sideways part — only the dip and lean.)' },
      mistakes: { zh: '閃太大、失去平衡；閉眼；只彎腰不彎膝；閃完不反擊。', en: 'Slipping too far and losing balance; closing your eyes; bending only at the waist; never countering.' },
      practice: { zh: '在雙層繩或繩子旁練習左右閃躲 3 × 1 分鐘，再請夥伴慢速出刺拳。', en: 'Slip along a rope line, 3 × 1 minute, then have a partner throw slow jabs.' },
      use: { zh: '閃躲讓雙手保持自由，可以立刻反擊。', en: 'Slipping keeps both hands free to counter immediately.' },
      bars: [['反應', 'Reaction', 90], ['時機', 'Timing', 88], ['腿部', 'Legs', 75], ['平衡', 'Balance', 82]] },

    { id: 'weave', n: 8, zh: '下潛閃躲', py: 'Bob & Weave', en: 'Bob & Weave',
      type: { zh: '防守', en: 'Defence' }, target: { zh: '從勾拳下穿過', en: 'Duck under the hook' }, key: { zh: '用腿蹲、不彎腰', en: 'Use the legs, not the waist' },
      tags: { zh: ['躲勾拳的方法', 'U 字形路線'], en: ['The answer to a hook', 'A U-shaped path'] },
      ability: { zh: '腿力與節奏', en: 'Leg strength and rhythm' },
      note: { zh: '彎膝下蹲 · 頭從拳下穿過 · 手護頭', en: 'BEND THE KNEES · UNDER THE PUNCH · HANDS UP' },
      how: { zh: '對方勾拳揮來時，彎膝往下蹲，讓頭從拳頭下方穿過，以 U 字形路線移到另一側再站起來。背部保持挺直、眼睛看對方、雙手一直護頭。',
        en: 'As a hook swings in, bend your knees and sink so your head passes under the punch, moving in a U shape and rising on the other side. Keep your back fairly straight, eyes on the opponent and hands up throughout.' },
      mistakes: { zh: '彎腰低頭（看不到對方、容易被上勾拳）；蹲太深站不起來；手掉下來。', en: 'Bending at the waist and looking at the floor (blind, open to uppercuts); sinking so deep you can\'t come up; dropping the hands.' },
      practice: { zh: '在拉好的繩子下左右穿梭 3 × 1 分鐘。', en: 'Weave back and forth under a rope line, 3 × 1 minute.' },
      use: { zh: '下潛閃躲讓你躲過勾拳，並在對方身側反擊。', en: 'Bobbing and weaving takes you under hooks and into position to counter from the side.' },
      bars: [['腿力', 'Leg strength', 88], ['節奏', 'Rhythm', 85], ['反應', 'Reaction', 82], ['平衡', 'Balance', 80]] },

    { id: 'parry', n: 9, zh: '拍擋', py: 'Parry', en: 'Parry',
      type: { zh: '防守', en: 'Defence' }, target: { zh: '對方的拳套', en: 'Their glove' }, key: { zh: '小、快、馬上回來', en: 'Small, fast, straight back' },
      tags: { zh: ['用最小的力氣擋直拳', '撥偏而不是硬擋'], en: ['Stops straight punches with minimal effort', 'Redirect, don\'t block'] },
      ability: { zh: '反應與手部控制', en: 'Reaction and hand control' },
      note: { zh: '後手短拍 · 不伸太遠 · 立刻回下巴', en: 'SHORT TAP · DON\'T REACH · BACK TO THE CHIN' },
      how: { zh: '對方刺拳打來時，用後手掌心在臉前方短促地往前一拍，把拳頭撥偏到一邊。手不要伸出去迎，只在臉前一小段距離內動作，拍完立刻回到下巴，接著反擊。',
        en: 'As the jab comes, tap it aside with the palm of your rear glove just in front of your face. Don\'t reach out to meet it — move only a short distance in front of the face — then snap the glove back to your chin and counter.' },
      mistakes: { zh: '手伸太遠去迎拳（露出空檔）；動作太大；拍完手沒回來；只拍不反擊。', en: 'Reaching out for the punch (leaves an opening); too big a movement; not bringing the hand back; parrying without countering.' },
      practice: { zh: '夥伴慢速打刺拳，你練拍擋 3 × 1 分鐘；熟練後加上拍擋後的反擊直拳。', en: 'Partner throws slow jabs while you parry, 3 × 1 minute; then add a counter cross after each parry.' },
      use: { zh: '拍擋讓你不用後退就能化解直拳，並馬上創造反擊機會。', en: 'Parrying neutralises straight punches without stepping back and creates instant counters.' },
      bars: [['反應', 'Reaction', 90], ['手部控制', 'Hand control', 85], ['時機', 'Timing', 85], ['防守', 'Defence', 88]] },

    { id: 'footwork', n: 10, zh: '前進與後退步法', py: 'Footwork', en: 'Footwork: Step & Drag',
      type: { zh: '步法', en: 'Footwork' }, target: { zh: '控制距離', en: 'Control distance' }, key: { zh: '先動的腳朝方向走', en: 'The foot nearest the direction moves first' },
      tags: { zh: ['好拳手的根本', '雙腳不交叉'], en: ['The root of good boxing', 'Never cross the feet'] },
      ability: { zh: '距離與平衡', en: 'Distance and balance' },
      note: { zh: '前進先動前腳 · 後退先動後腳 · 站距不變', en: 'FORWARD: LEAD FOOT FIRST · BACK: REAR FOOT FIRST · SAME WIDTH' },
      how: { zh: '前進時前腳先踏出一小步，後腳立刻跟上同樣距離；後退時後腳先往後踏，前腳跟上。每一步都保持站架寬度、膝蓋微彎、雙手護頭，雙腳不要交叉或併攏。',
        en: 'To move forward, step the lead foot a short distance and bring the rear foot up the same amount; to move back, step the rear foot first and let the lead foot follow. Every step keeps your stance width, soft knees and hands up — never cross or bring the feet together.' },
      mistakes: { zh: '雙腳交叉或併攏；步伐太大；移動時身體跳上跳下；手掉下來。', en: 'Crossing or closing the feet; steps too big; bouncing up and down; dropping the hands as you move.' },
      practice: { zh: '在地上畫一條線，沿線前進、後退各 10 步，3 組；再加上出拳。', en: 'Along a line on the floor, 10 steps forward and back, 3 sets; then add punches as you move.' },
      use: { zh: '步法讓你控制距離：該出拳時進得去，危險時退得出來。', en: 'Footwork controls distance — in range when you want to punch, out of range when you need to be.' },
      bars: [['距離控制', 'Distance control', 92], ['平衡', 'Balance', 90], ['腿部耐力', 'Leg endurance', 78], ['節奏', 'Rhythm', 80]] }
  ];

  w.BOXING = { LIST: LIST, makeClip: makeClip };
})(window);
