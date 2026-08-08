import { expect, test } from '@playwright/test'

test('skip link is first-focusable and navigates to the main landmark', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  const skip = page.locator('.skip-link')
  await expect(skip).toBeFocused()
  await expect(skip).toBeVisible()
  await page.keyboard.press('Enter')
  await expect.poll(async () => page.evaluate(() => window.location.hash)).toBe('#main-content')
  await expect(page.locator('main#main-content')).toBeVisible()
})

test('stateful search navigation honors reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() => {
    Element.prototype.scrollIntoView = function (options?: boolean | ScrollIntoViewOptions) {
      ;(window as unknown as { __openeuvScrollBehavior?: ScrollBehavior }).__openeuvScrollBehavior = typeof options === 'object' ? options.behavior : undefined
    }
  })
  await page.goto('/')
  const input = page.locator('#atlas-search-input')
  await input.fill('scanner systems engineering')
  await input.press('Enter')
  await expect(page.locator('[data-learning-active="scanner-systems"]')).toBeVisible()
  await expect.poll(async () => page.evaluate(() => (window as unknown as { __openeuvScrollBehavior?: ScrollBehavior }).__openeuvScrollBehavior)).toBe('auto')
})

test('learning checkpoint can be answered with keyboard only', async ({ page }) => {
  await page.goto('/')
  const level = page.locator('button[data-learning-level="optics"]')
  await level.focus()
  await page.keyboard.press('Enter')
  const checkpoint = page.locator('[data-learning-checkpoint="l1-na"]')
  await expect(checkpoint).toBeVisible()
  const answer = checkpoint.locator('[data-checkpoint-option="0"]')
  await answer.focus()
  await page.keyboard.press('Space')
  await expect(checkpoint.locator('[data-checkpoint-result="correct"]')).toBeVisible()
})

test('provenance overview exports a local JSON snapshot without upload', async ({ page }) => {
  await page.goto('/')
  const panel = page.locator('[data-provenance-overview]')
  await expect(panel).toBeVisible()
  await expect(panel).toContainText(/bookkeeping|không phải xếp hạng/i)
  await expect(panel.locator('a[href="#patents"]')).toBeVisible()
  await expect(panel.locator('a[href="#fab-cases"]')).toBeVisible()

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    panel.locator('[data-download-research-snapshot]').click(),
  ])
  expect(download.suggestedFilename()).toMatch(/^openeuv-research-snapshot-\d{4}-\d{2}-\d{2}\.json$/)
  await expect(panel.locator('[data-snapshot-status]')).toContainText(/no data was uploaded|không có dữ liệu nào được upload/i)
})
