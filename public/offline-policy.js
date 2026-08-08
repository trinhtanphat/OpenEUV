const staticDestinations = new Set(['document', 'script', 'style', 'image', 'font', 'worker', 'manifest', ''])

export function shouldHandleOfflineRequest({ method = 'GET', url, origin, destination = '', hasAuthorization = false } = {}) {
  if (String(method).toUpperCase() !== 'GET') return false
  if (hasAuthorization) return false
  let parsed
  try { parsed = new URL(url, origin) } catch { return false }
  if (!origin || parsed.origin !== origin) return false
  if (parsed.pathname.startsWith('/api/')) return false
  return staticDestinations.has(destination)
}

export function offlineCacheName(version) {
  const safe = String(version ?? 'unknown').trim().replace(/[^a-zA-Z0-9._-]+/g, '-') || 'unknown'
  return `openeuv-readonly-${safe}`
}

export function isOpenEuvCacheName(name) {
  return String(name ?? '').startsWith('openeuv-readonly-')
}
