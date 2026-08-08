import { useMemo, useState } from 'react'
import literature from '../../evidence/literature.json'
import type { Language } from '../i18n'
import { literatureCoverage, literatureTopics } from '../lib/literatureMetadata.mjs'

type PublicationType = 'journal' | 'conference' | 'preprint'
type LiteratureRecord = {
  doi: string
  title: string
  year: number
  authors: string[]
  sourceName: string
  sourceUrl: string
  summary: string
  publicationType: PublicationType
  topics: string[]
  claimIds: string[]
  labIds: string[]
}

const records = literature as LiteratureRecord[]
const coverage = literatureCoverage(records)
const typeLabel: Record<PublicationType, { en: string; vi: string }> = {
  journal: { en: 'Journal', vi: 'Tạp chí' },
  conference: { en: 'Conference', vi: 'Hội nghị' },
  preprint: { en: 'Preprint', vi: 'Preprint' },
}

const topicLabel: Record<string, { en: string; vi: string }> = {
  source: { en: 'Source', vi: 'Nguồn EUV' }, optics: { en: 'Optics', vi: 'Quang học' }, multilayer: { en: 'Multilayer', vi: 'Đa lớp' },
  mask: { en: 'Mask', vi: 'Mask' }, metrology: { en: 'Metrology', vi: 'Đo lường' }, motion: { en: 'Motion', vi: 'Chuyển động' },
  fab: { en: 'Fab', vi: 'Fab' }, contamination: { en: 'Contamination', vi: 'Nhiễm bẩn' }, 'high-na': { en: 'High-NA', vi: 'High-NA' },
  imaging: { en: 'Imaging', vi: 'Tạo ảnh' }, resist: { en: 'Resist', vi: 'Resist' }, stochastics: { en: 'Stochastics', vi: 'Ngẫu nhiên' },
}

export function LiteratureExplorer({ language }: { language: Language }) {
  const [topic, setTopic] = useState('all')
  const [publicationType, setPublicationType] = useState<'all' | PublicationType>('all')
  const [query, setQuery] = useState('')
  const vi = language === 'vi'
  const populatedTopics = literatureTopics.filter((item: string) => coverage.byTopic[item] > 0)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return records.filter((record) => {
      if (topic !== 'all' && !record.topics.includes(topic)) return false
      if (publicationType !== 'all' && record.publicationType !== publicationType) return false
      if (!q) return true
      return [record.doi, record.title, record.sourceName, record.summary, ...record.authors, ...record.topics, ...record.claimIds, ...record.labIds].join(' ').toLowerCase().includes(q)
    })
  }, [topic, publicationType, query])

  return (
    <section className="research-section literature-explorer" id="literature" data-literature-explorer>
      <div className="research-heading">
        <div>
          <span className="eyebrow">{vi ? 'Lớp nghiên cứu học thuật đã curate' : 'Curated academic research layer'}</span>
          <h2>{vi ? 'Literature Explorer' : 'Literature Explorer'}</h2>
          <p>{vi
            ? 'Registry chỉ lưu metadata và tóm tắt gốc của OpenEUV, không chép toàn văn paper. Preprint/conference/journal được ghi rõ và không được xem là bằng chứng cho production system nếu chưa có nguồn phù hợp.'
            : 'The registry stores metadata and original OpenEUV summaries only, never full papers. Preprints, conference papers and journal articles remain explicitly labeled and are not treated as production-system proof.'}</p>
        </div>
        <div className="literature-count"><strong>{filtered.length}</strong><span>/{records.length} {vi ? 'paper' : 'papers'}</span></div>
      </div>

      <div className="literature-filters">
        <label><span>{vi ? 'Tìm paper' : 'Search papers'}</span><input data-literature-search type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={vi ? 'DOI, tác giả, topic, claim…' : 'DOI, author, topic, claim…'} /></label>
        <label><span>Topic</span><select data-literature-topic value={topic} onChange={(event) => setTopic(event.target.value)}><option value="all">{vi ? 'Tất cả topic' : 'All topics'}</option>{populatedTopics.map((item: string) => <option key={item} value={item}>{topicLabel[item]?.[language] ?? item} ({coverage.byTopic[item]})</option>)}</select></label>
        <label><span>{vi ? 'Loại publication' : 'Publication type'}</span><select data-literature-type value={publicationType} onChange={(event) => setPublicationType(event.target.value as 'all' | PublicationType)}><option value="all">{vi ? 'Tất cả' : 'All'}</option>{(['journal', 'conference', 'preprint'] as PublicationType[]).map((item) => <option key={item} value={item}>{typeLabel[item][language]}</option>)}</select></label>
      </div>

      <div className="literature-grid">
        {filtered.map((record) => <article id={`literature-${record.doi.replace(/[^a-z0-9]+/gi, '-')}`} key={record.doi} className="literature-card" data-literature-doi={record.doi}>
          <div className="literature-meta"><span>{typeLabel[record.publicationType][language]}</span><span>{record.year}</span><code>{record.doi}</code></div>
          <h3>{record.title}</h3>
          <p className="literature-authors">{record.authors.join(' · ')}</p>
          <p>{record.summary}</p>
          <div className="literature-topics">{record.topics.map((item) => <button type="button" key={item} onClick={() => setTopic(item)}>{topicLabel[item]?.[language] ?? item}</button>)}</div>
          <div className="literature-links">
            <a href={record.sourceUrl} target="_blank" rel="noreferrer">{record.sourceName} ↗</a>
            <a href={`https://doi.org/${record.doi}`} target="_blank" rel="noreferrer">DOI ↗</a>
          </div>
          {(record.claimIds.length > 0 || record.labIds.length > 0) && <div className="literature-mappings">
            {record.claimIds.map((claimId) => <a key={claimId} href={`#evidence-${claimId}`}><span>{vi ? 'Claim' : 'Claim'}</span><code>{claimId}</code></a>)}
            {record.labIds.map((labId) => <a key={labId} href={`#${labId}`}><span>{vi ? 'Lab' : 'Lab'}</span><code>{labId}</code></a>)}
          </div>}
        </article>)}
      </div>
      {filtered.length === 0 && <div className="empty-state">{vi ? 'Không có literature record phù hợp với bộ lọc.' : 'No literature record matches the current filters.'}</div>}
    </section>
  )
}
