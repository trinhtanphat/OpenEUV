import test from 'node:test'
import assert from 'node:assert/strict'
import { buildEvidenceUsageIndex, summarizeEvidenceUsage } from '../src/lib/evidenceUsage.mjs'

const claims = [{ id: 'CLAIM-A' }, { id: 'CLAIM-B' }, { id: 'CLAIM-C' }]

test('reverse index maps only explicit repository relationships', () => {
  const index = buildEvidenceUsageIndex({
    claims,
    conceptLabels: [{ node: 'NodeA', label: 'Node A', claimIds: ['CLAIM-A', 'MISSING'] }],
    assemblyStages: [{ id: 'stage-a', title: { en: 'Stage A' }, claimIds: ['CLAIM-A', 'CLAIM-B'] }],
    fabCases: [{ id: 'case-b', title: 'Case B', claimIds: ['CLAIM-B'] }],
  })
  assert.deepEqual(index['CLAIM-A'].map((item) => item.type), ['concept-node', 'assembly-stage'])
  assert.deepEqual(index['CLAIM-B'].map((item) => item.type), ['assembly-stage', 'fab-case'])
  assert.deepEqual(index['CLAIM-C'], [])
  assert.equal(index.MISSING, undefined)
})

test('duplicate source mappings do not duplicate a usage edge', () => {
  const index = buildEvidenceUsageIndex({
    claims,
    conceptLabels: [
      { node: 'SameNode', label: 'Same node', claimIds: ['CLAIM-A'] },
      { node: 'SameNode', label: 'Same node duplicate metadata', claimIds: ['CLAIM-A'] },
    ],
  })
  assert.equal(index['CLAIM-A'].length, 1)
})

test('usage summary keeps unmapped claims explicit', () => {
  const index = buildEvidenceUsageIndex({ claims, fabCases: [{ id: 'case-a', title: 'Case A', claimIds: ['CLAIM-A'] }] })
  const summary = summarizeEvidenceUsage(index)
  assert.equal(summary.claims, 3)
  assert.equal(summary.claimsWithUsage, 1)
  assert.equal(summary.totalUsages, 1)
  assert.deepEqual(summary.unmappedClaimIds, ['CLAIM-B', 'CLAIM-C'])
})
