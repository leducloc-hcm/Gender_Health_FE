export interface MoodProps {
  menstrualCycleId: number | null
  onNext?: () => void
  onSkipAll?: () => void
}

export interface MoodData {
  menstrual_cycle_id: number
  moodType: string
  description: string
}

export interface CreateMoodData {
  menstrual_cycle_id: number
  moodType: string
  description: string
}
