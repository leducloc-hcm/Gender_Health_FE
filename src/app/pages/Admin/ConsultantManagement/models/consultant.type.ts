export interface ProfileConsultantManagementResponse {
  message: string
  result: ProfileConsultantData[]
}

export interface RegisterConsultantReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth?: string
  bio?: string
  location?: string
  username?: string
  phone_number?: string
  description?: string
  website?: string
}

export interface UpdateConsultantProfileReqBody {
  name?: string
  email?: string
  date_of_birth?: string
  bio?: string
  location?: string
  username?: string
  avatar?: File
  coverPhoto?: File
  phone_number?: string
  description?: string
  website?: string
  experience?: string
  specialties?: string[]
  languages?: string[]
  response_time?: string
  degree?: string
  hospital?: string
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
