import { expect, test } from '@playwright/test'

test('Literature Explorer filters curated public research by topic and type', async ({ page }) => {
  await page.goto('/#literature')
  const explorer = page.locator('[data-literature-explorer]')
  await expect(explorer).toBeVisible()

  await page.locator('[data-literature-topic]').selectOption('resist')
  const resistCards = explorer.locator('.literature-card')
  await expect(resistCards).toHaveCount(1)
  await expect(resistCards.first()).toContainText('Stochastic Issues')

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
