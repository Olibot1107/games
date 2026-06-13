document.addEventListener('DOMContentLoaded', () => {

const gamesList = document.getElementById('games-list');
const searchInput = document.getElementById('search');
const favoritesList = document.getElementById('favorites-list');
const debugPanel = document.getElementById('debug-panel');

let allGames = [];
let voteData = {};
let commentData = {};
let playData = {};
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentCommentGame = null;
const COMMENT_MIN_LENGTH = 1;
const COMMENT_MAX_LENGTH = 300;
const MAX_COMMENT_IMAGES = 5;
const MAX_COMMENT_IMAGE_SIZE = 5 * 1024 * 1024;
const COMMENT_IMAGE_BASE = '/uploads';
let isSubmittingComment = false;
let selectedImages = [];
const CLIENT_ID_COOKIE = 'clientID';
const resourceJsonCache = new Map();
const resourceJsonInflight = new Map();
const plainJsonCache = new Map();
const plainJsonInflight = new Map();

// ── Thumbnail localStorage cache ─────────────────────────────────────────────
const THUMB_PREFIX = 'th2_';
const THUMB_MAX_DIM = 160;
const THUMB_QUALITY = 0.72;
const THUMBS_READY_KEY = 'thumbs_ready_v2';

function thumbKey(gameName) {
    return THUMB_PREFIX + gameName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 80);
}

function loadThumb(gameName) {
    try { return localStorage.getItem(thumbKey(gameName)); } catch { return null; }
}

function saveThumb(gameName, imgEl) {
    try {
        const iw = imgEl.naturalWidth  || THUMB_MAX_DIM;
        const ih = imgEl.naturalHeight || THUMB_MAX_DIM;
        const scale = Math.min(1, THUMB_MAX_DIM / Math.max(iw, ih));
        const c = document.createElement('canvas');
        c.width  = Math.round(iw * scale);
        c.height = Math.round(ih * scale);
        c.getContext('2d').drawImage(imgEl, 0, 0, c.width, c.height);
        const data = c.toDataURL('image/jpeg', THUMB_QUALITY);
        localStorage.setItem(thumbKey(gameName), data);
    } catch (e) {
        // QuotaExceededError or tainted canvas — silently skip
    }
}

function saveThumbIdle(gameName, imgEl) {
    if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => saveThumb(gameName, imgEl), { timeout: 3000 });
    } else {
        setTimeout(() => saveThumb(gameName, imgEl), 50);
    }
}

async function preloadAllThumbnails(games, onProgress) {
    const BATCH = 10;
    let done = 0;
    const total = games.length;
    for (let i = 0; i < total; i += BATCH) {
        const batch = games.slice(i, i + BATCH);
        await Promise.all(batch.map(game => new Promise(resolve => {
            const cached = loadThumb(game.name);
            if (cached) { onProgress(++done, total, cached); resolve(); return; }
            const img = new Image();
            img.onload = () => {
                saveThumb(game.name, img);
                onProgress(++done, total, loadThumb(game.name));
                resolve();
            };
            img.onerror = () => { onProgress(++done, total, null); resolve(); };
            img.src = `/thumbnails/${game.name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 80)}.jpg`;
        })));
    }
}

// ── Orbit loading animation ──────────────────────────────────────────────────
const LO_INNER_R    = 72;  // first ring radius (px)
const LO_RING_GAP   = 42;  // px between ring centres
const LO_ITEM_SIZE  = 32;  // thumbnail px (+ 4px gap = 36 spacing budget)

let loThumbData = []; // { cell, baseAngle, r, speed }
let loOrbitDeg  = 0;
let loOrbitRaf  = null;
let loStage     = null;

// Returns { r, angle, speed } for slot `index`, no upper limit.
function loGetSlot(index) {
    let offset = 0, ri = 0;
    while (true) {
        const r     = LO_INNER_R + ri * LO_RING_GAP;
        const slots = Math.max(6, Math.floor((2 * Math.PI * r) / (LO_ITEM_SIZE + 4)));
        if (index < offset + slots) {
            const angle = ((index - offset) / slots) * 360;
            const speed = 1 / (1 + ri * 0.32); // outer rings spin slower
            return { r, angle, speed };
        }
        offset += slots;
        ri++;
    }
}

function loAnimate() {
    loOrbitDeg += 0.28;
    const rad = Math.PI / 180;
    for (const d of loThumbData) {
        const deg = (d.baseAngle + loOrbitDeg * d.speed) * rad;
        const tx  = Math.round(Math.cos(deg) * d.r * 10) / 10;
        const ty  = Math.round(Math.sin(deg) * d.r * 10) / 10;
        d.cell.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;
    }
    loOrbitRaf = requestAnimationFrame(loAnimate);
}

function loAddThumb(thumbUrl) {
    if (!loStage) return;
    const slot = loGetSlot(loThumbData.length);
    const rad  = slot.angle * Math.PI / 180;
    const tx   = Math.round(Math.cos(rad) * slot.r * 10) / 10;
    const ty   = Math.round(Math.sin(rad) * slot.r * 10) / 10;

    const cell = document.createElement('div');
    cell.style.cssText = [
        'position:absolute', 'left:50%', 'top:50%',
        'width:30px', 'height:30px',
        'border-radius:7px', 'overflow:hidden',
        'border:1.5px solid rgba(251,146,60,0.28)',
        'background:#1b0900',
        'box-shadow:0 2px 10px rgba(0,0,0,0.65)',
        'will-change:transform',
        `--tx:calc(-50% + ${tx}px)`, `--ty:calc(-50% + ${ty}px)`,
        `transform:translate(calc(-50% + ${tx}px),calc(-50% + ${ty}px))`,
        'animation:lo-pop 0.22s ease forwards',
    ].join(';');

    if (thumbUrl) {
        const img = document.createElement('img');
        img.src = thumbUrl;
        img.style.cssText = 'width:100%;height:100%;object-fit:cover';
        cell.appendChild(img);
    } else {
        cell.style.background = 'rgba(251,146,60,0.07)';
    }

    loStage.appendChild(cell);
    loThumbData.push({ cell, baseAngle: slot.angle, r: slot.r, speed: slot.speed });

    if (!loOrbitRaf) loAnimate();
}

function dismissLoadingOverlay() {
    if (loOrbitRaf) { cancelAnimationFrame(loOrbitRaf); loOrbitRaf = null; }
    const overlay = document.getElementById('loading-overlay');
    if (!overlay) return;
    overlay.style.transition = 'opacity 0.4s';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 420);
}

// UID
if(!localStorage.getItem('uid')){
    localStorage.setItem('uid', Math.random().toString(36).slice(2));
}
const uid = localStorage.getItem('uid');
const clientId = getClientId();

let userPlayTime = {};
try {
    // migrate from old cookie storage → localStorage
    const cookieVal = getCookie('playTime');
    if (cookieVal) {
        const migrated = JSON.parse(cookieVal);
        localStorage.setItem('userPlayTime', JSON.stringify(migrated));
        setCookie('playTime', '', -1);
    }
    userPlayTime = JSON.parse(localStorage.getItem('userPlayTime') || '{}');
} catch(e) {}

function savePlayTime() {
    try { localStorage.setItem('userPlayTime', JSON.stringify(userPlayTime)); } catch(e) {}
}

