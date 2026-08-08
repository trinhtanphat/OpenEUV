function addUsage(index, claimId, usage) {
  const bucket = index[claimId] ?? []
  const key = `${usage.type}:${usage.id}`
  if (!bucket.some((item) => `${item.type}:${item.id}` === key)) bucket.push(usage)
  index[claimId] = bucket
}

export function buildEvidenceUsageIndex({ claims = [], conceptLabels = [], assemblyStages = [], fabCases = [] } = {}) {
  const index = Object.fromEntries(claims.map((claim) => [claim.id, []]))

  for (const label of conceptLabels) {
    for (const claimId of label.claimIds ?? []) {
      if (!(claimId in index)) continue
      addUsage(index, claimId, {
        type: 'concept-node',
        id: label.node,
        label: label.label ?? label.node,
        href: '#explorer',
      })
    }
  }

  for (const stage of assemblyStages) {
    for (const claimId of stage.claimIds ?? []) {
      if (!(claimId in index)) continue
      addUsage(index, claimId, {
        type: 'assembly-stage',
        id: stage.id,
        label: stage.title?.en ?? stage.id,
        href: '#assembly-explorer',
      })
    }
  }

  for (const item of fabCases) {
    for (const claimId of item.claimIds ?? []) {
      if (!(claimId in index)) continue
      addUsage(index, claimId, {
        type: 'fab-case',
        id: item.id,
        label: item.title ?? item.id,
        href: `#fab-case-${item.id}`,
      })
    }
  }

  return index
}

export function summarizeEvidenceUsage(index) {
  const entries = Object.entries(index)
  return {
    claims: entries.length,
    claimsWithUsage: entries.filter(([, usages]) => usages.length > 0).length,
    totalUsages: entries.reduce((sum, [, usages]) => sum + usages.length, 0),
    unmappedClaimIds: entries.filter(([, usages]) => usages.length === 0).map(([claimId]) => claimId),
  }
}
