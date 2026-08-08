import { sourceLinks } from '../data/subsystems'

const classes = [
  ['A', 'Official manufacturer / foundry', 'Use for first-party statements and product facts.'],
  ['B', 'Patent / standard', 'Use for disclosed architecture, mechanisms and terminology.'],
  ['C', 'Peer-reviewed / academic', 'Use for physics, modeling and independent validation.'],
  ['D', 'Inference', 'Must link its premises and display uncertainty.'],
  ['?', 'Unknown', 'An invitation to contribute evidence — never silently guessed.'],
]

export function EvidenceGraph() {
  return (
    <section className="panel evidence-panel" id="evidence">
      <div className="eyebrow">Evidence graph</div><h2>Every claim has provenance</h2>
      <div className="evidence-layout">
        <div className="evidence-classes">{classes.map(([grade, title, text]) => <div className="evidence-class" key={grade}><span>{grade}</span><div><strong>{title}</strong><p>{text}</p></div></div>)}</div>
        <div className="source-stack"><div className="graph-node primary">OpenEUV model</div><div className="graph-lines" />{sourceLinks.map((source) => <a className="graph-node" href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.label}</a>)}</div>
      </div>
    </section>
  )
}
