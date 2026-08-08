# Assembly Explorer methodology

OpenEUV's Assembly Explorer is a **systems-engineering learning map**, not a construction manual.

The goal is to show how public functional blocks relate: vacuum platform, source, collector/illumination, reflective reticle, projection optics, wafer stage, metrology and final system integration. It intentionally avoids proprietary dimensions, private service procedures, hazardous source-operation instructions and fab recipes.

## Evidence states

Each assembly stage is classified as one of:

- `documented-function`: public sources clearly establish that the function/subsystem exists;
- `public-inference`: the relationship is reconstructed from multiple lawful public sources and is explicitly labeled as inference;
- `illustrative`: a teaching structure used for navigation, not a claim about production geometry.

Evidence class and geometry/teaching status are different concepts. A strong Class A/B source can establish that a function exists while the visual teaching geometry remains illustrative.

## V4 learning schema

Every stage in `src/data/assemblyStages.ts` includes:

- `id` — stable stage ID;
- `subsystem` — owning functional domain;
- `title.en` / `title.vi` — bilingual title;
- `summary.en` / `summary.vi` — concise systems-learning explanation;
- `publicEvidence.en` / `publicEvidence.vi` — what lawful public evidence actually establishes;
- `boundary.en` / `boundary.vi` — what OpenEUV deliberately does **not** infer;
- `dependencies` — conceptual upstream stages;
- `outputs` — learning outputs;
- `claimIds` — shared evidence IDs used elsewhere in the atlas;
- `atlasNodes` — stable named OpenEUV concept nodes when they exist;
- `learningLinks` — links into labs, the 3D atlas, fab cases or other learning surfaces;
- `questions` — bilingual open research questions for contributors;
- `status` — documented-function, public-inference or illustrative.

## Deep-link behavior

Assembly evidence chips link to stable Evidence Dashboard anchors:

```text
#evidence-<CLAIM_ID>
```

This lets a learner move from a systems statement directly to the shared claim/review record supporting it.

Named asset nodes link back to the 3D Atlas. A node name is an OpenEUV interaction/provenance identifier, **not** evidence that its rendered location or dimensions match a commercial machine.

Learning links connect a stage to the relevant educational lab. For example, projection optics can link to Low-NA/High-NA, Fourier imaging and multilayer concepts without turning those generic models into a production scanner simulation.

## Explicit gap policy

An empty `claimIds` or `atlasNodes` list is meaningful.

The UI must show a visible gap such as:

- `No direct shared claim yet — this is an explicit evidence gap.`
- `No direct named 3D node yet.`

Do **not** add a weakly related claim or invented node simply to avoid an empty state.

The current stage/metrology learning card intentionally demonstrates this policy: the functional domain is public knowledge, but the project still needs stronger shared claim IDs for some of its educational statements.

## Workflow

1. **Map the functional architecture.** Link every block to public claims, patents or academic references where available.
2. **Declare interfaces as known/unknown.** Do not invent mechanical interfaces, tolerances or private service layouts.
3. **Model modules independently.** Original OpenEUV concept assets should remain separable and have provenance metadata.
4. **Represent integration dependencies.** Show which functional modules conceptually connect while keeping private implementation details unknown.
5. **Link learning surfaces.** Reuse existing labs rather than duplicating isolated explanations.
6. **Keep unknowns visible.** A missing proprietary or unsupported detail becomes a research question, not a guessed value.
7. **Use shared evidence IDs.** Do not create language-specific or page-specific factual copies.

## Contributor checklist

A new assembly stage/sub-stage or major learning-card change should:

- preserve a stable ID;
- provide aligned English/Vietnamese text;
- cite shared claim IDs only when they directly support the statement;
- link stable named atlas nodes only when those nodes actually exist;
- provide at least one useful learning link or explain why none exists;
- include an explicit boundary;
- include an open research question when a material gap remains;
- keep geometry/evidence status accurate;
- add/update browser coverage for navigation and language switching.

Contributions must follow `SOURCING_POLICY.md`. Do not submit leaked documents, proprietary CAD, private service manuals, confidential recipes or hazardous real-world operating instructions.

## Useful next extensions

Useful public-source extensions include:

- original illumination and vacuum/platform concept assets with stable evidence-linked nodes;
- stronger first-party/patent claim IDs for stage/metrology functions;
- more public fab-integration milestones linked from the final integration stage;
- richer bilingual questions that can become contributor research missions.

The project should prefer conceptual diagrams and original reconstructions over copied vendor figures.
