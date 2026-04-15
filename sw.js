const RESOURCE_KEY = 'games-shell-v1';

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
// STREAM RESPONSE (FAKE PROGRESS)
// =======================
function streamResponse(bytes, contentType) {
  log('Starting stream of', bytes.length, 'bytes');

  let offset = 0;
  const chunkSize = 64 * 1024; // 64KB chunks

  return new Response(new ReadableStream({
    start(controller) {
      function pushChunk() {
        if (offset >= bytes.length) {
          log('Stream complete');
          controller.close();
          return;
        }

        const end = Math.min(offset + chunkSize, bytes.length);
        const chunk = bytes.slice(offset, end);

        controller.enqueue(chunk);

        offset = end;

        log(`Stream progress: ${offset}/${bytes.length}`);

        // simulate network delay for visible progress
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
// FETCH FROM API
// =======================
async function loadViaEndpoint(request, referrerPath) {
  const url = new URL(request.url);

  log('Fetching via API:', url.pathname);

  const apiRes = await fetch('/api/resource', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      path: url.pathname + url.search,
      referrer: referrerPath || ''
    })
  });

  log('API status:', apiRes.status);

  if (!apiRes.ok) {
    log('API failed, fallback');
    return fetch(request);
  }

  const data = await apiRes.json();

  try {
    log('Decoding envelope');

    const envelopeBytes = xorBytes(bytesFromBase64(data.payload));
    const envelope = JSON.parse(new TextDecoder().decode(envelopeBytes));

    log('Envelope:', envelope.contentType);

    const fileBytes = xorBytes(bytesFromBase64(envelope.payload));

    log('File size:', fileBytes.length);

    const contentType = envelope.contentType || 'application/octet-stream';

    // RANGE SUPPORT
    const rangeHeader = request.headers.get('range');
    if (rangeHeader) {
      log('Range request:', rangeHeader);

      const match = /bytes=(\d+)-(\d*)/.exec(rangeHeader);
      if (match) {
        const start = parseInt(match[1], 10);
        const end = match[2] ? parseInt(match[2], 10) : fileBytes.length - 1;

        const chunk = fileBytes.slice(start, end + 1);

        log(`Serving range ${start}-${end}`);

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

    // STREAM EVERYTHING (this is the key change)
    return streamResponse(fileBytes, contentType);

  } catch (err) {
    log('Decode error:', err);
    return fetch(request);
  }
}

// =======================
// LIFECYCLE
// =======================
self.addEventListener('install', event => {
  log('Service Worker installing');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  log('Service Worker activated');
  event.waitUntil(self.clients.claim());
});

// =======================
// FETCH INTERCEPT (ALL REQUESTS)
// =======================
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  log('Intercept:', request.method, url.pathname);

  // skip API to avoid loop and client ot avoid problems
  if (url.pathname.startsWith('/api/')) return;
  if (url.pathname.startsWith('/math/')) return;
  if (url.pathname.includes('/client_status')) return;
  if (url.pathname.startsWith('/sounds/')) return;

  event.respondWith((async () => {
    try {
      const client = event.clientId
        ? await self.clients.get(event.clientId)
        : null;

      const referrerPath = client
        ? new URL(client.url).pathname
        : '';

      return await loadViaEndpoint(request, referrerPath);

    } catch (err) {
      log('SW error:', err);
      return fetch(request);
    }
  })());
});