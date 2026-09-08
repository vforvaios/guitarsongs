/// <reference lib="webworker" />
export default null;

declare let self: ServiceWorkerGlobalScope;

import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";

// Απλός installation
self.addEventListener("install", (event) => {
  console.log("Service worker installed");
  self.skipWaiting(); // Αμέσως activate
});

// Απλός activation
self.addEventListener("activate", (event) => {
  console.log("Hi Vaios service worker");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(cacheNames.map((cache) => caches.delete(cache)))
      )
  );
});

// Μόνο για skip waiting από το prompt
self.addEventListener("message", (event: ExtendableMessageEvent) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// ✅ Precache (disabled in your case — but kept for reference)
precacheAndRoute(self.__WB_MANIFEST.filter(() => false));

// ✅ Clean outdated caches
cleanupOutdatedCaches();

// ✅ Offline navigation (if you want SPA fallback)
// registerRoute(new NavigationRoute(createHandlerBoundToURL("index.html")));
