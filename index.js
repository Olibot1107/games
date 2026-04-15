const express = require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const https = require('https');
const unzipper = require('unzipper');
const fse = require('fs-extra');
const app = express();
const PORT = 3000;

const PUBLIC_DIR = path.join(__dirname, '');
const CACHE_DIR = path.join(__dirname, 'pre_cache');
const RESOURCE_KEY = Buffer.from('games-shell-v1');
const ZIP_URL = 'https://github.com/Olibot1107/games-math/archive/refs/heads/main.zip';

const TEMP_ZIP = path.join(__dirname, 'repo.zip');
const TEMP_DIR = path.join(__dirname, 'temp_extract');
const FINAL_DIR = path.join(__dirname, 'math');
const REPORTS_FILE = path.join(__dirname, 'reports.json');

// ANSI Color codes
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m'
};

// Colored logging functions
function log(msg, color = 'white') {
    console.log(`${colors[color]}[SERVER]${colors.reset}`, msg);
}

function logCache(hit, file) {
    if (hit) {
        console.log(`${colors.bgGreen}${colors.bright} CACHE HIT ${colors.reset} ${colors.green}${file}${colors.reset}`);
    } else {
        console.log(`${colors.bgYellow}${colors.bright} CACHE MISS ${colors.reset} ${colors.yellow}${file}${colors.reset}`);
    }
}

function logError(msg) {
    console.log(`${colors.bgRed}${colors.bright} ERROR ${colors.reset} ${colors.red}${msg}${colors.reset}`);
}

function logInfo(msg) {
    console.log(`${colors.cyan}[INFO]${colors.reset} ${msg}`);
}

function logSuccess(msg) {
    console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`);
}

a()

async function a() {
    logInfo('Deleting and recreating pre_cache directory');
    if (fs.existsSync(CACHE_DIR)) {
        await fse.removeSync(CACHE_DIR)
        logSuccess('Old cache directory deleted');
    } else {
        logInfo('No existing cache directory found, creating new one');
    }
    logInfo('Creating cache directory...');
    await fs.mkdirSync(CACHE_DIR);
    logSuccess('Cache directory ready');
}

app.use(express.raw({ type: "*/*", limit: "90mb" }));
app.use(cookieParser());

// Non-blocking logger
app.use((req, res, next) => {
    if (!req.path.startsWith('/api/resource')) return next();
    
    process.nextTick(() => {
        fetch('http://localhost:4000/send-embed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                color: '#FFA500',
                fields: [
                    { name: 'Method', value: `\`\`\`${req.method}\`\`\``, inline: true },
                    { name: 'Path', value: `\`\`\`${req.path}\`\`\``, inline: true },
                    { name: 'IP', value: `\`\`\`${req.ip}\`\`\``, inline: true }
                ]
            })
        }).catch(() => {});
    });
    next();
});

app.use((req, res, next) => {
    if (req.path.startsWith('/auth') || req.path.startsWith('/math')) return next();
    if (req.cookies?.ok === 'true') return next();
    return res.redirect('/math/index.html');
});

// ULTRA-FAST XOR
function xorBufferFast(buffer) {
    const keyLen = RESOURCE_KEY.length;
    const bufLen = buffer.length;
    const out = Buffer.allocUnsafe(bufLen);
    
    let i = 0;
    const limit = bufLen - 15;
    
    while (i < limit) {
        const k0 = RESOURCE_KEY[i % keyLen];
        const k1 = RESOURCE_KEY[(i + 1) % keyLen];
        const k2 = RESOURCE_KEY[(i + 2) % keyLen];
        const k3 = RESOURCE_KEY[(i + 3) % keyLen];
        const k4 = RESOURCE_KEY[(i + 4) % keyLen];
        const k5 = RESOURCE_KEY[(i + 5) % keyLen];
        const k6 = RESOURCE_KEY[(i + 6) % keyLen];
        const k7 = RESOURCE_KEY[(i + 7) % keyLen];
        const k8 = RESOURCE_KEY[(i + 8) % keyLen];
        const k9 = RESOURCE_KEY[(i + 9) % keyLen];
        const k10 = RESOURCE_KEY[(i + 10) % keyLen];
        const k11 = RESOURCE_KEY[(i + 11) % keyLen];
        const k12 = RESOURCE_KEY[(i + 12) % keyLen];
        const k13 = RESOURCE_KEY[(i + 13) % keyLen];
        const k14 = RESOURCE_KEY[(i + 14) % keyLen];
        const k15 = RESOURCE_KEY[(i + 15) % keyLen];
        
        out[i] = buffer[i] ^ k0;
        out[i + 1] = buffer[i + 1] ^ k1;
        out[i + 2] = buffer[i + 2] ^ k2;
        out[i + 3] = buffer[i + 3] ^ k3;
        out[i + 4] = buffer[i + 4] ^ k4;
        out[i + 5] = buffer[i + 5] ^ k5;
        out[i + 6] = buffer[i + 6] ^ k6;
        out[i + 7] = buffer[i + 7] ^ k7;
        out[i + 8] = buffer[i + 8] ^ k8;
        out[i + 9] = buffer[i + 9] ^ k9;
        out[i + 10] = buffer[i + 10] ^ k10;
        out[i + 11] = buffer[i + 11] ^ k11;
        out[i + 12] = buffer[i + 12] ^ k12;
        out[i + 13] = buffer[i + 13] ^ k13;
        out[i + 14] = buffer[i + 14] ^ k14;
        out[i + 15] = buffer[i + 15] ^ k15;
        
        i += 16;
    }
    
    while (i < bufLen) {
        out[i] = buffer[i] ^ RESOURCE_KEY[i % keyLen];
        i++;
    }
    
    return out;
}

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.wasm': 'application/wasm',
    '.unityweb': 'application/octet-stream'
};

