/* Krav Maga basics — 8 lessons from the Israeli self-defence system: fighting
 * stance, straight-punch burst, inside defence, 360° outside defence, front-choke
 * pluck, groin kick, knee from the clinch, and break away & scan. Defend and
 * counter at the same time, then get away. Side view; the grey figure
 * (kt-partner.js) is the attacker. Our own wording of widely taught basics.
 */
(function (w) {
  'use strict';
  var S = w.KTFigure.S, C = S.col, KP = w.KTPartner;
  function m() { var o = {}; for (var i = 0; i < arguments.length; i++) for (var k in arguments[i]) o[k] = arguments[i][k]; return o; }
  function cap(zh, en) { return { zh: zh, en: en }; }

  var X0 = 140;
  var LEGS = { x: X0, t: 10, h: 4, fN: { x: 22, y: 82 }, fF: { x: -24, y: 82 }, ftN: 90, ftF: 70, kbN: 1, kbF: 1, lift: 0 };
  var GUARD = { su: 55, sl: 160, fu: 40, fl: 165, hz: 1 };   // hz: how far apart the hands are in the 3D view
  var BASE = m(KP.base, { hit: 0, g: 0, ox: 262 });
  function P() { return m.apply(null, [BASE, LEGS, GUARD].concat([].slice.call(arguments))); }
  var PUNCH = { oa1: 90, oa2: 90, ot: 6 };          // attacker's straight punch
  var HOOK = { oa1: 88, oa2: 100, ot: 8 };          // attacker's swinging punch
  var CHOKE = { oa1: 80, oa2: 80, g: 1, ot: 8 };     // attacker's two hands on the throat

  var CLIPS = {
    stance: { frames: [
      { d: 900, p: P({ ox: 262 }), c: cap('雙腳前後站、膝蓋微彎，身體稍向前', 'Feet staggered, knees soft, leaning slightly forward') },
      { d: 500, p: P({ ox: 262, su: 60, sl: 150 }), c: cap('雙手在臉前，掌心可以張開或握拳', 'Hands up in front of the face, open or closed') },
      { d: 900, p: P({ ox: 262 }), c: cap('下巴收、重心在前腳掌，隨時可以前進或後退', 'Chin down, weight on the balls of the feet, ready to move either way') }
    ] },
    // pressing forward: every punch comes with a short shuffle step (about 10 units), so the body really travels; the burst ends
    // with stepping back out of range
    burst: { hit: 'hNF', trail: 'hF', frames: [
      { d: 600, p: P({ ox: 220 }), c: cap('戒備姿勢', 'Fighting stance') },
      { d: 200, p: P({ x: X0 + 10, t: 12, su: 90, sl: 90, ox: 228, ot: -5, hit: 1 }), e: 'out', c: cap('前手直拳', 'Lead straight punch') },
      { d: 100, p: P({ x: X0 + 10, ox: 230 }) },
      { d: 200, p: P({ x: X0 + 22, t: 22, fu: 92, fl: 90, fF: { x: -20, y: 81 }, ftF: 35, ox: 240, ot: -9, oh: -10, hit: 1 }), e: 'out', c: cap('後手直拳，一邊往前壓', 'Rear straight punch while you keep moving forward') },
      { d: 100, p: P({ x: X0 + 22, ox: 244 }) },
      { d: 200, p: P({ x: X0 + 34, t: 12, su: 90, sl: 90, ox: 252, ot: -6, hit: 1 }), e: 'out', c: cap('不停頓地連續出拳，直到創造離開的機會', 'Keep firing without pausing until you have a chance to get away') },
      { d: 450, p: P({ x: X0 + 34, ox: 256 }) },
      { d: 600, p: P({ ox: 252 }) }
    ] },
    inside: { hit: 'hF', trail: 'hN', frames: [
      { d: 700, p: P({ ox: 222 }), c: cap('戒備姿勢', 'Fighting stance') },
      { d: 180, p: P(PUNCH, { ox: 222, oa1: 70, oa2: 110 }), c: cap('對方直拳打來', 'A straight punch comes in') },
      { d: 220, p: P(PUNCH, { t: 16, su: 72, sl: 112, hz: 0.35, fu: 92, fl: 90, fF: { x: -20, y: 81 }, ftF: 35, ox: 222, oh: -12, hit: 1 }), e: 'out', c: cap('前手掌把拳撥開，同時後手直拳反擊', 'The lead palm redirects the punch while the rear hand punches back at the same time') },
      { d: 300, p: P({ ox: 230 }), c: cap('繼續反擊或脫離', 'Keep countering or break away') },
      { d: 500, p: P({ ox: 232 }) }
    ] },
    outside: { hit: 'hF', trail: 'hN', frames: [
      { d: 700, p: P({ ox: 214 }), c: cap('戒備姿勢', 'Fighting stance') },
      { d: 180, p: P({ ox: 214, oa1: 40, oa2: 120, ot: 2 }), c: cap('對方揮拳從側面打來', 'A swinging punch comes from the side') },
      { d: 220, p: P(HOOK, { su: 100, sl: 185, t: 16, fu: 92, fl: 90, fF: { x: -20, y: 81 }, ftF: 35, ox: 214, oh: -12, hit: 1 }), e: 'out', c: cap('前臂立起擋在頭側（手肘約 90°），同時後手反擊', 'Raise the forearm to block at the side of the head (elbow about 90°) while the rear hand counters') },
      { d: 300, p: P({ ox: 222 }), c: cap('連續反擊，然後離開', 'Keep striking, then get away') },
      { d: 500, p: P({ ox: 226 }) }
    ] },
    choke: { hit: 'kF', trail: 'hN', grab: 'sh', frames: [
      { d: 800, p: P(CHOKE, { ox: 204, su: 25, sl: 120, fu: 20, fl: 125 }), c: cap('對方雙手從正面掐住你的脖子', 'They choke you from the front with both hands') },
      { d: 260, p: P(CHOKE, { ox: 204, su: 25, sl: 172, fu: 22, fl: 175 }), c: cap('雙手立刻舉高，手指勾住對方的拇指', 'Immediately bring both hands up and hook your fingers over their thumbs') },
      { d: 220, p: P({ ox: 204, oa1: 40, oa2: 30, ot: 4, g: 0, su: 45, sl: 60, fu: 40, fl: 62, t: 14 }), e: 'out', c: cap('用力往下往外拉開，同時下巴收、頭往前', 'Pluck them down and out hard, chin tucked, head forward') },
      { d: 240, p: P({ ox: 204, oa1: 40, oa2: 30, ot: 14, oh: 10, su: 70, sl: 110, fu: 65, fl: 112, fF: { x: 30, y: 30 }, ftF: 10, t: -6, hit: 1 }), e: 'out', c: cap('抓住對方，膝擊反擊', 'Grab hold and counter with a knee') },
      { d: 700, p: P({ x: X0 - 26, ox: 214 }), c: cap('推開、後退、離開', 'Shove away, step back, leave') }
    ] },
    kick: { hit: 'tF', trail: 'aF', frames: [
      { d: 700, p: P({ ox: 232 }), c: cap('戒備姿勢，對方在一腿距離', 'Fighting stance, a leg\'s length away') },
      { d: 170, p: P({ t: 4, fF: { x: 24, y: 36 }, ftF: 60, ox: 232 }), c: cap('後腿提膝', 'Lift the rear knee') },
      { d: 170, p: P({ t: -4, fF: { x: 66, y: 14 }, ftF: 120, ox: 232, ot: 18, oh: 10, hit: 1 }), e: 'out', c: cap('小腿向上彈出，用腳背或脛骨踢向鼠蹊部', 'Snap the lower leg up, striking the groin with the instep or shin') },
      { d: 220, p: P({ t: 4, fF: { x: 24, y: 36 }, ftF: 60, ox: 236, ot: 22 }), c: cap('快速收腿', 'Snap the leg back') },
      { d: 380, p: P({ ox: 238, ot: 16 }) },                                     // the foot comes down in the stance first, then both feet step back
      { d: 600, p: P({ x: X0 - 22, ox: 238, ot: 10 }), c: cap('落地後退、離開', 'Plant, step back and leave') }
    ] },
    knee: { hit: 'kF', trail: 'kF', frames: [
      { d: 700, p: P({ ox: 204 }), c: cap('對方靠得太近', 'They are too close') },
      { d: 220, p: P({ ox: 204, su: 75, sl: 120, fu: 70, fl: 122, ot: 6 }), c: cap('雙手抓住對方的肩膀或後頸', 'Grab their shoulders or the back of the neck') },
      { d: 220, p: P({ ox: 204, su: 72, sl: 105, fu: 68, fl: 108, fF: { x: 28, y: 32 }, ftF: 10, t: -6, ot: 18, oh: 12, hit: 1 }), e: 'out', c: cap('把對方往下拉，同時膝蓋往上頂', 'Pull them down while driving the knee up') },
      { d: 240, p: P({ ox: 204, su: 75, sl: 120, fu: 70, fl: 122, ot: 12 }), c: cap('可以連續膝擊', 'Repeat the knee if needed') },
      { d: 700, p: P({ x: X0 - 26, ox: 214, ot: 8 }), c: cap('推開、後退、離開', 'Shove away, step back, leave') }
    ] },
    escape: { hit: null, trail: 'hip', frames: [
      { d: 600, p: P({ ox: 230, ot: 16, oh: 10 }), c: cap('反擊後對方暫時停住', 'After your counter, they are stopped for a moment') },
      { d: 500, p: P({ x: X0 - 22, ox: 230, ot: 16 }), c: cap('保持戒備，後退拉開距離', 'Keep your guard up and back away') },
      { d: 500, p: P({ x: X0 - 44, h: -10, ox: 230, ot: 12 }), c: cap('左右轉頭檢查四周，有沒有其他人或物品', 'Turn your head to scan around you: other attackers, weapons, exits') },
      { d: 800, p: P({ x: X0 - 70, ox: 230, ot: 8 }), c: cap('往安全的地方離開，求助並報警', 'Move to safety, get help and call the police') }
    ] }
  };

  // one-legged moments (kicks): the hips move over the standing foot so the figure never tips over;
  // the standing foot stays put and the partner keeps the distance the lesson drew (see KTFigure.balanceClip)
  ['kick'].forEach(function (k) { w.KTFigure.balanceClip(CLIPS[k].frames, { base: { x: X0 } }); });

  function makeClip(s, view, level) {
    var src = CLIPS[s.id], pace = level < 1 ? 1.8 : 1;
    return {
      scale: 0.88, base: { x: X0 }, cx: X0, ticks: s.id === 'escape', labelAt: [350, 28], still: 0.5,
      trail: src.trail || null,
      frames: src.frames.map(function (f) { return { d: Math.round(f.d * pace), p: f.p, e: f.e, c: f.c }; }),
      props: function (J, c) {
        var o = KP.draw(J, c, { cx: X0, grab: src.grab }), fr = '', hud = '';
        if (src.hit && c.pose.hit > 0.15) {
          var pt = src.hit === 'hNF' ? (c.seg === 2 || c.seg === 3 ? J.hF : J.hN) : J[src.hit];
          fr += KP.hit(pt, c.pose.hit);
          if (c.pose.hit > 0.6) hud += S.text(18, 30, KT.pick('目標：', 'TARGET: ') + KT.t(s.target), { size: 12, fill: C.red, family: "'JetBrains Mono','Noto Sans TC',monospace" });
        }
        return { back: o.svg, front: fr, hud: hud };
      }
    };
  }

  var LIST = [
    { id: 'stance', n: 1, zh: '戒備姿勢', py: 'Fighting Stance', en: 'Fighting Stance',
      type: { zh: '基本', en: 'Foundation' }, target: { zh: '—', en: '—' }, when: { zh: '感覺到威脅時', en: 'When you sense a threat' },
      tags: { zh: ['所有動作的起點', '隨時能防也能打'], en: ['Where everything starts', 'Ready to defend and strike'] },
      ability: { zh: '準備與平衡', en: 'Readiness and balance' },
      note: { zh: '膝微彎 · 身體前傾 · 手在臉前', en: 'SOFT KNEES · LEAN IN · HANDS UP' },
      how: { zh: '雙腳前後站、約與肩同寬，膝蓋微彎，重心在前腳掌，上身稍微前傾。雙手舉在臉前，可以張開（看起來較不具攻擊性）或握拳，手肘收在身體前方，下巴收。這個姿勢讓你隨時能防守、反擊或離開。',
        en: 'Stand with feet staggered about shoulder-width, knees soft, weight on the balls of the feet and the upper body leaning slightly forward. Hold your hands up in front of your face — open (which looks less aggressive) or closed — with the elbows in and the chin down. From here you can defend, counter or get away at any moment.' },
      mistakes: { zh: '站得太直、重心在腳跟（一推就倒）；雙手太低；雙腳站成一直線；身體僵硬。', en: 'Standing upright with weight on the heels (easy to push over); hands too low; feet on one line; stiffness.' },
      practice: { zh: '從自然站立「一步」進入戒備姿勢 10 次，再在戒備姿勢中前後移動 1 分鐘。', en: 'Step from relaxed standing into the stance 10 times, then move forward and back in it for a minute.' },
      use: { zh: 'Krav Maga 的所有防守與反擊都從這個姿勢出發。', en: 'Every Krav Maga defence and counter starts from this stance.' },
      bars: [['平衡', 'Balance', 90], ['反應準備', 'Readiness', 90], ['防守', 'Defence', 85], ['移動', 'Movement', 80]] },

    { id: 'burst', n: 2, zh: '連續直拳', py: 'Straight-Punch Burst', en: 'Straight-Punch Burst',
      type: { zh: '反擊', en: 'Counter' }, target: { zh: '臉', en: 'Face' }, when: { zh: '無法離開、必須反擊時', en: 'When you can\'t get away and must fight back' },
      tags: { zh: ['不停頓的連續攻擊', '一邊打一邊前進'], en: ['Non-stop combinations', 'Punch while moving forward'] },
      ability: { zh: '連續攻擊', en: 'Continuous attack' },
      note: { zh: '前手 · 後手 · 一直前進 · 不停頓', en: 'LEAD · REAR · KEEP MOVING IN · NO PAUSES' },
      how: { zh: 'Krav Maga 強調一旦必須反擊，就要連續不停：前手直拳、後手直拳，一邊打一邊往前壓，讓對方沒有喘息和反擊的機會，直到你能安全離開為止。',
        en: 'Krav Maga teaches that once you have to fight back, you keep going: lead punch, rear punch, pressing forward as you strike, so the attacker has no time to recover or hit back — until you can get away safely.' },
      mistakes: { zh: '打一拳就停下來看結果；後退著打；拳與拳之間有停頓；雙手掉下來。', en: 'Throwing one punch and stopping to look; punching while backing up; pauses between punches; dropping the hands.' },
      practice: { zh: '對手靶連續打 10 秒、休息 10 秒，重複 6 次，同時一直往前移動。', en: '10 seconds of non-stop punches on pads, 10 seconds rest, 6 rounds, always moving forward.' },
      use: { zh: '這種連續、壓迫式的反擊在 Krav Maga 稱為 Retzev（連續攻擊）。', en: 'This continuous, forward-pressing counter-attack is what Krav Maga calls retzev ("continuous motion").' },
      bars: [['連續攻擊', 'Continuous attack', 92], ['前進壓迫', 'Forward pressure', 88], ['體能', 'Conditioning', 82], ['平衡', 'Balance', 78]] },

    { id: 'inside', n: 3, zh: '內側撥擋反擊', py: 'Inside Defence', en: 'Inside Defence vs Straight Punch',
      type: { zh: '防守＋反擊', en: 'Defend + counter' }, target: { zh: '對方的臉', en: 'Their face' }, when: { zh: '對方直拳打來', en: 'A straight punch comes at you' },
      tags: { zh: ['同時防守與反擊', '撥開而不是硬擋'], en: ['Defend and counter at the same time', 'Redirect, don\'t block'] },
      ability: { zh: '時機與協調', en: 'Timing and coordination' },
      note: { zh: '前手掌撥開 · 同時後手出拳', en: 'LEAD PALM REDIRECTS · REAR HAND PUNCHES AT THE SAME TIME' },
      how: { zh: '對方直拳打來時，用前手掌從內側把拳頭撥向一旁，同時身體稍微偏開，後手直拳直接打回對方臉部。防守和反擊同時發生，而不是先擋再打。之後繼續反擊或離開。',
        en: 'As the straight punch comes, use your lead palm to deflect it to the side from the inside while your body moves slightly off line, and at the same moment fire your rear hand straight into their face. Defence and counter happen together, not one after the other. Then keep striking or get away.' },
      mistakes: { zh: '只擋不打；撥擋動作太大；先擋完再打（太慢）；眼睛閉起來。', en: 'Blocking without countering; a big swatting movement; blocking first and punching after (too slow); closing your eyes.' },
      practice: { zh: '夥伴戴拳套慢速出直拳，你練習撥擋＋反擊同時進行，左右各 10 次。', en: 'Partner throws slow straight punches with gloves; deflect and counter at the same time, 10 each side.' },
      use: { zh: '同時防守與反擊是 Krav Maga 最核心的原則之一，能大幅縮短你處於被動的時間。', en: 'Defending and countering at once is a core Krav Maga principle — it cuts the time you spend on the back foot.' },
      bars: [['時機', 'Timing', 90], ['協調', 'Coordination', 88], ['反擊', 'Counter', 85], ['反應', 'Reaction', 85]] },

    { id: 'outside', n: 4, zh: '外側 360° 防守', py: '360° Outside Defence', en: '360° Outside Defence',
      type: { zh: '防守＋反擊', en: 'Defend + counter' }, target: { zh: '對方的臉', en: 'Their face' }, when: { zh: '揮拳或從側面、上方打來的攻擊', en: 'Swinging or overhead attacks from the side' },
      tags: { zh: ['擋從外側來的攻擊', '前臂當盾牌'], en: ['Stops attacks from the outside', 'The forearm is the shield'] },
      ability: { zh: '反射與結構', en: 'Reflex and structure' },
      note: { zh: '前臂立起 · 手肘約 90° · 同時反擊', en: 'FOREARM UP · ELBOW ~90° · COUNTER AT ONCE' },
      how: { zh: '360° 防守是一組可以擋住各種角度（上、側、下）弧線攻擊的前臂防守。對方從側面揮拳時，前臂立起、手肘彎約 90°，用前臂外側擋在頭側，同時另一手直拳反擊。擋的位置會依攻擊高度改變，但原則都一樣：用前臂迎擊、同時反擊。',
        en: 'The 360° defence is a family of forearm blocks for curved attacks from any angle — high, side or low. Against a swing from the side, raise the forearm with the elbow bent about 90° so the outside of the forearm meets the attack beside your head, while your other hand punches straight back. The block\'s height changes with the attack, but the principle stays the same: meet it with the forearm and counter at once.' },
      mistakes: { zh: '用手掌擋（會被打穿）；手臂離頭太遠；只擋不反擊；身體往後縮。', en: 'Blocking with the hand (it gets driven through); the arm too far from the head; blocking without countering; shrinking backwards.' },
      practice: { zh: '夥伴用手靶從不同角度慢速揮向你，練習前臂擋＋反擊，各角度 5 次。', en: 'Partner swings slowly with a pad from different angles; block with the forearm and counter, 5 reps per angle.' },
      use: { zh: '真實的攻擊常是大弧線的揮拳，360° 防守讓你用同一個原則應付不同角度。', en: 'Real attacks are often big looping swings; the 360° defence lets one principle cover every angle.' },
      bars: [['反射', 'Reflex', 90], ['手臂結構', 'Arm structure', 88], ['反擊', 'Counter', 85], ['時機', 'Timing', 82]] },

    { id: 'choke', n: 5, zh: '正面掐喉脫困', py: 'Front Choke: Pluck', en: 'Front Choke Release (Pluck)',
      type: { zh: '脫困', en: 'Release' }, target: { zh: '對方的拇指 → 膝擊', en: 'Their thumbs → then a knee' }, when: { zh: '被人從正面掐住脖子', en: 'Choked from the front' },
      tags: { zh: ['最緊急的情況之一', '拉開拇指、立刻反擊'], en: ['One of the most urgent situations', 'Pluck the thumbs, counter at once'] },
      ability: { zh: '速度與反應', en: 'Speed and reaction' },
      note: { zh: '雙手勾拇指 · 往下往外拉 · 下巴收 · 膝擊', en: 'HOOK THE THUMBS · PLUCK DOWN AND OUT · CHIN DOWN · KNEE' },
      how: { zh: '被人從正面雙手掐住脖子時，雙手立刻舉起，從上方把手指勾在對方的拇指上（拇指是握力最弱的地方），用力往下往外拉開，同時下巴收緊、頭稍微往前。拉開後馬上抓住對方，用膝蓋反擊，接著推開、後退、離開。',
        en: 'If someone chokes you from the front with both hands, immediately bring your hands up and hook your fingers over their thumbs from above — the thumbs are the weakest part of the grip — and pluck them down and out hard while tucking your chin and pushing your head slightly forward. As soon as you are free, grab hold and counter with a knee, then shove away, step back and leave.' },
      mistakes: { zh: '往後退或往後拉（掐得更緊）；用力拉對方的手腕而不是拇指；拉開後不反擊；動作太慢。', en: 'Pulling or stepping backwards (it tightens the choke); pulling at the wrists instead of the thumbs; not countering after the release; hesitating.' },
      practice: { zh: '夥伴雙手輕輕放在你的脖子上（不要用力掐），慢速練習「勾拇指 → 拉開 → 膝擊（不碰到）」10 次。', en: 'Partner rests their hands lightly on your neck (no squeezing); slowly practise hook the thumbs → pluck → knee (no contact), 10 reps.' },
      use: { zh: '被掐住脖子只有幾秒鐘的反應時間，這個動作簡單、快速、不需要力氣。', en: 'A choke leaves you only seconds; this release is simple, fast and needs no strength.' },
      bars: [['速度', 'Speed', 92], ['反應', 'Reaction', 90], ['手部控制', 'Hand control', 82], ['反擊', 'Counter', 85]] },

    { id: 'kick', n: 6, zh: '踢鼠蹊', py: 'Groin Kick', en: 'Groin Kick',
      type: { zh: '反擊', en: 'Counter' }, target: { zh: '鼠蹊部', en: 'Groin' }, when: { zh: '對方在一腿距離', en: 'They are a leg\'s length away' },
      tags: { zh: ['最簡單有效的腿法', '由下往上彈'], en: ['The simplest effective kick', 'Snaps upward'] },
      ability: { zh: '速度與距離', en: 'Speed and range' },
      note: { zh: '提膝 · 往上彈 · 腳背或脛骨 · 快收', en: 'KNEE UP · SNAP UP · INSTEP OR SHIN · FAST RECOIL' },
      how: { zh: '從戒備姿勢把後腿膝蓋提起，小腿由下往上快速彈出，用腳背或脛骨踢向對方鼠蹊部，然後快速收腿、落地。踢完立刻後退、離開，或繼續反擊。',
        en: 'From your stance, lift the rear knee and snap the lower leg upward so the instep or shin strikes the groin, then pull the leg back fast and plant it. Step back and leave straight away, or keep countering.' },
      mistakes: { zh: '用腳尖踢（容易扭傷）；踢得太慢、預告明顯；踢完腳停在空中；踢完站在原地。', en: 'Kicking with the toes (they jam); a slow, obvious kick; leaving the leg out; staying put afterwards.' },
      practice: { zh: '對著放低的踢靶練習，每腳 3 × 10，重點是快踢快收。訓練時絕對不要真的踢到夥伴。', en: 'On a low-held kick shield, 3 × 10 per leg, fast out and fast back. Never actually kick a training partner there.' },
      use: { zh: '這是體型較小的人也能有效使用的反擊，能讓對方停下來，給你離開的時間。', en: 'Even a much smaller person can use it to stop an attacker and buy time to get away.' },
      bars: [['速度', 'Speed', 90], ['距離感', 'Range', 85], ['平衡', 'Balance', 80], ['快速收腿', 'Fast recoil', 85]] },

    { id: 'knee', n: 7, zh: '抓肩膝擊', py: 'Knee from the Clinch', en: 'Knee from the Clinch',
      type: { zh: '近身反擊', en: 'Close-range counter' }, target: { zh: '鼠蹊部、腹部', en: 'Groin, stomach' }, when: { zh: '對方貼得太近', en: 'They are right up against you' },
      tags: { zh: ['近距離最有力的武器', '拉下來、頂上去'], en: ['The strongest weapon up close', 'Pull down, drive up'] },
      ability: { zh: '近距離控制', en: 'Close-range control' },
      note: { zh: '雙手抓肩 · 往下拉 · 膝往上頂', en: 'GRAB THE SHOULDERS · PULL DOWN · KNEE UP' },
      how: { zh: '對方貼得太近時，雙手抓住對方的肩膀或後頸，把對方往下拉，同時後腿膝蓋往上頂向鼠蹊部或腹部。可以連續膝擊，然後推開、後退、離開。',
        en: 'When they are right up against you, grab their shoulders or the back of the neck, pull them down and drive your rear knee up into the groin or stomach at the same time. Repeat if needed, then shove away, step back and leave.' },
      mistakes: { zh: '只抬腿不拉人；膝蓋往前踢而不是往上頂；身體往後倒；抓住後一直纏著不離開。', en: 'Lifting the knee without pulling them down; kicking forward instead of driving up; leaning back; hanging on instead of leaving.' },
      practice: { zh: '對膝擊靶或沙袋每腳 3 × 10；和夥伴練習時只做輕觸或不接觸。', en: '3 × 10 per leg on a knee pad or bag; with a partner, light touch or no contact only.' },
      use: { zh: '當距離近到無法出拳時，膝擊是最自然也最有力的反擊。', en: 'When there is no room to punch, the knee is the most natural and powerful counter.' },
      bars: [['近身控制', 'Close control', 90], ['髖部推送', 'Hip drive', 85], ['平衡', 'Balance', 80], ['脫離', 'Getting away', 85]] },

    { id: 'escape', n: 8, zh: '脫離與觀察四周', py: 'Break Away & Scan', en: 'Break Away & Scan',
      type: { zh: '脫離', en: 'Escape' }, target: { zh: '—（離開現場）', en: '— (leave)' }, when: { zh: '每一次反擊之後', en: 'After every counter' },
      tags: { zh: ['所有技術的最後一步', '還有別人嗎？'], en: ['The last step of every technique', 'Is anyone else there?'] },
      ability: { zh: '警覺與判斷', en: 'Awareness and judgement' },
      note: { zh: '保持戒備 · 後退 · 轉頭觀察 · 離開求助', en: 'GUARD UP · BACK AWAY · SCAN · LEAVE AND GET HELP' },
      how: { zh: '反擊成功、對方暫時停下時，不要留下來繼續打。保持戒備、後退拉開距離，左右轉頭檢查四周：有沒有其他攻擊者、武器或障礙物、出口在哪裡。接著往安全、人多的地方離開，求助並報警。',
        en: 'Once your counter has stopped them for a moment, don\'t stay to keep fighting. Keep your guard up, back away to open the distance and turn your head to scan around you — other attackers, weapons, obstacles, the exits. Then move to a safe, busy place, get help and call the police.' },
      mistakes: { zh: '反擊後留下來「教訓」對方；轉身背對對方逃跑太早；只盯著一個人，沒注意其他人；忘了報警。', en: 'Staying to "finish" the attacker; turning your back too early; tunnel vision on one person; forgetting to call the police.' },
      practice: { zh: '每次練習任何技術後，都要加上「後退 3 步、左右觀察、說出出口在哪」。', en: 'End every drill with three steps back, a scan both ways, and naming the exit out loud.' },
      use: { zh: 'Krav Maga 的目標是安全回家，而不是贏得打鬥；觀察與離開是每個技術的一部分。', en: 'Krav Maga\'s goal is getting home safe, not winning a fight; scanning and leaving are part of every technique.' },
      bars: [['警覺', 'Awareness', 92], ['判斷', 'Judgement', 88], ['移動', 'Movement', 80], ['求助', 'Getting help', 85]] }
  ];

  w.KRAV = { LIST: LIST, makeClip: makeClip };
})(window);
