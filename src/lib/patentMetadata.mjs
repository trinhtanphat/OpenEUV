export const patentSubsystems = ['source', 'collector', 'illumination', 'reticle', 'projection', 'stage', 'metrology', 'vacuum']

const publicationPattern = /^(?:US|EP|WO|JP|KR|CN|TW)[A-Z0-9./-]+$/i
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/

const cleanList = (value) => Array.from(new Set((Array.isArray(value) ? value : String(value ?? '').split(/[;,|]/)).map((item) => String(item).trim()).filter(Boolean)))

export function normalizePatentRecord(record, index = 0) {
  const errors = []
  if (!record || typeof record !== 'object' || Array.isArray(record)) return { ok: false, errors: [`record ${index}: must be an object`], record: null }
  const id = String(record.id ?? record.publicationNumber ?? '').trim().toUpperCase()
  const familyId = String(record.familyId ?? '').trim().toUpperCase()
  const title = String(record.title ?? '').trim()
  const priorityDate = String(record.priorityDate ?? '').trim()
  const publicationDate = String(record.publicationDate ?? '').trim()
  const assignee = String(record.assignee ?? '').trim()
  const summary = String(record.summary ?? '').trim()
  const url = String(record.url ?? '').trim()
  const subsystem = String(record.subsystem ?? '').trim().toLowerCase()
  const linkedSubsystems = cleanList(record.linkedSubsystems?.length ? record.linkedSubsystems : [subsystem]).map((item) => item.toLowerCase())
  const familyMembers = cleanList(record.familyMembers?.length ? record.familyMembers : [id]).map((item) => item.toUpperCase())

  if (!publicationPattern.test(id)) errors.push(`record ${index}: invalid publication id`)
  if (!familyId) errors.push(`record ${index}: familyId is required`)
  if (!title) errors.push(`record ${index}: title is required`)
  if (!isoDatePattern.test(priorityDate)) errors.push(`record ${index}: priorityDate must be YYYY-MM-DD`)
  if (!isoDatePattern.test(publicationDate)) errors.push(`record ${index}: publicationDate must be YYYY-MM-DD`)
  if (!patentSubsystems.includes(subsystem)) errors.push(`record ${index}: invalid subsystem ${subsystem}`)
  const invalidLinks = linkedSubsystems.filter((item) => !patentSubsystems.includes(item))
  if (invalidLinks.length) errors.push(`record ${index}: invalid linked subsystem(s): ${invalidLinks.join(', ')}`)
  if (!assignee) errors.push(`record ${index}: assignee is required`)
  if (!summary) errors.push(`record ${index}: original summary is required`)
  try {
    const parsedUrl = new URL(url)
    if (parsedUrl.protocol !== 'https:' || !parsedUrl.hostname.endsWith('patents.google.com')) errors.push(`record ${index}: url must be an https Google Patents record`)
  } catch {
    errors.push(`record ${index}: invalid patent URL`)
  }

  return {
    ok: errors.length === 0,
    errors,
    record: errors.length ? null : {
      id,
      familyId,
      familyLabel: String(record.familyLabel ?? familyId).trim(),
      familyMembers,
      title,
      priorityDate,
      publicationDate,
      subsystem,
      linkedSubsystems,
      assignee,
      applicationNumber: String(record.applicationNumber ?? '').trim() || undefined,
      summary,
      url,
      confidence: 'patent',
    },
  }
}

export function normalizePatentRecords(records) {
  if (!Array.isArray(records)) return { ok: false, errors: ['input must be an array'], records: [], coverage: patentCoverage([]) }
  const errors = []
  const normalized = []
  const ids = new Set()
  records.forEach((record, index) => {
    const result = normalizePatentRecord(record, index)
    errors.push(...result.errors)
    if (!result.record) return
    if (ids.has(result.record.id)) errors.push(`record ${index}: duplicate publication id ${result.record.id}`)
    else {
      ids.add(result.record.id)
      normalized.push(result.record)
    }
  })
  return { ok: errors.length === 0, errors, records: normalized, coverage: patentCoverage(normalized) }
}

export function patentCoverage(records) {
  const bySubsystem = Object.fromEntries(patentSubsystems.map((subsystem) => [subsystem, 0]))
  const families = new Set()
  records.forEach((record) => {
    families.add(record.familyId)
    new Set(record.linkedSubsystems ?? [record.subsystem]).forEach((subsystem) => {
      if (subsystem in bySubsystem) bySubsystem[subsystem] += 1
    })
  })
  return { publications: records.length, families: families.size, bySubsystem }
}

function parseCsvRows(text) {
  const rows = []
  let row = [], field = '', quoted = false
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    if (char === '"') {
      if (quoted && text[index + 1] === '"') { field += '"'; index += 1 }
      else quoted = !quoted
    } else if (char === ',' && !quoted) { row.push(field); field = '' }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[index + 1] === '\n') index += 1
      row.push(field); field = ''
      if (row.some((value) => value.trim())) rows.push(row)
      row = []
    } else field += char
  }
  row.push(field)
  if (row.some((value) => value.trim())) rows.push(row)
  return rows
}

export function parsePatentCsv(text) {
  const rows = parseCsvRows(String(text ?? ''))
  if (rows.length < 2) return []
  const headers = rows[0].map((header) => header.trim())
  return rows.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ''])))
}
