import { fetcher } from '@/app/apis/fetcher'
import type { AxiosError, AxiosResponse } from 'axios'
import type { TestPackageResponse, TestTypeResponse } from '../pages/HomePage/TestPackages/models/TestPackages'

export const testApi = {
  getAllTestPackage: async (): Promise<TestPackageResponse> => {
    try {
      const response: AxiosResponse<TestPackageResponse> = await fetcher.get(`/test-package`)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },

  getAllTypeOfTest: async (): Promise<TestTypeResponse> => {
    try {
      const response: AxiosResponse<TestTypeResponse> = await fetcher.get(`/type-of-test`)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },
}
