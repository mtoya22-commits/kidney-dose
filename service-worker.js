// =============================================
// Service Worker
// 戦略: Cache First (アプリシェル + データ全部キャッシュ)
// 単一HTMLなので、初回ロード後は完全オフライン動作
// =============================================
const CACHE_NAME = 'renal-checker-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// Install: アプリシェルをキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(err => {
        console.warn('[SW] cache addAll partial fail', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: 古いキャッシュ削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Cache First
self.addEventListener('fetch', event => {
  const req = event.request;
  // GET以外、外部ドメイン（PMDA等）はキャッシュ対象外
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      // キャッシュにない → ネットワーク取得 + キャッシュ
      return fetch(req).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        }
        return res;
      }).catch(() => {
        // オフラインかつ未キャッシュ → アプリシェル返却
        if (req.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return new Response('オフライン', { status: 503 });
      });
    })
  );
});
