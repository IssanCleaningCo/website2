const CACHE_NAME = 'issan-cleaning-v1';
const urlsToCache = [
    '/',
    '/css/style.css',
    '/js/script.js',
    '/dist/images/logo.png',
    '/videos/home.mp4'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    // Only handle http(s) requests
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
}); 