(function () {
  const label = document.getElementById('nav-time');
  let use24 = localStorage.getItem('clockFmt') !== '12';

  function fmt(d) {
    if (use24) {
      return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    }
    let h = d.getHours(), m = d.getMinutes();
    const ampm = h >= 12 ? 'pm' : 'am';
    h = h % 12 || 12;
    return h + ':' + String(m).padStart(2, '0') + ampm;
  }

  function tick() {
    const d = new Date();
    label.textContent = fmt(d);
    setTimeout(tick, (60 - d.getSeconds()) * 1000 - d.getMilliseconds());
  }
  tick();

  document.getElementById('nav-clock-chip').addEventListener('click', () => {
    use24 = !use24;
    localStorage.setItem('clockFmt', use24 ? '24' : '12');
    label.textContent = fmt(new Date());
  });
})();

// ── Nav weather + sun phase (one ipapi call) ──────────────────────────────────
(function () {
  const chip    = document.getElementById('nav-weather-chip');
  const label   = document.getElementById('nav-weather');
  const sunIcon = document.getElementById('nav-sun-icon');

  const moonSvg = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
  const sunSvg  = `<circle cx="12" cy="12" r="4"/>
    <line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
    <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
    <line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
    <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>`;

  function iconColor(tempF) {
    if (tempF <= 32) return '#93c5fd';
    if (tempF <= 55) return '#67e8f9';
    if (tempF <= 75) return '#fdba74';
    if (tempF <= 90) return '#fde047';
    return '#fb923c';
  }

  let storedTempF = null;
  let useCelsius  = localStorage.getItem('weatherUnit') === 'c';

  function renderTemp() {
    if (storedTempF === null) return;
    if (useCelsius) {
      const c = Math.round((storedTempF - 32) * 5 / 9);
      label.textContent = c + '°C';
    } else {
      label.textContent = storedTempF + '°F';
    }
  }

  chip.style.cursor = 'pointer';
  chip.addEventListener('click', () => {
    useCelsius = !useCelsius;
    localStorage.setItem('weatherUnit', useCelsius ? 'c' : 'f');
    renderTemp();
  });

  function fetchAll(lat, lon) {
    const today = new Date().toISOString().slice(0, 10);
    Promise.all([
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`).then(r => r.json()),
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset&timezone=auto&start_date=${today}&end_date=${today}`).then(r => r.json()),
    ]).then(([wx, sun]) => {
      storedTempF = Math.round(wx.current_weather.temperature);
      const rise  = new Date(sun.daily.sunrise[0]);
      const set   = new Date(sun.daily.sunset[0]);
      const now   = new Date();
      const isDay = now >= rise && now < set;

      sunIcon.innerHTML = isDay ? sunSvg : moonSvg;
      sunIcon.setAttribute('stroke', iconColor(storedTempF));
      renderTemp();
      chip.style.display = 'flex';
    }).catch(() => {});
  }

  fetch('https://ipapi.co/json/')
    .then(r => r.json())
    .then(d => { if (d.latitude) fetchAll(d.latitude, d.longitude); })
    .catch(() => {});
})();

// ── Nav battery ──────────────────────────────────────────────────────────────
(function () {
  if (!navigator.getBattery) return;
  const chip  = document.getElementById('nav-battery-chip');
  const label = document.getElementById('nav-battery');

  function update(b) {
    const pct    = Math.round(b.level * 100);
    const colour = pct < 20 ? '#ef4444' : pct < 40 ? '#eab308' : '#fb923c';
    label.textContent = pct + '%';

    const icon = document.getElementById('nav-battery-icon');
    icon.innerHTML = `
      <rect x="2" y="7" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M20 11h2v3h-2" stroke="currentColor" stroke-width="2" fill="none"/>
      <rect x="3" y="8.5" width="${Math.round(16 * b.level)}" height="8" rx="1" fill="${colour}" stroke="none"/>`;

    chip.style.display = 'flex';
  }

  navigator.getBattery().then(b => {
    update(b);
    b.addEventListener('levelchange',    () => update(b));
    b.addEventListener('chargingchange', () => update(b));
  });
})();

(function(){
  const btn = document.getElementById('scroll-top');
  window.addEventListener('scroll', function() {
    const show = window.scrollY > 400;
    btn.style.display = show ? 'flex' : 'none';
  }, { passive: true });
})();