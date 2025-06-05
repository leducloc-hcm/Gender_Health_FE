export interface scheduleResponse {
  message: string
  data: scheduleData[]
}

export interface scheduleData {
  id: number
  consultantProfileId: number
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  status: string
  createdAt: string
  acceptedAt?: string
  acceptedBy?: number
  bookedBy: any
  bookedAt: any
}
