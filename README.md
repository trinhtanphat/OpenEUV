# OpenEUV

**A public-source, interactive engineering atlas for Extreme Ultraviolet (EUV) lithography.**

OpenEUV aims to make one of the most complex manufacturing systems on Earth explorable in a browser: a conceptual 3D scanner, subsystem map, simplified physics labs, patent/evidence graph, assembly learning game, TSMC fab-integration context, and a growing list of public engineering unknowns for contributors to investigate.

> **Important:** OpenEUV is an independent educational/research project. It is not affiliated with ASML, ZEISS, TSMC, TRUMPF, Cymer, or their partners. The 3D reconstruction is conceptual and is **not** ASML CAD or a production blueprint.

## Why this repository exists

Most EUV explanations are either short articles or highly specialized papers. OpenEUV connects the layers:

- beginner semiconductor and optics concepts;
- a clickable 3D scanner and exploded view;
- source → illuminator → reflective reticle → projection optics → wafer stage;
- NA 0.33 vs High-NA 0.55 learning tools;
- evidence-linked claims from manufacturers, foundries, patents and academia;
- an `unknown` state for facts we cannot establish publicly;
- contributor missions spanning 3D, frontend, optics, physics, patents and technical research.

## Current MVP

- Interactive procedural EUV scanner in React + Three.js.
- Clickable subsystem explorer with confidence classes.
- Exploded-view control and animated conceptual EUV optical path.
- Simplified Rayleigh-style resolution playground.
- Conceptual “Build the Scanner” learning checklist.
- Evidence-class UI and source graph.
- Responsive contributor launchpad.
- Research/sourcing policy designed for auditable public-source reconstruction.

## Verified public anchors

The seed dataset intentionally starts with claims that can be grounded in public first-party or patent sources:

- EUV systems operate around **13.5 nm**.
- High-NA EUV raises numerical aperture from **0.33 to 0.55**.
- ZEISS reports the High-NA projection optics contain **more than 40,000 parts** and weigh around twelve tons.
- TSMC's **N7+** was its first EUV process to enter high-volume production.
- Public patents describe reflective reticles, multilayer projection mirrors, scanning stages, vacuum chambers and load locks.

See [`evidence/claims.json`](evidence/claims.json) and [`SOURCING_POLICY.md`](SOURCING_POLICY.md).

## Run locally

```bash
npm install
npm run dev
```

Production check:

```bash
npm run typecheck
npm run build
```

## Architecture

```text
OpenEUV
├─ Interactive 3D Atlas
│  ├─ Source
│  ├─ Illuminator
│  ├─ Reticle / mask stage
│  ├─ Projection optics
│  ├─ Wafer stage
│  ├─ Metrology / control
│  └─ Vacuum / contamination
├─ Physics Playgrounds
├─ Evidence Graph
├─ Patent Mapping
├─ TSMC Fab Integration
└─ Open Unknowns / Contributor Missions
```

## What belongs here

Welcome: original 3D models based on cited public information, public patents, peer-reviewed research, reproducible educational simulations, diagrams that distinguish illustration from confirmed geometry, and corrections that improve provenance.

Not accepted: stolen/hacked documents, leaked confidential or trade-secret material, proprietary CAD/service manuals/process recipes without clear authorization for public redistribution, or claims supported only by unverifiable anonymous leaks.

The interesting challenge is seeing **how far a rigorous open community can reconstruct the system from lawful evidence** while clearly marking the boundary between known, inferred and unknown.

## Contributor tracks

| Track | Examples |
| --- | --- |
| `3d` | GLB models, exploded assemblies, animations |
| `optics` | reflective ray visualizations, NA learning tools |
| `physics` | diffraction, multilayer reflectivity, aberration demos |
| `patent-research` | patent-family maps and figure interpretation |
| `fab` | public TSMC EUV milestones and integration context |
| `frontend` | WebGL/WebGPU UX, performance, accessibility |
| `evidence` | claim validation, citation upgrades, uncertainty review |
| `education` | basics → advanced learning paths |

Start with the open issues and [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Roadmap

See [`ROADMAP.md`](ROADMAP.md). Next major targets: production-quality original GLB assets, patent-family explorer, multilayer reflectivity simulator, mask 3D effects, High-NA anamorphic visualization, six-DoF stage demo, searchable evidence database and an “open unknowns” dashboard.

## Verification note

The source was syntax-checked locally with TypeScript. Full dependency install/build could not be completed in the current execution environment because its npm registry did not serve the required React/Three type packages; this is an environment limitation rather than a confirmed app build result.

## License

Code is MIT licensed. Third-party papers, patents, images and 3D assets retain their own rights; prefer metadata + links + original reconstructions over copying protected source material into the repository.
