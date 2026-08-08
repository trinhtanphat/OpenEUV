import { expect, test } from '@playwright/test'

test('renderer benchmark produces a schema-ready privacy-safe capture', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Benchmark smoke runs once on desktop Chromium')

  await page.goto('/benchmarks/render-benchmark.html?auto=1')
  await expect(page.locator('html')).toHaveAttribute('data-benchmark-complete', 'true', { timeout: 20_000 })
  await expect(page.locator('#webgl-result')).toContainText('"status": "ok"')
  await expect(page.locator('#copy')).toBeEnabled()
  await expect(page.locator('#download')).toBeEnabled()

  await page.locator('#device-class').selectOption('desktop')
  await page.locator('#os').fill('Playwright test OS')
  await page.locator('#browser').fill('Playwright Chromium')
  await page.locator('#power-mode').selectOption('unknown')

  const captureText = await page.locator('#capture-json').textContent()
  expect(captureText).toBeTruthy()
  const capture = JSON.parse(captureText ?? '{}')
  expect(capture.schemaVersion).toBe(1)
  expect(capture.capture.deviceClass).toBe('desktop')
  expect(capture.capture.os).toBe('Playwright test OS')
  expect(capture.capture.browser).toBe('Playwright Chromium')
  expect(capture.capture.timezone).toBeTruthy()
  expect(capture.capture.viewport).toMatch(/^\d+x\d+$/)
  expect(capture.benchmark.webgl.status).toBe('ok')
  expect(capture.capture.serialNumber).toBeUndefined()
  expect(capture.capture.ipAddress).toBeUndefined()
})
