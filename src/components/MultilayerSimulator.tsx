import { useMemo, useState } from 'react'

export function MultilayerSimulator() {
  const [wavelength, setWavelength] = useState(13.5)
  const [angle, setAngle] = useState(5)
  const [pairs, setPairs] = useState(32)

  const result = useMemo(() => {
    const radians = (angle * Math.PI) / 180
    const periodProxy = wavelength / (2 * Math.max(Math.cos(radians), 0.15))
    const pairGain = 1 - Math.exp(-pairs / 18)
    const wavelengthFocus = Math.exp(-Math.pow((wavelength - 13.5) / 2.2, 2))
    const anglePenalty = Math.pow(Math.max(Math.cos(radians), 0), 0.45)
    return {
      periodProxy,
      score: Math.max(0, Math.min(99, pairGain * wavelengthFocus * anglePenalty * 100)),
    }
  }, [wavelength, angle, pairs])

  return (
    <section className="lab-card" id="multilayer-lab">
      <div className="lab-head"><div><span className="lab-tag">PHYSICS</span><h3>Multilayer reflection playground</h3></div><span className="evidence-pill academic">Educational model</span></div>
      <p className="muted">Explore interference intuition with a deliberately simplified toy response. The score below is not measured reflectivity and must not be used as a coating or manufacturing recipe.</p>
      <div className="lab-controls three">
        <label><span>Wavelength <b>{wavelength.toFixed(1)} nm</b></span><input type="range" min="10" max="17" step="0.1" value={wavelength} onChange={(event) => setWavelength(Number(event.target.value))} /></label>
        <label><span>Incidence angle <b>{angle}°</b></span><input type="range" min="0" max="30" step="1" value={angle} onChange={(event) => setAngle(Number(event.target.value))} /></label>
        <label><span>Illustrative layer pairs <b>{pairs}</b></span><input type="range" min="4" max="60" step="1" value={pairs} onChange={(event) => setPairs(Number(event.target.value))} /></label>
      </div>
      <div className="multilayer-visual" aria-hidden="true">{Array.from({ length: Math.min(18, Math.max(4, Math.round(pairs / 3))) }, (_, index) => <i key={index} />)}</div>
      <div className="lab-metrics"><div><span>λ</span><strong>{wavelength.toFixed(1)} nm</strong></div><div><span>Bragg-period proxy</span><strong>{result.periodProxy.toFixed(2)} nm</strong></div><div><span>Toy interference score</span><strong>{result.score.toFixed(0)} / 100</strong></div></div>
      <div className="formula-box"><code>d ≈ λ / (2 cos θ)</code><span>Conceptual first-order proxy only. Real EUV multilayer optics require material optical constants, interfaces, roughness, diffusion and full electromagnetic modeling.</span></div>
    </section>
  )
}
