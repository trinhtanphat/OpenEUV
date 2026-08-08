# 3D V4 — Illumination & Vacuum Concept Geometry

OpenEUV V4 extends the interactive atlas with original concept geometry for the illumination and vacuum/platform domains while keeping a strict separation between **documented function** and **illustrative geometry**.

These visuals are not ASML/ZEISS CAD, service drawings, chamber layouts or dimensional reconstructions.

## Why procedural geometry is first-class

The browser renders the new illumination/vacuum nodes procedurally in `ScannerScene.tsx` so the evidence experience does not depend on an external model download.

This gives three useful properties:

1. named evidence nodes remain selectable even when `/models/**` requests fail;
2. mobile/low-power rendering can omit secondary teaching details without losing evidence boundaries;
3. contributors can regenerate inspectable glTF artifacts from the source-controlled Python generator when they need a standalone asset file.

## Reproducible glTF generator

`tools/generate-concept-assets.py` now includes:

```text
illumination → public/models/euv-illumination-concept.gltf
vacuum       → public/models/euv-vacuum-platform-concept.gltf
```

Run:

```bash
python tools/generate-concept-assets.py illumination
python tools/generate-concept-assets.py vacuum
```

The generator emits only geometry primitives actually used by a preset. The two V4 presets use box/plate concept geometry, avoiding unnecessary high-segment meshes.

The generated files are optional materializations of the source model. The browser does not require them to provide the V4 nodes, which keeps external-asset failure from breaking the atlas.

## Illumination nodes

Stable node names include:

- `CollectorHandoff`
- `FieldMirrorConcept-1`
- `FieldMirrorConcept-2`
- `FieldMirrorConcept-3`
- `PupilShapingConcept`
- `MaskHandoffPlane`

Public evidence establishes the illumination subsystem and reflective EUV optical context. It does **not** establish the mirror count, mirror prescription, exact pupil-shaping implementation, dimensions or placements rendered by OpenEUV.

Accordingly:

- subsystem/function context can be evidence-backed;
- handoff relationships can be marked `public-inference`;
- mirror/pupil geometry remains `illustrative`.

Mappings live in `evidence/concept-labels-v4.json`.

## Vacuum/platform nodes

Stable node names include:

- `VacuumPlatform`
- `OpticalPathEnvelope`
- `SourceInterfaceConcept`
- `ReticleInterfaceConcept`
- `ProjectionInterfaceConcept`
- `WaferInterfaceConcept`
- `AirlockConcept`

`EUV-VACUUM-001` is the shared first-party evidence claim for the functional vacuum requirement. ASML publicly explains that EUV is absorbed even by air, requiring the EUV light path to be maintained in high vacuum; ZEISS likewise describes EUV optics operating with mirrors in vacuum.

The rectangular platform/envelope/interface shapes are original teaching geometry only. `AirlockConcept` is explicitly an illustrative systems-interface marker rather than a claim about commercial placement or construction.

## Runtime performance / LOD

No new external 3D-file fetch is required for the V4 browser experience; the runtime payload is source-code geometry plus evidence metadata.

`low` LOD reduces secondary concept density:

- illumination omits `FieldMirrorConcept-3`;
- vacuum omits `AirlockConcept`;
- global renderer pixel ratio, shadows, grid/detail and source animation are already reduced by the shared LOD policy.

Core evidence labels and subsystem boundaries remain available.

## Evidence behavior

The V4 pipeline is:

```text
procedural named node
  → concept-labels-v4.json
  → shared claim ID
  → Contextual Evidence Inspector
  → source / review state / unknowns
```

A label's screen position or concept mesh shape is not evidence. Evidence attaches to the **functional statement**, while geometry status explains how much visual detail is reconstructed versus invented for teaching.

## Verification coverage

`tests/concept-labels-v4.test.mjs` verifies:

- V4 labels reference known shared evidence IDs;
- every label has explicit geometry status/boundary text;
- vacuum labels are anchored to `EUV-VACUUM-001`;
- the reproducible generator retains stable V4 node/preset names.

`e2e/3d-v4.spec.ts` verifies:

- illumination and vacuum labels navigate into Contextual Evidence;
- stable named nodes are selectable;
- geometry status is visible;
- blocking all external `/models/**` requests does not remove the new procedural concept/evidence experience.

## Contribution boundary

Future visual improvements should add fidelity only when lawful public evidence supports it. Do not use proprietary CAD, leaked service drawings, private chamber layouts, exact confidential dimensions/tolerances or copied patent figures as claimed production geometry.
