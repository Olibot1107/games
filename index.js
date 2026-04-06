const express = require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const app = express();
const PORT = 3000;

const PUBLIC_DIR = path.join(__dirname, '');
const CACHE_DIR = path.join(__dirname, 'pre_cache');

// PROPER ENCRYPTION SETUP
const MASTER_KEY = crypto.scryptSync('your-secure-password-here-change-this', 'salt', 32); // Derive 256-bit key
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 128-bit IV
const TAG_LENGTH = 16; // 128-bit auth tag
const KEY_LENGTH = 32; // 256-bit key

// ANSI Color codes
const colors = {
    reset: '\x1b[0m', bright: '\x1b[1m', red: '\x1b[31m', green: '\x1b[32m',
    yellow: '\x1b[33m', blue: '\x1b[34m', magenta: '\x1b[35m', cyan: '\x1b[36m',
    white: '\x1b[37m', bgRed: '\x1b[41m', bgGreen: '\x1b[42m', bgYellow: '\x1b[43m', bgBlue: '\x1b[44m'
};

function log(msg, color = 'white') { console.log(`${colors[color]}[SERVER]${colors.reset}`, msg); }
function logCache(hit, file) {
    if (hit) console.log(`${colors.bgGreen}${colors.bright} CACHE HIT ${colors.reset} ${colors.green}${file}${colors.reset}`);
    else console.log(`${colors.bgYellow}${colors.bright} CACHE MISS ${colors.reset} ${colors.yellow}${file}${colors.reset}`);
}
function logError(msg) { console.log(`${colors.bgRed}${colors.bright} ERROR ${colors.reset} ${colors.red}${msg}${colors.reset}`); }
function logInfo(msg) { console.log(`${colors.cyan}[INFO]${colors.reset} ${msg}`); }
function logSuccess(msg) { console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`); }

if (!fs.existsSync(CACHE_DIR)) { fs.mkdirSync(CACHE_DIR, { recursive: true }); logSuccess('Created pre_cache directory'); }

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

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

// PROPER AES-256-GCM ENCRYPTION
function encryptBuffer(buffer) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, MASTER_KEY, iv);
    
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    const tag = cipher.getAuthTag();
    
    // Format: IV (16) + TAG (16) + ENCRYPTED_DATA
    return Buffer.concat([iv, tag, encrypted]);
}

function decryptBuffer(buffer) {
    const iv = buffer.slice(0, IV_LENGTH);
    const tag = buffer.slice(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const encrypted = buffer.slice(IV_LENGTH + TAG_LENGTH);
    
    const decipher = crypto.createDecipheriv(ALGORITHM, MASTER_KEY, iv);
    decipher.setAuthTag(tag);
    
    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}

const mimeTypes = {
    '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
    '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4',
    '.wasm': 'application/wasm', '.unityweb': 'application/octet-stream'
};

function getCacheFilename(filePath) {
    const hash = crypto.createHash('sha256').update(filePath).digest('hex');
    return path.join(CACHE_DIR, hash + '.enc'); // .enc for encrypted
}

async function isCacheValid(originalPath, cachePath) {
    try {
        const [originalStat, cacheStat] = await Promise.all([
            fs.promises.stat(originalPath),
            fs.promises.stat(cachePath)
        ]);
        return originalStat.mtime <= cacheStat.mtime;
    } catch { return false; }
}

let cacheStats = { hits: 0, misses: 0, saves: 0 };

// STREAM ENCRYPT to disk - AES-256-GCM
async function streamEncryptFileToFile(sourcePath, destPath, filePathForLog) {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(sourcePath, { highWaterMark: 64 * 1024 });
        const writeStream = fs.createWriteStream(destPath);
        
        // Generate random IV
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, MASTER_KEY, iv);
        
        let totalBytes = 0;
        const startTime = Date.now();
        
        // Write IV first
        writeStream.write(iv);
        
        cipher.on('data', (chunk) => writeStream.write(chunk));
        cipher.on('end', () => {
            const tag = cipher.getAuthTag();
            writeStream.write(tag); // Append auth tag at end
            writeStream.end();
        });
        
        readStream.on('data', (chunk) => {
            totalBytes += chunk.length;
            cipher.write(chunk);
        });
        
        readStream.on('end', () => cipher.end());
        
        readStream.on('error', reject);
        cipher.on('error', reject);
        writeStream.on('finish', () => {
            const elapsed = Date.now() - startTime;
            logInfo(`Encrypted ${colors.cyan}${(totalBytes/1024).toFixed(2)}KB${colors.reset} to disk in ${colors.green}${elapsed}ms${colors.reset} for ${colors.yellow}${filePathForLog}${colors.reset}`);
            resolve();
        });
        writeStream.on('error', reject);
        
        // Pipe manually to handle auth tag
        readStream.pipe(cipher, { end: true });
    });
}

// STREAM DECRYPT from disk to response - AES-256-GCM
async function streamDecryptToResponse(sourcePath, res, filePathForLog, envelopeMeta) {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(sourcePath, { highWaterMark: 64 * 1024 });
        
        let headerBuffer = Buffer.alloc(0);
        let decipher = null;
        let chunks = [];
        let totalBytes = 0;
        let headerParsed = false;
        const startTime = Date.now();
        
        readStream.on('data', (chunk) => {
            if (!headerParsed) {
                headerBuffer = Buffer.concat([headerBuffer, chunk]);
                
                // Wait until we have IV + TAG (32 bytes)
                if (headerBuffer.length >= IV_LENGTH + TAG_LENGTH) {
                    const iv = headerBuffer.slice(0, IV_LENGTH);
                    const tag = headerBuffer.slice(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
                    const remaining = headerBuffer.slice(IV_LENGTH + TAG_LENGTH);
                    
                    decipher = crypto.createDecipheriv(ALGORITHM, MASTER_KEY, iv);
                    decipher.setAuthTag(tag);
                    
                    // Process remaining data
                    if (remaining.length > 0) {
                        const decrypted = decipher.update(remaining);
                        chunks.push(decrypted.toString('base64'));
                        totalBytes += decrypted.length;
                    }
                    
                    headerParsed = true;
                }
            } else {
                const decrypted = decipher.update(chunk);
                chunks.push(decrypted.toString('base64'));
                totalBytes += decrypted.length;
            }
        });
        
        readStream.on('end', () => {
            if (!headerParsed) {
                reject(new Error('File too small/invalid'));
                return;
            }
            
            const final = decipher.final();
            if (final.length > 0) {
                chunks.push(final.toString('base64'));
                totalBytes += final.length;
            }
            
            const payload = chunks.join('');
            const elapsed = Date.now() - startTime;
            logInfo(`Decrypted ${colors.cyan}${(totalBytes/1024).toFixed(2)}KB${colors.reset} to response in ${colors.green}${elapsed}ms${colors.reset} for ${colors.yellow}${filePathForLog}${colors.reset}`);
            
            const envelope = { ...envelopeMeta, payload };
            const envelopeBuf = Buffer.from(JSON.stringify(envelope));
            const encryptedEnvelope = encryptBuffer(envelopeBuf);
            
            res.json({ payload: encryptedEnvelope.toString('base64') });
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

        const range = req.headers.range;
        let start = 0, end = fileSize - 1, statusCode = 200;

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
            size: fileSize, start, end
        };

        const startTime = Date.now();
        
        if (await isCacheValid(fullPath, cacheFile)) {
            cacheStats.hits++;
            logCache(true, reqPath);
            await streamDecryptToResponse(cacheFile, res, reqPath, envelopeMeta);
            const totalElapsed = Date.now() - startTime;
            logInfo(`Total request time: ${colors.green}${totalElapsed}ms${colors.reset}`);
            return;
        }

        cacheStats.misses++;
        logCache(false, reqPath);
        logInfo(`Creating encrypted disk cache for ${colors.yellow}${reqPath}${colors.reset} (${colors.cyan}${(fileSize/1024).toFixed(2)}KB${colors.reset})...`);
        
        await streamEncryptFileToFile(fullPath, cacheFile, reqPath);
        
        cacheStats.saves++;
        logSuccess(`Encrypted cache created: ${colors.green}${reqPath}${colors.reset}`);
        logInfo(`Cache stats - Hits: ${colors.green}${cacheStats.hits}${colors.reset} | Misses: ${colors.yellow}${cacheStats.misses}${colors.reset} | Saves: ${colors.cyan}${cacheStats.saves}${colors.reset}`);
        
        await streamDecryptToResponse(cacheFile, res, reqPath, envelopeMeta);
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

app.use(async (req, res, next) => {
    if (req.method !== 'GET') return next();
    if (!req.path.endsWith('.html') && req.path !== '/') return next();

    const filePath = req.path === '/' 
        ? path.join(PUBLIC_DIR, 'index.html')
        : path.join(PUBLIC_DIR, req.path);

    try {
        const html = await fs.promises.readFile(filePath, 'utf8');
        const inject = `<script>if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js');</script>`;
        const finalHtml = html.includes('</head>') 
            ? html.replace('</head>', inject + '</head>')
            : html + inject;
        logInfo(`HTML served from disk: ${colors.cyan}${req.path}${colors.reset}`);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(finalHtml);
    } catch { return next(); }
});

app.use(express.static(PUBLIC_DIR));

app.listen(PORT, () => {
    console.log(`
${colors.bright}${colors.cyan}╔══════════════════════════════════════╗
║     SERVER STARTED SUCCESSFULLY      ║
╚══════════════════════════════════════╝${colors.reset}
${colors.green}➜${colors.reset} Running on: ${colors.bright}http://localhost:${PORT}${colors.reset}
${colors.green}➜${colors.reset} Encryption: ${colors.bright}AES-256-GCM${colors.reset} (authenticated)
${colors.green}➜${colors.reset} Key: ${colors.bright}256-bit${colors.reset} (scrypt derived)
${colors.green}➜${colors.reset} IV: ${colors.bright}Random 128-bit${colors.reset} per encryption
${colors.green}➜${colors.reset} RAM usage: ${colors.bright}MINIMAL${colors.reset} (streaming)
    `);
});