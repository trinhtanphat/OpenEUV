const c = (re, im = 0) => ({ re, im })
const add = (a, b) => c(a.re + b.re, a.im + b.im)
const sub = (a, b) => c(a.re - b.re, a.im - b.im)
const mul = (a, b) => c(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re)
const scale = (a, value) => c(a.re * value, a.im * value)
const div = (a, b) => {
  const d = b.re * b.re + b.im * b.im || 1e-18
  return c((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d)
}
const abs2 = (a) => a.re * a.re + a.im * a.im
const sqrtComplex = (z) => {
  const magnitude = Math.hypot(z.re, z.im)
  const re = Math.sqrt(Math.max(0, (magnitude + z.re) / 2))
  const imMagnitude = Math.sqrt(Math.max(0, (magnitude - z.re) / 2))
  const im = z.im < 0 ? -imMagnitude : imMagnitude
  return c(re, im)
}
const cosComplex = (z) => c(
  Math.cos(z.re) * Math.cosh(z.im),
  -Math.sin(z.re) * Math.sinh(z.im),
)
const sinComplex = (z) => c(
  Math.sin(z.re) * Math.cosh(z.im),
  Math.cos(z.re) * Math.sinh(z.im),
)
const one = c(1)

const complexIndex = (medium) => c(medium.n, -Math.abs(medium.k))
const clampReflectivity = (value) => Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0

const cosThetaInMedium = (n0, sinTheta0, n) => {
  const invariant = scale(n0, sinTheta0)
  const ratio = div(invariant, n)
  const cosSquared = sub(one, mul(ratio, ratio))
  const root = sqrtComplex(cosSquared)
  return root.re < 0 ? scale(root, -1) : root
}

const admittance = (n, cosTheta, polarization) => polarization === 'p' ? div(n, cosTheta) : mul(n, cosTheta)

function solvePolarization({ wavelengthNm, angleDeg, pairs, materialA, materialB, substrate, incident, polarization }) {
  const lambda = Math.max(0.01, wavelengthNm)
  const count = Math.max(1, Math.min(200, Math.round(pairs)))
  const angleRadians = (Math.max(0, Math.min(75, angleDeg)) * Math.PI) / 180
  const sinTheta0 = Math.sin(angleRadians)
  const n0 = complexIndex(incident)
  const ns = complexIndex(substrate)
  const cos0 = cosThetaInMedium(n0, sinTheta0, n0)
  const cosSubstrate = cosThetaInMedium(n0, sinTheta0, ns)
  const eta0 = admittance(n0, cos0, polarization)
  const etaSubstrate = admittance(ns, cosSubstrate, polarization)
  let m00 = c(1), m01 = c(0), m10 = c(0), m11 = c(1)

  const applyLayer = (layer) => {
    const n = complexIndex(layer)
    const cosTheta = cosThetaInMedium(n0, sinTheta0, n)
    const eta = admittance(n, cosTheta, polarization)
    const delta = scale(mul(n, cosTheta), (2 * Math.PI * layer.thicknessNm) / lambda)
    const cosDelta = cosComplex(delta)
    const sinDelta = sinComplex(delta)
    const iSin = c(-sinDelta.im, sinDelta.re)
    const l00 = cosDelta
    const l01 = div(iSin, eta)
    const l10 = mul(iSin, eta)
    const l11 = cosDelta
    const a00 = add(mul(m00, l00), mul(m01, l10))
    const a01 = add(mul(m00, l01), mul(m01, l11))
    const a10 = add(mul(m10, l00), mul(m11, l10))
    const a11 = add(mul(m10, l01), mul(m11, l11))
    m00 = a00; m01 = a01; m10 = a10; m11 = a11
  }

  for (let index = 0; index < count; index += 1) {
    applyLayer(materialA)
    applyLayer(materialB)
  }

  const b = add(m00, mul(m01, etaSubstrate))
  const cc = add(m10, mul(m11, etaSubstrate))
  const numerator = sub(mul(eta0, b), cc)
  const denominator = add(mul(eta0, b), cc)
  return clampReflectivity(abs2(div(numerator, denominator)))
}

/**
 * Educational polarization-aware characteristic-matrix calculation.
 * Refractive indices use n - i*k, thicknesses are nm, and angleDeg is measured
 * from the surface normal. The model includes complex-index Snell propagation
 * and s/p optical admittance, while intentionally omitting roughness,
 * interdiffusion, graded interfaces, measured wavelength dependence and
 * production-specific stack corrections. It is not a coating recipe.
 */
export function multilayerReflectivity({
  wavelengthNm,
  angleDeg = 0,
  pairs,
  materialA,
  materialB,
  substrate = { n: 1, k: 0 },
  incident = { n: 1, k: 0 },
  polarization = 'unpolarized',
}) {
  const input = { wavelengthNm, angleDeg, pairs, materialA, materialB, substrate, incident }
  const sReflectivity = solvePolarization({ ...input, polarization: 's' })
  const pReflectivity = solvePolarization({ ...input, polarization: 'p' })
  const reflectivity = polarization === 's'
    ? sReflectivity
    : polarization === 'p'
      ? pReflectivity
      : (sReflectivity + pReflectivity) / 2

  return {
    reflectivity,
    percent: reflectivity * 100,
    sReflectivity,
    pReflectivity,
    sPercent: sReflectivity * 100,
    pPercent: pReflectivity * 100,
    physicalPeriodNm: materialA.thicknessNm + materialB.thicknessNm,
    polarization,
  }
}

export function braggPeriodNm(wavelengthNm, angleDeg = 0) {
  const radians = (angleDeg * Math.PI) / 180
  return wavelengthNm / (2 * Math.max(Math.cos(radians), 0.05))
}
