/* Filipino Martial Arts (Kali / Eskrima / Arnis) basics — 8 lessons with the
 * single stick (baston): stance & grip, forehand and backhand diagonal strikes,
 * thrust, figure-8 flow, roof block & counter, live-hand check & disarm, and the
 * same angles with the empty hand. Side view; the grey figure (kt-partner.js)
 * is the training partner. Our own wording of widely taught FMA basics; angle
 * numbering differs between systems, so the page describes each angle in words.
 */
(function (w) {
  'use strict';
  var S = w.KTFigure.S, C = S.col, KP = w.KTPartner, D2R = Math.PI / 180;
  function m() { var o = {}; for (var i = 0; i < arguments.length; i++) for (var k in arguments[i]) o[k] = arguments[i][k]; return o; }
  function cap(zh, en) { return { zh: zh, en: en }; }

  var X0 = 140, STICK = 64;
  var LEGS = { x: X0, t: 6, h: 4, fN: { x: 24, y: 83 }, fF: { x: -24, y: 83 }, ftN: 90, ftF: 70, kbN: 1, kbF: 1, lift: 0 };
  // weapon hand forward with the stick up; live (empty) hand by the chest
  // (hzN: where the weapon hand is sideways in the 3D view: 1 = its own side, below 0 = across the body)
  var GUARD = { su: 50, sl: 125, sk: 150, skz: 0, sv: 1, fu: 40, fl: 160, hzN: 1 };
  // partner holds a stick too: osk = its stick angle, odrop 0..1 = knocked to the floor
  var BASE = m(KP.base, { hit: 0, ox: 236, oa1: 50, oa2: 125, ob1: 40, ob2: 160, osk: 150, odrop: 0, ol: 18, ola: 14 });
  function P() { return m.apply(null, [BASE, LEGS, GUARD].concat([].slice.call(arguments))); }

  var CHAMBER_F = { su: 110, sl: 243, sk: -125 };          // stick cocked over the weapon-side shoulder: hand by the ear, elbow forward
  var HIT_F = { su: 98, sl: 96, sk: 104, t: 12 };          // contact high, stick level with the target
  var FOLLOW_F = { su: 30, sl: 8, sk: -70, skz: 45, t: 14, hzN: -2.2 };   // follow-through low, across the body past the opposite hip
  var CHAMBER_B = { su: 90, sl: 210, sk: -165, skz: 55, laN: 0.7, hzN: -1.3 };   // hand in front of the opposite shoulder, clear of the face // stick by the opposite shoulder
  var HIT_B = { su: 100, sl: 88, sk: 78, t: 10, laN: 1 };
  var FOLLOW_B = { su: 55, sl: 35, sk: 25, t: 10, laN: 1 };
  var ROOF = { su: 162, sl: 172, sk: -55 };                // hand high, stick sloping down behind: strikes slide off

  var CLIPS = {
    stance: { frames: [
      { d: 900, p: P({ ox: 262 }), c: cap('握棍時棍尾留出約兩到三指寬', 'Grip the stick with two or three finger-widths of butt showing below the hand') },
      { d: 500, p: P({ ox: 262, sk: 160 }), c: cap('持棍手在前、棍子豎起，另一手（活手）護在胸前', 'Weapon hand forward with the stick up; the other, "live" hand guards the chest') },
      { d: 900, p: P({ ox: 262 }), c: cap('雙腳前後站，膝蓋微彎，重心平均', 'Feet staggered, knees soft, weight even') }
    ] },
    forehand: { hit: 'st', trail: 'st', frames: [
      { d: 600, p: P({ ox: 236 }), c: cap('戒備姿勢', 'Ready stance') },
      { d: 260, p: P(CHAMBER_F, { ox: 236 }), c: cap('棍子收到持棍手同側的肩上', 'Cock the stick over the shoulder on the weapon side') },
      { d: 150, p: P(HIT_F, { fF: { x: -20, y: 82 }, ftF: 40, ox: 236, ot: -6, oh: -10, hit: 1 }), e: 'out', c: cap('轉髖，棍子沿斜線由上往下打向對方頭側', 'Turn the hips and swing down on a diagonal to the side of the head') },
      { d: 260, p: P(FOLLOW_F, { fF: { x: -20, y: 82 }, ftF: 40, ox: 236 }), c: cap('順勢打穿到另一側髖部，不要停在目標上', 'Follow through past the opposite hip — don\'t stop on the target') },
      { d: 600, p: P({ ox: 236 }), c: cap('收回戒備姿勢', 'Recover to the ready stance') }
    ] },
    backhand: { hit: 'st', trail: 'st', frames: [
      { d: 600, p: P({ ox: 236 }), c: cap('戒備姿勢', 'Ready stance') },
      { d: 260, p: P(CHAMBER_B, { ox: 236 }), c: cap('棍子收到另一側肩上，手背朝外', 'Bring the stick across to the opposite shoulder, back of the hand facing out') },
      { d: 150, p: P(HIT_B, { ox: 236, ot: -6, oh: 10, hit: 1 }), e: 'out', c: cap('反手沿斜線往下打，用身體轉回帶動', 'Swing back down on the opposite diagonal, the body turning back with it') },
      { d: 260, p: P(FOLLOW_B, { ox: 236 }), c: cap('打穿後回到持棍側', 'Follow through and finish on the weapon side') },
      { d: 600, p: P({ ox: 236 }), c: cap('收回戒備姿勢', 'Recover to the ready stance') }
    ] },
    thrust: { hit: 'st', trail: 'st', frames: [
      { d: 600, p: P({ ox: 246 }), c: cap('戒備姿勢', 'Ready stance') },
      { d: 220, p: P({ su: -15, sl: 75, sk: 90, ox: 246 }), c: cap('棍子收到腰側，棍尖朝前', 'Draw the stick back to the hip, tip pointing forward') },
      { d: 180, p: P({ x: X0 + 14, su: 66, sl: 76, sk: 90, t: 16, fN: { x: 30, y: 83 }, fF: { x: -26, y: 82 }, ftF: 40, ox: 246, ot: 10, hit: 1 }), e: 'out', c: cap('前腳上步，手臂伸直，棍尖直線刺向腹部', 'Step in and drive the tip straight into the stomach, arm extending') },
      { d: 600, p: P({ ox: 248 }), c: cap('收回戒備', 'Back to the ready stance') }
    ] },
    eight: { hit: null, trail: 'st', frames: [
      { d: 300, p: P(CHAMBER_F, { ox: 262 }), c: cap('正手：從肩上斜劈往下', 'Forehand: from the shoulder, diagonally down') },
      { d: 240, p: P(FOLLOW_F, { ox: 262 }) },
      { d: 300, p: P(CHAMBER_B, { ox: 262 }), c: cap('手腕翻轉，棍子繞到另一側肩上', 'Roll the wrist and loop the stick up to the other shoulder') },
      { d: 240, p: P(FOLLOW_B, { ox: 262 }), c: cap('反手：斜劈往下，連成 8 字形不停流動', 'Backhand: diagonally down — the two strikes join into a non-stop figure 8') }
    ] },
    roof: { hit: 'st', trail: 'st', frames: [
      { d: 600, p: P({ ox: 222 }), c: cap('戒備姿勢', 'Ready stance') },
      { d: 200, p: P({ ox: 222, oa1: 160, oa2: 200, osk: -150 }), c: cap('對方舉棍從上往下打', 'They raise the stick to strike down') },
      { d: 220, p: P(ROOF, { t: 10, ox: 222, oa1: 120, oa2: 120, osk: 120, hit: 1 }), e: 'out', c: cap('持棍手舉到頭上，棍尖斜向後下，讓對方的棍子滑開', 'Raise the weapon hand overhead with the tip sloping down and back, so their stick slides off') },
      { d: 260, p: P(CHAMBER_F, { ox: 222, oa1: 90, oa2: 70, osk: 60 }), c: cap('順勢把棍子帶到肩上', 'Let the stick flow on round to the shoulder') },
      { d: 200, p: P(HIT_F, { ox: 222, oa1: 90, oa2: 70, osk: 60, ot: -6, oh: -10, hit: 1 }), e: 'out', c: cap('立刻正手反擊', 'Counter straight away with a forehand') },
      { d: 600, p: P({ ox: 226 }), c: cap('回到戒備', 'Back to the ready stance') }
    ] },
    disarm: { hit: 'hF', trail: 'hF', frames: [
      { d: 600, p: P({ ox: 214 }), c: cap('戒備姿勢，近距離', 'Ready stance at close range') },
      { d: 200, p: P({ ox: 214, oa1: 160, oa2: 200, osk: -150 }), c: cap('對方舉棍打來', 'They swing down') },
      { d: 220, p: P(ROOF, { ox: 214, oa1: 110, oa2: 110, osk: 110 }), e: 'out', c: cap('先用棍子擋住', 'Block with your stick first') },
      { d: 260, p: P(ROOF, { fu: 92, fl: 96, ox: 214, oa1: 105, oa2: 100, osk: 100, hit: 1 }), c: cap('活手立刻按住對方持棍的手（檢查）', 'The live hand immediately checks their weapon hand') },
      { d: 300, p: P({ su: 70, sl: 40, sk: 20, fu: 88, fl: 60, ox: 214, oa1: 70, oa2: 40, osk: 40, odrop: 1, t: 10 }), e: 'out', c: cap('用你的棍子把對方的棍子往下剝離手中', 'Use your stick to strip theirs downward out of their hand') },
      { d: 700, p: P({ x: X0 - 20, ox: 214, oa1: 40, oa2: 60, odrop: 1 }), c: cap('後退、保持距離', 'Step back to a safe distance') }
    ] },
    empty: { hit: 'hN', trail: 'hN', frames: [
      { d: 600, p: P({ sv: 0, ox: 220 }), c: cap('放下棍子，同樣的戒備姿勢', 'Put the stick down — same ready stance') },
      { d: 240, p: P(CHAMBER_F, { sv: 0, sl: 180, ox: 220 }), c: cap('手的動作和正手棍法一樣', 'The hand moves exactly as in the forehand stick strike') },
      { d: 160, p: P({ sv: 0, su: 96, sl: 70, t: 12, fF: { x: -20, y: 82 }, ftF: 40, ox: 220, ot: -6, oh: -10, hit: 1 }), e: 'out', c: cap('同一條斜線，變成錘拳或手刀', 'The same diagonal becomes a hammer fist or a slashing palm') },
      { d: 600, p: P({ sv: 0, ox: 222 }), c: cap('武器與空手用同一套角度', 'Weapon and empty hand share the same angles') }
    ] }
  };

  function tipOf(h, deg, len) { return { x: h.x + len * Math.sin(deg * D2R), y: h.y + len * Math.cos(deg * D2R) }; }

  function makeClip(s, view, level) {
    var src = CLIPS[s.id], pace = level < 1 ? 1.8 : 1;
    return {
      scale: 0.88, base: { x: X0 }, cx: X0, ticks: false, labelAt: [292, 26], still: 0.5,
      trail: src.trail || null,
      frames: src.frames.map(function (f) { return { d: Math.round(f.d * pace), p: f.p, e: f.e, c: f.c }; }),
      props: function (J, c) {
        var p = c.pose, sc = c.scale, o = KP.draw(J, c, { cx: X0 }), back = o.svg, fr = '', hud = '';
        // partner's stick (their angles are mirrored on screen); it drops to the floor when disarmed
        var oh = o.O.hN, a = -p.osk, ot = tipOf(oh, a, STICK * sc), ob = tipOf(oh, a + 180, 6 * sc);
        if (p.odrop > 0.02) {
          var k = Math.min(1, p.odrop), fl = { x: oh.x - 30 * sc, y: c.gy - 3 }, fl2 = { x: fl.x - STICK * sc, y: c.gy - 3 };
          ob = S.mid(ob, fl, k); ot = S.mid(ot, fl2, k);
        }
        back += S.line(ob, ot, '#B89B7A', 3.4);
        // your stick (rattan brown)
        var t = tipOf(J.hN, p.sk, STICK * sc), b = tipOf(J.hN, p.sk + 180, 7 * sc);
        J.st = t;
        if (p.sv > 0.5) fr += S.line(b, t, '#8B5A2B', 4) + S.circle(t, 2.2, '#8B5A2B');
        if (src.hit && p.hit > 0.15) {
          var pt = src.hit === 'st' && p.sv > 0.5 ? S.mid(J.hN, t, 0.85) : J[src.hit === 'st' ? 'hN' : src.hit];
          fr += KP.hit(pt, p.hit);
          if (p.hit > 0.6) hud += S.text(18, 30, KT.pick('接觸點：', 'CONTACT: ') + KT.t(s.contact), { size: 12, fill: C.red, family: "'JetBrains Mono','Noto Sans TC',monospace" });
        }
        return { back: back, front: fr, hud: hud };
      }
    };
  }

  var LIST = [
    { id: 'stance', n: 1, zh: '站姿與握棍', py: 'Stance & Grip', en: 'Stance & Grip',
      type: { zh: '基本', en: 'Foundation' }, contact: { zh: '—', en: '—' }, weapon: { zh: '單棍', en: 'Single stick' },
      tags: { zh: ['棍尾留兩三指', '活手永遠在工作'], en: ['Leave a little butt showing', 'The live hand is always working'] },
      ability: { zh: '控制與平衡', en: 'Control and balance' },
      note: { zh: '棍尾外露 · 握緊不僵 · 活手護胸', en: 'BUTT SHOWING · FIRM, NOT TENSE · LIVE HAND UP' },
      how: { zh: '用整隻手握棍，棍尾（punyo）在小指下方留出約兩到三指寬，可以用來近距離打擊或勾手。握得穩但不要死緊，手腕才能靈活轉動。持棍手放在身體前方、棍子豎起；另一隻手稱為「活手」，放在胸前，隨時準備檢查、推開或抓住對方的手。雙腳前後站、膝蓋微彎。',
        en: 'Hold the stick in a full grip with two or three finger-widths of the butt (punyo) showing below your little finger — it is used for close strikes and hooking. Grip firmly but not rigidly so the wrist can turn freely. Keep the weapon hand in front with the stick up; the other hand, the "live hand", stays by your chest ready to check, push or grab. Stand with feet staggered and knees soft.' },
      mistakes: { zh: '握在棍子最尾端（控制差、容易被打掉）；握太緊手腕僵硬；活手垂下不動；站得太直。', en: 'Holding the very end (poor control, easy to knock away); gripping so hard the wrist locks; letting the live hand hang; standing too upright.' },
      practice: { zh: '持棍保持戒備姿勢並前後移動 1 分鐘，檢查棍尾外露與活手位置。', en: 'Hold the ready stance with the stick and move forward and back for a minute, checking the butt and the live hand.' },
      use: { zh: 'FMA 先學武器再學空手，正確的握法與活手習慣是所有技術的基礎。', en: 'FMA usually teaches the weapon first; a correct grip and an active live hand underpin everything else.' },
      bars: [['握棍控制', 'Grip control', 88], ['平衡', 'Balance', 85], ['活手意識', 'Live-hand awareness', 85], ['放鬆', 'Relaxation', 75]] },

    { id: 'forehand', n: 2, zh: '正手斜劈', py: 'Forehand Diagonal', en: 'Forehand Diagonal Strike',
      type: { zh: '打擊', en: 'Strike' }, contact: { zh: '棍子前段', en: 'Upper part of the stick' }, weapon: { zh: '單棍', en: 'Single stick' },
      tags: { zh: ['許多流派的第一角度', '由上往下斜劈'], en: ['Angle 1 in many systems', 'High to low on a diagonal'] },
      ability: { zh: '轉髖與手腕', en: 'Hip turn and wrist' },
      note: { zh: '收到肩上 · 斜線往下 · 打穿目標', en: 'COCK OVER THE SHOULDER · DIAGONAL DOWN · FOLLOW THROUGH' },
      how: { zh: '把棍子收到持棍手同側的肩上，轉髖讓身體帶動手臂，棍子沿著斜線由上往下打向對方頭側或鎖骨，然後順勢打穿到另一側髖部，不要停在目標上。活手保持在胸前。很多流派把這條斜線稱為「第一角度」，但編號因流派而異。',
        en: 'Cock the stick over the shoulder on your weapon side, then turn the hips so the body drives the arm and the stick travels down a diagonal to the side of the head or the collarbone, following through past the opposite hip instead of stopping on the target. The live hand stays by your chest. Many systems call this line "angle 1", though the numbering varies between styles.' },
      mistakes: { zh: '只用手臂不轉髖；打到目標就停住（力量小、容易被抓）；活手垂下；棍子在身後繞大圈預告動作。', en: 'Arm only, no hip turn; stopping on the target (weak, easy to grab); dropping the live hand; a big telegraphed loop behind you.' },
      practice: { zh: '對著輪胎或打擊柱慢速練 20 次，再逐漸加快，左右手都要練。', en: '20 slow strikes on a tyre or striking post, then speed up; train both hands.' },
      use: { zh: '正手斜劈是最自然、最有力的打擊線，幾乎所有 FMA 流派都從它開始。', en: 'The forehand diagonal is the most natural, powerful line, and almost every FMA style starts with it.' },
      bars: [['轉髖', 'Hip rotation', 88], ['手腕', 'Wrist', 82], ['準確度', 'Accuracy', 80], ['打穿目標', 'Follow-through', 85]] },

    { id: 'backhand', n: 3, zh: '反手斜劈', py: 'Backhand Diagonal', en: 'Backhand Diagonal Strike',
      type: { zh: '打擊', en: 'Strike' }, contact: { zh: '棍子前段', en: 'Upper part of the stick' }, weapon: { zh: '單棍', en: 'Single stick' },
      tags: { zh: ['許多流派的第二角度', '正手的鏡像'], en: ['Angle 2 in many systems', 'The mirror of the forehand'] },
      ability: { zh: '反方向轉體', en: 'Turning back the other way' },
      note: { zh: '收到另一肩 · 手背朝外 · 轉回打穿', en: 'TO THE OTHER SHOULDER · BACK OF HAND OUT · TURN BACK THROUGH' },
      how: { zh: '把棍子收到另一側肩上，手背朝外，接著身體轉回來，帶動棍子沿相反的斜線由上往下打向對方另一側頭部，再打穿回到持棍側。正手和反手常常連在一起打。（側面動畫中兩種斜劈看起來相似，差別在於從哪一側的肩膀出發。）',
        en: 'Bring the stick across to your opposite shoulder with the back of the hand facing out, then turn the body back so the stick travels down the opposite diagonal to the other side of the head, following through to your weapon side. Forehand and backhand are usually thrown together. (In the side view the two diagonals look alike — the difference is which shoulder they start from.)' },
      mistakes: { zh: '手肘抬太高、動作太大；只用手腕甩；身體不轉回；活手擋住自己的路線。', en: 'Lifting the elbow too high in a big wind-up; flicking from the wrist only; no body turn; the live hand getting in the way.' },
      practice: { zh: '正手 + 反手連續打 20 次為一組，練 3 組。', en: 'Forehand + backhand pairs, 20 per set, 3 sets.' },
      use: { zh: '正反手配合，讓你可以從兩邊連續攻擊，不給對方空檔。', en: 'Paired with the forehand, it lets you strike from both sides without a gap.' },
      bars: [['轉體', 'Rotation', 85], ['手腕', 'Wrist', 85], ['協調', 'Coordination', 82], ['準確度', 'Accuracy', 80]] },

    { id: 'thrust', n: 4, zh: '直刺', py: 'Thrust', en: 'Thrust to the Body',
      type: { zh: '刺擊', en: 'Thrust' }, contact: { zh: '棍尖', en: 'Stick tip' }, weapon: { zh: '單棍', en: 'Single stick' },
      tags: { zh: ['最快、最直的攻擊', '上步配合'], en: ['The fastest, straightest attack', 'Step with it'] },
      ability: { zh: '距離與速度', en: 'Range and speed' },
      note: { zh: '收到腰側 · 上步 · 直線刺出', en: 'DRAW TO THE HIP · STEP IN · STRAIGHT LINE' },
      how: { zh: '棍子收到腰側、棍尖朝前，接著前腳上步、手臂伸直，棍尖沿直線刺向對方腹部，然後收回戒備。刺擊路線最短，常用來打斷對方的動作。',
        en: 'Draw the stick back to your hip with the tip forward, then step in with the lead foot and extend the arm so the tip drives straight into the stomach, and recover to the ready stance. The thrust takes the shortest path and is often used to interrupt the opponent.' },
      mistakes: { zh: '棍尖上下晃動；沒有上步只伸手；刺完停在前面被抓住棍子。', en: 'The tip wobbling up and down; reaching without stepping; leaving the stick out where it can be grabbed.' },
      practice: { zh: '對著掛起的網球或軟靶刺擊 3 × 10，要求每次都刺中同一點。', en: 'Thrust at a hanging ball or soft target, 3 × 10, hitting the same spot every time.' },
      use: { zh: '刺擊在 FMA 也是持刀技術的基礎，訓練的是直線與距離感。', en: 'In FMA the thrust also underpins blade work; it trains a straight line and distance.' },
      bars: [['距離感', 'Range', 88], ['速度', 'Speed', 85], ['步法', 'Footwork', 80], ['準確度', 'Accuracy', 85]] },

    { id: 'eight', n: 5, zh: '8 字流動', py: 'Figure-8 Flow', en: 'Figure-8 Flow',
      type: { zh: '流動練習', en: 'Flow drill' }, contact: { zh: '—', en: '—' }, weapon: { zh: '單棍', en: 'Single stick' },
      tags: { zh: ['正手反手連成一線', '手腕靈活的關鍵'], en: ['Forehand and backhand joined up', 'The key to a loose wrist'] },
      ability: { zh: '流暢與手腕', en: 'Flow and wrist' },
      note: { zh: '正手 → 翻腕 → 反手 → 不停', en: 'FOREHAND → ROLL THE WRIST → BACKHAND → NON-STOP' },
      how: { zh: '先打正手斜劈，打穿後手腕翻轉，讓棍子繞到另一側肩上，接著打反手斜劈，再翻腕回到原側，兩條斜線在身體前方交叉成 8 字形，一直流動不停。先慢慢做，熟練後加快速度。',
        en: 'Throw a forehand diagonal, roll the wrist as you follow through so the stick loops up to the other shoulder, throw a backhand diagonal, then roll back again — the two diagonals cross in front of you in a figure 8 that never stops. Start slowly and speed up as it becomes smooth.' },
      mistakes: { zh: '每一下之間停頓；用手臂畫大圈而不是用手腕；身體僵硬；眼睛看棍子不看前方。', en: 'Pausing between strikes; drawing big circles with the arm instead of the wrist; a stiff body; watching the stick instead of looking ahead.' },
      practice: { zh: '每天 3 × 1 分鐘，左右手輪流，可以配合前進後退的步法。', en: '3 × 1 minute a day, alternating hands, adding steps forward and back.' },
      use: { zh: '流動練習讓攻擊連續不斷，也是 FMA 雙棍編織練習（Sinawali）的基礎。', en: 'Flow drills make your attacks continuous and lead into the double-stick weaving drills (sinawali).' },
      bars: [['流暢度', 'Flow', 92], ['手腕靈活', 'Wrist mobility', 88], ['協調', 'Coordination', 85], ['節奏', 'Rhythm', 82]] },

    { id: 'roof', n: 6, zh: '屋頂擋與反擊', py: 'Roof Block & Counter', en: 'Roof Block & Counter',
      type: { zh: '防守＋反擊', en: 'Defend + counter' }, contact: { zh: '棍子斜面', en: 'The sloping stick' }, weapon: { zh: '單棍', en: 'Single stick' },
      tags: { zh: ['讓對方的棍子滑開', '擋完立刻反擊'], en: ['Let their stick slide off', 'Counter straight after'] },
      ability: { zh: '時機與流動', en: 'Timing and flow' },
      note: { zh: '手舉頭上 · 棍尖斜向後下 · 順勢反擊', en: 'HAND OVERHEAD · TIP SLOPES DOWN AND BACK · FLOW INTO THE COUNTER' },
      how: { zh: '對方從上方打下來時，把持棍手舉到頭的上方，棍尖斜向後下方，像屋頂一樣讓對方的棍子沿著你的棍子滑開，而不是硬碰硬。接著順勢把棍子帶到肩上，立刻用正手反擊。',
        en: 'As a strike comes down from above, raise your weapon hand above your head with the tip sloping down and back, like a roof, so their stick slides off along yours instead of meeting it head-on. Let the stick flow on round to your shoulder and counter at once with a forehand.' },
      mistakes: { zh: '棍子水平硬擋（手會被震痛、棍子可能被打斷）；手舉得不夠高；擋完停住不反擊。', en: 'Blocking flat and square (jars the hand and can break the stick); not raising the hand high enough; stopping after the block.' },
      practice: { zh: '夥伴慢速從上方劈下，你練屋頂擋 → 反擊，10 次一組。全程戴護具並慢速進行。', en: 'Partner strikes slowly from above while you roof-block and counter, sets of 10 — with protective gear and slow speed.' },
      use: { zh: '屋頂擋把防守和攻擊連成一個流動動作，是 FMA「擋即是打」思想的代表。', en: 'The roof block turns defence and attack into one flowing move — a good example of FMA\'s "the block is the strike" idea.' },
      bars: [['時機', 'Timing', 90], ['流動', 'Flow', 85], ['角度', 'Angles', 85], ['反擊', 'Counter', 82]] },

    { id: 'disarm', n: 7, zh: '活手檢查與繳械', py: 'Check & Disarm', en: 'Live-Hand Check & Disarm',
      type: { zh: '控制', en: 'Control' }, contact: { zh: '活手按住對方的手', en: 'Live hand on their weapon hand' }, weapon: { zh: '單棍', en: 'Single stick' },
      tags: { zh: ['擋 → 檢查 → 剝離', '活手的真正用途'], en: ['Block → check → strip', 'What the live hand is for'] },
      ability: { zh: '控制與協調', en: 'Control and coordination' },
      note: { zh: '先擋 · 活手按住 · 往下剝離 · 拉開距離', en: 'BLOCK · CHECK WITH THE LIVE HAND · STRIP DOWN · GET DISTANCE' },
      how: { zh: '先用棍子擋住對方的攻擊，活手立刻按住對方持棍的手或手腕（稱為檢查），讓對方無法再收回攻擊。接著用你的棍子把對方的棍子往下剝離手中，最後後退拉開距離。這是最基本的繳械之一，練習時一定要慢、要戴護具。',
        en: 'Block their strike with your stick, then immediately pin their weapon hand or wrist with your live hand (the "check") so they cannot pull back for another strike. Use your stick to strip theirs downward out of their hand, then step back to a safe distance. It is one of the most basic disarms — always practise it slowly and with protective gear.' },
      mistakes: { zh: '擋完才想到用活手（太慢）；抓住對方的棍子而不是手（容易被抽走或割傷——若是刀）；繳械後留在原地。', en: 'Remembering the live hand only after the block (too slow); grabbing their stick instead of their hand (easily pulled away — and a blade would cut); staying close after the disarm.' },
      practice: { zh: '夥伴非常慢地打下來，你練「擋 → 檢查 → 剝離」10 次，熟練後才逐漸加快。', en: 'Partner strikes very slowly while you block → check → strip, 10 reps; speed up only once it is smooth.' },
      use: { zh: '活手是 FMA 的特色之一：持棍手負責攻防，活手負責控制。', en: 'The live hand is a hallmark of FMA: the weapon hand attacks and defends, the live hand controls.' },
      bars: [['控制', 'Control', 90], ['協調', 'Coordination', 88], ['時機', 'Timing', 85], ['安全意識', 'Safety', 80]] },

    { id: 'empty', n: 8, zh: '空手應用', py: 'Empty-Hand Application', en: 'Empty-Hand Application',
      type: { zh: '空手', en: 'Empty hand' }, contact: { zh: '拳底或手掌', en: 'Bottom of the fist or the palm' }, weapon: { zh: '空手', en: 'Empty hand' },
      tags: { zh: ['武器與空手同一套角度', 'FMA 的核心概念'], en: ['Weapon and hand share the same angles', 'A core FMA idea'] },
      ability: { zh: '轉換與理解', en: 'Transfer and understanding' },
      note: { zh: '同樣的斜線 · 錘拳或手刀 · 活手照樣工作', en: 'SAME DIAGONAL · HAMMER FIST OR PALM · LIVE HAND STILL WORKS' },
      how: { zh: 'FMA 的特點是武器和空手使用同一套角度與動作。放下棍子後，正手斜劈的手部動作就變成由上往下的錘拳或手掌劈擊，反手斜劈變成反手拍擊或手肘，活手的檢查也一樣適用。所以練好棍法，空手技術也會同時進步。',
        en: 'A hallmark of FMA is that weapon and empty hand use the same angles and movements. Put the stick down and the forehand diagonal becomes a downward hammer fist or slashing palm, the backhand becomes a backhand slap or elbow, and the live-hand check works just the same. Train the stick well and your empty-hand skills improve at the same time.' },
      mistakes: { zh: '以為空手要重新學一套；用指節打而不是拳底；忘了活手。', en: 'Thinking empty hand is a separate system; hitting with the knuckles instead of the bottom of the fist; forgetting the live hand.' },
      practice: { zh: '同一組練習先用棍子做 10 次，再空手做 10 次，感受動作完全相同。', en: 'Do a drill 10 times with the stick, then 10 times empty-handed, feeling that the movement is identical.' },
      use: { zh: '這個「一套角度、多種工具」的原則，讓 FMA 成為很實用的自我防衛系統。', en: 'This "one set of angles, many tools" principle is what makes FMA such a practical self-defence system.' },
      bars: [['轉換能力', 'Transfer', 90], ['角度理解', 'Angle awareness', 88], ['活手', 'Live hand', 82], ['協調', 'Coordination', 80]] }
  ];

  w.FMA = { LIST: LIST, makeClip: makeClip };
})(window);
