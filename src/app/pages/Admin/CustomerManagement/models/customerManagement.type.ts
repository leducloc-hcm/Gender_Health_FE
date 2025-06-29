export interface CustomerResponse {
  message: string
  data: CustomerData[]
}

export interface CustomerData {
  avatar?: string
  name: string
  description: any
  id: number
  coverPhoto?: string
  dateOfBirth?: string
  username: string
  orders: Order[]
}

export interface Order {
  id: number
  created_at: string
  status: string
  address: string
  phone: string
  note: string
  total_amount: string
  orderItems: OrderItem[]
}

export interface OrderItem {
  id: number
  code: string
  name: string
  final_price: string
}
