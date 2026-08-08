const supportedLanguages = ['en', 'vi']
const placeholderPattern = /^(?:todo|tbd|translate(?: me)?|translation needed|\?{2,}|[-_.]{3,})$/i

export function isTranslationPlaceholder(value) {
  return placeholderPattern.test(String(value ?? '').trim())
}

function validText(value) {
  return typeof value === 'string' && value.trim().length > 0 && !isTranslationPlaceholder(value)
}

export function auditBilingualDictionary(dictionary, languages = supportedLanguages) {
  const errors = []
  const languageKeys = Object.keys(dictionary ?? {})
  const invalidLanguages = languageKeys.filter((language) => !languages.includes(language))
  for (const language of invalidLanguages) errors.push(`unsupported language dictionary: ${language}`)

  const keys = Array.from(new Set(languages.flatMap((language) => Object.keys(dictionary?.[language] ?? {})))).sort()
  let translatedPairs = 0
  for (const key of keys) {
    let complete = true
    for (const language of languages) {
      const value = dictionary?.[language]?.[key]
      if (!validText(value)) {
        complete = false
        errors.push(`${language}.${key} is missing, empty or placeholder-only`)
      }
    }
    if (complete) translatedPairs += 1
  }

  return { ok: errors.length === 0, errors, languages, keys: keys.length, translatedPairs, invalidLanguages }
}

export function auditNestedBilingualPairs(value, { path = '$', languages = supportedLanguages } = {}) {
  const errors = []
  let pairs = 0
  let completePairs = 0

  function visit(node, currentPath) {
    if (Array.isArray(node)) {
      node.forEach((item, index) => visit(item, `${currentPath}[${index}]`))
      return
    }
    if (!node || typeof node !== 'object') return

    const keys = Object.keys(node)
    const hasLanguageKey = keys.some((key) => languages.includes(key))
    if (hasLanguageKey) {
      pairs += 1
      let complete = true
      for (const language of languages) {
        if (!validText(node[language])) {
          complete = false
          errors.push(`${currentPath}.${language} is missing, empty or placeholder-only`)
        }
      }
      const unexpected = keys.filter((key) => /^[a-z]{2}(?:-[A-Z]{2})?$/.test(key) && !languages.includes(key))
      for (const language of unexpected) errors.push(`${currentPath} contains unsupported language identifier ${language}`)
      if (complete) completePairs += 1
    }

    for (const [key, child] of Object.entries(node)) visit(child, `${currentPath}.${key}`)
  }

  visit(value, path)
  return { ok: errors.length === 0, errors, pairs, completePairs }
}

function extractBalancedObject(source, openingIndex) {
  if (source[openingIndex] !== '{') throw new Error('expected object opening brace')
  let depth = 0
  let quote = null
  let escaped = false
  for (let index = openingIndex; index < source.length; index += 1) {
    const char = source[index]
    if (quote) {
      if (escaped) escaped = false
      else if (char === '\\') escaped = true
      else if (char === quote) quote = null
      continue
    }
    if (char === "'" || char === '"' || char === '`') { quote = char; continue }
    if (char === '{') depth += 1
    else if (char === '}') {
      depth -= 1
      if (depth === 0) return source.slice(openingIndex + 1, index)
    }
  }
  throw new Error('unterminated object literal')
}

function parseFlatStringBlock(block, language) {
  const values = {}
  const duplicates = []
  for (const line of block.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_$][\w$]*)\s*:\s*(['"])(.*)\2,?\s*$/)
    if (!match) continue
    const [, key, quote, rawValue] = match
    let value = ''
    for (let index = 0; index < rawValue.length; index += 1) {
      const char = rawValue[index]
      if (char === '\\' && index + 1 < rawValue.length) {
        const next = rawValue[++index]
        value += next === 'n' ? '\n' : next === 'r' ? '\r' : next === 't' ? '\t' : next
      } else value += char
    }
    if (Object.hasOwn(values, key)) duplicates.push(`${language}.${key}`)
    values[key] = value
    void quote
  }
  return { values, duplicates }
}

export function extractI18nCopyDictionary(source) {
  const marker = source.indexOf('const copy')
  if (marker < 0) throw new Error('const copy dictionary not found')
  const objectStart = source.indexOf('{', marker)
  const copyBody = extractBalancedObject(source, objectStart)
  const dictionary = {}
  const duplicates = []
  for (const language of supportedLanguages) {
    const match = new RegExp(`(?:^|\\n)\\s*${language}\\s*:\\s*\\{`, 'm').exec(copyBody)
    if (!match) { dictionary[language] = {}; continue }
    const openingIndex = copyBody.indexOf('{', match.index)
    const block = extractBalancedObject(copyBody, openingIndex)
    const parsed = parseFlatStringBlock(block, language)
    dictionary[language] = parsed.values
    duplicates.push(...parsed.duplicates)
  }
  return { dictionary, duplicates }
}
