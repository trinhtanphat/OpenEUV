import labels from '../../evidence/concept-labels.json'
import type { LodMode } from '../lib/lodPolicy.mjs'

const layout: Record<string, { left: string; top: string }> = {
  CollectorConcept: { left: '18%', top: '34%' },
  DropletGenerator: { left: '8%', top: '55%' },
  ReflectiveMask: { left: '38%', top: '22%' },
  'ShieldingConcept-L': { left: '28%', top: '42%' },
  OpticalBench: { left: '55%', top: '28%' },
  'MirrorConcept-1': { left: '66%', top: '48%' },
}

type ConceptLabel = {
  node: string
  subsystem: string
  label: string
  geometryStatus: string
  claimIds: string[]
  note: string
}

export function ConceptLabelsOverlay({
  subsystemId,
  selectedNode,
  lodMode,
  onNodeSelect,
}: {
  subsystemId: string
  selectedNode: string | null
  lodMode: LodMode
  onNodeSelect: (nodeName: string) => void
}) {
  const relevant = (labels as ConceptLabel[]).filter((item) => item.subsystem === subsystemId)
  const visible = lodMode === 'high'
    ? relevant
    : selectedNode
      ? relevant.filter((item) => item.node === selectedNode)
      : relevant.slice(0, 1)

  if (visible.length === 0) return null

  return (
    <div className="concept-label-overlay" data-lod-mode={lodMode} aria-label="Evidence-backed 3D concept labels">
      {visible.map((item, index) => {
        const position = layout[item.node] ?? { left: `${20 + index * 22}%`, top: `${28 + (index % 2) * 28}%` }
        return (
          <button
            key={item.node}
            type="button"
            data-concept-label={item.node}
            className={selectedNode === item.node ? 'active' : ''}
            style={position}
            title={`${item.note} Claims: ${item.claimIds.join(', ')}`}
            onClick={() => onNodeSelect(item.node)}
          >
            <span>{item.label}</span>
            <small>{item.geometryStatus}</small>
          </button>
        )
      })}
    </div>
  )
}
