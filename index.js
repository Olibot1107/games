const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const os = require('os');

const app = express();
const PORT = 3004;
const RESOURCE_KEY = 'games-shell-v1';

// Logging colors
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
};

function colorStatus(status) {
  if (status >= 500) return colors.red + status + colors.reset;
  if (status >= 400) return colors.yellow + status + colors.reset;
  if (status >= 300) return colors.cyan + status + colors.reset;
  return colors.green + status + colors.reset;
}

// Logging middleware
app.use((req, res, next) => {
  if (req.url === '/ping') return next();

  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} ${colorStatus(res.statusCode)} ${duration}ms`);
  });

  next();
});

app.use((req, res, next) => {
  if (!req.url.startsWith("/good/gun_spin/")) return next();

  if (req.url.endsWith(".uwu")) {
    const filePath = path.join(__dirname, ".", req.url);

    try {
      const data = fs.readFileSync(filePath);

      // Set MIME types without using octet-stream
      if (req.url.includes(".wasm")) {
        res.type("application/wasm");
      } else if (req.url.includes(".js")) {
        res.type("application/javascript");
      } else {
        // For .data and any other files
        res.type("application/binary");
      }

      // If the file is gzipped, tell browser
      if (data.length >= 2 && data.readUInt16BE(0) === 0x1f8b) {
        res.setHeader("Content-Encoding", "gzip");
      }

      res.send(data);
    } catch (err) {
      console.error("Error serving file:", err);
      res.status(404).send("File not found");
    }
    return;
  }

  next();
});

// Handle requests coming from /projects/editor
app.use((req, res, next) => {
  const referer = req.get('Referer') || '';

  // Serve editor page
  if (req.url === '/projects/editor') {
    const editorHtmlPath = path.join(__dirname, 'projects', 'editor');
    if (fs.existsSync(editorHtmlPath)) {
      return res.type('html').sendFile(editorHtmlPath);
    } else {
      return res.status(404).send('Editor HTML not found');
    }
  }

  // Any request coming from the editor page
  if (referer.includes('/projects/editor')) {
    const filePath = path.join(__dirname, 'scratch', req.url.replace(/^\//, ''));
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return res.sendFile(filePath);
    } else {
      return res.status(404).send('<meta http-equiv="refresh" content="0">');
    }
  }

  next(); // all other requests handled normally
});

app.use(express.json({ limit: '64kb' }));

// Middleware to avoid octet-stream
app.use((req, res, next) => {
  const originalSetHeader = res.setHeader.bind(res);
  res.setHeader = function(name, value) {
    if (name === 'Content-Type' && value === 'application/octet-stream') {
      value = 'application/binary';
    }
    return originalSetHeader(name, value);
  };
  next();
});

// Serve other static files normally
app.use(express.static(path.join(__dirname, ''), {
  setHeaders: (res, filePath) => {
    const contentType = res.getHeader('Content-Type');
    if (contentType === 'application/octet-stream') {
      res.setHeader('Content-Type', 'application/binary');
    }
    if (!res.req.url.startsWith('/ping')) {
      console.log(`Sending ${filePath}`);
    }
  }
}));

app.get('/ping', (req, res) => {
  res.send('Pong!');
});

const BASE_URL = 'https://www.myinstants.com';

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.svg': return 'image/svg+xml';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.gif': return 'image/gif';
    case '.webp': return 'image/webp';
    case '.webm': return 'audio/webm';
    case '.ico': return 'image/x-icon';
    case '.wasm': return 'application/wasm';
    case '.mp3': return 'audio/mpeg';
    case '.ogg': return 'audio/ogg';
    case '.wav': return 'audio/wav';
    case '.mp4': return 'video/mp4';
    case '.txt': return 'text/plain; charset=utf-8';
    default: return 'application/octet-stream';
  }
}

function xorEncodeBuffer(buffer) {
  const key = Buffer.from(RESOURCE_KEY, 'utf8');
  const output = Buffer.alloc(buffer.length);

  for (let i = 0; i < buffer.length; i += 1) {
    output[i] = buffer[i] ^ key[i % key.length];
  }

  return output.toString('base64');
}

function xorEncode(value) {
  return xorEncodeBuffer(Buffer.from(JSON.stringify(value), 'utf8'));
}

function normalizeRequestPath(requestPath) {
  const normalized = requestPath.startsWith('/') ? requestPath : `/${requestPath}`;
  const withoutQuery = normalized.split('?')[0].split('#')[0];
  return withoutQuery === '/' ? '/index.html' : withoutQuery.endsWith('/') ? `${withoutQuery}index.html` : withoutQuery;
}

function resolveResourcePath(requestPath, referrerPath = '') {
  const adjusted = normalizeRequestPath(requestPath);
  const root = path.resolve(__dirname);
  const resolved = path.resolve(__dirname, `.${adjusted}`);

  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new Error('Invalid resource path');
  }

  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    if (referrerPath) {
      const referrerDir = path.posix.dirname(normalizeRequestPath(referrerPath));
      const relativeCandidate = path.resolve(__dirname, `.${path.posix.join(referrerDir, path.posix.basename(adjusted))}`);
      if (fs.existsSync(relativeCandidate) && fs.statSync(relativeCandidate).isFile()) {
        return relativeCandidate;
      }

      const aliasCandidates = [
        path.posix.join(referrerDir, 'main.js'),
        path.posix.join(referrerDir, 'index.js'),
        path.posix.join(referrerDir, 'webapp', 'index.js'),
        path.posix.join(referrerDir, 'webapp', 'source_min.js'),
        path.posix.join(referrerDir, 'scripts', 'main.js'),
        path.posix.join(referrerDir, 'scripts', 'index.js'),
        path.posix.join(referrerDir, 'Jump_Gamemonetize.js'),
      ];

      for (const alias of aliasCandidates) {
        const aliasResolved = path.resolve(__dirname, `.${alias}`);
        if (fs.existsSync(aliasResolved) && fs.statSync(aliasResolved).isFile()) {
          return aliasResolved;
        }
      }
    }
    throw new Error(`File not found: ${adjusted}`);
  }

  return resolved;
}

function loadFileResource(requestPath, referrerPath) {
  const filePath = resolveResourcePath(requestPath, referrerPath);
  const data = fs.readFileSync(filePath);
  return {
    contentType: getContentType(filePath),
    payload: xorEncodeBuffer(data),
  };
}

async function loadSounds({ search, page } = {}) {
  let url = `${BASE_URL}/api/v1/instants/?format=json&page=${page || 1}`;
  if (search && search.length >= 2) {
    url += `&name=${encodeURIComponent(search)}`;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Sounds fetch failed with HTTP ${response.status}`);

  const data = await response.json();

  return {
    count: data.count,
    next: data.next,
    previous: data.previous,
    results: (data.results || []).map(s => ({
      name: s.name,
      mp3: s.sound,
      slug: s.slug,
      color: s.color,
      image: s.image,
      description: s.description,
    })),
  };
}

