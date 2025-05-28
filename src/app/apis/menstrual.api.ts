import { fetcher } from '@/app/apis/fetcher'
import { AxiosError, type AxiosResponse } from 'axios'

export interface CreateMenstrualRequest {
  customer_profile_id: number
  startDate: string
  cycleLength: number
  periodLength: number
}

export interface CreateMenstrualResponse {
  message: string
  data: {
    id: number
    startDate: string
    cycleLength: number
    periodLength: number
    createdAt: string
  }
}

export const menstrualApi = {
  // getAllMenstrual: async (): Promise<MenstrualPost[]> => {
  //   try {
  //     const response: AxiosResponse<{ data: MenstrualPost[] }> = await fetcher.get('/menstrual-cycle/all')
  //     return response.data.data
  //   } catch (error) {
  //     throw error as AxiosError
  //   }
  // },

  createMenstrual: async (data: CreateMenstrualRequest): Promise<CreateMenstrualResponse> => {
    try {
      const response: AxiosResponse<{ data: CreateMenstrualResponse }> = await fetcher.post(
        '/menstrual-cycle/create',
        data
      )
      return response.data.data
    } catch (error) {
      throw error as AxiosError
    }
  }

  // getLatestMenstrual: async (): Promise<MenstrualPost | null> => {
  //   try {
  //     const response: AxiosResponse<{ data: MenstrualPost | null }> = await fetcher.get('/menstrual-cycle/latest')
  //     return response.data.data
  //   } catch (error) {
  //     throw error as AxiosError
  //   }
  // },

  // updateMenstrual: async (id: number, data: UpdateMenstrualInput): Promise<MenstrualPost> => {
  //   try {
  //     const response: AxiosResponse<{ data: MenstrualPost }> = await fetcher.put(`/menstrual-cycle/update/${id}`, data)
  //     return response.data.data
  //   } catch (error) {
  //     throw error as AxiosError
  //   }
  // },

  // deleteMenstrual: async (id: number): Promise<void> => {
  //   try {
  //     await fetcher.delete(`/menstrual-cycle/delete/${id}`)
  //   } catch (error) {
  //     throw error as AxiosError
  //   }
  // },

  // calculateMenstrual: async (data: MenstrualCalculationInput): Promise<MenstrualCalculationResult> => {
  //   try {
  //     const response: AxiosResponse<{ data: MenstrualCalculationResult }> = await fetcher.post(
  //       '/menstrual-cycle/calculate',
  //       data
  //     )
  //     return response.data.data
  //   } catch (error) {
  //     throw error as AxiosError
  //   }
  // }
}
