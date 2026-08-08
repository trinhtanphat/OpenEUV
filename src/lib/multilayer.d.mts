export type OpticalLayer = {
  n: number
  k: number
  thicknessNm: number
}

export type OpticalMedium = {
  n: number
  k: number
}

export type Polarization = 's' | 'p' | 'unpolarized'

export function multilayerReflectivity(input: {
  wavelengthNm: number
  angleDeg?: number
  pairs: number
  materialA: OpticalLayer
  materialB: OpticalLayer
  substrate?: OpticalMedium
  incident?: OpticalMedium
  polarization?: Polarization
}): {
  reflectivity: number
  percent: number
  sReflectivity: number
  pReflectivity: number
  sPercent: number
  pPercent: number
  physicalPeriodNm: number
  polarization: Polarization
}

export function braggPeriodNm(wavelengthNm: number, angleDeg?: number): number
