export function translateValue(dictionary, language, key, fallbackLanguage = 'en') {
  const localized = dictionary?.[language]?.[key]
  if (typeof localized === 'string' && localized.length > 0) return localized
  const fallback = dictionary?.[fallbackLanguage]?.[key]
  if (typeof fallback === 'string' && fallback.length > 0) return fallback
  return String(key)
}

export function localizeObject(dictionary, language, fallbackLanguage = 'en') {
  const fallback = dictionary?.[fallbackLanguage] ?? {}
  const localized = dictionary?.[language] ?? {}
  return { ...fallback, ...localized }
}
