const deviceClasses = new Set(['desktop', 'laptop', 'tablet', 'phone'])
const powerModes = new Set(['plugged-in', 'battery', 'unknown'])

function finitePositive(value) {
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric > 0
}

function validateRendererResult(result, path, errors) {
  if (!result || typeof result !== 'object') {
    errors.push(`${path} must be an object`)
    return
  }
  if (!['ok', 'error', 'skipped'].includes(result.status)) errors.push(`${path}.status must be ok, error, or skipped`)
  if (result.status === 'ok') {
    for (const field of ['setupMs', 'averageMs', 'medianMs', 'p95Ms']) {
      if (!finitePositive(result[field])) errors.push(`${path}.${field} must be a positive finite number for an ok result`)
    }
    if (!Number.isInteger(result.samples) || result.samples < 1) errors.push(`${path}.samples must be a positive integer for an ok result`)
  }
}

export function validateRenderBenchmarkCapture(value) {
  const errors = []
  const warnings = []
  if (!value || typeof value !== 'object') return { ok: false, errors: ['capture must be an object'], warnings }

  if (value.schemaVersion !== 1) errors.push('schemaVersion must equal 1')
  const capture = value.capture
  if (!capture || typeof capture !== 'object') errors.push('capture metadata is required')
  else {
    if (!capture.capturedAt || Number.isNaN(Date.parse(capture.capturedAt))) errors.push('capture.capturedAt must be an ISO-8601 timestamp')
    if (typeof capture.timezone !== 'string' || !capture.timezone.trim()) errors.push('capture.timezone is required')
    if (!deviceClasses.has(capture.deviceClass)) errors.push('capture.deviceClass must be desktop, laptop, tablet, or phone')
    if (typeof capture.os !== 'string' || !capture.os.trim()) errors.push('capture.os is required')
    if (typeof capture.browser !== 'string' || !capture.browser.trim()) errors.push('capture.browser is required')
    if (!powerModes.has(capture.powerMode)) errors.push('capture.powerMode must be plugged-in, battery, or unknown')
    const sensitiveKeys = Object.keys(capture).filter((key) => /serial|username|userName|ipAddress|machineId|deviceId/i.test(key))
    if (sensitiveKeys.length) errors.push(`capture metadata contains disallowed identifying fields: ${sensitiveKeys.join(', ')}`)
    if (!capture.cpu) warnings.push('capture.cpu is missing')
    if (!capture.gpu) warnings.push('capture.gpu is missing')
  }

  const benchmark = value.benchmark
  if (!benchmark || typeof benchmark !== 'object') errors.push('benchmark payload is required')
  else {
    if (benchmark.benchmarkVersion !== 2) errors.push('benchmark.benchmarkVersion must equal 2')
    if (benchmark.syncMode !== 'explicit-gpu-completion') errors.push('benchmark.syncMode must equal explicit-gpu-completion')
    if (!benchmark.timestamp || Number.isNaN(Date.parse(benchmark.timestamp))) errors.push('benchmark.timestamp must be an ISO-8601 timestamp')
    if (typeof benchmark.userAgent !== 'string' || !benchmark.userAgent.trim()) errors.push('benchmark.userAgent is required')
    if (!Number.isInteger(benchmark.instances) || benchmark.instances < 1) errors.push('benchmark.instances must be a positive integer')
    if (!Number.isInteger(benchmark.frames) || benchmark.frames < 1) errors.push('benchmark.frames must be a positive integer')
    validateRendererResult(benchmark.webgl, 'benchmark.webgl', errors)
    validateRendererResult(benchmark.webgpu, 'benchmark.webgpu', errors)
    if (benchmark.webgl?.status !== 'ok') errors.push('benchmark.webgl must be ok because WebGL is the required baseline')
  }

  return { ok: errors.length === 0, errors, warnings, capture: errors.length === 0 ? value : undefined }
}

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0
}

function improvement(baseline, candidate) {
  return baseline > 0 && candidate > 0 ? (baseline - candidate) / baseline : 0
}

