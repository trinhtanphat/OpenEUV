export function normalizeDeploySha(value) {
  const raw = String(value ?? '').trim().toLowerCase()
  return /^[0-9a-f]{40}$/.test(raw) ? raw : null
}

export function gitStatusIsClean(porcelain) {
  return String(porcelain ?? '').trim().length === 0
}

export function createManualDeployPlan({ sha, porcelain = '', dryRun = false, allowDirty = false, skipCheck = false } = {}) {
  const normalizedSha = normalizeDeploySha(sha)
  if (!normalizedSha) return { ok: false, error: 'git HEAD must be a full 40-character hexadecimal SHA', steps: [] }

  const clean = gitStatusIsClean(porcelain)
  if (!clean && !allowDirty) {
    return {
      ok: false,
      error: 'working tree is dirty; commit/stash changes or pass --allow-dirty to accept unverifiable source provenance',
      steps: [],
      sha: normalizedSha,
      clean,
    }
  }

  const env = { OPENEUV_COMMIT_SHA: normalizedSha }
  const steps = []
  if (dryRun) {
    steps.push({ command: 'npm', args: ['run', 'build'], env })
    steps.push({ command: 'npx', args: ['wrangler', 'deploy', '--dry-run'], env })
  } else {
    steps.push({ command: 'npm', args: ['run', skipCheck ? 'build' : 'check'], env })
    steps.push({ command: 'npx', args: ['wrangler', 'deploy'], env })
  }

  return {
    ok: true,
    sha: normalizedSha,
    shortSha: normalizedSha.slice(0, 12),
    clean,
    provenanceComplete: clean,
    dryRun: Boolean(dryRun),
    skipCheck: Boolean(skipCheck),
    steps,
  }
}
