export interface VerifyForgotPasswordRequest {
  forgot_password_token: string
}

export interface ResetPasswordRequest {
  forgot_password_token: string
  password: string
  confirm_password: string
}
