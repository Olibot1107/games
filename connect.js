'use strict';

const fs     = require('fs');
const os     = require('os');
const path   = require('path');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');
const { WebSocket } = require('ws');

const IS_WINDOWS = process.platform === 'win32';
const IS_LINUX   = process.platform === 'linux';

/* ── wrtc ── */
let wrtcModule;
function getWrtc() {
  if (!wrtcModule) {
    try { wrtcModule = require('@roamhq/wrtc'); }
    catch { wrtcModule = require('wrtc'); }
  }
  return wrtcModule;
}

/* ── Firebase config ── */
const FIREBASE_CONFIG = {
  apiKey:      'AIzaSyA4BYjOa__uKZjOBvS5p_uMxmJ6AMsKcpg',
  databaseURL: 'https://chat1-6cc2e-default-rtdb.firebaseio.com',
  projectId:   'chat1-6cc2e',
};

/* ── Port pool ── */
const _usedPorts = new Set();
function allocateDevtoolsPort() {
  for (let i = 0; i < 500; i++) {
    const p = 9222 + Math.floor(Math.random() * 2000);
    if (!_usedPorts.has(p)) { _usedPorts.add(p); return p; }
  }
  throw new Error('No free devtools port');
}
function releaseDevtoolsPort(p) { _usedPorts.delete(p); }

/* ── Utilities ── */
function randomId() {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : crypto.randomBytes(16).toString('hex');
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function readEnvInt(name, fallback) {
  const v = process.env[name];
  if (v == null || !v.trim()) return fallback;
  const n = parseInt(v, 10);
  return isFinite(n) ? n : fallback;
}
function readDurationMs(value, fallback, { min = 0, max = 6 * 60 * 60 * 1000 } = {}) {
  const n = Number(value);
  if (!isFinite(n) || n < 0) return fallback;
  return Math.max(min, Math.min(max, Math.round(n)));
}
function commandExists(cmd) {
  if (!cmd) return false;
  if (path.isAbsolute(cmd) || cmd.includes(path.sep)) return fs.existsSync(cmd);
  const r = runSync(IS_WINDOWS ? 'where' : 'which', [cmd], { stdio: 'ignore' });
  return r.status === 0;
}
function runSync(cmd, args = [], opts = {}) {
  try { return spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 2 * 1024 * 1024, ...opts }); }
  catch (e) { return { status: null, stdout: '', stderr: String(e?.message || e) }; }
}
function killTree(proc, sig = 'SIGTERM') {
  if (!proc || proc.killed) return;
  try {
    if (IS_WINDOWS && proc.pid) { runSync('taskkill', ['/pid', String(proc.pid), '/t', '/f'], { stdio: 'ignore' }); return; }
    if (proc.pid) { try { process.kill(-proc.pid, sig); return; } catch {} }
    proc.kill(sig);
  } catch {}
}
function findExe(candidates) {
  for (const c of candidates) {
    if (!c) continue;
    if (path.isAbsolute(c) || c.includes(path.sep)) { if (fs.existsSync(c)) return c; continue; }
    if (commandExists(c)) return c;
  }
  return null;
}
function parseWmctrlPidLine(line) {
  const m = line.match(/^(0x[0-9a-fA-F]+)\s+(-?\d+)\s+(\d+)\s+(\S+)\s+(.*)$/);
  return m ? { id: m[1], desktop: +m[2], pid: +m[3], klass: m[4], title: m[5] || '' } : null;
}
function parseWmctrlLine(line) {
  const m = line.match(/^(0x[0-9a-fA-F]+)\s+(-?\d+)\s+(\S+)\s+(.*)$/);
  return m ? { id: m[1], desktop: +m[2], klass: m[3], title: m[4] || '' } : null;
}
function parseXwininfoGeometry(out) {
  return {
    width:  out.match(/Width:\s+(\d+)/i)?.[1]  ? +out.match(/Width:\s+(\d+)/i)[1]  : null,
    height: out.match(/Height:\s+(\d+)/i)?.[1] ? +out.match(/Height:\s+(\d+)/i)[1] : null,
    x: out.match(/Absolute upper-left X:\s+(-?\d+)/i)?.[1] ? +out.match(/Absolute upper-left X:\s+(-?\d+)/i)[1] : 0,
    y: out.match(/Absolute upper-left Y:\s+(-?\d+)/i)?.[1] ? +out.match(/Absolute upper-left Y:\s+(-?\d+)/i)[1] : 0,
  };
}
function getPrimaryScreenBounds() {
  if (!IS_WINDOWS) return { width: 1280, height: 720 };
  const ps = runSync('powershell.exe', ['-NoProfile', '-Command',
    "[void][System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms');" +
    "$b=[System.Windows.Forms.Screen]::PrimaryScreen.Bounds;Write-Output(\"$($b.Width) $($b.Height)\")"]);
  if (ps.status === 0 && ps.stdout) {
    const [w, h] = ps.stdout.trim().split(/\s+/).map(Number);
    if (w > 0 && h > 0) return { width: w, height: h };
  }
  return { width: 1280, height: 720 };
}
async function waitForWindowsWindowHandle(pid, ms = 15000) {
  const dead = Date.now() + ms;
  while (Date.now() < dead) {
    const ps = runSync('powershell.exe', ['-NoProfile', '-Command',
      `$p=Get-Process -Id ${+pid} -EA 0;if($p){$p.MainWindowHandle}`]);
    if (ps.status === 0 && ps.stdout) { const n = +ps.stdout.trim(); if (isFinite(n) && n > 0) return n; }
    await sleep(250);
  }
  return 0;
}
async function waitForWindowsWindowTitle(pid, ms = 10000) {
  const dead = Date.now() + ms;
  while (Date.now() < dead) {
    const ps = runSync('powershell.exe', ['-NoProfile', '-Command',
      `$p=Get-Process -Id ${+pid} -EA 0;if($p){$p.MainWindowTitle}`]);
    if (ps.status === 0 && ps.stdout?.trim()) return ps.stdout.trim();
    await sleep(250);
  }
  return '';
}

