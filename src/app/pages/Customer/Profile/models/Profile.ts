export interface profileResponse {
  message: string
  result: getProfileResult
}
export interface UserProfile {
  name: string
  location: string
  username: string
  avatar: string
  cover_photo?: string
  email?: string
  bio?: string
  website?: string
  coverPhoto?: string
}

export interface getProfileResult {
  id: number
  email: string
  role: string
  status: string
  created_at: string
  updated_at: string
  name: string
  bio?: string
  location?: string
  username: string
  avatar?: string
  coverPhoto?: string
  date_of_birth: string
  website?: string
  phone_number?: string
  description?: string
  customer_profile_id?: number
  consultant_profile_id?: number
}
export interface UpdateProfileInput {
  name?: string
  location?: string
  username?: string
  avatar?: File
  coverPhoto?: File
}

export interface PasswordForm {
  old_password: string
  password: string
  confirm_password: string
}

export interface UpdateProfileConsultantInput {
  id?: number
  name?: string
  bio?: string
  location?: string
  username?: string
  avatar?: File
  coverPhoto?: File
  date_of_birth?: string
  website?: string
  phone_number?: string
  description?: string
  experience?: string
  specialties?: string[]
  languages?: string[]
  response_time?: string
  degree?: string
  hospital?: string
}
export interface getConsultantProfileResult {
  message: string
  result: {
    id: number
    email: string
    role: string
    status: string
    consultant_profile_id?: number
    created_at: string
    updated_at: string
    name: string
    bio: string
    location: string
    username: string
    avatar: string
    coverPhoto: string
    date_of_birth: string
    website: string
    phone_number: string
    description: string
    rating: string
    total_reviews: string
    experience: string
    specialties: string[]
    languages: string[]
    response_time: string
    degree: string
    hospital: string
  }
}
export interface UpdateProfileConsultantResponse {
  message: string
  result: getConsultantProfileResult
}
