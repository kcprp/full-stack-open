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

test.only('correct number of blogs returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test.only('verify the unique identifier property is named "id"', async () => {
  const response = await api.get('/api/blogs')
  // Check that id exists and _id does not exist for each blog
  response.body.forEach(blog => {
    assert.strictEqual(typeof blog.id, 'string')
    assert.strictEqual(blog._id, undefined)
  })
})

test.only('a blog can be added', async () => {
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

after(async () => {
  mongoose.connection.close()
})