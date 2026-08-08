# Fourier Imaging Learning Lab

The OpenEUV Fourier Imaging Lab is a **normalized optics teaching model**. It demonstrates how a finite imaging transfer suppresses high spatial-frequency content and therefore changes the appearance of a periodic pattern.

It is not a commercial scanner model, process-window predictor, mask recipe or correction engine.

## Educational model

The input is a one-dimensional, 50%-duty square pattern. The model represents it with the familiar odd-harmonic Fourier series:

```text
I_object(x) = 1/2 + (2/π) Σ sin(m·φ) / m,  m = 1, 3, 5, ...
```

Each harmonic is multiplied by the normalized modulation-transfer value for an ideal circular pupil:

```text
MTF(ν) = (2/π) [acos(ν) - ν sqrt(1 - ν²)]   for 0 ≤ ν ≤ 1
MTF(ν) = 0                                  for ν ≥ 1
```

where `ν` is a **dimensionless normalized spatial frequency** measured relative to the teaching cutoff.

The browser UI exposes two abstract controls:

- base spatial frequency;
- normalized pupil cutoff.

No commercial scanner dimension, mirror prescription, private illumination setting or fab process parameter is required.

## What the lab teaches

As the pattern fundamental approaches the cutoff:

- the fundamental transfer falls;
- high-order harmonics disappear first;
- square edges become smoother;
- contrast eventually collapses when the fundamental itself lies beyond the cutoff.

This gives learners a bridge from wavelength/NA intuition to spatial-frequency language before they encounter more complete imaging models.

## What the lab deliberately omits

The model does not include:

- real partial-coherence behavior;
- a measured EUV source distribution;
- reflective-mask material stacks;
- polarization-dependent mask imaging;
- real aberration maps;
- resist/process behavior;
- scanner-specific correction algorithms;
- proprietary optical prescriptions or production settings.

Those omissions are essential to the evidence boundary: a generic Fourier-optics visualization must not be presented as a production EUV prediction.

## Public learning references

- NIST, *Modulation Transfer Function Measurement Method for Electrically-Addressed Spatial Light Modulators* — public MTF context.
- S. Perrin and P. Montgomery, *Fourier optics: basic concepts*, arXiv:1802.07161.
- M. Mansuripur, *Fourier Optics in the Classroom*, arXiv:1808.04197.

The lab code links to these public records rather than copying protected source text or figures.

## Reproducibility

Pure helpers live in `src/lib/fourierImaging.mjs` and are covered by `tests/fourier-imaging.test.mjs`.

Key invariants tested:

- MTF is bounded between zero and one;
- MTF decreases from DC to the normalized cutoff;
- a fundamental beyond cutoff produces no transferred pattern contrast in this simplified model;
- a wider normalized passband transfers more harmonics;
- reconstruction remains deterministic and normalized.

Browser behavior is covered in `e2e/atlas.spec.ts`.
