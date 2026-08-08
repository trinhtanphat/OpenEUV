import { useState } from 'react'

type Axis = 'x' | 'y' | 'z' | 'rx' | 'ry' | 'rz'
type StageState = Record<Axis, number>

const zero: StageState = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 }
const axes: Array<{ id: Axis; label: string; min: number; max: number; step: number; unit: string }> = [
  { id: 'x', label: 'X', min: -40, max: 40, step: 1, unit: 'px' },
  { id: 'y', label: 'Y', min: -30, max: 30, step: 1, unit: 'px' },
  { id: 'z', label: 'Z', min: -18, max: 18, step: 1, unit: 'px' },
  { id: 'rx', label: 'Rx', min: -12, max: 12, step: 1, unit: '°' },
  { id: 'ry', label: 'Ry', min: -12, max: 12, step: 1, unit: '°' },
  { id: 'rz', label: 'Rz', min: -12, max: 12, step: 1, unit: '°' },
]

export function WaferStageLab() {
  const [stage, setStage] = useState<StageState>(zero)
  const setAxis = (axis: Axis, value: number) => setStage((current) => ({ ...current, [axis]: value }))
  const transform = `translate3d(${stage.x}px, ${stage.y}px, ${stage.z}px) rotateX(${stage.rx}deg) rotateY(${stage.ry}deg) rotateZ(${stage.rz}deg)`

  return (
    <section className="lab-card stage-lab" id="stage-lab">
      <div className="lab-head"><div><span className="lab-tag">MOTION</span><h3>Wafer stage · 6 degrees of freedom</h3></div><button className="ghost-button" onClick={() => setStage(zero)}>Reset</button></div>
      <p className="muted">Move a conceptual wafer in X/Y/Z and rotate around Rx/Ry/Rz. This teaches coordinate coupling only; it does not reproduce ASML servo architecture, travel, tolerances or control laws.</p>
      <div className="stage-layout"><div className="stage-viewport"><div className="stage-frame"><div className="stage-platform" style={{ transform }}><div className="stage-wafer"><span>wafer</span><i /></div></div></div><div className="axis-legend"><span>X ↔</span><span>Y ↕</span><span>Z ⊙</span></div></div><div className="stage-controls">{axes.map((axis) => <label key={axis.id}><span>{axis.label}<b>{stage[axis.id]}{axis.unit}</b></span><input type="range" min={axis.min} max={axis.max} step={axis.step} value={stage[axis.id]} onChange={(event) => setAxis(axis.id, Number(event.target.value))} /></label>)}</div></div>
    </section>
  )
}
