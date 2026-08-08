import { expect, test } from '@playwright/test'

test('normalized EUV path lab reacts monotonically without exposing real vacuum parameters', async ({ page }) => {
  await page.goto('/')
  const lab = page.locator('#mirror-vacuum-concept-lab')
  await expect(lab).toBeVisible()
  await expect(lab).toContainText('EUV-VACUUM-001')

  const absorption = lab.getByLabel('Normalized absorption index')
  const referenceValue = async () => Number.parseFloat((await lab.locator('[data-path-kind="absorbing"] strong').textContent()) ?? '0')
  const before = await referenceValue()
  await absorption.fill('1')
  const after = await referenceValue()
  expect(after).toBeLessThan(before)

  await expect(lab.getByLabel('Normalized path length')).toBeVisible()
  await expect(lab.getByLabel('Normalized per-reflection transfer')).toBeVisible()
  await expect(lab.getByLabel('Illustrative reflection count')).toBeVisible()
  await expect(lab.locator('input')).toHaveCount(4)
  await expect(lab.locator('a[target="_blank"]')).toHaveCount(2)

  await expect(lab).not.toContainText(/mbar|pascal|torr|pump|evacuate|pump-down/i)
})

test('global search can navigate directly to the mirror-vacuum learning lab', async ({ page }) => {
  await page.goto('/')
  const input = page.locator('#atlas-search-input')
  await input.fill('Why EUV needs vacuum & mirrors')
  await expect(page.locator('[data-search-result="lab:vacuum-mirrors"]')).toBeVisible()
  await input.press('Enter')
  await expect(page.locator('#mirror-vacuum-concept-lab')).toBeVisible()
  await expect.poll(async () => page.evaluate(() => window.location.hash)).toBe('#mirror-vacuum-concept-lab')
})
