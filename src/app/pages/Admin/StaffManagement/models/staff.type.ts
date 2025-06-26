export interface StaffManagementResponse {
  message: string
  result: StaffManagementData[]
}

export interface StaffManagementRequest {
  email: string
  password: string
  name: string
  username: string
  phone_number: string
}

export interface StaffManagementData {
  id: number
  email: string
  role: string
  status: string
  staff_profile_id: number
  created_at: string
  updated_at: string
  name: string
  bio: any
  location: any
  username: string
  avatar: any
  coverPhoto: any
  date_of_birth: string
  website: any
  phone_number: any
  description: any
}
