// Cache name
const CACHE_NAME = 'nine-point-game-v1';

// Files to cache
const FILES_TO_CACHE = [
  '/index.html',
  '/public/sounds/click.mp3',
  '/public/sounds/win.mp3',
  '/public/icons/icon-192x192.png',
  '/public/icons/icon-512x512.png'
];

// Install service worker and cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate service worker and clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => {
      // Fallback to index.html for navigation requests when offline
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});