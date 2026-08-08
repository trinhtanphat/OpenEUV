import test from 'node:test'
import assert from 'node:assert/strict'
import { literatureCoverage, normalizeLiteratureRecords, parseLiteratureCsv } from '../src/lib/literatureMetadata.mjs'

const fixture = {
  doi: '10.1234/OPENEUV.TEST.001',
  title: 'Test-only academic metadata record',
  year: '2025',
  authors: ['Researcher A', 'Researcher B'],
  sourceName: 'Public test venue',
  sourceUrl: 'https://example.org/public-paper',
  summary: 'Original test summary; no copyrighted paper text is stored.',
  topics: ['optics', 'multilayer'],
}

test('normalizer accepts valid DOI metadata and canonicalizes DOI', () => {
  const result = normalizeLiteratureRecords([fixture])
  assert.equal(result.ok, true)
  assert.equal(result.records[0].doi, '10.1234/openeuv.test.001')
  assert.equal(result.coverage.byTopic.optics, 1)
})

test('normalizer rejects duplicate DOI and invalid topic', () => {
  const result = normalizeLiteratureRecords([fixture, { ...fixture, topics: ['not-a-topic'] }])
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.includes('invalid topic')))
})

test('normalizer rejects malformed DOI and year', () => {
  const result = normalizeLiteratureRecords([{ ...fixture, doi: 'not-doi', year: '25' }])
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.includes('invalid DOI')))
  assert.ok(result.errors.some((error) => error.includes('year must be YYYY')))
})

test('CSV parser supports list fields', () => {
  const csv = 'doi,title,year,authors,sourceName,sourceUrl,summary,topics\n10.1234/OPENEUV.TEST.001,Test paper,2025,"Researcher A;Researcher B",Public venue,https://example.org/paper,Original summary,"optics;multilayer"\n'
  const rows = parseLiteratureCsv(csv)
  const result = normalizeLiteratureRecords(rows)
  assert.equal(result.ok, true)
  assert.deepEqual(result.records[0].topics, ['optics', 'multilayer'])
})

test('coverage counts each topic once per record', () => {
  const coverage = literatureCoverage([{ topics: ['mask', 'mask', 'optics'] }])
  assert.equal(coverage.byTopic.mask, 1)
  assert.equal(coverage.byTopic.optics, 1)
})
