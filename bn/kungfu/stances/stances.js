/* Five basic stances — page config for the shared lesson engine (kt-lesson.js) */
(function (w) {
  'use strict';
  var L = w.STANCES.LIST, S = w.KTFigure.S;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  function feetSVG(s, side, lang) {
    var u = 24, cx = 130, cy = 98, out = '';
    out += S.line({ x: cx, y: 14 }, { x: cx, y: 180 }, '#E4E3DD', 1, ' stroke-dasharray="3 4"');
    out += S.line({ x: 14, y: cy }, { x: 246, y: cy }, '#E4E3DD', 1, ' stroke-dasharray="3 4"');
    var pts = [];
    s.feet.forEach(function (f) {
      var mir = side === 'l' ? -1 : 1, fx = f[0] * mir;
      var x = cx + fx * u, y = cy + f[1] * u, rot = f[2] * mir, heelUp = f[4], col = '#191D28';
      pts.push({ x: x, y: y });
      out += '<g transform="translate(' + x + ',' + y + ') rotate(' + rot + ')">' +
        (heelUp
          ? '<ellipse cx="0" cy="-5" rx="6.5" ry="8" fill="' + col + '"/><ellipse cx="0" cy="6" rx="5.5" ry="6" fill="none" stroke="' + col + '" stroke-dasharray="2 2"/>'
          : '<ellipse cx="0" cy="0" rx="7" ry="13" fill="' + col + '"/>') +
        '<path d="M-3,-17 L0,-22 L3,-17" fill="none" stroke="#D92D20" stroke-width="1.6"/></g>';
      out += S.text(x + (fx < 0 ? -16 : 16), y + 4, f[3], { size: 12, fill: '#D92D20', anchor: fx < 0 ? 'end' : 'start' });
    });
    if (pts.length === 2) {
      var a = pts[0], b = pts[1];
      out += S.line(a, b, '#059669', 1.5, ' stroke-dasharray="4 3"');
      out += S.text((a.x + b.x) / 2, Math.max(a.y, b.y) + 34, KT.t(s.width), { size: 11, fill: '#059669', anchor: 'middle', weight: 600 });
    }
    out += S.text(cx, 12, (KT.pick('前', 'FRONT')), { size: 10, fill: '#60687E', anchor: 'middle' });
    return out;
  }

  w.KTLesson({
    list: L, prefix: 'st',
    makeClip: function (s, view, level, lang) { return w.STANCES.makeClip(s.id, view, level, lang); },
    info: function (s, lang) { return { a: s.zh + ' ' + s.py, b: (KT.isZh() ? s.en.replace(/ \(.*\)/, '') : KT.name(s)).toUpperCase(), note: KT.t(s.note) }; },
    feet: feetSVG,
    levelName: function (lv, T) { return T('目前程度：', 'Current level: ') + (lv < 1 ? T('初學', 'Beginner') : T('標準', 'Standard')); },
    cardPre: function (s) { return s.py; },
    cardSub: function (s, a) { return a.T('重心 ', 'Weight ') + s.weight; },
    pre: function (s, a) { return a.T('第 {n} 式 · 拼音 {py}', 'Stance {n} of 5 · Pinyin {py}', { n: s.n, py: s.py }); },
    spec: [function (s) { return s.weight; }, function (s, l) { return KT.t(s.width); }, function (s, l) { return KT.t(s.ability); }],
    onRender: function (s) { document.getElementById('st-weight').textContent = s.weight; },
    guide: function (api) {
      var T = api.T, st = api.st;
      var rows = L.map(function (s) {
        return '<tr><td>' + esc(s.zh + ' ' + s.py) + '</td><td>' + esc(s.en) + '</td><td>' + esc(s.weight) + '</td><td>' + esc(KT.t(s.width)) + '</td><td>' + esc(KT.t(s.ability)) + '</td></tr>';
      }).join('');
      return (
      '<h2>' + T('為什麼要先練步型？', 'Why learn stances first?') + '</h2>' +
      '<p>' + T('功夫有句老話：「入門先站三年樁」。拳腳的力量來自地面，經過腿、腰再傳到手腳；如果下盤不穩，動作再快也沒有力。五大步型是長拳與多數北派功夫的基本功，也是套路（例如五步拳）的組成單位。',
        'An old kung fu saying tells beginners to "stand in stance for three years". Power starts at the ground and travels through the legs and waist to the hands and feet — without a stable base, even fast techniques lack force. The five stances are the foundation of Changquan and most northern styles, and the building blocks of forms such as Wu Bu Quan (Five Stance Fist).') + '</p>' +
      '<h2>' + T('五大步型一覽', 'The five stances at a glance') + '</h2>' +
      '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>' + T('步型', 'Stance') + '</th><th>English</th><th>' + T('重心（前／後）', 'Weight (front / back)') + '</th><th>' + T('腳距', 'Foot distance') + '</th><th>' + T('主要訓練', 'Main benefit') + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="note">' + T('重心比例與腳距是常見的訓練參考值；南派、北派及各家門派的要求不完全相同，請以你的老師指導為準。', 'Weight splits and distances are common training values; northern, southern and individual schools differ — follow your own teacher.') + '</p>' +
      '<h2>' + T('安全練習的三個原則', 'Three rules for safe practice') + '</h2>' +
      '<ol><li>' + T('膝蓋永遠對準腳尖方向，不要內扣或扭轉。', 'Knees always track the direction of the toes — never cave in or twist.') + '</li>' +
      '<li>' + T('深度依能力調整：姿勢正確比蹲得低更重要。', 'Choose a depth you can control: correct shape matters more than going low.') + '</li>' +
      '<li>' + T('先熱身髖、膝、踝；疼痛就停，不要硬撐。', 'Warm up hips, knees and ankles first; stop if anything hurts.') + '</li></ol>' +
      '<h2>' + T('常見問題', 'Frequently asked questions') + '</h2>' +
      '<details><summary>' + T('功夫的五大步型是哪五個？', 'What are the five basic kung fu stances?') + '</summary><p>' + T('馬步、弓步、虛步、仆步、歇步。', 'Horse (Ma Bu), bow (Gong Bu), empty (Xu Bu), drop (Pu Bu) and cross (Xie Bu).') + '</p></details>' +
      '<details><summary>' + T('初學者馬步要站多久？', 'How long should a beginner hold horse stance?') + '</summary><p>' + T('建議從每組約 30 秒、做 3 組開始，姿勢正確後再慢慢延長到 1–2 分鐘。', 'Start with about 30 seconds × 3 sets with good form, then build slowly towards 1–2 minutes.') + '</p></details>' +
      '<details><summary>' + T('站馬步會傷膝蓋嗎？', 'Is horse stance bad for the knees?') + '</summary><p>' + T('只要膝蓋對準腳尖、深度在可控制範圍內，馬步是常見的肌力訓練；如出現疼痛，請站高一點或停止，並請教教練或醫師。', 'With knees over the toes and a depth you control, it is a common strength exercise. If it hurts, stand higher or stop, and ask an instructor or doctor.') + '</p></details>' +
      '<details><summary>' + T('這些動畫是誰做的？', 'Who made these animations?') + '</summary><p>' + T('動畫由 KungfuTutor 自行繪製，用來說明姿勢重點，並非任何門派的官方示範。', 'They are drawn by KungfuTutor to show the key points, not an official demonstration of any particular school.') + '</p></details>'
      );
    }
  });
})(window);
