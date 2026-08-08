import { expect, test } from '@playwright/test'

test('renderer benchmark v2 produces a schema-ready privacy-safe capture', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Benchmark smoke runs once on desktop Chromium')

  await page.goto('/benchmarks/render-benchmark.html?auto=1')
  await expect(page.locator('html')).toHaveAttribute('data-benchmark-complete', 'true', { timeout: 30_000 })
  await expect(page.locator('#webgl-result')).toContainText('"status": "ok"')
  await expect(page.locator('#copy')).toBeDisabled()
  await expect(page.locator('#download')).toBeDisabled()
  await expect(page.locator('#status')).toContainText(/fill required OS\/browser metadata/i)

  const raw = await page.evaluate(() => (window as typeof window & { __OPENEUV_BENCHMARK__?: unknown }).__OPENEUV_BENCHMARK__)
  expect(raw).toBeTruthy()
  const benchmark = raw as {
    benchmarkVersion: number
    syncMode: string
    webgl: { status: string; samples?: number; averageMs?: number }
    webgpu: { status: string; samples?: number }
  }
  expect(benchmark.benchmarkVersion).toBe(2)
  expect(benchmark.syncMode).toBe('explicit-gpu-completion')
  expect(benchmark.webgl.status).toBe('ok')
  expect(benchmark.webgl.samples).toBeGreaterThan(50)
  expect(benchmark.webgl.averageMs).toBeGreaterThan(0)
  expect(['ok', 'skipped']).toContain(benchmark.webgpu.status)
  if (benchmark.webgpu.status === 'ok') expect(benchmark.webgpu.samples).toBeGreaterThan(50)

  await page.locator('#device-class').selectOption('desktop')
  await page.locator('#os').fill('Playwright test OS')
  await page.locator('#browser').fill('Playwright Chromium')
  await page.locator('#power-mode').selectOption('unknown')
  await expect(page.locator('#copy')).toBeEnabled()
  await expect(page.locator('#download')).toBeEnabled()
  await expect(page.locator('#status')).toContainText(/capture ready/i)

  const captureText = await page.locator('#capture-json').textContent()
  expect(captureText).toBeTruthy()
  const capture = JSON.parse(captureText ?? '{}')
  expect(capture.schemaVersion).toBe(1)
  expect(capture.capture.deviceClass).toBe('desktop')
  expect(capture.capture.os).toBe('Playwright test OS')
  expect(capture.capture.browser).toBe('Playwright Chromium')
  expect(capture.capture.timezone).toBeTruthy()
  expect(capture.capture.viewport).toMatch(/^\d+x\d+$/)
  expect(capture.benchmark.benchmarkVersion).toBe(2)
  expect(capture.benchmark.syncMode).toBe('explicit-gpu-completion')
  expect(capture.benchmark.webgl.status).toBe('ok')
  expect(capture.capture.serialNumber).toBeUndefined()
  expect(capture.capture.ipAddress).toBeUndefined()
})
