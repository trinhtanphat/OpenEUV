import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const claims = JSON.parse(await readFile(new URL('../evidence/claims.json', import.meta.url), 'utf8'))
const labels = JSON.parse(await readFile(new URL('../evidence/concept-labels-v4.json', import.meta.url), 'utf8'))
const generator = await readFile(new URL('../tools/generate-concept-assets.py', import.meta.url), 'utf8')
const knownClaimIds = new Set(claims.map((claim) => claim.id))
const allowedStatus = new Set(['documented-function', 'public-inference', 'inferred', 'illustrative'])

test('V4 concept labels reference known evidence and explicit geometry status', () => {
  assert.ok(labels.length >= 7)
  for (const label of labels) {
    assert.ok(label.node)
    assert.ok(['illuminator', 'vacuum'].includes(label.subsystem))
    assert.ok(allowedStatus.has(label.geometryStatus), `${label.node}: invalid geometry status`)
    assert.ok(label.claimIds.length >= 1, `${label.node}: missing evidence`)
    for (const claimId of label.claimIds) assert.ok(knownClaimIds.has(claimId), `${label.node}: unknown claim ${claimId}`)
    assert.ok(label.note.length > 40, `${label.node}: evidence-boundary note too short`)
  }
})

test('vacuum concept labels are anchored by the first-party vacuum requirement claim', () => {
  const vacuumLabels = labels.filter((label) => label.subsystem === 'vacuum')
  assert.ok(vacuumLabels.length >= 3)
  assert.ok(vacuumLabels.every((label) => label.claimIds.includes('EUV-VACUUM-001')))
  const vacuumClaim = claims.find((claim) => claim.id === 'EUV-VACUUM-001')
  assert.ok(vacuumClaim)
  assert.equal(vacuumClaim.class, 'A')
  assert.ok(vacuumClaim.sources.some((source) => source.url.includes('asml.com')))
})

test('reproducible asset generator exposes illumination and vacuum presets with stable nodes', () => {
  for (const token of [
    'euv-illumination-concept.gltf',
    'euv-vacuum-platform-concept.gltf',
    'CollectorHandoff',
    'FieldMirrorConcept-1',
    'PupilShapingConcept',
    'VacuumPlatform',
    'OpticalPathEnvelope',
    'AirlockConcept',
  ]) assert.match(generator, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
})
