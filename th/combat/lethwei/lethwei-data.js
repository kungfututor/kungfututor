/* Lethwei basics — Myanmar's bare-knuckle "art of nine limbs": fists, elbows,
 * knees, feet/shins and the head. 10 techniques, side view, opponent drawn by
 * kt-partner.js with taped bare fists. Our own wording of widely described
 * Lethwei fundamentals; headbutts are shown for understanding only.
 */
(function (w) {
  'use strict';
  var S = w.KTFigure.S, C = S.col, KP = w.KTPartner, D2R = Math.PI / 180;
  function m() { var o = {}; for (var i = 0; i < arguments.length; i++) for (var k in arguments[i]) o[k] = arguments[i][k]; return o; }
  function cap(zh, en) { return { zh: zh, en: en }; }
  var sin = function (a) { return Math.sin(a * D2R); }, cos = function (a) { return Math.cos(a * D2R); };

  var X0 = 140;
  var LEGS = { x: X0, t: 4, h: 6, fN: { x: 20, y: 85 }, fF: { x: -22, y: 85 }, ftN: 90, ftF: 70, kbN: 1, kbF: 1, lift: 0 };
  // bare fists: the guard sits higher and closer to the head than a gloved one, forearms upright as shields
  var GUARD = { su: 75, sl: 205, fu: 65, fl: 208, laN: 1, ez: 1 };   // ez: how far apart the elbows are in the 3D view
  var BASE = m(KP.base, { hit: 0, oa1: 62, oa2: 186, ob1: 52, ob2: 190, ola: 14, olb: 4, ol: 16 });
  function P() { return m.apply(null, [BASE, LEGS, GUARD].concat([].slice.call(arguments))); }
  function grip(ox, ot, t) {      // both hands on the back of the opponent's neck (targets relative to the hip)
    var hx = ox - X0 - 74 * sin(ot) + 6, hy = -74 * cos(ot) + 8;
    return { hN: { x: hx, y: hy }, hF: { x: hx - 3, y: hy + 2 }, t: t || 0 };
  }
  function guardT(t) { var sx = 58 * sin(t), sy = -58 * cos(t); return { hN: { x: sx + 23, y: sy - 15 }, hF: { x: sx + 19, y: sy - 10 }, t: t }; }

  var CLIPS = {
    stance: { frames: [
      { d: 900, p: P({ ox: 262 }), c: cap('雙腳前後站，重心偏後，膝蓋微彎', 'Feet staggered, weight a little back, knees soft') },
      { d: 500, p: P({ ox: 262, h: 12 }), c: cap('雙手高舉護頭，下巴收緊——沒有拳套可以躲', 'Hands high and tight with the chin tucked — there are no gloves to hide behind') },
      { d: 900, p: P({ ox: 262 }), c: cap('手肘收緊護住身體，眼睛看對方胸口', 'Elbows in to cover the body; eyes on their chest') }
    ] },
    straight: { hit: 'hF', trail: 'hF', frames: [
      { d: 700, p: P({ ox: 220 }), c: cap('站架', 'Stance') },
      { d: 140, p: P({ ox: 220 }), e: 'in' },
      { d: 320, p: P({ t: 16, fu: 92, fl: 90, fF: { x: -18, y: 84 }, ftF: 40, ox: 220, ot: -8, oh: -10, hit: 1 }), e: 'out', c: cap('轉腳轉髖，用食指與中指的指節擊中', 'Pivot and turn the hips; land on the first two knuckles') },
      { d: 500, p: P({ ox: 222 }), c: cap('手腕保持一直線，立刻收回', 'Keep the wrist straight and snap it back') }
    ] },
    hook: { hit: 'hN', trail: 'hN', frames: [
      { d: 700, p: P({ ox: 212 }), c: cap('近距離站架', 'Stance at close range') },
      { d: 160, p: P({ x: X0 + 3, t: 6, ox: 212 }), c: cap('重心稍移到前腳', 'Shift a little weight onto the lead foot') },
      { d: 300, p: P({ t: 8, su: 88, sl: 90, laN: 0.35, hz: 0.55, ftN: 55, ox: 212, ot: -6, oh: -14, hit: 1 }), e: 'out', c: cap('轉身帶動，拳頭橫向勾入下巴側面', 'Turn the body and hook the fist across into the side of the jaw') },
      { d: 500, p: P({ ox: 214 }), c: cap('收回護頭', 'Back to the guard') }
    ] },
    headbutt: { hit: 'head', trail: 'head', frames: [
      { d: 700, p: P(guardT(4), { ox: 198 }), c: cap('對方在很近的距離', 'The opponent is very close') },
      { d: 300, p: P(grip(198, 4, -4), { ox: 198, ot: 4 }), c: cap('雙手扣住對方後頸，身體略往後', 'Grip behind their neck and sway back slightly') },
      { d: 220, p: P(grip(198, 8, 22), { h: 10, x: X0 + 6, ox: 198, ot: -6, oh: -20, hit: 1 }), e: 'out', c: cap('腿部蹬地，用前額（髮際線附近）往前撞', 'Drive from the legs and strike with the forehead near the hairline') },
      { d: 600, p: P(guardT(4), { ox: 206 }), c: cap('放開、回到護頭', 'Release and return to the guard') }
    ] },
    elbow: { hit: 'eF', trail: 'eF', frames: [
      { d: 700, p: P({ ox: 190 }), c: cap('近距離站架', 'Close-range stance') },
      { d: 200, p: P({ t: 10, fN: { x: 20, y: 78 }, fF: { x: -22, y: 78 }, fu: 20, fl: 150, ox: 190 }), c: cap('膝蓋微蹲、後手手肘放低', 'Dip the knees and drop the rear elbow') },
      { d: 260, p: P({ t: 14, fu: 120, fl: 275, ez: 0.3, fF: { x: -18, y: 84 }, ftF: 40, ox: 190, ot: -8, oh: -24, hit: 1 }), e: 'out', c: cap('蹬地，手肘由下往上頂向下巴', 'Drive up and spear the elbow upward under the chin') },
      { d: 600, p: P({ ox: 194 }), c: cap('回到護頭', 'Back to the guard') }
    ] },
    flyknee: { hit: 'kF', trail: 'kF', frames: [
      { d: 700, p: P({ ox: 222 }), c: cap('站架，對方低頭或往前', 'Stance; the opponent dips or comes forward') },
      { d: 220, p: P({ x: X0 + 10, fN: { x: 26, y: 84 }, fF: { x: -30, y: 76 }, ftF: 30, t: 0, ox: 222, ot: 10 }), c: cap('前腳踏出，準備起跳', 'Step in with the lead foot to take off') },
      { d: 260, p: P({ x: X0 + 22, lift: 34, fN: { x: -8, y: 62 }, fF: { x: 32, y: 26 }, ftF: 10, ftN: 40, t: -10, su: 82, sl: 98, fu: 78, fl: 102, ox: 222, ot: 4, oh: -20, hit: 1 }), e: 'out', c: cap('起跳，後膝往前上方頂，雙手往前', 'Jump and drive the rear knee up and forward, hands reaching out') },
      { d: 320, p: P({ x: X0 + 20, fN: { x: 20, y: 85 }, fF: { x: -22, y: 85 }, ox: 236 }), c: cap('落地站穩，立刻護頭', 'Land balanced and get the hands up') },
      { d: 500, p: P({ ox: 236 }) }
    ] },
    kick: { hit: 'shinF', trail: 'aF', frames: [
      { d: 700, p: P({ ox: 222 }), c: cap('站架', 'Stance') },
      { d: 180, p: P({ t: -8, fF: { x: 6, y: 50 }, ftF: 40, fu: -20, fl: -10, ftN: 60, ox: 222 }), c: cap('轉前腳，後腿往前上甩', 'Pivot the lead foot and swing the rear leg up') },
      { d: 160, p: P({ t: -32, h: 22, fF: { x: 78, y: 12 }, ftF: 95, fu: -60, fl: -40, ftN: 60, ox: 222, ot: -6, hit: 1 }), e: 'out', c: cap('轉髖，用脛骨踢中身體', 'Turn the hip over and land the shin on the body') },
      { d: 260, p: P({ t: -12, fF: { x: 20, y: 45 }, ftF: 40, fu: -20, fl: -10, ox: 228 }), c: cap('收腿', 'Recover the leg') },
      { d: 600, p: P({ ox: 228 }), c: cap('回到站架', 'Back to stance') }
    ] },
    push: { hit: 'aN', trail: 'aN', frames: [
      { d: 480, p: P({ ox: 236 }), c: cap('站架，對方逼近', 'Stance; the opponent steps in') },
      { d: 220, p: P({ x: X0 - 12, fN: { x: 32, y: 82 }, fF: { x: -10, y: 82 }, ox: 236 }) },   // weight settles on the back leg before the lead foot lifts
      { d: 220, p: P({ t: -6, fN: { x: 32, y: 38 }, ftN: 125, ox: 236 }), c: cap('前腳提膝', 'Lift the lead knee') },
      { d: 260, p: P({ t: -14, fN: { x: 82, y: 22 }, ftN: 178, ox: 240, ot: -10, hit: 1 }), e: 'out', c: cap('推髖，用腳掌把對方推開', 'Push the hips and drive the sole into them') },
      { d: 260, p: P({ t: -6, fN: { x: 32, y: 38 }, ftN: 125, ox: 262, ot: -6 }), c: cap('收腿', 'Re-chamber') },
      { d: 160, p: P({ x: X0 - 12, fN: { x: 32, y: 82 }, fF: { x: -10, y: 82 }, ox: 262 }) },
      { d: 460, p: P({ ox: 262 }), c: cap('回到站架', 'Back to stance') }
    ] },
    catch: { hit: 'hN', trail: null, frames: [
      { d: 700, p: P({ ox: 226 }), c: cap('站架', 'Stance') },
      { d: 200, p: P({ ox: 226, ola: 50, olb: 30, ot: 6 }), c: cap('對方起腿中段踢', 'They throw a body kick') },
      { d: 220, p: P({ t: 6, su: 35, sl: 105, ox: 226, ola: 82, olb: 88, ot: 14, hit: 1 }), e: 'out', c: cap('身體迎上去，前手從下方把腿夾住', 'Step into the kick and scoop the leg under your lead arm') },
      { d: 260, p: P({ t: 2, su: 35, sl: 105, fF: { x: 56, y: 80 }, ftF: 100, ox: 226, ola: 82, olb: 88, ot: -28, ol: 30 }), c: cap('後腿掃對方的支撐腳', 'Sweep their standing leg with your rear leg') },
      { d: 700, p: P({ ox: 238, ot: -10 }), c: cap('對方失去平衡，你回到站架', 'They lose their balance; you reset to stance') }
    ] },
    cover: { hit: null, trail: null, frames: [
      { d: 700, p: P({ ox: 214 }), c: cap('站架', 'Stance') },
      { d: 180, p: P({ ox: 214, oa1: 40, oa2: 120, ot: 2 }), c: cap('對方揮出勾拳', 'They swing a hook') },
      { d: 240, p: P({ su: 125, sl: 255, h: 16, t: 8, ox: 214, oa1: 88, oa2: 100, ot: 8 }), e: 'out', c: cap('手臂貼頭側，前臂擋住，下巴收、身體微前傾', 'Arm tight to the side of the head, forearm takes it, chin down, lean in a little') },
      { d: 280, p: P({ t: 16, fu: 92, fl: 90, fF: { x: -18, y: 84 }, ftF: 40, ox: 214, ot: -6 }), c: cap('擋完立刻用後手反擊', 'Counter straight away with the rear hand') },
      { d: 600, p: P({ ox: 216 }), c: cap('回到護頭', 'Back to the guard') }
    ] }
  };

  // one-legged moments (kicks, knees, shin blocks): the hips move over the standing foot so the figure never tips over;
  // the standing foot stays put and the partner keeps the distance the lesson drew (see KTFigure.balanceClip)
  ['kick', 'push'].forEach(function (k) { w.KTFigure.balanceClip(CLIPS[k].frames, { base: { x: X0 } }); });

  function makeClip(s, view, level, lang) {
    var src = CLIPS[s.id], pace = level < 1 ? 1.8 : 1;
    return {
      scale: 0.88, base: { x: X0 }, cx: X0, ticks: false, labelAt: [350, 28], still: 0.5,
      trail: src.trail || null,
      frames: src.frames.map(function (f) { return { d: Math.round(f.d * pace), p: f.p, e: f.e, c: f.c }; }),
      props: function (J, c) {
        var o = KP.draw(J, c, { cx: X0, wraps: true }), fr = '', hud = '', sc = c.scale;
        fr += S.circle(J.hF, 4.4 * sc, '#F4EFE6', '#8F95A3', 1.6) + S.circle(J.hN, 4.4 * sc, '#F4EFE6', C.ink, 1.6);   // taped fists
        if (src.hit && c.pose.hit > 0.15) {
          var pt = src.hit === 'shinF' ? S.mid(J.kF, J.aF, 0.6) : src.hit === 'head' ? { x: J.head.x + 8 * sc, y: J.head.y - 4 * sc } : J[src.hit];
          fr += KP.hit(pt, c.pose.hit);
          if (c.pose.hit > 0.6) hud += S.text(18, 30, (KT.pick('接觸點：', 'CONTACT: ')) + KT.t(s.contact), { size: 12, fill: C.red, family: "'JetBrains Mono','Noto Sans TC',monospace" });
        }
        return { back: o.svg, front: fr, hud: hud };
      }
    };
  }

  var LIST = [
    { id: 'stance', n: 1, zh: '站架', py: 'Stance & Guard', en: 'Stance & Guard',
      type: { zh: '基本', en: 'Foundation' }, contact: { zh: '—', en: '—' }, target: { zh: '—', en: '—' },
      tags: { zh: ['沒有拳套的防守', '手更高、更緊'], en: ['Defending without gloves', 'Hands higher and tighter'] },
      ability: { zh: '平衡與防守', en: 'Balance and defence' },
      note: { zh: '手高 · 肘緊 · 下巴收', en: 'HANDS HIGH · ELBOWS TIGHT · CHIN DOWN' },
      how: { zh: '雙腳前後站、約與肩同寬，重心略偏後，膝蓋微彎。因為是裸拳，雙手要舉得比戴拳套時更高、更貼近頭部，前臂可以當作盾牌；手肘收緊護住身體，下巴收。眼睛看對方胸口，同時留意頭部——緬甸拳允許頭撞。',
        en: 'Stand with feet staggered about shoulder-width, weight slightly back, knees soft. With bare fists there is no padding to hide behind, so hold the hands higher and closer to the head and use the forearms as shields; keep the elbows in and the chin tucked. Watch their chest — and their head, because headbutts are legal in Lethwei.' },
      mistakes: { zh: '用戴拳套的習慣「躲在手後」（裸拳擋不住）；下巴抬起；頭往前伸（容易被頭撞）；重心在前腳。', en: 'Hiding behind the hands as if wearing gloves (bare fists don\'t cover enough); chin up; poking the head forward (an easy headbutt target); weight on the front foot.' },
      practice: { zh: '對鏡保持站架並輕輕移動 3 × 1 分鐘，檢查手、肘、下巴的位置。', en: 'Hold and move in your stance in a mirror, 3 × 1 minute, checking hands, elbows and chin.' },
      use: { zh: '緬甸拳攻擊方式最多，站架必須同時防拳、肘、膝、腳和頭。', en: 'Lethwei has the most weapons of any striking art, so the stance must defend fists, elbows, knees, feet and the head.' },
      bars: [['防守', 'Defence', 92], ['平衡', 'Balance', 88], ['放鬆', 'Relaxation', 72], ['觀察', 'Awareness', 85]] },

    { id: 'straight', n: 2, zh: '裸拳直拳', py: 'Bare-knuckle Straight', en: 'Bare-knuckle Straight Punch',
      type: { zh: '拳', en: 'Punch' }, contact: { zh: '食指與中指指節', en: 'First two knuckles' }, target: { zh: '臉', en: 'Face' },
      tags: { zh: ['沒有拳套，結構更重要', '手腕一直線'], en: ['No gloves — structure matters more', 'A straight wrist'] },
      ability: { zh: '拳頭結構', en: 'Fist structure' },
      note: { zh: '轉腳轉髖 · 前兩個指節 · 手腕直', en: 'PIVOT & TURN · FIRST TWO KNUCKLES · STRAIGHT WRIST' },
      how: { zh: '和拳擊直拳一樣轉腳、轉髖出拳，但因為沒有拳套，要特別注意用食指與中指的指節擊中，手腕和前臂保持一直線，拳頭握緊。打完立刻收回護頭。',
        en: 'Throw it like a boxing cross — pivot and turn the hips — but with no glove you must land on the first two knuckles with the wrist and forearm in one straight line and the fist tightly closed. Snap it straight back to guard.' },
      mistakes: { zh: '用小指那側的指節打（容易骨折）；手腕彎曲；拳頭沒握緊；打硬的頭骨。', en: 'Landing on the little-finger knuckles (a common fracture); a bent wrist; a loose fist; punching hard skull bone.' },
      practice: { zh: '纏好手帶與紗布後，對手靶慢速練習 3 × 10，感受前兩個指節接觸。', en: 'With wraps and gauze, slow reps on pads, 3 × 10, feeling the first two knuckles connect.' },
      use: { zh: '裸拳的傷害集中，但手也容易受傷，所以選擇打擊的位置很重要。', en: 'Bare-knuckle punches cut and concentrate force — but hands break easily, so where you hit matters.' },
      bars: [['拳頭結構', 'Fist structure', 92], ['轉體', 'Rotation', 85], ['準確度', 'Accuracy', 85], ['防守', 'Defence', 72]] },

    { id: 'hook', n: 3, zh: '勾拳', py: 'Hook', en: 'Hook',
      type: { zh: '拳', en: 'Punch' }, contact: { zh: '前兩個指節', en: 'First two knuckles' }, target: { zh: '下巴側面', en: 'Side of the jaw' },
      tags: { zh: ['近距離重拳', '轉身帶動'], en: ['A short-range power punch', 'Driven by the body turn'] },
      ability: { zh: '近距離轉體', en: 'Short-range rotation' },
      note: { zh: '手肘抬平 · 轉身 · 手腕直', en: 'ELBOW LEVEL · TURN · STRAIGHT WRIST' },
      how: { zh: '重心稍移到前腳，轉腳轉髖，手臂彎成約 90°、手肘與拳同高，拳頭橫向勾入下巴側面。裸拳時手腕要保持直，避免扭傷。（側面動畫中拳頭往畫面內移動。）',
        en: 'Shift a little weight to the lead foot, pivot and turn the hips with the arm bent about 90° and the elbow level with the fist, hooking across into the side of the jaw. With bare fists keep the wrist straight to avoid spraining it. (In the side view the fist travels into the screen.)' },
      mistakes: { zh: '大甩拳、預告明顯；手肘掉下；手腕彎曲；另一手離開臉。', en: 'A wide, telegraphed swing; dropping the elbow; bending the wrist; the other hand leaving the face.' },
      practice: { zh: '對手靶練勾拳 3 × 10，再接在直拳之後。', en: 'Hooks on pads, 3 × 10, then chain them after the straight punch.' },
      use: { zh: '勾拳從視線外打入，是近戰中常見的擊倒拳。', en: 'Hooks come from outside the line of sight and are a common knockout punch up close.' },
      bars: [['轉體', 'Rotation', 90], ['手臂結構', 'Arm structure', 85], ['手腕穩定', 'Wrist stability', 85], ['防守', 'Defence', 70]] },

    { id: 'headbutt', n: 4, zh: '頭撞', py: 'Headbutt', en: 'Headbutt',
      type: { zh: '頭', en: 'Head' }, contact: { zh: '前額（髮際線附近）', en: 'Forehead near the hairline' }, target: { zh: '臉', en: 'Face' },
      tags: { zh: ['緬甸拳的招牌：第九種武器', '僅供理解，切勿對人練習'], en: ['Lethwei\'s signature ninth weapon', 'For understanding only — never practise on a person'] },
      ability: { zh: '近距離控制', en: 'Close-range control' },
      note: { zh: '扣住後頸 · 腿部發力 · 用前額', en: 'GRIP THE NECK · DRIVE FROM THE LEGS · USE THE FOREHEAD' },
      how: { zh: '頭撞是緬甸拳與其他站立格鬥最大的不同。在極近距離時，選手常先扣住對方後頸控制距離，再由腿部蹬地帶動身體，用前額髮際線附近較堅硬的部位往前撞向對方臉部，而不是用臉或頭頂。動畫只是讓你理解這個規則與動作——頭撞非常危險，只能在專業教練指導、使用合適護具的環境下學習，絕對不要對同伴或在任何其他情況下嘗試。',
        en: 'The headbutt is what sets Lethwei apart from other stand-up fighting. At very close range a fighter often grips the back of the opponent\'s neck to control the distance, then drives from the legs to strike with the hard part of the forehead near the hairline — not the face or the top of the head. This animation is only here so you understand the rule and the movement: headbutts are extremely dangerous and must only be learned under a qualified coach with suitable equipment. Never try one on a training partner or anyone else.' },
      mistakes: { zh: '用臉或頭頂撞（自己受傷）；低頭衝過去看不到對方；在沒有控制的距離亂撞。', en: 'Hitting with the face or the top of the head (you get hurt); charging in head-down and blind; lunging from out of range.' },
      practice: { zh: '本頁不提供頭撞練習方法；請只在合格的緬甸拳教練指導下學習。', en: 'This page gives no headbutt drill — learn it only from a qualified Lethwei coach.' },
      use: { zh: '頭撞讓近距離纏鬥更危險，也是緬甸拳選手必須特別注意防守頭部的原因。', en: 'Headbutts make close range far more dangerous — and are why Lethwei fighters guard their head so carefully.' },
      bars: [['近距離控制', 'Close control', 85], ['腿部發力', 'Leg drive', 80], ['時機', 'Timing', 85], ['頭部防守', 'Head defence', 90]] },

    { id: 'elbow', n: 5, zh: '上挑肘', py: 'Rising Elbow', en: 'Rising Elbow',
      type: { zh: '肘', en: 'Elbow' }, contact: { zh: '手肘前端', en: 'Point of the elbow' }, target: { zh: '下巴下方', en: 'Under the chin' },
      tags: { zh: ['近距離由下往上', '對付低頭衝進的人'], en: ['Upward at close range', 'Punishes a ducking opponent'] },
      ability: { zh: '近距離爆發', en: 'Close-range explosiveness' },
      note: { zh: '膝蓋微蹲 · 蹬地 · 手肘往上頂', en: 'DIP · DRIVE UP · ELBOW SPEARS UP' },
      how: { zh: '在近距離，膝蓋微蹲、後手手肘放低，接著雙腿蹬地，讓手肘由下往上頂向對方下巴，手掌靠近自己耳朵。另一手護頭，打完回到站架。',
        en: 'At close range, dip the knees and drop the rear elbow, then drive up through the legs so the elbow spears upward into the chin, with your hand finishing near your own ear. The other hand guards your head; return to stance.' },
      mistakes: { zh: '距離太遠；只抬手臂不用腿；手肘往外甩；打完露出空檔。', en: 'Throwing from too far; lifting the arm without the legs; flaring the elbow out; leaving an opening afterwards.' },
      practice: { zh: '對手靶慢速練 3 × 8，熟練後接在勾拳之後。', en: 'Slow reps on pads, 3 × 8, then add it after a hook.' },
      use: { zh: '當對方低頭衝進來時，上挑肘正好迎上。', en: 'When an opponent ducks and charges in, the rising elbow meets them on the way.' },
      bars: [['腿部發力', 'Leg drive', 85], ['近身距離', 'Close range', 90], ['時機', 'Timing', 85], ['防守', 'Defence', 70]] },

    { id: 'flyknee', n: 6, zh: '飛膝', py: 'Flying Knee', en: 'Flying Knee',
      type: { zh: '膝', en: 'Knee' }, contact: { zh: '膝蓋前端', en: 'Point of the knee' }, target: { zh: '胸口、下巴', en: 'Chest, chin' },
      tags: { zh: ['高風險、高威力', '對方低頭時使用'], en: ['High risk, high reward', 'When the opponent dips'] },
      ability: { zh: '爆發力與時機', en: 'Explosiveness and timing' },
      note: { zh: '踏步起跳 · 後膝往前上 · 落地護頭', en: 'STEP & JUMP · REAR KNEE UP & FORWARD · LAND GUARDED' },
      how: { zh: '前腳踏出作為起跳腳，往前上方跳起，同時後腿膝蓋往前上方頂向對方胸口或下巴，雙手往前保持平衡或控制對方。擊中後落地站穩，立刻回到護頭。',
        en: 'Step in with the lead foot to take off and jump forward and up, driving the rear knee up and forward into the chest or chin, with the hands reaching out for balance or control. Land balanced and get straight back into your guard.' },
      mistakes: { zh: '距離太遠跳空；起跳前停頓預告；落地失去平衡；落空後被反擊。', en: 'Jumping from too far; pausing before take-off (telegraphing); landing off balance; getting countered after a miss.' },
      practice: { zh: '先原地練「提膝跳」10 次，再對沙袋練 3 × 5，著重落地平衡。', en: 'Practise jumping knee lifts on the spot, 10 reps, then 3 × 5 on the bag, focusing on a balanced landing.' },
      use: { zh: '飛膝是緬甸拳和泰拳中常見的擊倒技，但落空的風險也大。', en: 'The flying knee is a classic finisher in Lethwei and Muay Thai — but costly if it misses.' },
      bars: [['爆發力', 'Explosiveness', 92], ['時機', 'Timing', 88], ['平衡', 'Balance', 80], ['協調', 'Coordination', 82]] },

    { id: 'kick', n: 7, zh: '中段踢', py: 'Roundhouse Kick', en: 'Roundhouse Kick',
      type: { zh: '腳', en: 'Kick' }, contact: { zh: '小腿脛骨', en: 'Shin' }, target: { zh: '身體側面', en: 'Side of the body' },
      tags: { zh: ['和泰拳相同的轉髖踢', '脛骨踢擊'], en: ['The same hip-turning kick as Muay Thai', 'Lands with the shin'] },
      ability: { zh: '轉髖爆發', en: 'Explosive hip turn' },
      note: { zh: '轉前腳 · 轉髖 · 脛骨 · 手往後擺', en: 'PIVOT · TURN THE HIP · SHIN · ARM SWINGS BACK' },
      how: { zh: '前腳腳尖往外轉，後腿往前上甩起並把髖部轉過去，用脛骨踢中身體側面，同側手往下往後擺幫助轉身，另一手護頭。踢完收回站架。',
        en: 'Turn the lead foot out, swing the rear leg up and turn the hip over, landing the shin on the side of the body. The arm on the kicking side swings down and back while the other hand guards the head. Recover to stance.' },
      mistakes: { zh: '前腳不轉；用腳背踢；兩手都掉下。', en: 'Not pivoting; kicking with the foot; dropping both hands.' },
      practice: { zh: '扶牆練轉腳轉髖 10 次，再到沙袋每腳 3 × 10。', en: '10 slow pivots holding a wall, then 3 × 10 per leg on the bag.' },
      use: { zh: '中段踢累積傷害，也能讓對方放低手而露出頭部。', en: 'Body kicks add up and draw the hands down, opening the head.' },
      bars: [['轉髖', 'Hip rotation', 92], ['支撐腳轉動', 'Pivot', 85], ['柔軟度', 'Flexibility', 78], ['平衡', 'Balance', 82]] },

    { id: 'push', n: 8, zh: '前推踢', py: 'Push Kick', en: 'Push Kick',
      type: { zh: '腳', en: 'Kick' }, contact: { zh: '腳掌', en: 'Sole of the foot' }, target: { zh: '腹部、髖部', en: 'Stomach, hips' },
      tags: { zh: ['控制距離', '打斷對方衝進'], en: ['Controls distance', 'Stops a rush'] },
      ability: { zh: '距離控制', en: 'Distance control' },
      note: { zh: '先提膝 · 推髖 · 腳掌', en: 'KNEE UP · PUSH THE HIPS · SOLE' },
      how: { zh: '前腿提膝，髖部往前推，用腳掌把對方推開，上身稍往後、雙手護頭，推完收回提膝再落地。',
        en: 'Lift the lead knee, push the hips forward and drive the sole of the foot into them, leaning back slightly with the hands up; re-chamber before putting the foot down.' },
      mistakes: { zh: '沒提膝直接甩；只用腿不推髖；手掉下來。', en: 'Swinging without the knee lift; no hip push; dropping the hands.' },
      practice: { zh: '對沙袋每腳 3 × 10。', en: '3 × 10 per leg on the bag.' },
      use: { zh: '當對方想近身頭撞或箍頸時，前推踢把距離推回來。', en: 'When they try to close in for headbutts or the clinch, the push kick restores the distance.' },
      bars: [['距離控制', 'Distance control', 92], ['髖部推送', 'Hip drive', 85], ['單腳平衡', 'One-leg balance', 82], ['時機', 'Timing', 80]] },

    { id: 'catch', n: 9, zh: '接腿掃倒', py: 'Catch & Sweep', en: 'Catch Kick & Sweep',
      type: { zh: '反擊', en: 'Counter' }, contact: { zh: '前手夾腿', en: 'Lead arm traps the leg' }, target: { zh: '對方的支撐腳', en: 'Their standing leg' },
      tags: { zh: ['把對方的踢變成機會', '緬甸拳允許摔與掃'], en: ['Turns their kick into your chance', 'Lethwei allows throws and sweeps'] },
      ability: { zh: '時機與控制', en: 'Timing and control' },
      note: { zh: '迎上去 · 夾住腿 · 掃支撐腳', en: 'STEP IN · TRAP THE LEG · SWEEP THE STANDING LEG' },
      how: { zh: '對方中段踢過來時，身體往前迎上去減少衝擊，前手從下方把對方的腿夾在腋下。接著用後腿掃對方的支撐腳，讓對方失去平衡倒地，自己回到站架。',
        en: 'As the body kick comes, step into it to take the sting out and scoop the leg up under your lead arm. Then sweep their standing leg with your rear leg so they lose balance, and reset to your stance.' },
      mistakes: { zh: '往後退接腿（被踢個正著）；只用手抓不夾緊；掃腳時自己失去平衡。', en: 'Catching while backing away (you take the full kick); grabbing with the hand instead of trapping; losing your own balance on the sweep.' },
      practice: { zh: '夥伴慢速輕踢，你練習迎上去夾腿 10 次；熟練後再在軟墊上加上掃腳。', en: 'Partner throws slow, light kicks while you step in and trap, 10 reps; then add the sweep, on mats only.' },
      use: { zh: '接腿掃倒讓喜歡踢腿的對手不敢亂踢。', en: 'Catching and sweeping makes a kicker think twice.' },
      bars: [['時機', 'Timing', 90], ['控制', 'Control', 85], ['平衡', 'Balance', 85], ['勇氣', 'Commitment', 78]] },

    { id: 'cover', n: 10, zh: '護頭擋擊', py: 'High Cover', en: 'High Cover & Counter',
      type: { zh: '防守', en: 'Defence' }, contact: { zh: '前臂與手肘', en: 'Forearm and elbow' }, target: { zh: '擋住勾拳', en: 'Block the hook' },
      tags: { zh: ['裸拳的防守重點', '擋完立刻反擊'], en: ['Key bare-knuckle defence', 'Block, then counter at once'] },
      ability: { zh: '反應與結構', en: 'Reaction and structure' },
      note: { zh: '手臂貼頭 · 下巴收 · 擋完反擊', en: 'ARM TIGHT TO THE HEAD · CHIN DOWN · COUNTER' },
      how: { zh: '對方勾拳打來時，同側手臂抬起緊貼頭側，用前臂和手肘擋住，下巴收、身體微向前，讓衝擊落在手臂上。擋完立刻用另一手直拳反擊。',
        en: 'As a hook comes in, raise the arm on that side tight against the side of your head so the forearm and elbow take the blow, chin down and leaning in slightly. Fire back immediately with a straight punch from the other hand.' },
      mistakes: { zh: '手臂離頭太遠（被打穿）；閉眼轉頭；只擋不反擊。', en: 'Holding the arm away from the head (the punch drives through); closing your eyes and turning away; blocking without countering.' },
      practice: { zh: '夥伴用手靶慢速從兩側揮打，你練擋＋反擊 3 × 1 分鐘。', en: 'Partner swings slowly from both sides with pads; block and counter, 3 × 1 minute.' },
      use: { zh: '沒有拳套時，只有手臂結構能擋住重拳，所以這個防守特別重要。', en: 'Without gloves only the structure of the arm can absorb a heavy shot, so this cover is vital.' },
      bars: [['反應', 'Reaction', 90], ['手臂結構', 'Arm structure', 88], ['反擊', 'Counter', 85], ['防守', 'Defence', 92]] }
  ];

  w.LETHWEI = { LIST: LIST, makeClip: makeClip };
})(window);
