import { fetcher } from '@/app/apis/fetcher'
import type { UserResponse } from '@/app/pages/Admin/CustomerManagement/models/customerManagement.type'

export const manageCustomerApi = {
  getAllProfileCustomer: async (): Promise<UserResponse> => {
    try {
      const response = await fetcher.get('/users/customer/order/all')
      return response.data
    } catch (error) {
      console.error('Error fetching profile consultants:', error)
      throw error
    }
  }
}
