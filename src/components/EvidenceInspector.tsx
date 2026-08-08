import claims from '../../evidence/claims.json'
import unknowns from '../../evidence/unknowns.json'
import { assetNodeEvidence, assetNodeGeometryStatus } from '../data/componentEvidence'

const classLabel: Record<string, string> = { A: 'Official', B: 'Patent', C: 'Academic', D: 'Inference', '?': 'Unknown' }

export function EvidenceInspector({ subsystemId, nodeName }: { subsystemId: string; nodeName?: string | null }) {
  const nodeClaimIds = nodeName ? assetNodeEvidence[nodeName] ?? [] : []
  const relevantClaims = nodeClaimIds.length
    ? claims.filter((claim) => nodeClaimIds.includes(claim.id))
    : claims.filter((claim) => claim.component === subsystemId)
  const relevantUnknowns = unknowns.filter((unknown) => unknown.component === subsystemId || unknown.relatedClaimIds.some((id) => nodeClaimIds.includes(id)))
  const visibleClaims = relevantClaims.slice(0, 4)
  const visibleUnknowns = relevantUnknowns.slice(0, 2)

  return (
    <section className="evidence-inspector" data-evidence-inspector data-subsystem={subsystemId} data-node={nodeName ?? ''}>
      <div className="inspector-head"><div><span className="eyebrow">Contextual evidence</span><h4>{nodeName ?? `${subsystemId} subsystem`}</h4></div>{nodeName && <span className="geometry-status">{assetNodeGeometryStatus[nodeName] ?? 'illustrative-geometry'}</span>}</div>
      {nodeName && <p className="inspector-note">This node name identifies an OpenEUV concept-asset group. The linked evidence supports functions/concepts, not the exact illustrated geometry.</p>}
      <div className="inspector-claims">
        {visibleClaims.map((claim) => <article key={claim.id}><div><span className={`claim-grade grade-${claim.class.toLowerCase()}`}>{claim.class}</span><code>{claim.id}</code><small>{classLabel[claim.class]}</small></div><p>{claim.claim}</p><div className="inspector-sources">{claim.sources.slice(0, 2).map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.name} ↗</a>)}</div></article>)}
        {visibleClaims.length === 0 && <p className="inspector-empty">No direct validated claim is mapped yet. Treat this as a contributor gap, not proof that the component is undocumented.</p>}
      </div>
      {visibleUnknowns.length > 0 && <div className="inspector-unknowns"><strong>Open questions</strong>{visibleUnknowns.map((unknown) => <p key={unknown.id}><code>{unknown.id}</code> {unknown.question}</p>)}</div>}
    </section>
  )
}
