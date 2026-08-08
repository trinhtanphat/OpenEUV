import test from 'node:test'
import assert from 'node:assert/strict'
import { parsePatentRecordsForCoverage, renderSourceCoverageMarkdown, summarizeSourceCoverage } from '../src/lib/sourceCoverage.mjs'

const patentSource = `
export const patents = [
  {
    id: 'EP1234567A1',
    familyId: 'FAMILY-A',
    familyMembers: ['EP1234567A1', 'WO1234567A1'],
    title: 'Public patent record',
    priorityDate: '2020-01-01',
    publicationDate: '2022-01-01',
    subsystem: 'projection',
    linkedSubsystems: ['projection', 'metrology'],
    assignee: 'Example Assignee',
    applicationNumber: 'EPTEST',
    summary: 'Original summary',
    url: 'https://patents.google.com/patent/EP1234567A1/en',
  },
]
`

test('patent TypeScript parser extracts coverage fields without evaluating code', () => {
  const records = parsePatentRecordsForCoverage(patentSource)
  assert.equal(records.length, 1)
  assert.equal(records[0].id, 'EP1234567A1')
  assert.deepEqual(records[0].linkedSubsystems, ['projection', 'metrology'])
  assert.deepEqual(records[0].familyMembers, ['EP1234567A1', 'WO1234567A1'])
  assert.equal(records[0].assignee, 'Example Assignee')
})

test('source coverage summarizes evidence, review, fab, patent and license gaps', () => {
  const report = summarizeSourceCoverage({
    claims: [
      { id: 'A-1', class: 'A', component: 'projection', claim: 'A', confidence: 1, sources: [{ name: 'ZEISS public page', url: 'https://www.zeiss.com/example' }] },
      { id: 'D-1', class: 'D', component: 'system', claim: 'D', confidence: 0.7, rationale: '', sources: [] },
    ],
    unknowns: [{ id: 'U-1', component: 'vacuum', status: 'open' }],
    reviews: { reviews: [{ id: 'A-1', state: 'reviewed', reviewers: ['real-reviewer'] }] },
    fabCases: [{ id: 'fab-a', sourceUrls: ['https://www.tsmc.com/example'] }, { id: 'fab-b', sourceUrls: [] }],
    patentRecords: parsePatentRecordsForCoverage(patentSource),
    opticalDataGaps: { candidates: [{ source: 'Public EUV candidate', license: 'redistribution-not-verified', coversTarget: true, vendorable: false, reason: 'license gap' }] },
  })

  assert.deepEqual(report.evidence.byClass, { A: 1, D: 1 })
  assert.deepEqual(report.evidence.noDirectSourceIds, ['D-1'])
  assert.deepEqual(report.evidence.inferenceRationaleGaps, ['D-1'])
  assert.equal(report.reviews.states.reviewed, 1)
  assert.equal(report.reviews.states.unreviewed, 2)
  assert.deepEqual(report.unknowns.unresolvedIds, ['U-1'])
  assert.equal(report.fabCases.withPublicSources, 1)
  assert.deepEqual(report.fabCases.withoutPublicSourceIds, ['fab-b'])
  assert.equal(report.patents.total, 1)
  assert.equal(report.patents.averageCompleteness, 1)
  assert.equal(report.dataLicenseGaps.length, 1)
  assert.equal(report.sources.byDomain['www.zeiss.com'], 1)
  assert.equal(report.sources.byDomain['www.tsmc.com'], 1)
})

test('markdown report states that coverage is not a commercial ranking', () => {
  const report = summarizeSourceCoverage({ claims: [], unknowns: [], reviews: { reviews: [] }, fabCases: [], patentRecords: [] })
  const markdown = renderSourceCoverageMarkdown(report)
  assert.match(markdown, /does not rank commercial importance/i)
  assert.match(markdown, /Evidence claims: 0/)
})
