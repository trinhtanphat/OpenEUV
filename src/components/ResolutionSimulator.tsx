import { useMemo, useState } from 'react'
import { rayleighResolutionNm } from '../lib/resolution.mjs'

export function ResolutionSimulator() {
  const [na, setNa] = useState(0.33)
  const [k1, setK1] = useState(0.32)
  const wavelength = 13.5
  const resolution = useMemo(() => rayleighResolutionNm({ wavelengthNm: wavelength, numericalAperture: na, k1 }), [na, k1])
  const lowNa = rayleighResolutionNm({ wavelengthNm: wavelength, numericalAperture: 0.33, k1 })
  const highNa = rayleighResolutionNm({ wavelengthNm: wavelength, numericalAperture: 0.55, k1 })
  const improvement = ((lowNa - highNa) / lowNa) * 100

  return (
    <section className="panel" id="simulator">
      <div className="eyebrow">Resolution playground</div>
      <h2>Change NA. Watch the educational proxy move.</h2>
      <p className="muted">A simplified Rayleigh-style relation, <code>R = k₁λ / NA</code>. This is a learning tool, not a process-design or yield prediction model.</p>
      <div className="sim-grid">
        <label><span>Numerical aperture <b>{na.toFixed(2)}</b></span><input aria-label="Resolution numerical aperture" type="range" min="0.2" max="0.65" step="0.01" value={na} onChange={(event) => setNa(Number(event.target.value))} /></label>
        <label><span>k₁ teaching factor <b>{k1.toFixed(2)}</b></span><input aria-label="Resolution k1 factor" type="range" min="0.2" max="0.8" step="0.01" value={k1} onChange={(event) => setK1(Number(event.target.value))} /></label>
      </div>
      <div className="metric-row"><div className="metric"><span>λ</span><strong>{wavelength.toFixed(1)} nm</strong></div><div className="metric"><span>Proxy resolution</span><strong>{resolution.toFixed(2)} nm</strong></div><div className="metric"><span>0.33 → 0.55 proxy change</span><strong>{improvement.toFixed(1)}%</strong></div></div>
      <div className="feature-visual" aria-label={`Illustrative feature width ${resolution.toFixed(2)} nanometers`}><span>feature</span><div style={{ width: `${Math.max(12, Math.min(180, resolution * 6))}px` }} /><span>{resolution.toFixed(2)} nm</span></div>
      <p className="muted">The same helper used here is cross-checked in CI against an independent Python implementation in <code>research/crosscheck_models.py</code>.</p>
    </section>
  )
}
