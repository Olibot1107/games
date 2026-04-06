const express = require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const app = express();
const PORT = 3000;

const PUBLIC_DIR = path.join(__dirname, '');
const CACHE_DIR = path.join(__dirname, 'pre_cache');
const BASE_KEY = 'games-shell-v1';
const DISABLE_CACHE = process.argv.includes('--no-cache') || process.env.NO_CACHE === 'true';

// ANSI Colors (keeping your existing code)
const colors = {
    reset: '\x1b[0m', bright: '\x1b[1m', red: '\x1b[31m',
    green: '\x1b[32m', yellow: '\x1b[33m', blue: '\x1b[34m',
    magenta: '\x1b[35m', cyan: '\x1b[36m', white: '\x1b[37m',
    bgRed: '\x1b[41m', bgGreen: '\x1b[42m', bgYellow: '\x1b[43m'
};

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

if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    logSuccess('Created pre_cache directory');
}

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// ============================================
// OBFUSCATION LAYER
// ============================================

// 1. Generate polymorphic key per session
function generateSessionKey(uid, timestamp) {
    const salt = `${uid}-${Math.floor(timestamp / 60000)}`;
    return crypto.createHash('sha256')
        .update(BASE_KEY + salt)
        .digest();
}

// 2. Multi-layer encryption: XOR + AES
function multiLayerEncrypt(buffer, sessionKey) {
    // Layer 1: Fast XOR (existing)
    const xored = xorBufferFast(buffer, sessionKey);
    
    // Layer 2: AES-256-CTR
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-ctr', sessionKey, iv);
    const encrypted = Buffer.concat([cipher.update(xored), cipher.final()]);
    
    // Prepend IV (needed for decryption)
    return Buffer.concat([iv, encrypted]);
}

// 3. Add noise padding to hide actual size
function addNoisePadding(buffer) {
    const noiseSize = crypto.randomInt(256, 2048);
    const noise = crypto.randomBytes(noiseSize);
    const sizeHeader = Buffer.allocUnsafe(4);
    sizeHeader.writeUInt32BE(buffer.length, 0);
    
    return Buffer.concat([sizeHeader, buffer, noise]);
}

