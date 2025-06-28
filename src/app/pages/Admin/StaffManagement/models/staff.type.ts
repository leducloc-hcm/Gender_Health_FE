export interface StaffManagementResponse {
  message: string
  result: StaffManagementData[]
}

export interface StaffManagementRequestCreate {
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

export interface StaffManagementRequestUpdate {
  name?: string
  bio?: string
  location?: string
  username?: string
  avatar?: File
  coverPhoto?: File
  phone_number?: string
  description?: string
  date_of_birth?: string
  website?: string
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
