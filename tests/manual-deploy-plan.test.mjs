import test from 'node:test'
import assert from 'node:assert/strict'
import { createManualDeployPlan, gitStatusIsClean, normalizeDeploySha } from '../src/lib/manualDeployPlan.mjs'

const sha = '0123456789abcdef0123456789abcdef01234567'

test('deploy SHA normalization accepts only full git SHAs', () => {
  assert.equal(normalizeDeploySha(sha.toUpperCase()), sha)
  assert.equal(normalizeDeploySha(sha.slice(0, 12)), null)
  assert.equal(normalizeDeploySha('not-a-sha'), null)
})

test('git porcelain cleanliness is deterministic', () => {
  assert.equal(gitStatusIsClean(''), true)
  assert.equal(gitStatusIsClean('   \n'), true)
  assert.equal(gitStatusIsClean(' M src/App.tsx\n'), false)
})

test('dirty worktree is blocked unless explicitly allowed', () => {
  const blocked = createManualDeployPlan({ sha, porcelain: ' M README.md\n' })
  assert.equal(blocked.ok, false)
  assert.match(blocked.error, /dirty/i)

  const allowed = createManualDeployPlan({ sha, porcelain: ' M README.md\n', allowDirty: true })
  assert.equal(allowed.ok, true)
  assert.equal(allowed.provenanceComplete, false)
})

test('real deployment runs check before wrangler and injects only public commit provenance', () => {
  const plan = createManualDeployPlan({ sha })
  assert.equal(plan.ok, true)
  assert.deepEqual(plan.steps.map((step) => [step.command, step.args]), [
    ['npm', ['run', 'check']],
    ['npx', ['wrangler', 'deploy']],
  ])
  assert.deepEqual(plan.steps[0].env, { OPENEUV_COMMIT_SHA: sha })
})

test('dry run builds then invokes wrangler dry-run; skip-check still builds real deploy', () => {
  const dry = createManualDeployPlan({ sha, dryRun: true })
  assert.deepEqual(dry.steps.map((step) => step.args), [
    ['run', 'build'],
    ['wrangler', 'deploy', '--dry-run'],
  ])

  const skipped = createManualDeployPlan({ sha, skipCheck: true })
  assert.deepEqual(skipped.steps[0].args, ['run', 'build'])
})