/* ── Browser / ffmpeg detection ── */
function getBrowserLauncher() {
  if (!process.env.REMOTE_BROWSER_ALLOW_FLATPAK) {
    const cmd = (process.env.REMOTE_BROWSER_CMD || '').trim();
    if (/^flatpak\s+run\s+/i.test(cmd) || process.env.REMOTE_BROWSER_APP_ID)
      throw new Error('Flatpak Chrome not supported. Set REMOTE_BROWSER_BIN or CHROME_BIN.');
  }
  if (process.env.REMOTE_BROWSER_APP_ID?.trim())
    return { command: 'flatpak', args: ['run', process.env.REMOTE_BROWSER_APP_ID.trim()], shell: false };
  if (process.env.REMOTE_BROWSER_CMD?.trim()) {
    const parts = process.env.REMOTE_BROWSER_CMD.trim().split(/\s+/);
    return { command: parts[0], args: parts.slice(1), shell: false };
  }
  const env = [process.env.REMOTE_BROWSER_BIN, process.env.CHROME_BIN, process.env.BROWSER_BIN].filter(Boolean);
  const common = IS_WINDOWS ? [
    'chrome.exe', 'chromium.exe', 'msedge.exe', 'brave.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ] : [
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium',
    '/usr/bin/chromium-browser', '/usr/bin/chrome', '/opt/google/chrome/chrome',
    '/opt/google/chrome/google-chrome', '/usr/local/bin/google-chrome',
    '/usr/local/bin/chromium', '/usr/lib/chromium/chromium',
    '/usr/lib/chromium-browser/chromium-browser', '/snap/bin/chromium',
  ];
  const resolved = findExe([...env, ...common]);
  if (resolved) return { command: resolved, args: [], shell: false };
  throw new Error('No Chrome/Chromium found. Set REMOTE_BROWSER_BIN or CHROME_BIN.');
}
function getFfmpegBinary() {
  const env = [process.env.REMOTE_BROWSER_FFMPEG_BIN, process.env.FFMPEG_BIN].filter(Boolean);
  const common = IS_WINDOWS
    ? ['ffmpeg.exe', 'C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe']
    : ['/usr/bin/ffmpeg', '/usr/local/bin/ffmpeg', '/opt/homebrew/bin/ffmpeg', '/snap/bin/ffmpeg'];
  const r = findExe([...env, ...common]);
  if (r) return r;
  throw new Error('No ffmpeg found. Install ffmpeg or set REMOTE_BROWSER_FFMPEG_BIN.');
}
function getLinuxAudioSourceName(preferred) {
  const requested = String(preferred || '').trim();
  if (requested && !/^(auto|default)$/i.test(requested)) return requested;
  if (commandExists('pactl')) {
    try { runSync('pactl', ['load-module', 'module-loopback'], { stdio: 'ignore' }); } catch {}
    const defaultSink = runSync('pactl', ['get-default-sink']);
    const sinkName = defaultSink.status === 0 ? defaultSink.stdout.trim() : '';
    const sources = runSync('pactl', ['list', 'short', 'sources']);
    const sourceNames = sources.status === 0
      ? sources.stdout.split('\n').map(l => l.trim().split(/\s+/)[1]).filter(Boolean) : [];
    const monitorOfDefault = sinkName ? `${sinkName}.monitor` : '';
    if (monitorOfDefault && sourceNames.includes(monitorOfDefault)) return monitorOfDefault;
    const anyMonitor = sourceNames.find(n => /\.monitor$/i.test(n));
    if (anyMonitor) return anyMonitor;
  }
  return requested || 'default';
}

/* ── CDP client ── */
class CdpClient {
  constructor(ws) {
    this.ws = ws; this.nextId = 1; this.pending = new Map(); this.closed = false; this.onEvent = null;
    ws.on('message', raw => {
      let p; try { p = JSON.parse(Buffer.isBuffer(raw) ? raw.toString('utf8') : raw); } catch { return; }
      if (!p) return;
      if (p.id) {
        const e = this.pending.get(p.id); if (!e) return;
        this.pending.delete(p.id);
        p.error ? e.reject(new Error(p.error.message || 'CDP error')) : e.resolve(p.result);
        return;
      }
      if (typeof this.onEvent === 'function') this.onEvent(p);
    });
    ws.on('close', () => {
      this.closed = true;
      for (const { reject } of this.pending.values()) reject(new Error('CDP closed'));
      this.pending.clear();
    });
  }
  send(method, params = {}) {
    if (this.closed) return Promise.reject(new Error('CDP closed'));
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      try { this.ws.send(JSON.stringify({ id, method, params })); }
      catch (e) { this.pending.delete(id); reject(e); }
    });
  }
  close() { try { this.ws.close(); } catch {} }
}

/* ── Firebase REST client ── */
class FirebaseRestClient {
  constructor() {
    this.apiKey      = process.env.REMOTE_BROWSER_FIREBASE_API_KEY || FIREBASE_CONFIG.apiKey;
    this.databaseURL = (process.env.REMOTE_BROWSER_FIREBASE_DATABASE_URL || FIREBASE_CONFIG.databaseURL).replace(/\/+$/, '');
    this.idToken = null; this.localId = null;
  }
  async signInAnonymously() {
    const r = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${encodeURIComponent(this.apiKey)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d?.error?.message || 'Firebase anon sign-in failed');
    this.idToken = d.idToken; this.localId = d.localId;
  }
  url(p) { return `${this.databaseURL}/${String(p).replace(/^\/+/, '')}.json?auth=${encodeURIComponent(this.idToken)}`; }
  async req(method, p, body) {
    const r = await fetch(this.url(p), {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d?.error || `Firebase ${method} ${r.status}`);
    return d;
  }
  get(p)     { return this.req('GET', p); }
  put(p, b)  { return this.req('PUT', p, b); }
  patch(p, b){ return this.req('PATCH', p, b); }
  post(p, b) { return this.req('POST', p, b); }
  delete(p)  { return this.req('DELETE', p); }
}

/* ── Window helpers ── */
function findBrowserWindowByPid(pid, targetUrl = '') {
  if (!pid) return null;
  const cands = [/chrome/i, /chromium/i, /google chrome/i, /msedge/i, /brave/i];
  const wm = runSync('wmctrl', ['-lp']);
  if (wm.status === 0 && wm.stdout) {
    for (const line of wm.stdout.split('\n')) {
      const e = parseWmctrlPidLine(line.trim());
      if (!e || e.pid !== pid) continue;
      const t = `${e.klass} ${e.title}`;
      if (cands.some(r => r.test(t))) return e.id;
      if (targetUrl) try { const h = new URL(targetUrl).hostname.replace(/^www\./i, ''); if (h && t.toLowerCase().includes(h)) return e.id; } catch {}
    }
  }
  const wm2 = runSync('wmctrl', ['-lx']);
  if (wm2.status === 0 && wm2.stdout) {
    for (const line of wm2.stdout.split('\n')) {
      const e = parseWmctrlLine(line.trim());
      if (e && cands.some(r => r.test(`${e.klass} ${e.title}`))) return e.id;
    }
  }
  return null;
}
async function waitForBrowserWindow(pid, targetUrl, ms = 15000) {
  const dead = Date.now() + ms;
  while (Date.now() < dead) {
    const id = findBrowserWindowByPid(pid, targetUrl);
    if (id) return id;
    await sleep(250);
  }
  return null;
}

/* ── Key event helper ── */
const KEY_VK = {
  Backspace: 0x08, Tab: 0x09, Enter: 0x0D, Shift: 0x10, Control: 0x11, Alt: 0x12,
  Escape: 0x1B, ' ': 0x20, PageUp: 0x21, PageDown: 0x22, End: 0x23, Home: 0x24,
  ArrowLeft: 0x25, ArrowUp: 0x26, ArrowRight: 0x27, ArrowDown: 0x28,
  Insert: 0x2D, Delete: 0x2E,
  F1: 0x70, F2: 0x71, F3: 0x72, F4: 0x73, F5: 0x74, F6: 0x75, F7: 0x76, F8: 0x77,
  F9: 0x78, F10: 0x79, F11: 0x7A, F12: 0x7B,
};
function dispatchKeyEventParams(msg, type) {
  const text = typeof msg.text === 'string' ? msg.text : '';
  const key  = typeof msg.key  === 'string' ? msg.key  : '';
  const code = typeof msg.code === 'string' ? msg.code : '';
  const vk = isFinite(msg.windowsVirtualKeyCode) ? msg.windowsVirtualKeyCode
    : (KEY_VK[key] || (text.length === 1 ? text.toUpperCase().charCodeAt(0) : 0));
  let mod = 0;
  if (msg.altKey)   mod |= 1;
  if (msg.ctrlKey)  mod |= 2;
  if (msg.metaKey)  mod |= 4;
  if (msg.shiftKey) mod |= 8;
  return {
    type, key, code, text, unmodifiedText: text,
    windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk,
    modifiers: mod, autoRepeat: Boolean(msg.repeat), isKeypad: Boolean(msg.isKeypad),
  };
}

/* ── JSON helper ── */
function parseJson(v) {
  if (Buffer.isBuffer(v)) v = v.toString('utf8');
  if (typeof v === 'string') { try { return JSON.parse(v); } catch { return null; } }
  return v && typeof v === 'object' ? v : null;
}
async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`fetch ${url} → ${r.status}`);
  return r.json();
}

