import { useMemo, useState } from 'react'
import { braggPeriodNm, multilayerReflectivity } from '../lib/multilayer.mjs'

export function MultilayerSimulator() {
  const [wavelength, setWavelength] = useState(13.5)
  const [angle, setAngle] = useState(5)
  const [pairs, setPairs] = useState(32)
  const [aN, setAN] = useState(0.92)
  const [aK, setAK] = useState(0.015)
  const [aThickness, setAThickness] = useState(2.8)
  const [bN, setBN] = useState(0.995)
  const [bK, setBK] = useState(0.004)
  const [bThickness, setBThickness] = useState(4.1)

  const result = useMemo(() => multilayerReflectivity({
    wavelengthNm: wavelength,
    angleDeg: angle,
    pairs,
    materialA: { n: aN, k: aK, thicknessNm: aThickness },
    materialB: { n: bN, k: bK, thicknessNm: bThickness },
  }), [wavelength, angle, pairs, aN, aK, aThickness, bN, bK, bThickness])

  const bragg = braggPeriodNm(wavelength, angle)

  return (
    <section className="lab-card" id="multilayer-lab">
      <div className="lab-head"><div><span className="lab-tag">PHYSICS</span><h3>Mo/Si-inspired multilayer simulator</h3></div><span className="evidence-pill academic">Transfer-matrix learning model</span></div>
      <p className="muted">Explore thin-film interference with a compact characteristic-matrix model. The default n/k values are intentionally illustrative “Mo-like / Si-like” values, not measured production optical constants or a coating recipe.</p>
      <div className="lab-controls three">
        <label><span>Wavelength <b>{wavelength.toFixed(1)} nm</b></span><input aria-label="Multilayer wavelength" type="range" min="10" max="17" step="0.1" value={wavelength} onChange={(event) => setWavelength(Number(event.target.value))} /></label>
        <label><span>Incidence angle <b>{angle}°</b></span><input aria-label="Multilayer incidence angle" type="range" min="0" max="30" step="1" value={angle} onChange={(event) => setAngle(Number(event.target.value))} /></label>
        <label><span>Layer pairs <b>{pairs}</b></span><input aria-label="Multilayer pair count" type="range" min="4" max="60" step="1" value={pairs} onChange={(event) => setPairs(Number(event.target.value))} /></label>
      </div>
      <div className="material-grid">
        <fieldset><legend>Layer A · illustrative Mo-like</legend><label>n <input type="number" step="0.005" min="0.75" max="1.05" value={aN} onChange={(e) => setAN(Number(e.target.value))} /></label><label>k <input type="number" step="0.001" min="0" max="0.08" value={aK} onChange={(e) => setAK(Number(e.target.value))} /></label><label>Thickness (nm) <input type="number" step="0.1" min="0.2" max="8" value={aThickness} onChange={(e) => setAThickness(Number(e.target.value))} /></label></fieldset>
        <fieldset><legend>Layer B · illustrative Si-like</legend><label>n <input type="number" step="0.005" min="0.75" max="1.05" value={bN} onChange={(e) => setBN(Number(e.target.value))} /></label><label>k <input type="number" step="0.001" min="0" max="0.08" value={bK} onChange={(e) => setBK(Number(e.target.value))} /></label><label>Thickness (nm) <input type="number" step="0.1" min="0.2" max="8" value={bThickness} onChange={(e) => setBThickness(Number(e.target.value))} /></label></fieldset>
      </div>
      <div className="multilayer-visual" aria-hidden="true">{Array.from({ length: Math.min(20, Math.max(4, Math.round(pairs / 3))) }, (_, index) => <i key={index} />)}</div>
      <div className="lab-metrics"><div><span>Calculated reflectivity</span><strong>{result.percent.toFixed(1)}%</strong></div><div><span>Physical A+B period</span><strong>{result.physicalPeriodNm.toFixed(2)} nm</strong></div><div><span>Bragg-period proxy</span><strong>{bragg.toFixed(2)} nm</strong></div></div>
      <div className="formula-box"><code>M = ∏ Mᵢ · R = |r|²</code><span>The model uses complex refractive index and layer phase, with a simplified external-angle correction. It omits full complex Snell propagation, roughness, interdiffusion, polarization and measured wavelength-dependent optical constants.</span></div>
      <div className="lab-sources"><a href="https://arxiv.org/abs/1212.1258" target="_blank" rel="noreferrer">Periodic Mo/Si multilayer study ↗</a><a href="https://arxiv.org/abs/1912.09075" target="_blank" rel="noreferrer">Refined EUV mask model ↗</a></div>
    </section>
  )
}
