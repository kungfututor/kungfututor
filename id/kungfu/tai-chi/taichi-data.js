/* Tai Chi 24-form (Simplified Yang style, 簡化太極拳) — all 24 postures.
 * Poses are simplified 2D illustrations of each posture's key shape.
 * Text is our own wording. Left/right versions use the mirror button.
 */
(function (w) {
  'use strict';
  var S = w.KTFigure.S, C = S.col;
  function m() { var o = {}; for (var i = 0; i < arguments.length; i++) for (var k in arguments[i]) o[k] = arguments[i][k]; return o; }
  function t2(zh, en) { return { zh: zh, en: en }; }

  /* ---------- legs (side view, facing +x) ---------- */
  var LEG = {
    stand: { fN: { x: 3, y: 84 }, fF: { x: -3, y: 84 }, ftN: 90, ftF: 90 },
    bow:   { fN: { x: 34, y: 72 }, fF: { x: -46, y: 72 }, ftN: 90, ftF: 90 },
    sit:   { fN: { x: 44, y: 70 }, fF: { x: -36, y: 70 }, ftN: 90, ftF: 90 },
    toe:   { fN: { x: 26, y: 70 }, fF: { x: -4, y: 76 }, ftN: 40, ftF: 90 },     // empty stance, toes touching
    heel:  { fN: { x: 32, y: 76 }, fF: { x: -4, y: 76 }, ftN: 150, ftF: 90 },    // empty stance, heel touching
    back:  { fN: { x: 30, y: 74 }, fF: { x: -30, y: 74 }, ftN: 90, ftF: 90 },    // stepping back
    knee:  { fF: { x: 2, y: 84 }, ftF: 90, fN: { x: 38, y: 42 }, ftN: 60 },           // standing on one leg
    kick:  { fF: { x: 2, y: 86 }, ftF: 90, fN: { x: 86, y: 15 }, ftN: 165 },          // heel kick
    drop:  { fF: { x: -4, y: 42 }, fN: { x: 82, y: 42 }, ftN: 90, ftF: 90 }     // lower body (drop stance)
  };
  /* ---------- arms ---------- */
  var ARM = {
    down:   { su: 6, sl: 8, fu: -4, fl: 2 },
    raise:  { su: 88, sl: 88, fu: 86, fl: 86 },
    press:  { su: 25, sl: 70, fu: 22, fl: 68 },
    horse:  { su: 95, sl: 120, fu: -12, fl: 25 },                    // front hand up to eye level on a rounded arm
    hold:   { su: 40, sl: 110, fu: 10, fl: 70, hz: 0.25 },           // "holding a ball": one hand above the other
    crane:  { su: 80, sl: 200, hzN: 1.7, fu: 8, fl: 40 },            // upper hand in front of and beside the forehead (not overhead, not touching), elbow sunk
    brush:  { su: 75, sl: 82, fu: -8, fl: 25 },
    lute:   { su: 90, sl: 120, fu: 21, fl: 130, hz: 0.35 },          // front hand at nose height, rear hand by the inside of the front elbow
    monkey: { su: 72, sl: 82, fu: -15, fl: 55 },
    wardoff:{ su: 55, sl: 100, fu: 20, fl: 80 },
    rollback:{ su: 25, sl: 55, fu: 10, fl: 40 },
    ji:     { su: 62, sl: 95, fu: 60, fl: 100, hz: 0 },             // one hand on the other wrist
    an:     { su: 70, sl: 82, fu: 68, fl: 80 },
    // single whip: front palm pushed out on a sunk elbow; the hook hand out behind and to the side (about 45° — drawn shorter),
    // so the two arms never make one straight line
    whip:   { su: 62, sl: 100, fu: -80, fl: -95, luF: 0.7, laF: 0.7, hzF: 4.5 },
    highpat:{ su: 92, sl: 100, fu: 12, fl: 85 },
    spread: { su: 95, sl: 95, fu: -95, fl: -95 },
    cross:  { su: 60, sl: 110, fu: 58, fl: 106, hz: -0.5 },         // wrists crossed in front of the chest
    ears:   { su: 80, sl: 135, fu: 78, fl: 132, hz: 1 },             // fists at head height on rounded arms, a head-width apart
    lower:  { su: 60, sl: 72, fu: -100, fl: -100 },
    rooster:{ su: 70, sl: 160, fu: 4, fl: 30 },
    shuttle:{ su: 95, sl: 205, fu: 74, fl: 82 },                     // upper forearm shields just above the forehead
    needle: { su: 32, sl: 25, fu: -35, fl: -10 },
    fan:    { su: 110, sl: 200, luN: 0.6, laN: 0.9, fu: 80, fl: 84 },   // upper hand braced above the temple, elbow out to the side
    punch:  { su: 86, sl: 88, fu: 35, fl: 138, hz: 0.35 },
    close:  { su: 30, sl: 120, fu: 28, fl: 118, hz: 0.7 },
    fist:   { su: -20, sl: 85, fu: 30, fl: 100 }
  };
  // (hz / fz: how far apart the hands / the feet are for the 3D view; lu* / la*: an arm drawn shorter points out to the side)
  function P(leg, arm, extra) { return m({ t: 0, h: 0, hz: 1, hzN: 1, hzF: 1, fz: 1, luN: 1, laN: 1, luF: 1, laF: 1 }, LEG[leg], ARM[arm], extra || {}); }
  var X0 = 185;                    // where the hips start (the clip's base x): a pose may move them with its own x

  // Coming up out of the drop stance (postures 16 and 17): the hips travel forward on to the stretched (near) leg while both
  // feet stay where they are, then the body rises on that leg and the other (far) knee lifts, its hand above it.
  // (the back foot is already on its toes here — the heel has peeled off as the weight went forward; its toes stay on their spot)
  var RISE = m(P('bow', 'lower'), { x: X0 + 66, t: 10, fN: { x: 16, y: 52 }, fF: { x: -66, y: 46 }, ftN: 90, ftF: 45, su: 70, sl: 90, fu: -60, fl: -70 });
  function STANDAT(dx) { return m(P('stand', 'down'), { x: X0 + dx }); }   // standing, feet together, dx further on
  var ROOSTER = m(P('knee', 'rooster'), { x: X0 + 80, fN: { x: 2, y: 84 }, ftN: 90, fF: { x: 38, y: 42 }, ftF: 60, su: 4, sl: 30, fu: 70, fl: 160 });

  /* front view (cloud hands) */
  var FR = { hw: 9, sw: 16 };
  var CLOUD_A = m(FR, { fN: { x: 12, y: 80 }, fF: { x: -30, y: 84 }, kbN: 1, kbF: -1, ftN: 90, ftF: -90, su: 30, sl: 205, luN: 0.4, laN: 0.9, fu: 20, fl: 45, luF: 0.7, laF: 0.8 });
  var CLOUD_B = m(FR, { fN: { x: 30, y: 84 }, fF: { x: -12, y: 80 }, kbN: 1, kbF: -1, ftN: 90, ftF: -90, su: -20, sl: -45, luN: 0.7, laN: 0.8, fu: -30, fl: -205, luF: 0.4, laF: 0.9 });

  /* bars by stance type */
  var BARS = {
    bow:    [['重心轉移', 'Weight shifting', 88], ['下肢肌力', 'Leg strength', 78], ['身體協調', 'Coordination', 85], ['放鬆呼吸', 'Relaxed breathing', 80]],
    empty:  [['單腳平衡', 'One-leg balance', 85], ['虛實分明', 'Full vs empty weight', 88], ['下肢肌力', 'Leg strength', 75], ['放鬆呼吸', 'Relaxed breathing', 80]],
    single: [['單腳平衡', 'One-leg balance', 95], ['下肢肌力', 'Leg strength', 82], ['核心穩定', 'Core stability', 85], ['專注', 'Focus', 85]],
    drop:   [['髖部柔軟度', 'Hip flexibility', 92], ['下肢肌力', 'Leg strength', 88], ['平衡', 'Balance', 85], ['專注', 'Focus', 80]],
    stand:  [['放鬆', 'Relaxation', 92], ['呼吸配合', 'Breath coordination', 90], ['姿勢正直', 'Upright posture', 85], ['專注', 'Focus', 80]],
    side:   [['重心左右轉移', 'Side-to-side shifting', 90], ['腰部轉動', 'Waist turning', 88], ['身體協調', 'Coordination', 88], ['放鬆呼吸', 'Relaxed breathing', 80]],
    back:   [['後退平衡', 'Backward balance', 88], ['腰部轉動', 'Waist turning', 82], ['身體協調', 'Coordination', 85], ['放鬆呼吸', 'Relaxed breathing', 80]]
  };

  /* ---------- the 24 postures ----------
   * f: frames [pose, caption, breath] — the last pose is held, then the clip returns to the first.
   */
  var L = [
    { n: 1, g: 1, zh: '起勢', py: 'Qǐ Shì', en: 'Commencing Form', type: 'stand',
      f: [[P('stand', 'down', { fN: { x: 3, y: 87 }, fF: { x: -3, y: 87 }, fz: 1.8 }), t2('兩腳開立與肩同寬，兩臂自然下垂', 'Feet shoulder-width apart, arms hanging naturally'), 'in'],
          [P('stand', 'raise', { fN: { x: 3, y: 87 }, fF: { x: -3, y: 87 }, fz: 1.8 }), t2('兩臂慢慢向前平舉至肩高', 'Slowly raise both arms forward to shoulder height'), 'in'],
          [P('stand', 'press', { fN: { x: 3, y: 79 }, fF: { x: -3, y: 79 }, fz: 1.8 }), t2('屈膝下蹲，兩掌輕輕下按至腹前', 'Bend the knees and gently press the palms down in front of the belly'), 'out']],
      key: t2('沉肩垂肘，屈膝時膝不超過腳尖', 'Shoulders and elbows sink; knees stay behind the toes'),
      mis: t2('聳肩、手臂舉太高；下蹲時翹臀或膝蓋內扣。', 'Shrugging or raising the arms too high; sticking the hips out or caving the knees as you sink.'),
      img: t2('全套的開始：讓身心安靜、呼吸自然。', 'The opening: settle the mind and let the breath become natural.') },

    { n: 2, g: 1, zh: '左右野馬分鬃', py: 'Yě Mǎ Fēn Zōng', en: 'Part the Wild Horse\'s Mane', type: 'bow',
      f: [[P('toe', 'hold'), t2('兩手在胸前如抱球，重心在後腿', 'Hands "hold a ball" in front of the chest, weight on the back leg'), 'in'],
          [P('bow', 'horse'), t2('上步成弓步，前手向前上方分出至眼高，後手按於胯旁', 'Step into a bow stance; the front hand parts up to eye level, the rear hand presses beside the hip'), 'out']],
      key: t2('分手與弓腿同時完成，上身正直', 'Parting hands and bowing the leg finish together; body upright'),
      mis: t2('兩腳踩在同一直線上而站不穩；身體前傾；手比腳先到。', 'Feet on one line so you wobble; leaning forward; hands arriving before the legs.'),
      img: t2('兩手分開，像撥開奔馬的鬃毛，左右式共做三次。', 'The hands part like combing a galloping horse\'s mane; done three times, left and right.') },

    { n: 3, g: 1, zh: '白鶴亮翅', py: 'Bái Hè Liàng Chì', en: 'White Crane Spreads Its Wings', type: 'empty',
      f: [[P('stand', 'hold'), t2('跟步半步，兩手抱球', 'Follow-step half a step, hands holding the ball'), 'in'],
          [P('toe', 'crane'), t2('後坐成虛步，上手提至額前，下手按於胯旁', 'Sit back into an empty stance; the upper hand rises beside the forehead, the lower hand presses by the hip'), 'out']],
      key: t2('前腳腳尖點地，重心全在後腿', 'Front toes just touch; all the weight sits on the back leg'),
      mis: t2('前腳承重；上手舉得太高、聳肩；挺胸。', 'Putting weight on the front foot; lifting the top hand too high and shrugging; puffing the chest.'),
      img: t2('像白鶴展開雙翼：一手向上、一手向下。', 'Like a white crane opening its wings — one hand up, one hand down.') },

    { n: 4, g: 2, zh: '左右摟膝拗步', py: 'Lǒu Xī Ào Bù', en: 'Brush Knee and Push', type: 'bow',
      f: [[P('toe', 'hold', { su: 100, sl: 250 }), t2('轉腰，一手經耳旁屈收，另一手落於胸前', 'Turn the waist; one hand circles back by the ear, the other comes in front of the chest'), 'in'],
          [P('bow', 'brush'), t2('上步弓腿，下手摟過膝前按於胯旁，上手向前推出', 'Step and bow; the lower hand brushes past the knee to the hip as the upper hand pushes forward'), 'out']],
      key: t2('推掌、弓腿、鬆腰同時到位', 'Push, bow and waist settle at the same moment'),
      mis: t2('推掌時聳肩、身體前衝；摟手離膝太遠。', 'Shrugging and lunging as you push; brushing too far from the knee.'),
      img: t2('一手「摟」過膝蓋、一手前推，左右共三次。', 'One hand brushes the knee while the other pushes; three times, left and right.') },

    { n: 5, g: 2, zh: '手揮琵琶', py: 'Shǒu Huī Pí Pá', en: 'Play the Lute (Pipa)', type: 'empty',
      f: [[P('bow', 'brush'), t2('後腳跟進半步，重心後移', 'Bring the back foot in half a step and shift the weight back'), 'in'],
          [P('heel', 'lute'), t2('前腳跟著地成虛步，兩手合抱如抱琵琶', 'Front heel touches down in an empty stance; the hands close as if holding a lute'), 'out']],
      key: t2('前手與鼻同高，後手在前手肘內側', 'Front hand at nose height, rear hand near the inside of the front elbow'),
      mis: t2('前腳承重；兩手距離太遠或太僵。', 'Weighting the front foot; hands too far apart or stiff.'),
      img: t2('姿勢像懷抱琵琶（中國樂器）準備彈奏。', 'The shape of someone holding a pipa (Chinese lute), ready to play.') },

    { n: 6, g: 2, zh: '左右倒捲肱', py: 'Dào Juǎn Gōng', en: 'Repulse the Monkey', type: 'back',
      // The front foot is the far one and it steps back; the near foot never moves (its x + the hips' x stays the same).
      f: [[m(P('back', 'monkey'), { x: X0, fN: { x: -4, y: 76 }, fF: { x: 30, y: 76 }, ftN: 90, ftF: 150, su: -60, sl: 150, fu: 72, fl: 82 }),
           t2('轉腰，後手經耳旁屈肘', 'Turn the waist; the rear hand curls up past the ear'), 'in'],
          [m(P('back', 'monkey'), { x: X0 - 2, fN: { x: -2, y: 76 }, fF: { x: 8, y: 62 }, ftN: 90, ftF: 60, su: -45, sl: 152, fu: 60, fl: 85 }), null, 'in', 700],        // the front foot lifts
          [m(P('back', 'monkey'), { x: X0 - 6, fN: { x: 2, y: 76 }, fF: { x: -42, y: 72 }, ftN: 90, ftF: 60, su: 15, sl: 158, fu: 30, fl: 75 }), null, 'out', 800],      // …and touches down behind, ball first, weight still in front
          [m(P('back', 'monkey'), { x: X0 - 40, fN: { x: 36, y: 76 }, fF: { x: -8, y: 76 }, ftN: 90, ftF: 90 }),
           t2('退步，屈肘之手向前推出，前手收回腰旁', 'Step back; the curled hand pushes forward as the front hand draws back to the waist'), 'out']],
      key: t2('退步時腳尖先著地，再慢慢踏實', 'When stepping back, the toes land first, then the foot settles'),
      mis: t2('退步太大失去平衡；兩腳踩成一直線；身體後仰。', 'Stepping back too far; feet on one line; leaning back.'),
      img: t2('一邊後退、一邊推開，像擋開調皮的猴子，左右共四次。', 'Retreating while pushing away, as if fending off a playful monkey; four times, left and right.') },

    { n: 7, g: 3, zh: '左攬雀尾', py: 'Zuǒ Lǎn Què Wěi', en: 'Grasp the Bird\'s Tail — Left', type: 'bow',
      f: [[P('bow', 'wardoff'), t2('掤：弓步，前臂橫於胸前向前掤出', 'Ward off (peng): bow stance, forearm rounded across the chest'), 'out'],
          [P('sit', 'rollback'), t2('捋：重心後坐，兩手向後下方捋回', 'Roll back (lu): sit back as both hands draw down and back'), 'in'],
          [P('bow', 'ji'), t2('擠：兩手相搭向前擠出', 'Press (ji): one hand on the other wrist, press forward'), 'out'],
          [P('bow', 'an'), t2('按：後坐收掌，再向前按出', 'Push (an): sit back, draw the palms in, then push forward'), 'out']],
      key: t2('掤、捋、擠、按四個動作連貫不斷', 'Ward off, roll back, press and push flow without a break'),
      mis: t2('後坐時翹臀、低頭；前推時身體前衝。', 'Sticking the hips out or dropping the head when sitting back; lunging on the push.'),
      img: t2('像輕輕握住小鳥的尾巴，包含太極拳四個基本勁：掤捋擠按。', 'Like gently holding a bird by its tail; it contains Tai Chi\'s four basic energies: peng, lu, ji, an.') },

    { n: 8, g: 3, zh: '右攬雀尾', py: 'Yòu Lǎn Què Wěi', en: 'Grasp the Bird\'s Tail — Right', type: 'bow',
      f: [[P('stand', 'hold', { su: 10, sl: 70, fu: 40, fl: 110 }),   // left hand on top before a RIGHT ward-off
           t2('轉身扣腳，兩手抱球', 'Turn the body, turn the foot in, hands hold the ball'), 'in'],
          [P('bow', 'wardoff'), t2('掤', 'Ward off'), 'out'],
          [P('sit', 'rollback'), t2('捋', 'Roll back'), 'in'],
          [P('bow', 'an'), t2('擠、按', 'Press, then push'), 'out']],
      key: t2('與左攬雀尾相同，方向相反（請按「左右」切換）', 'Same as the left side, mirrored (use the left/right button)'),
      mis: t2('轉身時重心不穩、腳沒有扣好。', 'Losing balance in the turn; not turning the foot in enough.'),
      img: t2('左攬雀尾的對稱動作。', 'The mirror image of Grasp the Bird\'s Tail — Left.') },

    { n: 9, g: 4, zh: '單鞭', py: 'Dān Biān', en: 'Single Whip', type: 'bow',
      f: [[P('toe', 'hold', { fu: -60, fl: -80 }), t2('重心後移，後手變勾手向側後方伸出', 'Shift back; the rear hand forms a hook and extends behind'), 'in'],
          [P('bow', 'whip'), t2('上步弓腿，前手翻掌向前推出', 'Step and bow; the front hand turns and pushes forward'), 'out']],
      key: t2('勾手五指撮攏、腕向下；推掌與鼻同高', 'Hook hand: fingertips together, wrist bent down; push at nose height'),
      mis: t2('兩臂成一直線太僵；上身傾斜。', 'Arms locked in one stiff straight line; tilting the body.'),
      img: t2('一手如鞭梢的勾手、一手推出，姿態舒展。', 'One hand hooked like the tip of a whip, the other pushing — an open, extended posture.') },

    { n: 10, g: 4, zh: '雲手', py: 'Yún Shǒu', en: 'Cloud Hands', type: 'side', views: ['front'],
      front: true,
      f: [[CLOUD_A, t2('重心移向一側，上手在臉前、下手在腹前', 'Weight shifts to one side; upper hand in front of the face, lower hand in front of the belly'), 'in'],
          [CLOUD_B, t2('轉腰，兩手上下交換，如雲般畫圓；側行步', 'Turn the waist; the hands swap high and low, circling like clouds; side-step'), 'out']],
      key: t2('以腰帶手，眼隨上手，側步時腳尖向前', 'The waist moves the hands; eyes follow the upper hand; toes forward as you side-step'),
      mis: t2('只動手不轉腰；側步時起伏；兩腳過寬。', 'Moving only the arms; bobbing up and down; feet too wide.'),
      img: t2('兩手像天上的雲一樣連綿不斷地流動，共三次。', 'The hands drift continuously like clouds across the sky; three times.') },

    { n: 11, g: 4, zh: '單鞭', py: 'Dān Biān', en: 'Single Whip (2)', type: 'bow',
      f: [[P('stand', 'hold', { fu: -60, fl: -80 }), t2('雲手結束，後手變勾', 'From cloud hands, the rear hand forms a hook'), 'in'],
          [P('bow', 'whip'), t2('上步弓腿推掌，與第 9 式相同', 'Step, bow and push — the same as posture 9'), 'out']],
      key: t2('同第 9 式單鞭', 'As in posture 9'),
      mis: t2('同第 9 式。', 'As in posture 9.'),
      img: t2('第二次單鞭，連接下一組動作。', 'The second Single Whip, leading into the next group.') },

    { n: 12, g: 5, zh: '高探馬', py: 'Gāo Tàn Mǎ', en: 'High Pat on Horse', type: 'empty',
      f: [[P('bow', 'whip'), t2('後腳跟半步，勾手變掌', 'Bring the back foot in half a step; open the hook hand'), 'in'],
          [P('toe', 'highpat'), t2('成虛步，上手經耳旁向前推出，下手收至腹前掌心向上', 'Empty stance; the upper hand pushes forward past the ear, the lower hand rests palm-up by the belly'), 'out']],
      key: t2('上身正直，推掌高與眼平', 'Body upright; the pushing hand at eye level'),
      mis: t2('前腳承重；推掌時身體前傾。', 'Weighting the front foot; leaning as you push.'),
      img: t2('像在馬上探身輕拍馬背。', 'Like leaning from the saddle to pat the horse.') },

    { n: 13, g: 5, zh: '右蹬腳', py: 'Yòu Dēng Jiǎo', en: 'Right Heel Kick', type: 'single',
      f: [[P('knee', 'cross'), t2('兩手交叉合抱於胸前，提膝', 'Cross the hands in front of the chest and lift the knee'), 'in'],
          [P('kick', 'spread'), t2('兩手向兩側分開，同時以腳跟慢慢蹬出', 'Open the arms to the sides as the heel slowly presses out'), 'out']],
      key: t2('支撐腿微屈站穩，腳尖勾起，力在腳跟', 'Support leg slightly bent and steady; toes back; power in the heel'),
      mis: t2('為了踢高而彎腰；支撐腳不穩；腳尖繃直。', 'Bending forward to kick higher; a wobbly support leg; pointed toes.'),
      img: t2('分手蹬腳，練習單腳平衡。', 'Arms open, heel kick — a one-leg balance test.') },

    { n: 14, g: 5, zh: '雙峰貫耳', py: 'Shuāng Fēng Guàn Ěr', en: 'Strike the Ears with Both Fists', type: 'bow',
      f: [[P('knee', 'press'), t2('收腿提膝，兩手落於膝上', 'Draw the leg back to a knee lift; the hands settle above the knee'), 'in'],
          [P('bow', 'ears'), t2('上步弓腿，兩拳從兩側向前上方合擊', 'Step and bow; both fists circle in from the sides to meet in front at head height'), 'out']],
      key: t2('兩拳相距約一頭寬，沉肩垂肘', 'Fists about a head-width apart; shoulders and elbows sink'),
      mis: t2('聳肩、兩拳碰在一起；身體前傾。', 'Shrugging, fists touching, leaning forward.'),
      img: t2('兩拳如雙峰從兩側合擊。', 'The two fists close in from both sides like twin peaks.') },

    { n: 15, g: 5, zh: '轉身左蹬腳', py: 'Zhuǎn Shēn Zuǒ Dēng Jiǎo', en: 'Turn and Left Heel Kick', type: 'single',
      f: [[P('knee', 'cross'), t2('轉身，兩手交叉合抱，提膝', 'Turn around, cross the hands, lift the knee'), 'in'],
          [P('kick', 'spread'), t2('分手並以腳跟蹬出（左式，按「左右」切換）', 'Open the arms and press out with the heel (left side — use the mirror button)'), 'out']],
      key: t2('轉身後先站穩再蹬腳', 'Settle after the turn before kicking'),
      mis: t2('轉身未穩就急著蹬腳。', 'Kicking before the turn has settled.'),
      img: t2('右蹬腳的對稱動作，加上轉身。', 'The mirror of the right heel kick, with a turn.') },

    { n: 16, g: 6, zh: '左下勢獨立', py: 'Zuǒ Xià Shì Dú Lì', en: 'Lower Body and Stand on One Leg — Left', type: 'drop',
      f: [[P('stand', 'whip'), t2('一手變勾，屈膝下蹲', 'One hand forms a hook as you sink'), 'in'],
          [P('drop', 'lower', { t: 26, su: 20, sl: 30 }), t2('下勢：仆步，前手沿前腿內側穿出', 'Lower body: drop stance, the front hand threads along the inside of the front leg'), 'in'],
          [RISE, null, 'in', 1100],
          [ROOSTER, t2('獨立：重心前移到前腿，起身提後膝，手肘對膝（金雞獨立）', 'Stand on one leg: shift on to the front leg, rise and lift the back knee, elbow above it ("golden rooster")'), 'out']],
      back: [[STANDAT(80), 800], [STANDAT(40), 900]],       // the posture ends 80 further on: put the foot down and walk back to the start
      key: t2('仆步時兩腳全腳掌著地；獨立時支撐腿微屈', 'Both feet flat in the drop; support leg soft when standing on one leg'),
      mis: t2('下勢時彎腰低頭；起身太快搖晃。', 'Folding forward in the drop; rising too fast and wobbling.'),
      img: t2('先低後高：由下勢轉為「金雞獨立」。', 'Low then high: from the drop stance up into "golden rooster stands on one leg".') },

    { n: 17, g: 6, zh: '右下勢獨立', py: 'Yòu Xià Shì Dú Lì', en: 'Lower Body and Stand on One Leg — Right', type: 'drop',
      f: [[P('drop', 'lower', { t: 26, su: 20, sl: 30 }), t2('下勢（右式）', 'Lower body (right side)'), 'in'],
          [RISE, null, 'in', 1100],
          [ROOSTER, t2('獨立', 'Stand on one leg'), 'out']],
      back: [[STANDAT(80), 800], [STANDAT(40), 900]],
      key: t2('與左式相同，方向相反', 'As the left side, mirrored'),
      mis: t2('柔軟度不夠時硬壓——可以做高一點的下勢。', 'Forcing the depth — a higher drop stance is fine.'),
      img: t2('左下勢獨立的對稱動作。', 'Mirror of posture 16.') },

    { n: 18, g: 7, zh: '左右穿梭', py: 'Zuǒ Yòu Chuān Suō', en: 'Fair Lady Works the Shuttles', type: 'bow',
      f: [[P('toe', 'hold'), t2('抱球，轉腰上步', 'Hold the ball, turn and step'), 'in'],
          [P('bow', 'shuttle'), t2('弓步，上手翻掌架於額前上方，下手向前推出', 'Bow stance; the upper hand turns to shield above the forehead as the lower hand pushes forward'), 'out']],
      key: t2('架掌在額前斜上方，推掌與鼻同高', 'Shielding hand above and in front of the forehead; push at nose height'),
      mis: t2('架掌時聳肩；兩腳成一直線。', 'Shrugging on the shield; feet on one line.'),
      img: t2('兩手來回像織布梭子穿梭，左右各一次。', 'The hands go back and forth like a weaver\'s shuttle; once each side.') },

    { n: 19, g: 7, zh: '海底針', py: 'Hǎi Dǐ Zhēn', en: 'Needle at the Sea Bottom', type: 'empty',
      f: [[P('stand', 'press'), t2('後腳跟進半步，重心後移', 'Follow-step and shift back'), 'in'],
          [P('toe', 'needle', { t: 18 }), t2('成虛步，上身稍前傾，手指向前下方插下', 'Empty stance; lean slightly forward as the fingers point down and forward'), 'out']],
      key: t2('前傾時頭與背保持一直線', 'When leaning, keep the head and back in one line'),
      mis: t2('低頭彎背；前腳承重。', 'Dropping the head and rounding the back; weighting the front foot.'),
      img: t2('手指向下，像把針插向海底。', 'The fingers point down like a needle reaching the sea floor.') },

    { n: 20, g: 7, zh: '閃通臂', py: 'Shǎn Tōng Bì', en: 'Fan Through the Back', type: 'bow',
      f: [[P('toe', 'needle', { t: 20 }), t2('起身，兩手提至胸前', 'Rise and bring both hands up in front of the chest'), 'in'],
          [P('bow', 'fan'), t2('上步弓腿，前手推出，後手撐架於頭側上方', 'Step and bow; the front hand pushes, the rear hand braces above the head'), 'out']],
      key: t2('兩臂撐開如扇，力由背部展開', 'Arms open like a fan, spreading from the back'),
      mis: t2('推掌與弓腿不同時；聳肩。', 'Push and bow not together; shrugging.'),
      img: t2('兩臂如扇子從背部打開。', 'The arms open like a fan from across the back.') },

    { n: 21, g: 8, zh: '轉身搬攔捶', py: 'Zhuǎn Shēn Bān Lán Chuí', en: 'Turn, Deflect, Parry and Punch', type: 'bow',
      // (the deflect ends with the weight on the foot in front — here the far one — and the other foot light on its toes behind)
      f: [[P('toe', 'fist', { fF: { x: 8, y: 80 }, ftF: 90, fN: { x: -26, y: 74 }, ftN: 55 }), t2('轉身，握拳於腹前（搬）', 'Turn around, fist in front of the belly (deflect)'), 'in'],
          // (the foot in front stays where it is; the other steps right through, heel first, a full bow-stance length ahead,
          //  with the weight still on the back leg — then the weight moves forward into the bow without either foot moving again)
          [P('heel', 'brush', { x: X0 + 28, fN: { x: 60, y: 62 }, ftN: 150, fF: { x: -20, y: 62 }, ftF: 90, su: -20, sl: 85, fu: 60, fl: 95 }), t2('上步，掌向前攔（攔）', 'Step and parry forward with the palm (parry)'), 'in'],
          [P('bow', 'punch', { x: X0 + 54 }), t2('弓步，拳向前打出，掌附於前臂內側（捶）', 'Bow and punch forward, the palm near the inside of the forearm (punch)'), 'out']],
      key: t2('出拳時拳眼向上，不要用力過猛', 'Punch with the fist upright; don\'t force it'),
      mis: t2('出拳聳肩、身體前衝。', 'Shrugging and lunging on the punch.'),
      img: t2('搬、攔、捶三個動作連成一氣。', 'Deflect, parry and punch blended into one movement.') },

    { n: 22, g: 8, zh: '如封似閉', py: 'Rú Fēng Sì Bì', en: 'Apparent Close-Up', type: 'bow',
      f: [[P('sit', 'close'), t2('後坐，兩掌翻轉收回胸前', 'Sit back; turn the palms and draw them to the chest'), 'in'],
          [P('bow', 'an'), t2('弓步，兩掌向前推出', 'Bow forward and push with both palms'), 'out']],
      key: t2('後坐時不要後仰，前推時不要前衝', 'Don\'t lean back when sitting back, don\'t lunge on the push'),
      mis: t2('收掌時兩肘外張；推掌時聳肩。', 'Elbows flaring as the hands draw in; shrugging on the push.'),
      img: t2('像把門關上、封住：先收後推。', 'Like sealing a door shut — draw in, then push.') },

    { n: 23, g: 8, zh: '十字手', py: 'Shí Zì Shǒu', en: 'Cross Hands', type: 'stand',
      f: [[P('sit', 'raise', { su: 100, sl: 100, fu: 100, fl: 100, luN: 0.25, laN: 0.25, luF: 0.25, laF: 0.25, hz: 5.5 }), t2('轉身，兩手向兩側畫弧分開', 'Turn and circle both hands out to the sides'), 'in'],
          [P('stand', 'cross', { fz: 1.8 }), t2('收腳開立，兩手在胸前交叉成十字', 'Bring the feet to shoulder-width; the wrists cross in front of the chest'), 'out']],
      key: t2('兩臂撐圓，交叉點在胸前', 'Arms rounded, wrists crossing in front of the chest'),
      mis: t2('兩臂夾太緊；聳肩。', 'Arms squeezed too tight; shrugging.'),
      img: t2('兩手交叉成「十」字。', 'The hands cross to form the character 十 (ten / a cross).') },

    { n: 24, g: 8, zh: '收勢', py: 'Shōu Shì', en: 'Closing Form', type: 'stand',
      f: [[P('stand', 'cross', { fz: 1.8 }), t2('兩手由十字手翻掌', 'From cross hands, turn the palms down'), 'in'],
          [P('stand', 'press', { fz: 1.8 }), t2('兩掌慢慢下落', 'Slowly lower the palms'), 'out'],
          [P('stand', 'down', { fN: { x: 1, y: 87.6 }, fF: { x: -1, y: 87.6 }, fz: 0.5 }), t2('兩臂垂於身側，收腳並步，自然站立', 'Arms by the sides, bring the feet together and stand naturally'), 'out']],
      key: t2('動作結束後安靜站立片刻再走動', 'Stand quietly for a moment before walking away'),
      mis: t2('收勢太快，匆忙結束。', 'Rushing the close.'),
      img: t2('全套結束，回到起始的平靜。', 'The form ends where it began — calm and still.') }
  ];

  var GROUPS = { 1: t2('第一組', 'Group 1'), 2: t2('第二組', 'Group 2'), 3: t2('第三組', 'Group 3'), 4: t2('第四組', 'Group 4'),
    5: t2('第五組', 'Group 5'), 6: t2('第六組', 'Group 6'), 7: t2('第七組', 'Group 7'), 8: t2('第八組', 'Group 8') };

  var TYPE_NAME = { bow: t2('弓步', 'Bow stance'), empty: t2('虛步', 'Empty stance'), single: t2('獨立步', 'One-leg stance'),
    drop: t2('仆步 → 獨立', 'Drop → one leg'), stand: t2('開立步', 'Parallel stance'), side: t2('側行步', 'Side step'), back: t2('退步', 'Stepping back') };

  // shared lesson-engine fields
  L.forEach(function (s) {
    s.id = 'p' + s.n;
    if (!s.views) s.views = ['side'];
    s.bars = BARS[s.type];
    s.tags = { zh: [GROUPS[s.g].zh + ' · ' + TYPE_NAME[s.type].zh, '24 式之第 ' + s.n + ' 式'], en: [GROUPS[s.g].en + ' · ' + TYPE_NAME[s.type].en, 'Posture ' + s.n + ' of 24'] };
    var said = s.f.filter(function (x) { return x[1]; });        // in-between frames carry no caption
    s.how = { zh: said.map(function (x, i) { return (i + 1) + '. ' + x[1].zh; }).join('　'), en: said.map(function (x, i) { return (i + 1) + '. ' + x[1].en; }).join(' ') };
    s.mistakes = s.mis; s.use = s.img; s.keyp = s.key;
  });

  function makeClip(s, view, level, lang) {
    var frames = [], n = s.f.length, spd = level < 1 ? 1.5 : 1;    // beginner = slower
    s.f.forEach(function (x, i) {
      var last = i === n - 1;
      frames.push({ d: (x[3] || (last ? 1900 : 1500)) * spd, p: x[0], c: x[1] || undefined, br: x[2] });
    });
    if (s.back) {                                                 // a posture that travels: walk back to where it began
      frames.push({ d: 900 * spd, p: s.f[n - 1][0], br: 'in' });
      s.back.forEach(function (x) { frames.push({ d: x[1] * spd, p: x[0], br: 'in' }); });
    } else frames.push({ d: 1300 * spd, p: s.f[n - 1][0], br: 'in' });   // ease back to the start
    var front = !!s.front;
    return {
      scale: front ? 1 : 0.95, base: { x: front ? 205 : 185 }, ticks: false, labelAt: [348, 52], still: 0.5,
      farColor: front ? '#596075' : undefined, trail: 'hN', frames: frames,
      props: function (J, c) {
        var fr = frames[c.seg] || frames[0], inhale = fr.br === 'in';
        var hud = S.text(18, 30, inhale ? (KT.pick('吸氣 ↑', 'INHALE ↑')) : (KT.pick('呼氣 ↓', 'EXHALE ↓')),
          { size: 13, fill: inhale ? C.jade : C.red, family: "'JetBrains Mono','Noto Sans TC',monospace" });
        var r = 6 + 6 * (inhale ? c.k : 1 - c.k);   // breathing circle grows on the in-breath
        hud += S.circle({ x: 120, y: 26 }, r, 'none', inhale ? C.jade : C.red, 2, ' opacity=".7"');
        return { hud: hud };
      }
    };
  }

  w.TAICHI = { LIST: L, makeClip: makeClip, GROUPS: GROUPS, TYPE_NAME: TYPE_NAME };
})(window);
