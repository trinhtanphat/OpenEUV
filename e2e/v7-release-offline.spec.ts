import { expect, test } from '@playwright/test'

test('public build provenance is visible and attached to research export panel', async ({ page }) => {
  await page.goto('/')
  const build = page.locator('[data-build-provenance]')
  await expect(build).toContainText('v0.9.0')
  await expect(page.locator('[data-provenance-overview]')).toHaveAttribute('data-build-version', '0.9.0')
})

test('web app manifest and original icon metadata are linked', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.webmanifest')
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/openeuv-icon.svg')
  const manifest = await page.evaluate(async () => (await fetch('/manifest.webmanifest')).json())
  expect(manifest.name).toBe('OpenEUV Atlas')
  expect(manifest.icons[0].src).toBe('/openeuv-icon.svg')
})

test('Vite development mode does not register the production service worker', async ({ page }) => {
  await page.goto('/')
  const registrations = await page.evaluate(async () => 'serviceWorker' in navigator ? (await navigator.serviceWorker.getRegistrations()).length : 0)
  expect(registrations).toBe(0)
})
