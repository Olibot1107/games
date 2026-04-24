const RESOURCE_KEY = 'games-shell-v1';
const BATCH_DELAY = 1000; // 100ms batch window
let pendingRequests = [];
let batchTimer = null;

// =======================
// LOGGING
// =======================
function log(...args) {
  console.log('[SW]', ...args);
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
  
  log(`Processing batch of ${batch.length} requests`);
  
  const paths = batch.map(req => req.path);
  
  fetch('/api/resource', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paths })
  })
  .then(res => res.json())
  .then(data => {
    data.files.forEach((fileData, idx) => {
      const req = batch[idx];
      
      if (fileData.error) {
        req.reject(new Error(fileData.error));
        return;
      }
      
      try {
        const envelopeBytes = xorBytes(bytesFromBase64(fileData.payload));
        const envelope = JSON.parse(new TextDecoder().decode(envelopeBytes));
        const fileBytes = xorBytes(bytesFromBase64(envelope.payload));
        
        req.resolve({
          bytes: fileBytes,
          contentType: envelope.contentType || 'application/octet-stream'
        });
      } catch (err) {
        req.reject(err);
      }
    });
  })
  .catch(err => {
    batch.forEach(req => req.reject(err));
  });
}

function queueRequest(path, referrer) {
  return new Promise((resolve, reject) => {
    pendingRequests.push({ path, referrer, resolve, reject });
    
    if (batchTimer) clearTimeout(batchTimer);
    batchTimer = setTimeout(processBatch, BATCH_DELAY);
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
    
    return streamResponse(fileBytes, contentType);
    
  } catch (err) {
    log('Load error:', err.message);
    
    // Return 404 for not found, 500 for other errors
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
  log('Installing');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  log('Activated');
  event.waitUntil(self.clients.claim());
});

// =======================
// FETCH INTERCEPT
// =======================
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;
  if (url.pathname.startsWith('/math/')) return;
  if (url.pathname.includes('/client_status')) return;
  if (url.pathname.startsWith('/speed/')) return;
  if (url.pathname.startsWith('/auth/postback/')) return;
  if (url.pathname === '/') return;
  
  event.respondWith((async () => {
    try {
      const client = event.clientId ? await self.clients.get(event.clientId) : null;
      const referrerPath = client ? new URL(client.url).pathname : '';
      return await loadViaEndpoint(request, referrerPath);
    } catch (err) {
      log('SW error:', err);
      return new Response('Internal error', { status: 500 });
    }
  })());
});