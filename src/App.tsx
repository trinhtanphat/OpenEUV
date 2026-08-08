import { useMemo, useState } from 'react'
import { BuildMachine } from './components/BuildMachine'
import { EvidenceDashboard } from './components/EvidenceDashboard'
import { EvidenceGraph } from './components/EvidenceGraph'
import { EvidenceInspector } from './components/EvidenceInspector'
import { FabCaseStudies } from './components/FabCaseStudies'
import { FabFlow } from './components/FabFlow'
import { PatentExplorer } from './components/PatentExplorer'
import { ResearchWorkbench } from './components/ResearchWorkbench'
import { ResolutionSimulator } from './components/ResolutionSimulator'
import { ScannerScene } from './components/ScannerScene'
import { TsmcTimeline } from './components/TsmcTimeline'
import { subsystemVi, t, type Language } from './i18n'
import { subsystems } from './data/subsystems'

const confidenceLabel = { official: 'Officially documented', patent: 'Patent-supported', academic: 'Academic', inferred: 'Public-source inference', unknown: 'Unknown' }
const tourStops = ['source', 'reticle', 'projection', 'wafer'] as const

export default function App() {
  const [selectedId, setSelectedId] = useState('projection')
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [exploded, setExploded] = useState(0.18)
  const [language, setLanguage] = useState<Language>('en')
  const [tourIndex, setTourIndex] = useState<number | null>(null)
  const [cameraFocus, setCameraFocus] = useState<string | null>(null)
  const selected = useMemo(() => subsystems.find((item) => item.id === selectedId) ?? subsystems[0], [selectedId])
  const localized = language === 'vi' ? subsystemVi[selected.id] : undefined
  const selectSubsystem = (id: string, nodeName?: string) => {
    setSelectedId(id)
    setSelectedNode(nodeName ?? null)
  }
  const setTourStop = (index: number) => {
    const normalized = Math.max(0, Math.min(tourStops.length - 1, index))
    const stop = tourStops[normalized]
    setTourIndex(normalized)
    setCameraFocus(stop)
    selectSubsystem(stop)
  }
  const startTour = () => setTourStop(0)
  const nextTour = () => setTourStop(tourIndex === null ? 0 : (tourIndex + 1) % tourStops.length)
  const overviewCamera = () => {
    setTourIndex(null)
    setCameraFocus('overview')
    setSelectedNode(null)
  }
  const freeOrbit = () => {
    setTourIndex(null)
    setCameraFocus(null)
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top"><span className="brand-mark">OE</span><span>OpenEUV <small>Atlas</small></span></a>
        <nav><a href="#explorer">{t(language, 'navExplorer')}</a><a href="#labs">{t(language, 'navLabs')}</a><a href="#patents">{t(language, 'navPatents')}</a><a href="#fab-cases">{t(language, 'navFab')}</a><a href="#unknowns">{t(language, 'navEvidence')}</a><a href="#contribute">{t(language, 'navContribute')}</a></nav>
        <button className="language-button" onClick={() => setLanguage((current) => current === 'en' ? 'vi' : 'en')}>{t(language, 'language')}</button>
        <a className="github-button" href="https://github.com/trinhtanphat/OpenEUV" target="_blank" rel="noreferrer">GitHub</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy"><div className="kicker">✦ {t(language, 'heroKicker')}</div><h1>{t(language, 'heroTitle')}</h1><p>{t(language, 'heroBody')}</p><div className="hero-actions"><a className="primary-button" href="#explorer">◎ {t(language, 'explore')}</a><a className="secondary-button" href="#contribute">▦ {t(language, 'missions')}</a></div><div className="hero-stats"><div><strong>13.5 nm</strong><span>EUV wavelength</span></div><div><strong>0.55 NA</strong><span>High-NA generation</span></div><div><strong>25,000+</strong><span>High-NA illumination parts reported by ZEISS</span></div><div><strong>40,000+</strong><span>High-NA projection parts reported by ZEISS</span></div></div></div>
        <div className="hero-orbit" aria-hidden="true"><div className="orbital-ring"><span /></div><div className="wafer-disc"><b>13.5</b><small>nm</small></div></div>
      </section>

      <section className="explorer" id="explorer">
        <div className="section-heading"><div><div className="eyebrow">Interactive public-source reconstruction</div><h2>Exploded EUV scanner</h2><p className="muted">Conceptual digital twin with public-source evidence boundaries. Geometry not established by lawful sources remains explicitly illustrative.</p></div><div className="explorer-actions"><div className="exploded-control"><span>{t(language, 'assembled')}</span><input aria-label="Exploded view" type="range" min="0" max="1" step="0.01" value={exploded} onChange={(e) => setExploded(Number(e.target.value))} /><span>{t(language, 'exploded')}</span></div><div className="tour-controls" aria-label="Guided scanner tour"><button data-tour-action="start" onClick={startTour}>Start tour</button><button data-tour-action="next" onClick={nextTour}>Next</button><button data-tour-action="overview" onClick={overviewCamera}>Overview</button><button data-tour-action="free" onClick={freeOrbit}>Free orbit</button>{tourIndex !== null && <span data-tour-stop={tourStops[tourIndex]}>Tour · {tourStops[tourIndex]}</span>}</div></div></div>
        <div className="explorer-grid"><ScannerScene selected={selected} exploded={exploded} onSelect={selectSubsystem} highlightedNode={selectedNode} focusId={cameraFocus} /><aside className="subsystem-panel"><div className="subsystem-nav">{subsystems.map((item) => <button key={item.id} data-subsystem-id={item.id} onClick={() => selectSubsystem(item.id)} className={item.id === selected.id ? 'active' : ''}><span>{item.short}</span>{language === 'vi' ? subsystemVi[item.id]?.title ?? item.title : item.title}</button>)}</div><div className="subsystem-detail"><div className={`confidence ${selected.confidence}`}>{confidenceLabel[selected.confidence]}</div><h3>{localized?.title ?? selected.title}</h3><div className="subtitle">{localized?.subtitle ?? selected.subtitle}</div><p>{selected.description}</p><h4>What we know</h4><ul>{selected.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul><h4>Open contributor questions</h4><ul className="questions">{selected.openQuestions.map((question) => <li key={question}>{question}</li>)}</ul><EvidenceInspector subsystemId={selected.id} nodeName={selectedNode} onNodeSelect={setSelectedNode} /></div></aside></div>
      </section>

      <section className="feature-strip"><div><span className="feature-icon">◫</span><strong>3D Atlas</strong><span>Interactive subsystem reconstruction</span></div><div><span className="feature-icon">λ</span><strong>Physics labs</strong><span>NA, anamorphic, masks and multilayers</span></div><div><span className="feature-icon">⌘</span><strong>Evidence graph</strong><span>CI-validated claims and unknowns</span></div><div><span className="feature-icon">≡</span><strong>Patent map</strong><span>Public disclosures by subsystem</span></div></section>

      <ResearchWorkbench />
      <div className="two-col"><ResolutionSimulator /><BuildMachine /></div>
      <PatentExplorer />
      <FabFlow />
      <FabCaseStudies />
      <TsmcTimeline />
      <EvidenceDashboard />
      <EvidenceGraph />

      <section className="contribute" id="contribute"><div className="eyebrow">Contributor launchpad</div><h2>Don't just read it. Map what humanity publicly knows.</h2><p>Pick a lane: 3D, optics, physics, patents, semiconductor process, frontend, visualization, Vietnamese/English translation, or evidence review.</p><div className="mission-grid">{[['3D','Model a subsystem','Create original GLB/glTF assets and document every evidence-backed geometry choice.'],['OPTICS','Extend High-NA labs','Visualize reflective paths, mask effects and NA tradeoffs.'],['PATENT','Map a patent family','Turn public disclosures into structured subsystem evidence.'],['EVIDENCE','Resolve an unknown','Find stronger lawful sources and upgrade confidence.'],['SIM','Add a physics lab','Implement educational models with explicit assumptions.'],['FAB','Map foundry integration','Document first-party EUV process milestones and fab context.'],['I18N','Improve EN / VI','Translate UI and technical explanations without duplicating claim IDs.'],['QA','Strengthen validation','Add schema tests, accessibility checks and visual regression coverage.']].map(([tag,title,text]) => <article key={tag}><span>{tag}</span><h3>{title}</h3><p>{text}</p></article>)}</div><a className="primary-button" href="https://github.com/trinhtanphat/OpenEUV/issues" target="_blank" rel="noreferrer">Open contributor missions</a></section>
      <footer><div><span className="brand-mark">OE</span><strong>OpenEUV</strong></div><p>Public-source reconstruction for education and research. Not affiliated with ASML, ZEISS, TSMC, TRUMPF or Cymer.</p></footer>
    </main>
  )
}
