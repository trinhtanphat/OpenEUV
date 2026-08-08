import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { validateFabCaseCollection } from '../src/lib/fabCaseMetadata.mjs'

const claims = JSON.parse(await readFile(new URL('../evidence/claims.json', import.meta.url), 'utf8'))
const fabCases = JSON.parse(await readFile(new URL('../evidence/fab-cases.json', import.meta.url), 'utf8'))
const knownClaimIds = new Set(claims.map((claim) => claim.id))

test('runtime fab case dataset is internally valid and references known claims', () => {
  const result = validateFabCaseCollection(fabCases, knownClaimIds)
  assert.equal(result.ok, true, result.errors.join('; '))
  assert.equal(result.records.length, fabCases.length)
})

test('runtime dataset contains distinct cleaning, protection and qualification lifecycle cases', () => {
  const byId = new Map(fabCases.map((item) => [item.id, item]))
  for (const id of ['tsmc-euv-mask-dryclean', 'imec-cnt-pellicle', 'zeiss-aims-euv-qualification']) {
    const item = byId.get(id)
    assert.ok(item, `missing ${id}`)
    assert.equal(item.kind, 'mask-lifecycle')
    assert.ok(item.claimIds.length >= 1)
    assert.ok(item.sourceUrls.every((url) => url.startsWith('https://')))
    assert.ok(item.publicBoundary.length > 30)
    assert.ok(item.unknowns.length >= 1)
  }
})
