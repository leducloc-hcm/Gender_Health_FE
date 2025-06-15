import type { ProfileConsultantManagementResponse } from '../pages/Staff/ProfileConsultantManagement/models/ProfleConsultantManagement'
import { fetcher } from './fetcher'

export const staffApi = {
  getAllProfileConsultants: async (): Promise<ProfileConsultantManagementResponse> => {
    try {
      const response = await fetcher.get('/users/consultant/all')
      return response.data
    } catch (error) {
      console.error('Error fetching profile consultants:', error)
      throw error
    }
  }
}
