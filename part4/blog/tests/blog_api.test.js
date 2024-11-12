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

after(async () => {
  mongoose.connection.close()
})