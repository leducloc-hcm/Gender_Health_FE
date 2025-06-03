import type { AxiosError, AxiosResponse } from "axios"
import { fetcher } from "./fetcher"
import type { PaymentRequest, PaymentResponse } from "../pages/HomePage/TestPackages/models/PaymentTest"


export const paymentApi = {
  createPayment: async (data: PaymentRequest): Promise<PaymentResponse> => {
    try {
      const response: AxiosResponse<PaymentResponse> = await fetcher.post(`/payment/vnpay/create`, data)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  }
}
