const CACHE_NAME = 'issan-cleaning-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/es/index.html',
  '/css/style.css',
  '/js/script.js',
  '/images/logo.webp',
  '/images/logo.png',
  '/images/Home/Home-About.webp',
  '/images/Home/Home-About.jpg',
  '/images/Home/airbnb.webp',
  '/images/Home/airbnb.jpg',
  '/images/Home/office.webp',
  '/images/Home/office.jpg',
  '/images/Home/residential.webp',
  '/images/Home/residential.jpg',
  '/img/contact/fb.png',
  '/img/contact/ig.jpeg',
  '/videos/home.mp4',
  '/videos/services.mp4',
  '/videos/pricing.mp4',
  '/videos/contact.mp4',
  'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Activate event - clean up old caches
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

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', event => {
  // Handle navigation requests (SPA/fallback for index.html)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then(response => {
        return response || fetch('/index.html', { redirect: 'follow' });
      })
    );
    return;
  }
  // Default: cache-first for other requests
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request, { redirect: 'follow' })
          .then(fetchResponse => {
            // Only cache http(s) requests, not chrome-extension or other schemes
            if (event.request.url.startsWith('http')) {
              return caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, fetchResponse.clone());
                  return fetchResponse;
                });
            } else {
              return fetchResponse;
            }
          });
      })
      .catch(() => {
        // Return offline page if both cache and network fail
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }
      })
  );
});