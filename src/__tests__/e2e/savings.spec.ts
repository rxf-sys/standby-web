import { test, expect } from '@playwright/test'

test.describe('Savings Goals', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')

    // Navigate to savings page
    await page.goto('/dashboard/savings')
  })

  test('should display savings goals page', async ({ page }) => {
    await expect(page.getByText('Sparziele')).toBeVisible()
    await expect(page.getByRole('button', { name: /neues sparziel/i })).toBeVisible()
  })

  test('should create a new savings goal', async ({ page }) => {
    // Open dialog
    await page.click('button:has-text("Neues Sparziel")')

    // Fill in details
    await page.fill('input#name', 'Urlaub 2025')
    await page.fill('input#targetAmount', '2000')
    await page.fill('input#currentAmount', '500')

    // Submit
    await page.click('button[type="submit"]:has-text("Erstellen")')

    // Verify success
    await expect(page.getByText('Sparziel erstellt')).toBeVisible()
  })

  test('should show progress for savings goal', async ({ page }) => {
    // Check for progress indicators
    const progressBars = page.locator('[role="progressbar"]')
    await expect(progressBars.first()).toBeVisible()
  })

  test('should add amount to savings goal', async ({ page }) => {
    // Find first savings goal card
    const goalCard = page.locator('.savings-goal-card').first()

    if (await goalCard.isVisible()) {
      // Add amount
      await goalCard.locator('input[type="number"]').fill('100')
      await goalCard.locator('button:has-text("Hinzufügen")').click()

      // Verify success
      await expect(page.getByText(/hinzugefügt/i)).toBeVisible()
    }
  })
})
