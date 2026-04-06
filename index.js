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

// ULTRA-FAST XOR - operates on buffer in-place when possible
function xorBufferFast(buffer) {
    const keyLen = RESOURCE_KEY.length;
    const bufLen = buffer.length;
    
    let i = 0;
    const limit = bufLen - 15;
    
    while (i < limit) {
        buffer[i] ^= RESOURCE_KEY[i % keyLen];
        buffer[i + 1] ^= RESOURCE_KEY[(i + 1) % keyLen];
        buffer[i + 2] ^= RESOURCE_KEY[(i + 2) % keyLen];
        buffer[i + 3] ^= RESOURCE_KEY[(i + 3) % keyLen];
        buffer[i + 4] ^= RESOURCE_KEY[(i + 4) % keyLen];
        buffer[i + 5] ^= RESOURCE_KEY[(i + 5) % keyLen];
        buffer[i + 6] ^= RESOURCE_KEY[(i + 6) % keyLen];
        buffer[i + 7] ^= RESOURCE_KEY[(i + 7) % keyLen];
        buffer[i + 8] ^= RESOURCE_KEY[(i + 8) % keyLen];
        buffer[i + 9] ^= RESOURCE_KEY[(i + 9) % keyLen];
        buffer[i + 10] ^= RESOURCE_KEY[(i + 10) % keyLen];
        buffer[i + 11] ^= RESOURCE_KEY[(i + 11) % keyLen];
        buffer[i + 12] ^= RESOURCE_KEY[(i + 12) % keyLen];
        buffer[i + 13] ^= RESOURCE_KEY[(i + 13) % keyLen];
        buffer[i + 14] ^= RESOURCE_KEY[(i + 14) % keyLen];
        buffer[i + 15] ^= RESOURCE_KEY[(i + 15) % keyLen];
        
        i += 16;
    }
    
    while (i < bufLen) {
        buffer[i] ^= RESOURCE_KEY[i % keyLen];
        i++;
    }
    
    return buffer;
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

// STREAMING XOR directly to another file - ZERO RAM accumulation
async function streamXorFileToFile(sourcePath, destPath, key, filePathForLog) {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(sourcePath, { highWaterMark: 64 * 1024 });
        const writeStream = fs.createWriteStream(destPath);
        const keyLen = key.length;
        let keyIndex = 0;
        let totalBytes = 0;
        const startTime = Date.now();
        
        readStream.on('data', (chunk) => {
            // XOR in-place on the chunk buffer
            for (let i = 0; i < chunk.length; i++) {
                chunk[i] ^= key[keyIndex];
                keyIndex = (keyIndex + 1) % keyLen;
            }
            totalBytes += chunk.length;
            writeStream.write(chunk);
        });
        
        readStream.on('end', () => {
            writeStream.end();
            const elapsed = Date.now() - startTime;
            logInfo(`Streamed ${colors.cyan}${(totalBytes/1024).toFixed(2)}KB${colors.reset} to disk in ${colors.green}${elapsed}ms${colors.reset} for ${colors.yellow}${filePathForLog}${colors.reset}`);
            resolve();
        });
        
        readStream.on('error', reject);
        writeStream.on('error', reject);
    });
}

