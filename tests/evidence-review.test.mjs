import test from 'node:test'
import assert from 'node:assert/strict'
import { canTransitionReviewState, validateReviewRecord, validateReviewRegistry } from '../src/lib/evidenceReview.mjs'

const knownIds = new Set(['CLAIM-OLD', 'CLAIM-NEW'])

test('proposed and reviewed records validate with public handles', () => {
  const proposed = validateReviewRecord({ id: 'CLAIM-OLD', state: 'proposed', contributors: ['researcher-1'] }, knownIds)
  assert.equal(proposed.ok, true)
  const reviewed = validateReviewRecord({ id: 'CLAIM-OLD', state: 'reviewed', contributors: ['researcher-1'], reviewers: ['reviewer-2'] }, knownIds)
  assert.equal(reviewed.ok, true)
})

test('reviewed records require a reviewer and private-like handles are rejected', () => {
  const missingReviewer = validateReviewRecord({ id: 'CLAIM-OLD', state: 'reviewed' }, knownIds)
  assert.equal(missingReviewer.ok, false)
  const badHandle = validateReviewRecord({ id: 'CLAIM-OLD', state: 'proposed', contributors: ['name@example.com'] }, knownIds)
  assert.equal(badHandle.ok, false)
})

test('superseded records require another known evidence ID', () => {
  const valid = validateReviewRecord({ id: 'CLAIM-OLD', state: 'superseded', reviewers: ['reviewer-2'], supersededBy: 'CLAIM-NEW' }, knownIds)
  assert.equal(valid.ok, true)
  const self = validateReviewRecord({ id: 'CLAIM-OLD', state: 'superseded', supersededBy: 'CLAIM-OLD' }, knownIds)
  assert.equal(self.ok, false)
})

test('review transition state machine prevents backward transitions', () => {
  assert.equal(canTransitionReviewState('proposed', 'reviewed'), true)
  assert.equal(canTransitionReviewState('reviewed', 'superseded'), true)
  assert.equal(canTransitionReviewState('reviewed', 'proposed'), false)
  assert.equal(canTransitionReviewState('superseded', 'reviewed'), false)
})

test('registry rejects duplicate review IDs and unknown evidence references', () => {
  const duplicate = validateReviewRegistry({ version: 1, reviews: [
    { id: 'CLAIM-OLD', state: 'proposed' },
    { id: 'CLAIM-OLD', state: 'proposed' },
  ] }, knownIds)
  assert.equal(duplicate.ok, false)
  assert.ok(duplicate.errors.some((error) => error.includes('duplicate review id')))
  const unknown = validateReviewRegistry({ version: 1, reviews: [{ id: 'UNKNOWN', state: 'proposed' }] }, knownIds)
  assert.equal(unknown.ok, false)
  assert.ok(unknown.errors.some((error) => error.includes('unknown evidence id')))
})
