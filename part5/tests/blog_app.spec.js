const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'test',
        password: '1234'
      }
    })
    page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click()
    expect(page.getByTestId('username')).toBeVisible()
    expect(page.getByTestId('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
    await loginWith(page, 'test', '1234')
    await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async( { page }) => {
      await loginWith(page, 'test', 'wrongPassword')
      await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })
  })
})