import test from 'node:test'
import assert from 'node:assert/strict'
import { localizeObject, translateValue } from '../src/lib/i18nCore.mjs'

const dictionary = {
  en: { title: 'English title', body: 'English body', evidence: 'Evidence' },
  vi: { title: 'Tiêu đề tiếng Việt', evidence: '' },
}

test('localized value wins when present', () => {
  assert.equal(translateValue(dictionary, 'vi', 'title'), 'Tiêu đề tiếng Việt')
})

test('missing or empty localized value falls back to English', () => {
  assert.equal(translateValue(dictionary, 'vi', 'body'), 'English body')
  assert.equal(translateValue(dictionary, 'vi', 'evidence'), 'Evidence')
})

test('unknown key safely falls back to the key name', () => {
  assert.equal(translateValue(dictionary, 'vi', 'missing-key'), 'missing-key')
})

test('object localization merges fallback fields with localized fields', () => {
  const result = localizeObject({ en: { title: 'EN', description: 'fallback description' }, vi: { title: 'VI' } }, 'vi')
  assert.deepEqual(result, { title: 'VI', description: 'fallback description' })
})
