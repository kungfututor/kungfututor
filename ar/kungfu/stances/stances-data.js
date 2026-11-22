/* Five basic kung fu stances (五步型) — data, poses and bilingual text.
 * Text is our own wording of standard Changquan / Wushu basic-stance teaching.
 * Weight splits and foot distances differ between schools; we give common
 * training values and say so on the page.
 */
(function (w) {
  'use strict';
  var S = w.KTFigure.S, C = S.col;

  function m() { var o = {}; for (var i = 0; i < arguments.length; i++) for (var k in arguments[i]) o[k] = arguments[i][k]; return o; }

  /* ---------- shared pose parts ---------- */
  var ARMS_SIDE_STAND = { su: 4, sl: 6, fu: -4, fl: -2 };
  var ARMS_SIDE_FIST = { su: -22, sl: 80, fu: -26, fl: 78 };           // fists chambered at the waist
  var ARMS_FRONT_STAND = { su: 6, sl: 3, fu: -6, fl: -3 };
  var ARMS_FRONT_FIST = { su: 28, sl: -55, fu: -28, fl: 55 };          // fists at the waist, seen from the front
  var FRONT = { hw: 9, sw: 16, kbF: -1, kbN: 1 };

  var STAND_SIDE = m(ARMS_SIDE_STAND, { t: 0, h: 0, lT: 1, fN: { x: 2, y: 87 }, fF: { x: -2, y: 87 }, ftN: 90, ftF: 90 });
  var STAND_FRONT = m(FRONT, ARMS_FRONT_STAND, { t: 0, h: 0, lT: 1, fN: { x: 9, y: 87 }, fF: { x: -9, y: 87 }, ftN: 90, ftF: -90 });

  var POSES = {
    horse: {
      front: m(FRONT, ARMS_FRONT_FIST, { lT: 0.72, fN: { x: 40, y: 50 }, fF: { x: -40, y: 50 }, ftN: 90, ftF: -90 }),
      side: m(ARMS_SIDE_FIST, { fN: { x: 10, y: 50 }, fF: { x: 6, y: 50 }, ftN: 90, ftF: 90 })
    },
    bow: {
      side: m(ARMS_SIDE_FIST, { fN: { x: 42, y: 58 }, fF: { x: -66, y: 58 }, ftN: 90, ftF: 90 })
    },
    empty: {
      side: m(ARMS_SIDE_FIST, { fN: { x: 38, y: 58 }, ftN: 40, fF: { x: -4, y: 66 }, ftF: 90 })
    },
    drop: {
      front: m(FRONT, ARMS_FRONT_FIST, { t: 4, fN: { x: 14, y: 34 }, fF: { x: -90, y: 34 }, ftN: 90, ftF: -90 })
    },
    cross: {
      side: m(ARMS_SIDE_FIST, { t: 5, fN: { x: 34, y: 46 }, ftN: 90, fF: { x: -14, y: 38 }, ftF: 30 })
    }
  };

  function lerp(a, b, k) {
    var o = {}, key;
    for (key in a) o[key] = a[key];
    for (key in b) {
      var va = a[key], vb = b[key];
      if (typeof va === 'number' && typeof vb === 'number') o[key] = va + (vb - va) * k;
      else if (va && vb && typeof va === 'object') o[key] = { x: va.x + (vb.x - va.x) * k, y: va.y + (vb.y - va.y) * k };
      else o[key] = vb;
    }
    return o;
  }

  function kneeAngle(hip, k, a) {
    var v1 = { x: hip.x - k.x, y: hip.y - k.y }, v2 = { x: a.x - k.x, y: a.y - k.y };
    var c = (v1.x * v2.x + v1.y * v2.y) / (Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y));
    return Math.round(Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI);
  }

  /* Build a looping clip: stand → step into stance → hold → step out */
  function makeClip(id, view, depth, lang) {
    var front = view === 'front';
    var stand = front ? STAND_FRONT : STAND_SIDE;
    var target = lerp(stand, POSES[id][view], depth);
    var x = 200;
    var readout = STANCES.filter(function (s) { return s.id === id; })[0].readout || [];
    return {
      scale: 0.95, base: { x: x }, ticks: false, labelAt: [345, 58], still: 0.55,
      farColor: front ? '#596075' : undefined,
      frames: [
        { d: 750, p: stand },     // step in
        { d: 1900, p: target },   // hold
        { d: 750, p: target },    // step out
        { d: 600, p: stand }      // rest
      ],
      props: function (J, c) {
        var hud = '', fr = '';
        if (!front) {
          readout.forEach(function (r, i) {
            var knee = r[0] === 'N' ? J.kN : J.kF, hip = r[0] === 'N' ? J.hipN : J.hipF, ank = r[0] === 'N' ? J.aN : J.aF;
            var deg = kneeAngle(hip, knee, ank);
            fr += S.circle(knee, 4.5, C.jade, '#fff', 1.5);
            hud += S.text(18, 30 + i * 18, (KT.pick(r[1], r[2])) + '  ' + deg + '°', { size: 12, fill: C.jade, family: "'JetBrains Mono',monospace" });
          });
        } else {
          hud += S.text(18, 30, KT.pick('正面視角', 'FRONT VIEW'), { size: 11, fill: C.jade, family: "'JetBrains Mono',monospace" });
        }
        return { front: fr, hud: hud };
      }
    };
  }

  /* ---------- the five stances ---------- */
  // foot diagram (top view, facing up): u = one foot length; feet: [x, y, rotation°, weight label, heelUp]
  var STANCES = [
    { id: 'horse', n: 1, zh: '馬步', py: 'Mǎ Bù', en: 'Horse Stance', views: ['front', 'side'],
      weight: '50 / 50', width: { zh: '約 3 腳長，平行', en: 'about 3 foot lengths, parallel' },
      readout: [['N', '膝角', 'KNEE']],
      feet: [[-2.1, 0, 0, '50%'], [2.1, 0, 0, '50%']],
      tags: { zh: ['基礎步型：下盤根基', '靜態站樁 · 腿力'], en: ['Foundation stance: your root', 'Static hold · leg strength'] },
      ability: { zh: '大腿與臀部肌耐力', en: 'Thigh and hip endurance' },
      note: { zh: '大腿接近水平 · 膝蓋對腳尖', en: 'THIGHS NEAR LEVEL · KNEES OVER TOES' },
      how: { zh: '兩腳平行分開約三個腳掌長，腳尖朝前。屈膝下蹲，大腿接近水平，膝蓋向外撐、對準腳尖方向。上身挺直、收下巴、沉肩，雙拳抱於腰側。重心平均落在兩腳之間。',
        en: 'Feet parallel about three foot lengths apart, toes forward. Bend the knees and sink until the thighs are close to level, pressing the knees out over the toes. Keep the back upright, chin tucked, shoulders relaxed and fists at the waist. Weight sits evenly between both feet.' },
      mistakes: { zh: '膝蓋內扣（膝蓋往中間倒）；上身前傾、翹臀；腳尖外八；憋氣聳肩。初學者寧可站高一點，也不要犧牲姿勢。',
        en: 'Knees caving inward; leaning forward and sticking the hips out; toes turned out; holding the breath or shrugging. Beginners should stand higher rather than give up good form.' },
      practice: { zh: '從 30 秒開始，每天 3 組，逐步加到 2 分鐘。保持自然呼吸，可對鏡檢查膝蓋方向。',
        en: 'Start with 3 × 30 seconds a day and build to 2 minutes. Breathe naturally and check knee direction in a mirror.' },
      use: { zh: '馬步是幾乎所有功夫流派的基礎：練腿力、穩定下盤，也是衝拳、架打等動作的起點。',
        en: 'Almost every kung fu style builds on the horse stance: it trains leg strength and a stable base, and it is the starting point for punches and blocks.' },
      bars: [['股四頭肌', 'Quadriceps', 95], ['臀肌', 'Glutes', 85], ['內收肌', 'Inner thighs', 72], ['核心穩定', 'Core stability', 75]] },

    { id: 'bow', n: 2, zh: '弓步', py: 'Gōng Bù', en: 'Bow Stance', views: ['side'],
      weight: '≈ 60–70 / 30–40', width: { zh: '前後約 4–5 腳長', en: 'about 4–5 foot lengths long' },
      readout: [['N', '前膝', 'FRONT KNEE'], ['F', '後膝', 'BACK KNEE']],
      feet: [[0.5, -2.2, -5, '≈65%'], [-0.5, 2.2, 45, '≈35%']],
      tags: { zh: ['基礎步型：前弓後蹬', '進攻步型 · 推送力量'], en: ['Foundation stance: bend front, drive back', 'Attacking stance · forward drive'] },
      ability: { zh: '前腿支撐與後腿蹬地力', en: 'Front-leg support and back-leg drive' },
      note: { zh: '前膝不超過腳尖 · 後腿蹬直', en: 'FRONT KNEE OVER ANKLE · BACK LEG STRAIGHT' },
      how: { zh: '前腳向前跨出約四到五個腳長，前腳尖朝前或微向內扣；屈前膝，大腿接近水平，膝蓋垂直於腳背上方。後腿伸直蹬地，後腳尖向內扣、斜向前約 45°，全腳掌著地。上身正直、面向前方。',
        en: 'Step forward about four to five foot lengths with the front toes turned in slightly. Bend the front knee until the thigh is near level, with the knee above the instep. Straighten the back leg and press it into the floor, back foot turned in to point about 45° forward, and flat. Keep the torso upright and facing forward.' },
      mistakes: { zh: '前膝超過腳尖；後腳跟離地或後膝彎曲；兩腳站在同一直線上，像走鋼索一樣不穩；上身前傾。',
        en: 'Front knee past the toes; back heel lifting or back knee bending; both feet on one line like a tightrope, which kills balance; leaning the torso forward.' },
      practice: { zh: '左右式各站 30–60 秒；之後練習弓步沖拳：出拳時後腿蹬直、轉腰送拳。',
        en: 'Hold each side for 30–60 seconds, then add the bow-stance punch: drive the back leg straight and turn the waist as you punch.' },
      use: { zh: '弓步是最常見的進攻步型，讓身體重量往前推送，配合沖拳、推掌使用。',
        en: 'The bow stance is the classic attacking stance: it sends bodyweight forward behind punches and palm strikes.' },
      bars: [['股四頭肌（前腿）', 'Quads (front leg)', 85], ['臀肌', 'Glutes', 80], ['小腿伸展（後腿）', 'Calf stretch (back leg)', 75], ['平衡', 'Balance', 70]] },

    { id: 'empty', n: 3, zh: '虛步', py: 'Xū Bù', en: 'Empty Stance (Cat Stance)', views: ['side'],
      weight: '≈ 10 / 90', width: { zh: '前後約 1–1.5 腳長', en: 'about 1–1.5 foot lengths' },
      readout: [['F', '支撐膝', 'SUPPORT KNEE']],
      feet: [[0.3, -1.4, 0, '≈10%', true], [-0.3, 0.6, -45, '≈90%']],
      tags: { zh: ['基礎步型：虛實分明', '平衡 · 靈活轉換'], en: ['Foundation stance: empty vs full', 'Balance · quick change'] },
      ability: { zh: '單腿支撐力與平衡', en: 'Single-leg strength and balance' },
      note: { zh: '前腳只用腳尖輕點地', en: 'FRONT FOOT: TOES ONLY, NO WEIGHT' },
      how: { zh: '後腳尖斜向外約 45°，屈膝下蹲，幾乎全部體重放在後腿。前腳向前約一個腳長，膝蓋微屈，只用前腳掌或腳尖輕點地面，腳跟提起。上身正直，不要往後坐倒。',
        en: 'Turn the back foot out about 45°, bend the knee and put almost all your weight on the back leg. Place the front foot about one foot length ahead, knee slightly bent, touching down lightly with the ball or toes, heel raised. Keep the body upright — don\'t sit back and lean.' },
      mistakes: { zh: '重心偷偷放到前腳（前腳應能隨時提起）；支撐腿膝蓋內扣；身體後仰；前腳伸太遠變成弓步。',
        en: 'Sneaking weight onto the front foot (you should be able to lift it any time); support knee caving in; leaning back; reaching the front foot too far so it becomes a bow stance.' },
      practice: { zh: '先扶牆練習，每邊 20–30 秒；可測試：站好後把前腳提起，身體不晃就是正確。',
        en: 'Start with a hand on a wall, 20–30 seconds each side. Test: lift the front foot — if your body doesn\'t move, your weight was right.' },
      use: { zh: '虛步讓前腳「空著」，可以隨時踢腿或轉換步法，常見於南北各派的防守與起腿準備。',
        en: 'Keeping the front leg "empty" lets you kick or change step instantly; it appears in both northern and southern styles as a guard and kicking set-up.' },
      bars: [['股四頭肌（支撐腿）', 'Quads (support leg)', 90], ['平衡', 'Balance', 92], ['踝關節穩定', 'Ankle stability', 76], ['臀肌', 'Glutes', 72]] },

    { id: 'drop', n: 4, zh: '仆步', py: 'Pū Bù', en: 'Drop Stance', views: ['front'],
      weight: '≈ 80–90 / 10–20', width: { zh: '左右約 4–5 腳長', en: 'about 4–5 foot lengths wide' },
      feet: [[-2.5, 0, 20, '≈15%'], [2.5, 0, 25, '≈85%']],
      tags: { zh: ['基礎步型：低身伸展', '柔軟度 · 低位轉換'], en: ['Foundation stance: low and long', 'Flexibility · low transitions'] },
      ability: { zh: '髖部柔軟度與屈腿力量', en: 'Hip flexibility and bent-leg strength' },
      note: { zh: '兩腳全腳掌著地 · 伸直腿腳尖內扣', en: 'BOTH FEET FLAT · STRAIGHT-LEG TOES TURNED IN' },
      how: { zh: '兩腳左右大幅分開。一腿全蹲，臀部接近腳跟，膝蓋與腳尖同方向；另一腿向側伸直貼近地面，腳尖內扣。兩腳全腳掌著地，上身盡量正直，不要彎腰低頭。',
        en: 'Spread the feet wide to the sides. Sink fully into one leg, hips near that heel, knee tracking the toes. Stretch the other leg straight along the floor with the toes turned in. Keep both feet flat and the chest as upright as you can — don\'t fold forward.' },
      mistakes: { zh: '伸直腿的腳跟或腳掌外側離地；屈腿腳跟抬起；彎腰低頭；勉強壓低造成膝蓋疼痛——柔軟度不夠時先站高一點。',
        en: 'Heel or outer edge of the straight-leg foot lifting; the bent-leg heel coming up; rounding the back; forcing depth until the knee hurts — stay higher until your flexibility allows.' },
      practice: { zh: '先做髖與內收肌伸展；左右換邊各 20–30 秒，或左右慢慢移動重心來回轉換。',
        en: 'Warm up the hips and inner thighs first; hold 20–30 seconds each side, or shift slowly from side to side.' },
      use: { zh: '仆步常用於低身閃躲與穿掌等動作，也是很好的髖部柔軟度訓練。',
        en: 'The drop stance is used for low evasions and threading-palm techniques, and is excellent hip-mobility training.' },
      bars: [['髖部柔軟度', 'Hip mobility', 95], ['內收肌伸展', 'Inner-thigh stretch', 90], ['股四頭肌（屈腿）', 'Quads (bent leg)', 85], ['踝關節柔軟度', 'Ankle mobility', 80]] },

    { id: 'cross', n: 5, zh: '歇步', py: 'Xiē Bù', en: 'Cross Stance (Resting Stance)', views: ['side'],
      weight: '≈ 70 / 30', width: { zh: '兩腿交叉，後腳在前腳斜後方', en: 'legs crossed, back foot behind the front foot' },
      readout: [['N', '前膝', 'FRONT KNEE'], ['F', '後膝', 'BACK KNEE']],
      feet: [[0, -0.6, 70, '≈70%'], [1.0, 0.9, 10, '≈30%', true]],
      tags: { zh: ['基礎步型：交叉坐盤', '轉身 · 低位穩定'], en: ['Foundation stance: crossed and seated', 'Turning · low stability'] },
      ability: { zh: '低位平衡與髖部旋轉', en: 'Low balance and hip rotation' },
      note: { zh: '前腳外展全腳著地 · 後腳跟提起', en: 'FRONT FOOT TURNED OUT · BACK HEEL UP' },
      how: { zh: '兩腿交叉下蹲：前腳腳尖外展、全腳掌著地；後腳在前腳斜後方，以前腳掌著地、腳跟提起，後膝貼近前腿小腿外側。臀部坐在後腿小腿附近，上身挺直、略向前。',
        en: 'Cross the legs and sink: the front foot turns out and stays flat; the back foot sits diagonally behind it on the ball of the foot with the heel raised, back knee tucked close against the outside of the front calf. Sit down towards the back calf and keep the chest upright, slightly forward.' },
      mistakes: { zh: '兩腿沒有夾緊、中間留空；前腳沒有外展導致膝蓋扭轉；身體歪斜或彎腰；蹲不下去就硬坐，傷到膝蓋。',
        en: 'Leaving a gap between the legs; not turning the front foot out so the knee twists; tilting or rounding the body; forcing the sit and straining the knee.' },
      practice: { zh: '先扶物練習，每邊 15–30 秒；熟練後練習由弓步轉歇步的轉換。',
        en: 'Hold onto support at first, 15–30 seconds each side; later practise flowing from bow stance into cross stance.' },
      use: { zh: '歇步常用於轉身、閃避後的低位反擊，也常見於套路的收勢與定勢。',
        en: 'The cross stance appears in turns, low counters after evasions, and as a finishing posture in forms.' },
      bars: [['平衡', 'Balance', 85], ['髖部旋轉／柔軟', 'Hip rotation / mobility', 85], ['股四頭肌', 'Quadriceps', 80], ['膝踝控制', 'Knee & ankle control', 75]] }
  ];

  w.STANCES = { LIST: STANCES, makeClip: makeClip };
})(window);
