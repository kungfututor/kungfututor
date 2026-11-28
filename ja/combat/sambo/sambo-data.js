/* Sambo basics — 8 core lessons from sport and combat sambo: stance and jacket
 * grips, the back breakfall, forward foot sweep, back trip, single-leg pick-up,
 * side hold-down, straight ankle lock and a combat-sambo strike-to-trip.
 * Side view; you wear the red jacket, the grey partner (kt-partner.js) the blue.
 * Our own wording of widely taught sambo fundamentals. All text goes through
 * KT.pick / cap pairs for 17 languages.
 */
(function (w) {
  'use strict';
  var S = w.KTFigure.S, C = S.col, KP = w.KTPartner;
  function m() { var o = {}; for (var i = 0; i < arguments.length; i++) for (var k in arguments[i]) o[k] = arguments[i][k]; return o; }
  function cap(zh, en) { return { zh: zh, en: en }; }

  var X0 = 140, RED = '#C8372D', BLUE = '#2F5DA8';
  // sambo stance: a little wider and lower than judo's, but still upright with soft knees
  var LEGS = { x: X0, t: 5, h: 4, fN: { x: 18, y: 83 }, fF: { x: -22, y: 83 }, ftN: 90, ftF: 70, kbN: 1, kbF: 1, lift: 0 };
  var OPEN = { su: 40, sl: 120, fu: 34, fl: 125, laN: 1 };          // hands forward, open, ready to grip
  var GRIP = { su: 72, sl: 96, fu: 80, fl: 92, laN: 1 };            // lead hand on the lapel, rear hand on the sleeve
  var GUARD = { su: 45, sl: 162, fu: 30, fl: 167, laN: 1 };         // combat sambo: hands guard the face
  var PO = { oa1: 40, oa2: 120, ob1: 34, ob2: 125 }, PG = { oa1: 72, oa2: 96, ob1: 80, ob2: 92 }, PGU = { oa1: 45, oa2: 162, ob1: 30, ob2: 167 };
  var BASE = m(KP.base, PG, { hit: 0, ox: 228, ola: 11, olb: 3, ol: 14, oh: 2, olift: 0, gl: 0 });
  function P() { return m.apply(null, [BASE, LEGS, GRIP].concat([].slice.call(arguments))); }
  // partner falling backward, then lying on their back (head away from you)
  var FALL = { ot: -55, ola: 70, olb: 62, ol: -30, oa1: 120, oa2: 140, ob1: 110, ob2: 130, olift: 10 };
  // (arms down by the sides on the mat — the breakfall slap — not raised in the air)
  var DOWN = { ot: -88, oh: 0, ola: 88, olb: 92, ol: -88, olf: -92, oa1: 100, oa2: 102, ob1: 98, ob2: 100, olift: 0 };
  var STAND_OVER = { t: 14, su: 38, sl: 52, fu: 32, fl: 46 };       // you stay standing, still holding the sleeve

  // whole-body poses with the hip placed absolutely (floor at y ~211)
  function ab() { return m.apply(null, [BASE, { ftN: 90, ftF: 70, kbN: 1, kbF: 1, lift: 0, h: 0, laN: 1, laF: 1, luN: 1, luF: 1 }].concat([].slice.call(arguments))); }

  var CLIPS = {
    stance: { trail: 'hN', frames: [
      { d: 900, p: P(OPEN, PO, { ox: 262 }), c: cap('雙腳與肩同寬略寬、膝微彎、背挺直，雙手在前準備抓握', 'Feet a little wider than the shoulders, knees soft, back straight, hands forward ready to grip') },
      { d: 600, p: P(OPEN, PO, { ox: 240, x: X0 + 4 }), c: cap('小步靠近，不要讓對方先抓到', 'Step in with small steps; don\'t let them grip first') },
      { d: 900, p: P({ ox: 228, x: X0 + 4 }), c: cap('前手抓衣領，後手抓袖子（肘部附近）', 'Lead hand grips the lapel, rear hand grips the sleeve near the elbow') },
      { d: 700, p: P({ ox: 224, x: X0 + 2, t: -2, su: 60, sl: 82, fu: 66, fl: 80, ot: 10, oh: 6 }), c: cap('拉袖、推領，打破對方的平衡', 'Pull the sleeve and push or lift the lapel to break their balance') },
      { d: 700, p: P({ ox: 228, x: X0 + 4 }), c: cap('保持姿勢，隨時準備進攻', 'Keep your posture, ready to attack') }
    ] },
    breakfall: { hit: 'hN', trail: 'head', frames: [
      { d: 800, p: ab({ ox: 660, x: 150, y: 126, t: 4, fN: { x: 168, y: 211 }, fF: { x: 130, y: 211 }, su: 70, sl: 80, fu: 64, fl: 76 }), c: cap('站立，雙手向前，下巴微收', 'Stand with the arms forward and the chin slightly tucked') },
      { d: 600, p: ab({ ox: 660, x: 140, y: 172, t: 30, h: 18, fN: { x: 168, y: 211 }, fF: { x: 142, y: 211 }, su: 92, sl: 92, fu: 88, fl: 88 }), c: cap('深蹲，下巴貼胸，眼睛看腰帶', 'Squat low, chin to chest, eyes on your belt') },
      { d: 400, p: ab({ ox: 660, x: 124, y: 204, t: -35, h: 26, fN: { x: 170, y: 198 }, fF: { x: 162, y: 202 }, su: 95, sl: 95, fu: 92, fl: 92 }), e: 'out', c: cap('臀部坐在腳跟後方，往後滾', 'Sit the hips down just behind your heels and roll back') },
      { d: 900, p: ab({ ox: 660, x: 128, y: 204, t: -83, h: 42, fN: { x: 176, y: 166 }, fF: { x: 168, y: 172 }, su: 74, sl: 74, fu: 72, fl: 72, luN: 0.74, laN: 0.74, luF: 0.74, laF: 0.74, hit: 1 }), c: cap('雙手在身體兩側約 45° 拍墊，頭不碰地', 'Slap the mat with both arms at about 45° from your body; the head never touches the mat') },
      { d: 700, p: ab({ ox: 660, x: 124, y: 204, t: -22, h: 14, fN: { x: 176, y: 211 }, fF: { x: 168, y: 211 }, su: 60, sl: 80, fu: 56, fl: 76 }), c: cap('坐起來，準備站起', 'Sit up, ready to stand') }
    ] },
    footsweep: { hit: 'tN', trail: 'tN', frames: [
      { d: 700, p: P({ x: X0 + 4 }), c: cap('雙方互抓：衣領與袖子', 'Both gripping: lapel and sleeve') },
      { d: 420, p: P({ x: X0 + 4, t: -2, su: 62, sl: 84, fu: 68, fl: 82, ox: 220, ot: 4, ola: 28, olb: 12 }), c: cap('對方往前踏步時，把對方拉到那隻腳上', 'As they step forward, pull them on to that foot') },
      { d: 220, p: P({ x: X0 + 4, t: -6, su: 58, sl: 80, fu: 62, fl: 78, fN: { x: 48, y: 74 }, ftN: 120, ox: 220, ot: -14, ola: 60, olb: 52, hit: 1 }), e: 'out', c: cap('在對方重心落下前，用腳掌掃對方腳踝', 'Sweep their ankle with the sole of your foot just before their weight lands') },
      { d: 300, p: P(FALL, { x: X0 + 4, t: 6, su: 50, sl: 70, fu: 52, fl: 72, ox: 240 }), c: cap('雙手繼續拉轉，讓對方在空中翻過', 'Keep pulling and turning with the hands as they leave the floor') },
      { d: 900, p: P(DOWN, STAND_OVER, { x: X0 + 4, ox: 266 }), c: cap('對方背部著地、你保持站立 —— 乾淨的摔可以直接獲勝', 'They land on their back while you stay standing — a clean throw like this can win outright') }
    ] },
    backtrip: { hit: 'aN', trail: 'aN', frames: [
      { d: 700, p: P({ x: X0 + 4 }), c: cap('雙方互抓', 'Both gripping') },
      { d: 300, p: P({ x: X0 + 22, t: 14, fN: { x: 62, y: 78 }, su: 80, sl: 74, fu: 86, fl: 80, ox: 230 }), c: cap('前腳大步踏到對方前腳的後方', 'Step your lead leg deep behind their lead leg') },
      { d: 300, p: P({ x: X0 + 26, t: 22, fN: { x: 62, y: 78 }, su: 86, sl: 80, fu: 90, fl: 84, ox: 232, ot: -28, oh: -6, ola: 22, ol: 30, hit: 1 }), e: 'out', c: cap('你的腿擋住對方的腿，雙手往後推', 'Your leg blocks behind theirs while your hands drive them backwards') },
      { d: 300, p: P(FALL, { x: X0 + 24, t: 18, fN: { x: 54, y: 78 }, su: 60, sl: 70, fu: 62, fl: 72, ox: 246 }), c: cap('對方絆到你的腿往後倒', 'They trip over your leg and fall backwards') },
      { d: 900, p: P(DOWN, STAND_OVER, { x: X0 + 20, ox: 274 }), c: cap('對方背部著地，你站穩不跟著倒', 'They land on their back; you stay on your feet') }
    ] },
    legpick: { hit: 'hN', trail: 'hN', frames: [
      { d: 700, p: P(OPEN, PO, { ox: 236 }), c: cap('站姿，對方的前腳在你前方', 'Stance, with their lead leg in front of you') },
      { d: 260, p: P(OPEN, PO, { t: 26, h: -10, fN: { x: 24, y: 62 }, fF: { x: -30, y: 66 }, su: 62, sl: 84, fu: 52, fl: 76, ox: 236 }), c: cap('彎膝降低重心，背保持挺直', 'Bend the knees to drop your level, back straight') },
      { d: 300, p: P(PO, { x: X0 + 22, t: 34, h: -12, fN: { x: 26, y: 60 }, fF: { x: -34, y: 64 }, su: 28, sl: 58, fu: 22, fl: 52, ox: 236, ot: -6, ola: 46, olb: 14, hit: 1 }), e: 'out', c: cap('雙手抱住對方前腳的膝後', 'Wrap both hands behind their lead knee') },
      { d: 320, p: P({ x: X0 + 30, t: 18, h: 0, su: 48, sl: 78, fu: 42, fl: 72, ox: 242, ot: -36, ola: 78, olb: 44, ol: -6, oa1: 110, oa2: 140, ob1: 100, ob2: 130, olift: 4 }), c: cap('把腿抬高，同時用身體往前推', 'Lift the leg high and drive forward with your body') },
      { d: 900, p: P(DOWN, STAND_OVER, { x: X0 + 26, ox: 276 }), c: cap('對方單腳站不穩，背部著地', 'On one leg they cannot balance and land on their back') }
    ] },
    holddown: { hit: null, trail: 'sh', frames: [
      { d: 800, p: ab(DOWN, { ox: 196, x: 172, y: 166, t: 40, fN: { x: 130, y: 209 }, fF: { x: 124, y: 209 }, ftN: -90, ftF: -90, su: 30, sl: 40, fu: 24, fl: 36, oa1: 150, oa2: 120 }), c: cap('對方仰躺，你跪在對方身側', 'They are on their back; you kneel close to their side') },
      { d: 600, p: ab(DOWN, { ox: 196, x: 188, y: 182, t: 76, fN: { x: 114, y: 209 }, fF: { x: 108, y: 209 }, ftN: -90, ftF: -90, su: 18, sl: 40, fu: 10, fl: 30, oa1: 150, oa2: 120 }), c: cap('胸口壓在對方胸口，一手繞過頭、一手控制手臂', 'Chest on their chest, one arm round the head and one controlling the arm') },
      { d: 1400, p: ab(DOWN, { ox: 196, x: 188, y: 183, t: 78, fN: { x: 114, y: 209 }, fF: { x: 100, y: 209 }, ftN: -90, ftF: -90, su: 18, sl: 40, fu: 10, fl: 30, oa1: 150, oa2: 120 }), c: cap('保持壓制：10 秒得 2 分，20 秒得 4 分', 'Hold it: 10 seconds scores 2 points, 20 seconds scores 4') },
      { d: 700, p: ab(DOWN, { ox: 196, x: 186, y: 180, t: 72, fN: { x: 118, y: 209 }, fF: { x: 90, y: 209 }, ftN: -90, ftF: -90, su: 18, sl: 40, fu: 10, fl: 30, ot: -80, oa1: 150, oa2: 120, olift: 6 }), c: cap('對方挺腰想翻時，張開雙腳加寬底盤，保持重量壓下', 'If they bridge, spread your legs for a wider base and stay heavy') }
    ] },
    anklelock: { hit: 'lock', trail: null, frames: [
      { d: 900, p: ab(DOWN, { ox: 236, x: 150, y: 202, t: -14, fN: { x: 206, y: 196 }, fF: { x: 198, y: 202 }, kbN: 1, kbF: 1, ftN: 80, ftF: 80, su: 34, sl: 128, fu: 44, fl: 118, ola: 130, olb: 118 }), c: cap('坐下，對方的腳夾在你腋下，你的雙腿壓住對方的大腿', 'Sit down with their foot trapped under your armpit and your legs over their thigh') },
      { d: 600, p: ab(DOWN, { ox: 236, x: 150, y: 202, t: -18, fN: { x: 206, y: 196 }, fF: { x: 198, y: 202 }, kbN: 1, kbF: 1, ftN: 80, ftF: 80, su: 28, sl: 140, fu: 40, fl: 126, ola: 128, olb: 116 }), c: cap('前臂骨頭卡在對方腳跟上方（阿基里斯腱），雙手扣緊', 'Put the bony edge of your forearm just above their heel (the Achilles tendon) and lock your hands') },
      { d: 600, p: ab(DOWN, { ox: 234, x: 148, y: 202, t: -40, fN: { x: 206, y: 196 }, fF: { x: 198, y: 202 }, kbN: 1, kbF: 1, ftN: 80, ftF: 80, su: 22, sl: 150, fu: 34, fl: 136, ola: 126, olb: 112, hit: 1 }), c: cap('慢慢往後仰、挺胸，壓力在對方的腳踝', 'Lean back slowly and lift the chest — the pressure goes on their ankle') },
      { d: 800, p: ab(DOWN, { ox: 236, x: 150, y: 202, t: -14, fN: { x: 206, y: 196 }, fF: { x: 198, y: 202 }, kbN: 1, kbF: 1, ftN: 80, ftF: 80, su: 34, sl: 128, fu: 44, fl: 118, ola: 130, olb: 118 }), c: cap('對方拍地認輸 —— 立刻放開', 'They tap — let go at once') }
    ] },
    combat: { hit: 'cmb', trail: 'hF', frames: [
      { d: 600, p: P(GUARD, PGU, { ox: 248, gl: 1 }), c: cap('格鬥桑搏：戴拳套，雙手護臉', 'Combat sambo: gloves on, hands guarding the face') },
      { d: 240, p: P(GUARD, PGU, { x: X0 + 5, t: 12, su: 90, sl: 90, ox: 248, ot: -5, gl: 1, hit: 1 }), e: 'out', c: cap('前手直拳', 'Jab') },
      { d: 280, p: P(GUARD, PGU, { t: 20, fu: 92, fl: 90, fF: { x: -22, y: 80 }, ftF: 35, ox: 248, ot: -9, oh: -10, gl: 1, hit: 1 }), e: 'out', c: cap('後手直拳，讓對方舉手護頭', 'Cross — their hands come up to cover') },
      { d: 300, p: P({ x: X0 + 28, t: 10, ox: 250, gl: 1 }), c: cap('趁機貼近，抓住衣領與袖子', 'Close the gap behind the punches and take the grips') },
      { d: 300, p: P({ x: X0 + 42, t: 22, fN: { x: 62, y: 78 }, su: 86, sl: 80, fu: 90, fl: 84, ox: 252, ot: -28, oh: -6, ola: 22, ol: 30, gl: 1, hit: 0 }), e: 'out', c: cap('腿踏到對方腿後，往後推 —— 後絆摔', 'Leg behind theirs and drive back — the back trip') },
      { d: 900, p: P(DOWN, STAND_OVER, { x: X0 + 40, ox: 290, gl: 1 }), c: cap('對方倒地，你保持站立、做好防守', 'They go down; you stay standing with your guard ready') }
    ] }
  };

  // red / blue sambo jacket (kurtka) and belt drawn over the stick figures
  function jacket(J, col, sc) {
    return S.poly([J.hip, J.sh], col, 9.5 * sc) + S.poly([J.shN, J.eN], col, 7.5 * sc) + S.circle(J.hip, 4.2 * sc, col, '#fff', 1.2);
  }

  function makeClip(s, view, level, lang) {
    var src = CLIPS[s.id], pace = level < 1 ? 1.8 : 1;
    return {
      scale: 0.88, base: { x: X0 }, cx: X0, ticks: false, labelAt: [292, 26], still: 0.5,
      trail: src.trail || null,
      frames: src.frames.map(function (f) { return { d: Math.round(f.d * pace), p: f.p, e: f.e, c: f.c }; }),
      props: function (J, c) {
        var gl = c.pose.gl > 0.5, sc = c.scale;
        var o = KP.draw(J, c, { cx: X0, gloves: gl }), back = o.svg + jacket(o.O, BLUE, sc), fr = '', hud = '';
        fr += jacket(J, RED, sc);
        if (gl) fr += S.circle(J.hF, 6 * sc, '#4A505E', '#fff', 1.2) + S.circle(J.hN, 6 * sc, C.ink, '#fff', 1.2);
        else if (c.pose.su > 55 && c.pose.ox < 240) fr += S.circle(J.hN, 3.6 * sc, RED, '#fff', 1.2);  // grip marker
        if (src.hit && c.pose.hit > 0.15) {
          var pt = src.hit === 'lock' ? o.O.aN : src.hit === 'cmb' ? (c.seg >= 2 ? J.hF : J.hN) : J[src.hit];
          fr += KP.hit(pt, c.pose.hit);
          if (c.pose.hit > 0.6) hud += S.text(18, 30, KT.pick('接觸點：', 'CONTACT: ') + KT.t(s.contact), { size: 12, fill: C.red, family: "'JetBrains Mono','Noto Sans TC',monospace" });
        }
        return { back: back, front: fr, hud: hud };
      }
    };
  }

  var LIST = [
    { id: 'stance', n: 1, zh: '站姿與抓握', py: 'Stoika', en: 'Stance and Jacket Grips',
      type: { zh: '基本', en: 'Foundation' }, contact: { zh: '衣領與袖子', en: 'Lapel and sleeve' }, phase: { zh: '站立', en: 'Standing' },
      tags: { zh: ['所有摔法的起點', '先抓好、再破壞平衡'], en: ['Where every throw starts', 'Grip first, then break the balance'] },
      ability: { zh: '抓握與平衡', en: 'Gripping and balance' },
      note: { zh: '膝微彎 · 背挺直 · 前手領 · 後手袖', en: 'SOFT KNEES · STRAIGHT BACK · LAPEL · SLEEVE' },
      how: { zh: '雙腳比肩稍寬、膝蓋微彎、背挺直，重心放在兩腳中間。前手抓對方的衣領，後手抓對方肘部附近的袖子。抓好之後用「拉袖、推或提領」讓對方的重心移到腳尖或腳跟，這叫破壞平衡，是所有摔法的準備。',
        en: 'Stand with the feet a little wider than the shoulders, knees soft and back straight, weight between both feet. The lead hand grips their lapel and the rear hand grips the sleeve near the elbow. Once you hold both, pull the sleeve and push or lift the lapel to move their weight onto their toes or heels — breaking the balance, the set-up for every throw.' },
      mistakes: { zh: '彎腰把頭伸向前（容易被拉倒）；雙腳站成一直線；只抓不動；手臂完全伸直、僵硬。', en: 'Bending at the waist with the head forward (easy to pull down); feet in one line; holding on without moving; stiff, locked-straight arms.' },
      practice: { zh: '和夥伴抓好後，在軟墊上移動 3 × 1 分鐘，輪流練習拉、推讓對方失去平衡（不摔）。', en: 'Grip up with a partner and move around the mat for 3 × 1 minute, taking turns to pull and push them off balance without throwing.' },
      use: { zh: '桑搏比賽穿外套（kurtka），抓握決定誰能先發動摔法。', en: 'Sambo is fought in a jacket (the kurtka), so the grip fight decides who gets to throw first.' },
      bars: [['抓握', 'Gripping', 90], ['平衡', 'Balance', 88], ['姿勢', 'Posture', 85], ['步法', 'Footwork', 78]] },

    { id: 'breakfall', n: 2, zh: '後倒受身', py: 'Samostrakhovka', en: 'Back Breakfall',
      type: { zh: '安全', en: 'Safety' }, contact: { zh: '雙臂拍墊', en: 'Both arms slap the mat' }, phase: { zh: '倒地', en: 'Falling' },
      tags: { zh: ['學摔之前必學', '保護頭部與背部'], en: ['Learn this before any throw', 'Protects the head and back'] },
      ability: { zh: '安全倒地', en: 'Falling safely' },
      note: { zh: '下巴貼胸 · 圓背滾 · 雙手拍墊', en: 'CHIN TUCKED · ROUND BACK · SLAP THE MAT' },
      how: { zh: '從站立深蹲下去，下巴貼胸、眼睛看自己的腰帶。臀部坐在腳跟後方，背部弓圓往後滾。背部著地的同時，雙臂在身體兩側約 45° 用整隻手臂拍墊，把衝擊分散掉。頭始終不碰地。',
        en: 'From standing, squat down with the chin on your chest and eyes on your belt. Sit the hips down just behind your heels and roll back with a rounded back. As your back meets the mat, slap it with both whole arms at about 45° from your body to spread the impact. Your head never touches the mat.' },
      mistakes: { zh: '頭往後仰撞地；用手撐地（容易傷手腕和手肘）；背部挺直像木板一樣倒下；拍墊太晚。', en: 'Letting the head snap back onto the mat; putting a hand down to catch yourself (hurts the wrist and elbow); falling flat like a board; slapping too late.' },
      practice: { zh: '先從坐姿往後滾拍墊 10 次，再從蹲姿 10 次，最後從站姿 10 次。只在軟墊上練習。', en: '10 rolls from sitting, then 10 from a squat, then 10 from standing — always on mats.' },
      use: { zh: '摔跤類運動中被摔是常事，正確的受身讓你可以安全地練習很多年。', en: 'In any throwing sport you will be thrown a lot; a good breakfall is what lets you train safely for years.' },
      bars: [['安全', 'Safety', 95], ['協調', 'Coordination', 85], ['時機', 'Timing', 80], ['核心', 'Core', 72]] },

    { id: 'footsweep', n: 3, zh: '前掃腳', py: 'Podsechka', en: 'Forward Foot Sweep',
      type: { zh: '摔', en: 'Throw' }, contact: { zh: '腳掌掃腳踝', en: 'Sole against the ankle' }, phase: { zh: '站立 → 地面', en: 'Standing → ground' },
      tags: { zh: ['靠時機，不靠力氣', '對方踏步的一瞬間'], en: ['Timing, not strength', 'The moment they step'] },
      ability: { zh: '時機與節奏', en: 'Timing and rhythm' },
      note: { zh: '對方踏步 · 重心落下前掃腳', en: 'THEY STEP · SWEEP BEFORE THE WEIGHT LANDS' },
      how: { zh: '抓好衣領與袖子，跟著對方移動。當對方往前踏步、腳快要落地但重心還沒放上去時，用你的腳掌貼著對方腳踝往前掃，同時雙手拉轉對方的上身。腳一被掃走，對方就會往後倒。',
        en: 'Grip the lapel and sleeve and move with them. As they step forward and the foot is about to land — before their weight is on it — sweep the sole of your foot against their ankle while your hands pull and turn their upper body. With the foot swept away, they fall.' },
      mistakes: { zh: '踢對方的小腿（是掃不是踢）；掃得太晚，對方重心已經放上去；只用腳不用手；掃完自己失去平衡。', en: 'Kicking the shin (it is a sweep, not a kick); sweeping too late when their weight is already down; using only the foot and not the hands; losing your own balance afterwards.' },
      practice: { zh: '夥伴慢慢前後走，你只練「在正確時機輕掃腳踝」20 次，不必摔倒對方。', en: 'Partner walks slowly back and forth; you just practise touching the sweep at the right moment, 20 times, without throwing.' },
      use: { zh: '掃腳快、省力，而且讓你保持站立，是乾淨摔法的典型例子。', en: 'Foot sweeps are fast and cheap on energy and leave you standing — a textbook clean throw.' },
      bars: [['時機', 'Timing', 95], ['協調', 'Coordination', 85], ['抓握', 'Gripping', 80], ['平衡', 'Balance', 82]] },

    { id: 'backtrip', n: 4, zh: '後絆摔', py: 'Zadnyaya podnozhka', en: 'Back Trip',
      type: { zh: '摔', en: 'Throw' }, contact: { zh: '腿擋在對方腿後', en: 'Your leg behind theirs' }, phase: { zh: '站立 → 地面', en: 'Standing → ground' },
      tags: { zh: ['腿擋、手推', '把對方往後絆倒'], en: ['Leg blocks, hands drive', 'Trips them backwards'] },
      ability: { zh: '推進與時機', en: 'Drive and timing' },
      note: { zh: '前腳踏到對方腿後 · 擋住 · 雙手往後推', en: 'STEP BEHIND · BLOCK · DRIVE BACK' },
      how: { zh: '抓好衣領與袖子，前腳大步踏到對方前腳的後方，讓你的腿擋在對方腿後。身體貼近，雙手往對方的後方推。對方往後退時會被你的腿絆住而背部著地。整個過程你保持站穩。',
        en: 'With the lapel and sleeve gripped, step your lead leg deep behind their lead leg so your leg blocks theirs. Stay close and drive your hands towards their back. As they step back they trip over your leg and land on their back, while you stay on your feet.' },
      mistakes: { zh: '踏得不夠深（腿擋不住）；身體離太遠，只用手推；自己跟著倒下；推的方向往下而不是往後。', en: 'Not stepping deep enough (the block misses); staying too far away and pushing with the arms only; falling with them; pushing down instead of back.' },
      practice: { zh: '和夥伴慢速練「踏步 + 擋住」各 10 次，再在軟墊上完整練習，夥伴做受身。', en: 'Drill the step and block slowly 10 times each side, then full reps on mats with your partner breakfalling.' },
      use: { zh: '當對方往前壓時特別好用：對方的力量讓自己更容易被絆倒。', en: 'Works best when they push into you — their own pressure helps trip them.' },
      bars: [['推進', 'Drive', 88], ['時機', 'Timing', 85], ['距離', 'Distance', 82], ['平衡', 'Balance', 82]] },

    { id: 'legpick', n: 5, zh: '抱單腿摔', py: 'Zakhvat nogi', en: 'Single-Leg Pick-Up',
      type: { zh: '摔', en: 'Throw' }, contact: { zh: '雙手抱膝後', en: 'Hands behind the knee' }, phase: { zh: '站立 → 地面', en: 'Standing → ground' },
      tags: { zh: ['桑搏允許抱腿', '降重心 → 抱腿 → 抬起推'], en: ['Leg grabs are allowed in sambo', 'Drop → catch → lift and drive'] },
      ability: { zh: '爆發力與降重心', en: 'Explosiveness and level change' },
      note: { zh: '彎膝降低 · 抱膝後 · 抬腿 · 往前推', en: 'DROP THE LEVEL · BEHIND THE KNEE · LIFT · DRIVE' },
      how: { zh: '彎膝降低重心（背挺直），前腳踏近，雙手抱住對方前腳的膝蓋後方。把那隻腿抬高的同時，用身體往前推。對方只剩一隻腳支撐，很難保持平衡，背部著地。和現代柔道不同，桑搏比賽允許直接抱腿。',
        en: 'Bend the knees to drop your level with a straight back, step in and wrap both hands behind their lead knee. Lift that leg high while your body drives forward. Standing on one leg, they cannot balance and land on their back. Unlike modern judo, sambo allows grabbing the legs directly.' },
      mistakes: { zh: '彎腰低頭（容易被壓住）；離太遠才衝；抱住腳踝而不是膝後（不好抬）；抱到後不推。', en: 'Bending at the waist with the head down (easy to stuff); shooting from too far; grabbing the ankle instead of behind the knee (hard to lift); catching the leg but not driving.' },
      practice: { zh: '在軟墊上練「降重心 + 抱膝」10 次，再與夥伴慢速完整練習。只在有教練的軟墊上進行。', en: 'On mats, drill the level drop and knee catch 10 times, then slow full reps with a partner — only on mats with a coach.' },
      use: { zh: '當對方站得很直、抓得很緊時，抱腿可以繞過上身的抓握。', en: 'When they stand tall and grip hard, a leg pick goes around the upper-body grip fight.' },
      bars: [['爆發力', 'Explosiveness', 88], ['降重心', 'Level change', 88], ['推進', 'Drive', 85], ['姿勢', 'Posture', 80]] },

    { id: 'holddown', n: 6, zh: '側壓制', py: 'Uderzhanie', en: 'Side Hold-Down',
      type: { zh: '地面', en: 'Ground' }, contact: { zh: '胸口壓胸口', en: 'Chest on chest' }, phase: { zh: '地面', en: 'Ground' },
      tags: { zh: ['地面得分', '10 秒 2 分 · 20 秒 4 分'], en: ['Scores on the ground', '10 s = 2 points · 20 s = 4 points'] },
      ability: { zh: '控制與重量', en: 'Control and weight' },
      note: { zh: '胸壓胸 · 控頭控手 · 底盤寬', en: 'CHEST ON CHEST · CONTROL HEAD AND ARM · WIDE BASE' },
      how: { zh: '對方仰躺時，你跪在對方身側，胸口壓在對方胸口上。一手從對方頭後繞過，另一手控制對方靠近你的手臂。雙腳張開、膝蓋撐地，把體重壓在對方身上。運動桑搏中，壓制 10 秒得 2 分，壓制 20 秒得 4 分，每場只能用壓制得分一次。',
        en: 'With them on their back, kneel at their side and put your chest on their chest. One arm goes round behind their head, the other controls their near arm. Keep the legs spread and knees on the mat, with your weight on them. In sport sambo a 10-second hold-down scores 2 points and a 20-second hold-down scores 4, and a fighter can score with a hold-down only once per match.' },
      mistakes: { zh: '跪得太高（胸口沒壓住）；雙腳併攏（一翻就倒）；只抱頭不控手；被翻時慌張放手。', en: 'Kneeling too tall (no chest pressure); legs together (easy to roll); holding the head but not the arm; letting go in a panic when they bridge.' },
      practice: { zh: '和夥伴輪流：一人壓制 30 秒，另一人用挺腰和轉身嘗試逃脫。', en: 'Take turns: one holds for 30 seconds while the other tries to escape by bridging and turning.' },
      use: { zh: '桑搏沒有勒頸（運動桑搏），所以壓制是地面上主要的得分方式之一。', en: 'Sport sambo has no chokes, so the hold-down is one of the main ways to score on the ground.' },
      bars: [['控制', 'Control', 92], ['重量壓力', 'Weight pressure', 88], ['平衡', 'Balance', 85], ['耐力', 'Endurance', 78]] },

    { id: 'anklelock', n: 7, zh: '直腳踝鎖', py: 'Ushchemlenie', en: 'Straight Ankle Lock',
      type: { zh: '降伏', en: 'Submission' }, contact: { zh: '前臂壓阿基里斯腱', en: 'Forearm on the Achilles' }, phase: { zh: '地面', en: 'Ground' },
      tags: { zh: ['桑搏的招牌腿鎖', '慢慢施壓，對方拍地即放'], en: ['Sambo\'s trademark leg lock', 'Apply slowly; release on the tap'] },
      ability: { zh: '控制與安全意識', en: 'Control and safety' },
      note: { zh: '腳夾腋下 · 慢慢後仰 · 拍地即放', en: 'FOOT TRAPPED · LEAN BACK SLOWLY · RELEASE ON TAP' },
      how: { zh: '坐在對方腳前，把對方的腳夾在你的腋下，你的雙腿壓住對方的大腿。前臂的骨頭卡在對方腳跟上方（阿基里斯腱），雙手扣緊。然後慢慢往後仰、挺胸，壓力會集中在對方腳踝。對方一拍地或說「停」，馬上放開。',
        en: 'Sit in front of their foot and trap it under your armpit, with your legs over their thigh. Put the bony edge of your forearm just above their heel (the Achilles tendon) and lock your hands. Then lean back slowly and lift the chest so the pressure goes into their ankle. The moment they tap or say stop, let go.' },
      mistakes: { zh: '猛然用力（會造成受傷）；前臂放在腳掌而不是跟腱；雙腿沒壓住對方（對方可以抽腳）；對方拍地後還不放。', en: 'Jerking it on fast (causes injuries); putting the forearm on the foot instead of the Achilles; legs not controlling the thigh (they pull the foot out); not letting go after the tap.' },
      practice: { zh: '在教練指導下，夥伴之間只做「位置 + 極輕施壓」各 5 次，雙方都要練習拍地。', en: 'Under a coach, partners practise the position with very light pressure, 5 times each, and both practise tapping.' },
      use: { zh: '運動桑搏允許腿部關節技，讓對方認輸可以直接獲勝。', en: 'Sport sambo allows leg locks, and a submission wins the match outright.' },
      bars: [['控制', 'Control', 90], ['安全意識', 'Safety', 95], ['抓握', 'Gripping', 82], ['柔韌度', 'Flexibility', 70]] },

    { id: 'combat', n: 8, zh: '格鬥桑搏：打擊接摔', py: 'Boevoe sambo', en: 'Combat Sambo: Strike, Grip, Trip',
      type: { zh: '格鬥桑搏', en: 'Combat sambo' }, contact: { zh: '拳面', en: 'Knuckles' }, phase: { zh: '站立 → 地面', en: 'Standing → ground' },
      tags: { zh: ['加入打擊的桑搏', '打擊掩護抓握與摔'], en: ['Sambo with strikes', 'Punches set up the grips and throw'] },
      ability: { zh: '打擊與摔的銜接', en: 'Linking strikes to throws' },
      note: { zh: '1-2 · 貼近抓握 · 後絆摔 · 站穩', en: '1-2 · CLOSE AND GRIP · BACK TRIP · STAY UP' },
      how: { zh: '格鬥桑搏允許拳、踢、膝、肘，也允許勒頸。先用前手、後手直拳讓對方舉手護頭，趁對方注意上方時貼近，抓住衣領與袖子，再用後絆摔把對方摔倒。摔完保持站立，雙手回到防守。',
        en: 'Combat sambo adds punches, kicks, knees and elbows, and also allows chokes. Throw a jab and cross so their hands come up to cover, then close the gap while their attention is high, take the lapel and sleeve and finish with the back trip. Stay standing afterwards with your guard back up.' },
      mistakes: { zh: '打完停在遠距離（抓不到）；貼近時低頭不護臉；抓到後猶豫太久；摔完跟著倒。', en: 'Punching and staying out of range (no grips); closing in with the head down and no guard; waiting too long once you have the grips; falling with them.' },
      practice: { zh: '戴拳套與護具，對著手靶打 1-2 後，夥伴讓你抓握並完成後絆摔，慢速 3 × 5 次。', en: 'With gloves and protection, hit pads with a 1-2, then your partner lets you grip and finish the back trip — slowly, 3 × 5 reps.' },
      use: { zh: '格鬥桑搏原本為軍警自衛而設計，打擊與摔的銜接是它的核心。', en: 'Combat sambo was built for military and police self-defence; linking strikes to throws is its core.' },
      bars: [['銜接', 'Linking', 90], ['時機', 'Timing', 88], ['距離', 'Distance', 85], ['防守', 'Defence', 80]] }
  ];

  w.SAMBO = { LIST: LIST, makeClip: makeClip };
})(window);
