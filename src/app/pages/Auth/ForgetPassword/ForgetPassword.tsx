import { authApi } from '@/app/apis/auth.api'
import { Button } from '@/app/components/ui/button'
import axios from 'axios'
import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { FiHeart, FiMail } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import type { ForgotPasswordFormData } from './models/ForgetPassword'
import { emailValidation } from '@/app/modules/AuthValidation/AuthValidation'

export default function ForgetPassword() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors
  } = useForm<ForgotPasswordFormData>({
    mode: 'onBlur',
    defaultValues: {
      email: ''
    }
  })

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    console.log('Form submitted with data:', data)
    setIsLoading(true)
    try {
      const response = await authApi.forgotPassword(data)
      console.log('Response received:', response)

      toast.success('Send successful! Please check your email...', {
        position: 'top-right',
        autoClose: 1500
      })
      navigate('/')
    } catch (error: any) {
      console.log('🚀 ~ ForgotPassword ~ error:', error)
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.errors?.email?.msg || error.message || 'Failed. Please try again!'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputFocus = (fieldName: keyof ForgotPasswordFormData) => {
    clearErrors(fieldName)
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
            <h1 className='text-xl font-bold text-white mb-1'>Forgot your password?</h1>
            <p className='text-pink-100 text-sm'>Enter your email and we'll send you a link to reset password</p>
          </div>

          <div className='p-6'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
              <div className='relative'>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
                  Email Address
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <FiMail className='h-4 w-4 text-gray-400' />
                  </div>
                  <input
                    type='email'
                    id='email'
                    {...register('email', emailValidation)}
                    onFocus={() => handleInputFocus('email')}
                    className={`w-full pl-9 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder='Enter your email'
                  />
                </div>
                {errors.email && (
                  <div className='absolute left-0 top-[93%] mt-1 z-10'>
                    <p className='text-xs text-red-600 px-2 py-1 '>{errors.email.message}</p>
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
                    Sending...
                  </div>
                ) : (
                  'Reset password'
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
