/* KungfuTutor member sign-in — email + password, or phone number + text-message code.
 * Uses Firebase Authentication (Google). Loaded by kt-site.js only when someone
 * clicks "Sign in", or when this browser was signed in before, so normal page
 * loads stay light. Every visible line is a KT.pick pair for the 17 languages.
 *
 * To switch it on, paste the web-app settings from the Firebase console
 * (Project settings > Your apps > SDK setup and configuration > Config) below.
 * These values are public by design; access is controlled in the Firebase console.
 */
var CONFIG = null;
/* e.g.
var CONFIG = {
  apiKey: '...', authDomain: 'xxx.firebaseapp.com', projectId: 'xxx',
  appId: '1:...:web:...'
};
*/

var SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
var KT = window.KT, P = function (zh, en) { return KT.pick(zh, en); };
var fb = null, auth = null, user = null, box = null, recaptcha = null, confirmRes = null;

function load() {
  if (fb || !CONFIG) return Promise.resolve(fb);
  return Promise.all([import(SDK + 'firebase-app.js'), import(SDK + 'firebase-auth.js')]).then(function (m) {
    fb = m[1];
    auth = fb.getAuth(m[0].initializeApp(CONFIG));
    var code = KT.getLang();
    auth.languageCode = code === 'zh-Hant' ? 'zh-TW' : code === 'zh-Hans' ? 'zh-CN' : code;
    fb.onAuthStateChanged(auth, function (u) {
      user = u;
      KT.store.set('kt.member', u ? 1 : 0);
      paintButtons();
      if (u && box && box.classList.contains('open') && box.getAttribute('data-view') !== 'account') show('account');
    });
    return fb;
  });
}

function shortName(u) {
  if (!u) return '';
  if (u.email) return u.email.split('@')[0].slice(0, 14);
  if (u.phoneNumber) return '•••' + u.phoneNumber.slice(-4);
  return P('會員', 'Member');
}
function paintButtons() {
  [].forEach.call(document.querySelectorAll('[data-kt-auth]'), function (b) {
    b.textContent = user ? shortName(user) : P('登入', 'Sign in');
    b.setAttribute('aria-label', user ? P('我的帳號', 'My account') : P('登入', 'Sign in'));
  });
}

function msg(e) {
  var c = (e && e.code) || '';
  var map = {
    'auth/invalid-credential': ['電郵或密碼不正確。', 'The email or password is not right.'],
    'auth/wrong-password': ['電郵或密碼不正確。', 'The email or password is not right.'],
    'auth/user-not-found': ['找不到這個帳號，請先建立帳號。', 'No account with that email — create one first.'],
    'auth/email-already-in-use': ['這個電郵已經註冊，請直接登入。', 'That email is already registered — sign in instead.'],
    'auth/invalid-email': ['請輸入有效的電郵地址。', 'Please enter a valid email address.'],
    'auth/weak-password': ['密碼至少需要 6 個字元。', 'The password needs at least 6 characters.'],
    'auth/missing-password': ['請輸入密碼。', 'Please enter your password.'],
    'auth/too-many-requests': ['嘗試次數太多，請稍後再試。', 'Too many tries — please wait a little and try again.'],
    'auth/invalid-phone-number': ['請輸入含國碼的手機號碼，例如 +60 12 345 6789。', 'Enter your phone number with the country code, e.g. +60 12 345 6789.'],
    'auth/invalid-verification-code': ['驗證碼不正確。', 'That code is not right.'],
    'auth/code-expired': ['驗證碼已過期，請重新發送。', 'The code has expired — send a new one.'],
    'auth/network-request-failed': ['網路連線有問題，請再試一次。', 'Network problem — please try again.'],
    'auth/operation-not-allowed': ['這種登入方式尚未開放。', 'This sign-in method is not switched on yet.'],
    'auth/quota-exceeded': ['今天的簡訊額度已用完，請改用電郵登入。', 'Text-message limit reached for today — please use email instead.']
  };
  var m = map[c];
  return m ? P(m[0], m[1]) : P('發生錯誤，請再試一次。', 'Something went wrong — please try again.');
}

function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

