import test from 'node:test'
import assert from 'node:assert/strict'
import { auditPatentRecords, patentMetadataCompleteness } from '../src/lib/patentAudit.mjs'

const base = {
  id: 'EP1234567A1',
  familyId: 'TEST-FAMILY-001',
  familyMembers: ['EP1234567A1', 'WO1234567A1'],
  title: 'Test public patent metadata record',
  priorityDate: '2020-01-01',
  publicationDate: '2022-01-01',
  subsystem: 'projection',
  linkedSubsystems: ['projection'],
  assignee: 'Test assignee',
  applicationNumber: 'EPTEST',
  summary: 'Original OpenEUV test summary.',
  url: 'https://patents.google.com/patent/EP1234567A1/en'
}

test('complete metadata scores 100 percent', () => {
  const result = patentMetadataCompleteness(base)
  assert.equal(result.percent, 100)
  assert.deepEqual(result.missing, [])
})

test('audit catches duplicate publication and cross-family member reuse', () => {
  const result = auditPatentRecords([
    base,
    { ...base, familyId: 'OTHER-FAMILY', familyMembers: ['EP1234567A1'] }
  ])
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.includes('duplicate publication')))
  assert.ok(result.errors.some((error) => error.includes('appears in both')))
})

test('audit catches conflicting priority dates within one family', () => {
  const result = auditPatentRecords([
    base,
    { ...base, id: 'WO1234567A1', priorityDate: '2021-01-01' }
  ])
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.includes('conflicting priority dates')))
})

test('audit catches publication dates before priority dates', () => {
  const result = auditPatentRecords([{ ...base, publicationDate: '2019-01-01' }])
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.includes('predates priority date')))
})
