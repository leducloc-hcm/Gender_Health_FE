import type { AxiosError, AxiosResponse } from 'axios'
import { fetcher } from './fetcher'
import type {
  PaymentListResponse,
  PaymentRequest,
  PaymentResponse
} from '../pages/HomePage/TestPackages/models/PaymentTest'

export const paymentApi = {
  createPayment: async (data: PaymentRequest): Promise<PaymentResponse> => {
    try {
      const response: AxiosResponse<PaymentResponse> = await fetcher.post(`/payment/vnpay/create`, data)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },

  getAllPayments: async (): Promise<PaymentListResponse> => {
    try {
      const response: AxiosResponse<PaymentListResponse> = await fetcher.get(`/payment`)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  }
}
