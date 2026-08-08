import { useMemo, useState } from 'react'
import { assemblyStages } from '../data/assemblyStages'
import type { Language } from '../i18n'

const statusLabel: Record<Language, Record<string, string>> = {
  en: {
    'documented-function': 'Documented function',
    'public-inference': 'Public-source inference',
    illustrative: 'Illustrative structure',
  },
  vi: {
    'documented-function': 'Chức năng có nguồn công khai',
    'public-inference': 'Suy luận từ nguồn công khai',
    illustrative: 'Cấu trúc minh họa',
  },
}

export function AssemblyExplorer({ language }: { language: Language }) {
  const [selectedId, setSelectedId] = useState(assemblyStages[0].id)
  const selected = useMemo(() => assemblyStages.find((stage) => stage.id === selectedId) ?? assemblyStages[0], [selectedId])
  const completedBefore = useMemo(() => new Set(selected.dependencies), [selected.dependencies])

  return (
    <section className="research-section assembly-explorer" id="assembly-explorer" data-language={language}>
      <div className="research-heading">
        <div>
          <span className="eyebrow">{language === 'vi' ? 'How it’s made — public-source systems view' : 'How it’s made — public-source systems view'}</span>
          <h2>{language === 'vi' ? 'Assembly Explorer: từ module đến scanner hoàn chỉnh' : 'Assembly Explorer: modules to integrated scanner'}</h2>
          <p>{language === 'vi'
            ? 'Một bản đồ lắp ráp ở mức hệ thống để học cách các subsystem liên hệ với nhau. Đây không phải hướng dẫn chế tạo laser/plasma, service manual hay blueprint sản xuất.'
            : 'A system-level assembly map for learning how subsystems relate. It is not a laser/plasma construction guide, service manual, or production blueprint.'}</p>
        </div>
        <div className="assembly-progress" aria-label={language === 'vi' ? 'Tiến trình các stage' : 'Assembly stage progress'}>
          <strong>{assemblyStages.findIndex((stage) => stage.id === selected.id) + 1}/{assemblyStages.length}</strong>
          <span>{language === 'vi' ? 'stage đang xem' : 'selected stage'}</span>
        </div>
      </div>

      <div className="assembly-layout">
        <nav className="assembly-stage-list" aria-label={language === 'vi' ? 'Các stage tích hợp' : 'Integration stages'}>
          {assemblyStages.map((stage, index) => (
            <button
              key={stage.id}
              data-assembly-stage={stage.id}
              className={stage.id === selected.id ? 'active' : ''}
              onClick={() => setSelectedId(stage.id)}
            >
              <span className="assembly-index">{String(index + 1).padStart(2, '0')}</span>
              <span><b>{stage.title[language]}</b><small>{stage.subsystem}</small></span>
            </button>
          ))}
        </nav>

        <article className="assembly-stage-detail" data-assembly-selected={selected.id}>
          <div className="assembly-status-row">
            <span className={`assembly-status ${selected.status}`}>{statusLabel[language][selected.status]}</span>
            <code>{selected.id}</code>
          </div>
          <h3>{selected.title[language]}</h3>
          <p className="assembly-summary">{selected.summary[language]}</p>

          <div className="assembly-detail-grid">
            <div>
              <h4>{language === 'vi' ? 'Chứng cứ công khai hỗ trợ gì?' : 'What does public evidence support?'}</h4>
              <p>{selected.publicEvidence[language]}</p>
            </div>
            <div>
              <h4>{language === 'vi' ? 'Ranh giới — chưa được suy diễn' : 'Boundary — not inferred'}</h4>
              <p>{selected.boundary[language]}</p>
            </div>
          </div>

          <h4>{language === 'vi' ? 'Đầu ra học tập' : 'Learning outputs'}</h4>
          <ul className="assembly-output-list">{selected.outputs[language].map((item) => <li key={item}>{item}</li>)}</ul>

          <h4>{language === 'vi' ? 'Phụ thuộc module' : 'Module dependencies'}</h4>
          <div className="assembly-dependencies">
            {selected.dependencies.length === 0 && <span>{language === 'vi' ? 'Stage nền tảng — không có dependency trước đó.' : 'Foundation stage — no earlier dependency.'}</span>}
            {selected.dependencies.map((dependency) => {
              const stage = assemblyStages.find((item) => item.id === dependency)
              return <button key={dependency} className={completedBefore.has(dependency) ? 'mapped' : ''} onClick={() => setSelectedId(dependency)}>{stage?.title[language] ?? dependency}</button>
            })}
          </div>
        </article>
      </div>
    </section>
  )
}
