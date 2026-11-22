/* Golf swing — 10 lessons: setup, the five swing positions, full iron swing,
 * driver, chip and putt. Face-on view (camera in front of the golfer, target
 * to the right) for the swing; down-the-line side view for the setup posture.
 * Our own wording of widely taught golf fundamentals. Right-handed golfer by
 * default; the mirror button shows a left-handed golfer.
 */
(function (w) {
  'use strict';
  var F = w.KTFigure, S = F.S, C = S.col, D2R = Math.PI / 180;
  function cap(zh, en) { return { zh: zh, en: en }; }
  function m() { var o = {}; for (var i = 0; i < arguments.length; i++) for (var k in arguments[i]) o[k] = arguments[i][k]; return o; }
  function angTo(a, b) { return Math.atan2(b.x - a.x, b.y - a.y) / D2R; }
  function dist(a, b) { return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y)); }

  var X0 = 175, SCALE = 0.84;
  var CLUBS = {
    iron:   { st: 20, ball: 2,  CL: 82, tee: 0, tOff: 0,  fly: [300, 190] },
    driver: { st: 25, ball: 15, CL: 92, tee: 4, tOff: -4, fly: [330, 215] },
    wedge:  { st: 11,  ball: -2, CL: 76, tee: 0, tOff: 0,  fly: [150, 0], hop: 42 },
    putter: { st: 12,  ball: 3,  CL: 0,  tee: 0, tOff: 0,  fly: [170, 0], roll: 1 }
  };

  /* ---------- face-on key positions (A = lead-arm angle, ca = club angle) ---------- */
  var SWING = {
    address:  { A: 4,    ca: 'ball', sw: 16, hw: 9, dx: 0,  t: -6 },
    takeaway: { A: -35,  ca: -50,    sw: 12, hw: 8, dx: -1, t: -6 },
    half:     { A: -90,  ca: -180,   sw: 7,  hw: 7, dx: -2, t: -5 },
    top:      { A: -150, ca: -265,   sw: 4,  hw: 6, dx: -3, t: -4, R: 52 },
    trans:    { A: -135, ca: -262,   sw: 6,  hw: 6, dx: 2,  t: -6, R: 52 },
    down:     { A: -85,  ca: -192,   sw: 11, hw: 7, dx: 6,  t: -9 },
    late:     { A: -40,  ca: -112,   sw: 14, hw: 8, dx: 8,  t: -12 },
    impact:   { A: 2,    ca: 'ball', sw: 15, hw: 7, dx: 9,  t: -13 },
    release:  { A: 45,   ca: 80,     sw: 11, hw: 6, dx: 10, t: -12 },
    follow:   { A: 95,   ca: 185,    sw: 8,  hw: 5, dx: 11, t: -11, R: 50 },
    finish:   { A: 140,  ca: 255,    sw: 5,  hw: 3, dx: 12, t: -10, R: 42, toe: 1 }
  };
  var CHIP = {
    address: { A: 4,   ca: 'ball', sw: 16, hw: 9, dx: 4, t: -3 },
    back:    { A: -40, ca: -55,    sw: 14, hw: 8, dx: 4, t: -3 },
    impact:  { A: 2,   ca: 'ball', sw: 15, hw: 8, dx: 5, t: -4 },
    through: { A: 35,  ca: 42,     sw: 13, hw: 7, dx: 5, t: -4 }
  };
  var PUTT = {
    address: { A: 3,   ca: 'ball', sw: 16, hw: 9, dx: 0, t: -2, R: 54 },
    back:    { A: -14, ca: 'rot',  sw: 16, hw: 9, dx: 0, t: -2, R: 54 },
    impact:  { A: 3,   ca: 'ball', sw: 16, hw: 9, dx: 0, t: -2, R: 54 },
    through: { A: 16,  ca: 'rot',  sw: 16, hw: 9, dx: 0, t: -2, R: 54 }
  };

  // build one face-on pose; every pose carries the same keys (targets + club + ball)
  function front(k, club, extra) {
    var cfg = CLUBS[club], t = k.t + cfg.tOff, ct = Math.cos(t * D2R), stt = Math.sin(t * D2R);
    var sh = { x: 58 * stt, y: -58 * ct };
    var shN = { x: sh.x + k.sw * ct, y: sh.y + k.sw * stt };
    var R = k.R || 55, A = k.A * D2R;
    var G = { x: shN.x + R * Math.sin(A), y: shN.y + R * Math.cos(A) };
    var dx = k.dx, st = k.st || cfg.st;
    var ball = { x: cfg.ball - dx, y: 86.5 - cfg.tee };
    var ca, cl;
    if (k.ca === 'ball' || k.ca === 'rot') {
      ca = angTo(G, ball); cl = dist(G, ball);
      if (k.ca === 'rot') { var a0 = front(PUTT.address, club); ca = a0.ca + (k.A - PUTT.address.A); cl = a0.cl; }
    } else { ca = k.ca; cl = cfg.CL; }
    return m({
      x: X0 + dx, t: t, h: -t * 0.7, hw: k.hw, sw: k.sw, lT: 1,
      fN: { x: st - dx, y: 87 }, fF: k.toe ? { x: -st + 9 - dx, y: 80 } : { x: -st - dx, y: 87 },
      ftN: 90, ftF: k.toe ? -20 : -90, kbN: -1, kbF: 1,
      hN: G, hF: G, ca: ca, cl: cl, bt: 0, bv: 0
    }, extra || {});
  }

  // down-the-line side view (setup only): ball in front of the golfer
  var SIDE_BALL = { x: 91, y: 79.5 };
  function side(t, h, dx, footY, hold, onBall) {
    var ct = Math.cos(t * D2R), stt = Math.sin(t * D2R);
    var sh = { x: 58 * stt, y: -58 * ct };
    var G = { x: sh.x + hold.x, y: sh.y + hold.y };
    var ball = { x: SIDE_BALL.x - dx, y: SIDE_BALL.y };
    var ca = onBall ? angTo(G, ball) : 40, cl = onBall ? dist(G, ball) : 94;
    return {
      x: X0 + dx, t: t, h: h, hw: 0, sw: 0, lT: 1,
      fN: { x: 2 - dx, y: footY }, fF: { x: -2 - dx, y: footY }, ftN: 90, ftF: 90, kbN: 1, kbF: 1,
      hN: G, hF: { x: G.x - 2, y: G.y + 1 }, ca: ca, cl: cl, bt: 0, bv: 0
    };
  }

  /* ---------- clip lists ---------- */
  function swingFrames(club, pace) {
    var K = function (n, x) { return front(SWING[n], club, x); };
    var BT1 = { bt: 1, bv: 1 }, HID = { bt: 1, bv: 0 };
    return {
      setupFront: [
        { d: 800, p: front(m(SWING.address, { sw: 16, t: 0, st: 7 }), club, {}), c: cap('雙腳併攏站直，球桿放在球後', 'Stand tall, feet together, club behind the ball') },
        { d: 1400, p: K('address'), e: 'out', c: cap('雙腳打開約肩寬，上身微微向右傾（遠離目標）', 'Feet about shoulder-width, upper body tilted slightly away from the target') },
        { d: 600, p: K('address') }
      ],
      takeaway: [
        { d: 700, p: K('address'), c: cap('準備站姿', 'Setup position') },
        { d: 1200, p: K('takeaway'), c: cap('肩膀、手臂、球桿一起轉，桿頭貼地低低地往後', 'Shoulders, arms and club move back together; the clubhead stays low') },
        { d: 500, p: K('takeaway') }
      ],
      top: [
        { d: 400, p: K('takeaway'), c: cap('起桿', 'Takeaway') },
        { d: 300, p: K('half'), c: cap('手腕自然折起，球桿指向天空', 'Wrists hinge; the club points up to the sky') },
        { d: 1300, p: K('top'), c: cap('上桿頂點：背對目標，肩膀轉約 90°', 'Top: back to the target, shoulders turned about 90°') },
        { d: 300, p: K('top') },
        { d: 300, p: K('half') }
      ],
      downswing: [
        { d: 700, p: K('top'), c: cap('上桿頂點', 'Top of the backswing') },
        { d: 140, p: K('trans'), c: cap('下半身先動：重心往前腳移', 'Lower body starts first: weight shifts to the front foot') },
        { d: 1300, p: K('down'), c: cap('手臂落下，手腕保持折角（蓄力）', 'Arms drop with the wrists still hinged — stored power') },
        { d: 300, p: K('down') },
        { d: 300, p: K('trans') }
      ],
      impact: [
        { d: 700, p: K('down'), c: cap('下桿', 'Downswing') },
        { d: 90, p: K('late') },
        { d: 260, p: K('impact'), c: cap('擊球：手在球的前方，重心在前腳', 'Impact: hands ahead of the ball, weight on the front foot') },
        { d: 1100, p: K('impact', BT1) },
        { d: 300, p: K('impact', HID) },
        { d: 300, p: K('late', HID) }
      ],
      finish: [
        { d: 600, p: K('impact'), c: cap('擊球', 'Impact') },
        { d: 110, p: K('release', { bt: 0.5, bv: 1 }) },
        { d: 160, p: K('follow', BT1), c: cap('送桿：雙手伸直朝目標', 'Follow-through: arms extend towards the target') },
        { d: 1400, p: K('finish', BT1), c: cap('收桿：胸口面向目標，站穩在前腳，後腳腳尖點地', 'Finish: chest facing the target, balanced on the front foot, back toe on the ground') },
        { d: 300, p: K('finish', HID) },
        { d: 280, p: K('follow', HID) },
        { d: 280, p: K('release', HID) }
      ],
      full: [
        { d: 700, p: K('address'), c: cap('準備站姿', 'Setup') },
        { d: 250, p: K('address') },
        { d: 250, p: K('takeaway'), c: cap('起桿', 'Takeaway') },
        { d: 250, p: K('half') },
        { d: 90, p: K('top'), c: cap('上桿頂點（約 0.75 秒）', 'Top (about 0.75 s)') },
        { d: 60, p: K('trans') },
        { d: 80, p: K('down'), c: cap('下桿（約 0.25 秒）', 'Downswing (about 0.25 s)') },
        { d: 60, p: K('late') },
        { d: 60, p: K('impact'), c: cap('擊球', 'Impact') },
        { d: 90, p: K('release', { bt: 0.5, bv: 1 }) },
        { d: 150, p: K('follow', BT1) },
        { d: 1500, p: K('finish', BT1), c: cap('收桿，平衡站好', 'Balanced finish') },
        { d: 400, p: K('finish', HID) },
        { d: 300, p: K('follow', HID) }
      ]
    };
  }
  function shortFrames(kind, club) {
    var T = kind === 'chip' ? CHIP : PUTT;
    var K = function (n, x) { return front(T[n], club, x); };
    var c = kind === 'chip'
      ? [cap('球放在中間偏後，重心偏前腳', 'Ball slightly back, weight leaning on the front foot'),
         cap('像鐘擺一樣小幅後擺，手腕幾乎不折', 'Small pendulum backswing, wrists barely hinge'),
         cap('向下輕擦過球，手保持在球前', 'Brush down through the ball, hands staying ahead'),
         cap('短收桿，球輕輕飛起後滾向洞口', 'Short finish — the ball pops up, lands and rolls')]
      : [cap('雙眼在球的正上方，手臂自然下垂', 'Eyes over the ball, arms hanging naturally'),
         cap('用肩膀擺動，像鐘擺一樣後擺', 'Rock the shoulders back like a pendulum'),
         cap('身體不動，等速穿過球', 'Body still, smooth even pace through the ball'),
         cap('送桿距離和後擺差不多，頭留在原地', 'Follow through as far as you swung back; keep the head still')];
    return [
      { d: 700, p: K('address'), c: c[0] },
      { d: kind === 'chip' ? 450 : 600, p: K('back'), c: c[1] },
      { d: kind === 'chip' ? 300 : 380, p: K('impact'), c: c[2] },
      { d: 1100, p: K('through', { bt: 1, bv: 1 }), c: c[3] },
      { d: 500, p: K('through', { bt: 1, bv: 0 }) }
    ];
  }
  var SIDE_SETUP = [
    { d: 800, p: side(2, 0, 0, 86, { x: 12, y: 52 }, false), c: cap('站直，雙手握桿放在身前', 'Stand tall holding the club out in front') },
    { d: 1500, p: side(38, 12, -6, 80, { x: 8, y: 47 }, true), e: 'out', c: cap('從髖部向前傾、臀部往後推，膝蓋微彎，背部保持平直', 'Hinge forward from the hips, push the seat back, soften the knees, keep the back flat') },
    { d: 600, p: side(38, 12, -6, 80, { x: 8, y: 47 }, true), c: cap('手臂從肩膀自然垂下，桿頭放在球後', 'Arms hang straight down from the shoulders; club rests behind the ball') }
  ];

  /* ---------- painter: club, ball, guides ---------- */
  function makeClip(s, view, level, lang) {
    var pace = level < 1 ? 3 : 1;
    var club = s.club, cfg = CLUBS[club], frames;
    if (s.id === 'setup') frames = view === 'side' ? SIDE_SETUP : swingFrames(club).setupFront;
    else if (s.short) frames = shortFrames(s.short, club);
    else frames = swingFrames(club)[s.phase];
    frames = frames.map(function (fr) { return { d: Math.round(fr.d * pace), p: fr.p, e: fr.e, c: fr.c }; });
    var isSide = view === 'side';
    var opt = { groundY: 214, scale: SCALE, cx: X0 };
    var addr = s.short ? front((s.short === 'chip' ? CHIP : PUTT).address, club) : front(SWING.address, club);
    var headRef = isSide ? null : F.solve(m({ su: 0, sl: 0, fu: 0, fl: 0, tu: 0, tl: 0, bu: 0, bl: 0 }, addr), opt).head;
    var bw = isSide ? SIDE_BALL.x : cfg.ball, bY = isSide ? 3.5 : 3.5 + cfg.tee;
    var rest = { x: X0 + (X0 + bw - X0) * SCALE, y: 214 - bY * SCALE };

    return {
      scale: SCALE, base: { x: X0 }, cx: X0, ticks: false, labelAt: [352, 34], still: 0.35,
      farColor: isSide ? undefined : '#5D6475',
      trail: isSide ? null : 'ch', frames: frames,
      props: function (J, c) {
        var p = c.pose, sc = c.scale, back = '', fr = '', hud = '';
        var g = J.hN, head = { x: g.x + p.cl * sc * Math.sin(p.ca * D2R), y: g.y + p.cl * sc * Math.cos(p.ca * D2R) };
        J.ch = head;                                   // the player's trail follows the clubhead
        // guides
        if (isSide) {
          // spine-angle guide, drawn just behind the back so the torso doesn't hide it
          var vx = J.sh.x - J.hip.x, vy = J.sh.y - J.hip.y, vl = Math.sqrt(vx * vx + vy * vy) || 1;
          var ox = vy / vl * 9, oy = -vx / vl * 9;
          fr += S.line({ x: J.hip.x - vx * 0.25 + ox, y: J.hip.y - vy * 0.25 + oy }, { x: J.sh.x + vx * 0.4 + ox, y: J.sh.y + vy * 0.4 + oy }, C.red, 1.8, ' stroke-dasharray="5 4"');
        } else {
          back += S.line({ x: rest.x, y: c.gy }, { x: rest.x, y: c.gy - 150 }, '#D5D3CC', 1.2, ' stroke-dasharray="3 5"');
          if (headRef) back += S.circle(headRef, 15, 'none', C.jade, 1.4, ' stroke-dasharray="3 3" opacity=".8"');
        }
        if (cfg.tee && !isSide) back += S.line({ x: rest.x, y: c.gy }, { x: rest.x, y: rest.y + 2 }, '#C9A46A', 2.2);
        // club
        var dir = (p.ca + 90) * D2R, hl = (club === 'putter' ? 7 : 6) * sc;
        fr += S.line(g, head, C.ink, 2.4);
        fr += S.line(head, { x: head.x + hl * Math.sin(dir), y: head.y + hl * Math.cos(dir) }, C.ink, 4.2);
        // ball
        if (p.bt < 0.02 || p.bv > 0.98) {
          var b = { x: rest.x, y: rest.y }, k = Math.min(1, p.bt);
          if (cfg.roll) b.x += k * cfg.fly[0];
          else if (cfg.hop) { b.x += k * cfg.fly[0]; b.y -= Math.sin(Math.min(1, k * 1.4) * Math.PI) * cfg.hop; }
          else { b.x += k * cfg.fly[0]; b.y -= k * cfg.fly[1]; }
          fr += S.circle(b, 3.6, '#fff', C.ink, 1.6);
        }
        if (isSide) hud += S.text(18, 30, KT.pick('紅線＝背部角度（保持平直）', 'RED LINE = SPINE ANGLE (KEEP IT FLAT)'), { size: 11, fill: C.red, family: "'JetBrains Mono','Noto Sans TC',monospace" });
        else hud += S.text(18, 30, KT.pick('綠圈＝頭部保持穩定', 'GREEN RING = KEEP THE HEAD STEADY'), { size: 11, fill: C.jade, family: "'JetBrains Mono','Noto Sans TC',monospace" });
        return { back: back, front: fr, hud: hud };
      }
    };
  }

  /* ---------- the ten lessons ---------- */
  var LIST = [
    { id: 'setup', n: 1, club: 'iron', views: ['side', 'front'], zh: '準備站姿', py: 'Setup / Address', en: 'Setup (Address)',
      type: { zh: '基本功', en: 'Fundamentals' }, key: { zh: '背部平直、膝蓋微彎', en: 'Flat back, soft knees' },
      tags: { zh: ['好揮桿從站姿開始', '側面看姿勢 · 正面看寬度'], en: ['A good swing starts here', 'Side view for posture · front view for width'] },
      ability: { zh: '穩定的姿勢與平衡', en: 'A stable, balanced posture' },
      note: { zh: '從髖部前傾 · 膝微彎 · 手臂自然下垂', en: 'HINGE AT THE HIPS · SOFT KNEES · ARMS HANG' },
      how: { zh: '雙腳打開約與肩同寬，從髖部（不是腰）向前傾，臀部往後推，背部保持平直，膝蓋微彎。手臂從肩膀自然垂下握住球桿，桿頭放在球的正後方。從正面看，上身稍微向遠離目標的方向傾斜（右手球員往右），重心平均落在兩腳。',
        en: 'Set your feet about shoulder-width apart. Bend forward from the hips (not the waist), pushing your seat back with a flat back and softly bent knees. Let your arms hang straight down from the shoulders to hold the club, with the clubhead just behind the ball. From the front, your upper body tilts slightly away from the target, and your weight is even on both feet.' },
      mistakes: { zh: '彎腰駝背；膝蓋彎太多像坐椅子；站太遠，手臂伸出去夠球；站得太直。', en: 'Rounding the back; bending the knees so much it looks like sitting; standing too far away and reaching for the ball; standing too upright.' },
      practice: { zh: '把球桿貼在背上（頭、上背、臀部三點接觸），從髖部前傾到準備角度，練 10 次；再對鏡從側面檢查。', en: 'Hold a club along your spine (touching head, upper back and seat) and hinge to your setup angle 10 times; then check side-on in a mirror.' },
      use: { zh: '大部分揮桿問題都源自站姿。站姿正確，身體才能順利轉動、揮桿才能重複。', en: 'Most swing faults start at setup. The right posture lets the body turn freely and makes the swing repeatable.' },
      bars: [['姿勢', 'Posture', 92], ['平衡', 'Balance', 85], ['與球距離', 'Distance from the ball', 80], ['瞄準方向', 'Alignment', 75]] },

    { id: 'takeaway', n: 2, club: 'iron', phase: 'takeaway', views: ['front'], zh: '起桿', py: 'Takeaway', en: 'Takeaway',
      type: { zh: '揮桿階段 1', en: 'Swing phase 1' }, key: { zh: '一起轉、桿頭低', en: 'Move together, clubhead low' },
      tags: { zh: ['揮桿的第一個動作', '低、慢、一體'], en: ['The first move of the swing', 'Low, slow, together'] },
      ability: { zh: '肩膀帶動、節奏', en: 'Shoulder-led movement and rhythm' },
      note: { zh: '肩膀帶動 · 桿頭低 · 不要急', en: 'SHOULDERS LEAD · CLUBHEAD LOW · DON\'T RUSH' },
      how: { zh: '肩膀、手臂和球桿像一個整體一起往後轉，桿頭貼著地面低低地往後拉，手腕先不要折。到手大約在右腿前方（右手球員）時，桿身與地面平行、桿頭朝上。',
        en: 'Turn the shoulders, arms and club back together as one piece, keeping the clubhead low to the ground and the wrists quiet. By the time your hands pass your back leg, the shaft is roughly parallel to the ground with the toe of the club pointing up.' },
      mistakes: { zh: '只用手把球桿提起來；手腕太早折；起桿太快；身體往後晃動。', en: 'Lifting the club with the hands only; hinging the wrists too early; snatching it back too fast; swaying the body away from the target.' },
      practice: { zh: '把第二支球桿或尺放在球後方地上，起桿時讓桿頭沿著它往後走 30 公分，練 15 次。', en: 'Lay a second club or ruler on the ground behind the ball and let the clubhead track along it for the first foot (30 cm) of the takeaway, 15 times.' },
      use: { zh: '起桿決定了整個揮桿的路線和節奏，開始對了，後面就容易對。', en: 'The takeaway sets the path and tempo of the whole swing — start it right and the rest follows more easily.' },
      bars: [['肩膀帶動', 'Shoulder turn', 85], ['節奏', 'Tempo', 88], ['桿頭路線', 'Club path', 82], ['手腕穩定', 'Quiet wrists', 75]] },

    { id: 'top', n: 3, club: 'iron', phase: 'top', views: ['front'], zh: '上桿頂點', py: 'Top of Backswing', en: 'Top of the Backswing',
      type: { zh: '揮桿階段 2', en: 'Swing phase 2' }, key: { zh: '肩轉 90°、背對目標', en: 'Shoulders 90°, back to the target' },
      tags: { zh: ['儲存力量的位置', '轉身，不是抬手'], en: ['Where the power is stored', 'Turn, don\'t lift'] },
      ability: { zh: '上身轉動與柔軟度', en: 'Upper-body rotation and flexibility' },
      note: { zh: '肩轉約 90° · 髖轉約 45° · 左手臂伸直', en: 'SHOULDERS ~90° · HIPS ~45° · LEAD ARM STRAIGHT' },
      how: { zh: '繼續轉肩到背部對著目標，肩膀轉約 90°、髖部約 45°。手腕自然折起，左手臂（右手球員）保持伸直但不僵硬，重心大多在後腳內側。頭部大致留在原位。',
        en: 'Keep turning until your back faces the target — about 90° of shoulder turn and 45° of hip turn. The wrists hinge naturally, the lead arm stays straight but not stiff, and most of your weight sits on the inside of the back foot. The head stays roughly where it started.' },
      mistakes: { zh: '只抬手臂不轉身；左手臂彎曲；重心移到後腳外側（晃動）；上桿過頭、球桿垂下。', en: 'Lifting the arms without turning; bending the lead arm a lot; swaying so the weight goes to the outside of the back foot; overswinging so the club droops.' },
      practice: { zh: '雙手交叉抱胸，做出背對目標的轉身，停 2 秒，再轉回來，練 10 次；再拿球桿做到頂點停住。', en: 'Cross your arms over your chest, turn your back to the target, hold 2 seconds and turn back, 10 times; then do it with a club and pause at the top.' },
      use: { zh: '頂點是力量儲存的地方。轉身轉夠，下桿才有足夠的空間和速度。', en: 'The top is where the power is loaded; a full turn gives the downswing room and speed.' },
      bars: [['肩膀轉動', 'Shoulder turn', 92], ['柔軟度', 'Flexibility', 85], ['手臂結構', 'Arm structure', 78], ['重心控制', 'Weight control', 80]] },

    { id: 'downswing', n: 4, club: 'iron', phase: 'downswing', views: ['front'], zh: '下桿', py: 'Downswing', en: 'Downswing',
      type: { zh: '揮桿階段 3', en: 'Swing phase 3' }, key: { zh: '下半身先動', en: 'Lower body leads' },
      tags: { zh: ['由下往上的順序', '保持手腕折角'], en: ['Ground-up sequence', 'Keep the wrist hinge'] },
      ability: { zh: '動作順序與爆發力', en: 'Sequencing and explosive power' },
      note: { zh: '先移重心 · 再轉髖 · 最後手臂', en: 'WEIGHT SHIFT · THEN HIPS · THEN ARMS' },
      how: { zh: '下桿從下半身開始：先把重心移向前腳，接著髖部轉向目標，肩膀、手臂最後跟上。手臂落下時手腕仍保持折角（像拉著鞭子），把力量留到接近擊球才釋放。',
        en: 'The downswing starts from the ground up: shift your weight towards the front foot, then turn the hips towards the target, and let the shoulders and arms follow. As the arms drop, keep the wrist hinge (like cracking a whip) so the stored speed is released just before impact.' },
      mistakes: { zh: '用手和肩膀先打（造成由外往內的切球）；太早放掉手腕；重心留在後腳。', en: 'Starting with the hands and shoulders (an over-the-top, slicing path); releasing the wrists too early ("casting"); leaving the weight on the back foot.' },
      practice: { zh: '在頂點停 1 秒，先「踩」向前腳再揮下來，慢速練 15 次；感受髖部帶動手臂。', en: 'Pause at the top for a second, then "step" into the front foot before swinging down — 15 slow reps, feeling the hips pull the arms.' },
      use: { zh: '正確的順序讓速度一節一節累加，到桿頭最快——這就是職業球員看起來不費力卻打得很遠的原因。', en: 'The right order adds speed link by link until it peaks in the clubhead — why good players look effortless yet hit it far.' },
      bars: [['重心轉移', 'Weight shift', 90], ['髖部轉動', 'Hip rotation', 88], ['手腕蓄力', 'Wrist lag', 82], ['動作順序', 'Sequencing', 92]] },

    { id: 'impact', n: 5, club: 'iron', phase: 'impact', views: ['front'], zh: '擊球', py: 'Impact', en: 'Impact',
      type: { zh: '揮桿階段 4', en: 'Swing phase 4' }, key: { zh: '手在球前、重心在前腳', en: 'Hands ahead, weight forward' },
      tags: { zh: ['揮桿中最重要的一瞬間', '先擊球、再擊地'], en: ['The moment that matters most', 'Ball first, then the ground'] },
      ability: { zh: '擊球品質', en: 'Strike quality' },
      note: { zh: '手在球前 · 重心在前腳 · 頭在球後', en: 'HANDS AHEAD · WEIGHT FORWARD · HEAD BEHIND THE BALL' },
      how: { zh: '擊球時，雙手位置在球的前方（靠目標那側），桿身微微向前傾，重心大約 70–80% 在前腳，髖部已經轉開面向目標一些，頭部仍在球的後方。鐵桿是「先擊球、再擦過草皮」。',
        en: 'At impact your hands are slightly ahead of the ball (towards the target) with the shaft leaning forward, roughly 70–80% of your weight is on the front foot, the hips have opened towards the target, and the head is still behind the ball. With irons you strike the ball first, then brush the turf.' },
      mistakes: { zh: '想把球「撈」起來（手腕翻、手在球後）；重心往後倒；抬頭看球飛去哪。', en: 'Trying to scoop the ball into the air (flipping the wrists, hands behind the ball); falling back onto the back foot; looking up early to see where it went.' },
      practice: { zh: '在球前約 10 公分放一枚硬幣或毛巾，揮桿時讓桿頭擊球後也擦過那個點；慢速半揮桿 20 次。', en: 'Put a coin or towel 10 cm in front of the ball and make the club brush that spot after the ball — 20 slow half-swings.' },
      use: { zh: '揮桿的其他部分都是為了在這一瞬間做對；擊球位置正確，球就會飛得又直又扎實。', en: 'Everything else in the swing exists to get this instant right; a solid impact position sends the ball straight and solid.' },
      bars: [['擊球位置', 'Impact position', 92], ['重心在前', 'Weight forward', 88], ['手腕結構', 'Wrist position', 85], ['頭部穩定', 'Steady head', 80]] },

    { id: 'finish', n: 6, club: 'iron', phase: 'finish', views: ['front'], zh: '送桿與收桿', py: 'Follow-through & Finish', en: 'Follow-through & Finish',
      type: { zh: '揮桿階段 5', en: 'Swing phase 5' }, key: { zh: '面向目標、站穩', en: 'Face the target, hold it' },
      tags: { zh: ['好收桿代表好揮桿', '平衡站 3 秒'], en: ['A good finish shows a good swing', 'Hold it for 3 seconds'] },
      ability: { zh: '平衡與完整轉身', en: 'Balance and a full turn' },
      note: { zh: '胸口面向目標 · 重心在前腳 · 後腳尖點地', en: 'CHEST TO TARGET · WEIGHT ON FRONT FOOT · BACK TOE DOWN' },
      how: { zh: '擊球後讓雙手和球桿順勢朝目標伸出，身體繼續轉到胸口和皮帶扣面向目標。收桿時幾乎全部重心在前腳，後腳只剩腳尖點地，球桿繞到肩後，站穩不晃。',
        en: 'After impact let the arms and club extend towards the target and keep turning until your chest and belt buckle face it. In the finish nearly all your weight is on the front foot, the back foot is up on its toe, the club wraps over your shoulder, and you are balanced and still.' },
      mistakes: { zh: '擊到球就停（沒有送桿）；收桿時往後倒；後腳整個平貼地面；收桿站不穩。', en: 'Stopping at the ball with no follow-through; falling backwards; leaving the back foot flat; wobbling at the finish.' },
      practice: { zh: '每次揮桿後都在收桿位置站 3 秒不動，像拍照一樣；站不穩就代表揮桿太用力。', en: 'After every swing hold your finish for 3 seconds like posing for a photo; if you can\'t, you are swinging too hard.' },
      use: { zh: '收桿是整個揮桿的結果：能站穩，代表重心轉移和轉身都做到了。', en: 'The finish is the result of the whole swing: holding it means your weight shift and turn were complete.' },
      bars: [['平衡', 'Balance', 92], ['完整轉身', 'Full rotation', 88], ['重心轉移', 'Weight shift', 85], ['放鬆', 'Relaxation', 75]] },

    { id: 'full', n: 7, club: 'iron', phase: 'full', views: ['front'], zh: '完整揮桿（鐵桿）', py: 'Full Swing — Iron', en: 'Full Swing (Iron)',
      type: { zh: '完整揮桿', en: 'Full swing' }, key: { zh: '節奏 3 : 1', en: 'Tempo 3 : 1' },
      tags: { zh: ['把五個階段連起來', '上桿慢、下桿快'], en: ['All five phases joined up', 'Slow back, fast through'] },
      ability: { zh: '節奏與流暢度', en: 'Tempo and flow' },
      note: { zh: '上桿與下桿時間約 3 : 1', en: 'TEMPO: BACKSWING 3 : DOWNSWING 1' },
      how: { zh: '把站姿、起桿、頂點、下桿、擊球、收桿連成一個流暢的動作。大多數好球員的節奏是上桿時間約為下桿的 3 倍：上桿約 0.75 秒、下桿約 0.25 秒。切換「實際速度」可以看真實節奏。',
        en: 'Join setup, takeaway, top, downswing, impact and finish into one smooth motion. Most good players swing with a tempo of about 3 : 1 — roughly 0.75 s back and 0.25 s down. Switch to "Real tempo" to see it at true speed.' },
      mistakes: { zh: '上桿太快；在頂點急著打；全程用力（肌肉越緊越慢）；每個階段分開做、不連貫。', en: 'Rushing the backswing; hurrying from the top; gripping and tensing everything (tension slows you down); swinging in separate jerky pieces.' },
      practice: { zh: '揮桿時心中數「一、二、三」上桿，「打」下桿；或用節拍器 App。先用 7 號鐵、半揮桿練節奏。', en: 'Count "one-two-three" going back and "hit" coming down, or use a metronome app. Start with a 7-iron and half swings.' },
      use: { zh: '鐵桿是最常用的球桿，用來把球打上果嶺；穩定的節奏比力氣更能打出好球。', en: 'Irons are the clubs you use most to hit greens; a steady tempo beats raw strength for good shots.' },
      bars: [['節奏', 'Tempo', 92], ['流暢度', 'Flow', 88], ['重心轉移', 'Weight shift', 82], ['放鬆', 'Relaxation', 80]] },

    { id: 'driver', n: 8, club: 'driver', phase: 'full', views: ['front'], zh: '一號木開球', py: 'Driver', en: 'Driver Swing',
      type: { zh: '完整揮桿', en: 'Full swing' }, key: { zh: '球在前腳跟內側、往上掃', en: 'Ball off the front heel, sweep up' },
      tags: { zh: ['距離最遠的球桿', '站寬一點、球放前面'], en: ['The longest club in the bag', 'Wider stance, ball forward'] },
      ability: { zh: '速度與往上擊球', en: 'Speed and an upward strike' },
      note: { zh: '站姿較寬 · 球在前腳跟 · 上身稍向後傾', en: 'WIDER STANCE · BALL OFF FRONT HEEL · TILT BACK A LITTLE' },
      how: { zh: '開球木的球放在球座上，位置在前腳跟內側；站姿比鐵桿寬一些，上身向遠離目標的方向多傾一點。揮桿動作和鐵桿相同，但擊球時桿頭已經過了最低點、開始往上，把球「掃」出去，不要往下打。',
        en: 'With the driver the ball sits on a tee opposite the inside of your front heel; stand a little wider than for an iron and tilt the upper body a bit more away from the target. The swing is the same, but you meet the ball just after the club bottoms out, on the way up — sweep it, don\'t hit down.' },
      mistakes: { zh: '球放太中間；像鐵桿一樣往下砍；為了打遠用盡全力而失去平衡；頭往前衝。', en: 'Ball too far back; chopping down like an iron; swinging out of your shoes for distance; lunging the head towards the target.' },
      practice: { zh: '把球座插高一點，練習只把球掃走而不打到球座；用 80% 力量揮桿、維持收桿平衡。', en: 'Tee the ball a little higher and practise sweeping the ball off without hitting the tee; swing at 80% and hold your finish.' },
      use: { zh: '每一洞的第一桿通常用一號木，目標是又遠又在球道上。', en: 'The driver is usually your first shot on long holes, aiming for distance and the fairway.' },
      bars: [['揮桿速度', 'Club speed', 90], ['往上擊球', 'Upward strike', 85], ['平衡', 'Balance', 85], ['站姿寬度', 'Stance width', 78]] },

    { id: 'chip', n: 9, club: 'wedge', short: 'chip', views: ['front'], zh: '切球', py: 'Chip Shot', en: 'Chip Shot',
      type: { zh: '短桿', en: 'Short game' }, key: { zh: '重心在前、手在球前', en: 'Weight forward, hands ahead' },
      tags: { zh: ['果嶺旁的小擊球', '低飛、多滾'], en: ['The small shot near the green', 'Fly it low, let it roll'] },
      ability: { zh: '距離控制', en: 'Distance control' },
      note: { zh: '站窄 · 重心偏前腳 · 小鐘擺', en: 'NARROW STANCE · WEIGHT FORWARD · SMALL PENDULUM' },
      how: { zh: '站姿較窄，球放在中間偏後腳，重心約 60–70% 在前腳並保持不動。手腕幾乎不折，用肩膀做小幅鐘擺：後擺小、往下輕擦過球，手保持在球前。球會低低飛起一小段，落地後滾向洞口。',
        en: 'Stand with a narrow stance, ball slightly back of centre and 60–70% of your weight on the front foot — and keep it there. With quiet wrists, rock the shoulders in a small pendulum: short back, brush down through the ball with the hands ahead. The ball flies low for a short way, lands and rolls to the hole.' },
      mistakes: { zh: '想把球撈起來；重心移回後腳；後擺太大、下桿減速；手腕翻動。', en: 'Trying to scoop it up; shifting weight back; a big backswing that decelerates; flicking the wrists.' },
      practice: { zh: '在果嶺邊放一條毛巾當落點，練習讓球落在毛巾上再滾，換不同距離各 10 球。', en: 'Lay a towel on the green as a landing spot and land 10 balls on it from different distances, letting them roll out.' },
      use: { zh: '大部分的桿數其實在果嶺附近；切球好，能省下最多桿數。', en: 'Most strokes are played near the green; a reliable chip saves more shots than anything else.' },
      bars: [['距離控制', 'Distance control', 92], ['重心在前', 'Weight forward', 85], ['手腕穩定', 'Quiet wrists', 85], ['節奏', 'Rhythm', 80]] },

    { id: 'putt', n: 10, club: 'putter', short: 'putt', views: ['front'], zh: '推桿', py: 'Putting Stroke', en: 'Putting Stroke',
      type: { zh: '短桿', en: 'Short game' }, key: { zh: '肩膀擺動、頭不動', en: 'Shoulders rock, head still' },
      tags: { zh: ['果嶺上的滾地球', '一半的桿數在這裡'], en: ['Rolling the ball on the green', 'Half your strokes happen here'] },
      ability: { zh: '方向與力道控制', en: 'Line and pace control' },
      note: { zh: '眼睛在球上方 · 肩膀擺動 · 前後等距', en: 'EYES OVER THE BALL · ROCK THE SHOULDERS · EVEN BACK AND THROUGH' },
      how: { zh: '雙眼在球的正上方，手臂自然下垂，手腕固定。用肩膀像鐘擺一樣前後擺動，身體和頭部保持不動。送桿長度和後擺差不多，速度平穩，讓球順順地滾出去。',
        en: 'Set your eyes directly over the ball, let the arms hang and keep the wrists still. Rock the shoulders like a pendulum while the body and head stay quiet. Make the follow-through about as long as the backstroke, at a smooth even pace, and let the ball roll.' },
      mistakes: { zh: '用手腕撥球；擊球後馬上抬頭看；後擺很大但減速；身體跟著晃動。', en: 'Flicking with the wrists; looking up straight away; a long backstroke that slows down; swaying the body.' },
      practice: { zh: '從 1 公尺開始，連進 10 球再退到 2 公尺；遠距離推桿則練習把球停在洞口半公尺內。', en: 'Start at 1 m and hole 10 in a row before moving to 2 m; for long putts, practise stopping the ball within half a metre of the hole.' },
      use: { zh: '業餘球員大約四成桿數是推桿；推桿穩定，成績馬上進步。', en: 'Putts are around 40% of an amateur\'s strokes; a steady putting stroke lowers scores fastest.' },
      bars: [['方向', 'Line', 88], ['力道', 'Pace', 92], ['身體穩定', 'Stillness', 88], ['節奏', 'Rhythm', 80]] }
  ];

  w.GOLF = { LIST: LIST, makeClip: makeClip };
})(window);
