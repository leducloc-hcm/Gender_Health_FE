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
