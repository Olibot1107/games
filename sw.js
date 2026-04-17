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
  let apiRes;
  let apiBody;

  // =======================
  // DEBUG TRACKING
  // =======================
  let debug = {
    originalPath: url.pathname + url.search,
    encodedPath: null,
    referrer: referrerPath || '',
    stage: 'init',
    envelopeSize: 0,
    fileSize: 0
  };

  log('Fetching via API:', url.pathname);

  try {
    // =======================
    // ENCODE PATH
    // =======================
    const cleanPath = url.pathname
      .split('/')
      .map(part => encodeURIComponent(part))
      .join('/');

    debug.encodedPath = cleanPath;
    debug.stage = 'requesting_api';

    apiRes = await fetch('/api/resource', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path: cleanPath,
        referrer: referrerPath || ''
      })
    });

    log('API status:', apiRes.status);

    if (!apiRes.ok) {
      apiBody = await apiRes.json().catch(() => ({ error: 'Could not parse error response' }));
      log('API failed:', apiBody);

      return generateErrorPage(
        new Error(`API returned ${apiRes.status}`),
        url,
        { status: apiRes.status, body: apiBody, requestMethod: 'POST' },
        request,
        debug
      );
    }

    const data = await apiRes.json();
    apiBody = data;

    // =======================
    // DECODE ENVELOPE
    // =======================
    debug.stage = 'decoding_envelope';
    debug.envelopeSize = data.payload?.length || 0;

    const envelopeBytes = xorBytes(bytesFromBase64(data.payload));
    const envelope = JSON.parse(new TextDecoder().decode(envelopeBytes));

    log('Envelope:', envelope.contentType);

    // =======================
    // DECODE FILE
    // =======================
    const fileBytes = xorBytes(bytesFromBase64(envelope.payload));
    debug.stage = 'decoded_file';
    debug.fileSize = fileBytes.length;

    log('File size:', fileBytes.length);

    const contentType = envelope.contentType || 'application/octet-stream';

    // =======================
    // RANGE SUPPORT
    // =======================
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

    return streamResponse(fileBytes, contentType);

  } catch (err) {
    log('Decode error:', err);

    return generateErrorPage(
      err,
      url,
      {
        status: apiRes?.status,
        body: apiBody,
        requestMethod: 'POST'
      },
      request,
      debug
    );
  }
}
// =======================
// ERROR PAGE GENERATOR
// =======================
function generateErrorPage(error, url, apiResponse, request, debug) {
  const headers = {};
  if (request) {
    request.headers.forEach((v, k) => headers[k] = v);
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Load Failed - ${url.pathname}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', monospace;
      background: #1a1a1a;
      color: #00ff00;
      padding: 20px;
      line-height: 1.6;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: #0a0a0a;
      border: 2px solid #00ff00;
      padding: 20px;
    }
    h1 {
      color: #ff0000;
      border-bottom: 2px solid #ff0000;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    h2 {
      color: #ffff00;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    pre {
      background: #000;
      padding: 15px;
      overflow-x: auto;
      border-left: 3px solid #00ff00;
      margin: 10px 0;
    }
    .error { color: #ff0000; }
    .info { color: #00ffff; }
    .warn { color: #ffaa00; }
    .url { color: #ffff00; word-break: break-all; }
    button {
      background: #000;
      border: 1px solid #00ff00;
      color: #00ff00;
      padding: 10px;
      cursor: pointer;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>RESOURCE LOAD FAILED</h1>

    <h2>Requested URL:</h2>
    <pre class="url">${url.href}</pre>

    <h2>Original Path:</h2>
    <pre class="warn">${debug?.originalPath}</pre>

    <h2>Encoded Path (API):</h2>
    <pre class="warn">${debug?.encodedPath}</pre>

    <h2>Referrer:</h2>
    <pre class="info">${debug?.referrer || 'None'}</pre>

    <h2>Failure Stage:</h2>
    <pre class="warn">${debug?.stage}</pre>

    <h2>Error:</h2>
    <pre class="error">${error.message || error.toString()}</pre>

    <h2>Stack:</h2>
    <pre class="error">${error.stack || 'No stack trace available'}</pre>

    <h2>API Status:</h2>
    <pre class="info">${apiResponse?.status || 'N/A'}</pre>

    <h2>API Response:</h2>
    <pre>${apiResponse?.body ? JSON.stringify(apiResponse.body, null, 2) : 'No response body'}</pre>

    <h2>Request Headers:</h2>
    <pre>${JSON.stringify(headers, null, 2)}</pre>

    <h2>Payload Info:</h2>
    <pre class="info">
Envelope Size: ${debug?.envelopeSize} bytes
Decoded File Size: ${debug?.fileSize} bytes
    </pre>

    <h2>Environment:</h2>
    <pre class="info">
Timestamp: ${new Date().toISOString()}
SW Scope: ${self.registration.scope}
User Agent: ${navigator.userAgent}
RESOURCE_KEY: ${RESOURCE_KEY}
    </pre>

    <button onclick="location.reload()">Retry</button>
  </div>
</body>
</html>
  `;

  return new Response(html, {
    status: 500,
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
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

  // ✅ ONLY handle requests for THIS origin
  if (url.origin !== self.location.origin) {
    // External request → let browser handle normally
    return;
  }
  
  // skip API to avoid loop and client ot avoid problems
  if (url.pathname.startsWith('/api/')) return;
  if (url.pathname.startsWith('/math/')) return;
  if (url.pathname.includes('/client_status')) return;
  if (url.pathname.startsWith('/speed/')) return;
  if (url.pathname === '/') return; // ADD THIS - let Express handle root

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
