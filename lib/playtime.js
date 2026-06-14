(function () {
  'use strict';

  const match = location.pathname.match(/^\/(good|nova)\/([^\/]+)\/index\.html$/);
  if (!match) return;

  const game = decodeURIComponent(match[2]);
  let lastTick = Date.now();
  let paused = document.hidden;

  function tick() {
    if (paused) return;
    const now = Date.now();
    const delta = Math.floor((now - lastTick) / 1000);
    lastTick = now;
    if (delta <= 0 || delta > 60) return; // ignore huge gaps (sleep/suspend)
    try {
      const pt = JSON.parse(localStorage.getItem('userPlayTime') || '{}');
      pt[game] = (Number(pt[game]) || 0) + delta;
      localStorage.setItem('userPlayTime', JSON.stringify(pt));
    } catch (e) {}
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      tick(); // flush before pausing
      paused = true;
    } else {
      lastTick = Date.now(); // reset so hidden time isn't counted
      paused = false;
    }
  });

  setInterval(tick, 1000);
  window.addEventListener('pagehide', tick);
  window.addEventListener('beforeunload', tick);
})();
