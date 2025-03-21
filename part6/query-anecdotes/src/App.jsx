import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, upvoteAnecdote } from './requests'
import { useReducer } from 'react'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.payload
    case "CLEAR":
      return ''
    default:
      return state
  } 
}

const App = () => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')
  
  const showNotification = (message, seconds = 5) => {
    notificationDispatch({ type: 'SET', payload: message })
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR' })
    }, seconds * 1000)
  }

  const queryClient = useQueryClient()

  const voteMutation = useMutation({ 
    mutationFn: upvoteAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  const handleVote = (anecdote) => {
    voteMutation.mutate({...anecdote, votes: anecdote.votes + 1 })
    showNotification(`anecdote ${anecdote.content} voted`)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes 
  })
  console.log(JSON.parse(JSON.stringify(result)))

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  if ( result.isError ) {
    return (
      <div>anecdote service not available due to problems in server</div>
    )
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification notification={notification}/> 
      <AnecdoteForm showNotification={showNotification} />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
