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

export function summarizeProvenance({ claims = [], unknowns = [], reviews = { reviews: [] }, patents = [], patentAudit = null, fabCases = [], dataGaps = [] } = {}) {
  const byClass = {}
  const byComponent = {}
  const bySourceDomain = {}
  const byReviewState = { reviewed: 0, proposed: 0, superseded: 0, unreviewed: 0 }
  const reviewById = new Map((reviews.reviews ?? []).map((record) => [record.id, record]))
  const recordsWithoutDirectSource = []
  const inferenceRationaleGaps = []

  for (const claim of claims) {
    increment(byClass, claim.class)
    increment(byComponent, claim.component)
    const sources = Array.isArray(claim.sources) ? claim.sources : []
    if (!sources.length || !sources.some((source) => /^https?:\/\//.test(String(source?.url ?? '')))) recordsWithoutDirectSource.push(claim.id)
    for (const source of sources) if (source?.url) increment(bySourceDomain, domainOf(source.url))
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
  const unresolvedDataGaps = dataGaps.filter((gap) => gap?.decision && !String(gap.decision).startsWith('resolved')).map((gap) => ({ material: gap?.target?.material ?? 'unknown', wavelengthNm: gap?.target?.wavelengthNm ?? null, decision: gap.decision }))

  return {
    evidence: {
      claims: claims.length,
      unknowns: unknowns.length,
      byClass,
      byComponent,
      bySourceDomain,
      byReviewState,
      recordsWithoutDirectSource,
      inferenceRationaleGaps,
      openUnknownIds: unknowns.filter((item) => item.status === 'open').map((item) => item.id),
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
    `- Open unknown records: ${summary.evidence.openUnknownIds.length}`,
    `- Claims without direct public source URL: ${summary.evidence.recordsWithoutDirectSource.length}`,
    `- Class-D rationale gaps: ${summary.evidence.inferenceRationaleGaps.length}`,
    `- Review states: ${Object.entries(summary.evidence.byReviewState).map(([key, value]) => `${key}=${value}`).join(' · ')}`,
    '',
    '### Evidence class coverage',
    '',
    ...Object.entries(summary.evidence.byClass).sort().map(([key, value]) => `- Class ${key}: ${value}`),
    '',
    '### Source domains',
    '',
    ...Object.entries(summary.evidence.bySourceDomain).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([key, value]) => `- ${key}: ${value}`),
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

  if (summary.dataGaps.length) {
    for (const gap of summary.dataGaps) lines.push(`- ${gap.material} @ ${gap.wavelengthNm ?? '?'} nm — ${gap.decision}`)
  } else lines.push('- None recorded.')

  if (summary.evidence.recordsWithoutDirectSource.length) lines.push('', '### Claims missing direct sources', '', ...summary.evidence.recordsWithoutDirectSource.map((id) => `- ${id}`))
  if (summary.evidence.inferenceRationaleGaps.length) lines.push('', '### Inference rationale gaps', '', ...summary.evidence.inferenceRationaleGaps.map((id) => `- ${id}`))
  return `${lines.join('\n')}\n`
}
