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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}

