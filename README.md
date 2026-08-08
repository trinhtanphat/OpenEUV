# OpenEUV

**A public-source, interactive engineering atlas for Extreme Ultraviolet (EUV) lithography.**

OpenEUV turns one of the most complex manufacturing systems on Earth into an explorable browser project: an original conceptual 3D scanner, exploded view, evidence-backed component labels, system-level Assembly Explorer, basic→advanced learning path, physics workbench, public patent-family explorer, foundry case studies, evidence/review graph and open engineering unknowns for contributors to investigate.

> **Important:** OpenEUV is an independent educational/research project. It is not affiliated with ASML, ZEISS, TSMC, TRUMPF, Cymer, Intel, Samsung, Micron, SK hynix, Rapidus or their partners. The reconstruction is conceptual and is **not** ASML CAD, a service manual, a production recipe, a fab blueprint or hazardous laser/plasma operating guidance.

## Explore today

### Interactive 3D atlas

- React + Three.js conceptual EUV scanner with drag/orbit, zoom, subsystem selection and exploded view.
- Original OpenEUV glTF concept assets for source/collector, reflective-reticle and projection-optics areas, plus procedural fallbacks.
- Guided camera tour and direct named-node highlighting.
- Evidence-backed screen-space labels linked to contextual claims and geometry status.
- Adaptive `high / balanced / low` LOD: mobile/low-power mode reduces pixel ratio, shadows, grid/geometry density and source animation without hiding evidence boundaries.
- Reproducible concept-asset generator; no proprietary CAD is used.

### How it is made — systems view

The **Assembly Explorer** maps the public functional integration sequence from architecture and vacuum platform through source, illumination, reflective reticle, projection optics, wafer stage/metrology and system integration/qualification.

Every stage states:

- what public evidence supports;
- which modules conceptually depend on it;
- what remains unknown;
- which details OpenEUV deliberately does **not** infer.

It is a systems-engineering learning map, not a construction or installation manual. See [`docs/ASSEMBLY_EXPLORER.md`](docs/ASSEMBLY_EXPLORER.md).

### Basic → advanced learning path

The interactive curriculum goes from:

`L0 chip/lithography foundations → L1 optics/NA → L2 EUV physics/multilayers → L3 scanner systems → L4 High-NA effects → L5 public-source research`

Each level connects concepts to labs and contributor missions. See [`docs/LEARNING_PATH.md`](docs/LEARNING_PATH.md).

### Physics & imaging workbench

- Low-NA **0.33** vs High-NA **0.55** educational comparison.
- High-NA **4× / 8× anamorphic** field visualization.
- Rayleigh-style resolution playground with independent Python cross-checks.
- Complex-index, polarization-aware characteristic-matrix multilayer learning model.
- Built-in **CC0 Mo/Windt 1988 optical constants dataset**, pinned to a public upstream revision and containing the original 13.55 nm point.
- Reflective-mask 3D shadowing intuition lab.
- Aberration, focus, leveling and overlay concept lab using normalized educational proxies.
- Six-degree-of-freedom wafer-stage visualization: X/Y/Z + Rx/Ry/Rz.

Illustrative defaults remain available. A loaded public dataset never turns the tool into a production coating/process recipe.

### Evidence, reviews & unknowns

OpenEUV uses shared machine-readable claims and unknowns:

| Class | Meaning |
| --- | --- |
| A | First-party public source |
| B | Published patent / public standard |
| C | Academic source |
| D | Public-source inference with written rationale |
| ? | Unknown / insufficient lawful evidence |

Evidence review metadata supports `proposed → reviewed → superseded`, public contributor/reviewer handles and supersession links. Records without real review attribution display **unreviewed**; the project never fabricates reviewer names to make coverage look complete.

### Patent-family explorer

The curated patent map covers source, collector, illumination, reticle, projection, stage, metrology and vacuum-related disclosures. It includes:

- family/priority/publication metadata;
- subsystem relationships;
- metadata completeness/provenance scoring;
- duplicate/conflicting-family audit tooling;
- original OpenEUV summaries and public links only.

A patent disclosure is evidence of a disclosed concept, **not** proof that a drawing equals production geometry.

### Fab & manufacturing context

First-party case studies currently include public EUV milestones from:

- TSMC;
- Samsung;
- Intel;
- Micron;
- SK hynix;
- Rapidus.

Separate public cases cover source/collector contamination and reflective-mask/membrane lifecycle concepts. Every case includes a **public boundary** and explicit unknowns; OpenEUV does not infer confidential layer counts, recipes, yield, internal fab layout, inspection thresholds or cleaning chemistry.

## Why this repository exists

Most EUV explanations are either short introductions or highly specialized papers. OpenEUV connects the layers:

