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
  }

  return fetch(e.request);
}

async function cacheFirst(e: any) {
  console.log(`[SW] cacheFirst`);
  const cache = await caches.open(version);
  const cachedResponse = await cache.match(e.request);

  if (cachedResponse) {
    console.log(`[SW] from cache: ${e.request.url}`);
    return cachedResponse;
  }

  console.log(`[SW] from fetch: ${e.request.url}`);
  const fetchResponse = await fetch(e.request);

  if (fetchResponse.ok) {
    return fetchResponse;
  } else {
    return Response.error();
  }
}

async function networkFirst(e: any) {
  console.log(`[SW] networkFirst`);
  const cache = await caches.open("supabase-data");

  const fetchResponse = await fetch(e.request);

  if (fetchResponse.ok) {
    console.log(`[SW] from fetch: ${e.request.url}`);
    await cache.put(e.request, fetchResponse.clone());
    return fetchResponse;
  } else {
    console.log(`[SW] from cache: ${e.request.url}`);
    const cachedResponse = await cache.match(e.request);

    if (cachedResponse) {
      return cachedResponse;
    } else {
      return Response.error();
    }
  }
}

ctx.addEventListener("fetch", (e: any) => {
  if (e.request.destination === "document") {
    // serve index.html for all page requests
    e.respondWith(htmlResponse(e));
  } else if (e.request.url.startsWith(process.env.SUPABASE_URL)) {
    // get from network else fallback to cache
    e.respondWith(networkFirst(e));
  } else {
    // get precached assets else fallback to network
    e.respondWith(cacheFirst(e));
  }
});

ctx.addEventListener("message", (e: any) => {
  if (e.data === "SKIP_WAITING") {
    ctx.skipWaiting();
  }
});
