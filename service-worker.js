/* globals self */

const VERSION = 'v1.0.0';
const WORKER = '👷';
// const KEY = 'camelX3-v1';

// eslint-disable-next-line no-console
const log = (...args) => console.log(WORKER, VERSION, ...args);

const messages = new Map();

self.addEventListener('message', (event) => {
  log('message', event);

  const name = event.data;
  const resolvers = messages.get(name) || [];
  messages.delete(name);

  for (let resolve of resolvers) {
    resolve();
  }
});

self.addEventListener('install', (event) => {
  log('install', event);
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  log('activate', event);
  return self.clients.claim();
});

self.addEventListener('sync', function(event) {
  log('sync', event);
});

self.addEventListener('fetch', (event) => {
  log('fetch', event.request.method, event.request.url);
  event.respondWith(fetch(event.request));
});
