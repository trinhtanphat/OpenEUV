import { useMemo, useState } from 'react'
import { subsystems } from '../data/subsystems'
import { t, type Language } from '../i18n'
import { LocalizedSubsystemPanel } from './LocalizedSubsystemPanel'
import { ScannerScene } from './ScannerScene'

const tourStops = ['source', 'reticle', 'projection', 'wafer'] as const

export function ExplorerSection({ language }: { language: Language }) {
  const [selectedId, setSelectedId] = useState('projection')
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [exploded, setExploded] = useState(0.18)
  const [tourIndex, setTourIndex] = useState<number | null>(null)
  const [cameraFocus, setCameraFocus] = useState<string | null>(null)
  const selected = useMemo(() => subsystems.find((item) => item.id === selectedId) ?? subsystems[0], [selectedId])

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
    <section className="explorer" id="explorer" data-language={language}>
      <div className="section-heading"><div><div className="eyebrow">{language === 'vi' ? 'Tái dựng tương tác từ nguồn công khai' : 'Interactive public-source reconstruction'}</div><h2>{language === 'vi' ? 'Máy quang khắc EUV dạng exploded view' : 'Exploded EUV scanner'}</h2><p className="muted">{language === 'vi' ? 'Digital twin mang tính khái niệm với ranh giới chứng cứ rõ ràng. Hình học chưa được nguồn công khai xác nhận luôn được đánh dấu là minh họa.' : 'Conceptual digital twin with public-source evidence boundaries. Geometry not established by lawful sources remains explicitly illustrative.'}</p></div><div className="explorer-actions"><div className="exploded-control"><span>{t(language, 'assembled')}</span><input aria-label="Exploded view" type="range" min="0" max="1" step="0.01" value={exploded} onChange={(event) => setExploded(Number(event.target.value))} /><span>{t(language, 'exploded')}</span></div><div className="tour-controls" aria-label={language === 'vi' ? 'Tour hướng dẫn máy EUV' : 'Guided scanner tour'}><button data-tour-action="start" onClick={startTour}>{language === 'vi' ? 'Bắt đầu tour' : 'Start tour'}</button><button data-tour-action="next" onClick={nextTour}>{language === 'vi' ? 'Tiếp theo' : 'Next'}</button><button data-tour-action="overview" onClick={overviewCamera}>{language === 'vi' ? 'Toàn cảnh' : 'Overview'}</button><button data-tour-action="free" onClick={freeOrbit}>{language === 'vi' ? 'Xoay tự do' : 'Free orbit'}</button>{tourIndex !== null && <span data-tour-stop={tourStops[tourIndex]}>Tour · {tourStops[tourIndex]}</span>}</div></div></div>
      <div className="explorer-grid">
        <ScannerScene selected={selected} exploded={exploded} onSelect={selectSubsystem} highlightedNode={selectedNode} focusId={cameraFocus} />
        <LocalizedSubsystemPanel selected={selected} selectedNode={selectedNode} language={language} onSelect={(id) => selectSubsystem(id)} onNodeSelect={setSelectedNode} />
      </div>
    </section>
  )
}
