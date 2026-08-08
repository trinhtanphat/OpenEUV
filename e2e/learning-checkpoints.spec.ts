import { expect, test } from '@playwright/test'

test('L0-L5 learning checkpoints are interactive, bilingual and session-only UI', async ({ page }) => {
  await page.goto('/')

  await page.locator('button[data-learning-level="optics"]').click()
  const optics = page.locator('[data-learning-checkpoint="l1-na"]')
  await expect(optics).toBeVisible()
  await expect(optics.locator('[data-checkpoint-option]')).toHaveCount(3)

  await optics.locator('[data-checkpoint-option="1"]').click()
  await expect(optics.locator('[data-checkpoint-result="review"]')).toBeVisible()
  await optics.locator('[data-checkpoint-option="0"]').click()
  await expect(optics.locator('[data-checkpoint-result="correct"]')).toBeVisible()
  await expect(optics).toContainText(/does not send or persist/i)

  await page.locator('button[data-learning-level="high-na"]').click()
  const highNa = page.locator('[data-learning-checkpoint="l4-anamorphic"]')
  await expect(highNa).toBeVisible()
  await expect(highNa).toContainText(/4×\/8×/)

  await page.locator('.language-button').click()
  await expect(highNa).toContainText(/công khai/i)
  await expect(highNa).toContainText(/không gửi hoặc lưu/i)

  await page.locator('button[data-learning-level="research"]').click()
  const research = page.locator('[data-learning-checkpoint="l5-class-d"]')
  await expect(research).toBeVisible()
  await expect(research).toContainText(/Class D/)
})
