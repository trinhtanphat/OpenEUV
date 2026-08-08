import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

function runImporter(sourceUrl = 'https://github.com/polyanskiy/refractiveindex.info-database/blob/test/database/data/main/Test.yml') {
  return spawnSync('node', [
    'tools/import-refractiveindex-yaml.mjs',
    'tests/fixtures/refractiveindex-test.yml',
    'Test material',
    'TEST-ONLY-OPTICAL-001',
    sourceUrl,
    'test-revision',
  ], { encoding: 'utf8' })
}

test('refractiveindex importer converts micrometers to nanometers and preserves provenance', () => {
  const result = runImporter()
  assert.equal(result.status, 0, result.stderr)
  const dataset = JSON.parse(result.stdout)
  assert.equal(dataset.samples.length, 3)
  assert.equal(dataset.samples[1].wavelengthNm, 13.5)
  assert.equal(dataset.samples[1].n, 0.95)
  assert.equal(dataset.samples[1].k, 0.03)
  assert.match(dataset.source.name, /test-revision/)
  assert.match(dataset.license, /CC0/)
  assert.match(dataset.provenanceNote, /Synthetic test-only record/)
})

test('imported dataset keeps the exact public source URL', () => {
  const sourceUrl = 'https://github.com/polyanskiy/refractiveindex.info-database/blob/test/example.yml'
  const result = runImporter(sourceUrl)
  assert.equal(result.status, 0, result.stderr)
  assert.equal(JSON.parse(result.stdout).source.url, sourceUrl)
})
