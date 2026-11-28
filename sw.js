/* AL ZAIN - Service Worker
   مكانه: نفس فولدر index.html (الجذر) عشان يغطي الموقع كله */
const VERSION = "alzain-v1";
const STATIC = VERSION + "-static";

const CORE = [
  "/",
  "/index.html",
  "/style.css",
  "/extras.css",
  "/hero-banner.css",
  "/smart-quote.css",
  "/sizes.js",
  "/script.js",
  "/smart-quote.js",
  "/assistant-widget.js",
  "/pwa.js",
  "/manifest.webmanifest"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(STATIC)
      .then(c => Promise.allSettled(CORE.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  const url = new URL(req.url);

  /* ما نلمسش: غير GET، أو طلبات الـ API (الطلبات والمساعد)، أو مواقع تانية، أو الفيديو */
  if (req.method !== "GET") return;
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api/")) return;
  if (/\.(mp4|webm)$/i.test(url.pathname) || req.headers.has("range")) return;

  /* الصفحات: الشبكة أولًا، ولو الإنترنت قطع نعرض النسخة المحفوظة */
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(STATIC).then(c => c.put("/index.html", copy));
          return res;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  /* باقي الملفات (CSS/JS/صور): نعرض المحفوظ فورًا ونحدّثه في الخلفية */
  e.respondWith(
    caches.match(req).then(cached => {
      const fresh = fetch(req)
        .then(res => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(STATIC).then(c => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fresh;
    })
  );
});
