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
import { Input } from '@/app/components/ui/input'
import { toast } from 'react-toastify'
import type { RegisterFormData, RegisterResponse } from '@/app/pages/Auth/Register/models/register'
import {
  dateOfBirthValidation,
  emailValidation,
  nameValidation,
  passwordValidation
} from '@/app/modules/AuthValidation/AuthValidation'
import { fetcher } from '@/app/apis/fetcher'

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
      const response = await fetcher.post<RegisterFormData>('/users/register', {
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
        toast.error(errorResponse.message)
      } else {
        console.error('Unexpected error:', error)
        toast.error('An unexpected error occurred. Please try again later.')
      }
    }
  }

  const handleInputFocus = (fieldName: keyof RegisterFormData) => {
    clearErrors(fieldName)
  }

  return (
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

          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600'>
              Have an account?{' '}
              <Link to='/auth/login' className='font-medium text-pink-600 hover:text-pink-500'>
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
