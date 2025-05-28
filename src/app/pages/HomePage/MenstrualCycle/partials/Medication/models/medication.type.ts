export interface MedicationProps {
  menstrualCycleId: number | null
  onNext?: () => void
  onSkipAll?: () => void
}

export interface MedicationData {
  menstrual_cycle_id: number
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate: string
  notes: string
}