/* ══════════════════════════════════════════════════════════════════════════
   RemoteBrowserSession
══════════════════════════════════════════════════════════════════════════ */
class RemoteBrowserSession {
  constructor({ db, sessionId, request }) {
    this.db      = db;
    this.id      = sessionId;
    this.request = request || {};

    this.url = (typeof request?.url === 'string' && request.url.trim())
      ? request.url.trim() : 'https://www.tiktok.com/';

    this.startedAt = Date.now();
    this.updatedAt = Date.now();
    this.state     = 'starting';

    this.clientUid = typeof request?.requestedBy === 'string' && request.requestedBy.trim()
      ? request.requestedBy.trim()
      : (db.localId || sessionId);

    this.userDataDir   = path.join(os.homedir(), '.remote-browser-profiles', this.clientUid);
    this.sessionTmpDir = path.join(os.tmpdir(), 'remote-browser-sessions', sessionId);

    this.browserProcess  = null;
    this.devtools        = null;
    this.devtoolsClient  = null;
    this.targetInfo      = null;
    this.devtoolsPort    = null;

    this.pc             = null;
    this.controlChannel = null;
    this.videoSource    = null;
    this.audioSource    = null;
    this.videoTrack     = null;
    this.audioTrack     = null;
    this.offer          = null;
    this.RTCSessionDescription = null;
    this.RTCIceCandidate       = null;
    this.remoteDescriptionSet  = false;
    this.seenClientCandidateKeys = new Set();

    this.captureWidth  = readEnvInt('REMOTE_BROWSER_WIDTH',  1920);
    this.captureHeight = readEnvInt('REMOTE_BROWSER_HEIGHT', 1080);
    this.captureFps    = readEnvInt('REMOTE_BROWSER_FPS', 15);
    this.viewportWidth  = this.captureWidth;
    this.viewportHeight = this.captureHeight;
    this._updateFrameSize();

    this.audioSamplesPerFrame = 480;
    this.audioFrameBytes      = this.audioSamplesPerFrame * 2 * 2;

    this.videoProcess = null;
    this.audioProcess = null;
    this.videoBuffer  = Buffer.alloc(0);
    this.audioBuffer  = Buffer.alloc(0);
    this.audioFallbackTimer = null;
    this.silentAudioTimer   = null;
    this.audioFramesPushed  = 0;
    this.audioBytesCaptured = 0;

    this.captureRect     = null;
    this.contentRect     = { x: 0, y: 0, width: this.viewportWidth, height: this.viewportHeight };
    this.captureWindowId = null;
    this.browserWindowId = null;
    this.windowHandle    = 0;
    this.windowTitle     = '';

    this.display         = process.env.DISPLAY || ':0.0';
    this.audioSourceName = process.env.REMOTE_BROWSER_AUDIO_SOURCE || 'auto';

    this.idleTimeoutMs   = readDurationMs(request?.idleTimeoutMs, readEnvInt('REMOTE_BROWSER_IDLE_MS', 5 * 60 * 1000), { max: 60 * 60 * 1000 });
    this.maxSessionMs    = readDurationMs(request?.maxSessionMs,  readEnvInt('REMOTE_BROWSER_MAX_SESSION_MS', 30 * 60 * 1000));
    this.signalPollMs    = readEnvInt('REMOTE_BROWSER_SIGNAL_POLL_MS', 750);
    this.connectedPollMs = readEnvInt('REMOTE_BROWSER_CONNECTED_POLL_MS', 3000);

    this.lastInputAt    = Date.now();
    this.lastHostLogTs  = 0;
    this.sessionPath    = `remoteBrowser/sessions/${this.id}`;
    this.cleaningUp     = false;
    this.monitoring     = false;
    this.autoStopTimer  = null;
    this.signalingCleaned = false;

    // Timers / state for reduced Firebase writes
    this._urlWriteTimer  = null;
    this._rtcConnected   = false;
  }

  _updateFrameSize() {
    this.videoFrameSize = (this.captureWidth * this.captureHeight * 3) >> 1;
  }

  /* ── Send to client over data channel (zero Firebase) ── */
  sendToClient(payload) {
    if (this.controlChannel && this.controlChannel.readyState === 'open') {
      try { this.controlChannel.send(JSON.stringify(payload)); } catch {}
    }
  }

  /* ── Logging — skip Firebase writes once WebRTC is connected ── */
  log(msg) {
    console.log(`[remote-browser ${this.id.slice(0, 8)} uid:${this.clientUid.slice(0, 8)}] ${msg}`);
    const isError = /(error|fail|stopp)/i.test(String(msg));
    // Once WebRTC is up, only write errors/stops to Firebase
    if (this._rtcConnected && !isError) return;
    const now = Date.now();
    if (now - this.lastHostLogTs < 1500) return;
    this.updatedAt     = now;
    this.lastHostLogTs = now;
    void this.db.patch(this.sessionPath, {
      updatedAt: this.updatedAt,
      lastLog:   { ts: this.updatedAt, message: msg },
    }).catch(() => {});
  }

