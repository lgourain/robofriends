importScripts("/robofriends/precache-manifest.5a612bea858cb1701156a5a79cb16574.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.routing.registerRoute(
  new RegExp('https://robohash.org/'),
  new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
  new RegExp('https://jsonplaceholder.typicode.com/users'),
  new workbox.strategies.CacheFirst()
);

self.addEventListener('push', (event) => {
  const title = 'Get Started With Workbox';
  const options = {
    body: event.data.text()
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

workbox.precaching.precacheAndRoute(self.__precacheManifest);

