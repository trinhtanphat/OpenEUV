function extractObjectsFromArray(source, marker) {
  const text = String(source ?? '')
  const markerIndex = text.indexOf(marker)
  if (markerIndex < 0) return []
  const arrayStart = text.indexOf('[', markerIndex)
  if (arrayStart < 0) return []

  const objects = []
  let depth = 0
  let objectStart = -1
  let quote = ''
  let escaped = false

  for (let index = arrayStart + 1; index < text.length; index += 1) {
    const char = text[index]
    if (quote) {
      if (escaped) escaped = false
      else if (char === '\\') escaped = true
      else if (char === quote) quote = ''
      continue
    }
    if (char === "'" || char === '"' || char === '`') {
      quote = char
      continue
    }
    if (char === '{') {
      if (depth === 0) objectStart = index
      depth += 1
      continue
    }
    if (char === '}') {
      depth -= 1
      if (depth < 0) return []
      if (depth === 0 && objectStart >= 0) {
        objects.push(text.slice(objectStart, index + 1))
        objectStart = -1
      }
      continue
    }
    if (char === ']' && depth === 0) break
  }
  return depth === 0 ? objects : []
}

function scalar(block, field) {
  return block.match(new RegExp(`\\b${field}\\s*:\\s*['\"]([^'\"]*)['\"]`))?.[1] ?? ''
}

function array(block, field) {
  const body = block.match(new RegExp(`\\b${field}\\s*:\\s*\\[([^\\]]*)\\]`))?.[1] ?? ''
  return Array.from(body.matchAll(/['"]([^'"]+)['"]/g), (match) => match[1])
}

export function parsePatentRecordsFromTypeScript(source) {
  return extractObjectsFromArray(source, 'export const patents').map((block) => ({
    id: scalar(block, 'id'),
    familyId: scalar(block, 'familyId'),
    familyLabel: scalar(block, 'familyLabel'),
    familyMembers: array(block, 'familyMembers'),
    title: scalar(block, 'title'),
    priorityDate: scalar(block, 'priorityDate'),
    publicationDate: scalar(block, 'publicationDate'),
    subsystem: scalar(block, 'subsystem'),
    linkedSubsystems: array(block, 'linkedSubsystems'),
    assignee: scalar(block, 'assignee'),
    applicationNumber: scalar(block, 'applicationNumber') || undefined,
    summary: scalar(block, 'summary'),
    url: scalar(block, 'url'),
  })).filter((record) => record.id)
}
