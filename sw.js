importScripts("/robofriends/precache-manifest.dd58f3010686481bf4f4a8e4909cf169.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

workbox.core.skipWaiting();
workbox.core.clientsClaim();

/* OFFLINE FETCH */
workbox.routing.registerRoute(
  new RegExp('https://robohash.org/'),
  new workbox.strategies.NetworkFirst()
);

workbox.routing.registerRoute(
  new RegExp('https://jsonplaceholder.typicode.com/users'),
  new workbox.strategies.NetworkFirst()
);

/* HANDLE PUSH NOTIFICATIONS */
self.addEventListener('push', (event) => {
  const title = 'Get Started With Workbox';
  const options = {
    body: event.data.text()
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclose', function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;

  console.log('Closed notification: ' + primaryKey);
});

self.addEventListener('notificationclick', function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;
  var action = e.action;

  if (action === 'close') {
    notification.close();
  } else {
    clients.openWindow('http://www.example.com');
    notification.close();
  }
});

/* ASSETS CACHE */
workbox.precaching.precacheAndRoute(self.__precacheManifest);


