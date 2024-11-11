const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

const multipleBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('return likes when list has multiple blogs', () => {
    const result = listHelper.totalLikes(multipleBlogs)

    assert.strictEqual(result, 36)
  })

  test('returns 0 when list is empty', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })
})

describe('favorite blog', () => {
  test('return null if blogs are empty', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null)
  })

  test('return most liked blog with multiple blogs', () => {
    const result = listHelper.favoriteBlog(multipleBlogs)

    assert.deepStrictEqual(
      result,
      {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        likes: 12
      }
    )
  })

  test('returns most liked with single blog', () => {
    assert.deepStrictEqual(
      listHelper.favoriteBlog(listWithOneBlog),
      {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        likes: 5
      }
    )
  })
})

describe('most blogs', () => {
  test('returns null with no blogs', () => {
    assert.deepStrictEqual(listHelper.mostBlogs([]), null)
  })

  test('returns most popular author with multiple blogs', () => {
    const result = listHelper.mostBlogs(multipleBlogs)

    assert.deepStrictEqual(
      result,
      {
        author: "Robert C. Martin",
        blogs: 3
      }
    )
  })

  test('returns most popular with one blog', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)

    assert.deepStrictEqual(
      result,
      {
        author: 'Edsger W. Dijkstra',
        blogs: 1
      } 
    )
  })
})