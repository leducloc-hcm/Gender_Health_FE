export interface ResetPasswordRequest {
  otp: string
  password: string
  confirm_password: string
}
