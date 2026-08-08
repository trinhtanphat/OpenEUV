import { expect, test } from '@playwright/test'

const cases = [
  {
    id: 'tsmc-euv-mask-dryclean',
    claim: 'TSMC-EUV-MASK-DRYCLEAN-2020',
    sourceHost: 'esg.tsmc.com',
    boundary: /does not reproduce cleaning chemistry|không/i,
  },
  {
    id: 'imec-cnt-pellicle',
    claim: 'IMEC-CNT-PELLICLE-2020',
    sourceHost: 'imec-int.com',
    boundary: /does not infer a foundry|current pellicle choice/i,
  },
  {
    id: 'zeiss-aims-euv-qualification',
    claim: 'ZEISS-AIMS-EUV-MASK-2023',
    sourceHost: 'zeiss.com',
    boundary: /does not infer proprietary inspection|acceptance thresholds/i,
  },
]

test('mask lifecycle cases expose shared claims, public sources and explicit boundaries', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#fab-cases')).toBeVisible()

  for (const item of cases) {
    const card = page.locator(`[data-fab-case="${item.id}"]`)
    await expect(card).toBeVisible()
    await expect(card).toContainText(item.claim)
    await expect(card.locator('[data-fab-source]').first()).toHaveAttribute('href', new RegExp(item.sourceHost.replace('.', '\\.')))
    await expect(card.locator('.case-boundary')).toContainText(item.boundary)
    await expect(card.locator('details')).toContainText(/unknown|remains/i)
  }
})
