import { useMemo, useState } from 'react'

export function ResolutionSimulator() {
  const [na, setNa] = useState(0.55)
  const [k1, setK1] = useState(0.35)
  const wavelength = 13.5
  const cd = useMemo(() => (k1 * wavelength) / na, [k1, na])
  const lowNa = (k1 * wavelength) / 0.33

  return (
    <section className="panel simulator-card" id="simulator">
      <div className="eyebrow">Physics playground</div>
      <h2>Resolution intuition</h2>
      <p className="muted">A simplified Rayleigh-style relationship for learning. It is not a scanner process model.</p>
      <div className="sim-grid">
        <label><span>Numerical aperture <b>{na.toFixed(2)}</b></span><input type="range" min="0.20" max="0.60" step="0.01" value={na} onChange={(e) => setNa(Number(e.target.value))} /></label>
        <label><span>k₁ factor <b>{k1.toFixed(2)}</b></span><input type="range" min="0.25" max="0.80" step="0.01" value={k1} onChange={(e) => setK1(Number(e.target.value))} /></label>
      </div>
      <div className="metric-row">
        <div className="metric"><span>λ</span><strong>13.5 nm</strong></div>
        <div className="metric"><span>Estimated scale</span><strong>{cd.toFixed(1)} nm</strong></div>
        <div className="metric"><span>Same k₁ at NA 0.33</span><strong>{lowNa.toFixed(1)} nm</strong></div>
      </div>
      <div className="feature-visual" aria-label="visual comparison of feature scale"><div style={{ width: `${Math.max(12, cd * 3.2)}px` }} /><span>relative printable feature scale</span></div>
    </section>
  )
}
