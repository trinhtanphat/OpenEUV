import test from 'node:test'
import assert from 'node:assert/strict'
import { auditSourceLibrary, buildSourceLibrary, filterSourceLibrary } from '../src/lib/sourceLibrary.mjs'

const input = {
  claims: [
    { id: 'A-1', class: 'A', sources: [{ name: 'ASML example', url: 'https://www.asml.com/example/' }] },
    { id: 'C-1', class: 'C', sources: [{ name: 'Alternative label', url: 'https://www.asml.com/example' }] },
  ],
  fabCases: [{ id: 'fab-1', organization: 'TSMC', sourceUrls: ['https://www.tsmc.com/example'] }],
  patents: [{ id: 'EP1', title: 'Patent example', url: 'https://patents.google.com/patent/EP1/en', assignee: 'ASML Netherlands B.V.' }],
}

test('source library deduplicates canonical URLs and preserves explicit usages', () => {
  const sources = buildSourceLibrary(input)
  assert.equal(sources.length, 3)
  const asml = sources.find((source) => source.domain === 'asml.com')
  assert.ok(asml)
  assert.deepEqual(asml.evidenceClasses, ['A', 'C'])
  assert.equal(asml.usages.length, 2)
  assert.deepEqual(asml.labels, ['ASML example', 'Alternative label'])
})

test('citation audit treats multiple labels as warning but invalid URLs as errors', () => {
  const sources = buildSourceLibrary(input)
  const audit = auditSourceLibrary(sources)
  assert.equal(audit.ok, true)
  assert.ok(audit.warnings.some((warning) => warning.includes('multiple display labels')))

  const broken = buildSourceLibrary({ claims: [{ id: 'BAD', class: 'A', sources: [{ name: '', url: 'ftp://example.com/file' }] }] })
  const brokenAudit = auditSourceLibrary(broken)
  assert.equal(brokenAudit.ok, false)
  assert.ok(brokenAudit.errors.some((error) => error.includes('invalid or non-HTTP')))
  assert.ok(brokenAudit.errors.some((error) => error.includes('missing display label')))
})

test('source library filters by domain, usage type, evidence class and text', () => {
  const sources = buildSourceLibrary(input)
  assert.equal(filterSourceLibrary(sources, { domain: 'tsmc.com' }).length, 1)
  assert.equal(filterSourceLibrary(sources, { usageType: 'patent' }).length, 1)
  assert.equal(filterSourceLibrary(sources, { evidenceClass: 'C' }).length, 1)
  assert.equal(filterSourceLibrary(sources, { query: 'EP1' }).length, 1)
})
