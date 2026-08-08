/// <reference types="vite/client" />

declare const __OPENEUV_BUILD__: {
  version: string
  commit: string
  source: 'explicit' | 'cloudflare' | 'vercel' | 'unknown'
}
