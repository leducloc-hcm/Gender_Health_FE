import { fetcher } from '@/app/apis/fetcher'
import type { VoteRequest, VoteResponse, VoteResponseCreate } from '@/app/pages/HomePage/Forum/models/vote.type'

export const voteApi = {
  createVote: async (data: VoteRequest): Promise<VoteResponseCreate> => {
    try {
      const response = await fetcher.post('/votes/create', data)
      return response.data
    } catch (error) {
      console.error('Failed to create reply:', error)
      throw error
    }
  },
  getVoteByQuestionId: async (questionId: number): Promise<VoteResponse> => {
    try {
      const response = await fetcher.get(`/votes/question/${questionId}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch reply by ID:', error)
      throw error
    }
  },
  getVoteByReplyId: async (replyId: number): Promise<VoteResponse> => {
    try {
      const response = await fetcher.get(`/votes/reply/${replyId}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch reply by ID:', error)
      throw error
    }
  },

  deleteVote: async (id: number): Promise<{ message: string }> => {
    try {
      const response = await fetcher.delete(`/votes/delete/${id}`)
      return response.data
    } catch (error) {
      console.error('Failed to delete reply:', error)
      throw error
    }
  }
}
