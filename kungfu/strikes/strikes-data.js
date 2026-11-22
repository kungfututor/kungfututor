/* Six basic kung fu punches & kicks — data, poses and bilingual text.
 * Our own wording of standard Changquan / Wushu basic hand and leg techniques
 * (基本手法、腿法). Details vary between schools.
 */
(function (w) {
  'use strict';
  var S = w.KTFigure.S, C = S.col;
  function m() { var o = {}; for (var i = 0; i < arguments.length; i++) for (var k in arguments[i]) o[k] = arguments[i][k]; return o; }
  function cap(zh, en) { return { zh: zh, en: en }; }

  /* ---------- pose parts (side view, facing +x) ---------- */
  var FIST_N = { su: -22, sl: 80 }, FIST_F = { fu: -26, fl: 78 };          // fists chambered at the waist
  var BOW = { t: 0, h: 0, fN: { x: 42, y: 58 }, fF: { x: -66, y: 58 }, ftN: 90, ftF: 90 };
  var STAND_KICK = { t: 0, h: 0, fF: { x: -3, y: 87 }, ftF: 90, tu: 3, tl: 0, ftN: 90 };   // far leg supports, near leg kicks

  /* ---------- clip builders ---------- */
  function handStrike(kind) {
    var ready = m(BOW, FIST_N, FIST_F, { t: 0 });
    var out = kind === 'palm'
      ? m(BOW, FIST_N, { fu: 88, fl: 84, t: 6 })
      : m(BOW, FIST_N, { fu: 90, fl: 90, t: 6 });
    var c = kind === 'palm'
      ? [cap('弓步站穩，雙拳抱於腰間', 'Bow stance set, fists at the waist'),
         cap('拳變掌，由腰間向前推出，力達掌根', 'Open the hand and drive it forward from the waist — power to the heel of the palm'),
         cap('坐腕立掌，再收回腰間', 'Wrist bent back, fingers up; then return to the waist')]
      : [cap('弓步站穩，雙拳抱於腰間', 'Bow stance set, fists at the waist'),
         cap('轉腰順肩，拳旋轉沖出，力達拳面', 'Turn the waist and shoulder; the fist twists palm-down and lands on the knuckles'),
         cap('沿原路收回腰間', 'Pull straight back to the waist along the same line')];
    return { trail: 'hF', strike: 'hF', kind: kind, frames: [
      { d: 600, p: ready, c: c[0] },
      { d: 170, p: ready, e: 'out' },
      { d: 420, p: out, c: c[1] },
      { d: 300, p: out, c: c[2] }
    ] };
  }

  function kick(kind, h) {   // h: 0.6 beginner (lower) … 1 standard
    var stand = m(STAND_KICK, FIST_N, FIST_F);
    var F;
    if (kind === 'snap') {
      var ch = m(stand, { tu: 45 + 35 * h, tl: -10, ftN: 80 });
      var ex = m(stand, { tu: 50 + 25 * h, tl: 50 + 40 * h, ftN: 50 + 40 * h });
      F = [
        { d: 500, p: stand, c: cap('並步站立，雙拳抱腰', 'Stand with feet together, fists at the waist') },
        { d: 180, p: ch, c: cap('提膝，大腿抬平', 'Lift the knee until the thigh is level') },
        { d: 140, p: ex, e: 'out', c: cap('小腿向前彈出，腳面繃直，力達腳尖', 'Snap the lower leg out, toes pointed — power to the tip of the foot') },
        { d: 220, p: ch, c: cap('迅速彈回成提膝', 'Snap straight back to the knee lift') },
        { d: 420, p: stand }
      ];
    } else if (kind === 'heel') {
      var ch2 = m(stand, { t: -4, tu: 60 + 35 * h, tl: -25, ftN: 65 });
      var ex2 = m(stand, { t: -8, tu: 60 + 28 * h, tl: 60 + 28 * h, ftN: 150 + 28 * h });
      F = [
        { d: 500, p: stand, c: cap('並步站立，雙拳抱腰', 'Stand with feet together, fists at the waist') },
        { d: 200, p: ch2, c: cap('屈膝高提，腳尖勾起', 'Lift the knee high and pull the toes back') },
        { d: 180, p: ex2, e: 'out', c: cap('腳跟向前蹬出，腿伸直，力達腳跟', 'Thrust the heel forward until the leg is straight — power to the heel') },
        { d: 240, p: ch2, c: cap('屈膝收回，保持平衡', 'Bend and recover the knee, stay balanced') },
        { d: 420, p: stand }
      ];
    } else if (kind === 'side') {
      var ch3 = m(stand, { t: -14, h: 10, tu: 70 + 30 * h, tl: -40, ftN: 50 });
      var ex3 = m(stand, { t: -38, h: 28, tu: 60 + 32 * h, tl: 60 + 32 * h, ftN: 150 + 32 * h });
      F = [
        { d: 500, p: stand, c: cap('側身站立，目視前方', 'Stand side-on, eyes on the target') },
        { d: 220, p: ch3, c: cap('屈膝提起，腳掌向內扣', 'Chamber: lift the knee, foot turned in') },
        { d: 200, p: ex3, e: 'out', c: cap('展髖向側踹出，上身側倒，力達腳跟及腳掌外沿', 'Open the hip and drive the leg out sideways, body leaning away — power to the heel and outer edge') },
        { d: 260, p: ch3, c: cap('收腿回提膝，再落地', 'Re-chamber the knee, then set the foot down') },
        { d: 420, p: stand }
      ];
    } else {  // front stretch kick — straight-leg swing
      var up = m(stand, { h: -4, tu: 100 + 60 * h, tl: 100 + 60 * h, ftN: 190 + 60 * h });
      F = [
        { d: 520, p: stand, c: cap('並步站立，雙手叉腰或側平舉', 'Feet together, hands on hips or arms out to the sides') },
        { d: 280, p: m(stand, { tu: 30, tl: 30, ftN: 120 }), e: 'in' },
        { d: 90, p: up, e: 'out', c: cap('腿伸直、勾腳尖，向前額方向踢起', 'Kick straight up towards the forehead, leg straight, toes pulled back') },
        { d: 340, p: up, c: cap('支撐腿伸直，上身正直，控制落下', 'Support leg straight, chest upright — lower the leg under control') },
        { d: 380, p: stand }
      ];
    }
    return { trail: 'tN', strike: kind === 'snap' ? 'tN' : 'aN', kind: kind, frames: F };
  }

  function makeClip(s, view, level, lang) {
    var base = s.hand ? handStrike(s.kind) : kick(s.kind, level);
    return {
      scale: s.hand ? 0.95 : 0.9, base: { x: s.hand ? 175 : 165 }, ticks: false, labelAt: [348, 52], still: 0.45,
      trail: base.trail, frames: base.frames,
      props: function (J, c) {
        var p = J[base.strike], fr = '', hud = '';
        var extended = s.hand ? Math.abs(J.hF.y - J.sh.y) < 8 && J.hF.x - J.sh.x > 50 : J.aN.y < J.hip.y + 20 && J.aN.x - J.hip.x > 35;
        if (s.hand) {
          fr += S.line({ x: J.sh.x + 10, y: J.sh.y }, { x: 410, y: J.sh.y }, '#C9C7C0', 1.5, ' stroke-dasharray="4 5"');
          if (s.kind === 'palm' && extended) fr += S.line(J.hF, { x: J.hF.x + 1, y: J.hF.y - 13 }, C.ink, 5.5);
        }
        if (s.kind === 'stretch' && J.tN.y < J.head.y + 30) fr += S.circle(J.head, 16, 'none', C.red, 1.5, ' stroke-dasharray="3 3"');
        fr += S.circle(p, extended ? 7 : 4.5, extended ? C.red : '#E3B4AF', '#fff', 1.5);
        if (extended && s.kind !== 'stretch') hud += S.text(18, 30, (KT.pick('力點：', 'STRIKING POINT: ')) + KT.t(s.point), { size: 12, fill: C.red, family: "'JetBrains Mono','Noto Sans TC',monospace" });
        return { front: fr, hud: hud };
      }
    };
  }

  /* ---------- the six techniques ---------- */
  var LIST = [
    { id: 'punch', n: 1, hand: true, kind: 'punch', zh: '沖拳', py: 'Chōng Quán', en: 'Straight Punch',
      type: { zh: '拳法', en: 'Punch' }, point: { zh: '拳面', en: 'Knuckles (fist face)' },
      height: { zh: '胸口至肩高', en: 'Chest to shoulder height' },
      tags: { zh: ['基本拳法：直線出擊', '弓步沖拳 · 轉腰發力'], en: ['Basic hand technique: straight line', 'Bow-stance punch · waist power'] },
      ability: { zh: '腰胯轉動與手臂直線出力', en: 'Waist rotation and straight-line arm drive' },
      note: { zh: '拳走直線 · 肩不聳 · 肘不外翻', en: 'STRAIGHT LINE · SHOULDER DOWN · ELBOW IN' },
      how: { zh: '弓步站穩，雙拳抱於腰側、拳心向上。出拳時後腿蹬地、轉腰順肩，拳從腰間沿直線向前沖出，途中旋轉成拳心向下，手臂伸直時力量集中在拳面。另一拳保持在腰間。出完拳沿原路收回。',
        en: 'Set a bow stance with both fists at the waist, palms up. Push off the back leg, turn the waist and let the shoulder follow as the fist drives straight out from the waist, twisting palm-down on the way. Power lands on the knuckles as the arm straightens; the other fist stays at the waist. Return along the same line.' },
      mistakes: { zh: '只用手臂、沒有轉腰；聳肩或肘部向外翻；拳頭走弧線；手腕彎曲（容易受傷）；出拳時身體前傾、重心跑掉。',
        en: 'Arm-only punching with no waist turn; shrugging or flaring the elbow; a curved path; a bent wrist (an injury risk); leaning forward and losing the stance.' },
      practice: { zh: '先慢動作做 10 次，確認路線與拳心旋轉；再左右交替各 20 次。可對鏡檢查拳是否在肩高直線上。',
        en: 'Do 10 slow reps to check the line and the twist, then 20 alternating reps each side. Use a mirror to check the fist stays level with the shoulder.' },
      use: { zh: '沖拳是最基本的攻擊動作，也是理解「力從地起、經腰傳到手」的入門練習。',
        en: 'The straight punch is the most basic strike and the first lesson in "power from the ground, through the waist, into the hand".' },
      bars: [['腰胯轉動', 'Waist rotation', 90], ['肩臂前推', 'Shoulder & arm drive', 85], ['下盤穩定', 'Stance stability', 80], ['手腕穩定', 'Wrist alignment', 70]] },

    { id: 'palm', n: 2, hand: true, kind: 'palm', zh: '推掌', py: 'Tuī Zhǎng', en: 'Palm Strike',
      type: { zh: '掌法', en: 'Palm' }, point: { zh: '掌根', en: 'Heel of the palm' },
      height: { zh: '胸口至下巴高', en: 'Chest to chin height' },
      tags: { zh: ['基本掌法：立掌推出', '弓步推掌 · 坐腕'], en: ['Basic palm technique: upright palm', 'Bow-stance palm · wrist bent back'] },
      ability: { zh: '推送力量與手腕結構', en: 'Pushing power and wrist structure' },
      note: { zh: '坐腕立掌 · 力達掌根', en: 'WRIST BENT BACK · FINGERS UP · HEEL OF PALM' },
      how: { zh: '弓步站穩，雙拳抱腰。出手時拳變掌，由腰間向前推出，同時坐腕（手腕向後彎）、手指向上成立掌，掌心向前。後腿蹬地、轉腰，讓力量集中到掌根。完成後變拳收回腰間。',
        en: 'From a bow stance with fists at the waist, open one hand and push it forward from the waist. As it travels, bend the wrist back so the fingers point up and the palm faces forward. Drive from the back leg and waist so the force lands on the heel of the palm, then close the hand and return to the waist.' },
      mistakes: { zh: '手腕沒有坐起、用手指推；手肘鎖死；聳肩；只推手不轉腰。',
        en: 'Not bending the wrist back so the fingers do the pushing; locking the elbow hard; shrugging; pushing with the arm without turning the waist.' },
      practice: { zh: '左右交替各 20 次；可推牆或推靶，感受力量從腳傳到掌根。',
        en: '20 alternating reps each side; push against a wall or pad to feel force travel from the feet to the heel of the palm.' },
      use: { zh: '推掌比拳頭更不易傷手，自我防衛教學中常用於推開對方、製造距離以便離開。',
        en: 'A palm strike is easier on the hand than a fist; self-defence courses often use it to push an attacker away and create space to escape.' },
      bars: [['推送力量', 'Pushing power', 88], ['腰胯轉動', 'Waist rotation', 85], ['手腕結構', 'Wrist structure', 80], ['下盤穩定', 'Stance stability', 78]] },

    { id: 'snap', n: 3, kind: 'snap', zh: '彈腿', py: 'Tán Tuǐ', en: 'Front Snap Kick',
      type: { zh: '腿法（屈伸）', en: 'Kick (bend & extend)' }, point: { zh: '腳尖（腳面繃直）', en: 'Tip of the foot (toes pointed)' },
      height: { zh: '膝至腰高', en: 'Knee to waist height' },
      tags: { zh: ['基本腿法：屈伸性腿法', '提膝彈擊 · 快速收回'], en: ['Basic kick: bend-and-extend', 'Knee lift · snap · fast recoil'] },
      ability: { zh: '股四頭肌爆發與單腳平衡', en: 'Quad snap and one-leg balance' },
      note: { zh: '先提膝 · 腳面繃直 · 快彈快收', en: 'KNEE FIRST · TOES POINTED · SNAP AND RECOIL' },
      how: { zh: '並步站立、雙拳抱腰。支撐腿站穩微直，踢腿先提膝到大腿接近水平，接著小腿以膝為軸迅速向前彈出，腳面繃直，力量集中到腳尖。彈出後立即收回成提膝，再落地。',
        en: 'Stand with feet together, fists at the waist. Keep the support leg firm. Lift the kicking knee until the thigh is near level, then snap the lower leg out from the knee with the toes pointed, power to the tip of the foot. Recoil straight back to the knee lift before putting the foot down.' },
      mistakes: { zh: '沒有提膝、直接甩腿；彈出時膝蓋鎖死（傷膝）；腳尖沒有繃直；上身後仰太多；收腿太慢。',
        en: 'Swinging the leg without lifting the knee; snapping the knee into a hard lock (hard on the joint); toes not pointed; leaning far back; slow recoil.' },
      practice: { zh: '扶牆練習提膝 → 彈出 → 收回，每腿 15 次；熟練後離開牆，左右交替行進練習。',
        en: 'With a hand on a wall: lift → snap → recoil, 15 per leg. Then practise without support, alternating legs while stepping forward.' },
      use: { zh: '彈腿是長拳腿法的基礎，也是「彈腿」系列套路的名稱由來；低彈腿速度快、動作小。',
        en: 'The snap kick is the root of Changquan kicking and gives the Tan Tui forms their name; a low snap kick is fast and compact.' },
      bars: [['股四頭肌爆發', 'Quad snap', 88], ['單腳平衡', 'One-leg balance', 85], ['髖屈肌', 'Hip flexors', 80], ['膝關節控制', 'Knee control', 75]] },

    { id: 'heel', n: 4, kind: 'heel', zh: '蹬腿', py: 'Dēng Tuǐ', en: 'Heel Thrust Kick',
      type: { zh: '腿法（屈伸）', en: 'Kick (bend & extend)' }, point: { zh: '腳跟', en: 'Heel' },
      height: { zh: '腰至胸高', en: 'Waist to chest height' },
      tags: { zh: ['基本腿法：勾腳蹬出', '推蹬力量 · 製造距離'], en: ['Basic kick: toes back, heel out', 'Thrusting power · creates distance'] },
      ability: { zh: '臀腿推蹬力與核心穩定', en: 'Hip & leg thrust, core stability' },
      note: { zh: '腳尖勾起 · 力達腳跟', en: 'TOES PULLED BACK · POWER TO THE HEEL' },
      how: { zh: '並步站立。踢腿屈膝高提，腳尖勾起；接著以髖、膝伸展的力量把腳跟向前直線蹬出，腿伸直，力量集中在腳跟。上身保持正直、略向後，蹬完屈膝收回再落地。',
        en: 'From feet together, lift the kicking knee high with the toes pulled back. Extend hip and knee to drive the heel forward in a straight line until the leg is straight, power on the heel. Keep the chest upright, leaning back only slightly, then bend the knee back in and set the foot down.' },
      mistakes: { zh: '腳尖繃直變成彈腿；提膝不夠高，腳往上撩；身體過度後仰；支撐腳跟離地。',
        en: 'Pointing the toes so it becomes a snap kick; low knee lift so the foot scoops upward; leaning far back; support heel lifting.' },
      practice: { zh: '對著踢靶或厚墊慢慢推蹬，每腿 10–15 次；重點是先提膝再直線蹬出。',
        en: 'Push slowly into a kick shield or thick pad, 10–15 per leg; the key is knee up first, then a straight thrust.' },
      use: { zh: '蹬腿是推開距離的腿法，和泰拳前蹬（Teep）原理相近，在自我防衛中可用來推開逼近的人以便離開。',
        en: 'The heel thrust pushes distance open, much like the Muay Thai teep; in self-defence it can push away someone closing in so you can leave.' },
      bars: [['臀大肌推蹬', 'Glute thrust', 90], ['股四頭肌', 'Quadriceps', 82], ['核心穩定', 'Core stability', 80], ['單腳平衡', 'One-leg balance', 82]] },

    { id: 'side', n: 5, kind: 'side', zh: '側踹', py: 'Cè Chuài', en: 'Side Kick',
      type: { zh: '腿法（屈伸）', en: 'Kick (bend & extend)' }, point: { zh: '腳跟、腳掌外沿', en: 'Heel & outer edge of the foot' },
      height: { zh: '腰至肩高', en: 'Waist to shoulder height' },
      tags: { zh: ['基本腿法：展髖側踹', '最遠距離的腿法'], en: ['Basic kick: open-hip side thrust', 'Longest-range kick'] },
      ability: { zh: '髖外展力量與柔軟度', en: 'Hip abductor strength and flexibility' },
      note: { zh: '先提膝 · 展髖 · 腳跟領先', en: 'CHAMBER · OPEN THE HIP · HEEL LEADS' },
      how: { zh: '側身站立，目視踢擊方向。踢腿屈膝提起，腳掌內扣；支撐腳轉動、展開髖部，把腿向側方直線踹出，上身自然向反方向側倒保持平衡，力量集中於腳跟與腳掌外沿。踹出後收回提膝，再落地。',
        en: 'Stand side-on, eyes towards the target. Chamber the kicking knee with the foot turned in; pivot the support foot, open the hip and drive the leg out sideways in a straight line, letting the body tilt the other way for balance. Power lands on the heel and the outer edge of the foot. Re-chamber, then set the foot down.' },
      mistakes: { zh: '沒有轉動支撐腳，造成膝蓋扭傷風險；用腳尖踢；身體不倒、腿踢不直；踢完直接放腿沒有收回。',
        en: 'Not pivoting the support foot (strains the knee); kicking with the toes; staying upright so the leg can\'t extend; dropping the leg without re-chambering.' },
      practice: { zh: '扶椅背做慢速側踹，每腿 10 次，練習提膝、展髖、收回三個階段；配合髖部伸展。',
        en: 'Holding a chair back, do slow side kicks, 10 per leg, through the three phases chamber–extend–re-chamber; add hip stretches.' },
      use: { zh: '側踹是攻擊距離最遠、力量最集中的腿法之一，在長拳、跆拳道、空手道中都可以看到相近的動作。',
        en: 'The side kick is among the longest-range, most concentrated kicks, with close relatives in Taekwondo and Karate.' },
      bars: [['髖外展力量', 'Hip abductors', 90], ['髖部柔軟度', 'Hip flexibility', 85], ['核心側向穩定', 'Lateral core', 82], ['單腳平衡', 'One-leg balance', 85]] },

    { id: 'stretch', n: 6, kind: 'stretch', zh: '正踢腿', py: 'Zhèng Tī Tuǐ', en: 'Front Stretch Kick',
      type: { zh: '腿法（直擺）', en: 'Kick (straight-leg swing)' }, point: { zh: '—（柔韌訓練）', en: '— (flexibility drill)' },
      height: { zh: '目標：腳尖接近前額', en: 'Goal: toes towards the forehead' },
      tags: { zh: ['基本腿法：直擺性腿法', '柔韌度 · 熱身必練'], en: ['Basic kick: straight-leg swing', 'Flexibility · essential warm-up'] },
      ability: { zh: '腿後肌柔軟度與髖屈肌力量', en: 'Hamstring flexibility and hip-flexor strength' },
      note: { zh: '兩腿伸直 · 勾腳尖 · 上身正直', en: 'BOTH LEGS STRAIGHT · TOES BACK · CHEST UP' },
      how: { zh: '並步站立，雙手叉腰或兩臂側平舉。支撐腿伸直站穩，踢腿伸直、勾起腳尖，由下向前額方向快速踢起，再有控制地落下。左右腿交替，邊走邊踢。',
        en: 'Stand with feet together, hands on hips or arms out to the sides. Keep the support leg straight; swing the kicking leg up straight with the toes pulled back, aiming towards the forehead, then lower it under control. Alternate legs as you walk forward.' },
      mistakes: { zh: '踢起腿彎曲；為了踢高而彎腰低頭；支撐腳跟離地或膝蓋彎曲；用力甩下造成拉傷。',
        en: 'Bending the kicking leg; bending forward to fake the height; support heel lifting or knee bending; slamming the leg down and straining the hamstring.' },
      practice: { zh: '熱身後再練，每腿 10–20 次。高度不夠沒關係，伸直和姿勢比高度更重要；配合每日腿後肌伸展。',
        en: 'Only after a warm-up, 10–20 per leg. Height will come — straight legs and posture matter more. Pair it with daily hamstring stretching.' },
      use: { zh: '正踢腿是幾乎所有功夫課開頭的熱身與柔韌訓練，為高踢腿打下基礎。',
        en: 'The front stretch kick opens almost every kung fu class as a warm-up and flexibility drill, laying the groundwork for high kicks.' },
      bars: [['腿後肌柔軟度', 'Hamstring flexibility', 95], ['髖屈肌力量', 'Hip-flexor strength', 85], ['支撐平衡', 'Support balance', 75], ['核心控制', 'Core control', 72]] }
  ];

  w.STRIKES = { LIST: LIST, makeClip: makeClip };
})(window);
