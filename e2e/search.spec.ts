import { expect, test } from '@playwright/test'

test('unified atlas search supports keyboard navigation and stable targets', async ({ page }) => {
  await page.goto('/')
  const search = page.locator('#atlas-search-input')
  await expect(search).toBeVisible()

  await search.fill('EP4239410A1')
  const patentResult = page.locator('[data-search-result="patent:EP4239410A1"]')
  await expect(patentResult).toBeVisible()
  await search.press('Enter')
  await expect(page).toHaveURL(/#patent-EP4239410A1$/)
  await expect(page.locator('#patent-EP4239410A1')).toBeVisible()

  await search.fill('scanner systems engineering')
  await expect(page.locator('[data-search-result="learning:scanner-systems"]')).toBeVisible()
  await search.press('Enter')
  await expect(page.locator('button[data-learning-level="scanner-systems"]')).toHaveClass(/active/)
  await expect(page.locator('[data-learning-active="scanner-systems"]')).toBeVisible()

  await search.fill('TSMC')
  await search.press('ArrowDown')
  await search.press('ArrowUp')
  await expect(page.locator('#atlas-search-results [aria-selected="true"]')).toHaveCount(1)
  await search.press('Escape')
  await expect(search).toHaveValue('')
  await expect(page.locator('#atlas-search-results')).toHaveCount(0)
})
