import { useEffect, useState } from "react"
import axios from "axios"

const Country = ({country}) => {
    const name = country.name.common
    const capital = country.capital
    const area = country.area
    const languages = country.languages
    const flag = country.flags.png
    const apiKey = import.meta.env.VITE_API_KEY
    const unit = 'metric'
    const [temperature, setTemperature] = useState('loading...')
    const [wind, setWind] = useState('loading...')
    const [iconAddress, setIconAddress] = useState(`https://openweathermap.org/img/wn/01d@2x.png`)
    const address = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=${unit}&appid=${apiKey}` 

    useEffect(() => {
        axios
          .get(address)
          .then((response) => {
            const cityWeather = response.data;
            setTemperature(cityWeather.main.temp);
            setWind(cityWeather.wind.speed);
            const icon = cityWeather.weather[0].icon
            setIconAddress(`https://openweathermap.org/img/wn/${icon}@2x.png`)
          })
          .catch((error) => {
            console.log("Error:", error);
            setTemperature("N/A");
            setWind("N/A");
          });
      }, []);

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

            <h2>Weather in {capital}</h2>
            <div>temperature {temperature}</div>
            <img src={iconAddress}/>
            <div>wind {wind} m/s</div>
        </div>
    )
}

export default Country