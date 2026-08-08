import { useMemo, useState } from 'react'
import claims from '../../evidence/claims.json'
import dataGap from '../../evidence/optical-data-gaps.json'
import reviewRegistry from '../../evidence/reviews.json'
import unknowns from '../../evidence/unknowns.json'
import manifest from '../../datasets/manifest.json'
import { fabCases } from '../data/fabCases'
import { patents } from '../data/patents'
import type { Language } from '../i18n'
import { summarizeEvidenceReviewReadiness } from '../lib/evidenceReviewReadiness.mjs'
import { auditPatentRecords } from '../lib/patentAudit.mjs'
import { summarizeProvenance } from '../lib/provenanceReport.mjs'
import { buildResearchSnapshot, serializeResearchSnapshot } from '../lib/researchSnapshot.mjs'

const patentAudit = auditPatentRecords(patents)
const provenanceCoverage = summarizeProvenance({
  claims,
  unknowns,
  reviews: reviewRegistry,
  patents,
  patentAudit,
  fabCases,
  dataGaps: [dataGap],
})
const reviewCoverage = summarizeEvidenceReviewReadiness({ claims, unknowns, registry: reviewRegistry, minimumReviewedRecords: 10 })

function snapshotText() {
  const snapshot = buildResearchSnapshot({
    generatedAt: new Date().toISOString(),
    claims,
    unknowns,
    fabCases,
    manifest,
    reviewCoverage,
    provenanceCoverage,
  })
  return serializeResearchSnapshot(snapshot)
}

export function ResearchStatusPanel({ language }: { language: Language }) {
  const [message, setMessage] = useState('')
  const classEntries = useMemo(() => Object.entries(provenanceCoverage.evidence.byClass).sort(), [])
  const reviewEntries = useMemo(() => Object.entries(provenanceCoverage.evidence.byReviewState), [])
  const vi = language === 'vi'

  const copySnapshot = async () => {
    try {
      await navigator.clipboard.writeText(snapshotText())
      setMessage(vi ? 'Đã copy snapshot JSON vào clipboard.' : 'Research snapshot JSON copied to clipboard.')
    } catch {
      setMessage(vi ? 'Clipboard không khả dụng; dùng nút tải JSON.' : 'Clipboard unavailable; use the JSON download button.')
    }
  }

  const downloadSnapshot = () => {
    const text = snapshotText()
    const blob = new Blob([text], { type: 'application/json;charset=utf-8' })
    const href = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = href
    anchor.download = `openeuv-research-snapshot-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(href)
    setMessage(vi ? 'Đã tạo snapshot cục bộ; không có dữ liệu nào được upload.' : 'Local snapshot created; no data was uploaded.')
  }

  return (
    <section className="research-section research-status-panel" id="provenance-overview" data-provenance-overview>
      <div className="research-heading">
        <div>
          <span className="eyebrow">{vi ? 'Tình trạng nguồn & research snapshot' : 'Sourcing status & research snapshot'}</span>
          <h2>{vi ? 'Provenance coverage có thể kiểm tra' : 'Inspectable provenance coverage'}</h2>
          <p>{vi
            ? 'Các con số dưới đây là bookkeeping cho nguồn, review và research gap — không phải xếp hạng tầm quan trọng thương mại/khoa học. Snapshot chỉ gom metadata công khai đang có trong repository.'
            : 'These counts are sourcing/review bookkeeping, not a ranking of commercial or scientific importance. The snapshot bundles only public repository metadata.'}</p>
        </div>
        <div className="snapshot-actions" aria-label={vi ? 'Xuất research snapshot' : 'Export research snapshot'}>
          <button type="button" onClick={copySnapshot} data-copy-research-snapshot>{vi ? 'Copy JSON' : 'Copy JSON'}</button>
          <button type="button" onClick={downloadSnapshot} data-download-research-snapshot>{vi ? 'Tải JSON' : 'Download JSON'}</button>
        </div>
      </div>

      <div className="provenance-overview-grid">
        <article>
          <span>{vi ? 'Evidence class' : 'Evidence classes'}</span>
          <strong>{provenanceCoverage.evidence.claims}</strong>
          <div className="coverage-chips">{classEntries.map(([grade, count]) => <a key={grade} href="#unknowns">Class {grade}: {count}</a>)}</div>
        </article>
        <article>
          <span>{vi ? 'Review state' : 'Review states'}</span>
          <strong>{reviewCoverage.reviewedRecords}/{reviewCoverage.minimumReviewedRecords}</strong>
          <div className="coverage-chips">{reviewEntries.map(([state, count]) => <a key={state} href="#unknowns">{state}: {count}</a>)}</div>
        </article>
        <article>
          <span>{vi ? 'Open unknowns' : 'Open unknowns'}</span>
          <strong>{provenanceCoverage.evidence.openUnknownIds.length}</strong>
          <a href="#unknowns">{vi ? 'Mở Evidence Dashboard' : 'Open Evidence Dashboard'} →</a>
        </article>
        <article>
          <span>{vi ? 'Patent metadata' : 'Patent metadata'}</span>
          <strong>{(provenanceCoverage.patents.averageMetadataCompleteness * 100).toFixed(0)}%</strong>
          <a href="#patents">{provenanceCoverage.patents.records} {vi ? 'record đã curate' : 'curated records'} →</a>
        </article>
        <article>
          <span>{vi ? 'Fab source coverage' : 'Fab source coverage'}</span>
          <strong>{provenanceCoverage.fab.casesWithDirectSources}/{provenanceCoverage.fab.cases}</strong>
          <a href="#fab-cases">{vi ? 'Xem public boundaries' : 'View public boundaries'} →</a>
        </article>
        <article>
          <span>{vi ? 'Data/license gap' : 'Data/license gaps'}</span>
          <strong>{provenanceCoverage.dataLicenseGaps.length}</strong>
          <div className="data-gap-list">{provenanceCoverage.dataLicenseGaps.length
            ? provenanceCoverage.dataLicenseGaps.map((gap) => <small key={`${gap.material}:${gap.source}`}>{gap.material} @ {gap.wavelengthNm ?? '?'} nm · {gap.license}</small>)
            : <small>{vi ? 'Không có gap nào được ghi nhận.' : 'No recorded gaps.'}</small>}</div>
        </article>
      </div>

      <p className="snapshot-privacy">{vi
        ? 'Export chạy hoàn toàn trong trình duyệt: không gửi query, browser history, localStorage, IP, username hay hardware identifier.'
        : 'Export runs entirely in your browser: no queries, browser history, localStorage, IP, username or hardware identifiers are sent or included.'}</p>
      <div className="sr-status" role="status" aria-live="polite" data-snapshot-status>{message}</div>
    </section>
  )
}
