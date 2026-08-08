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

  const sceneShell = page.locator('.scene-shell')
  await expect(sceneShell).toHaveAttribute('data-scene-lod', /high|balanced|low/)
  if (testInfo.project.name.includes('mobile')) await expect(sceneShell).toHaveAttribute('data-scene-lod', 'low')

  const exploded = page.getByLabel('Exploded view')
  await exploded.fill('0.72')
  await expect(exploded).toHaveValue('0.72')

  const sourceButton = page.locator('button[data-subsystem-id="source"]')
  await sourceButton.click()
  await expect(sourceButton).toHaveClass(/active/)

  const inspector = page.locator('[data-evidence-inspector]')
  await expect(inspector).toHaveAttribute('data-subsystem', 'source')
  const collectorLabel = page.locator('button[data-concept-label="CollectorConcept"]')
  await expect(collectorLabel).toBeVisible()
  await collectorLabel.click()
  await expect(inspector).toHaveAttribute('data-node', 'CollectorConcept')
  await expect(inspector).toContainText('PATENT-SOURCE-CONTAMINATION-001')
  await expect(inspector.locator('[data-evidence-id="PATENT-SOURCE-CONTAMINATION-001"]')).toHaveAttribute('data-review-state', 'unreviewed')

  await page.locator('button[data-tour-action="start"]').click()
  await expect(page.locator('[data-tour-stop="source"]')).toBeVisible()
  await expect(sourceButton).toHaveClass(/active/)
  await page.locator('button[data-tour-action="next"]').click()
  await expect(page.locator('[data-tour-stop="reticle"]')).toBeVisible()
  await expect(page.locator('button[data-subsystem-id="reticle"]')).toHaveClass(/active/)
  await page.locator('button[data-tour-action="free"]').click()

  const assemblySource = page.locator('button[data-assembly-stage="source"]')
  await expect(assemblySource).toBeVisible()
  await assemblySource.click()
  await expect(page.locator('[data-assembly-selected="source"]')).toBeVisible()
  await expect(page.locator('[data-assembly-selected="source"]')).toContainText(/laser operating instructions|hướng dẫn vận hành laser/i)

  const opticsLearning = page.locator('button[data-learning-level="optics"]')
  await opticsLearning.click()
  await expect(page.locator('[data-learning-active="optics"]')).toContainText('Fourier imaging lab')
  const researchLearning = page.locator('button[data-learning-level="research"]')
  await expect(researchLearning).toBeVisible()
  await researchLearning.click()
  await expect(page.locator('[data-learning-active="research"]')).toBeVisible()
  await expect(page.locator('[data-learning-active="research"]')).toContainText(/Patent Explorer|Evidence Dashboard/i)

  const reviewCoverage = page.locator('[data-review-coverage]')
  await expect(reviewCoverage).toBeVisible()
  await expect(reviewCoverage).toContainText('unreviewed')

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

  const fourierLab = page.locator('#fourier-imaging-lab')
  await expect(fourierLab).toBeVisible()
  await expect(page.locator('[data-lab-guide="fourier"]')).toBeVisible()
  await page.getByLabel('Normalized pattern spatial frequency').fill('0.50')
  await page.getByLabel('Normalized pupil cutoff').fill('0.30')
  await expect(fourierLab.locator('[data-fourier-status="beyond-cutoff"]')).toBeVisible()
  await page.getByLabel('Normalized pupil cutoff').fill('1.20')
  await expect(fourierLab.locator('[data-fourier-status="within-cutoff"]')).toBeVisible()

  const publicMo = page.locator('button[data-load-public-mo]')
  await publicMo.click()
  await expect(page.locator('#multilayer-lab .dataset-provenance').first()).toContainText('RIINFO-MO-WINDT-1988-R6F3B772')
  await expect(page.locator('#multilayer-lab .dataset-provenance').first()).toContainText(/CC0/i)

  await page.locator('#mask-3d-lab input[type="range"]').first().fill('10')
  await expect(page.locator('#mask-3d-lab code')).toContainText('shadow')

  await expect(page.locator('#patents')).toHaveAttribute('data-patent-audit', 'ok')
  await expect(page.locator('[data-patent-provenance-summary]')).toContainText('Metadata provenance')
  await page.locator('button[data-patent-filter="reticle"]').click()
  expect(await page.locator('.patent-card').count()).toBeGreaterThanOrEqual(3)
  await page.locator('button[data-coverage-subsystem="metrology"]').click()
  await expect(page.locator('button[data-coverage-subsystem="metrology"]')).toHaveClass(/active/)
  expect(await page.locator('.patent-card').count()).toBeGreaterThanOrEqual(4)
  const sourceMetrologyPatent = page.locator('[data-patent-id="WO2022243006A1"]')
  await expect(sourceMetrologyPatent).toBeVisible()
  await expect(sourceMetrologyPatent).toHaveAttribute('data-provenance-score', /\d+/)

  const samsungCase = page.locator('[data-fab-case="samsung-7lpp-v1"]')
  await expect(samsungCase).toContainText('SAMSUNG-7LPP-EUV-2018')
  await expect(samsungCase).toContainText('SAMSUNG-V1-EUV-2020')
  const intelCase = page.locator('[data-fab-case="intel-highna-d1x"]')
  await expect(intelCase).toContainText('INTEL-HIGHNA-D1X-2024')
  const micronCase = page.locator('[data-fab-case="micron-1gamma-euv"]')
  await expect(micronCase).toContainText('MICRON-1GAMMA-EUV-2025')
  const skHynixCase = page.locator('[data-fab-case="skhynix-1anm-euv"]')
  await expect(skHynixCase).toContainText('SKHYNIX-1ANM-EUV-2021')
  const rapidusCase = page.locator('[data-fab-case="rapidus-iim1-euv"]')
  await expect(rapidusCase).toContainText('RAPIDUS-IIM1-EUV-2025')
  const contaminationCase = page.locator('[data-fab-case="source-contamination-collector"]')
  await expect(contaminationCase).toContainText('PATENT-SOURCE-CONTAMINATION-001')
  await expect(contaminationCase).toContainText('PATENT-COLLECTOR-MIRROR-001')

  const stageControls = page.locator('#stage-lab input[type="range"]')
  await expect(stageControls).toHaveCount(6)
  await stageControls.first().fill('20')
  await expect(stageControls.first()).toHaveValue('20')

  const allRanges = page.locator('input[type="range"]')
  const labels = await allRanges.evaluateAll((elements) => elements.map((element) => element.getAttribute('aria-label') || element.closest('label')?.textContent?.trim() || ''))
  expect(labels.length).toBeGreaterThan(12)
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
  await expect(page.locator('button[data-concept-label="CollectorConcept"]')).toBeVisible()
})
