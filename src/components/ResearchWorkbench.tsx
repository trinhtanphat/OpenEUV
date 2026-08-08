import { HighNAComparison } from './HighNAComparison'
import { MultilayerSimulator } from './MultilayerSimulator'
import { WaferStageLab } from './WaferStageLab'

export function ResearchWorkbench() {
  return (
    <section className="workbench" id="labs">
      <div className="section-heading workbench-heading"><div><div className="eyebrow">Interactive research workbench</div><h2>Physics, optics & motion labs</h2><p className="muted">Every lab states its assumptions and intentionally stops short of proprietary manufacturing recipes or machine-control details.</p></div><div className="workbench-badges"><span>13.5 nm</span><span>NA 0.33 → 0.55</span><span>6-DoF</span></div></div>
      <div className="lab-grid"><HighNAComparison /><MultilayerSimulator /></div>
      <WaferStageLab />
    </section>
  )
}