// Generate cache filename from path
function getCacheFilename(filePath) {
    const hash = crypto.createHash('md5').update(filePath).digest('hex');
    return path.join(CACHE_DIR, hash + '.cache');
}

// Check if cached version is valid (file not modified)
async function isCacheValid(originalPath, cachePath) {
    try {
        const [originalStat, cacheStat] = await Promise.all([
            fs.promises.stat(originalPath),
            fs.promises.stat(cachePath)
        ]);
        
        return originalStat.mtime <= cacheStat.mtime;
    } catch {
        return false;
    }
}

// Cache statistics
let cacheStats = {
    hits: 0,
    misses: 0,
    saves: 0
};

app.post('/api/resource', async (req, res) => {
    const reqPath = req.body.path;
    
    if (!reqPath || reqPath.includes('..')) {
        logError('Invalid path request: ' + reqPath);
        return res.status(400).json({ error: 'invalid path' });
    }

    const fullPath = path.join(PUBLIC_DIR, reqPath);
    const cacheFile = getCacheFilename(fullPath);
    
    try {
        const stat = await fs.promises.stat(fullPath);
        const ext = path.extname(fullPath).toLowerCase();
        
        // Range handling
        const range = req.headers.range;
        let start = 0;
        let end = stat.size - 1;
        let statusCode = 200;

        if (range) {
            const match = /bytes=(\d+)-(\d*)/.exec(range);
            if (match) {
                start = parseInt(match[1], 10);
                end = match[2] ? parseInt(match[2], 10) : end;
                statusCode = 206;
                logInfo(`Range request: ${start}-${end} for ${reqPath}`);
            }
        }

        let encryptedFile;
        const startTime = Date.now();
        
        // Check if pre-cached version exists and is valid
        if (await isCacheValid(fullPath, cacheFile)) {
            cacheStats.hits++;
            logCache(true, reqPath);
            
            // Read pre-encrypted file directly
            const cachedData = await fs.promises.readFile(cacheFile);
            const rangeBuffer = cachedData.slice(start, end + 1);
            encryptedFile = rangeBuffer.toString('base64');
            
            const elapsed = Date.now() - startTime;
            logInfo(`Served from cache in ${colors.green}${elapsed}ms${colors.reset}`);
        } else {
            cacheStats.misses++;
            logCache(false, reqPath);
            
            // Read, encrypt, and save to cache
            const fileBuffer = await fs.promises.readFile(fullPath);
            logInfo(`File read: ${(fileBuffer.length / 1024).toFixed(2)} KB`);
            
            const encrypted = xorBufferFast(fileBuffer);
            const xorTime = Date.now() - startTime;
            logInfo(`XOR encryption done in ${colors.yellow}${xorTime}ms${colors.reset}`);
            
            // Save encrypted version to cache (async, don't wait)
            fs.promises.writeFile(cacheFile, encrypted).then(() => {
                cacheStats.saves++;
                logSuccess(`Cached to disk: ${reqPath}`);
                logInfo(`Cache stats - Hits: ${colors.green}${cacheStats.hits}${colors.reset} | Misses: ${colors.yellow}${cacheStats.misses}${colors.reset} | Saves: ${colors.cyan}${cacheStats.saves}${colors.reset}`);
            }).catch(err => {
                logError('Cache write failed: ' + err.message);
            });
            
            const rangeBuffer = encrypted.slice(start, end + 1);
            encryptedFile = rangeBuffer.toString('base64');
            
            const elapsed = Date.now() - startTime;
            logInfo(`Total processing time: ${colors.yellow}${elapsed}ms${colors.reset}`);
        }

        const envelope = {
            contentType: mimeTypes[ext] || 'application/octet-stream',
            contentEncoding: ext === '.unityweb' ? 'gzip' : null,
            size: stat.size,
            start,
            end,
            payload: encryptedFile
        };

        // Encrypt envelope
        const encryptedEnvelope = xorBufferFast(
            Buffer.from(JSON.stringify(envelope))
        ).toString('base64');

        res.status(statusCode).json({ payload: encryptedEnvelope });

    } catch (err) {
        if (err.code === 'ENOENT') {
            logError('File not found: ' + fullPath);
            return res.status(404).json({ error: 'not found' });
        }
        logError('Server error: ' + err.message);
        res.status(500).json({ error: 'server error' });
    }
});

