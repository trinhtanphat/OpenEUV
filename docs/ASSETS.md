# 3D Asset Provenance

OpenEUV treats every visual asset as an evidence-bearing research artifact. A model can be useful without pretending to be proprietary production CAD.

## `public/models/euv-source-collector-concept.gltf`

- **Author:** OpenEUV project-generated original geometry.
- **Format:** inspectable glTF 2.0 with an embedded data buffer.
- **Purpose:** lightweight browser visualization for the source / collector area of the conceptual scanner.
- **Repository license:** MIT.
- **Geometry status:** **illustrative / inferred**. It is not ASML, ZEISS, Cymer or TRUMPF CAD and is not a production blueprint.
- **Included visual concepts:** support frame, collector-like reflective elements, plasma marker, droplet path, droplet-generator body, laser-input path and an intermediate-focus-like output path.

### Evidence boundary

Public sources establish functional concepts such as EUV target material, plasma generation, collector optics, contamination concerns and the presence of an EUV source subsystem. They do **not** establish the exact dimensions, production geometry, materials, tolerances, mounting interfaces or internal service layout used by a current commercial machine.

Accordingly, those properties are intentionally fictionalized in this asset for education. The relevant first-party and patent evidence is tracked in `evidence/claims.json` and `src/data/patents.ts`.

## Contribution rule

For every new 3D asset, document meaningful geometry as one of:

- `documented` — directly supported by a lawful public source;
- `inferred` — reconstructed from multiple cited public sources with a written rationale;
- `illustrative` — intentionally invented geometry used only to communicate a function.

Do not submit proprietary CAD, leaked service assets, trade-secret drawings or other material without explicit public redistribution rights.
