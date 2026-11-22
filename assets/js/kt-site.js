/* KungfuTutor site helpers: 17 languages, safe storage, AdSense slots.
 *
 * Languages work like www.bullnbull.com: English sits at the site root, every
 * other language has its own folder (/zh-hant/, /id/, /ja/ …) built by
 * engine/kt_i18n.py. The page's language comes from <html data-page-lang>,
 * or ?lang=xx while testing locally. Text is written in the source as
 * Traditional Chinese + English pairs; every other language is looked up
 * from assets/i18n/<code>.js by its English text (KT.pick / KT.t).
 */
(function (w, d) {
  'use strict';

  /* ===== AdSense settings — fill these in after Google approves the site ===== */
  var ADSENSE_CLIENT = '';           // e.g. 'ca-pub-1234567890123456'
  var AD_SLOTS = {                   // slot ids from AdSense > Ads > By ad unit
    'top': '', 'mid': '', 'bottom': ''
  };
  /* ========================================================================== */

  // code, folder, name in its own language, right-to-left — same list and order as bullnbull.com
  var LANGS = [
    ['en', '', 'English', 0], ['zh-Hans', 'zh-hans', '简体中文', 0], ['zh-Hant', 'zh-hant', '繁體中文', 0],
    ['id', 'id', 'Bahasa Indonesia', 0], ['ms', 'ms', 'Bahasa Melayu', 0], ['th', 'th', 'ไทย', 0],
    ['vi', 'vi', 'Tiếng Việt', 0], ['ja', 'ja', '日本語', 0], ['ko', 'ko', '한국어', 0],
    ['fil', 'fil', 'Filipino', 0], ['pt', 'pt', 'Português', 0], ['hi', 'hi', 'हिन्दी', 0],
    ['es', 'es', 'Español', 0], ['fr', 'fr', 'Français', 0], ['bn', 'bn', 'বাংলা', 0],
    ['ar', 'ar', 'العربية', 1], ['ur', 'ur', 'اردو', 1]
  ];
  function info(code) { for (var i = 0; i < LANGS.length; i++) if (LANGS[i][0] === code) return LANGS[i]; return null; }

  var store = {
    get: function (k, def) {
      try { var v = w.localStorage.getItem(k); return v === null ? def : JSON.parse(v); } catch (e) { return def; }
    },
    set: function (k, v) { try { w.localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };

  // where assets/ lives, from this script's own address
  var me = d.currentScript && d.currentScript.src || '';
  var ASSETS = me.replace(/js\/kt-site\.js.*$/, '');
  var ROOT = ASSETS.replace(/assets\/$/, '');

  function pageLang() {
    var q = /[?&]lang=([A-Za-z-]+)/.exec(w.location.search);
    if (q && info(q[1])) return q[1];
    var p = d.documentElement.getAttribute('data-page-lang');
    return info(p) ? p : 'en';
  }
  var LANG = pageLang();

  // the dictionary for this language loads before any page script runs
  if (LANG !== 'en' && LANG !== 'zh-Hant' && ASSETS) {
    d.write('<script src="' + ASSETS + 'i18n/' + LANG + '.js"><\/script>');
  }
  function dict() { return (w.KT_I18N && w.KT_I18N[LANG]) || {}; }

  /* ----- translation ----- */
  function pick(zh, en) {
    if (Array.isArray(en)) return en.map(function (e, i) { return pick(zh && zh[i], e); });
    if (LANG === 'zh-Hant') return zh === undefined || zh === null ? en : zh;
    if (LANG === 'en' || en === undefined || en === null || en === '') return en;
    var v = dict()[en];
    if (typeof v === 'string' && v) return v;
    return LANG === 'zh-Hans' && zh ? zh : en;
  }
  function t(o) { return o ? pick(o.zh, o.en) : ''; }
  // a lesson's short name: the translated name without a trailing "(…)" (and, if cut, without ": …")
  function name(s, cutColon) {
    var v = pick(s.zh, s.en);
    if (LANG === 'zh-Hant' || LANG === 'zh-Hans') return v;
    v = String(v).replace(/\s*[(（][^()（）]*[)）]\s*$/, '');
    return cutColon ? v.replace(/\s*[:：].*$/, '') : v;
  }
  function fmt(s, vars) {
    if (!vars || typeof s !== 'string') return s;
    return s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] !== undefined ? vars[k] : m; });
  }

  /* ----- addresses ----- */
  // this page's address with the language folder removed, relative to the site root
  function restPath() {
    var path = w.location.pathname, rootPath = ROOT ? new URL(ROOT).pathname : '/';
    var rel = path.indexOf(rootPath) === 0 ? path.slice(rootPath.length) : path.replace(/^\//, '');
    var first = rel.split('/')[0];
    for (var i = 1; i < LANGS.length; i++) if (LANGS[i][1] === first) { rel = rel.slice(first.length + 1); break; }
    return rel;
  }
  function urlFor(code) {
    var L = info(code); if (!L) return '';
    var base = ROOT || '/';
    return base + (L[1] ? L[1] + '/' : '') + restPath() + w.location.hash;
  }

  /* ----- applying the language ----- */
  var listeners = [];
  function apply() {
    var L = info(LANG);
    d.documentElement.lang = LANG;
    d.documentElement.dir = L[3] ? 'rtl' : 'ltr';
    [].forEach.call(d.querySelectorAll('[data-zh]'), function (el) {
      var v = pick(el.getAttribute('data-zh'), el.getAttribute('data-en'));
      if (v !== null) el.textContent = v;
    });
    listeners.forEach(function (fn) { fn(LANG); });
  }
  function setLang(code) {
    if (!info(code) || code === LANG) return;
    store.set('kt.lang', code);
    var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(w.location.hostname);
    var built = d.documentElement.getAttribute('data-page-lang');
    if (built || !local) { w.location.href = urlFor(code); return; }
    // local preview of an unbuilt page: reload with ?lang=
    var u = new URL(w.location.href); u.searchParams.set('lang', code); w.location.href = u.toString();
  }

  // the header picker: one menu with all 17 languages
  function buildPicker() {
    [].forEach.call(d.querySelectorAll('.kt-lang'), function (box) {
      var sel = d.createElement('select');
      sel.className = 'kt-lang-select';
      sel.setAttribute('aria-label', 'Language');
      LANGS.forEach(function (L) {
        var o = d.createElement('option'); o.value = L[0]; o.textContent = L[2];
        if (L[0] === LANG) o.selected = true;
        sel.appendChild(o);
      });
      sel.addEventListener('change', function () { setLang(sel.value); });
      box.innerHTML = '';
      box.appendChild(sel);
    });
  }

  function initAds() {
    var slots = d.querySelectorAll('.ad-slot');
    if (!ADSENSE_CLIENT) {
      // Local preview: show the reserved box. Live site: hide empty slots until AdSense is approved.
      var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
      [].forEach.call(slots, function (s) {
        if (local) s.innerHTML = '<span class="ad-ph">Ad space reserved · AdSense pending</span>';
        else s.style.display = 'none';
      });
      return;
    }
    var sc = d.createElement('script');
    sc.async = true;
    sc.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADSENSE_CLIENT;
    sc.crossOrigin = 'anonymous';
    d.head.appendChild(sc);
    [].forEach.call(slots, function (s) {
      var id = AD_SLOTS[s.getAttribute('data-slot')] || '';
      s.innerHTML = '<ins class="adsbygoogle" data-ad-client="' + ADSENSE_CLIENT + '"' +
        (id ? ' data-ad-slot="' + id + '"' : '') + ' data-ad-format="auto" data-full-width-responsive="true"></ins>';
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    });
  }

  d.addEventListener('DOMContentLoaded', function () {
    buildPicker();
    apply();
    initAds();
    var y = d.getElementById('kt-year');
    if (y) y.textContent = new Date().getFullYear();
  });

  w.KT = {
    store: store, LANGS: LANGS, lang: LANG, pick: pick, t: t, name: name, fmt: fmt, urlFor: urlFor,
    isZh: function () { return LANG === 'zh-Hant' || LANG === 'zh-Hans'; },
    getLang: function () { return LANG; }, setLang: setLang,
    onLang: function (fn) { listeners.push(fn); }
  };
})(window, document);
