self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('test-v1').then(cache => {
      return cache.addAll([
        '/index.html',
      ])
    })
  )
})


self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
  )
})