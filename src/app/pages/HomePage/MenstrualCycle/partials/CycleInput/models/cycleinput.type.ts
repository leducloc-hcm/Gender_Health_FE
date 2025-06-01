export interface CycleInputProps {
  onNext?: (cycleId: number) => void // Changed to pass cycleId
}

export interface FormData {
  startDate: string
  cycleLength: number
  periodLength: number
}

export interface CreateMenstrualCycleData {
  customer_profile_id: number
  startDate: string
  cycleLength: number
  periodLength: number
}

export interface MenstrualCycleResponse {
  success: boolean
  message: string
  data: {
    id: number
    customer_profile_id: string
    startDate: string
    cycleLength: number
    periodLength: number
    createdAt: string
    updatedAt: string
  }
}
