import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const gap = JSON.parse(await readFile(new URL('../evidence/optical-data-gaps.json', import.meta.url), 'utf8'))

test('silicon EUV gap keeps 13.5 nm outside the verified CC0 Si range', () => {
  assert.equal(gap.target.material, 'Si')
  assert.equal(gap.target.wavelengthNm, 13.5)
  const cc0 = gap.candidates.find((candidate) => candidate.source === 'refractiveindex.info database')
  assert.ok(cc0)
  assert.equal(cc0.license, 'CC0-1.0')
  assert.equal(cc0.upstreamRevision, '6f3b772c3339d68a21538cb2562d2acb36731302')
  assert.equal(cc0.minWavelengthNm, 30.9963)
  assert.equal(cc0.coversTarget, false)
  assert.ok(cc0.minWavelengthNm > gap.target.wavelengthNm)
})

test('public EUV-range candidate is not treated as vendorable without verified redistribution rights', () => {
  const euv = gap.candidates.find((candidate) => candidate.reportedEnergyRangeEv)
  assert.ok(euv)
  assert.ok(euv.reportedEnergyRangeEv[0] <= euv.targetEnergyEvApprox)
  assert.ok(euv.reportedEnergyRangeEv[1] >= euv.targetEnergyEvApprox)
  assert.equal(euv.coversTarget, true)
  assert.equal(euv.vendorable, false)
  assert.match(euv.license, /not-verified/i)
})

test('gap decision forbids silent extrapolation', () => {
  assert.equal(gap.decision, 'keep-illustrative-until-redistributable-measured-data-exists')
  assert.ok(gap.rules.some((rule) => /Do not extrapolate/i.test(rule)))
  assert.ok(gap.rules.some((rule) => /redistribution rights/i.test(rule)))
})
