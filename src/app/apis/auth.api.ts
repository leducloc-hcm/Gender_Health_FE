import type { AxiosError, AxiosResponse } from 'axios'
import { fetcher } from '@/app/apis/fetcher'
import type { LoginFormData, LoginResponse } from '@/app/pages/Auth/Login/models/login'
import type { ForgotPasswordFormData } from '../pages/Auth/ForgetPassword/models/ForgetPassword'
import type { ResetPasswordRequest, VerifyForgotPasswordRequest } from '../pages/Auth/ResetPassword/models/ResetPassword'
import type { AuthApiResponse } from '../models/ApiResponse'

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

  verifyForgotPassword: async (data: VerifyForgotPasswordRequest): Promise<AuthApiResponse> => {
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
  }
}
