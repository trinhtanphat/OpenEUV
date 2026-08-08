import { expect, test } from '@playwright/test'

test('Literature Explorer filters curated public research by topic and type', async ({ page }) => {
  await page.goto('/#literature')
  const explorer = page.locator('[data-literature-explorer]')
  await expect(explorer).toBeVisible()
  await expect(explorer.locator('[data-literature-doi]')).toHaveCount(5)

  await page.locator('[data-literature-topic]').selectOption('resist')
  await expect(explorer.locator('[data-literature-doi]')).toHaveCount(1)
  await expect(explorer.locator('.literature-card').first()).toContainText('Stochastic Issues')

  await page.locator('[data-literature-topic]').selectOption('all')
  await page.locator('[data-literature-type]').selectOption('conference')
  await expect(explorer.locator('.literature-card').first()).toBeVisible()
  await expect(explorer.locator('.literature-card .literature-meta').first()).toContainText('Conference')
})

test('Literature Explorer exposes DOI, public source, claim and lab mappings', async ({ page }) => {
  await page.goto('/#literature')
  const explorer = page.locator('[data-literature-explorer]')
  await page.locator('[data-literature-search]').fill('10.1117/12.2515678')

  const card = explorer.locator('[data-literature-doi="10.1117/12.2515678"]')
  await expect(card).toBeVisible()
  await expect(card.locator('a[href="https://doi.org/10.1117/12.2515678"]')).toBeVisible()
  await expect(card.locator('a[href="#evidence-HIGHNA-NA-001"]')).toBeVisible()
  await expect(card.locator('a[href="#mask-3d-lab"]')).toBeVisible()
})

test('Atlas Search finds a literature DOI and opens the exact paper card', async ({ page }) => {
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
