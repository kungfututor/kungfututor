/*!
 * KungfuTutor lesson-page engine — kt-lesson.js
 * One script drives every "pick a technique → inspector + animation" page.
 * A page supplies data + a few small functions; the engine does cards,
 * inspector, player controls (play / speed / view / mirror / level / steps),
 * mastered marks, keyboard, deep links, optional foot map and stance timer.
 *
 * Page HTML hooks (all optional except #cards, #stage, #inspector):
 *   #cards #stage #p-play [data-speed] [data-view] [data-side] [data-level] #levels #cur-level
 *   #i-tags #i-pre #i-num #i-name #i-en #i-spec1..3 [data-field="how"] #i-master #i-master-s
 *   #p-title #p-py #bars #feet #steps #guide #st-prog #reset
 *   #t-clock #t-go [data-sec] #t-best   (stance timer)
 */
(function (w, d) {
  'use strict';
  var $ = function (id) { return d.getElementById(id); };
  var $$ = function (q) { return [].slice.call(d.querySelectorAll(q)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  // the list of moves that have a 3D version (assets/js/kt-3d-moves.js, written by engine/lab3d_index.py) sits next to this
  // script; it is loaded when a lesson page starts, and the "View in 3D" button appears once it is in
  var SRC = (d.currentScript && d.currentScript.src) || '';

  function KTLesson(cfg) {
    var KT = w.KT, L = cfg.list, P = 'kt.' + cfg.prefix + '.';
    var st = {
      lang: 'zh', idx: 0, view: null, side: 'r',
      level: KT.store.get(P + 'level', 1),
      mastered: KT.store.get(P + 'mastered', []),
      best: KT.store.get(P + 'best', {})
    };
    var hm = /s=(\d+)/.exec(w.location.hash);
    if (hm && +hm[1] >= 1 && +hm[1] <= L.length) st.idx = +hm[1] - 1;
    function T(zh, en, vars) { return KT.fmt(KT.pick(zh, en), vars); }
    function cur() { return L[st.idx]; }
    // "View in 3D": the 3D Movement Lab (lab/3d/, two folders up from every lesson page, in the same language) opened on
    // this move — when the move has a 3D version
    function link3d(s) {
      var K = w.KT3D, lib = null;
      if (!K) return null;
      Object.keys(K).forEach(function (k) { if (!lib && w[k] && w[k].LIST === L) lib = k; });
      if (!lib) return null;
      var key = K[lib].indexOf(s.id) > -1 ? s.id : K[lib].indexOf(s.n) > -1 ? s.n : null;
      return key === null ? null : (cfg.labRoot || '../../') + 'lab/3d/#m=' + lib.toLowerCase() + '-' + key;
    }
    function render3d() {
      var box = $('i-master') && $('i-master').parentNode, a = $('i-3d'), href = link3d(cur());
      if (!box) return;
      if (!a) { a = d.createElement('a'); a.id = 'i-3d'; a.className = 'btn btn-3d'; box.insertBefore(a, $('i-master').nextSibling); }
      a.hidden = !href;
      if (href) { a.href = href; a.textContent = T('🧊 看 3D 動作', '🧊 View in 3D'); a.title = T('在 3D 動作實驗室轉動、放慢這個動作', 'Turn this move round and slow it down in the 3D Movement Lab'); }
    }
    if (!w.KT3D && SRC) {
      var sc = d.createElement('script');
      sc.src = SRC.replace(/kt-lesson\.js(\?.*)?$/, 'kt-3d-moves.js');
      sc.onload = function () { render3d(); };
      d.head.appendChild(sc);
    }
    function pad(n) { return ('0' + n).slice(-2); }
    var api = { T: T, cur: cur, st: st };

    /* ---------- player ---------- */
    var player = new w.KTFigure.Player($('stage'), {
      onstate: function (on) { var b = $('p-play'); if (b) { b.textContent = on ? '❚❚ PAUSE' : '▶ PLAY'; b.setAttribute('aria-pressed', String(on)); } }
    });
    player.onstate(player.playing);
    api.player = player;
    if ($('p-play')) $('p-play').addEventListener('click', function () { player.toggle(); });
    $$('[data-speed]').forEach(function (b) {
      b.addEventListener('click', function () {
        player.setSpeed(+b.getAttribute('data-speed'));
        $$('[data-speed]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      });
    });

    var stepStarts = [];
    function loadClip() {
      var s = cur(), views = s.views || ['side'];
      if (views.indexOf(st.view) < 0) st.view = views[0];
      var clip = cfg.makeClip(s, st.view, st.level, st.lang);
      player.load(clip);
      player.setMirror(st.side === 'l');
      player.setInfo(cfg.info(s, st.lang));
      $$('[data-view]').forEach(function (b) {
        var v = b.getAttribute('data-view');
        b.disabled = views.indexOf(v) < 0;
        b.title = b.disabled ? T('這個動作以另一視角最清楚', 'Clearest from the other view') : '';
        b.setAttribute('aria-pressed', String(v === st.view));
      });
      $$('[data-side]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-side') === st.side)); });
      // step list from frame captions
      stepStarts = [];
      var acc = 0, html = '';
      clip.frames.forEach(function (fr, i) {
        if (fr.c) { stepStarts.push({ i: i, t: acc }); html += '<li><button data-step="' + (stepStarts.length - 1) + '"><b>' + stepStarts.length + '</b> ' + esc(KT.t(fr.c)) + '</button></li>'; }
        acc += fr.d || 400;
      });
      if ($('steps')) { $('steps').innerHTML = html; $('steps').hidden = !html; }
      if ($('feet') && cfg.feet) $('feet').innerHTML = cfg.feet(s, st.side, st.lang);
    }
    // highlight the current step while the animation plays
    (function sync() {
      if (stepStarts.length && player.frames) {
        var seg = player.poseAt(player.elapsed).seg, active = -1;
        stepStarts.forEach(function (sp, k) { if (sp.i <= seg) active = k; });
        $$('#steps button').forEach(function (b, k) { b.classList.toggle('on', k === active); });
      }
      w.requestAnimationFrame(sync);
    })();
    if ($('steps')) $('steps').addEventListener('click', function (e) {
      var b = e.target.closest('[data-step]'); if (!b) return;
      var sp = stepStarts[+b.getAttribute('data-step')];
      var cyc = Math.floor(player.elapsed / player.total) * player.total;
      player.toggle(false);
      player.elapsed = cyc + sp.t + 1;  // show the pose this step describes
      player.drawAt(player.elapsed);
    });
    if ($('p-step')) $('p-step').addEventListener('click', function () {
      if (!stepStarts.length) return;
      var seg = player.poseAt(player.elapsed).seg, next = 0;
      for (var k = 0; k < stepStarts.length; k++) if (stepStarts[k].i > seg) { next = k; break; }
      var b = $$('#steps button')[next]; if (b) b.click();
    });

    /* ---------- renderers ---------- */
    function renderTop() {
      $$('[data-level]').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-level') === st.level)); });
      if ($('cur-level') && cfg.levelName) $('cur-level').textContent = cfg.levelName(st.level, T);
      if ($('st-prog')) $('st-prog').textContent = st.mastered.length + ' / ' + L.length;
      if (cfg.onRender) cfg.onRender(cur(), api);
    }
    function renderCards() {
      $('cards').innerHTML = L.map(function (s, i) {
        return '<button class="card' + (st.mastered.indexOf(s.n) > -1 ? ' done' : '') + '" data-i="' + i + '" aria-pressed="' + (i === st.idx) + '">' +
          '<span class="row1"><span class="num">' + pad(s.n) + '</span><span class="pre">' + esc(cfg.cardPre(s, api)) + '</span></span>' +
          '<span class="nm">' + (KT.lang === 'zh-Hant' ? esc(s.zh) + ' ' + esc(s.en.replace(/ \(.*\)/, '')) : esc(KT.name(s))) + '</span>' +
          '<span class="sp">' + esc(cfg.cardSub(s, api)) + '</span>' +
          '<span class="ok">✓ ' + T('已熟悉', 'MASTERED') + '</span></button>';
      }).join('');
    }
    function renderInspector() {
      var s = cur(), l = st.lang;
      $('i-tags').innerHTML = '<span class="tag red">' + esc(KT.t(s.tags)[0]) + '</span><span class="tag">' + esc(KT.t(s.tags)[1]) + '</span>';
      $('i-pre').textContent = cfg.pre(s, api);
      $('i-num').textContent = pad(s.n);
      $('i-name').textContent = KT.pick(s.zh, s.en);
      $('i-en').textContent = (KT.pick(s.en, s.zh)) + ' · ' + s.py;
      cfg.spec.forEach(function (fn, k) { var e = $('i-spec' + (k + 1)); if (e) e.textContent = fn(s, l); });
      $$('[data-field]').forEach(function (e) { var f = s[e.getAttribute('data-field')]; e.textContent = f ? KT.t(f) : ''; });
      var on = st.mastered.indexOf(s.n) > -1, mb = $('i-master');
      mb.classList.toggle('on', on);
      mb.textContent = on ? T('✓ 已標記為熟悉', '✓ Marked as mastered') : T('標記為已熟悉', 'Mark as mastered');
      $('i-master-s').textContent = T('進度只存在你的瀏覽器', 'Progress is saved in your browser only');
      render3d();
      $('p-title').textContent = pad(s.n) + ' ' + KT.name(s) + KT.pick('動作示意', ' — demo');
      if ($('p-py')) $('p-py').textContent = s.py;
      $('bars').innerHTML = s.bars.map(function (b) {
        return '<div class="bar"><span>' + esc(KT.pick(b[0], b[1])) + '</span><i><b style="width:0%" data-w="' + b[2] + '"></b></i><em>' + b[2] + '%</em></div>';
      }).join('');
      w.requestAnimationFrame(function () { $$('#bars b').forEach(function (b) { b.style.width = b.getAttribute('data-w') + '%'; }); });
      renderBest();
      loadClip();
    }
    function renderAll() {
      renderTop(); renderCards(); renderInspector();
      if ($('guide') && cfg.guide) $('guide').innerHTML = cfg.guide(api);
    }
    function select(i, scroll) {
      st.idx = (i + L.length) % L.length;
      st.view = null;
      stopTimer(false);
      renderTop(); renderCards(); renderInspector();
      try { w.history.replaceState(null, '', '#s=' + (st.idx + 1)); } catch (e) { /* ignore */ }
      if (scroll) { var r = $('inspector').getBoundingClientRect(); if (r.top > w.innerHeight * 0.6) $('inspector').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }

    /* ---------- stance timer (only if the page has one) ---------- */
    var tm = { sec: 30, id: null, start: 0 };
    function fmt(s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
    function beep() {
      try {
        var A = w.AudioContext || w.webkitAudioContext, ac = new A(), o = ac.createOscillator(), g = ac.createGain();
        o.frequency.value = 880; o.connect(g); g.connect(ac.destination);
        g.gain.setValueAtTime(0.15, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.6);
        o.start(); o.stop(ac.currentTime + 0.6);
      } catch (e) { /* no audio */ }
      if (w.navigator.vibrate) w.navigator.vibrate(200);
    }
    function renderBest() {
      if (!$('t-go')) return;
      var b = st.best[cur().id];
      $('t-best').textContent = b ? T('你的最佳紀錄：', 'Your best hold: ') + fmt(b) : T('完成一次計時就會記下你的最佳紀錄', 'Finish a hold to record your best time');
      $$('[data-sec]').forEach(function (x) { x.setAttribute('aria-pressed', String(+x.getAttribute('data-sec') === tm.sec)); });
      if (!tm.id) $('t-clock').textContent = fmt(tm.sec);
      $('t-go').textContent = tm.id ? T('停止', 'Stop') : (cfg.timerGo ? cfg.timerGo(T) : T('開始站樁', 'Start hold'));
    }
    function stopTimer(completed) {
      if (!tm.id) return;
      w.clearInterval(tm.id); tm.id = null;
      $('t-clock').classList.remove('run');
      var held = completed ? tm.sec : (Date.now() - tm.start) / 1000, id = cur().id;
      if (held >= 5 && held > (st.best[id] || 0)) { st.best[id] = Math.round(held); KT.store.set(P + 'best', st.best); }
      renderBest();
    }
    if ($('t-go')) {
      $$('[data-sec]').forEach(function (b) {
        b.addEventListener('click', function () { if (tm.id) return; tm.sec = +b.getAttribute('data-sec'); renderBest(); });
      });
      $('t-go').addEventListener('click', function () {
        if (tm.id) { stopTimer(false); return; }
        tm.start = Date.now();
        $('t-clock').classList.add('run');
        tm.id = w.setInterval(function () {
          var left = tm.sec - (Date.now() - tm.start) / 1000;
          $('t-clock').textContent = fmt(left);
          if (left <= 0) { beep(); stopTimer(true); }
        }, 200);
        renderBest();
      });
    }

    /* ---------- events ---------- */
    $('cards').addEventListener('click', function (e) { var b = e.target.closest('[data-i]'); if (b) select(+b.getAttribute('data-i'), true); });
    if ($('levels')) $('levels').addEventListener('click', function (e) {
      var b = e.target.closest('[data-level]'); if (!b) return;
      st.level = +b.getAttribute('data-level'); KT.store.set(P + 'level', st.level);
      renderTop(); loadClip();
    });
    $$('[data-view]').forEach(function (b) { b.addEventListener('click', function () { st.view = b.getAttribute('data-view'); loadClip(); }); });
    $$('[data-side]').forEach(function (b) { b.addEventListener('click', function () { st.side = b.getAttribute('data-side'); loadClip(); }); });
    d.addEventListener('keydown', function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (e.key === 'ArrowRight') { select(st.idx + 1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { select(st.idx - 1); e.preventDefault(); }
    });
    $('i-master').addEventListener('click', function () {
      var n = cur().n, p = st.mastered.indexOf(n);
      if (p > -1) st.mastered.splice(p, 1); else st.mastered.push(n);
      KT.store.set(P + 'mastered', st.mastered);
      renderTop(); renderCards(); renderInspector();
    });
    if ($('reset')) $('reset').addEventListener('click', function () {
      st.mastered = []; KT.store.set(P + 'mastered', []);
      renderTop(); renderCards(); renderInspector();
    });

    KT.onLang(function (l) { st.lang = l; renderAll(); });
    api.select = select;
    return api;
  }

  w.KTLesson = KTLesson;
})(window, document);
