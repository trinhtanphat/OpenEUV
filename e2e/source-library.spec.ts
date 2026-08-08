import { expect, test } from '@playwright/test'

test('Source Library derives sources and links back to evidence usages', async ({ page }) => {
  await page.goto('/')
  const library = page.locator('[data-source-library]')
  await expect(library).toHaveAttribute('data-source-audit', 'ok')
  await page.locator('[data-source-search]').fill('EUV-VACUUM-001')
  const cards = library.locator('.source-card')
  await expect(cards.first()).toBeVisible()
  await expect(cards.first().locator('.source-usages a[href="#evidence-EUV-VACUUM-001"]')).toBeVisible()
  await cards.first().locator('.source-usages a[href="#evidence-EUV-VACUUM-001"]').click()
  await expect(page.locator('[data-evidence-id="EUV-VACUUM-001"]')).toBeVisible()
  await expect.poll(async () => page.evaluate(() => window.location.hash)).toBe('#evidence-EUV-VACUUM-001')
})

test('Source Library filters by usage type and evidence class without network search', async ({ page }) => {
  await page.goto('/#source-library')
  const library = page.locator('[data-source-library]')
  await page.locator('[data-source-usage]').selectOption('patent')
  await expect(library.locator('.source-card').first()).toBeVisible()
  await expect(library.locator('.source-card .source-usages a').first()).toContainText('Patent')

  await page.locator('[data-source-usage]').selectOption('all')
  await page.locator('[data-source-class]').selectOption('C')
  await expect(library.locator('.source-card').first()).toBeVisible()
  await expect(library.locator('.source-card .source-classes')).toContainText('Class C')
})
