const isFinitePositive = (value) => Number.isFinite(value) && value > 0
const isFiniteNonNegative = (value) => Number.isFinite(value) && value >= 0

export function validateOpticalDataset(input) {
  const errors = []
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { ok: false, errors: ['dataset must be an object'], dataset: null }
  if (typeof input.id !== 'string' || !/^[A-Z0-9][A-Z0-9._-]+$/.test(input.id)) errors.push('id must use uppercase letters/numbers/._-')
  if (typeof input.material !== 'string' || input.material.trim().length === 0) errors.push('material is required')
  if (!input.source || typeof input.source !== 'object') errors.push('source metadata is required')
  else {
    if (typeof input.source.name !== 'string' || input.source.name.trim().length === 0) errors.push('source.name is required')
    try {
      const url = new URL(input.source.url)
      if (!['http:', 'https:'].includes(url.protocol)) errors.push('source.url must use http/https')
    } catch {
      errors.push('source.url must be a valid public URL')
    }
  }
  if (typeof input.license !== 'string' || input.license.trim().length === 0) errors.push('license/redistribution terms are required')
  if (input.wavelengthUnit !== 'nm') errors.push('wavelengthUnit must be nm')
  if (!Array.isArray(input.samples) || input.samples.length === 0) errors.push('at least one optical-constant sample is required')

  const samples = Array.isArray(input.samples) ? input.samples.map((sample, index) => {
    const wavelengthNm = Number(sample?.wavelengthNm)
    const n = Number(sample?.n)
    const k = Number(sample?.k)
    if (!isFinitePositive(wavelengthNm)) errors.push(`samples[${index}].wavelengthNm must be positive`)
    if (!isFinitePositive(n)) errors.push(`samples[${index}].n must be positive`)
    if (!isFiniteNonNegative(k)) errors.push(`samples[${index}].k must be non-negative`)
    return { wavelengthNm, n, k }
  }) : []

  const sorted = [...samples].sort((a, b) => a.wavelengthNm - b.wavelengthNm)
  for (let index = 1; index < sorted.length; index += 1) {
    if (sorted[index].wavelengthNm === sorted[index - 1].wavelengthNm) errors.push(`duplicate wavelength sample ${sorted[index].wavelengthNm} nm`)
  }

  return {
    ok: errors.length === 0,
    errors,
    dataset: errors.length === 0 ? {
      id: input.id,
      material: input.material.trim(),
      description: typeof input.description === 'string' ? input.description : '',
      source: { name: input.source.name.trim(), url: input.source.url, doi: input.source.doi ?? '' },
      license: input.license.trim(),
      provenanceNote: typeof input.provenanceNote === 'string' ? input.provenanceNote : '',
      wavelengthUnit: 'nm',
      samples: sorted,
    } : null,
  }
}

export function sampleOpticalConstants(dataset, wavelengthNm) {
  const validation = validateOpticalDataset(dataset)
  if (!validation.ok || !validation.dataset) throw new Error(validation.errors.join('; '))
  const samples = validation.dataset.samples
  const wavelength = Number(wavelengthNm)
  if (!Number.isFinite(wavelength)) throw new Error('wavelength must be finite')
  if (wavelength <= samples[0].wavelengthNm) return { ...samples[0], datasetId: validation.dataset.id, extrapolated: wavelength < samples[0].wavelengthNm }
  const last = samples[samples.length - 1]
  if (wavelength >= last.wavelengthNm) return { ...last, datasetId: validation.dataset.id, extrapolated: wavelength > last.wavelengthNm }
  for (let index = 1; index < samples.length; index += 1) {
    const upper = samples[index]
    const lower = samples[index - 1]
    if (wavelength <= upper.wavelengthNm) {
      const ratio = (wavelength - lower.wavelengthNm) / (upper.wavelengthNm - lower.wavelengthNm)
      return {
        wavelengthNm: wavelength,
        n: lower.n + (upper.n - lower.n) * ratio,
        k: lower.k + (upper.k - lower.k) * ratio,
        datasetId: validation.dataset.id,
        extrapolated: false,
      }
    }
  }
  return { ...last, datasetId: validation.dataset.id, extrapolated: false }
}
