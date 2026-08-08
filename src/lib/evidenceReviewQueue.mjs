const classOrder = ['A', 'B', 'C', 'D', '?']
const priorityRank = { high: 0, medium: 1, low: 2 }

function reviewStateById(reviews = []) {
  return new Map(reviews.map((review) => [String(review?.id ?? ''), String(review?.state ?? '')]))
}

function claimCandidate(claim, state) {
  return {
    recordType: 'claim',
    id: claim.id,
    component: claim.component,
    evidenceClass: claim.class,
    confidence: claim.confidence,
    text: claim.claim,
    sources: Array.isArray(claim.sources) ? claim.sources.map((source) => ({ name: source.name, url: source.url })) : [],
    reviewState: state || 'unreviewed',
    reason: `Class ${claim.class} claim · confidence ${Math.round((Number(claim.confidence) || 0) * 100)}%`,
  }
}

function unknownCandidate(unknown, state) {
  return {
    recordType: 'unknown',
    id: unknown.id,
    component: unknown.component,
    priority: unknown.priority,
    text: unknown.question,
    sources: [],
    reviewState: state || 'unreviewed',
    reason: `${unknown.priority || 'unranked'}-priority open unknown`,
  }
}

export function buildEvidenceReviewQueue({ claims = [], unknowns = [], reviews = [], limit = 12 } = {}) {
  const maxItems = Math.max(1, Math.min(100, Math.round(Number(limit) || 12)))
  const states = reviewStateById(reviews)
  const excludedStates = new Set(['reviewed', 'superseded'])

  const unknownCandidates = unknowns
    .filter((unknown) => !excludedStates.has(states.get(String(unknown.id))))
    .sort((a, b) => {
      const pa = priorityRank[a.priority] ?? 9
      const pb = priorityRank[b.priority] ?? 9
      if (pa !== pb) return pa - pb
      return String(a.id).localeCompare(String(b.id))
    })
    .map((unknown) => unknownCandidate(unknown, states.get(String(unknown.id))))

  const groupedClaims = new Map(classOrder.map((evidenceClass) => [evidenceClass, []]))
  for (const claim of claims) {
    if (excludedStates.has(states.get(String(claim.id)))) continue
    const key = groupedClaims.has(claim.class) ? claim.class : '?'
    groupedClaims.get(key).push(claim)
  }
  for (const group of groupedClaims.values()) {
    group.sort((a, b) => {
      const confidenceDelta = (Number(b.confidence) || 0) - (Number(a.confidence) || 0)
      if (Math.abs(confidenceDelta) > 1e-12) return confidenceDelta
      return String(a.id).localeCompare(String(b.id))
    })
  }

  const queue = []
  const unknownQuota = Math.min(2, unknownCandidates.length, maxItems)
  queue.push(...unknownCandidates.slice(0, unknownQuota))

  let madeProgress = true
  while (queue.length < maxItems && madeProgress) {
    madeProgress = false
    for (const evidenceClass of classOrder) {
      if (queue.length >= maxItems) break
      const group = groupedClaims.get(evidenceClass)
      const claim = group?.shift()
      if (!claim) continue
      queue.push(claimCandidate(claim, states.get(String(claim.id))))
      madeProgress = true
    }
  }

  for (const unknown of unknownCandidates.slice(unknownQuota)) {
    if (queue.length >= maxItems) break
    queue.push(unknown)
  }

  return queue
}

export function summarizeEvidenceReviewQueue(queue = []) {
  const byType = {}
  const byClass = {}
  for (const item of queue) {
    byType[item.recordType] = (byType[item.recordType] ?? 0) + 1
    if (item.evidenceClass) byClass[item.evidenceClass] = (byClass[item.evidenceClass] ?? 0) + 1
  }
  return { total: queue.length, byType, byClass }
}
