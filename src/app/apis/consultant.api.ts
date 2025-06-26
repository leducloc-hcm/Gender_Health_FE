import type { ProfileConsultantRequest } from '@/app/pages/Admin/ConsultantManagement/models/consultant.type'
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
  createConsultantAccount: async (data: any): Promise<ProfileConsultantRequest> => {
    try {
      const response = await fetcher.post('/users/consultant/register', data)
      return response.data
    } catch (error) {
      console.error('Error creating consultant account:', error)
      throw error
    }
  },
  updateConsultantProfile: async (id: number, data: any): Promise<any> => {
    try {
      const response = await fetcher.put(`/users/consultant/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating consultant account:', error)
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
