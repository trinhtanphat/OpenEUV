import { useMemo, useState } from 'react'
import { patents, patentSubsystems, type PatentSubsystem } from '../data/patents'

export function PatentExplorer() {
  const [filter, setFilter] = useState<'all' | PatentSubsystem>('all')
  const filtered = useMemo(() => patents.filter((patent) => filter === 'all' || patent.subsystem === filter), [filter])

  return (
    <section className="research-section" id="patents">
      <div className="research-heading"><div><span className="eyebrow">Public patent map</span><h2>Patent Explorer</h2><p>Use patents as evidence, not as a claim that a drawing equals the exact production machine. OpenEUV links disclosures to subsystem concepts and keeps proprietary geometry unknown.</p></div><div className="patent-count"><strong>{patents.length}</strong><span>seed disclosures</span></div></div>
      <div className="filter-row">{patentSubsystems.map((item) => <button className={filter === item.id ? 'active' : ''} key={item.id} onClick={() => setFilter(item.id)}>{item.label}</button>)}</div>
      <div className="patent-grid">{filtered.map((patent) => <article key={patent.id} className="patent-card"><div className="patent-meta"><span>{patent.publicationYear}</span><span>{patent.subsystem}</span><span>Class B</span></div><h3>{patent.id}</h3><strong>{patent.title}</strong><p>{patent.summary}</p><small>{patent.assignee}</small><a href={patent.url} target="_blank" rel="noreferrer">Open public patent ↗</a></article>)}</div>
    </section>
  )
}
