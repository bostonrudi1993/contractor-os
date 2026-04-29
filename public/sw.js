const CACHE_NAME = 'contractor-os-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
];

// Install — cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch — network first, fall back to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET and API requests (let them go to network)
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('anthropic.com')) return;
  if (event.request.url.includes('fonts.googleapis.com')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed — try cache
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // For navigation requests, return the app shell
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Background sync placeholder for future DB integration
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    console.log('Background sync triggered');
  }
});

// Push notifications placeholder
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'ContractorOS Alert';
  const options = {
    body: data.body || 'You have a compliance item that needs attention.',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    tag: data.tag || 'cos-notification',
    data: { url: data.url || '/' },
    actions: [
      { action: 'view', title: 'View Now' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'view') {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});
