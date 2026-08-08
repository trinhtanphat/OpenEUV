#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises'
import { basename } from 'node:path'
import { validateOpticalDataset } from '../src/lib/opticalConstants.mjs'

function usage() {
  console.log('Usage: node tools/import-refractiveindex-yaml.mjs <record.yml> <material> <dataset-id> <source-url> <upstream-revision> [output.json]')
}

function parseTabulatedNk(text) {
  const lines = String(text).split(/\r?\n/)
  const typeLine = lines.findIndex((line) => /type:\s*tabulated\s+nk/i.test(line))
  if (typeLine < 0) throw new Error('Only refractiveindex.info records with type: tabulated nk are supported')
  const dataLine = lines.findIndex((line, index) => index > typeLine && /^\s*data:\s*\|\s*$/.test(line))
  if (dataLine < 0) throw new Error('Missing tabulated nk data block')
  const samples = []
  for (let index = dataLine + 1; index < lines.length; index += 1) {
    const line = lines[index]
    if (!/^\s+/.test(line) || /^\s*[A-Za-z_-]+\s*:/.test(line)) break
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const parts = trimmed.split(/\s+/).map(Number)
    if (parts.length < 3 || parts.some((value) => !Number.isFinite(value))) continue
    const [wavelengthUm, n, k] = parts
    samples.push({ wavelengthNm: wavelengthUm * 1000, n, k })
  }
  if (!samples.length) throw new Error('No tabulated nk rows were parsed')
  return samples
}

function extractReference(text) {
  const block = String(text).match(/REFERENCES:\s*\|\s*\n([\s\S]*?)(?:\n\S|$)/i)
  if (!block) return ''
  return block[1].split(/\r?\n/).map((line) => line.trim()).filter(Boolean).join(' ')
}

const [, , inputPath, material, datasetId, sourceUrl, upstreamRevision, outputPath] = process.argv
if (!inputPath || !material || !datasetId || !sourceUrl || !upstreamRevision) {
  usage()
  process.exitCode = 2
} else {
  try {
    const raw = await readFile(inputPath, 'utf8')
    const samples = parseTabulatedNk(raw)
    const reference = extractReference(raw)
    const dataset = {
      id: datasetId,
      material,
      description: `Imported from refractiveindex.info record ${basename(inputPath)} at pinned upstream revision ${upstreamRevision}.`,
      source: { name: `refractiveindex.info · ${basename(inputPath)} · ${upstreamRevision}`, url: sourceUrl },
      license: 'CC0-1.0 (refractiveindex.info database); preserve record-level bibliographic provenance',
      provenanceNote: reference ? `Upstream reference: ${reference}` : `Imported from the pinned upstream record; inspect the original YAML for record-level reference metadata.`,
      wavelengthUnit: 'nm',
      samples,
    }
    const validation = validateOpticalDataset(dataset)
    if (!validation.ok || !validation.dataset) throw new Error(validation.errors.join('; '))
    const min = samples[0].wavelengthNm
    const max = samples[samples.length - 1].wavelengthNm
    if (13.5 < Math.min(min, max) || 13.5 > Math.max(min, max)) {
      console.error(`warning: 13.5 nm is outside this record's tabulated range (${Math.min(min, max)}–${Math.max(min, max)} nm); do not use the record as an EUV default without explicit extrapolation.`)
    }
    const payload = JSON.stringify(validation.dataset, null, 2) + '\n'
    if (outputPath) await writeFile(outputPath, payload)
    else process.stdout.write(payload)
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}
