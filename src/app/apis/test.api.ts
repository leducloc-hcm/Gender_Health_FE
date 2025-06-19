import { fetcher } from '@/app/apis/fetcher'
import type { AxiosError, AxiosResponse } from 'axios'
import type {
  EditTestPackageItem,
  TestCategoryResponse,
  TestPackageItemResponse,
  TestPackageResponse,
  TestTypeResponse
} from '../pages/HomePage/TestPackages/models/TestPackages'

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

  getDetailTestPackage: async (id: number): Promise<TestPackageItemResponse> => {
    try {
      const response: AxiosResponse<TestPackageItemResponse> = await fetcher.get(`/test-package/${id}`)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },

  putUpdateTestPackage: async (id: number, payload: EditTestPackageItem): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await fetcher.put(`/test-package/update/${id}`, payload)

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

  getAllTestCategory: async (): Promise<TestCategoryResponse> => {
    try {
      const response: AxiosResponse<TestCategoryResponse> = await fetcher.get(`/test`)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  }
}
