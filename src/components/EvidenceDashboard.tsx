import claims from '../../evidence/claims.json'
import reviewRegistry from '../../evidence/reviews.json'
import unknowns from '../../evidence/unknowns.json'

const classNames: Record<string, string> = { A: 'Official', B: 'Patent', C: 'Academic', D: 'Inference', '?': 'Unknown' }

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
            return <article id={`evidence-${claim.id}`} key={claim.id} data-evidence-id={claim.id} data-review-state={reviewState}><div><span className={`claim-grade grade-${claim.class === '?' ? 'unknown' : claim.class.toLowerCase()}`}>{claim.class}</span><code>{claim.id}</code><span className={`review-state ${reviewState}`}>{reviewState}</span></div><p>{claim.claim}</p><small>{claim.component} · confidence {Math.round(claim.confidence * 100)}%</small>{review && <div className="review-attribution">{review.contributors?.length ? <span>contributors: {review.contributors.join(', ')}</span> : null}{review.reviewers?.length ? <span>reviewers: {review.reviewers.join(', ')}</span> : null}{review.supersededBy ? <span>superseded by {review.supersededBy}</span> : null}</div>}</article>
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
