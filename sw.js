/* Service worker di Civitech Planning: caricarlo nella stessa cartella della pagina HTML (stesso livello).
   Rende l'app apribile anche senza rete: pagina e librerie vengono salvate dopo il primo avvio; con la rete prova sempre prima la versione nuova. */
var VERSION = 'civitech-pwa-v27';
self.addEventListener('install', function (e) { e.waitUntil(self.skipWaiting()); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || !/^https?:/.test(r.url)) return;
  e.respondWith(fetch(r).then(function (res) {
    if (res && (res.ok || res.type === 'opaque')) { var cp = res.clone(); caches.open(VERSION).then(function (c) { c.put(r, cp); }); }
    return res;
  }).catch(function () { return caches.match(r).then(function (m) { return m || caches.match(self.registration.scope); }); }));
});
