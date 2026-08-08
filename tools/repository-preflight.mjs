#!/usr/bin/env node
import { readdir, readFile, access } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { validateDatasetManifest } from '../src/lib/datasetManifest.mjs'
import { validateReviewRegistry } from '../src/lib/evidenceReview.mjs'
import { summarizeEvidenceReviewReadiness } from '../src/lib/evidenceReviewReadiness.mjs'
import { summarizeRenderBenchmarkCaptures } from '../src/lib/renderBenchmark.mjs'
import { formatRepositoryPreflight, summarizeRepositoryPreflight } from '../src/lib/repositoryPreflight.mjs'

const root = process.cwd()
const jsonMode = process.argv.includes('--json')
const checks = []
const readJson = async (relativePath) => JSON.parse(await readFile(path.join(root, relativePath), 'utf8'))
const pushCheck = (name, ok, detail = '') => checks.push({ name, ok, ...(detail ? { detail } : {}) })

function runValidator(name, relativeScript, args = []) {
  const result = spawnSync(process.execPath, [relativeScript, ...args], { cwd: root, encoding: 'utf8' })
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim().split('\n').filter(Boolean).slice(-3).join(' | ')
  pushCheck(name, result.status === 0, output || `exit ${result.status}`)
}

runValidator('evidence validator', 'scripts/validate-evidence.mjs')
runValidator('evidence review validator', 'scripts/validate-evidence-reviews.mjs')
runValidator('fab-case validator', 'scripts/validate-fab-cases.mjs')
runValidator('literature registry validator', 'scripts/validate-literature.mjs')
runValidator('renderer capture validator', 'scripts/analyze-render-benchmarks.mjs', ['--validate-only'])
runValidator('cross-dataset graph audit', 'scripts/audit-repository-integrity.mjs')
runValidator('source citation audit', 'scripts/audit-source-library.mjs')
runValidator('provenance coverage audit', 'tools/provenance-report.mjs', ['--json'])
runValidator('learning checkpoint validator', 'scripts/validate-learning-checkpoints.mjs')
runValidator('accessibility contract audit', 'scripts/audit-accessibility-contract.mjs')

const [claims, unknowns, reviews, manifest, conceptLabels, conceptLabelsV4] = await Promise.all([
  readJson('evidence/claims.json'),
  readJson('evidence/unknowns.json'),
  readJson('evidence/reviews.json'),
  readJson('datasets/manifest.json'),
  readJson('evidence/concept-labels.json'),
  readJson('evidence/concept-labels-v4.json'),
])

const manifestValidation = validateDatasetManifest(manifest)
pushCheck('dataset manifest schema', manifestValidation.ok, manifestValidation.errors.join('; '))
if (manifestValidation.manifest) {
  const missingPaths = []
  for (const dataset of manifestValidation.manifest.datasets) {
    try { await access(path.join(root, dataset.path)) } catch { missingPaths.push(`${dataset.id}:${dataset.path}`) }
  }
  pushCheck('dataset manifest paths', missingPaths.length === 0, missingPaths.join(', '))
}

const knownClaimIds = new Set(claims.map((claim) => claim.id))
const brokenLabelRefs = []
for (const label of [...conceptLabels, ...conceptLabelsV4]) {
  for (const claimId of label.claimIds ?? []) if (!knownClaimIds.has(claimId)) brokenLabelRefs.push(`${label.node}:${claimId}`)
}
pushCheck('concept-label claim references', brokenLabelRefs.length === 0, brokenLabelRefs.join(', '))

const requiredDocs = [
  'README.md',
  'README.vi.md',
  'ROADMAP.md',
  'CONTRIBUTING.md',
  'SOURCING_POLICY.md',
  'docs/DEPLOYMENT.md',
  'docs/EVIDENCE_REVIEW_CAMPAIGN.md',
  'docs/SILICON_OPTICAL_DATA_GAP.md',
  'docs/PROVENANCE_COVERAGE_REPORT.md',
  'docs/LEARNING_CHECKPOINTS.md',
  'docs/V6_ACCESSIBILITY_EXPORT.md',
  'docs/V7_RELEASE_OFFLINE_A11Y.md',
]
const missingDocs = []
for (const relativePath of requiredDocs) {
  try { await access(path.join(root, relativePath)) } catch { missingDocs.push(relativePath) }
}
pushCheck('key documentation paths', missingDocs.length === 0, missingDocs.join(', '))

let workflowFiles = []
try {
  workflowFiles = (await readdir(path.join(root, '.github/workflows'))).filter((name) => /\.ya?ml$/i.test(name))
} catch (error) {
  if (error?.code !== 'ENOENT') throw error
}
pushCheck('GitHub Actions remains disabled', workflowFiles.length === 0, workflowFiles.join(', '))

const reviewKnownIds = new Set([...claims, ...unknowns].map((record) => record.id))
const reviewValidation = validateReviewRegistry(reviews, reviewKnownIds)
const reviewReadiness = reviewValidation.registry
  ? summarizeEvidenceReviewReadiness({ claims, unknowns, registry: reviewValidation.registry, minimumReviewedRecords: 10 })
  : null

const rawDir = path.join(root, 'benchmarks/raw')
const rawEntries = await readdir(rawDir, { withFileTypes: true })
const rawFiles = rawEntries.filter((entry) => entry.isFile() && entry.name.endsWith('.json') && entry.name !== 'RESULT_TEMPLATE.json').map((entry) => entry.name).sort()
const captures = []
for (const filename of rawFiles) {
  try { captures.push(JSON.parse(await readFile(path.join(rawDir, filename), 'utf8'))) } catch { /* capture validator above reports malformed JSON */ }
}
const rendererReadiness = summarizeRenderBenchmarkCaptures(captures)

const summary = summarizeRepositoryPreflight({ checks, rendererReadiness, reviewReadiness })
if (jsonMode) console.log(JSON.stringify(summary, null, 2))
else console.log(formatRepositoryPreflight(summary))
if (!summary.ok) process.exitCode = 1
