import type { AxiosResponse } from 'axios'
import type { PasswordForm, profileResponse, UpdateProfileInput } from '../pages/Customer/Profile/models/Profile'
import { api } from './fetcherToken'

export const profileApi = {
  getProfile: async (): Promise<profileResponse> => {
    try {
      const response: AxiosResponse<profileResponse> = await api.get('/users/me')
      return response.data
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      throw error
    }
  },
  updateProfile: async (data: Partial<UpdateProfileInput>): Promise<profileResponse> => {
    try {
      const response: AxiosResponse<profileResponse> = await api.put('/users/update/me', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error
    }
  },
  updatePassword: async (data: PasswordForm): Promise<profileResponse> => {
    try {
      const response: AxiosResponse<profileResponse> = await api.put('/users/change-password', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return response.data
    } catch (error) {
      console.error('Failed to update password:', error)
      throw error
    }
  }
}
