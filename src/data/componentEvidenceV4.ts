import v4Labels from '../../evidence/concept-labels-v4.json'
import {
  assetNodeEvidence as legacyAssetNodeEvidence,
  assetNodeGeometryStatus as legacyAssetNodeGeometryStatus,
  subsystemAssetNodes as legacySubsystemAssetNodes,
} from './componentEvidence'

type ConceptLabel = {
  node: string
  subsystem: string
  geometryStatus: string
  claimIds: string[]
}

const labels = v4Labels as ConceptLabel[]

export const assetNodeEvidence: Record<string, string[]> = {
  ...legacyAssetNodeEvidence,
  ...Object.fromEntries(labels.map((label) => [label.node, label.claimIds])),
}

export const assetNodeGeometryStatus: Record<string, string> = {
  ...legacyAssetNodeGeometryStatus,
  ...Object.fromEntries(labels.map((label) => [label.node, label.geometryStatus])),
}

export function subsystemAssetNodes(subsystemId: string) {
  return Array.from(new Set([
    ...legacySubsystemAssetNodes(subsystemId),
    ...labels.filter((label) => label.subsystem === subsystemId).map((label) => label.node),
  ])).sort()
}
