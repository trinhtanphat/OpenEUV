import { useMemo, useState } from 'react'

export function Mask3DEffectsLab() {
  const [angle, setAngle] = useState(6)
  const [height, setHeight] = useState(40)
  const shadow = useMemo(() => height * Math.tan((angle * Math.PI) / 180), [angle, height])

  return (
    <section className="lab-card" id="mask-3d-lab">
      <div className="lab-head"><div><span className="lab-tag">MASK 3D</span><h3>Reflective-mask shadowing intuition</h3></div><span className="evidence-pill academic">Geometry toy model</span></div>
      <p className="muted">A finite-height feature viewed at oblique incidence produces a lateral geometric shadow. The sliders use arbitrary educational units and do not represent a reticle manufacturing specification.</p>
      <div className="lab-controls two"><label><span>Incidence angle <b>{angle}°</b></span><input type="range" min="1" max="18" step="1" value={angle} onChange={(event) => setAngle(Number(event.target.value))} /></label><label><span>Feature height <b>{height} u</b></span><input type="range" min="10" max="80" step="1" value={height} onChange={(event) => setHeight(Number(event.target.value))} /></label></div>
      <div className="mask-visual"><div className="mask-ray" style={{ transform: `rotate(${angle}deg)` }} /><div className="mask-stack"><div className="mask-absorber" style={{ height: `${40 + height * 0.8}px` }} /><div className="mask-multilayer" /><div className="mask-substrate" /></div><div className="mask-shadow" style={{ width: `${20 + Math.min(120, shadow * 3)}px` }} /></div>
      <div className="formula-box"><code>shadow ≈ height · tan(angle)</code><span>Pure geometry for intuition. Real EUV mask imaging requires electromagnetic modeling, multilayer response, absorber properties, diffraction and imaging-system context.</span></div>
    </section>
  )
}
