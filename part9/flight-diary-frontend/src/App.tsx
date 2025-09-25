import { useEffect, useState } from 'react'
import type { NonSensitiveDiaryEntry, NewDiaryEntry, DiaryEntry, Visibility, Weather } from './types'
import { getDiaries, createDiaryEntry } from './diaryService'
import DiaryForm from './components/DiaryForm'


function App() {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([])
  const [newEntry, setNewEntry] = useState<NewDiaryEntry>({
    date: '',
    visibility: '',
    weather: '',
    comment: ''
  })
  const [error, setError] = useState<string>('')

  useEffect(() => {
    getDiaries()
      .then(data => setDiaries(data))
  }, [])

  const submitDiaryEntry = (event: React.SyntheticEvent) => {
    event.preventDefault()
    if (!newEntry.date || newEntry.visibility === '' || newEntry.weather === '') return

    const validatedEntry: Omit<NewDiaryEntry, 'visibility' | 'weather'> & { visibility: Visibility, weather: Weather } = {
      date: newEntry.date,
      visibility: newEntry.visibility as Visibility, 
      weather: newEntry.weather as Weather,          
      comment: newEntry.comment
    }

    createDiaryEntry(validatedEntry)
      .then((data: DiaryEntry) => {
        const nonSensitiveData: NonSensitiveDiaryEntry = {
          id: data.id,
          date: data.date,
          visibility: data.visibility,
          weather: data.weather
        };
        setDiaries(diaries.concat(nonSensitiveData))
        setNewEntry({
          date: '',
          visibility: '',
          weather: '',
          comment: ''
        })
        setError('')
      })
      .catch((error: Error) => {
        setError(error.message)
      })
  }

  const updateNewEntry = (field: keyof NewDiaryEntry, value: string) => {
    setNewEntry(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div>
      <h2>Add a new entry</h2>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          Error: {error}
        </div>
      )}

      <DiaryForm 
        onSubmit={submitDiaryEntry}
        newEntry={newEntry}
        setDate={(value) => updateNewEntry('date', value)}
        setVisibility={(value) => updateNewEntry('visibility', value)}
        setWeather={(value) => updateNewEntry('weather', value)}
        setComment={(value) => updateNewEntry('comment', value)}
      />

      <h2>Diary Entries</h2>
      {diaries.map(diary => 
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          <p>visibility: {diary.visibility}</p>
          <p>weather: {diary.weather}</p>
        </div>
      )}
    </div>
  )
}

export default App
