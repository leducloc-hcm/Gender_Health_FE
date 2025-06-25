export interface ProfileConsultantManagementResponse {
  message: string
  result: ProfileConsultantData[]
}

export interface ProfileConsultantRequest {
  email: string
  password: string
  name: string
  username: string
  phone_number: string
}

export interface ProfileConsultantData {
  id: number
  email: string
  role: string
  status: string
  consultant_profile_id: number
  created_at: string
  updated_at: string
  name: string
  bio?: string
  location: string
  username: string
  avatar: string
  coverPhoto: string
  date_of_birth: string
  website: string
  phone_number: string
  description: string
  rating: number
  total_reviews: number
  experience: string
  specialties: string[]
  languages: string[]
  response_time: string
  degree: string
  hospital: string
}
