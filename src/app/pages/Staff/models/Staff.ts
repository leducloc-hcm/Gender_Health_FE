export interface StaffProfile {
  message: string
  result: Result
}

export interface Result {
  id: number
  email: string
  role: string
  status: string
  staff_profile_id: number
  created_at: string
  updated_at: string
  name: string
  bio: string | null
  location: string | null
  username: string
  avatar: string | null
  coverPhoto: string | null
  date_of_birth: string
  website: string | null
  phone_number: string | null
  description: string | null
}
