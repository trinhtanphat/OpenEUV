import claims from '../../evidence/claims.json'
import reviewRegistry from '../../evidence/reviews.json'
import unknowns from '../../evidence/unknowns.json'
import { assetNodeEvidence, assetNodeGeometryStatus, subsystemAssetNodes } from '../data/componentEvidence'
import { t, type Language } from '../i18n'

const classLabel: Record<Language, Record<string, string>> = {
  en: { A: 'Official', B: 'Patent', C: 'Academic', D: 'Inference', '?': 'Unknown' },
  vi: { A: 'Nguồn chính thức', B: 'Patent', C: 'Học thuật', D: 'Suy luận công khai', '?': 'Chưa biết' },
}

type ReviewRecord = {
  id: string
  state: 'proposed' | 'reviewed' | 'superseded'
  contributors?: string[]
  reviewers?: string[]
  supersededBy?: string
  note?: string
}

const reviews = reviewRegistry.reviews as ReviewRecord[]
const reviewById = new Map(reviews.map((review) => [review.id, review]))

export function EvidenceInspector({ subsystemId, nodeName, onNodeSelect, language }: { subsystemId: string; nodeName?: string | null; onNodeSelect?: (nodeName: string | null) => void; language: Language }) {
  const nodeClaimIds = nodeName ? assetNodeEvidence[nodeName] ?? [] : []
  const relevantClaims = nodeClaimIds.length
    ? claims.filter((claim) => nodeClaimIds.includes(claim.id))
    : claims.filter((claim) => claim.component === subsystemId)
  const relevantUnknowns = unknowns.filter((unknown) => unknown.component === subsystemId || unknown.relatedClaimIds.some((id) => nodeClaimIds.includes(id)))
  const visibleClaims = relevantClaims.slice(0, 4)
  const visibleUnknowns = relevantUnknowns.slice(0, 2)
  const availableNodes = subsystemAssetNodes(subsystemId)

  return (
    <section className="evidence-inspector" data-evidence-inspector data-subsystem={subsystemId} data-node={nodeName ?? ''} data-language={language}>
      <div className="inspector-head"><div><span className="eyebrow">{t(language, 'evidenceContext')}</span><h4>{nodeName ?? (language === 'vi' ? `Subsystem: ${subsystemId}` : `${subsystemId} subsystem`)}</h4></div>{nodeName && <span className="geometry-status">{assetNodeGeometryStatus[nodeName] ?? 'illustrative-geometry'}</span>}</div>
      {availableNodes.length > 0 && <div className="concept-node-nav" aria-label={language === 'vi' ? 'Các node của concept asset' : 'Concept asset nodes'}><button className={!nodeName ? 'active' : ''} onClick={() => onNodeSelect?.(null)}>{language === 'vi' ? 'Toàn subsystem' : 'Subsystem'}</button>{availableNodes.map((name) => <button key={name} data-evidence-node={name} className={nodeName === name ? 'active' : ''} onClick={() => onNodeSelect?.(name)}>{name}</button>)}</div>}
      {nodeName && <p className="inspector-note">{t(language, 'evidenceNodeNote')}</p>}
      <div className="inspector-claims">
        {visibleClaims.map((claim) => {
          const review = reviewById.get(claim.id)
          const reviewState = review?.state ?? 'unreviewed'
          return <article key={claim.id} data-evidence-id={claim.id} data-review-state={reviewState}><div><span className={`claim-grade grade-${claim.class.toLowerCase()}`}>{claim.class}</span><code>{claim.id}</code><small>{classLabel[language][claim.class]}</small><span className={`review-state ${reviewState}`}>{reviewState}</span></div><p>{claim.claim}</p><div className="inspector-sources">{claim.sources.slice(0, 2).map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.name} ↗</a>)}</div>{review && <div className="review-attribution">{review.contributors?.length ? <span>{language === 'vi' ? 'đóng góp' : 'contributors'}: {review.contributors.join(', ')}</span> : null}{review.reviewers?.length ? <span>{language === 'vi' ? 'review' : 'reviewers'}: {review.reviewers.join(', ')}</span> : null}{review.supersededBy ? <span>{language === 'vi' ? 'được thay bởi' : 'superseded by'} {review.supersededBy}</span> : null}</div>}</article>
        })}
        {visibleClaims.length === 0 && <p className="inspector-empty">{t(language, 'evidenceNoDirect')}</p>}
      </div>
      {visibleUnknowns.length > 0 && <div className="inspector-unknowns"><strong>{t(language, 'evidenceOpenQuestions')}</strong>{visibleUnknowns.map((unknown) => {
        const review = reviewById.get(unknown.id)
        const reviewState = review?.state ?? 'unreviewed'
        return <p key={unknown.id} data-evidence-id={unknown.id} data-review-state={reviewState}><code>{unknown.id}</code> {unknown.question} <span className={`review-state ${reviewState}`}>{reviewState}</span></p>
      })}</div>}
    </section>
  )
}