  async writeSession(patch) {
    await this.db.patch(this.sessionPath, { ...patch, updatedAt: Date.now() });
  }

  async claim() {
    await this.writeSession({
      hostId:     this.db.localId,
      hostState:  'launching',
      status:     'launching',
      transport:  'firebase-signaling',
      clientUid:  this.clientUid,
      profileKey: this.clientUid,
      timeouts:   { idleMs: this.idleTimeoutMs, maxMs: this.maxSessionMs },
    });
  }

  captureInfo() {
    return {
      width:          this.captureWidth,
      height:         this.captureHeight,
      fps:            this.captureFps,
      viewportWidth:  this.viewportWidth,
      viewportHeight: this.viewportHeight,
      contentRect:    this.contentRect,
    };
  }

  /* ── Browser launch ── */
  async launchBrowser() {
    const launcher = getBrowserLauncher();
    this.log(`Browser: ${launcher.command}`);
    fs.mkdirSync(this.userDataDir, { recursive: true });
    this.log(`profile dir: ${this.userDataDir}`);

    const args = [
      `--remote-debugging-port=${this.devtoolsPort}`,
      '--remote-debugging-address=0.0.0.0',
      `--app=${this.url}`,
      `--window-size=${this.captureWidth},${this.captureHeight}`,
      '--window-position=0,0',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-networking',
      '--disable-breakpad',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--disable-sync',
      '--autoplay-policy=no-user-gesture-required',
      '--force-device-scale-factor=1',
      `--user-data-dir=${this.userDataDir}`,
    ];

    if (IS_LINUX) {
      args.push(
        '--disable-gpu', '--disable-gpu-compositing',
        '--disable-features=TranslateUI,UseSkiaRenderer,CanvasOopRasterization',
        '--use-gl=swiftshader', '--ozone-platform=x11',
      );
    } else if (IS_WINDOWS) {
      args.push(
        '--disable-gpu', '--disable-gpu-compositing', '--disable-software-rasterizer',
        '--disable-direct-composition',
        '--disable-features=TranslateUI,UseSkiaRenderer,CanvasOopRasterization,DirectComposition,CalculateNativeWinOcclusion',
        '--use-angle=swiftshader', '--force-device-scale-factor=1',
      );
    }

    this.browserProcess = spawn(launcher.command, [...launcher.args, ...args], {
      detached:    !IS_WINDOWS,
      stdio:       ['ignore', 'pipe', 'pipe'],
      env:         { ...process.env, DISPLAY: this.display },
      windowsHide: false,
      shell:       Boolean(launcher.shell),
    });
    if (!IS_WINDOWS) this.browserProcess.unref();
    this.browserProcess.stdout.on('data', c => this.log(`browser: ${c.toString('utf8').trim()}`));
    this.browserProcess.stderr.on('data', c => this.log(`browser err: ${c.toString('utf8').trim()}`));
    this.browserProcess.on('exit', (code, sig) => {
      this.log(`browser exited (${code ?? 'null'}/${sig ?? 'null'})`);
      this.stop(`browser exit ${code ?? sig ?? ''}`.trim());
    });

    for (let i = 0; i < 60; i++) {
      await sleep(500);
      try {
        const pages  = await fetchJson(`http://127.0.0.1:${this.devtoolsPort}/json/list`);
        const target = pages.find(p => p.type === 'page') || pages[0];
        if (target?.webSocketDebuggerUrl) { this.targetInfo = target; return; }
      } catch {}
    }
    throw new Error(`Timed out waiting for browser devtools on port ${this.devtoolsPort}`);
  }

  /* ── CDP connect ── */
  async connectDevtools() {
    const ws = new WebSocket(this.targetInfo.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.once('open', res); ws.once('error', rej); });
    this.devtools       = ws;
    this.devtoolsClient = new CdpClient(ws);

    // Route CDP events — used to push live URL changes to the client
    this.devtoolsClient.onEvent = ev => this._handleCdpEvent(ev);

    await this.devtoolsClient.send('Page.enable');
    await this.devtoolsClient.send('Runtime.enable');
    await this.devtoolsClient.send('DOM.enable');
    await this.devtoolsClient.send('Network.enable');

    try {
      const winInfo = await this.devtoolsClient.send('Browser.getWindowForTarget');
      if (winInfo?.windowId) {
        this.browserWindowId = winInfo.windowId;
        await this.devtoolsClient.send('Browser.setWindowBounds', {
          windowId: winInfo.windowId,
          bounds: { left: 0, top: 0, width: this.captureWidth, height: this.captureHeight, windowState: 'normal' },
        });
        this.log(`window positioned 0,0 ${this.captureWidth}x${this.captureHeight}`);
      }
    } catch (e) { this.log(`window control: ${e.message}`); }

