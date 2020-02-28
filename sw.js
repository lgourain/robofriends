importScripts("/robofriends/precache-manifest.1877d417c401dd2a2a78b5b511524919.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

import {BackgroundSyncPlugin} from 'workbox-background-sync';
import {registerRoute} from 'workbox-routing';
import {NetworkOnly, NetworkFirst} from 'workbox-strategies';


workbox.core.skipWaiting();
workbox.core.clientsClaim();

/* Background Sync */
const bgSyncPlugin = new BackgroundSyncPlugin('app-queue', {
  maxRetentionTime: 24 * 60 // Retry for max of 24 Hours (specified in minutes)
});

registerRoute(
  /\/api\/.*\/*.json/,
  new NetworkOnly({
    plugins: [bgSyncPlugin]
  }),
  'POST'
);

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


