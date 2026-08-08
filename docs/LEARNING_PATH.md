# OpenEUV learning path

OpenEUV is structured so a beginner can enter at semiconductor fundamentals and progress toward public-source EUV research without needing proprietary documentation.

## L0 — Foundations: chips and lithography

Learn wafer/resist/pattern-transfer vocabulary, layer alignment and why shorter-wavelength lithography matters. Use the Resolution playground and conceptual Fab Flow.

## L1 — Optics: waves, NA and imaging

Learn wavelength, diffraction, numerical aperture, Rayleigh-style scaling, spatial frequency and transfer-function intuition. Use Low-NA vs High-NA, the anamorphic field visualizer and the normalized Fourier Imaging Lab.

The Fourier lab provides a bridge from “smaller features need more optical bandwidth” to a frequency-domain view: a square pattern is decomposed into harmonics and an idealized pupil transfer progressively attenuates higher spatial frequencies.

## L2 — EUV physics and multilayers

Learn the 13.5 nm context, vacuum/absorption, complex refractive index, thin-film interference and s/p polarization. Use the Multilayer Simulator and provenance-aware optical-constants adapter.

## L3 — Scanner systems engineering

Connect source, illumination, reflective reticle, projection optics, wafer stage, metrology and vacuum. Use the 3D Atlas, Assembly Explorer and 6-DoF stage lab.

## L4 — High-NA image-quality effects

Study the public concepts behind NA 0.55, 4×/8× anamorphic imaging, spatial-frequency filtering, mask 3D effects, aberration, focus, leveling and overlay. Revisit the Fourier Imaging Lab to connect a wider normalized passband with preservation of more pattern harmonics.

Keep production prescriptions, private correction algorithms and fab/process settings outside the reconstruction unless lawful public evidence explicitly supports a bounded educational statement.

## L5 — Research: evidence, patents and computation

Use the Patent Explorer, Evidence Dashboard, DOI metadata tooling and reproducibility scripts. Advanced work should focus on public metadata, redistributable datasets, reproducible simulations and hypotheses with explicit evidence boundaries.

## Contributor progression

A contributor does not need to start at L5. Good entry points include:

- education/translation improvements at L0–L1;
- visual optics, Fourier/MTF explainers and UI work at L1–L2;
- concept-asset and evidence-label work at L3;
- public High-NA literature and bounded visualization work at L4;
- patent/data/reproducibility work at L5.

## Fourier lab methodology

See [`FOURIER_IMAGING_LAB.md`](FOURIER_IMAGING_LAB.md) for the normalized MTF relationship, harmonic reconstruction, public learning references, tested invariants and omitted effects.

## Safety and sourcing boundary

The curriculum is designed for understanding, simulation and public-source research. It does not provide real-world hazardous laser/plasma construction procedures, proprietary scanner service instructions, confidential fab recipes or leaked trade-secret material.
