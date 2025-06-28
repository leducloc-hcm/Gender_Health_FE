import { fetcher } from '@/app/apis/fetcher'

export const manageCustomerApi = {
  getAllProfileConsultants: async (): Promise<any> => {
    try {
      const response = await fetcher.get('/users/customer/order/all')
      return response.data
    } catch (error) {
      console.error('Error fetching profile consultants:', error)
      throw error
    }
  }
}
