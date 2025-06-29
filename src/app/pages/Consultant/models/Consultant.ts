export interface ConsultantFormData {
  consultantProfileId: number
  title: string
  description: string
  date: Date | string
  startTime: string
  endTime: string
  consultant_profile_id?: number
}
export interface ConsultantApproveResponse {
  message: string
  data: Data
}
export interface Data {
  id: number
  consultantProfileId: number
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  status: string
  createdAt: string
  acceptedAt: string
  acceptedBy: number
  bookedBy: number
}

export interface profileConsultantResponse {
  message: string
  result: consultantProfile
}

export interface consultantProfile {
  id: number
  email: string
  role: string
  status: string
  consultant_profile_id: number
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
}
