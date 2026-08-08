# OpenEUV

**A public-source, interactive engineering atlas for Extreme Ultraviolet (EUV) lithography.**

OpenEUV makes one of the most complex manufacturing systems on Earth explorable in a browser: a conceptual 3D scanner, subsystem atlas, physics labs, public patent-family explorer, evidence graph, assembly learning game, foundry-integration timeline, and a growing set of engineering unknowns for contributors to investigate.

> **Important:** OpenEUV is an independent educational/research project. It is not affiliated with ASML, ZEISS, TSMC, TRUMPF, Cymer, or their partners. The reconstruction is conceptual and is **not** ASML CAD, service documentation, a process recipe, or a production blueprint.

## What is interactive today

- React + Three.js EUV scanner with drag/orbit, zoom, subsystem selection and exploded view.
- Original OpenEUV glTF concept assets for source/collector, reflective-reticle and projection-optics areas, each with procedural fallback.
- Dependency-free Python generator for reproducible concept geometry.
- Animated conceptual EUV optical path.
- Low-NA **0.33** vs High-NA **0.55** educational comparison.
- High-NA **4× / 8× anamorphic** field visualization.
- Rayleigh-style resolution playground.
- Complex-index characteristic-matrix multilayer learning model with unit tests and editable illustrative optical parameters.
- Reflective-mask 3D shadowing intuition lab.
- Aberration, focus, leveling and overlay concept lab using normalized educational proxies.
- Six-degree-of-freedom wafer-stage visualization: X/Y/Z + Rx/Ry/Rz.
- Public EUV patent-family explorer with priority/publication metadata and subsystem links.
- First-party TSMC EUV milestone timeline and conceptual fab-flow context.
- English/Vietnamese UI foundation.
- Evidence classes, sourced claim dataset, open-unknowns dataset and CI validation.
- Playwright desktop/mobile interaction, fallback and accessibility smoke tests, with browser verification artifacts.

## Why this repository exists

Most EUV explanations are either short articles or highly specialized papers. OpenEUV connects the layers:

- beginner semiconductor and optics concepts;
- a clickable 3D scanner and exploded view;
- source → illuminator → reflective reticle → projection optics → wafer stage;
- NA, diffraction, multilayer, mask-3D, aberration and motion learning tools;
- evidence-linked claims from manufacturers, foundries, patents and academia;
- an `unknown` state for facts we cannot establish publicly;
- contributor missions spanning 3D, frontend, optics, physics, patents, foundry history, translation, QA and technical research.

## Evidence model

| Class | Meaning |
| --- | --- |
| A | First-party public source |
| B | Published patent / public standard |
| C | Academic source |
| D | Public-source inference with written rationale |
| ? | Unknown / insufficient lawful evidence |

Every nontrivial reconstruction should distinguish `documented`, `inferred` and `illustrative` geometry. See [`SOURCING_POLICY.md`](SOURCING_POLICY.md), [`evidence/claims.json`](evidence/claims.json), [`evidence/unknowns.json`](evidence/unknowns.json), and [`docs/ASSETS.md`](docs/ASSETS.md).

## Verified public anchors

The seed dataset starts with claims grounded in first-party public sources, published patents and public academic literature:

- EUV lithography operates around **13.5 nm**.
- High-NA EUV increases numerical aperture from **0.33 to 0.55**.
- ASML publicly describes High-NA anamorphic optics as **4× in one direction and 8× in the other**, with a half-size exposure field relative to NXE.
- ZEISS reports more than **25,000 parts** in the High-NA illumination system and more than **40,000 parts** in High-NA projection optics.
- TSMC describes **N7+** as its first EUV process to enter volume production and states N6 uses additional EUV layers.
- Published ASML patent families discuss reflective reticle support, reflective EUV members, target droplets, source-material contamination and reflector positioning concepts.
- Public academic work studies periodic Mo/Si multilayers and refined reflective EUV mask models.

## Run locally

```bash
npm install
npm run dev
```

Core project check:

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

## Architecture

```text
OpenEUV
├─ Interactive 3D Atlas
│  ├─ Source / collector concept asset
│  ├─ Illuminator
│  ├─ Reflective reticle concept asset
│  ├─ Projection-optics concept asset
│  ├─ Wafer stage
│  ├─ Metrology / control
│  └─ Vacuum / contamination
├─ Research Workbench
│  ├─ Low-NA vs High-NA
│  ├─ 4× / 8× anamorphic field
│  ├─ Resolution
│  ├─ Multilayer characteristic matrix
│  ├─ Mask 3D effects
│  ├─ Aberration / focus / overlay
│  └─ 6-DoF wafer stage
├─ Public Patent-Family Explorer
├─ Evidence + Unknowns Dashboard
├─ TSMC Fab Integration Timeline
└─ Contributor Missions
```

## What belongs here

Welcome: original 3D models based on cited public information, public patents, peer-reviewed research, reproducible educational simulations, diagrams that distinguish illustration from confirmed geometry, translations, tests, and corrections that improve provenance.

Not accepted: stolen/hacked documents, leaked confidential or trade-secret material, proprietary CAD/service manuals/process recipes without clear authorization for public redistribution, or claims supported only by unverifiable anonymous leaks.

The challenge is seeing **how far a rigorous open community can reconstruct the system from lawful evidence** while clearly marking the boundary between known, inferred and unknown.

## Contributor tracks

| Track | Examples |
| --- | --- |
| `3d` | glTF/GLB models, procedural generators, exploded assemblies, animations |
| `optics` | reflective ray visualizations, NA and aberration learning tools |
| `physics` | diffraction, multilayer reflectivity, mask-imaging demos |
| `patent-research` | patent-family maps and disclosure interpretation |
| `fab` | public TSMC EUV milestones and integration context |
| `frontend` | WebGL/WebGPU UX, performance, accessibility |
| `evidence` | schema validation, citation upgrades, uncertainty review |
| `i18n` | English/Vietnamese and later language packs |
| `qa` | unit tests, browser smoke tests, visual verification |
| `education` | basics → advanced learning paths |

Start with the open issues and [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Roadmap

See [`ROADMAP.md`](ROADMAP.md). The remaining depth targets deliberately stay open for contributors: higher-fidelity evidence-backed geometry, richer source animation, optical-constant datasets and polarization-aware multilayer modeling, larger patent-family coverage, claim-to-3D links, camera tours/LOD, more foundry case studies and richer internationalization.

## Verification

GitHub Actions is configured with two gates. The `build` job installs dependencies on Node.js 22, validates evidence, runs unit tests, typechecks TypeScript and performs a production build. The dependent `e2e` job installs Chromium, executes desktop/mobile Playwright smoke tests, exercises the procedural asset fallback, and uploads lightweight browser verification artifacts.

## License

Code and original OpenEUV assets are MIT licensed unless a file states otherwise. Third-party papers, patents, images and external assets retain their own rights; prefer metadata + links + original reconstructions over copying protected source material into the repository.
