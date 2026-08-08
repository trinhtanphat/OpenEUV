import { useMemo, useRef, useState } from 'react'
import { atlasSearchIndex, type AtlasSearchItem } from '../data/atlasSearchIndex'
import { searchAtlas } from '../lib/atlasSearch.mjs'
import type { Language } from '../i18n'

const typeLabel: Record<AtlasSearchItem['type'], { en: string; vi: string }> = {
  subsystem: { en: '3D subsystem', vi: 'Subsystem 3D' },
  evidence: { en: 'Evidence claim', vi: 'Evidence claim' },
  unknown: { en: 'Open unknown', vi: 'Unknown đang mở' },
  patent: { en: 'Public patent', vi: 'Patent công khai' },
  'fab-case': { en: 'Fab case', vi: 'Fab case' },
  assembly: { en: 'Assembly stage', vi: 'Assembly stage' },
  learning: { en: 'Learning level', vi: 'Level học' },
  glossary: { en: 'Glossary', vi: 'Thuật ngữ' },
}

export function AtlasSearch({ language }: { language: Language }) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const results = useMemo(() => searchAtlas(atlasSearchIndex, query, { limit: 10 }) as Array<AtlasSearchItem & { score: number }>, [query])

  const openResult = (item: AtlasSearchItem) => {
    if (item.targetSelector) {
      const target = document.querySelector<HTMLElement>(item.targetSelector)
      if (target instanceof HTMLButtonElement) target.click()
      const scrollTarget = target ?? document.querySelector<HTMLElement>(item.href)
      requestAnimationFrame(() => scrollTarget?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
      window.history.replaceState(null, '', item.href)
    } else {
      window.location.hash = item.href.replace(/^#/, '')
    }
    setQuery('')
    setActiveIndex(0)
    inputRef.current?.blur()
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      setQuery('')
      setActiveIndex(0)
      inputRef.current?.blur()
      return
    }
    if (!results.length) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) => (current + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => (current - 1 + results.length) % results.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      openResult(results[Math.min(activeIndex, results.length - 1)])
    }
  }

  return (
    <section className="atlas-search-shell" aria-label={language === 'vi' ? 'Tìm kiếm toàn bộ OpenEUV' : 'Search all OpenEUV'} data-atlas-search>
      <div className="atlas-search-box">
        <label htmlFor="atlas-search-input">{language === 'vi' ? 'Tìm trong atlas' : 'Search the atlas'}</label>
        <input
          ref={inputRef}
          id="atlas-search-input"
          type="search"
          autoComplete="off"
          spellCheck={false}
          value={query}
          aria-controls="atlas-search-results"
          aria-expanded={Boolean(query)}
          aria-activedescendant={results.length ? `atlas-search-result-${activeIndex}` : undefined}
          placeholder={language === 'vi' ? 'Ví dụ: High-NA, overlay, TSMC, EP4239410A1…' : 'Try High-NA, overlay, TSMC, EP4239410A1…'}
          onChange={(event) => { setQuery(event.target.value); setActiveIndex(0) }}
          onKeyDown={onKeyDown}
        />
        <span className="atlas-search-hint">↑↓ · Enter · Esc</span>
      </div>
      {query && <div id="atlas-search-results" className="atlas-search-results" role="listbox" aria-label={language === 'vi' ? 'Kết quả tìm kiếm' : 'Search results'}>
        {results.map((item, index) => <button
          key={item.id}
          id={`atlas-search-result-${index}`}
          type="button"
          role="option"
          aria-selected={index === activeIndex}
          className={index === activeIndex ? 'active' : ''}
          data-search-result={item.id}
          onMouseEnter={() => setActiveIndex(index)}
          onClick={() => openResult(item)}
        >
          <span className="atlas-search-type">{typeLabel[item.type][language]}</span>
          <strong>{language === 'vi' && item.titleVi ? item.titleVi : item.title}</strong>
          <small>{language === 'vi' && item.subtitleVi ? item.subtitleVi : item.subtitle}</small>
        </button>)}
        {results.length === 0 && <div className="atlas-search-empty">{language === 'vi' ? 'Chưa có mục phù hợp. Thử claim ID, subsystem, hãng hoặc thuật ngữ kỹ thuật.' : 'No matching item yet. Try a claim ID, subsystem, organization or technical term.'}</div>}
      </div>}
    </section>
  )
}
