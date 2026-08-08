#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { parsePatentRecordsForCoverage, renderSourceCoverageMarkdown, summarizeSourceCoverage } from '../src/lib/sourceCoverage.mjs'

const root = process.cwd()
const readJson = async (relativePath) => JSON.parse(await readFile(path.join(root, relativePath), 'utf8'))
const [claims, unknowns, reviews, fabCases, opticalDataGaps, patentSource] = await Promise.all([
  readJson('evidence/claims.json'),
  readJson('evidence/unknowns.json'),
  readJson('evidence/reviews.json'),
  readJson('evidence/fab-cases.json'),
  readJson('evidence/optical-data-gaps.json'),
  readFile(path.join(root, 'src/data/patents.ts'), 'utf8'),
])

const patentRecords = parsePatentRecordsForCoverage(patentSource)
const report = summarizeSourceCoverage({ claims, unknowns, reviews, fabCases, opticalDataGaps, patentRecords })

if (process.argv.includes('--json')) console.log(JSON.stringify(report, null, 2))
else console.log(renderSourceCoverageMarkdown(report))
