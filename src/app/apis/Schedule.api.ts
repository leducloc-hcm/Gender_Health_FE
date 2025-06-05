import type { AxiosError } from 'axios'
import type { ConsultantApproveResponse, ConsultantFormData } from '../pages/Consultant/models/Consultant'
import { fetcher } from './fetcher'
import type { ResponseCalendar } from '../pages/Consultant/CalendarBooking/CalendarBooking'
import type { scheduleResponse } from '../pages/Staff/Schedule/models/Schedule'

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
  },
  getAllConsultantApproveSchedule: async (): Promise<scheduleResponse> => {
    try {
      const response = await fetcher.get(`/consultant-work-schedule/requests/all`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },

  approveConsultantSchedule: async (data: {
    scheduleId: number
    staffProfileId: number
    status: string
  }): Promise<ConsultantApproveResponse> => {
    try {
      const response = await fetcher.post(`consultant-work-schedule/approve`, data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  }
}