function formatPlaytime(secs) {
    if (!secs || secs < 60) return secs > 0 ? '< 1m' : null;
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`;
    return `${m}m`;
}

// Check for reload from game (tracks play duration)
if (performance.getEntriesByType('navigation')[0].type === 'reload' && document.referrer) {
    try {
        const url = new URL(document.referrer);
        const match = url.pathname.match(/^\/(good|nova)\/([^\/]+)\/index\.html$/);
        if (match) {
            const game = match[2];
            const startTime = parseInt(getCookie('playStart_' + game) || '0', 10);
            const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
            if (duration > 0) {
                if (!userPlayTime[game]) userPlayTime[game] = 0;
                userPlayTime[game] += duration;
                savePlayTime();
            }
            setCookie('playStart_' + game, '', -1);
            
            fetch('/api/plays', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({ game, clientId })
            }).then(() => {
                fetchPlayCounts();
            }).catch(() => {});
        }
    } catch (e) {
        // ignore
    }
}
const RESOURCE_KEY = new TextEncoder().encode('games-shell-v1');

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[2]) : null;
}

function base64ToUint8Array(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

function xorBuffer(buffer) {
    const out = new Uint8Array(buffer.length);
    const keyLen = RESOURCE_KEY.length;
    let i = 0;

    const limit = buffer.length - 15;
    while (i < limit) {
        out[i] = buffer[i] ^ RESOURCE_KEY[(i) % keyLen];
        out[i + 1] = buffer[i + 1] ^ RESOURCE_KEY[(i + 1) % keyLen];
        out[i + 2] = buffer[i + 2] ^ RESOURCE_KEY[(i + 2) % keyLen];
        out[i + 3] = buffer[i + 3] ^ RESOURCE_KEY[(i + 3) % keyLen];
        out[i + 4] = buffer[i + 4] ^ RESOURCE_KEY[(i + 4) % keyLen];
        out[i + 5] = buffer[i + 5] ^ RESOURCE_KEY[(i + 5) % keyLen];
        out[i + 6] = buffer[i + 6] ^ RESOURCE_KEY[(i + 6) % keyLen];
        out[i + 7] = buffer[i + 7] ^ RESOURCE_KEY[(i + 7) % keyLen];
        out[i + 8] = buffer[i + 8] ^ RESOURCE_KEY[(i + 8) % keyLen];
        out[i + 9] = buffer[i + 9] ^ RESOURCE_KEY[(i + 9) % keyLen];
        out[i + 10] = buffer[i + 10] ^ RESOURCE_KEY[(i + 10) % keyLen];
        out[i + 11] = buffer[i + 11] ^ RESOURCE_KEY[(i + 11) % keyLen];
        out[i + 12] = buffer[i + 12] ^ RESOURCE_KEY[(i + 12) % keyLen];
        out[i + 13] = buffer[i + 13] ^ RESOURCE_KEY[(i + 13) % keyLen];
        out[i + 14] = buffer[i + 14] ^ RESOURCE_KEY[(i + 14) % keyLen];
        out[i + 15] = buffer[i + 15] ^ RESOURCE_KEY[(i + 15) % keyLen];
        i += 16;
    }
    while (i < buffer.length) {
        out[i] = buffer[i] ^ RESOURCE_KEY[i % keyLen];
        i++;
    }
    return out;
}

function decodeEncryptedPayload(payload) {
    const envelopeText = new TextDecoder().decode(xorBuffer(base64ToUint8Array(payload)));
    const envelope = JSON.parse(envelopeText);
    const decryptedFile = xorBuffer(base64ToUint8Array(envelope.payload));
    return new TextDecoder().decode(decryptedFile);
}

async function fetchEncryptedJson(path) {
    if (resourceJsonCache.has(path)) {
        return resourceJsonCache.get(path);
    }

    if (resourceJsonInflight.has(path)) {
        return resourceJsonInflight.get(path);
    }

    const request = fetch('/api/resource', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ path })
    })
    .then(r => {
        if (!r.ok) throw new Error('Failed to fetch encrypted resource');
        return r.json();
    })
    .then(data => {
        if (!data.files || !data.files[0] || !data.files[0].payload) {
            throw new Error('Invalid encrypted response');
        }
        const jsonText = decodeEncryptedPayload(data.files[0].payload);
        const parsed = JSON.parse(jsonText);
        resourceJsonCache.set(path, parsed);
        return parsed;
    })
    .finally(() => {
        resourceJsonInflight.delete(path);
    });

    resourceJsonInflight.set(path, request);
    return request;
}

async function fetchEncryptedJsonBatch(paths) {
    const uniquePaths = [...new Set(paths.filter(Boolean))];
    const missingPaths = uniquePaths.filter(path => !resourceJsonCache.has(path) && !resourceJsonInflight.has(path));

    if (missingPaths.length > 0) {
        const request = fetch('/api/resource', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ paths: missingPaths })
        })
        .then(r => {
            if (!r.ok) throw new Error('Failed to fetch encrypted resources');
            return r.json();
        })
        .then(data => {
            const files = Array.isArray(data.files) ? data.files : [];
            files.forEach((file, index) => {
                const path = missingPaths[index];
                if (!file || !file.payload) {
                    return;
                }
                const jsonText = decodeEncryptedPayload(file.payload);
                resourceJsonCache.set(path, JSON.parse(jsonText));
            });
        })
        .finally(() => {
            missingPaths.forEach(path => resourceJsonInflight.delete(path));
        });

        missingPaths.forEach(path => resourceJsonInflight.set(path, request));
        await request;
    }

    const result = {};
    uniquePaths.forEach(path => {
        if (resourceJsonCache.has(path)) {
            result[path] = resourceJsonCache.get(path);
        }
    });
    return result;
}

function invalidateResourceJsonCache(...paths) {
    paths.flat().forEach((path) => {
        resourceJsonCache.delete(path);
        resourceJsonInflight.delete(path);
    });
}

async function fetchPlainJson(path) {
    if (plainJsonCache.has(path)) {
        return plainJsonCache.get(path);
    }

    if (plainJsonInflight.has(path)) {
        return plainJsonInflight.get(path);
    }

    const request = fetch(path)
    .then(r => {
        if (!r.ok) throw new Error(`Failed to fetch ${path}`);
        return r.json();
    })
    .then(data => {
        plainJsonCache.set(path, data);
        return data;
    })
    .finally(() => {
        plainJsonInflight.delete(path);
    });

    plainJsonInflight.set(path, request);
    return request;
}

function invalidatePlainJsonCache(...paths) {
    paths.flat().forEach((path) => {
        plainJsonCache.delete(path);
        plainJsonInflight.delete(path);
    });
}

function setCookie(name, value, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getClientId(){
    let id = getCookie(CLIENT_ID_COOKIE);
    if (!id) {
        id = "Anonymous"
    }
    return id;
}

function log(msg){
    if(!debugPanel) return;
    debugPanel.classList.remove('hidden');
    debugPanel.textContent += "\n" + msg;
}

// Debounced render — batches rapid successive calls into one DOM update
let _renderPending = false;
function scheduleRender() {
    if (_renderPending) return;
    _renderPending = true;
    setTimeout(() => { _renderPending = false; renderGames(); }, 0);
}

// ================= FAVORITES =================
function saveFavorites(){
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
}

function toggleFavorite(game){
    if(favorites.includes(game)){
        favorites = favorites.filter(f => f !== game);
    } else {
        favorites.push(game);
    }
    saveFavorites();
    renderGames();
}
    
function renderFavorites(){
    if(!favoritesList) return;
    const section = document.getElementById('favorites-section');
    favoritesList.innerHTML = '';

    // sort favorites by playtime desc
    const sorted = [...favorites].sort((a, b) => (userPlayTime[b] || 0) - (userPlayTime[a] || 0));

    if(sorted.length === 0){
        if(section) section.classList.add('hidden');
        return;
    }
    if(section) section.classList.remove('hidden');

    sorted.forEach(f => {
        const gameData = allGames.find(g => g.name === f);
        const category = gameData ? gameData.category : 'good';
        const secs = userPlayTime[f] || 0;
        const timeStr = formatPlaytime(secs);
        const displayName = toTitleCase(f);
        const href = `/${category}/${f}/index.html`;

        const card = document.createElement('div');
        card.style.cssText = 'position:relative;width:130px;flex-shrink:0;border-radius:12px;overflow:hidden;cursor:pointer;background:rgba(30,10,2,0.85);border:1px solid rgba(251,146,60,0.18);transition:transform 0.15s,border-color 0.15s,box-shadow 0.15s;';
        card.onmouseover = () => { card.style.transform = 'translateY(-3px)'; card.style.borderColor = 'rgba(251,146,60,0.55)'; card.style.boxShadow = '0 6px 20px rgba(251,146,60,0.12)'; };
        card.onmouseout  = () => { card.style.transform = ''; card.style.borderColor = 'rgba(251,146,60,0.18)'; card.style.boxShadow = ''; };
        card.onclick = () => { window.location.href = href; };

        // thumbnail
        const imgWrap = document.createElement('div');
        imgWrap.style.cssText = 'width:100%;height:78px;overflow:hidden;background:#120600;';
        const img = document.createElement('img');
        img.alt = displayName;
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 0.3s;';
        const cached = loadThumb(f);
        if (cached) { img.src = cached; img.style.opacity = '1'; }
        else {
            img.onload = () => { img.style.opacity = '1'; saveThumbIdle(f, img); };
            img.onerror = () => {};
            img.src = `/thumbnails/${f.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 80)}.jpg`;
        }
        imgWrap.appendChild(img);
        card.appendChild(imgWrap);

        // name + playtime
        const info = document.createElement('div');
        info.style.cssText = 'padding:6px 8px 7px;';
        const nameEl = document.createElement('div');
        nameEl.textContent = displayName;
        nameEl.style.cssText = 'font-size:11px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.35;';
        info.appendChild(nameEl);
        if (timeStr) {
            const timeEl = document.createElement('div');
            timeEl.style.cssText = 'font-size:10px;color:rgba(251,146,60,0.75);margin-top:2px;display:flex;align-items:center;gap:4px;';
            const clockSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:10px;height:10px;flex-shrink:0"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`;
            timeEl.innerHTML = clockSvg + timeStr;
            info.appendChild(timeEl);
        } else {
            const neverEl = document.createElement('div');
            neverEl.textContent = 'Not played yet';
            neverEl.style.cssText = 'font-size:10px;color:rgba(255,255,255,0.2);margin-top:2px;';
            info.appendChild(neverEl);
        }
        card.appendChild(info);

        // remove button — X in top-right corner
        const removeBtn = document.createElement('button');
        removeBtn.title = 'Remove from favorites';
        removeBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:9px;height:9px"><path d="M18 6 6 18M6 6l12 12"/></svg>`;
        removeBtn.style.cssText = 'position:absolute;top:4px;right:4px;background:rgba(0,0,0,0.60);border:1px solid rgba(255,255,255,0.12);border-radius:999px;width:20px;height:20px;color:rgba(255,255,255,0.7);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;transition:all 0.15s;';
        removeBtn.onmouseover = () => { removeBtn.style.background = 'rgba(239,68,68,0.75)'; removeBtn.style.color = '#fff'; };
        removeBtn.onmouseout  = () => { removeBtn.style.background = 'rgba(0,0,0,0.60)'; removeBtn.style.color = 'rgba(255,255,255,0.7)'; };
        removeBtn.onclick = (e) => { e.stopPropagation(); toggleFavorite(f); };
        card.appendChild(removeBtn);

        favoritesList.appendChild(card);
    });
}

