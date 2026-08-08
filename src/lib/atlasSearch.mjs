function normalize(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9.+/-]+/g, ' ')
    .trim()
}

export function tokenizeAtlasSearch(value) {
  return Array.from(new Set(normalize(value).split(/\s+/).filter(Boolean)))
}

export function prepareAtlasSearchItem(item) {
  const title = normalize(item.title)
  const id = normalize(item.id)
  const subtitle = normalize(item.subtitle)
  const keywords = normalize((item.keywords ?? []).join(' '))
  const searchable = [id, title, subtitle, keywords].filter(Boolean).join(' ')
  return { ...item, _search: { id, title, subtitle, keywords, searchable } }
}

export function scoreAtlasSearchItem(item, query) {
  const prepared = item._search ? item : prepareAtlasSearchItem(item)
  const normalizedQuery = normalize(query)
  if (!normalizedQuery) return 0
  const tokens = tokenizeAtlasSearch(normalizedQuery)
  const haystack = prepared._search
  let score = 0

  if (haystack.id === normalizedQuery) score += 120
  if (haystack.title === normalizedQuery) score += 110
  if (haystack.id.startsWith(normalizedQuery)) score += 80
  if (haystack.title.startsWith(normalizedQuery)) score += 70
  if (haystack.title.includes(normalizedQuery)) score += 50
  if (haystack.subtitle.includes(normalizedQuery)) score += 24
  if (haystack.keywords.includes(normalizedQuery)) score += 18

  for (const token of tokens) {
    if (haystack.id === token) score += 30
    else if (haystack.id.includes(token)) score += 18
    if (haystack.title.startsWith(token)) score += 20
    else if (haystack.title.includes(token)) score += 12
    if (haystack.subtitle.includes(token)) score += 6
    if (haystack.keywords.includes(token)) score += 5
  }

  const covered = tokens.filter((token) => haystack.searchable.includes(token)).length
  if (tokens.length && covered === tokens.length) score += 20 + tokens.length * 2
  return score
}

export function searchAtlas(index, query, { limit = 12 } = {}) {
  const normalizedQuery = normalize(query)
  if (!normalizedQuery) return []
  return index
    .map((item, order) => ({ item, order, score: scoreAtlasSearchItem(item, normalizedQuery) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order || String(a.item.title).localeCompare(String(b.item.title)))
    .slice(0, limit)
    .map(({ item, score }) => ({ ...item, score }))
}
