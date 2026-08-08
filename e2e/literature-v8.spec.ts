import { expect, test } from '@playwright/test'

test('Literature Explorer filters curated records by topic and publication type', async ({ page }) => {
  await page.goto('/#literature')
  const explorer = page.locator('[data-literature-explorer]')
  await expect(explorer).toBeVisible()
  await expect(explorer.locator('[data-literature-doi]')).toHaveCount(5)

  await page.locator('[data-literature-topic]').selectOption('multilayer')
  await expect(explorer.locator('[data-literature-doi]')).toHaveCount(2)
  await page.locator('[data-literature-type]').selectOption('preprint')
  await expect(explorer.locator('[data-literature-doi]')).toHaveCount(2)
})

test('Literature Explorer maps papers back to claims and labs', async ({ page }) => {
  await page.goto('/#literature')
  const explorer = page.locator('[data-literature-explorer]')
  await page.locator('[data-literature-search]').fill('10.48550/arxiv.1912.09075')
  const paper = explorer.locator('[data-literature-doi="10.48550/arxiv.1912.09075"]')
  await expect(paper).toBeVisible()
  await expect(paper.locator('a[href="#evidence-ACADEMIC-EUV-MASK-MODEL-001"]')).toBeVisible()
  await expect(paper.locator('a[href="#mask-3d-lab"]')).toBeVisible()
})

test('Atlas Search finds literature DOI and opens the exact paper card', async ({ page }) => {
  await page.goto('/')
  const input = page.locator('#atlas-search-input')
  await input.fill('10.48550/arxiv.1912.09075')
  const result = page.locator('[data-search-result="literature:10.48550/arxiv.1912.09075"]')
  await expect(result).toBeVisible()
  await expect(result.locator('.atlas-search-type')).toContainText(/Academic literature|Tài liệu học thuật/)
  await input.press('Enter')
  await expect(page.locator('[data-literature-doi="10.48550/arxiv.1912.09075"]')).toBeVisible()
  await expect.poll(async () => page.evaluate(() => window.location.hash)).toBe('#literature-10-48550-arxiv-1912-09075')
})
