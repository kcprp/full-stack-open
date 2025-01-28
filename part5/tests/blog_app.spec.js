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

    test('a new blog can be created', async ({ page }) => {
      const testBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'test-blog.com'
      }
      await page.getByRole('button', { name: 'new blog' }).click()
      await createBlog(page, testBlog)
      
      setTimeout(() => {}, 5000); // Wait for notifaciton to pass
      await expect(page.getByText('a new blog Test Blog by Test Author added')).toBeVisible()
    })

    test('multiple blogs can be created', async ({ page }) => {
      const testBlog = { title: 'Test Blog', author: 'Test Author', url: 'test-blog.com' } 
      const testBlog2 = { title: 'Test Blog 2', author: 'Test Author', url: 'test-blog2.com' }
      const testBlog3 = { title: 'Test Blog 3', author: 'Test Author', url: 'test-blog3.com' }

      await page.getByRole('button', { name: 'new blog' }).click()

      // Create blogs and wait for notifications after each creation
      await createBlog(page, testBlog)
      await expect(page.getByText(`a new blog ${testBlog.title} by ${testBlog.author} added`)).toBeVisible()
      
      await createBlog(page, testBlog2)
      await expect(page.getByText(`a new blog ${testBlog2.title} by ${testBlog2.author} added`)).toBeVisible()
      
      await createBlog(page, testBlog3)
      await expect(page.getByText(`a new blog ${testBlog3.title} by ${testBlog3.author} added`)).toBeVisible()
    })

    describe('When blog created', () => {
      beforeEach(async ({ page, request }) => {
        const testBlog = {
          title: 'Test Blog',
          author: 'Test Author',
          url: 'test-blog.com'
        }
        await page.getByRole('button', { name: 'new blog' }).click()
        await createBlog(page, testBlog) 
      })

      test('a blog can be liked', async ({ page }) => {
        const blogDiv = await page.getByText('Test Blog').locator('..')
        await blogDiv.getByRole('button', { name: 'view' }).click()
        await blogDiv.getByRole('button', { name: 'like'}).click()
        await expect(blogDiv.getByText('likes 1')).toBeVisible()
      })

      test.only('a blog can be deleted', async ({ page }) => {
        const blogDiv = await page.getByText('Test Blog').locator('..')
        await blogDiv.getByRole('button', { name: 'view' }).click()
        
        page.on('dialog', dialog => dialog.accept())
        await blogDiv.getByRole('button', { name: 'remove' }).click()
        
        // Wait for the blogDiv element to be removed from the DOM
        await expect(blogDiv).toBeHidden()
        
      })
    })
  })
})