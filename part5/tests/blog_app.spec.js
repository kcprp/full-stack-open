const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click()
    expect(page.getByTestId('username')).toBeVisible()
    expect(page.getByTestId('password')).toBeVisible()
  })
})