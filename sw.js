importScripts("/robofriends/precache-manifest.88a281010a1e81bfca5b98e8a792a3c4.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

import {BackgroundSyncPlugin, Queue} from 'workbox-background-sync';
import {registerRoute} from 'workbox-routing';
import {NetworkOnly, NetworkFirst} from 'workbox-strategies';

workbox.core.skipWaiting();
workbox.core.clientsClaim();

/* BACKGROUND SYNC */
const bgSyncPlugin = new BackgroundSyncPlugin('myQueueName', {
  maxRetentionTime: 24 * 60 // Retry for max of 24 Hours (specified in minutes)
});

registerRoute(
  new RegExp('https://jsonplaceholder.typicode.com/posts'),
  new NetworkOnly({
    plugins: [bgSyncPlugin]
  }),
  'POST'
);

const queue = new Queue('myQueueName');

self.addEventListener('fetch', (event) => {
  // Clone the request to ensure it's safe to read when
  // adding to the Queue.
  const promiseChain = fetch(event.request.clone()).catch((err) => {
    return queue.pushRequest({request: event.request});
  });

  event.waitUntil(promiseChain);
});

/* OFFLINE FETCH */
registerRoute(
  new RegExp('https://robohash.org/'),
  new NetworkFirst()
);

registerRoute(
  new RegExp('https://jsonplaceholder.typicode.com/users'),
  new NetworkFirst()
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

/*  */

/* ASSETS CACHE */
workbox.precaching.precacheAndRoute(self.__precacheManifest);


