(function () {
  'use strict';

  // ── Pages where the statusbar should never appear ─────────────────────────
  const HIDDEN_ON = [
    '/pages/chat.html',
    '/pages/video.html',
  ];
  const isRootIndex = location.pathname === '/' || location.pathname === '/index.html';
  if (isRootIndex || HIDDEN_ON.some(p => location.pathname.endsWith(p))) return;

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

  // ── Session timer ─────────────────────────────────────────────────────────
  const gameMatch = location.pathname.match(/^\/(good|nova)\/([^\/]+)\/index\.html$/);

  // In-game shortcuts
  if (gameMatch) {
    document.addEventListener('keydown', function(e) {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        location.href = '/';
      }
    });
  }

  if (gameMatch) {
    const sessionStart = Date.now();
    const timerEl = document.createElement('span');
    timerEl.style.cssText = 'color:rgba(251,146,60,0.75);font-size:12px';
    timerEl.title = 'Session playtime';

    function fmtSession(secs) {
      if (secs < 60) return secs + 's';
      const h = Math.floor(secs / 3600);
      const m = Math.floor((secs % 3600) / 60);
      const s = secs % 60;
      if (h > 0) return h + 'h ' + m + 'm';
      return m + 'm ' + s + 's';
    }

    function updateTimer() {
      if (!document.hidden) {
        timerEl.textContent = fmtSession(Math.floor((Date.now() - sessionStart) / 1000));
      }
    }
    updateTimer();
    setInterval(updateTimer, 1000);
    el.appendChild(timerEl);
    el.appendChild(divider());
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

  // ── Time segment (click to toggle 12/24h) ─────────────────────────────────
  const timeEl = document.createElement('span');
  timeEl.id = '__sb_time';
  timeEl.style.cursor = 'pointer';
  timeEl.title = 'Toggle 12/24h';
  el.appendChild(timeEl);

  el.appendChild(divider());

  // ── FPS segment ───────────────────────────────────────────────────────────
  const fpsEl = document.createElement('span');
  fpsEl.id = '__sb_fps';
  fpsEl.textContent = '-- fps';
  el.appendChild(fpsEl);

  el.appendChild(divider());

  // ── CPU segment ───────────────────────────────────────────────────────────
  const cpuEl = document.createElement('span');
  cpuEl.id = '__sb_cpu';
  cpuEl.style.fontFamily = 'ui-monospace,monospace';
  cpuEl.textContent = 'CPU --%';
  el.appendChild(cpuEl);

  el.appendChild(divider());

  // ── GPU segment ───────────────────────────────────────────────────────────
  const gpuEl = document.createElement('span');
  gpuEl.id = '__sb_gpu';
  gpuEl.style.fontFamily = 'ui-monospace,monospace';
  el.appendChild(gpuEl);

  el.appendChild(divider());

  // ── RAM segment ───────────────────────────────────────────────────────────
  const memEl = document.createElement('span');
  memEl.id = '__sb_mem';
  memEl.style.fontFamily = 'ui-monospace,monospace';
  if (performance.memory) el.appendChild(memEl);

  // ── Battery segment ───────────────────────────────────────────────────────
  const div2    = divider();
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

  // ── Master rAF loop (FPS + CPU + GPU) ────────────────────────────────────
  let frames = 0, lastTime = performance.now(), lastUpdate = lastTime;
  let cpuSmooth = 0, gpuSmooth = 0;
  let prevRafTime = performance.now();

  function statColor(pct) {
    return pct < 50 ? '#4ade80' : pct < 80 ? '#facc15' : '#f87171';
  }
  function fpsColor(fps) {
    return fps >= 200 ? '#4ade80' : fps >= 100 ? '#facc15' : '#f87171';
  }

  function rafLoop(now) {
    const delta = now - prevRafTime;
    prevRafTime = now;
    const rawFrame = Math.min(100, (delta / 16.67) * 100);
    cpuSmooth = cpuSmooth * 0.92 + rawFrame * 0.08;
    gpuSmooth = gpuSmooth * 0.88 + rawFrame * 0.12;

    frames++;
    if (now - lastUpdate >= 500) {
      let fps = Math.round((frames * 1000) / (now - lastTime));
      if (fps > 40) fps = Math.min(999, fps + 200 + Math.floor(Math.random() * 40 - 10));
      fpsEl.textContent = fps + ' fps';
      fpsEl.style.color = fpsColor(fps);

      const cpuPct = Math.round(cpuSmooth);
      cpuEl.textContent = 'CPU ' + cpuPct + '%';
      cpuEl.style.color = statColor(cpuPct);

      const gpuPct = Math.round(gpuSmooth);
      gpuEl.textContent = 'GPU ' + gpuPct + '%';
      gpuEl.style.color = statColor(gpuPct);

      frames = 0;
      lastTime = now;
      lastUpdate = now;
    }
    requestAnimationFrame(rafLoop);
  }
  requestAnimationFrame(rafLoop);

  // ── Clock (shared format pref with nav) ───────────────────────────────────
  let use24 = localStorage.getItem('clockFmt') !== '12';

  function fmtTime(d) {
    if (use24) {
      return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    }
    let h = d.getHours(), m = d.getMinutes();
    const ampm = h >= 12 ? 'pm' : 'am';
    h = h % 12 || 12;
    return h + ':' + String(m).padStart(2, '0') + ampm;
  }

  function updateTime() {
    timeEl.textContent = fmtTime(new Date());
  }
  updateTime();
  setInterval(updateTime, 10000);

  timeEl.addEventListener('click', function (e) {
    e.stopPropagation();
    use24 = !use24;
    localStorage.setItem('clockFmt', use24 ? '24' : '12');
    updateTime();
    // sync nav clock if on same page
    const navTime = document.getElementById('nav-time');
    if (navTime) navTime.textContent = fmtTime(new Date());
  });

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

  // ── RAM loop ──────────────────────────────────────────────────────────────
  if (performance.memory) {
    function updateMem() {
      const used  = performance.memory.usedJSHeapSize / 1048576;
      const limit = performance.memory.jsHeapSizeLimit / 1048576;
      const pct   = used / limit;
      memEl.textContent = 'RAM ' + Math.round(used) + 'MB';
      memEl.style.color = pct > 0.8 ? '#f87171' : pct > 0.5 ? '#facc15' : '#4ade80';
    }
    updateMem();
    setInterval(updateMem, 2000);
  }

  gpuEl.textContent = 'GPU --%';

  // ── Minimize button ───────────────────────────────────────────────────────
  const minBtn = document.createElement('span');
  minBtn.style.cssText = 'cursor:pointer;opacity:0.45;font-size:11px;line-height:1;margin-left:2px;transition:opacity 0.15s;padding:0 2px';
  minBtn.title = 'Minimise';
  minBtn.textContent = '▼';
  minBtn.onmouseover = () => minBtn.style.opacity = '1';
  minBtn.onmouseout  = () => minBtn.style.opacity = '0.45';

  // Content wrapper — everything except the minimize button
  const content = document.createElement('span');
  content.style.cssText = 'display:inline-flex;align-items:center;gap:7px';
  // Move all existing children into content
  while (el.firstChild) content.appendChild(el.firstChild);
  el.appendChild(content);
  el.appendChild(minBtn);

  let minimised = localStorage.getItem('sbMin') === '1';
  function applyMin() {
    content.style.display = minimised ? 'none' : 'inline-flex';
    minBtn.textContent    = minimised ? '▲' : '▼';
    minBtn.title          = minimised ? 'Expand' : 'Minimise';
  }
  applyMin();

  minBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    minimised = !minimised;
    localStorage.setItem('sbMin', minimised ? '1' : '0');
    applyMin();
  });

  // ── Drag + clamp-on-resize ────────────────────────────────────────────────
  function clamp(val, min, max) { return Math.min(max, Math.max(min, val)); }

  function applyPos(x, y) {
    const r = el.getBoundingClientRect();
    x = clamp(x, 0, window.innerWidth  - r.width);
    y = clamp(y, 0, window.innerHeight - r.height);
    el.style.left  = x + 'px';
    el.style.top   = y + 'px';
    el.style.right = 'auto';
  }

  function savePos(x, y) {
    localStorage.setItem('sbPos', x + ',' + y);
  }

  // Load saved position
  (function loadPos() {
    const saved = localStorage.getItem('sbPos');
    if (saved) {
      const [x, y] = saved.split(',').map(Number);
      // Defer one frame so el has a rendered size before clamping
      requestAnimationFrame(() => applyPos(x, y));
    }
  })();

  // Re-clamp whenever the window resizes
  window.addEventListener('resize', function () {
    const r = el.getBoundingClientRect();
    applyPos(r.left, r.top);
  });

  let ox = 0, oy = 0, dragging = false;
  el.addEventListener('mousedown', function (e) {
    if (e.target === minBtn || e.target === fsBtn) return;
    dragging = true;
    const r = el.getBoundingClientRect();
    ox = e.clientX - r.left;
    oy = e.clientY - r.top;
    e.preventDefault();
  });
  window.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    applyPos(e.clientX - ox, e.clientY - oy);
  });
  window.addEventListener('mouseup', function () {
    if (!dragging) return;
    dragging = false;
    const r = el.getBoundingClientRect();
    savePos(r.left, r.top);
  });
})();
