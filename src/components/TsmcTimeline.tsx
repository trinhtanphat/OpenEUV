import { tsmcTimeline } from '../data/tsmcTimeline'

export function TsmcTimeline() {
  return (
    <section className="research-section" id="fab-timeline">
      <div className="research-heading"><div><span className="eyebrow">Foundry integration</span><h2>TSMC EUV public timeline</h2><p>TSMC is a user and process integrator of EUV lithography systems, not the manufacturer of the scanner. This timeline only includes first-party public milestones.</p></div><span className="evidence-pill official">TSMC · Class A</span></div>
      <div className="timeline">{tsmcTimeline.map((item) => <article key={`${item.year}-${item.title}`}><div className="timeline-year">{item.year}</div><div className="timeline-dot" /><div className="timeline-copy"><h3>{item.title}</h3><p>{item.detail}</p><a href={item.sourceUrl} target="_blank" rel="noreferrer">{item.sourceLabel} ↗</a></div></article>)}</div>
    </section>
  )
}
