export interface ConsultantFormData {
  consultantProfileId: number
  title: string
  description: string
  date: Date | string
  startTime: string
  endTime: string
  consultant_profile_id?: number
}

export interface CalendarEvent {
  title: string
  start: string
  end: string
  extendedProps?: {
    description: string
  }
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