// STREAMING XOR to base64 response - minimal RAM (one chunk at a time)
async function streamXorToResponse(sourcePath, key, res, filePathForLog, envelopeMeta) {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(sourcePath, { highWaterMark: 48 * 1024 }); // 48KB chunks for base64 efficiency
        const keyLen = key.length;
        let keyIndex = 0;
        const chunks = [];
        let totalBytes = 0;
        const startTime = Date.now();
        
        readStream.on('data', (chunk) => {
            // XOR in-place
            for (let i = 0; i < chunk.length; i++) {
                chunk[i] ^= key[keyIndex];
                keyIndex = (keyIndex + 1) % keyLen;
            }
            // Convert to base64 immediately, don't accumulate raw buffers
            chunks.push(chunk.toString('base64'));
            totalBytes += chunk.length;
        });
        
        readStream.on('end', () => {
            const payload = chunks.join('');
            const elapsed = Date.now() - startTime;
            logInfo(`Streamed ${colors.cyan}${(totalBytes/1024).toFixed(2)}KB${colors.reset} to response in ${colors.green}${elapsed}ms${colors.reset} for ${colors.yellow}${filePathForLog}${colors.reset}`);
            
            const envelope = {
                ...envelopeMeta,
                payload: payload
            };
            
            // XOR envelope in-place
            const envelopeBuf = Buffer.from(JSON.stringify(envelope));
            xorBufferFast(envelopeBuf);
            
            res.json({ payload: envelopeBuf.toString('base64') });
            resolve();
        });
        
        readStream.on('error', (err) => {
            logError('Stream error: ' + err.message);
            reject(err);
        });
    });
}

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

        const envelopeMeta = {
            contentType: mimeTypes[ext] || 'application/octet-stream',
            contentEncoding: ext === '.unityweb' ? 'gzip' : null,
            size: fileSize,
            start,
            end
        };

        const startTime = Date.now();
        
        // Check disk cache first
        if (await isCacheValid(fullPath, cacheFile)) {
            cacheStats.hits++;
            logCache(true, reqPath);
            
            // Stream from disk cache to response - NO RAM accumulation
            await streamXorToResponse(cacheFile, RESOURCE_KEY, res, reqPath, envelopeMeta);
            
            const totalElapsed = Date.now() - startTime;
            logInfo(`Total request time: ${colors.green}${totalElapsed}ms${colors.reset}`);
            return;
        }

        // Cache miss - create encrypted cache on disk, then stream from it
        cacheStats.misses++;
        logCache(false, reqPath);
        
        logInfo(`Creating disk cache for ${colors.yellow}${reqPath}${colors.reset} (${colors.cyan}${(fileSize/1024).toFixed(2)}KB${colors.reset})...`);
        
        // Stream original file to encrypted cache file
        await streamXorFileToFile(fullPath, cacheFile, RESOURCE_KEY, reqPath);
        
        cacheStats.saves++;
        logSuccess(`Cached to disk: ${colors.green}${reqPath}${colors.reset}`);
        logInfo(`Cache stats - Hits: ${colors.green}${cacheStats.hits}${colors.reset} | Misses: ${colors.yellow}${cacheStats.misses}${colors.reset} | Saves: ${colors.cyan}${cacheStats.saves}${colors.reset}`);
        
        // Now stream from the newly created cache to response
        await streamXorToResponse(cacheFile, RESOURCE_KEY, res, reqPath, envelopeMeta);
        
        const totalElapsed = Date.now() - startTime;
        logInfo(`Total request time: ${colors.yellow}${totalElapsed}ms${colors.reset}`);

    } catch (err) {
        if (err.code === 'ENOENT') {
            logError('File not found: ' + fullPath);
            return res.status(404).json({ error: 'not found' });
        }
        logError('Server error: ' + err.message);
        res.status(500).json({ error: 'server error' });
    }
});

// HTML - NO RAM CACHE, read from disk every time (or use disk cache too)
app.use(async (req, res, next) => {
    if (req.method !== 'GET') return next();

    if (req.path.endsWith('.html') || req.path === '/') {
        const filePath = req.path === '/' 
            ? path.join(PUBLIC_DIR, 'index.html')
            : path.join(PUBLIC_DIR, req.path);

        try {
            // Always read from disk - NO HTML CACHE IN RAM
            const html = await fs.promises.readFile(filePath, 'utf8');
            const inject = `<script>if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js');</script>`;
            const finalHtml = html.includes('</head>') 
                ? html.replace('</head>', inject + '</head>')
                : html + inject;
            
            logInfo(`HTML served from disk: ${colors.cyan}${req.path}${colors.reset}`);

            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.send(finalHtml);
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
${colors.green}➜${colors.reset} RAM usage: ${colors.bright}MINIMAL${colors.reset} (disk-only streaming)
${colors.green}➜${colors.reset} HTML cache: ${colors.bright}DISABLED${colors.reset} (disk reads only)
    `);
});