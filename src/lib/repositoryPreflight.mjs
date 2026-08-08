export function summarizeRepositoryPreflight({ checks = [], rendererReadiness = null, reviewReadiness = null } = {}) {
  const failedChecks = checks.filter((check) => check.ok === false)
  const passedChecks = checks.filter((check) => check.ok === true)
  return {
    ok: failedChecks.length === 0,
    invariantChecks: checks.length,
    passedChecks: passedChecks.length,
    failedChecks,
    rendererReadiness,
    reviewReadiness,
  }
}

export function formatRepositoryPreflight(summary) {
  const lines = [
    '# OpenEUV repository preflight',
    '',
    `- Invariants: ${summary.passedChecks}/${summary.invariantChecks} passing`,
    `- Integrity result: **${summary.ok ? 'PASS' : 'FAIL'}**`,
  ]
  if (summary.rendererReadiness) {
    lines.push(`- Renderer evidence: ${summary.rendererReadiness.pairedCaptures}/${summary.rendererReadiness.requiredPairedCaptures} paired captures; ${summary.rendererReadiness.pairedDeviceClasses}/${summary.rendererReadiness.requiredDeviceClasses} device classes; decision-ready=${summary.rendererReadiness.readyForDecision ? 'yes' : 'no'}`)
  }
  if (summary.reviewReadiness) {
    lines.push(`- Evidence review campaign: ${summary.reviewReadiness.reviewedRecords}/${summary.reviewReadiness.minimumReviewedRecords} genuine reviewed records; minimum-count-ready=${summary.reviewReadiness.readyForMinimumCampaignCount ? 'yes' : 'no'}`)
  }
  if (summary.failedChecks.length) {
    lines.push('', '## Failed invariants')
    for (const check of summary.failedChecks) lines.push(`- ${check.name}: ${check.detail ?? 'failed'}`)
  }
  lines.push('', 'External renderer/reviewer readiness is reported separately and does not fail repository integrity.')
  return `${lines.join('\n')}\n`
}