// ================= GAME COLOR =================
function gameColor(name) {
    let hash = 5381;
    for (let i = 0; i < name.length; i++) {
        hash = (((hash << 5) + hash) ^ name.charCodeAt(i)) | 0;
    }
    return `hsl(${Math.abs(hash) % 360}, 40%, 25%)`;
}

function toTitleCase(str) {
    return str
        .replace(/[-_.]+/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
        .trim();
}

// ================= GAME ITEM (card) =================
function createGameItem(game, votes){
    const isFav = favorites.includes(game.name);
    const displayName = toTitleCase(game.name);
    const href = `/${game.category}/${game.name}/index.html`;
    const commentCount = commentData[game.name]?.count || 0;
    const playCount = playData[game.name] || 0;
    const userSecs = userPlayTime[game.name] || 0;

    const li = document.createElement('li');
    li.className = 'game-card';
    li.style.backgroundColor = gameColor(game.name);
    li.title = displayName;

    // Shimmer — visible while image is loading
    const shimmer = document.createElement('div');
    shimmer.className = 'card-shimmer';
    li.appendChild(shimmer);

    const img = document.createElement('img');
    img.alt = displayName;
    img.loading = 'lazy';
    img.className = 'absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500';

    const cached = loadThumb(game.name);
    if (cached) {
        img.src = cached;
        img.style.opacity = '1';
        shimmer.remove();
    } else {
        img.onload = () => {
            img.style.opacity = '1';
            shimmer.remove();
            saveThumbIdle(game.name, img);
        };
        img.onerror = () => { img.remove(); shimmer.remove(); };
        img.src = `/thumbnails/${game.name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 80)}.jpg`;
    }
    li.appendChild(img);

    // ── Top bar — always visible vote buttons ─────────────────────────────
    const topBar = document.createElement('div');
    topBar.className = 'absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-1.5 pt-1.5';

    const PILL = 'display:inline-flex;align-items:center;gap:3px;padding:4px 8px;border-radius:999px;font-size:11px;font-weight:700;cursor:pointer;transition:background 0.15s,border-color 0.15s;border:1px solid rgba(255,255,255,0.18);';

    const mkVoteBtn = (svg, active, activeBg, activeBorder, cb) => {
        const b = document.createElement('button');
        b.style.cssText = PILL + (active
            ? `background:${activeBg};border-color:${activeBorder};color:#fff;`
            : 'background:rgba(0,0,0,0.60);color:#fff;');
        b.innerHTML = svg;
        b.onmouseover = () => { if (!active) b.style.background = 'rgba(0,0,0,0.80)'; };
        b.onmouseout  = () => { if (!active) b.style.background = 'rgba(0,0,0,0.60)'; };
        b.onclick = (e) => { e.stopPropagation(); cb(); };
        return b;
    };

    const upSvg   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:11px;height:11px"><path d="M12 19V5M5 12l7-7 7 7"/></svg>${votes.up}`;
    const downSvg = `${votes.down}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:11px;height:11px"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>`;

    const upBtn   = mkVoteBtn(upSvg,   votes.userVote === 'up',   'rgba(34,197,94,0.85)',  'rgba(34,197,94,0.6)',  () => sendVote(game.name, 'up'));
    const downBtn = mkVoteBtn(downSvg, votes.userVote === 'down', 'rgba(239,68,68,0.85)',  'rgba(239,68,68,0.6)',  () => sendVote(game.name, 'down'));

    const topLeft = document.createElement('div');
    topLeft.style.cssText = 'display:flex;gap:4px';
    topLeft.append(upBtn, downBtn);

    // Favorite star — top-right
    const favBtn = document.createElement('button');
    favBtn.style.cssText = PILL + `font-size:13px;padding:3px 7px;${isFav ? 'background:rgba(0,0,0,0.60);color:#facc15;border-color:rgba(250,204,21,0.5);' : 'background:rgba(0,0,0,0.60);color:rgba(255,255,255,0.75);'}`;
    favBtn.textContent = isFav ? '★' : '☆';
    favBtn.title = isFav ? 'Remove favorite' : 'Add to favorites';
    favBtn.onmouseover = () => { favBtn.style.color = '#facc15'; favBtn.style.borderColor = 'rgba(250,204,21,0.5)'; };
    favBtn.onmouseout  = () => { favBtn.style.color = isFav ? '#facc15' : 'rgba(255,255,255,0.75)'; favBtn.style.borderColor = isFav ? 'rgba(250,204,21,0.5)' : 'rgba(255,255,255,0.18)'; };
    favBtn.onclick = (e) => { e.stopPropagation(); toggleFavorite(game.name); };

    topBar.append(topLeft, favBtn);
    li.appendChild(topBar);

    // ── Bottom bar — name + action buttons ───────────────────────────────
    const nameBar = document.createElement('div');
    nameBar.className = 'absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-2 pt-5 pb-1.5 flex items-end gap-1';

    // name + optional playtime
    const nameGroup = document.createElement('div');
    nameGroup.style.cssText = 'flex:1;min-width:0;display:flex;flex-direction:column;gap:0;';
    const nameTxt = document.createElement('span');
    nameTxt.className = 'text-[11px] text-white font-semibold truncate leading-tight';
    nameTxt.textContent = displayName;
    nameGroup.appendChild(nameTxt);
    const ptStr = formatPlaytime(userSecs);
    if (ptStr) {
        const ptEl = document.createElement('span');
        ptEl.style.cssText = 'font-size:9px;color:rgba(251,146,60,0.75);line-height:1.2;white-space:nowrap;display:flex;align-items:center;gap:2px;';
        ptEl.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:8px;height:8px;flex-shrink:0"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>${ptStr}`;
        nameGroup.appendChild(ptEl);
    }
    nameBar.appendChild(nameGroup);

    const mkActionBtn = (svg, cb) => {
        const b = document.createElement('button');
        b.style.cssText = 'background:rgba(0,0,0,0.55);border:1px solid rgba(255,255,255,0.15);border-radius:999px;cursor:pointer;padding:4px 6px;color:rgba(255,255,255,0.85);transition:all 0.15s;flex-shrink:0;line-height:1;display:inline-flex;align-items:center;backdrop-filter:blur(4px);';
        b.innerHTML = svg;
        b.onmouseover = () => { b.style.background = 'rgba(0,0,0,0.80)'; b.style.color = '#fff'; };
        b.onmouseout  = () => { b.style.background = 'rgba(0,0,0,0.55)'; b.style.color = 'rgba(255,255,255,0.85)'; };
        b.onclick = (e) => { e.stopPropagation(); cb(); };
        return b;
    };

    const commentSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
    const playsSvg   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`;

    nameBar.append(
        mkActionBtn(commentSvg, () => openCommentPanel(game.name)),
        mkActionBtn(playsSvg,   () => openPlayModal(game.name))
    );
    li.appendChild(nameBar);
    li.onclick = () => incrementPlayAndNavigate(game, href);

    return li;
}

// ================= RENDER =================
function renderGames(){
    if(!gamesList) return;

    const search = searchInput.value.toLowerCase();

    let filtered = allGames.filter(g =>
        g.name.toLowerCase().includes(search)
    );

    filtered.sort((a,b)=>{
        const aV = voteData[a.name] || {up:0,down:0};
        const bV = voteData[b.name] || {up:0,down:0};
        const aComments = commentData[a.name]?.count || 0;
        const bComments = commentData[b.name]?.count || 0;
        const aPlays = playData[a.name] || 0;
        const bPlays = playData[b.name] || 0;
        const aUserTime = userPlayTime[a.name] || 0;
        const bUserTime = userPlayTime[b.name] || 0;
        const aScore = (aV.up - aV.down) + aComments + Math.floor(aPlays / 30) + Math.floor(aUserTime / 60);
        const bScore = (bV.up - bV.down) + bComments + Math.floor(bPlays / 30) + Math.floor(bUserTime / 60);
        return bScore - aScore;
    });

    gamesList.innerHTML = '';

    if(filtered.length===0){
        gamesList.innerHTML = '<li class="col-span-full text-white/25 text-center py-12 text-sm">No games found</li>';
        return;
    }

    filtered.forEach(g=>{
        gamesList.appendChild(
            createGameItem(
                g,
                voteData[g.name] || {up:0,down:0,userVote:null}
            )
        );
    });

}

// ================= VOTES =================
function fetchVotes(){
    fetchPlainJson('/votes.json')
    .then(data=>{
        voteData = {};

        allGames.forEach(g=>{
            const raw = data[g.name] || {};

            let up = 0;
            let down = 0;

            Object.values(raw).forEach(v=>{
                if(v === 'up') up++;
                if(v === 'down') down++;
            });

            voteData[g.name] = {
                up,
                down,
                userVote: raw[uid] || null
            };
        });

        scheduleRender();
        log('votes loaded');
    })
    .catch(e=>log(e.message));
}

function fetchCommentCounts(){
    fetchEncryptedJson('comments.json')
    .then(data=>{
        commentData = {};
        const comments = data || {};
        Object.entries(comments).forEach(([game, list]) => {
            commentData[game] = { count: Array.isArray(list) ? list.length : 0 };
        });
        scheduleRender();
    })
    .catch(e=>{
        log('Comment counts error: ' + e.message);
    });
}

function fetchPlayCounts(){
    fetchEncryptedJson('plays.json')
    .then(data=>{
        const counts = {};
        Object.entries(data || {}).forEach(([game, value]) => {
            if (typeof value === 'number') {
                counts[game] = value;
            } else if (typeof value === 'object' && value !== null) {
                counts[game] = Number(value.total) || Object.values(value.clients || {}).reduce((sum, v) => sum + Number(v || 0), 0);
            } else {
                counts[game] = 0;
            }
        });
        playData = counts;
        scheduleRender();
    })
    .catch(e=>{
        log('Play counts error: ' + e.message);
    });
}

function incrementPlayAndNavigate(game, href){
    setCookie('playStart_' + game.name, Date.now());
    fetch('/api/plays', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ game: game.name, clientId })
    })
    .then(() => {
        invalidateResourceJsonCache('plays.json');
        fetchPlayCounts();
        window.location.href = href;
    })
    .catch(() => {
        window.location.href = href;
    });
}

function openPlayModal(game){
    const modal = document.getElementById('plays-modal');
    const title = document.getElementById('plays-modal-title');
    const totalLabel = document.getElementById('plays-modal-total');
    const list = document.getElementById('plays-list');
    if (!modal || !title || !totalLabel || !list) return;

    title.textContent = `Players for ${game}`;
    totalLabel.textContent = 'Loading...';
    list.innerHTML = '<div class="text-gray-500 italic">Loading play history...</div>';
    modal.classList.remove('hidden');
    loadPlayDetails(game);
}

function closePlayModal(){
    const modal = document.getElementById('plays-modal');
    if (!modal) return;
    modal.classList.add('hidden');
}

function loadPlayDetails(game){
    const totalLabel = document.getElementById('plays-modal-total');
    const list = document.getElementById('plays-list');
    if (!totalLabel || !list) return;

    fetchEncryptedJson('plays.json')
    .then(data => {
        const record = data && data[game];
        const detail = (record && record.clients) || {};
        const total = record && typeof record.total !== 'undefined'
            ? Number(record.total)
            : Object.values(detail).reduce((sum, value) => sum + Number(value || 0), 0);

        totalLabel.textContent = `Total plays: ${total}`;
        list.innerHTML = '';

        const rows = Object.entries(detail).sort((a,b)=>b[1]-a[1]);
        if (!rows.length) {
            list.innerHTML = '<div class="text-gray-500 italic">Nobody has played this yet.</div>';
            return;
        }

        rows.forEach(([id, count]) => {
            const item = document.createElement('div');
            item.className = 'p-3 border border-white/10 rounded-lg bg-white/5 mb-2';
            item.innerHTML = `
                <div class="flex items-center justify-between text-sm text-white/70">
                    <span>${escapeHtml(id)}</span>
                    <span>${count} time${count === 1 ? '' : 's'}</span>
                </div>
            `;
            list.appendChild(item);
        });
    })
    .catch(e => {
        list.innerHTML = `<div class="text-red-500">Unable to load plays.</div>`;
        totalLabel.textContent = '';
        log('Play detail error: ' + e.message);
    });
}

function escapeHtml(text){
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function timeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return seconds === 1 ? '1s ago' : `${seconds}s ago`;
    if (minutes < 60) return minutes === 1 ? '1m ago' : `${minutes}m ago`;
    if (hours < 24) return hours === 1 ? '1h ago' : `${hours}h ago`;
    if (days < 7) return days === 1 ? '1d ago' : `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
}

function initPlayTimeTracking(gameName){
    const cookieName = 'playStart_' + gameName;
    if(!document.cookie.split(';').some(c => c.trim().startsWith(cookieName + '='))){
        document.cookie = cookieName + '=' + Date.now() + '; path=/';
    }
    window.addEventListener('beforeunload', function(){
        document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    });
}

function normalizeCommentImageUrl(url) {
    if (!url) return '';
    if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
        return url;
    }
    if (url.startsWith('/math/uploads/')) {
        return url.replace('/math/uploads/', '/uploads/');
    }
    if (url.startsWith('/uploads/')) {
        return url;
    }
    if (url.startsWith('uploads/')) {
        return `/${url}`;
    }
    return url.startsWith('/') ? url : `${COMMENT_IMAGE_BASE}/${url}`;
}

