const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => sum + blog.likes

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  
  const formatBlog = (blog) => {
    return {
      title: blog.title,
      author: blog.author,
      likes: blog.likes
    }
  }

  return blogs.reduce((favorite, current) => 
    current.likes > favorite.likes ? formatBlog(current) : favorite
  , formatBlog(blogs[0]))
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const [author, blogs_count] = _(blogs)
    .countBy('author')
    .toPairs()
    .maxBy(1)  

  return {
    author,
    blogs: blogs_count
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likeCount = _(blogs)
    .groupBy('author')
    .map((items, author) => ({
      author,
      likes: _.sumBy(items, 'likes')
    }))
    .maxBy('likes')

  return likeCount
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}