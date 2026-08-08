import { isOpenEuvCacheName, offlineCacheName, shouldHandleOfflineRequest } from './offline-policy.js'

const version = new URL(self.location.href).searchParams.get('v') || 'unknown'
const cacheName = offlineCacheName(version)
const shellUrls = ['/', '/manifest.webmanifest', '/openeuv-icon.svg', '/offline-policy.js']

function responseIsPublicCacheable(response) {
  if (!response || !response.ok || !['basic', 'default'].includes(response.type)) return false
  const cacheControl = String(response.headers.get('cache-control') || '').toLowerCase()
  return !cacheControl.includes('no-store') && !cacheControl.includes('private')
}

async function networkFirst(request, fallbackUrl = null) {
  const cache = await caches.open(cacheName)
  try {
    const response = await fetch(request)
    if (responseIsPublicCacheable(response)) await cache.put(request, response.clone())
    return response
  } catch {
    const cached = await cache.match(request)
    if (cached) return cached
    if (fallbackUrl) {
      const fallback = await cache.match(fallbackUrl)
      if (fallback) return fallback
    }
    return new Response('OpenEUV is offline and this resource has not been cached yet.', {
      status: 503,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    })
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName)
    await cache.addAll(shellUrls)
    await self.skipWaiting()
  })())
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys()
    await Promise.all(names.filter((name) => isOpenEuvCacheName(name) && name !== cacheName).map((name) => caches.delete(name)))
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  const allowed = shouldHandleOfflineRequest({
    method: request.method,
    url: request.url,
    origin: self.location.origin,
    destination: request.destination,
    hasAuthorization: request.headers.has('authorization'),
  })
  if (!allowed) return
  event.respondWith(networkFirst(request, request.mode === 'navigate' ? '/' : null))
})
