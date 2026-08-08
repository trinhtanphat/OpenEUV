import claims from '../../evidence/claims.json'
import unknowns from '../../evidence/unknowns.json'

const classNames: Record<string, string> = { A: 'Official', B: 'Patent', C: 'Academic', D: 'Inference', '?': 'Unknown' }

export function EvidenceDashboard() {
  const counts = claims.reduce<Record<string, number>>((accumulator, claim) => {
    accumulator[claim.class] = (accumulator[claim.class] ?? 0) + 1
    return accumulator
  }, {})

  return (
    <section className="research-section" id="unknowns">
      <div className="research-heading"><div><span className="eyebrow">Machine-readable research map</span><h2>Evidence & Open Unknowns</h2><p>Claims are validated by CI. Unknowns are first-class research objects, so contributors can improve confidence without pretending missing proprietary details are known.</p></div><div className="evidence-summary">{['A','B','C','D','?'].map((grade) => <span key={grade}><b>{counts[grade] ?? 0}</b>{classNames[grade]}</span>)}</div></div>
      <div className="evidence-dashboard"><div className="claim-list"><h3>Validated claims</h3>{claims.map((claim) => <article key={claim.id}><div><span className={`claim-grade grade-${claim.class === '?' ? 'unknown' : claim.class.toLowerCase()}`}>{claim.class}</span><code>{claim.id}</code></div><p>{claim.claim}</p><small>{claim.component} · confidence {Math.round(claim.confidence * 100)}%</small></article>)}</div><div className="unknown-list"><h3>Open research questions</h3>{unknowns.map((unknown) => <article key={unknown.id}><div><span className={`priority ${unknown.priority}`}>{unknown.priority}</span><code>{unknown.id}</code></div><p>{unknown.question}</p><small>{unknown.component} · {unknown.status}</small></article>)}</div></div>
    </section>
  )
}
