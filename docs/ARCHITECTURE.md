# OpenEUV Product Architecture

OpenEUV is organized as an evidence-first interactive research system rather than a single 3D model.

## 1. Interactive visual atlas

Flow:

`scanner → subsystem → named concept node → evidence claim / unknown`

The Three.js scene combines original OpenEUV glTF concept assets with procedural fallbacks. Exploded view, guided camera stops, named-node highlighting and evidence-backed screen-space labels all operate on the same subsystem/component identity layer.

Adaptive LOD selects `high`, `balanced` or `low` rendering based on viewport/device signals. Performance reduction must never remove the user's ability to see whether geometry is documented, inferred or illustrative.

## 2. Assembly & learning layer

The Assembly Explorer provides a systems-engineering integration map rather than a construction manual. It connects architecture, vacuum platform, source, illumination, reticle, projection, wafer stage/metrology and qualification while explicitly listing dependencies and evidence boundaries.

The L0→L5 Learning Path links fundamentals to progressively deeper labs and contributor missions.

## 3. Simulation layer

Browser labs are educational models with explicit assumptions and limitations:

- Rayleigh-style resolution;
- Low-NA / High-NA comparison;
- anamorphic-field concepts;
- complex-index polarization-aware multilayers;
- mask-3D intuition;
- aberration/focus/overlay concepts;
- six-degree-of-freedom stage motion.

Measured datasets such as the pinned CC0 Mo/Windt optical constants improve inputs without turning these models into production recipes or predictive commercial-scanner simulations.

## 4. Evidence graph

`evidence/claims.json`, `evidence/unknowns.json`, `evidence/reviews.json` and `evidence/concept-labels.json` form the machine-readable evidence layer.

The web UI already links claims to subsystems and named 3D nodes. Evidence records can be proposed, reviewed or superseded; missing review attribution remains visibly `unreviewed`.

Class A/B/C/D/? describes source strength/type, not geometry fidelity. Geometry status is tracked separately.

## 5. Patent & literature layer

Curated patent families in `src/data/patents.ts` map public disclosures to subsystem IDs and expose metadata completeness/provenance scoring. Patent drawings are never treated as confirmed production geometry.

Literature/DOI tooling normalizes metadata and supports reproducible research without copying restricted full-text material into the repository.

## 6. Fab-context layer

First-party public milestones are modeled as bounded case studies. The architecture deliberately separates scanner technology from foundry/fab integration.

Every case follows:

`public fact → why it matters → public boundary → explicit unknowns`

## 7. Dataset & provenance layer

Reusable repository datasets are registered in `datasets/manifest.json` with version, source, license and provenance metadata.

Third-party bytes are only vendored when redistribution terms are clear. Otherwise OpenEUV stores metadata + lawful links + original summaries/reconstructions.

## 8. QA, benchmark & deployment layer

Local verification is the project gate because GitHub Actions is intentionally disabled:

```bash
npm run check
npm run e2e
```

`npm run check` covers evidence/review validation, renderer benchmark capture validation, unit tests, TypeScript and production build.

Renderer performance research uses a versioned manual benchmark method and anonymized raw captures; test fixtures/emulators are never counted as real-device evidence.

Deployment configuration is checked in for:

- Cloudflare Workers Static Assets (`wrangler.jsonc`);
- Vercel Vite SPA deployment (`vercel.json`).

## Design principle

A visitor should be able to move from:

`this is fascinating → what is known? → how do we know it? → what is still unknown? → what can I contribute?`

without the project pretending to possess proprietary CAD, trade secrets, private fab recipes or hazardous operating instructions.
