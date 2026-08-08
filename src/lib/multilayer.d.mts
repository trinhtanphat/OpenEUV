export type OpticalLayer = {
  n: number
  k: number
  thicknessNm: number
}

export type OpticalMedium = {
  n: number
  k: number
}

export function multilayerReflectivity(input: {
  wavelengthNm: number
  angleDeg?: number
  pairs: number
  materialA: OpticalLayer
  materialB: OpticalLayer
  substrate?: OpticalMedium
  incident?: OpticalMedium
}): {
  reflectivity: number
  percent: number
  physicalPeriodNm: number
}

export function braggPeriodNm(wavelengthNm: number, angleDeg?: number): number