- beginner semiconductor and optics concepts;
- a clickable 3D scanner and exploded architecture;
- source → illuminator → reflective reticle → projection optics → wafer stage;
- system-integration/assembly context;
- NA, diffraction, multilayer, mask-3D, aberration and motion learning tools;
- evidence-linked claims from manufacturers, foundries, public patents and academia;
- an explicit `unknown` state when lawful public evidence is insufficient;
- contributor tracks for 3D, frontend, optics, physics, patents, fab history, translation, datasets, QA and research.

## Run locally

```bash
npm install
npm run dev
```

Full local project check:

```bash
npm run check
```

This runs evidence validation, unit tests, TypeScript typechecking and a production Vite build.

Browser verification:

```bash
npx playwright install chromium
npm run e2e
```

Concept asset regeneration:

```bash
python tools/generate-concept-assets.py all
```

## Deployment

**GitHub Actions is intentionally disabled.** Pushing a commit does not run CI and does not deploy production.

The checked-in deployment path is manual **Cloudflare Workers Static Assets**:

```bash
npm install
npm run check
npm run deploy:cloudflare:dry
npm run deploy:cloudflare
```

`wrangler.jsonc` serves `./dist` and enables SPA fallback. Vercel remains a compatible alternative using build command `npm run build` and output directory `dist`.

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Public data & reproducibility

OpenEUV includes tooling for:

- DOI/literature metadata normalization;
- patent JSON/CSV normalization and coverage auditing;
- fab-case metadata validation;
- optical-constants import with explicit provenance/licensing;
- versioned public dataset manifests;
- JS ↔ Python physics cross-checks;
- renderer benchmark methodology and raw-result templates.

The first checked-in measured optical dataset is Mo/Windt 1988 from the CC0 refractiveindex.info database. Layer/material data without suitable provenance stays illustrative rather than being silently extrapolated.

## Architecture

```text
OpenEUV
├─ Interactive 3D Atlas
│  ├─ original concept glTF assets + procedural fallbacks
│  ├─ exploded view + guided camera tour
│  ├─ evidence-backed concept labels
│  └─ adaptive mobile/low-power LOD
├─ Assembly Explorer
├─ Learning Path L0 → L5
├─ Research Workbench
│  ├─ Low-NA vs High-NA
│  ├─ anamorphic field
│  ├─ resolution
│  ├─ polarization-aware multilayers + public optical data
│  ├─ mask 3D effects
│  ├─ aberration / focus / overlay
│  └─ 6-DoF wafer stage
├─ Public Patent-Family Explorer
├─ Evidence / Review / Unknowns Dashboard
├─ Fab & mask-lifecycle case studies
├─ EN / VI technical content
└─ Public research/data/reproducibility tools
```

## What belongs here

Welcome: original 3D models based on cited public information, public patent metadata, peer-reviewed/public research metadata, lawfully redistributable datasets, reproducible educational simulations, diagrams that distinguish illustration from confirmed function, translations, tests and provenance corrections.

Not accepted: stolen/hacked documents, leaked confidential or trade-secret material, proprietary CAD/service manuals/process recipes without clear authorization for public redistribution, or claims supported only by unverifiable anonymous leaks.

The challenge is seeing **how far a rigorous open community can reconstruct the system from lawful evidence** while clearly marking known, inferred, illustrative and unknown boundaries.

## Contributor tracks

| Track | Examples |
| --- | --- |
| `3d` | glTF/GLB models, procedural generators, exploded assemblies, evidence labels |
| `optics` | reflective-ray visualization, NA and aberration learning tools |
| `physics` | diffraction, multilayer reflectivity, optical datasets, mask-imaging demos |
| `patent-research` | family maps, metadata audits, disclosure interpretation |
| `fab` | first-party public adoption/integration milestones |
| `frontend` | WebGL/WebGPU UX, performance, accessibility |
| `evidence` | sourcing, review state, uncertainty and supersession |
| `i18n` | English/Vietnamese and later language packs |
| `qa` | unit/browser tests and manual verification |
| `education` | Assembly Explorer and basics→advanced learning path |

Start with open issues and [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Current roadmap boundary

Most V1–V3 implementation missions are complete. The major intentionally open measurement task is the **real-device WebGL vs WebGPU benchmark campaign**: the harness and methodology exist, but OpenEUV will not invent laptop/mobile results. See [`benchmarks/README.md`](benchmarks/README.md) and [`ROADMAP.md`](ROADMAP.md).

## Verification policy

Because GitHub Actions is disabled, repository changes are **not automatically verified by GitHub**. Before merging/deploying, contributors or maintainers should run:

```bash
npm run check
npm run e2e
```

A commit that has not been checked locally must not be described as verified merely because its files were successfully pushed to GitHub.

## License

Code and original OpenEUV assets are MIT licensed unless a file states otherwise. Third-party papers, patents, images and upstream datasets retain their own rights/licensing; prefer metadata + links + original reconstructions over copying protected source material into the repository.
