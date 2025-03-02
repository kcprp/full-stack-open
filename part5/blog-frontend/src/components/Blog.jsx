import { useState } from 'react'

const Blog = ({ blog, handleLike, removeBlog, username }) => {
  const [hidden, setHidden] = useState(true)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div className='blog' style={blogStyle}>
      <div>
        {blog.title} by {blog.author}
        <button onClick={() => setHidden(!hidden)} style={{ marginLeft: '5px' }}>{hidden ? 'view' : 'hide'}</button>
      </div>
      {!hidden &&
      <div>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={() => handleLike(blog)} style={{ marginLeft: '5px' }}>like</button>
        </div>
        {blog.user && blog.user.username === username &&
        <button onClick={() => removeBlog(blog)}>remove</button>
        }
      </div>
      }
    </div>
  )}

export default Blog