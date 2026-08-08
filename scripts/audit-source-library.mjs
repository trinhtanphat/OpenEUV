#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import process from 'node:process'
import { parsePatentRecordsFromTypeScript } from '../src/lib/patentSourceParser.mjs'
import { auditSourceLibrary, buildSourceLibrary } from '../src/lib/sourceLibrary.mjs'

const jsonMode = process.argv.includes('--json')
const readJson = async (relativePath) => JSON.parse(await readFile(new URL(`../${relativePath}`, import.meta.url), 'utf8'))
const [claims, fabCases, patentSource] = await Promise.all([
  readJson('evidence/claims.json'),
  readJson('evidence/fab-cases.json'),
  readFile(new URL('../src/data/patents.ts', import.meta.url), 'utf8'),
])
const patents = parsePatentRecordsFromTypeScript(patentSource)
if (!patents.length) {
  console.error('Source audit refused: patent parser returned zero records.')
  process.exit(1)
}

const sources = buildSourceLibrary({ claims, fabCases, patents })
const audit = auditSourceLibrary(sources)
const summary = {
  ...audit,
  domains: new Set(sources.map((source) => source.domain)).size,
  usages: sources.reduce((sum, source) => sum + source.usages.length, 0),
}

if (jsonMode) console.log(JSON.stringify(summary, null, 2))
else {
  console.log(`OpenEUV source audit: ${audit.ok ? 'PASS' : 'FAIL'}`)
  console.log(`sources=${summary.sources} domains=${summary.domains} usages=${summary.usages}`)
  for (const warning of audit.warnings) console.warn(`warning: ${warning}`)
  for (const error of audit.errors) console.error(`error: ${error}`)
}
if (!audit.ok) process.exitCode = 1
