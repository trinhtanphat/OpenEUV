import test from 'node:test'
import assert from 'node:assert/strict'
import { auditAccessibilityContract } from '../src/lib/accessibilityContract.mjs'

const valid = {
  appSource: `<><a className="skip-link" href="#main-content">Skip</a><main id="main-content"></main></>`,
  searchSource: `<label htmlFor="atlas-search-input">Search</label><input id="atlas-search-input" aria-controls="atlas-search-results"/><div id="atlas-search-results" role="listbox"><button role="option"/></div>`,
  statusSource: `<section id="provenance-overview"><div role="status" aria-live="polite"/></section>`,
  stylesSource: `@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto}}`,
}

test('accessibility contract accepts the required shell semantics', () => {
  const result = auditAccessibilityContract(valid)
  assert.equal(result.ok, true, result.errors.join('; '))
})

test('accessibility contract rejects missing skip/search/live/reduced-motion semantics', () => {
  const result = auditAccessibilityContract({ appSource: '<main></main>', searchSource: '<input/>', statusSource: '<div/>', stylesSource: '' })
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.includes('skip-link')))
  assert.ok(result.errors.some((error) => error.includes('explicit label')))
  assert.ok(result.errors.some((error) => error.includes('status live region')))
  assert.ok(result.errors.some((error) => error.includes('prefers-reduced-motion')))
})

test('accessibility contract rejects duplicate literal shell IDs', () => {
  const result = auditAccessibilityContract({ ...valid, statusSource: `<section id="main-content"><div role="status" aria-live="polite"/></section>` })
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.includes('duplicate literal shell id: main-content')))
})
