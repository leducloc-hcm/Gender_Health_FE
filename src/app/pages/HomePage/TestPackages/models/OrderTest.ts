// Order form request
export interface OrderFormData {
  address: string
  phone: string
  note: string
  test_date: Date | undefined
}

export interface OrderFormRequest {
  address: string
  phone: string
  note: string
  customer_profile_id: number | string
  test_package_id: number
  test_date: string | undefined
}

// Order form response
interface CustomerProfile {
  name: string
}

interface OrderItem {
  id: number
  code: string
  name: string
  description: string
  type: string
  testDate: string
  original_price: string
  discount_rate: string
  final_price: string
  order_id: number
}

interface OrderData {
  id: number
  address: string
  phone: string
  note: string
  created_at: string
  status: string
  total_amount: string
  customer_profile_id: number
  orderItems: OrderItem[]
  payments: any[]
  customerProfile: CustomerProfile
}

export interface OrderFormResponse {
  message: string
  data?: OrderData
}
