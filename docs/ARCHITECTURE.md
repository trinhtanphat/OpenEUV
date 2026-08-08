# OpenEUV Product Architecture

The project is split into five layers.

1. **Visual atlas** — `scanner → subsystem → component concept → evidence`. Procedural geometry lets the experience work before production GLB assets exist.
2. **Simulation layer** — educational models with published assumptions; never silently treated as predictive scanner/fab models.
3. **Evidence layer** — `evidence/claims.json` is the seed of a future knowledge graph connecting claims to component IDs.
4. **Open unknowns** — missing evidence is first-class data. Each unknown should say what is missing, why it matters, and what public evidence could raise confidence.
5. **Contributor UX** — a visitor should get from “this is fascinating” to “I can help with this exact part” in under two minutes.
