import type { AxiosError, AxiosResponse } from 'axios'
import { fetcher } from '@/app/apis/fetcher'
import type { LoginFormData, LoginResponse } from '@/app/pages/Auth/Login/models/login'
import type { ForgotPasswordFormData, ForgotPasswordResponse } from '../pages/Auth/ForgetPassword/models/ForgetPassword'
import type { VerifyForgotPasswordRequest, VerifyForgotPasswordResponse } from '../pages/Auth/ResetPassword/models/ResetPassword'

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

  verifyForgotPassword: async (data: VerifyForgotPasswordRequest): Promise<VerifyForgotPasswordResponse> => {
    try {
      const response: AxiosResponse<VerifyForgotPasswordResponse> = await fetcher.post(`/users/verify-forgot-password`, data)

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
