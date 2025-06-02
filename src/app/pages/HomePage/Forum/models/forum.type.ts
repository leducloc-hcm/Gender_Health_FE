export interface questionResponse {
  message: string
  result: getQuestionResult[]
}

export interface getQuestionResult {
  id: number
  content: string
  author: string
  created_at: string
  updated_at: string
}
