import type { AxiosError, AxiosResponse } from 'axios'
import { fetcher } from './fetcher'
import type {
  OrderFormRequest,
  OrderFormResponse,
  OrderListResponse
} from '../pages/HomePage/TestPackages/models/OrderTest'

export const orderApi = {
  createOrder: async (data: OrderFormRequest): Promise<OrderFormResponse> => {
    try {
      const response: AxiosResponse<OrderFormResponse> = await fetcher.post(`/order/create`, data)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },

  getDetailOrder: async (id: number): Promise<OrderFormResponse> => {
    try {
      const response: AxiosResponse<OrderFormResponse> = await fetcher.post(`/order/${id}`)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },

  getAllOrders: async (): Promise<OrderListResponse> => {
    try {
      const response: AxiosResponse<OrderListResponse> = await fetcher.get(`/order`)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  }
}
