export function rendererCapabilitySnapshot(environment = globalThis) {
  const navigatorLike = environment.navigator ?? {}
  const webgpu = Boolean(navigatorLike.gpu)
  const hardwareConcurrency = Number(navigatorLike.hardwareConcurrency ?? 0)
  const deviceMemory = Number(navigatorLike.deviceMemory ?? 0)
  return {
    webgpu,
    hardwareConcurrency: Number.isFinite(hardwareConcurrency) ? hardwareConcurrency : 0,
    deviceMemoryGiB: Number.isFinite(deviceMemory) ? deviceMemory : 0,
  }
}

export function shouldAdoptExperimentalRenderer({ baselineMs, experimentalMs, minimumImprovement = 0.15, samples = 0 }) {
  const baseline = Number(baselineMs)
  const experimental = Number(experimentalMs)
  const sampleCount = Number(samples)
  if (!Number.isFinite(baseline) || !Number.isFinite(experimental) || baseline <= 0 || experimental <= 0) return false
  if (!Number.isFinite(sampleCount) || sampleCount < 3) return false
  const improvement = (baseline - experimental) / baseline
  return improvement >= minimumImprovement
}

export function summarizeFrameTimes(frameTimes) {
  const values = frameTimes.map(Number).filter((value) => Number.isFinite(value) && value >= 0).sort((a, b) => a - b)
  if (!values.length) return { samples: 0, averageMs: 0, medianMs: 0, p95Ms: 0 }
  const averageMs = values.reduce((sum, value) => sum + value, 0) / values.length
  const percentile = (fraction) => values[Math.min(values.length - 1, Math.floor((values.length - 1) * fraction))]
  return { samples: values.length, averageMs, medianMs: percentile(0.5), p95Ms: percentile(0.95) }
}
