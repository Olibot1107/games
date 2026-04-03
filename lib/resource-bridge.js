(function () {
  'use strict';

  if (typeof window === 'undefined' || window.__resourceBridgeInstalled) return;
  window.__resourceBridgeInstalled = true;

  const RESOURCE_KEY = window.__RESOURCE_KEY || 'games-shell-v1';
  const RESOURCE_ENDPOINT = '/api/resource';
  const IGNORED_PREFIXES = [
    '/api/',
    '/sounds',
    '/media/',
    '/phonk',
    '/ping',
    '/projects/editor',
  ];

  window.__RESOURCE_KEY = RESOURCE_KEY;

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

  function decodeEnvelope(payload) {
    const outerJson = new TextDecoder().decode(xorBytes(bytesFromBase64(payload)));
    return JSON.parse(outerJson);
  }

  function toUrl(input) {
    if (input instanceof URL) return new URL(input.href);
    if (input instanceof Request) return new URL(input.url);
    return new URL(String(input), window.location.href);
  }

  function shouldProxyUrl(input, method) {
    let url;
    try {
      url = toUrl(input);
    } catch (_) {
      return false;
    }

    if (url.origin !== window.location.origin) return false;
    if (method && !['GET', 'HEAD'].includes(String(method).toUpperCase())) return false;
    if (url.pathname === RESOURCE_ENDPOINT || url.pathname.startsWith('/api/resource')) return false;
    if (url.pathname === '/service-worker.js' || url.pathname === '/sw.js') return false;
    return !IGNORED_PREFIXES.some(prefix => url.pathname === prefix || url.pathname.startsWith(prefix));
  }

  function shouldProxyHeaderLoad(url) {
    if (url.origin !== window.location.origin) return false;
    if (url.pathname === RESOURCE_ENDPOINT || url.pathname.startsWith('/api/resource')) return false;
    return !IGNORED_PREFIXES.some(prefix => url.pathname === prefix || url.pathname.startsWith(prefix));
  }

  async function requestResource(pathname, referrerPath) {
    const response = await fetch(RESOURCE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'path',
        path: pathname,
        referrer: referrerPath || '',
      }),
    });

    if (!response.ok) {
      throw new Error(`resource endpoint returned HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.encoding !== 'xor-base64' || typeof data.payload !== 'string') {
      throw new Error('unexpected resource endpoint payload');
    }

    return decodeEnvelope(data.payload);
  }

  function buildResponseBody(envelope, responseType) {
    const contentType = envelope.contentType || 'application/octet-stream';
    const bytes = xorBytes(bytesFromBase64(envelope.payload));
    const textType = contentType.startsWith('text/') ||
      contentType.includes('javascript') ||
      contentType.includes('json') ||
      contentType.includes('xml') ||
      contentType.includes('svg');

    if (responseType === 'arraybuffer') {
      return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    }

    if (responseType === 'blob') {
      return new Blob([bytes], { type: contentType });
    }

    if (responseType === 'json') {
      return JSON.parse(new TextDecoder().decode(bytes));
    }

    if (responseType === 'document') {
      return new DOMParser().parseFromString(new TextDecoder().decode(bytes), 'text/html');
    }

    return textType ? new TextDecoder().decode(bytes) : bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  }

  const nativeFetch = window.fetch.bind(window);
  window.fetch = async function (input, init) {
    const method = (init && init.method) || (input instanceof Request ? input.method : 'GET');
    if (!shouldProxyUrl(input, method)) {
      return nativeFetch(input, init);
    }

    const url = toUrl(input);
    const envelope = await requestResource(url.pathname + url.search, window.location.pathname);
    const body = buildResponseBody(envelope, 'text');
    const headers = new Headers();
    headers.set('Content-Type', envelope.contentType || 'text/plain; charset=utf-8');
    return new Response(body, { status: 200, headers });
  };

  const nativeOpen = XMLHttpRequest.prototype.open;
  const nativeSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
    this.__resourceBridge = this.__resourceBridge || {};
    this.__resourceBridge.method = method;
    this.__resourceBridge.url = url;
    this.__resourceBridge.async = async !== false;
    this.__resourceBridge.user = user;
    this.__resourceBridge.password = password;
    return nativeOpen.call(this, method, url, async, user, password);
  };

  XMLHttpRequest.prototype.send = function (body) {
    const bridge = this.__resourceBridge;
    if (!bridge || !shouldProxyUrl(bridge.url, bridge.method) || (bridge.method || 'GET').toUpperCase() !== 'GET') {
      return nativeSend.call(this, body);
    }

    const xhr = this;
    const url = toUrl(bridge.url);
    const responseType = xhr.responseType || 'text';
    const referrerPath = window.location.pathname;

    Promise.resolve()
      .then(() => {
        xhr.readyState = 2;
        xhr.dispatchEvent(new Event('readystatechange'));
        return requestResource(url.pathname + url.search, referrerPath);
      })
      .then(envelope => {
        const contentType = envelope.contentType || 'application/octet-stream';
        const responseBody = buildResponseBody(envelope, responseType);
        xhr.status = 200;
        xhr.statusText = 'OK';
        xhr.responseURL = url.href;
        xhr.getResponseHeader = function (name) {
          return String(name).toLowerCase() === 'content-type' ? contentType : null;
        };
        xhr.getAllResponseHeaders = function () {
          return `content-type: ${contentType}\r\n`;
        };
        Object.defineProperty(xhr, 'response', {
          configurable: true,
          enumerable: true,
          value: responseBody,
          writable: true,
        });
        if (responseType === '' || responseType === 'text' || responseType === 'json' || responseType === 'document') {
          Object.defineProperty(xhr, 'responseText', {
            configurable: true,
            enumerable: true,
            value: typeof responseBody === 'string' ? responseBody : new TextDecoder().decode(new Uint8Array(responseBody)),
            writable: true,
          });
        }
        xhr.readyState = 4;
        xhr.dispatchEvent(new Event('readystatechange'));
        xhr.dispatchEvent(new Event('load'));
        xhr.dispatchEvent(new Event('loadend'));
      })
      .catch(err => {
        xhr.status = 500;
        xhr.statusText = String(err && err.message ? err.message : err);
        xhr.readyState = 4;
        xhr.dispatchEvent(new Event('readystatechange'));
        xhr.dispatchEvent(new Event('error'));
        xhr.dispatchEvent(new Event('loadend'));
      });
  };
})();
