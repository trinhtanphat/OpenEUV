#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { validateFabCaseCollection } from '../src/lib/fabCaseMetadata.mjs'

const [, , inputPath] = process.argv
if (!inputPath) {
  console.error('Usage: node tools/fab-case-validate.mjs <cases.json>')
  process.exitCode = 2
} else {
  try {
    const [rawCases, rawClaims] = await Promise.all([
      readFile(inputPath, 'utf8'),
      readFile(new URL('../evidence/claims.json', import.meta.url), 'utf8'),
    ])
    const cases = JSON.parse(rawCases)
    const claims = JSON.parse(rawClaims)
    const knownClaimIds = new Set(claims.map((claim) => claim.id))
    const result = validateFabCaseCollection(cases, knownClaimIds)
    if (!result.ok) {
      console.error(result.errors.join('\n'))
      process.exitCode = 1
    } else {
      console.log(`Fab case metadata valid: ${result.records.length} records.`)
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}
