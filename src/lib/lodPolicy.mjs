export const lodModes = ['high', 'balanced', 'low']

export function chooseLodMode({ width, devicePixelRatio = 1, hardwareConcurrency = 8, reducedMotion = false, saveData = false }) {
  const viewport = Number(width)
  const dpr = Number(devicePixelRatio)
  const cores = Number(hardwareConcurrency)
  if (saveData || reducedMotion || viewport <= 640 || cores <= 4) return 'low'
  if (viewport <= 1024 || dpr > 1.75 || cores <= 8) return 'balanced'
  return 'high'
}

export function lodSettings(mode) {
  if (!lodModes.includes(mode)) throw new Error(`unknown LOD mode: ${mode}`)
  if (mode === 'low') return {
    pixelRatioCap: 1,
    gridDivisions: 30,
    animateSource: false,
    labelDensity: 'selected',
    shadowMaps: false,
  }
  if (mode === 'balanced') return {
    pixelRatioCap: 1.35,
    gridDivisions: 45,
    animateSource: true,
    labelDensity: 'selected',
    shadowMaps: true,
  }
  return {
    pixelRatioCap: 1.75,
    gridDivisions: 60,
    animateSource: true,
    labelDensity: 'subsystem',
    shadowMaps: true,
  }
}
