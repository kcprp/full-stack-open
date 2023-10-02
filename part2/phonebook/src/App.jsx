import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    console.log('effect');
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        const persons = response.data
        setPersons(persons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()

    const nameExists = persons.some(person => person.name.toLowerCase() === newName.toLowerCase())
    const numberExists = persons.some(person => person.number === newNumber)

    if (newName === '' || newNumber === '') return
    if (nameExists || numberExists) {
      resetInputs()
      const alertMessage = nameExists
      ? `${newName} is already added to phonebook`
      : `${newNumber} is already added to phonebook`
      alert(alertMessage)
      return
    }
    
    const nameObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }
    setPersons(persons.concat(nameObject))
    resetInputs()
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

      <Persons persons={personsToShow}/>
    </div>
  )
}

export default App