#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import process from 'node:process'
import { createManualDeployPlan } from '../src/lib/manualDeployPlan.mjs'

const knownFlags = new Set(['--dry-run', '--allow-dirty', '--skip-check'])
const unknownFlags = process.argv.slice(2).filter((arg) => arg.startsWith('--') && !knownFlags.has(arg))
if (unknownFlags.length) {
  console.error(`Unknown option(s): ${unknownFlags.join(', ')}`)
  process.exit(2)
}

const dryRun = process.argv.includes('--dry-run')
const allowDirty = process.argv.includes('--allow-dirty')
const skipCheck = process.argv.includes('--skip-check')

function runCapture(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8' })
  if (result.status !== 0) {
    const detail = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim()
    console.error(`${command} ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`)
    process.exit(result.status ?? 1)
  }
  return String(result.stdout ?? '')
}

const sha = runCapture('git', ['rev-parse', 'HEAD']).trim()
const porcelain = runCapture('git', ['status', '--porcelain'])
const plan = createManualDeployPlan({ sha, porcelain, dryRun, allowDirty, skipCheck })
if (!plan.ok) {
  console.error(`Deployment blocked: ${plan.error}`)
  process.exit(1)
}

console.log(`OpenEUV manual deploy: ${plan.dryRun ? 'dry-run' : 'production'} · commit ${plan.shortSha}`)
if (!plan.clean) console.warn('WARNING: working tree is dirty; deployed output cannot be represented fully by the recorded commit SHA.')
if (!plan.dryRun && plan.skipCheck) console.warn('WARNING: --skip-check bypasses the full repository gate; the build step will still run.')

for (const step of plan.steps) {
  const executable = process.platform === 'win32' && ['npm', 'npx'].includes(step.command) ? `${step.command}.cmd` : step.command
  console.log(`> ${step.command} ${step.args.join(' ')}`)
  const result = spawnSync(executable, step.args, {
    stdio: 'inherit',
    env: { ...process.env, ...step.env },
  })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

console.log(`${plan.dryRun ? 'Dry-run' : 'Deployment'} command completed for commit ${plan.shortSha}.`)
