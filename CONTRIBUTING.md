# Contributing to OpenEUV

OpenEUV welcomes developers, 3D artists, semiconductor engineers, optics/physics students, patent researchers and technical writers.

## Pick a mission

Look for issues tagged in the title (`[3D]`, `[OPTICS]`, `[SIM]`, `[PATENT]`, `[FAB]`, `[EVIDENCE]`). A useful contribution makes one part of the atlas more interactive, more accurate, better sourced, or easier to learn.

## Evidence before certainty

Before changing a technical fact, read [`SOURCING_POLICY.md`](SOURCING_POLICY.md). Public evidence is required for claims presented as facts. Inference is welcome when explicitly labeled.

## 3D contributions

- Prefer `.glb` / `.gltf` for browser assets.
- Keep source `.blend` files when practical.
- Use original geometry; do not copy proprietary CAD.
- Add provenance and license metadata.
- Optimize meshes/textures for web delivery.
- Mark geometry as `documented`, `inferred`, or `illustrative`.

## Code contributions

```bash
npm install
npm run typecheck
npm run build
```

Keep the experience usable on laptop GPUs and mobile devices. Educational approximations must not be presented as process predictions.

## Research contributions

A research PR should ideally add structured claims in `evidence/claims.json`, links to public sources, confidence class, concise reasoning, and a list of what remains unknown.
