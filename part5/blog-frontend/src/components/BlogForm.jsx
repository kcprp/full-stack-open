import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            id='title-input'
            data-testId='title'
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            id='author-input'
            data-testId='author'
          />
        </div>
        <div>
          url
          <input
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            id='url-input'
            data-testId='url'
          />
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default BlogForm