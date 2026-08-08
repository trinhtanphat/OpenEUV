const requiredFields = ['id', 'familyId', 'title', 'priorityDate', 'publicationDate', 'subsystem', 'assignee', 'summary', 'url']

export function patentMetadataCompleteness(record) {
  const present = requiredFields.filter((field) => {
    const value = record?.[field]
    return typeof value === 'string' ? value.trim().length > 0 : value != null
  }).length
  const linked = Array.isArray(record?.linkedSubsystems) && record.linkedSubsystems.length > 0 ? 1 : 0
  const members = Array.isArray(record?.familyMembers) && record.familyMembers.length > 0 ? 1 : 0
  const application = typeof record?.applicationNumber === 'string' && record.applicationNumber.trim() ? 1 : 0
  const numerator = present + linked + members + application
  const denominator = requiredFields.length + 3
  return {
    score: numerator / denominator,
    percent: (numerator / denominator) * 100,
    present,
    total: denominator,
    missing: requiredFields.filter((field) => {
      const value = record?.[field]
      return typeof value === 'string' ? value.trim().length === 0 : value == null
    }),
  }
}

export function auditPatentRecords(records) {
  const errors = []
  const warnings = []
  const publications = new Map()
  const familyMembers = new Map()
  const familyPriority = new Map()

  records.forEach((record, index) => {
    const id = String(record?.id ?? '').trim().toUpperCase()
    const familyId = String(record?.familyId ?? '').trim().toUpperCase()
    if (id) {
      if (publications.has(id)) errors.push(`record ${index}: duplicate publication ${id}`)
      else publications.set(id, index)
    }
    for (const memberRaw of record?.familyMembers ?? []) {
      const member = String(memberRaw).trim().toUpperCase()
      if (!member) continue
      const owner = familyMembers.get(member)
      if (owner && owner !== familyId) errors.push(`record ${index}: family member ${member} appears in both ${owner} and ${familyId}`)
      else familyMembers.set(member, familyId)
    }
    if (familyId && record?.priorityDate) {
      const previous = familyPriority.get(familyId)
      if (previous && previous !== record.priorityDate) errors.push(`record ${index}: conflicting priority dates for ${familyId}: ${previous} vs ${record.priorityDate}`)
      else familyPriority.set(familyId, record.priorityDate)
    }
    if (record?.priorityDate && record?.publicationDate && String(record.publicationDate) < String(record.priorityDate)) {
      errors.push(`record ${index}: publication date predates priority date`)
    }
    const completeness = patentMetadataCompleteness(record)
    if (completeness.score < 0.75) warnings.push(`record ${index}: metadata completeness ${completeness.percent.toFixed(0)}%`)
  })

  const scores = records.map(patentMetadataCompleteness)
  const averageCompleteness = scores.length ? scores.reduce((sum, item) => sum + item.score, 0) / scores.length : 0
  return {
    ok: errors.length === 0,
    errors,
    warnings,
    publications: publications.size,
    families: new Set(records.map((record) => String(record?.familyId ?? '').trim()).filter(Boolean)).size,
    averageCompleteness,
  }
}
