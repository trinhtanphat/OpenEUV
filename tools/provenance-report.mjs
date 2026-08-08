#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { auditPatentRecords } from '../src/lib/patentAudit.mjs'
import { renderProvenanceMarkdown, summarizeProvenance } from '../src/lib/provenanceReport.mjs'

const readJson = async (relativePath) => JSON.parse(await readFile(new URL(`../${relativePath}`, import.meta.url), 'utf8'))
const readText = async (relativePath) => readFile(new URL(`../${relativePath}`, import.meta.url), 'utf8')

function scalar(block, field) {
  return block.match(new RegExp(`${field}\\s*:\\s*['"]([^'"]*)['"]`))?.[1] ?? ''
}

function array(block, field) {
  const body = block.match(new RegExp(`${field}\\s*:\\s*\\[([^\\]]*)\\]`))?.[1] ?? ''
  return Array.from(body.matchAll(/['"]([^'"]+)['"]/g), (match) => match[1])
}

function parsePatentRecords(source) {
  const section = source.split('export const patentFamilies')[0].split('export const patents: PatentRecord[] = [')[1] ?? ''
  return section.split(/\n\s{2}\{\n/).slice(1).map((block) => ({
    id: scalar(block, 'id'),
    familyId: scalar(block, 'familyId'),
    familyLabel: scalar(block, 'familyLabel'),
    familyMembers: array(block, 'familyMembers'),
    title: scalar(block, 'title'),
    priorityDate: scalar(block, 'priorityDate'),
    publicationDate: scalar(block, 'publicationDate'),
    subsystem: scalar(block, 'subsystem'),
    linkedSubsystems: array(block, 'linkedSubsystems'),
    assignee: scalar(block, 'assignee'),
    applicationNumber: scalar(block, 'applicationNumber') || undefined,
    summary: scalar(block, 'summary'),
    url: scalar(block, 'url'),
  })).filter((record) => record.id)
}

const [claims, unknowns, reviews, fabCases, dataGap, patentsSource] = await Promise.all([
  readJson('evidence/claims.json'),
  readJson('evidence/unknowns.json'),
  readJson('evidence/reviews.json'),
  readJson('evidence/fab-cases.json'),
  readJson('evidence/optical-data-gaps.json'),
  readText('src/data/patents.ts'),
])

const patents = parsePatentRecords(patentsSource)
const patentAudit = auditPatentRecords(patents)
const summary = summarizeProvenance({ claims, unknowns, reviews, patents, patentAudit, fabCases, dataGaps: [dataGap] })

if (process.argv.includes('--json')) console.log(JSON.stringify(summary, null, 2))
else console.log(renderProvenanceMarkdown(summary))

if (summary.evidence.recordsWithoutDirectSource.length || summary.evidence.inferenceRationaleGaps.length || summary.patents.auditErrors.length || summary.fab.casesWithoutDirectSources.length || summary.fab.invalidSourceUrls.length) process.exitCode = 1
