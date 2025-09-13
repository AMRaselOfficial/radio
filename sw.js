const CACHE_NAME = 'rasel-radio-cache-v1';
const urlsToCache = [
  'index.html',
  '/',         // root of radio
  'style.css',// if you have CSS
  'script.js',// if you have JS
  // you may want to cache your audio file or parts of it (if small)
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return from cache if available, else fetch from network
        return response || fetch(event.request);
      })
  );
});
