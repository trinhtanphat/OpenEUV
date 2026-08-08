import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { validateLearningCheckpoints } from '../src/lib/learningCheckpointValidation.mjs'

const checkpoints = JSON.parse(await readFile(new URL('../evidence/learning-checkpoints.json', import.meta.url), 'utf8'))
const levels = ['foundations', 'optics', 'euv-physics', 'scanner-systems', 'high-na', 'research']

test('real learning checkpoint dataset covers every L0-L5 level', () => {
  const result = validateLearningCheckpoints(checkpoints, levels)
  assert.equal(result.ok, true, result.errors.join('; '))
  assert.deepEqual(Object.keys(result.coverage).sort(), [...levels].sort())
  levels.forEach((level) => assert.ok(result.coverage[level] >= 1, `${level} should have a checkpoint`))
})

test('validator rejects duplicate IDs, invalid answer index and external links', () => {
  const broken = structuredClone(checkpoints.slice(0, 2))
  broken[1].id = broken[0].id
  broken[0].correctIndex = 99
  broken[0].links[0].href = 'https://external.example/'
  const result = validateLearningCheckpoints(broken, levels)
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.includes('duplicate id')))
  assert.ok(result.errors.some((error) => error.includes('correctIndex')))
  assert.ok(result.errors.some((error) => error.includes('internal # anchor')))
  assert.ok(result.errors.some((error) => error.includes('has no checkpoint')))
})
