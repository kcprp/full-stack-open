import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container

  beforeEach(() => {
    const blog = {
      title: 'This is a test blog',
      author: 'kcprp',
      url: 'test-blog.com',
      likes: '2137'
    }

    container = render(<Blog blog={blog} />).container
  })

  test('renders blog\'s title and author, but not URL or likes by default', () => {
    // Visible
    const title = screen.getByText('This is a test blog', { exact: false })
    const author = screen.getByText('kcprp', { exact: false })

    expect(title).toBeDefined()
    expect(author).toBeDefined()

    // Hidden elements
    const url = screen.queryByText('test-blog.com')
    const likes = screen.queryByText('likes 2137')

    expect(url).toBeNull()
    expect(likes).toBeNull()
  })
})