export interface ConsultantManagementResponseData {
  message: string
  data: ConsultantManagementResponse[]
}

export interface ConsultantManagementResponse {
  id: number
  consultantProfileId: number
  customerProfileId: number
  scheduleAt: string
  startedAt?: string
  endedAt?: string
  status: string
  rating: string
  feedback: string
  consultantNote: string
  customerNote: string
  meetingLink: string
  meetingPlatform: string
  createdAt: string
  updatedAt: string
  consultantProfile: ConsultantProfile
  customerProfile: CustomerProfile
}

export interface ConsultantProfile {
  id: number
  name: string
  bio: string
  location: string
  username: string
  avatar: string
  coverPhoto: string
  description: string
  phoneNumber: string
  dateOfBirth: string
  website: string
  rating: number
  totalReviews: string
  experience: string
  specialties: string[]
  languages: string[]
  responseTime: string
  degree: string
  hospital: string
  userId: number
}

export interface CustomerProfile {
  id: number
  name: string
  bio: string
  location?: string
  username: string
  avatar?: string
  coverPhoto?: string
  description: string
  phoneNumber: string
  dateOfBirth: string
  website: string
  userId: number
}

export interface linkInviteResponse {
  message: string
  data: linkInviteData
}

export interface linkInviteData {
  id: number
  consultantProfileId: number
  customerProfileId: number
  scheduleAt: string
  startedAt: string
  endedAt: string
  status: string
  rating: string
  feedback: string
  consultantNote: string
  customerNote: string
  meetingLink: string
  meetingPlatform: string
  createdAt: string
  updatedAt: string
}
