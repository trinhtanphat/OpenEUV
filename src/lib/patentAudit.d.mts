export type PatentCompleteness = {
  score: number
  percent: number
  present: number
  total: number
  missing: string[]
}

export function patentMetadataCompleteness(record: unknown): PatentCompleteness
export function auditPatentRecords(records: unknown[]): {
  ok: boolean
  errors: string[]
  warnings: string[]
  publications: number
  families: number
  averageCompleteness: number
}
