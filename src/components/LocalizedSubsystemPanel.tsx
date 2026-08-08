import { subsystems, type Subsystem } from '../data/subsystems'
import { subsystemVi, t, type Language } from '../i18n'
import { EvidenceInspector } from './EvidenceInspector'

const confidenceLabel: Record<Language, Record<string, string>> = {
  en: { official: 'Officially documented', patent: 'Patent-supported', academic: 'Academic', inferred: 'Public-source inference', unknown: 'Unknown' },
  vi: { official: 'Nguồn chính thức', patent: 'Có patent hỗ trợ', academic: 'Nguồn học thuật', inferred: 'Suy luận từ nguồn công khai', unknown: 'Chưa biết' },
}

export function LocalizedSubsystemPanel({
  selected,
  selectedNode,
  language,
  onSelect,
  onNodeSelect,
}: {
  selected: Subsystem
  selectedNode: string | null
  language: Language
  onSelect: (id: string) => void
  onNodeSelect: (nodeName: string | null) => void
}) {
  const localized = language === 'vi' ? subsystemVi[selected.id] : undefined
  return (
    <aside className="subsystem-panel" data-language={language}>
      <div className="subsystem-nav">{subsystems.map((item) => <button key={item.id} data-subsystem-id={item.id} onClick={() => onSelect(item.id)} className={item.id === selected.id ? 'active' : ''}><span>{item.short}</span>{language === 'vi' ? subsystemVi[item.id]?.title ?? item.title : item.title}</button>)}</div>
      <div className="subsystem-detail">
        <div className={`confidence ${selected.confidence}`}>{confidenceLabel[language][selected.confidence]}</div>
        <h3>{localized?.title ?? selected.title}</h3>
        <div className="subtitle">{localized?.subtitle ?? selected.subtitle}</div>
        <p>{localized?.description ?? selected.description}</p>
        <h4>{t(language, 'subsystemKnown')}</h4>
        <ul>{(localized?.facts ?? selected.facts).map((fact) => <li key={fact}>{fact}</li>)}</ul>
        <h4>{t(language, 'subsystemQuestions')}</h4>
        <ul className="questions">{(localized?.openQuestions ?? selected.openQuestions).map((question) => <li key={question}>{question}</li>)}</ul>
        <EvidenceInspector subsystemId={selected.id} nodeName={selectedNode} onNodeSelect={onNodeSelect} language={language} />
      </div>
    </aside>
  )
}
