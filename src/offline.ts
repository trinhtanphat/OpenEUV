import { buildInfo } from './buildInfo'

export async function registerOfflineShell() {
  if (!('serviceWorker' in navigator)) return null
  const url = `/sw.js?v=${encodeURIComponent(buildInfo.version)}`
  return navigator.serviceWorker.register(url, { type: 'module' })
}
