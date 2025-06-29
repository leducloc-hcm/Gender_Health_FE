import type { AxiosError, AxiosResponse } from 'axios'
import type { TestCategoryResponse } from '../pages/HomePage/TestPackages/models/TestPackages'
import { fetcher } from './fetcher'
import type { PaymentListResponse } from '../pages/HomePage/TestPackages/models/PaymentTest'
import type { OrderListResponse } from '../pages/HomePage/TestPackages/models/OrderTest'
import type { CountUserResponse, RevenuePackageResponse } from '../models/AdminResponse'

export const adminApi = {
  // Revenue Package
  getRevenuePackage: async (): Promise<RevenuePackageResponse> => {
    try {
      const response: AxiosResponse<RevenuePackageResponse> = await fetcher.get(`/payment/total-test-package-payment`)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },

  // Count users
  getCountUser: async (): Promise<CountUserResponse> => {
    try {
      const response: AxiosResponse<CountUserResponse> = await fetcher.get(`/users/count/users-by-role`)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },

  // TestCategory ~ Test
  getAllTestCategory: async (): Promise<TestCategoryResponse> => {
    try {
      const response: AxiosResponse<TestCategoryResponse> = await fetcher.get(`/test`)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },

  // payment
  getAllPayments: async (): Promise<PaymentListResponse> => {
    try {
      const response: AxiosResponse<PaymentListResponse> = await fetcher.get(`/payment`)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },

  // order
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
