#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { auditAccessibilityContract } from '../src/lib/accessibilityContract.mjs'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')
const [appSource, searchSource, statusSource, stylesSource] = await Promise.all([
  read('src/App.tsx'),
  read('src/components/AtlasSearch.tsx'),
  read('src/components/ResearchStatusPanel.tsx'),
  read('src/v6.css'),
])

const result = auditAccessibilityContract({ appSource, searchSource, statusSource, stylesSource })
if (process.argv.includes('--json')) console.log(JSON.stringify(result, null, 2))
else if (result.ok) console.log(`Accessibility contract valid · ${result.ids.length} audited literal shell IDs`)
else console.error(result.errors.join('\n'))
if (!result.ok) process.exitCode = 1
