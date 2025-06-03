import { fetcher } from '@/app/apis/fetcher'
import type { questionResponse, questionResponseCreate } from '@/app/pages/HomePage/Forum/models/question.type'

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

  createQuestion: async (data: FormData): Promise<questionResponseCreate> => {
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

  updateQuestion: async (id: number, data: FormData): Promise<questionResponseCreate> => {
    try {
      const response = await fetcher.put(`/questions/update/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.log('Failed to update question:', error)
      throw error
    }
  },
  deleteQuestion: async (id: number): Promise<{ message: string }> => {
    try {
      const response = await fetcher.delete(`/questions/delete/${id}`)
      return response.data
    } catch (error) {
      console.log('Failed to delete question:', error)
      throw error
    }
  }
}
