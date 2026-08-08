#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { resolveBuildMetadata } from '../src/lib/buildMetadata.mjs'
import { summarizeEvidenceReviewReadiness } from '../src/lib/evidenceReviewReadiness.mjs'
import { auditPatentRecords } from '../src/lib/patentAudit.mjs'
import { parsePatentRecordsFromTypeScript } from '../src/lib/patentSourceParser.mjs'
import { summarizeProvenance } from '../src/lib/provenanceReport.mjs'
import { buildResearchSnapshot, serializeResearchSnapshot } from '../src/lib/researchSnapshot.mjs'

const generatedAtIndex = process.argv.indexOf('--generated-at')
const generatedAt = generatedAtIndex >= 0 ? process.argv[generatedAtIndex + 1] : null
if (!generatedAt || Number.isNaN(Date.parse(generatedAt))) {
  console.error('Usage: node tools/research-snapshot.mjs --generated-at <ISO-8601 timestamp>')
  process.exit(1)
}

const readJson = async (path) => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'))
const [claims, unknowns, reviews, fabCases, manifest, dataGap, packageJson, patentSource] = await Promise.all([
  readJson('evidence/claims.json'),
  readJson('evidence/unknowns.json'),
  readJson('evidence/reviews.json'),
  readJson('evidence/fab-cases.json'),
  readJson('datasets/manifest.json'),
  readJson('evidence/optical-data-gaps.json'),
  readJson('package.json'),
  readFile(new URL('../src/data/patents.ts', import.meta.url), 'utf8'),
])
const patents = parsePatentRecordsFromTypeScript(patentSource)
if (!patents.length) {
  console.error('Patent source parser returned zero records; refusing incomplete snapshot.')
  process.exit(1)
}
const patentAudit = auditPatentRecords(patents)
const reviewCoverage = summarizeEvidenceReviewReadiness({ claims, unknowns, registry: reviews, minimumReviewedRecords: 10 })
const provenanceCoverage = summarizeProvenance({ claims, unknowns, reviews, patents, patentAudit, fabCases, dataGaps: [dataGap] })
const build = resolveBuildMetadata({ version: packageJson.version, env: process.env })
const snapshot = buildResearchSnapshot({ generatedAt, build, claims, unknowns, fabCases, manifest, reviewCoverage, provenanceCoverage })
process.stdout.write(serializeResearchSnapshot(snapshot))
