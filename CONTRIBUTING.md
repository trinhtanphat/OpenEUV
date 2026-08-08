# Contributing to OpenEUV

OpenEUV welcomes developers, 3D artists, semiconductor engineers, optics/physics students, patent researchers, translators and technical writers.

## Pick a mission

Look for issues tagged in the title (`[3D]`, `[OPTICS]`, `[SIM]`, `[PATENT]`, `[FAB]`, `[EVIDENCE]`, `[MOTION]`, `[I18N]`). A useful contribution makes one part of the atlas more interactive, more accurate, better sourced, or easier to learn.

## Evidence before certainty

Before changing a technical fact, read [`SOURCING_POLICY.md`](SOURCING_POLICY.md). Public evidence is required for claims presented as facts. Inference is welcome when explicitly labeled.

## 3D contributions

- Prefer `.glb` / `.gltf` for browser assets.
- Keep source `.blend` files when practical.
- Use original geometry; do not copy proprietary CAD.
- Add provenance and license metadata in `docs/ASSETS.md`.
- Optimize meshes/textures for web delivery.
- Mark geometry as `documented`, `inferred`, or `illustrative`.

## Code contributions

```bash
npm install
npm run check
```

`npm run check` validates the evidence datasets, runs TypeScript typechecking and performs a production build. Keep the experience usable on laptop GPUs and mobile devices. Educational approximations must not be presented as process predictions.

## Research contributions

A research PR should ideally add structured claims in `evidence/claims.json`, links to lawful public sources, confidence class, concise reasoning, and a list of what remains unknown. Class `D` inference requires an explicit rationale and is checked by CI.

## Translation contributions

- Keep evidence claim IDs language-neutral and shared across all languages.
- Translate presentation text, not the evidence database into separate copies.
- Preserve technical terms when a Vietnamese translation would create ambiguity; a short bilingual form is welcome on first use.
- Never remove or weaken citations when translating a technical statement.
- Do not turn an `inferred` or `unknown` statement into a factual statement during translation.
- Add UI strings through the lightweight structure in `src/i18n.ts` rather than scattering language checks across components.
- English and Vietnamese are the initial language pair; additional language packs should reuse the same claim/source identifiers.
