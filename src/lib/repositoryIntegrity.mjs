const defaultPatentSubsystems = new Set([
  'source',
  'collector',
  'illumination',
  'reticle',
  'projection',
  'stage',
  'metrology',
  'vacuum',
])

function isPublicHttpUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function auditRepositoryGraph({
  claims = [],
  unknowns = [],
  conceptLabels = [],
  fabCases = [],
  reviews = { reviews: [] },
  manifest = { datasets: [] },
  assemblyClaimIds = [],
  assemblyNodeIds = [],
  patentSubsystems = [],
  existingPaths = new Set(),
  recognizedPatentSubsystems = defaultPatentSubsystems,
} = {}) {
  const errors = []
  const warnings = []
  const knownEvidenceIds = new Set([...claims, ...unknowns].map((record) => record?.id).filter(Boolean))
  const claimIds = new Set(claims.map((record) => record?.id).filter(Boolean))

  const reportMissing = (kind, id) => errors.push(`${kind} references missing evidence id ${id}`)

  for (const id of assemblyClaimIds) if (!claimIds.has(id)) reportMissing('assembly', id)

  const nodes = new Set()
  for (const label of conceptLabels) {
    if (!label?.node) {
      errors.push('concept label is missing node')
      continue
    }
    if (nodes.has(label.node)) errors.push(`duplicate concept node ${label.node}`)
    nodes.add(label.node)
    for (const id of label.claimIds ?? []) if (!claimIds.has(id)) reportMissing(`concept node ${label.node}`, id)
  }

  for (const node of assemblyNodeIds) {
    if (!nodes.has(node)) warnings.push(`assembly atlas node ${node} has no V4 concept-label record`)
  }

  for (const fabCase of fabCases) {
    for (const id of fabCase?.claimIds ?? []) if (!claimIds.has(id)) reportMissing(`fab case ${fabCase?.id ?? '<unknown>'}`, id)
    for (const url of fabCase?.sourceUrls ?? []) {
      if (!isPublicHttpUrl(url)) errors.push(`fab case ${fabCase?.id ?? '<unknown>'} has invalid public source URL ${url}`)
    }
  }

  for (const review of reviews?.reviews ?? []) {
    if (!knownEvidenceIds.has(review?.id)) errors.push(`review registry references unknown evidence id ${review?.id}`)
    if (review?.supersededBy && !knownEvidenceIds.has(review.supersededBy)) errors.push(`review ${review.id} supersedes unknown evidence id ${review.supersededBy}`)
  }

  const manifestIds = new Set()
  for (const dataset of manifest?.datasets ?? []) {
    if (manifestIds.has(dataset?.id)) errors.push(`duplicate dataset manifest id ${dataset?.id}`)
    manifestIds.add(dataset?.id)
    if (dataset?.path && !existingPaths.has(dataset.path)) errors.push(`dataset manifest path does not exist: ${dataset.path}`)
  }

  for (const subsystem of patentSubsystems) {
    if (!recognizedPatentSubsystems.has(subsystem)) errors.push(`unrecognized patent subsystem ${subsystem}`)
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    counts: {
      claims: claims.length,
      unknowns: unknowns.length,
      conceptLabels: conceptLabels.length,
      fabCases: fabCases.length,
      reviews: reviews?.reviews?.length ?? 0,
      datasets: manifest?.datasets?.length ?? 0,
      assemblyClaimReferences: assemblyClaimIds.length,
      assemblyNodeReferences: assemblyNodeIds.length,
      patentSubsystemReferences: patentSubsystems.length,
    },
  }
}

export function renderRepositoryIntegrityReport(result) {
  const lines = [
    '# OpenEUV repository integrity audit',
    '',
    `- Status: **${result.ok ? 'PASS' : 'FAIL'}**`,
    `- Claims: ${result.counts.claims}`,
    `- Unknowns: ${result.counts.unknowns}`,
    `- Concept labels: ${result.counts.conceptLabels}`,
    `- Fab cases: ${result.counts.fabCases}`,
    `- Review records: ${result.counts.reviews}`,
    `- Dataset manifest entries: ${result.counts.datasets}`,
    `- Assembly claim refs: ${result.counts.assemblyClaimReferences}`,
    `- Assembly node refs: ${result.counts.assemblyNodeReferences}`,
    `- Patent subsystem refs: ${result.counts.patentSubsystemReferences}`,
  ]
  if (result.errors.length) {
    lines.push('', '## Errors', '', ...result.errors.map((error) => `- ${error}`))
  }
  if (result.warnings.length) {
    lines.push('', '## Warnings', '', ...result.warnings.map((warning) => `- ${warning}`))
  }
  if (!result.errors.length && !result.warnings.length) lines.push('', 'No broken cross-dataset references were detected.')
  return `${lines.join('\n')}\n`
}
