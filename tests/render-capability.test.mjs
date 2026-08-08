import test from 'node:test'
import assert from 'node:assert/strict'
import { rendererCapabilitySnapshot, shouldAdoptExperimentalRenderer, summarizeFrameTimes } from '../src/lib/renderCapability.mjs'

test('capability snapshot reports WebGPU only when navigator.gpu exists', () => {
  assert.equal(rendererCapabilitySnapshot({ navigator: { gpu: {}, hardwareConcurrency: 12, deviceMemory: 8 } }).webgpu, true)
  assert.equal(rendererCapabilitySnapshot({ navigator: { hardwareConcurrency: 4 } }).webgpu, false)
})

test('experimental renderer is not adopted without enough measured samples', () => {
  assert.equal(shouldAdoptExperimentalRenderer({ baselineMs: 16, experimentalMs: 10, samples: 2 }), false)
})

test('experimental renderer needs a meaningful measured improvement', () => {
  assert.equal(shouldAdoptExperimentalRenderer({ baselineMs: 16, experimentalMs: 15, samples: 5 }), false)
  assert.equal(shouldAdoptExperimentalRenderer({ baselineMs: 16, experimentalMs: 12, samples: 5 }), true)
})

test('frame summary returns average median and p95 deterministically', () => {
  const summary = summarizeFrameTimes([10, 20, 30, 40, 50])
  assert.equal(summary.samples, 5)
  assert.equal(summary.averageMs, 30)
  assert.equal(summary.medianMs, 30)
  assert.equal(summary.p95Ms, 40)
})
