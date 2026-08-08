import claims from '../../evidence/claims.json'
import { fabCases, type FabCaseKind } from '../data/fabCases'

const kindLabel: Record<FabCaseKind, string> = {
  foundry: 'Foundry integration',
  'research-fab': 'R&D / fab integration',
  'scanner-interface': 'Scanner interface',
  'mask-lifecycle': 'Mask lifecycle',
}

const claimById = new Map(claims.map((claim) => [claim.id, claim]))

export function FabCaseStudies() {
  return (
    <section className="research-section fab-cases" id="fab-cases">
      <div className="research-heading"><div><span className="eyebrow">Public integration case studies</span><h2>Where EUV meets the fab</h2><p>These cards separate scanner technology, foundry adoption and mask/source lifecycle concerns. Every hard fact is linked to the shared evidence dataset; private recipes, line layouts, yield details and internal control procedures stay explicitly unknown.</p></div><div className="case-count"><strong>{fabCases.length}</strong><span>evidence-bounded cases</span></div></div>
      <div className="case-grid">{fabCases.map((item) => {
        const linkedClaims = item.claimIds.map((id) => claimById.get(id)).filter(Boolean)
        return <article id={`fab-case-${item.id}`} key={item.id} className="fab-case" data-fab-case={item.id}>
          <div className="case-meta"><span>{kindLabel[item.kind]}</span><b>{item.organization}</b><em>{item.year}</em></div>
          <h3>{item.title}</h3>
          <p>{item.summary}</p>
          <div className="case-why"><strong>Why it matters</strong><p>{item.whyItMatters}</p></div>
          <div className="case-evidence"><strong>Evidence</strong>{linkedClaims.map((claim) => claim && <div key={claim.id}><span className={`claim-grade grade-${claim.class.toLowerCase()}`}>{claim.class}</span><code>{claim.id}</code>{claim.sources.slice(0, 1).map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.name} ↗</a>)}</div>)}</div>
          <div className="case-sources"><strong>Public sources</strong><div>{item.sourceUrls.map((url, index) => <a key={url} data-fab-source href={url} target="_blank" rel="noreferrer">Source {index + 1} ↗</a>)}</div></div>
          <div className="case-boundary"><strong>Public boundary</strong><p>{item.publicBoundary}</p></div>
          <details><summary>What remains unknown</summary><ul>{item.unknowns.map((unknown) => <li key={unknown}>{unknown}</li>)}</ul></details>
        </article>
      })}</div>
    </section>
  )
}
