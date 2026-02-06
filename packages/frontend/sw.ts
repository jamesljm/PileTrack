/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { CacheFirst, ExpirationPlugin, NetworkFirst, NetworkOnly, Serwist, StaleWhileRevalidate } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope & typeof globalThis;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Cache page navigations with NetworkFirst strategy
    {
      matcher: ({ request }) => request.mode === "navigate",
      handler: new NetworkFirst({
        cacheName: "pages",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 64,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          }),
        ],
        networkTimeoutSeconds: 3,
      }),
    },
    // Cache API responses with NetworkFirst strategy
    {
      matcher: ({ url }) => url.pathname.startsWith("/api/"),
      handler: new NetworkFirst({
        cacheName: "api-responses",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 256,
            maxAgeSeconds: 60 * 60, // 1 hour
          }),
        ],
        networkTimeoutSeconds: 5,
      }),
    },
    // Cache static assets with CacheFirst strategy
    {
      matcher: ({ request }) =>
        request.destination === "style" ||
        request.destination === "script" ||
        request.destination === "worker",
      handler: new CacheFirst({
        cacheName: "static-resources",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 128,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          }),
        ],
      }),
    },
    // Cache images with CacheFirst strategy
    {
      matcher: ({ request }) => request.destination === "image",
      handler: new CacheFirst({
        cacheName: "images",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 256,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            maxAgeFrom: "last-used",
          }),
        ],
      }),
    },
    // Cache fonts with CacheFirst strategy
    {
      matcher: ({ request }) => request.destination === "font",
      handler: new CacheFirst({
        cacheName: "fonts",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
          }),
        ],
      }),
    },
    // Cache Google Fonts stylesheets with StaleWhileRevalidate
    {
      matcher: ({ url }) => url.origin === "https://fonts.googleapis.com",
      handler: new StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 16,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          }),
        ],
      }),
    },
    // Cache Google Fonts webfonts with CacheFirst
    {
      matcher: ({ url }) => url.origin === "https://fonts.gstatic.com",
      handler: new CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
          }),
        ],
      }),
    },
    // Sync endpoint should always use NetworkOnly
    {
      matcher: ({ url }) =>
        url.pathname.startsWith("/api/sync/"),
      handler: new NetworkOnly(),
    },
    // Default cache for everything else
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher: ({ request }) => request.destination === "document",
      },
    ],
  },
});

// Listen for sync events for background sync
self.addEventListener("sync", (event: SyncEvent) => {
  if (event.tag === "piletrack-sync") {
    event.waitUntil(handleBackgroundSync());
  }
});

// Listen for push notifications
self.addEventListener("push", (event: PushEvent) => {
  if (!event.data) return;

  try {
    const payload = event.data.json() as {
      title: string;
      body: string;
      icon?: string;
      badge?: string;
      data?: Record<string, unknown>;
      tag?: string;
    };

    event.waitUntil(
      self.registration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon ?? "/icons/icon-192x192.png",
        badge: payload.badge ?? "/icons/icon-72x72.png",
        data: payload.data,
        tag: payload.tag ?? "piletrack-notification",
      } as NotificationOptions),
    );
  } catch {
    // Fallback for plain text push
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification("PileTrack", {
        body: text,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
        tag: "piletrack-notification",
      }),
    );
  }
});

// Handle notification click
self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();

  const data = event.notification.data as { url?: string } | undefined;
  const targetUrl = data?.url ?? "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window if available
        for (const client of clientList) {
          if (client.url.includes(targetUrl) && "focus" in client) {
            return client.focus();
          }
        }
        // Open new window
        return self.clients.openWindow(targetUrl);
      }),
  );
});

// Background sync handler
async function handleBackgroundSync(): Promise<void> {
  try {
    // Open IndexedDB to read sync queue
    const dbRequest = indexedDB.open("PileTrackDB");

    await new Promise<void>((resolve, reject) => {
      dbRequest.onerror = () => reject(dbRequest.error);
      dbRequest.onsuccess = async () => {
        const db = dbRequest.result;

        try {
          const tx = db.transaction("syncQueue", "readonly");
          const store = tx.objectStore("syncQueue");
          const statusIndex = store.index("status");
          const pendingRequest = statusIndex.getAll("PENDING");

          pendingRequest.onsuccess = async () => {
            const pendingItems = pendingRequest.result;

            if (pendingItems.length === 0) {
              resolve();
              return;
            }

            // Send pending items to server
            try {
              const payload = pendingItems.map((item: Record<string, unknown>) => ({
                table: item.table,
                action: item.action,
                recordId: item.recordId,
                clientId: item.clientId,
                payload: item.payload,
                timestamp: item.timestamp,
              }));

              const response = await fetch("/api/sync/push", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ changes: payload }),
              });

              if (response.ok) {
                // Mark items as synced
                const writeTx = db.transaction("syncQueue", "readwrite");
                const writeStore = writeTx.objectStore("syncQueue");

                for (const item of pendingItems) {
                  const key = item.id as number;
                  const updateRequest = writeStore.get(key);
                  updateRequest.onsuccess = () => {
                    const record = updateRequest.result;
                    if (record) {
                      record.status = "SYNCED";
                      writeStore.put(record);
                    }
                  };
                }

                // Notify all clients that sync completed
                const clients = await self.clients.matchAll({ type: "window" });
                for (const client of clients) {
                  client.postMessage({
                    type: "SYNC_COMPLETED",
                    pushed: pendingItems.length,
                  });
                }
              }

              resolve();
            } catch {
              // Background sync will retry automatically
              resolve();
            }
          };

          pendingRequest.onerror = () => reject(pendingRequest.error);
        } catch (err) {
          reject(err);
        }
      };
    });
  } catch (error) {
    console.error("Background sync failed:", error);
    throw error; // Let the browser retry
  }
}

// Listen for messages from the main thread
self.addEventListener("message", (event: ExtendableMessageEvent) => {
  const data = event.data as { type: string } | undefined;

  if (data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (data?.type === "REQUEST_SYNC") {
    // Register for background sync
    self.registration.sync
      .register("piletrack-sync")
      .catch(() => {
        // Background sync not supported, sync will happen next time app is open
        console.warn("Background sync registration failed");
      });
  }
});

serwist.addEventListeners();
