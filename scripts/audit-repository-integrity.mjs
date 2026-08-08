#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { auditRepositoryGraph, renderRepositoryIntegrityReport } from '../src/lib/repositoryIntegrity.mjs'

const root = path.resolve('.')
const readText = (relativePath) => fs.readFile(path.join(root, relativePath), 'utf8')
const readJson = async (relativePath) => JSON.parse(await readText(relativePath))

function extractQuotedValues(block) {
  return Array.from(block.matchAll(/['"]([^'"]+)['"]/g), (match) => match[1])
}

function extractArrayProperties(source, property) {
  const values = []
  const pattern = new RegExp(`${property}\\s*:\\s*\\[([^\\]]*)\\]`, 'g')
  for (const match of source.matchAll(pattern)) values.push(...extractQuotedValues(match[1]))
  return values
}

function extractScalarProperties(source, property) {
  const pattern = new RegExp(`${property}\\s*:\\s*['"]([^'"]+)['"]`, 'g')
  return Array.from(source.matchAll(pattern), (match) => match[1])
}

const [claims, unknowns, conceptLabelsLegacy, conceptLabelsV4, fabCases, reviews, manifest, assemblySource, patentsSource] = await Promise.all([
  readJson('evidence/claims.json'),
  readJson('evidence/unknowns.json'),
  readJson('evidence/concept-labels.json'),
  readJson('evidence/concept-labels-v4.json'),
  readJson('evidence/fab-cases.json'),
  readJson('evidence/reviews.json'),
  readJson('datasets/manifest.json'),
  readText('src/data/assemblyStages.ts'),
  readText('src/data/patents.ts'),
])
const conceptLabels = [...conceptLabelsLegacy, ...conceptLabelsV4]

const existingPaths = new Set()
for (const dataset of manifest.datasets ?? []) {
  if (!dataset?.path) continue
  try {
    await fs.access(path.join(root, dataset.path))
    existingPaths.add(dataset.path)
  } catch {
    // The pure audit reports the missing path with stable wording.
  }
}

const assemblyClaimIds = extractArrayProperties(assemblySource, 'claimIds')
const assemblyNodeIds = extractArrayProperties(assemblySource, 'atlasNodes')
const patentSubsystems = [
  ...extractScalarProperties(patentsSource, 'subsystem'),
  ...extractArrayProperties(patentsSource, 'linkedSubsystems'),
]

const result = auditRepositoryGraph({
  claims,
  unknowns,
  conceptLabels,
  fabCases,
  reviews,
  manifest,
  assemblyClaimIds,
  assemblyNodeIds,
  patentSubsystems,
  existingPaths,
})

if (process.argv.includes('--json')) console.log(JSON.stringify(result, null, 2))
else console.log(renderRepositoryIntegrityReport(result))

if (!result.ok) process.exitCode = 1
