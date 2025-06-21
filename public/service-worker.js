self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('scouting-app-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html', // Explicitly cache the main HTML file
        '/favicon.ico',
        '/manifest.webmanifest',
        '/app.css',
        '/build/client/favicon.ico',
        '/build/client/assets/chunk-NL6KNZEE-b53XU3gX.js',
        '/build/client/assets/entry.client-GYH6YEgi.js',
        '/build/client/assets/home-C4xeP0Bd.js',
        '/build/client/assets/logo-dark-pX2395Y0.svg',
        '/build/client/assets/logo-light-CVbx2LBR.svg',
        '/build/client/assets/manifest-960253ef.js',
        '/build/client/assets/root-B1QfmZCo.css',
        '/build/client/assets/root-RnGZ3hWx.js',
        '/build/client/assets/scouting-BhzBqaIp.js',
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
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/').then(response => response || fetch(event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
