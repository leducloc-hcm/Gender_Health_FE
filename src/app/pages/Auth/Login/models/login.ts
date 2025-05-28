export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  message?: string
  result?: {
    role: string
    access_token?: string
    refresh_token?: string
  }
}