function revokePreviewObjectUrls(container) {
    if (!container) return;
    container.querySelectorAll('img').forEach((img) => {
        if (typeof img.src === 'string' && img.src.startsWith('blob:')) {
            URL.revokeObjectURL(img.src);
        }
    });
}

function createUploadProgressLabel(prefix, percent) {
    return `${prefix} (${percent}%)`;
}

async function uploadCommentImages(files, onProgress) {
    const imageFiles = Array.from(files || []);
    if (!imageFiles.length) return [];

    const formData = new FormData();
    imageFiles.forEach(file => formData.append('photos', file));

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/comments/upload');
        xhr.responseType = 'json';

        xhr.upload.onprogress = (event) => {
            if (!event.lengthComputable || typeof onProgress !== 'function') return;
            onProgress(Math.round((event.loaded / event.total) * 100));
        };

        xhr.onload = () => {
            const result = xhr.response || {};
            if (xhr.status >= 200 && xhr.status < 300 && result.success) {
                resolve((result.photos || []).map(photo => photo.url));
                return;
            }
            reject(new Error(result.error || `Upload failed (${xhr.status})`));
        };

        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.send(formData);
    });
}

function openCommentPanel(game){
    currentCommentGame = game;
    const modal = document.getElementById('comments-modal');
    const title = document.getElementById('comments-modal-title');
    const feedback = document.getElementById('comments-feedback');
    const countLabel = document.getElementById('comments-count');
    const input = document.getElementById('comments-input');
    const imageInput = document.getElementById('comments-images');

    if (!modal || !title || !feedback || !countLabel || !input) return;

    title.textContent = `Comments for ${game}`;
    countLabel.textContent = 'Loading comments...';
    feedback.textContent = '';
    input.value = '';
    selectedImages = [];
    if (imageInput) imageInput.value = '';
    updateImagePreview();
    updateCommentInputHint(0);
    modal.classList.remove('hidden');
    loadComments(game);
}

