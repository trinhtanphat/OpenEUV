import claims from '../../evidence/claims.json'
import conceptLabels from '../../evidence/concept-labels.json'
import conceptLabelsV4 from '../../evidence/concept-labels-v4.json'
import reviewRegistry from '../../evidence/reviews.json'
import unknowns from '../../evidence/unknowns.json'
import { assemblyStages } from '../data/assemblyStages'
import { fabCases } from '../data/fabCases'
import { buildEvidenceUsageIndex } from '../lib/evidenceUsage.mjs'

const classNames: Record<string, string> = { A: 'Official', B: 'Patent', C: 'Academic', D: 'Inference', '?': 'Unknown' }

type ReviewRecord = {
  id: string
  state: 'proposed' | 'reviewed' | 'superseded'
  contributors?: string[]
  reviewers?: string[]
  supersededBy?: string
  note?: string
}

type EvidenceUsage = {
  type: 'concept-node' | 'assembly-stage' | 'fab-case'
  id: string
  label: string
  href: string
}

const reviews = reviewRegistry.reviews as ReviewRecord[]
const reviewById = new Map(reviews.map((review) => [review.id, review]))
const usageByClaim = buildEvidenceUsageIndex({
  claims,
  conceptLabels: [...conceptLabels, ...conceptLabelsV4],
  assemblyStages,
  fabCases,
}) as Record<string, EvidenceUsage[]>

const usageTypeLabel: Record<EvidenceUsage['type'], string> = {
  'concept-node': '3D node',
  'assembly-stage': 'Assembly stage',
  'fab-case': 'Fab case',
}

export function EvidenceDashboard() {
  const counts = claims.reduce<Record<string, number>>((accumulator, claim) => {
    accumulator[claim.class] = (accumulator[claim.class] ?? 0) + 1
    return accumulator
  }, {})
  const reviewCounts = reviews.reduce<Record<string, number>>((accumulator, review) => {
    accumulator[review.state] = (accumulator[review.state] ?? 0) + 1
    return accumulator
  }, {})
  const reviewedOrTracked = reviews.length
  const unreviewed = Math.max(0, claims.length + unknowns.length - reviewedOrTracked)

  return (
    <section className="research-section" id="unknowns">
      <div className="research-heading">
        <div>
          <span className="eyebrow">Machine-readable research map</span>
          <h2>Evidence, review state & open unknowns</h2>
          <p>Claims and unknowns remain first-class research objects. Run <code>npm run validate:evidence</code> locally before proposing evidence changes; GitHub Actions is intentionally disabled.</p>
          <div className="review-coverage" data-review-coverage>
            <span>reviewed {reviewCounts.reviewed ?? 0}</span>
            <span>proposed {reviewCounts.proposed ?? 0}</span>
            <span>superseded {reviewCounts.superseded ?? 0}</span>
            <span>unreviewed {unreviewed}</span>
          </div>
        </div>
        <div className="evidence-summary">{['A','B','C','D','?'].map((grade) => <span key={grade}><b>{counts[grade] ?? 0}</b>{classNames[grade]}</span>)}</div>
      </div>
      <div className="evidence-dashboard">
        <div className="claim-list">
          <h3>Evidence claims</h3>
          {claims.map((claim) => {
            const review = reviewById.get(claim.id)
            const reviewState = review?.state ?? 'unreviewed'
            const usages = usageByClaim[claim.id] ?? []
            return <article id={`evidence-${claim.id}`} key={claim.id} data-evidence-id={claim.id} data-review-state={reviewState} data-usage-count={usages.length}>
              <div><span className={`claim-grade grade-${claim.class === '?' ? 'unknown' : claim.class.toLowerCase()}`}>{claim.class}</span><code>{claim.id}</code><span className={`review-state ${reviewState}`}>{reviewState}</span></div>
              <p>{claim.claim}</p>
              <small>{claim.component} · confidence {Math.round(claim.confidence * 100)}%</small>
              {review && <div className="review-attribution">{review.contributors?.length ? <span>contributors: {review.contributors.join(', ')}</span> : null}{review.reviewers?.length ? <span>reviewers: {review.reviewers.join(', ')}</span> : null}{review.supersededBy ? <span>superseded by {review.supersededBy}</span> : null}</div>}
              <details className="provenance-trace" data-provenance-trace>
                <summary>Provenance trace · {usages.length} mapped usage{usages.length === 1 ? '' : 's'}</summary>
                <div className="provenance-trace-body">
                  <div>
                    <strong>Public sources</strong>
                    <ul>{claim.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.name} ↗</a></li>)}</ul>
                  </div>
                  <div>
                    <strong>Used in OpenEUV</strong>
                    {usages.length > 0
                      ? <ul>{usages.map((usage) => <li key={`${usage.type}:${usage.id}`}><a data-provenance-usage={usage.type} href={usage.href}><span>{usageTypeLabel[usage.type]}</span> · {usage.label}</a></li>)}</ul>
                      : <p className="provenance-gap">No mapped atlas usage yet. This remains an explicit provenance gap.</p>}
                  </div>
                </div>
              </details>
            </article>
          })}
        </div>
        <div className="unknown-list">
          <h3>Open research questions</h3>
          {unknowns.map((unknown) => {
            const review = reviewById.get(unknown.id)
            const reviewState = review?.state ?? 'unreviewed'
            return <article id={`evidence-${unknown.id}`} key={unknown.id} data-evidence-id={unknown.id} data-review-state={reviewState}><div><span className={`priority ${unknown.priority}`}>{unknown.priority}</span><code>{unknown.id}</code><span className={`review-state ${reviewState}`}>{reviewState}</span></div><p>{unknown.question}</p><small>{unknown.component} · {unknown.status}</small>{review && <div className="review-attribution">{review.contributors?.length ? <span>contributors: {review.contributors.join(', ')}</span> : null}{review.reviewers?.length ? <span>reviewers: {review.reviewers.join(', ')}</span> : null}</div>}</article>
          })}
        </div>
      </div>
    </section>
  )
}
