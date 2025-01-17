import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls the event handler it received as props with the right details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const titleInput = container.querySelector('#title-input')
  const authorInput = container.querySelector('#author-input')
  const urlInput = container.querySelector('#url-input')
  const saveButton = screen.getByText('save')

  await user.type(titleInput, 'This is a test blog')
  await user.type(authorInput, 'kcprp')
  await user.type(urlInput, 'test-blog.com')
  await user.click(saveButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'This is a test blog',
    author: 'kcprp',
    url: 'test-blog.com'
  })
})