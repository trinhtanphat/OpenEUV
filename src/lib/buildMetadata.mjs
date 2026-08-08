function normalizedCommit(value) {
  const candidate = String(value ?? '').trim().toLowerCase()
  return /^[0-9a-f]{7,40}$/.test(candidate) ? candidate.slice(0, 12) : 'unknown'
}

export function resolveBuildMetadata({ version = '0.0.0', env = {} } = {}) {
  const commit = [
    env.OPENEUV_COMMIT_SHA,
    env.CF_PAGES_COMMIT_SHA,
    env.VERCEL_GIT_COMMIT_SHA,
  ].map(normalizedCommit).find((value) => value !== 'unknown') ?? 'unknown'
  const source = env.OPENEUV_COMMIT_SHA && normalizedCommit(env.OPENEUV_COMMIT_SHA) !== 'unknown'
    ? 'explicit'
    : env.CF_PAGES_COMMIT_SHA && normalizedCommit(env.CF_PAGES_COMMIT_SHA) !== 'unknown'
      ? 'cloudflare'
      : env.VERCEL_GIT_COMMIT_SHA && normalizedCommit(env.VERCEL_GIT_COMMIT_SHA) !== 'unknown'
        ? 'vercel'
        : 'unknown'

  return {
    version: String(version || '0.0.0'),
    commit,
    source,
  }
}
