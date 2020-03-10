importScripts("/robofriends/precache-manifest.7a305371d582c4284e3a35bb7bf9fff2.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

console.log('workbox', workbox);

workbox.setConfig({
  debug: true
});

/* ASSETS CACHE */
workbox.precaching.precacheAndRoute(self.__precacheManifest);

/* BACKGROUND SYNC */
const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin('myQueueName', {
  maxRetentionTime: 24 * 60 // Retry for max of 24 Hours (specified in minutes)
});

workbox.routing.registerRoute(
  new RegExp('https://jsonplaceholder.typicode.com/posts'),
  new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin]
  }),
  'POST'
);

// const queue = new workbox.backgroundSync.Queue('customQueue');

// self.addEventListener('fetch', (event) => {
//   // Clone the request to ensure it's safe to read when
//   // adding to the Queue.
//   const promiseChain = fetch(event.request.clone()).catch((err) => {
//     return queue.pushRequest({request: event.request});
//   });

//   event.waitUntil(promiseChain);
// });

/* PRECACHE FILES */
workbox.precaching.precacheAndRoute([
  {url: 'https://jsonplaceholder.typicode.com/albums', revision: null},
]);

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

workbox.core.skipWaiting();
workbox.core.clientsClaim();
