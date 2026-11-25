/* Wing Chun basics — 8 techniques from the first form (Siu Nim Tao) and
 * the basic kick. Our own wording; lineages (Ip Man, Yuen Kay-San, etc.)
 * differ in details — the page says so.
 */
(function (w) {
  'use strict';
  var S = w.KTFigure.S, C = S.col;
  function m() { var o = {}; for (var i = 0; i < arguments.length; i++) for (var k in arguments[i]) o[k] = arguments[i][k]; return o; }
  function cap(zh, en) { return { zh: zh, en: en }; }

  /* ---------- side view (facing +x) ---------- */
  // (hzN / hzF: how far each hand is from the centre line in the 3D view, ez: how far apart the elbows are - Wing Chun keeps the
  //  elbows in and works on the centre line, which a side drawing cannot show)
  var SIDE = { t: 0, h: 0, fN: { x: 9, y: 78 }, fF: { x: 5, y: 78 }, ftN: 90, ftF: 90, hzN: 1, hzF: 1, ez: 0.55 };
  var N_CHEST = { su: -62, sl: 78, hzN: 1 }, F_CHEST = { fu: -64, fl: 76, hzF: 1 };     // fists drawn back to the sides of the chest, elbows behind
  var N_CENTER = { su: 15, sl: 100, hzN: 0.1 }, F_CENTER = { fu: 12, fl: 102, hzF: 0.1 };  // fist on the centreline, elbow down
  var N_OUT = { su: 84, sl: 94, hzN: 0.1 }, F_OUT = { fu: 84, fl: 94, hzF: 0.1 };          // punch extended on the centreline, elbow not locked
  var F_WU = { fu: 30, fl: 130, hzF: 0.3 };                             // rear guard palm (wu sao)

  /* ---------- front view ---------- */
  // front view legs use angles (knees bend towards the viewer, so the thigh looks shorter: lT)
  var FRONT = { hw: 9, sw: 16, lT: 0.75, tu: -4, tl: 12, bu: 4, bl: -12, ftN: -90, ftF: 90 };   // knees in, feet out, toes in
  var FR_STAND = { hw: 9, sw: 16, lT: 1, tu: 0, tl: 0, bu: 0, bl: 0, ftN: 90, ftF: -90,
    su: 6, sl: 3, fu: -6, fl: -3, laN: 1, laF: 1 };
  var FR_FISTS = { su: 4, sl: 178, laN: 0.5, fu: -4, fl: -178, laF: 0.5 };
  // (front view: an arm drawn shorter reaches towards the viewer - the guard hands sit well in front of the chest, not on it)
  var FR_WU_N = { su: 10, sl: -150, laN: 0.8, luN: 0.9 }, FR_WU_F = { fu: -10, fl: 150, laF: 0.8, luF: 0.9 };

  function clips(id) {
    var c;
    switch (id) {
      case 'stance':
        return {
          front: { frames: [
            { d: 500, p: FR_STAND, c: cap('並步站立，全身放鬆', 'Stand with feet together, relaxed') },
            { d: 600, p: m(FR_STAND, FR_FISTS, { lT: 0.85, tu: -2, tl: 2, bu: 2, bl: -2 }), c: cap('雙拳收於胸側，屈膝下沉', 'Fists to the sides of the chest, bend the knees and sink') },
            { d: 500, p: m(FR_STAND, FR_FISTS, { lT: 0.8, tu: -3, tl: 7, bu: 3, bl: -7, ftN: 90, ftF: -90 }), c: cap('以腳跟為軸，腳尖向外打開', 'Pivot on the heels: toes turn out') },
            { d: 2000, p: m(FRONT, FR_FISTS), c: cap('以腳掌為軸，腳跟向外 → 內八字；膝微向內鉗，坐胯，重心平均', 'Pivot on the balls: heels turn out → toes in; knees gently in, hips tucked, weight even') },
            { d: 700, p: m(FRONT, FR_FISTS) }
          ], strike: null },
          side: { frames: [
            { d: 600, p: m(SIDE, { fN: { x: 2, y: 87 }, fF: { x: -2, y: 87 }, su: 4, sl: 6, fu: -4, fl: -2 }), c: cap('並步站立', 'Stand with feet together') },
            { d: 2200, p: m(SIDE, N_CHEST, F_CHEST), c: cap('側看：膝微屈、上身正直，臀部微收，不前傾', 'From the side: knees soft, back upright, hips tucked — no leaning') },
            { d: 700, p: m(SIDE, N_CHEST, F_CHEST) }
          ], strike: null }
        };
      case 'punch':
        c = [cap('拳置胸前中線，肘尖向下', 'Fist on the centreline in front of the chest, elbow pointing down'),
          cap('沿中線直線打出，拳眼向上（日字拳）', 'Drive straight out along the centreline, fist vertical (thumb side up)'),
          cap('以下三指節觸及目標，肩膀放鬆', 'Land with the bottom three knuckles, shoulder relaxed'),
          cap('沿原路收回中線', 'Return along the same line')];
        return { side: { trail: 'hN', strike: 'hN', frames: [
          { d: 600, p: m(SIDE, N_CENTER, F_CHEST), c: c[0] },
          { d: 160, p: m(SIDE, N_CENTER, F_CHEST), e: 'out', c: c[1] },
          { d: 450, p: m(SIDE, N_OUT, F_CHEST), c: c[2] },
          { d: 300, p: m(SIDE, N_OUT, F_CHEST), c: c[3] }
        ] } };
      case 'chain':
        return { side: { trail: 'hN', strike: 'hN', frames: [
          { d: 600, p: m(SIDE, N_CENTER, F_CENTER), c: cap('雙拳疊在中線上，準備', 'Both fists stacked on the centreline, ready') },
          { d: 170, p: m(SIDE, N_OUT, F_CENTER), c: cap('第一拳沿中線打出', 'First punch out along the centreline') },
          { d: 170, p: m(SIDE, N_CENTER, F_OUT), c: cap('後拳從前臂上方滾出，前拳同時收回', 'The rear fist rolls out over the front forearm as the front fist returns') },
          { d: 170, p: m(SIDE, N_OUT, F_CENTER), c: cap('連續交替，像車輪一樣滾動', 'Keep alternating, like a rolling wheel') },
          { d: 170, p: m(SIDE, N_CENTER, F_OUT) },
          { d: 400, p: m(SIDE, N_OUT, F_CENTER) }
        ] } };
      case 'tan':
        return { side: { trail: 'hN', strike: 'hN', palm: 'up', frames: [
          { d: 600, p: m(SIDE, N_CENTER, F_CHEST), c: cap('手置中線，肘尖向下', 'Hand on the centreline, elbow down') },
          { d: 320, p: m(SIDE, N_CENTER, F_CHEST), c: cap('掌心向上，沿中線向前攤出', 'Turn the palm up and send it forward along the centreline') },
          { d: 900, p: m(SIDE, { su: 22, sl: 84, hzN: 0.3 }, F_CHEST), c: cap('肘離身約一拳，前臂斜向中線，用手臂外側把來力向外引開', 'Elbow about a fist from the body, forearm angled to the centre — the arm guides incoming force aside') },
          { d: 400, p: m(SIDE, { su: 22, sl: 84, hzN: 0.3 }, F_CHEST), c: cap('轉腕收回', 'Circle the wrist and return') }
        ] } };
      case 'bong':
        return { front: { trail: 'eN', strike: 'eN', frames: [
          { d: 600, p: m(FRONT, FR_WU_N, FR_WU_F), c: cap('雙手護中線（護手）', 'Both hands guard the centreline (wu sao)') },
          { d: 320, p: m(FRONT, FR_WU_N, FR_WU_F), c: cap('以肩為軸，手肘向外、向上轉起', 'Rotate from the shoulder: the elbow turns out and up') },
          { d: 1000, p: m(FRONT, { su: 100, sl: -65, laN: 0.9, luN: 0.4 }, FR_WU_F), c: cap('肘高於腕，前臂斜向下指向中線；另一手護在中線後方', 'Elbow above the wrist, forearm slanting down to the centre; the other hand guards behind it') },
          { d: 400, p: m(FRONT, { su: 100, sl: -65, laN: 0.9, luN: 0.4 }, FR_WU_F), c: cap('放鬆還原，膀手不是硬頂', 'Relax back — bong sao deflects, it never pushes hard') }
        ] } };
      case 'fuk':
        return { side: { trail: 'hN', strike: 'hN', palm: 'hook', frames: [
          { d: 600, p: m(SIDE, N_CENTER, F_CHEST), c: cap('手置中線，肘尖向下', 'Hand on the centreline, elbow down') },
          { d: 420, p: m(SIDE, N_CENTER, F_CHEST), c: cap('手掌向前伸出，掌心向下、腕關節微屈成鉤', 'Extend forward, palm down, wrist bent into a soft hook') },
          { d: 1000, p: m(SIDE, { su: 45, sl: 90, hzN: 0.1 }, F_CHEST), c: cap('肘尖向內收回中線，以手腕和前臂「伏」住對方手臂', 'Bring the elbow in to the centre; the wrist and forearm rest on and control the other arm') },
          { d: 400, p: m(SIDE, { su: 45, sl: 90, hzN: 0.1 }, F_CHEST), c: cap('保持放鬆，不壓不頂', 'Stay relaxed — don\'t press down or push') }
        ] } };
      case 'pak':
        return { front: { trail: 'hN', strike: 'hN', frames: [
          { d: 600, p: m(FRONT, { su: 20, sl: 175, laN: 0.7, luN: 0.9 }, FR_WU_F), c: cap('手掌在本側肩前，準備', 'Open hand in front of the same-side shoulder, ready') },
          { d: 150, p: m(FRONT, { su: 20, sl: 175, laN: 0.7, luN: 0.9 }, FR_WU_F), e: 'out', c: cap('以掌心向中線短促拍出，不超過中線太多', 'A short, sharp slap with the palm towards the centreline — don\'t over-travel') },
          { d: 500, p: m(FRONT, { su: -5, sl: -140, laN: 0.8, luN: 0.8 }, FR_WU_F), c: cap('拍開來拳，另一手準備同時反擊', 'Clear the incoming punch while the other hand prepares to strike') },
          { d: 350, p: m(FRONT, { su: -5, sl: -140, laN: 0.8, luN: 0.8 }, FR_WU_F), c: cap('收回護位', 'Return to guard') }
        ] } };
      case 'kick':
        var st = { t: 0, h: 0, fF: { x: 3, y: 78 }, ftF: 90, hzN: 1, hzF: 1, ez: 0.55 };   // the support knee stays bent, as in the stance
        var arms = m(N_CENTER, F_WU);
        var kf = [
          { d: 600, p: m(st, arms, { tu: 33.5, tl: -20.3, ftN: 90 }), c: cap('二字鉗羊馬上，雙手護中線', 'From the stance, hands guarding the centreline') },
          { d: 220, p: m(st, arms, { tu: 78, tl: -24, ftN: 82 }), c: cap('沿中線提膝，重心移到支撐腿', 'Lift the knee along the centreline, weight onto the support leg') },
          { d: 170, p: m(st, arms, { t: -6, tu: 80, tl: 80, ftN: 170 }), e: 'out', c: cap('腳尖向上，以腳跟向前直蹬，高度約在腹部', 'Toes up, drive straight out with the heel at about stomach height') },
          { d: 260, p: m(st, arms, { tu: 78, tl: -24, ftN: 82 }), c: cap('收回提膝，再落回馬步', 'Re-chamber, then settle back into the stance') },
          { d: 420, p: m(st, arms, { tu: 33.5, tl: -20.3, ftN: 90 }) }
        ];
        // (on one leg the hips move over the standing foot - see KTFigure.balanceClip)
        w.KTFigure.balanceClip(kf, { base: { x: 175 } });
        return { side: { trail: 'aN', strike: 'aN', frames: kf } };
    }
  }

  var GUIDE = { on: true };

  function makeClip(s, view, level, lang) {
    var set = clips(s.id), cl = set[view] || set[s.views[0]];
    var front = view === 'front';
    return {
      scale: front ? 1 : 0.95, base: { x: front ? 205 : 175 }, ticks: false, labelAt: [345, 52], still: 0.45,
      farColor: front ? '#596075' : undefined,
      trail: cl.trail, frames: cl.frames,
      props: function (J, c) {
        var fr = '', bk = '', hud = '';
        if (GUIDE.on) {
          if (front) {
            bk += S.line({ x: J.hip.x, y: J.head.y - 24 }, { x: J.hip.x, y: c.gy }, C.red, 1.5, ' stroke-dasharray="5 4" opacity=".6"');
            hud += S.text(18, 30, KT.pick('紅虛線 = 中線', 'RED DASHES = CENTRELINE'), { size: 11, fill: C.red, family: "'JetBrains Mono','Noto Sans TC',monospace" });
          } else if (cl.strike && cl.strike.charAt(0) === 'h') {
            bk += S.line({ x: J.sh.x, y: J.sh.y + 6 }, { x: 415, y: J.sh.y + 6 }, C.red, 1.5, ' stroke-dasharray="5 4" opacity=".55"');
            fr += S.circle(J.eN, 4, C.jade, '#fff', 1.5);
            hud += S.text(18, 30, KT.pick('紅虛線 = 中線出拳路線 · 綠點 = 手肘（向下）', 'RED DASHES = CENTRELINE · GREEN = ELBOW (DOWN)'), { size: 11, fill: C.red, family: "'JetBrains Mono','Noto Sans TC',monospace" });
          }
        }
        if (cl.palm === 'up') fr += S.line({ x: J.hN.x - 2, y: J.hN.y }, { x: J.hN.x + 9, y: J.hN.y - 1 }, C.ink, 5);
        if (cl.palm === 'hook') fr += S.line(J.hN, { x: J.hN.x + 5, y: J.hN.y + 8 }, C.ink, 5);
        if (cl.strike) {
          var p = J[cl.strike];
          var ext = cl.strike === 'aN' ? J.aN.x - J.hip.x > 40 : cl.strike === 'eN' ? J.eN.y < J.sh.y + 6 : (front ? J.hN.x < J.hip.x + 2 : J.hN.x - J.sh.x > 42);
          fr += S.circle(p, ext ? 6.5 : 4, ext ? C.red : '#E3B4AF', '#fff', 1.5);
        }
        return { front: fr, back: bk, hud: hud };
      }
    };
  }

  /* ---------- the eight techniques ---------- */
  var LIST = [
    { id: 'stance', n: 1, views: ['front', 'side'], zh: '二字鉗羊馬', py: 'Yee Jee Kim Yeung Ma', en: 'Wing Chun Basic Stance',
      type: { zh: '馬步', en: 'Stance' }, key: { zh: '內八字、膝內鉗、坐胯', en: 'Toes in, knees in, hips tucked' },
      form: { zh: '小念頭開馬', en: 'Opening of Siu Nim Tao' },
      feet: true,
      tags: { zh: ['詠春根基：二字鉗羊馬', '正身 · 中線 · 穩定'], en: ['Wing Chun root: the "goat-clamping" stance', 'Square body · centreline · stability'] },
      ability: { zh: '下盤結構與中線意識', en: 'Lower-body structure, centreline awareness' },
      note: { zh: '腳尖內扣 · 膝微內鉗 · 重心平均', en: 'TOES IN · KNEES GENTLY IN · WEIGHT EVEN' },
      how: { zh: '並步站立，屈膝下沉；以腳跟為軸把腳尖向外打開，再以前腳掌為軸把腳跟向外推，成內八字。兩腳約與肩同寬，膝蓋微向內鉗（像夾住一隻羊），臀部微收、上身正直，重心平均在兩腳。雙拳收於胸側。',
        en: 'From feet together, bend the knees and sink. Pivot on the heels to turn the toes out, then pivot on the balls of the feet to push the heels out, ending pigeon-toed. Feet are about shoulder-width, knees squeeze gently inward (the "goat-clamping" idea), hips tucked, back upright and weight even. Fists rest at the sides of the chest.' },
      mistakes: { zh: '膝蓋夾得太用力導致膝痛；臀部翹起、上身前傾；腳太寬像馬步；聳肩、全身僵硬。',
        en: 'Squeezing the knees so hard they ache; sticking the hips out and leaning forward; feet too wide like a horse stance; tense shoulders and a rigid body.' },
      practice: { zh: '每天開馬 10 次，每次站 1–3 分鐘，全身放鬆、自然呼吸；這也是練小念頭的起點。',
        en: 'Open the stance 10 times a day and hold 1–3 minutes, relaxed with natural breathing — this is also how Siu Nim Tao begins.' },
      use: { zh: '二字鉗羊馬讓身體正對對方、保護下陰並保持中線，所有詠春手法都從這個結構出發。',
        en: 'The stance squares you to the opponent, protects the groin and keeps the centreline; every Wing Chun hand technique grows from this structure.' },
      bars: [['下盤結構', 'Lower-body structure', 92], ['中線意識', 'Centreline awareness', 88], ['放鬆', 'Relaxation', 80], ['髖膝控制', 'Hip & knee control', 75]] },

    { id: 'punch', n: 2, zh: '日字衝拳', py: 'Yat Ji Chung Kuen', en: 'Vertical Punch',
      type: { zh: '拳法', en: 'Punch' }, key: { zh: '拳眼向上、肘尖向下、沿中線', en: 'Vertical fist, elbow down, on the centreline' },
      form: { zh: '小念頭', en: 'Siu Nim Tao' },
      tags: { zh: ['詠春代表拳法：日字拳', '中線 · 直線 · 短距離'], en: ['Signature punch: the vertical fist', 'Centreline · straight line · short range'] },
      ability: { zh: '直線出力與肘部結構', en: 'Straight-line power and elbow structure' },
      note: { zh: '肘尖向下 · 拳走中線 · 肩不聳', en: 'ELBOW DOWN · CENTRELINE · SHOULDER RELAXED' },
      how: { zh: '拳頭豎立（拳眼向上），放在胸前中線，肘尖向下。出拳時手肘沿中線推送，拳頭直線打出，以下三個指節觸及目標；手臂伸到接近伸直即可，不要鎖死。肩膀放鬆，力量來自肘部推送和身體結構。',
        en: 'Hold the fist upright (thumb side up) on the centreline in front of the chest, elbow pointing down. Drive the elbow forward along the centreline so the fist travels in a straight line and lands with the bottom three knuckles. Extend almost to straight without locking. Keep the shoulder relaxed — the power comes from the elbow drive and body structure.' },
      mistakes: { zh: '手肘向外翻（失去中線結構）；拳頭轉成拳心向下；聳肩或身體前衝；用力鎖死手肘。',
        en: 'Flaring the elbow out (losing the centreline structure); turning the fist palm-down; shrugging or lunging forward; snapping the elbow into a hard lock.' },
      practice: { zh: '對鏡慢打 20 拳，檢查拳是否留在中線、肘是否向下；再對牆靶練習直線打擊。',
        en: '20 slow punches in front of a mirror, checking the fist stays on the centreline and the elbow stays down; then practise on a wall bag.' },
      use: { zh: '日字衝拳路線最短、最直接，是詠春「中線理論」的核心表現。',
        en: 'The vertical punch takes the shortest, most direct path — the clearest expression of Wing Chun\'s centreline theory.' },
      bars: [['肘部結構', 'Elbow structure', 92], ['中線意識', 'Centreline awareness', 90], ['放鬆', 'Relaxation', 82], ['速度', 'Speed', 78]] },

    { id: 'chain', n: 3, zh: '連環拳', py: 'Lin Wan Kuen', en: 'Chain Punch',
      type: { zh: '拳法', en: 'Punch' }, key: { zh: '雙拳交替、沿中線滾動', en: 'Fists alternate, rolling on the centreline' },
      form: { zh: '小念頭（單拳）→ 對練', en: 'Siu Nim Tao (single) → drills' },
      tags: { zh: ['詠春代表技法：連環衝拳', '速度 · 連續 · 協調'], en: ['Signature technique: chain punching', 'Speed · continuity · coordination'] },
      ability: { zh: '雙手協調與連續速度', en: 'Two-hand coordination and continuous speed' },
      note: { zh: '一拳出、一拳收 · 始終守住中線', en: 'ONE OUT, ONE BACK · ALWAYS ON THE CENTRELINE' },
      how: { zh: '雙拳疊在中線上。第一拳打出，同時第二拳在前臂上方沿中線滾出，前一拳收回到下方；兩拳像車輪一樣連續交替，始終有一隻手守住中線。保持肘尖向下、肩膀放鬆，節奏均勻。',
        en: 'Stack both fists on the centreline. Fire the first punch; as the second rolls out over the forearm along the centreline, the first returns underneath. The fists keep cycling like a wheel, so one hand always holds the centreline. Keep the elbows down, shoulders loose and the rhythm even.' },
      mistakes: { zh: '只追求快而失去中線；手臂劃圓圈而不是直線；聳肩、憋氣；拳頭沒有打到位就收回。',
        en: 'Chasing speed and losing the centreline; arms making circles instead of lines; shrugging and holding the breath; pulling back before the punch arrives.' },
      practice: { zh: '先以每秒 1–2 拳慢慢練 30 秒，再逐漸加快；可對牆靶練習，注意呼吸。',
        en: 'Start at 1–2 punches a second for 30 seconds, then build speed; use a wall bag and keep breathing.' },
      use: { zh: '連環拳讓攻擊不間斷，是詠春最為人熟知的技法之一，也常用於近距離連續施壓。',
        en: 'Chain punching keeps attacks continuous and is one of Wing Chun\'s best-known techniques for close-range pressure.' },
      bars: [['雙手協調', 'Two-hand coordination', 92], ['速度耐力', 'Speed endurance', 88], ['中線意識', 'Centreline awareness', 85], ['放鬆', 'Relaxation', 80]] },

    { id: 'tan', n: 4, zh: '攤手', py: 'Tan Sao', en: 'Tan Sao (Dispersing Hand)',
      type: { zh: '手法', en: 'Hand' }, key: { zh: '掌心向上、肘離身一拳', en: 'Palm up, elbow a fist from the body' },
      form: { zh: '小念頭第二段', en: 'Siu Nim Tao, section 2' },
      tags: { zh: ['三大基本手形之一', '攤開 · 引化 · 中線'], en: ['One of the three core arm shapes', 'Disperse · redirect · centreline'] },
      ability: { zh: '手臂結構與引化來力', en: 'Arm structure and redirecting force' },
      note: { zh: '掌心向上 · 肘離身約一拳 · 不聳肩', en: 'PALM UP · ELBOW ONE FIST AWAY · SHOULDER DOWN' },
      how: { zh: '從中線出發，掌心向上，沿中線向前攤出；手肘停在身體前方約一拳距離，前臂斜向中線，手指指向前方。重點是以手臂外側把來力向外引開，而不是用力去撞。',
        en: 'Starting from the centreline, turn the palm up and send the hand forward along it. The elbow settles about a fist\'s distance in front of the body, forearm angled towards the centre, fingers pointing forward. The outer forearm guides incoming force aside — it doesn\'t collide with it.' },
      mistakes: { zh: '手肘伸太出去或貼身；掌心沒有朝上；聳肩用力頂；手偏離中線。',
        en: 'Elbow too far out or jammed against the body; palm not facing up; shrugging and pushing with force; drifting off the centreline.' },
      practice: { zh: '在小念頭中慢慢練習攤手、護手、伏手的轉換，每邊 10 次；感受肘的位置。',
        en: 'Practise the tan–wu–fuk sequence slowly as in Siu Nim Tao, 10 per side, feeling where the elbow sits.' },
      use: { zh: '攤手與膀手、伏手並稱詠春三大基本手形，常用於化解直拳並同時反擊。',
        en: 'Tan sao, bong sao and fuk sao are Wing Chun\'s three core arm shapes; tan sao often redirects a straight punch while you counter at the same time.' },
      bars: [['手臂結構', 'Arm structure', 90], ['引化感覺', 'Redirecting sensitivity', 86], ['中線意識', 'Centreline awareness', 85], ['放鬆', 'Relaxation', 82]] },

    { id: 'bong', n: 5, views: ['front'], zh: '膀手', py: 'Bong Sao', en: 'Bong Sao (Wing Arm)',
      type: { zh: '手法', en: 'Hand' }, key: { zh: '肘高於腕、前臂斜指中線', en: 'Elbow above wrist, forearm slanting to the centre' },
      form: { zh: '小念頭第三段', en: 'Siu Nim Tao, section 3' },
      tags: { zh: ['三大基本手形之一', '翼形 · 轉化 · 不硬頂'], en: ['One of the three core arm shapes', 'Wing shape · deflect · never force'] },
      ability: { zh: '肩部轉動與壓力下的結構', en: 'Shoulder rotation, structure under pressure' },
      note: { zh: '肘高於腕 · 腕在中線 · 肩放鬆', en: 'ELBOW ABOVE WRIST · WRIST ON CENTRE · SHOULDER LOOSE' },
      how: { zh: '以肩為軸，將手肘向外、向上轉起，肘高於手腕；前臂斜向下指向中線，手腕停在中線上。另一手護在中線後方（護手）。膀手是被壓時的「轉化」動作，受力就轉，不用力頂。',
        en: 'Rotate from the shoulder so the elbow turns out and up, higher than the wrist; the forearm slants down to the centreline with the wrist sitting on it. The other hand guards behind on the centreline (wu sao). Bong sao is a pressure-response shape: when force comes, it turns — it never pushes back hard.' },
      mistakes: { zh: '用肩膀力量硬頂；手肘太低變成攤手；手腕離開中線；身體跟著轉歪。',
        en: 'Forcing with the shoulder; elbow too low so it becomes tan sao; wrist leaving the centreline; the whole body twisting off line.' },
      practice: { zh: '攤膀轉換練習：攤手 ↔ 膀手各 20 次，動作小而放鬆；之後在黐手中體會。',
        en: 'Tan–bong transitions, 20 each way, small and relaxed; later feel it in chi sao (sticking hands).' },
      use: { zh: '膀手用於來力強時把它轉開，之後常接攤手或拉手，是黐手中最常見的手形之一。',
        en: 'Bong sao turns strong incoming force aside and often flows into tan sao or a grab; it\'s one of the most common shapes in chi sao.' },
      bars: [['肩部轉動', 'Shoulder rotation', 90], ['受壓結構', 'Structure under pressure', 88], ['放鬆', 'Relaxation', 85], ['中線意識', 'Centreline awareness', 80]] },

    { id: 'fuk', n: 6, zh: '伏手', py: 'Fuk Sao', en: 'Fuk Sao (Bridge-On Hand)',
      type: { zh: '手法', en: 'Hand' }, key: { zh: '腕微鉤、肘收回中線', en: 'Soft wrist hook, elbow in to the centre' },
      form: { zh: '小念頭第二段', en: 'Siu Nim Tao, section 2' },
      tags: { zh: ['三大基本手形之一', '伏 · 控制 · 黐手基礎'], en: ['One of the three core arm shapes', 'Cover · control · chi sao base'] },
      ability: { zh: '手肘控制與觸覺', en: 'Elbow control and touch sensitivity' },
      note: { zh: '腕微屈成鉤 · 肘尖收向中線', en: 'WRIST SOFTLY HOOKED · ELBOW IN TO CENTRE' },
      how: { zh: '手由中線向前伸出，掌心向下，手腕微屈成鉤狀；手肘慢慢向內收回中線（小念頭中以極慢速度練習）。伏手以手腕與前臂「伏」在對方手臂上，用肘的位置控制，而不是向下壓。',
        en: 'Extend the hand forward from the centreline, palm down, wrist softly bent into a hook. Slowly bring the elbow in to the centreline (in Siu Nim Tao this is done very slowly). Fuk sao rests the wrist and forearm on the other person\'s arm and controls it through elbow position, not by pressing down.' },
      mistakes: { zh: '用力往下壓；手肘向外翻；手腕僵硬；練小念頭時動作太快。',
        en: 'Pressing down with force; elbow flaring; a stiff wrist; rushing it in Siu Nim Tao.' },
      practice: { zh: '小念頭第二段的伏手慢慢推出約 1 分鐘，專注手肘移動和放鬆。',
        en: 'In section 2 of Siu Nim Tao, extend fuk sao slowly over about a minute, focusing on the elbow and staying relaxed.' },
      use: { zh: '伏手是黐手中最基本的接觸手形，用來感覺對方的力量方向並控制中線。',
        en: 'Fuk sao is the basic contact shape in chi sao, used to feel the direction of force and control the centreline.' },
      bars: [['手肘控制', 'Elbow control', 92], ['觸覺', 'Sensitivity', 88], ['放鬆', 'Relaxation', 85], ['耐心', 'Patience', 80]] },

    { id: 'pak', n: 7, views: ['front'], zh: '拍手', py: 'Pak Sao', en: 'Pak Sao (Slapping Hand)',
      type: { zh: '手法', en: 'Hand' }, key: { zh: '短促拍向中線、不過度', en: 'Short slap to the centre, no over-travel' },
      form: { zh: '小念頭第三段', en: 'Siu Nim Tao, section 3' },
      tags: { zh: ['基本手法：拍開來拳', '短 · 快 · 同時反擊'], en: ['Basic hand: slap the punch aside', 'Short · fast · counter at once'] },
      ability: { zh: '時機與雙手同時運用', en: 'Timing and using both hands at once' },
      note: { zh: '拍到中線即止 · 另一手同時進攻', en: 'STOP AT THE CENTRE · OTHER HAND ATTACKS TOGETHER' },
      how: { zh: '手掌放鬆，從本側以掌心向中線短促拍出，把來拳拍離中線；拍到中線附近就停，不要大幅橫掃。通常另一手會在同一時間沿中線反擊。',
        en: 'With a relaxed open hand, slap from your own side towards the centreline with the palm, knocking the incoming punch off line. Stop around the centre — no wide sweeps. Usually the other hand counter-strikes along the centreline at the same moment.' },
      mistakes: { zh: '拍得太大、越過中線露出空檔；手臂僵硬；拍完停頓才反擊。',
        en: 'Slapping too wide past the centre and opening yourself up; a stiff arm; pausing before the counter.' },
      practice: { zh: '與同伴慢速對練：一方慢慢出直拳，另一方拍手並同時出拳，每邊 20 次。',
        en: 'With a partner at slow speed: one throws a slow straight punch, the other pak saos and punches at the same time, 20 per side.' },
      use: { zh: '拍手配合衝拳（拍打）是詠春最常見的組合之一，體現「攻守同時」。',
        en: 'Pak sao with a simultaneous punch is one of the most common Wing Chun combinations — defence and attack at the same time.' },
      bars: [['時機', 'Timing', 90], ['雙手協調', 'Two-hand coordination', 88], ['速度', 'Speed', 82], ['中線意識', 'Centreline awareness', 80]] },

    { id: 'kick', n: 8, zh: '正蹬腳', py: 'Jing Geuk', en: 'Wing Chun Front Kick',
      type: { zh: '腿法', en: 'Kick' }, key: { zh: '腳尖向上、腳跟直蹬、低踢', en: 'Toes up, heel drives straight, kept low' },
      form: { zh: '尋橋、木人樁', en: 'Chum Kiu, wooden dummy' },
      tags: { zh: ['詠春腿法：正蹬腳', '低 · 直 · 腳跟發力'], en: ['Wing Chun kick: the front heel kick', 'Low · straight · heel power'] },
      ability: { zh: '單腳平衡與直線推蹬', en: 'One-leg balance and straight thrust' },
      note: { zh: '沿中線提膝 · 腳跟直蹬 · 不後仰', en: 'KNEE UP THE CENTRE · HEEL STRAIGHT OUT · NO LEANING BACK' },
      how: { zh: '從二字鉗羊馬出發，雙手護中線。重心移到支撐腿，沿中線提膝，腳尖勾起；以腳跟直線向前蹬出，高度約在膝到腹部之間。上身保持正直，蹬完收回提膝再落地。',
        en: 'From the basic stance with hands guarding the centreline, shift weight to the support leg and lift the knee up the centreline with the toes pulled back. Drive the heel straight out at roughly knee-to-stomach height. Keep the body upright, then re-chamber and set the foot down.' },
      mistakes: { zh: '踢太高、失去平衡；上身後仰；用腳尖踢；踢完沒有收回。',
        en: 'Kicking too high and losing balance; leaning back; kicking with the toes; not re-chambering.' },
      practice: { zh: '扶牆慢踢每腿 10 次，再對厚墊練習推蹬；保持雙手在中線上。',
        en: 'Slow kicks with a hand on a wall, 10 per leg, then push into a thick pad; keep the hands on the centreline.' },
      use: { zh: '詠春腿法低而直，常與手法同時使用，不追求高度。',
        en: 'Wing Chun kicks stay low and direct and are often thrown together with hand techniques — height isn\'t the goal.' },
      bars: [['單腳平衡', 'One-leg balance', 88], ['直線推蹬', 'Straight thrust', 86], ['上身控制', 'Upper-body control', 80], ['時機', 'Timing', 75]] }
  ];

  LIST.forEach(function (s) { if (!s.views) s.views = ['side']; });
  w.WINGCHUN = { LIST: LIST, makeClip: makeClip, GUIDE: GUIDE };
})(window);
