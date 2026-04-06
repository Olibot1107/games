const BASE_KEY = 'games-shell-v1';

// Randomized endpoints matching server
const ENDPOINTS = [
    '/api/resource',
    '/cdn/assets/v2/data',
    '/static/cache/fetch',
    '/api/analytics/collect',
    '/webhooks/track/event'
];

function log(...args) {
    console.log('[SW]', ...args);
}

// ============================================
// CRYPTO UTILITIES
// ============================================

async function generateSessionKey(uid, timestamp) {
    const base = BASE_KEY;
    const salt = `${uid}-${Math.floor(timestamp / 60000)}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(base + salt);
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return new Uint8Array(hashBuffer);
}

function bytesFromBase64(base64) {
    const raw = atob(base64);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
        bytes[i] = raw.charCodeAt(i);
    }
    return bytes;
}

function xorBytes(bytes, key) {
    const output = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
        output[i] = bytes[i] ^ key[i % key.length];
    }
    return output;
}

// AES-256-CTR decryption
async function aesDecrypt(encryptedData, key) {
    // First 16 bytes are IV
    const iv = encryptedData.slice(0, 16);
    const ciphertext = encryptedData.slice(16);
    
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'AES-CTR' },
        false,
        ['decrypt']
    );
    
    const decrypted = await crypto.subtle.decrypt(
        {
            name: 'AES-CTR',
            counter: iv,
            length: 128
        },
        cryptoKey,
        ciphertext
    );
    
    return new Uint8Array(decrypted);
}

// Multi-layer decryption (reverse of server)
async function multiLayerDecrypt(buffer, sessionKey) {
    // Layer 2: AES-256-CTR
    const aesDecrypted = await aesDecrypt(buffer, sessionKey);
    
    // Layer 1: XOR
    const xorDecrypted = xorBytes(aesDecrypted, sessionKey);
    
    return xorDecrypted;
}

// Remove noise padding
function stripNoisePadding(buffer) {
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    const actualSize = view.getUint32(0, false);
    return buffer.slice(4, 4 + actualSize);
}

// ============================================
// STREAM RESPONSE
// ============================================
function streamResponse(bytes, contentType) {
    log('Starting stream of', bytes.length, 'bytes');

    let offset = 0;
    const chunkSize = 64 * 1024;

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

// ============================================
// GET UID FROM COOKIE
// ============================================
function getUidFromCookie() {
    const cookies = self.cookieStore 
        ? self.cookieStore.get('uid') 
        : document.cookie.split(';').find(c => c.trim().startsWith('uid='));
    
    if (cookies) {
        return typeof cookies === 'string' 
            ? cookies.split('=')[1] 
            : cookies.value;
    }
    return null;
}

// ============================================
// FETCH VIA RANDOMIZED ENDPOINT
// ============================================
async function loadViaEndpoint(request, referrerPath) {
    const url = new URL(request.url);
    log('Fetching via API:', url.pathname);

    // Pick random endpoint for obfuscation
    const endpoint = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
    log('Using endpoint:', endpoint);

    const apiRes = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            path: url.pathname + url.search,
            referrer: referrerPath || ''
        }),
        credentials: 'include' // Send cookies
    });

    if (!apiRes.ok) {
        log('API failed, fallback');
        return fetch(request);
    }

    const data = await apiRes.json();

    try {
        log('Decoding envelope');

        // Get UID from cookie (server sends it if not present)
        const uid = getUidFromCookie() || 'default';
        const timestamp = data._meta?.ts || Date.now();

        // Generate same session key as server
        const sessionKey = await generateSessionKey(uid, timestamp);

        // Decrypt envelope (multi-layer)
        const envelopeEncrypted = bytesFromBase64(data.payload);
        const envelopeDecrypted = await multiLayerDecrypt(envelopeEncrypted, sessionKey);
        const envelope = JSON.parse(new TextDecoder().decode(envelopeDecrypted));

        log('Envelope:', envelope.contentType);

        // Decrypt file payload (multi-layer + noise padding)
        const fileEncrypted = bytesFromBase64(envelope.payload);
        const filePadded = await multiLayerDecrypt(fileEncrypted, sessionKey);
        const fileBytes = stripNoisePadding(filePadded);

        log('File size:', fileBytes.length);

        const contentType = envelope.contentType || 'application/octet-stream';

        // Handle range requests
        const rangeHeader = request.headers.get('range');
        if (rangeHeader) {
            log('Range request:', rangeHeader);
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
        log('Decode error:', err);
        return fetch(request);
    }
}

// ============================================
// LIFECYCLE
// ============================================
self.addEventListener('install', event => {
    log('Service Worker installing (Hardened v2.0)');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    log('Service Worker activated');
    event.waitUntil(self.clients.claim());
});

// ============================================
// FETCH INTERCEPT
// ============================================
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);

    // Skip API/math/status to avoid loops
    if (url.pathname.startsWith('/api/')) return;
    if (url.pathname.startsWith('/math/')) return;
    if (url.pathname.includes('/client_status')) return;

    event.respondWith((async () => {
        try {
            const client = event.clientId
                ? await self.clients.get(event.clientId)
                : null;

            const referrerPath = client ? new URL(client.url).pathname : '';

            return await loadViaEndpoint(request, referrerPath);

        } catch (err) {
            log('SW error:', err);
            return fetch(request);
        }
    })());
});