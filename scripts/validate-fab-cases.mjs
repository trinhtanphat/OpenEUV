import { readFile } from 'node:fs/promises'
import { validateFabCaseCollection } from '../src/lib/fabCaseMetadata.mjs'

const claims = JSON.parse(await readFile(new URL('../evidence/claims.json', import.meta.url), 'utf8'))
const fabCases = JSON.parse(await readFile(new URL('../evidence/fab-cases.json', import.meta.url), 'utf8'))
const knownClaimIds = new Set(claims.map((claim) => String(claim.id ?? '').trim()).filter(Boolean))
const result = validateFabCaseCollection(fabCases, knownClaimIds)

if (!result.ok) {
  console.error(`Fab case validation failed with ${result.errors.length} error(s):`)
  result.errors.forEach((error) => console.error(`- ${error}`))
  process.exitCode = 1
} else {
  const lifecycle = result.records.filter((record) => record.kind === 'mask-lifecycle').length
  console.log(`Fab cases valid: ${result.records.length} records (${lifecycle} mask-lifecycle)`)
}
