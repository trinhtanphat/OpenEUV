import assert from 'node:assert/strict'
import test from 'node:test'
import { buildEvidenceReviewQueue, summarizeEvidenceReviewQueue } from '../src/lib/evidenceReviewQueue.mjs'

const claims = [
  { id: 'A-1', component: 'source', class: 'A', confidence: 1, claim: 'a1', sources: [{ name: 'A', url: 'https://example.com/a1' }] },
  { id: 'A-2', component: 'source', class: 'A', confidence: 0.9, claim: 'a2', sources: [{ name: 'A', url: 'https://example.com/a2' }] },
  { id: 'B-1', component: 'reticle', class: 'B', confidence: 0.98, claim: 'b1', sources: [{ name: 'B', url: 'https://example.com/b1' }] },
  { id: 'C-1', component: 'projection', class: 'C', confidence: 0.95, claim: 'c1', sources: [{ name: 'C', url: 'https://example.com/c1' }] },
  { id: 'D-1', component: 'system', class: 'D', confidence: 0.7, claim: 'd1', sources: [{ name: 'D', url: 'https://example.com/d1' }] },
]

const unknowns = [
  { id: 'U-HIGH', component: 'wafer', priority: 'high', question: 'high?', relatedClaimIds: [] },
  { id: 'U-LOW', component: 'vacuum', priority: 'low', question: 'low?', relatedClaimIds: [] },
]

test('queue excludes reviewed and superseded records while retaining proposed work', () => {
  const queue = buildEvidenceReviewQueue({
    claims,
    unknowns,
    reviews: [
      { id: 'A-1', state: 'reviewed', reviewers: ['real-reviewer'] },
      { id: 'B-1', state: 'superseded', supersededBy: 'B-2' },
      { id: 'C-1', state: 'proposed', contributors: ['contributor'] },
    ],
    limit: 10,
  })
  const ids = new Set(queue.map((item) => item.id))
  assert.equal(ids.has('A-1'), false)
  assert.equal(ids.has('B-1'), false)
  assert.equal(ids.has('C-1'), true)
  assert.equal(queue.find((item) => item.id === 'C-1').reviewState, 'proposed')
})

test('queue includes high-priority unknowns and round-robins evidence classes', () => {
  const queue = buildEvidenceReviewQueue({ claims, unknowns, reviews: [], limit: 6 })
  assert.equal(queue[0].id, 'U-HIGH')
  assert.equal(queue[1].id, 'U-LOW')
  const claimClasses = queue.filter((item) => item.recordType === 'claim').map((item) => item.evidenceClass)
  assert.deepEqual(claimClasses, ['A', 'B', 'C', 'D'])
  const summary = summarizeEvidenceReviewQueue(queue)
  assert.equal(summary.total, 6)
  assert.equal(summary.byType.unknown, 2)
  assert.equal(summary.byType.claim, 4)
})

test('queue never invents reviewer or contributor identity fields', () => {
  const queue = buildEvidenceReviewQueue({ claims, unknowns, reviews: [], limit: 4 })
  for (const item of queue) {
    assert.equal('reviewer' in item, false)
    assert.equal('reviewers' in item, false)
    assert.equal('contributor' in item, false)
    assert.equal('contributors' in item, false)
  }
})

test('queue is deterministic for identical input', () => {
  const first = buildEvidenceReviewQueue({ claims, unknowns, reviews: [], limit: 7 })
  const second = buildEvidenceReviewQueue({ claims, unknowns, reviews: [], limit: 7 })
  assert.deepEqual(first, second)
})
