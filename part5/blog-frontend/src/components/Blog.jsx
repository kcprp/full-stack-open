import { useState } from "react"

const Blog = ({ blog, handleLike }) => {
  const [hidden, setHidden] = useState(true)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
  <div style={blogStyle}>
    <div>
      {blog.title}
      <button onClick={() => setHidden(!hidden)} style={{ marginLeft: '5px' }}>{hidden ? 'view' : 'hide'}</button>
    </div>
    {!hidden && 
    <div>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes}
        <button onClick={() => handleLike(blog)} style={{ marginLeft: '5px' }}>like</button>
        </div>
      <div>{blog.author}</div>
    </div>    
    }
  </div>
)}

export default Blog