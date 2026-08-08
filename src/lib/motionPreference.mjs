export function preferredScrollBehavior(reducedMotion) {
  return reducedMotion ? 'auto' : 'smooth'
}

export function browserPrefersReducedMotion(matchMedia = globalThis.matchMedia) {
  if (typeof matchMedia !== 'function') return false
  try {
    return Boolean(matchMedia('(prefers-reduced-motion: reduce)').matches)
  } catch {
    return false
  }
}
