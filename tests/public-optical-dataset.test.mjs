import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { sampleOpticalConstants, validateOpticalDataset } from '../src/lib/opticalConstants.mjs'

const dataset = JSON.parse(fs.readFileSync(new URL('../public/datasets/optical/mo-windt-1988.json', import.meta.url), 'utf8'))

test('pinned Mo/Windt CC0 dataset validates and covers the EUV neighborhood', () => {
  const validation = validateOpticalDataset(dataset)
  assert.equal(validation.ok, true, validation.errors.join('; '))
  assert.ok(validation.dataset)
  assert.match(validation.dataset.license, /CC0/i)
  assert.match(validation.dataset.source.url, /6f3b772c3339d68a21538cb2562d2acb36731302/)
  const sample = sampleOpticalConstants(validation.dataset, 13.5)
  assert.equal(sample.extrapolated, false)
  assert.ok(sample.n > 0.9 && sample.n < 1)
  assert.ok(sample.k > 0 && sample.k < 0.02)
})

test('pinned public dataset preserves the original 13.55 nm point', () => {
  const exact = dataset.samples.find((sample) => sample.wavelength === 13.55)
  assert.deepEqual(exact, { wavelength: 13.55, n: 0.9413, k: 0.00604 })
})
