export function translateValue(
  dictionary: Record<string, Record<string, string>>,
  language: string,
  key: string,
  fallbackLanguage?: string,
): string

export function localizeObject<T extends Record<string, unknown>>(
  dictionary: Record<string, Partial<T>>,
  language: string,
  fallbackLanguage?: string,
): T
