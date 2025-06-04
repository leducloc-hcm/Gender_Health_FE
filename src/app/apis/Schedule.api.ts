import type { AxiosError } from 'axios'
import type { ConsultantFormData } from '../pages/Consultant/models/Consultant'
import { fetcher } from './fetcher'
import type { ResponseCalendar } from '../pages/Consultant/CalendarBooking/CalendarBooking'
import { sConsultantProfile } from '@/app/hooks/sConsultantProfile'
import { s } from 'node_modules/framer-motion/dist/types.d-CtuPurYT'

export const scheduleApi = {
  creteConsultantSchedule: async (data: ConsultantFormData): Promise<ConsultantFormData> => {
    try {
      const response = await fetcher.post(`/consultant-work-schedule/create`, data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },
  getConsultantSchedule: async (consultantId: Number): Promise<ResponseCalendar> => {
    try {
      const response = await fetcher.get(`consultant-work-schedule/consultant/${consultantId}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  }
}
