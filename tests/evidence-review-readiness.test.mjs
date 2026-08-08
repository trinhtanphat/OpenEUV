import test from 'node:test'
import assert from 'node:assert/strict'
import { summarizeEvidenceReviewReadiness } from '../src/lib/evidenceReviewReadiness.mjs'

const claims = [
  { id: 'A-1', class: 'A' },
  { id: 'B-1', class: 'B' },
  { id: 'C-1', class: 'C' },
]
const unknowns = [{ id: 'U-1' }]

test('empty real-review registry reports the full 10-record campaign gap', () => {
  const summary = summarizeEvidenceReviewReadiness({ claims, unknowns, registry: { version: 1, reviews: [] } })
  assert.equal(summary.reviewedRecords, 0)
  assert.equal(summary.minimumReviewedRecords, 10)
  assert.equal(summary.missingReviewedRecords, 10)
  assert.equal(summary.readyForMinimumCampaignCount, false)
  assert.deepEqual(summary.reviewedCategories, [])
  assert.deepEqual(summary.availableCategories, ['Class A', 'Class B', 'Class C', 'Unknown'])
})

test('only genuinely reviewed records with reviewer handles count toward readiness', () => {
  const summary = summarizeEvidenceReviewReadiness({
    claims,
    unknowns,
    minimumReviewedRecords: 2,
    registry: {
      version: 1,
      reviews: [
        { id: 'A-1', state: 'reviewed', reviewers: ['real-reviewer-a'] },
        { id: 'B-1', state: 'proposed', reviewers: ['real-reviewer-b'] },
        { id: 'C-1', state: 'superseded', reviewers: ['real-reviewer-c'], supersededBy: 'A-1' },
        { id: 'U-1', state: 'reviewed', reviewers: ['real-reviewer-d'] },
      ],
    },
  })
  assert.equal(summary.reviewedRecords, 2)
  assert.equal(summary.missingReviewedRecords, 0)
  assert.equal(summary.readyForMinimumCampaignCount, true)
  assert.deepEqual(summary.reviewedCategories, ['Class A', 'Unknown'])
  assert.deepEqual(summary.uncoveredCategories, ['Class B', 'Class C'])
})

test('a reviewed state without reviewer attribution is not counted by readiness summary', () => {
  const summary = summarizeEvidenceReviewReadiness({
    claims,
    unknowns,
    minimumReviewedRecords: 1,
    registry: { version: 1, reviews: [{ id: 'A-1', state: 'reviewed', reviewers: [] }] },
  })
  assert.equal(summary.reviewedRecords, 0)
  assert.equal(summary.missingReviewedRecords, 1)
  assert.equal(summary.readyForMinimumCampaignCount, false)
})
