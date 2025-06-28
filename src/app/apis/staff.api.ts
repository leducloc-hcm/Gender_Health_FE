import type {
  StaffManagementRequestCreate,
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
  createStaffAccount: async (data: StaffManagementRequestCreate): Promise<any> => {
    try {
      const response = await fetcher.post('/users/staff/register', data)
      return response.data
    } catch (error) {
      console.error('Error creating staff:', error)
      throw error
    }
  },
  updateStaffProfile: async (staffId: number, data: FormData): Promise<any> => {
    try {
      const response = await fetcher.put(`users/staff/${staffId}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Failed to update staff profile:', error)
      throw error
    }
  },
  deleteStaffAccount: async (id: number): Promise<any> => {
    try {
      const response = await fetcher.delete(`/users/staff/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting staff:', error)
      throw error
    }
  }
}
