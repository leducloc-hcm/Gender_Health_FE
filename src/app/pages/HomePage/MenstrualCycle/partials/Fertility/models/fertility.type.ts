export interface FertilityProps {
  menstrualCycleId: number | null
  onNext?: () => void
  onSkipAll?: () => void
}

export interface FertilityData {
  menstrual_cycle_id: number
  temperature: number
  weight: number
  description: string
  cervicalMucus: string
}

export interface CreateFertilityData {
  menstrual_cycle_id: number
  temperature: number
  weight: number
  description?: string
  cervicalMucus?: string
}
