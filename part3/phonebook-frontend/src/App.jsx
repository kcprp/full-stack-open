import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState(null)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageColor, setMessageColor] = useState('green')

  // Get persons data
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  // do not render anything if notes is still null
  if (!persons) {
    return null
  }

  const addName = (event) => {
    event.preventDefault()
    const trimmedName = newName.trim()
    const nameExists = persons.some(person => person.name.toLowerCase() === trimmedName.toLowerCase())
    const numberExists = persons.some(person => person.number === newNumber)
  
    if (!trimmedName || !newNumber) return
  
    if (nameExists && !numberExists) {
      updateNumber()
      resetInputs()
      return
    } else if (nameExists && numberExists) {
      resetInputs()
      alert('Name and number already added to phonebook')
      return
    }
  
    const nameObject = {
      name: trimmedName,
      number: newNumber,
      id: persons.length + 1 
    }

    personService
      .create(nameObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        resetInputs()
        setMessage(
          `Added ${trimmedName}`
        )
          setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        const errorMessage = error.response.data.error
        displayErrorMessage(errorMessage)
      })
  }

  const deleteName = id => {
    const toDelete = persons.find(person => person.id === id) 
    if (toDelete && window.confirm(`Delete ${toDelete.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const updateNumber = () => {
    const confirmMessage = `${newName} is already added to phonebook, replace the old number with a new one?`
    if (window.confirm(confirmMessage)) {
      const currentId = persons.find(person => person.name.toLowerCase() === newName.toLowerCase().trim()).id
      const nameObject = {
        name: newName,
        number: newNumber,
        id: currentId
      }
      personService
        .update(currentId, nameObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== currentId ? person : returnedPerson))
        })
        .catch(error => {
          const errorMessage = `Information of ${newName.trim()} was already removed from the server`
          displayErrorMessage(errorMessage)
        })
    }
  }

  const displayErrorMessage = (message) => {
    setMessage(message)
    setMessageColor('red')
    setTimeout(() => {
      setMessage(null)
      setMessageColor('green')
    }, 5000)
  }

  const resetInputs = () => {
    setNewName('')
    setNewNumber('')
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const filterPersons = (filter) => {
    const lowerCaseFilter = filter.toLowerCase()
    return persons.filter(person => person.name.toLowerCase().startsWith(lowerCaseFilter))
  }

  const personsToShow = newFilter === ''
    ? persons
    : filterPersons(newFilter)

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} color={messageColor}/>

      <Filter filter={newFilter} handleFilter={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm 
        onSubmit={addName}
        name={newName}
        number={newNumber}
        nameSetter={setNewName}
        numberSetter={setNewNumber}
      />

      <h3>Numbers</h3>

      <Persons persons={personsToShow} deleteName={deleteName}/>
    </div>
  )
}

export default App