import { expect, test } from '@playwright/test'

test('evidence claim provenance trace exposes public sources and mapped atlas usage', async ({ page }) => {
  await page.goto('/')

  const vacuumClaim = page.locator('[data-evidence-id="EUV-VACUUM-001"]')
  await expect(vacuumClaim).toBeVisible()
  await expect(vacuumClaim).toHaveAttribute('data-usage-count', /[1-9]\d*/)

  const trace = vacuumClaim.locator('[data-provenance-trace]')
  await trace.locator('summary').click()
  await expect(trace.locator('a[target="_blank"]').first()).toBeVisible()
  await expect(trace.locator('[data-provenance-usage="concept-node"]').first()).toBeVisible()
})

test('fab provenance usage deep-links to the exact case card', async ({ page }) => {
  await page.goto('/')

  const claim = page.locator('[data-evidence-id="TSMC-EUV-MASK-DRYCLEAN-2020"]')
  await expect(claim).toBeVisible()
  const trace = claim.locator('[data-provenance-trace]')
  await trace.locator('summary').click()

  const fabLink = trace.locator('[data-provenance-usage="fab-case"]').first()
  await expect(fabLink).toBeVisible()
  const href = await fabLink.getAttribute('href')
  expect(href).toMatch(/^#fab-case-/)
  await fabLink.click()
  await expect(page.locator(href!)).toBeVisible()
})