// Fast XOR with dynamic key
function xorBufferFast(buffer, key) {
    const keyLen = key.length;
    const bufLen = buffer.length;
    const out = Buffer.allocUnsafe(bufLen);
    
    let i = 0;
    const limit = bufLen - 15;
    
    while (i < limit) {
        for (let j = 0; j < 16; j++) {
            out[i + j] = buffer[i + j] ^ key[(i + j) % keyLen];
        }
        i += 16;
    }
    
    while (i < bufLen) {
        out[i] = buffer[i] ^ key[i % keyLen];
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

function getCacheFilename(filePath) {
    const hash = crypto.createHash('md5').update(filePath).digest('hex');
    return path.join(CACHE_DIR, hash + '.cache');
}

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

let cacheStats = { hits: 0, misses: 0, saves: 0 };

// ============================================
// RANDOMIZED ENDPOINTS (Domain Fronting)
// ============================================
const FAKE_ENDPOINTS = [
    '/api/resource',
    '/cdn/assets/v2/data',
    '/static/cache/fetch',
    '/api/analytics/collect',
    '/webhooks/track/event'
];

// Non-blocking logger
app.use((req, res, next) => {
    if (!FAKE_ENDPOINTS.includes(req.path)) return next();
    
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

// Handle all fake endpoints
FAKE_ENDPOINTS.forEach(endpoint => {
    app.post(endpoint, async (req, res) => {
        const reqPath = req.body.path;
        
        if (!reqPath || reqPath.includes('..')) {
            logError('Invalid path request: ' + reqPath);
            return res.status(400).json({ error: 'invalid path' });
        }

        // Generate session-specific key
        const uid = req.cookies.uid || crypto.randomBytes(16).toString('hex');
        const timestamp = Date.now();
        const sessionKey = generateSessionKey(uid, timestamp);

        // Set UID cookie if not present
        if (!req.cookies.uid) {
            res.cookie('uid', uid, { maxAge: 86400000, httpOnly: true });
        }

        const fullPath = path.join(PUBLIC_DIR, reqPath);
        const cacheFile = getCacheFilename(fullPath);
        
        try {
            const stat = await fs.promises.stat(fullPath);
            const ext = path.extname(fullPath).toLowerCase();
            
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
            
            if (!DISABLE_CACHE && await isCacheValid(fullPath, cacheFile)) {
                cacheStats.hits++;
                logCache(true, reqPath);
                
                const cachedData = await fs.promises.readFile(cacheFile);
                const rangeBuffer = cachedData.slice(start, end + 1);
                
                // Apply multi-layer encryption
                const encrypted = multiLayerEncrypt(rangeBuffer, sessionKey);
                const padded = addNoisePadding(encrypted);
                encryptedFile = padded.toString('base64');
                
                logInfo(`Served from cache in ${colors.green}${Date.now() - startTime}ms${colors.reset}`);
            } else {
                cacheStats.misses++;
                logCache(false, reqPath);
                
                const fileBuffer = await fs.promises.readFile(fullPath);
                logInfo(`File read: ${(fileBuffer.length / 1024).toFixed(2)} KB`);
                
                const encrypted = xorBufferFast(fileBuffer, Buffer.from(BASE_KEY));
                
                if (!DISABLE_CACHE) {
                    fs.promises.writeFile(cacheFile, encrypted).then(() => {
                        cacheStats.saves++;
                        logSuccess(`Cached to disk: ${reqPath}`);
                        logInfo(`Cache stats - Hits: ${colors.green}${cacheStats.hits}${colors.reset} | Misses: ${colors.yellow}${cacheStats.misses}${colors.reset}`);
                    }).catch(err => logError('Cache write failed: ' + err.message));
                }
                
                const rangeBuffer = encrypted.slice(start, end + 1);
                
                // Apply multi-layer encryption
                const finalEncrypted = multiLayerEncrypt(rangeBuffer, sessionKey);
                const padded = addNoisePadding(finalEncrypted);
                encryptedFile = padded.toString('base64');
                
                logInfo(`Total processing: ${colors.yellow}${Date.now() - startTime}ms${colors.reset}`);
            }

            const envelope = {
                contentType: mimeTypes[ext] || 'application/octet-stream',
                contentEncoding: ext === '.unityweb' ? 'gzip' : null,
                size: stat.size,
                start,
                end,
                timestamp, // Client needs this to derive same key
                payload: encryptedFile
            };

            // Encrypt envelope with session key
            const encryptedEnvelope = multiLayerEncrypt(
                Buffer.from(JSON.stringify(envelope)),
                sessionKey
            ).toString('base64');

            // Fake headers to look like CDN traffic
            res.setHeader('X-CDN-Cache-Status', 'HIT');
            res.setHeader('X-Request-ID', crypto.randomBytes(16).toString('hex'));
            res.setHeader('X-Cache-Region', 'eu-west-1');
            res.setHeader('X-Served-By', `cdn-${crypto.randomInt(1, 99)}`);

            res.status(statusCode).json({ 
                payload: encryptedEnvelope,
                _meta: { v: '2.1', ts: Date.now() } // Looks innocent
            });

        } catch (err) {
            if (err.code === 'ENOENT') {
                logError('File not found: ' + fullPath);
                return res.status(404).json({ error: 'not found' });
            }
            logError('Server error: ' + err.message);
            res.status(500).json({ error: 'server error' });
        }
    });
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
            } else {
                html = await fs.promises.readFile(filePath, 'utf8');
                const inject = `<script>if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js');</script>`;
                html = html.includes('</head>') 
                    ? html.replace('</head>', inject + '</head>')
                    : html + inject;
                htmlCache.set(filePath, html);
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
if (!fs.existsSync(VOTES_FILE)) fs.writeFileSync(VOTES_FILE, '{}', 'utf8');

function readVotes() {
    try { return JSON.parse(fs.readFileSync(VOTES_FILE, 'utf8')); }
    catch { return {}; }
}

function writeVotes(votes) {
    fs.writeFileSync(VOTES_FILE, JSON.stringify(votes, null, 2));
}

app.get('/api/votes', (req, res) => res.json(readVotes()));

app.post('/api/vote', (req, res) => {
    const { game, vote, uid } = req.body;
    if(!game || !vote || !uid) return res.status(400).json({ error:'Invalid payload' });

    const votes = readVotes();
    if(!votes[game]) votes[game] = {};
    votes[game][uid] = vote;
    writeVotes(votes);

    res.json({ success:true });
});

app.listen(PORT, () => {
console.log(`
${colors.bright}${colors.cyan}╔══════════════════════════════════════╗
║   HARDENED SERVER STARTED (v2.0)     ║
╚══════════════════════════════════════╝${colors.reset}
${colors.green}➜${colors.reset} Running on: ${colors.bright}http://localhost:${PORT}${colors.reset}
${colors.green}➜${colors.reset} Obfuscation: ${colors.bright}XOR + AES-256-CTR + Noise Padding${colors.reset}
${colors.green}➜${colors.reset} Endpoints: ${colors.bright}${FAKE_ENDPOINTS.length} randomized paths${colors.reset}
${colors.green}➜${colors.reset} Disk Cache: ${colors.bright}${DISABLE_CACHE ? 'DISABLED' : 'ENABLED'}${colors.reset}
`);
});