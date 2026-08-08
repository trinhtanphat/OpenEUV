import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('offline shell manifest and icon are public OpenEUV assets', async () => {
  const manifest = JSON.parse(await read('public/manifest.webmanifest'))
  assert.equal(manifest.name, 'OpenEUV Atlas')
  assert.equal(manifest.start_url, '/')
  assert.equal(manifest.scope, '/')
  assert.equal(manifest.icons[0].src, '/openeuv-icon.svg')
  assert.match(await read('public/openeuv-icon.svg'), /<svg/)
})

test('service worker uses the canonical policy and does not bypass private/no-store guards at install', async () => {
  const source = await read('public/sw.js')
  assert.match(source, /from '\.\/offline-policy\.js'/)
  assert.match(source, /no-store/)
  assert.match(source, /private/)
  assert.match(source, /storePublicResponse/)
  assert.doesNotMatch(source, /cache\.addAll/)
})

test('service worker registration is production-only and versioned', async () => {
  const main = await read('src/main.tsx')
  const registration = await read('src/offline.ts')
  assert.match(main, /if \(import\.meta\.env\.PROD\)/)
  assert.match(registration, /\/sw\.js\?v=\$\{encodeURIComponent\(buildInfo\.version\)\}/)
  assert.match(registration, /type: 'module'/)
})
