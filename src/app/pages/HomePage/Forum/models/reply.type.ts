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
  customerProfileId?: number | null
  staffProfileId?: number | null
  questionId: number
  parentReplyId?: number | null
  createdAt: string
  updatedAt: string
  customerProfile?: {
    id: number
    name: string
    username: string
    avatar?: string
  }
  staffProfile?: {
    id: number
    name: string
    avatar?: string
  } | null
  _count?: {
    votes: number
    childReplies: number
  }
}
