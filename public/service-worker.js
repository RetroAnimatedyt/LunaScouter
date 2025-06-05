self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('scouting-app-v1').then(cache => {
      return cache.addAll([
        '/',
        '/favicon.ico',
        '/manifest.webmanifest',
        '/app.css',
        '/build/client/favicon.ico',
        // Add more static assets and routes as needed
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== 'scouting-app-v1').map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        // Optionally return a fallback page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});
