import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { multilayerReflectivity } from '../src/lib/multilayer.mjs'
import { rayleighResolutionNm } from '../src/lib/resolution.mjs'

const request = {
  resolution: { wavelengthNm: 13.5, numericalAperture: 0.55, k1: 0.32 },
  multilayer: {
    wavelengthNm: 13.5,
    pairs: 18,
    materialA: { n: 0.92, k: 0.015, thicknessNm: 2.8 },
    materialB: { n: 0.995, k: 0.004, thicknessNm: 4.1 },
  },
}

function runPythonCrosscheck() {
  const result = spawnSync('python3', ['research/crosscheck_models.py'], {
    cwd: new URL('..', import.meta.url).pathname,
    input: JSON.stringify(request),
    encoding: 'utf8',
  })
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}

test('Rayleigh helper matches the independent Python implementation', () => {
  const python = runPythonCrosscheck()
  const js = rayleighResolutionNm(request.resolution)
  assert.ok(Math.abs(js - python.resolutionNm) < 1e-12)
})

test('normal-incidence multilayer helper matches independent Python matrix math', () => {
  const python = runPythonCrosscheck()
  const js = multilayerReflectivity({ ...request.multilayer, angleDeg: 0, polarization: 's' })
  assert.ok(Math.abs(js.sReflectivity - python.multilayerNormalReflectivity) < 1e-9)
})
