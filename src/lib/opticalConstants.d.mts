export type OpticalConstantSample = { wavelengthNm: number; n: number; k: number }
export type OpticalDataset = {
  id: string
  material: string
  description?: string
  source: { name: string; url: string; doi?: string }
  license: string
  provenanceNote?: string
  wavelengthUnit: 'nm'
  samples: OpticalConstantSample[]
}

export function validateOpticalDataset(input: unknown): {
  ok: boolean
  errors: string[]
  dataset: OpticalDataset | null
}

export function sampleOpticalConstants(dataset: OpticalDataset, wavelengthNm: number): OpticalConstantSample & {
  datasetId: string
  extrapolated: boolean
}
