export type LodMode = 'high' | 'balanced' | 'low'
export type LodSettings = {
  pixelRatioCap: number
  gridDivisions: number
  animateSource: boolean
  labelDensity: 'selected' | 'subsystem'
  shadowMaps: boolean
}
export function chooseLodMode(input: { width: number; devicePixelRatio?: number; hardwareConcurrency?: number; reducedMotion?: boolean; saveData?: boolean }): LodMode
export function lodSettings(mode: LodMode): LodSettings
