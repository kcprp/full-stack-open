import { useEffect, useState } from 'react'
import Countries from './components/Countries'
import axios from 'axios'

function App() {
  const [countries, setCountries] = useState(null)
  const [filter, setFilter] = useState('')
  
  useEffect(() => {
    // load all countries names
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    const newFilter = event.target.value
    setFilter(newFilter)
  }

  const filteredCountries = (filter && countries) 
  ? countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase())) 
  : countries;

  return (
    <div>
      <form>
        <div>
          find countries <input value={filter} onChange={handleFilterChange} />
        </div>
      </form>

      <Countries countries={filteredCountries} filter={filter} />
    </div>
  )
}

export default App
