import test from 'node:test'
import assert from 'node:assert/strict'
import { auditBilingualDictionary, auditNestedBilingualPairs, extractI18nCopyDictionary, isTranslationPlaceholder } from '../src/lib/bilingualCoverage.mjs'

test('flat bilingual dictionary requires non-placeholder EN and VI values', () => {
  const good = auditBilingualDictionary({ en: { hello: 'Hello' }, vi: { hello: 'Xin chào' } })
  assert.equal(good.ok, true)
  assert.equal(good.translatedPairs, 1)

  const broken = auditBilingualDictionary({ en: { hello: 'Hello', bye: 'Bye' }, vi: { hello: 'TODO' }, fr: { hello: 'Bonjour' } })
  assert.equal(broken.ok, false)
  assert.ok(broken.errors.some((error) => error.includes('vi.hello')))
  assert.ok(broken.errors.some((error) => error.includes('vi.bye')))
  assert.ok(broken.errors.some((error) => error.includes('unsupported language dictionary: fr')))
})

test('nested audit checks only structures that actually declare language keys', () => {
  const data = [{ id: 'x', prompt: { en: 'Question', vi: 'Câu hỏi' }, doi: '10.1/id', label: { en: 'Open', vi: 'Mở' } }]
  const good = auditNestedBilingualPairs(data)
  assert.equal(good.ok, true)
  assert.equal(good.pairs, 2)

  const broken = auditNestedBilingualPairs([{ prompt: { en: 'Question', vi: '???', ja: '質問' } }])
  assert.equal(broken.ok, false)
  assert.ok(broken.errors.some((error) => error.includes('.vi')))
  assert.ok(broken.errors.some((error) => error.includes('unsupported language identifier ja')))
})

test('placeholder detector ignores normal technical identifiers', () => {
  assert.equal(isTranslationPlaceholder('TBD'), true)
  assert.equal(isTranslationPlaceholder('???'), true)
  assert.equal(isTranslationPlaceholder('High-NA'), false)
  assert.equal(isTranslationPlaceholder('10.1117/12.123'), false)
})

test('copy source extractor is brace and quote aware and reports duplicate flat keys', () => {
  const source = `const copy = {\n  en: {\n    hello: 'Hello {world}',\n    title: "Humanity's machine",\n    hello: 'Again',\n  },\n  vi: {\n    hello: 'Xin chào',\n    title: 'Cỗ máy',\n  },\n} as const`
  const extracted = extractI18nCopyDictionary(source)
  assert.equal(extracted.dictionary.en.title, "Humanity's machine")
  assert.deepEqual(extracted.duplicates, ['en.hello'])
  assert.equal(auditBilingualDictionary(extracted.dictionary).ok, true)
})
