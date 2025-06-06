import type { AxiosError } from 'axios'
import type { ConsultantFormData } from '../pages/Consultant/models/Consultant'
import { fetcher } from './fetcher'

export const scheduleApi = {
  creteConsultantSchedule: async (data: ConsultantFormData): Promise<ConsultantFormData> => {
    try {
      const response = await fetcher.post(`/consultant-work-schedule/create`, data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  }
}
