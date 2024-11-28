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

    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
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
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret'})
    
    const userToken = loginResponse.body.token

    const newBlog = {
      title: 'The Scaling Hypothesis',
      author: 'Gwern',
      url: 'https://gwern.net/scaling-hypothesis',
      likes: 2137,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${userToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const blogTitles = blogsAtEnd.map(blog => blog.title)
    assert(blogTitles.includes('The Scaling Hypothesis'))
  })

  test('if "likes" property missing, it will default to 0', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret'})
    
    const userToken = loginResponse.body.token

    const newBlog = {
      title: 'The Scaling Hypothesis',
      author: 'Gwern',
      url: 'https://gwern.net/scaling-hypothesis',
    }
    
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${userToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    const addedNewBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
    assert.strictEqual(addedNewBlog.likes, 0)
  })

  test('responds with 400 if title is missing', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret'})
    
    const userToken = loginResponse.body.token

    const missingTitle = {
      author: 'Gwern',
      url: 'https://gwern.net/scaling-hypothesis',
      likes: 2137,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${userToken}`)
      .send(missingTitle)
      .expect(400)
      
    const blogsAtEnd = await helper.blogsInDB()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('responds with 400 if url is missing', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret'})
    
    const userToken = loginResponse.body.token

    const missingUrl = {
      title: 'The Scaling Hypothesis',
      author: 'Gwern',
      likes: 2137,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${userToken}`)
      .send(missingUrl)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDB()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blogs can be deleted', async () => {
    // Login first
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret'})
    
    const userToken = loginResponse.body.token

    // Create a new blog first
    const newBlog = {
      title: 'The Scaling Hypothesis',
      author: 'Gwern',
      url: 'https://gwern.net/scaling-hypothesis',
      likes: 2137,
    }

    // Save the blog and get its ID
    const postResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${userToken}`)
      .send(newBlog)

    const blogToDelete = postResponse.body

    // Now try to delete it
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(204)

    // Verify it's deleted
    const blogsAtEnd = await helper.blogsInDB()
    assert(!blogsAtEnd.map(blog => blog.id).includes(blogToDelete.id))
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('responds 403 when incorrect user tries to delete a blog', async () => {
    // First user creates a blog
    const firstUserLogin = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret'})
    
    const firstUserToken = firstUserLogin.body.token

    // Create a blog as first user
    const newBlog = {
      title: 'The Scaling Hypothesis',
      author: 'Gwern', 
      url: 'https://gwern.net/scaling-hypothesis',
      likes: 2137,
    }

    const postResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${firstUserToken}`)
      .send(newBlog)

    const blogToDelete = postResponse.body

    // Create second user
    const passwordHash = await bcrypt.hash('password', 10)
    const secondUser = new User({ username: 'wronguser', passwordHash })
    await secondUser.save()

    // Login as second user
    const secondUserLogin = await api
      .post('/api/login')
      .send({ username: 'wronguser', password: 'password'})

    const secondUserToken = secondUserLogin.body.token

    // Try to delete first user's blog as second user
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${secondUserToken}`)
      .expect(403)

    // Verify blog still exists
    const blogsAtEnd = await helper.blogsInDB()
    assert(blogsAtEnd.map(blog => blog.id).includes(blogToDelete.id))
  })

  test('responds 400 when incorrect id delete requests', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret'})

    const userToken = loginResponse.body.token
    
    const wrongId = 0
    
    await api
      .delete(`/api/blogs/${wrongId}`)
      .set('Authorization', `Bearer ${userToken}`)
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
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret'})
    
    const userToken = loginResponse.body.token

    const newBlog = {
      title: 'The Scaling Hypothesis',
      author: 'Gwern',
      url: 'https://gwern.net/scaling-hypothesis',
    } 

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${userToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      
    const userAtEnd = await User.findOne({ username: 'root' })
    assert.strictEqual(userAtEnd.blogs.length, 1)
  })

})

after(async () => {
  mongoose.connection.close()
})