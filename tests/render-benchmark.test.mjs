import assert from 'node:assert/strict'
import test from 'node:test'
import { renderBenchmarkSummaryMarkdown, summarizeRenderBenchmarkCaptures, validateRenderBenchmarkCapture } from '../src/lib/renderBenchmark.mjs'

function capture({ deviceClass = 'laptop', webglMedian = 16, webgpuMedian = 12, webglP95 = 20, webgpuP95 = 15, webgpuStatus = 'ok' } = {}) {
  return {
    schemaVersion: 1,
    capture: {
      capturedAt: '2026-08-08T12:00:00+07:00',
      timezone: 'Asia/Ho_Chi_Minh',
      deviceClass,
      os: 'Synthetic test fixture OS',
      browser: 'Synthetic test fixture browser',
      cpu: 'fixture cpu',
      gpu: 'fixture gpu',
      powerMode: 'plugged-in',
    },
    benchmark: {
      timestamp: '2026-08-08T12:00:00+07:00',
      userAgent: 'OpenEUV unit-test fixture',
      hardwareConcurrency: 8,
      deviceMemoryGiB: 8,
      instances: 2048,
      frames: 90,
      memoryBefore: null,
      webgl: { status: 'ok', setupMs: 4, samples: 90, averageMs: webglMedian + 1, medianMs: webglMedian, p95Ms: webglP95 },
      webgpu: webgpuStatus === 'ok'
        ? { status: 'ok', setupMs: 5, samples: 90, averageMs: webgpuMedian + 1, medianMs: webgpuMedian, p95Ms: webgpuP95 }
        : { status: 'skipped', error: 'fixture: unavailable' },
      memoryAfter: null,
    },
  }
}

test('valid capture requires WebGL baseline and privacy-safe metadata', () => {
  const valid = validateRenderBenchmarkCapture(capture())
  assert.equal(valid.ok, true, valid.errors.join('; '))

  const unsafe = capture()
  unsafe.capture.serialNumber = 'do-not-store-this'
  const invalid = validateRenderBenchmarkCapture(unsafe)
  assert.equal(invalid.ok, false)
  assert.ok(invalid.errors.some((error) => error.includes('disallowed identifying fields')))
})

test('summary keeps WebGL when evidence is insufficient', () => {
  const summary = summarizeRenderBenchmarkCaptures([capture({ deviceClass: 'laptop' }), capture({ deviceClass: 'phone' })])
  assert.equal(summary.enoughEvidence, false)
  assert.equal(summary.recommendation, 'keep-webgl')
})

test('summary only considers WebGPU after meaningful multi-class evidence', () => {
  const summary = summarizeRenderBenchmarkCaptures([
    capture({ deviceClass: 'laptop', webglMedian: 16, webgpuMedian: 12, webglP95: 22, webgpuP95: 16 }),
    capture({ deviceClass: 'phone', webglMedian: 24, webgpuMedian: 17, webglP95: 34, webgpuP95: 24 }),
    capture({ deviceClass: 'desktop', webglMedian: 12, webgpuMedian: 9, webglP95: 18, webgpuP95: 13 }),
  ])
  assert.equal(summary.enoughEvidence, true)
  assert.equal(summary.meaningfulGain, true)
  assert.equal(summary.noMaterialRegression, true)
  assert.equal(summary.recommendation, 'consider-webgpu')
  assert.match(renderBenchmarkSummaryMarkdown(summary), /consider WebGPU/i)
})

test('one material regression prevents adoption despite strong averages', () => {
  const summary = summarizeRenderBenchmarkCaptures([
    capture({ deviceClass: 'laptop', webglMedian: 20, webgpuMedian: 10, webglP95: 30, webgpuP95: 15 }),
    capture({ deviceClass: 'phone', webglMedian: 30, webgpuMedian: 15, webglP95: 45, webgpuP95: 22 }),
    capture({ deviceClass: 'desktop', webglMedian: 10, webgpuMedian: 12, webglP95: 14, webgpuP95: 16 }),
  ])
  assert.equal(summary.noMaterialRegression, false)
  assert.equal(summary.recommendation, 'keep-webgl')
})

test('WebGPU unavailable capture remains useful WebGL evidence but not a paired comparison', () => {
  const summary = summarizeRenderBenchmarkCaptures([capture({ deviceClass: 'phone', webgpuStatus: 'skipped' })])
  assert.equal(summary.validCaptures, 1)
  assert.equal(summary.pairedCaptures, 0)
  assert.equal(summary.recommendation, 'keep-webgl')
})