function closeCommentPanel(){
    const modal = document.getElementById('comments-modal');
    const imageInput = document.getElementById('comments-images');
    if (!modal) return;
    modal.classList.add('hidden');
    selectedImages = [];
    if (imageInput) imageInput.value = '';
    updateImagePreview();
}

function loadComments(game){
    const list = document.getElementById('comments-list');
    const countLabel = document.getElementById('comments-count');
    if (!list || !countLabel) return;

    list.innerHTML = '<div class="text-gray-500 italic">Loading comments...</div>';
    countLabel.textContent = 'Loading comments...';

    fetchEncryptedJson('comments.json')
    .then(data => {
        const comments = (data && data[game]) || [];
        list.innerHTML = '';
        countLabel.textContent = `${comments.length} comment${comments.length === 1 ? '' : 's'}`;

        if (comments.length === 0) {
            list.innerHTML = '<div class="text-gray-500 italic">No comments yet. Be the first!</div>';
            return;
        }

        // Group comments by parentId
        const topLevelComments = [];
        const replies = {};

        comments.forEach(c => {
            const parentId = (c.parentId && typeof c.parentId === 'string') ? c.parentId : null;
            if (parentId) {
                if (!replies[parentId]) replies[parentId] = [];
                replies[parentId].push(c);
            } else {
                topLevelComments.push(c);
            }
        });

        // Sort top-level comments by timestamp (newest first)
        topLevelComments.sort((a,b)=>b.ts - a.ts);

        topLevelComments.forEach(c => {
            const commentElement = createCommentElement(c, replies[c.id] || []);
            list.appendChild(commentElement);
        });
    })
    .catch(e=>{
        list.innerHTML = `<div class="text-red-500">Failed loading comments.</div>`;
        log('Comment load error: ' + e.message);
    });
}

function startEditComment(commentId, commentElement) {
    const textDiv = commentElement.querySelector('.text-sm');
    if (!textDiv) return;

    const currentText = textDiv.textContent;
    const input = document.createElement('textarea');
    input.value = currentText;
    input.rows = 3;
    input.className = 'w-full rounded border border-slate-300 px-2 py-1 text-sm';
    input.maxLength = COMMENT_MAX_LENGTH;

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.className = 'bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 mr-2';
    saveBtn.onclick = () => saveEditComment(commentId, input.value.trim(), commentElement, textDiv, input, actionsDiv);

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'bg-gray-500 text-white text-xs px-3 py-1 rounded hover:bg-gray-600';
    cancelBtn.onclick = () => cancelEdit(textDiv, input, actionsDiv);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'mt-2';
    actionsDiv.appendChild(saveBtn);
    actionsDiv.appendChild(cancelBtn);

    textDiv.replaceWith(input);
    input.focus();
    input.parentNode.appendChild(actionsDiv);
}

function saveEditComment(commentId, newText, commentElement, originalTextDiv, input, actionsDiv) {
    if (newText.length < COMMENT_MIN_LENGTH || newText.length > COMMENT_MAX_LENGTH) {
        alert('Comment must be 1-300 characters');
        return;
    }

    const body = {
        game: currentCommentGame,
        id: commentId,
        text: newText,
        uid
    };

    fetch('/api/comments', {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(body)
    })
    .then(r => r.json())
    .then(result => {
        if (result.success) {
            originalTextDiv.textContent = newText;
            cancelEdit(originalTextDiv, input, actionsDiv);
            invalidateResourceJsonCache('comments.json');
            fetchCommentCounts();
            loadComments(currentCommentGame);
        } else {
            alert(result.error || 'Failed to edit comment');
        }
    })
    .catch(e => {
        alert('Unable to edit comment');
        log('Edit comment error: ' + e.message);
    });
}

function cancelEdit(originalTextDiv, input, actionsDiv) {
    input.replaceWith(originalTextDiv);
    actionsDiv.remove();
}

function startReplyComment(parentId, commentElement) {
    // Find the parent comment to display who we're replying to
    let parentComment = null;
    fetchEncryptedJson('comments.json')
    .then(data => {
        const comments = (data && data[currentCommentGame]) || [];
        parentComment = comments.find(c => c.id === parentId);
        
        const replyInput = document.createElement('div');
        replyInput.className = 'mt-3 ml-6 p-3 border-l-4 border-green-500 rounded bg-white/5';
        
        let parentPreview = '';
        if (parentComment) {
            const parentAuthor = parentComment.uid === uid ? 'You' : (parentComment.author || 'Guest');
            const textPreview = parentComment.text.slice(0, 50) + (parentComment.text.length > 50 ? '...' : '');
            parentPreview = `<div class="text-xs text-white/50 mb-2 bg-white/10 p-2 rounded border-l-2 border-green-500"><strong>Replying to ${escapeHtml(parentAuthor)}:</strong> ${escapeHtml(textPreview)}</div>`;
        }
        
        replyInput.innerHTML = `
            ${parentPreview}
            <textarea rows="3" maxlength="300" class="w-full rounded border border-slate-300 px-2 py-1 text-sm mb-2 reply-textarea" placeholder="Write a reply..."></textarea>
            <div class="mb-2">
                <input type="file" accept="image/*" multiple class="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-green-100 file:text-green-700 reply-images">
                <div class="flex flex-wrap gap-2 mt-1 reply-preview"></div>
            </div>
            <div class="flex gap-2">
                <button class="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700 reply-submit">Reply</button>
                <button class="bg-gray-500 text-white text-xs px-3 py-1 rounded hover:bg-gray-600 reply-cancel">Cancel</button>
            </div>
        `;

        const textarea = replyInput.querySelector('.reply-textarea');
        const imageInput = replyInput.querySelector('.reply-images');
        const submitBtn = replyInput.querySelector('.reply-submit');
        const cancelBtn = replyInput.querySelector('.reply-cancel');
        const preview = replyInput.querySelector('.reply-preview');
        let replyImages = [];

        imageInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            const maxSize = 5 * 1024 * 1024;
            
            const validFiles = files.filter(file => {
                if (!file.type.startsWith('image/')) return false;
                if (file.size > maxSize) return false;
                return true;
            });
            
            replyImages = validFiles;
            updateReplyPreview(preview, replyImages);
        });

        submitBtn.onclick = async () => {
            const text = textarea.value.trim();
            if (text.length < COMMENT_MIN_LENGTH) {
                alert('Type a reply before submitting.');
                return;
            }
            if (text.length > COMMENT_MAX_LENGTH) {
                alert(`Replies are limited to ${COMMENT_MAX_LENGTH} characters.`);
                return;
            }

            submitReply(text, parentId, replyInput, replyImages, submitBtn);
        };

        cancelBtn.onclick = () => replyInput.remove();

        commentElement.appendChild(replyInput);
        textarea.focus();
    })
    .catch(e => {
        log('Error loading parent comment: ' + e.message);
    });
}

