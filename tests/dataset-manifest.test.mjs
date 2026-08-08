import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { summarizeDatasetManifest, validateDatasetManifest } from '../src/lib/datasetManifest.mjs'

const manifest = JSON.parse(await readFile(new URL('../datasets/manifest.json', import.meta.url), 'utf8'))

test('repository dataset manifest is valid and includes measured public optical data', () => {
  const result = validateDatasetManifest(manifest)
  assert.equal(result.ok, true, result.errors.join('; '))
  assert.equal(result.manifest.datasets.length, 8)
  const mo = result.manifest.datasets.find((dataset) => dataset.id === 'optical-constants-mo-windt-1988')
  assert.ok(mo)
  assert.match(mo.license, /CC0/i)
  assert.match(mo.source, /6f3b772c3339d68a21538cb2562d2acb36731302/)
  const fabCases = result.manifest.datasets.find((dataset) => dataset.id === 'fab-case-studies')
  assert.ok(fabCases)
  assert.equal(fabCases.path, 'evidence/fab-cases.json')
  const siliconGap = result.manifest.datasets.find((dataset) => dataset.id === 'optical-data-gap-silicon-euv')
  assert.ok(siliconGap)
  assert.equal(siliconGap.path, 'evidence/optical-data-gaps.json')
  assert.match(siliconGap.provenance, /without copying numerical tables/i)
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
  assert.equal(summary.datasets, 8)
  assert.equal(summary.byKind.evidence, 2)
  assert.equal(summary.byKind['evidence-review-metadata'], 1)
  assert.equal(summary.byKind['fab-case-metadata'], 1)
  assert.equal(summary.byKind['patent-metadata'], 1)
  assert.equal(summary.byKind['optical-constants'], 1)
  assert.equal(summary.byKind['optical-data-gap-metadata'], 1)
})
