import test from 'node:test'
import assert from 'node:assert/strict'
import { compareNormalizedEuvPaths, normalizedAbsorbingPath, normalizedReflectivePath } from '../src/lib/euvPathConcept.mjs'

test('normalized absorbing path is bounded and decreases with absorption/path length', () => {
  assert.equal(normalizedAbsorbingPath({ absorptionIndex: 0, pathLength: 5 }), 1)
  const short = normalizedAbsorbingPath({ absorptionIndex: 0.5, pathLength: 1 })
  const long = normalizedAbsorbingPath({ absorptionIndex: 0.5, pathLength: 3 })
  const stronger = normalizedAbsorbingPath({ absorptionIndex: 0.9, pathLength: 3 })
  assert.ok(short > long)
  assert.ok(long > stronger)
  assert.ok(stronger >= 0 && stronger <= 1)
})

test('normalized reflective chain loses transfer as reflection count grows unless transfer is ideal', () => {
  assert.equal(normalizedReflectivePath({ perReflectionTransfer: 1, reflections: 8 }), 1)
  assert.ok(normalizedReflectivePath({ perReflectionTransfer: 0.8, reflections: 2 }) > normalizedReflectivePath({ perReflectionTransfer: 0.8, reflections: 5 }))
  assert.equal(normalizedReflectivePath({ perReflectionTransfer: 2, reflections: 3 }), 1)
})

test('low-absorption conceptual path preserves more signal than the absorbing reference', () => {
  const result = compareNormalizedEuvPaths({ absorptionIndex: 0.8, pathLength: 3, lowAbsorptionFraction: 0.08, perReflectionTransfer: 0.85, reflections: 4 })
  assert.ok(result.lowAbsorptionMedium > result.absorbingMedium)
  assert.ok(result.lowAbsorptionMirrorPath <= result.lowAbsorptionMedium)
  assert.ok(result.lowAbsorptionMirrorPath >= 0 && result.lowAbsorptionMirrorPath <= 1)
})

test('model remains dimensionless and deterministic at edge values', () => {
  const result = compareNormalizedEuvPaths({ absorptionIndex: -1, pathLength: -5, lowAbsorptionFraction: 2, perReflectionTransfer: -1, reflections: -2 })
  assert.deepEqual(result, { absorbingMedium: 1, lowAbsorptionMedium: 1, mirrorChain: 1, lowAbsorptionMirrorPath: 1 })
})
