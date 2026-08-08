# Evidence provenance trace

OpenEUV V5 adds a deterministic reverse view from an evidence claim to the places where that claim is already used in the atlas.

## What is traced

The trace currently indexes only explicit repository mappings:

- concept-label / named 3D node → claim IDs;
- Assembly Explorer stage → claim IDs;
- fab case → claim IDs.

For each evidence claim the Evidence Dashboard shows:

- evidence class, confidence and review state already stored on the claim/review records;
- direct public source links from the claim record;
- mapped OpenEUV usages with links back to the relevant atlas/fab section;
- an explicit provenance gap when no mapped usage exists.

## What is not inferred

The reverse index does not discover or invent semantic relationships. A claim is connected to a node, stage or case only when that consumer already declares the claim ID in repository data.

A missing link therefore remains visible as missing. It is not evidence that a real commercial system lacks the relationship; it only means OpenEUV has no explicit repository mapping for it yet.

## Implementation

- `src/lib/evidenceUsage.mjs` builds and summarizes the deterministic reverse index.
- `tests/evidence-usage.test.mjs` verifies explicit-only mapping, deduplication and unmapped-claim reporting.
- `src/components/EvidenceDashboard.tsx` renders the trace UI.
- `e2e/provenance-trace.spec.ts` covers source visibility and claim → fab-case deep links.

## Contributor rule

When adding a new usage mapping, reference the existing shared claim ID in the owning dataset/component metadata. Do not duplicate a claim just to make a UI link, and do not connect a claim to geometry/process context that the public source does not establish.
