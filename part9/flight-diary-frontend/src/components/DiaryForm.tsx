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
        <select
          id="visibility"
          value={newEntry.visibility}
          onChange={e => setVisibility(e.target.value)}
        >
          <option value="">Select visibility</option>
          <option value="great">Great</option>
          <option value="good">Good</option>
          <option value="ok">Ok</option>
          <option value="poor">Poor</option>
        </select>
      </div>
      <div>
        <label htmlFor="weather">Weather</label>
        <select
          id="weather"
          value={newEntry.weather}
          onChange={e => setWeather(e.target.value)}
        >
          <option value="">Select weather</option>
          <option value="sunny">Sunny</option>
          <option value="rainy">Rainy</option>
          <option value="cloudy">Cloudy</option>
          <option value="stormy">Stormy</option>
          <option value="windy">Windy</option>
        </select>
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