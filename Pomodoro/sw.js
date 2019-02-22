self.addEventListener('fetch', function(event) {
  /** An empty fetch handler! */
});

// caching static file and assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        'index.html',
        'pomo_img.png',
        'tomato.png'
      ]); 
    }) 
  ); 
});
