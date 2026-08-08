import { useState } from 'react'

export function AnamorphicLab() {
  const [patternWidth, setPatternWidth] = useState(80)
  const [patternHeight, setPatternHeight] = useState(64)
  const waferWidth = patternWidth / 4
  const waferHeight = patternHeight / 8

  return (
    <section className="lab-card" id="anamorphic-lab">
      <div className="lab-head"><div><span className="lab-tag">HIGH-NA</span><h3>Anamorphic 4× / 8× field</h3></div><span className="evidence-pill official">ASML · Class A</span></div>
      <p className="muted">ASML publicly describes EXE anamorphic optics as demagnifying the reticle pattern 4× in one direction and 8× in the other. The resulting exposure field is half the size of NXE. This diagram only visualizes that geometry.</p>
      <div className="lab-controls two"><label><span>Reticle pattern width <b>{patternWidth}</b></span><input type="range" min="40" max="120" value={patternWidth} onChange={(event) => setPatternWidth(Number(event.target.value))} /></label><label><span>Reticle pattern height <b>{patternHeight}</b></span><input type="range" min="32" max="96" value={patternHeight} onChange={(event) => setPatternHeight(Number(event.target.value))} /></label></div>
      <div className="anamorphic-visual"><div className="reticle-plane"><span>RETICLE</span><i style={{ width: `${patternWidth}%`, height: `${patternHeight}%` }} /></div><div className="anamorphic-rays"><span>4×</span><span>8×</span></div><div className="wafer-plane"><span>WAFER FIELD</span><i style={{ width: `${Math.max(15, waferWidth * 2)}%`, height: `${Math.max(10, waferHeight * 3)}%` }} /></div></div>
      <div className="lab-metrics"><div><span>X demagnification</span><strong>4×</strong></div><div><span>Y demagnification</span><strong>8×</strong></div><div><span>Relative field area</span><strong>½ NXE</strong></div></div>
      <a className="source-link" href="https://www.asml.com/en/en/news/stories/2024/5-things-high-na-euv" target="_blank" rel="noreferrer">↗ ASML public High-NA explanation</a>
    </section>
  )
}
