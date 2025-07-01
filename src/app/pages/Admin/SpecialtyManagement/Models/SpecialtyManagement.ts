export interface CreateSpecialtyReqBody {
  name: string
  description?: string
}

export interface UpdateSpecialtyReqBody {
  name?: string
  description?: string
}
export interface RegisterConsultantReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth?: string
  bio?: string
  location?: string
  username?: string
  avatar?: string
  coverPhoto?: string
  phone_number?: string
  description?: string
  website?: string
  experience?: string
  specialties?: number[]
  languages?: string[]
  response_time?: string
  degree?: string
  hospital?: string
}

export interface getAllSpecialtiesResponse {
  message: string
  data: SpecialtyDataResponse[]
}

export interface getSpecialtiesIdResponse {
  message: string
  data: SpecialtyDataResponse
}
export interface SpecialtyDataResponse {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
  consultantSpecialties: consultantSpecialties[]
}

export interface consultantSpecialties {
  consultantProfileId: number
  specialtyId: number
  consultantProfile: ConsultantProfile
}

export interface ConsultantProfile {
  id: number
  name: string
  username: string
}
