import { glossary } from '../data/glossary'
import { t, type Language } from '../i18n'

export function TechnicalGlossary({ language }: { language: Language }) {
  return (
    <section className="research-section glossary-section" id="glossary" data-language={language}>
      <div className="research-heading"><div><span className="eyebrow">{t(language, 'glossaryEyebrow')}</span><h2>{t(language, 'glossaryTitle')}</h2><p>{t(language, 'glossaryBody')}</p></div><div className="glossary-count"><strong>{glossary.length}</strong><span>{language === 'vi' ? 'thuật ngữ dùng chung' : 'shared terms'}</span></div></div>
      <div className="glossary-grid">{glossary.map((entry) => <article key={entry.id} data-glossary-term={entry.id}><div className="glossary-terms"><strong>{language === 'vi' ? entry.termVi : entry.termEn}</strong><span>{language === 'vi' ? entry.termEn : entry.termVi}</span></div><p>{language === 'vi' ? entry.noteVi : entry.noteEn}</p></article>)}</div>
      <div className="glossary-policy">{language === 'vi' ? 'Quy ước: claim ID, patent/publication number, URL nguồn, evidence class và đơn vị kỹ thuật không được dịch hoặc tạo bản sao riêng theo ngôn ngữ.' : 'Convention: claim IDs, patent/publication numbers, source URLs, evidence classes and technical units are never translated or duplicated per language.'}</div>
    </section>
  )
}
