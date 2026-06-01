const express = require('express');
const health = require('express-ping');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');

const {
    PUBLIC_DIR,
    DATA_FILE,
    RESOURCE_KEY,
    MEDIA_CACHE_DIR,
    colors,
    logError,
    logInfo,
    logSuccess,
    readData,
    writeData,
} = require('./server/data');
const { registerMediaRoutes } = require('./server/mediaRoutes');
const { registerResourceRoutes, setupMathRepo } = require('./server/resourceRoutes');
const { registerSocialRoutes } = require('./server/socialRoutes');

const app = express();
const PORT = 3000;
const DEBUG = process.env.DEBUG === 'true'; // run with: DEBUG=true node index.js
// ====== XOR-encrypted Soundboard data endpoint ======
const SOUNDS_DATA_KEY = Buffer.from('soundboard-key-v1');

function xorBuffer(buffer) {
    const out = Buffer.allocUnsafe(buffer.length);
    const keyLen = SOUNDS_DATA_KEY.length;
    let i = 0;
    while (i < buffer.length - 15) {
        out[i]     = buffer[i]     ^ SOUNDS_DATA_KEY[i % keyLen];
        out[i + 1] = buffer[i + 1] ^ SOUNDS_DATA_KEY[(i + 1) % keyLen];
        out[i + 2] = buffer[i + 2] ^ SOUNDS_DATA_KEY[(i + 2) % keyLen];
        out[i + 3] = buffer[i + 3] ^ SOUNDS_DATA_KEY[(i + 3) % keyLen];
        out[i + 4] = buffer[i + 4] ^ SOUNDS_DATA_KEY[(i + 4) % keyLen];
        out[i + 5] = buffer[i + 5] ^ SOUNDS_DATA_KEY[(i + 5) % keyLen];
        out[i + 6] = buffer[i + 6] ^ SOUNDS_DATA_KEY[(i + 6) % keyLen];
        out[i + 7] = buffer[i + 7] ^ SOUNDS_DATA_KEY[(i + 7) % keyLen];
        out[i + 8] = buffer[i + 8] ^ SOUNDS_DATA_KEY[(i + 8) % keyLen];
        out[i + 9] = buffer[i + 9] ^ SOUNDS_DATA_KEY[(i + 9) % keyLen];
        out[i + 10]= buffer[i + 10]^ SOUNDS_DATA_KEY[(i +10) % keyLen];
        out[i + 11]= buffer[i + 11]^ SOUNDS_DATA_KEY[(i +11) % keyLen];
        out[i + 12]= buffer[i + 12]^ SOUNDS_DATA_KEY[(i +12) % keyLen];
        out[i + 13]= buffer[i + 13]^ SOUNDS_DATA_KEY[(i +13) % keyLen];
        out[i + 14]= buffer[i + 14]^ SOUNDS_DATA_KEY[(i +14) % keyLen];
        out[i + 15]= buffer[i + 15]^ SOUNDS_DATA_KEY[(i +15) % keyLen];
        i += 16;
    }
    while (i < buffer.length) {
        out[i] = buffer[i] ^ SOUNDS_DATA_KEY[i % keyLen];
        i++;
    }
    return out;
}

/** XOR-encode a plain JSON string (same key on both sides → XOR === decryption). */
function xorEncode(unencodedJson) {
    return xorBuffer(Buffer.from(unencodedJson)).toString('base64');
}

const SOUNDS_PAGE_SIZE = 8;

function getAllSounds() {
    try {
        const data = JSON.parse(fs.readFileSync('sounds.json', 'utf8'));
        return data.sounds || (Array.isArray(data) ? data : []);
    } catch {
        return [];
    }
}

/** GET /media/sounds — returns XOR-encoded sound list (encrypted in transit). */
app.get('/media/sounds', async (req, res) => {
    try {
        const search = (req.query.search  || '').trim().toLowerCase();
        const page   = parseInt(req.query.page || '1', 10)  || 1;

        let sounds = getAllSounds();

        // Client asks for "unencrypted" count/results at the wrapper level;
        // individual sound objects inside `results` are XOR-encoded by the client.
        const allCount = sounds.length;

        // Filter by search query (min 2 chars)
        let filtered = sounds;
        if (search.length >= 2) {
            filtered = sounds.filter(s =>
                String(s.name  || '').toLowerCase().includes(search) ||
                String(s.description || '').toLowerCase().includes(search)
            );
        }

        const total  = filtered.length;
        const offset = (page - 1) * SOUNDS_PAGE_SIZE;
        const pageData = filtered.slice(offset, offset + SOUNDS_PAGE_SIZE);

        // ---- XOR-encode every sound object individually ----------------
        // This follows the same pattern as /api/resource (XOR at rest / in transit).
        // The client in sound.html ships with the matching xorBuffer (same key).
        const encoded = pageData.map(s => xorEncode(JSON.stringify(s)));

        const body = JSON.stringify({ count: total, results: encoded });
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.set('Content-Length', Buffer.byteLength(body));
        res.send(body);
    } catch (err) {
        console.error('Soundboard error:', err);
        res.status(500).json({ error: 'Failed to fetch sounds' });
    }
});

/** Map remote URL → cache file path for media files (sounds + images). */
const MEDIA_CACHE = new Map();

function getCachePath(filename) {
    return path.join(MEDIA_CACHE_DIR, filename);
}

