export type FourierPoint = { x: number; object: number; image: number }
export type MtfPoint = { frequency: number; transfer: number }

export function circularPupilMtf(nu: number): number
export function sampleCircularPupilMtf(samples?: number): MtfPoint[]
export function reconstructNormalizedSquarePattern(input?: {
  baseFrequency?: number
  cutoff?: number
  samples?: number
  maxHarmonic?: number
}): {
  points: FourierPoint[]
  passedHarmonics: number
  contrast: number
  fundamentalNormalizedFrequency: number
  fundamentalTransfer: number
}
