import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { FiEye, FiEyeOff, FiHeart, FiMail, FiLock } from 'react-icons/fi'
import { Button } from '@/app/components/ui/button'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import type { LoginFormData, LoginResponse } from '@/app/pages/Auth/Login/models/login'
import { api } from '@/app/pages/Auth/Login/services/login.api'
import { emailValidation, passwordValidation } from '@/app/modules/AuthValidation/AuthValidation'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors
  } = useForm<LoginFormData>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    console.log('Form submitted with data:', data)
    setIsLoading(true)
    try {
      const response = await api.post<LoginResponse>('/users/login', {
        email: data.email,
        password: data.password
      })
      console.log('Response received:', response)
      const responseData = response.data

      if (response.status === 200 || response.status === 201) {
        if (responseData.result?.access_token) {
          localStorage.setItem('access_token', responseData.result.access_token)
          console.log('Access token stored:', responseData.result.access_token)
        }
        if (responseData.result?.refresh_token) {
          localStorage.setItem('refresh_token', responseData.result.refresh_token)
          console.log('Refresh token stored:', responseData.result.refresh_token)
        }

        toast.success('Login successful! Redirecting...', {
          position: 'top-right',
          autoClose: 1000
        })
        setTimeout(() => {
          navigate('/customer/dashboard')
        }, 1000)
      } else {
        console.log('Login failed - invalid status:', response.status)
        toast.error(responseData.message || 'Login failed. Please try again.')
      }
    } catch (error) {
      console.error('Login error:', error)
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputFocus = (fieldName: keyof LoginFormData) => {
    clearErrors(fieldName)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center p-4'>
      <div className='absolute top-10 left-10 w-16 h-16 bg-pink-200 rounded-full opacity-30 animate-pulse'></div>
      <div className='absolute bottom-20 right-16 w-12 h-12 bg-rose-200 rounded-full opacity-40 animate-bounce'></div>
      <div className='absolute top-1/3 right-20 w-10 h-10 bg-pink-300 rounded-full opacity-25'></div>

      <div className='w-full max-w-md'>
        <div className='bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden'>
          <div className='bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-center'>
            <div className='inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-3'>
              <FiHeart className='w-6 h-6 text-pink-500' />
            </div>
            <h1 className='text-xl font-bold text-white mb-1'>Welcome Back</h1>
            <p className='text-pink-100 text-sm'>Sign in to your GenderCare account</p>
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
                    onFocus={() => handleInputFocus('password')}
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
                  <div className='absolute left-0 top-full mt-1 z-10'>
                    <p className='text-xs text-red-600 bg-white px-2 py-1 '>{errors.password.message}</p>
                  </div>
                )}
              </div>

              <div className='flex items-center justify-between pt-4'>
                <div className='flex items-center'>
                  <input
                    id='remember-me'
                    type='checkbox'
                    {...register('rememberMe')}
                    className='h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded'
                  />
                  <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-700'>
                    Remember me
                  </label>
                </div>

                <Link to='/forgot-password' className='text-sm text-pink-600 hover:text-pink-500 font-medium'>
                  Forgot password?
                </Link>
              </div>

              <Button
                type='submit'
                disabled={isLoading}
                className='w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? (
                  <div className='flex items-center justify-center'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className='mt-6 relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>Or continue with</span>
              </div>
            </div>

            {/* Google  */}
            <div className='mt-4'>
              <Button type='button' variant='outline' className='w-full border-gray-300 hover:bg-gray-50'>
                <svg className='w-4 h-4 mr-2' viewBox='0 0 24 24'>
                  <path
                    fill='#4285F4'
                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  />
                  <path
                    fill='#34A853'
                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  />
                  <path
                    fill='#FBBC05'
                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  />
                  <path
                    fill='#EA4335'
                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  />
                </svg>
                Continue with Google
              </Button>
            </div>

            {/* Sign Up*/}
            <div className='mt-6 text-center'>
              <p className='text-sm text-gray-600'>
                Don't have an account?{' '}
                <Link to='/register' className='font-medium text-pink-600 hover:text-pink-500'>
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
