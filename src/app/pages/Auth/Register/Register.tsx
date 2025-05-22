import { Button } from '@/app/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/app/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover'
import { Calendar } from '@/app/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FiEye, FiEyeOff, FiHeart, FiLock, FiMail, FiUser } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { format, parse } from 'date-fns'
import { cn } from '@/app/lib/utils'
import { Input } from '@/app/components/ui/input' // Add this import
import { toast } from 'react-toastify'

interface RegisterFormData {
  name: string
  dateOfBirth: Date | undefined
  email: string
  password: string
  confirmPassword: string
}

interface RegisterResponse {
  message: string
  result?: {
    access_token?: string
    refresh_token?: string
  }
}

const api = axios.create({
  baseURL: 'http://52.221.179.12:4000',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default function Register() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const form = useForm<RegisterFormData>({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      dateOfBirth: undefined,
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    clearErrors
  } = form

  const nameValidation = {
    required: 'Name is required',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters'
    },
    maxLength: {
      value: 50,
      message: 'Name must be at most 50 characters'
    }
  }

  const dateOfBirthValidation = {
    required: 'Date of Birth is required',
    validate: (value: Date | undefined) => {
      if (!value) return 'Date of Birth is required'
      const today = new Date()
      const birthDate = new Date(value)
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age < 13) return 'You must be at least 13 years old'
      if (birthDate > today) return 'Date of birth cannot be in the future'
      return true
    }
  }

  const emailValidation = {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Please enter a valid email address'
    }
  }

  const passwordValidation = {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters long'
    },
    maxLength: {
      value: 50,
      message: 'Password must be at most 50 characters long'
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
      message: 'Password must include uppercase, lowercase, number, and symbol'
    }
  }

  const confirmPasswordValidation = {
    required: 'Confirm Password is required',
    validate: (value: string) => {
      if (value !== watch('password')) {
        return 'Passwords do not match'
      }
      return true
    }
  }

  const onSubmit = async (data: RegisterFormData) => {
    console.log('data: ', data)
    console.log('Form submitted with data:', {
      ...data,

      dateOfBirth: data.dateOfBirth ? format(data.dateOfBirth, 'yyyy-MM-dd') : undefined
    })
    setIsLoading(true)
    try {
      const response = await api.post<RegisterFormData>('/users/register', {
        ...data,
        confirm_password: data.confirmPassword,
        date_of_birth: data.dateOfBirth ? format(data.dateOfBirth, 'yyyy-MM-dd') : undefined
      })
      console.log('Response received:', response)
      const responseData = response.data
      setIsLoading(false)
      if (response.status === 200 || response.status === 201) {
        toast.success('Registration successful!', {
          position: 'top-right',
          autoClose: 1000
        })
      }
      console.log('responseData: ', responseData)
    } catch (error) {
      console.error('Registration error:', error)
      setIsLoading(false)
      if (axios.isAxiosError(error)) {
        const errorResponse = error.response?.data as RegisterResponse
        console.error('Error response:', errorResponse)
        alert(errorResponse.message)
      } else {
        console.error('Unexpected error:', error)
        alert('An unexpected error occurred. Please try again later.')
      }
    }
  }

  const handleInputFocus = (fieldName: keyof RegisterFormData) => {
    clearErrors(fieldName)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 flex items-center justify-center p-6'>
      <div className='absolute top-12 left-12 w-20 h-20 bg-pink-300 rounded-full opacity-20 animate-pulse'></div>
      <div className='absolute bottom-24 right-20 w-16 h-16 bg-rose-300 rounded-full opacity-30 animate-bounce'></div>
      <div className='absolute top-1/4 right-24 w-12 h-12 bg-pink-400 rounded-full opacity-15'></div>

      <div className='w-full max-w-lg'>
        <div className='bg-white rounded-3xl shadow-2xl border border-pink-200 overflow-hidden'>
          <div className='bg-gradient-to-r from-pink-500 to-rose-500 p-2 text-center'>
            <div className='inline-flex items-center justify-center w-11 h-11 bg-white rounded-full mb-4'>
              <FiHeart className='w-7 h-7 text-pink-600' />
            </div>
            <h1 className='text-2xl font-bold text-white mb-2'>Join GenderCare</h1>
            <p className='text-pink-100 text-sm'>Create your account to get started</p>
          </div>

          <div className='pl-10 pr-10 pt-2.5 pb-2.5'>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-1'>
                <FormField
                  control={control}
                  name='name'
                  rules={nameValidation}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium text-gray-700'>Full Name</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <FiUser className='h-5 w-5 text-gray-400' />
                          </div>
                          <Input
                            type='text'
                            {...field}
                            onFocus={() => handleInputFocus('name')}
                            className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm ${
                              errors.name ? 'border-red-300' : 'border-gray-200'
                            }`}
                            placeholder='Enter your full name'
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name='dateOfBirth'
                  rules={dateOfBirthValidation}
                  render={({ field }) => {
                    const [inputValue, setInputValue] = useState(field.value ? format(field.value, 'dd/MM/yyyy') : '')

                    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value
                      setInputValue(value)

                      try {
                        const parsedDate = parse(value, 'dd/MM/yyyy', new Date())
                        if (
                          parsedDate &&
                          !isNaN(parsedDate.getTime()) &&
                          parsedDate <= new Date() &&
                          parsedDate >= new Date('1900-01-01')
                        ) {
                          field.onChange(parsedDate)
                        } else {
                          field.onChange(undefined)
                        }
                      } catch {
                        field.onChange(undefined)
                      }
                    }

                    const handleCalendarSelect = (date: Date | undefined) => {
                      field.onChange(date)
                      setInputValue(date ? format(date, 'dd/MM/yyyy') : '')
                    }

                    return (
                      <FormItem>
                        <FormLabel className='text-sm font-medium text-gray-700'>Date of Birth</FormLabel>
                        <FormControl>
                          <div className='flex items-center space-x-2'>
                            <div className='relative flex-1'>
                              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <CalendarIcon className='h-5 w-5 text-gray-400' />
                              </div>
                              <Input
                                placeholder='DD/MM/YYYY'
                                value={inputValue}
                                onChange={handleInputChange}
                                onFocus={() => handleInputFocus('dateOfBirth')}
                                className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm ${
                                  errors.dateOfBirth ? 'border-red-300' : 'border-gray-200'
                                }`}
                              />
                            </div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant='outline'
                                  className={cn(
                                    'p-3 h-12 border rounded-xl',
                                    errors.dateOfBirth ? 'border-red-300' : 'border-gray-200'
                                  )}
                                >
                                  <CalendarIcon className='h-5 w-5 text-gray-400' />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className='w-auto p-0'>
                                <Calendar
                                  mode='single'
                                  selected={field.value}
                                  onSelect={handleCalendarSelect}
                                  initialFocus
                                  disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />

                <FormField
                  control={control}
                  name='email'
                  rules={emailValidation}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium text-gray-700'>Email Address</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <FiMail className='h-5 w-5 text-gray-400' />
                          </div>
                          <input
                            type='email'
                            {...field}
                            onFocus={() => handleInputFocus('email')}
                            className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm ${
                              errors.email ? 'border-red-300' : 'border-gray-200'
                            }`}
                            placeholder='Enter your email'
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name='password'
                  rules={passwordValidation}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium text-gray-700'>Password</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <FiLock className='h-5 w-5 text-gray-400' />
                          </div>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            {...field}
                            onFocus={() => handleInputFocus('password')}
                            className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm ${
                              errors.password ? 'border-red-300' : 'border-gray-200'
                            }`}
                            placeholder='Enter your password'
                          />
                          <button
                            type='button'
                            className='absolute inset-y-0 right-0 pr-3 flex items-center'
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <FiEyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                            ) : (
                              <FiEye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name='confirmPassword'
                  rules={confirmPasswordValidation}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium text-gray-700'>Confirm Password</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <FiLock className='h-5 w-5 text-gray-400' />
                          </div>
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            {...field}
                            onFocus={() => handleInputFocus('confirmPassword')}
                            className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm ${
                              errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                            }`}
                            placeholder='Confirm your password'
                          />
                          <button
                            type='button'
                            className='absolute inset-y-0 right-0 pr-3 flex items-center'
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <FiEyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                            ) : (
                              <FiEye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type='submit'
                  disabled={isLoading}
                  className='w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6'
                >
                  {isLoading ? (
                    <div className='flex items-center justify-center'>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                      Registering...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </Form>

            <div className='mt-6 relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-200' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-3 bg-white text-gray-500 font-medium'>Or continue with</span>
              </div>
            </div>

            <div className='mt-6'>
              <Button
                type='button'
                variant='outline'
                className='w-full border-gray-200 hover:bg-gray-50 py-3 rounded-xl transition-colors cursor-pointer'
              >
                <svg className='w-5 h-5 mr-2' viewBox='0 0 24 24'>
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

            <div className='mt-6 text-center'>
              <p className='text-sm text-gray-600'>
                Have an account?{' '}
                <Link to='/login' className='font-medium text-pink-600 hover:text-pink-500'>
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
