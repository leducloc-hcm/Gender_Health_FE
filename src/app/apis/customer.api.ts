import type {
  allConsultantResponse,
  BookingResponse,
  ConsultantsData
} from '../pages/HomePage/HomePage/models/BookingConsultantSectionModel'
import { fetcher } from './fetcher'

export const customerApi = {
  getConsultantWorkSchedule: async (): Promise<ConsultantsData> => {
    try {
      const response = await fetcher.get('/consultant-work-schedule')
      return response.data
    } catch (error) {
      console.error('Failed to create symptom:', error)
      throw error
    }
  },
  getAllConsultant: async (): Promise<allConsultantResponse> => {
    try {
      const response = await fetcher.get('users/consultant/all')
      return response.data
    } catch (error) {
      console.error('Failed to create symptom:', error)
      throw error
    }
  },
  bookSchedule: async (scheduleId: number, customerProfileId: number): Promise<BookingResponse> => {
    try {
      const response = await fetcher.post('/consultant-work-schedule/book', {
        scheduleId,
        customerProfileId
      })
      return response.data
    } catch (error) {
      console.error('Failed to create symptom:', error)
      throw error
    }
  }
}
