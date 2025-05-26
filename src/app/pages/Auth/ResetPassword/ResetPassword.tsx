import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { ResetPasswordRequest, VerifyForgotPasswordRequest } from './models/ResetPassword'
import { authApi } from '@/app/apis/auth.api'
import { toast } from 'react-toastify'
import { FiEye, FiEyeOff, FiHeart, FiLock } from 'react-icons/fi'
import { Button } from '@/app/components/ui/button'
import { Link } from 'react-router-dom'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { passwordValidation } from '@/app/modules/AuthValidation/AuthValidation'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const token = searchParams.get('token')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ResetPasswordRequest>({
    mode: 'onBlur',
    defaultValues: {
      forgot_password_token: token || '',
      password: '',
      confirm_password: ''
    }
  })

  const confirmPasswordValidation = {
    required: 'Confirm Password is required',
    validate: (value: string) => {
      if (value !== watch('password')) {
        return 'Passwords do not match'
      }
      return true
    }
  }

  // function call api change-password
  const onSubmit: SubmitHandler<ResetPasswordRequest> = async (data) => {
    console.log('Form submitted with data:', data)
    setIsLoading(true)
    try {
      const response = await authApi.resetPassword(data)
      console.log('Response received:', response)

      toast.success('Change password successful, please sign in again!', {
        position: 'top-right',
        autoClose: 1500
      })

      navigate('/auth/login')
    } catch (error: any) {
      console.log('🚀 ~ ChangePassword ~ error:', error)

      const errorMessage = error.response?.data?.errors?.email?.msg || error.message || 'Failed. Please try again!'
      toast.error(errorMessage)

      navigate('/auth/forgotPassword')
    } finally {
      setIsLoading(false)
    }
  }

  // function call api verify-forgot-password
  const callVerify = async (data: VerifyForgotPasswordRequest) => {
    setIsLoading(true)
    try {
      const response = await authApi.verifyForgotPassword(data)
      console.log('🚀 ~ callVerify ~ response:', response)
    } catch (error: any) {
      console.error('Error:', error)
      toast.error('Failed. Please try again!')
      navigate('/')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      // console.log('🚀 ~ useEffect ~ token:', token)
      callVerify({ forgot_password_token: token })
    }

    if (!token) {
      navigate('/')
    }
  }, [token])

  if (isLoading) {
    return (
      <>
        <div>Loading</div>
      </>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center p-4'>
      <div className='absolute top-10 left-10 w-16 h-16 bg-pink-200 rounded-full opacity-30 animate-pulse'></div>
      <div className='absolute bottom-20 right-16 w-12 h-12 bg-rose-200 rounded-full opacity-40 animate-bounce'></div>
      <div className='absolute top-1/3 right-20 w-10 h-10 bg-pink-300 rounded-full opacity-25'></div>

      <div className='w-full max-w-md min-w-sm'>
        <div className='bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden'>
          <div className='bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-center'>
            <div className='inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-3'>
              <FiHeart className='w-6 h-6 text-pink-500' />
            </div>
            <h1 className='text-xl font-bold text-white mb-1'>Change your password!</h1>
            <p className='text-pink-100 text-sm'>Enter new password to change your password</p>
          </div>

          <div className='p-6'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
              {/* password */}
              <div className='relative'>
                <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>
                  Password
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <FiLock className='h-4 w-4 text-gray-400' />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    {...register('password', passwordValidation)}
                    className={`w-full pl-9 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder='Enter your password'
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className='h-4 w-4 text-gray-400 hover:text-gray-600' />
                    ) : (
                      <FiEye className='h-4 w-4 text-gray-400 hover:text-gray-600' />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className='mt-1 z-10'>
                    <p className='text-xs text-red-600 bg-white px-2 py-1 '>{errors.password.message}</p>
                  </div>
                )}
              </div>

              {/* confirm-password */}
              <div className='relative'>
                <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>
                  Confirm Password
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <FiLock className='h-4 w-4 text-gray-400' />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id='confirm_password'
                    {...register('confirm_password', confirmPasswordValidation)}
                    className={`w-full pl-9 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm ${
                      errors.confirm_password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder='Confirm your password'
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className='h-4 w-4 text-gray-400 hover:text-gray-600' />
                    ) : (
                      <FiEye className='h-4 w-4 text-gray-400 hover:text-gray-600' />
                    )}
                  </button>
                </div>
                {errors.confirm_password && (
                  <div className='mt-1 z-10'>
                    <p className='text-xs text-red-600 bg-white px-2 py-1 '>{errors.confirm_password.message}</p>
                  </div>
                )}
              </div>

              <Button
                type='submit'
                disabled={isLoading}
                className='w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? (
                  <div className='flex items-center justify-center'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                    Changing...
                  </div>
                ) : (
                  'Change password'
                )}
              </Button>
            </form>

            {/* Back to log in page*/}
            <div className='mt-6 text-center'>
              <p className='text-sm text-gray-600'>
                Already have an account?{' '}
                <Link to='/auth/login' className='font-medium text-pink-600 hover:text-pink-500'>
                  Log in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
