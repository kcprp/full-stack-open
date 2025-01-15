import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [color, setColor] = useState('green')

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs( sortedBlogs )
    }
    )}, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage(exception.response.data.error)
      setColor('red')
      setTimeout(() => {setMessage(null)}, 3000)
      console.error('Wrong credentials')
    }
  }

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const loginForm = () => (
    <Togglable buttonLabel="log in">
      <LoginForm
        handleSubmit={handleLogin}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        username={username}
        password={password}
      />
    </Togglable>
  )

  const addBlog = async (blogObject) => {
    try {
      const blog = await blogService.create(blogObject)
      setBlogs(blogs.concat(blog))
      const message = `a new blog ${blog.title} by ${blog.author} added`
      setMessage(message)
      setColor('green')
      setTimeout(() => {setMessage(null)}, 3000)
    } catch(exception) {
      setMessage(exception.response.data.error)
      setColor('red')
      setTimeout(() => {setMessage(null), 3000})
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel="new blog">
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const handleLike = async (blogObject) => {
    const updatedBlog = {
      user: blogObject.user.id,
      likes: blogObject.likes + 1,
      author: blogObject.author,
      title: blogObject.title,
      url: blogObject.url
    }
    const blog = await blogService
      .update(blogObject.id, updatedBlog)

    const updatedBlogs = blogs.map(b =>
      b.id === blogObject.id
        ? { ...b, likes: blog.likes }
        : b
    )
    setBlogs(updatedBlogs)
  }

  const removeBlog = async (blog) => {
    try {
      const confirmMessage = `Remove blog ${blog.title} by ${blog.author}`
      if (window.confirm(confirmMessage)) {
        await blogService.remove(blog.id)
        const updatedBlogs = blogs.filter(b => b.id !== blog.id)
        setBlogs(updatedBlogs)
      }
    } catch(exception) {
      setMessage(exception.response.data.error)
      setColor('red')
      setTimeout(() => setMessage(null), 3000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} color={color} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} color={color} />
      {user.name} logged in
      <button onClick={handleLogout} style={{ marginLeft: '10px' }}>logout</button>
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id}
          blog={blog}
          handleLike={handleLike}
          removeBlog={removeBlog}
          username={user.username}
        />
      )}
    </div>
  )
}

export default App