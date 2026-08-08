import { useMemo, useState } from 'react'

const modules = ['Vacuum environment', 'EUV source', 'Collector', 'Illuminator', 'Reflective mask', 'Projection optics', 'Wafer stage', 'Metrology']

export function BuildMachine() {
  const [installed, setInstalled] = useState<Set<string>>(new Set(['Vacuum environment']))
  const progress = useMemo(() => Math.round((installed.size / modules.length) * 100), [installed])
  const toggle = (name: string) => setInstalled((current) => {
    const next = new Set(current)
    if (next.has(name)) next.delete(name); else next.add(name)
    return next
  })

  return (
    <section className="panel build-panel" id="build">
      <div className="eyebrow">Assembly game</div>
      <h2>Build the conceptual scanner</h2>
      <p className="muted">A learning checklist, not real-world construction instructions. Install the functional blocks and watch system completeness rise.</p>
      <div className="build-progress"><span style={{ width: `${progress}%` }} /></div>
      <div className="build-score">{progress}% systems mapped</div>
      <div className="module-list">{modules.map((module) => <button key={module} className={installed.has(module) ? 'installed' : ''} onClick={() => toggle(module)}><span>{installed.has(module) ? '✓' : '+'}</span>{module}</button>)}</div>
    </section>
  )
}
