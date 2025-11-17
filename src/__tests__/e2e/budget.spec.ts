import { test, expect } from '@playwright/test'

test.describe('Budget Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')

    // Login with test credentials
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')

    // Wait for dashboard to load
    await page.waitForURL('/dashboard')
  })

  test('should display budget overview', async ({ page }) => {
    // Navigate to budget page
    await page.click('a[href="/dashboard/budget"]')
    await page.waitForURL('/dashboard/budget')

    // Check for key elements
    await expect(page.getByText('Budget')).toBeVisible()
    await expect(page.getByText('Einnahmen')).toBeVisible()
    await expect(page.getByText('Ausgaben')).toBeVisible()
  })

  test('should create a new transaction', async ({ page }) => {
    // Navigate to budget page
    await page.goto('/dashboard/budget')

    // Open transaction dialog
    await page.click('button:has-text("Neue Transaktion")')

    // Fill in transaction details
    await page.selectOption('select#type', 'expense')
    await page.fill('input#amount', '50.00')
    await page.fill('textarea#description', 'Test-Ausgabe')

    // Submit form
    await page.click('button[type="submit"]:has-text("Erstellen")')

    // Verify success message appears
    await expect(page.getByText('Transaktion erstellt')).toBeVisible()
  })

  test('should filter transactions by type', async ({ page }) => {
    await page.goto('/dashboard/budget')

    // Check for filter buttons
    await expect(page.getByRole('button', { name: /alle/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /einnahmen/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /ausgaben/i })).toBeVisible()

    // Click expense filter
    await page.click('button:has-text("Ausgaben")')

    // Verify URL contains filter
    await expect(page).toHaveURL(/type=expense/)
  })
})
