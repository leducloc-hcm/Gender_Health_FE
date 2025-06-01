import { fetcher } from '@/app/apis/fetcher'
import type {
  CreateMenstrualCycleData,
  MenstrualCycleResponse
} from '@/app/pages/HomePage/MenstrualCycle/partials/CycleInput/models/cycleinput.type'
import type { AxiosResponse } from 'axios'

export interface CreateSymptomData {
  menstrual_cycle_id: number
  date: string
  symptomType: string
  description?: string
}

export interface CreateFertilityData {
  menstrual_cycle_id: number
  temperature: number
  weight: number
  description?: string
  cervicalMucus?: string
}

export interface CreateMedicationData {
  menstrual_cycle_id: number
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate: string
  notes?: string
}

export interface CreateMoodData {
  menstrual_cycle_id: number
  moodType: string
  description: string
}

export interface DailySymptomResponse {
  message: string
  data: {
    id: number
    menstrualCycleId: number
  }
}

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
