import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const readJson = async (path) => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'))
const [labels, claims] = await Promise.all([
  readJson('evidence/concept-labels.json'),
  readJson('evidence/claims.json'),
])
const claimIds = new Set(claims.map((claim) => claim.id))

test('concept labels use stable unique node names', () => {
  const nodes = labels.map((label) => label.node)
  assert.equal(new Set(nodes).size, nodes.length)
  assert.ok(nodes.every((node) => typeof node === 'string' && node.length > 0))
})

test('every concept label states geometry status and public-boundary note', () => {
  for (const label of labels) {
    assert.ok(['documented-function', 'inferred', 'illustrative'].includes(label.geometryStatus))
    assert.equal(typeof label.note, 'string')
    assert.ok(label.note.length > 20)
  }
})

test('every claim linked by a concept label exists in the validated evidence dataset', () => {
  for (const label of labels) {
    assert.ok(label.claimIds.length > 0)
    for (const claimId of label.claimIds) assert.ok(claimIds.has(claimId), `${label.node} references missing ${claimId}`)
  }
})
