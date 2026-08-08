#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import process from 'node:process'
import { validateResearchSnapshot } from '../src/lib/researchSnapshot.mjs'
import { diffResearchSnapshots } from '../src/lib/researchSnapshotDiff.mjs'

const [command, ...rest] = process.argv.slice(2)
const jsonMode = rest.includes('--json')
const args = rest.filter((arg) => arg !== '--json')

async function readSnapshot(path) {
  let parsed
  try { parsed = JSON.parse(await readFile(path, 'utf8')) }
  catch (error) { throw new Error(`cannot read/parse ${path}: ${error.message}`) }
  return parsed
}

function failUsage() {
  console.error('Usage:\n  node tools/research-snapshot-inspect.mjs verify <snapshot.json> [--json]\n  node tools/research-snapshot-inspect.mjs diff <before.json> <after.json> [--json]')
  process.exit(2)
}

if (command === 'verify') {
  if (args.length !== 1) failUsage()
  const snapshot = await readSnapshot(args[0])
  const validation = validateResearchSnapshot(snapshot)
  const summary = {
    ok: validation.ok,
    errors: validation.errors,
    schemaVersion: snapshot?.schemaVersion ?? null,
    generatedAt: snapshot?.generatedAt ?? null,
    build: snapshot?.build ?? null,
    counts: {
      claims: snapshot?.evidence?.claims?.length ?? 0,
      unknowns: snapshot?.evidence?.unknowns?.length ?? 0,
      fabCases: snapshot?.fabCases?.length ?? 0,
      datasets: snapshot?.datasets?.entries?.length ?? 0,
    },
  }
  if (jsonMode) console.log(JSON.stringify(summary, null, 2))
  else {
    console.log(`OpenEUV snapshot verify: ${summary.ok ? 'PASS' : 'FAIL'}`)
    console.log(`schema=${summary.schemaVersion} generatedAt=${summary.generatedAt ?? 'unknown'} build=${summary.build?.version ?? 'unknown'}@${summary.build?.commit ?? 'unknown'}`)
    console.log(`claims=${summary.counts.claims} unknowns=${summary.counts.unknowns} fab=${summary.counts.fabCases} datasets=${summary.counts.datasets}`)
    for (const error of summary.errors) console.error(`error: ${error}`)
  }
  if (!summary.ok) process.exitCode = 1
} else if (command === 'diff') {
  if (args.length !== 2) failUsage()
  const [before, after] = await Promise.all(args.map(readSnapshot))
  let diff
  try { diff = diffResearchSnapshots(before, after) }
  catch (error) {
    console.error(`OpenEUV snapshot diff refused: ${error.message}`)
    process.exit(1)
  }
  if (jsonMode) console.log(JSON.stringify(diff, null, 2))
  else {
    console.log(`OpenEUV snapshot diff: contentChanged=${diff.contentChanged} timestampOnly=${diff.timestampOnlyChange}`)
    console.log(`build: ${diff.before.build.version}@${diff.before.build.commit} -> ${diff.after.build.version}@${diff.after.build.commit}${diff.buildChanged ? ' (changed)' : ''}`)
    for (const [label, part] of [['claims', diff.claims], ['unknowns', diff.unknowns], ['fabCases', diff.fabCases], ['datasets', diff.datasets]]) {
      console.log(`${label}: +${part.added.length} -${part.removed.length} ~${part.changed.length}`)
      if (part.added.length) console.log(`  added: ${part.added.join(', ')}`)
      if (part.removed.length) console.log(`  removed: ${part.removed.join(', ')}`)
      if (part.changed.length) console.log(`  changed: ${part.changed.join(', ')}`)
    }
    console.log(`coverage: review=${diff.reviewCoverageChanged ? 'changed' : 'same'} provenance=${diff.provenanceCoverageChanged ? 'changed' : 'same'}`)
  }
} else failUsage()
