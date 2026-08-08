import test from 'node:test'
import assert from 'node:assert/strict'
import { buildResearchSnapshot, serializeResearchSnapshot, validateResearchSnapshot } from '../src/lib/researchSnapshot.mjs'

const input = {
  generatedAt: '2026-08-08T12:00:00.000Z',
  build: { version: '0.9.0', commit: 'abcdef123456', source: 'cloudflare' },
  claims: [{ id: 'A-1', class: 'A', claim: 'Public claim', sources: [{ name: 'Example', url: 'https://example.com/source' }] }],
  unknowns: [{ id: 'U-1', status: 'open', question: 'Open question' }],
  fabCases: [{ id: 'fab-1', sourceUrls: ['https://example.com/fab'] }],
  manifest: { schemaVersion: '1.0.0', datasets: [{ id: 'claims', path: 'evidence/claims.json', userAgent: 'must-not-export', 'User-Agent': 'also-private' }] },
  reviewCoverage: { reviewedRecords: 0, missingReviewedRecords: 10 },
  provenanceCoverage: { evidence: { claims: 1 }, ipAddress: 'must-not-export', IP_Address: 'also-private' },
}

test('research snapshot v2 is deterministic and carries public build provenance', () => {
  const first = buildResearchSnapshot(input)
  const second = buildResearchSnapshot(input)
  assert.deepEqual(first, second)
  assert.equal(first.schemaVersion, 2)
  assert.deepEqual(first.build, input.build)
  assert.equal(serializeResearchSnapshot(first), serializeResearchSnapshot(second))
})

test('research snapshot strips client/private fields recursively regardless of key formatting', () => {
  const snapshot = buildResearchSnapshot(input)
  const serialized = serializeResearchSnapshot(snapshot)
  assert.doesNotMatch(serialized, /must-not-export|also-private/)
  assert.doesNotMatch(serialized, /userAgent|User-Agent|ipAddress|IP_Address/)
  assert.equal(snapshot.privacy.clientTelemetryIncluded, false)
  assert.equal(validateResearchSnapshot(snapshot).ok, true)
})

test('research snapshot validator rejects forbidden fields supplied after construction', () => {
  const snapshot = buildResearchSnapshot(input)
  snapshot.browser = { hardwareConcurrency: 16, 'Device-Memory': 8 }
  const validation = validateResearchSnapshot(snapshot)
  assert.equal(validation.ok, false)
  assert.ok(validation.errors.some((error) => error.includes('hardwareConcurrency')))
  assert.ok(validation.errors.some((error) => error.includes('Device-Memory')))
})

test('research snapshot requires explicit valid generatedAt and build metadata', () => {
  assert.throws(() => buildResearchSnapshot({ ...input, generatedAt: '' }), /generatedAt/)
  assert.throws(() => buildResearchSnapshot({ ...input, generatedAt: 'not-a-date' }), /generatedAt/)
  const snapshot = buildResearchSnapshot(input)
  delete snapshot.build
  assert.equal(validateResearchSnapshot(snapshot).ok, false)
})
