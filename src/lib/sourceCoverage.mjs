import { patentMetadataCompleteness } from './patentAudit.mjs'

const increment = (map, key) => { map[key] = (map[key] ?? 0) + 1 }

function publicDomain(url) {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.hostname.toLowerCase() : null
  } catch {
    return null
  }
}

function sourceLabel(name, url) {
  const text = String(name ?? '').trim()
  const known = ['ASML', 'ZEISS', 'TSMC', 'Samsung', 'Intel', 'Micron', 'SK hynix', 'Rapidus', 'imec', 'LBNL', 'CXRO']
  const match = known.find((label) => text.toLowerCase().startsWith(label.toLowerCase()))
  return match ?? publicDomain(url) ?? (text || 'unknown')
}

function extractObjectsFromPatentArray(source) {
  const marker = 'export const patents'
  const markerIndex = source.indexOf(marker)
  if (markerIndex < 0) return []
  const arrayStart = source.indexOf('[', markerIndex)
  if (arrayStart < 0) return []
  const objects = []
  let depth = 0
  let objectStart = -1
  let quote = ''
  let escaped = false
  for (let index = arrayStart + 1; index < source.length; index += 1) {
    const char = source[index]
    if (quote) {
      if (escaped) escaped = false
      else if (char === '\\') escaped = true
      else if (char === quote) quote = ''
      continue
    }
    if (char === "'" || char === '"' || char === '`') { quote = char; continue }
    if (char === '{') {
      if (depth === 0) objectStart = index
      depth += 1
    } else if (char === '}') {
      depth -= 1
      if (depth === 0 && objectStart >= 0) {
        objects.push(source.slice(objectStart, index + 1))
        objectStart = -1
      }
    } else if (char === ']' && depth === 0) break
  }
  return objects
}

function scalar(block, field) {
  const match = block.match(new RegExp(`\\b${field}\\s*:\\s*['\"]([^'\"]*)['\"]`))
  return match?.[1] ?? ''
}

function array(block, field) {
  const match = block.match(new RegExp(`\\b${field}\\s*:\\s*\\[([^\\]]*)\\]`))
  if (!match) return []
  return Array.from(match[1].matchAll(/['"]([^'"]+)['"]/g), (item) => item[1])
}

export function parsePatentRecordsForCoverage(source) {
  return extractObjectsFromPatentArray(String(source ?? '')).map((block) => ({
    id: scalar(block, 'id'),
    familyId: scalar(block, 'familyId'),
    title: scalar(block, 'title'),
    priorityDate: scalar(block, 'priorityDate'),
    publicationDate: scalar(block, 'publicationDate'),
    subsystem: scalar(block, 'subsystem'),
    linkedSubsystems: array(block, 'linkedSubsystems'),
    assignee: scalar(block, 'assignee'),
    applicationNumber: scalar(block, 'applicationNumber'),
    summary: scalar(block, 'summary'),
    url: scalar(block, 'url'),
    familyMembers: array(block, 'familyMembers'),
  }))
}

