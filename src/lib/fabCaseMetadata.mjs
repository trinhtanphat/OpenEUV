export const fabCaseKinds = ['foundry', 'research-fab', 'scanner-interface', 'mask-lifecycle']

const idPattern = /^[a-z0-9][a-z0-9._-]+$/
const claimPattern = /^[A-Z0-9][A-Z0-9._-]+$/

const cleanList = (value) => Array.from(new Set((Array.isArray(value) ? value : String(value ?? '').split(/[;,|]/)).map((item) => String(item).trim()).filter(Boolean)))

export function validateFabCaseRecord(record, index = 0, knownClaimIds = new Set()) {
  const errors = []
  if (!record || typeof record !== 'object' || Array.isArray(record)) return { ok: false, errors: [`record ${index}: must be an object`], record: null }
  const id = String(record.id ?? '').trim().toLowerCase()
  const kind = String(record.kind ?? '').trim()
  const organization = String(record.organization ?? '').trim()
  const year = String(record.year ?? '').trim()
  const title = String(record.title ?? '').trim()
  const summary = String(record.summary ?? '').trim()
  const whyItMatters = String(record.whyItMatters ?? '').trim()
  const publicBoundary = String(record.publicBoundary ?? '').trim()
  const unknowns = cleanList(record.unknowns)
  const claimIds = cleanList(record.claimIds).map((claim) => claim.toUpperCase())
  const sourceUrls = cleanList(record.sourceUrls)

  if (!idPattern.test(id)) errors.push(`record ${index}: invalid id`)
  if (!fabCaseKinds.includes(kind)) errors.push(`record ${index}: invalid kind ${kind}`)
  if (!organization) errors.push(`record ${index}: organization is required`)
  if (!year) errors.push(`record ${index}: public year/date label is required`)
  if (!title) errors.push(`record ${index}: title is required`)
  if (summary.length < 40) errors.push(`record ${index}: summary must explain the public fact`)
  if (whyItMatters.length < 30) errors.push(`record ${index}: whyItMatters is required`)
  if (publicBoundary.length < 30) errors.push(`record ${index}: publicBoundary must state what is not established`)
  if (!unknowns.length) errors.push(`record ${index}: at least one explicit unknown is required`)
  if (!claimIds.length) errors.push(`record ${index}: at least one evidence claim ID is required`)
  for (const claimId of claimIds) {
    if (!claimPattern.test(claimId)) errors.push(`record ${index}: invalid claim ID ${claimId}`)
    else if (knownClaimIds.size && !knownClaimIds.has(claimId)) errors.push(`record ${index}: unknown claim ID ${claimId}`)
  }
  if (!sourceUrls.length) errors.push(`record ${index}: at least one first-party/public source URL is required`)
  sourceUrls.forEach((sourceUrl) => {
    try {
      const url = new URL(sourceUrl)
      if (url.protocol !== 'https:') errors.push(`record ${index}: source URL must use https`)
    } catch {
      errors.push(`record ${index}: invalid source URL ${sourceUrl}`)
    }
  })

  return {
    ok: errors.length === 0,
    errors,
    record: errors.length ? null : { id, kind, organization, year, title, summary, whyItMatters, claimIds, sourceUrls, publicBoundary, unknowns },
  }
}

export function validateFabCaseCollection(records, knownClaimIds = new Set()) {
  if (!Array.isArray(records)) return { ok: false, errors: ['fab cases must be an array'], records: [] }
  const errors = []
  const normalized = []
  const ids = new Set()
  records.forEach((record, index) => {
    const result = validateFabCaseRecord(record, index, knownClaimIds)
    errors.push(...result.errors)
    if (!result.record) return
    if (ids.has(result.record.id)) errors.push(`record ${index}: duplicate fab case ID ${result.record.id}`)
    else { ids.add(result.record.id); normalized.push(result.record) }
  })
  return { ok: errors.length === 0, errors, records: normalized }
}
