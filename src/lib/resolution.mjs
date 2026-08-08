export function rayleighResolutionNm({ wavelengthNm, numericalAperture, k1 }) {
  const wavelength = Number(wavelengthNm)
  const na = Number(numericalAperture)
  const factor = Number(k1)
  if (!Number.isFinite(wavelength) || wavelength <= 0) throw new Error('wavelengthNm must be positive')
  if (!Number.isFinite(na) || na <= 0) throw new Error('numericalAperture must be positive')
  if (!Number.isFinite(factor) || factor <= 0) throw new Error('k1 must be positive')
  return (factor * wavelength) / na
}
