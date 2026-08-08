import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { parsePatentRecordsFromTypeScript } from '../src/lib/patentSourceParser.mjs'

const repositorySource = await readFile(new URL('../src/data/patents.ts', import.meta.url), 'utf8')

test('patent parser reads the repository source without depending on object indentation', () => {
  const records = parsePatentRecordsFromTypeScript(repositorySource)
  assert.ok(records.length >= 8, `expected curated patent records, got ${records.length}`)
  assert.ok(records.some((record) => record.id === 'EP4239410A1'))
  assert.ok(records.some((record) => record.id === 'US8598551B2'))
  assert.ok(records.every((record) => record.url.startsWith('https://patents.google.com/')))
  assert.ok(records.every((record) => record.linkedSubsystems.length > 0))
})

test('patent parser tolerates formatting changes and braces inside quoted summaries', () => {
  const source = `
export const patents: PatentRecord[] = [
{ id: 'A1', familyId: 'F1', familyLabel: 'Family', familyMembers: ['A1'], title: 'One', priorityDate: '2020-01-01', publicationDate: '2021-01-01', subsystem: 'projection', linkedSubsystems: ['projection'], assignee: 'Example', summary: 'Quoted { brace } text', url: 'https://patents.google.com/patent/A1/en' },
  {
    id: 'B2',
    familyId: 'F2',
    familyLabel: 'Family 2',
    familyMembers: ['B2', 'B3'],
    title: 'Two',
    priorityDate: '2020-02-01',
    publicationDate: '2021-02-01',
    subsystem: 'metrology',
    linkedSubsystems: ['metrology', 'vacuum'],
    assignee: 'Example',
    summary: "Double-quoted } text",
    url: 'https://patents.google.com/patent/B2/en',
  },
]
export const patentFamilies = []
`
  const records = parsePatentRecordsFromTypeScript(source)
  assert.equal(records.length, 2)
  assert.equal(records[0].id, 'A1')
  assert.equal(records[0].summary, 'Quoted { brace } text')
  assert.deepEqual(records[1].familyMembers, ['B2', 'B3'])
  assert.deepEqual(records[1].linkedSubsystems, ['metrology', 'vacuum'])
})

test('patent parser returns no records for malformed or missing arrays', () => {
  assert.deepEqual(parsePatentRecordsFromTypeScript('export const somethingElse = []'), [])
  assert.deepEqual(parsePatentRecordsFromTypeScript('export const patents = [{ id: \'broken\' '), [])
})
