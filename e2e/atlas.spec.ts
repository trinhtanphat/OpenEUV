import { expect, test } from '@playwright/test'

test('atlas core interactions remain usable', async ({ page }, testInfo) => {
  await page.goto('/')
  await expect(page.locator('main')).toBeVisible()
  await expect(page.locator('.scanner-canvas')).toBeVisible()

  const canvas = page.locator('.scanner-canvas canvas')
  await expect(canvas).toBeVisible()
  const canvasHealth = await canvas.evaluate((node) => {
    const element = node as HTMLCanvasElement
    const gl = element.getContext('webgl2') || element.getContext('webgl')
    return { width: element.width, height: element.height, hasContext: Boolean(gl), lost: gl ? gl.isContextLost() : true }
  })
  expect(canvasHealth.width).toBeGreaterThan(100)
  expect(canvasHealth.height).toBeGreaterThan(100)
  expect(canvasHealth.hasContext).toBeTruthy()
  expect(canvasHealth.lost).toBeFalsy()

  const exploded = page.getByLabel('Exploded view')
  await exploded.fill('0.72')
  await expect(exploded).toHaveValue('0.72')

  const sourceButton = page.locator('button[data-subsystem-id="source"]')
  await sourceButton.click()
  await expect(sourceButton).toHaveClass(/active/)

  const inspector = page.locator('[data-evidence-inspector]')
  await expect(inspector).toHaveAttribute('data-subsystem', 'source')
  const collectorNode = page.locator('button[data-evidence-node="CollectorConcept"]')
  await collectorNode.click()
  await expect(inspector).toHaveAttribute('data-node', 'CollectorConcept')
  await expect(inspector).toContainText('PATENT-SOURCE-CONTAMINATION-001')

  await page.locator('button[data-tour-action="start"]').click()
  await expect(page.locator('[data-tour-stop="source"]')).toBeVisible()
  await expect(sourceButton).toHaveClass(/active/)
  await page.locator('button[data-tour-action="next"]').click()
  await expect(page.locator('[data-tour-stop="reticle"]')).toBeVisible()
  await expect(page.locator('button[data-subsystem-id="reticle"]')).toHaveClass(/active/)
  await page.locator('button[data-tour-action="free"]').click()

  const language = page.locator('.language-button')
  const beforeLanguage = (await language.textContent())?.trim()
  await language.click()
  const afterLanguage = (await language.textContent())?.trim()
  expect(afterLanguage).not.toBe(beforeLanguage)

  const highNaSlider = page.locator('#high-na-lab input[type="range"]').first()
  await highNaSlider.focus()
  const beforeK1 = Number(await highNaSlider.inputValue())
  await page.keyboard.press('ArrowRight')
  expect(Number(await highNaSlider.inputValue())).toBeGreaterThan(beforeK1)

  await page.locator('#mask-3d-lab input[type="range"]').first().fill('10')
  await expect(page.locator('#mask-3d-lab code')).toContainText('shadow')

  await page.locator('button[data-patent-filter="reticle"]').click()
  expect(await page.locator('.patent-card').count()).toBeGreaterThanOrEqual(3)
  await page.locator('button[data-coverage-subsystem="collector"]').click()
  await expect(page.locator('button[data-coverage-subsystem="collector"]')).toHaveClass(/active/)
  expect(await page.locator('.patent-card').count()).toBeGreaterThanOrEqual(2)

  const samsungCase = page.locator('[data-fab-case="samsung-7lpp-v1"]')
  await expect(samsungCase).toContainText('SAMSUNG-7LPP-EUV-2018')
  await expect(samsungCase).toContainText('SAMSUNG-V1-EUV-2020')
  const intelCase = page.locator('[data-fab-case="intel-highna-d1x"]')
  await expect(intelCase).toContainText('INTEL-HIGHNA-D1X-2024')
  const contaminationCase = page.locator('[data-fab-case="source-contamination-collector"]')
  await expect(contaminationCase).toContainText('PATENT-SOURCE-CONTAMINATION-001')
  await expect(contaminationCase).toContainText('PATENT-COLLECTOR-MIRROR-001')

  const stageControls = page.locator('#stage-lab input[type="range"]')
  await expect(stageControls).toHaveCount(6)
  await stageControls.first().fill('20')
  await expect(stageControls.first()).toHaveValue('20')

  const allRanges = page.locator('input[type="range"]')
  const labels = await allRanges.evaluateAll((elements) => elements.map((element) => element.getAttribute('aria-label') || element.closest('label')?.textContent?.trim() || ''))
  expect(labels.length).toBeGreaterThan(10)
  expect(labels.every((label) => label.length > 0)).toBeTruthy()

  if (testInfo.project.name === 'desktop-chromium') {
    await page.screenshot({ path: testInfo.outputPath('atlas-desktop.png'), fullPage: true })
  }
})

test('procedural scanner fallback survives a blocked source asset', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'One fallback network test is sufficient')
  await page.route('**/models/euv-source-collector-concept.gltf', (route) => route.abort())
  await page.goto('/')
  await expect(page.locator('.scanner-canvas canvas')).toBeVisible()
  const sourceButton = page.locator('button[data-subsystem-id="source"]')
  await sourceButton.click()
  await expect(sourceButton).toHaveClass(/active/)
  await expect(page.locator('.subsystem-detail h3')).toContainText(/Source|Nguồn/i)
  await expect(page.locator('[data-evidence-inspector]')).toHaveAttribute('data-subsystem', 'source')
})
