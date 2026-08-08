function asciiToken(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

function firstAuthorToken(record) {
  const author = String(record?.authors?.[0] ?? 'anon').trim()
  const parts = author.split(/\s+/).filter(Boolean)
  return asciiToken(parts.at(-1) ?? author) || 'anon'
}

function fnv1a32(value) {
  let hash = 0x811c9dc5
  for (const char of String(value ?? '')) {
    hash ^= char.codePointAt(0)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return hash.toString(16).padStart(8, '0')
}

export function baseCitationKey(record) {
  const doi = String(record?.doi ?? '').trim().toLowerCase()
  const year = Number.isInteger(record?.year) ? String(record.year) : 'nd'
  return `${firstAuthorToken(record)}${year}${fnv1a32(doi)}`
}

export function assignCitationKeys(records, keyFactory = baseCitationKey) {
  const counts = new Map()
  return (records ?? []).map((record) => {
    const base = String(keyFactory(record) ?? '').trim() || 'openeuv'
    const count = (counts.get(base) ?? 0) + 1
    counts.set(base, count)
    return { record, key: count === 1 ? base : `${base}-${count}` }
  })
}

function bibtexEscape(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/([{}&%_#$])/g, '\\$1')
    .replace(/\r?\n/g, ' ')
    .trim()
}

function bibtexType(publicationType) {
  if (publicationType === 'journal') return 'article'
  if (publicationType === 'conference') return 'inproceedings'
  return 'misc'
}

export function literatureToBibtex(records) {
  return `${assignCitationKeys(records).map(({ record, key }) => {
    const fields = [
      ['title', record.title],
      ['author', (record.authors ?? []).join(' and ')],
      ['year', record.year],
      ['doi', record.doi],
      ['url', record.sourceUrl],
      ['note', record.sourceName ? `OpenEUV public source: ${record.sourceName}; publication type: ${record.publicationType}` : `Publication type: ${record.publicationType}`],
    ].filter(([, value]) => String(value ?? '').trim())
    return `@${bibtexType(record.publicationType)}{${key},\n${fields.map(([name, value]) => `  ${name} = {${bibtexEscape(value)}}`).join(',\n')}\n}`
  }).join('\n\n')}\n`
}

function cslType(publicationType) {
  if (publicationType === 'journal') return 'article-journal'
  if (publicationType === 'conference') return 'paper-conference'
  return 'manuscript'
}

export function literatureToCslJson(records) {
  return assignCitationKeys(records).map(({ record, key }) => ({
    id: key,
    type: cslType(record.publicationType),
    title: record.title,
    author: (record.authors ?? []).map((author) => ({ literal: author })),
    issued: { 'date-parts': [[record.year]] },
    DOI: record.doi,
    URL: record.sourceUrl,
    note: `OpenEUV public source: ${record.sourceName}; publication type: ${record.publicationType}`,
  }))
}

export function serializeLiteratureCslJson(records) {
  return `${JSON.stringify(literatureToCslJson(records), null, 2)}\n`
}
