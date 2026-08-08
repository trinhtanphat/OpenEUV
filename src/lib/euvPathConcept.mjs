const clamp01 = (value) => Math.max(0, Math.min(1, Number(value)))

export function normalizedAbsorbingPath({ absorptionIndex, pathLength }) {
  const absorption = Math.max(0, Number(absorptionIndex))
  const length = Math.max(0, Number(pathLength))
  return Math.exp(-absorption * length)
}

export function normalizedReflectivePath({ perReflectionTransfer, reflections }) {
  const transfer = clamp01(perReflectionTransfer)
  const count = Math.max(0, Math.floor(Number(reflections)))
  return transfer ** count
}

export function compareNormalizedEuvPaths({
  absorptionIndex,
  pathLength,
  lowAbsorptionFraction = 0.08,
  perReflectionTransfer,
  reflections,
}) {
  const fraction = clamp01(lowAbsorptionFraction)
  const absorbingMedium = normalizedAbsorbingPath({ absorptionIndex, pathLength })
  const lowAbsorptionMedium = normalizedAbsorbingPath({ absorptionIndex: Math.max(0, Number(absorptionIndex)) * fraction, pathLength })
  const mirrorChain = normalizedReflectivePath({ perReflectionTransfer, reflections })
  return {
    absorbingMedium,
    lowAbsorptionMedium,
    mirrorChain,
    lowAbsorptionMirrorPath: lowAbsorptionMedium * mirrorChain,
  }
}
