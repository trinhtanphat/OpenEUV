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
  await expect(page.locator('.patent-card')).toHaveCount(2)

  const stageControls = page.locator('#stage-lab input[type="range"]')
  await expect(stageControls).toHaveCount(6)
  await stageControls.first().fill('20')
  await expect(stageControls.first()).toHaveValue('20')

  const allRanges = page.locator('input[type="range"]')
  const count = await allRanges.count()
  expect(count).toBeGreaterThan(10)
  for (let index = 0; index < count; index += 1) {
    const input = allRanges.nth(index)
    const labelText = await input.evaluate((element) => element.getAttribute('aria-label') || element.closest('label')?.textContent?.trim() || '')
    expect(labelText.length).toBeGreaterThan(0)
  }

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
})
