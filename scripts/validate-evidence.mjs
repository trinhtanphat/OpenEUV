import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
const claims = readJson('evidence/claims.json')
const unknowns = readJson('evidence/unknowns.json')

const errors = []
const claimIds = new Set()
const allowedClasses = new Set(['A', 'B', 'C', 'D', '?'])

if (!Array.isArray(claims)) errors.push('evidence/claims.json must contain an array')
if (!Array.isArray(unknowns)) errors.push('evidence/unknowns.json must contain an array')

for (const [index, claim] of claims.entries()) {
  const prefix = `claims[${index}]`
  if (!claim || typeof claim !== 'object') { errors.push(`${prefix} must be an object`); continue }
  if (typeof claim.id !== 'string' || !/^[A-Z0-9-]+$/.test(claim.id)) errors.push(`${prefix}.id is invalid`)
  if (claimIds.has(claim.id)) errors.push(`duplicate claim id: ${claim.id}`)
  claimIds.add(claim.id)
  if (typeof claim.component !== 'string' || claim.component.length < 2) errors.push(`${prefix}.component is invalid`)
  if (typeof claim.claim !== 'string' || claim.claim.length < 12) errors.push(`${prefix}.claim is too short`)
  if (!allowedClasses.has(claim.class)) errors.push(`${prefix}.class must be A, B, C, D or ?`)
  if (typeof claim.confidence !== 'number' || claim.confidence < 0 || claim.confidence > 1) errors.push(`${prefix}.confidence must be in [0, 1]`)
  if (claim.class === 'D' && (typeof claim.rationale !== 'string' || claim.rationale.trim().length < 12)) errors.push(`${prefix}.rationale is required for inference class D`)
  if (!Array.isArray(claim.sources)) errors.push(`${prefix}.sources must be an array`)
  if (claim.class !== '?' && (!Array.isArray(claim.sources) || claim.sources.length === 0)) errors.push(`${prefix} requires at least one source`)
  for (const [sourceIndex, source] of (claim.sources ?? []).entries()) {
    if (typeof source?.name !== 'string' || source.name.length < 2) errors.push(`${prefix}.sources[${sourceIndex}].name is invalid`)
    try {
      const url = new URL(source?.url)
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('unsupported protocol')
    } catch {
      errors.push(`${prefix}.sources[${sourceIndex}].url is invalid`)
    }
  }
}

const unknownIds = new Set()
for (const [index, unknown] of unknowns.entries()) {
  const prefix = `unknowns[${index}]`
  if (!unknown || typeof unknown !== 'object') { errors.push(`${prefix} must be an object`); continue }
  if (typeof unknown.id !== 'string' || !unknown.id.startsWith('UNKNOWN-')) errors.push(`${prefix}.id must start with UNKNOWN-`)
  if (unknownIds.has(unknown.id)) errors.push(`duplicate unknown id: ${unknown.id}`)
  unknownIds.add(unknown.id)
  if (!['low', 'medium', 'high'].includes(unknown.priority)) errors.push(`${prefix}.priority is invalid`)
  if (!['open', 'researching', 'resolved'].includes(unknown.status)) errors.push(`${prefix}.status is invalid`)
  if (typeof unknown.question !== 'string' || unknown.question.length < 20) errors.push(`${prefix}.question is too short`)
  for (const claimId of unknown.relatedClaimIds ?? []) {
    if (!claimIds.has(claimId)) errors.push(`${prefix} references missing claim ${claimId}`)
  }
}

if (errors.length) {
  console.error('OpenEUV evidence validation failed:')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`Evidence validation passed: ${claims.length} claims, ${unknowns.length} unknowns.`)
