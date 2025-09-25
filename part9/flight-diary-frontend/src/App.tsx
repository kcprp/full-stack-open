import { useEffect, useState } from 'react'
import type { NonSensitiveDiaryEntry } from './types'
import { getDiaries } from './diaryService'


function App() {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([])

  useEffect(() => {
    getDiaries()
      .then(data => setDiaries(data))
  }, [])

  return (
    <div>
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
