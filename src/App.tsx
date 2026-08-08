import { useState } from 'react'
import { AssemblyExplorer } from './components/AssemblyExplorer'
import { AtlasSearch } from './components/AtlasSearch'
import { BuildMachine } from './components/BuildMachine'
import { ContributorSection, FeatureStrip, Footer, Hero, Topbar } from './components/LayoutSections'
import { EvidenceDashboard } from './components/EvidenceDashboard'
import { EvidenceGraph } from './components/EvidenceGraph'
import { ExplorerSection } from './components/ExplorerSection'
import { FabCaseStudies } from './components/FabCaseStudies'
import { FabFlow } from './components/FabFlow'
import { LearningPath } from './components/LearningPath'
import { PatentExplorer } from './components/PatentExplorer'
import { ResearchWorkbench } from './components/ResearchWorkbench'
import { ResolutionSimulator } from './components/ResolutionSimulator'
import { TechnicalGlossary } from './components/TechnicalGlossary'
import { TsmcTimeline } from './components/TsmcTimeline'
import type { Language } from './i18n'

export default function App() {
  const [language, setLanguage] = useState<Language>('en')
  return (
    <main>
      <Topbar language={language} onToggleLanguage={() => setLanguage((current) => current === 'en' ? 'vi' : 'en')} />
      <Hero language={language} />
      <AtlasSearch language={language} />
      <ExplorerSection language={language} />
      <FeatureStrip />
      <AssemblyExplorer language={language} />
      <LearningPath language={language} />
      <ResearchWorkbench language={language} />
      <div className="two-col"><ResolutionSimulator /><BuildMachine /></div>
      <PatentExplorer />
      <FabFlow />
      <FabCaseStudies />
      <TsmcTimeline />
      <EvidenceDashboard />
      <EvidenceGraph />
      <TechnicalGlossary language={language} />
      <ContributorSection language={language} />
      <Footer language={language} />
    </main>
  )
}