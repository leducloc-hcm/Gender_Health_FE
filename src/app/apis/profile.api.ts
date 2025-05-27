import type { AxiosResponse } from 'axios'
import type { profileResponse, UpdateProfileInput, UserProfile } from '../pages/Customer/Profile/models/Profile'
import { fetcher } from './fetcher'

export const profileApi = {
  getProfile: async (): Promise<profileResponse> => {
    try {
      const accessToken = localStorage.getItem('access_token')
      if (!accessToken) throw new Error('Access token not found')

      const response: AxiosResponse<profileResponse> = await fetcher.get('/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      throw error
    }
  },
  updateProfile: async (data: Partial<UpdateProfileInput>): Promise<profileResponse> => {
    try {
      const accessToken = localStorage.getItem('access_token')
      if (!accessToken) throw new Error('Access token not found')

      const response: AxiosResponse<profileResponse> = await fetcher.put('/users/update/me', data, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error
    }
  }
}
