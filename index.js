const express = require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const app = express();
const PORT = 3000;

const PUBLIC_DIR = path.join(__dirname, '');
const CACHE_DIR = path.join(__dirname, 'pre_cache');
const RESOURCE_KEY = Buffer.from('games-shell-v1');

// Create cache directory if it doesn't exist
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    console.log('[SERVER] Created pre_cache directory');
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
        
        // Cache is valid if original file hasn't been modified after cache was created
        return originalStat.mtime <= cacheStat.mtime;
    } catch {
        return false;
    }
}

app.post('/api/resource', async (req, res) => {
    const reqPath = req.body.path;
    
    if (!reqPath || reqPath.includes('..')) {
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
            }
        }

        let encryptedFile;
        
        // Check if pre-cached version exists and is valid
        if (await isCacheValid(fullPath, cacheFile)) {
            console.log('[CACHE HIT]', reqPath);
            // Read pre-encrypted file directly
            const cachedData = await fs.promises.readFile(cacheFile);
            const rangeBuffer = cachedData.slice(start, end + 1);
            encryptedFile = rangeBuffer.toString('base64');
        } else {
            console.log('[CACHE MISS]', reqPath);
            // Read, encrypt, and save to cache
            const fileBuffer = await fs.promises.readFile(fullPath);
            const encrypted = xorBufferFast(fileBuffer);
            
            // Save encrypted version to cache (async, don't wait)
            fs.promises.writeFile(cacheFile, encrypted).catch(err => {
                console.error('[CACHE WRITE ERROR]', err);
            });
            
            const rangeBuffer = encrypted.slice(start, end + 1);
            encryptedFile = rangeBuffer.toString('base64');
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
            return res.status(404).json({ error: 'not found' });
        }
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

app.listen(PORT, () => {
    console.log('[SERVER] Running on http://localhost:' + PORT);
    console.log('[SERVER] Pre-cache directory:', CACHE_DIR);
});