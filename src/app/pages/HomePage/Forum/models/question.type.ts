export interface questionResquest {
  title: string
  content: string
  image?: File
}

export interface questionResponseCreate {
  message: string
  data: QuestionData
}

export interface questionResponse {
  message: string
  data: QuestionData[]
}

export interface QuestionData {
  id: number
  title: string
  content: string
  image: string
  customerProfileId: number
  createdAt: string
  updateAt: string
  customerProfile: CustomerProfileQuestion
  _count: Count
}

export interface CustomerProfileQuestion {
  id: number
  name: string
  username: string
  avatar: string
}
export interface Count {
  replies: number
  votes: number
}
