import { useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import type { VerifyPasscodeRequest } from './models/VerifyPasscode'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { FiEye, FiEyeOff, FiHeart, FiLock } from 'react-icons/fi'
import { authApi } from '@/app/apis/auth.api'
import { toast } from 'react-toastify'
import { otpValidation } from '@/app/modules/AuthValidation/AuthValidation'
import { Button } from '@/app/components/ui/button'

export default function VerifyPasscode() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPasscode, setShowPasscode] = useState<boolean>(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { email } = location.state || {}

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors
  } = useForm<VerifyPasscodeRequest>({
    mode: 'onBlur',
    defaultValues: {
      otp: ''
    }
  })

  // function call api verify passcode
  const onSubmit: SubmitHandler<VerifyPasscodeRequest> = async (data) => {
    console.log('Form submitted with data:', data)
    setIsLoading(true)
    try {
      const response = await authApi.verifyPasscode(data)
      console.log('Response received:', response)

      toast.success('Verify successful, please enter your new password', {
        position: 'top-right',
        autoClose: 1500
      })

      navigate('/auth/reset-password', {
        state: {
          otp: data.otp
        }
      })
    } catch (error: any) {
      toast.error('Failed. Please try again!')

      navigate('/auth/forgot-password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputFocus = (fieldName: keyof VerifyPasscodeRequest) => {
    clearErrors(fieldName)
  }

   useEffect(() => {
      if (!email) {
        navigate('/')
      }
    }, [email])

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center p-4'>
      <div className='absolute top-10 left-10 w-16 h-16 bg-pink-200 rounded-full opacity-30 animate-pulse'></div>
      <div className='absolute bottom-20 right-16 w-12 h-12 bg-rose-200 rounded-full opacity-40 animate-bounce'></div>
      <div className='absolute top-1/3 right-20 w-10 h-10 bg-pink-300 rounded-full opacity-25'></div>

      <div className='w-full max-w-md min-w-sm'>
        <div className='bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden'>
          <div className='bg-gradient-to-r from-pink-500 to-rose-500 p-8 text-center'>
            <div className='inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-3'>
              <FiHeart className='w-6 h-6 text-pink-500' />
            </div>
            <h1 className='text-xl font-bold text-white mb-1'>Enter the OTP</h1>
            <p className='text-pink-100 text-sm'>We have sent you a OTP in email</p>
          </div>

          <div className='p-6'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
              <div className='relative'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <FiLock className='h-4 w-4 text-gray-400' />
                  </div>

                  <input
                    type={showPasscode ? 'text' : 'password'}
                    id='otp'
                    {...register('otp', otpValidation)}
                    onFocus={() => handleInputFocus('otp')}
                    className={`w-full pl-9 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm ${
                      errors.otp ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder='XXXXXX'
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                    onClick={() => setShowPasscode(!showPasscode)}
                  >
                    {showPasscode ? (
                      <FiEyeOff className='h-4 w-4 text-gray-400 hover:text-gray-600' />
                    ) : (
                      <FiEye className='h-4 w-4 text-gray-400 hover:text-gray-600' />
                    )}
                  </button>
                </div>
                {errors.otp && (
                  <div className='mt-1 z-10'>
                    <p className='text-xs text-red-600 bg-white px-2 py-1 '>{errors.otp.message}</p>
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
                  'Send'
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
