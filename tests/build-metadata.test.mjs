import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveBuildMetadata } from '../src/lib/buildMetadata.mjs'

test('build metadata prefers explicit then Cloudflare then Vercel commit provenance', () => {
  assert.deepEqual(resolveBuildMetadata({ version: '0.9.0', env: { OPENEUV_COMMIT_SHA: 'A'.repeat(40), CF_PAGES_COMMIT_SHA: 'b'.repeat(40) } }), { version: '0.9.0', commit: 'aaaaaaaaaaaa', source: 'explicit' })
  assert.deepEqual(resolveBuildMetadata({ version: '0.9.0', env: { CF_PAGES_COMMIT_SHA: 'b'.repeat(40), VERCEL_GIT_COMMIT_SHA: 'c'.repeat(40) } }), { version: '0.9.0', commit: 'bbbbbbbbbbbb', source: 'cloudflare' })
  assert.deepEqual(resolveBuildMetadata({ version: '0.9.0', env: { VERCEL_GIT_COMMIT_SHA: 'c'.repeat(40) } }), { version: '0.9.0', commit: 'cccccccccccc', source: 'vercel' })
})

test('invalid or missing commit metadata falls back to unknown without exposing arbitrary env values', () => {
  assert.deepEqual(resolveBuildMetadata({ version: '0.9.0', env: { OPENEUV_COMMIT_SHA: 'not-a-sha', SECRET_TOKEN: 'do-not-expose' } }), { version: '0.9.0', commit: 'unknown', source: 'unknown' })
})
