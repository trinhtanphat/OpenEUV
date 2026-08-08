import test from 'node:test'
import assert from 'node:assert/strict'
import { buildResearchSnapshot, serializeResearchSnapshot, validateResearchSnapshot } from '../src/lib/researchSnapshot.mjs'

const input = {
  generatedAt: '2026-08-08T12:00:00.000Z',
  claims: [{ id: 'A-1', class: 'A', claim: 'Public claim', sources: [{ name: 'Example', url: 'https://example.com/source' }] }],
  unknowns: [{ id: 'U-1', status: 'open', question: 'Open question' }],
  fabCases: [{ id: 'fab-1', sourceUrls: ['https://example.com/fab'] }],
  manifest: { schemaVersion: '1.0.0', datasets: [{ id: 'claims', path: 'evidence/claims.json', userAgent: 'must-not-export' }] },
  reviewCoverage: { reviewedRecords: 0, missingReviewedRecords: 10 },
  provenanceCoverage: { evidence: { claims: 1 }, ipAddress: 'must-not-export' },
}

test('research snapshot is deterministic when generatedAt and inputs are fixed', () => {
  const first = buildResearchSnapshot(input)
  const second = buildResearchSnapshot(input)
  assert.deepEqual(first, second)
  assert.equal(serializeResearchSnapshot(first), serializeResearchSnapshot(second))
})

test('research snapshot strips client/private fields recursively', () => {
  const snapshot = buildResearchSnapshot(input)
  const serialized = serializeResearchSnapshot(snapshot)
  assert.doesNotMatch(serialized, /must-not-export/)
  assert.doesNotMatch(serialized, /userAgent|ipAddress/)
  assert.equal(snapshot.privacy.clientTelemetryIncluded, false)
  assert.equal(validateResearchSnapshot(snapshot).ok, true)
})

test('research snapshot validator rejects forbidden fields supplied after construction', () => {
  const snapshot = buildResearchSnapshot(input)
  snapshot.browser = { hardwareConcurrency: 16 }
  const validation = validateResearchSnapshot(snapshot)
  assert.equal(validation.ok, false)
  assert.ok(validation.errors.some((error) => error.includes('hardwareConcurrency')))
})

test('research snapshot requires explicit valid generatedAt', () => {
  assert.throws(() => buildResearchSnapshot({ ...input, generatedAt: '' }), /generatedAt/)
  assert.throws(() => buildResearchSnapshot({ ...input, generatedAt: 'not-a-date' }), /generatedAt/)
})
