export interface CycleData {
  customer_profile_id?: number
  startDate: string
  cycleLength: number
  periodLength: number
}

export interface SymptomData {
  menstrual_cycle_id: number
  date: string
  symptomType: string
  description: string
}

export interface FertilityData {
  menstrual_cycle_id: number
  temperature: number
  weight: number
  description: string
  cervicalMucus: string
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

export interface MoodData {
  menstrual_cycle_id: number
  moodType: string
  description: string
}

export interface PredictionData {
  prediction: {
    id: number
    predictedStartDate: string
    predictedEndDate: string
    cycleLength: number
    createdAt: string
    customerProfileId: number
  }
  pregnancyAbility: {
    fertileWindowStart: string
    fertileWindowEnd: string
    pregnancyPercent: number
  }
}
