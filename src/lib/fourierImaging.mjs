const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0))

/**
 * Normalized incoherent MTF of an ideal circular pupil.
 * Input nu is normalized spatial frequency: 0 at DC and 1 at the cutoff.
 * This is a generic optics teaching relationship, not an EUV scanner model.
 */
export function circularPupilMtf(nu) {
  const value = clamp01(nu)
  if (value >= 1) return 0
  return (2 / Math.PI) * (Math.acos(value) - value * Math.sqrt(Math.max(0, 1 - value * value)))
}

export function sampleCircularPupilMtf(samples = 64) {
  const count = Math.max(2, Math.min(512, Math.round(samples)))
  return Array.from({ length: count }, (_, index) => {
    const frequency = index / (count - 1)
    return { frequency, transfer: circularPupilMtf(frequency) }
  })
}

/**
 * Reconstruct a normalized 1D 50%-duty square pattern after a generic
 * low-pass imaging transfer. Frequencies and cutoff are dimensionless.
 */
export function reconstructNormalizedSquarePattern({
  baseFrequency = 0.18,
  cutoff = 0.55,
  samples = 160,
  maxHarmonic = 21,
} = {}) {
  const f0 = Math.max(0.01, Math.min(0.75, Number(baseFrequency) || 0.18))
  const fc = Math.max(0.02, Math.min(1.5, Number(cutoff) || 0.55))
  const count = Math.max(32, Math.min(1024, Math.round(samples)))
  const harmonicLimit = Math.max(1, Math.min(101, Math.round(maxHarmonic)))
  const points = []
  let passedHarmonics = 0

  for (let harmonic = 1; harmonic <= harmonicLimit; harmonic += 2) {
    if ((harmonic * f0) / fc < 1) passedHarmonics += 1
  }

  for (let index = 0; index < count; index += 1) {
    const x = index / (count - 1)
    const phase = 2 * Math.PI * f0 * x * 8
    const object = Math.sin(phase) >= 0 ? 1 : 0
    let image = 0.5
    for (let harmonic = 1; harmonic <= harmonicLimit; harmonic += 2) {
      const normalizedFrequency = (harmonic * f0) / fc
      const transfer = circularPupilMtf(normalizedFrequency)
      if (transfer <= 0) continue
      image += (2 / Math.PI) * (transfer / harmonic) * Math.sin(harmonic * phase)
    }
    points.push({ x, object, image: clamp01(image) })
  }

  const imageValues = points.map((point) => point.image)
  const imageMin = Math.min(...imageValues)
  const imageMax = Math.max(...imageValues)
  const contrast = imageMax - imageMin
  const fundamentalNormalizedFrequency = f0 / fc

  return {
    points,
    passedHarmonics,
    contrast,
    fundamentalNormalizedFrequency,
    fundamentalTransfer: circularPupilMtf(fundamentalNormalizedFrequency),
  }
}
