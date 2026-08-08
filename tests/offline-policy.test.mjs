import test from 'node:test'
import assert from 'node:assert/strict'
import { isOpenEuvCacheName, offlineCacheName, shouldHandleOfflineRequest } from '../src/lib/offlinePolicy.mjs'

const origin = 'https://openeuv.example'

test('offline policy allows public same-origin GET resources only', () => {
  assert.equal(shouldHandleOfflineRequest({ method: 'GET', url: `${origin}/`, origin, destination: 'document' }), true)
  assert.equal(shouldHandleOfflineRequest({ method: 'GET', url: `${origin}/assets/app.js`, origin, destination: 'script' }), true)
  assert.equal(shouldHandleOfflineRequest({ method: 'GET', url: `${origin}/datasets/optical/mo.json`, origin, destination: '' }), true)
  assert.equal(shouldHandleOfflineRequest({ method: 'POST', url: `${origin}/`, origin, destination: 'document' }), false)
  assert.equal(shouldHandleOfflineRequest({ method: 'GET', url: 'https://patents.google.com/patent/EP1/en', origin, destination: 'document' }), false)
  assert.equal(shouldHandleOfflineRequest({ method: 'GET', url: `${origin}/api/private`, origin, destination: '', hasAuthorization: false }), false)
  assert.equal(shouldHandleOfflineRequest({ method: 'GET', url: `${origin}/secret`, origin, destination: '', hasAuthorization: true }), false)
})

test('offline cache names are versioned and recognizable without accepting arbitrary prefixes', () => {
  assert.equal(offlineCacheName('0.9.0'), 'openeuv-readonly-0.9.0')
  assert.equal(offlineCacheName('release 1'), 'openeuv-readonly-release-1')
  assert.equal(isOpenEuvCacheName('openeuv-readonly-0.9.0'), true)
  assert.equal(isOpenEuvCacheName('other-cache'), false)
})
