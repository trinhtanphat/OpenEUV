import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { renderBenchmarkSummaryMarkdown, summarizeRenderBenchmarkCaptures, validateRenderBenchmarkCapture } from '../src/lib/renderBenchmark.mjs'

const rawDir = path.resolve('benchmarks/raw')
const args = new Set(process.argv.slice(2))
const jsonMode = args.has('--json')
const validateOnly = args.has('--validate-only')

async function readCaptures() {
  const entries = await fs.readdir(rawDir, { withFileTypes: true })
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json') && entry.name !== 'RESULT_TEMPLATE.json')
    .map((entry) => entry.name)
    .sort()
  const captures = []
  const parseErrors = []
  for (const file of files) {
    try {
      const parsed = JSON.parse(await fs.readFile(path.join(rawDir, file), 'utf8'))
      captures.push({ file, value: parsed })
    } catch (error) {
      parseErrors.push({ file, error: error instanceof Error ? error.message : String(error) })
    }
  }
  return { captures, parseErrors }
}

const { captures: fileCaptures, parseErrors } = await readCaptures()
const validationErrors = []
for (const item of fileCaptures) {
  const validation = validateRenderBenchmarkCapture(item.value)
  if (!validation.ok) validationErrors.push({ file: item.file, errors: validation.errors })
}

if (parseErrors.length || validationErrors.length) {
  console.error(JSON.stringify({ parseErrors, validationErrors }, null, 2))
  process.exitCode = 1
} else if (validateOnly) {
  console.log(`Renderer benchmark captures valid: ${fileCaptures.length}`)
} else {
  const summary = summarizeRenderBenchmarkCaptures(fileCaptures.map((item) => item.value))
  if (jsonMode) console.log(JSON.stringify(summary, null, 2))
  else console.log(renderBenchmarkSummaryMarkdown(summary))
}
