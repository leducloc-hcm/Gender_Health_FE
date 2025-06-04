import { fetcher } from '@/app/apis/fetcher'
import type {
  ReplyRequest,
  ReplyRequestUpdate,
  ReplyResponse,
  ReplyResponseCreate
} from '@/app/pages/HomePage/Forum/models/reply.type'

export const replyApi = {
  getRepliesByQuestionId: async (questionId: number): Promise<ReplyResponse> => {
    try {
      const response = await fetcher.get(`/replies/question/${questionId}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch replies:', error)
      throw error
    }
  },
  createReply: async (data: ReplyRequest): Promise<ReplyResponseCreate> => {
    try {
      const response = await fetcher.post('/replies/create', data)
      return response.data
    } catch (error) {
      console.error('Failed to create reply:', error)
      throw error
    }
  },
  getReplyById: async (replyId: number): Promise<ReplyResponse> => {
    try {
      const response = await fetcher.get(`/replies/${replyId}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch reply by ID:', error)
      throw error
    }
  },
  updateReply: async (replyId: number, data: ReplyRequestUpdate): Promise<ReplyResponse> => {
    try {
      const response = await fetcher.put(`/replies/update/${replyId}`, data)
      return response.data
    } catch (error) {
      console.error('Failed to update reply:', error)
      throw error
    }
  },
  deleteReply: async (replyId: number): Promise<{ message: string }> => {
    try {
      const response = await fetcher.delete(`/replies/delete/${replyId}`)
      return response.data
    } catch (error) {
      console.error('Failed to delete reply:', error)
      throw error
    }
  }
}
