const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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

  describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {
      await loginWith(page, 'test', '1234')
    })

    test.only('a new blog can be created', async ({ page }) => {
      const testBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'test-blog.com'
      }
      await createBlog(page, testBlog)
      
      setTimeout(() => {}, 5000); // Wait for notifaciton to pass
      await expect(page.getByText('a new blog Test Blog by Test Author added')).toBeVisible()
    })
  })
})