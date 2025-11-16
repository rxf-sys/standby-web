import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login')

    await expect(page.locator('h1')).toContainText('Anmelden')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('should display register page', async ({ page }) => {
    await page.goto('/register')

    await expect(page.locator('h1')).toContainText('Registrieren')
    await expect(page.locator('input[id="name"]')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })

  test('should navigate between login and register', async ({ page }) => {
    await page.goto('/login')

    // Click on register link
    await page.click('text=Jetzt registrieren')
    await expect(page).toHaveURL('/register')

    // Click on login link
    await page.click('text=Jetzt anmelden')
    await expect(page).toHaveURL('/login')
  })

  test('should show password reset page', async ({ page }) => {
    await page.goto('/login')

    await page.click('text=Passwort vergessen?')
    await expect(page).toHaveURL('/reset-password')
    await expect(page.locator('h1')).toContainText('Passwort zurücksetzen')
  })
})
