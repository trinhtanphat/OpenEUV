export type PublicBuildInfo = {
  version: string
  commit: string
  source: 'explicit' | 'cloudflare' | 'vercel' | 'unknown'
}

export const buildInfo: PublicBuildInfo = __OPENEUV_BUILD__
