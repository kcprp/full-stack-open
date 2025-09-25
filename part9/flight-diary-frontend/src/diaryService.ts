import axios from "axios";
import type { NonSensitiveDiaryEntry, NewDiaryEntry, DiaryEntry } from './types'

const baseUrl = 'http://localhost:3000/api/diaries'

export const getDiaries = () => {
  return axios
          .get<NonSensitiveDiaryEntry[]>(baseUrl)
          .then(response => response.data)
}

export const createDiaryEntry = (object: NewDiaryEntry): Promise<DiaryEntry> => {
  return axios
          .post<DiaryEntry>(baseUrl, object)
          .then(response => response.data)
}