async function loadResource(type, params = {}) {
  switch (type) {
    case 'games': {
      const filePath = path.join(__dirname, 'games.json');
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    case 'file':
    case 'path':
      return loadFileResource(params.path || params.filePath || '/index.html', params.referrer || params.referrerPath || '');
    case 'sounds':
      return loadSounds(params);
    case 'stats': {
      const totalMem = os.totalmem();
      const usedMem = totalMem - os.freemem();
      const cpuLoad = os.loadavg()[0] || 0;
      return {
        cpu: Math.min(100, Math.round(cpuLoad * 25)),
        ram: Math.min(100, Math.round((usedMem / totalMem) * 100)),
        net_sent: 0,
        net_recv: 0,
        uptime_seconds: Math.floor(process.uptime()),
        fallback: true,
      };
    }
    case 'commits': {
      const response = await fetch('https://api.github.com/repos/Olibot1107/games/commits', {
        headers: {
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'games-site',
        },
      });
      if (!response.ok) throw new Error(`GitHub fetch failed with HTTP ${response.status}`);
      return response.json();
    }
    default:
      throw new Error(`Unsupported resource type: ${type}`);
  }
}

app.post('/api/resource', async (req, res) => {
  try {
    const { type } = req.body || {};

    if (typeof type !== 'string' || !type.trim()) {
      return res.status(400).json({ error: 'Missing resource type' });
    }

    const data = await loadResource(type.trim(), req.body || {});
    res.json({
      type: type.trim(),
      encoding: 'xor-base64',
      ...(data && typeof data === 'object' && data.contentType ? { contentType: data.contentType } : {}),
      payload: xorEncode(data),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to load resource' });
  }
});

// Get all sounds (optionally filtered by search)
// Get all sounds (optionally filtered by search)
app.get('/sounds', async (req, res) => {
  try {
    const data = await loadSounds({ search: req.query.search, page: req.query.page });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch sounds' });
  }
});


app.get('/media/sounds/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const url = `https://www.myinstants.com/media/sounds/${filename}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${filename}`);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch MP3' });
  }
});
app.get('/media/images/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const url = `https://www.myinstants.com/media/instants_images/${filename}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${filename}`);

    // Convert to buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Set headers and send
    res.setHeader('Content-Type', 'image/png'); // change dynamically if needed
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.send(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

const DROPBOX_URL = 'https://www.dropbox.com/scl/fi/r9pwae9dv7kk3znqwhg0l/9999-MG-Joined-by-HappyScribe.mp3?rlkey=iqd7zyrv14032to2hjtpdt3qd&e=1&st=w7l2crxa&dl=1';

function streamDropboxFile(url, res) {
  https.get(url, (dropboxRes) => {
    // Handle 302 redirect
    if (dropboxRes.statusCode >= 300 && dropboxRes.statusCode < 400 && dropboxRes.headers.location) {
      return streamDropboxFile(dropboxRes.headers.location, res);
    }

    // Stream audio
    res.setHeader('Content-Type', 'audio/mpeg');
    dropboxRes.pipe(res);
  }).on('error', (err) => {
    console.error(err);
    res.status(500).send('Failed to load audio');
  });
}

app.get('/phonk', (req, res) => {
  streamDropboxFile(DROPBOX_URL, res);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
