const CACHE = 'chatbuddy-v1';
const SHELL = ['/', '/manifest.webmanifest', '/icon-192.png', '/offline.html'];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.method !== 'GET') return;

    if (url.pathname.startsWith('/api/')) return;

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).catch(() => {
                caches.match('/offline.html');
            }),
        );
    }

    event.respondWith(
        fetch(request)
            .then((res) => {
                const copy = res.clone();
                caches.open(CACHE).then((c) => c.put(request, copy));
                return res;
            })
            .catch(() => caches.match(request)),
    );
});
