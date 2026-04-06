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
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB max cache per file
const MAX_HTML_CACHE = 100; // Limit HTML cache entries

// ... (keep your color logging functions) ...

// LRU-style HTML cache with size limit
const htmlCache = new Map();
function setHtmlCache(key, value) {
    if (htmlCache.size >= MAX_HTML_CACHE) {
        const firstKey = htmlCache.keys().next().value;
        htmlCache.delete(firstKey);
    }
    htmlCache.set(key, value);
}

// STREAMING XOR for large files - doesn't load entire file into RAM
async function* xorStreamGenerator(readable, key) {
    const keyLen = key.length;
    let keyIndex = 0;
    
    for await (const chunk of readable) {
        const buf = Buffer.from(chunk);
        const out = Buffer.allocUnsafe(buf.length);
        
        // Process in chunks to avoid blocking
        for (let i = 0; i < buf.length; i++) {
            out[i] = buf[i] ^ key[keyIndex];
            keyIndex = (keyIndex + 1) % keyLen;
        }
        yield out;
    }
}

// Skip cache for large files
const MAX_FILE_CACHE_SIZE = 10 * 1024 * 1024; // 10MB

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
        const fileSize = stat.size;

        // STREAM large files instead of buffering
        if (fileSize > MAX_FILE_CACHE_SIZE) {
            logInfo(`Large file detected (${(fileSize/1024/1024).toFixed(2)}MB), streaming...`);
            
            const fileStream = fs.createReadStream(fullPath, { highWaterMark: 64 * 1024 });
            const chunks = [];
            
            for await (const chunk of xorStreamGenerator(fileStream, RESOURCE_KEY)) {
                chunks.push(chunk);
            }
            
            const encrypted = Buffer.concat(chunks);
            const base64Payload = encrypted.toString('base64');
            
            const envelope = {
                contentType: mimeTypes[ext] || 'application/octet-stream',
                size: fileSize,
                payload: base64Payload
            };

            const encryptedEnvelope = xorBufferFast(
                Buffer.from(JSON.stringify(envelope))
            ).toString('base64');

            return res.json({ payload: encryptedEnvelope });
        }

        // Small files: use cache logic
        const range = req.headers.range;
        let start = 0;
        let end = fileSize - 1;

        if (range) {
            const match = /bytes=(\d+)-(\d*)/.exec(range);
            if (match) {
                start = parseInt(match[1], 10);
                end = match[2] ? parseInt(match[2], 10) : end;
            }
        }

        let encryptedFile;
        
        if (await isCacheValid(fullPath, cacheFile)) {
            cacheStats.hits++;
            logCache(true, reqPath);
            const cachedData = await fs.promises.readFile(cacheFile);
            const rangeBuffer = cachedData.slice(start, end + 1);
            encryptedFile = rangeBuffer.toString('base64');
        } else {
            cacheStats.misses++;
            logCache(false, reqPath);
            
            const fileBuffer = await fs.promises.readFile(fullPath);
            const encrypted = xorBufferFast(fileBuffer);
            
            // Async cache write (fire and forget)
            fs.promises.writeFile(cacheFile, encrypted).catch(() => {});
            
            const rangeBuffer = encrypted.slice(start, end + 1);
            encryptedFile = rangeBuffer.toString('base64');
        }

        const envelope = {
            contentType: mimeTypes[ext] || 'application/octet-stream',
            size: fileSize,
            start,
            end,
            payload: encryptedFile
        };

        const encryptedEnvelope = xorBufferFast(
            Buffer.from(JSON.stringify(envelope))
        ).toString('base64');

        res.json({ payload: encryptedEnvelope });

    } catch (err) {
        if (err.code === 'ENOENT') {
            return res.status(404).json({ error: 'not found' });
        }
        res.status(500).json({ error: 'server error' });
    }
});

// HTML cache with LRU eviction
app.use(async (req, res, next) => {
    if (req.method !== 'GET') return next();
    if (!req.path.endsWith('.html') && req.path !== '/') return next();

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
            setHtmlCache(filePath, html);
        }

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(html);
    } catch {
        return next();
    }
});

app.use(express.static(PUBLIC_DIR));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});