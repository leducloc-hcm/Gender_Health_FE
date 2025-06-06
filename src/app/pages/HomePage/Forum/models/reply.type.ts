import type { CustomerProfileQuestion } from '@/app/pages/HomePage/Forum/models/question.type'

export interface ReplyRequest {
  content: string
  parent_reply_id?: number | null
  question_id: number
  author_type: string
}

export interface ReplyRequestUpdate {
  content: string
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
  customerProfileId: number | null
  staffProfileId: number | null
  parentReplyId: number | null
  questionId: number
  createdAt: string
  updatedAt: string
  customerProfile: CustomerProfileQuestion
  staffProfile: StaffProfileReply | null
  _count: CountReply
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
