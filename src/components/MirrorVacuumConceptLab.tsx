import { useMemo, useState } from 'react'
import claims from '../../evidence/claims.json'
import { compareNormalizedEuvPaths } from '../lib/euvPathConcept.mjs'
import type { Language } from '../i18n'

const vacuumClaim = claims.find((claim) => claim.id === 'EUV-VACUUM-001')
const pct = (value: number) => `${(value * 100).toFixed(1)}%`

export function MirrorVacuumConceptLab({ language }: { language: Language }) {
  const [absorptionIndex, setAbsorptionIndex] = useState(0.78)
  const [pathLength, setPathLength] = useState(3)
  const [mirrorTransfer, setMirrorTransfer] = useState(0.86)
  const [reflections, setReflections] = useState(4)
  const result = useMemo(() => compareNormalizedEuvPaths({
    absorptionIndex,
    pathLength,
    lowAbsorptionFraction: 0.08,
    perReflectionTransfer: mirrorTransfer,
    reflections,
  }), [absorptionIndex, pathLength, mirrorTransfer, reflections])

  return (
    <section className="lab-card mirror-vacuum-lab" id="mirror-vacuum-concept-lab" data-language={language}>
      <div className="lab-head">
        <div><span className="lab-tag">EDU V5 · EUV PATH</span><h3>{language === 'vi' ? 'Vì sao EUV cần vacuum & mirrors?' : 'Why does EUV need vacuum & mirrors?'}</h3></div>
        <span className="evidence-pill official">EUV-VACUUM-001 · Class A</span>
      </div>
      <p className="muted">{language === 'vi'
        ? 'Lab này chỉ minh họa trực giác: một môi trường hấp thụ mạnh làm tín hiệu suy giảm nhanh, còn đường truyền có hấp thụ thấp giữ được nhiều tín hiệu hơn; chuỗi gương vẫn có tổn hao tích lũy. Tất cả giá trị là chuẩn hóa, không phải áp suất, coating hay thông số máy thương mại.'
        : 'This lab shows intuition only: a strongly absorbing medium rapidly attenuates a signal, a low-absorption path preserves more of it, and a mirror chain still accumulates transfer loss. Every control is normalized — not pressure, coating data, or a commercial-tool parameter.'}</p>

      <div className="lab-controls two mirror-vacuum-controls">
        <label><span>{language === 'vi' ? 'Absorption index chuẩn hóa' : 'Normalized absorption index'} <b>{absorptionIndex.toFixed(2)}</b></span><input aria-label="Normalized absorption index" type="range" min="0" max="1" step="0.01" value={absorptionIndex} onChange={(event) => setAbsorptionIndex(Number(event.target.value))} /></label>
        <label><span>{language === 'vi' ? 'Độ dài đường truyền chuẩn hóa' : 'Normalized path length'} <b>{pathLength.toFixed(1)}</b></span><input aria-label="Normalized path length" type="range" min="0.5" max="6" step="0.1" value={pathLength} onChange={(event) => setPathLength(Number(event.target.value))} /></label>
        <label><span>{language === 'vi' ? 'Transfer mỗi lần phản xạ chuẩn hóa' : 'Normalized per-reflection transfer'} <b>{mirrorTransfer.toFixed(2)}</b></span><input aria-label="Normalized per-reflection transfer" type="range" min="0.55" max="1" step="0.01" value={mirrorTransfer} onChange={(event) => setMirrorTransfer(Number(event.target.value))} /></label>
        <label><span>{language === 'vi' ? 'Số lần phản xạ minh họa' : 'Illustrative reflection count'} <b>{reflections}</b></span><input aria-label="Illustrative reflection count" type="range" min="1" max="8" step="1" value={reflections} onChange={(event) => setReflections(Number(event.target.value))} /></label>
      </div>

      <div className="mirror-vacuum-paths" role="img" aria-label={language === 'vi' ? 'So sánh đường truyền hấp thụ, hấp thụ thấp và chuỗi phản xạ chuẩn hóa' : 'Normalized absorbing, low-absorption and reflective path comparison'}>
        <article data-path-kind="absorbing"><div><span>{language === 'vi' ? 'Môi trường hấp thụ tham chiếu' : 'Reference absorbing medium'}</span><strong>{pct(result.absorbingMedium)}</strong></div><i><b style={{ width: pct(result.absorbingMedium) }} /></i><small>{language === 'vi' ? 'Normalized remaining signal' : 'Normalized remaining signal'}</small></article>
        <article data-path-kind="low-absorption"><div><span>{language === 'vi' ? 'Đường truyền hấp thụ thấp' : 'Low-absorption path'}</span><strong>{pct(result.lowAbsorptionMedium)}</strong></div><i><b style={{ width: pct(result.lowAbsorptionMedium) }} /></i><small>{language === 'vi' ? 'Proxy khái niệm cho lý do dùng vacuum' : 'Concept proxy for the vacuum requirement'}</small></article>
        <article data-path-kind="mirror-chain"><div><span>{language === 'vi' ? 'Chuỗi phản xạ' : 'Reflective chain'}</span><strong>{pct(result.mirrorChain)}</strong></div><i><b style={{ width: pct(result.mirrorChain) }} /></i><small>{reflections} {language === 'vi' ? 'reflection minh họa' : 'illustrative reflections'}</small></article>
      </div>

      <div className="formula-box"><code>T = exp(-a · L) · M = rᴺ</code><span>{language === 'vi' ? 'a, L và r là đại lượng chuẩn hóa dùng để học tính đơn điệu và tổn hao tích lũy. Không ánh xạ chúng sang pressure, material recipe hay scanner setting thật.' : 'a, L and r are normalized teaching quantities for monotonic attenuation and cumulative loss. Do not map them to real pressure, material recipes or scanner settings.'}</span></div>

      <div className="mirror-vacuum-evidence">
        <strong>{language === 'vi' ? 'Public evidence boundary' : 'Public evidence boundary'}</strong>
        <p>{vacuumClaim?.claim ?? 'Public first-party sources establish the vacuum/reflective-optics requirement; exact commercial implementation remains outside this model.'}</p>
        <div>{vacuumClaim?.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.name} ↗</a>)}</div>
      </div>
    </section>
  )
}
