function canonicalUrl(value) {
  try {
    const parsed = new URL(String(value ?? '').trim())
    if (!['http:', 'https:'].includes(parsed.protocol)) return null
    parsed.hash = ''
    if (parsed.pathname.length > 1 && parsed.pathname.endsWith('/')) parsed.pathname = parsed.pathname.slice(0, -1)
    return parsed.href
  } catch {
    return null
  }
}

function domainOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return 'invalid-url' }
}

function organizationFromLabel(label, url) {
  const text = String(label ?? '').trim()
  const known = ['ASML', 'ZEISS', 'TSMC', 'Samsung', 'Intel', 'Micron', 'SK hynix', 'Rapidus', 'imec', 'LBNL', 'CXRO']
  const match = known.find((name) => text.toLowerCase().startsWith(name.toLowerCase()))
  return match ?? domainOf(url)
}

function addUsage(registry, { url, label = '', type, recordId, href, evidenceClass = null, organization = null }) {
  const normalizedUrl = canonicalUrl(url)
  const key = normalizedUrl ?? String(url ?? '').trim()
  if (!registry.has(key)) {
    registry.set(key, {
      url: normalizedUrl ?? String(url ?? '').trim(),
      validUrl: Boolean(normalizedUrl),
      domain: normalizedUrl ? domainOf(normalizedUrl) : 'invalid-url',
      labels: new Set(),
      organizations: new Set(),
      evidenceClasses: new Set(),
      usageTypes: new Set(),
      usages: [],
    })
  }
  const entry = registry.get(key)
  if (String(label).trim()) entry.labels.add(String(label).trim())
  if (organization) entry.organizations.add(String(organization).trim())
  else if (normalizedUrl && label) entry.organizations.add(organizationFromLabel(label, normalizedUrl))
  if (evidenceClass) entry.evidenceClasses.add(String(evidenceClass))
  entry.usageTypes.add(type)
  entry.usages.push({ type, recordId, href, ...(evidenceClass ? { evidenceClass } : {}) })
}

export function buildSourceLibrary({ claims = [], fabCases = [], patents = [] } = {}) {
  const registry = new Map()

  for (const claim of claims) {
    for (const source of claim.sources ?? []) {
      addUsage(registry, {
        url: source?.url,
        label: source?.name,
        type: 'evidence',
        recordId: claim.id,
        href: `#evidence-${claim.id}`,
        evidenceClass: claim.class,
      })
    }
  }

  for (const item of fabCases) {
    for (const url of item.sourceUrls ?? []) {
      addUsage(registry, {
        url,
        label: `${item.organization} public source`,
        type: 'fab-case',
        recordId: item.id,
        href: `#fab-case-${item.id}`,
        organization: item.organization,
      })
    }
  }

  for (const patent of patents) {
    addUsage(registry, {
      url: patent.url,
      label: patent.title || patent.id,
      type: 'patent',
      recordId: patent.id,
      href: `#patent-${patent.id}`,
      organization: patent.assignee,
      evidenceClass: 'B',
    })
  }

  return Array.from(registry.values()).map((entry) => ({
    ...entry,
    labels: Array.from(entry.labels).sort(),
    organizations: Array.from(entry.organizations).filter(Boolean).sort(),
    evidenceClasses: Array.from(entry.evidenceClasses).sort(),
    usageTypes: Array.from(entry.usageTypes).sort(),
    usages: entry.usages.slice().sort((a, b) => a.type.localeCompare(b.type) || a.recordId.localeCompare(b.recordId)),
  })).sort((a, b) => a.domain.localeCompare(b.domain) || a.url.localeCompare(b.url))
}

export function auditSourceLibrary(sources) {
  const errors = []
  const warnings = []
  for (const source of sources ?? []) {
    if (!source.validUrl) errors.push(`invalid or non-HTTP(S) source URL: ${source.url || '(empty)'}`)
    const evidenceUsages = (source.usages ?? []).filter((usage) => usage.type === 'evidence')
    if (evidenceUsages.length && !(source.labels ?? []).length) errors.push(`evidence source is missing display label: ${source.url}`)
    if ((source.labels ?? []).length > 1) warnings.push(`source URL has multiple display labels: ${source.url} => ${source.labels.join(' | ')}`)
  }
  return { ok: errors.length === 0, errors, warnings, sources: sources?.length ?? 0 }
}

export function filterSourceLibrary(sources, { query = '', domain = 'all', usageType = 'all', evidenceClass = 'all' } = {}) {
  const q = String(query).trim().toLowerCase()
  return (sources ?? []).filter((source) => {
    if (domain !== 'all' && source.domain !== domain) return false
    if (usageType !== 'all' && !source.usageTypes.includes(usageType)) return false
    if (evidenceClass !== 'all' && !source.evidenceClasses.includes(evidenceClass)) return false
    if (!q) return true
    const haystack = [source.url, source.domain, ...source.labels, ...source.organizations, ...source.usages.map((usage) => usage.recordId)].join(' ').toLowerCase()
    return haystack.includes(q)
  })
}
