const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user')
  response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
  const body = request.body

  const user = await User.findById(body.userId)

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

blogRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id

  try {
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
  } catch(error) {
    next(error)
  }
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

module.exports = blogRouter