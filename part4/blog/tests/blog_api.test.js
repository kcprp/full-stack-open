const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const Blog = require('../models/blog')

const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct number of blogs returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('verify the unique identifier property is named "id"', async () => {
  const response = await api.get('/api/blogs')
  // Check that id exists and _id does not exist for each blog
  response.body.forEach(blog => {
    assert.strictEqual(typeof blog.id, 'string')
    assert.strictEqual(blog._id, undefined)
  })
})

test('a blog can be added', async () => {
  const newBlog = {
    title: 'The Scaling Hypothesis',
    author: 'Gwern',
    url: 'https://gwern.net/scaling-hypothesis',
    likes: 2137
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDB()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const blogTitles = blogsAtEnd.map(blog => blog.title)
  assert(blogTitles.includes('The Scaling Hypothesis'))
})

test('if "likes" property missing, it will default to 0', async () => {
  const newBlog = {
    title: 'The Scaling Hypothesis',
    author: 'Gwern',
    url: 'https://gwern.net/scaling-hypothesis',
  }
  
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDB()
  const addedNewBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
  assert.strictEqual(addedNewBlog.likes, 0)
})

test('responds with 400 if title is missing', async () => {
  const missingTitle = {
    author: 'Gwern',
    url: 'https://gwern.net/scaling-hypothesis',
    likes: 2137 
  }

  await api
    .post('/api/blogs')
    .send(missingTitle)
    .expect(400)
    
  const blogsAtEnd = await helper.blogsInDB()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('responds with 400 if url is missing', async () => {
  const missingUrl = {
    title: 'The Scaling Hypothesis',
    author: 'Gwern',
    likes: 2137 
  }

  await api
    .post('/api/blogs')
    .send(missingUrl)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDB()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test.only('blogs can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDB()
  const deleteBlog = blogsAtStart[0]
  console.log(deleteBlog)
  await api
    .delete(`/api/blogs/${deleteBlog.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDB()
  const blogTitles = blogsAtEnd.map(blog => blog.title)
  assert(!blogTitles.includes(deleteBlog.title))

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})

test.only('responds 400 when incorrect id delete requests', async () => {
  const wrongId = 0
  
  await api
    .delete(`/api/blogs/${wrongId}`)
    .expect(400)
})

after(async () => {
  mongoose.connection.close()
})