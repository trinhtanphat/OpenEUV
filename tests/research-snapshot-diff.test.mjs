import test from 'node:test'
import assert from 'node:assert/strict'
import { buildResearchSnapshot } from '../src/lib/researchSnapshot.mjs'
import { diffResearchSnapshots } from '../src/lib/researchSnapshotDiff.mjs'

function snapshot(overrides = {}) {
  return buildResearchSnapshot({
    generatedAt: '2026-08-08T12:00:00.000Z',
    build: { version: '0.9.0', commit: '0123456789ab', source: 'explicit' },
    claims: [{ id: 'A-1', class: 'A', claim: 'one' }],
    unknowns: [{ id: 'U-1', status: 'open', question: 'q' }],
    fabCases: [{ id: 'fab-1', summary: 's' }],
    manifest: { schemaVersion: '1.0.0', datasets: [{ id: 'claims', path: 'evidence/claims.json' }] },
    reviewCoverage: { reviewedRecords: 0 },
    provenanceCoverage: { evidence: { claims: 1 } },
    ...overrides,
  })
}

test('timestamp-only changes do not count as research content changes', () => {
  const before = snapshot()
  const after = snapshot({ generatedAt: '2026-08-08T13:00:00.000Z' })
  const diff = diffResearchSnapshots(before, after)
  assert.equal(diff.contentChanged, false)
  assert.equal(diff.timestampOnlyChange, true)
})

test('snapshot diff reports added removed and changed stable IDs', () => {
  const before = snapshot()
  const after = snapshot({
    claims: [{ id: 'A-1', class: 'A', claim: 'changed' }, { id: 'A-2', class: 'A', claim: 'new' }],
    unknowns: [],
    fabCases: [{ id: 'fab-1', summary: 's' }],
    manifest: { schemaVersion: '1.0.0', datasets: [{ id: 'claims', path: 'evidence/claims-v2.json' }, { id: 'fab', path: 'evidence/fab-cases.json' }] },
  })
  const diff = diffResearchSnapshots(before, after)
  assert.deepEqual(diff.claims.added, ['A-2'])
  assert.deepEqual(diff.claims.changed, ['A-1'])
  assert.deepEqual(diff.unknowns.removed, ['U-1'])
  assert.deepEqual(diff.datasets.added, ['fab'])
  assert.deepEqual(diff.datasets.changed, ['claims'])
  assert.equal(diff.contentChanged, true)
})

test('build and coverage changes are reported separately from content collections', () => {
  const before = snapshot()
  const after = snapshot({
    build: { version: '1.0.0', commit: 'abcdef012345', source: 'vercel' },
    reviewCoverage: { reviewedRecords: 1 },
  })
  const diff = diffResearchSnapshots(before, after)
  assert.equal(diff.contentChanged, false)
  assert.equal(diff.buildChanged, true)
  assert.equal(diff.reviewCoverageChanged, true)
  assert.equal(diff.timestampOnlyChange, false)
})

test('diff refuses privacy-unsafe or malformed snapshots', () => {
  const before = snapshot()
  const after = snapshot()
  after.client = { IP_Address: 'private' }
  assert.throws(() => diffResearchSnapshots(before, after), /after snapshot invalid/)

  const duplicate = snapshot({ claims: [{ id: 'A-1' }, { id: 'A-1' }] })
  assert.throws(() => diffResearchSnapshots(before, duplicate), /duplicate id A-1/)
})
