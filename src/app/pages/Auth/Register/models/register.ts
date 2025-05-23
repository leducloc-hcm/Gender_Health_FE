export interface RegisterFormData {
  name: string
  dateOfBirth: Date | undefined
  email: string
  password: string
  confirmPassword: string
}

export interface RegisterResponse {
  message: string
  result?: {
    access_token?: string
    refresh_token?: string
  }
}
