import { getLocalStorage, removeLocalStorage } from '@/app/lib/utils'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { VerifyForgotPasswordRequest } from './models/ResetPassword'
import { authApi } from '@/app/apis/auth.api'
import { toast } from 'react-toastify'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const token = searchParams.get('token')
  const emailForgot = getLocalStorage('forgot-email')

  // function call api verify-forgot-password
  const callVerify = async (data: VerifyForgotPasswordRequest): Promise<void> => {
    setIsLoading(true)
    try {
      const response = await authApi.verifyForgotPassword(data)
      console.log('🚀 ~ callVerify ~ response:', response)
    } catch (error) {
      console.error('Error:', error)
      toast.error('An unexpected error occurred. Please try again.')
      //   setTimeout(() => {
      //     navigate('/')
      //   }, 1500)
    } finally {
      removeLocalStorage('forgot-email')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token && emailForgot) {
      callVerify({ email: emailForgot, code: token })
    }

    if (!token || !emailForgot) {
      navigate('/')
    }
  }, [token, emailForgot])

  if (isLoading) {
    return (
      <>
        <div>loading</div>
      </>
    )
  }

  return (
    <>
      <div>ResetPassword</div>
    </>
  )
}
