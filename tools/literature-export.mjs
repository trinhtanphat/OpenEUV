#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises'
import process from 'node:process'
import { literatureToBibtex, serializeLiteratureCslJson } from '../src/lib/literatureCitation.mjs'
import { normalizeLiteratureRecords } from '../src/lib/literatureMetadata.mjs'

const formatIndex = process.argv.indexOf('--format')
const outputIndex = process.argv.indexOf('--output')
const format = formatIndex >= 0 ? process.argv[formatIndex + 1] : 'bibtex'
const output = outputIndex >= 0 ? process.argv[outputIndex + 1] : null

if (!['bibtex', 'csl-json'].includes(format)) {
  console.error('Usage: node tools/literature-export.mjs --format <bibtex|csl-json> [--output file]')
  process.exit(2)
}
if ((formatIndex >= 0 && !process.argv[formatIndex + 1]) || (outputIndex >= 0 && !output)) {
  console.error('Missing value for --format or --output')
  process.exit(2)
}

const raw = JSON.parse(await readFile(new URL('../evidence/literature.json', import.meta.url), 'utf8'))
const normalized = normalizeLiteratureRecords(raw)
if (!normalized.ok) {
  console.error(`Literature export refused: ${normalized.errors.join('; ')}`)
  process.exit(1)
}

const text = format === 'bibtex' ? literatureToBibtex(normalized.records) : serializeLiteratureCslJson(normalized.records)
if (output) {
  await writeFile(output, text, 'utf8')
  console.log(`Wrote ${normalized.records.length} literature records to ${output} (${format}).`)
} else process.stdout.write(text)
