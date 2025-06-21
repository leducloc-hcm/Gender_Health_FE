import { fetcher } from '@/app/apis/fetcher'
import type { AxiosError, AxiosResponse } from 'axios'
import type {
  AddUpdateTestCategory,
  AddUpdateTestTypeItem,
  EditTestPackageItem,
  TestCategoryResponse,
  TestPackageItemResponse,
  TestPackageResponse,
  TestTypeResponse
} from '../pages/HomePage/TestPackages/models/TestPackages'

export const testApi = {
  // TestPackage
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

  // TypeOfTest
  getAllTypeOfTest: async (): Promise<TestTypeResponse> => {
    try {
      const response: AxiosResponse<TestTypeResponse> = await fetcher.get(`/type-of-test`)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },

  postCreateTypeOfTest: async (payload: AddUpdateTestTypeItem): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await fetcher.post(`/type-of-test/create`, payload)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },

  putUpdateTypeOfTest: async (id: number, payload: AddUpdateTestTypeItem): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await fetcher.put(`/type-of-test/update/${id}`, payload)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },

  deleteTypeOfTest: async (id: number): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await fetcher.delete(`/type-of-test/delete/${id}`)

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

  postCreateTestCategory: async (payload: AddUpdateTestCategory): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await fetcher.post(`/test/create`, payload)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },

  putUpdateTestCategory: async (id: number, payload: AddUpdateTestCategory): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await fetcher.put(`/test/update/${id}`, payload)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },

  deleteTestCategory: async (id: number): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await fetcher.delete(`/test/delete/${id}`)

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  }
}
