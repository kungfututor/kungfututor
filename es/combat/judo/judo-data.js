/* Judo basics — 8 core lessons: bow, posture and grips, the back breakfall,
 * advanced foot sweep, major outer reap, minor inner reap, major hip throw,
 * scarf hold-down and the cross armlock.
 * Side view; you wear the blue judogi, the grey partner (kt-partner.js) the white.
 * Our own wording of widely taught Kodokan judo fundamentals. All text goes
 * through KT.pick / cap pairs for 17 languages.
 */
(function (w) {
  'use strict';
  var S = w.KTFigure.S, C = S.col, KP = w.KTPartner;
  function m() { var o = {}; for (var i = 0; i < arguments.length; i++) for (var k in arguments[i]) o[k] = arguments[i][k]; return o; }
  function cap(zh, en) { return { zh: zh, en: en }; }

  var X0 = 140, BLUE = '#2F5DA8', EDGE = '#AEB3BE';
  var LEGS = { x: X0, t: 6, h: 4, fN: { x: 22, y: 80 }, fF: { x: -26, y: 80 }, ftN: 90, ftF: 70, kbN: 1, kbF: 1, lift: 0 };
  var OPEN = { su: 40, sl: 120, fu: 34, fl: 125, laN: 1 };          // hands forward, open, ready to grip
  var GRIP = { su: 72, sl: 96, fu: 80, fl: 92, laN: 1 };            // lead hand on the lapel, rear hand on the sleeve
  var PO = { oa1: 40, oa2: 120, ob1: 34, ob2: 125 }, PG = { oa1: 72, oa2: 96, ob1: 80, ob2: 92 };
  var BASE = m(KP.base, PG, { hit: 0, ox: 228, ola: 14, olb: 4, ol: 18, oh: 2, olift: 0, face: 1 });
  function P() { return m.apply(null, [BASE, LEGS, GRIP].concat([].slice.call(arguments))); }
  // partner falling backward, then lying on their back (head away from you)
  var FALL = { ot: -55, ola: 70, olb: 62, ol: -30, oa1: 120, oa2: 140, ob1: 110, ob2: 130, olift: 10 };
  var DOWN = { ot: -88, oh: 0, ola: 88, olb: 92, ol: -88, oa1: 170, oa2: 175, ob1: 165, ob2: 172, olift: 0 };
  // lying on their back with the head towards you (armlock)
  var UP = { ot: 88, oh: 0, ola: -88, olb: -92, ol: 88, ob1: 110, ob2: 100, olift: 0 };
  var STAND_OVER = { t: 14, su: 38, sl: 52, fu: 32, fl: 46 };       // you stay standing, still holding the sleeve

  // whole-body poses with the hip placed absolutely (floor at y ~211)
  function ab() { return m.apply(null, [BASE, { ftN: 90, ftF: 70, kbN: 1, kbF: 1, lift: 0, h: 0, laN: 1 }].concat([].slice.call(arguments))); }

  var CLIPS = {
    stance: { trail: 'hN', frames: [
      { d: 1000, p: P({ ox: 262, t: 28, h: 6, su: 4, sl: 8, fu: -4, fl: 0, fN: { x: 10, y: 80 }, fF: { x: -12, y: 80 }, ot: 28, oh: 6, oa1: 4, oa2: 8, ob1: -4, ob2: 0, ola: 4, olb: 2, ol: 6 }), c: cap('互相鞠躬（禮），表示尊重', 'Bow to each other (rei) as a sign of respect') },
      { d: 800, p: P(OPEN, PO, { ox: 262 }), c: cap('自然體：雙腳與肩同寬、膝微彎、背挺直', 'Natural posture (shizentai): feet shoulder-width apart, knees soft, back straight') },
      { d: 600, p: P(OPEN, PO, { ox: 240, x: X0 + 4 }), c: cap('滑步靠近，腳不離地', 'Slide in with small steps, feet close to the mat') },
      { d: 900, p: P({ ox: 228, x: X0 + 4 }), c: cap('組手：前手抓衣領，後手抓袖子（肘部下方）', 'Grip (kumikata): lead hand on the lapel, rear hand on the sleeve below the elbow') },
      { d: 700, p: P({ ox: 224, x: X0 + 2, t: -2, su: 60, sl: 82, fu: 66, fl: 80, ot: 10, oh: 6 }), c: cap('破勢：拉袖、提領，讓對方重心移到腳尖', 'Off-balance them (kuzushi): pull the sleeve and lift the lapel so their weight goes onto their toes') },
      { d: 700, p: P({ ox: 228, x: X0 + 4 }), c: cap('回到自然體，準備進攻', 'Back to natural posture, ready to attack') }
    ] },
    breakfall: { hit: 'hN', trail: 'head', frames: [
      { d: 800, p: ab({ ox: 660, x: 150, y: 126, t: 4, fN: { x: 168, y: 211 }, fF: { x: 130, y: 211 }, su: 70, sl: 80, fu: 64, fl: 76 }), c: cap('站立，雙手向前，下巴微收', 'Stand with the arms forward and the chin slightly tucked') },
      { d: 600, p: ab({ ox: 660, x: 140, y: 172, t: 30, h: 18, fN: { x: 168, y: 211 }, fF: { x: 142, y: 211 }, su: 92, sl: 92, fu: 88, fl: 88 }), c: cap('深蹲，下巴貼胸，眼睛看腰帶結', 'Squat low, chin to chest, eyes on your belt knot') },
      { d: 400, p: ab({ ox: 660, x: 124, y: 204, t: -35, h: 26, fN: { x: 170, y: 198 }, fF: { x: 162, y: 202 }, su: 95, sl: 95, fu: 92, fl: 92 }), e: 'out', c: cap('臀部坐在腳跟後方，圓背往後滾', 'Sit the hips down just behind your heels and roll back with a round back') },
      { d: 900, p: ab({ ox: 660, x: 128, y: 204, t: -66, h: 30, fN: { x: 176, y: 166 }, fF: { x: 168, y: 172 }, su: 50, sl: 62, fu: 46, fl: 58, hit: 1 }), c: cap('雙臂在身體兩側約 45° 拍墊，頭不碰地', 'Slap the mat with both arms at about 45° from your body; the head never touches the mat') },
      { d: 700, p: ab({ ox: 660, x: 124, y: 204, t: -22, h: 14, fN: { x: 176, y: 211 }, fF: { x: 168, y: 211 }, su: 60, sl: 80, fu: 56, fl: 76 }), c: cap('坐起來，準備站起', 'Sit up, ready to stand') }
    ] },
    deashi: { hit: 'tN', trail: 'tN', frames: [
      { d: 700, p: P({ x: X0 + 4 }), c: cap('雙方組手：衣領與袖子', 'Both gripping: lapel and sleeve') },
      { d: 420, p: P({ x: X0 + 4, t: -2, su: 62, sl: 84, fu: 68, fl: 82, ox: 220, ot: 4, ola: 28, olb: 12 }), c: cap('對方往前踏步時，順勢把對方拉到那隻腳上', 'As they step forward, pull them on to that foot') },
      { d: 220, p: P({ x: X0 + 4, t: -6, su: 58, sl: 80, fu: 62, fl: 78, fN: { x: 48, y: 74 }, ftN: 120, ox: 220, ot: -14, ola: 60, olb: 52, hit: 1 }), e: 'out', c: cap('在重心落下前，用腳底掃對方腳踝', 'Sweep their ankle with the sole of your foot just before their weight lands') },
      { d: 300, p: P(FALL, { x: X0 + 4, t: 6, su: 50, sl: 70, fu: 52, fl: 72, ox: 240 }), c: cap('雙手繼續拉轉，對方雙腳離地', 'Keep pulling and turning with the hands as their feet leave the mat') },
      { d: 900, p: P(DOWN, STAND_OVER, { x: X0 + 4, ox: 266 }), c: cap('有力、快速、背部著地 —— 一本', 'They land on the back with force and speed — ippon') }
    ] },
    osoto: { hit: 'kN', trail: 'aN', frames: [
      { d: 700, p: P({ x: X0 + 4 }), c: cap('雙方組手', 'Both gripping') },
      { d: 380, p: P({ x: X0 + 24, t: 8, fN: { x: 10, y: 80 }, fF: { x: -2, y: 80 }, su: 82, sl: 80, fu: 64, fl: 82, ox: 228, ot: -10, oh: -4 }), c: cap('拉袖、推領讓對方重心落到腳跟，支撐腳踏到對方腳旁', 'Pull the sleeve and push the lapel to put their weight on the heels; plant your support foot beside theirs') },
      { d: 300, p: P({ x: X0 + 28, t: 16, fN: { x: 72, y: 46 }, fF: { x: -2, y: 80 }, ftN: 60, su: 84, sl: 80, fu: 64, fl: 82, ox: 228, ot: -14, oh: -4 }), c: cap('刈腳往前擺過對方的腿', 'Swing your reaping leg forward past their leg') },
      { d: 260, p: P({ x: X0 + 28, t: 46, h: -12, fN: { x: 34, y: 58 }, fF: { x: -2, y: 80 }, ftN: 40, su: 86, sl: 84, fu: 60, fl: 80, ox: 230, ot: -34, oh: -8, ola: 34, olb: 46, ol: 24, hit: 1 }), e: 'out', c: cap('大腿後側刈對方大腿後側，胸口同時往前壓', 'Reap: the back of your thigh hits the back of theirs while your chest drives forward') },
      { d: 300, p: P(FALL, { x: X0 + 26, t: 28, fN: { x: 20, y: 70 }, fF: { x: -2, y: 80 }, su: 50, sl: 70, fu: 52, fl: 72, ox: 246 }), c: cap('對方失去支撐腳，往後倒', 'With the supporting leg gone, they fall backwards') },
      { d: 900, p: P(DOWN, STAND_OVER, { x: X0 + 24, ox: 276 }), c: cap('對方背部著地，你站穩、拉住袖子保護對方', 'They land on their back; you stay up and keep hold of the sleeve to protect them') }
    ] },
    kouchi: { hit: 'aN', trail: 'aN', frames: [
      { d: 700, p: P({ x: X0 + 4 }), c: cap('雙方組手', 'Both gripping') },
      { d: 380, p: P({ x: X0 + 16, t: 4, su: 80, sl: 82, fu: 84, fl: 88, ox: 226, ot: -6, oh: -2 }), c: cap('靠近，往後推讓對方的前腳承重', 'Close in and push them back so their weight sits on the lead foot') },
      { d: 300, p: P({ x: X0 + 18, t: 2, fN: { x: 58, y: 76 }, ftN: 120, su: 82, sl: 82, fu: 86, fl: 88, ox: 226, ot: -8, oh: -2 }), c: cap('用腳底從內側勾住對方前腳的腳跟', 'Hook behind their lead heel from the inside with the sole of your foot') },
      { d: 240, p: P({ x: X0 + 24, t: 14, fN: { x: 36, y: 74 }, ftN: 110, su: 90, sl: 86, fu: 92, fl: 90, ox: 230, ot: -30, oh: -6, ola: 46, olb: 38, ol: 26, hit: 1 }), e: 'out', c: cap('把腳往對方腳尖方向刈，雙手同時往後推', 'Reap the foot towards their toes while both hands drive them back') },
      { d: 300, p: P(FALL, { x: X0 + 22, t: 16, su: 56, sl: 70, fu: 58, fl: 72, ox: 246 }), c: cap('對方失去平衡往後倒', 'Off balance, they fall backwards') },
      { d: 900, p: P(DOWN, STAND_OVER, { x: X0 + 20, ox: 274 }), c: cap('小內刈常常用來接大外刈或其他摔法', 'The minor inner reap often sets up the major outer reap and other throws') }
    ] },
    ogoshi: { hit: 'hip', trail: 'tN', frames: [
      { d: 700, p: P({ x: X0 + 4 }), c: cap('雙方組手', 'Both gripping') },
      { d: 360, p: P({ x: X0 + 18, t: 4, su: 60, sl: 82, fu: 66, fl: 80, ox: 222, ot: 14, oh: 8 }), c: cap('拉袖讓對方往前，重心落在腳尖', 'Pull the sleeve to bring them forward onto their toes') },
      { d: 460, p: P({ face: -1, x: X0 + 58, t: 22, fN: { x: 16, y: 64 }, fF: { x: -16, y: 64 }, su: -50, sl: -96, fu: 70, fl: 86, ox: 216, ot: 34, oh: 10, ola: 20, olb: 10, ol: 10 }), c: cap('轉身踏進，背貼對方，膝彎下讓臀部低於對方腰帶，手臂抱住對方的腰', 'Turn in with your back to them, knees bent so your hips are below their belt, and wrap your arm round their waist') },
      { d: 340, p: P({ face: -1, x: X0 + 58, t: 60, h: -10, fN: { x: 16, y: 80 }, fF: { x: -16, y: 80 }, su: -20, sl: -60, fu: 40, fl: 20, ox: 210, ot: 86, oh: 4, ola: -60, olb: -70, ol: 60, oa1: 120, oa2: 140, olift: 36, hit: 1 }), e: 'out', c: cap('伸直雙腿，用臀部把對方抬起，同時拉袖', 'Straighten the legs to lift them on your hip while you pull the sleeve') },
      { d: 300, p: P({ face: -1, x: X0 + 58, t: 50, h: -6, fN: { x: 16, y: 80 }, fF: { x: -16, y: 80 }, su: 10, sl: -20, fu: 30, fl: 10, ox: 178, ot: 176, oh: 0, ola: -160, olb: -160, ol: 160, oa1: 160, oa2: 170, ob1: 150, ob2: 160, olift: 40 }), c: cap('對方從你的臀部上翻過去', 'They roll over your hip') },
      { d: 900, p: P({ face: -1, x: X0 + 58, t: 22, fN: { x: 18, y: 80 }, fF: { x: -16, y: 80 }, su: 30, sl: 20, fu: 40, fl: 30, ox: 118, ot: 272, oh: 0, ola: -272, olb: -268, ol: 272, oa1: 170, oa2: 175, ob1: 165, ob2: 172, olift: 0 }), c: cap('對方背部著地在你腳前，你拉住袖子', 'They land on their back in front of your feet; you keep hold of the sleeve') }
    ] },
    kesa: { hit: null, trail: 'sh', frames: [
      { d: 800, p: ab(DOWN, { ox: 196, x: 222, y: 200, t: 24, fN: { x: 258, y: 209 }, fF: { x: 170, y: 209 }, ftN: 90, ftF: -90, kbN: 1, kbF: -1, su: 60, sl: 110, fu: 40, fl: 80, oa1: 150, oa2: 120 }), c: cap('對方仰躺，你緊貼對方身側坐下，面向對方的頭', 'They are on their back; sit tight against their side, facing their head') },
      { d: 600, p: ab(DOWN, { ox: 196, x: 222, y: 200, t: 56, fN: { x: 262, y: 209 }, fF: { x: 162, y: 209 }, ftN: 90, ftF: -90, kbN: 1, kbF: -1, su: 82, sl: 120, fu: 40, fl: 60, oa1: 120, oa2: 100 }), c: cap('一手繞過對方脖子，另一手把對方的手臂夾在腋下', 'Wrap one arm round their neck and trap their near arm under your other armpit') },
      { d: 1400, p: ab(DOWN, { ox: 196, x: 222, y: 201, t: 60, fN: { x: 266, y: 209 }, fF: { x: 156, y: 209 }, ftN: 90, ftF: -90, kbN: 1, kbF: -1, su: 84, sl: 120, fu: 40, fl: 60, oa1: 120, oa2: 100 }), c: cap('壓住：10 秒是技有，20 秒是一本', 'Hold it: 10 seconds is waza-ari, 20 seconds is ippon') },
      { d: 700, p: ab(DOWN, { ox: 196, x: 220, y: 200, t: 54, fN: { x: 272, y: 209 }, fF: { x: 150, y: 209 }, ftN: 90, ftF: -90, kbN: 1, kbF: -1, su: 82, sl: 120, fu: 40, fl: 60, ot: -80, oa1: 120, oa2: 100, olift: 6 }), c: cap('對方挺腰想翻時，雙腿再張開，把重量留在對方胸口', 'If they bridge, spread your legs wider and keep your weight on their chest') }
    ] },
    juji: { hit: 'elbow', trail: null, frames: [
      { d: 900, p: ab(UP, { ox: 320, x: 236, y: 202, t: 10, fN: { x: 310, y: 194 }, fF: { x: 298, y: 200 }, ftN: 80, ftF: 80, su: 30, sl: 150, fu: 36, fl: 140, oa1: 178, oa2: 178 }), c: cap('臀部緊貼對方肩膀坐下，雙腿壓在對方胸口與頭上', 'Sit with your hips tight to their shoulder and your legs across their chest and head') },
      { d: 600, p: ab(UP, { ox: 320, x: 236, y: 202, t: 4, fN: { x: 310, y: 194 }, fF: { x: 298, y: 200 }, ftN: 80, ftF: 80, su: 20, sl: 160, fu: 26, fl: 150, oa1: 170, oa2: 170 }), c: cap('雙手把對方的手臂抱在胸前，拇指朝上，雙膝夾緊', 'Hug their arm to your chest, thumb pointing up, and squeeze your knees together') },
      { d: 700, p: ab(UP, { ox: 320, x: 236, y: 198, t: -62, fN: { x: 310, y: 194 }, fF: { x: 298, y: 200 }, ftN: 80, ftF: 80, su: 140, sl: 150, fu: 136, fl: 146, oa1: 132, oa2: 128, hit: 1 }), c: cap('慢慢往後躺、臀部微微抬起，壓力在對方的手肘', 'Lie back slowly and lift your hips a little — the pressure goes on their elbow') },
      { d: 800, p: ab(UP, { ox: 320, x: 236, y: 202, t: 4, fN: { x: 310, y: 194 }, fF: { x: 298, y: 200 }, ftN: 80, ftF: 80, su: 20, sl: 160, fu: 26, fl: 150, oa1: 170, oa2: 170 }), c: cap('對方拍地認輸 —— 立刻放開', 'They tap — let go at once') }
    ] }
  };

  // judogi jacket and belt drawn over the stick figures; edge draws an outline (white jacket)
  function jacket(J, col, sc, edge) {
    var out = '';
    if (edge) out += S.poly([J.hip, J.sh], edge, 12 * sc) + S.poly([J.shN, J.eN], edge, 10 * sc);
    return out + S.poly([J.hip, J.sh], col, 9.5 * sc) + S.poly([J.shN, J.eN], col, 7.5 * sc) + S.circle(J.hip, 4.2 * sc, C.ink, '#fff', 1.2);
  }

  function makeClip(s, view, level, lang) {
    var src = CLIPS[s.id], pace = level < 1 ? 1.8 : 1;
    return {
      scale: 0.88, base: { x: X0 }, cx: X0, ticks: false, labelAt: [292, 26], still: 0.5,
      trail: src.trail || null,
      frames: src.frames.map(function (f) { return { d: Math.round(f.d * pace), p: f.p, e: f.e, c: f.c }; }),
      props: function (J, c) {
        var sc = c.scale;
        var o = KP.draw(J, c, { cx: X0 }), back = o.svg + jacket(o.O, '#fff', sc, EDGE), fr = '', hud = '';
        fr += jacket(J, BLUE, sc);
        if (c.pose.su > 55 && c.pose.su < 100 && c.pose.ox < 240 && c.pose.t < 30) fr += S.circle(J.hN, 3.6 * sc, BLUE, '#fff', 1.2);  // grip marker
        if (src.hit && c.pose.hit > 0.15) {
          var pt = src.hit === 'elbow' ? o.O.eN : J[src.hit];
          fr += KP.hit(pt, c.pose.hit);
          if (c.pose.hit > 0.6) hud += S.text(18, 30, KT.pick('接觸點：', 'CONTACT: ') + KT.t(s.contact), { size: 12, fill: C.red, family: "'JetBrains Mono','Noto Sans TC',monospace" });
        }
        return { back: back, front: fr, hud: hud };
      }
    };
  }

  var LIST = [
    { id: 'stance', n: 1, zh: '禮、自然體與組手', py: 'Rei · Shizentai · Kumikata', en: 'Bow, Posture and Grips',
      type: { zh: '基本', en: 'Foundation' }, contact: { zh: '衣領與袖子', en: 'Lapel and sleeve' }, phase: { zh: '站立', en: 'Standing' },
      tags: { zh: ['以禮開始、以禮結束', '先組手、再破勢'], en: ['Start and end with a bow', 'Grip first, then break the balance'] },
      ability: { zh: '抓握與平衡', en: 'Gripping and balance' },
      note: { zh: '鞠躬 · 自然體 · 前手領 · 後手袖', en: 'BOW · NATURAL POSTURE · LAPEL · SLEEVE' },
      how: { zh: '練習前後互相鞠躬（禮）。站成自然體：雙腳與肩同寬、膝蓋微彎、背挺直，重心在兩腳中間。移動時用滑步，腳底貼近墊子。前手抓對方衣領，後手抓對方手肘下方的袖子，這叫組手。抓好後拉袖、提領，讓對方的重心移到腳尖或腳跟，這叫破勢（崩し），是每一個摔法的準備。',
        en: 'Bow to your partner (rei) before and after practice. Stand in natural posture (shizentai): feet shoulder-width apart, knees soft, back straight, weight between both feet. Move with sliding steps, feet close to the mat. The lead hand grips their lapel and the rear hand grips the sleeve just below the elbow — the grip (kumikata). Then pull the sleeve and lift the lapel to move their weight onto their toes or heels. This is kuzushi, breaking the balance, and it comes before every throw.' },
      mistakes: { zh: '彎腰把頭伸向前（防守姿勢太低）；雙腳交叉走路（容易被掃）；抓得太緊、手臂僵直；只抓不破勢。', en: 'Bending forward with the head down (an over-defensive posture); crossing the feet as you walk (easy to sweep); gripping so hard the arms go stiff; holding on without breaking the balance.' },
      practice: { zh: '和夥伴組手後在墊上移動 3 × 1 分鐘，輪流練習拉、推讓對方失去平衡（不摔）。', en: 'Grip up with a partner and move around the mat for 3 × 1 minute, taking turns to pull and push them off balance without throwing.' },
      use: { zh: '柔道比賽穿柔道服，組手決定誰能先發動摔法；柔道的「禮」是這項運動的核心。', en: 'Judo is fought in a jacket, so the grip fight decides who throws first — and the bow is at the heart of the sport.' },
      bars: [['抓握', 'Gripping', 90], ['平衡', 'Balance', 88], ['姿勢', 'Posture', 86], ['禮儀', 'Etiquette', 80]] },

    { id: 'breakfall', n: 2, zh: '後受身', py: 'Ushiro ukemi', en: 'Back Breakfall',
      type: { zh: '受身', en: 'Breakfall' }, contact: { zh: '雙臂拍墊', en: 'Both arms slap the mat' }, phase: { zh: '倒地', en: 'Falling' },
      tags: { zh: ['柔道第一課', '保護頭部與背部'], en: ['Judo\'s first lesson', 'Protects the head and back'] },
      ability: { zh: '安全倒地', en: 'Falling safely' },
      note: { zh: '下巴貼胸 · 圓背滾 · 雙手拍墊', en: 'CHIN TUCKED · ROUND BACK · SLAP THE MAT' },
      how: { zh: '從站立深蹲下去，下巴貼胸、眼睛看自己的腰帶結。臀部坐在腳跟後方，背部弓圓往後滾。背部著地的同時，雙臂在身體兩側約 45° 用整隻手臂拍墊，把衝擊分散掉。頭始終不碰地。柔道還有側受身、前受身和前迴轉受身，都要在教練指導下學。',
        en: 'From standing, squat down with the chin on your chest and eyes on your belt knot. Sit the hips down just behind your heels and roll back with a rounded back. As your back meets the mat, slap it with both whole arms at about 45° from your body to spread the impact. Your head never touches the mat. Judo also has side, front and rolling breakfalls — learn each one with a coach.' },
      mistakes: { zh: '頭往後仰撞地；用手撐地（容易傷手腕和手肘）；背部挺直像木板一樣倒下；拍墊太晚。', en: 'Letting the head snap back onto the mat; putting a hand down to catch yourself (hurts the wrist and elbow); falling flat like a board; slapping too late.' },
      practice: { zh: '先從坐姿往後滾拍墊 10 次，再從蹲姿 10 次，最後從站姿 10 次。只在軟墊上練習。', en: '10 rolls from sitting, then 10 from a squat, then 10 from standing — always on mats.' },
      use: { zh: '柔道的意思是「柔之道」，你會被摔很多次。好的受身讓你可以安全地練習很多年。', en: 'In judo you will be thrown a lot; a good breakfall is what lets you train safely for years.' },
      bars: [['安全', 'Safety', 96], ['協調', 'Coordination', 85], ['時機', 'Timing', 80], ['核心', 'Core', 72]] },

    { id: 'deashi', n: 3, zh: '出足掃', py: 'De-ashi-barai', en: 'Advanced Foot Sweep',
      type: { zh: '足技', en: 'Foot technique' }, contact: { zh: '腳底掃腳踝', en: 'Sole against the ankle' }, phase: { zh: '站立 → 地面', en: 'Standing → ground' },
      tags: { zh: ['靠時機，不靠力氣', '對方踏步的一瞬間'], en: ['Timing, not strength', 'The moment they step'] },
      ability: { zh: '時機與節奏', en: 'Timing and rhythm' },
      note: { zh: '對方踏步 · 重心落下前掃腳', en: 'THEY STEP · SWEEP BEFORE THE WEIGHT LANDS' },
      how: { zh: '組手後跟著對方移動。當對方往前踏步、腳快要落地但重心還沒放上去時，用你的腳底貼著對方腳踝，往對方腳尖的方向掃，同時雙手拉轉對方的上身。腳被掃走、上身被轉，對方就會倒下。',
        en: 'Grip up and move with them. As they step forward and the foot is about to land — before their weight is on it — sweep the sole of your foot against their ankle in the direction their toes point, while your hands pull and turn their upper body. With the foot gone and the body turned, they fall.' },
      mistakes: { zh: '踢對方的小腿（是掃不是踢）；掃得太晚，對方重心已經放上去；只用腳不用手；掃完自己失去平衡。', en: 'Kicking the shin (it is a sweep, not a kick); sweeping too late when their weight is already down; using only the foot and not the hands; losing your own balance afterwards.' },
      practice: { zh: '夥伴慢慢前後走，你只練「在正確時機輕掃腳踝」20 次，不必摔倒對方。', en: 'Partner walks slowly back and forth; you just practise touching the sweep at the right moment, 20 times, without throwing.' },
      use: { zh: '時機對了幾乎不用力氣，是「柔能制剛」最好的例子。', en: 'With the right timing it takes almost no strength — the clearest example of judo\'s "gentle way".' },
      bars: [['時機', 'Timing', 96], ['協調', 'Coordination', 85], ['抓握', 'Gripping', 80], ['平衡', 'Balance', 82]] },

    { id: 'osoto', n: 4, zh: '大外刈', py: 'O-soto-gari', en: 'Major Outer Reap',
      type: { zh: '足技', en: 'Foot technique' }, contact: { zh: '大腿後側刈大腿後側', en: 'Back of thigh against back of thigh' }, phase: { zh: '站立 → 地面', en: 'Standing → ground' },
      tags: { zh: ['初學者最常學的摔法之一', '刈腿、胸口往前壓'], en: ['One of the first throws taught', 'Reap the leg, drive with the chest'] },
      ability: { zh: '推進與平衡', en: 'Drive and balance' },
      note: { zh: '重心到腳跟 · 擺腿 · 往後刈 · 胸往前', en: 'WEIGHT ON THE HEELS · SWING · REAP BACK · CHEST FORWARD' },
      how: { zh: '拉袖、推領，讓對方的重心落到腳跟。支撐腳踏到對方腳旁邊，刈腳往前擺過對方的腿，再用你大腿後側往後刈對方大腿後側，同時胸口往前壓。對方失去支撐腳，往後倒。你站穩，拉住袖子讓對方受身。',
        en: 'Pull the sleeve and push the lapel to put their weight on their heels. Plant your support foot beside theirs, swing your reaping leg forward past their leg, then reap back so the back of your thigh hits the back of theirs while your chest drives forward. Without its supporting leg their body falls back. Stay on your feet and keep the sleeve so they can breakfall.' },
      mistakes: { zh: '沒先破勢就刈（對方站得很穩）；支撐腳離太遠；只用腳不用上身；刈完放開袖子（對方受身困難）。', en: 'Reaping before breaking the balance (they are rooted); support foot too far away; using the leg without the upper body; letting go of the sleeve (makes their breakfall harder).' },
      practice: { zh: '夥伴站好，你慢速練「踏步 + 擺腿 + 刈」各 10 次不摔；之後在墊上完整練，夥伴做後受身。', en: 'With your partner standing still, drill step, swing and reap slowly 10 times each side without throwing; then full throws on mats with your partner breakfalling.' },
      use: { zh: '當對方站得直、重心在後時特別有效，也是很多組合技的終點。', en: 'Works best when they stand tall with their weight back, and finishes many combinations.' },
      bars: [['推進', 'Drive', 90], ['平衡', 'Balance', 86], ['破勢', 'Kuzushi', 85], ['時機', 'Timing', 80]] },

    { id: 'kouchi', n: 5, zh: '小內刈', py: 'Ko-uchi-gari', en: 'Minor Inner Reap',
      type: { zh: '足技', en: 'Foot technique' }, contact: { zh: '腳底勾腳跟', en: 'Sole hooks the heel' }, phase: { zh: '站立 → 地面', en: 'Standing → ground' },
      tags: { zh: ['小動作、大效果', '常用來連接其他摔法'], en: ['Small move, big effect', 'A favourite set-up for other throws'] },
      ability: { zh: '速度與連接', en: 'Speed and linking' },
      note: { zh: '推後 · 從內側勾腳跟 · 往腳尖方向刈', en: 'PUSH BACK · HOOK THE HEEL INSIDE · REAP TO THE TOES' },
      how: { zh: '靠近對方並往後推，讓對方的重量壓在前腳上。用腳底從兩腿中間勾住對方前腳的腳跟，往對方腳尖的方向刈，同時雙手往後推。對方的腳被刈走，往後倒下。',
        en: 'Close in and push them back so their weight sits on their lead foot. From between their legs, hook behind that heel with the sole of your foot and reap it towards their toes while both hands drive them back. With the foot gone, they fall backwards.' },
      mistakes: { zh: '刈的時候對方腳上沒有重量（刈不動）；用腳尖踢而不是腳底勾；上身沒有往後推；身體離太遠。', en: 'Reaping a foot with no weight on it (it just moves); kicking with the toes instead of hooking with the sole; no push from the upper body; standing too far away.' },
      practice: { zh: '慢速練「推 + 勾 + 刈」各 10 次，再練「小內刈 → 大外刈」連接 10 次。', en: 'Drill push, hook and reap slowly 10 times each side, then 10 reps linking the minor inner reap into the major outer reap.' },
      use: { zh: '對方往後退以防小內刈時，正好讓你接大外刈或其他前方摔法。', en: 'When they step back to avoid it, they walk straight into the major outer reap or a forward throw.' },
      bars: [['速度', 'Speed', 88], ['連接', 'Linking', 88], ['時機', 'Timing', 85], ['平衡', 'Balance', 80]] },

    { id: 'ogoshi', n: 6, zh: '大腰', py: 'O-goshi', en: 'Major Hip Throw',
      type: { zh: '腰技', en: 'Hip technique' }, contact: { zh: '臀部在對方腰帶下方', en: 'Your hip below their belt' }, phase: { zh: '站立 → 地面', en: 'Standing → ground' },
      tags: { zh: ['經典腰技', '轉身、低腰、抬起'], en: ['The classic hip throw', 'Turn in, drop the hips, lift'] },
      ability: { zh: '轉身與腿力', en: 'Turning and leg drive' },
      note: { zh: '拉往前 · 轉身踏進 · 低腰 · 伸腿抬起', en: 'PULL FORWARD · TURN IN · HIPS LOW · STRAIGHTEN TO LIFT' },
      how: { zh: '拉袖讓對方往前、重心落在腳尖。轉身踏進，背靠對方胸口，雙膝彎下，讓你的臀部低於對方腰帶，同時手臂抱住對方的腰。然後伸直雙腿，用臀部把對方抬起，一邊拉袖一邊轉身，對方從你的臀部翻過去，背部著地在你腳前。',
        en: 'Pull the sleeve to bring them forward onto their toes. Turn in so your back is against their chest, bend your knees so your hips are below their belt, and wrap your arm round their waist. Then straighten your legs to lift them on your hip and keep pulling and turning — they roll over your hip and land on their back in front of your feet.' },
      mistakes: { zh: '膝蓋沒彎（臀部比對方高，抬不起）；只用手拉、用背抬（傷腰）；轉身不夠，臀部沒貼住；沒先破勢就轉身。', en: 'Not bending the knees (your hips stay higher than theirs and you cannot lift); pulling with the arms and lifting with the back (hurts your back); not turning far enough, so the hips do not connect; turning in before breaking the balance.' },
      practice: { zh: '打入（uchikomi）：轉身踏進、低腰、抬起一點就停，左右各 3 × 10 次；之後在墊上完整摔，夥伴做受身。', en: 'Entries (uchikomi): turn in, drop the hips and lift slightly, then stop — 3 × 10 each side; then full throws on mats with your partner breakfalling.' },
      use: { zh: '對方往前推或往前彎腰時，大腰可以順勢把對方摔過去；它也是學習其他腰技和背負投的基礎。', en: 'When they push forward or bend over, the hip throw uses that momentum; it is also the base for the other hip throws and shoulder throws.' },
      bars: [['腿力', 'Leg drive', 90], ['轉身', 'Turning', 88], ['破勢', 'Kuzushi', 85], ['核心', 'Core', 80]] },

    { id: 'kesa', n: 7, zh: '袈裟固', py: 'Kesa-gatame', en: 'Scarf Hold-Down',
      type: { zh: '固技', en: 'Hold-down' }, contact: { zh: '胸側壓胸口', en: 'Your side on their chest' }, phase: { zh: '地面', en: 'Ground' },
      tags: { zh: ['柔道第一個學的壓制', '20 秒＝一本'], en: ['The first hold-down taught', '20 seconds = ippon'] },
      ability: { zh: '控制與重量', en: 'Control and weight' },
      note: { zh: '貼身坐 · 抱頸 · 夾臂 · 雙腿張開', en: 'SIT TIGHT · ARM ROUND THE NECK · TRAP THE ARM · LEGS WIDE' },
      how: { zh: '對方仰躺時，你緊貼對方身側坐下，面向對方的頭。一手從對方脖子後面繞過，另一手把對方靠近你的手臂夾在腋下。身體側面壓在對方胸口，雙腿前後張開，像三腳架一樣穩。目前國際柔聯規則：壓制 10 秒是技有，20 秒是一本。',
        en: 'With them on their back, sit tight against their side, facing their head. Wrap one arm round the back of their neck and trap their near arm under your other armpit. Press your side onto their chest with the legs spread wide, one forward and one back, like a tripod. Under current IJF rules a 10-second hold-down is waza-ari and 20 seconds is ippon.' },
      mistakes: { zh: '坐得離對方太遠（壓不住）；雙腿併攏（一翻就倒）；只抱頭不夾手臂（對方手臂抽出來推你）；被翻時慌張放手。', en: 'Sitting too far from them (no pressure); legs together (easy to roll); holding the head without trapping the arm (they pull it out and push you off); letting go in a panic when they bridge.' },
      practice: { zh: '和夥伴輪流：一人壓制 30 秒，另一人用挺腰和轉身嘗試逃脫。', en: 'Take turns: one holds for 30 seconds while the other tries to escape by bridging and turning.' },
      use: { zh: '摔倒對方但沒拿到一本時，馬上接袈裟固，可以在地面贏得比賽。', en: 'When a throw lands but is not ippon, go straight into the scarf hold and win on the ground.' },
      bars: [['控制', 'Control', 92], ['重量壓力', 'Weight pressure', 88], ['平衡', 'Balance', 86], ['耐力', 'Endurance', 78]] },

    { id: 'juji', n: 8, zh: '腕挫十字固', py: 'Ude-hishigi-juji-gatame', en: 'Cross Armlock',
      type: { zh: '關節技', en: 'Armlock' }, contact: { zh: '壓力在對方手肘', en: 'Pressure on their elbow' }, phase: { zh: '地面', en: 'Ground' },
      tags: { zh: ['柔道只允許鎖手肘', '慢慢施壓，對方拍地即放'], en: ['Judo allows locks on the elbow only', 'Apply slowly; release on the tap'] },
      ability: { zh: '控制與安全意識', en: 'Control and safety' },
      note: { zh: '貼肩坐 · 抱臂 · 夾膝 · 慢慢後躺', en: 'HIPS TO SHOULDER · HUG THE ARM · KNEES IN · LIE BACK' },
      how: { zh: '臀部緊貼對方肩膀坐下，雙腿壓在對方胸口與頭上。雙手把對方一隻手臂抱在胸前，對方拇指朝上，雙膝夾緊。然後慢慢往後躺、臀部微微抬起，壓力就會落在對方的手肘。對方一拍地或說「參った」（認輸），馬上放開。',
        en: 'Sit with your hips tight against their shoulder and your legs across their chest and head. Hug one of their arms to your chest with their thumb pointing up and squeeze your knees together. Then lie back slowly and lift your hips a little — the pressure goes onto their elbow. The moment they tap or say "maitta" (I give up), let go.' },
      mistakes: { zh: '猛然用力（會造成受傷）；臀部離肩膀太遠（對方抽手）；雙膝打開；對方拍地後還不放。', en: 'Jerking it on fast (causes injuries); hips too far from the shoulder (they pull the arm out); knees apart; not letting go after the tap.' },
      practice: { zh: '在教練指導下，夥伴之間只做「位置 + 極輕施壓」各 5 次，雙方都要練習拍地。關節技通常只教給較年長的學員。', en: 'Under a coach, partners practise the position with very light pressure, 5 times each, and both practise tapping. Armlocks are usually taught only to older students.' },
      use: { zh: '讓對方認輸是一本，直接獲勝。', en: 'A submission is ippon and wins the match outright.' },
      bars: [['控制', 'Control', 90], ['安全意識', 'Safety', 96], ['抓握', 'Gripping', 82], ['柔韌度', 'Flexibility', 72]] }
  ];

  w.JUDO = { LIST: LIST, makeClip: makeClip };
})(window);
