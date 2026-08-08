const c = (re, im = 0) => ({ re, im })
const add = (a, b) => c(a.re + b.re, a.im + b.im)
const mul = (a, b) => c(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re)
const div = (a, b) => {
  const d = b.re * b.re + b.im * b.im || 1e-18
  return c((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d)
}
const abs2 = (a) => a.re * a.re + a.im * a.im
const expi = (phi) => c(Math.cos(phi), Math.sin(phi))

/**
 * Educational normal-incidence characteristic-matrix calculation.
 * Refractive indices are complex n = real + i*k. Layer thicknesses are nm.
 * This intentionally omits roughness, interdiffusion, polarization splitting,
 * angle-dependent optical constants and production-specific stack corrections.
 */
export function multilayerReflectivity({
  wavelengthNm,
  pairs,
  materialA,
  materialB,
  substrate = { n: 1, k: 0 },
  incident = { n: 1, k: 0 },
}) {
  const lambda = Math.max(0.01, wavelengthNm)
  const count = Math.max(1, Math.min(200, Math.round(pairs)))
  let m00 = c(1), m01 = c(0), m10 = c(0), m11 = c(1)

  const applyLayer = (layer) => {
    const n = c(layer.n, layer.k)
    const delta = (2 * Math.PI * layer.thicknessNm) / lambda
    const cos = c(Math.cos(delta))
    const sin = expi(Math.PI / 2).re === 0 ? c(Math.sin(delta)) : c(Math.sin(delta))
    const iSin = c(0, sin.re)
    const l00 = cos
    const l01 = div(iSin, n)
    const l10 = mul(iSin, n)
    const l11 = cos
    const a00 = add(mul(m00, l00), mul(m01, l10))
    const a01 = add(mul(m00, l01), mul(m01, l11))
    const a10 = add(mul(m10, l00), mul(m11, l10))
    const a11 = add(mul(m10, l01), mul(m11, l11))
    m00 = a00; m01 = a01; m10 = a10; m11 = a11
  }

  for (let i = 0; i < count; i += 1) {
    applyLayer(materialA)
    applyLayer(materialB)
  }

  const n0 = c(incident.n, incident.k)
  const ns = c(substrate.n, substrate.k)
  const b = add(m00, mul(m01, ns))
  const cc = add(m10, mul(m11, ns))
  const numerator = add(mul(n0, b), c(-cc.re, -cc.im))
  const denominator = add(mul(n0, b), cc)
  const r = div(numerator, denominator)
  const reflectivity = Math.max(0, Math.min(1, abs2(r)))

  return {
    reflectivity,
    percent: reflectivity * 100,
    opticalPeriodNm: materialA.thicknessNm + materialB.thicknessNm,
  }
}

export function braggPeriodNm(wavelengthNm, angleDeg = 0) {
  const radians = (angleDeg * Math.PI) / 180
  return wavelengthNm / (2 * Math.max(Math.cos(radians), 0.05))
}
