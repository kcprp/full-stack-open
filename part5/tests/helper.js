const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'log in' }).click()
  await page.getByTestId('username').fill('test')
  await page.getByTestId('password').fill('1234')
  await page.getByRole('button', { name: 'log in '}).click()
}

const createBlog = async (page, blog) => {
  await page.getByTestId('title').fill(blog.title)
  await page.getByTestId('author').fill(blog.author)
  await page.getByTestId('url').fill(blog.url)
  await page.getByRole('button', { name: 'save' }).click()
  await page.getByText(`${blog.title} by ${blog.author}`)
}

module.exports = { loginWith, createBlog }