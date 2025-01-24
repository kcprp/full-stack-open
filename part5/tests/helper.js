const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'log in' }).click()
  await page.getByTestId('username').fill('test')
  await page.getByTestId('password').fill('1234')
  await page.getByRole('button', { name: 'log in '}).click()
}

module.exports = { loginWith }