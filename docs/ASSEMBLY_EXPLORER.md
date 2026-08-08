# Assembly Explorer methodology

OpenEUV's Assembly Explorer is a **systems-engineering learning map**, not a construction manual.

The goal is to show how public functional blocks relate: vacuum platform, source, collector/illumination, reflective reticle, projection optics, wafer stage, metrology and final system integration. It intentionally avoids proprietary dimensions, service procedures, control parameters, hazardous laser/plasma operating instructions and fab recipes.

## Evidence states

Each assembly stage is classified as one of:

- `documented-function`: public sources clearly establish that the function/subsystem exists;
- `public-inference`: the relationship is reconstructed from multiple lawful public sources and is explicitly labeled as inference;
- `illustrative`: a teaching structure used for navigation, not a claim about production geometry.

## Workflow

1. **Map the functional architecture.** Link every block to public claims, patents or academic references.
2. **Declare interfaces as known/unknown.** Do not invent mechanical interfaces, tolerances, alignment recipes or proprietary service layouts.
3. **Model modules independently.** Original OpenEUV concept assets should remain separable and have provenance metadata.
4. **Represent integration dependencies.** Show which functional modules must conceptually connect, while keeping exact implementation details unknown unless public evidence supports them.
5. **Separate module verification from system integration.** Public descriptions of modular testing can support the concept; production qualification procedures are not reconstructed.
6. **Keep unknowns visible.** A missing proprietary detail becomes a research question, not a guessed value.

## Contributor checklist

A new assembly stage or sub-stage should include:

- a stable ID;
- subsystem ownership;
- English/Vietnamese title and summary;
- a public-evidence explanation;
- a boundary statement describing what is *not* known;
- dependencies;
- learning outputs;
- geometry/evidence status.

Contributions must follow `SOURCING_POLICY.md`. Do not submit leaked documents, proprietary CAD, private service manuals or confidential recipes.

## Where to extend next

Useful public-source extensions include modular transport/integration context, metrology concepts, evidence-linked module labels, and richer public patent-family mapping. The project should prefer conceptual diagrams and original reconstructions over copied vendor figures.
