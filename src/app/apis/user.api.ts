import { fetcher } from '@/app/apis/fetcher'
import type { UserResponse } from '@/app/pages/Admin/CustomerManagement/models/customerManagement.type'

export const userApi = {
  getAllUser: async (): Promise<UserResponse> => {
    try {
      const response = await fetcher.get('/users/all')
      return response.data
    } catch (error) {
      console.error('Failed to create symptom:', error)
      throw error
    }
  },
  banAccount: async (id: number): Promise<void> => {
    try {
      await fetcher.delete(`/users/banAccount/${id}`)
    } catch (error) {
      console.error('Failed to ban account:', error)
      throw error
    }
  },
  unBanAccount: async (id: number): Promise<void> => {
    try {
      await fetcher.put(`/users/unBanAccount/${id}`)
    } catch (error) {
      console.error('Failed to unban account:', error)
      throw error
    }
  }
}
