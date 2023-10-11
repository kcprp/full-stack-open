import {useState} from 'react'
import Country from './Country'


const Countries = ({ countries, filter }) => {
    const [selectedCountry, setSelectedCountry] = useState(null)

    if (countries === null || filter === '') return null;
  
    
    if (countries.length > 10) {
        return (
            <div>Too many matches, specify another filter</div>
        )
    } else if (countries.length > 1 && !selectedCountry) {
        return countries.map((country) => (
            <div key={country.cca3}>
                 {country.name.common}
                <button onClick={() => setSelectedCountry(country)}>
                    show
                </button>
            </div>
        ))
    } else if (selectedCountry) {
        return (
            <div>
                <button onClick={()=> setSelectedCountry(null)}>deselect</button>
                <Country country={selectedCountry} />
            </div>
        )
    } else if (countries.length === 1) {
        return (
            <Country country={countries[0]} />
        )
    } else {
        return (
            <div>No matches</div>
        )
    }
  };
  

export default Countries