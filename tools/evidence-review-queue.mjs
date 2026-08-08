#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { buildEvidenceReviewQueue, summarizeEvidenceReviewQueue } from '../src/lib/evidenceReviewQueue.mjs'

const args = process.argv.slice(2)
const jsonMode = args.includes('--json')
const limitIndex = args.indexOf('--limit')
const limit = limitIndex >= 0 ? Number(args[limitIndex + 1]) : 12

const claims = JSON.parse(await readFile(new URL('../evidence/claims.json', import.meta.url), 'utf8'))
const unknowns = JSON.parse(await readFile(new URL('../evidence/unknowns.json', import.meta.url), 'utf8'))
const reviewRegistry = JSON.parse(await readFile(new URL('../evidence/reviews.json', import.meta.url), 'utf8'))
const queue = buildEvidenceReviewQueue({ claims, unknowns, reviews: reviewRegistry.reviews ?? [], limit })
const summary = summarizeEvidenceReviewQueue(queue)

if (jsonMode) {
  console.log(JSON.stringify({ generatedAt: new Date().toISOString(), summary, queue }, null, 2))
  process.exit(0)
}

console.log(`# OpenEUV evidence review queue\n`)
console.log(`Generated from current claims/unknowns/review registry. This queue does not mark anything reviewed and does not assign reviewer identity.`)
console.log(`\nSelected: ${summary.total} records · claims ${summary.byType.claim ?? 0} · unknowns ${summary.byType.unknown ?? 0}`)
console.log(`Class coverage: ${Object.entries(summary.byClass).map(([key, value]) => `${key}:${value}`).join(' · ') || 'none'}\n`)
queue.forEach((item, index) => {
  console.log(`## ${index + 1}. ${item.id}`)
  console.log(`- type: ${item.recordType}`)
  console.log(`- component: ${item.component}`)
  if (item.evidenceClass) console.log(`- class: ${item.evidenceClass}`)
  if (item.priority) console.log(`- priority: ${item.priority}`)
  console.log(`- current review state: ${item.reviewState}`)
  console.log(`- why queued: ${item.reason}`)
  console.log(`- text: ${item.text}`)
  for (const source of item.sources ?? []) console.log(`- source: ${source.name} — ${source.url}`)
  console.log('')
})