function updateReplyPreview(preview, images) {
    revokePreviewObjectUrls(preview);
    preview.innerHTML = '';
    images.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'relative inline-block';
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.className = 'w-12 h-12 object-cover rounded border';
        const btn = document.createElement('button');
        btn.className = 'absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 text-xs';
        btn.textContent = '×';
        btn.onclick = (e) => {
            e.preventDefault();
            images.splice(index, 1);
            updateReplyPreview(preview, images);
        };
        item.appendChild(img);
        item.appendChild(btn);
        preview.appendChild(item);
    });
}

function submitReply(text, parentId, replyInput, replyImages, submitBtn) {
    if (isSubmittingComment) return;
    isSubmittingComment = true;

    (async () => {
        try {
            let imageUrls = [];
            if (replyImages && replyImages.length > 0) {
                if (submitBtn) submitBtn.textContent = 'Uploading...';
                imageUrls = await uploadCommentImages(replyImages, (percent) => {
                    if (submitBtn) submitBtn.textContent = createUploadProgressLabel('Uploading', percent);
                });
            }

            if (submitBtn) submitBtn.textContent = 'Replying...';
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    game: currentCommentGame,
                    text,
                    uid,
                    author: `Guest-${uid.slice(0,6)}`,
                    clientId,
                    parentId,
                    images: imageUrls
                })
            });

            const result = await response.json();
            if (result.success) {
                invalidateResourceJsonCache('comments.json');
                fetchCommentCounts();
                loadComments(currentCommentGame);
                replyInput.remove();
            } else {
                alert(result.error || 'Reply failed.');
            }
        } catch (error) {
            alert('Unable to post reply: ' + error.message);
            log('Reply submit error: ' + error.message);
        } finally {
            isSubmittingComment = false;
            if (submitBtn) submitBtn.textContent = 'Reply';
        }
    })();
}

function createCommentElement(comment, replies = []) {
    const isOwnComment = comment.uid === uid;
    const isReply = comment.parentId && typeof comment.parentId === 'string';
    const item = document.createElement('div');
    item.className = 'p-3 border border-white/10 rounded-lg bg-white/5 mb-3';

    const header = document.createElement('div');
    header.className = 'flex items-start justify-between gap-2 text-xs text-white/40 mb-2';

    const authorTime = document.createElement('div');
    authorTime.className = 'space-x-2 flex items-center';
    const voteCount = comment.votes ? Object.values(comment.votes).filter(v => v === 'up').length : 0;
    authorTime.innerHTML = `
        <span class="font-semibold text-white/80">${escapeHtml(isOwnComment ? 'You' : (comment.author || 'Guest'))}</span>
        <span>${timeAgo(comment.ts)}</span>
        ${comment.edited ? '<span class="text-white/30">(edited)</span>' : ''}
        <span class="text-white/40">👍 ${voteCount}</span>
    `;

    const actions = document.createElement('div');
    actions.className = 'flex gap-2';

    // Upvote button
    const upvoteBtn = document.createElement('button');
    const userVote = comment.votes && comment.votes[uid];
    upvoteBtn.textContent = userVote === 'up' ? '👍' : '🤍';
    upvoteBtn.className = userVote === 'up' ? 'text-green-400 text-xs hover:underline font-bold' : 'text-white/30 text-xs hover:text-green-400';
    upvoteBtn.onclick = () => voteComment(currentCommentGame, comment.id, uid);
    actions.appendChild(upvoteBtn);

    if (isOwnComment) {
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'text-blue-500 text-xs hover:underline';
        editBtn.onclick = () => startEditComment(comment.id, item);
        actions.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'text-red-500 text-xs hover:underline';
        deleteBtn.onclick = () => deleteComment(comment.id);
        actions.appendChild(deleteBtn);
    }

    // Only add reply button if this is not already a reply
    if (!isReply) {
        const replyBtn = document.createElement('button');
        replyBtn.textContent = 'Reply';
        replyBtn.className = 'text-green-500 text-xs hover:underline';
        replyBtn.onclick = () => startReplyComment(comment.id, item);
        actions.appendChild(replyBtn);
    }

    header.appendChild(authorTime);
    header.appendChild(actions);

    const textDiv = document.createElement('div');
    textDiv.className = 'text-sm text-white/80 mb-2';
    textDiv.textContent = comment.text;

    // Add images if any
    if (comment.images && comment.images.length > 0) {
        const imagesDiv = document.createElement('div');
        imagesDiv.className = 'flex flex-wrap gap-2 mb-2';
        comment.images.forEach(imageUrl => {
            const img = document.createElement('img');
            const resolvedUrl = normalizeCommentImageUrl(imageUrl);
            img.src = resolvedUrl;
            img.loading = 'lazy';
            img.decoding = 'async';
            img.referrerPolicy = 'no-referrer';
            img.className = 'max-w-32 max-h-32 object-cover rounded border cursor-pointer';
            img.alt = 'Comment image';
            img.onerror = () => {
                img.replaceWith(Object.assign(document.createElement('div'), {
                    className: 'max-w-32 max-h-32 rounded border border-white/10 bg-white/5 text-white/40 text-[11px] flex items-center justify-center px-2 py-1',
                    textContent: 'Image unavailable'
                }));
            };
            img.onclick = () => window.open(resolvedUrl, '_blank', 'noopener,noreferrer');
            imagesDiv.appendChild(img);
        });
        textDiv.appendChild(imagesDiv);
    }

    item.appendChild(header);
    item.appendChild(textDiv);

    // Add replies
    if (replies.length > 0) {
        replies.sort((a,b)=>a.ts - b.ts); // Oldest first for replies
        const repliesContainer = document.createElement('div');
        repliesContainer.className = 'ml-6 mt-3 space-y-2 border-l-2 border-slate-200 pl-4';

        replies.forEach(reply => {
            const replyElement = createCommentElement(reply, []); // Replies don't have nested replies for now
            replyElement.className = 'p-2 border border-white/10 rounded bg-white/5';
            repliesContainer.appendChild(replyElement);
        });

        item.appendChild(repliesContainer);
    }

    return item;
}

