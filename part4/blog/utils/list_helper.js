const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((prev, current) => {
    return (prev.likes > current.likes) 
      ? prev 
      : current
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorBlogCounts = _.map(_.groupBy(blogs, 'author'), (posts, author) => {
    return {
      author: author,
      blogs: posts.length
    }
  })

  return _.maxBy(authorBlogCounts, 'blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authorLikeCounts = _.map(_.groupBy(blogs, 'author'), (posts, author) => {
    return {
      author: author,
      likes: _.sumBy(posts, 'likes')
    }
  })

  return _.maxBy(authorLikeCounts, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

