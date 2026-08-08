import test from 'node:test'
import assert from 'node:assert/strict'
import { assignCitationKeys, baseCitationKey, literatureToBibtex, literatureToCslJson, serializeLiteratureCslJson } from '../src/lib/literatureCitation.mjs'

const record = {
  doi: '10.1234/example.1',
  title: 'Mask & multilayer {study}',
  year: 2026,
  authors: ['Nguyễn Văn Đỗ', 'A. Example'],
  sourceName: 'Public source',
  sourceUrl: 'https://example.com/paper',
  publicationType: 'conference',
}

test('citation keys are deterministic and include public-metadata hash entropy', () => {
  const key = baseCitationKey(record)
  assert.match(key, /^do2026[0-9a-f]{8}$/)
  assert.equal(baseCitationKey(record), key)
  assert.notEqual(baseCitationKey({ ...record, doi: '10.1234/example.2' }), key)
})

test('collision fallback is deterministic for repeated base keys', () => {
  const assigned = assignCitationKeys([record, { ...record, doi: '10.1234/example.2' }], () => 'same')
  assert.deepEqual(assigned.map((item) => item.key), ['same', 'same-2'])
})

test('BibTeX export preserves only known metadata and escapes special characters', () => {
  const text = literatureToBibtex([record])
  assert.match(text, /^@inproceedings\{/)
  assert.match(text, /title = \{Mask \\& multilayer \\\{study\\\}\}/)
  assert.match(text, /doi = \{10\.1234\/example\.1\}/)
  assert.match(text, /url = \{https:\/\/example\.com\/paper\}/)
  assert.doesNotMatch(text, /volume|pages|publisher/)
})

test('CSL JSON keeps author names literal instead of guessing name parts', () => {
  const csl = literatureToCslJson([record])
  assert.equal(csl[0].type, 'paper-conference')
  assert.deepEqual(csl[0].author[0], { literal: 'Nguyễn Văn Đỗ' })
  assert.deepEqual(csl[0].issued, { 'date-parts': [[2026]] })
  assert.equal(JSON.parse(serializeLiteratureCslJson([record]))[0].DOI, record.doi)
})
