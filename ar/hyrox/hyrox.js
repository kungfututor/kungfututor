/* HYROX interactive explainer — page logic */
(function (w, d) {
  'use strict';
  var H = w.HYROX, KT = w.KT;
  var $ = function (id) { return d.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  var st = {
    lang: 'zh',
    div: KT.store.get('kt.hx.div', 'mp'),
    sub: KT.store.get('kt.hx.sub', 'm'),
    idx: 6,
    mastered: KT.store.get('kt.hx.mastered', [])
  };
  // deep link: #s=7&d=mp&x=m
  (function () {
    var h = w.location.hash.slice(1).split('&'), i, kv;
    for (i = 0; i < h.length; i++) {
      kv = h[i].split('=');
      if (kv[0] === 's' && +kv[1] >= 1 && +kv[1] <= 8) st.idx = +kv[1] - 1;
      if (kv[0] === 'd' && H.DIVS.some(function (x) { return x.id === kv[1]; })) st.div = kv[1];
      if (kv[0] === 'x' && /^[wmx]$/.test(kv[1])) st.sub = kv[1];
    }
  })();

  function T(zh, en, vars) { return KT.fmt(KT.pick(zh, en), vars); }
  function div() { return H.DIVS.filter(function (x) { return x.id === st.div; })[0] || H.DIVS[3]; }
  function sub() { var D = div(); return D.subs ? (D.subs.filter(function (s) { return s.id === st.sub; })[0] || D.subs[0]) : null; }
  function weights() { var s = sub(); return s ? s.w : div().w; }
  function divName() { var D = div(), s = sub(); return T(D.zh, D.en) + (s ? ' · ' + T(s.zh, s.en) : ''); }

  /* ---------- player ---------- */
  var player = new w.KTFigure.Player($('stage'), {
    onstate: function (on) { var b = $('p-play'); b.textContent = on ? '❚❚ PAUSE' : '▶ PLAY'; b.setAttribute('aria-pressed', String(on)); }
  });
  player.onstate(player.playing);
  $('p-play').addEventListener('click', function () { player.toggle(); });
  [].forEach.call(d.querySelectorAll('[data-speed]'), function (b) {
    b.addEventListener('click', function () {
      player.setSpeed(+b.getAttribute('data-speed'));
      [].forEach.call(d.querySelectorAll('[data-speed]'), function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    });
  });

  /* ---------- renderers ---------- */
  function renderDivs() {
    $('divs').innerHTML = H.DIVS.map(function (D) {
      return '<button data-div="' + D.id + '" aria-pressed="' + (D.id === st.div) + '">' + esc(D.zh) + ' ' + esc(D.en) + '</button>';
    }).join('');
    var D = div(), box = $('subs');
    if (D.subs) {
      box.hidden = false;
      box.innerHTML = D.subs.map(function (s) {
        return '<button data-sub="' + s.id + '" aria-pressed="' + (s.id === (sub() || {}).id) + '">' + esc(T(s.zh, s.en)) + '</button>';
      }).join('');
    } else { box.hidden = true; box.innerHTML = ''; }
    $('cur-div').textContent = T('目前組別：', 'Current division: ') + divName();
  }

  function renderStats() {
    var D = div(), W = weights();
    $('st-run').textContent = D.id === 're'
      ? T('四位隊員各跑 2 段 × 1,000 m', 'Each of 4 teammates runs 2 × 1,000 m')
      : T('8 段 × 1,000m 穿插於每站前', '8 × 1,000 m, one before each station');
    $('st-time').textContent = D.time;
    $('st-div').textContent = divName() + T('：', ': ') + T(D.desc.zh, D.desc.en) + T('，雪橇推進 ', '; sled push ') + W.push + ' kg' + T('、藥球 ', ', wall ball ') + W.wb + ' kg';
    $('st-prog').textContent = st.mastered.length + ' / 8';
  }

  function renderCards() {
    var W = weights();
    $('cards').innerHTML = H.STATIONS.map(function (s, i) {
      var n = ('0' + s.n).slice(-2);
      return '<button class="card' + (st.mastered.indexOf(s.n) > -1 ? ' done' : '') + '" data-i="' + i + '" aria-pressed="' + (i === st.idx) + '">' +
        '<span class="row1"><span class="num">' + n + '</span><span class="pre">' + T('1km 跑後', 'after 1 km') + '</span></span>' +
        '<span class="nm">' + (KT.lang === 'zh-Hant' ? esc(s.zh) + ' ' + esc(s.en) : esc(KT.pick(s.zh, s.en))) + '</span>' +
        '<span class="sp">' + esc(s.spec(W, st.lang)) + '</span>' +
        '<span class="ok">✓ ' + T('已熟悉', 'MASTERED') + '</span></button>';
    }).join('');
  }

  function renderInspector() {
    var s = H.STATIONS[st.idx], W = weights(), L = st.lang, n = ('0' + s.n).slice(-2);
    var tags = KT.t(s.tags);
    $('i-tags').innerHTML = '<span class="tag red">' + esc(tags[0]) + '</span><span class="tag">' + esc(tags[1]) + '</span>';
    $('i-pre').textContent = T('前置賽段：第 {n} 段 1,000m 跑步後進入 RoxZone', 'Comes after run {n} of 8 (1,000 m), via the RoxZone', { n: s.n });
    $('i-num').textContent = n;
    $('i-name').textContent = KT.pick(s.zh, s.en);
    $('i-en').textContent = KT.pick(s.en, '');
    $('i-dist').textContent = s.dist === '100 reps' ? T('100 次', '100 reps') : s.dist;
    $('i-load-k').textContent = divName() + T('規格／負重', ' — load');
    $('i-load').textContent = s.load(W, L);
    $('i-abil').textContent = KT.t(s.ability);
    $('i-move').textContent = KT.t(s.move);
    $('i-rules').textContent = KT.t(s.rules);
    $('i-train').textContent = KT.t(s.train);
    var on = st.mastered.indexOf(s.n) > -1, mb = $('i-master');
    mb.classList.toggle('on', on);
    mb.textContent = on ? T('✓ 已標記為熟悉', '✓ Marked as mastered') : T('標記為已熟悉', 'Mark as mastered');
    $('i-master-s').textContent = T('進度只存在你的瀏覽器', 'Progress is saved in your browser only');
    // "View in 3D": every station has a 3D version in the 3D Movement Lab (one folder up, same language)
    var a3 = $('i-3d');
    if (!a3) { a3 = document.createElement('a'); a3.id = 'i-3d'; a3.className = 'btn btn-3d'; mb.parentNode.insertBefore(a3, mb.nextSibling); }
    a3.href = '../lab/3d/#m=hyrox-' + s.clip;
    a3.textContent = T('🧊 看 3D 動作', '🧊 View in 3D');
    a3.title = T('在 3D 動作實驗室轉動、放慢這個動作', 'Turn this move round and slow it down in the 3D Movement Lab');
    $('p-title').textContent = n + ' ' + KT.pick(s.zh, s.en) + KT.pick('動作與距離示意', ' — movement demo');
    $('p-dist').textContent = s.dist === '100 reps' ? T('100 次', '100 reps') : s.dist;
    $('bars').innerHTML = s.bars.map(function (b) {
      return '<div class="bar"><span>' + esc(KT.pick(b[0], b[1])) + '</span><i><b style="width:0%" data-w="' + b[2] + '"></b></i><em>' + b[2] + '%</em></div>';
    }).join('');
    w.requestAnimationFrame(function () {
      [].forEach.call(d.querySelectorAll('#bars b'), function (b) { b.style.width = b.getAttribute('data-w') + '%'; });
    });
    if (player.clipKey !== s.clip) { player.load(H.CLIPS[s.clip]); player.clipKey = s.clip; }
    player.setInfo({ a: s.dist === '100 reps' ? T('100 次', '100 reps') : s.dist, b: s.load(W, L), note: KT.pick(null, s.note), targets: W.tgtM });
  }

  function renderGuide() {
    var rows = [['wo', null], ['wp', null], ['mo', null], ['mp', null], ['du', 'x'], ['re', 'x']].map(function (r) {
      var D = H.DIVS.filter(function (x) { return x.id === r[0]; })[0];
      var s = r[1] ? D.subs.filter(function (x) { return x.id === r[1]; })[0] : null, W = s ? s.w : D.w;
      return '<tr><td>' + esc(T(D.zh, D.en) + (s ? ' · ' + T(s.zh, s.en) : '')) + '</td><td>' + W.push + ' kg</td><td>' + W.pull + ' kg</td><td>' + W.fc + ' kg</td><td>' + W.lunge + ' kg</td><td>' + W.wb + ' kg</td><td>' + W.tgt + ' m</td></tr>';
    }).join('');
    var thead = '<tr><th>' + T('組別', 'Division') + '</th><th>' + T('推雪橇', 'Sled push') + '</th><th>' + T('拉雪橇', 'Sled pull') + '</th><th>' + T('農夫走路', 'Farmers carry') + '</th><th>' + T('弓箭步沙袋', 'Lunge bag') + '</th><th>' + T('藥球', 'Wall ball') + '</th><th>' + T('目標高度', 'Target') + '</th></tr>';
    var zh = st.lang === 'zh';
    $('guide').innerHTML =
      '<h2>' + T('HYROX 是什麼？', 'What is HYROX?') + '</h2>' +
      '<p>' + T('HYROX 是一項室內「健身競速賽」：所有選手在世界各地都完成同一套流程——跑 1 公里，接著完成一個功能性訓練站，重複 8 次。因為距離、動作和負重全球統一，你在任何一個城市的成績都可以直接和其他人比較。',
        'HYROX is an indoor fitness race. Everyone, everywhere, does the same format: run 1 km, complete one functional workout station, and repeat eight times. Because distances, movements and loads are standardised worldwide, a time set in one city compares directly with any other.') + '</p>' +
      '<p>' + T('跑步與站點之間的轉換區叫做 RoxZone。很多人忽略了這裡：從跑道進站、找器材、出站，每次只差幾秒，8 次累積下來就可能是好幾分鐘。',
        'The transition area between the running track and each station is called the RoxZone. It is easy to ignore, but a few seconds lost finding equipment on each of eight visits can add up to minutes.') + '</p>' +
      '<h2>' + T('各組別負重一覽', 'Loads for every division') + '</h2>' +
      '<div class="tbl-wrap"><table class="tbl"><thead>' + thead + '</thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="note">' + T('雪橇重量已包含雪橇本身。所有組別：滑雪機 1,000 m、推／拉雪橇各 50 m（4 × 12.5 m）、波比跳遠 80 m、划船 1,000 m、農夫走路 200 m、弓箭步 100 m、藥球 100 次。雙人組與接力的「女子／男子」分組分別使用女子公開／男子公開重量。資料來源：HYROX 官方網站及 2026/27 規則書。',
        'Sled weights include the sled. All divisions: SkiErg 1,000 m, sled push and pull 50 m each (4 × 12.5 m), burpee broad jumps 80 m, row 1,000 m, farmers carry 200 m, lunges 100 m, 100 wall balls. Women\'s and men\'s Doubles/Relay use Women Open / Men Open loads. Source: official HYROX website and the 2026/27 rulebook.') + '</p>' +
      '<h2>' + T('配速策略：跑步才是一半的比賽', 'Pacing: running is half the race') + '</h2>' +
      '<p>' + T('8 公里跑步大約佔完賽時間的一半。最常見的錯誤是第一段跑太快、在推雪橇前就把腿用光。建議以「可以說短句」的強度跑前 4 段，記錄每段時間；後半段如果還有餘力再加速。站點中，推雪橇、拉雪橇和弓箭步最傷腿，跑步配速要預留空間。',
        'The 8 km of running is roughly half your finishing time. The classic mistake is going out too fast on run 1 and arriving at the sled push with empty legs. Run the first four laps at a pace where you can still speak in short sentences, note your lap times, and only push in the second half. The sled push, sled pull and lunges hit the legs hardest, so leave room for them.') + '</p>' +
      '<h3>' + T('單人、雙人還是接力？', 'Singles, Doubles or Relay?') + '</h3>' +
      '<p>' + T('第一次參賽可以考慮雙人組：兩人一起跑完全部 8 公里，但每一站的工作量可以自由分配。接力則由四人組隊，每人跑 2 段 1 公里並完成 2 個站點，適合想體驗比賽氣氛的朋友或公司團隊。',
        'For a first race, Doubles is a friendly option: you both run the full 8 km but split each station however you like. In the Relay, four teammates each run 2 × 1 km and complete 2 stations — a good fit for friends or workplace teams who want the race atmosphere.') + '</p>' +
      '<h2>' + T('常見問題', 'Frequently asked questions') + '</h2>' +
      '<details><summary>' + T('HYROX 8 站的順序是什麼？', 'What are the 8 HYROX stations in order?') + '</summary><p>' + T('滑雪機 → 推雪橇 → 拉雪橇 → 波比跳遠 → 划船 → 農夫走路 → 負重弓箭步 → 藥球投擲，每站之前都要先跑 1 公里。', 'SkiErg → Sled Push → Sled Pull → Burpee Broad Jumps → Rowing → Farmers Carry → Sandbag Lunges → Wall Balls, each after a 1 km run.') + '</p></details>' +
      '<details><summary>' + T('沒做完一站會怎樣？', 'What if I can\'t finish a station?') + '</summary><p>' + T('依規則書，任何一站沒有完整完成都會被取消資格。可以在站內休息，但必須做完。', 'Under the rulebook, failing to complete any station in full is a disqualification. You may rest within the station, but you have to finish it.') + '</p></details>' +
      '<details><summary>' + T('藥球目標有多高？', 'How high is the wall ball target?') + '</summary><p>' + T('女子（公開與菁英）2.70 m，男子（公開與菁英）3.00 m。', 'Women (Open and Pro) 2.70 m; men (Open and Pro) 3.00 m.') + '</p></details>' +
      '<details><summary>' + T('這些動畫是官方示範嗎？', 'Are these animations official demos?') + '</summary><p>' + T('不是。動畫由 KungfuTutor 自行繪製，用來說明動作重點；正式規則請以 HYROX 官方規則書為準。', 'No. The animations are drawn by KungfuTutor to illustrate the key points of each movement; the official HYROX rulebook is the final word on standards.') + '</p></details>';
    void zh;
  }

  function renderAll() { renderDivs(); renderStats(); renderCards(); renderInspector(); renderGuide(); }

  function select(i, scroll) {
    st.idx = (i + 8) % 8;
    renderCards(); renderInspector();
    try { w.history.replaceState(null, '', '#s=' + (st.idx + 1) + '&d=' + st.div + (div().subs ? '&x=' + st.sub : '')); } catch (e) { /* file:// */ }
    if (scroll) { var r = $('inspector').getBoundingClientRect(); if (r.top > w.innerHeight * 0.6) $('inspector').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }

  /* ---------- events ---------- */
  $('divs').addEventListener('click', function (e) {
    var b = e.target.closest('[data-div]'); if (!b) return;
    st.div = b.getAttribute('data-div'); KT.store.set('kt.hx.div', st.div);
    renderDivs(); renderStats(); renderCards(); renderInspector();
  });
  $('subs').addEventListener('click', function (e) {
    var b = e.target.closest('[data-sub]'); if (!b) return;
    st.sub = b.getAttribute('data-sub'); KT.store.set('kt.hx.sub', st.sub);
    renderDivs(); renderStats(); renderCards(); renderInspector();
  });
  $('cards').addEventListener('click', function (e) {
    var b = e.target.closest('[data-i]'); if (b) select(+b.getAttribute('data-i'), true);
  });
  d.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    var t = e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
    if (e.key === 'ArrowRight') { select(st.idx + 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { select(st.idx - 1); e.preventDefault(); }
  });
  $('i-master').addEventListener('click', function () {
    var n = H.STATIONS[st.idx].n, p = st.mastered.indexOf(n);
    if (p > -1) st.mastered.splice(p, 1); else st.mastered.push(n);
    KT.store.set('kt.hx.mastered', st.mastered);
    renderStats(); renderCards(); renderInspector();
  });
  $('reset').addEventListener('click', function () {
    st.mastered = []; KT.store.set('kt.hx.mastered', []);
    renderStats(); renderCards(); renderInspector();
  });

  KT.onLang(function (l) { st.lang = l; renderAll(); });
})(window, document);
