import type {
  RegisterConsultantReqBody,
  UpdateConsultantProfileReqBody
} from '@/app/pages/Admin/ConsultantManagement/models/consultant.type'
import type { ProfileConsultantManagementResponse } from '../pages/Staff/ProfileConsultantManagement/models/ProfleConsultantManagement'
import { fetcher } from './fetcher'

export const consultantApi = {
  getAllProfileConsultants: async (): Promise<ProfileConsultantManagementResponse> => {
    try {
      const response = await fetcher.get('/users/consultant/all')
      return response.data
    } catch (error) {
      console.error('Error fetching profile consultants:', error)
      throw error
    }
  },
  getProfileConsultantById: async (id: number): Promise<any> => {
    try {
      const response = await fetcher.get(`/users/consultant/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching profile consultant by ID:', error)
      throw error
    }
  },
  createConsultantAccount: async (data: RegisterConsultantReqBody): Promise<any> => {
    try {
      const response = await fetcher.post('/users/consultant/register', data)
      return response.data
    } catch (error) {
      console.error('Error creating consultant account:', error)
      throw error
    }
  },
  updateConsultantProfile: async (
    consultantId: number,
    data: Partial<UpdateConsultantProfileReqBody>
  ): Promise<any> => {
    try {
      const response = await fetcher.put(`users/consultant/${consultantId}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Failed to update consultant profile:', error)
      throw error
    }
  },
  deleteConsultantAccount: async (id: number): Promise<any> => {
    try {
      const response = await fetcher.delete(`/users/consultant/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting consultant account:', error)
      throw error
    }
  }
}
