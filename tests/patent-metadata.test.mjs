import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizePatentRecords, parsePatentCsv, patentCoverage } from '../src/lib/patentMetadata.mjs'

const fixture = {
  id: 'EP4045949A1',
  familyId: 'COLLECTOR-PUMP-GRATING-2019',
  familyLabel: 'Collector family',
  familyMembers: ['EP4045949A1', 'EP4045949B1'],
  title: 'EUV collector mirror',
  priorityDate: '2019-10-15',
  publicationDate: '2022-08-24',
  subsystem: 'collector',
  linkedSubsystems: ['source', 'collector'],
  assignee: 'Example assignee',
  summary: 'Original test summary for public patent metadata normalization.',
  url: 'https://patents.google.com/patent/EP4045949A1/en'
}

test('normalizer accepts valid public patent metadata', () => {
  const result = normalizePatentRecords([fixture])
  assert.equal(result.ok, true)
  assert.equal(result.records[0].confidence, 'patent')
  assert.equal(result.coverage.families, 1)
  assert.equal(result.coverage.bySubsystem.collector, 1)
})

test('normalizer rejects duplicate publication ids', () => {
  const result = normalizePatentRecords([fixture, { ...fixture }])
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.includes('duplicate publication id')))
})

test('normalizer rejects invalid dates, source hosts and subsystem names', () => {
  const result = normalizePatentRecords([{ ...fixture, priorityDate: '2019', subsystem: 'secret', url: 'https://example.org/patent' }])
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.includes('priorityDate')))
  assert.ok(result.errors.some((error) => error.includes('invalid subsystem')))
  assert.ok(result.errors.some((error) => error.includes('Google Patents')))
})

test('CSV parser preserves list fields for the normalizer', () => {
  const csv = 'id,familyId,title,priorityDate,publicationDate,subsystem,linkedSubsystems,assignee,summary,url\nEP4045949A1,COLLECTOR-PUMP-GRATING-2019,EUV collector mirror,2019-10-15,2022-08-24,collector,"source;collector",Example assignee,Original summary,https://patents.google.com/patent/EP4045949A1/en\n'
  const rows = parsePatentCsv(csv)
  const result = normalizePatentRecords(rows)
  assert.equal(result.ok, true)
  assert.deepEqual(result.records[0].linkedSubsystems, ['source', 'collector'])
})

test('coverage counts each linked subsystem once per publication', () => {
  const coverage = patentCoverage([{ ...fixture, linkedSubsystems: ['collector', 'collector', 'source'] }])
  assert.equal(coverage.bySubsystem.collector, 1)
  assert.equal(coverage.bySubsystem.source, 1)
})
