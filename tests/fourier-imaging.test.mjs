import assert from 'node:assert/strict'
import test from 'node:test'
import { circularPupilMtf, reconstructNormalizedSquarePattern, sampleCircularPupilMtf } from '../src/lib/fourierImaging.mjs'

test('circular-pupil MTF is bounded and decreases from DC to cutoff', () => {
  assert.equal(circularPupilMtf(0), 1)
  assert.equal(circularPupilMtf(1), 0)
  const curve = sampleCircularPupilMtf(80)
  for (let index = 1; index < curve.length; index += 1) {
    assert.ok(curve[index].transfer <= curve[index - 1].transfer + 1e-12)
    assert.ok(curve[index].transfer >= 0 && curve[index].transfer <= 1)
  }
})

test('frequency above the normalized cutoff loses square-pattern contrast', () => {
  const result = reconstructNormalizedSquarePattern({ baseFrequency: 0.5, cutoff: 0.3 })
  assert.equal(result.passedHarmonics, 0)
  assert.equal(result.fundamentalTransfer, 0)
  assert.ok(result.contrast < 1e-9)
})

test('larger normalized cutoff passes more harmonics and contrast', () => {
  const narrow = reconstructNormalizedSquarePattern({ baseFrequency: 0.16, cutoff: 0.3 })
  const wide = reconstructNormalizedSquarePattern({ baseFrequency: 0.16, cutoff: 1.0 })
  assert.ok(wide.passedHarmonics > narrow.passedHarmonics)
  assert.ok(wide.fundamentalTransfer > narrow.fundamentalTransfer)
  assert.ok(wide.contrast >= narrow.contrast)
})

test('reconstruction stays normalized and deterministic', () => {
  const first = reconstructNormalizedSquarePattern({ baseFrequency: 0.2, cutoff: 0.7, samples: 96 })
  const second = reconstructNormalizedSquarePattern({ baseFrequency: 0.2, cutoff: 0.7, samples: 96 })
  assert.deepEqual(first, second)
  assert.equal(first.points.length, 96)
  assert.ok(first.points.every((point) => point.image >= 0 && point.image <= 1 && (point.object === 0 || point.object === 1)))
})
