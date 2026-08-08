const semverPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?$/
const idPattern = /^[a-z0-9][a-z0-9._-]+$/

export function validateDatasetManifest(input) {
  const errors = []
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { ok: false, errors: ['manifest must be an object'], manifest: null }
  if (typeof input.schemaVersion !== 'string' || !semverPattern.test(input.schemaVersion)) errors.push('schemaVersion must be semantic version x.y.z')
  if (!Array.isArray(input.datasets)) errors.push('datasets must be an array')

  const ids = new Set()
  const datasets = Array.isArray(input.datasets) ? input.datasets.map((entry, index) => {
    const id = String(entry?.id ?? '').trim().toLowerCase()
    const version = String(entry?.version ?? '').trim()
    const path = String(entry?.path ?? '').trim()
    const kind = String(entry?.kind ?? '').trim()
    const source = String(entry?.source ?? '').trim()
    const license = String(entry?.license ?? '').trim()
    const provenance = String(entry?.provenance ?? '').trim()
    const schema = String(entry?.schema ?? '').trim()
    const checksum = entry?.checksum == null ? '' : String(entry.checksum).trim()

    if (!idPattern.test(id)) errors.push(`datasets[${index}]: invalid id`)
    if (ids.has(id)) errors.push(`datasets[${index}]: duplicate id ${id}`)
    ids.add(id)
    if (!semverPattern.test(version)) errors.push(`datasets[${index}]: version must be semantic version`)
    if (!path || path.startsWith('/') || path.includes('..')) errors.push(`datasets[${index}]: path must be repository-relative`)
    if (!kind) errors.push(`datasets[${index}]: kind is required`)
    if (!source) errors.push(`datasets[${index}]: source/provenance origin is required`)
    if (!license) errors.push(`datasets[${index}]: license/redistribution note is required`)
    if (!provenance) errors.push(`datasets[${index}]: provenance is required`)
    if (!schema) errors.push(`datasets[${index}]: schema identifier is required`)
    if (checksum && !/^sha256:[a-f0-9]{64}$/i.test(checksum)) errors.push(`datasets[${index}]: checksum must be sha256:<64 hex>`)

    return { id, version, path, kind, source, license, provenance, schema, ...(checksum ? { checksum } : {}) }
  }) : []

  return { ok: errors.length === 0, errors, manifest: errors.length ? null : { schemaVersion: input.schemaVersion, datasets } }
}

export function summarizeDatasetManifest(manifest) {
  const validation = validateDatasetManifest(manifest)
  if (!validation.ok || !validation.manifest) throw new Error(validation.errors.join('; '))
  const byKind = {}
  validation.manifest.datasets.forEach((dataset) => { byKind[dataset.kind] = (byKind[dataset.kind] ?? 0) + 1 })
  return { datasets: validation.manifest.datasets.length, byKind }
}
