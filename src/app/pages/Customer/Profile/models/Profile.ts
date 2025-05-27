export interface profileResponse {
  message: string
  result: getProfileResult
}
export interface UserProfile {
  name: string
  location: string
  username: string
  avatar: string
  cover_photo: string
  email?: string
}
export interface getProfileResult {
  id: number
  email: string
  role: string
  status: string
  created_at: string
  updated_at: string
  name: string
  bio?: any
  location?: any
  username: string
  avatar?: any
  cover_photo?: any
  date_of_birth: string
  website?: any
  phone_number?: any
  description?: any
}

export interface UserProfile {
  name: string
  location: string
  username: string
  avatar: string
  cover_photo: string
}
