import { useMemo, useState } from 'react'
import { patentCoverage, patents, patentFamilies, patentSubsystems, type PatentSubsystem } from '../data/patents'

export function PatentExplorer() {
  const [filter, setFilter] = useState<'all' | PatentSubsystem>('all')
  const filtered = useMemo(() => patents.filter((patent) => filter === 'all' || patent.linkedSubsystems.includes(filter)), [filter])
  const visibleFamilies = useMemo(() => patentFamilies.filter((family) => filter === 'all' || family.subsystems.includes(filter)), [filter])
  const maxCoverage = Math.max(1, ...patentCoverage.map((item) => item.count))

  return (
    <section className="research-section" id="patents">
      <div className="research-heading"><div><span className="eyebrow">Public patent-family map</span><h2>Patent Explorer</h2><p>Patents are evidence of disclosed concepts, not proof that a drawing equals the exact production machine. The graph below groups public disclosures by family and connects them to OpenEUV subsystem IDs.</p></div><div className="patent-count"><strong>{patents.length}</strong><span>seed disclosures · {patentFamilies.length} families</span></div></div>
      <div className="patent-coverage" aria-label="Patent coverage by subsystem">{patentCoverage.map((item) => <button key={item.id} data-coverage-subsystem={item.id} onClick={() => setFilter(item.id)} className={filter === item.id ? 'active' : ''}><span>{item.label}</span><b>{item.count}</b><i aria-hidden="true"><em style={{ width: `${Math.max(8, (item.count / maxCoverage) * 100)}%` }} /></i></button>)}</div>
      <div className="coverage-note">Coverage shows how many curated seed publications currently link to each subsystem. A low count means “research gap”, not “few patents exist”. Import tooling: <code>node tools/patent-metadata-normalize.mjs input.json output.json</code>.</div>
      <div className="filter-row">{patentSubsystems.map((item) => <button data-patent-filter={item.id} className={filter === item.id ? 'active' : ''} key={item.id} onClick={() => setFilter(item.id)}>{item.label}</button>)}</div>
      <div className="family-map" aria-label="Patent family graph">{visibleFamilies.map((family) => <article key={family.id} className="family-node"><div className="family-date">priority<br/><strong>{family.priorityDate}</strong></div><div className="family-body"><span className="family-id">{family.id}</span><h3>{family.label}</h3><div className="family-members">{family.members.map((member) => <code key={member}>{member}</code>)}</div></div><div className="family-links">{family.subsystems.map((subsystem) => <span key={subsystem}>{subsystem}</span>)}</div></article>)}</div>
      <div className="patent-grid">{filtered.map((patent) => <article key={patent.id} className="patent-card"><div className="patent-meta"><span>priority {patent.priorityDate}</span><span>published {patent.publicationDate}</span><span>{patent.subsystem}</span><span>Class B</span></div><h3>{patent.id}</h3><strong>{patent.title}</strong><p>{patent.summary}</p><small>{patent.assignee}{patent.applicationNumber ? ` · ${patent.applicationNumber}` : ''}</small><div className="patent-subsystems">{patent.linkedSubsystems.map((subsystem) => <span key={subsystem}>{subsystem}</span>)}</div><a href={patent.url} target="_blank" rel="noreferrer">Open public patent ↗</a></article>)}</div>
      {filtered.length === 0 && <div className="empty-state">No seed disclosure is mapped to this subsystem yet. This is an explicit contributor gap, not evidence that no relevant patents exist.</div>}
    </section>
  )
}
