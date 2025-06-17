export interface StaffProfile {
  message: string
  result: Result
}

export interface Result {
  id: number
  email: string
  role: string
  status: string
  consultant_profile_id: number
  created_at: string
  updated_at: string
  name: string
  bio: any
  location: any
  username: string
  avatar: any
  coverPhoto: any
  date_of_birth: any
  website: any
  phone_number: string
  description: any
}
