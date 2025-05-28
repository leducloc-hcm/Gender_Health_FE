import type { AxiosError, AxiosResponse } from 'axios'
import type { ForgotPasswordFormData, ForgotPasswordResponse } from '../pages/Auth/ForgetPassword/ForgetPassword'
import { fetcher } from '@/app/apis/fetcher'
import type { LoginFormData, LoginResponse } from '@/app/pages/Auth/Login/models/login'

export interface UserProfile {
  id: number
  email: string
  role: string
  status: string
  customer_profile_id: number
  created_at: string
  updated_at: string
  name: string
  bio: string | null
  location: string | null
  username: string
  avatar: string | null
  cover_photo: string | null
  date_of_birth: string
  website: string | null
  phone_number: string | null
  description: string | null
}

export const authApi = {
  forgotPassword: async (data: ForgotPasswordFormData): Promise<ForgotPasswordResponse> => {
    try {
      const response: AxiosResponse<ForgotPasswordResponse> = await fetcher.post(`/users/forgot-password`, data)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },

  login: async (data: LoginFormData): Promise<LoginResponse> => {
    try {
      const response: AxiosResponse<LoginResponse> = await fetcher.post(`/users/login`, data)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },

  getMe: async (token: string): Promise<UserProfile> => {
    try {
      const response: AxiosResponse<{ message: string; result: UserProfile }> = await fetcher.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.error(response.data.result)
      return response.data.result
    } catch (error) {
      throw error as AxiosError
    }
  }
}
