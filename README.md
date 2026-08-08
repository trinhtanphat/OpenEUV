# OpenEUV

**A public-source, interactive engineering atlas for Extreme Ultraviolet (EUV) lithography.**

OpenEUV makes one of the most complex manufacturing systems on Earth explorable in a browser: a conceptual 3D scanner, subsystem atlas, physics labs, public-patent explorer, evidence graph, assembly learning game, TSMC fab-integration timeline, and a growing set of engineering unknowns for contributors to investigate.

> **Important:** OpenEUV is an independent educational/research project. It is not affiliated with ASML, ZEISS, TSMC, TRUMPF, Cymer, or their partners. The reconstruction is conceptual and is **not** ASML CAD, service documentation, a process recipe, or a production blueprint.

## What is interactive today

- React + Three.js EUV scanner with drag/orbit, zoom, subsystem selection and exploded view.
- Original, inspectable OpenEUV glTF concept asset for the source/collector area, with procedural fallback.
- Animated conceptual EUV optical path and reflective-projection visualization.
- Low-NA **0.33** vs High-NA **0.55** educational comparison.
- Rayleigh-style resolution playground.
- Multilayer interference playground with explicit educational assumptions.
- Six-degree-of-freedom wafer-stage visualization: X/Y/Z + Rx/Ry/Rz.
- Filterable public EUV patent explorer linked to subsystem concepts.
- First-party TSMC EUV milestone timeline.
- English/Vietnamese UI foundation.
- Evidence classes, sourced claim dataset, open-unknowns dataset and CI validation.
- Conceptual “Build the Scanner” learning checklist.

## Why this repository exists

Most EUV explanations are either short articles or highly specialized papers. OpenEUV connects the layers:

- beginner semiconductor and optics concepts;
- a clickable 3D scanner and exploded view;
- source → illuminator → reflective reticle → projection optics → wafer stage;
- NA, diffraction, multilayer and motion learning tools;
- evidence-linked claims from manufacturers, foundries, patents and academia;
- an `unknown` state for facts we cannot establish publicly;
- contributor missions spanning 3D, frontend, optics, physics, patents, foundry history, translation and technical research.

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

The seed dataset starts with claims grounded in first-party public sources or published patents:

- EUV lithography operates around **13.5 nm**.
- High-NA EUV increases numerical aperture from **0.33 to 0.55**.
- ZEISS reports more than **25,000 parts** in the High-NA illumination system and more than **40,000 parts** in High-NA projection optics.
- TSMC describes **N7+** as its first EUV process to enter volume production and states N6 uses additional EUV layers.
- Published ASML patent families discuss reflective reticle support, reflective EUV members, target droplets and source-material contamination concepts.

## Run locally

```bash
npm install
npm run dev
```

Full project check:

```bash
npm run check
```

This runs evidence validation, TypeScript typechecking and a production Vite build.

## Architecture

```text
OpenEUV
├─ Interactive 3D Atlas
│  ├─ Source / collector concept asset
│  ├─ Illuminator
│  ├─ Reticle / mask stage
│  ├─ Projection optics
│  ├─ Wafer stage
│  ├─ Metrology / control
│  └─ Vacuum / contamination
├─ Research Workbench
│  ├─ Low-NA vs High-NA
│  ├─ Resolution
│  ├─ Multilayer interference
│  └─ 6-DoF wafer stage
├─ Public Patent Explorer
├─ Evidence + Unknowns Graph
├─ TSMC Fab Integration Timeline
└─ Contributor Missions
```

## What belongs here

Welcome: original 3D models based on cited public information, public patents, peer-reviewed research, reproducible educational simulations, diagrams that distinguish illustration from confirmed geometry, translations, and corrections that improve provenance.

Not accepted: stolen/hacked documents, leaked confidential or trade-secret material, proprietary CAD/service manuals/process recipes without clear authorization for public redistribution, or claims supported only by unverifiable anonymous leaks.

The challenge is seeing **how far a rigorous open community can reconstruct the system from lawful evidence** while clearly marking the boundary between known, inferred and unknown.

## Contributor tracks

| Track | Examples |
| --- | --- |
| `3d` | glTF/GLB models, exploded assemblies, animations |
| `optics` | reflective ray visualizations, NA learning tools |
| `physics` | diffraction, multilayer reflectivity, aberration demos |
| `patent-research` | patent-family maps and disclosure interpretation |
| `fab` | public TSMC EUV milestones and integration context |
| `frontend` | WebGL/WebGPU UX, performance, accessibility |
| `evidence` | schema validation, citation upgrades, uncertainty review |
| `i18n` | English/Vietnamese and later language packs |
| `education` | basics → advanced learning paths |

Start with the open issues and [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Roadmap

See [`ROADMAP.md`](ROADMAP.md). The next depth targets are mask 3D effects, aberration/focus visualization, stronger multilayer physics, real patent-family relationships, claim-to-3D links, more original subsystem assets, visual regression testing and richer internationalization.

## Verification

GitHub Actions installs dependencies on Node.js 22, validates `evidence/claims.json` and `evidence/unknowns.json`, runs TypeScript typechecking, and performs a production build on every push to `main` and pull request.

## License

Code and original OpenEUV assets are MIT licensed unless a file states otherwise. Third-party papers, patents, images and external assets retain their own rights; prefer metadata + links + original reconstructions over copying protected source material into the repository.
