const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const helper = require('./test_helper')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany()

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))

  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)
  
  expect(titles).toContain(
    'Go To Statement Considered Harmful'
  )
})

test('a valid blog can be added', async () => {
  const newBlog =   {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
  
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain(
    'Type wars'
  )
})

test('unique identifier property of the blog is named id', async () => {
  const blogs = await helper.blogsInDb()
  const blogToTest = blogs[0]
  
  expect(blogToTest.id).toBeDefined()
})

test('missing likes property defaults to 0', async () => {
  const newBlog =   {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    __v: 0
  }
  
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  
  const addedBlog = blogsAtEnd
    .filter(blog => blog.title === 'Type wars')

  expect(addedBlog.likes === 0)
 })

 test('missing title property returns code 400', async () => {
  const newBlog =   {
    _id: "5a422bc61b54a676234d17fc",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    __v: 0
  }

  await api 
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
 })

 test('missing url property returns code 400', async () => {
  const newBlog =   {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    __v: 0
  }

  await api 
  .post('/api/blogs')
  .send(newBlog)
  .expect(400)
 })

 test('deletion of a blog results in status code 204', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const titles = await blogsAtEnd.map(b => b.title)

  expect(titles).not.toContain(blogToDelete.title)
 })

 test('updating of a blog works correctly', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const newBlog =   {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  }
  
  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newBlog)

  const blogsAtEnd = await helper.blogsInDb()

  const titles = blogsAtEnd.map(b => b.title)

  expect(titles).not.toContain(blogToUpdate.title)
  expect(titles).toContain(newBlog.title)
 })

afterAll(async () => {
  await mongoose.connection.close()
})