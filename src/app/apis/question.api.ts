import { fetcher } from '@/app/apis/fetcher'
import type {
  questionResponse,
  questionResponseCreate,
  questionResquest
} from '@/app/pages/HomePage/Forum/models/question.type'

export const questionApi = {
  getAllQuestions: async (): Promise<questionResponse> => {
    try {
      const response = await fetcher.get('/questions')
      return response.data
    } catch (error) {
      console.log('Failed to fetch questions:', error)
      throw error
    }
  },

  createQuestion: async (data: questionResquest): Promise<questionResponseCreate> => {
    try {
      const response = await fetcher.post('/questions/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.log('Failed to create question:', error)
      throw error
    }
  },

  getQuestionById: async (id: number): Promise<questionResponse> => {
    try {
      const response = await fetcher.get(`/questions/${id}`)
      return response.data
    } catch (error) {
      console.log('Failed to fetch question by ID:', error)
      throw error
    }
  }
}
