import test from 'node:test'
import assert from 'node:assert/strict'
import { formatRepositoryPreflight, summarizeRepositoryPreflight } from '../src/lib/repositoryPreflight.mjs'

test('external research gaps do not fail repository integrity', () => {
  const summary = summarizeRepositoryPreflight({
    checks: [{ name: 'claims', ok: true }, { name: 'workflows', ok: true }],
    rendererReadiness: { pairedCaptures: 0, requiredPairedCaptures: 3, pairedDeviceClasses: 0, requiredDeviceClasses: 2, readyForDecision: false },
    reviewReadiness: { reviewedRecords: 0, minimumReviewedRecords: 10, readyForMinimumCampaignCount: false },
  })
  assert.equal(summary.ok, true)
  assert.equal(summary.failedChecks.length, 0)
  const report = formatRepositoryPreflight(summary)
  assert.match(report, /Integrity result: \*\*PASS\*\*/)
  assert.match(report, /0\/3 paired captures/)
  assert.match(report, /0\/10 genuine reviewed records/)
})

test('an invariant failure fails preflight independently of external readiness', () => {
  const summary = summarizeRepositoryPreflight({
    checks: [{ name: 'concept labels', ok: false, detail: 'Missing claim X' }],
    rendererReadiness: { pairedCaptures: 3, requiredPairedCaptures: 3, pairedDeviceClasses: 2, requiredDeviceClasses: 2, readyForDecision: true },
    reviewReadiness: { reviewedRecords: 10, minimumReviewedRecords: 10, readyForMinimumCampaignCount: true },
  })
  assert.equal(summary.ok, false)
  assert.equal(summary.failedChecks.length, 1)
  assert.match(formatRepositoryPreflight(summary), /Missing claim X/)
})

test('preflight counts only explicit invariant check booleans', () => {
  const summary = summarizeRepositoryPreflight({ checks: [{ name: 'a', ok: true }, { name: 'b', ok: true }, { name: 'c', ok: false }] })
  assert.equal(summary.invariantChecks, 3)
  assert.equal(summary.passedChecks, 2)
  assert.equal(summary.ok, false)
})
