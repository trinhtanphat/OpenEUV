#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { validateLearningCheckpoints } from '../src/lib/learningCheckpointValidation.mjs'

const checkpoints = JSON.parse(await readFile(new URL('../evidence/learning-checkpoints.json', import.meta.url), 'utf8'))
const expectedLevelIds = ['foundations', 'optics', 'euv-physics', 'scanner-systems', 'high-na', 'research']
const result = validateLearningCheckpoints(checkpoints, expectedLevelIds)
if (!result.ok) {
  console.error(result.errors.join('\n'))
  process.exit(1)
}
console.log(`Learning checkpoints valid: ${checkpoints.length} · ${Object.entries(result.coverage).map(([level, count]) => `${level}=${count}`).join(' ')}`)
