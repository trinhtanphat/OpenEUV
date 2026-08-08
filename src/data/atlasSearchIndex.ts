import claims from '../../evidence/claims.json'
import unknowns from '../../evidence/unknowns.json'
import { assemblyStages } from './assemblyStages'
import { fabCases } from './fabCases'
import { glossary } from './glossary'
import { learningPath } from './learningPath'
import { patents } from './patents'
import { subsystems } from './subsystems'

export type AtlasSearchType = 'subsystem' | 'evidence' | 'unknown' | 'patent' | 'fab-case' | 'assembly' | 'learning' | 'lab' | 'glossary'

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

const labItems: AtlasSearchItem[] = [
  {
    id: 'lab:high-na',
    type: 'lab',
    title: 'Low-NA vs High-NA',
    titleVi: 'Low-NA vs High-NA',
    subtitle: 'Educational NA 0.33 ↔ 0.55 resolution comparison',
    subtitleVi: 'So sánh phân giải giáo dục NA 0,33 ↔ 0,55',
    keywords: ['high na', 'low na', 'numerical aperture', 'khẩu độ số', '0.33', '0.55', 'resolution', 'HIGHNA-NA-001'],
    href: '#high-na-lab',
  },
  {
    id: 'lab:anamorphic',
    type: 'lab',
    title: 'Anamorphic 4× / 8× field',
    titleVi: 'Anamorphic 4× / 8×',
    subtitle: 'Visualize public High-NA anisotropic demagnification geometry',
    subtitleVi: 'Minh họa hình học demagnification bất đẳng hướng High-NA công khai',
    keywords: ['anamorphic', '4x', '8x', '4×', '8×', 'high na', 'field', 'HIGHNA-ANAMORPHIC-001'],
    href: '#anamorphic-lab',
  },
  {
    id: 'lab:fourier',
    type: 'lab',
    title: 'Fourier imaging & MTF',
    titleVi: 'Fourier imaging & MTF',
    subtitle: 'Normalized spatial-frequency and circular-pupil transfer learning lab',
    subtitleVi: 'Lab spatial-frequency và circular-pupil transfer chuẩn hóa',
    keywords: ['fourier', 'mtf', 'spatial frequency', 'pupil', 'transfer function', 'imaging'],
    href: '#fourier-imaging-lab',
  },
  {
    id: 'lab:vacuum-mirrors',
    type: 'lab',
    title: 'Why EUV needs vacuum & mirrors',
    titleVi: 'Vì sao EUV cần vacuum & mirrors',
    subtitle: 'Normalized absorption and cumulative reflection-transfer concept lab',
    subtitleVi: 'Lab khái niệm về hấp thụ chuẩn hóa và transfer phản xạ tích lũy',
    keywords: ['vacuum', 'mirrors', 'reflective optics', 'absorption', 'hấp thụ', 'euv path', 'EUV-VACUUM-001'],
    href: '#mirror-vacuum-concept-lab',
  },
  {
    id: 'lab:multilayer',
    type: 'lab',
    title: 'Multilayer & polarization',
    titleVi: 'Multilayer & phân cực',
    subtitle: 'Characteristic-matrix thin-film interference learning model',
    subtitleVi: 'Mô hình học giao thoa màng mỏng characteristic-matrix',
    keywords: ['multilayer', 'mo si', 'molybdenum silicon', 'polarization', 'phân cực', 'reflectivity', 'ACADEMIC-MOSI-MULTILAYER-001'],
    href: '#multilayer-lab',
  },
  {
    id: 'lab:mask-3d',
    type: 'lab',
    title: 'Reflective-mask 3D effects',
    titleVi: 'Hiệu ứng 3D của reflective mask',
    subtitle: 'Normalized oblique-incidence and geometric shadowing intuition',
    subtitleVi: 'Trực giác chuẩn hóa về chiếu xiên và geometric shadowing',
    keywords: ['mask 3d', 'reticle', 'shadowing', 'oblique incidence', 'reflective mask', 'ACADEMIC-EUV-MASK-MODEL-001'],
    href: '#mask-3d-lab',
  },
  {
    id: 'lab:aberration',
    type: 'lab',
    title: 'Aberration, focus & overlay',
    titleVi: 'Quang sai, focus & overlay',
    subtitle: 'Normalized image-quality and alignment concept lab',
    subtitleVi: 'Lab khái niệm chuẩn hóa về chất lượng ảnh và căn chỉnh',
    keywords: ['aberration', 'quang sai', 'focus', 'overlay', 'leveling', 'coma', 'astigmatism'],
    href: '#aberration-lab',
  },
  {
    id: 'lab:stage',
    type: 'lab',
    title: 'Wafer stage · 6 degrees of freedom',
    titleVi: 'Wafer stage · 6 bậc tự do',
    subtitle: 'Conceptual X/Y/Z + Rx/Ry/Rz motion learning lab',
    subtitleVi: 'Lab chuyển động khái niệm X/Y/Z + Rx/Ry/Rz',
    keywords: ['wafer stage', '6 dof', '6-dof', 'six degrees of freedom', 'x y z', 'rx ry rz', 'metrology'],
    href: '#stage-lab',
  },
]

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
  ...labItems,
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
