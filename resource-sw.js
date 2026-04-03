const RESOURCE_KEY = 'games-shell-v1';

function bytesFromBase64(base64) {
  const raw = atob(base64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) {
    bytes[i] = raw.charCodeAt(i);
  }
  return bytes;
}

function xorBytes(bytes) {
  const keyBytes = new TextEncoder().encode(RESOURCE_KEY);
  const output = new Uint8Array(bytes.length);

  for (let i = 0; i < bytes.length; i += 1) {
    output[i] = bytes[i] ^ keyBytes[i % keyBytes.length];
  }

  return output;
}

async function loadViaEndpoint(pathname, referrerPath) {
  const response = await fetch('/api/resource', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'file', path: pathname, referrer: referrerPath || '' }),
  });

  if (!response.ok) {
    return response;
  }

  const data = await response.json();
  const envelope = JSON.parse(new TextDecoder().decode(xorBytes(bytesFromBase64(data.payload))));
  const fileBytes = xorBytes(bytesFromBase64(envelope.payload));

  if ((envelope.contentType || '').startsWith('text/') ||
      envelope.contentType === 'application/javascript; charset=utf-8' ||
      envelope.contentType === 'application/json; charset=utf-8' ||
      envelope.contentType === 'image/svg+xml') {
    return new Response(new TextDecoder().decode(fileBytes), {
      status: 200,
      headers: {
        'Content-Type': envelope.contentType || 'text/plain; charset=utf-8',
      },
    });
  }

  return new Response(fileBytes, {
    status: 200,
    headers: {
      'Content-Type': envelope.contentType || 'application/octet-stream',
    },
  });
}

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;
  if (request.method !== 'GET') return;
  if (request.mode === 'navigate') return;
  if ((url.pathname.endsWith('.html') || url.pathname.endsWith('.htm')) && request.destination !== 'document' && request.destination !== 'iframe') return;
  if (url.pathname === '/api/resource' || url.pathname.startsWith('/api/') || url.pathname.startsWith('/sounds') || url.pathname.startsWith('/media/') || url.pathname.startsWith('/phonk') || url.pathname.startsWith('/ping') || url.pathname.startsWith('/projects/editor')) return;

  event.respondWith((async () => {
    const client = event.clientId ? await self.clients.get(event.clientId) : null;
    const referrerPath = client ? new URL(client.url).pathname : '';
    return loadViaEndpoint(url.pathname + url.search, referrerPath);
  })());
});
