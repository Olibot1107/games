(function () {
  'use strict';

  // ── Build overlay ──────────────────────────────────────────────────────────
  const el = document.createElement('div');
  el.style.cssText = [
    'position:fixed',
    'top:10px',
    'right:10px',
    'z-index:999998',
    'display:inline-flex',
    'align-items:center',
    'gap:7px',
    'background:rgba(30,12,3,0.82)',
    'border:1px solid rgba(251,146,60,0.22)',
    'border-radius:999px',
    'padding:4px 13px',
    'font-family:monospace,sans-serif',
    'font-size:13px',
    'color:rgba(255,255,255,0.75)',
    'cursor:move',
    'user-select:none',
    'pointer-events:auto',
    'backdrop-filter:blur(6px)',
    'white-space:nowrap',
  ].join(';');

  function divider() {
    const s = document.createElement('span');
    s.textContent = '·';
    s.style.cssText = 'color:rgba(255,255,255,0.2);font-size:10px';
    return s;
  }

  // ── Fullscreen button ─────────────────────────────────────────────────────
  const fsBtn = document.createElement('span');
  fsBtn.style.cssText = 'cursor:pointer;opacity:0.6;font-size:14px;line-height:1;transition:opacity 0.15s';
  fsBtn.title = 'Toggle fullscreen (`)';

  const ICON_EXPAND   = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;vertical-align:middle"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>';
  const ICON_COMPRESS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;vertical-align:middle"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>';

  function updateFsIcon() {
    fsBtn.innerHTML = document.fullscreenElement ? ICON_COMPRESS : ICON_EXPAND;
  }

  fsBtn.onmouseover = () => fsBtn.style.opacity = '1';
  fsBtn.onmouseout  = () => fsBtn.style.opacity = '0.6';
  fsBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  });
  document.addEventListener('fullscreenchange', updateFsIcon);
  updateFsIcon();
  el.appendChild(fsBtn);

  el.appendChild(divider());

  // ── FPS segment ───────────────────────────────────────────────────────────
  const fpsEl = document.createElement('span');
  fpsEl.id = '__sb_fps';
  fpsEl.textContent = '-- fps';
  el.appendChild(fpsEl);

  el.appendChild(divider());

  // ── Time segment ──────────────────────────────────────────────────────────
  const timeEl = document.createElement('span');
  timeEl.id = '__sb_time';
  el.appendChild(timeEl);

  // ── Battery segment ───────────────────────────────────────────────────────
  const div2   = divider();
  const battWrap = document.createElement('span');
  battWrap.style.cssText = 'display:none;align-items:center;gap:5px';

  const battSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  battSvg.setAttribute('viewBox', '0 0 24 24');
  battSvg.setAttribute('fill', 'none');
  battSvg.setAttribute('stroke', 'currentColor');
  battSvg.setAttribute('stroke-width', '2');
  battSvg.id = '__sb_batt_svg';
  battSvg.style.cssText = 'width:22px;height:22px;flex-shrink:0';

  const battLabel = document.createElement('span');
  battLabel.id = '__sb_batt_label';

  battWrap.appendChild(battSvg);
  battWrap.appendChild(battLabel);

  el.appendChild(div2);
  el.appendChild(battWrap);

  document.body.appendChild(el);

  // ── FPS loop ──────────────────────────────────────────────────────────────
  let frames = 0, lastTime = performance.now(), lastUpdate = lastTime;

  function fpsColor(fps) {
    if (fps >= 54) return '#4ade80';
    if (fps >= 30) return '#facc15';
    return '#f87171';
  }

  function fpsLoop() {
    frames++;
    const now = performance.now();
    if (now - lastUpdate >= 500) {
      let fps = Math.round((frames * 1000) / (now - lastTime));
      // match fps.js boosted display
      if (fps > 40) fps = Math.min(240, fps + Math.floor((240 - fps) * 0.4 + (Math.random() * 6 - 3)));
      fpsEl.textContent = fps + ' fps';
      fpsEl.style.color = fpsColor(fps);
      frames = 0;
      lastTime = now;
      lastUpdate = now;
    }
    requestAnimationFrame(fpsLoop);
  }
  requestAnimationFrame(fpsLoop);

  // ── Clock ─────────────────────────────────────────────────────────────────
  function updateTime() {
    const d = new Date();
    timeEl.textContent = String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
  }
  updateTime();
  setInterval(updateTime, 10000);

  // ── Battery ───────────────────────────────────────────────────────────────
  if (navigator.getBattery) {
    navigator.getBattery().then(function (b) {
      function updateBatt() {
        const pct    = Math.round(b.level * 100);
        const colour = pct < 20 ? '#ef4444' : pct < 40 ? '#eab308' : '#fb923c';
        battLabel.textContent = pct + '%';
        battSvg.innerHTML = `
          <rect x="2" y="7" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
          <path d="M20 11h2v3h-2" stroke="currentColor" stroke-width="2" fill="none"/>
          <rect x="3" y="8.5" width="${Math.round(16 * b.level)}" height="8" rx="1" fill="${colour}" stroke="none"/>`;
        battWrap.style.cssText = 'display:inline-flex;align-items:center;gap:5px';
      }
      updateBatt();
      b.addEventListener('levelchange',    updateBatt);
      b.addEventListener('chargingchange', updateBatt);
    });
  } else {
    div2.style.display = 'none';
  }

  // ── Drag (cookie-persisted, same as fps.js) ───────────────────────────────
  function savePos(x, y) {
    document.cookie = 'sbPos=' + x + ',' + y + '; path=/; max-age=' + (60*60*24*30);
  }
  (function loadPos() {
    const m = document.cookie.match(/sbPos=([^;]+)/);
    if (m) {
      const p = m[1].split(',').map(Number);
      el.style.left  = p[0] + 'px';
      el.style.top   = p[1] + 'px';
      el.style.right = 'auto';
    }
  })();

  let ox = 0, oy = 0, dragging = false;
  el.addEventListener('mousedown', function (e) {
    dragging = true;
    const r = el.getBoundingClientRect();
    ox = e.clientX - r.left;
    oy = e.clientY - r.top;
    e.preventDefault();
  });
  window.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    el.style.left  = (e.clientX - ox) + 'px';
    el.style.top   = (e.clientY - oy) + 'px';
    el.style.right = 'auto';
  });
  window.addEventListener('mouseup', function () {
    if (!dragging) return;
    dragging = false;
    const r = el.getBoundingClientRect();
    savePos(r.left, r.top);
  });
})();
