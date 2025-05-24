import type { AxiosResponse } from 'axios'

export interface VerifyForgotPasswordRequest {
  email: string
  code: string
}

export interface VerifyForgotPasswordResponse extends Partial<AxiosResponse> {
  message?: string
  errors?: {
    email?: {
      type?: string
      value?: string
      msg?: string
      path?: string
      location?: string
    }
  }
}
