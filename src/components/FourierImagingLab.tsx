import { useMemo, useState } from 'react'
import { reconstructNormalizedSquarePattern, sampleCircularPupilMtf } from '../lib/fourierImaging.mjs'
import type { Language } from '../i18n'

function linePoints(values: Array<{ x: number; y: number }>, width: number, height: number) {
  return values.map((point) => `${(point.x * width).toFixed(1)},${((1 - point.y) * height).toFixed(1)}`).join(' ')
}

export function FourierImagingLab({ language }: { language: Language }) {
  const [baseFrequency, setBaseFrequency] = useState(0.18)
  const [cutoff, setCutoff] = useState(0.62)
  const result = useMemo(() => reconstructNormalizedSquarePattern({ baseFrequency, cutoff, samples: 180, maxHarmonic: 31 }), [baseFrequency, cutoff])
  const mtf = useMemo(() => sampleCircularPupilMtf(80), [])

  const objectPoints = linePoints(result.points.map((point) => ({ x: point.x, y: point.object })), 600, 150)
  const imagePoints = linePoints(result.points.map((point) => ({ x: point.x, y: point.image })), 600, 150)
  const mtfPoints = linePoints(mtf.map((point) => ({ x: point.frequency, y: point.transfer })), 260, 100)
  const beyondCutoff = result.fundamentalNormalizedFrequency >= 1

  return (
    <section className="lab-card fourier-lab" id="fourier-imaging-lab" data-language={language}>
      <div className="lab-head">
        <div><span className="lab-tag">SIM V4 · FOURIER</span><h3>{language === 'vi' ? 'Fourier imaging & spatial-frequency filter' : 'Fourier imaging & spatial-frequency filter'}</h3></div>
        <span className="evidence-pill academic">{language === 'vi' ? 'Mô hình quang học chuẩn hóa' : 'Normalized optics model'}</span>
      </div>
      <p className="muted">{language === 'vi'
        ? 'Một pattern vuông 1D được phân rã thành các harmonic và đi qua transfer function của pupil tròn lý tưởng. Tất cả frequency/cutoff đều chuẩn hóa; đây không phải mô hình dự đoán máy EUV thương mại hay process window.'
        : 'A 1D square pattern is decomposed into harmonics and passed through the transfer function of an ideal circular pupil. Frequencies and cutoff are normalized; this is not a commercial EUV scanner predictor or process-window model.'}</p>

      <div className="lab-controls two">
        <label><span>{language === 'vi' ? 'Spatial frequency cơ bản' : 'Base spatial frequency'} <b>{baseFrequency.toFixed(2)}</b></span><input aria-label="Normalized pattern spatial frequency" type="range" min="0.05" max="0.55" step="0.01" value={baseFrequency} onChange={(event) => setBaseFrequency(Number(event.target.value))} /></label>
        <label><span>{language === 'vi' ? 'Pupil cutoff chuẩn hóa' : 'Normalized pupil cutoff'} <b>{cutoff.toFixed(2)}</b></span><input aria-label="Normalized pupil cutoff" type="range" min="0.15" max="1.20" step="0.01" value={cutoff} onChange={(event) => setCutoff(Number(event.target.value))} /></label>
      </div>

      <div className="fourier-signal-plot" role="img" aria-label={language === 'vi' ? 'So sánh pattern đầu vào và ảnh sau lọc spatial frequency' : 'Input pattern and spatial-frequency-filtered image comparison'}>
        <svg viewBox="0 0 600 150" preserveAspectRatio="none">
          <line x1="0" y1="75" x2="600" y2="75" className="fourier-midline" />
          <polyline points={objectPoints} className="fourier-object-line" />
          <polyline points={imagePoints} className="fourier-image-line" />
        </svg>
        <div className="fourier-legend"><span><i className="object" />{language === 'vi' ? 'Pattern lý tưởng' : 'Ideal pattern'}</span><span><i className="image" />{language === 'vi' ? 'Ảnh sau transfer' : 'Transferred image'}</span></div>
      </div>

      <div className="fourier-lower-grid">
        <div className="fourier-mtf-card">
          <div><strong>Ideal circular-pupil MTF</strong><small>ν = spatial frequency / cutoff</small></div>
          <svg viewBox="0 0 260 100" preserveAspectRatio="none" aria-label="Normalized circular pupil MTF curve"><polyline points={mtfPoints} /></svg>
        </div>
        <div className="lab-metrics fourier-metrics">
          <div><span>ν fundamental</span><strong>{result.fundamentalNormalizedFrequency.toFixed(2)}</strong></div>
          <div><span>{language === 'vi' ? 'Transfer fundamental' : 'Fundamental transfer'}</span><strong>{(result.fundamentalTransfer * 100).toFixed(0)}%</strong></div>
          <div><span>{language === 'vi' ? 'Harmonic truyền qua' : 'Passed harmonics'}</span><strong>{result.passedHarmonics}</strong></div>
          <div><span>{language === 'vi' ? 'Contrast chuẩn hóa' : 'Normalized contrast'}</span><strong>{result.contrast.toFixed(2)}</strong></div>
        </div>
      </div>

      <div className={`fourier-status ${beyondCutoff ? 'blocked' : 'passing'}`} data-fourier-status={beyondCutoff ? 'beyond-cutoff' : 'within-cutoff'}>
        {beyondCutoff
          ? (language === 'vi' ? 'Fundamental nằm ngoài cutoff trong mô hình chuẩn hóa này, nên ảnh hội tụ về mức trung bình.' : 'The fundamental lies beyond the normalized cutoff, so this teaching model collapses toward the mean level.')
          : (language === 'vi' ? 'Fundamental còn nằm trong passband; harmonic cao hơn bị suy giảm/cắt dần nên cạnh ảnh mềm đi.' : 'The fundamental remains in the passband; higher harmonics are progressively attenuated/cut, softening the reconstructed edges.')}
      </div>

      <div className="formula-box"><code>MTF(ν) = 2/π · [acos(ν) − ν√(1−ν²)], 0≤ν≤1</code><span>{language === 'vi' ? 'Square pattern dùng chuỗi Fourier odd-harmonic; mỗi harmonic được nhân với MTF theo frequency chuẩn hóa. Mô hình bỏ qua partial coherence thực, mask stack, aberration thực, polarization và mọi correction/proprietary scanner behavior.' : 'The square pattern uses an odd-harmonic Fourier series; each harmonic is multiplied by the MTF at its normalized frequency. The model omits real partial coherence, mask stack, real aberrations, polarization, and all proprietary scanner/correction behavior.'}</span></div>
      <div className="lab-sources"><a href="https://www.nist.gov/publications/modulation-transfer-function-measurement-method-electrically-addressed-spatial-light" target="_blank" rel="noreferrer">NIST · modulation transfer function ↗</a><a href="https://arxiv.org/abs/1802.07161" target="_blank" rel="noreferrer">Fourier optics: basic concepts ↗</a><a href="https://arxiv.org/abs/1808.04197" target="_blank" rel="noreferrer">Fourier Optics in the Classroom ↗</a></div>
    </section>
  )
}
