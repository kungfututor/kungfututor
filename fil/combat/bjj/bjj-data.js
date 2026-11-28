/* Brazilian Jiu-Jitsu basics — 8 core lessons, almost all on the ground:
 * closed guard, the hip escape (shrimp), bridge-and-roll mount escape, hip-bump
 * sweep, knee-cut guard pass, side control to mount, armbar from guard and the
 * rear naked choke. Side view; you wear the blue gi, the grey partner the white.
 * Our own wording of widely taught BJJ fundamentals. All text goes through
 * KT.pick / cap pairs for 17 languages.
 */
(function (w) {
  'use strict';
  var S = w.KTFigure.S, C = S.col, KP = w.KTPartner;
  function m() { var o = {}; for (var i = 0; i < arguments.length; i++) for (var k in arguments[i]) o[k] = arguments[i][k]; return o; }
  function cap(zh, en) { return { zh: zh, en: en }; }

  var X0 = 140, BLUE = '#2F5DA8', EDGE = '#AEB3BE', G = 210;
  // (kneeling: both shins back along the mat — the far shin's key has the opposite sign, so +90 here is the same way as olb −90)
  var BASE = m(KP.base, { hit: 0, ox: 250, oa1: 40, oa2: 20, ob1: 34, ob2: 14, ola: 0, olb: -90, ol: 0, olf: 90, oh: 0, olift: 0, face: 1 });
  // every pose here places your hip absolutely (floor at y ~211)
  function ab() { return m.apply(null, [BASE, { ftN: 90, ftF: 90, kbN: 1, kbF: 1, lift: 0, h: 0, laN: 1 }].concat([].slice.call(arguments))); }
  // partner kneeling upright (in your guard / on top of you)
  var KNEEL = { ot: 4, ola: 0, olb: -90, ol: 0, olf: 90 };
  // partner lying on their back, head away from you, legs towards you
  var DOWN = { ot: -88, oh: 0, ola: 88, olb: 92, ol: -88, olf: -92, oa1: 150, oa2: 130, ob1: 140, ob2: 120, olift: 0 };
  // partner lying on their back the other way round (head away to the left)
  var UP = { ot: 88, oh: 0, ola: -88, olb: -92, ol: 88, olf: 92, oa1: 150, oa2: 130, ob1: 140, ob2: 120, olift: 0 };
  // partner sitting, facing left (away from you when you are behind them)
  var SIT = { ot: 8, oh: 0, ola: 82, olb: 92, ol: -82, olf: -92, oa1: 30, oa2: 60, ob1: 20, ob2: 50, olift: 0 };

  // you on your back with the partner kneeling between your legs (closed guard)
  var GUARD = { x: 232, y: 204, t: -84, fN: { x: 284, y: 150 }, fF: { x: 278, y: 156 }, ftN: 60, ftF: 60, kbN: 1, kbF: 1, su: 128, sl: 110, fu: 118, fl: 100 };
  var SIDE = { ox: 236, x: 226, y: 183, t: 78, fN: { x: 152, y: 209 }, fF: { x: 138, y: 209 }, ftN: -90, ftF: -90, su: 18, sl: 40, fu: 10, fl: 30 };
  var MOUNT = { ox: 236, x: 256, y: 168, t: 14, fN: { x: 222, y: 209 }, fF: { x: 218, y: 209 }, ftN: -90, ftF: -90, kbN: 1, kbF: 1, su: 40, sl: 70, fu: 30, fl: 60 };

  var CLIPS = {
    guard: { hit: null, trail: 'hN', frames: [
      { d: 900, p: ab(KNEEL, GUARD), c: cap('你仰躺，雙腿夾住對方的腰，腳踝在對方背後交叉', 'You are on your back with your legs locked round their waist, ankles crossed behind them') },
      { d: 600, p: ab(KNEEL, GUARD, { su: 112, sl: 96, fu: 104, fl: 92, oa1: 40, oa2: 60 }), c: cap('一手抓衣領，一手抓袖子', 'Grip the collar with one hand and the sleeve with the other') },
      { d: 600, p: ab(KNEEL, GUARD, { fN: { x: 276, y: 140 }, fF: { x: 270, y: 146 }, su: 140, sl: 130, fu: 130, fl: 120, ot: 40, oh: 10, oa1: 10, oa2: 30 }), c: cap('雙腿把對方拉向你、雙手往下拉，打破對方的姿勢', 'Pull with your legs and arms so they bend forward — their posture is broken') },
      { d: 1000, p: ab(KNEEL, GUARD, { fN: { x: 276, y: 140 }, fF: { x: 270, y: 146 }, su: 140, sl: 130, fu: 130, fl: 120, ot: 40, oh: 10, oa1: 10, oa2: 30 }), c: cap('保持對方彎腰：對方很難過腿或出手，你可以準備進攻', 'Keep them bent over: they cannot pass or strike well, and you can set up attacks') }
    ] },
    shrimp: { hit: null, trail: 'hip', frames: [
      { d: 800, p: ab({ ox: 660, x: 210, y: 204, t: -86, fN: { x: 250, y: 211 }, fF: { x: 244, y: 211 }, kbN: 1, kbF: 1, su: 150, sl: 120, fu: 140, fl: 110 }), c: cap('仰躺，雙膝彎起，雙腳踩地，手肘貼身', 'Lie on your back, knees bent, feet flat, elbows in') },
      { d: 500, p: ab({ ox: 660, x: 212, y: 190, t: -104, h: 14, fN: { x: 250, y: 211 }, fF: { x: 244, y: 211 }, kbN: 1, kbF: 1, su: 150, sl: 120, fu: 140, fl: 110 }), c: cap('用腳推地，臀部抬起，轉到一側肩膀', 'Push off one foot, lift the hips and turn onto one shoulder') },
      { d: 500, p: ab({ ox: 660, x: 186, y: 200, t: -84, h: 16, fN: { x: 238, y: 210 }, fF: { x: 226, y: 206 }, kbN: 1, kbF: 1, su: 110, sl: 100, fu: 100, fl: 90, hit: 0 }), e: 'out', c: cap('把臀部往後推開，身體縮成側躺的蝦形', 'Drive your hips back, away from your feet, curling onto your side like a shrimp') },
      { d: 800, p: ab({ ox: 660, x: 186, y: 204, t: -86, fN: { x: 226, y: 211 }, fF: { x: 220, y: 211 }, kbN: 1, kbF: 1, su: 150, sl: 120, fu: 140, fl: 110 }), c: cap('回到仰躺，再做一次 —— 這樣就在地上製造了空間', 'Back flat and repeat — you have made space on the ground') }
    ] },
    upa: { hit: 'hip', trail: 'hip', frames: [
      { d: 900, p: ab(KNEEL, { ox: 206, x: 230, y: 204, t: -86, fN: { x: 262, y: 211 }, fF: { x: 256, y: 211 }, kbN: 1, kbF: 1, su: 160, sl: 130, fu: 150, fl: 120, oa1: 20, oa2: 10, ob1: 20, ob2: 10 }), c: cap('對方騎在你身上：手肘貼身，雙腳靠近臀部踩地', 'They are mounted on you: elbows in, feet flat near your hips') },
      { d: 600, p: ab(KNEEL, { ox: 206, x: 230, y: 204, t: -86, fN: { x: 262, y: 211 }, fF: { x: 256, y: 211 }, kbN: 1, kbF: 1, su: 140, sl: 160, fu: 150, fl: 120, oa1: 10, oa2: 0, ob1: 20, ob2: 10 }), c: cap('鎖住對方一隻手臂在胸前，同側的腳踩到對方腳外側', 'Trap one of their arms to your chest and step your foot outside their foot on the same side') },
      { d: 300, p: ab(KNEEL, { ox: 200, x: 232, y: 182, t: -62, fN: { x: 262, y: 211 }, fF: { x: 256, y: 211 }, kbN: 1, kbF: 1, su: 140, sl: 160, fu: 150, fl: 120, ot: 46, oa1: 10, oa2: 0, olift: 22, hit: 1 }), e: 'out', c: cap('用力挺腰：臀部往上、往你的肩膀方向推', 'Bridge hard: drive your hips up and over your shoulder') },
      { d: 400, p: ab({ ox: 186, x: 228, y: 186, t: -20, fN: { x: 262, y: 209 }, fF: { x: 252, y: 209 }, kbN: 1, kbF: 1, su: 120, sl: 100, fu: 120, fl: 100, ot: 72, ola: -40, olb: -60, ol: 40, olf: 60, oa1: 120, oa2: 120, ob1: 110, ob2: 110, olift: 18 }), c: cap('對方失去平衡，從你的肩膀方向翻過去', 'They lose their balance and roll over your shoulder') },
      { d: 900, p: ab(UP, { face: -1, ox: 150, x: 222, y: 170, t: 16, fN: { x: 190, y: 209 }, fF: { x: 184, y: 209 }, ftN: -90, ftF: -90, kbN: 1, kbF: 1, su: 40, sl: 60, fu: 30, fl: 50 }), c: cap('你翻到上面，跪在對方的雙腿之間 —— 先穩住姿勢', 'You end on top, kneeling between their legs — posture up first') }
    ] },
    hipbump: { hit: 'hip', trail: 'hip', frames: [
      { d: 800, p: ab(KNEEL, GUARD, { ot: 0, oa1: 40, oa2: 60 }), c: cap('對方在你的防守裡坐直', 'They sit up straight in your guard') },
      { d: 500, p: ab(KNEEL, { x: 230, y: 204, t: -36, fN: { x: 264, y: 211 }, fF: { x: 270, y: 206 }, ftN: 90, ftF: 60, kbN: 1, kbF: 1, su: 140, sl: 110, fu: -150, fl: -170, ot: 0, oa1: 40, oa2: 60 }), c: cap('打開雙腿坐起來，一手在身後撐地，另一手伸過對方肩膀', 'Open your legs and sit up, posting one hand behind you and reaching the other over their shoulder') },
      { d: 300, p: ab(KNEEL, { x: 246, y: 184, t: -8, fN: { x: 268, y: 211 }, fF: { x: 274, y: 206 }, ftN: 90, ftF: 60, kbN: 1, kbF: 1, su: 150, sl: 120, fu: -170, fl: -175, ox: 258, ot: -30, oh: -6, ola: 30, olb: -60, olf: -70, olift: 6, hit: 1 }), e: 'out', c: cap('抬起臀部，用臀部撞進對方胸口', 'Lift your hips and drive them into their chest') },
      { d: 350, p: ab(DOWN, { ox: 284, x: 250, y: 176, t: 20, fN: { x: 228, y: 209 }, fF: { x: 222, y: 209 }, ftN: -90, ftF: -90, kbN: 1, kbF: 1, su: 60, sl: 90, fu: 40, fl: 60, ot: -60, ola: 60, olb: 60, ol: -60, olf: -60, olift: 8 }), c: cap('對方往後倒，你跟著往前', 'They fall back and you come forward with them') },
      { d: 900, p: ab(DOWN, MOUNT, { ox: 250, x: 270, fN: { x: 236, y: 209 }, fF: { x: 232, y: 209 } }), c: cap('直接坐上騎乘位 —— 掃倒 2 分，騎乘再得 4 分', 'Land straight in the mount — 2 points for the sweep, then 4 for the mount') }
    ] },
    kneecut: { hit: 'kN', trail: 'kN', frames: [
      { d: 800, p: ab(DOWN, { ox: 236, x: 168, y: 152, t: 16, fN: { x: 196, y: 210 }, fF: { x: 132, y: 210 }, ftN: 90, ftF: -90, kbN: 1, kbF: 1, su: 70, sl: 60, fu: 60, fl: 50, ola: 120, olb: 70, ol: -100, olf: -60 }), c: cap('對方仰躺、雙腿抬起；你單膝跪在前方，控制衣領與褲管', 'They are on their back with legs up; you kneel in front, controlling the collar and trouser leg') },
      { d: 500, p: ab(DOWN, { ox: 236, x: 188, y: 160, t: 30, fN: { x: 222, y: 194 }, fF: { x: 140, y: 210 }, ftN: 60, ftF: -90, kbN: 1, kbF: 1, su: 70, sl: 50, fu: 60, fl: 40, ola: 90, olb: 60, ol: -70, olf: -40, hit: 1 }), e: 'out', c: cap('膝蓋斜切過對方的大腿，壓到地面', 'Slice your knee across their thigh to the mat') },
      { d: 500, p: ab(DOWN, { ox: 236, x: 206, y: 172, t: 56, fN: { x: 238, y: 206 }, fF: { x: 150, y: 210 }, ftN: 60, ftF: -90, kbN: 1, kbF: 1, su: 40, sl: 40, fu: 30, fl: 30, ola: 80, olb: 80, ol: -84, olf: -88 }), c: cap('胸口壓下，手臂繞過對方的頭', 'Drop your chest and put your arm round their head') },
      { d: 1000, p: ab(DOWN, SIDE), c: cap('抽出後腿，胸貼胸進入側壓 —— 過腿得 3 分', 'Free your back leg and settle chest to chest in side control — 3 points for the pass') }
    ] },
    mount: { hit: null, trail: 'kN', frames: [
      { d: 900, p: ab(DOWN, SIDE), c: cap('側壓：胸貼胸，臀部壓低', 'Side control: chest on chest, hips low') },
      { d: 600, p: ab(DOWN, { ox: 236, x: 232, y: 176, t: 56, fN: { x: 246, y: 194 }, fF: { x: 150, y: 209 }, ftN: 0, ftF: -90, kbN: 1, kbF: 1, su: 30, sl: 50, fu: 20, fl: 40 }), c: cap('膝蓋從對方肚子上滑過去，胸口繼續壓著', 'Slide your knee across their belly while your chest stays heavy') },
      { d: 600, p: ab(DOWN, MOUNT, { t: 30, su: 30, sl: 50, fu: 20, fl: 40 }), c: cap('跨過去，雙膝貼著對方身體兩側', 'Step over, knees tight to both sides of their body') },
      { d: 1000, p: ab(DOWN, MOUNT), c: cap('坐穩騎乘位，重心壓低 —— 4 分', 'Settle into the mount with your weight low — 4 points') }
    ] },
    armbar: { hit: 'elbow', trail: 'aN', frames: [
      { d: 800, p: ab(KNEEL, GUARD, { fN: { x: 276, y: 140 }, fF: { x: 270, y: 146 }, su: 150, sl: 150, fu: 140, fl: 160, ot: 34, oh: 10, oa1: 20, oa2: 10 }), c: cap('對方在你的防守裡彎腰，一隻手撐在你胸口', 'They are bent over in your guard with one hand on your chest') },
      { d: 600, p: ab(KNEEL, GUARD, { fN: { x: 214, y: 92 }, fF: { x: 262, y: 170 }, kbN: 1, su: 160, sl: 170, fu: 150, fl: 170, ot: 34, oh: 10, oa1: 20, oa2: 10 }), c: cap('雙手抱住那隻手臂，腳踩對方臀部轉身，另一腿抬過對方的頭', 'Hug that arm, put a foot on their hip to turn, and swing the other leg up over their head') },
      { d: 700, p: ab(KNEEL, { x: 232, y: 196, t: -84, fN: { x: 200, y: 124 }, fF: { x: 252, y: 140 }, ftN: 60, ftF: 60, kbN: 1, kbF: -1, su: 170, sl: 176, fu: 160, fl: 176, ot: 40, oh: 14, oa1: 6, oa2: 6, hit: 1 }), c: cap('雙腿壓下、夾膝，臀部微微抬起 —— 壓力在對方手肘', 'Legs down, knees squeezed, lift the hips a little — the pressure goes on their elbow') },
      { d: 800, p: ab(KNEEL, GUARD, { fN: { x: 276, y: 140 }, fF: { x: 270, y: 146 }, su: 150, sl: 150, fu: 140, fl: 160, ot: 34, oh: 10, oa1: 20, oa2: 10 }), c: cap('對方拍地認輸 —— 立刻放開', 'They tap — let go at once') }
    ] },
    rnc: { hit: 'neck', trail: 'hN', frames: [
      { d: 900, p: ab(SIT, { face: -1, ox: 176, x: 214, y: 200, t: 6, fN: { x: 276, y: 196 }, fF: { x: 270, y: 200 }, ftN: 60, ftF: 60, kbN: 1, kbF: 1, su: 60, sl: 90, fu: 50, fl: 80 }), c: cap('背後控制：胸貼對方背，雙腳腳跟勾在對方大腿內側', 'Back control: chest to their back, both heels hooked inside their thighs') },
      { d: 600, p: ab(SIT, { face: -1, ox: 176, x: 214, y: 200, t: 10, fN: { x: 276, y: 196 }, fF: { x: 270, y: 200 }, ftN: 60, ftF: 60, kbN: 1, kbF: 1, su: 100, sl: 128, fu: 50, fl: 80 }), c: cap('鎖頸的手臂從下巴下方穿過，手肘對準對方喉嚨正前方', 'Slide your choking arm under their chin, elbow in front of their throat') },
      { d: 700, p: ab(SIT, { face: -1, ox: 176, x: 214, y: 200, t: 14, fN: { x: 276, y: 196 }, fF: { x: 270, y: 200 }, ftN: 60, ftF: 60, kbN: 1, kbF: 1, su: 100, sl: 156, fu: 140, fl: 60, oh: 8, hit: 1 }), c: cap('手抓另一隻手的二頭肌，那隻手放到對方頭後，慢慢夾緊', 'Grab your other biceps, put that hand behind their head, and squeeze slowly') },
      { d: 800, p: ab(SIT, { face: -1, ox: 176, x: 214, y: 200, t: 6, fN: { x: 276, y: 196 }, fF: { x: 270, y: 200 }, ftN: 60, ftF: 60, kbN: 1, kbF: 1, su: 60, sl: 90, fu: 50, fl: 80 }), c: cap('對方拍地認輸 —— 立刻放開', 'They tap — let go at once') }
    ] }
  };

  // gi jacket and belt drawn over the stick figures; edge draws an outline (white gi)
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
        if (src.hit && c.pose.hit > 0.15) {
          var pt = src.hit === 'elbow' ? o.O.eN : src.hit === 'neck' ? S.mid(o.O.sh, o.O.head, 0.5) : J[src.hit];
          fr += KP.hit(pt, c.pose.hit);
          if (c.pose.hit > 0.6) hud += S.text(18, 30, KT.pick('接觸點：', 'CONTACT: ') + KT.t(s.contact), { size: 12, fill: C.red, family: "'JetBrains Mono','Noto Sans TC',monospace" });
        }
        return { back: back, front: fr, hud: hud };
      }
    };
  }

  var LIST = [
    { id: 'guard', n: 1, zh: '封閉式防守', py: 'Guarda fechada', en: 'Closed Guard',
      type: { zh: '防守位', en: 'Guard' }, contact: { zh: '雙腿夾腰', en: 'Legs round the waist' }, phase: { zh: '地面（下位）', en: 'Ground (bottom)' },
      tags: { zh: ['柔術的招牌位置', '在下面也能控制'], en: ['BJJ\'s signature position', 'Control from underneath'] },
      ability: { zh: '控制與姿勢破壞', en: 'Control and breaking posture' },
      note: { zh: '腳踝交叉 · 抓領抓袖 · 拉低對方', en: 'ANKLES CROSSED · COLLAR AND SLEEVE · PULL THEM DOWN' },
      how: { zh: '仰躺，雙腿夾住跪在你雙腿之間的對方的腰，腳踝在對方背後交叉鎖住。一手抓對方衣領，一手抓袖子。用雙腿把對方拉向你、雙手往下拉，讓對方彎腰。對方姿勢被破壞時，很難過你的腿，也很難出拳，你則可以準備掃倒或降伏。',
        en: 'Lie on your back with your legs round the waist of a partner kneeling between them, ankles crossed and locked behind their back. Grip their collar with one hand and their sleeve with the other. Pull with your legs and arms so they bend forward. With their posture broken they struggle to pass your legs or strike, while you set up sweeps and submissions.' },
      mistakes: { zh: '雙腿夾得太鬆（對方坐直）；只用手拉不用腿；平躺不動等對方進攻；腳踝交叉後把腿伸直（容易被打開）。', en: 'Legs too loose, so they sit up tall; pulling with the arms but not the legs; lying flat and waiting; straightening the legs after crossing the ankles (easy to open).' },
      practice: { zh: '夥伴在你的防守裡嘗試坐直 1 分鐘，你用腿和手不斷把對方拉低，輪流 3 回合。', en: 'Your partner tries to sit up straight in your guard for 1 minute while you keep pulling them down with legs and arms — 3 rounds each.' },
      use: { zh: '柔術讓體型較小的人在背部著地時仍能安全地控制對方，封閉式防守是最基本的例子。', en: 'BJJ lets a smaller person stay safe and in control even when on their back; the closed guard is the clearest example.' },
      bars: [['控制', 'Control', 90], ['腿力', 'Leg strength', 85], ['抓握', 'Gripping', 85], ['耐心', 'Patience', 80]] },

    { id: 'shrimp', n: 2, zh: '蝦式逃脫', py: 'Fuga de quadril', en: 'Hip Escape (Shrimp)',
      type: { zh: '基本動作', en: 'Movement' }, contact: { zh: '腳推地', en: 'Foot pushes the mat' }, phase: { zh: '地面（下位）', en: 'Ground (bottom)' },
      tags: { zh: ['柔術最重要的動作之一', '在地上製造空間'], en: ['One of BJJ\'s most important movements', 'Makes space on the ground'] },
      ability: { zh: '髖部活動與核心', en: 'Hip mobility and core' },
      note: { zh: '踩地 · 轉側 · 臀部往後推', en: 'FOOT DOWN · TURN TO THE SIDE · HIPS BACK' },
      how: { zh: '仰躺，雙膝彎起、雙腳踩地。用一腳推地，把臀部抬起並轉到一側的肩膀，然後把臀部往後推開（往頭的方向），身體縮成側躺的「蝦」形。回到仰躺再做一次。被壓在下面時，這個動作讓你在身體和對方之間製造空間，把腿放回來重建防守。',
        en: 'Lie on your back with your knees bent and feet flat. Push off one foot to lift your hips and turn onto one shoulder, then drive your hips back — away from your feet — curling onto your side like a shrimp. Return flat and repeat. When you are pinned, this movement makes space between you and your partner so you can bring your legs back in front and rebuild your guard.' },
      mistakes: { zh: '只扭動上身，臀部沒有移動；沒轉到側面就推；雙手沒有保護身前；推完忘了把腿收回來。', en: 'Wriggling the upper body while the hips stay put; pushing before turning onto your side; leaving the arms away from the body; forgetting to bring the legs back in after the move.' },
      practice: { zh: '沿著墊子的長邊，連續做蝦式移動來回 4 趟，作為每次練習的熱身。', en: 'Shrimp up and down the length of the mat 4 times as part of every warm-up.' },
      use: { zh: '幾乎所有地面逃脫都用到蝦式：從側壓、騎乘位逃脫，或在對方過腿時把腿放回來。', en: 'Almost every escape uses it: getting out of side control or the mount, or recovering your guard when they start to pass.' },
      bars: [['髖部活動', 'Hip mobility', 92], ['核心', 'Core', 85], ['協調', 'Coordination', 82], ['耐力', 'Endurance', 75]] },

    { id: 'upa', n: 3, zh: '挺腰翻身逃脫', py: 'Upa', en: 'Bridge and Roll Escape',
      type: { zh: '逃脫', en: 'Escape' }, contact: { zh: '臀部往上挺', en: 'Hips drive up' }, phase: { zh: '地面（下位）', en: 'Ground (bottom)' },
      tags: { zh: ['被騎乘時的第一個逃脫', '鎖手、鎖腳、挺腰'], en: ['The first escape from mount', 'Trap the arm, trap the foot, bridge'] },
      ability: { zh: '爆發力與時機', en: 'Explosiveness and timing' },
      note: { zh: '鎖手臂 · 腳踩外側 · 挺腰翻身', en: 'TRAP THE ARM · FOOT OUTSIDE · BRIDGE AND ROLL' },
      how: { zh: '對方騎在你身上時，手肘貼身保護自己，雙腳靠近臀部踩地。把對方一隻手臂鎖在胸前，同側的腳踩到對方腳外側，讓對方那一邊沒有支撐。然後用力挺腰，把臀部往上、往被鎖的那一側肩膀方向推，對方會翻過去，你翻到上面，跪在對方雙腿之間。',
        en: 'With them mounted on you, keep your elbows in and your feet flat near your hips. Trap one of their arms to your chest and step your foot outside their foot on the same side, so that side has no post. Then bridge hard, driving your hips up and towards the trapped side\'s shoulder. They roll over and you come up on top, kneeling between their legs.' },
      mistakes: { zh: '沒鎖手臂就挺腰（對方用手撐住）；腳沒踩到外側；往正上方挺而不是往肩膀方向；雙手推對方胸口（容易被鎖手臂）。', en: 'Bridging without trapping the arm (they post their hand); not trapping the foot; bridging straight up instead of over the shoulder; pushing their chest with straight arms (gives them an armbar).' },
      practice: { zh: '夥伴騎在你身上，慢速練「鎖手 + 鎖腳 + 挺腰」左右各 10 次，夥伴配合翻過去。', en: 'With your partner in mount, drill trap the arm, trap the foot and bridge slowly 10 times to each side, with your partner rolling over cooperatively.' },
      use: { zh: '騎乘位是最危險的下位之一；挺腰翻身讓你一次就從最差的位置回到上面。', en: 'The mount is one of the worst places to be; the bridge and roll takes you from bottom to top in one move.' },
      bars: [['爆發力', 'Explosiveness', 90], ['時機', 'Timing', 88], ['核心', 'Core', 85], ['控制', 'Control', 78]] },

    { id: 'hipbump', n: 4, zh: '撞臀掃倒', py: 'Raspagem de quadril', en: 'Hip Bump Sweep',
      type: { zh: '掃倒', en: 'Sweep' }, contact: { zh: '臀部撞胸口', en: 'Hips into their chest' }, phase: { zh: '下位 → 上位', en: 'Bottom → top' },
      tags: { zh: ['掃倒得 2 分', '對方坐直時最有效'], en: ['A sweep scores 2 points', 'Best when they sit up straight'] },
      ability: { zh: '爆發力與時機', en: 'Explosiveness and timing' },
      note: { zh: '對方坐直 · 坐起撐手 · 臀部撞進去', en: 'THEY SIT UP · SIT UP AND POST · HIPS IN' },
      how: { zh: '對方在你的封閉式防守裡坐直時，打開雙腿坐起來，一手在身後撐地，另一手伸過對方的肩膀。然後抬起臀部，用臀部撞進對方的胸口，對方會往後倒。你跟著往前，直接坐上騎乘位。比賽中掃倒得 2 分。',
        en: 'When they sit up straight in your closed guard, open your legs and sit up, posting one hand behind you and reaching the other over their shoulder. Then lift your hips and drive them into their chest so they fall backwards. Come forward with them and land straight in the mount. In competition a sweep scores 2 points.' },
      mistakes: { zh: '等對方彎腰才做（要在對方坐直時做）；沒有撐手，臀部抬不起來；手臂沒伸過肩膀；撞完沒跟上去。', en: 'Trying it when they are bent over (it works when they sit up); no posted hand, so the hips cannot lift; not reaching over the shoulder; bumping and then not following them.' },
      practice: { zh: '夥伴在你的防守裡坐直，慢速練習左右各 10 次，夥伴配合往後倒。', en: 'With your partner sitting up in your guard, drill it slowly 10 times each side while your partner falls back cooperatively.' },
      use: { zh: '對方為了不被拉低而坐直時，正好給你撞臀掃倒的機會；它也常接到斷頭台勒頸或木村鎖。', en: 'When they sit up to avoid being pulled down, they give you the hip bump; it also links to the guillotine and the kimura.' },
      bars: [['爆發力', 'Explosiveness', 90], ['時機', 'Timing', 88], ['核心', 'Core', 82], ['連接', 'Linking', 80]] },

    { id: 'kneecut', n: 5, zh: '膝切過腿', py: 'Passagem de joelho', en: 'Knee Cut Guard Pass',
      type: { zh: '過腿', en: 'Guard pass' }, contact: { zh: '膝蓋切過大腿', en: 'Knee across the thigh' }, phase: { zh: '地面（上位）', en: 'Ground (top)' },
      tags: { zh: ['過腿得 3 分', '膝切、壓胸、側壓'], en: ['A guard pass scores 3 points', 'Cut, chest down, side control'] },
      ability: { zh: '壓力與平衡', en: 'Pressure and balance' },
      note: { zh: '控制領與褲 · 膝切大腿 · 胸壓下', en: 'CONTROL COLLAR AND LEG · KNEE CUTS THE THIGH · CHEST DOWN' },
      how: { zh: '對方仰躺、雙腿抬起時，你單膝跪在前方，一手抓衣領，一手控制褲管。把前膝斜切過對方的大腿，壓到地面，胸口跟著壓下，手臂繞過對方的頭。最後抽出後腿，胸貼胸進入側壓。比賽中過腿得 3 分。',
        en: 'With them on their back and legs up, kneel in front of them and control their collar and trouser leg. Slice your front knee across their thigh to the mat, drop your chest and put your arm round their head. Then free your back leg and settle chest to chest in side control. In competition a guard pass scores 3 points.' },
      mistakes: { zh: '上身挺直不壓（對方把腿放回來）；膝蓋切得不夠遠；後腿被對方勾住；過完不壓低就馬上站起來。', en: 'Staying upright with no pressure (they bring the legs back); not cutting the knee far enough; leaving the back leg for them to hook; standing up instead of settling low after the pass.' },
      practice: { zh: '夥伴仰躺做蝴蝶防守，你慢速練膝切過腿左右各 8 次，夥伴只輕微抵抗。', en: 'Your partner lies on their back with feet on your hips; drill the knee cut slowly 8 times each side with light resistance.' },
      use: { zh: '在上面時，過腿把對方從防守帶到側壓，是得分和進攻的起點。', en: 'From the top, passing the guard takes you from their legs to side control — where scoring and attacks begin.' },
      bars: [['壓力', 'Pressure', 90], ['平衡', 'Balance', 86], ['控制', 'Control', 85], ['時機', 'Timing', 78]] },

    { id: 'mount', n: 6, zh: '側壓轉騎乘', py: 'Montada', en: 'Side Control to Mount',
      type: { zh: '位置轉換', en: 'Transition' }, contact: { zh: '膝蓋滑過肚子', en: 'Knee across the belly' }, phase: { zh: '地面（上位）', en: 'Ground (top)' },
      tags: { zh: ['騎乘位得 4 分', '胸口一直壓著'], en: ['The mount scores 4 points', 'Keep the chest heavy'] },
      ability: { zh: '控制與重量', en: 'Control and weight' },
      note: { zh: '胸壓胸 · 膝蓋滑過 · 雙膝貼身', en: 'CHEST ON CHEST · KNEE SLIDES OVER · KNEES TIGHT' },
      how: { zh: '在側壓中，胸口壓著對方、臀部壓低。把靠近對方腿部的膝蓋從對方肚子上滑過去，胸口繼續壓著，不給對方空間。跨過去之後坐起來，雙膝貼著對方身體兩側，重心壓低。比賽中騎乘位得 4 分。',
        en: 'In side control keep your chest on theirs and your hips low. Slide the knee nearest their legs across their belly while your chest stays heavy so they get no space. Once you are over, sit up with your knees tight to both sides of their body and your weight low. In competition the mount scores 4 points.' },
      mistakes: { zh: '轉換時胸口抬起（對方趁機逃脫）；膝蓋被對方的腿擋住；騎上去後坐得太高（容易被翻）；雙膝張太開。', en: 'Lifting the chest during the move (they escape into the space); getting the knee blocked by their leg; sitting too high once mounted (easy to roll); knees too wide.' },
      practice: { zh: '夥伴輕微抵抗，你從側壓轉騎乘、再回側壓，連續 10 次。', en: 'With light resistance, go from side control to mount and back again, 10 times in a row.' },
      use: { zh: '騎乘位是柔術最有優勢的位置之一，可以接到手臂鎖或讓對方翻身後拿背。', en: 'The mount is one of BJJ\'s most dominant positions, leading to armbars or to taking the back when they turn.' },
      bars: [['控制', 'Control', 92], ['重量壓力', 'Weight pressure', 88], ['平衡', 'Balance', 85], ['耐心', 'Patience', 78]] },

    { id: 'armbar', n: 7, zh: '防守位手臂鎖', py: 'Armlock da guarda', en: 'Armbar from Guard',
      type: { zh: '降伏', en: 'Submission' }, contact: { zh: '壓力在對方手肘', en: 'Pressure on their elbow' }, phase: { zh: '地面（下位）', en: 'Ground (bottom)' },
      tags: { zh: ['柔術最經典的降伏之一', '慢慢施壓，對方拍地即放'], en: ['One of BJJ\'s classic submissions', 'Apply slowly; release on the tap'] },
      ability: { zh: '控制與安全意識', en: 'Control and safety' },
      note: { zh: '抱手臂 · 轉身 · 腿過頭 · 夾膝抬臀', en: 'HUG THE ARM · TURN · LEG OVER THE HEAD · KNEES IN, HIPS UP' },
      how: { zh: '對方在你的防守裡彎腰、一隻手撐在你胸口時，雙手抱住那隻手臂。一腳踩在對方臀部上幫助轉身，另一腿抬起越過對方的頭。雙腿壓下、雙膝夾緊，對方拇指朝上，然後臀部微微抬起，壓力就落在對方手肘。對方一拍地，馬上放開。',
        en: 'When they are bent over in your guard with one hand on your chest, hug that arm with both hands. Put one foot on their hip to help you turn and swing the other leg up and over their head. Bring both legs down, squeeze your knees together with their thumb pointing up, then lift your hips a little — the pressure goes onto their elbow. The moment they tap, let go.' },
      mistakes: { zh: '猛然用力（會造成受傷）；沒轉身，臀部離對方肩膀太遠；腿沒壓住對方的頭（對方站起來）；對方拍地後還不放。', en: 'Jerking it on fast (causes injuries); not turning, so the hips stay far from their shoulder; not holding the head down with the leg (they stand up); not letting go after the tap.' },
      practice: { zh: '在教練指導下，夥伴之間只做「位置 + 極輕施壓」左右各 5 次，雙方都練習拍地。', en: 'Under a coach, practise the position with very light pressure, 5 times to each side, and both partners practise tapping.' },
      use: { zh: '讓對方認輸直接獲勝，不論比分是多少。', en: 'A submission wins the match outright, whatever the score.' },
      bars: [['控制', 'Control', 90], ['安全意識', 'Safety', 96], ['髖部活動', 'Hip mobility', 85], ['時機', 'Timing', 80]] },

    { id: 'rnc', n: 8, zh: '裸絞', py: 'Mata-leão', en: 'Rear Naked Choke',
      type: { zh: '降伏', en: 'Submission' }, contact: { zh: '手臂繞過頸部兩側', en: 'Arm round both sides of the neck' }, phase: { zh: '地面（背後）', en: 'Ground (back)' },
      tags: { zh: ['背後控制得 4 分', '慢慢夾緊，對方拍地即放'], en: ['Back control scores 4 points', 'Squeeze slowly; release on the tap'] },
      ability: { zh: '控制與安全意識', en: 'Control and safety' },
      note: { zh: '勾腳 · 手臂穿下巴 · 抓二頭肌 · 慢慢夾', en: 'HOOKS IN · ARM UNDER CHIN · GRAB BICEPS · SQUEEZE' },
      how: { zh: '在背後控制中，胸口貼著對方的背，雙腳腳跟勾在對方大腿內側。鎖頸的手臂從對方下巴下方穿過，手肘對準喉嚨正前方，手掌抓住另一隻手的二頭肌，另一隻手放在對方頭後。慢慢把雙肘夾緊，壓力在頸部兩側。對方一拍地或說「停」，馬上放開。',
        en: 'In back control keep your chest on their back with both heels hooked inside their thighs. Slide your choking arm under their chin so your elbow is in front of their throat, grab your other biceps with that hand, and put the other hand behind their head. Squeeze your elbows together slowly — the pressure goes on both sides of the neck. The moment they tap or say stop, let go.' },
      mistakes: { zh: '猛然用力（危險）；手臂壓在下巴上而不是頸部；雙腳交叉在對方肚子前（容易被鎖腳）；對方拍地後還不放。', en: 'Cranking it on fast (dangerous); the arm across the jaw instead of the neck; crossing your feet in front of their belly (they can lock your ankles); not letting go after the tap.' },
      practice: { zh: '只在合格教練指導下練習：夥伴之間練「勾腳 + 手臂位置」各 5 次，只輕輕接觸，不施壓。', en: 'Only with a qualified coach: practise the hooks and arm position 5 times each with light contact and no squeeze.' },
      use: { zh: '背後控制是柔術最有優勢的位置之一，裸絞是從那裡最常用的降伏。', en: 'Back control is one of the most dominant positions in BJJ, and the rear naked choke is its most common finish.' },
      bars: [['控制', 'Control', 92], ['安全意識', 'Safety', 96], ['抓握', 'Gripping', 82], ['耐心', 'Patience', 80]] }
  ];

  w.BJJ = { LIST: LIST, makeClip: makeClip };
})(window);
