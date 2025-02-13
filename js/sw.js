const CACHE_NAME = 'issan-cleaning-v1';
const urlsToCache = [
    '/',
    '/css/style.css',
    '/js/script.js',
    '/images/logo.png',
    '/videos/home.mp4'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
}); 