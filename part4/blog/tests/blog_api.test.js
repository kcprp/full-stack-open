const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

describe('when there are blogs in db', () => {

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
    const users = await helper.usersInDb()
    const userId = users[0].id

    const newBlog = {
      title: 'The Scaling Hypothesis',
      author: 'Gwern',
      url: 'https://gwern.net/scaling-hypothesis',
      likes: 2137,
      userId: userId
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
    const users = await helper.usersInDb()
    const userId = users[0].id

    const newBlog = {
      title: 'The Scaling Hypothesis',
      author: 'Gwern',
      url: 'https://gwern.net/scaling-hypothesis',
      userId: userId
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
    const users = await helper.usersInDb()
    const userId = users[0].id

    const missingTitle = {
      author: 'Gwern',
      url: 'https://gwern.net/scaling-hypothesis',
      likes: 2137,
      userId: userId
    }

    await api
      .post('/api/blogs')
      .send(missingTitle)
      .expect(400)
      
    const blogsAtEnd = await helper.blogsInDB()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('responds with 400 if url is missing', async () => {
    const users = await helper.usersInDb()
    const userId = users[0].id

    const missingUrl = {
      title: 'The Scaling Hypothesis',
      author: 'Gwern',
      likes: 2137,
      userId: userId  
    }

    await api
      .post('/api/blogs')
      .send(missingUrl)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDB()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blogs can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const deleteBlog = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${deleteBlog.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDB()
    const blogTitles = blogsAtEnd.map(blog => blog.title)
    assert(!blogTitles.includes(deleteBlog.title))

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })

  test('responds 400 when incorrect id delete requests', async () => {
    const wrongId = 0
    
    await api
      .delete(`/api/blogs/${wrongId}`)
      .expect(400)
  })

  test('blogs can be updated', async () => {
    const blogsatStart = await helper.blogsInDB()
    const startBlog = blogsatStart[0]

    const updatedBlog = {
      title: startBlog.title,
      author: startBlog.author,
      url: startBlog.url,
      likes: startBlog.likes + 1
    }

    await api
      .put(`/api/blogs/${startBlog.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB() 
    const updatedLikes = blogsAtEnd.find(blog => blog.title === startBlog.title).likes
    assert.strictEqual(updatedLikes, startBlog.likes + 1)
  })

  test('responds 400 when updating wrong id', async () => {
    const users = await helper.usersInDb()
    const userId = users[0].id

    const wrongId = 0

    const startBlog = helper.initialBlogs[0]

    const updatedBlog = {
      title: startBlog.title,
      author: startBlog.author,
      url: startBlog.url,
      likes: startBlog.likes + 1,
      userId: userId
    }

    await api
      .put(`/api/blogs/${wrongId}`)
      .send(updatedBlog)
      .expect(400)
    
    const blogsAtEnd = await helper.blogsInDB()
    const updatedLikes = blogsAtEnd.find(blog => blog.title === startBlog.title).likes
    assert.strictEqual(updatedLikes, startBlog.likes)
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('returns 400 with a non-unique username', async () => {
    const usersAtStart = await helper.usersInDb()

    const repeatedUser = {
      username: 'root',
      password: 'lol'
    }

    await api
      .post('/api/users')
      .send(repeatedUser)
      .expect(400)


    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)

  })

  test('returns 400 with username/password length less than 3', async () => {
    const usersAtStart = await helper.usersInDb()

    const shortUsername = {
      username: 'JP',
      password: '2137'
    }

    await api
      .post('/api/users')
      .send(shortUsername)
      .expect(400)

    const shortPassword = {
      username: 'JP2',
      password: '21'
    }

    await api
      .post('/api/users')
      .send(shortPassword)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('blogs gets assigned to a user', async () => {
    const users = await helper.usersInDb()
    const user = users[0]
    const userId = user.id

    const newBlog = {
      title: 'The Scaling Hypothesis',
      author: 'Gwern',
      url: 'https://gwern.net/scaling-hypothesis',
      userId: userId
    } 

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd[0].blogs.length, 1)
  })

})

after(async () => {
  mongoose.connection.close()
})