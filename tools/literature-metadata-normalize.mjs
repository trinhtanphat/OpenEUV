#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises'
import { extname } from 'node:path'
import { normalizeLiteratureRecords, parseLiteratureCsv } from '../src/lib/literatureMetadata.mjs'

function usage() {
  console.log('Usage: node tools/literature-metadata-normalize.mjs <input.json|input.csv> [output.json]')
}

const [, , inputPath, outputPath] = process.argv
if (!inputPath) {
  usage()
  process.exitCode = 2
} else {
  try {
    const raw = await readFile(inputPath, 'utf8')
    const extension = extname(inputPath).toLowerCase()
    const input = extension === '.csv' ? parseLiteratureCsv(raw) : JSON.parse(raw)
    const result = normalizeLiteratureRecords(input)
    if (!result.ok) {
      console.error(result.errors.join('\n'))
      process.exitCode = 1
    } else {
      const payload = JSON.stringify({ records: result.records, coverage: result.coverage }, null, 2) + '\n'
      if (outputPath) await writeFile(outputPath, payload)
      else process.stdout.write(payload)
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}
