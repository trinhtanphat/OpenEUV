export type LiteratureCitationRecord = {
  doi: string
  title: string
  year: number
  authors: string[]
  sourceName?: string
  sourceUrl?: string
  publicationType: 'journal' | 'conference' | 'preprint'
}

export type AssignedCitationKey<T = LiteratureCitationRecord> = {
  record: T
  key: string
}

export type CslJsonRecord = {
  id: string
  type: 'article-journal' | 'paper-conference' | 'manuscript'
  title: string
  author: Array<{ literal: string }>
  issued: { 'date-parts': number[][] }
  DOI: string
  URL?: string
  note: string
}

export function baseCitationKey(record: LiteratureCitationRecord): string
export function assignCitationKeys<T extends LiteratureCitationRecord>(records: T[], keyFactory?: (record: T) => string): Array<AssignedCitationKey<T>>
export function literatureToBibtex(records: LiteratureCitationRecord[]): string
export function literatureToCslJson(records: LiteratureCitationRecord[]): CslJsonRecord[]
export function serializeLiteratureCslJson(records: LiteratureCitationRecord[]): string
