const express = require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const stream = require('stream');
const app = express();
const PORT = 3000;

const PUBLIC_DIR = path.join(__dirname, '');
const CACHE_DIR = path.join(__dirname, 'pre_cache');
const RESOURCE_KEY = Buffer.from('games-shell-v1');

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

// Create cache directory if it doesn't exist
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    logSuccess('Created pre_cache directory');
}

app.use(express.json({ limit: '10mb' }));
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

// ULTRA-FAST XOR (for small buffers)
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

// LRU-style HTML cache with size limit
const htmlCache = new Map();
const MAX_HTML_CACHE = 100; // Limit HTML cache entries

function setHtmlCache(key, value) {
    if (htmlCache.size >= MAX_HTML_CACHE) {
        const firstKey = htmlCache.keys().next().value;
        htmlCache.delete(firstKey);
        logInfo(`HTML cache evicted: ${colors.yellow}${firstKey}${colors.reset}`);
    }
    htmlCache.set(key, value);
}

// STREAMING XOR for large files - doesn't load entire file into RAM
async function streamXorToBuffer(readable, key, filePath) {
    const keyLen = key.length;
    let keyIndex = 0;
    const chunks = [];
    let totalBytes = 0;
    const startTime = Date.now();
    
    for await (const chunk of readable) {
        const buf = Buffer.from(chunk);
        const out = Buffer.allocUnsafe(buf.length);
        
        // XOR chunk
        for (let i = 0; i < buf.length; i++) {
            out[i] = buf[i] ^ key[keyIndex];
            keyIndex = (keyIndex + 1) % keyLen;
        }
        
        chunks.push(out);
        totalBytes += out.length;
    }
    
    const elapsed = Date.now() - startTime;
    logInfo(`Streamed ${colors.cyan}${(totalBytes/1024/1024).toFixed(2)}MB${colors.reset} in ${colors.green}${elapsed}ms${colors.reset} for ${colors.yellow}${filePath}${colors.reset}`);
    
    return Buffer.concat(chunks);
}

// Skip cache for large files
const MAX_FILE_CACHE_SIZE = 10 * 1024 * 1024; // 10MB

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
        const fileSize = stat.size;

        // Range handling
        const range = req.headers.range;
        let start = 0;
        let end = fileSize - 1;
        let statusCode = 200;

        if (range) {
            const match = /bytes=(\d+)-(\d*)/.exec(range);
            if (match) {
                start = parseInt(match[1], 10);
                end = match[2] ? parseInt(match[2], 10) : end;
                statusCode = 206;
                logInfo(`Range request: ${colors.cyan}${start}-${end}${colors.reset} for ${colors.yellow}${reqPath}${colors.reset}`);
            }
        }

        let encryptedFile;
        const startTime = Date.now();
        
        // STREAM large files instead of buffering everything at once
        if (fileSize > MAX_FILE_CACHE_SIZE) {
            logInfo(`Large file detected (${colors.magenta}${(fileSize/1024/1024).toFixed(2)}MB${colors.reset}), streaming with XOR...`);
            
            const fileStream = fs.createReadStream(fullPath, { 
                highWaterMark: 256 * 1024, // 256KB chunks
                start: start,
                end: end
            });
            
            const encrypted = await streamXorToBuffer(fileStream, RESOURCE_KEY, reqPath);
            encryptedFile = encrypted.toString('base64');
            
            const totalElapsed = Date.now() - startTime;
            logSuccess(`Large file served in ${colors.green}${totalElapsed}ms${colors.reset} (no disk cache)`);
            
        } else {
            // Small files: use cache logic
            if (await isCacheValid(fullPath, cacheFile)) {
                cacheStats.hits++;
                logCache(true, reqPath);
                
                const cachedData = await fs.promises.readFile(cacheFile);
                const rangeBuffer = cachedData.slice(start, end + 1);
                encryptedFile = rangeBuffer.toString('base64');
                
                const elapsed = Date.now() - startTime;
                logInfo(`Served from cache in ${colors.green}${elapsed}ms${colors.reset}`);
            } else {
                cacheStats.misses++;
                logCache(false, reqPath);
                
                const fileBuffer = await fs.promises.readFile(fullPath);
                logInfo(`File read: ${colors.cyan}${(fileBuffer.length / 1024).toFixed(2)} KB${colors.reset}`);
                
                const encrypted = xorBufferFast(fileBuffer);
                const xorTime = Date.now() - startTime;
                logInfo(`XOR encryption done in ${colors.yellow}${xorTime}ms${colors.reset}`);
                
                // Save encrypted version to cache (async, don't wait)
                fs.promises.writeFile(cacheFile, encrypted).then(() => {
                    cacheStats.saves++;
                    logSuccess(`Cached to disk: ${colors.green}${reqPath}${colors.reset}`);
                    logInfo(`Cache stats - Hits: ${colors.green}${cacheStats.hits}${colors.reset} | Misses: ${colors.yellow}${cacheStats.misses}${colors.reset} | Saves: ${colors.cyan}${cacheStats.saves}${colors.reset}`);
                }).catch(err => {
                    logError('Cache write failed: ' + err.message);
                });
                
                const rangeBuffer = encrypted.slice(start, end + 1);
                encryptedFile = rangeBuffer.toString('base64');
                
                const elapsed = Date.now() - startTime;
                logInfo(`Total processing time: ${colors.yellow}${elapsed}ms${colors.reset}`);
            }
        }

        const envelope = {
            contentType: mimeTypes[ext] || 'application/octet-stream',
            contentEncoding: ext === '.unityweb' ? 'gzip' : null,
            size: fileSize,
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

// HTML cache with LRU eviction
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
                logInfo(`HTML cache hit: ${colors.green}${req.path}${colors.reset}`);
            } else {
                html = await fs.promises.readFile(filePath, 'utf8');
                const inject = `<script>if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js');</script>`;
                html = html.includes('</head>') 
                    ? html.replace('</head>', inject + '</head>')
                    : html + inject;
                setHtmlCache(filePath, html);
                logInfo(`HTML cached: ${colors.cyan}${req.path}${colors.reset} (cache size: ${colors.yellow}${htmlCache.size}/${MAX_HTML_CACHE}${colors.reset})`);
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

app.listen(PORT, () => {
    console.log(`
${colors.bright}${colors.cyan}╔══════════════════════════════════════╗
║     SERVER STARTED SUCCESSFULLY      ║
╚══════════════════════════════════════╝${colors.reset}
${colors.green}➜${colors.reset} Running on: ${colors.bright}http://localhost:${PORT}${colors.reset}
${colors.green}➜${colors.reset} Cache directory: ${colors.bright}${CACHE_DIR}${colors.reset}
${colors.green}➜${colors.reset} XOR Key: ${colors.bright}${RESOURCE_KEY.toString()}${colors.reset}
${colors.green}➜${colors.reset} Streaming threshold: ${colors.bright}${(MAX_FILE_CACHE_SIZE/1024/1024).toFixed(0)}MB${colors.reset}
${colors.green}➜${colors.reset} HTML cache limit: ${colors.bright}${MAX_HTML_CACHE}${colors.reset} entries
    `);
});