import { expect, test } from '@playwright/test'

test('exact evidence ID opens the evidence record with Enter', async ({ page }) => {
  await page.goto('/')
  const input = page.locator('#atlas-search-input')
  await input.fill('EUV-VACUUM-001')
  await expect(page.locator('[data-search-result="evidence:EUV-VACUUM-001"]')).toBeVisible()
  await input.press('Enter')
  await expect(page.locator('[data-evidence-id="EUV-VACUUM-001"]')).toBeVisible()
  await expect.poll(async () => page.evaluate(() => window.location.hash)).toBe('#evidence-EUV-VACUUM-001')
})

test('patent and stateful learning results use stable targets', async ({ page }) => {
  await page.goto('/')
  const input = page.locator('#atlas-search-input')

  await input.fill('EP4239410A1')
  await expect(page.locator('[data-search-result="patent:EP4239410A1"]')).toBeVisible()
  await input.press('Enter')
  await expect.poll(async () => page.evaluate(() => window.location.hash)).toBe('#patent-EP4239410A1')
  await expect(page.locator('#patent-EP4239410A1')).toBeVisible()

  await input.fill('scanner systems engineering')
  await expect(page.locator('[data-search-result="learning:scanner-systems"]')).toBeVisible()
  await input.press('Enter')
  await expect(page.locator('button[data-learning-level="scanner-systems"]')).toHaveClass(/active/)
  await expect(page.locator('[data-learning-active="scanner-systems"]')).toBeVisible()
})

test('direct lab result navigates to the exact lab anchor', async ({ page }) => {
  await page.goto('/')
  const input = page.locator('#atlas-search-input')
  await input.fill('Fourier imaging & MTF')
  const labResult = page.locator('[data-search-result="lab:fourier"]')
  await expect(labResult).toBeVisible()
  await expect(labResult.locator('.atlas-search-type')).toContainText(/Learning lab|Lab học/)
  await input.press('Enter')
  await expect(page.locator('#fourier-imaging-lab')).toBeVisible()
  await expect.poll(async () => page.evaluate(() => window.location.hash)).toBe('#fourier-imaging-lab')
})

test('keyboard selection and Escape remain accessible', async ({ page }) => {
  await page.goto('/')
  const input = page.locator('#atlas-search-input')
  await input.fill('high na')
  const options = page.locator('#atlas-search-results [role="option"]')
  await expect(options.first()).toHaveAttribute('aria-selected', 'true')
  await input.press('ArrowDown')
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true')
  await input.press('ArrowUp')
  await expect(options.first()).toHaveAttribute('aria-selected', 'true')
  await input.press('Escape')
  await expect(input).toHaveValue('')
  await expect(page.locator('#atlas-search-results')).toHaveCount(0)
})
