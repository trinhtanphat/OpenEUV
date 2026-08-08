const c = (re, im = 0) => ({ re, im })
const add = (a, b) => c(a.re + b.re, a.im + b.im)
const mul = (a, b) => c(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re)
const div = (a, b) => {
  const d = b.re * b.re + b.im * b.im || 1e-18
  return c((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d)
}
const abs2 = (a) => a.re * a.re + a.im * a.im
const cosComplex = (z) => c(
  Math.cos(z.re) * Math.cosh(z.im),
  -Math.sin(z.re) * Math.sinh(z.im),
)
const sinComplex = (z) => c(
  Math.sin(z.re) * Math.cosh(z.im),
  Math.cos(z.re) * Math.sinh(z.im),
)

/**
 * Educational normal-incidence characteristic-matrix calculation.
 * Refractive indices use n - i*k, with thicknesses in nanometers.
 * The helper intentionally omits roughness, interdiffusion, polarization
 * splitting, angle-dependent optical constants and production-specific stack
 * corrections. It is a learning model, not a coating recipe or process model.
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
    const n = c(layer.n, -Math.abs(layer.k))
    const scale = (2 * Math.PI * layer.thicknessNm) / lambda
    const delta = c(n.re * scale, n.im * scale)
    const cosDelta = cosComplex(delta)
    const sinDelta = sinComplex(delta)
    const iSin = c(-sinDelta.im, sinDelta.re)
    const l00 = cosDelta
    const l01 = div(iSin, n)
    const l10 = mul(iSin, n)
    const l11 = cosDelta
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

  const n0 = c(incident.n, -Math.abs(incident.k))
  const ns = c(substrate.n, -Math.abs(substrate.k))
  const b = add(m00, mul(m01, ns))
  const cc = add(m10, mul(m11, ns))
  const numerator = add(mul(n0, b), c(-cc.re, -cc.im))
  const denominator = add(mul(n0, b), cc)
  const r = div(numerator, denominator)
  const raw = abs2(r)
  const reflectivity = Number.isFinite(raw) ? Math.max(0, Math.min(1, raw)) : 0

  return {
    reflectivity,
    percent: reflectivity * 100,
    physicalPeriodNm: materialA.thicknessNm + materialB.thicknessNm,
  }
}

export function braggPeriodNm(wavelengthNm, angleDeg = 0) {
  const radians = (angleDeg * Math.PI) / 180
  return wavelengthNm / (2 * Math.max(Math.cos(radians), 0.05))
}
