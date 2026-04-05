const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

const PUBLIC_DIR = path.join(__dirname, '');
const RESOURCE_KEY = 'games-shell-v1';
// Configure multer for file uploads


app.use(express.json({ limit: '10mb' }));
app.use(cookieParser()); // <-- MUST come before auth check
app.use(async (req, res, next) => {
    try {
        // Only log API requests (optional: remove if you want all)
        if (!req.path.startsWith('/api/resource')) return next();

        // Prepare pretty code block strings
        const queryString = Object.keys(req.query).length ? JSON.stringify(req.query, null, 2) : '{}';
        const bodyString = Object.keys(req.body || {}).length ? JSON.stringify(req.body, null, 2) : '{}';

        // Build payload for embed API
        const payload = {
            color: '#FFA500',
            fields: [
                { name: 'Method', value: `\`\`\`${req.method}\`\`\``, inline: true },
                { name: 'Path', value: `\`\`\`${req.path}\`\`\``, inline: true },
                { name: 'Query', value: `\`\`\`json\n${queryString}\n\`\`\``, inline: false },
                { name: 'Body', value: `\`\`\`json\n${bodyString}\n\`\`\``, inline: false },
                { name: 'IP', value: `\`\`\`${req.ip}\`\`\``, inline: true },
                { name: 'Timestamp', value: `\`\`\`${new Date().toISOString()}\`\`\``, inline: true }
            ]
        };

        // Send to embed API on localhost:4000
        await fetch('http://localhost:4000/send-embed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (err) {
        console.error('Failed to forward request to embed API:', err);
    }

    next(); // continue to next route/middleware
});

app.use((req, res, next) => {

    // Allow /auth.html and /math/* without cookie
    if (req.path.startsWith('/auth') || req.path.startsWith('/math')) return next();

    // Check cookie
    if (req.cookies && req.cookies.ok === 'true') return next();

    // Redirect if not authenticated
    return res.redirect('/math/index.html');
});
// =======================
// LOGGING FUNCTION
// =======================
function log(...args) {
  console.log('[SERVER]', ...args);
}

// =======================
// XOR (STREAM SAFE)
// =======================
function xorBuffer(buffer) {
  const key = Buffer.from(RESOURCE_KEY);
  const out = Buffer.allocUnsafe(buffer.length);

  for (let i = 0; i < buffer.length; i++) {
    out[i] = buffer[i] ^ key[i % key.length];
  }

  return out;
}

// =======================
// MIME TYPES (EXTENDED)
// =======================
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',

  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',

  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',

  '.mp4': 'video/mp4',
  '.webm': 'video/webm',

  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',

  // UNITY / WASM
  '.wasm': 'application/wasm',
  '.data': 'application/octet-stream',
  '.unityweb': 'application/octet-stream'
};

// =======================
// ENCODING DETECTION
// =======================
function getEncoding(filePath) {
  if (filePath.endsWith('.unityweb')) return 'gzip'; // sometimes 'br'
  return null;
}

// =======================
// API ROUTE (STREAM + RANGE + LOGGING)
// =======================
app.post('/api/resource', (req, res) => {
  const reqPath = req.body.path;
  log('API request for path:', reqPath);

  if (!reqPath || reqPath.includes('..')) {
    log('Invalid path request:', reqPath);
    return res.status(400).json({ error: 'invalid path' });
  }

  const fullPath = path.join(PUBLIC_DIR, reqPath);
  log('Full path resolved:', fullPath);

  if (!fs.existsSync(fullPath)) {
    log('File not found:', fullPath);
    return res.status(404).json({ error: 'not found' });
  }

  const stat = fs.statSync(fullPath);
  const ext = path.extname(fullPath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  const encoding = getEncoding(fullPath);

  // RANGE SUPPORT
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
      log(`Range requested: ${start}-${end}`);
    }
  }

  const stream = fs.createReadStream(fullPath, { start, end });
  let buffers = [];

  stream.on('data', chunk => {
    buffers.push(chunk);
    log(`Streaming chunk: ${chunk.length} bytes`);
  });

  stream.on('end', () => {
    log('File read complete, assembling buffer...');
    const fileBuffer = Buffer.concat(buffers);
    log('Buffer length:', fileBuffer.length);

    const encryptedFile = xorBuffer(fileBuffer).toString('base64');
    log('File encrypted and base64-encoded');

    const envelope = {
      contentType,
      contentEncoding: encoding,
      size: stat.size,
      start,
      end,
      payload: encryptedFile
    };

    const encryptedEnvelope = xorBuffer(
      Buffer.from(JSON.stringify(envelope))
    ).toString('base64');

    log('Envelope encrypted and ready to send');
    res.status(statusCode).json({
      payload: encryptedEnvelope
    });
  });

  stream.on('error', err => {
    log('Stream error:', err);
    res.status(500).json({ error: 'stream error' });
  });
});

// =======================
// HTML INJECTION + LOGGING
// =======================
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();

  if (req.path.endsWith('.html') || req.path === '/') {
    const filePath = req.path === '/'
      ? path.join(PUBLIC_DIR, 'index.html')
      : path.join(PUBLIC_DIR, req.path);

    log('HTML requested:', filePath);

    if (!fs.existsSync(filePath)) return next();

    let html = fs.readFileSync(filePath, 'utf8');
    const inject = `
<script>
console.log('[Client] Registering SW...');
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
</script>

`;
    html = html.includes('</head>')
      ? html.replace('</head>', inject + '</head>')
      : html + inject;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    log('Injected SW registration script');
    return res.send(html);
  }

  next();
});

// =======================
// STATIC FALLBACK + LOGGING
// =======================
app.use(express.static(PUBLIC_DIR, {
  setHeaders: (res, filePath) => {
    log('Serving static file:', filePath);
  }
}));

// =======================
app.listen(PORT, () => {
  log('Server running on http://localhost:' + PORT);
});