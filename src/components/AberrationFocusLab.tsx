import { useMemo, useState } from 'react'

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

export function AberrationFocusLab() {
  const [defocus, setDefocus] = useState(0)
  const [astigmatism, setAstigmatism] = useState(0)
  const [coma, setComa] = useState(0)
  const [overlayX, setOverlayX] = useState(0)
  const [overlayY, setOverlayY] = useState(0)
  const [leveling, setLeveling] = useState(0)

  const metrics = useMemo(() => {
    const wavefrontProxy = Math.sqrt(defocus ** 2 + astigmatism ** 2 + coma ** 2)
    const overlayProxy = Math.hypot(overlayX, overlayY)
    const focusQuality = clamp(100 - wavefrontProxy * 13 - Math.abs(leveling) * 5, 0, 100)
    return { wavefrontProxy, overlayProxy, focusQuality }
  }, [defocus, astigmatism, coma, overlayX, overlayY, leveling])

  const spotScaleX = 1 + Math.abs(defocus) * 0.18 + Math.max(0, astigmatism) * 0.22 + Math.abs(coma) * 0.08
  const spotScaleY = 1 + Math.abs(defocus) * 0.18 + Math.max(0, -astigmatism) * 0.22 + Math.abs(coma) * 0.08
  const spotShift = coma * 7
  const ringSkew = astigmatism * 5 + leveling * 2

  return (
    <section className="lab-card aberration-lab" id="aberration-lab">
      <div className="lab-head"><div><span className="lab-tag">OPTICS + METROLOGY</span><h3>Aberration, focus & overlay concept lab</h3></div><span className="evidence-pill academic">Generic optics model</span></div>
      <p className="muted">Explore qualitative coupling between wavefront error, focus/leveling and overlay. The controls are dimensionless teaching proxies; they do not represent ASML correction coefficients, tolerances, actuator commands or production-control laws.</p>
      <div className="aberration-layout">
        <div className="wavefront-box">
          <div className="wavefront-pane" aria-label="Conceptual wavefront and focus spot">
            {[0,1,2,3].map((index) => <i key={index} className="wavefront-ring" style={{ width: `${62 + index * 36}px`, height: `${62 + index * 36}px`, transform: `translate(${coma * (index + 1) * 2}px, ${leveling * (index + 1)}px) rotate(${ringSkew}deg) scaleX(${1 + astigmatism * .035})` }} />)}
            <div className="focus-spot" style={{ transform: `translate(${spotShift}px, ${leveling * 3}px) scale(${spotScaleX}, ${spotScaleY})` }} />
          </div>
          <div className="wavefront-pane" aria-label="Conceptual overlay grid">
            <div className="overlay-grid"><div className="overlay-layer" style={{ transform: `translate(${overlayX * 4}px, ${overlayY * 4}px) rotate(${leveling * .7}deg)` }} /></div>
          </div>
        </div>
        <div className="aberration-controls">
          <label><span>Defocus proxy <b>{defocus.toFixed(1)}</b></span><input aria-label="Defocus proxy" type="range" min="-3" max="3" step="0.1" value={defocus} onChange={(e) => setDefocus(Number(e.target.value))} /></label>
          <label><span>Astigmatism proxy <b>{astigmatism.toFixed(1)}</b></span><input aria-label="Astigmatism proxy" type="range" min="-3" max="3" step="0.1" value={astigmatism} onChange={(e) => setAstigmatism(Number(e.target.value))} /></label>
          <label><span>Coma proxy <b>{coma.toFixed(1)}</b></span><input aria-label="Coma proxy" type="range" min="-3" max="3" step="0.1" value={coma} onChange={(e) => setComa(Number(e.target.value))} /></label>
          <label><span>Overlay X proxy <b>{overlayX.toFixed(1)}</b></span><input aria-label="Overlay X proxy" type="range" min="-4" max="4" step="0.1" value={overlayX} onChange={(e) => setOverlayX(Number(e.target.value))} /></label>
          <label><span>Overlay Y proxy <b>{overlayY.toFixed(1)}</b></span><input aria-label="Overlay Y proxy" type="range" min="-4" max="4" step="0.1" value={overlayY} onChange={(e) => setOverlayY(Number(e.target.value))} /></label>
          <label><span>Leveling proxy <b>{leveling.toFixed(1)}</b></span><input aria-label="Leveling proxy" type="range" min="-3" max="3" step="0.1" value={leveling} onChange={(e) => setLeveling(Number(e.target.value))} /></label>
        </div>
      </div>
      <div className="concept-metrics"><div><span>Wavefront-error proxy</span><strong>{metrics.wavefrontProxy.toFixed(2)}</strong></div><div><span>Overlay-offset proxy</span><strong>{metrics.overlayProxy.toFixed(2)}</strong></div><div><span>Qualitative image score</span><strong>{metrics.focusQuality.toFixed(0)} / 100</strong></div></div>
      <div className="formula-box"><code>W ≈ defocus + astigmatism + coma</code><span>OpenEUV intentionally uses normalized teaching coefficients. A real scanner relies on far richer optical models, metrology and active correction; those proprietary implementations are outside this reconstruction.</span></div>
      <div className="lab-sources"><a href="https://www.asml.com/en/en/technology/lithography-principles/lenses-and-mirrors" target="_blank" rel="noreferrer">ASML lenses & mirrors ↗</a><a href="https://www.zeiss.com/semiconductor-manufacturing-technology/inspiring-technology/high-na-euv-lithography.html" target="_blank" rel="noreferrer">ZEISS High-NA optics ↗</a></div>
    </section>
  )
}
