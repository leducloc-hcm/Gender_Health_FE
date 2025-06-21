import { fetcher } from '@/app/apis/fetcher'
import type { AxiosError, AxiosResponse } from 'axios'

export const stiApi = {
  getStiByCustomerProfileId: async (customerProfileId: number): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await fetcher.get(`/stis-tracking/${customerProfileId}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },
  getStiById: async (id: number): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await fetcher.get(`/stis-tracking/detail/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },
  createPscVisited: async (id: number, data: any): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await fetcher.post(`/stis-tracking/${id}/psc-visited`, data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },
  createSampleCollected: async (id: number, data: any): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await fetcher.post(`/stis-tracking/${id}/sample-collected`, data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },
  createReportDate: async (id: number, data: any): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await fetcher.post(`/stis-tracking/${id}/report-date`, data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  }
}
