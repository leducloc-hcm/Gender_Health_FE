import { fetcher } from '@/app/apis/fetcher'
import type { CustomerResponse } from '@/app/pages/Admin/CustomerManagement/models/customerManagement.type'

export const manageCustomerApi = {
  getAllProfileCustomer: async (): Promise<CustomerResponse> => {
    try {
      const response = await fetcher.get('/users/customer/order/all')
      return response.data
    } catch (error) {
      console.error('Error fetching profile consultants:', error)
      throw error
    }
  }
}
