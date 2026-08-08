export function validateLearningCheckpoints(checkpoints, expectedLevelIds = []) {
  const errors = []
  if (!Array.isArray(checkpoints)) return { ok: false, errors: ['checkpoints must be an array'], coverage: {} }
  const ids = new Set()
  const coverage = Object.fromEntries(expectedLevelIds.map((id) => [id, 0]))

  checkpoints.forEach((item, index) => {
    const prefix = `checkpoints[${index}]`
    if (!item || typeof item !== 'object') { errors.push(`${prefix} must be an object`); return }
    if (!item.id || typeof item.id !== 'string') errors.push(`${prefix}.id is required`)
    else if (ids.has(item.id)) errors.push(`${prefix}: duplicate id ${item.id}`)
    else ids.add(item.id)
    if (!expectedLevelIds.includes(item.levelId)) errors.push(`${prefix}.levelId ${item.levelId} is not a known learning level`)
    else coverage[item.levelId] = (coverage[item.levelId] ?? 0) + 1

    for (const language of ['en', 'vi']) {
      if (!String(item.prompt?.[language] ?? '').trim()) errors.push(`${prefix}.prompt.${language} is required`)
      if (!String(item.explanation?.[language] ?? '').trim()) errors.push(`${prefix}.explanation.${language} is required`)
    }
    if (!Array.isArray(item.options) || item.options.length < 2) errors.push(`${prefix}.options must contain at least two choices`)
    else {
      item.options.forEach((option, optionIndex) => {
        for (const language of ['en', 'vi']) if (!String(option?.[language] ?? '').trim()) errors.push(`${prefix}.options[${optionIndex}].${language} is required`)
      })
      if (!Number.isInteger(item.correctIndex) || item.correctIndex < 0 || item.correctIndex >= item.options.length) errors.push(`${prefix}.correctIndex is out of range`)
    }
    if (!Array.isArray(item.links)) errors.push(`${prefix}.links must be an array`)
    else item.links.forEach((link, linkIndex) => {
      if (!String(link?.href ?? '').startsWith('#')) errors.push(`${prefix}.links[${linkIndex}].href must be an internal # anchor`)
      for (const language of ['en', 'vi']) if (!String(link?.label?.[language] ?? '').trim()) errors.push(`${prefix}.links[${linkIndex}].label.${language} is required`)
    })
  })

  for (const levelId of expectedLevelIds) if (!coverage[levelId]) errors.push(`learning level ${levelId} has no checkpoint`)
  return { ok: errors.length === 0, errors, coverage }
}
