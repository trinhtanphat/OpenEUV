import claims from '../../evidence/claims.json'
import unknowns from '../../evidence/unknowns.json'
import { assemblyStages } from './assemblyStages'
import { fabCases } from './fabCases'
import { glossary } from './glossary'
import { learningPath } from './learningPath'
import { patents } from './patents'
import { subsystems } from './subsystems'

export type AtlasSearchType = 'subsystem' | 'evidence' | 'unknown' | 'patent' | 'fab-case' | 'assembly' | 'learning' | 'glossary'

export type AtlasSearchItem = {
  id: string
  type: AtlasSearchType
  title: string
  titleVi?: string
  subtitle: string
  subtitleVi?: string
  keywords: string[]
  href: string
  targetSelector?: string
}

const sourceNames = (sources: Array<{ name?: string; url?: string }> | undefined) => (sources ?? []).flatMap((source) => [source.name ?? '', source.url ?? '']).filter(Boolean)

export const atlasSearchIndex: AtlasSearchItem[] = [
  ...subsystems.map((item): AtlasSearchItem => ({
    id: `subsystem:${item.id}`,
    type: 'subsystem',
    title: item.title,
    subtitle: item.subtitle,
    keywords: [item.id, item.short, item.description, ...item.facts, ...item.openQuestions],
    href: '#explorer',
    targetSelector: `button[data-subsystem-id="${item.id}"]`,
  })),
  ...claims.map((item): AtlasSearchItem => ({
    id: `evidence:${item.id}`,
    type: 'evidence',
    title: item.id,
    subtitle: item.claim,
    keywords: [item.component, `Class ${item.class}`, ...sourceNames(item.sources)],
    href: `#evidence-${item.id}`,
  })),
  ...unknowns.map((item): AtlasSearchItem => ({
    id: `unknown:${item.id}`,
    type: 'unknown',
    title: item.id,
    subtitle: item.question,
    keywords: [item.component, item.priority, item.status, ...(item.relatedClaimIds ?? [])],
    href: `#evidence-${item.id}`,
  })),
  ...patents.map((item): AtlasSearchItem => ({
    id: `patent:${item.id}`,
    type: 'patent',
    title: `${item.id} — ${item.title}`,
    subtitle: `${item.assignee} · priority ${item.priorityDate}`,
    keywords: [item.familyId, item.familyLabel, ...item.familyMembers, item.subsystem, ...item.linkedSubsystems, item.summary, item.applicationNumber ?? '', item.assignee],
    href: `#patent-${item.id}`,
  })),
  ...fabCases.map((item): AtlasSearchItem => ({
    id: `fab:${item.id}`,
    type: 'fab-case',
    title: item.title,
    subtitle: `${item.organization} · ${item.year}`,
    keywords: [item.id, item.organization, item.kind, item.summary, item.whyItMatters, ...item.claimIds, ...item.unknowns],
    href: `#fab-case-${item.id}`,
  })),
  ...assemblyStages.map((item): AtlasSearchItem => ({
    id: `assembly:${item.id}`,
    type: 'assembly',
    title: item.title.en,
    titleVi: item.title.vi,
    subtitle: item.summary.en,
    subtitleVi: item.summary.vi,
    keywords: [item.id, item.subsystem, item.publicEvidence.en, item.publicEvidence.vi, item.boundary.en, item.boundary.vi, ...item.claimIds, ...item.atlasNodes, ...item.outputs.en, ...item.outputs.vi, ...item.questions.en, ...item.questions.vi],
    href: '#assembly-explorer',
    targetSelector: `button[data-assembly-stage="${item.id}"]`,
  })),
  ...learningPath.map((item): AtlasSearchItem => ({
    id: `learning:${item.id}`,
    type: 'learning',
    title: `L${item.level} — ${item.title.en}`,
    titleVi: `L${item.level} — ${item.title.vi}`,
    subtitle: item.goal.en,
    subtitleVi: item.goal.vi,
    keywords: [item.id, ...item.topics.en, ...item.topics.vi, ...item.labs, item.contribution.en, item.contribution.vi],
    href: '#learning-path',
    targetSelector: `button[data-learning-level="${item.id}"]`,
  })),
  ...glossary.map((item): AtlasSearchItem => ({
    id: `glossary:${item.id}`,
    type: 'glossary',
    title: item.termEn,
    titleVi: item.termVi,
    subtitle: item.noteEn,
    subtitleVi: item.noteVi,
    keywords: [item.id, item.termEn, item.termVi, item.noteEn, item.noteVi],
    href: '#glossary',
    targetSelector: `[data-glossary-term="${item.id}"]`,
  })),
]