    if (IS_WINDOWS && this.browserProcess?.pid) {
      this.windowHandle = await waitForWindowsWindowHandle(this.browserProcess.pid);
      this.windowTitle  = await waitForWindowsWindowTitle(this.browserProcess.pid);
    }
    await this.refreshViewportMetrics();
  }

  /* ── CDP event handler — pushes URL changes over the data channel ── */
  _handleCdpEvent(ev) {
    // Top-level frame navigations (includes back/forward, JS location changes)
    if (ev.method === 'Page.frameNavigated' && ev.params?.frame?.parentId == null) {
      const url = ev.params.frame.url;
      if (url && url !== 'about:blank' && url !== this.url) {
        this.url = url;
        // Push to client over data channel — no Firebase round-trip
        this.sendToClient({ type: 'urlChange', url });
        // Debounced Firebase write for persistence only (5 s)
        clearTimeout(this._urlWriteTimer);
        this._urlWriteTimer = setTimeout(() => {
          this.writeSession({ url }).catch(() => {});
        }, 5000);
        this._urlWriteTimer.unref?.();
      }
    }
  }

  async refreshViewportMetrics() {
    if (!this.devtoolsClient || this.devtoolsClient.closed) return;
    let wm = null, lm = null;
    try {
      const r = await this.devtoolsClient.send('Runtime.evaluate', {
        expression:    `(()=>({innerWidth:window.innerWidth,innerHeight:window.innerHeight,outerWidth:window.outerWidth,outerHeight:window.outerHeight}))()`,
        returnByValue: true,
      });
      wm = r?.result?.value || null;
    } catch (e) { this.log(`viewport JS: ${e.message}`); }
    try { lm = await this.devtoolsClient.send('Page.getLayoutMetrics'); } catch (e) { this.log(`layout metrics: ${e.message}`); }

    const visual = lm?.cssVisualViewport || {};
    const iw = Math.round(Number(wm?.innerWidth)  || Number(visual.clientWidth)  || this.captureWidth);
    const ih = Math.round(Number(wm?.innerHeight) || Number(visual.clientHeight) || this.captureHeight);
    const ow = Math.round(Number(wm?.outerWidth)  || this.captureWidth);
    const oh = Math.round(Number(wm?.outerHeight) || this.captureHeight);
    this.viewportWidth  = Math.max(1, iw);
    this.viewportHeight = Math.max(1, ih);
    const sc = Math.max(0, Math.round((ow - this.viewportWidth)  / 2));
    const tc = Math.max(0, Math.round(oh - this.viewportHeight - sc));
    this.contentRect = {
      x:      Math.min(Math.max(0, sc), Math.max(0, this.captureWidth  - 1)),
      y:      Math.min(Math.max(0, tc), Math.max(0, this.captureHeight - 1)),
      width:  Math.max(1, Math.min(this.viewportWidth,  this.captureWidth  - (Math.min(Math.max(0, sc), this.captureWidth  - 1)))),
      height: Math.max(1, Math.min(this.viewportHeight, this.captureHeight - (Math.min(Math.max(0, tc), this.captureHeight - 1)))),
    };
    this.log(`viewport: ${this.captureWidth}x${this.captureHeight} frame, ${this.viewportWidth}x${this.viewportHeight} cdp`);
  }

  configureWindowsLayout() {
    if (!IS_WINDOWS) return;
    const s = getPrimaryScreenBounds();
    this.captureWidth   = Math.min(this.captureWidth,  s.width);
    this.captureHeight  = Math.min(this.captureHeight, s.height);
    this.viewportWidth  = this.captureWidth;
    this.viewportHeight = this.captureHeight;
    this.contentRect    = { x: 0, y: 0, width: this.viewportWidth, height: this.viewportHeight };
    this._updateFrameSize();
  }

  /* ── WebRTC peer connection ── */
  setupPeerConnection() {
    const { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, nonstandard } = getWrtc();
    this.RTCSessionDescription = RTCSessionDescription;
    this.RTCIceCandidate       = RTCIceCandidate;

    this.pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

    this.videoSource = new nonstandard.RTCVideoSource();
    this.videoTrack  = this.videoSource.createTrack();
    this.pc.addTrack(this.videoTrack);

    this.audioSource = new nonstandard.RTCAudioSource();
    this.audioTrack  = this.audioSource.createTrack();
    this.pc.addTrack(this.audioTrack);

    this.controlChannel = this.pc.createDataChannel('control', { ordered: true });

    this.controlChannel.onopen = () => {
      this.log('control channel open (WebRTC)');
      // Push initial state to client over data channel — no Firebase needed
      this.sendToClient({ type: 'captureInfo', capture: this.captureInfo() });
      this.sendToClient({ type: 'urlChange',   url:     this.url });
    };
    this.controlChannel.onclose = () => this.log('control channel closed');
    this.controlChannel.onmessage = async ev => {
      const msg = parseJson(ev.data);
      if (!msg) return;
      this.lastInputAt = Date.now();
      try { await this.handleControlMessage(msg); }
      catch (e) { this.log(`control error: ${e.message}`); }
    };

    this.pc.onicecandidate = ev => {
      if (!ev.candidate) return;
      const key = randomId();
      void this.db.put(`${this.sessionPath}/serverCandidates/${key}`, ev.candidate.toJSON())
        .catch(e => this.log(`server candidate write: ${e.message}`));
    };

    this.pc.onconnectionstatechange = () => {
      this.state     = this.pc.connectionState;
      this.updatedAt = Date.now();
      this.log(`peer state: ${this.pc.connectionState}`);

      if (this.pc.connectionState === 'connected') {
        this._rtcConnected = true;
        // Prune all Firebase signaling data — WebRTC is sole channel from here
        void this.pruneSignalingData().catch(e => this.log(`signal cleanup: ${e.message}`));
        // One final status write, then Firebase goes quiet
        void this.writeSession({
          status:          'connected',
          connectionState: 'connected',
          transport:       'webrtc-data-channel',
        }).catch(() => {});
      } else if (this.pc.connectionState === 'failed' || this.pc.connectionState === 'closed') {
        this.stop('peer disconnected');
      }
    };
    this.pc.oniceconnectionstatechange = () => this.log(`ICE: ${this.pc.iceConnectionState}`);
  }

  async pruneSignalingData() {
    if (this.signalingCleaned) return;
    this.signalingCleaned = true;
    await this.db.patch(this.sessionPath, {
      offer:             null,
      answer:            null,
      clientCandidates:  null,
      serverCandidates:  null,
      signalingPrunedAt: Date.now(),
      transport:         'webrtc-data-channel',
    });
    this.log('Firebase signaling pruned — all state sync is WebRTC');
  }

  /* ── Control message handler ── */
  async handleControlMessage(msg) {
    if (!this.devtoolsClient) throw new Error('DevTools not ready');

    if (msg.type === 'focus') {
      await this.devtoolsClient.send('Page.bringToFront');
      return;
    }

    if (msg.type === 'reload') {
      await this.devtoolsClient.send('Page.reload', { ignoreCache: true });
      setTimeout(async () => {
        try {
          await this.refreshViewportMetrics();
          // Push updated capture info over data channel — no Firebase write
          this.sendToClient({ type: 'captureInfo', capture: this.captureInfo() });
        } catch (e) { this.log(`viewport refresh: ${e.message}`); }
      }, 1000).unref?.();
      return;
    }

    if (msg.type === 'navigate' && typeof msg.url === 'string') {
      this.url = msg.url;
      await this.devtoolsClient.send('Page.navigate', { url: msg.url });
      setTimeout(async () => {
        try {
          await this.refreshViewportMetrics();
          this.sendToClient({ type: 'urlChange',   url:     this.url });
          this.sendToClient({ type: 'captureInfo', capture: this.captureInfo() });
          // Persist to Firebase with a delay — not time-critical
          clearTimeout(this._urlWriteTimer);
          this._urlWriteTimer = setTimeout(() => {
            this.writeSession({ url: this.url }).catch(() => {});
          }, 5000);
          this._urlWriteTimer.unref?.();
        } catch (e) { this.log(`viewport refresh: ${e.message}`); }
      }, 1000).unref?.();
      return;
    }

    // ── Close tab ────────────────────────────────────────────────────────
    if (msg.type === 'closeTab') {
      this.log('closeTab requested by client');
      // Notify client first so it can clean up UI immediately
      this.sendToClient({ type: 'tabClosed' });
      setTimeout(() => this.stop('client closeTab'), 200).unref?.();
      return;
    }

    if (msg.type === 'mouse') {
      await this.devtoolsClient.send('Page.bringToFront');
      const cx         = Math.max(0, Math.min(Number(msg.x) || 0, this.viewportWidth  - 1));
      const cy         = Math.max(0, Math.min(Number(msg.y) || 0, this.viewportHeight - 1));
      const button     = msg.button || 'left';
      const clickCount = Number(msg.clickCount) || 1;
      const modifiers  = this._mods(msg);
      const buttons    = isFinite(msg.buttons) ? msg.buttons
        : (button === 'left' ? 1 : button === 'right' ? 2 : button === 'middle' ? 4 : 0);
      const eventType  = { move: 'mouseMoved', down: 'mousePressed', up: 'mouseReleased', wheel: 'mouseWheel' }[msg.action] || 'mouseMoved';
      const params     = { type: eventType, x: cx, y: cy, button, buttons: msg.action === 'up' ? 0 : buttons, clickCount, modifiers, pointerType: 'mouse' };
      if (msg.action === 'wheel') { params.deltaX = Number(msg.deltaX) || 0; params.deltaY = Number(msg.deltaY) || 0; }
      await this.devtoolsClient.send('Input.dispatchMouseEvent', params);
      return;
    }

    if (msg.type === 'key') {
      await this.devtoolsClient.send('Page.bringToFront');
      await this.devtoolsClient.send('Input.dispatchKeyEvent',
        dispatchKeyEventParams(msg, msg.action === 'up' ? 'keyUp' : 'keyDown'));
      return;
    }

    throw new Error(`Unsupported control type: ${msg.type}`);
  }

  _mods(msg) {
    let m = 0;
    if (msg.altKey)   m |= 1;
    if (msg.ctrlKey)  m |= 2;
    if (msg.metaKey)  m |= 4;
    if (msg.shiftKey) m |= 8;
    return m;
  }

  /* ── Capture ── */
  async startCapture() {
    await this.startVideoCapture();
    try { this.startAudioCapture(); }
    catch (e) { this.log(`audio setup failed: ${e.message}`); this.startSilentAudio(`setup failed: ${e.message}`); }

    this.offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(this.offer);
    await this.writeSession({
      offer:     this.offer,
      status:    'offer-ready',
      hostState: 'waiting-answer',
      capture:   this.captureInfo(),
    });
    this.state = 'offer-ready';
  }

  async startVideoCapture() {
    const args = ['-loglevel', 'error'];
    if (IS_WINDOWS) {
      const hwnd = this.windowHandle || (this.browserProcess?.pid ? await waitForWindowsWindowHandle(this.browserProcess.pid) : 0);
      if (hwnd) {
        args.push('-f', 'gdigrab', '-draw_mouse', '1', '-framerate', String(this.captureFps), '-i', `hwnd=0x${hwnd.toString(16)}`);
        this.log(`video: gdigrab hwnd=0x${hwnd.toString(16)}`);
      } else {
        const title = this.windowTitle || (this.browserProcess?.pid ? await waitForWindowsWindowTitle(this.browserProcess.pid) : '');
        if (title) {
          args.push('-f', 'gdigrab', '-draw_mouse', '1', '-framerate', String(this.captureFps), '-i', `title=${title}`);
        } else {
          const r = this.captureRect || { x: 0, y: 0, width: this.captureWidth, height: this.captureHeight };
          args.push('-f', 'gdigrab', '-draw_mouse', '1', '-framerate', String(this.captureFps),
            '-offset_x', String(r.x || 0), '-offset_y', String(r.y || 0),
            '-video_size', `${r.width}x${r.height}`, '-i', 'desktop');
        }
      }
    } else {
      args.push('-f', 'x11grab', '-draw_mouse', '1', '-framerate', String(this.captureFps));
      if (this.captureRect) {
        args.push('-video_size', `${this.captureRect.width}x${this.captureRect.height}`,
          '-i', `${this.display}+${this.captureRect.x},${this.captureRect.y}`);
      } else {
        args.push('-video_size', `${this.captureWidth}x${this.captureHeight}`, '-i', `${this.display}+0,0`);
      }
    }

    const w = this.captureWidth  % 2 === 0 ? this.captureWidth  : this.captureWidth  - 1;
    const h = this.captureHeight % 2 === 0 ? this.captureHeight : this.captureHeight - 1;
    if (w !== this.captureWidth || h !== this.captureHeight) {
      this.captureWidth = w; this.captureHeight = h;
      this._updateFrameSize();
      this.log(`adjusted to even dimensions: ${w}x${h}`);
    }
    args.push('-vf', `scale=${w}:${h}`, '-pix_fmt', 'yuv420p', '-vcodec', 'rawvideo', '-f', 'rawvideo', 'pipe:1');

    const ffmpegBin = getFfmpegBinary();
    this.videoProcess = spawn(ffmpegBin, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    this.videoProcess.stderr.on('data', c => this.log(`ffmpeg video: ${c.toString('utf8').trim()}`));
    this.videoProcess.on('error', e => { this.log(`video spawn: ${e.message}`); this.stop('video failed'); });
    this.videoProcess.on('exit', (c, s) => this.log(`video exited (${c ?? 'null'}/${s ?? 'null'})`));

    this.videoBuffer = Buffer.alloc(0);
    this.videoProcess.stdout.on('data', chunk => {
      this.videoBuffer = Buffer.concat([this.videoBuffer, chunk]);
      while (this.videoBuffer.length >= this.videoFrameSize) {
        const frame = this.videoBuffer.subarray(0, this.videoFrameSize);
        this.videoBuffer = this.videoBuffer.subarray(this.videoFrameSize);
        try { this.videoSource.onFrame({ width: this.captureWidth, height: this.captureHeight, data: new Uint8Array(frame) }); }
        catch (e) { this.log(`video frame: ${e.message}`); }
      }
      if (this.videoBuffer.length > this.videoFrameSize * 4) {
        this.log('video buffer overflow, resetting');
        this.videoBuffer = Buffer.alloc(0);
      }
    });
    this.log(`video capture started: ${w}x${h}@${this.captureFps}fps`);
  }

  startAudioCapture() {
    if (/^(none|off|disabled)$/i.test(String(this.audioSourceName || '').trim())) {
      this.startSilentAudio('audio disabled'); return;
    }
    const ffmpegBin = getFfmpegBinary();
    const args = ['-loglevel', 'warning', '-nostdin', '-thread_queue_size', '1024'];
    if (IS_WINDOWS) {
      const src = (this.audioSourceName && !/^(auto|default)$/i.test(this.audioSourceName)) ? this.audioSourceName : '';
      args.push('-f', 'wasapi', '-loopback', '1', '-i', src, '-ac', '2', '-ar', '48000', '-sample_fmt', 's16');
      this.log(`audio: wasapi loopback "${src || 'default'}"`);
    } else {
      const sourceName = getLinuxAudioSourceName(this.audioSourceName);
      this.audioSourceName = sourceName;
      args.push('-f', 'pulse', '-i', sourceName, '-ac', '2', '-ar', '48000', '-sample_fmt', 's16');
      this.log(`audio: pulse "${sourceName}"`);
    }
    args.push('-f', 's16le', 'pipe:1');

    this.audioProcess = spawn(ffmpegBin, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    this.audioProcess.stderr.on('data', c => this.log(`ffmpeg audio: ${c.toString('utf8').trim()}`));
    this.audioProcess.on('error', e => { this.log(`audio spawn: ${e.message}`); this.startSilentAudio(`spawn: ${e.message}`); });
    this.audioProcess.on('exit', (c, s) => {
      this.log(`audio exited (${c ?? 'null'}/${s ?? 'null'})`);
      if (!this.cleaningUp) this.startSilentAudio('process exited');
    });

    this.audioFallbackTimer = setTimeout(() => {
      if (!this.cleaningUp && this.audioFramesPushed === 0) this.startSilentAudio('no audio frames in 3s');
    }, 3000);
    this.audioFallbackTimer.unref?.();

    const frameBytes = this.audioFrameBytes;
    this.audioProcess.stdout.on('data', chunk => {
      this.audioBytesCaptured += chunk.length;
      this.audioBuffer = Buffer.concat([this.audioBuffer, chunk]);
      while (this.audioBuffer.length >= frameBytes) {
        const frame = this.audioBuffer.subarray(0, frameBytes);
        this.audioBuffer = this.audioBuffer.subarray(frameBytes);
        try {
          this.stopSilentAudio();
          this.audioSource.onData({
            samples:        new Int16Array(frame.buffer.slice(frame.byteOffset, frame.byteOffset + frame.byteLength)),
            sampleRate:     48000,
            bitsPerSample:  16,
            channelCount:   2,
            numberOfFrames: this.audioSamplesPerFrame,
          });
          this.audioFramesPushed++;
          if (this.audioFramesPushed === 1) this.log('audio: receiving samples');
        } catch (e) { this.log(`audio frame: ${e.message}`); }
      }
    });
  }

  startSilentAudio(reason) {
    if (this.silentAudioTimer || !this.audioSource) return;
    this.log(`silent audio (${reason})`);
    const silence = new Int16Array(this.audioSamplesPerFrame * 2);
    this.silentAudioTimer = setInterval(() => {
      if (this.cleaningUp || !this.audioSource) return;
      try {
        this.audioSource.onData({ samples: silence, sampleRate: 48000, bitsPerSample: 16, channelCount: 2, numberOfFrames: this.audioSamplesPerFrame });
      } catch (e) { this.log(`silent audio: ${e.message}`); }
    }, 10);
    this.silentAudioTimer.unref?.();
  }
  stopSilentAudio() {
    if (!this.silentAudioTimer) return;
    clearInterval(this.silentAudioTimer);
    this.silentAudioTimer = null;
  }

  async setAnswer(answer) {
    await this.pc.setRemoteDescription(new this.RTCSessionDescription(answer));
    this.state = 'connected';
    await this.writeSession({ status: 'connected', hostState: 'connected' });
  }
  async addClientCandidate(candidate) {
    if (!candidate) return;
    await this.pc.addIceCandidate(new this.RTCIceCandidate(candidate));
  }

  /* ── Signaling poll — Firebase only until WebRTC connects ── */
  async monitorSession() {
    if (this.monitoring) return;
    this.monitoring = true;
    while (!this.cleaningUp) {
      let session;
      try { session = await this.db.get(this.sessionPath); }
      catch (e) { this.log(`poll error: ${e.message}`); await sleep(750); continue; }

      if (!session) { this.log('session node removed'); break; }
      if (session.status === 'stopped' || session.status === 'deleted') {
        this.log(`stop requested (${session.status})`); break;
      }

      if (this.idleTimeoutMs > 0 && Date.now() - this.lastInputAt > this.idleTimeoutMs) {
        this.log(`idle timeout (${Math.round(this.idleTimeoutMs / 1000)}s)`);
        await this.stop('idle timeout'); return;
      }

      if (session.answer && !this.remoteDescriptionSet) {
        try { await this.setAnswer(session.answer); this.remoteDescriptionSet = true; }
        catch (e) { this.log(`answer error: ${e.message}`); }
      }

      for (const [key, cand] of Object.entries(session.clientCandidates || {})) {
        if (this.seenClientCandidateKeys.has(key)) continue;
        this.seenClientCandidateKeys.add(key);
        try { await this.addClientCandidate(cand); }
        catch (e) { this.log(`client ICE: ${e.message}`); }
      }

      // Once WebRTC is connected, poll very infrequently — only for stop signals
      await sleep(this._rtcConnected ? 30000 : this.remoteDescriptionSet ? this.connectedPollMs : this.signalPollMs);
    }
    await this.stop('session ended');
  }

  /* ── Start ── */
  async start() {
    fs.mkdirSync(this.userDataDir,   { recursive: true });
    fs.mkdirSync(this.sessionTmpDir, { recursive: true });

    this.devtoolsPort = allocateDevtoolsPort();
    this.log(`devtools port: ${this.devtoolsPort}`);

    this.configureWindowsLayout();
    await this.claim();
    await this.launchBrowser();
    await this.connectDevtools();

    if (!IS_WINDOWS) {
      const winId = await waitForBrowserWindow(this.browserProcess?.pid, this.url);
      if (winId) {
        this.captureWindowId = winId;
        try { runSync('wmctrl',  ['-ia', winId]); } catch {}
        try { runSync('xdotool', ['windowactivate', '--sync', winId]); } catch {}
        this.log(`X11 window: ${winId}`);
        const geo = runSync('xwininfo', ['-id', winId]);
        const p   = geo.status === 0 && geo.stdout ? parseXwininfoGeometry(geo.stdout) : null;
        this.captureRect = { x: p?.x || 0, y: p?.y || 0, width: this.captureWidth, height: this.captureHeight };
      } else {
        this.log('browser window not detected; capture at 0,0');
        this.captureRect = { x: 0, y: 0, width: this.captureWidth, height: this.captureHeight };
      }
    }

    if (this.captureWidth  % 2 !== 0) this.captureWidth  -= 1;
    if (this.captureHeight % 2 !== 0) this.captureHeight -= 1;
    this._updateFrameSize();

    this.setupPeerConnection();
    await this.startCapture();

    if (this.maxSessionMs > 0) {
      this.autoStopTimer = setTimeout(() => {
        this.log(`max session time (${Math.round(this.maxSessionMs / 1000)}s)`);
        this.stop('timeout');
      }, this.maxSessionMs);
    }

    void this.monitorSession();
  }

  /* ── Stop / cleanup ── */
  async stop(reason = 'stopped') {
    if (this.cleaningUp) return;
    this.cleaningUp = true;
    this.state = `stopped:${reason}`;
    this.log(`stopping: ${reason}`);

    clearTimeout(this.autoStopTimer);
    clearTimeout(this.audioFallbackTimer);
    clearTimeout(this._urlWriteTimer);
    this.autoStopTimer = null; this.audioFallbackTimer = null; this._urlWriteTimer = null;
    this.stopSilentAudio();

    if (this.devtoolsPort) { releaseDevtoolsPort(this.devtoolsPort); this.devtoolsPort = null; }

    try {
      if (this.devtoolsClient && !this.devtoolsClient.closed)
        await Promise.race([this.devtoolsClient.send('Browser.close'), sleep(2000)]);
    } catch {}

    for (const proc of [this.audioProcess, this.videoProcess, this.browserProcess]) {
      if (!proc) continue;
      killTree(proc, 'SIGTERM');
      await sleep(300);
      killTree(proc, 'SIGKILL');
    }

    try { if (this.controlChannel) this.controlChannel.close(); } catch {}
    try { if (this.pc) this.pc.close(); } catch {}
    try { if (this.devtoolsClient) this.devtoolsClient.close(); } catch {}
    try { if (this.devtools) this.devtools.close(); } catch {}

    try { fs.rmSync(this.sessionTmpDir, { recursive: true, force: true }); } catch {}

    try {
      await this.db.patch(this.sessionPath, {
        status:           'stopped',
        stoppedAt:        Date.now(),
        stopReason:       reason,
        offer:            null, answer: null,
        clientCandidates: null, serverCandidates: null,
      });
    } catch {}

    await sleep(500);
    try { await this.db.delete(this.sessionPath); } catch {}
    try { await this.db.delete(`remoteBrowser/signaling/${this.id}`); } catch {}
    if (this.db.localId) {
      try { await this.db.delete(`remoteBrowser/hosts/${this.db.localId}/sessions/${this.id}`); } catch {}
    }
    this.log(`session ${this.id.slice(0, 8)} fully stopped`);
    if (this.db.localId) {
      try { await this.db.delete(`remoteBrowser/hosts/${this.db.localId}/sessions/${this.id}`); } catch {}
    }
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   Main loop
══════════════════════════════════════════════════════════════════════════ */
async function main() {
  const db = new FirebaseRestClient();
  await db.signInAnonymously();
  console.log(`[connect] signed in as host ${db.localId}`);

  const claimed              = new Set();
  const sessionsByClientUid  = new Map();
  const activeSessions       = new Map();

  let shuttingDown = false;
  const hostPath        = `remoteBrowser/hosts/${db.localId || randomId()}`;
  const mainPollMs      = readEnvInt('REMOTE_BROWSER_MAIN_POLL_MS', 1500);
  const hostHeartbeatMs = readEnvInt('REMOTE_BROWSER_HOST_HEARTBEAT_MS', 15000);

  async function writeHostStatus(status = 'online', extra = {}) {
    await db.patch(hostPath, {
      status, updatedAt: Date.now(), pid: process.pid, platform: process.platform,
      activeSessions: activeSessions.size,
      capabilities: {
        webrtc: true, video: true, audio: true,
        control: 'webrtc-data-channel',
        ffmpeg: Boolean(findExe([process.env.REMOTE_BROWSER_FFMPEG_BIN, process.env.FFMPEG_BIN,
          IS_WINDOWS ? 'ffmpeg.exe' : 'ffmpeg'].filter(Boolean))),
      },
      ...extra,
    });
  }

  await writeHostStatus('online', { startedAt: Date.now() }).catch(e => console.error(`host status: ${e.message}`));
  const heartbeat = setInterval(() => {
    writeHostStatus('online').catch(e => console.error(`heartbeat: ${e.message}`));
  }, hostHeartbeatMs);
  heartbeat.unref?.();

  async function shutdown(sig) {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`[connect] ${sig} — stopping all sessions…`);
    clearInterval(heartbeat);
    await Promise.all([...activeSessions.values()].map(s => s.stop('host shutdown').catch(() => {})));
    await writeHostStatus('offline', { activeSessions: 0, stoppedAt: Date.now(), stopReason: sig }).catch(() => {});
    try { await db.delete(hostPath); } catch {}
    process.exit(0);
  }
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));

  while (!shuttingDown) {
    try {
      const sessions = await db.get('remoteBrowser/sessions');
      const entries  = sessions && typeof sessions === 'object' ? Object.entries(sessions) : [];
      const pending  = entries
        .filter(([id, s]) => s && s.status === 'pending' && !s.hostId)
        .sort((a, b) => Number(b[1]?.createdAt || 0) - Number(a[1]?.createdAt || 0));

      if (!pending.length) { await sleep(mainPollMs); continue; }

      for (const [sessionId, request] of pending) {
        if (claimed.has(sessionId)) continue;
        claimed.add(sessionId);

        const clientUid = typeof request?.requestedBy === 'string' ? request.requestedBy.trim() : '';
        const age = Date.now() - Number(request?.createdAt || 0);
        console.log(`[connect] session ${sessionId} from uid ${clientUid.slice(0, 8) || '?'} (${Math.round(age / 1000)}s old)`);

        if (clientUid && sessionsByClientUid.has(clientUid)) {
          const old = sessionsByClientUid.get(clientUid);
          console.log(`[connect] stopping old session ${old.id.slice(0, 8)} for uid ${clientUid.slice(0, 8)}`);
          void old.stop('replaced by new session').catch(() => {});
          sessionsByClientUid.delete(clientUid);
          activeSessions.delete(old.id);
          claimed.delete(old.id);
        }

        const session = new RemoteBrowserSession({ db, sessionId, request });
        activeSessions.set(sessionId, session);
        if (clientUid) sessionsByClientUid.set(clientUid, session);
        void writeHostStatus('online').catch(() => {});

        void session.start()
          .catch(e => {
            console.error(`[connect] session ${sessionId} failed: ${e.message}`);
            void session.stop(`startup failed: ${e.message}`).catch(() => {});
            claimed.delete(sessionId);
          })
          .finally(() => {
            activeSessions.delete(sessionId);
            if (clientUid && sessionsByClientUid.get(clientUid)?.id === sessionId)
              sessionsByClientUid.delete(clientUid);
            claimed.delete(sessionId);
            void writeHostStatus('online').catch(() => {});
          });
      }
    } catch (e) {
      console.error(`[connect] poll error: ${e.message}`);
      await sleep(1000);
    }
  }
}

main().catch(e => { console.error(`[connect] fatal: ${e.message}`); process.exit(1); });