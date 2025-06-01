import type { AxiosError, AxiosResponse } from 'axios'
import { fetcher } from '@/app/apis/fetcher'
import type { LoginFormData, LoginResponse } from '@/app/pages/Auth/Login/models/login'
import type { ForgotPasswordFormData } from '../pages/Auth/ForgetPassword/models/ForgetPassword'
import type { ResetPasswordRequest } from '../pages/Auth/ResetPassword/models/ResetPassword'
import type { AuthApiResponse } from '../models/ApiResponse'
import type { VerifyPasscodeRequest } from '../pages/Auth/VerifyPasscode/models/VerifyPasscode'

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
  forgotPassword: async (data: ForgotPasswordFormData): Promise<AuthApiResponse> => {
    try {
      const response: AxiosResponse<AuthApiResponse> = await fetcher.post(`/users/forgot-password`, data)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },

  verifyPasscode: async (data: VerifyPasscodeRequest): Promise<AuthApiResponse> => {
    try {
      const response: AxiosResponse<AuthApiResponse> = await fetcher.post(`/users/verify-forgot-password`, data)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<AuthApiResponse> => {
    try {
      const response: AxiosResponse<AuthApiResponse> = await fetcher.post(`/users/reset-password`, data)

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

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    try {
      const response: AxiosResponse<LoginResponse> = await fetcher.post('/users/refresh-token', {
        refresh_token: refreshToken
      })

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
