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
