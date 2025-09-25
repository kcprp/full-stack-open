import type { NewDiaryEntry } from "../types"

type DiaryFormProps = {
  onSubmit: (event: React.SyntheticEvent) => void,
  setDate: (date: string) => void,
  setVisibility: (visibility: string) => void,
  setWeather: (weather: string) => void,
  setComment: (comment: string) => void,
  newEntry: NewDiaryEntry
}

const DiaryForm = ({ onSubmit, setDate, setVisibility, setWeather, setComment, newEntry }: DiaryFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          value={newEntry.date}
          onChange={e => setDate(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="visibility">Visibility</label>
        <div id="visibility" role="radiogroup" aria-labelledby="visibility-label">
          <span id="visibility-label" style={{ display: 'none' }}>Visibility</span>
          <label>
            <input
              type="radio"
              name="visibility"
              value="great"
              checked={newEntry.visibility === 'great'}
              onChange={e => setVisibility(e.target.value)}
            />
            Great
          </label>
          <label>
            <input
              type="radio"
              name="visibility"
              value="good"
              checked={newEntry.visibility === 'good'}
              onChange={e => setVisibility(e.target.value)}
            />
            Good
          </label>
          <label>
            <input
              type="radio"
              name="visibility"
              value="ok"
              checked={newEntry.visibility === 'ok'}
              onChange={e => setVisibility(e.target.value)}
            />
            Ok
          </label>
          <label>
            <input
              type="radio"
              name="visibility"
              value="poor"
              checked={newEntry.visibility === 'poor'}
              onChange={e => setVisibility(e.target.value)}
            />
            Poor
          </label>
        </div>
      </div>
      <div>
        <label htmlFor="weather">Weather</label>
        <div id="weather" role="radiogroup" aria-labelledby="weather-label">
          <span id="weather-label" style={{ display: 'none' }}>Weather</span>
          <label>
            <input
              type="radio"
              name="weather"
              value="sunny"
              checked={newEntry.weather === 'sunny'}
              onChange={e => setWeather(e.target.value)}
            />
            Sunny
          </label>
          <label>
            <input
              type="radio"
              name="weather"
              value="rainy"
              checked={newEntry.weather === 'rainy'}
              onChange={e => setWeather(e.target.value)}
            />
            Rainy
          </label>
          <label>
            <input
              type="radio"
              name="weather"
              value="cloudy"
              checked={newEntry.weather === 'cloudy'}
              onChange={e => setWeather(e.target.value)}
            />
            Cloudy
          </label>
          <label>
            <input
              type="radio"
              name="weather"
              value="stormy"
              checked={newEntry.weather === 'stormy'}
              onChange={e => setWeather(e.target.value)}
            />
            Stormy
          </label>
          <label>
            <input
              type="radio"
              name="weather"
              value="windy"
              checked={newEntry.weather === 'windy'}
              onChange={e => setWeather(e.target.value)}
            />
            Windy
          </label>
        </div>
      </div>
      <div>
        <label htmlFor="comment">Comment</label>
        <input
          id="comment"
          type="text"
          value={newEntry.comment}
          onChange={e => setComment(e.target.value)}
        />
      </div>
      <button type="submit">Add</button>
    </form>
  ) 
}

export default DiaryForm