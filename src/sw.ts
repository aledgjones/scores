import { manifest, version } from "@parcel/service-worker";

const ctx: any = self;

async function install() {
  const cache = await caches.open(version);
  await cache.addAll([
    ...manifest,
    "/empty.png",
    "/solo.png",
    "/pdf.worker.min.js",
  ]);
}
addEventListener("install", (e: any) => e.waitUntil(install()));

async function activate() {
  const keys = await caches.keys();
  await Promise.all(keys.map((key) => key !== version && caches.delete(key)));
}
addEventListener("activate", (e: any) => e.waitUntil(activate()));

async function htmlResponse(e: any) {
  const cache = await caches.open(version);
  const cachedResponse = await cache.match("/index.html");

  if (cachedResponse) {
    return cachedResponse;
  } else {
    return fetch(e.request);
  }
}

async function precacheFirst(e: any) {
  const cache = await caches.open(version);
  const cachedResponse = await cache.match(e.request.clone());

  if (cachedResponse) {
    return cachedResponse;
  } else {
    return fetch(e.request);
  }
}

async function networkFirst(e: any) {
  const cache = await caches.open("supabase-data");

  try {
    const fetchResponse = await fetch(e.request.clone());
    if (fetchResponse.ok) {
      await cache.put(e.request, fetchResponse.clone());
      return fetchResponse;
    } else {
      throw "fetch failed";
    }
  } catch {
    const cachedResponse = await cache.match(e.request);

    if (cachedResponse) {
      return cachedResponse;
    } else {
      return Response.error();
    }
  }
}

ctx.addEventListener("fetch", (e: any) => {
  // we can only cache get requests
  if (e.request.method === "GET") {
    if (e.request.destination === "document") {
      // serve index.html for all page requests
      e.respondWith(htmlResponse(e));
    } else if (e.request.url.startsWith(process.env.SUPABASE_URL + "/rest")) {
      // get from network else fallback to cache
      e.respondWith(networkFirst(e));
    } else {
      // get precached assets else fallback to network
      e.respondWith(precacheFirst(e));
    }
  } else {
    e.respondWith(fetch(e.request));
  }
});

ctx.addEventListener("message", (e: any) => {
  if (e.data === "SKIP_WAITING") {
    ctx.skipWaiting();
  }
});
