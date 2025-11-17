import { test, expect } from '@playwright/test'

test.describe('Calendar Events', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')

    // Navigate to calendar page
    await page.goto('/dashboard/calendar')
  })

  test('should display calendar page', async ({ page }) => {
    await expect(page.getByText('Kalender')).toBeVisible()
    await expect(page.getByRole('button', { name: /neuer termin/i })).toBeVisible()
  })

  test('should create a new event', async ({ page }) => {
    // Open dialog
    await page.click('button:has-text("Neuer Termin")')

    // Fill in event details
    await page.fill('input#title', 'Wichtiges Meeting')
    await page.fill('textarea#description', 'Team-Meeting für Projekt X')
    await page.selectOption('select#category', 'work')

    // Submit
    await page.click('button[type="submit"]:has-text("Erstellen")')

    // Verify success
    await expect(page.getByText('Termin erstellt')).toBeVisible()
  })

  test('should filter events by category', async ({ page }) => {
    // Check for category filter buttons
    await expect(page.getByRole('button', { name: /alle/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /uni/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /arbeit/i })).toBeVisible()
  })

  test('should toggle all-day event', async ({ page }) => {
    await page.click('button:has-text("Neuer Termin")')

    // Check all-day checkbox
    await page.check('input#isAllDay')

    // Verify date input changes
    const startDateInput = page.locator('input#startDate')
    await expect(startDateInput).toHaveAttribute('type', 'date')
  })
})