function submitComment(parentId = null, retryCount = 0, pendingImageUrls = null){
    const textInput = document.getElementById('comments-input');
    const feedback = document.getElementById('comments-feedback');
    const submitButton = document.getElementById('comments-submit');
    if (!currentCommentGame || !textInput || !feedback || !submitButton) return;

    const text = textInput.value.trim();
    if (text.length < COMMENT_MIN_LENGTH) {
        feedback.textContent = 'Type a comment before submitting.';
        feedback.className = 'text-xs text-red-500';
        return;
    }
    if (text.length > COMMENT_MAX_LENGTH) {
        feedback.textContent = `Comments are limited to ${COMMENT_MAX_LENGTH} characters.`;
        feedback.className = 'text-xs text-red-500';
        return;
    }

    if (isSubmittingComment) return;
    isSubmittingComment = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Posting...';
    feedback.textContent = '';
    let imageUrls = Array.isArray(pendingImageUrls) ? pendingImageUrls.slice() : [];

    (async () => {
        try {
            if (imageUrls.length === 0 && selectedImages.length > 0) {
                submitButton.textContent = 'Uploading...';
                feedback.textContent = 'Uploading images...';
                feedback.className = 'text-xs text-white/40';
                imageUrls = await uploadCommentImages(selectedImages, (percent) => {
                    feedback.textContent = createUploadProgressLabel('Uploading images', percent);
                });
            }

            submitButton.textContent = 'Posting...';
            feedback.textContent = 'Posting comment...';
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    game: currentCommentGame,
                    text,
                    uid,
                    author: `Guest-${uid.slice(0,6)}`,
                    clientId,
                    parentId: parentId || null,
                    images: imageUrls
                })
            });

            const result = await response.json();
            if (result.success) {
                invalidateResourceJsonCache('comments.json');
                fetchCommentCounts();
                loadComments(currentCommentGame);
                textInput.value = '';
                selectedImages = [];
                updateImagePreview();
                updateCommentInputHint(0);
                feedback.textContent = 'Comment posted successfully.';
                feedback.className = 'text-xs text-green-600';
            } else {
                throw new Error(result.error || 'Comment failed.');
            }
        } catch (error) {
            if (/upload/i.test(error.message)) {
                feedback.textContent = 'Image upload failed. Your comment was not posted.';
                feedback.className = 'text-xs text-red-500';
                log('Comment upload error: ' + error.message);
                return;
            }
            if (retryCount < 1) {
                feedback.textContent = 'Posting failed, retrying...';
                feedback.className = 'text-xs text-yellow-600';
                setTimeout(() => submitComment(parentId, retryCount + 1, imageUrls), 2000);
                return;
            }
            feedback.textContent = 'Unable to post comment: ' + error.message;
            feedback.className = 'text-xs text-red-500';
            log('Comment submit error: ' + error.message);
        } finally {
            isSubmittingComment = false;
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
        }
    })();
}

// ================= VOTE =================
function deleteComment(commentId){
    if (!currentCommentGame || !commentId) return;

    fetchEncryptedJson('comments.json')
    .then(data => {
        const comments = (data && data[currentCommentGame]) || [];
        const toDelete = [commentId];
        const findReplies = (parentId) => {
            comments.forEach(c => {
                if (c.parentId === parentId) {
                    toDelete.push(c.id);
                    findReplies(c.id);
                }
            });
        };
        findReplies(commentId);

        const deletePromises = toDelete.map(id =>
            fetch('/api/comments', {
                method: 'DELETE',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    game: currentCommentGame,
                    id,
                    uid
                })
            }).then(r => r.json())
        );
        return Promise.all(deletePromises);
    })
    .then(results => {
        if (results.every(r => r.success)) {
            invalidateResourceJsonCache('comments.json');
            fetchCommentCounts();
            loadComments(currentCommentGame);
            log('Comment and replies deleted');
        } else {
            log('Some deletes failed');
        }
    })
    .catch(e => log('Delete error: ' + e.message));
}

function voteComment(game, commentId, voter) {
    fetch('/api/comments/vote', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            game,
            commentId,
            uid: voter
        })
    })
    .then(r => r.json())
    .then(result => {
        if (result.success) {
            invalidateResourceJsonCache('comments.json');
            loadComments(game);
        } else {
            log(result.error || 'Unable to vote');
        }
    })
    .catch(e => log('Vote error: ' + e.message));
}

function sendVote(game, vote){

    if (game === 'five-nights-at-epsteins' && vote === 'down') {
        alert('bad boy not happening');
        return;
    }

    const current = voteData[game]?.userVote;
    if(current === vote) return;

    if(current === 'up') voteData[game].up--;
    if(current === 'down') voteData[game].down--;

    if(vote === 'up') voteData[game].up++;
    if(vote === 'down') voteData[game].down++;

    voteData[game].userVote = vote === 'none' ? null : vote;

    renderGames();

    fetch('/api/vote',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
            game,
            uid,
            vote,
        })
    }).then(() => {
        invalidatePlainJsonCache('/votes.json');
    }).catch(e=>log(e.message));
}

// ================= INIT =================
fetchPlainJson('./list.json')
.then(async data => {
    allGames = [
        ...(data.good||[]).map(n=>({name:n,category:'good'})),
        ...(data.nova||[]).map(n=>({name:n,category:'nova'}))
    ];

    const listFingerprint = allGames.map(g => g.name).sort().join(',');
    if (localStorage.getItem(THUMBS_READY_KEY) !== listFingerprint) {
        loStage = document.getElementById('lo-stage');
        const pctEl = document.getElementById('lo-pct');
        const text  = document.getElementById('loading-text');
        const bar   = document.getElementById('lo-bar');
        await preloadAllThumbnails(allGames, (done, total, thumbUrl) => {
            const pct = Math.round(done / total * 100);
            if (pctEl) pctEl.textContent = pct + '%';
            if (text)  text.textContent  = done + ' / ' + total;
            if (bar)   bar.style.width   = pct + '%';
            loAddThumb(thumbUrl);
        });
        try { localStorage.setItem(THUMBS_READY_KEY, listFingerprint); } catch(e) {}
        dismissLoadingOverlay();
    } else {
        dismissLoadingOverlay();
    }

    renderFavorites();
    fetchVotes();
    fetchEncryptedJsonBatch(['comments.json', 'plays.json'])
    .then(() => {
        fetchCommentCounts();
        fetchPlayCounts();
    });
});

if(searchInput){
    searchInput.addEventListener('input', renderGames);
}

// Random Well — horizontal slot machine
const RW_SLOT_W = 88;   // px per slot (icon 68 + 10 padding + 10 gap)
const RW_VISIBLE = 5;   // slots shown in window
let rwRafId = null;
let rwCurrentWinner = null;

