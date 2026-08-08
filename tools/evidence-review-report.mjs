#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { validateReviewRegistry } from '../src/lib/evidenceReview.mjs'
import { summarizeEvidenceReviewReadiness } from '../src/lib/evidenceReviewReadiness.mjs'

const readJson = async (path) => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'))

const [claims, unknowns, reviews] = await Promise.all([
  readJson('evidence/claims.json'),
  readJson('evidence/unknowns.json'),
  readJson('evidence/reviews.json'),
])
const records = [...claims, ...unknowns]
const knownIds = new Set(records.map((record) => record.id))
const validation = validateReviewRegistry(reviews, knownIds)
if (!validation.ok || !validation.registry) {
  console.error(validation.errors.join('\n'))
  process.exit(1)
}
const reviewById = new Map(validation.registry.reviews.map((review) => [review.id, review]))
const counts = { proposed: 0, reviewed: 0, superseded: 0, untracked: 0 }
const byComponent = {}
for (const record of records) {
  const state = reviewById.get(record.id)?.state ?? 'untracked'
  counts[state] += 1
  const component = record.component ?? 'unknown'
  byComponent[component] ??= { proposed: 0, reviewed: 0, superseded: 0, untracked: 0 }
  byComponent[component][state] += 1
}
const readiness = summarizeEvidenceReviewReadiness({ claims, unknowns, registry: validation.registry, minimumReviewedRecords: 10 })
const payload = {
  totalEvidenceRecords: records.length,
  reviewRegistryRecords: validation.registry.reviews.length,
  counts,
  byComponent,
  campaignReadiness: readiness,
}
if (process.argv.includes('--json')) console.log(JSON.stringify(payload, null, 2))
else {
  console.log('OpenEUV evidence review coverage')
  console.log(`total: ${payload.totalEvidenceRecords}`)
  console.log(`proposed: ${counts.proposed} | reviewed: ${counts.reviewed} | superseded: ${counts.superseded} | untracked: ${counts.untracked}`)
  console.log(`campaign reviewed: ${readiness.reviewedRecords}/${readiness.minimumReviewedRecords} | missing: ${readiness.missingReviewedRecords} | minimum-count ready: ${readiness.readyForMinimumCampaignCount ? 'yes' : 'no'}`)
  console.log(`reviewed categories: ${readiness.reviewedCategories.join(', ') || 'none'}`)
  console.log(`uncovered categories: ${readiness.uncoveredCategories.join(', ') || 'none'}`)
  for (const [component, componentCounts] of Object.entries(byComponent)) {
    console.log(`${component}: ${Object.entries(componentCounts).map(([state, count]) => `${state}=${count}`).join(' ')}`)
  }
}
