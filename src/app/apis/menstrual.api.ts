import { fetcher } from '@/app/apis/fetcher'
import type {
  CreateMenstrualCycleData,
  MenstrualCycleResponse
} from '@/app/pages/HomePage/MenstrualCycle/partials/CycleInput/models/cycleinput.type'
import type { CreateFertilityData } from '@/app/pages/HomePage/MenstrualCycle/partials/Fertility/models/fertility.type'
import type { CreateMedicationData } from '@/app/pages/HomePage/MenstrualCycle/partials/Medication/models/medication.type'
import type { CreateMoodData } from '@/app/pages/HomePage/MenstrualCycle/partials/Mood/models/mood.type'
import type {
  CreateSymptomData,
  DailySymptomResponse
} from '@/app/pages/HomePage/MenstrualCycle/partials/Symtomps/models/symtomps.type'
import type { AxiosResponse } from 'axios'

export const menstrualApi = {
  createMenstrualCycle: async (data: CreateMenstrualCycleData): Promise<MenstrualCycleResponse> => {
    try {
      const response: AxiosResponse<MenstrualCycleResponse> = await fetcher.post('/menstrual-cycles/create', data)
      return response.data
    } catch (error) {
      console.error('Failed to create menstrual cycle:', error)
      throw error
    }
  },

  createSymptom: async (data: CreateSymptomData): Promise<DailySymptomResponse> => {
    try {
      const response: AxiosResponse<DailySymptomResponse> = await fetcher.post('/daily-symptoms/create', data)
      return response.data
    } catch (error) {
      console.error('Failed to create symptom:', error)
      throw error
    }
  },

  createFertility: async (data: CreateFertilityData): Promise<DailySymptomResponse> => {
    try {
      const response: AxiosResponse<DailySymptomResponse> = await fetcher.post('/fertility-tracking/create', data)
      return response.data
    } catch (error) {
      console.error('Failed to create fertility data:', error)
      throw error
    }
  },

  createMedication: async (data: CreateMedicationData): Promise<DailySymptomResponse> => {
    try {
      const response: AxiosResponse<DailySymptomResponse> = await fetcher.post('/medication-tracking/create', data)
      return response.data
    } catch (error) {
      console.error('Failed to create medication:', error)
      throw error
    }
  },

  createMood: async (data: CreateMoodData): Promise<DailySymptomResponse> => {
    try {
      const response: AxiosResponse<DailySymptomResponse> = await fetcher.post('/mood-tracking/create', data)
      return response.data
    } catch (error) {
      console.error('Failed to create mood data:', error)
      throw error
    }
  }
}
