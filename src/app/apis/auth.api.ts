import type { AxiosError, AxiosResponse } from 'axios'
import type { ForgotPasswordFormData, ForgotPasswordResponse } from '../pages/Auth/ForgetPassword/ForgetPassword'
import { fetcher } from '@/app/apis/fetcher'

export const authApi = {
  forgotPassword: async (data: ForgotPasswordFormData): Promise<ForgotPasswordResponse> => {
    try {
      const response: AxiosResponse<ForgotPasswordResponse> = await fetcher.post(`/users/forgot-password`, data)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  }
}
