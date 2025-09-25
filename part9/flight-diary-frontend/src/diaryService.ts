import axios, { AxiosError } from "axios";
import type { NonSensitiveDiaryEntry, NewDiaryEntry, DiaryEntry } from './types'

const baseUrl = 'http://localhost:3000/api/diaries'

export const getDiaries = async (): Promise<NonSensitiveDiaryEntry[]> => {
  const response = await axios.get<NonSensitiveDiaryEntry[]>(baseUrl);
  return response.data;
}

export const createDiaryEntry = async (object: NewDiaryEntry): Promise<DiaryEntry> => {
  try {
    const response = await axios.post<DiaryEntry>(baseUrl, object)
    return response.data
  } catch (e) {
    const error = e as AxiosError
    if (axios.isAxiosError(error)) {
      const errorMessage = typeof error.response?.data === 'string' 
        ? error.response.data 
        : 'An error occurred while creating the diary entry'
      throw new Error(errorMessage)
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}