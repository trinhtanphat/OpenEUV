import { expect, test } from '@playwright/test'

test('renderer benchmark always records a WebGL baseline and treats WebGPU as optional', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'One benchmark browser is sufficient for CI smoke coverage')
  await page.goto('/benchmarks/render-benchmark.html?auto=1')
  await expect(page.locator('html')).toHaveAttribute('data-benchmark-complete', 'true', { timeout: 30_000 })
  const result = await page.evaluate(() => (window as typeof window & { __OPENEUV_BENCHMARK__?: unknown }).__OPENEUV_BENCHMARK__)
  expect(result).toBeTruthy()
  const typed = result as { webgl: { status: string; samples?: number; averageMs?: number }; webgpu: { status: string; samples?: number } }
  expect(typed.webgl.status).toBe('ok')
  expect(typed.webgl.samples).toBeGreaterThan(50)
  expect(typed.webgl.averageMs).toBeGreaterThan(0)
  expect(['ok', 'skipped']).toContain(typed.webgpu.status)
  if (typed.webgpu.status === 'ok') expect(typed.webgpu.samples).toBeGreaterThan(50)
})
