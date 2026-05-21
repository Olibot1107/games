const RESOURCE_KEY = 'games-shell-v1';
const BATCH_DELAY = 600; // Send batch if no new requests for 500ms
let pendingRequests = [];
let batchTimer = null;

// =======================
// LOGGING
// =======================
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Foreground colors
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

function log(category, message, ...args) {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
  const categories = {
    info: { color: colors.cyan, icon: 'ℹ' },
    success: { color: colors.green, icon: '✓' },
    warn: { color: colors.yellow, icon: '⚠' },
    error: { color: colors.red, icon: '✗' },
    batch: { color: colors.magenta, icon: '⚡' },
    fetch: { color: colors.blue, icon: '↓' },
    lifecycle: { color: colors.green, icon: '◆' },
  };
  
  const cat = categories[category] || categories.info;
  
  console.log(
    `${colors.gray}[${timestamp}]${colors.reset} ${cat.color}${cat.icon} [SW]${colors.reset} ${colors.bright}${message}${colors.reset}`,
    ...args
  );
}

// =======================
// UTILS
// =======================
function bytesFromBase64(base64) {
  const raw = atob(base64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    bytes[i] = raw.charCodeAt(i);
  }
  return bytes;
}

function xorBytes(bytes) {
  const keyBytes = new TextEncoder().encode(RESOURCE_KEY);
  const output = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    output[i] = bytes[i] ^ keyBytes[i % keyBytes.length];
  }
  return output;
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// =======================
// STREAM RESPONSE
// =======================
function streamResponse(bytes, contentType) {
  let offset = 0;
  const chunkSize = 64 * 1024;

  return new Response(new ReadableStream({
    start(controller) {
      function pushChunk() {
        if (offset >= bytes.length) {
          controller.close();
          return;
        }
        const end = Math.min(offset + chunkSize, bytes.length);
        const chunk = bytes.slice(offset, end);
        controller.enqueue(chunk);
        offset = end;
        setTimeout(pushChunk, 5);
      }
      pushChunk();
    }
  }), {
    headers: {
      'Content-Type': contentType,
      'Content-Length': bytes.length
    }
  });
}

// =======================
// BATCH REQUEST HANDLER
// =======================
function processBatch() {
  if (pendingRequests.length === 0) return;
  
  const batch = pendingRequests;
  pendingRequests = [];
  batchTimer = null;
  
  const batchId = Math.random().toString(36).slice(2, 8);
  log('batch', `Processing batch #${batchId}`, {
    requests: batch.length,
    paths: batch.map(r => r.path)
  });
  
  const paths = batch.map(req => req.path);
  const batchStart = performance.now();
  
  fetch('/api/resource', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paths })
  })
  .then(res => res.json())
  .then(data => {
    const batchTime = (performance.now() - batchStart).toFixed(0);
    log('success', `Batch #${batchId} complete in ${batchTime}ms`);
    
    data.files.forEach((fileData, idx) => {
      const req = batch[idx];
      
      if (fileData.error) {
        log('error', `Failed: ${req.path}`, fileData.error);
        req.reject(new Error(fileData.error));
        return;
      }
      
      try {
        const envelopeBytes = xorBytes(bytesFromBase64(fileData.payload));
        const envelope = JSON.parse(new TextDecoder().decode(envelopeBytes));
        const fileBytes = xorBytes(bytesFromBase64(envelope.payload));
        
        log('success', `Decoded: ${req.path}`, {
          size: formatBytes(fileBytes.length),
          type: envelope.contentType
        });
        
        req.resolve({
          bytes: fileBytes,
          contentType: envelope.contentType || 'application/octet-stream'
        });
      } catch (err) {
        log('error', `Decode failed: ${req.path}`, err.message);
        req.reject(err);
      }
    });
  })
  .catch(err => {
    log('error', `Batch #${batchId} failed`, err.message);
    batch.forEach(req => req.reject(err));
  });
}

function queueRequest(path, referrer) {
  log('info', `Queued: ${path}`, { 
    referrer,
    queueSize: pendingRequests.length + 1
  });
  
  return new Promise((resolve, reject) => {
    pendingRequests.push({ path, referrer, resolve, reject });
    
    // Clear existing timer and start fresh 500ms countdown
    if (batchTimer) {
      clearTimeout(batchTimer);
      log('info', 'Batch timer reset - new request arrived');
    }
    
    // Process batch if no new requests arrive within BATCH_DELAY
    batchTimer = setTimeout(() => {
      log('batch', `Batch delay elapsed (${BATCH_DELAY}ms idle) - sending now`);
      processBatch();
    }, BATCH_DELAY);
  });
}

// =======================
// FETCH FROM API (BATCHED)
// =======================
async function loadViaEndpoint(request, referrerPath) {
  const url = new URL(request.url);
  
  try {
    const cleanPath = url.pathname
      .split('/')
      .map(part => encodeURIComponent(part))
      .join('/');
    
    const { bytes: fileBytes, contentType } = await queueRequest(cleanPath, referrerPath);
    
    // Handle range requests
    const rangeHeader = request.headers.get('range');
    if (rangeHeader) {
      const match = /bytes=(\d+)-(\d*)/.exec(rangeHeader);
      if (match) {
        const start = parseInt(match[1], 10);
        const end = match[2] ? parseInt(match[2], 10) : fileBytes.length - 1;
        const chunk = fileBytes.slice(start, end + 1);
        
        log('fetch', `Range request: ${cleanPath}`, {
          range: `${start}-${end}`,
          size: formatBytes(chunk.length)
        });
        
        return new Response(chunk, {
          status: 206,
          headers: {
            'Content-Type': contentType,
            'Content-Range': `bytes ${start}-${end}/${fileBytes.length}`,
            'Accept-Ranges': 'bytes'
          }
        });
      }
    }
    
    log('fetch', `Streaming: ${cleanPath}`, {
      size: formatBytes(fileBytes.length),
      type: contentType
    });
    
    return streamResponse(fileBytes, contentType);
    
  } catch (err) {
    log('error', `Load failed: ${url.pathname}`, err.message);
    
    const status = err.message === 'not found' ? 404 : 500;
    return new Response(err.message, {
      status,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// =======================
// LIFECYCLE
// =======================
self.addEventListener('install', event => {
  log('lifecycle', 'Installing service worker');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  log('lifecycle', 'Service worker activated');
  event.waitUntil(self.clients.claim());
});

// =======================
// FETCH INTERCEPT
// =======================
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (url.hostname === 'html5.api.gamedistribution.com') {
    log('fetch', 'Blocked external request to', url.href);
    event.respondWith(new Response('Not found', { status: 404 }));
    return;
  }
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;
  if (url.pathname.startsWith('/math/')) return;
  if (url.pathname.includes('/client_status')) return;
  if (url.pathname.startsWith('/auth/postback/')) return;
  if (url.pathname.startsWith('/media/')) return;
  if (url.pathname === '/') return;
  
  event.respondWith((async () => {
    try {
      const client = event.clientId ? await self.clients.get(event.clientId) : null;
      const referrerPath = client ? new URL(client.url).pathname : '';
      return await loadViaEndpoint(request, referrerPath);
    } catch (err) {
      log('error', 'Service worker error', err);
      return new Response('Internal error', { status: 500 });
    }
  })());
});