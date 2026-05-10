const CACHE = 'chatbuddy-v1';
const SHELL = [
    '/',
    '/manifest.webmanifest',
    '/icon-192.png',
    '/icon-512.png',
    '/icon-maskable-512.png',
    '/apple-touch-icon.png',
    '/offline.html',
];

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
    const url = new URL(request.url);

    if (request.method !== 'GET') return;

    if (url.pathname.startsWith('/api/')) return;

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).catch(() => {
                return caches.match('/offline.html');
            }),
        );
        return;
    }

    event.respondWith(
        fetch(request)
            .then((res) => {
                const copy = res.clone();
                caches.open(CACHE).then((c) => c.put(request, copy));
                return res;
            })
            .catch(() => {
                return caches.match(request);
            }),
    );
});
