# Mirror & vacuum concept lab methodology

The OpenEUV V5 mirror/vacuum lab is a **dimensionless educational model** for two public EUV optics ideas:

1. EUV light is strongly absorbed by air and ordinary transmissive optical materials, so first-party EUV descriptions place the optical path in vacuum.
2. EUV projection/illumination systems use reflective optics, and a sequence of non-ideal transfers accumulates loss.

The public evidence anchor is the shared Class A claim `EUV-VACUUM-001`, whose source links are rendered directly from `evidence/claims.json`.

## Model

The lab uses two normalized relationships:

```text
absorbing path:  T = exp(-a · L)
reflective chain: M = r^N
```

where:

- `a` is a **normalized absorption index**;
- `L` is a **normalized path length**;
- `r` is a **normalized per-reflection transfer**;
- `N` is an illustrative reflection count.

None of these values is a measured commercial scanner parameter. They are dimensionless teaching controls chosen only to show monotonic attenuation and cumulative transfer.

The “low-absorption path” uses a fixed normalized fraction of the reference absorption index to make the qualitative contrast visible. It is not a pressure-to-absorption conversion and must not be interpreted as a vacuum specification.

## Deliberate omissions

The lab contains no:

- chamber pressure or vacuum level;
- pump type, sizing, pump-down procedure or evacuation sequence;
- source/laser/plasma operating parameter;
- mirror prescription or proprietary multilayer recipe;
- scanner throughput, dose, process-window or production-control prediction.

Those omissions are intentional. This lab explains public optics concepts; it is not a vacuum-engineering, source-operation or scanner-service simulator.

## Implementation & verification

- `src/lib/euvPathConcept.mjs` — pure normalized model.
- `tests/euv-path-concept.test.mjs` — bounds, monotonicity and deterministic edge cases.
- `src/components/MirrorVacuumConceptLab.tsx` — EN/VI interactive visualization using shared evidence metadata.
- `e2e/mirror-vacuum-concept.spec.ts` — interaction/accessibility/safety-boundary assertions and direct atlas-search navigation.
- `src/data/learningPath.ts` — linked from L1 optics and L2 EUV physics.

Any future quantitative extension must cite a lawfully public dataset and state its units/provenance explicitly. Do not replace normalized values with guessed commercial parameters.
