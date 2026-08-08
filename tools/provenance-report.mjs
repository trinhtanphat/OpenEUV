#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { auditPatentRecords } from '../src/lib/patentAudit.mjs'
import { parsePatentRecordsFromTypeScript } from '../src/lib/patentSourceParser.mjs'
import { renderProvenanceMarkdown, summarizeProvenance } from '../src/lib/provenanceReport.mjs'

const readJson = async (relativePath) => JSON.parse(await readFile(new URL(`../${relativePath}`, import.meta.url), 'utf8'))
const readText = async (relativePath) => readFile(new URL(`../${relativePath}`, import.meta.url), 'utf8')

const [claims, unknowns, reviews, fabCases, dataGap, patentsSource] = await Promise.all([
  readJson('evidence/claims.json'),
  readJson('evidence/unknowns.json'),
  readJson('evidence/reviews.json'),
  readJson('evidence/fab-cases.json'),
  readJson('evidence/optical-data-gaps.json'),
  readText('src/data/patents.ts'),
])

const patents = parsePatentRecordsFromTypeScript(patentsSource)
if (!patents.length) throw new Error('provenance report could not parse any patent records from src/data/patents.ts')

const patentAudit = auditPatentRecords(patents)
const summary = summarizeProvenance({ claims, unknowns, reviews, patents, patentAudit, fabCases, dataGaps: [dataGap] })

if (process.argv.includes('--json')) console.log(JSON.stringify(summary, null, 2))
else console.log(renderProvenanceMarkdown(summary))

if (summary.evidence.recordsWithoutDirectSource.length || summary.evidence.inferenceRationaleGaps.length || summary.patents.auditErrors.length || summary.fab.casesWithoutDirectSources.length || summary.fab.invalidSourceUrls.length) process.exitCode = 1
