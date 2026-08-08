import assert from 'node:assert/strict'
import test from 'node:test'
import { renderProvenanceMarkdown, summarizeProvenance } from '../src/lib/provenanceReport.mjs'

const base = {
  claims: [
    { id: 'A-1', class: 'A', component: 'projection', claim: 'First-party fact', sources: [{ name: 'ZEISS public page', url: 'https://www.zeiss.com/fact' }] },
    { id: 'D-1', class: 'D', component: 'system', claim: 'Bounded inference', rationale: 'Cross-source functional grouping.', sources: [{ name: 'Patent', url: 'https://patents.example/item' }] },
  ],
  unknowns: [{ id: 'U-1', component: 'metrology', status: 'open' }],
  reviews: { reviews: [{ id: 'A-1', state: 'reviewed', reviewers: ['reviewer'] }] },
  patents: [{ id: 'P-1', assignee: 'Example Patent Assignee', url: 'https://patents.google.com/patent/P-1/en' }],
  patentAudit: { publications: 1, families: 1, averageCompleteness: 0.9, errors: [], warnings: [] },
  fabCases: [{ id: 'fab-1', organization: 'TSMC', sourceUrls: ['https://www.tsmc.com/source'] }],
  dataGaps: [{
    target: { material: 'Si', wavelengthNm: 13.5 },
    decision: 'keep-illustrative-until-data-exists',
    candidates: [{ source: 'Public EUV candidate', license: 'redistribution-not-verified', vendorable: false, coversTarget: true, reason: 'Redistribution permission not verified.' }],
  }],
}

test('provenance summary groups evidence, domains, organizations, review state and explicit gaps', () => {
  const summary = summarizeProvenance(base)
  assert.equal(summary.evidence.claims, 2)
  assert.equal(summary.evidence.byClass.A, 1)
  assert.equal(summary.evidence.byClass.D, 1)
  assert.equal(summary.evidence.byComponent.projection, 1)
  assert.equal(summary.evidence.byReviewState.reviewed, 1)
  assert.equal(summary.evidence.byReviewState.unreviewed, 2)
  assert.equal(summary.evidence.bySourceDomain['zeiss.com'], 1)
  assert.equal(summary.evidence.bySourceDomain['tsmc.com'], 1)
  assert.equal(summary.evidence.bySourceDomain['patents.google.com'], 1)
  assert.equal(summary.evidence.bySourceOrganization.ZEISS, 1)
  assert.equal(summary.evidence.bySourceOrganization.TSMC, 1)
  assert.equal(summary.evidence.bySourceOrganization['Example Patent Assignee'], 1)
  assert.equal(summary.dataGaps[0].material, 'Si')
  assert.equal(summary.dataLicenseGaps.length, 1)
  assert.match(summary.dataLicenseGaps[0].license, /not-verified/)
  const markdown = renderProvenanceMarkdown(summary)
  assert.match(markdown, /metadata\/source coverage/i)
  assert.match(markdown, /Source organizations \/ assignees/i)
  assert.match(markdown, /redistribution-not-verified/i)
  assert.match(markdown, /does not rank commercial importance/i)
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
  input.fabCases.push({ id: 'fab-no-source', organization: 'Example', sourceUrls: [] }, { id: 'fab-invalid', organization: 'Example', sourceUrls: ['internal://private'] })
  const summary = summarizeProvenance(input)
  assert.deepEqual(summary.fab.casesWithoutDirectSources, ['fab-no-source'])
  assert.deepEqual(summary.fab.invalidSourceUrls, ['fab-invalid:internal://private'])
})

test('resolved unknowns do not remain in unresolved coverage', () => {
  const input = structuredClone(base)
  input.unknowns.push({ id: 'U-RESOLVED', component: 'source', status: 'resolved' })
  const summary = summarizeProvenance(input)
  assert.deepEqual(summary.evidence.openUnknownIds, ['U-1'])
})
