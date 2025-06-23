export interface PaymentRequest {
  order_id: number
  amount: number
}

interface PaymentItem {
  payment_id: number
  payment_url: string
  invoive_code: string
}

export interface PaymentResponse {
  message: string
  data?: PaymentItem
}

export interface CustomerProfile {
  name: string
  avatar: any
  coverPhoto: any
  dateOfBirth: string
}

export interface Order {
  address: string
  phone: string
  customerProfile: CustomerProfile
}

export interface PaymentDetail {
  id: number
  amount: string
  status: string
  invoice_code: string
  created_date: string
  order_id: number
  order: Order
}

export interface PaymentListResponse {
  message: string
  data: PaymentDetail[]
}
