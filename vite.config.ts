import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import packageJson from './package.json'
import { resolveBuildMetadata } from './src/lib/buildMetadata.mjs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const build = resolveBuildMetadata({ version: packageJson.version, env })
  return {
    plugins: [react()],
    define: {
      __OPENEUV_BUILD__: JSON.stringify(build),
    },
    server: { host: '0.0.0.0' },
  }
})
