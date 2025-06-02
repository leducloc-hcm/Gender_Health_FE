import { fetcher } from '@/app/apis/fetcher'
import type { questionResponse } from '@/app/pages/HomePage/Forum/models/forum.type'

export const questionApi = {
  getAllQuestions: async (): Promise<questionResponse> => {
    try {
      const response = await fetcher.get('/questions')
      return response.data
    } catch (error) {
      console.log('Failed to fetch questions:', error)
      throw error
    }
  }
}
