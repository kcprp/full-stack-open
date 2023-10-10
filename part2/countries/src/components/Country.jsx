const Country = ({country}) => {
    const name = country.name.common
    const capital = country.capital
    const area = country.area
    const languages = country.languages
    const flag = country.flags.png

    return (
        <div>
            <h1>{name}</h1>

            <div>capital {capital}</div>
            <div>area {area}</div>
            
            <p><b>languages:</b></p>
            <ul>
                {Object.entries(languages).map(([code, langName]) => (
                    <li key={code}>{langName}</li>
                ))}
            </ul> 
            <img src={flag} alt={`${name} flag`} />
        </div>
    )
}

export default Country