export function summarizeRenderBenchmarkCaptures(captures, { minimumImprovement = 0.15 } = {}) {
  const valid = []
  const rejected = []
  for (const capture of captures) {
    const validation = validateRenderBenchmarkCapture(capture)
    if (validation.ok) valid.push(capture)
    else rejected.push({ capture, errors: validation.errors })
  }

  const paired = valid.filter((item) => item.benchmark.webgl?.status === 'ok' && item.benchmark.webgpu?.status === 'ok')
  const byDeviceClass = {}
  for (const item of valid) {
    const key = item.capture.deviceClass
    const bucket = byDeviceClass[key] ?? { captures: 0, paired: 0, webglMedianMs: [], webgpuMedianMs: [], webglP95Ms: [], webgpuP95Ms: [] }
    bucket.captures += 1
    if (item.benchmark.webgpu?.status === 'ok') {
      bucket.paired += 1
      bucket.webglMedianMs.push(item.benchmark.webgl.medianMs)
      bucket.webgpuMedianMs.push(item.benchmark.webgpu.medianMs)
      bucket.webglP95Ms.push(item.benchmark.webgl.p95Ms)
      bucket.webgpuP95Ms.push(item.benchmark.webgpu.p95Ms)
    }
    byDeviceClass[key] = bucket
  }

  const deviceSummaries = Object.fromEntries(Object.entries(byDeviceClass).map(([key, bucket]) => [key, {
    captures: bucket.captures,
    paired: bucket.paired,
    webglMedianMs: average(bucket.webglMedianMs),
    webgpuMedianMs: average(bucket.webgpuMedianMs),
    medianImprovement: improvement(average(bucket.webglMedianMs), average(bucket.webgpuMedianMs)),
    webglP95Ms: average(bucket.webglP95Ms),
    webgpuP95Ms: average(bucket.webgpuP95Ms),
    p95Improvement: improvement(average(bucket.webglP95Ms), average(bucket.webgpuP95Ms)),
  }]))

  const pairedClasses = Object.values(deviceSummaries).filter((item) => item.paired > 0).length
  const medianImprovements = paired.map((item) => improvement(item.benchmark.webgl.medianMs, item.benchmark.webgpu.medianMs))
  const p95Improvements = paired.map((item) => improvement(item.benchmark.webgl.p95Ms, item.benchmark.webgpu.p95Ms))
  const worstMedianImprovement = medianImprovements.length ? Math.min(...medianImprovements) : 0
  const averageMedianImprovement = average(medianImprovements)
  const averageP95Improvement = average(p95Improvements)

  const enoughEvidence = paired.length >= 3 && pairedClasses >= 2
  const meaningfulGain = averageMedianImprovement >= minimumImprovement && averageP95Improvement >= minimumImprovement
  const noMaterialRegression = worstMedianImprovement >= -0.1
  const adoptWebGpu = enoughEvidence && meaningfulGain && noMaterialRegression

  return {
    validCaptures: valid.length,
    rejectedCaptures: rejected.length,
    pairedCaptures: paired.length,
    pairedDeviceClasses: pairedClasses,
    minimumImprovement,
    averageMedianImprovement,
    averageP95Improvement,
    worstMedianImprovement,
    enoughEvidence,
    meaningfulGain,
    noMaterialRegression,
    recommendation: adoptWebGpu ? 'consider-webgpu' : 'keep-webgl',
    byDeviceClass: deviceSummaries,
    rejected,
  }
}

export function renderBenchmarkSummaryMarkdown(summary) {
  const pct = (value) => `${(value * 100).toFixed(1)}%`
  const lines = [
    '# OpenEUV renderer benchmark summary',
    '',
    `- Valid captures: ${summary.validCaptures}`,
    `- Rejected captures: ${summary.rejectedCaptures}`,
    `- Paired WebGL/WebGPU captures: ${summary.pairedCaptures}`,
    `- Device classes with paired captures: ${summary.pairedDeviceClasses}`,
    `- Average median-frame improvement: ${pct(summary.averageMedianImprovement)}`,
    `- Average p95-frame improvement: ${pct(summary.averageP95Improvement)}`,
    `- Worst paired median improvement: ${pct(summary.worstMedianImprovement)}`,
    `- Recommendation: **${summary.recommendation === 'consider-webgpu' ? 'consider WebGPU for a controlled next step' : 'keep WebGL as production baseline'}**`,
    '',
    '## Device classes',
    '',
    '| Class | Captures | Paired | WebGL median | WebGPU median | Median gain | WebGL p95 | WebGPU p95 | p95 gain |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
  ]
  for (const [deviceClass, item] of Object.entries(summary.byDeviceClass)) {
    lines.push(`| ${deviceClass} | ${item.captures} | ${item.paired} | ${item.webglMedianMs.toFixed(2)} ms | ${item.webgpuMedianMs.toFixed(2)} ms | ${pct(item.medianImprovement)} | ${item.webglP95Ms.toFixed(2)} ms | ${item.webgpuP95Ms.toFixed(2)} ms | ${pct(item.p95Improvement)} |`)
  }
  if (Object.keys(summary.byDeviceClass).length === 0) lines.push('| — | 0 | 0 | — | — | — | — | — | — |')
  lines.push('', 'WebGPU is not adopted automatically by this report. The production renderer remains WebGL until maintainers review real-device evidence and deliberately change the renderer architecture.')
  return `${lines.join('\n')}\n`
}
