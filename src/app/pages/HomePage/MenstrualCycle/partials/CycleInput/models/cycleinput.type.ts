export interface CycleInputProps {
  onNext?: (cycleId: number) => void // Changed to pass cycleId
}

export interface FormData {
  startDate: string
  cycleLength: number
  periodLength: number
}
