#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import process from 'node:process'
import { auditBilingualDictionary, auditNestedBilingualPairs, extractI18nCopyDictionary } from '../src/lib/bilingualCoverage.mjs'

const jsonMode = process.argv.includes('--json')
const [i18nSource, learningPathSource, checkpoints] = await Promise.all([
  readFile(new URL('../src/i18n.ts', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/learningPath.ts', import.meta.url), 'utf8'),
  readFile(new URL('../evidence/learning-checkpoints.json', import.meta.url), 'utf8').then(JSON.parse),
])

const errors = []
const warnings = []

if (!/export\s+type\s+Language\s*=\s*'en'\s*\|\s*'vi'/.test(i18nSource)) errors.push("Language type must remain exactly 'en' | 'vi'")

let extracted
try { extracted = extractI18nCopyDictionary(i18nSource) }
catch (error) {
  errors.push(`cannot extract canonical copy dictionary: ${error.message}`)
  extracted = { dictionary: { en: {}, vi: {} }, duplicates: [] }
}
for (const duplicate of extracted.duplicates) errors.push(`duplicate translation key: ${duplicate}`)
const dictionaryAudit = auditBilingualDictionary(extracted.dictionary)
errors.push(...dictionaryAudit.errors)

const checkpointAudit = auditNestedBilingualPairs(checkpoints, { path: 'learning-checkpoints' })
errors.push(...checkpointAudit.errors)

function count(pattern, source) {
  return Array.from(source.matchAll(pattern)).length
}

const learningLevels = count(/^\s{4}id:\s*['"][^'"]+['"],?\s*$/gm, learningPathSource)
const learningFieldCounts = {
  title: count(/^\s{4}title:\s*\{\s*en:\s*(['"]).+?\1,\s*vi:\s*(['"]).+?\2\s*\},?\s*$/gm, learningPathSource),
  goal: count(/^\s{4}goal:\s*\{\s*en:\s*(['"]).+?\1,\s*vi:\s*(['"]).+?\2\s*\},?\s*$/gm, learningPathSource),
  contribution: count(/^\s{4}contribution:\s*\{\s*en:\s*(['"]).+?\1,\s*vi:\s*(['"]).+?\2\s*\},?\s*$/gm, learningPathSource),
  topicsEn: count(/^\s{6}en:\s*\[[^\]]+\],?\s*$/gm, learningPathSource),
  topicsVi: count(/^\s{6}vi:\s*\[[^\]]+\],?\s*$/gm, learningPathSource),
}
if (learningLevels === 0) errors.push('learningPath source contains no level records')
for (const [field, fieldCount] of Object.entries(learningFieldCounts)) {
  if (fieldCount !== learningLevels) errors.push(`learningPath ${field} bilingual coverage ${fieldCount}/${learningLevels}`)
}

const summary = {
  ok: errors.length === 0,
  errors,
  warnings,
  dictionary: { keys: dictionaryAudit.keys, completePairs: dictionaryAudit.translatedPairs },
  checkpoints: { pairs: checkpointAudit.pairs, completePairs: checkpointAudit.completePairs, records: checkpoints.length },
  learningPath: { levels: learningLevels, ...learningFieldCounts },
}

if (jsonMode) console.log(JSON.stringify(summary, null, 2))
else {
  console.log(`OpenEUV EN/VI coverage audit: ${summary.ok ? 'PASS' : 'FAIL'}`)
  console.log(`dictionary=${summary.dictionary.completePairs}/${summary.dictionary.keys} checkpoints=${summary.checkpoints.completePairs}/${summary.checkpoints.pairs} learningLevels=${learningLevels}`)
  for (const warning of warnings) console.warn(`warning: ${warning}`)
  for (const error of errors) console.error(`error: ${error}`)
  console.log('Structural coverage does not imply native-speaker linguistic review.')
}
if (!summary.ok) process.exitCode = 1
