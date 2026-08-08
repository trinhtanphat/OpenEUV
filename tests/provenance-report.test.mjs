import assert from 'node:assert/strict'
import test from 'node:test'
import { renderProvenanceMarkdown, summarizeProvenance } from '../src/lib/provenanceReport.mjs'

const base = {
  claims: [
    { id: 'A-1', class: 'A', component: 'projection', claim: 'First-party fact', sources: [{ name: 'Vendor', url: 'https://vendor.example/fact' }] },
    { id: 'D-1', class: 'D', component: 'system', claim: 'Bounded inference', rationale: 'Cross-source functional grouping.', sources: [{ name: 'Patent', url: 'https://patents.example/item' }] },
  ],
  unknowns: [{ id: 'U-1', component: 'metrology', status: 'open' }],
  reviews: { reviews: [{ id: 'A-1', state: 'reviewed', reviewers: ['reviewer'] }] },
  patents: [{ id: 'P-1' }],
  patentAudit: { publications: 1, families: 1, averageCompleteness: 0.9, errors: [], warnings: [] },
  fabCases: [{ id: 'fab-1', sourceUrls: ['https://foundry.example/source'] }],
  dataGaps: [{ target: { material: 'Si', wavelengthNm: 13.5 }, decision: 'keep-illustrative-until-data-exists' }],
}

test('provenance summary groups evidence, domains, review state and explicit gaps', () => {
  const summary = summarizeProvenance(base)
  assert.equal(summary.evidence.claims, 2)
  assert.equal(summary.evidence.byClass.A, 1)
  assert.equal(summary.evidence.byClass.D, 1)
  assert.equal(summary.evidence.byReviewState.reviewed, 1)
  assert.equal(summary.evidence.byReviewState.unreviewed, 2)
  assert.equal(summary.evidence.bySourceDomain['vendor.example'], 1)
  assert.equal(summary.dataGaps[0].material, 'Si')
  assert.match(renderProvenanceMarkdown(summary), /metadata\/source coverage/i)
})

test('missing direct sources and class-D rationale are surfaced', () => {
  const input = structuredClone(base)
  input.claims.push({ id: 'D-BROKEN', class: 'D', component: 'source', claim: 'Missing support', sources: [] })
  const summary = summarizeProvenance(input)
  assert.deepEqual(summary.evidence.recordsWithoutDirectSource, ['D-BROKEN'])
  assert.deepEqual(summary.evidence.inferenceRationaleGaps, ['D-BROKEN'])
})

test('fab source coverage never treats non-http strings as public sources', () => {
  const input = structuredClone(base)
  input.fabCases.push({ id: 'fab-no-source', sourceUrls: [] }, { id: 'fab-invalid', sourceUrls: ['internal://private'] })
  const summary = summarizeProvenance(input)
  assert.deepEqual(summary.fab.casesWithoutDirectSources, ['fab-no-source'])
  assert.deepEqual(summary.fab.invalidSourceUrls, ['fab-invalid:internal://private'])
})
