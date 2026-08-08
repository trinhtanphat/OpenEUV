export const reviewStates = ['proposed', 'reviewed', 'superseded']

const allowedTransitions = {
  proposed: new Set(['proposed', 'reviewed']),
  reviewed: new Set(['reviewed', 'superseded']),
  superseded: new Set(['superseded']),
}

const handlePattern = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/

export function validateReviewRecord(record, knownIds = new Set()) {
  const errors = []
  if (!record || typeof record !== 'object' || Array.isArray(record)) return { ok: false, errors: ['review record must be an object'], record: null }
  const id = String(record.id ?? '').trim()
  const state = String(record.state ?? '').trim()
  const contributors = Array.from(new Set((record.contributors ?? []).map((value) => String(value).trim()).filter(Boolean)))
  const reviewers = Array.from(new Set((record.reviewers ?? []).map((value) => String(value).trim()).filter(Boolean)))
  const supersededBy = record.supersededBy == null ? '' : String(record.supersededBy).trim()
  const note = record.note == null ? '' : String(record.note).trim()

  if (!id) errors.push('id is required')
  if (knownIds.size && !knownIds.has(id)) errors.push(`unknown evidence id ${id}`)
  if (!reviewStates.includes(state)) errors.push(`invalid review state ${state}`)
  for (const handle of [...contributors, ...reviewers]) {
    if (!handlePattern.test(handle)) errors.push(`invalid public contributor handle ${handle}`)
  }
  if (state === 'reviewed' && reviewers.length === 0) errors.push('reviewed records require at least one reviewer handle')
  if (state === 'superseded') {
    if (!supersededBy) errors.push('superseded records require supersededBy')
    else if (knownIds.size && !knownIds.has(supersededBy)) errors.push(`supersededBy references unknown evidence id ${supersededBy}`)
    if (supersededBy === id) errors.push('record cannot supersede itself')
  } else if (supersededBy) errors.push('supersededBy is only valid when state=superseded')

  return {
    ok: errors.length === 0,
    errors,
    record: errors.length ? null : { id, state, contributors, reviewers, ...(supersededBy ? { supersededBy } : {}), ...(note ? { note } : {}) },
  }
}

export function validateReviewRegistry(input, knownIds = new Set()) {
  const errors = []
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { ok: false, errors: ['registry must be an object'], registry: null }
  if (input.version !== 1) errors.push('registry version must be 1')
  if (!Array.isArray(input.reviews)) errors.push('reviews must be an array')
  const ids = new Set()
  const reviews = []
  for (const [index, record] of (input.reviews ?? []).entries()) {
    const result = validateReviewRecord(record, knownIds)
    errors.push(...result.errors.map((error) => `reviews[${index}]: ${error}`))
    if (!result.record) continue
    if (ids.has(result.record.id)) errors.push(`reviews[${index}]: duplicate review id ${result.record.id}`)
    else { ids.add(result.record.id); reviews.push(result.record) }
  }
  return { ok: errors.length === 0, errors, registry: errors.length ? null : { version: 1, reviews } }
}

export function canTransitionReviewState(from, to) {
  return Boolean(allowedTransitions[from]?.has(to))
}