// Cached HTML injection
const htmlCache = new Map();

app.use(async (req, res, next) => {
    if (req.method !== 'GET') return next();

    if (req.path.endsWith('.html') || req.path === '/') {
        const filePath = req.path === '/' 
            ? path.join(PUBLIC_DIR, 'index.html')
            : path.join(PUBLIC_DIR, req.path);

        try {
            let html;
            if (htmlCache.has(filePath)) {
                html = htmlCache.get(filePath);
                logInfo(`HTML cache hit: ${req.path}`);
            } else {
                html = await fs.promises.readFile(filePath, 'utf8');
                const inject = `<script>if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js');</script>`;
                html = html.includes('</head>') 
                    ? html.replace('</head>', inject + '</head>')
                    : html + inject;
                htmlCache.set(filePath, html);
                logInfo(`HTML cached: ${req.path}`);
            }

            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.send(html);
        } catch {
            return next();
        }
    }
    next();
});

app.use(express.static(PUBLIC_DIR));

const VOTES_FILE = path.join(__dirname, 'votes.json');

// Ensure votes file exists
if (!fs.existsSync(VOTES_FILE)) fs.writeFileSync(VOTES_FILE, '{}', 'utf8');

// Helper to read/write votes
function readVotes() {
    try { return JSON.parse(fs.readFileSync(VOTES_FILE, 'utf8')); }
    catch { return {}; }
}

function writeVotes(votes) {
    fs.writeFileSync(VOTES_FILE, JSON.stringify(votes, null, 2));
}

// Serve static files
app.use(express.static(PUBLIC_DIR));

// Get all votes
app.get('/api/votes', (req, res) => {
    const votes = readVotes();
    res.json(votes);
});

// Submit a vote
app.post('/api/vote', (req, res) => {
    const { game, vote, uid } = req.body;
    if(!game || !vote || !uid) return res.status(400).json({ error:'Invalid payload' });

    const votes = readVotes();
    if(!votes[game]) votes[game] = {};
    
    // Only store one vote per uid, overwrite previous vote
    votes[game][uid] = vote;
    writeVotes(votes);

    res.json({ success:true });
});

app.get('/kill', (req, res) => {
    logInfo('Shutdown requested via GET');

    res.send('Server shutting down');

    setTimeout(() => {
        process.exit(0);
    }, 100);
});

async function downloadZip(url = ZIP_URL, redirectCount = 0) {
    return new Promise((resolve, reject) => {
        if (redirectCount > 5) {
            return reject(new Error('Too many redirects'));
        }

        https.get(url, (res) => {
            // handle redirect
            if (res.statusCode === 301 || res.statusCode === 302) {
                return downloadZip(res.headers.location, redirectCount + 1)
                    .then(resolve)
                    .catch(reject);
            }

            if (res.statusCode !== 200) {
                return reject(new Error('Bad status code: ' + res.statusCode));
            }

            const file = fs.createWriteStream(TEMP_ZIP);
            res.pipe(file);

            file.on('finish', () => {
                file.close(resolve);
            });

            file.on('error', reject);
        }).on('error', reject);
    });
}

async function extractZip() {
    await fse.remove(TEMP_DIR);
    await fse.ensureDir(TEMP_DIR);

    const buffer = await fs.promises.readFile(TEMP_ZIP);

    await unzipper.Open.buffer(buffer)
        .then(d => d.extract({ path: TEMP_DIR }));
}

