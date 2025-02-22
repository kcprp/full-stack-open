import { useSelector ,useDispatch } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    if ( filter === '' ) {
      return anecdotes
    }
    return anecdotes.filter(anecdote => 
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
  })
  const dispatch = useDispatch()

  const onClickFunction = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5000))
  }

  return (
    <>
      {anecdotes.map(anecdote => 
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => onClickFunction(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </>
  )
}

export default AnecdoteList