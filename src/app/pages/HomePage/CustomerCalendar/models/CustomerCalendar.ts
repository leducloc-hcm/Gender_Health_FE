export interface ConsultantSelfCalendar {
  message: string
  data: CalendarEventResponse[]
}

export interface CalendarEventResponse {
  id: number
  title: string
  description: string
  location: string
  date: string
  startTime: string
  endTime: string
  status: string
  createdAt: string
  updatedAt: string
  customerProfileId: number
  customerProfile: CustomerProfile
}

export interface CustomerProfile {
  id: number
  name: string
  bio: string | null
  location: string | null
  username: string
  avatar: string
  coverPhoto: string
  description: string | null
  phoneNumber: string | null
  dateOfBirth: string | null
  website: string | null
  userId: number
}
