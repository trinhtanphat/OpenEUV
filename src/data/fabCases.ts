import fabCaseData from '../../evidence/fab-cases.json'

export type FabCaseKind = 'foundry' | 'research-fab' | 'scanner-interface' | 'mask-lifecycle'

export type FabCase = {
  id: string
  kind: FabCaseKind
  organization: string
  year: string
  title: string
  summary: string
  whyItMatters: string
  claimIds: string[]
  sourceUrls: string[]
  publicBoundary: string
  unknowns: string[]
}

export const fabCases = fabCaseData as FabCase[]
