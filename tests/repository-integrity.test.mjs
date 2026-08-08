import assert from 'node:assert/strict'
import test from 'node:test'
import { auditRepositoryGraph, renderRepositoryIntegrityReport } from '../src/lib/repositoryIntegrity.mjs'

function validInput() {
  return {
    claims: [
      { id: 'CLAIM-A' },
      { id: 'CLAIM-B' },
    ],
    unknowns: [{ id: 'UNKNOWN-A' }],
    conceptLabels: [
      { node: 'NodeA', claimIds: ['CLAIM-A'] },
      { node: 'NodeB', claimIds: ['CLAIM-B'] },
    ],
    fabCases: [{ id: 'case-a', claimIds: ['CLAIM-A'], sourceUrls: ['https://example.org/source'] }],
    reviews: { reviews: [{ id: 'CLAIM-A', state: 'reviewed', reviewers: ['public-handle'] }] },
    manifest: { datasets: [{ id: 'dataset-a', path: 'evidence/example.json' }] },
    assemblyClaimIds: ['CLAIM-A'],
    assemblyNodeIds: ['NodeA'],
    patentSubsystems: ['source', 'metrology'],
    existingPaths: new Set(['evidence/example.json']),
  }
}

test('valid cross-dataset graph passes', () => {
  const result = auditRepositoryGraph(validInput())
  assert.equal(result.ok, true, result.errors.join('; '))
  assert.match(renderRepositoryIntegrityReport(result), /PASS/)
})

test('broken evidence and dataset references fail deterministically', () => {
  const input = validInput()
  input.assemblyClaimIds.push('MISSING-CLAIM')
  input.conceptLabels.push({ node: 'NodeC', claimIds: ['MISSING-CLAIM'] })
  input.fabCases[0].claimIds.push('MISSING-CLAIM')
  input.manifest.datasets.push({ id: 'dataset-b', path: 'missing.json' })
  const result = auditRepositoryGraph(input)
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.includes('assembly references missing evidence id MISSING-CLAIM')))
  assert.ok(result.errors.some((error) => error.includes('dataset manifest path does not exist: missing.json')))
})

test('duplicate nodes, duplicate dataset IDs and bad source URLs fail', () => {
  const input = validInput()
  input.conceptLabels.push({ node: 'NodeA', claimIds: ['CLAIM-A'] })
  input.fabCases[0].sourceUrls.push('javascript:alert(1)')
  input.manifest.datasets.push({ id: 'dataset-a', path: 'evidence/example.json' })
  const result = auditRepositoryGraph(input)
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.includes('duplicate concept node NodeA')))
  assert.ok(result.errors.some((error) => error.includes('invalid public source URL')))
  assert.ok(result.errors.some((error) => error.includes('duplicate dataset manifest id dataset-a')))
})

test('bad review targets and patent subsystems fail while missing assembly labels warn', () => {
  const input = validInput()
  input.reviews.reviews.push({ id: 'UNKNOWN-REVIEW-ID', state: 'proposed' })
  input.patentSubsystems.push('secret-internal-module')
  input.assemblyNodeIds.push('UnmappedNode')
  const result = auditRepositoryGraph(input)
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.includes('review registry references unknown evidence id UNKNOWN-REVIEW-ID')))
  assert.ok(result.errors.some((error) => error.includes('unrecognized patent subsystem secret-internal-module')))
  assert.ok(result.warnings.some((warning) => warning.includes('UnmappedNode')))
})