function build() {
  if (box) return box;
  box = document.createElement('div');
  box.className = 'kt-modal';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-labelledby', 'kt-auth-h');
  box.innerHTML =
    '<div class="kt-modal-card">' +
      '<button class="kt-x" type="button" data-close aria-label="' + esc(P('關閉', 'Close')) + '">×</button>' +
      '<h2 id="kt-auth-h"></h2><p class="kt-sub"></p>' +
      '<div class="kt-tabs" role="tablist">' +
        '<button type="button" role="tab" data-tab="email">' + esc(P('電郵', 'Email')) + '</button>' +
        '<button type="button" role="tab" data-tab="phone">' + esc(P('手機號碼', 'Phone')) + '</button>' +
      '</div>' +
      '<form data-view-form="email" novalidate>' +
        '<label>' + esc(P('電郵地址', 'Email address')) + '<input type="email" name="email" autocomplete="email" required></label>' +
        '<label>' + esc(P('密碼', 'Password')) + '<input type="password" name="pw" autocomplete="current-password" minlength="6" required></label>' +
        '<button class="kt-go" type="submit" data-act="in">' + esc(P('登入', 'Sign in')) + '</button>' +
        '<button class="kt-go alt" type="button" data-act="up">' + esc(P('建立新帳號', 'Create a new account')) + '</button>' +
        '<button class="kt-link" type="button" data-act="reset">' + esc(P('忘記密碼？', 'Forgot your password?')) + '</button>' +
      '</form>' +
      '<form data-view-form="phone" novalidate>' +
        '<label>' + esc(P('手機號碼（含國碼）', 'Phone number (with country code)')) + '<input type="tel" name="tel" autocomplete="tel" placeholder="+60 12 345 6789" required></label>' +
        '<button class="kt-go" type="submit" data-act="send">' + esc(P('發送驗證碼', 'Text me a code')) + '</button>' +
        '<div class="kt-code" hidden><label>' + esc(P('6 位數驗證碼', '6-digit code')) + '<input type="text" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6"></label>' +
        '<button class="kt-go" type="button" data-act="verify">' + esc(P('確認並登入', 'Confirm and sign in')) + '</button></div>' +
        '<p class="kt-fine">' + esc(P('我們會發送一則簡訊驗證碼；電信商可能收取一般簡訊費用。', 'We will text you a one-time code; your carrier\'s normal text-message rates may apply.')) + '</p>' +
        '<div id="kt-recaptcha"></div>' +
      '</form>' +
      '<div class="kt-account" data-view-form="account"><p class="kt-who"></p>' +
        '<button class="kt-go alt" type="button" data-act="out">' + esc(P('登出', 'Sign out')) + '</button></div>' +
      '<div class="kt-off" data-view-form="off"><p>' + esc(P('會員登入正在設定中，很快就會開放。所有課程現在都可以免費使用。', 'Member sign-in is being set up and will open soon. Every lesson is free to use right now.')) + '</p></div>' +
      '<p class="kt-status" role="status" aria-live="polite"></p>' +
      '<p class="kt-legal">' + P('繼續即表示你同意本站的<a href="{t}">使用條款</a>與<a href="{p}">隱私權政策</a>。', 'By continuing you agree to the <a href="{t}">terms</a> and <a href="{p}">privacy policy</a>.').replace('{t}', KT.home + 'terms.html').replace('{p}', KT.home + 'privacy.html') + '</p>' +
    '</div>';
  document.body.appendChild(box);
  box.addEventListener('click', function (e) {
    if (e.target === box || e.target.hasAttribute('data-close')) close();
    var tab = e.target.getAttribute && e.target.getAttribute('data-tab');
    if (tab) show(tab);
    var act = e.target.getAttribute && e.target.getAttribute('data-act');
    if (act && e.target.type !== 'submit') { e.preventDefault(); run(act); }
  });
  [].forEach.call(box.querySelectorAll('form'), function (f) {
    f.addEventListener('submit', function (e) { e.preventDefault(); run(f.getAttribute('data-view-form') === 'email' ? 'in' : 'send'); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('open')) close(); });
  return box;
}

function show(view) {
  box.setAttribute('data-view', view);
  [].forEach.call(box.querySelectorAll('[data-view-form]'), function (f) { f.hidden = f.getAttribute('data-view-form') !== view; });
  [].forEach.call(box.querySelectorAll('[data-tab]'), function (t) { t.setAttribute('aria-selected', t.getAttribute('data-tab') === view ? 'true' : 'false'); });
  box.querySelector('.kt-tabs').hidden = view === 'account' || view === 'off';
  var h = box.querySelector('h2'), sub = box.querySelector('.kt-sub');
  if (view === 'account') {
    h.textContent = P('我的帳號', 'My account');
    sub.textContent = '';
    box.querySelector('.kt-who').textContent = P('已登入：', 'Signed in as ') + (user.email || user.phoneNumber || '');
  } else if (view === 'off') {
    h.textContent = P('會員登入', 'Member sign-in'); sub.textContent = '';
  } else {
    h.textContent = P('登入或免費加入', 'Sign in or join free');
    sub.textContent = P('用電郵或手機號碼。所有課程都免費。', 'Use your email or phone number. Every lesson is free.');
  }
  say('');
}
function say(t, bad) { var s = box.querySelector('.kt-status'); s.textContent = t; s.classList.toggle('bad', !!bad); }
function busy(on) { [].forEach.call(box.querySelectorAll('button.kt-go'), function (b) { b.disabled = on; }); }

function run(act) {
  if (act === 'out') { fb.signOut(auth).then(close); return; }
  var f = box.querySelector('[data-view-form="' + (act === 'send' || act === 'verify' ? 'phone' : 'email') + '"]');
  var email = f.email && f.email.value.trim(), pw = f.pw && f.pw.value;
  var job;
  if (act === 'in') job = fb.signInWithEmailAndPassword(auth, email, pw);
  else if (act === 'up') job = fb.createUserWithEmailAndPassword(auth, email, pw).then(function (r) {
    return fb.sendEmailVerification(r.user).then(function () { say(P('帳號已建立！我們已寄出確認信到你的電郵。', 'Account created! We have sent a confirmation link to your email.')); });
  });
  else if (act === 'reset') {
    if (!email) { say(P('請先輸入你的電郵地址。', 'Enter your email address first.'), true); return; }
    job = fb.sendPasswordResetEmail(auth, email).then(function () { say(P('已寄出重設密碼的連結，請查看電郵。', 'We have emailed you a link to reset your password.')); });
  } else if (act === 'send') {
    var tel = f.tel.value.replace(/[\s()-]/g, '');
    if (!/^\+\d{6,15}$/.test(tel)) { say(msg({ code: 'auth/invalid-phone-number' }), true); return; }
    if (!recaptcha) recaptcha = new fb.RecaptchaVerifier(auth, 'kt-recaptcha', { size: 'invisible' });
    job = fb.signInWithPhoneNumber(auth, tel, recaptcha).then(function (r) {
      confirmRes = r;
      f.querySelector('.kt-code').hidden = false;
      f.code.focus();
      say(P('驗證碼已發送，請查看簡訊。', 'Code sent — check your text messages.'));
    });
  } else if (act === 'verify') {
    if (!confirmRes) return;
    job = confirmRes.confirm(f.code.value.trim());
  }
  if (!job) return;
  busy(true); say(P('請稍候…', 'Please wait…'));
  job.then(function () { busy(false); if (act === 'in' || act === 'verify') close(); })
    .catch(function (e) {
      busy(false); say(msg(e), true);
      if (act === 'send' && recaptcha) { try { recaptcha.clear(); } catch (x) { /* ignore */ } recaptcha = null; }
    });
}

var lastFocus = null;
function open() {
  build();
  lastFocus = document.activeElement;
  box.classList.add('open');
  document.documentElement.classList.add('kt-noscroll');
  if (!CONFIG) { show('off'); return; }
  load().then(function () { show(user ? 'account' : 'email'); var i = box.querySelector('[data-view-form]:not([hidden]) input'); if (i) i.focus(); })
    .catch(function () { show('email'); say(msg({ code: 'auth/network-request-failed' }), true); });
}
function close() {
  if (!box) return;
  box.classList.remove('open');
  document.documentElement.classList.remove('kt-noscroll');
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

export { open, load, paintButtons };
export var ready = !!CONFIG;
