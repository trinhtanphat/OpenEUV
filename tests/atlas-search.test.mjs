import assert from 'node:assert/strict'
import test from 'node:test'
import { prepareAtlasSearchItem, scoreAtlasSearchItem, searchAtlas, tokenizeAtlasSearch } from '../src/lib/atlasSearch.mjs'

const index = [
  prepareAtlasSearchItem({ id: 'evidence:HIGHNA-NA-001', type: 'evidence', title: 'HIGHNA-NA-001', subtitle: 'High-NA increases numerical aperture to 0.55', keywords: ['ZEISS', 'projection'], href: '#evidence-HIGHNA-NA-001' }),
  prepareAtlasSearchItem({ id: 'patent:EP4239410A1', type: 'patent', title: 'EP4239410A1 — Reticle stage', subtitle: 'ASML Netherlands B.V.', keywords: ['reticle', 'stage'], href: '#patent-EP4239410A1' }),
  prepareAtlasSearchItem({ id: 'literature:10.1117/12.2515678', type: 'literature', title: '3D mask effects in high NA EUV imaging', subtitle: 'conference · 2019 · Fraunhofer Publica / SPIE', keywords: ['10.1117/12.2515678', 'mask', 'high-na', 'imaging'], href: '#literature-10-1117-12-2515678' }),
  prepareAtlasSearchItem({ id: 'fab:tsmc', type: 'fab-case', title: 'TSMC N7+ EUV volume production', subtitle: 'TSMC · 2019', keywords: ['foundry', 'N7+'], href: '#fab-case-tsmc' }),
  prepareAtlasSearchItem({ id: 'lab:fourier', type: 'lab', title: 'Fourier imaging & MTF', subtitle: 'Normalized spatial-frequency learning lab', keywords: ['fourier', 'mtf', 'spatial frequency', 'pupil'], href: '#fourier-imaging-lab' }),
  prepareAtlasSearchItem({ id: 'learning:l1', type: 'learning', title: 'L1 — Optics foundations', subtitle: 'Learn imaging and spatial frequency', keywords: ['fourier imaging', 'mtf'], href: '#learning-path' }),
  prepareAtlasSearchItem({ id: 'glossary:numerical-aperture', type: 'glossary', title: 'Numerical aperture (NA)', subtitle: 'Khẩu độ số', keywords: ['khau do so', 'optics'], href: '#glossary' }),
]

test('tokenization is deterministic and accent-insensitive', () => {
  assert.deepEqual(tokenizeAtlasSearch('Khẩu độ số / NA'), ['khau', 'do', 'so', '/', 'na'])
})

test('exact evidence or patent IDs outrank generic keyword matches', () => {
  const results = searchAtlas(index, 'EP4239410A1')
  assert.equal(results[0].id, 'patent:EP4239410A1')
  assert.ok(results[0].score >= 100)
})

test('literature DOI routes to its deterministic Literature Explorer anchor', () => {
  const results = searchAtlas(index, '10.1117/12.2515678')
  assert.equal(results[0].id, 'literature:10.1117/12.2515678')
  assert.equal(results[0].href, '#literature-10-1117-12-2515678')
})

test('organization and bilingual technical terms remain searchable', () => {
  assert.equal(searchAtlas(index, 'TSMC')[0].id, 'fab:tsmc')
  assert.equal(searchAtlas(index, 'khẩu độ')[0].id, 'glossary:numerical-aperture')
  assert.equal(searchAtlas(index, 'ZEISS projection')[0].id, 'evidence:HIGHNA-NA-001')
})

test('direct lab title outranks a learning-level keyword match', () => {
  const results = searchAtlas(index, 'Fourier imaging & MTF')
  assert.equal(results[0].id, 'lab:fourier')
  assert.equal(results[0].href, '#fourier-imaging-lab')
})

test('all query tokens receive a coverage bonus', () => {
  const full = scoreAtlasSearchItem(index[0], 'high na projection')
  const partial = scoreAtlasSearchItem(index[0], 'projection unrelated-token')
  assert.ok(full > partial)
})

test('empty queries return no results and limits are respected', () => {
  assert.deepEqual(searchAtlas(index, '   '), [])
  assert.equal(searchAtlas(index, 'stage', { limit: 1 }).length, 1)
})
