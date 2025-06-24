import type {
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
  }
}
