export type BuildMetadata = {
  version: string
  commit: string
  source: 'explicit' | 'cloudflare' | 'vercel' | 'unknown'
}

export function resolveBuildMetadata(input?: { version?: string; env?: Record<string, string | undefined> }): BuildMetadata
