import { useMemo, useState } from 'react'
import { braggPeriodNm, multilayerReflectivity, type Polarization } from '../lib/multilayer.mjs'
import { sampleOpticalConstants, validateOpticalDataset, type OpticalDataset } from '../lib/opticalConstants.mjs'

export function MultilayerSimulator() {
  const [wavelength, setWavelength] = useState(13.5)
  const [angle, setAngle] = useState(5)
  const [pairs, setPairs] = useState(32)
  const [polarization, setPolarization] = useState<Polarization>('unpolarized')
  const [aN, setAN] = useState(0.92)
  const [aK, setAK] = useState(0.015)
  const [aThickness, setAThickness] = useState(2.8)
  const [bN, setBN] = useState(0.995)
  const [bK, setBK] = useState(0.004)
  const [bThickness, setBThickness] = useState(4.1)
  const [aDataset, setADataset] = useState<OpticalDataset | null>(null)
  const [bDataset, setBDataset] = useState<OpticalDataset | null>(null)
  const [datasetError, setDatasetError] = useState('')

  const aSample = useMemo(() => aDataset ? sampleOpticalConstants(aDataset, wavelength) : null, [aDataset, wavelength])
  const bSample = useMemo(() => bDataset ? sampleOpticalConstants(bDataset, wavelength) : null, [bDataset, wavelength])
  const aOptical = aSample ?? { n: aN, k: aK }
  const bOptical = bSample ?? { n: bN, k: bK }

  const result = useMemo(() => multilayerReflectivity({
    wavelengthNm: wavelength,
    angleDeg: angle,
    pairs,
    polarization,
    materialA: { n: aOptical.n, k: aOptical.k, thicknessNm: aThickness },
    materialB: { n: bOptical.n, k: bOptical.k, thicknessNm: bThickness },
  }), [wavelength, angle, pairs, polarization, aOptical.n, aOptical.k, aThickness, bOptical.n, bOptical.k, bThickness])

  const bragg = braggPeriodNm(wavelength, angle)
  const acceptDataset = (parsed: unknown, layer: 'a' | 'b') => {
    const validation = validateOpticalDataset(parsed)
    if (!validation.ok || !validation.dataset) throw new Error(validation.errors.join('; '))
    if (layer === 'a') setADataset(validation.dataset)
    else setBDataset(validation.dataset)
  }
  const loadDataset = async (file: File | undefined, layer: 'a' | 'b') => {
    if (!file) return
    setDatasetError('')
    try {
      acceptDataset(JSON.parse(await file.text()) as unknown, layer)
    } catch (error) {
      setDatasetError(error instanceof Error ? error.message : 'Unable to read optical constants dataset')
    }
  }
  const loadBuiltInMo = async () => {
    setDatasetError('')
    try {
      const response = await fetch('/datasets/optical/mo-windt-1988.json')
      if (!response.ok) throw new Error(`Built-in dataset request failed (${response.status})`)
      acceptDataset(await response.json() as unknown, 'a')
    } catch (error) {
      setDatasetError(error instanceof Error ? error.message : 'Unable to load built-in Mo dataset')
    }
  }

  return (
    <section className="lab-card" id="multilayer-lab">
      <div className="lab-head"><div><span className="lab-tag">PHYSICS V3</span><h3>Polarization-aware multilayer simulator</h3></div><span className="evidence-pill academic">Characteristic-matrix learning model</span></div>
      <p className="muted">Explore thin-film interference with complex-index Snell propagation and separate s/p optical admittance. Layer A can load a pinned CC0 Mo/Windt public dataset; Layer B stays illustrative unless you supply another provenance-valid dataset. This is not a production coating recipe.</p>
      <div className="polarization-row" role="group" aria-label="Multilayer polarization mode">{(['unpolarized', 's', 'p'] as Polarization[]).map((mode) => <button key={mode} data-polarization={mode} className={polarization === mode ? 'active' : ''} onClick={() => setPolarization(mode)}>{mode === 'unpolarized' ? 'Unpolarized' : `${mode.toUpperCase()} polarization`}</button>)}</div>
      <div className="lab-controls three">
        <label><span>Wavelength <b>{wavelength.toFixed(1)} nm</b></span><input aria-label="Multilayer wavelength" type="range" min="10" max="17" step="0.1" value={wavelength} onChange={(event) => setWavelength(Number(event.target.value))} /></label>
        <label><span>Incidence from normal <b>{angle}°</b></span><input aria-label="Multilayer incidence angle" type="range" min="0" max="45" step="1" value={angle} onChange={(event) => setAngle(Number(event.target.value))} /></label>
        <label><span>Layer pairs <b>{pairs}</b></span><input aria-label="Multilayer pair count" type="range" min="4" max="60" step="1" value={pairs} onChange={(event) => setPairs(Number(event.target.value))} /></label>
      </div>
      <div className="material-grid">
        <fieldset><legend>Layer A · {aDataset ? aDataset.material : 'illustrative Mo-like'}</legend><label>n <input aria-label="Layer A refractive index n" type="number" step="0.005" min="0.5" max="1.5" value={aOptical.n} disabled={Boolean(aDataset)} onChange={(e) => setAN(Number(e.target.value))} /></label><label>k <input aria-label="Layer A extinction coefficient k" type="number" step="0.001" min="0" max="0.2" value={aOptical.k} disabled={Boolean(aDataset)} onChange={(e) => setAK(Number(e.target.value))} /></label><label>Thickness (nm) <input aria-label="Layer A thickness" type="number" step="0.1" min="0.2" max="8" value={aThickness} onChange={(e) => setAThickness(Number(e.target.value))} /></label><div className="dataset-controls"><button data-load-public-mo onClick={() => void loadBuiltInMo()}>Load built-in public Mo data</button><label className="dataset-file">Load JSON dataset<input aria-label="Load Layer A optical constants dataset" type="file" accept="application/json,.json" onChange={(e) => void loadDataset(e.target.files?.[0], 'a')} /></label>{aDataset && <button onClick={() => setADataset(null)}>Use illustrative values</button>}</div>{aDataset && <div className="dataset-provenance"><strong>{aDataset.id}</strong><a href={aDataset.source.url} target="_blank" rel="noreferrer">{aDataset.source.name} ↗</a><span>{aDataset.license}</span>{aSample?.extrapolated && <em>Nearest endpoint sample used</em>}</div>}</fieldset>
        <fieldset><legend>Layer B · {bDataset ? bDataset.material : 'illustrative Si-like'}</legend><label>n <input aria-label="Layer B refractive index n" type="number" step="0.005" min="0.5" max="1.5" value={bOptical.n} disabled={Boolean(bDataset)} onChange={(e) => setBN(Number(e.target.value))} /></label><label>k <input aria-label="Layer B extinction coefficient k" type="number" step="0.001" min="0" max="0.2" value={bOptical.k} disabled={Boolean(bDataset)} onChange={(e) => setBK(Number(e.target.value))} /></label><label>Thickness (nm) <input aria-label="Layer B thickness" type="number" step="0.1" min="0.2" max="8" value={bThickness} onChange={(e) => setBThickness(Number(e.target.value))} /></label><div className="dataset-controls"><label className="dataset-file">Load JSON dataset<input aria-label="Load Layer B optical constants dataset" type="file" accept="application/json,.json" onChange={(e) => void loadDataset(e.target.files?.[0], 'b')} /></label>{bDataset && <button onClick={() => setBDataset(null)}>Use illustrative values</button>}</div>{bDataset && <div className="dataset-provenance"><strong>{bDataset.id}</strong><a href={bDataset.source.url} target="_blank" rel="noreferrer">{bDataset.source.name} ↗</a><span>{bDataset.license}</span>{bSample?.extrapolated && <em>Nearest endpoint sample used</em>}</div>}</fieldset>
      </div>
      {datasetError && <div className="dataset-error" role="alert">Dataset rejected: {datasetError}</div>}
      <div className="multilayer-visual" aria-hidden="true">{Array.from({ length: Math.min(20, Math.max(4, Math.round(pairs / 3))) }, (_, index) => <i key={index} />)}</div>
      <div className="lab-metrics polarization-metrics"><div><span>Selected mode R</span><strong>{result.percent.toFixed(1)}%</strong></div><div><span>Rs</span><strong>{result.sPercent.toFixed(1)}%</strong></div><div><span>Rp</span><strong>{result.pPercent.toFixed(1)}%</strong></div><div><span>Physical A+B period</span><strong>{result.physicalPeriodNm.toFixed(2)} nm</strong></div><div><span>Bragg-period proxy</span><strong>{bragg.toFixed(2)} nm</strong></div></div>
      <div className="formula-box"><code>M = ∏ Mᵢ · R = |r|² · ηs ≠ ηp</code><span>The model includes complex-index refraction and s/p admittance. It still omits roughness, interdiffusion, graded interfaces and production-specific corrections. Those effects should only be added with explicit public assumptions/references.</span></div>
      <div className="lab-sources"><a href="https://arxiv.org/abs/1212.1258" target="_blank" rel="noreferrer">Periodic Mo/Si multilayer study ↗</a><a href="https://arxiv.org/abs/1912.09075" target="_blank" rel="noreferrer">Refined EUV mask model ↗</a><a href="/datasets/optical/mo-windt-1988.json" target="_blank" rel="noreferrer">Pinned CC0 Mo/Windt dataset ↗</a><a href="/evidence/optical-constants.template.json" target="_blank" rel="noreferrer">Dataset template ↗</a></div>
    </section>
  )
}
