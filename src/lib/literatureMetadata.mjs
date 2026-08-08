export const literatureTopics = ['source', 'optics', 'multilayer', 'mask', 'metrology', 'motion', 'fab', 'contamination', 'high-na']

const doiPattern = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i
const isoYearPattern = /^(19|20)\d{2}$/

const cleanList = (value) => Array.from(new Set((Array.isArray(value) ? value : String(value ?? '').split(/[;,|]/)).map((item) => String(item).trim()).filter(Boolean)))

export function normalizeLiteratureRecord(record, index = 0) {
  const errors = []
  if (!record || typeof record !== 'object' || Array.isArray(record)) return { ok: false, errors: [`record ${index}: must be an object`], record: null }

  const doi = String(record.doi ?? '').trim().replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '').toLowerCase()
  const title = String(record.title ?? '').trim()
  const year = String(record.year ?? '').trim()
  const sourceUrl = String(record.sourceUrl ?? '').trim()
  const sourceName = String(record.sourceName ?? '').trim()
  const summary = String(record.summary ?? '').trim()
  const authors = cleanList(record.authors)
  const topics = cleanList(record.topics).map((topic) => topic.toLowerCase())

  if (!doiPattern.test(doi)) errors.push(`record ${index}: invalid DOI`)
  if (!title) errors.push(`record ${index}: title is required`)
  if (!isoYearPattern.test(year)) errors.push(`record ${index}: year must be YYYY`)
  if (!authors.length) errors.push(`record ${index}: at least one author is required`)
  if (!sourceName) errors.push(`record ${index}: sourceName is required`)
  if (!summary) errors.push(`record ${index}: original summary is required`)
  const invalidTopics = topics.filter((topic) => !literatureTopics.includes(topic))
  if (!topics.length) errors.push(`record ${index}: at least one topic is required`)
  if (invalidTopics.length) errors.push(`record ${index}: invalid topic(s): ${invalidTopics.join(', ')}`)
  try {
    const url = new URL(sourceUrl)
    if (!['http:', 'https:'].includes(url.protocol)) errors.push(`record ${index}: sourceUrl must use http/https`)
  } catch {
    errors.push(`record ${index}: sourceUrl must be a valid public URL`)
  }

  return {
    ok: errors.length === 0,
    errors,
    record: errors.length ? null : { doi, title, year: Number(year), authors, sourceName, sourceUrl, summary, topics },
  }
}

export function literatureCoverage(records) {
  const byTopic = Object.fromEntries(literatureTopics.map((topic) => [topic, 0]))
  records.forEach((record) => new Set(record.topics ?? []).forEach((topic) => { if (topic in byTopic) byTopic[topic] += 1 }))
  return { records: records.length, byTopic }
}

export function normalizeLiteratureRecords(records) {
  if (!Array.isArray(records)) return { ok: false, errors: ['input must be an array'], records: [], coverage: literatureCoverage([]) }
  const errors = []
  const normalized = []
  const dois = new Set()
  records.forEach((record, index) => {
    const result = normalizeLiteratureRecord(record, index)
    errors.push(...result.errors)
    if (!result.record) return
    if (dois.has(result.record.doi)) errors.push(`record ${index}: duplicate DOI ${result.record.doi}`)
    else {
      dois.add(result.record.doi)
      normalized.push(result.record)
    }
  })
  return { ok: errors.length === 0, errors, records: normalized, coverage: literatureCoverage(normalized) }
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

export function parseLiteratureCsv(text) {
  const rows = parseCsvRows(String(text ?? ''))
  if (rows.length < 2) return []
  const headers = rows[0].map((header) => header.trim())
  return rows.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ''])))
}
