export interface SymptomsProps {
  menstrualCycleId: number | null
  onNext?: () => void
  onSkipAll?: () => void
}

export interface SymptomData {
  menstrual_cycle_id: number
  date: string
  symptomType: string
  description: string
}

export interface CreateSymptomData {
  menstrual_cycle_id: number
  date: string
  symptomType: string
  description?: string
}

export interface DailySymptomResponse {
  message: string
  data: {
    id: number
    menstrualCycleId: number
  }
}
