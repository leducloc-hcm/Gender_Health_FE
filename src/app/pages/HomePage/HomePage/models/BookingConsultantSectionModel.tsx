export interface Schedule {
  id: number
  consultantProfileId: number
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  status: 'AVAILABLE' | 'BOOKED'
  createdAt: string
  acceptedAt: string
  acceptedBy: number
  bookedBy: number | null
  bookedAt: string | null
}

export interface ConsultantProfile {
  id: number
  name: string
  bio: string | null
  location: string | null
  username: string
  avatar: string | null
  coverPhoto: string | null
  description: string | null
  phoneNumber: string
  dateOfBirth: string | null
  website: string | null
  userId: number
}

export interface Consultant {
  consultantProfile: ConsultantProfile
  schedulesByDate: Record<string, Schedule[]>
}

export interface ConsultantsData {
  message: string
  data: Consultant[]
}

export interface BookingResponse {
  message: string
  data: dataBookingResponse
}

export interface dataBookingResponse {
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