function spinRandomWell() {
    if (!allGames.length) return;
    const drum      = document.getElementById('rw-drum');
    const selector  = document.getElementById('rw-selector');
    const result    = document.getElementById('rw-result');
    const winImg    = document.getElementById('rw-winner-img');
    const winLabel  = document.getElementById('rw-winner-label');
    const winStats  = document.getElementById('rw-winner-stats');
    const playBtn   = document.getElementById('rw-play');

    // Reset UI
    result.style.display = 'none';
    result.style.opacity = '0';
    result.style.transform = 'translateY(6px)';
    playBtn.style.opacity = '0';
    playBtn.style.pointerEvents = 'none';
    selector.classList.remove('rw-winner');
    if (rwRafId) cancelAnimationFrame(rwRafId);

    // Pick winner
    const winnerIdx = Math.floor(Math.random() * allGames.length);
    rwCurrentWinner = allGames[winnerIdx];

    // Build item list: 3 shuffled copies → winner → 1 more copy
    const shuffle = () => [...allGames].sort(() => Math.random() - 0.5);
    const items = [...shuffle(), ...shuffle(), ...shuffle()];
    const targetPos = items.length;
    items.push(rwCurrentWinner);
    items.push(...shuffle());

    // Build drum HTML using proper thumbKey()
    drum.innerHTML = items.map(g => {
        const thumb = loadThumb(g.name);
        const inner = thumb
            ? `<img src="${thumb}" alt="${g.name}">`
            : `<div class="rw-item-fallback">🎮</div>`;
        return `<div class="rw-item">${inner}</div>`;
    }).join('');

    // Horizontal math:
    // Drum width origin = the drum's left edge (translateX 0 = all items start at left of wrapper)
    // Window center = 50% of wrapper width. Wrapper is 100%, slot is RW_SLOT_W.
    // We want slot targetPos to be centered.
    // slot center pos relative to drum start = targetPos * RW_SLOT_W + RW_SLOT_W/2 + 8 (left padding)
    // translateX to center it = windowCenter - slotCenter = (wrapWidth/2) - (targetPos*RW_SLOT_W + RW_SLOT_W/2 + 8)
    // We don't know wrapWidth at build time — use a proportion approach:
    const wrapWidth = drum.parentElement.offsetWidth || 460;
    const windowCenter = wrapWidth / 2;
    const slotCenter = (pos) => pos * RW_SLOT_W + RW_SLOT_W / 2 + 8;
    const finalX = windowCenter - slotCenter(targetPos);
    const startX = windowCenter - slotCenter(8); // start showing slot 8

    drum.style.transition = 'none';
    drum.style.transform = `translateX(${startX}px)`;

    const startTime = performance.now();
    const duration = 2800;

    function easeOutQuint(t) { return 1 - Math.pow(1 - t, 5); }

    function animate(now) {
        const t = Math.min((now - startTime) / duration, 1);
        const x = startX + (finalX - startX) * easeOutQuint(t);
        drum.style.transform = `translateX(${x}px)`;

        if (t < 1) {
            rwRafId = requestAnimationFrame(animate);
        } else {
            drum.style.transform = `translateX(${finalX}px)`;
            // Winner reveal
            selector.classList.add('rw-winner');
            const thumb = loadThumb(rwCurrentWinner.name);
            if (thumb) {
                winImg.src = thumb;
                winImg.style.display = 'block';
            } else {
                winImg.style.display = 'none';
            }
            winLabel.textContent = rwCurrentWinner.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

            // Votes & playtime stats
            const v = (voteData && voteData[rwCurrentWinner.name]) || { up: 0, down: 0 };
            const secs = userPlayTime[rwCurrentWinner.name] || 0;
            const statParts = [];
            statParts.push(`<span class="rw-stat" style="color:rgba(34,197,94,0.9);border-color:rgba(34,197,94,0.2);background:rgba(34,197,94,0.07)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:11px;height:11px"><path d="M12 19V5M5 12l7-7 7 7"/></svg>${v.up}</span>`);
            statParts.push(`<span class="rw-stat" style="color:rgba(239,68,68,0.9);border-color:rgba(239,68,68,0.2);background:rgba(239,68,68,0.07)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:11px;height:11px"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>${v.down}</span>`);
            if (secs > 0) statParts.push(`<span class="rw-stat" style="color:rgba(251,146,60,0.85);border-color:rgba(251,146,60,0.2);background:rgba(251,146,60,0.07)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>${formatPlaytime(secs)}</span>`);
            winStats.innerHTML = statParts.join('');

            result.style.display = 'flex';
            requestAnimationFrame(() => {
                result.style.opacity = '1';
                result.style.transform = 'translateY(0)';
            });
            playBtn.style.opacity = '1';
            playBtn.style.pointerEvents = 'auto';
        }
    }

    // Double rAF so the reset transform is painted before animating
    requestAnimationFrame(() => requestAnimationFrame(() => {
        rwRafId = requestAnimationFrame(animate);
    }));
}

const navRandom  = document.getElementById('nav-random');
const rwModal    = document.getElementById('random-well');
const rwCloseBtn = document.getElementById('rw-close-btn');
const rwSpinBtn  = document.getElementById('rw-spin-again');
const rwPlayBtn  = document.getElementById('rw-play');

if (navRandom && rwModal) {
    navRandom.addEventListener('click', () => {
        rwModal.style.display = 'flex';
        spinRandomWell();
    });
    rwCloseBtn.addEventListener('click', () => {
        if (rwRafId) cancelAnimationFrame(rwRafId);
        rwModal.style.display = 'none';
    });
    rwModal.addEventListener('click', e => {
        if (e.target === rwModal) {
            if (rwRafId) cancelAnimationFrame(rwRafId);
            rwModal.style.display = 'none';
        }
    });
    rwSpinBtn.addEventListener('click', spinRandomWell);
    rwPlayBtn.addEventListener('click', () => {
        if (!rwCurrentWinner) return;
        rwModal.style.display = 'none';
        incrementPlayAndNavigate(rwCurrentWinner, `/${rwCurrentWinner.category}/${rwCurrentWinner.name}/index.html`);
    });
}

const commentsModal = document.getElementById('comments-modal');
const commentsClose = document.getElementById('comments-close');
const commentsSubmit = document.getElementById('comments-submit');
const commentsInput = document.getElementById('comments-input');
const commentsHint = document.getElementById('comments-hint');
const playsModal = document.getElementById('plays-modal');
const playsClose = document.getElementById('plays-close');

if (commentsClose) commentsClose.addEventListener('click', closeCommentPanel);
if (commentsSubmit) commentsSubmit.addEventListener('click', () => submitComment());
if (commentsModal) {
    commentsModal.addEventListener('click', (event) => {
        if (event.target === commentsModal) closeCommentPanel();
    });
}
if (playsClose) playsClose.addEventListener('click', closePlayModal);
if (playsModal) {
    playsModal.addEventListener('click', (event) => {
        if (event.target === playsModal) closePlayModal();
    });
}

if (commentsInput) {
    commentsInput.addEventListener('input', () => {
        updateCommentInputHint(commentsInput.value.length);
    });
}

const commentsImages = document.getElementById('comments-images');
if (commentsImages) {
    commentsImages.addEventListener('change', handleImageSelection);
}

function updateCommentInputHint(length) {
    if (!commentsHint) return;
    const remaining = COMMENT_MAX_LENGTH - length;
    commentsHint.textContent = `${remaining} characters remaining`;
    commentsHint.className = remaining < 0 ? 'text-xs text-red-400' : 'text-xs text-white/30';
}

function handleImageSelection(event) {
    const files = Array.from(event.target.files || []);
    const accepted = [];
    const rejected = [];
    const remainingSlots = MAX_COMMENT_IMAGES - selectedImages.length;

    if (remainingSlots <= 0) {
        alert(`You can only upload up to ${MAX_COMMENT_IMAGES} images per comment.`);
        event.target.value = '';
        return;
    }

    for (const file of files) {
        if (accepted.length >= remainingSlots) break;
        if (!file.type.startsWith('image/')) {
            rejected.push(`${file.name} is not an image file.`);
            continue;
        }
        if (file.size > MAX_COMMENT_IMAGE_SIZE) {
            rejected.push(`${file.name} is too large. Maximum size is 5MB.`);
            continue;
        }
        accepted.push(file);
    }

    selectedImages.push(...accepted);
    updateImagePreview();
    event.target.value = '';

    if (rejected.length > 0) {
        alert(rejected.join('\n'));
    }
}

function removeImage(index) {
    selectedImages.splice(index, 1);
    updateImagePreview();
}

function updateImagePreview() {
    const preview = document.getElementById('comments-image-preview');
    if (!preview) return;

    revokePreviewObjectUrls(preview);
    preview.innerHTML = '';
    selectedImages.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'relative inline-block';
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.className = 'w-16 h-16 object-cover rounded border';
        img.alt = 'Preview';

        const removeBtn = document.createElement('button');
        removeBtn.className = 'absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600';
        removeBtn.textContent = '×';
        removeBtn.onclick = () => removeImage(index);

        item.appendChild(img);
        item.appendChild(removeBtn);
        preview.appendChild(item);
    });
}

updateCommentInputHint(0);

// Fetch and display data sent
function fetchDataCount() {
    fetch('/api/data')
        .then(r => r.json())
        .then(data => {
            const gbElement = document.getElementById('data-count');
            const reqElement = document.getElementById('requests-count');
            if (gbElement) {
                gbElement.textContent = data.totalGB + ' GB Worth of network data';
            }
            if (reqElement) {
                reqElement.textContent = 'Files Loaded: ' + data.totalRequests.toLocaleString();
            }
        })
        .catch(e => {
            const gbElement = document.getElementById('data-count');
            const reqElement = document.getElementById('requests-count');
            if (gbElement) {
                gbElement.textContent = 'Error';
            }
            if (reqElement) {
                reqElement.textContent = 'Resources Loaded: Error';
            }
            log('Data count error: ' + e.message);
        });
}

// Fetch data count on load
fetchDataCount();

});
