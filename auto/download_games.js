#!/usr/bin/env node
// Downloads game files from S3 into nova/ directories.
// Usage: node auto/download_games.js [game1 game2 ...]
//        (no args = downloads all stub-only nova games)

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const url   = require('url');

const BASE     = 'https://unblocked-games.s3.amazonaws.com';
const NOVA_DIR = path.join(__dirname, '..', 'nova');
const CLIENT   = 'https://plain-vanessa-ojdaw-24d55416.koyeb.app/client_script.js';

const c = {
  reset:'\x1b[0m', green:'\x1b[32m', red:'\x1b[31m',
  yellow:'\x1b[33m', cyan:'\x1b[36m', bold:'\x1b[1m'
};
const log = (msg, col='reset') => console.log(`${c[col]}${msg}${c.reset}`);

// ── HTTP helpers ──────────────────────────────────────────────────────────────

function httpGet(targetUrl, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error('Too many redirects'));
    const parsed = new URL(targetUrl);
    const mod    = parsed.protocol === 'https:' ? https : http;
    mod.get(targetUrl, { timeout: 30000 }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const loc = new URL(res.headers.location, targetUrl).href;
        res.resume();
        return resolve(httpGet(loc, redirects + 1));
      }
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
    }).on('error', reject).on('timeout', () => reject(new Error('Timeout')));
  });
}

async function fetchText(u) {
  const { status, body } = await httpGet(u);
  if (status !== 200) throw new Error(`HTTP ${status}`);
  return body.toString('utf8');
}

async function downloadBinary(u, dest) {
  const { status, body } = await httpGet(u);
  if (status !== 200) throw new Error(`HTTP ${status}`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body);
  return body.length;
}

// ── Extract relative references from HTML / JS text ──────────────────────────

