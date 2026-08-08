function count(source, pattern) {
  return Array.from(String(source ?? '').matchAll(pattern)).length
}

function literalIds(source) {
  return Array.from(String(source ?? '').matchAll(/\bid=["']([^"']+)["']/g), (match) => match[1])
}

export function auditAccessibilityContract({ appSource = '', searchSource = '', statusSource = '', stylesSource = '' } = {}) {
  const errors = []

  if (count(appSource, /className=["']skip-link["']/g) !== 1) errors.push('App must contain exactly one skip-link')
  if (count(appSource, /href=["']#main-content["']/g) !== 1) errors.push('Skip link must target #main-content exactly once')
  if (count(appSource, /<main\b/g) !== 1) errors.push('App must contain exactly one main landmark')
  if (count(appSource, /id=["']main-content["']/g) !== 1) errors.push('Main landmark must use id="main-content" exactly once')

  if (count(searchSource, /id=["']atlas-search-input["']/g) !== 1) errors.push('Atlas Search must contain exactly one atlas-search-input')
  if (!/htmlFor=["']atlas-search-input["']/.test(searchSource)) errors.push('Atlas Search input must have an explicit label')
  if (!/aria-controls=["']atlas-search-results["']/.test(searchSource)) errors.push('Atlas Search input must reference its results')
  if (!/role=["']listbox["']/.test(searchSource) || !/role=["']option["']/.test(searchSource)) errors.push('Atlas Search results must expose listbox/option roles')

  if (!/role=["']status["']/.test(statusSource)) errors.push('Research status panel must contain a status live region')
  if (!/aria-live=["']polite["']/.test(statusSource)) errors.push('Research status live region must be polite')
  if (!/@media\s*\(prefers-reduced-motion\s*:\s*reduce\)/.test(stylesSource)) errors.push('V6/V7 styles must preserve prefers-reduced-motion handling')

  const ids = [...literalIds(appSource), ...literalIds(searchSource), ...literalIds(statusSource)]
  const seen = new Set()
  const duplicates = new Set()
  for (const id of ids) {
    if (seen.has(id)) duplicates.add(id)
    seen.add(id)
  }
  for (const id of [...duplicates].sort()) errors.push(`duplicate literal shell id: ${id}`)

  return { ok: errors.length === 0, errors, ids: [...seen].sort() }
}
