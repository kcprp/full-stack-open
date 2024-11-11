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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}