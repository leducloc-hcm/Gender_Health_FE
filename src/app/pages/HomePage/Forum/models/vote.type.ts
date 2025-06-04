export interface VoteRequest {
  question_id?: number
  reply_id?: number
  vote_type: 'UP'
}

export interface VoteData {
  id: number
  voteType: string
  userId: number
  questionId?: number
  replyId?: number
  createdAt: string
  user?: {
    id: number
    email: string
  }
}

export interface VoteResponse {
  data: VoteData[]
  message: string
  status: number
}

export interface VoteResponseCreate {
  data: VoteData
  message: string
  status: number
}