async function ensureCached(filename, remoteUrl, contentType) {
    const cachedPath = getCachePath(filename);

    // Hit from local cache — fast path
    if (fs.existsSync(cachedPath)) {
        return cachedPath;
    }

    // Fetch from remote and write to cache
    let response;
    try {
        response = await fetch(remoteUrl);
    } catch (err) {
        throw new Error(`Network error fetching ${filename}: ${err.message}`);
    }

    if (!response.ok) {
        throw new Error(`Remote ${response.status} for ${filename} at ${remoteUrl}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(cachedPath, buffer);
    return cachedPath;
}

app.get('/media/sounds/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const remoteUrl = `https://www.myinstants.com/media/sounds/${filename}`;
    const cachedPath = await ensureCached(filename, remoteUrl, 'audio/mpeg');

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.sendFile(cachedPath);
  } catch (err) {
    console.error('Failed to serve sound:', err.message);
    res.status(502).send('Sound not available');
  }
});
app.get('/media/images/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const ext = path.extname(filename).toLowerCase();
    const mimeType = ({
      '.png':  'image/png',
      '.jpg':  'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif':  'image/gif',
      '.webp': 'image/webp',
    })[ext] || 'image/png';

    const remoteUrl = `https://www.myinstants.com/media/instants_images/${filename}`;
    const cachedPath = await ensureCached(filename, remoteUrl, mimeType);

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.sendFile(cachedPath);
  } catch (err) {
    console.error('Failed to serve image:', err.message);
    res.status(502).send('Image not available');
  }
});

app.use(express.raw({ type: ['application/json', 'application/vnd.api+json', 'text/plain'], limit: '90mb' }));
app.use(cookieParser());
app.use(health.ping('/api/ping'));

app.use((req, res, next) => {
    if (!DEBUG) return next();

    try {
        const bodyPreview = req.body
            ? (Buffer.isBuffer(req.body)
                ? req.body.toString().slice(0, 500)
                : JSON.stringify(req.body).slice(0, 500))
            : null;

        console.log(`
${colors.bgBlue}${colors.bright} DEBUG REQUEST ${colors.reset}
${colors.cyan}Time:${colors.reset} ${new Date().toISOString()}
${colors.cyan}Method:${colors.reset} ${req.method}
${colors.cyan}URL:${colors.reset} ${req.originalUrl}
${colors.cyan}IP:${colors.reset} ${req.ip}

${colors.magenta}Headers:${colors.reset}
${JSON.stringify(req.headers, null, 2)}

${colors.yellow}Query:${colors.reset}
${JSON.stringify(req.query, null, 2)}

${colors.green}Cookies:${colors.reset}
${JSON.stringify(req.cookies, null, 2)}

${colors.white}Body (preview):${colors.reset}
${bodyPreview}
        `);
    } catch (err) {
        logError('Debug logging failed: ' + err.message);
    }

    next();
});

app.use((req, res, next) => {
    res.on('finish', () => {
        try {
            const data = readData();
            const length = parseInt(res.get('Content-Length')) || 0;
            if (length > 0) {
                data.totalBytes += length;
            }
            const resourceCount = parseInt(res.get('X-Resource-Count')) || 1;
            data.totalRequests += resourceCount;
            writeData(data);
        } catch (e) {
            // ignore
        }
    });
    next();
});

app.use((req, res, next) => {
    if (req.path.startsWith('/api/') ||  req.path.startsWith('/math') || req.path.startsWith('/uploads')) return next();
    if (req.cookies?.ok === 'true') return next();
    return res.redirect('/math/index.html');
});

registerResourceRoutes(app);
registerMediaRoutes(app);
registerSocialRoutes(app);

app.use(async (req, res, next) => {
    if (req.method !== 'GET') return next();

    if (req.path.endsWith('.html') || req.path === '/') {
        const filePath = req.path === '/'
            ? path.join(PUBLIC_DIR, 'index.html')
            : path.join(PUBLIC_DIR, req.path);

        try {
            let html = await fs.promises.readFile(filePath, 'utf8');
            const inject = `<script>if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js');</script>`;
            html = html.includes('</head>')
                ? html.replace('</head>', inject + '</head>')
                : html + inject;

            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.send(html);
        } catch {
            return next();
        }
    }
    next();
});

app.use(async (req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/api/') || req.path === '/') return next();

    const directPath = path.resolve(PUBLIC_DIR, '.' + req.path);
    try {
        await fs.promises.access(directPath, fs.constants.F_OK);
        return next();
    } catch {
        const rootPath = path.resolve(PUBLIC_DIR, 'root', req.path.replace(/^\/+/, ''));
        try {
            await fs.promises.access(rootPath, fs.constants.F_OK);
            return res.sendFile(rootPath);
        } catch {
            return next();
        }
    }
});

app.use(express.static(PUBLIC_DIR));

app.listen(PORT, () => {
    console.log(`${colors.cyan}${colors.bright}
╭────────────────────────────────────────╮
│          SERVER STATUS PANEL           │
├────────────────────────────────────────┤
│  Status :  ONLINE                      │
│  URL    :  http://localhost:${PORT}       │
│  Key    :  ${RESOURCE_KEY.toString()}              │
╰────────────────────────────────────────╯
${colors.reset}`);

    setupMathRepo();
});
