import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

export const sortAnecdotes = (anecdotes) => (
  anecdotes.sort((a, b) => b.votes - a.votes)
)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    vote(state, action) {
      const changedAnecdote = action.payload
      const id = action.payload.id
      return state.map(a => a.id !== id ? a : changedAnecdote)
        .sort((a, b) => b.votes - a.votes)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { vote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    const sortedAnecdotes = sortAnecdotes(anecdotes)
    dispatch(setAnecdotes(sortedAnecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = anecdote => {
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.addVote(anecdote.id)
    dispatch(vote(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer