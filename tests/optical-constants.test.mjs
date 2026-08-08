import test from 'node:test'
import assert from 'node:assert/strict'
import { sampleOpticalConstants, validateOpticalDataset } from '../src/lib/opticalConstants.mjs'

const fixture = {
  id: 'TEST-ONLY-001',
  material: 'Unit test fixture',
  source: { name: 'Unit test metadata', url: 'https://example.org/' },
  license: 'TEST-ONLY',
  provenanceNote: 'Not measured data.',
  wavelengthUnit: 'nm',
  samples: [
    { wavelengthNm: 12, n: 0.9, k: 0.02 },
    { wavelengthNm: 14, n: 1.0, k: 0.04 }
  ]
}

test('valid fixture passes validation', () => {
  const result = validateOpticalDataset(fixture)
  assert.equal(result.ok, true)
  assert.equal(result.dataset.samples.length, 2)
})

test('invalid metadata and duplicate wavelength are rejected', () => {
  const result = validateOpticalDataset({
    ...fixture,
    source: { name: 'missing-url' },
    samples: [fixture.samples[0], { ...fixture.samples[0] }]
  })
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.includes('source.url')))
  assert.ok(result.errors.some((error) => error.includes('duplicate wavelength')))
})

test('interpolation is deterministic', () => {
  const sample = sampleOpticalConstants(fixture, 13)
  assert.ok(Math.abs(sample.n - 0.95) < 1e-12)
  assert.ok(Math.abs(sample.k - 0.03) < 1e-12)
  assert.equal(sample.extrapolated, false)
})
