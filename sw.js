/* ── MaddazXD Portfolio Service Worker v6.0 ── */
const CACHE_NAME = "mxd-v7";
const OFFLINE_URL = "./";

/* Aset yang di-cache saat install */
const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./index-pro-2.css",
  "./index-pro-2.js",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-brands-400.woff2",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-solid-900.woff2",
  "https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700;800;900&display=swap",
];

/* ── INSTALL: pre-cache semua aset penting ── */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return Promise.allSettled(
          PRECACHE_ASSETS.map((url) =>
            cache.add(url).catch((e) => console.warn("[SW] Gagal cache:", url, e))
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

/* ── ACTIVATE: hapus cache lama ── */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

/* ── FETCH: strategi Cache-First untuk aset, Network-First untuk API ── */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* Skip non-GET dan request browser extension */
  if (request.method !== "GET") return;
  if (!url.protocol.startsWith("http")) return;

  /* Skip API / dynamic requests (FormSubmit, counterapi, weather, dll) */
  const skipDomains = [
    "formsubmit.co",
    "counterapi.dev",
    "open-meteo.com",
    "ipapi.co",
    "geojs.io",
    "bigdatacloud.net",
    "api.qrserver.com",
    "youtube.com",
    "youtu.be",
    "github.com",
  ];
  if (skipDomains.some((d) => url.hostname.includes(d))) return;

  /* Strategi untuk navigasi (HTML) → Network-first, fallback ke cache */
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  /* Strategi untuk aset statis (CSS, JS, Font) → Cache-first, update di background */
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});

/* ── BACKGROUND SYNC untuk form (opsional jika didukung browser) ── */
self.addEventListener("sync", (event) => {
  if (event.tag === "contact-form-sync") {
    event.waitUntil(retrySendForms());
  }
});

async function retrySendForms() {
  /* Placeholder — bisa diimplementasikan dengan IndexedDB jika dibutuhkan */
  console.log("[SW] Background sync: contact form");
}
