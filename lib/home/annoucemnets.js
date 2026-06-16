(function () {
  const TYPES = {
    new:     { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="#fb923c" stroke-width="2" style="width:16px;height:16px;flex-shrink:0;margin-top:2px"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,     color: '#fb923c', bg: 'rgba(60,25,5,0.65)',  border: 'rgba(251,146,60,0.28)' },
    info:    { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="#93c5fd" stroke-width="2" style="width:16px;height:16px;flex-shrink:0;margin-top:2px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,    color: '#93c5fd', bg: 'rgba(5,20,55,0.60)',  border: 'rgba(147,197,253,0.20)' },
    warning: { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="#fde047" stroke-width="2" style="width:16px;height:16px;flex-shrink:0;margin-top:2px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`, color: '#fde047', bg: 'rgba(50,40,0,0.60)',  border: 'rgba(253,224,71,0.22)'  },
    update:  { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" stroke-width="2" style="width:16px;height:16px;flex-shrink:0;margin-top:2px"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`, color: '#c4b5fd', bg: 'rgba(30,5,55,0.60)',  border: 'rgba(196,181,253,0.22)' },
  };

  const dismissed = new Set(JSON.parse(localStorage.getItem('dismissed_ann') || '[]'));
  const section   = document.getElementById('announcements-section');

  function dismiss(id, el) {
    dismissed.add(id);
    localStorage.setItem('dismissed_ann', JSON.stringify([...dismissed]));
    el.style.cssText += 'opacity:0;transform:translateY(-4px);transition:opacity 0.2s,transform 0.2s;';
    setTimeout(() => { el.remove(); if (!section.children.length) section.style.display = 'none'; }, 220);
  }

  fetch('/announcements.json')
    .then(r => r.json())
    .then(items => {
      const visible = items.filter(a => !dismissed.has(a.id));
      if (!visible.length) { section.style.display = 'none'; return; }

      visible.forEach(ann => {
        const typeKeys = String(ann.type || 'info').split('/').map(t => t.trim());
        const styles   = typeKeys.map(k => TYPES[k] || TYPES.info);
        const primary  = styles[0];
        const icons    = styles.map(s => s.icon).join('');
        const bgStyle  = styles.length > 1
          ? `linear-gradient(135deg,${styles.map(s=>s.bg).join(',')})`
          : primary.bg;

        const el = document.createElement('div');
        el.style.cssText = `background:${bgStyle};border:1px solid ${primary.border};border-radius:14px;padding:13px 16px;display:flex;align-items:flex-start;gap:11px;margin-bottom:8px;`;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = 'color:rgba(255,255,255,0.22);font-size:20px;line-height:1;background:none;border:none;cursor:pointer;flex-shrink:0;padding:0;margin-top:-1px;transition:color 0.15s;';
        closeBtn.onmouseover = () => closeBtn.style.color = 'rgba(255,255,255,0.65)';
        closeBtn.onmouseout  = () => closeBtn.style.color = 'rgba(255,255,255,0.22)';
        closeBtn.onclick = () => dismiss(ann.id, el);

        const typeBadges = styles.map((s, i) =>
          `<span style="font-size:10px;font-weight:600;color:${s.color};background:${s.bg};border:1px solid ${s.border};border-radius:4px;padding:1px 6px;letter-spacing:0.04em">${typeKeys[i].toUpperCase()}</span>`
        ).join('');

        el.innerHTML = `
          <div style="display:flex;gap:4px;flex-shrink:0;margin-top:2px">${icons}</div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px">
              ${typeBadges}
              <span style="font-size:13px;font-weight:600;color:${primary.color}">${ann.title}</span>
              ${ann.date ? `<span style="font-size:11px;color:rgba(255,255,255,0.25)">${ann.date}</span>` : ''}
            </div>
            <p style="font-size:13px;color:rgba(255,255,255,0.55);line-height:1.5;margin:0">${ann.text}</p>
          </div>`;
        el.appendChild(closeBtn);
        section.appendChild(el);
      });
    })
    .catch(() => { section.style.display = 'none'; });
})();