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
  customer_profile_id: number
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
export interface historyConsulting {
  message: string
  data: historyConsultingData[]
}
export interface historyConsultingData {
  id: number
  consultantProfileId: number
  customerProfileId: number
  scheduleAt: string
  startedAt: string
  endedAt: string
  status: string
  rating: string
  feedback: string
  consultantNote: string
  customerNote: string
  meetingLink: string
  meetingPlatform: string
  createdAt: string
  updatedAt: string
  consultantProfile: ConsultantProfile
  customerProfile: CustomerProfile
}

export interface ConsultantProfile {
  id: number
  name: string
  bio: string
  location: string
  username: string
  avatar: string
  coverPhoto: string
  description: string
  phoneNumber: string
  dateOfBirth: string
  website: string
  rating: number
  totalReviews: string
  experience: string
  specialties: string[]
  languages: string[]
  responseTime: string
  degree: string
  hospital: string
  userId: number
}
export interface CustomerProfile {
  id: number
  name: string
  bio: string
  location: string
  username: string
  avatar: string
  coverPhoto: string
  description: string
  phoneNumber: string
  dateOfBirth: string
  website: string
  userId: number
}
