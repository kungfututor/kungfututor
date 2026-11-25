/* Self-defence basics — 8 moves, data, poses and bilingual text.
 * Our own wording of widely taught personal-safety basics (the "fence",
 * distance, simple strikes, a wrist-grab release and covering up).
 * Every clip shows a grey figure for the other person. The goal of every
 * move is the same: create a moment, then get away and get help.
 */
(function (w) {
  'use strict';
  var F = w.KTFigure, S = F.S, C = S.col;
  function m() { var o = {}; for (var i = 0; i < arguments.length; i++) for (var k in arguments[i]) o[k] = arguments[i][k]; return o; }
  function cap(zh, en) { return { zh: zh, en: en }; }

  /* ---------- defender poses (side view, facing +x) ----------
   * Every frame carries the same keys so nothing "sticks" between frames:
   * legs always use foot targets; the extra keys (o*, g, hit, say, dist) drive the props painter. */
  var X0 = 135;
  var STAND = { x: X0, t: 0, h: 0, fN: { x: 6, y: 87 }, fF: { x: -6, y: 87 }, ftN: 90, ftF: 90, su: 8, sl: 14, fu: -8, fl: -2 };
  var FENCE = { x: X0, t: 4, h: 0, fN: { x: 24, y: 84 }, fF: { x: -30, y: 84 }, ftN: 90, ftF: 75, su: 48, sl: 128, fu: 30, fl: 145 };
  // the other person (grey) — numeric keys only, so they interpolate cleanly
  var OPP = { ox: 270, ot: 0, oh: 0, oa1: 10, oa2: 15, ob1: -8, ob2: -2, ol: 4, g: 0, hit: 0, say: 0, dist: 0 };
  function P() { return m.apply(null, [OPP].concat([].slice.call(arguments))); }

  /* ---------- the eight clips ---------- */
  var CLIPS = {
    fence: { hitJ: null, trail: null, frames: [
      { d: 900, p: P(STAND, { ox: 305, ol: 14 }), c: cap('對方走近，語氣或動作讓你不安', 'Someone approaches and their words or body language feel wrong') },
      { d: 450, p: P(STAND, { ox: 268, ol: 4 }) },
      { d: 420, p: P(FENCE, { x: X0 - 8, ox: 268 }), e: 'out', c: cap('後腳退半步斜站，雙手張開舉到胸前', 'Step one foot back, turn slightly side-on, raise open hands to chest height') },
      { d: 1100, p: P(FENCE, { x: X0 - 8, ox: 268, say: 1 }), c: cap('手掌向前、聲音堅定：「退後！」', 'Palms forward, firm loud voice: "Stay back!"') },
      { d: 500, p: P(FENCE, { x: X0 - 8, ox: 268, say: 1 }) }
    ] },

    distance: { hitJ: null, trail: null, frames: [
      { d: 700, p: P(FENCE, { ox: 262, dist: 1 }), c: cap('戒備姿勢，留意對方雙手', 'In the fence, watch their hands') },
      { d: 420, p: P(FENCE, { ox: 238, ol: 14, dist: 1 }), c: cap('對方上前一步……', 'They step in…') },
      { d: 460, p: P(FENCE, { x: X0 - 24, ox: 238, dist: 1 }), e: 'out', c: cap('你就後退一步，保持一臂以上的距離', '…you step back, keeping more than an arm\'s length between you') },
      { d: 900, p: P(FENCE, { x: X0 - 24, ox: 238, dist: 1, say: 1 }), c: cap('同時找出口、大聲求助，準備離開', 'Look for the exit, shout for help, get ready to leave') },
      { d: 400, p: P(FENCE, { x: X0 - 24, ox: 238, dist: 1, say: 1 }) }
    ] },

    palm: { hitJ: 'hF', trail: 'hF', frames: [
      { d: 700, p: P(FENCE, { ox: 228, oa1: 55, oa2: 70 }), c: cap('對方逼近、伸手——你在戒備姿勢中', 'They close in and reach for you — you are in the fence') },
      { d: 170, p: P(FENCE, { ox: 228, oa1: 62, oa2: 78 }), e: 'in' },
      { d: 380, p: P(FENCE, { t: 12, fu: 92, fl: 112, ftF: 60, ox: 228, oa1: 62, oa2: 78, ot: -14, oh: -22, hit: 1 }), e: 'out', c: cap('後手掌根由下往上推向下巴，後腳蹬地、轉腰', 'Drive the heel of the rear palm up into the chin, pushing off the back foot and turning the hips') },
      { d: 380, p: P(FENCE, { ox: 236, ot: -8, oh: -10 }), c: cap('立刻收回戒備', 'Snap straight back to the fence') },
      { d: 800, p: P(FENCE, { x: X0 - 30, ox: 236, ot: -4 }), c: cap('拉開距離，離開現場、求助', 'Open the distance, leave, get help') }
    ] },

    hammer: { hitJ: 'hN', trail: 'hN', frames: [
      { d: 650, p: P(FENCE, { ox: 236, oa1: 70, oa2: 82 }), c: cap('對方伸手抓過來', 'They reach out to grab you') },
      { d: 300, p: P(FENCE, { su: 110, sl: 243, t: 0, ox: 236, oa1: 72, oa2: 84 }), c: cap('前手握拳，舉到肩上', 'Make a fist with the lead hand and raise it above the shoulder') },   // fist by the ear, elbow forward — a short wind-up
      { d: 300, p: P(FENCE, { su: 72, sl: 62, t: 10, ox: 236, oa1: 50, oa2: 40, ot: 6, hit: 1 }), e: 'out', c: cap('用拳底（小指那側）往下砸向伸來的手臂或臉', 'Bring the bottom of the fist (little-finger side) down onto the reaching arm or face') },
      { d: 380, p: P(FENCE, { ox: 240, oa1: 20, oa2: 25 }), c: cap('收回戒備', 'Back to the fence') },
      { d: 800, p: P(FENCE, { x: X0 - 30, ox: 240 }), c: cap('後退、離開', 'Step back and leave') }
    ] },

    elbow: { hitJ: 'eN', trail: 'eN', grab: 'sh', frames: [
      { d: 750, p: P(FENCE, { su: 20, sl: 120, ox: 192, oa1: 70, oa2: 85, g: 1 }), c: cap('對方太近，抓住你的衣領', 'They are too close and grab your collar') },
      { d: 260, p: P(FENCE, { su: 5, sl: 160, t: 0, ox: 192, oa1: 70, oa2: 85, g: 1 }), c: cap('手肘向後收，準備轉腰', 'Draw the elbow back and load the hips') },   // elbow back by the ribs, hand staying up by the chest
      { d: 260, p: P(FENCE, { su: 96, sl: -70, t: 18, ftF: 60, ox: 192, oa1: 70, oa2: 85, g: 1, ot: -7, oh: -18, hit: 1 }), e: 'out', c: cap('轉腰，手肘水平向前打向下巴', 'Turn the hips and swing the elbow forward, level, into the jaw') },
      { d: 380, p: P(FENCE, { su: 88, sl: 92, fu: 82, fl: 95, t: 10, ox: 238, ot: -6, g: 0 }), c: cap('雙掌推開對方', 'Shove them away with both palms') },
      { d: 800, p: P(FENCE, { x: X0 - 30, ox: 240 }), c: cap('後退、離開', 'Step back and leave') }
    ] },

    kick: { hitJ: 'aF', trail: 'aF', frames: [
      { d: 700, p: P(FENCE, { ox: 245, oa1: 40, oa2: 55 }), c: cap('戒備姿勢，對方一步步逼近', 'In the fence; they keep closing in') },
      { d: 260, p: P(FENCE, { fF: { x: 24, y: 42 }, ftF: 120, t: -4, ox: 245, oa1: 40, oa2: 55 }), c: cap('後腿提膝', 'Lift the back knee') },
      { d: 220, p: P(FENCE, { fF: { x: 68, y: 66 }, ftF: 165, t: -10, ox: 245, oa1: 30, oa2: 40, ot: 8, hit: 1 }), e: 'out', c: cap('腳跟踹向對方膝蓋或小腿脛骨', 'Thrust the heel into their knee or shin') },
      { d: 260, p: P(FENCE, { fF: { x: 24, y: 42 }, ftF: 120, t: -4, ox: 250, ot: 4 }), c: cap('收腿，保持平衡', 'Pull the leg back, stay balanced') },
      { d: 380, p: P(FENCE, { ox: 250 }) },                                          // the foot comes down in the stance first…
      { d: 800, p: P(FENCE, { x: X0 - 30, ox: 250 }), c: cap('落地後退、離開', 'Plant the foot, step back, leave') }   // …then both feet step back
    ] },

    wrist: { hitJ: null, trail: 'hN', grab: 'hN', frames: [
      { d: 800, p: P(FENCE, { su: 40, sl: 62, ox: 232, oa1: 60, oa2: 70, g: 1 }), c: cap('對方抓住你的手腕', 'They grab your wrist') },
      { d: 520, p: P(FENCE, { x: X0 + 8, su: 22, sl: 112, ox: 232, g: 1 }), c: cap('不要硬拉：屈肘、身體靠近一點', 'Don\'t pull straight back: bend the elbow and step a little closer') },
      { d: 260, p: P(FENCE, { x: X0 + 8, su: 55, sl: 178, ox: 232, g: 0, oa1: 45, oa2: 55 }), e: 'out', c: cap('朝對方拇指的方向（虎口）快速轉出', 'Rip the arm out towards their thumb — the gap where the grip is weakest') },
      { d: 380, p: P(FENCE, { ox: 236, oa1: 20, oa2: 25 }), c: cap('立刻回到戒備', 'Straight back into the fence') },
      { d: 800, p: P(FENCE, { x: X0 - 30, ox: 236 }), c: cap('後退、離開', 'Step back and leave') }
    ] },

    cover: { hitJ: null, trail: 'hN', frames: [
      { d: 600, p: P(FENCE, { ox: 236, oa1: -40, oa2: -10, ot: -4 }), c: cap('對方揮拳打向頭部', 'They swing a punch at your head') },
      { d: 220, p: P(FENCE, { su: 125, sl: 255, fu: 119, fl: 250, ez: 0.45, t: 14, h: 14, ox: 232, oa1: 78, oa2: 96, ot: 8 }), e: 'out', c: cap('雙臂抬起護住頭兩側，收下巴、身體微向前', 'Raise both forearms to frame the head, chin tucked, body leaning in slightly') },
      { d: 550, p: P(FENCE, { su: 125, sl: 255, fu: 119, fl: 250, ez: 0.45, t: 14, h: 14, ox: 232, oa1: 70, oa2: 80, ot: 4 }) },   // hands at the sides of the head, elbows forward
      { d: 380, p: P(FENCE, { su: 88, sl: 92, fu: 82, fl: 95, t: 10, ox: 262, ot: -6 }), c: cap('雙掌推開，製造空間', 'Shove with both palms to make space') },
      { d: 800, p: P(FENCE, { x: X0 - 30, ox: 262 }), c: cap('後退、離開、求助', 'Step back, leave, get help') }
    ] }
  };

  // one-legged moments (kicks): the hips move over the standing foot so the figure never tips over;
  // the standing foot stays put and the partner keeps the distance the lesson drew (see KTFigure.balanceClip)
  ['kick'].forEach(function (k) { w.KTFigure.balanceClip(CLIPS[k].frames, { base: { x: X0 } }); });

  /* ---------- props: the other person, contact flash, distance bar ---------- */
  var OCOL = '#AEB3BE', OCOL_F = '#CDD0D7';
  function reach(sh, tg, L1, L2) {          // 2-bone arm in screen space, elbow hangs down
    var dx = tg.x - sh.x, dy = tg.y - sh.y, d = Math.sqrt(dx * dx + dy * dy);
    d = Math.max(Math.abs(L1 - L2) + 0.01, Math.min(L1 + L2 - 0.01, d));
    var ux = dx / (Math.sqrt(dx * dx + dy * dy) || 1), uy = dy / (Math.sqrt(dx * dx + dy * dy) || 1);
    var a = (L1 * L1 - L2 * L2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, L1 * L1 - a * a));
    var b = { x: sh.x + ux * a, y: sh.y + uy * a };
    var e1 = { x: b.x - uy * h, y: b.y + ux * h }, e2 = { x: b.x + uy * h, y: b.y - ux * h };
    var e = e1.y > e2.y ? e1 : e2;
    return { e: e, h: { x: sh.x + ux * d, y: sh.y + uy * d } };
  }
  function opponent(J, c, clip) {
    var p = c.pose, sc = c.scale;
    var q = { x: p.ox, t: p.ot, h: p.oh, su: p.oa1, sl: p.oa2, fu: p.ob1, fl: p.ob2,
      tu: p.ol, tl: p.ol * 0.3, bu: -p.ol, bl: -p.ol * 0.6, lift: 0 };
    var O = F.solve(q, { groundY: c.gy, scale: sc, cx: clip.cx });
    var X = O.hip.x;
    for (var n in O) O[n] = { x: 2 * X - O[n].x, y: O[n].y };      // turn to face the defender
    // grabbing hand follows the defender's joint while g = 1
    var hand = O.hN, elbow = O.eN;
    if (clip.grab && p.g > 0.02) {
      var tgt = J[clip.grab], want = S.mid(O.hN, tgt, Math.min(1, p.g));
      var r = reach(O.shN, want, F.DIM.upper * sc, F.DIM.fore * sc);
      hand = r.h; elbow = r.e;
    }
    var wd = 7.5 * sc;
    var out = '';
    out += S.poly([O.hipF, O.kF, O.aF, O.tF], OCOL_F, wd);
    out += S.poly([O.shF, O.eF, O.hF], OCOL_F, wd);
    out += S.poly([O.hipN, O.kN, O.aN, O.tN], OCOL, wd);
    out += S.poly([O.hip, O.sh], OCOL, wd);
    out += S.circle(O.head, F.DIM.head * sc, '#fff', OCOL, 3.2);
    out += S.poly([O.shN, elbow, hand], OCOL, wd);
    if (clip.grab && p.g > 0.5) out += S.circle(hand, 5, OCOL, '#fff', 1.5);
    return { svg: out, O: O };
  }

  function makeClip(s, view, level, lang) {
    var src = CLIPS[s.id], pace = level < 1 ? 1.6 : 1;
    var clip = {
      scale: 0.88, base: { x: X0 }, cx: X0, ticks: false, labelAt: [330, 40], still: 0.5,
      trail: src.trail, grab: src.grab,
      frames: src.frames.map(function (fr) { return { d: Math.round(fr.d * pace), p: fr.p, e: fr.e, c: fr.c }; })
    };
    clip.props = function (J, c) {
      var p = c.pose, o = opponent(J, c, clip), fr = '', hud = '';
      if (p.dist > 0.5) {                       // arm's-length gap between the two lead hands
        var y = c.gy - 132, a = { x: J.hN.x + 4, y: y }, b = { x: o.O.hN.x - 4, y: y };
        if (b.x > a.x + 6) {
          fr += S.line(a, b, C.jade, 2, ' stroke-dasharray="5 4"');
          fr += S.line({ x: a.x, y: y - 6 }, { x: a.x, y: y + 6 }, C.jade, 2) + S.line({ x: b.x, y: y - 6 }, { x: b.x, y: y + 6 }, C.jade, 2);
        }
        hud += S.text(18, 30, KT.pick('安全距離：一臂以上', 'SAFE GAP: MORE THAN AN ARM'), { size: 12, fill: C.jade, family: "'JetBrains Mono','Noto Sans TC',monospace" });
      }
      if (src.hitJ && p.hit > 0.15) {
        var hp = J[src.hitJ];
        fr += S.circle(hp, 5 + 9 * p.hit, 'none', C.red, 2.5, ' opacity="' + Math.min(1, p.hit) + '"');
        fr += S.circle(hp, 5, C.red, '#fff', 1.5);
        if (p.hit > 0.6) hud += S.text(18, 30, (KT.pick('目標：', 'TARGET: ')) + KT.t(s.target), { size: 12, fill: C.red, family: "'JetBrains Mono','Noto Sans TC',monospace" });
      }
      if (p.say > 0.5) hud += S.text(18, p.dist > 0.5 ? 50 : 30, KT.pick('「退後！」', '"STAY BACK!"'), { size: 15, fill: C.red });
      return { back: o.svg, front: fr, hud: hud };
    };
    return clip;
  }

  /* ---------- the eight moves ---------- */
  var LIST = [
    { id: 'fence', n: 1, zh: '戒備姿勢', py: 'The Fence', en: 'The Fence (Ready Stance)',
      type: { zh: '預防', en: 'Prevent' }, target: { zh: '—（不攻擊）', en: '— (no strike)' },
      when: { zh: '對方靠近、氣氛不對時', en: 'Someone closes in and things feel wrong' },
      tags: { zh: ['第一步：先保護自己', '斜站 · 張開雙手 · 大聲說話'], en: ['Step one: protect yourself', 'Side-on · open hands · loud voice'] },
      ability: { zh: '冷靜、清楚地設下界線', en: 'Setting a calm, clear boundary' },
      note: { zh: '手在胸前 · 掌心向外 · 聲音堅定', en: 'HANDS UP · PALMS OUT · FIRM VOICE' },
      how: { zh: '一腳後退半步，身體稍微斜向對方，膝蓋微彎、重心平均。雙手張開、掌心向外舉到胸前與下巴之間，手肘微彎，就像在說「停」。大聲、堅定地說「退後！」。這個姿勢看起來不具攻擊性，旁人會看到你在拒絕，但你的雙手已經擋在中間，隨時可以防守或推開。',
        en: 'Step one foot back half a pace and turn slightly side-on, knees soft, weight even. Raise your open hands between chest and chin height, palms out and elbows bent — like signalling "stop". Say "Stay back!" loudly and firmly. It looks calm to anyone watching, but your hands are already between you and them, ready to block or push.' },
      mistakes: { zh: '握拳舉起（看起來像要打架、容易激怒對方）；雙手放太低或插口袋；站得太正、兩腳併攏，一推就倒；小聲道歉、不敢說「不」。',
        en: 'Raising fists (looks like you want a fight and can escalate it); hands low or in pockets; standing square with feet together so one push knocks you over; speaking quietly or apologising instead of saying "No".' },
      practice: { zh: '對鏡練習從自然站立「一步」進入戒備姿勢，每次配合說出「退後！」，左右各 10 次，直到不用想就做得到。',
        en: 'In front of a mirror, go from relaxed standing to the fence in one step, saying "Stay back!" each time — 10 times each side until it happens without thinking.' },
      use: { zh: '所有自我防衛課程幾乎都從這個姿勢開始：它既是溝通，也是防守的起點。後面每個動作都從這裡出發。',
        en: 'Almost every self-defence course starts here: it is both a message and a guard. Every other move on this page starts from it.' },
      bars: [['設立界線', 'Setting a boundary', 92], ['站姿穩定', 'Stable stance', 80], ['雙手位置', 'Hand position', 85], ['聲音與自信', 'Voice & confidence', 90]] },

    { id: 'distance', n: 2, zh: '保持距離', py: 'Keep Your Distance', en: 'Keep Your Distance',
      type: { zh: '預防', en: 'Prevent' }, target: { zh: '—（不攻擊）', en: '— (no strike)' },
      when: { zh: '對方一直逼近', en: 'They keep stepping towards you' },
      tags: { zh: ['距離就是安全', '對方進一步，你退一步'], en: ['Distance is safety', 'They step in, you step back'] },
      ability: { zh: '空間感與移動', en: 'Spatial awareness and footwork' },
      note: { zh: '一臂以上 · 小步後退 · 找出口', en: 'MORE THAN AN ARM · SMALL STEPS · FIND THE EXIT' },
      how: { zh: '保持戒備姿勢，讓你和對方之間至少隔著一隻手臂以上的距離。對方往前一步，你就用小步後退或斜退一步，不要交叉雙腳。後退時眼睛看著對方，用眼角找出口、人多的地方，並大聲求助。',
        en: 'Stay in the fence and keep more than an arm\'s length between you. When they step in, take a small step back or back-and-to-the-side — never cross your feet. Keep your eyes on them while using your peripheral vision to find an exit or people, and shout for help.' },
      mistakes: { zh: '轉身背對對方；大步後退或交叉腳步而跌倒；退到牆角、無路可走；只顧後退忘了求助。',
        en: 'Turning your back; big steps or crossed feet that trip you; backing into a corner; retreating silently instead of calling for help.' },
      practice: { zh: '請朋友慢慢向你走近，你用小步保持距離，練習 1 分鐘；再練習一邊後退一邊說出出口在哪裡。',
        en: 'Have a friend walk slowly towards you while you keep the gap with small steps for one minute; then do it again while saying where the exit is.' },
      use: { zh: '距離越遠，對方越難碰到你，你也越容易離開。最好的自我防衛是根本不需要動手。',
        en: 'The bigger the gap, the harder you are to reach and the easier it is to leave. The best self-defence never needs a strike.' },
      bars: [['空間感', 'Spatial awareness', 92], ['步法', 'Footwork', 85], ['觀察出口', 'Spotting exits', 88], ['呼救', 'Calling for help', 80]] },

    { id: 'palm', n: 3, zh: '掌根擊', py: 'Palm Heel Strike', en: 'Palm Heel Strike',
      type: { zh: '反擊', en: 'Strike' }, target: { zh: '下巴、鼻子', en: 'Chin or nose' },
      when: { zh: '對方已經動手、無法離開時', en: 'They attack and you cannot get away' },
      tags: { zh: ['比拳頭更不易傷手', '從戒備姿勢直接出手'], en: ['Safer for your hand than a fist', 'Straight from the fence'] },
      ability: { zh: '全身發力推擊', en: 'Whole-body pushing power' },
      note: { zh: '手指向上 · 用掌根 · 打完就收', en: 'FINGERS UP · HEEL OF THE PALM · STRIKE AND RETURN' },
      how: { zh: '從戒備姿勢，後手手腕向後彎、手指向上，用手掌最下面的硬骨（掌根）由下往上推向對方下巴或鼻子。後腳蹬地、轉腰，讓身體的力量一起送出去。打完立刻收回戒備，拉開距離、離開。',
        en: 'From the fence, bend the rear wrist back with the fingers up and drive the hard base of the palm upward into their chin or nose. Push off the back foot and turn the hips so your body weight goes with it. Pull straight back to the fence, open the distance and leave.' },
      mistakes: { zh: '手指先碰到目標（會扭傷）；只用手臂、身體不動；打完停在原地看結果；收手太慢。',
        en: 'Hitting with the fingers (they bend back); arm-only with no body behind it; staying to watch what happens; slow recovery.' },
      practice: { zh: '對著手靶或掛在牆上的厚枕頭，左右各 10 下，重點是掌根接觸、手指向上，以及打完馬上回到戒備。',
        en: 'On a pad or a cushion against a wall, 10 strikes each side — focus on landing with the heel of the palm, fingers up, and snapping back to the fence.' },
      use: { zh: '許多自我防衛課程把掌根擊當作第一個學的反擊動作：簡單、自然，而且不容易弄傷自己的手。',
        en: 'Many self-defence courses teach the palm heel first: it is simple, natural and much less likely to injure your own hand than a punch.' },
      bars: [['全身發力', 'Whole-body power', 88], ['手腕結構', 'Wrist alignment', 82], ['準確度', 'Accuracy', 75], ['快速收回', 'Fast recovery', 85]] },

    { id: 'hammer', n: 4, zh: '錘拳', py: 'Hammer Fist', en: 'Hammer Fist',
      type: { zh: '反擊', en: 'Strike' }, target: { zh: '伸來的手臂、臉', en: 'Reaching arm or face' },
      when: { zh: '對方伸手抓你', en: 'They reach out to grab you' },
      tags: { zh: ['用拳底，不怕傷指節', '由上往下砸'], en: ['Bottom of the fist — knuckles stay safe', 'Comes down from above'] },
      ability: { zh: '向下砸擊的速度', en: 'Downward striking speed' },
      note: { zh: '拳頭握緊 · 用小指那側 · 由上往下', en: 'TIGHT FIST · LITTLE-FINGER SIDE · TOP TO BOTTOM' },
      how: { zh: '握緊拳頭，把前手舉到肩膀上方，然後像用拳頭敲桌子一樣，用拳底（小指那側的肉）快速往下砸向對方伸過來的手臂或臉。身體重心跟著往下沉。打完收回戒備、後退離開。',
        en: 'Make a tight fist, raise the lead hand above the shoulder, then bring the bottom of the fist (the fleshy little-finger side) down fast onto the reaching arm or face — like banging a table. Let your body weight drop with it. Return to the fence, step back and leave.' },
      mistakes: { zh: '用指節打（容易受傷）；拳頭沒握緊；手舉太高、動作太大讓對方看到；打完沒有離開。',
        en: 'Hitting with the knuckles (an injury risk); a loose fist; a huge wind-up they can see coming; not leaving afterwards.' },
      practice: { zh: '對著放在桌上的枕頭或軟墊，左右各 10 下，感受用拳底接觸，並配合膝蓋微彎讓重心下沉。',
        en: 'On a cushion or pad resting on a table, 10 each side — feel the contact on the bottom of the fist and bend your knees slightly to drop your weight.' },
      use: { zh: '錘拳是很直覺的動作，即使沒有訓練也能用得出來，而且拳底比指節耐打得多。',
        en: 'The hammer fist is instinctive — people can do it under stress with no training — and the bottom of the fist is far tougher than the knuckles.' },
      bars: [['向下砸擊', 'Downward drive', 88], ['握拳結構', 'Fist structure', 80], ['重心下沉', 'Dropping your weight', 78], ['快速收回', 'Fast recovery', 82]] },

    { id: 'elbow', n: 5, zh: '肘擊', py: 'Elbow Strike', en: 'Elbow Strike',
      type: { zh: '近身反擊', en: 'Close-range strike' }, target: { zh: '下巴、臉側', en: 'Jaw or side of the face' },
      when: { zh: '對方太近、抓住你', en: 'They are very close or holding you' },
      tags: { zh: ['距離太近時最有效', '轉腰帶動手肘'], en: ['Best when they are very close', 'Hips drive the elbow'] },
      ability: { zh: '近距離轉腰發力', en: 'Short-range hip rotation' },
      note: { zh: '手肘水平 · 轉腰 · 打完推開', en: 'ELBOW LEVEL · TURN THE HIPS · THEN SHOVE AWAY' },
      how: { zh: '當對方近到抓住你時，手臂彎起、手掌靠近自己的胸口，轉腰把手肘水平往前甩，用手肘前端打向對方下巴或臉側。接著雙掌用力推開對方，馬上後退離開。',
        en: 'When they are close enough to grab you, fold the arm so your hand is near your own chest, then turn the hips and swing the elbow forward, level, striking the jaw or side of the face with the point of the elbow. Follow with a two-handed shove and get away immediately.' },
      mistakes: { zh: '手肘往下或往上歪；手臂沒彎緊，變成甩手；只動手臂不轉腰；打完繼續糾纏。',
        en: 'Elbow travelling down or up instead of level; arm not folded tight so it becomes a swing; no hip turn; staying to grapple afterwards.' },
      practice: { zh: '對著手靶慢速練習左右各 10 次，確認手肘與肩同高、轉腰發力；接著加上「推開 → 後退」兩步。',
        en: 'Slowly on a pad, 10 each side — elbow at shoulder height, power from the hips; then add the follow-up "shove → step back".' },
      use: { zh: '手肘是身體最硬的部位之一，距離太近、手臂伸不直時，肘擊比拳頭或掌擊更有用。',
        en: 'The elbow is one of the hardest parts of the body; when there is no room to extend the arm it works far better than a punch or palm.' },
      bars: [['轉腰發力', 'Hip rotation', 90], ['近身控制', 'Close-range control', 82], ['手臂結構', 'Arm structure', 78], ['後續脫離', 'Getting away after', 85]] },

    { id: 'kick', n: 6, zh: '低位踹腿', py: 'Low Stomp Kick', en: 'Low Stomp Kick',
      type: { zh: '反擊', en: 'Strike' }, target: { zh: '膝蓋、小腿脛骨', en: 'Knee or shin' },
      when: { zh: '對方逼近、還在一腿距離外', en: 'They are closing in from about a leg\'s length away' },
      tags: { zh: ['腿比手長，力量更大', '踢低不踢高'], en: ['Legs are longer and stronger than arms', 'Kick low, never high'] },
      ability: { zh: '單腳平衡與推蹬力量', en: 'One-leg balance and thrusting power' },
      note: { zh: '提膝 · 腳跟踹出 · 踢低 · 馬上收回', en: 'KNEE UP · HEEL OUT · KEEP IT LOW · RECOIL FAST' },
      how: { zh: '從戒備姿勢把後腿膝蓋提起，腳尖勾起，用腳跟往前、往下踹向對方的膝蓋或小腿脛骨。踹完立刻把腳收回、落地站穩，再後退離開。高踢容易被抓住或失去平衡，自我防衛只踢低位。',
        en: 'From the fence, lift the back knee with the toes pulled up and thrust the heel forward and down into their knee or shin. Pull the leg straight back, plant it, then step away. High kicks are easy to catch and easy to fall from, so in self-defence keep every kick low.' },
      mistakes: { zh: '踢太高、被抓住腳；用腳尖踢（容易扭傷）；踢完腳停在空中；身體後仰太多而跌倒。',
        en: 'Kicking high and getting the leg caught; kicking with the toes (they jam); leaving the leg out; leaning far back and falling.' },
      practice: { zh: '扶著牆或椅背，慢速練習「提膝 → 踹出 → 收回 → 落地」，每腿 10 次；平衡穩定後再對著踢靶練。',
        en: 'Holding a wall or chair, practise "knee up → heel out → pull back → plant" slowly, 10 per leg; once balanced, try it on a kick shield.' },
      use: { zh: '膝蓋與脛骨很難防守，一記低踹就能讓對方停下來，給你時間離開。',
        en: 'Knees and shins are hard to protect; one low kick can stop someone long enough for you to leave.' },
      bars: [['單腳平衡', 'One-leg balance', 85], ['推蹬力量', 'Thrusting power', 88], ['準確度', 'Accuracy', 75], ['快速收腿', 'Fast recoil', 82]] },

    { id: 'wrist', n: 7, zh: '手腕被抓脫困', py: 'Wrist-Grab Release', en: 'Wrist-Grab Release',
      type: { zh: '脫困', en: 'Escape' }, target: { zh: '—（對方的虎口）', en: '— (the gap at their thumb)' },
      when: { zh: '手腕被抓住', en: 'Someone grabs your wrist' },
      tags: { zh: ['利用拇指弱點', '不比力氣，比方向'], en: ['Use the weak point at the thumb', 'Direction beats strength'] },
      ability: { zh: '找出抓握弱點、快速轉出', en: 'Finding the weak point and exploding out' },
      note: { zh: '屈肘 · 靠近一點 · 朝拇指方向轉出', en: 'BEND THE ELBOW · STEP IN · OUT THROUGH THE THUMB' },
      how: { zh: '被抓住時不要硬往後拉——四根手指的力量比你的拉力大。先屈肘、身體靠近一點，再看對方拇指在哪一邊：拇指和食指之間（虎口）是最弱的地方。把手腕朝那個方向快速轉、往上抽出，手肘帶著手前進。脫開後立刻回到戒備、後退離開。',
        en: 'Don\'t pull straight back — four gripping fingers beat your pull. Bend your elbow and step a little closer, then find their thumb: the gap between thumb and fingers is the weakest part of any grip. Rip your wrist out through that gap, leading with the elbow. Once free, go straight to the fence and get away.' },
      mistakes: { zh: '用力往後拉；手肘伸直、只靠手腕；轉錯方向（朝四根手指那邊）；脫開後還留在原地。',
        en: 'Pulling straight back; a straight arm, using only the wrist; turning towards the fingers instead of the thumb; staying put after you are free.' },
      practice: { zh: '請朋友輕輕抓住你的手腕，先慢慢找出拇指方向、轉出，左右各 10 次；熟練後對方逐漸加力。練習時請溫和，不要扭傷手腕。',
        en: 'Have a friend hold your wrist lightly; slowly find the thumb side and turn out, 10 times each side, then let them grip harder as you improve. Go gently — don\'t twist each other\'s wrists.' },
      use: { zh: '被抓手腕是很常見的情況；這個動作不需要力氣，小個子對大個子也有效。',
        en: 'A wrist grab is one of the most common situations; this release needs technique, not strength, so it works for smaller people too.' },
      bars: [['找出弱點', 'Finding the weak point', 90], ['爆發轉出', 'Explosive release', 85], ['手肘帶動', 'Leading with the elbow', 80], ['脫困後離開', 'Leaving after', 88]] },

    { id: 'cover', n: 8, zh: '護頭防守', py: 'Head Cover', en: 'Head Cover',
      type: { zh: '防守', en: 'Defend' }, target: { zh: '—（保護頭部）', en: '— (protect the head)' },
      when: { zh: '對方突然揮拳打來', en: 'A sudden punch comes at your head' },
      tags: { zh: ['本能反應變成好防守', '保護頭部最重要'], en: ['Turn the flinch into a good guard', 'Protecting the head comes first'] },
      ability: { zh: '在驚嚇中保護頭部', en: 'Protecting the head under surprise' },
      note: { zh: '雙臂護頭 · 收下巴 · 身體向前 · 推開', en: 'ARMS FRAME THE HEAD · CHIN DOWN · LEAN IN · SHOVE' },
      how: { zh: '有人突然揮拳時，人本能會舉手、縮頭。把這個反應練成好防守：雙手前臂舉起，掌心貼近頭的兩側或後腦，手肘朝前，收下巴、身體稍微向前，讓前臂和手肘吸收打擊。對方一停，雙掌用力推開，後退離開並求助。',
        en: 'When a punch comes suddenly, everyone flinches — hands up, head down. Train that flinch into a real guard: raise both forearms with the hands against the sides or back of your head, elbows forward, chin tucked and body leaning in slightly so your arms and elbows take the impact. The moment it stops, shove them away with both palms, step back, leave and get help.' },
      mistakes: { zh: '閉眼轉身、背對對方；雙臂張太開，頭部露出；身體往後仰（容易被打倒）；一直護頭不離開。',
        en: 'Closing your eyes and turning your back; arms too wide so the head is exposed; leaning back (easy to be knocked over); covering and never leaving.' },
      practice: { zh: '請朋友用軟手套或枕頭慢慢從不同方向揮向你的頭，練習護頭 → 推開 → 後退，每次 1 分鐘。',
        en: 'Have a friend swing slowly at your head from different angles with a soft glove or pillow; practise cover → shove → step back for a minute at a time.' },
      use: { zh: '頭部受傷是最危險的；先護住頭，才有機會推開和離開。',
        en: 'Head injuries are the most dangerous kind; covering first gives you the chance to shove and get away.' },
      bars: [['護頭反應', 'Cover reflex', 92], ['姿勢結構', 'Guard structure', 82], ['推開對方', 'Shoving away', 80], ['脫離與求助', 'Escape & get help', 88]] }
  ];

  w.SELFDEF = { LIST: LIST, makeClip: makeClip };
})(window);
