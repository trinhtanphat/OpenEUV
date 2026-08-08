# 3D Asset Provenance

OpenEUV treats every visual asset as an evidence-bearing research artifact. A model can be useful without pretending to be proprietary production CAD.

## Reproducible source geometry

The small concept assets in this repository are source-controlled in two forms:

- inspectable glTF files in `public/models/`;
- a dependency-free Python source generator in `tools/generate-concept-assets.py`.

Regenerate one asset or all current concept assets with:

```bash
python tools/generate-concept-assets.py source
python tools/generate-concept-assets.py reticle
python tools/generate-concept-assets.py projection
python tools/generate-concept-assets.py all
```

The generator is the preferred editable source for these lightweight procedural concept assets. A `.blend` file is welcome for future hand-authored high-fidelity models, but it is not required when the source geometry is fully reproducible in code.

## `public/models/euv-source-collector-concept.gltf`

- **Author:** OpenEUV project-generated original geometry.
- **Format:** inspectable glTF 2.0 with an embedded data buffer.
- **Purpose:** lightweight browser visualization for the source / collector area of the conceptual scanner.
- **Repository license:** MIT.
- **Geometry status:** **illustrative / inferred**. It is not ASML, ZEISS, Cymer or TRUMPF CAD and is not a production blueprint.
- **Included visual concepts:** support frame, collector-like reflective elements, plasma marker, droplet path, droplet-generator body, laser-input path and an intermediate-focus-like output path.
- **Interactive evidence nodes:** labels such as `CollectorConcept` and `DropletGenerator` are linked to claim IDs through `evidence/concept-labels.json`.

## `public/models/euv-reticle-concept.gltf`

- **Author:** OpenEUV project-generated original geometry.
- **Format:** inspectable glTF 2.0 with embedded geometry.
- **Purpose:** communicate the relationship between a reticle-stage envelope, a reflective mask-like plate and shielding/stage-guide concepts.
- **Named nodes:** `ReticleFrame`, `ReflectiveMask`, `ShieldingConcept-L`, `ShieldingConcept-R`, `StageGuide-A`, `StageGuide-B`.
- **Geometry status:** mostly **illustrative**. The existence of a reflective reticle support and configurable shielding concepts is patent-supported; exact proportions, guides and placement are invented.
- **Public anchor:** `EP4239410A1` is tracked in `src/data/patents.ts` and `evidence/claims.json`.
- **Interaction:** evidence-backed screen-space labels and Contextual Evidence navigation can select/highlight named nodes without treating their positions/dimensions as measured production geometry.

## `public/models/euv-projection-concept.gltf`

- **Author:** OpenEUV project-generated original geometry.
- **Format:** inspectable glTF 2.0 with embedded geometry.
- **Purpose:** provide a browser-friendly projection-optics concept asset with stable component groups for evidence linking, highlighting and camera-tour work.
- **Named nodes:** `OpticalBench`, `MirrorConcept-1..4`, `MetrologyFrame`.
- **Geometry status:** **illustrative / inferred**. Public sources establish reflective EUV projection optics and the extraordinary scale/complexity of High-NA optics, but not the exact commercial mirror prescription or mechanical layout represented here.
- **Public anchors:** ZEISS High-NA public material and the patent set in `src/data/patents.ts`.

## Evidence-backed labels

`evidence/concept-labels.json` is the bridge between stable asset node names and research context. A concept label can carry:

- subsystem ID;
- display label;
- geometry status;
- related claim IDs;
- a note describing what the geometry does/does not claim.

Clicking a label in the atlas selects the corresponding named concept node and exposes its Contextual Evidence. This relationship is a UI/research link, not a declaration that the label coordinate is a measured commercial position.

## Adaptive LOD rule

The atlas selects `high`, `balanced` or `low` rendering quality using viewport/device/reduced-motion/save-data signals.

LOD may reduce:

- renderer pixel-ratio cap;
- antialiasing;
- shadows;
- grid/detail density;
- source animation;
- label density.

LOD must **not** remove evidence boundaries or make illustrative geometry look documented. Procedural fallbacks remain available regardless of LOD mode.

## Evidence boundary

Public sources establish functional concepts such as EUV target material, plasma generation, collector optics, reflective reticles, reflective projection optics, stages, metrology and contamination concerns. They do **not** establish the exact dimensions, production geometry, materials, tolerances, mounting interfaces, mirror prescription or internal service layout used by a current commercial machine.

Accordingly, undocumented properties are intentionally fictionalized for education. The relevant first-party, academic and patent evidence is tracked in `evidence/claims.json`, `evidence/unknowns.json`, `evidence/concept-labels.json` and `src/data/patents.ts`.

## Runtime fallback rule

Every optional external 3D asset must preserve a procedural fallback. A failed asset request must not leave the scanner blank or prevent subsystem selection. New assets should expose stable node names where practical so contributors can attach evidence, highlighting, tours and labels without replacing the file format.

## Contribution rule

For every new 3D asset, document meaningful geometry as one of:

- `documented-function` — the function/component is directly supported by a lawful public source;
- `inferred` / `public-inference` — reconstructed from multiple cited public sources with a written rationale;
- `illustrative` — intentionally invented geometry used only to communicate a function.

Do not submit proprietary CAD, leaked service assets, trade-secret drawings or other material without explicit public redistribution rights.
