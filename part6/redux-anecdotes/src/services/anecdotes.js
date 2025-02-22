import axios from 'axios'
const baseUrl = `http://localhost:3001/anecdotes`

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const newAnecdote = {
    content: content, 
    votes: 0
  }
  const response = await axios.post(baseUrl, newAnecdote)
  return response.data
}

const addVote = async (id) => {
  const { data: anecdote } = await axios.get(`${baseUrl}/${id}`)
  const updatedAnecdote = {
    ...anecdote,
    votes: anecdote.votes + 1
  }
  const { data } = await axios.put(`${baseUrl}/${id}`, updatedAnecdote)
  return data
}

export default { getAll, createNew, addVote }