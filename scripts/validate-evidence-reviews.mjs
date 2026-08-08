#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { validateReviewRegistry } from '../src/lib/evidenceReview.mjs'

const readJson = async (path) => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'))

try {
  const [claims, unknowns, reviews] = await Promise.all([
    readJson('evidence/claims.json'),
    readJson('evidence/unknowns.json'),
    readJson('evidence/reviews.json'),
  ])
  const knownIds = new Set([
    ...claims.map((claim) => claim.id),
    ...unknowns.map((unknown) => unknown.id),
  ])
  const result = validateReviewRegistry(reviews, knownIds)
  if (!result.ok) {
    console.error('Evidence review registry validation failed:')
    result.errors.forEach((error) => console.error(`- ${error}`))
    process.exitCode = 1
  } else {
    const counts = Object.fromEntries(['proposed', 'reviewed', 'superseded'].map((state) => [state, result.registry.reviews.filter((review) => review.state === state).length]))
    console.log(`Evidence review registry valid: ${result.registry.reviews.length} records (${counts.proposed} proposed, ${counts.reviewed} reviewed, ${counts.superseded} superseded).`)
  }
} catch (error) {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error))
  process.exitCode = 1
}
