import test from 'node:test'
import assert from 'node:assert/strict'
import { validateFabCaseCollection, validateFabCaseRecord } from '../src/lib/fabCaseMetadata.mjs'

const knownClaims = new Set(['TEST-CLAIM-001'])
const fixture = {
  id: 'test-foundry-case',
  kind: 'foundry',
  organization: 'Test Foundry',
  year: '2025',
  title: 'Test-only public milestone',
  summary: 'A synthetic unit-test summary describing a public milestone without any private recipe or operating detail.',
  whyItMatters: 'It verifies that public milestones and their significance are represented separately from private process details.',
  claimIds: ['TEST-CLAIM-001'],
  sourceUrls: ['https://example.org/public-source'],
  publicBoundary: 'This test case does not establish recipes, layer counts, line layouts, yield, thresholds or proprietary controls.',
  unknowns: ['Private process details remain unknown']
}

test('valid fab case requires claim IDs, source URLs, boundary and unknowns', () => {
  const result = validateFabCaseRecord(fixture, 0, knownClaims)
  assert.equal(result.ok, true, result.errors.join('; '))
})

test('unknown claim IDs are rejected when a claim registry is supplied', () => {
  const result = validateFabCaseRecord({ ...fixture, claimIds: ['MISSING-CLAIM'] }, 0, knownClaims)
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.includes('unknown claim ID')))
})

test('weak public boundaries and empty unknowns are rejected', () => {
  const result = validateFabCaseRecord({ ...fixture, publicBoundary: 'unknown', unknowns: [] }, 0, knownClaims)
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.includes('publicBoundary')))
  assert.ok(result.errors.some((error) => error.includes('explicit unknown')))
})

test('collection rejects duplicate case IDs', () => {
  const result = validateFabCaseCollection([fixture, { ...fixture }], knownClaims)
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.includes('duplicate fab case ID')))
})
