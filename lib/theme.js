(function () {
  var html = document.documentElement;

  function applyTheme(t) {
    html.setAttribute('data-theme', t);
    localStorage.setItem('ps-theme', t);
    var metaTc = document.querySelector('meta[name="theme-color"]');
    var metaCs = document.querySelector('meta[name="color-scheme"]');
    if (metaTc) metaTc.content = t === 'light' ? '#fdf8f2' : '#0a0500';
    if (metaCs) metaCs.content = t === 'light' ? 'light' : 'dark';
    syncIcons(t);
  }

  function syncIcons(t) {
    var sun  = document.getElementById('theme-icon-sun');
    var moon = document.getElementById('theme-icon-moon');
    if (sun)  sun.style.display  = t === 'dark'  ? '' : 'none';
    if (moon) moon.style.display = t === 'light' ? '' : 'none';
  }

  // Wire toggle button once DOM is ready
  function wireToggle() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var current = html.getAttribute('data-theme') || 'dark';
    syncIcons(current);
    btn.addEventListener('click', function () {
      var next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireToggle);
  } else {
    wireToggle();
  }
})();
