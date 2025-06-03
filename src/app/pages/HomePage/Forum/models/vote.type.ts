export interface VoteRequest {
  vote_type: string
  question_id: number
  reply_id?: number
}

export interface VoteResponse {
  message: string
  data: VoteData[]
}

export interface VoteResponseCreate {
  message: string
  data: VoteData
}

export interface VoteData {
  id: number
  voteType: string
  userId: number
  questionId: number
  replyId: number | null
  createdAt: string
  user: UserVote
}

interface UserVote {
  id: number
  email: string
}
