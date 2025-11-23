const CACHE_NAME = 'legacy-poc-v4';
const ASSETS = [
  './',
  './index.html',
  './app.html',
  './about.html',
  './pricing.html',
  './assets/css/swiss-legacy.css',
  './assets/js/legacy.js',
  './assets/js/landing.js',
  './assets/js/mock-data.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});