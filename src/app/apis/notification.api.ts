import type { NotificationResponse } from '../layouts/ConsultantLayout/models/Notification'
import { fetcher } from './fetcher'

export const notificationApi = {
  markAsRead: async (notificationId: number): Promise<NotificationResponse> => {
    try {
      const response = await fetcher.put(`/notifications/mark-as-read/${notificationId}`)
      return response.data
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      throw error
    }
  },
  markAsReadAll: async (): Promise<NotificationResponse> => {
    try {
      const response = await fetcher.put('/notifications/mark-all-as-read')
      return response.data
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
      throw error
    }
  }
}
