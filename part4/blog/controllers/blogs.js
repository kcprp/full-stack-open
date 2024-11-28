const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

// Public routes (no authentication needed)
blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user')
  response.json(blogs)
})

blogRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
  } catch(error) {
    next(error)
  }
})

// Protected routes (authentication required)
blogRouter.post('/', userExtractor, async (request, response, next) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch(error) {
    next(error)
  }
})

blogRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const userId = request.user.id
  const blogId = request.params.id

  try {
    const blog = await Blog.findById(blogId)
    
    // Check if blog exists
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    // Delete blog if request user id matches blog user id
    if (blog.user.toString() === userId.toString()) {
      await Blog.findByIdAndDelete(blogId)
      response.status(204).end()
    } else {
      response.status(403).json({ error: 'unauthorized to delete this blog' })
    }
  } catch(error) {
    next(error)
  }
})

module.exports = blogRouter