export function summarizeSourceCoverage({ claims = [], unknowns = [], reviews = { reviews: [] }, fabCases = [], opticalDataGaps = null, patentRecords = [] } = {}) {
  const byClass = {}
  const byComponent = {}
  const sourceDomains = {}
  const sourceOrganizations = {}
  const noDirectSourceIds = []
  const inferenceRationaleGaps = []

  for (const claim of claims) {
    increment(byClass, claim.class ?? 'unknown')
    increment(byComponent, claim.component ?? 'unknown')
    const validSources = (claim.sources ?? []).filter((source) => publicDomain(source?.url))
    if (!validSources.length) noDirectSourceIds.push(claim.id)
    for (const source of validSources) {
      increment(sourceDomains, publicDomain(source.url))
      increment(sourceOrganizations, sourceLabel(source.name, source.url))
    }
    if (claim.class === 'D' && !String(claim.rationale ?? '').trim()) inferenceRationaleGaps.push(claim.id)
  }

  const reviewById = new Map((reviews?.reviews ?? []).map((review) => [review.id, review]))
  const reviewStates = { reviewed: 0, proposed: 0, superseded: 0, unreviewed: 0 }
  for (const record of [...claims, ...unknowns]) {
    const state = reviewById.get(record.id)?.state ?? 'unreviewed'
    increment(reviewStates, state)
  }

  const unresolvedUnknownIds = unknowns.filter((item) => !['resolved', 'closed'].includes(String(item.status ?? '').toLowerCase())).map((item) => item.id)

  let fabCasesWithPublicSources = 0
  const fabCasesWithoutPublicSources = []
  for (const item of fabCases) {
    const urls = (item.sourceUrls ?? []).filter((url) => publicDomain(url))
    if (urls.length) fabCasesWithPublicSources += 1
    else fabCasesWithoutPublicSources.push(item.id)
    for (const url of urls) increment(sourceDomains, publicDomain(url))
  }

  const patentCompleteness = patentRecords.map((record) => ({ id: record.id, ...patentMetadataCompleteness(record) }))
  const patentAverageCompleteness = patentCompleteness.length
    ? patentCompleteness.reduce((sum, item) => sum + item.score, 0) / patentCompleteness.length
    : 0
  const incompletePatentIds = patentCompleteness.filter((item) => item.percent < 100).map((item) => item.id || '<missing-id>')
  for (const record of patentRecords) {
    const domain = publicDomain(record.url)
    if (domain) increment(sourceDomains, domain)
    if (record.assignee) increment(sourceOrganizations, record.assignee)
  }

  const licenseGaps = (opticalDataGaps?.candidates ?? [])
    .filter((candidate) => candidate.vendorable === false)
    .map((candidate) => ({ source: candidate.source, license: candidate.license, coversTarget: candidate.coversTarget, reason: candidate.reason }))

  return {
    evidence: {
      totalClaims: claims.length,
      byClass,
      byComponent,
      noDirectSourceIds,
      inferenceRationaleGaps,
    },
    sources: { byDomain: sourceDomains, byOrganization: sourceOrganizations },
    reviews: { states: reviewStates },
    unknowns: { total: unknowns.length, unresolvedIds: unresolvedUnknownIds },
    fabCases: { total: fabCases.length, withPublicSources: fabCasesWithPublicSources, withoutPublicSourceIds: fabCasesWithoutPublicSources },
    patents: {
      total: patentRecords.length,
      averageCompleteness: patentAverageCompleteness,
      incompletePatentIds,
      records: patentCompleteness,
    },
    dataLicenseGaps: licenseGaps,
  }
}

export function renderSourceCoverageMarkdown(report) {
  const lines = [
    '# OpenEUV source coverage report',
    '',
    'This report summarizes repository sourcing/provenance coverage. It does not rank commercial importance and does not redefine OpenEUV evidence classes.',
    '',
    `- Evidence claims: ${report.evidence.totalClaims}`,
    `- Claims without direct public source URL: ${report.evidence.noDirectSourceIds.length}`,
    `- Class D rationale gaps: ${report.evidence.inferenceRationaleGaps.length}`,
    `- Unresolved unknowns: ${report.unknowns.unresolvedIds.length}`,
    `- Fab cases with public sources: ${report.fabCases.withPublicSources}/${report.fabCases.total}`,
    `- Patent metadata average completeness: ${(report.patents.averageCompleteness * 100).toFixed(1)}%`,
    `- Data-license/non-vendorable gaps: ${report.dataLicenseGaps.length}`,
    '',
    '## Evidence classes',
    '',
    ...Object.entries(report.evidence.byClass).sort().map(([key, value]) => `- ${key}: ${value}`),
    '',
    '## Components',
    '',
    ...Object.entries(report.evidence.byComponent).sort().map(([key, value]) => `- ${key}: ${value}`),
    '',
    '## Review states',
    '',
    ...Object.entries(report.reviews.states).sort().map(([key, value]) => `- ${key}: ${value}`),
    '',
    '## Source domains',
    '',
    ...Object.entries(report.sources.byDomain).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([key, value]) => `- ${key}: ${value}`),
    '',
    '## Source organizations / labels',
    '',
    ...Object.entries(report.sources.byOrganization).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([key, value]) => `- ${key}: ${value}`),
  ]

  if (report.evidence.noDirectSourceIds.length) lines.push('', '## Claims without direct public source URL', '', ...report.evidence.noDirectSourceIds.map((id) => `- ${id}`))
  if (report.evidence.inferenceRationaleGaps.length) lines.push('', '## Inference rationale gaps', '', ...report.evidence.inferenceRationaleGaps.map((id) => `- ${id}`))
  if (report.unknowns.unresolvedIds.length) lines.push('', '## Unresolved unknowns', '', ...report.unknowns.unresolvedIds.map((id) => `- ${id}`))
  if (report.fabCases.withoutPublicSourceIds.length) lines.push('', '## Fab cases without public source URL', '', ...report.fabCases.withoutPublicSourceIds.map((id) => `- ${id}`))
  if (report.patents.incompletePatentIds.length) lines.push('', '## Incomplete patent metadata', '', ...report.patents.incompletePatentIds.map((id) => `- ${id}`))
  if (report.dataLicenseGaps.length) lines.push('', '## Data-license / vendoring gaps', '', ...report.dataLicenseGaps.map((gap) => `- ${gap.source}: ${gap.license} — ${gap.reason}`))

  return `${lines.join('\n')}\n`
}