async function moveToMathFolder() {
    await fse.ensureDir(FINAL_DIR);

    const extractedRoot = fs.readdirSync(TEMP_DIR)[0];
    const extractedPath = path.join(TEMP_DIR, extractedRoot);

    await fse.copy(extractedPath, FINAL_DIR, {
        overwrite: true
    });

    const gitPath = path.join(FINAL_DIR, '.git');
    if (await fse.pathExists(gitPath)) {
        await fse.remove(gitPath);
    }
}

async function setupMathRepo() {
    try {
        logInfo('Cleaning old math folder...');
        await fse.remove(FINAL_DIR);

        logInfo('Downloading math repo...');
        await downloadZip();

        logInfo('Extracting zip...');
        await extractZip();

        logInfo('Moving files into /math...');
        await moveToMathFolder();

        // cleanup temp files
        if (await fse.pathExists(TEMP_ZIP)) {
            await fse.remove(TEMP_ZIP);
            logInfo('Deleted repo.zip');
        }

        if (await fse.pathExists(TEMP_DIR)) {
            await fse.remove(TEMP_DIR);
            logInfo('Deleted temp extract folder');
        }

        logSuccess('Math repo ready');
    } catch (err) {
        logError('Setup failed: ' + err.message);
    }
}

if (!fs.existsSync(REPORTS_FILE)) fs.writeFileSync(REPORTS_FILE, '{}', 'utf8');

function readReports() {
    try { return JSON.parse(fs.readFileSync(REPORTS_FILE, 'utf8')); }
    catch { return {}; }
}

function writeReports(data) {
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(data, null, 2));
}

app.post('/api/report', (req, res) => {
    const { game, uid, reason } = req.body;
    if(!game || !uid || !reason) {
        return res.status(400).json({ error: 'Invalid payload' });
    }

    const reports = readReports();

    if(!reports[game]) reports[game] = [];

    reports[game].push({
        uid,
        reason,
        time: Date.now()
    });

    writeReports(reports);

    res.json({ success: true });
});

app.get('/api/reports_admin', (req, res) => {
    const reports = readReports();
    res.json(reports);
});

app.get('/api/reports', (req, res) => {
    const reports = readReports();

    const counts = {};

    for (const game in reports) {
        counts[game] = reports[game].length;
    }

    res.json({
        reports,
        counts
    });
});

app.post('/api/reports/delete', (req, res) => {
    const { game, index } = req.body;

    const reports = readReports();
    if (!reports[game]) return res.json({ success: true });

    reports[game].splice(index, 1);

    if (reports[game].length === 0) {
        delete reports[game];
    }

    writeReports(reports);

    res.json({ success: true });
});

app.post('/api/reports/clear', (req, res) => {
    writeReports({});
    res.json({ success: true });
});

// DOWNLOAD TEST (streams data)
app.get("/speed/download", (req, res) => {
  const size = 1 * 1024 * 1024; // 50MB
  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Length", size);

  const chunk = Buffer.alloc(64 * 1024); // 64KB
  let sent = 0;

  function sendChunk() {
    while (sent < size) {
      if (!res.write(chunk)) {
        res.once("drain", sendChunk);
        return;
      }
      sent += chunk.length;
    }
    res.end();
  }

  sendChunk();
});

// UPLOAD TEST
app.post("/speed/upload", (req, res) => {
  let bytes = 0;

  req.on("data", (chunk) => {
    bytes += chunk.length;
  });

  req.on("end", () => {
    res.json({ received: bytes });
  });

  req.on("error", (err) => {
    console.error("Upload error:", err);
    res.sendStatus(500);
  });
});

app.get("/speed/ping", (req, res) => {
  res.json({ t: Date.now() });
});

app.listen(PORT, () => {
    console.log(`
${colors.bright}${colors.cyan}╔══════════════════════════════════════╗
║     SERVER STARTED SUCCESSFULLY      ║
╚══════════════════════════════════════╝${colors.reset}
${colors.green}➜${colors.reset} Running on: ${colors.bright}http://localhost:${PORT}${colors.reset}
${colors.green}➜${colors.reset} Cache directory: ${colors.bright}${CACHE_DIR}${colors.reset}
${colors.green}➜${colors.reset} XOR Key: ${colors.bright}${RESOURCE_KEY.toString()}${colors.reset}
    `);
    setupMathRepo();
});
