import { validateResearchSnapshot } from './researchSnapshot.mjs'

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical)
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]))
}

function fingerprint(value) {
  return JSON.stringify(canonical(value))
}

function indexById(records, label) {
  const map = new Map()
  for (const record of records ?? []) {
    const id = String(record?.id ?? '').trim()
    if (!id) throw new Error(`${label} record is missing stable id`)
    if (map.has(id)) throw new Error(`${label} contains duplicate id ${id}`)
    map.set(id, record)
  }
  return map
}

function diffCollection(beforeRecords, afterRecords, label) {
  const before = indexById(beforeRecords, label)
  const after = indexById(afterRecords, label)
  const added = Array.from(after.keys()).filter((id) => !before.has(id)).sort()
  const removed = Array.from(before.keys()).filter((id) => !after.has(id)).sort()
  const changed = Array.from(before.keys()).filter((id) => after.has(id) && fingerprint(before.get(id)) !== fingerprint(after.get(id))).sort()
  return { added, removed, changed, changedCount: added.length + removed.length + changed.length }
}

export function diffResearchSnapshots(before, after) {
  const beforeValidation = validateResearchSnapshot(before)
  const afterValidation = validateResearchSnapshot(after)
  if (!beforeValidation.ok) throw new Error(`before snapshot invalid: ${beforeValidation.errors.join('; ')}`)
  if (!afterValidation.ok) throw new Error(`after snapshot invalid: ${afterValidation.errors.join('; ')}`)

  const claims = diffCollection(before.evidence.claims, after.evidence.claims, 'claims')
  const unknowns = diffCollection(before.evidence.unknowns, after.evidence.unknowns, 'unknowns')
  const fabCases = diffCollection(before.fabCases, after.fabCases, 'fabCases')
  const datasets = diffCollection(before.datasets.entries, after.datasets.entries, 'datasets')
  const buildChanged = fingerprint(before.build) !== fingerprint(after.build)
  const reviewCoverageChanged = fingerprint(before.reviewCoverage) !== fingerprint(after.reviewCoverage)
  const provenanceCoverageChanged = fingerprint(before.provenanceCoverage) !== fingerprint(after.provenanceCoverage)
  const contentChanged = [claims, unknowns, fabCases, datasets].some((part) => part.changedCount > 0)
  const generatedAtChanged = before.generatedAt !== after.generatedAt

  return {
    before: { generatedAt: before.generatedAt, build: before.build },
    after: { generatedAt: after.generatedAt, build: after.build },
    claims,
    unknowns,
    fabCases,
    datasets,
    buildChanged,
    reviewCoverageChanged,
    provenanceCoverageChanged,
    generatedAtChanged,
    contentChanged,
    timestampOnlyChange: generatedAtChanged && !contentChanged && !buildChanged && !reviewCoverageChanged && !provenanceCoverageChanged,
  }
}
