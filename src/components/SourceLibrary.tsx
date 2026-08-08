import { useMemo, useState } from 'react'
import claims from '../../evidence/claims.json'
import { fabCases } from '../data/fabCases'
import { patents } from '../data/patents'
import type { Language } from '../i18n'
import { auditSourceLibrary, buildSourceLibrary, filterSourceLibrary } from '../lib/sourceLibrary.mjs'

type Usage = { type: 'evidence' | 'fab-case' | 'patent'; recordId: string; href: string; evidenceClass?: string }
type SourceRecord = {
  url: string
  validUrl: boolean
  domain: string
  labels: string[]
  organizations: string[]
  evidenceClasses: string[]
  usageTypes: Array<Usage['type']>
  usages: Usage[]
}

const sourceRecords = buildSourceLibrary({ claims, fabCases, patents }) as SourceRecord[]
const sourceAudit = auditSourceLibrary(sourceRecords) as { ok: boolean; errors: string[]; warnings: string[]; sources: number }
const domains = Array.from(new Set(sourceRecords.map((source) => source.domain))).sort()

const usageLabel: Record<Usage['type'], { en: string; vi: string }> = {
  evidence: { en: 'Evidence', vi: 'Evidence' },
  'fab-case': { en: 'Fab case', vi: 'Fab case' },
  patent: { en: 'Patent', vi: 'Patent' },
}

export function SourceLibrary({ language }: { language: Language }) {
  const [query, setQuery] = useState('')
  const [domain, setDomain] = useState('all')
  const [usageType, setUsageType] = useState('all')
  const [evidenceClass, setEvidenceClass] = useState('all')
  const vi = language === 'vi'
  const filtered = useMemo(() => filterSourceLibrary(sourceRecords, { query, domain, usageType, evidenceClass }) as SourceRecord[], [query, domain, usageType, evidenceClass])

  return (
    <section className="research-section source-library" id="source-library" data-source-library data-source-audit={sourceAudit.ok ? 'ok' : 'error'}>
      <div className="research-heading">
        <div>
          <span className="eyebrow">{vi ? 'Thư viện nguồn dẫn xuất' : 'Derived public source library'}</span>
          <h2>{vi ? 'Mỗi nguồn đang được dùng ở đâu?' : 'Where is each source used?'}</h2>
          <p>{vi
            ? 'Danh sách này được tạo trực tiếp từ claims, fab cases và patent metadata hiện có. Số lượng chỉ là bookkeeping, không phải xếp hạng chất lượng hay tầm quan trọng của nguồn.'
            : 'This library is derived directly from existing claims, fab cases and patent metadata. Counts are bookkeeping, not a ranking of source quality or importance.'}</p>
        </div>
        <div className="source-library-count"><strong>{filtered.length}</strong><span>{vi ? `/${sourceRecords.length} nguồn` : `/${sourceRecords.length} sources`}</span></div>
      </div>

      <div className="source-library-filters">
        <label><span>{vi ? 'Tìm nguồn' : 'Search sources'}</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={vi ? 'Tên hãng, domain, claim ID…' : 'Organization, domain, claim ID…'} data-source-search /></label>
        <label><span>Domain</span><select value={domain} onChange={(event) => setDomain(event.target.value)} data-source-domain><option value="all">{vi ? 'Tất cả' : 'All'}</option>{domains.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label><span>{vi ? 'Loại usage' : 'Usage type'}</span><select value={usageType} onChange={(event) => setUsageType(event.target.value)} data-source-usage><option value="all">{vi ? 'Tất cả' : 'All'}</option><option value="evidence">Evidence</option><option value="fab-case">Fab case</option><option value="patent">Patent</option></select></label>
        <label><span>Evidence class</span><select value={evidenceClass} onChange={(event) => setEvidenceClass(event.target.value)} data-source-class><option value="all">{vi ? 'Tất cả' : 'All'}</option>{['A', 'B', 'C', 'D', '?'].map((grade) => <option key={grade} value={grade}>Class {grade}</option>)}</select></label>
      </div>

      {sourceAudit.warnings.length > 0 && <details className="source-audit-note"><summary>{vi ? 'Citation naming warnings' : 'Citation naming warnings'} · {sourceAudit.warnings.length}</summary><ul>{sourceAudit.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></details>}

      <div className="source-library-grid">
        {filtered.map((source) => <article key={source.url} className="source-card" data-source-domain-card={source.domain}>
          <div className="source-card-meta"><span>{source.domain}</span><span>{source.usages.length} {vi ? 'usage' : 'usages'}</span></div>
          <h3>{source.labels[0] || source.domain}</h3>
          {source.labels.length > 1 && <small className="source-aliases">{vi ? 'Tên khác trong repo' : 'Other repository labels'}: {source.labels.slice(1).join(' · ')}</small>}
          <div className="source-organizations">{source.organizations.map((organization) => <span key={organization}>{organization}</span>)}</div>
          <div className="source-classes">{source.evidenceClasses.map((grade) => <span key={grade}>Class {grade}</span>)}</div>
          <a className="source-external" href={source.url} target="_blank" rel="noreferrer">{vi ? 'Mở nguồn công khai' : 'Open public source'} ↗</a>
          <div className="source-usages"><strong>{vi ? 'Được dùng trong OpenEUV' : 'Used in OpenEUV'}</strong>{source.usages.map((usage) => <a key={`${usage.type}:${usage.recordId}`} href={usage.href}><span>{usageLabel[usage.type][language]}</span><code>{usage.recordId}</code></a>)}</div>
        </article>)}
      </div>
      {filtered.length === 0 && <div className="empty-state">{vi ? 'Không có nguồn phù hợp với bộ lọc hiện tại.' : 'No source matches the current filters.'}</div>}
    </section>
  )
}
