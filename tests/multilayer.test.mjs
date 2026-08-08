import test from 'node:test'
import assert from 'node:assert/strict'
import { braggPeriodNm, multilayerReflectivity } from '../src/lib/multilayer.mjs'

const illustrative = {
  wavelengthNm: 13.5,
  pairs: 30,
  materialA: { n: 0.92, k: 0.015, thicknessNm: 2.8 },
  materialB: { n: 0.995, k: 0.004, thicknessNm: 4.1 },
}

test('first-order Bragg period proxy is lambda/2 at normal incidence', () => {
  assert.ok(Math.abs(braggPeriodNm(13.5, 0) - 6.75) < 1e-9)
})

test('matched optical media produce negligible reflection', () => {
  const result = multilayerReflectivity({
    wavelengthNm: 13.5,
    pairs: 20,
    materialA: { n: 1, k: 0, thicknessNm: 3.2 },
    materialB: { n: 1, k: 0, thicknessNm: 3.5 },
    incident: { n: 1, k: 0 },
    substrate: { n: 1, k: 0 },
  })
  assert.ok(result.reflectivity < 1e-10)
})

test('s and p polarization are equivalent at normal incidence', () => {
  const result = multilayerReflectivity({ ...illustrative, angleDeg: 0 })
  assert.ok(Math.abs(result.sReflectivity - result.pReflectivity) < 1e-10)
})

test('oblique s/p branches remain finite and bounded', () => {
  const result = multilayerReflectivity({ ...illustrative, angleDeg: 25 })
  for (const value of [result.reflectivity, result.sReflectivity, result.pReflectivity]) {
    assert.ok(Number.isFinite(value))
    assert.ok(value >= 0 && value <= 1)
  }
})

test('illustrative multilayer result stays finite and preserves physical period', () => {
  const result = multilayerReflectivity(illustrative)
  assert.ok(Number.isFinite(result.reflectivity))
  assert.ok(result.reflectivity >= 0 && result.reflectivity <= 1)
  assert.ok(Math.abs(result.physicalPeriodNm - 6.9) < 1e-12)
})
