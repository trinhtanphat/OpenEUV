import { expect, test } from '@playwright/test'

test('illumination and vacuum concept nodes stay evidence-linked', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'One desktop evidence-node pass is sufficient')
  await page.goto('/')

  const inspector = page.locator('[data-evidence-inspector]')

  await page.locator('button[data-subsystem-id="illuminator"]').click()
  const illuminationLabel = page.locator('button[data-concept-label="CollectorHandoff"]')
  await expect(illuminationLabel).toBeVisible()
  await expect(illuminationLabel).toHaveAttribute('data-geometry-status', 'public-inference')
  await illuminationLabel.click()
  await expect(inspector).toHaveAttribute('data-subsystem', 'illuminator')
  await expect(inspector).toHaveAttribute('data-node', 'CollectorHandoff')
  await expect(inspector).toContainText('HIGHNA-ILLUMINATION-001')
  await expect(page.locator('button[data-evidence-node="PupilShapingConcept"]')).toBeVisible()

  await page.locator('button[data-subsystem-id="vacuum"]').click()
  const vacuumLabel = page.locator('button[data-concept-label="VacuumPlatform"]')
  await expect(vacuumLabel).toBeVisible()
  await expect(vacuumLabel).toHaveAttribute('data-geometry-status', 'illustrative')
  await vacuumLabel.click()
  await expect(inspector).toHaveAttribute('data-subsystem', 'vacuum')
  await expect(inspector).toHaveAttribute('data-node', 'VacuumPlatform')
  await expect(inspector).toContainText('EUV-VACUUM-001')
  await expect(page.locator('button[data-evidence-node="OpticalPathEnvelope"]')).toBeVisible()
})

test('procedural illumination and vacuum concepts survive all external model failures', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Fallback network test runs once')
  await page.route('**/models/**', (route) => route.abort())
  await page.goto('/')
  await expect(page.locator('.scanner-canvas canvas')).toBeVisible()

  await page.locator('button[data-subsystem-id="illuminator"]').click()
  await expect(page.locator('button[data-concept-label="CollectorHandoff"]')).toBeVisible()
  await page.locator('button[data-evidence-node="FieldMirrorConcept-1"]').click()
  await expect(page.locator('[data-evidence-inspector]')).toHaveAttribute('data-node', 'FieldMirrorConcept-1')

  await page.locator('button[data-subsystem-id="vacuum"]').click()
  await expect(page.locator('button[data-concept-label="VacuumPlatform"]')).toBeVisible()
  await page.locator('button[data-evidence-node="OpticalPathEnvelope"]').click()
  await expect(page.locator('[data-evidence-inspector]')).toHaveAttribute('data-node', 'OpticalPathEnvelope')
  await expect(page.locator('[data-evidence-inspector]')).toContainText('EUV-VACUUM-001')
})
