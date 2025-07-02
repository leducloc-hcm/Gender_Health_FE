import type {
  CreateSpecialtyReqBody,
  getAllSpecialtiesResponse,
  getSpecialtiesIdResponse,
  UpdateSpecialtyReqBody
} from '../pages/Admin/SpecialtyManagement/Models/SpecialtyManagement'
import type {
  ConsultantFeedbackResponse,
  ConsultantManagementResponseData,
  linkInviteResponse
} from '../pages/Consultant/ConsultingManagement/models/ConsultingManagement'
import { fetcher } from './fetcher'

export const consultingManagementApi = {
  getConsultantManagement: async (consultantId: number): Promise<ConsultantManagementResponseData> => {
    try {
      const response = await fetcher(`consulting-history/consultant/${consultantId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching consultant management data:', error)
      throw error
    }
  },
  inviteLink: async (data: {
    historyId: number
    meetingLink: string
    meetingPlatform: string
  }): Promise<linkInviteResponse> => {
    try {
      const response = await fetcher.put('consulting-history/consultant/link-invite', data)
      return response.data
    } catch (error) {
      console.error('Error creating invite link:', error)
      throw error
    }
  },
  submitConsultantFeedback: async (data: {
    historyId: number
    consultantNote: string
  }): Promise<ConsultantFeedbackResponse> => {
    try {
      const response = await fetcher.put(`consulting-history/consultant/feedback`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error submitting consultant feedback:', error)
      throw error
    }
  },
  getAllSpecialties: async (): Promise<getAllSpecialtiesResponse> => {
    try {
      const response = await fetcher.get('specialties')
      return response.data
    } catch (error) {
      console.error('Error fetching all specialties:', error)
      throw error
    }
  },
  getAllSpecialtiesById: async (id: number): Promise<getSpecialtiesIdResponse> => {
    try {
      const response = await fetcher.get(`specialties/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching specialties by ID:', error)
      throw error
    }
  },
  createSpecialty: async (data: { name: string; description: string }): Promise<CreateSpecialtyReqBody> => {
    try {
      const response = await fetcher.post('specialties/create', data)
      return response.data
    } catch (error) {
      console.error('Error creating specialty:', error)
      throw error
    }
  },
  updateSpecialty: async (id: number, data: { name: string; description: string }): Promise<UpdateSpecialtyReqBody> => {
    try {
      const response = await fetcher.put(`specialties/update/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating specialty:', error)
      throw error
    }
  }
}
