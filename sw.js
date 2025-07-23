// ✅ FIXED sw.js

const CACHE_NAME = 'issan-cleaning-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/es/index.html',
  '/css/style.css',
  '/js/script.js',
  '/public/images/logo.webp',
  '/public/images/logo.png',
  '/public/images/Home/Home-About.webp',
  '/public/images/Home/Home-About.jpg',
  '/public/images/Home/airbnb.webp',
  '/public/images/Home/airbnb.jpg',
  '/public/images/Home/office.webp',
  '/public/images/Home/office.jpg',
  '/public/images/Home/residential.webp',
  '/public/images/Home/residential.jpg',
  '/img/contact/fb.png',
  '/img/contact/ig.jpeg',
  '/videos/home.mp4',
  '/videos/services.mp4',
  '/videos/pricing.mp4',
  '/videos/contact.mp4',
  'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith('http')) return; // Skip non-http(s)

  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then(response => response || fetch('/index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    }).catch(() => {
      if (event.request.destination === 'document') {
        return caches.match('/offline.html');
      }
    })
  );
});