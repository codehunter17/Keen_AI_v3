// NutriMama service worker — minimal offline shell.
// We deliberately keep this small for v1 and avoid caching API responses
// (health data must always be fresh). On request we'll expand once we
// add a queue for offline cycle/symptom logging.

const CACHE_VERSION = "nutrimama-v4";
// Only precache the public shell + offline fallback. Dashboard pages are
// authenticated and personalized — caching them risks leaking one user's
// data to another on shared devices.
const PRECACHE_URLS = [
  "/",
  "/manifest.webmanifest",
  "/NutriLogo.svg",
  "/offline.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Never cache /api, auth, or authenticated dashboard HTML — health data
  // must be fresh and per-user. Static /_next assets and the public shell
  // can be cached safely.
  if (url.pathname.startsWith("/api/")) return;
  if (url.pathname.startsWith("/auth")) return;
  if (url.pathname.startsWith("/dashboard")) {
    // Network-only for dashboard pages, with offline fallback only.
    event.respondWith(
      fetch(request).catch(() => caches.match("/offline.html")),
    );
    return;
  }

  // Only cache "safe" GETs: static assets, images, fonts, and the marketing
  // shell. Skip anything that looks like an HTML document for an
  // authenticated route just to be safe.
  const isStaticAsset =
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/icons/") ||
    /\.(?:png|jpg|jpeg|svg|webp|woff2?|ico|css|js)$/i.test(url.pathname);

  event.respondWith(
    fetch(request)
      .then((res) => {
        // Only cache opaque-safe, 200-OK static assets.
        if (isStaticAsset && res.ok && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(request).then((hit) => hit ?? caches.match("/offline.html")),
      ),
  );
});

// Allow the page to trigger immediate activation after a new SW is found
// (paired with sw-register update flow).
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// ─── Local push notifications (zero-cost, no web-push) ──────────
// Page posts SCHEDULE_NOTIFICATION → SW fires showNotification after delay.
// Cap is ~30 min (SW lifecycle limits longer scheduling reliably).

const _scheduledTimers = new Map();

self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || typeof data !== "object") return;

  if (data.type === "SCHEDULE_NOTIFICATION") {
    const { id, title, body, delayMs, tag, url } = data;
    if (!id || !title || typeof delayMs !== "number") return;
    if (_scheduledTimers.has(id)) clearTimeout(_scheduledTimers.get(id));
    const t = setTimeout(() => {
      self.registration.showNotification(title, {
        body: body || "",
        icon: "/NutriLogo.svg",
        badge: "/NutriLogo.svg",
        tag: tag || id,
        data: { url: url || "/dashboard" },
        vibrate: [120, 60, 120],
      });
      _scheduledTimers.delete(id);
    }, Math.min(delayMs, 30 * 60_000));
    _scheduledTimers.set(id, t);
  }

  if (data.type === "CANCEL_NOTIFICATION") {
    if (_scheduledTimers.has(data.id)) {
      clearTimeout(_scheduledTimers.get(data.id));
      _scheduledTimers.delete(data.id);
    }
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/dashboard";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((wins) => {
      for (const w of wins) {
        if (w.url.includes(target) && "focus" in w) return w.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    }),
  );
});
