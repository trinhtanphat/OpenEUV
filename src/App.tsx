import { useMemo, useState } from 'react'
import { BuildMachine } from './components/BuildMachine'
import { EvidenceGraph } from './components/EvidenceGraph'
import { ResolutionSimulator } from './components/ResolutionSimulator'
import { ScannerScene } from './components/ScannerScene'
import { subsystems } from './data/subsystems'

const confidenceLabel = { official: 'Officially documented', patent: 'Patent-supported', academic: 'Academic', inferred: 'Public-source inference', unknown: 'Unknown' }

export default function App() {
  const [selectedId, setSelectedId] = useState('projection')
  const [exploded, setExploded] = useState(0.18)
  const selected = useMemo(() => subsystems.find((item) => item.id === selectedId) ?? subsystems[0], [selectedId])

  return (
    <main>
      <header className="topbar"><a className="brand" href="#top"><span className="brand-mark">OE</span><span>OpenEUV <small>Atlas</small></span></a><nav><a href="#explorer">Explorer</a><a href="#simulator">Simulate</a><a href="#evidence">Evidence</a><a href="#contribute">Contribute</a></nav><a className="github-button" href="https://github.com/trinhtanphat/OpenEUV" target="_blank" rel="noreferrer">GitHub</a></header>
      <section className="hero" id="top">
        <div className="hero-copy"><div className="kicker">✦ Open-source EUV engineering atlas</div><h1>Explore one of humanity's most complex machines.</h1><p>Reconstruct EUV lithography from public evidence — in 3D. Learn the physics, map the patents, test simplified models, and turn every unknown into a contributor mission.</p><div className="hero-actions"><a className="primary-button" href="#explorer">◎ Explore scanner</a><a className="secondary-button" href="#contribute">▦ Find a mission</a></div><div className="hero-stats"><div><strong>13.5 nm</strong><span>EUV wavelength</span></div><div><strong>0.55 NA</strong><span>High-NA generation</span></div><div><strong>40,000+</strong><span>High-NA projection parts reported by ZEISS</span></div></div></div>
        <div className="hero-orbit" aria-hidden="true"><div className="orbital-ring"><span /></div><div className="wafer-disc"><b>13.5</b><small>nm</small></div></div>
      </section>
      <section className="explorer" id="explorer">
        <div className="section-heading"><div><div className="eyebrow">Interactive digital twin</div><h2>Exploded EUV scanner</h2></div><div className="exploded-control"><span>Assembled</span><input aria-label="Exploded view" type="range" min="0" max="1" step="0.01" value={exploded} onChange={(e) => setExploded(Number(e.target.value))} /><span>Exploded</span></div></div>
        <div className="explorer-grid"><ScannerScene selected={selected} exploded={exploded} onSelect={setSelectedId} /><aside className="subsystem-panel"><div className="subsystem-nav">{subsystems.map((item) => <button key={item.id} onClick={() => setSelectedId(item.id)} className={item.id === selected.id ? 'active' : ''}><span>{item.short}</span>{item.title}</button>)}</div><div className="subsystem-detail"><div className={`confidence ${selected.confidence}`}>{confidenceLabel[selected.confidence]}</div><h3>{selected.title}</h3><div className="subtitle">{selected.subtitle}</div><p>{selected.description}</p><h4>What we know</h4><ul>{selected.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul><h4>Open contributor questions</h4><ul className="questions">{selected.openQuestions.map((question) => <li key={question}>{question}</li>)}</ul></div></aside></div>
      </section>
      <section className="feature-strip"><div><span className="feature-icon">◫</span><strong>3D Atlas</strong><span>Click every subsystem</span></div><div><span className="feature-icon">λ</span><strong>Physics labs</strong><span>Learn by changing parameters</span></div><div><span className="feature-icon">⌘</span><strong>Evidence graph</strong><span>Trace claims to sources</span></div><div><span className="feature-icon">≡</span><strong>Research ladder</strong><span>Basics → High-NA</span></div></section>
      <div className="two-col"><ResolutionSimulator /><BuildMachine /></div><EvidenceGraph />
      <section className="contribute" id="contribute"><div className="eyebrow">Contributor launchpad</div><h2>Don't just read it. Map what humanity publicly knows.</h2><p>Pick a lane: 3D, optics, physics, patents, semiconductor process, frontend, visualization, technical writing, or evidence review.</p><div className="mission-grid">{[['3D','Model a subsystem','Create neutral GLB assets or improve the procedural digital twin.'],['OPTICS','Build a ray playground','Visualize reflective optical paths and NA tradeoffs.'],['PATENT','Map a patent family','Turn public disclosures into structured evidence nodes.'],['RESEARCH','Resolve an unknown','Find stronger public evidence and upgrade confidence.'],['SIM','Add a physics lab','Implement educational, clearly-scoped models.'],['FAB','Map TSMC integration','Document public EUV process milestones and fab context.']].map(([tag,title,text]) => <article key={tag}><span>{tag}</span><h3>{title}</h3><p>{text}</p></article>)}</div><a className="primary-button" href="https://github.com/trinhtanphat/OpenEUV/issues" target="_blank" rel="noreferrer">Open contributor missions</a></section>
      <footer><div><span className="brand-mark">OE</span><strong>OpenEUV</strong></div><p>Public-source reconstruction for education and research. Not affiliated with ASML, ZEISS, TSMC, TRUMPF or Cymer.</p></footer>
    </main>
  )
}
