const forbiddenKeys = new Set([
  'ip', 'ipaddress', 'email', 'username', 'useragent', 'serial', 'serialnumber',
  'hardwareconcurrency', 'devicememory', 'devicememorygib', 'localstorage', 'sessionstorage',
  'history', 'cookie', 'cookies', 'authorization', 'token', 'password',
])

function normalizedKey(key) {
  return String(key ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

function isForbiddenKey(key) {
  return forbiddenKeys.has(normalizedKey(key))
}

function clonePublic(value) {
  if (Array.isArray(value)) return value.map(clonePublic)
  if (!value || typeof value !== 'object') return value
  const output = {}
  for (const [key, child] of Object.entries(value)) {
    if (isForbiddenKey(key)) continue
    output[key] = clonePublic(child)
  }
  return output
}

function scanForbidden(value, path = '$', errors = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanForbidden(item, `${path}[${index}]`, errors))
    return errors
  }
  if (!value || typeof value !== 'object') return errors
  for (const [key, child] of Object.entries(value)) {
    if (isForbiddenKey(key)) errors.push(`${path}.${key}`)
    scanForbidden(child, `${path}.${key}`, errors)
  }
  return errors
}

export function buildResearchSnapshot({
  generatedAt,
  build = { version: 'unknown', commit: 'unknown', source: 'unknown' },
  claims = [],
  unknowns = [],
  fabCases = [],
  manifest = { schemaVersion: 'unknown', datasets: [] },
  reviewCoverage = {},
  provenanceCoverage = {},
} = {}) {
  if (!generatedAt || Number.isNaN(Date.parse(generatedAt))) throw new Error('generatedAt must be a valid ISO-8601 timestamp')
  return clonePublic({
    schemaVersion: 2,
    project: 'OpenEUV',
    generatedAt,
    build,
    scope: 'public-repository-metadata-only',
    privacy: {
      clientTelemetryIncluded: false,
      browserStateIncluded: false,
      hardwareIdentifiersIncluded: false,
    },
    evidence: { claims, unknowns },
    fabCases,
    datasets: {
      manifestSchemaVersion: manifest.schemaVersion ?? 'unknown',
      entries: manifest.datasets ?? [],
    },
    reviewCoverage,
    provenanceCoverage,
  })
}

export function validateResearchSnapshot(snapshot) {
  const errors = []
  if (snapshot?.schemaVersion !== 2) errors.push('schemaVersion must equal 2')
  if (snapshot?.project !== 'OpenEUV') errors.push('project must equal OpenEUV')
  if (!snapshot?.generatedAt || Number.isNaN(Date.parse(snapshot.generatedAt))) errors.push('generatedAt must be a valid timestamp')
  if (snapshot?.scope !== 'public-repository-metadata-only') errors.push('scope must be public-repository-metadata-only')
  if (!snapshot?.build || typeof snapshot.build.version !== 'string' || typeof snapshot.build.commit !== 'string' || typeof snapshot.build.source !== 'string') errors.push('build provenance must contain version, commit and source')
  if (!Array.isArray(snapshot?.evidence?.claims)) errors.push('evidence.claims must be an array')
  if (!Array.isArray(snapshot?.evidence?.unknowns)) errors.push('evidence.unknowns must be an array')
  if (!Array.isArray(snapshot?.fabCases)) errors.push('fabCases must be an array')
  if (!Array.isArray(snapshot?.datasets?.entries)) errors.push('datasets.entries must be an array')
  for (const path of scanForbidden(snapshot)) errors.push(`forbidden client/private field: ${path}`)
  return { ok: errors.length === 0, errors }
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable)
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]))
}

export function serializeResearchSnapshot(snapshot) {
  const validation = validateResearchSnapshot(snapshot)
  if (!validation.ok) throw new Error(validation.errors.join('; '))
  return `${JSON.stringify(stable(snapshot), null, 2)}\n`
}
