import Country from './Country'

const Countries = ({ countries, filter }) => {
    if (countries === null || filter === '') return null;
  
    if (countries.length > 10) {
        return (
            <div>Too many matches, specify another filter</div>
        )
    } else if (countries.length > 1) {
        return countries.map((country) => (
            <div key={country.cca3}>{country.name.common}</div>
        ));
    } else if (countries.length === 1) {
        return (
            <Country country={countries[0]} />
        )
    }
  };
  

export default Countries