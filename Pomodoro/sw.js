// Call Fetch Event
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request)) 
  )
});


const cacheName = 'v1';

const cacheAssets = [
  'index.html',
  'tomato.png',
  'pomo_img.png',
  'timer-bling.flac'
]

// Cache Install Event
self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(cacheName).then(function(cache){
      return cache.addAll(cacheAssets)  
    }).then(() => self.skipWaiting())
  )
})

// Cache Activate Event
self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(cacheNames){
      return Promise.all(
        cacheNames.map(function(cache){
          if(cache !== cacheName){
            return caches.delete(cache) 
          } 
        }) 
      ) 
    }) 
  )  
})



