export interface UserResponse {
  message: string
  result: UserResponseData[]
}

export interface UserResponseData {
  id: number
  email: string
  role: string
  status: string
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface Profile {
  id: number
  name: string
  bio?: string
  location?: string
  username: string
  avatar?: string
  coverPhoto?: string
  description?: string
  phoneNumber?: string
  dateOfBirth?: string
  website?: string
  rating: any
  totalReviews?: number
  experience?: string
  languages?: string[]
  responseTime?: string
  degree?: string
  hospital?: string
  userId: number
}
