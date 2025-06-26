import { fetcher } from '@/app/apis/fetcher'
import type {
  ResultOfTestReq,
  ResultOfTestResponse,
  StiTrackingByIdResponse
} from '@/app/pages/Staff/ResultOfTest/models/result.type'
import type { StiTrackingPostResponse, StiTrackingResponse } from '@/app/pages/Staff/StiTracking/models/sti.type'
import type { AxiosError, AxiosResponse } from 'axios'

export const stiApi = {
  getAllStis: async (): Promise<StiTrackingResponse> => {
    try {
      const response: AxiosResponse<StiTrackingResponse> = await fetcher.get('/stis-tracking')
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },
  getStiByCustomerProfileId: async (customerProfileId: number): Promise<StiTrackingResponse> => {
    try {
      const response: AxiosResponse<StiTrackingResponse> = await fetcher.get(
        `/stis-tracking/customer/${customerProfileId}`
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },
  getStiById: async (id: number): Promise<StiTrackingByIdResponse> => {
    try {
      const response: AxiosResponse<StiTrackingByIdResponse> = await fetcher.get(`/stis-tracking/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },
  createPscVisited: async (id: number, data: any): Promise<StiTrackingPostResponse> => {
    try {
      const response: AxiosResponse<StiTrackingPostResponse> = await fetcher.post(
        `/stis-tracking/${id}/psc-visited`,
        data
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },
  createSampleCollected: async (id: number, data: any): Promise<StiTrackingPostResponse> => {
    try {
      const response: AxiosResponse<StiTrackingPostResponse> = await fetcher.post(
        `/stis-tracking/${id}/sample-collected`,
        data
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },
  createReportDate: async (id: number, data: any): Promise<StiTrackingPostResponse> => {
    try {
      const response: AxiosResponse<StiTrackingPostResponse> = await fetcher.post(
        `/stis-tracking/${id}/report-date`,
        data
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },
  createTestResult: async (data: ResultOfTestReq): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await fetcher.post(`/result-of-test`, data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },
  updateTestResult: async (id: number, data: ResultOfTestReq): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await fetcher.put(`/result-of-test/${id}`, data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },
  getTestResultByStiTrackingId: async (id: number): Promise<ResultOfTestResponse> => {
    try {
      const response: AxiosResponse<any> = await fetcher.get(`/result-of-test/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  },
  deleteTestResult: async (id: number): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await fetcher.delete(`/result-of-test/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      throw axiosError
    }
  }
}
