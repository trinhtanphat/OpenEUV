import { useState } from 'react'

const wavelength = 13.5

export function HighNAComparison() {
  const [k1, setK1] = useState(0.4)
  const lowNa = 0.33
  const highNa = 0.55
  const lowScale = (k1 * wavelength) / lowNa
  const highScale = (k1 * wavelength) / highNa
  const improvement = (1 - highScale / lowScale) * 100

  return (
    <section className="lab-card" id="high-na-lab">
      <div className="lab-head">
        <div><span className="lab-tag">OPTICS</span><h3>Low-NA vs High-NA</h3></div>
        <span className="evidence-pill official">ZEISS · Class A</span>
      </div>
      <p className="muted">A teaching comparison using the Rayleigh-style scale k₁λ/NA. It explains the direction of the NA trade-off; it is not a process-design calculator.</p>
      <label className="lab-slider"><span>Educational k₁ <b>{k1.toFixed(2)}</b></span><input type="range" min="0.25" max="0.65" step="0.01" value={k1} onChange={(event) => setK1(Number(event.target.value))} /></label>
      <div className="na-compare">
        <article><span>Established EUV</span><strong>NA 0.33</strong><div className="ray-cone low"><i /><i /><i /></div><b>{lowScale.toFixed(1)} nm</b><small>illustrative Rayleigh scale</small></article>
        <div className="na-arrow">→<b>{improvement.toFixed(0)}%</b><small>smaller scale at same k₁</small></div>
        <article><span>High-NA EUV</span><strong>NA 0.55</strong><div className="ray-cone high"><i /><i /><i /></div><b>{highScale.toFixed(1)} nm</b><small>illustrative Rayleigh scale</small></article>
      </div>
      <a className="source-link" href="https://www.zeiss.com/semiconductor-manufacturing-technology/inspiring-technology/high-na-euv-lithography.html" target="_blank" rel="noreferrer">↗ ZEISS public High-NA overview</a>
    </section>
  )
}
