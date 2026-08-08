import { buildInfo } from '../buildInfo'
import { t, type Language } from '../i18n'

export function Topbar({ language, onToggleLanguage }: { language: Language; onToggleLanguage: () => void }) {
  return (
    <header className="topbar">
      <a className="brand" href="#top"><span className="brand-mark">OE</span><span>OpenEUV <small>Atlas</small></span></a>
      <nav>
        <a href="#explorer">{t(language, 'navExplorer')}</a>
        <a href="#assembly-explorer">{language === 'vi' ? 'Lắp ráp' : 'Assembly'}</a>
        <a href="#learning-path">{language === 'vi' ? 'Học' : 'Learn'}</a>
        <a href="#labs">{t(language, 'navLabs')}</a>
        <a href="#patents">{t(language, 'navPatents')}</a>
        <a href="#fab-cases">{t(language, 'navFab')}</a>
        <a href="#source-library">{language === 'vi' ? 'Nguồn' : 'Sources'}</a>
        <a href="#unknowns">{t(language, 'navEvidence')}</a>
        <a href="#glossary">{language === 'vi' ? 'Thuật ngữ' : 'Glossary'}</a>
        <a href="#contribute">{t(language, 'navContribute')}</a>
      </nav>
      <button className="language-button" onClick={onToggleLanguage}>{t(language, 'language')}</button>
      <a className="github-button" href="https://github.com/trinhtanphat/OpenEUV" target="_blank" rel="noreferrer">GitHub</a>
    </header>
  )
}

export function Hero({ language }: { language: Language }) {
  return (
    <section className="hero" id="top" data-language={language}>
      <div className="hero-copy"><div className="kicker">✦ {t(language, 'heroKicker')}</div><h1>{t(language, 'heroTitle')}</h1><p>{t(language, 'heroBody')}</p><div className="hero-actions"><a className="primary-button" href="#explorer">◎ {t(language, 'explore')}</a><a className="secondary-button" href="#contribute">▦ {t(language, 'missions')}</a></div><div className="hero-stats"><div><strong>13.5 nm</strong><span>EUV wavelength</span></div><div><strong>0.55 NA</strong><span>High-NA generation</span></div><div><strong>25,000+</strong><span>High-NA illumination parts reported by ZEISS</span></div><div><strong>40,000+</strong><span>High-NA projection parts reported by ZEISS</span></div></div></div>
      <div className="hero-orbit" aria-hidden="true"><div className="orbital-ring"><span /></div><div className="wafer-disc"><b>13.5</b><small>nm</small></div></div>
    </section>
  )
}

export function FeatureStrip() {
  return <section className="feature-strip"><div><span className="feature-icon">◫</span><strong>3D Atlas</strong><span>Interactive subsystem reconstruction</span></div><div><span className="feature-icon">λ</span><strong>Physics labs</strong><span>NA, anamorphic, masks and multilayers</span></div><div><span className="feature-icon">⌘</span><strong>Evidence graph</strong><span>Locally validated claims, reviews and unknowns</span></div><div><span className="feature-icon">≡</span><strong>Patent map</strong><span>Public disclosures by subsystem</span></div></section>
}

const missions = [
  ['3D', 'Model a subsystem', 'Create original GLB/glTF assets and document every evidence-backed geometry choice.'],
  ['EDU', 'Extend Assembly + Learning', 'Turn public subsystem knowledge into clear systems-engineering stages and beginner-to-research lessons.'],
  ['OPTICS', 'Extend High-NA labs', 'Visualize reflective paths, mask effects and NA tradeoffs.'],
  ['PATENT', 'Map a patent family', 'Turn public disclosures into structured subsystem evidence.'],
  ['EVIDENCE', 'Resolve an unknown', 'Find stronger lawful sources, review claims and improve confidence without hiding uncertainty.'],
  ['SIM', 'Add a physics lab', 'Implement educational models with explicit assumptions and reproducible tests.'],
  ['FAB', 'Map fab integration', 'Document first-party EUV process milestones with public boundaries and explicit unknowns.'],
  ['DATA', 'Curate a public dataset', 'Pin source, revision, license, range and provenance before adding reusable measurements.'],
  ['I18N', 'Improve EN / VI', 'Translate UI and technical explanations without duplicating claim IDs.'],
  ['QA', 'Strengthen validation', 'Add schema, accessibility, fallback and browser-behavior coverage.'],
  ['PERF', 'Run real-device benchmarks', 'Collect anonymized method-v2 WebGL/WebGPU captures on real hardware; never fabricate results.'],
]

export function ContributorSection({ language }: { language: Language }) {
  return (
    <section className="contribute" id="contribute" data-language={language}><div className="eyebrow">{language === 'vi' ? 'Bệ phóng contributor' : 'Contributor launchpad'}</div><h2>{language === 'vi' ? 'Đừng chỉ đọc. Hãy cùng lập bản đồ những gì nhân loại đã công khai.' : "Don't just read it. Map what humanity publicly knows."}</h2><p>{language === 'vi' ? 'Chọn một hướng: 3D, education, optics, physics, patent, fab, public data, frontend, QA, benchmark, dịch thuật EN/VI hoặc evidence review.' : 'Pick a lane: 3D, education, optics, physics, patents, fab context, public data, frontend, QA, real-device benchmarks, translation, or evidence review.'}</p><div className="mission-grid">{missions.map(([tag, title, text]) => <article key={tag}><span>{tag}</span><h3>{title}</h3><p>{text}</p></article>)}</div><a className="primary-button" href="https://github.com/trinhtanphat/OpenEUV/issues" target="_blank" rel="noreferrer">{language === 'vi' ? 'Mở danh sách nhiệm vụ contributor' : 'Open contributor missions'}</a></section>
  )
}

export function Footer({ language }: { language: Language }) {
  const buildLabel = buildInfo.commit === 'unknown' ? `v${buildInfo.version} · commit unknown` : `v${buildInfo.version} · ${buildInfo.commit}`
  return <footer><div><span className="brand-mark">OE</span><strong>OpenEUV</strong><code data-build-provenance title={`build source: ${buildInfo.source}`}>{buildLabel}</code></div><p>{language === 'vi' ? 'Tái dựng từ nguồn công khai cho giáo dục và nghiên cứu. Build metadata chỉ định danh bản public đang deploy, không phải telemetry người dùng.' : 'Public-source reconstruction for education and research. Build metadata identifies the public deployed build; it is not user telemetry.'}</p></footer>
}
