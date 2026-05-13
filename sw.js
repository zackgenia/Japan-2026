// Japan 2026 — service worker for offline support
// Bump CACHE_VERSION when you ship a new index.html
const CACHE_VERSION = 'jp-2026-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// Files to pre-cache on install
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
          .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  // Only handle GET
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // For HTML/navigation: network-first, fall back to cache (so updates ship promptly when online)
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then(response => {
          // Cache a copy of the fresh HTML for offline use
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then(c => c.put('./index.html', clone));
          }
          return response;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // For everything else (fonts, etc.): cache-first, then network
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(response => {
        // Only cache successful, same-origin or font responses
        if (response.ok && (url.origin === self.location.origin || url.host.includes('fonts.gstatic.com') || url.host.includes('fonts.googleapis.com'))) {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then(c => c.put(req, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
