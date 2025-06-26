import type {
  StaffManagementRequest,
  StaffManagementResponse
} from '@/app/pages/Admin/StaffManagement/models/staff.type'
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
  },
  getAllStaff: async (): Promise<StaffManagementResponse> => {
    try {
      const response = await fetcher.get('/users/staff/all')
      return response.data
    } catch (error) {
      console.error('Error fetching staff:', error)
      throw error
    }
  },
  createStaff: async (data: StaffManagementRequest): Promise<any> => {
    try {
      const response = await fetcher.post('/users/staff/register', data)
      return response.data
    } catch (error) {
      console.error('Error creating staff:', error)
      throw error
    }
  },
  updateStaff: async (id: number, data: any): Promise<any> => {
    try {
      const response = await fetcher.put(`/users/staff/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating staff:', error)
      throw error
    }
  },
  deleteStaff: async (id: number): Promise<any> => {
    try {
      const response = await fetcher.delete(`/users/staff/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting staff:', error)
      throw error
    }
  }
}
