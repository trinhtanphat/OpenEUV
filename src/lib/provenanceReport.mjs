function increment(target, key) {
  const normalized = String(key ?? 'unknown').trim() || 'unknown'
  target[normalized] = (target[normalized] ?? 0) + 1
}

function domainOf(value) {
  try {
    return new URL(value).hostname.replace(/^www\./, '')
  } catch {
    return 'invalid-url'
  }
}

function organizationOf(name, url) {
  const text = String(name ?? '').trim()
  const known = ['ASML', 'ZEISS', 'TSMC', 'Samsung', 'Intel', 'Micron', 'SK hynix', 'Rapidus', 'imec', 'LBNL', 'CXRO']
  const match = known.find((label) => text.toLowerCase().startsWith(label.toLowerCase()))
  return match ?? (url ? domainOf(url) : (text || 'unknown'))
}

export function summarizeProvenance({ claims = [], unknowns = [], reviews = { reviews: [] }, patents = [], patentAudit = null, fabCases = [], dataGaps = [] } = {}) {
  const byClass = {}
  const byComponent = {}
  const bySourceDomain = {}
  const bySourceOrganization = {}
  const byReviewState = { reviewed: 0, proposed: 0, superseded: 0, unreviewed: 0 }
  const reviewById = new Map((reviews.reviews ?? []).map((record) => [record.id, record]))
  const recordsWithoutDirectSource = []
  const inferenceRationaleGaps = []

  for (const claim of claims) {
    increment(byClass, claim.class)
    increment(byComponent, claim.component)
    const sources = Array.isArray(claim.sources) ? claim.sources : []
    if (!sources.length || !sources.some((source) => /^https?:\/\//.test(String(source?.url ?? '')))) recordsWithoutDirectSource.push(claim.id)
    for (const source of sources) {
      if (!source?.url) continue
      increment(bySourceDomain, domainOf(source.url))
      increment(bySourceOrganization, organizationOf(source.name, source.url))
    }
    if (claim.class === 'D' && !String(claim.rationale ?? '').trim()) inferenceRationaleGaps.push(claim.id)
    const state = reviewById.get(claim.id)?.state ?? 'unreviewed'
    increment(byReviewState, state)
  }

  for (const unknown of unknowns) {
    increment(byComponent, unknown.component)
    const state = reviewById.get(unknown.id)?.state ?? 'unreviewed'
    increment(byReviewState, state)
  }

  const fabWithoutSources = fabCases.filter((item) => !Array.isArray(item.sourceUrls) || item.sourceUrls.length === 0).map((item) => item.id)
  const fabInvalidSources = fabCases.flatMap((item) => (item.sourceUrls ?? []).filter((url) => !/^https?:\/\//.test(String(url))).map((url) => `${item.id}:${url}`))
  for (const item of fabCases) {
    if (item.organization) increment(bySourceOrganization, item.organization)
    for (const url of item.sourceUrls ?? []) if (/^https?:\/\//.test(String(url))) increment(bySourceDomain, domainOf(url))
  }

  for (const patent of patents) {
    if (patent.url) increment(bySourceDomain, domainOf(patent.url))
    if (patent.assignee) increment(bySourceOrganization, patent.assignee)
  }

  const unresolvedDataGaps = dataGaps.filter((gap) => gap?.decision && !String(gap.decision).startsWith('resolved')).map((gap) => ({ material: gap?.target?.material ?? 'unknown', wavelengthNm: gap?.target?.wavelengthNm ?? null, decision: gap.decision }))
  const licenseGaps = dataGaps.flatMap((gap) => (gap?.candidates ?? [])
    .filter((candidate) => candidate?.vendorable === false)
    .map((candidate) => ({
      material: gap?.target?.material ?? 'unknown',
      wavelengthNm: gap?.target?.wavelengthNm ?? null,
      source: candidate.source ?? 'unknown',
      license: candidate.license ?? 'unknown',
      coversTarget: candidate.coversTarget ?? null,
      reason: candidate.reason ?? '',
    })))

  return {
    evidence: {
      claims: claims.length,
      unknowns: unknowns.length,
      byClass,
      byComponent,
      bySourceDomain,
      bySourceOrganization,
      byReviewState,
      recordsWithoutDirectSource,
      inferenceRationaleGaps,
      openUnknownIds: unknowns.filter((item) => !['resolved', 'closed'].includes(String(item.status ?? '').toLowerCase())).map((item) => item.id),
    },
    patents: {
      records: patents.length,
      publications: patentAudit?.publications ?? patents.length,
      families: patentAudit?.families ?? 0,
      averageMetadataCompleteness: patentAudit?.averageCompleteness ?? 0,
      auditErrors: patentAudit?.errors ?? [],
      auditWarnings: patentAudit?.warnings ?? [],
    },
    fab: {
      cases: fabCases.length,
      casesWithDirectSources: fabCases.length - fabWithoutSources.length,
      casesWithoutDirectSources: fabWithoutSources,
      invalidSourceUrls: fabInvalidSources,
    },
    dataGaps: unresolvedDataGaps,
    dataLicenseGaps: licenseGaps,
  }
}

export function renderProvenanceMarkdown(summary) {
  const lines = [
    '# OpenEUV provenance coverage report',
    '',
    'This report describes metadata/source coverage. It does not rank commercial importance, production use or vendor quality.',
    '',
    '## Evidence',
    '',
    `- Claims: ${summary.evidence.claims}`,
    `- Open/unresolved unknown records: ${summary.evidence.openUnknownIds.length}`,
    `- Claims without direct public source URL: ${summary.evidence.recordsWithoutDirectSource.length}`,
    `- Class-D rationale gaps: ${summary.evidence.inferenceRationaleGaps.length}`,
    `- Review states: ${Object.entries(summary.evidence.byReviewState).map(([key, value]) => `${key}=${value}`).join(' · ')}`,
    '',
    '### Evidence class coverage',
    '',
    ...Object.entries(summary.evidence.byClass).sort().map(([key, value]) => `- Class ${key}: ${value}`),
    '',
    '### Component coverage',
    '',
    ...Object.entries(summary.evidence.byComponent).sort().map(([key, value]) => `- ${key}: ${value}`),
    '',
    '### Source domains',
    '',
    ...Object.entries(summary.evidence.bySourceDomain).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([key, value]) => `- ${key}: ${value}`),
    '',
    '### Source organizations / assignees',
    '',
    ...Object.entries(summary.evidence.bySourceOrganization).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([key, value]) => `- ${key}: ${value}`),
    '',
    '## Patents',
    '',
    `- Curated records: ${summary.patents.records}`,
    `- Families: ${summary.patents.families}`,
    `- Average metadata completeness: ${(summary.patents.averageMetadataCompleteness * 100).toFixed(1)}%`,
    `- Audit errors: ${summary.patents.auditErrors.length}`,
    `- Audit warnings: ${summary.patents.auditWarnings.length}`,
    '',
    '## Fab cases',
    '',
    `- Cases: ${summary.fab.cases}`,
    `- Cases with direct public sources: ${summary.fab.casesWithDirectSources}/${summary.fab.cases}`,
    `- Cases without direct source URLs: ${summary.fab.casesWithoutDirectSources.length}`,
    '',
    '## Explicit data/license gaps',
    '',
  ]

  if (summary.dataLicenseGaps.length) {
    for (const gap of summary.dataLicenseGaps) lines.push(`- ${gap.material} @ ${gap.wavelengthNm ?? '?'} nm · ${gap.source} · ${gap.license} — ${gap.reason}`)
  } else if (summary.dataGaps.length) {
    for (const gap of summary.dataGaps) lines.push(`- ${gap.material} @ ${gap.wavelengthNm ?? '?'} nm — ${gap.decision}`)
  } else lines.push('- None recorded.')

  if (summary.evidence.recordsWithoutDirectSource.length) lines.push('', '### Claims missing direct sources', '', ...summary.evidence.recordsWithoutDirectSource.map((id) => `- ${id}`))
  if (summary.evidence.inferenceRationaleGaps.length) lines.push('', '### Inference rationale gaps', '', ...summary.evidence.inferenceRationaleGaps.map((id) => `- ${id}`))
  if (summary.evidence.openUnknownIds.length) lines.push('', '### Unresolved unknowns', '', ...summary.evidence.openUnknownIds.map((id) => `- ${id}`))
  if (summary.fab.casesWithoutDirectSources.length) lines.push('', '### Fab cases missing direct sources', '', ...summary.fab.casesWithoutDirectSources.map((id) => `- ${id}`))
  return `${lines.join('\n')}\n`
}
