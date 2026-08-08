#!/usr/bin/env node
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { normalizeLiteratureRecords } from '../src/lib/literatureMetadata.mjs'

const root = process.cwd()
const literature = JSON.parse(await readFile(path.join(root, 'evidence/literature.json'), 'utf8'))
const claims = JSON.parse(await readFile(path.join(root, 'evidence/claims.json'), 'utf8'))
const result = normalizeLiteratureRecords(literature)
const errors = [...result.errors]
const claimIds = new Set(claims.map((claim) => claim.id))

const componentDir = path.join(root, 'src/components')
const componentFiles = (await readdir(componentDir)).filter((name) => name.endsWith('.tsx'))
const componentText = (await Promise.all(componentFiles.map((name) => readFile(path.join(componentDir, name), 'utf8')))).join('\n')
const labIds = new Set(Array.from(componentText.matchAll(/\bid=["']([a-z0-9-]+-lab)["']/g), (match) => match[1]))

for (const record of result.records) {
  for (const claimId of record.claimIds) if (!claimIds.has(claimId)) errors.push(`${record.doi}: unknown claimId ${claimId}`)
  for (const labId of record.labIds) if (!labIds.has(labId)) errors.push(`${record.doi}: unknown labId ${labId}`)
}

if (errors.length) {
  console.error(`Literature validation failed (${errors.length})`)
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

console.log(`Literature validation OK: ${result.records.length} records across ${Object.values(result.coverage.byTopic).filter(Boolean).length} populated topics.`)
