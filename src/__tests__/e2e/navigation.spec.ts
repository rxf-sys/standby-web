import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should display landing page', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('h1')).toContainText('StandBy')
    await expect(page.locator('text=Jetzt starten')).toBeVisible()
    await expect(page.locator('text=Anmelden')).toBeVisible()
  })

  test('should have all feature cards on landing page', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('text=Budget')).toBeVisible()
    await expect(page.locator('text=Rezepte')).toBeVisible()
    await expect(page.locator('text=Kalender')).toBeVisible()
    await expect(page.locator('text=Sparziele')).toBeVisible()
  })
})
