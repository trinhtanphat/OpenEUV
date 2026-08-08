import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { summarizeDatasetManifest, validateDatasetManifest } from '../src/lib/datasetManifest.mjs'

const manifest = JSON.parse(await readFile(new URL('../datasets/manifest.json', import.meta.url), 'utf8'))

test('repository dataset manifest is valid', () => {
  const result = validateDatasetManifest(manifest)
  assert.equal(result.ok, true, result.errors.join('; '))
  assert.equal(result.manifest.datasets.length, 4)
})

test('manifest rejects duplicate IDs and invalid semantic versions', () => {
  const duplicate = { ...manifest, schemaVersion: '1', datasets: [...manifest.datasets, { ...manifest.datasets[0] }] }
  const result = validateDatasetManifest(duplicate)
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.includes('schemaVersion')))
  assert.ok(result.errors.some((error) => error.includes('duplicate id')))
})

test('manifest requires provenance and redistribution notes', () => {
  const broken = { ...manifest, datasets: [{ ...manifest.datasets[0], provenance: '', license: '' }] }
  const result = validateDatasetManifest(broken)
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.includes('provenance')))
  assert.ok(result.errors.some((error) => error.includes('license')))
})

test('manifest summary groups datasets by kind', () => {
  const summary = summarizeDatasetManifest(manifest)
  assert.equal(summary.datasets, 4)
  assert.equal(summary.byKind.evidence, 2)
  assert.equal(summary.byKind['patent-metadata'], 1)
})
