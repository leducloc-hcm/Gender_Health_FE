import type { CustomerProfileQuestion } from '@/app/pages/HomePage/Forum/models/question.type'

export interface ReplyRequest {
  content: string
  parentReplyId?: number | null
  questionId: number
}

export interface ReplyResponse {
  message: string
  data: ReplyData[]
}

export interface ReplyResponseCreate {
  message: string
  data: ReplyData
}

export interface ReplyData {
  id: number
  content: string
  authorType: string
  image: string
  customerProfileId: number
  staffProfileId: number | null
  parentReplyId: number | null
  questionId: number
  createdAt: string
  updatedAt: string
  customerProfile: CustomerProfileQuestion
  staffProfile: StaffProfileReply | null
  count: CountReply
}

export interface StaffProfileReply {
  id: number
  name: string
  username: string
  avatar: string
}

export interface CountReply {
  votes: number
  childReplies: number
}
