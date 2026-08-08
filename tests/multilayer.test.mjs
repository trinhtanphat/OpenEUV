import test from 'node:test'
import assert from 'node:assert/strict'
import { braggPeriodNm, multilayerReflectivity } from '../src/lib/multilayer.mjs'

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

test('illustrative multilayer result stays finite and bounded', () => {
  const result = multilayerReflectivity({
    wavelengthNm: 13.5,
    pairs: 30,
    materialA: { n: 0.92, k: 0.015, thicknessNm: 2.8 },
    materialB: { n: 0.995, k: 0.004, thicknessNm: 4.1 },
  })
  assert.ok(Number.isFinite(result.reflectivity))
  assert.ok(result.reflectivity >= 0 && result.reflectivity <= 1)
  assert.equal(result.physicalPeriodNm, 6.9)
})
