import test from 'node:test'
import assert from 'node:assert/strict'
import { browserPrefersReducedMotion, preferredScrollBehavior } from '../src/lib/motionPreference.mjs'

test('scroll behavior respects reduced-motion preference', () => {
  assert.equal(preferredScrollBehavior(true), 'auto')
  assert.equal(preferredScrollBehavior(false), 'smooth')
})

test('browser preference helper is deterministic for injected matchMedia', () => {
  assert.equal(browserPrefersReducedMotion(() => ({ matches: true })), true)
  assert.equal(browserPrefersReducedMotion(() => ({ matches: false })), false)
  assert.equal(browserPrefersReducedMotion(null), false)
})