function extractRefs(text, currentPath) {
  const refs = new Set();
  let m;

  // HTML attributes: src="..." href="..." url("...")
  const attrRe = /(?:src|href|url)\s*[=(]["']([^"'>\s]+)["']/g;
  while ((m = attrRe.exec(text)) !== null) refs.add(m[1]);

  // JS string literals with known directory prefixes
  const jsRe = /["'`]((Build|StreamingAssets|TemplateData|TemplateData\/Orientation|assets\/images|assets\/lib|assets\/css|assets\/fonts|src|styles|fonts)\/[^"'`\s?#]+)["'`]/g;
  while ((m = jsRe.exec(text)) !== null) refs.add(m[1]);

  // Unity build var concatenation: buildUrl + "/FileName.loader.js" or "?.unityweb" variants
  const buildConcatRe = /(?:buildUrl|loaderUrl)\s*\+\s*["'`]\/([^"'`\s]+)["'`]/g;
  while ((m = buildConcatRe.exec(text)) !== null) refs.add('Build/' + m[1].replace(/\?.*$/, ''));

  // Unity build object properties: loaderUrl: "Build/name.loader.js" or dataUrl: "Build/..."
  const buildPropRe = /(?:loaderUrl|dataUrl|frameworkUrl|codeUrl|streamingAssetsUrl)\s*[:=]\s*["'`]([^"'`?\s]+)["'`]/g;
  while ((m = buildPropRe.exec(text)) !== null) refs.add(m[1].replace(/\?.*$/, ''));

  // Legacy Unity game.json files
  const jsonRe = /["'`](Build\/[^"'`?\s]+\.json)["'`]/g;
  while ((m = jsonRe.exec(text)) !== null) refs.add(m[1]);

  // Relative ./ paths
  const dotSlashRe = /["'`](\.\/[^"'`?\s#]+)["'`]/g;
  while ((m = dotSlashRe.exec(text)) !== null) refs.add(m[1]);

  return [...refs].filter(r => {
    if (!r || r.startsWith('http') || r.startsWith('//') || r.startsWith('#') || r.startsWith('data:')) return false;
    if (r.includes('googletagmanager') || r.includes('wgplayer') || r.includes('promo.js') || r.includes('cloudflare') || r.includes('beacon.min')) return false;
    return true;
  });
}

// ── Spider: download all assets for a game directory ─────────────────────────

async function spiderGame(s3Dir, destDir) {
  const baseUrl  = `${BASE}${s3Dir}`;
  const visited  = new Set();
  const queue    = ['index.html'];
  let downloaded = 0;

  // Text files to parse for more refs
  const TEXT_TYPES = new Set(['.html', '.js', '.css']);

  while (queue.length) {
    const relPath = queue.shift();
    if (visited.has(relPath)) continue;
    visited.add(relPath);

    // Skip absolute URLs or paths going outside the game dir
    if (relPath.startsWith('/') || relPath.startsWith('..')) continue;

    const fileUrl  = `${baseUrl}/${relPath}`;
    const destFile = path.join(destDir, relPath);

    // Skip directory URLs
    if (relPath.endsWith('/')) continue;

    const ext = path.extname(relPath).toLowerCase();
    const alreadyExists = fs.existsSync(destFile) && !fs.statSync(destFile).isDirectory();

    let body;
    if (alreadyExists) {
      // File already on disk — still parse text files to find more refs
      if (TEXT_TYPES.has(ext)) {
        body = fs.readFileSync(destFile);
      } else {
        continue;
      }
    } else {
      try {
        const res = await httpGet(fileUrl);
        if (res.status !== 200) continue;
        body = res.body;
      } catch (e) {
        continue;
      }

      // Skip if destFile is actually a directory (e.g. news/ resolved to a dir)
      if (fs.existsSync(destFile) && fs.statSync(destFile).isDirectory()) continue;

      fs.mkdirSync(path.dirname(destFile), { recursive: true });
      fs.writeFileSync(destFile, body);
      downloaded++;
      process.stdout.write(`  [${downloaded}] ${relPath} (${(body.length/1024).toFixed(0)}KB)\n`);
    }

    // Parse text files for more refs
    if (TEXT_TYPES.has(ext)) {
      const text = body.toString('utf8');
      const refs = extractRefs(text, relPath);
      for (const ref of refs) {
        // Resolve relative to the file's directory within the game
        const base  = path.dirname(relPath) === '.' ? '' : path.dirname(relPath) + '/';
        const resolved = ref.startsWith('/') ? null : (base + ref).replace(/\/\.\//g, '/');
        if (resolved && !visited.has(resolved)) queue.push(resolved);
      }
    }
  }
  return downloaded;
}

// ── Game outer HTML → actual game directory ───────────────────────────────────

async function getGameInfo(gameName) {
  const outerUrl = `${BASE}/${gameName}.html`;
  const html = await fetchText(outerUrl);
  const m = html.match(/<iframe[^>]*src=["']([^"']+)["']/);
  if (!m) return null;
  let src = m[1];

  // Resolve relative src against the outer URL
  if (!src.startsWith('http')) {
    src = new URL(src, outerUrl).href;
  }

  // CDN games
  if (src.includes('/cdn/')) return { type: 'cdn' };

  // Extract S3 path (strip BASE and /game.html suffix, follow one redirect if needed)
  // Some games have /game.html as a redirect wrapper — fetch it to find actual index
  let gamePath = src.replace(BASE, '').replace(/\/game\.html$/, '').replace(/\/index\.html$/, '');

  // Check if this path ends in /game.html (the ad wrapper) — try to find real game path
  if (src.endsWith('/game.html')) {
    try {
      const wrapper = await fetchText(src);
      const redirect = wrapper.match(/(?:window\.location|location\.href)\s*=\s*["']([^"']+)["']/) ||
                       wrapper.match(/<meta[^>]*http-equiv=["']refresh["'][^>]*content=["'][^"']*url=([^"']+)["']/i);
      if (redirect) {
        const realUrl = new URL(redirect[1], src).href;
        gamePath = realUrl.replace(BASE, '').replace(/\/index\.html$/, '');
      }
    } catch {}
  }

  return { type: 'dir', dir: gamePath };
}

// ── Strip FreezeNova tracking; inject our scripts ────────────────────────────

function patchIndexHtml(destDir) {
  const p = path.join(destDir, 'index.html');
  if (!fs.existsSync(p)) return;
  let html = fs.readFileSync(p, 'utf8');
  if (html.includes('/lib/statusbar.js')) return;
  // Remove ad/analytics scripts
  html = html.replace(/<script[^>]*(?:googletagmanager|wgplayer|promo\.js)[^>]*>[\s\S]*?<\/script>/g, '');
  html = html.replace(/<script[^>]*(?:googletagmanager|wgplayer|promo\.js)[^>]*><\/script>/g, '');
  // Inject statusbar + client
  const inject = `<script src="/lib/statusbar.js"></script>\n<script src="${CLIENT}"></script>`;
  html = html.includes('</body>') ? html.replace('</body>', inject + '\n</body>') : html + '\n' + inject;
  fs.writeFileSync(p, html);
}

// ── Main download flow ────────────────────────────────────────────────────────

async function downloadGame(gameName, force = false) {
  const destDir = path.join(NOVA_DIR, gameName);

  // Skip if already properly downloaded (has Build/ dir or is a non-Unity game with multiple files)
  if (!force && fs.existsSync(destDir)) {
    const hasBuild = fs.existsSync(path.join(destDir, 'Build'));
    const files = fs.readdirSync(destDir);
    const isStub = files.length === 1 && files[0] === 'index.html';
    if (!isStub && hasBuild) {
      log(`SKIP ${gameName} (${files.length} items, has Build/)`, 'yellow');
      return 'skip';
    }
    if (!isStub && !hasBuild) {
      // Has files but no Build dir — might be non-Unity, skip unless forced
      log(`SKIP ${gameName} (${files.length} items, non-Unity?)`, 'yellow');
      return 'skip';
    }
    // isStub — remove stub index.html and re-download
    fs.rmSync(path.join(destDir, 'index.html'));
  }

  log(`\n▶ ${gameName}`, 'bold');

  let info;
  try { info = await getGameInfo(gameName); }
  catch (e) { log(`  Outer HTML error: ${e.message}`, 'red'); return 'error'; }

  if (!info) { log(`  No iframe found`, 'yellow'); return 'error'; }

  fs.mkdirSync(destDir, { recursive: true });

  if (info.type === 'cdn') {
    log(`  CDN game — using thin iframe wrapper`, 'cyan');
    const cdnUrl = `${BASE}/cdn/index.html#/class2/${gameName}`;
    const title  = gameName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    fs.writeFileSync(path.join(destDir, 'index.html'),
      `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title>` +
      `<style>*{margin:0;padding:0}html,body{width:100%;height:100%;background:#000;overflow:hidden}` +
      `iframe{position:fixed;inset:0;width:100%;height:100%;border:none}</style></head><body>` +
      `<iframe src="${cdnUrl}" allowfullscreen allow="fullscreen *"></iframe>` +
      `<script src="/lib/statusbar.js"></script><script src="${CLIENT}"></script></body></html>`
    );
    return 'cdn';
  }

  const count = await spiderGame(info.dir, destDir);
  if (count === 0) {
    log(`  Nothing downloaded`, 'red');
    return 'error';
  }

  patchIndexHtml(destDir);

  const totalSize = (() => {
    try { return require('child_process').execSync(`du -sh "${destDir}" | cut -f1`, { encoding: 'utf8' }).trim(); } catch { return '?'; }
  })();
  log(`  Done — ${count} files, ${totalSize}`, 'green');
  return 'ok';
}

async function main() {
  const args = process.argv.slice(2);
  let games = args;
  const forced = args.length > 0;

  if (!games.length) {
    const list = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'list.json'), 'utf8'));
    games = (list.nova || []).filter(g => {
      const d = path.join(NOVA_DIR, g);
      if (!fs.existsSync(d)) return true;
      const files = fs.readdirSync(d);
      return files.length === 1 && files[0] === 'index.html';
    });
    log(`${games.length} stub games queued for download`, 'bold');
  }

  let ok = 0, skip = 0, cdn = 0, err = 0;
  for (const game of games) {
    const r = await downloadGame(game, forced);
    if      (r === 'ok')   ok++;
    else if (r === 'skip') skip++;
    else if (r === 'cdn')  cdn++;
    else                   err++;
  }

  log(`\n=== Done ===\nDownloaded: ${ok}  CDN-wrapper: ${cdn}  Skipped: ${skip}  Errors: ${err}`, 'bold');
}

main().catch(e => { console.error(e); process.exit(1); });
