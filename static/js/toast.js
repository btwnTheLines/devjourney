// static/js/toast.js
(function () {
  function el(id) { return document.getElementById(id); }
  function showToast(msg) {
    var t = el('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.remove('hidden');
    // auto-hide after 4s
    setTimeout(function () { t.classList.add('hidden'); }, 4000);
  }
  function getParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }
  function cleanUrl() {
    var clean = window.location.pathname + window.location.hash;
    window.history.replaceState({}, document.title, clean);
  }

  function run() {
    var status = getParam('status');
    if (status === 'deleted') {
      showToast('Your account was deleted.');
      cleanUrl();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
