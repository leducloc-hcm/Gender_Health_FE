import { fetcher } from '@/app/apis/fetcher'
import { Button } from '@/app/components/ui/button'
import { Calendar } from '@/app/components/ui/calendar'
import { Form, FormControl, FormField, FormItem } from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover'
import { cn } from '@/app/lib/utils'
import {
  dateOfBirthValidation,
  emailValidation,
  nameValidation,
  passwordValidation
} from '@/app/modules/AuthValidation/AuthValidation'
import type { RegisterFormData, RegisterResponse } from '@/app/pages/Auth/Register/models/register'
import axios from 'axios'
import { format, parse } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FiEye, FiEyeOff, FiHeart, FiLock, FiMail, FiUser } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

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
    setIsLoading(true)
    try {
      const response = await fetcher.post<RegisterFormData>('/users/register', {
        ...data,
        confirm_password: data.confirmPassword,
        date_of_birth: data.dateOfBirth ? format(data.dateOfBirth, 'yyyy-MM-dd') : undefined
      })
      setIsLoading(false)
      if (response.status === 200 || response.status === 201) {
        toast.success('Registration successful!', {
          position: 'top-right',
          autoClose: 1000
        })
      }
    } catch (error) {
      setIsLoading(false)
      if (axios.isAxiosError(error)) {
        const errorResponse = error.response?.data as RegisterResponse
        toast.error(errorResponse.message)
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    }
  }

  const handleInputFocus = (fieldName: keyof RegisterFormData) => {
    clearErrors(fieldName)
  }

  return (
    <div className='w-full max-w-md'>
      <div className='bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden'>
        <div className='bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-center'>
          <div className='inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-3'>
            <FiHeart className='w-6 h-6 text-pink-500' />
          </div>
          <h1 className='text-xl font-bold text-white mb-1'>Join GenderCare</h1>
          <p className='text-pink-100 text-sm'>Create your account to get started</p>
        </div>

        <div className='p-6'>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={control}
                name='name'
                rules={nameValidation}
                render={({ field }) => (
                  <FormItem className='relative'>
                    {/* <FormLabel ='text-sm font-medium text-gray-700'>Full Name</FormLabel> */}
                    <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                      Full Name
                    </label>

                    <FormControl>
                      <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                          <FiUser className='h-4 w-4 text-gray-400' />
                        </div>
                        <Input
                          type='text'
                          {...field}
                          onFocus={() => handleInputFocus('name')}
                          className={`w-full pl-9 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm ${
                            errors.name ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder='Enter your full name'
                        />
                      </div>
                    </FormControl>
                    {errors.name && (
                      <div className='absolute left-0 top-[93%] mt-1 z-10'>
                        <p className='text-xs text-red-600 px-2 py-1'>{errors.name.message}</p>
                      </div>
                    )}
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
                    <FormItem className='relative'>
                      <label htmlFor='dateOfBirth' className='block text-sm font-medium text-gray-700 mb-1'>
                        Date of Birth
                      </label>
                      <FormControl>
                        <div className='flex items-center space-x-2'>
                          <div className='relative flex-1'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                              <CalendarIcon className='h-4 w-4 text-gray-400' />
                            </div>
                            <Input
                              placeholder='DD/MM/YYYY'
                              value={inputValue}
                              onChange={handleInputChange}
                              onFocus={() => handleInputFocus('dateOfBirth')}
                              className={`w-full pl-9 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm ${
                                errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                          </div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant='outline'
                                className={cn(
                                  'p-2 h-10 border rounded-lg',
                                  errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                                )}
                              >
                                <CalendarIcon className='h-4 w-4 text-gray-400' />
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
                      {errors.dateOfBirth && (
                        <div className='absolute left-0 top-[93%] mt-1 z-10'>
                          <p className='text-xs text-red-600 px-2 py-1'>{errors.dateOfBirth.message}</p>
                        </div>
                      )}
                    </FormItem>
                  )
                }}
              />

              <FormField
                control={control}
                name='email'
                rules={emailValidation}
                render={({ field }) => (
                  <FormItem className='relative'>
                    <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
                      Email Address
                    </label>
                    <FormControl>
                      <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                          <FiMail className='h-4 w-4 text-gray-400' />
                        </div>
                        <input
                          type='email'
                          {...field}
                          onFocus={() => handleInputFocus('email')}
                          className={`w-full pl-9 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm ${
                            errors.email ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder='Enter your email'
                        />
                      </div>
                    </FormControl>
                    {errors.email && (
                      <div className='absolute left-0 top-[93%] mt-1 z-10'>
                        <p className='text-xs text-red-600 px-2 py-1'>{errors.email.message}</p>
                      </div>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name='password'
                rules={passwordValidation}
                render={({ field }) => (
                  <FormItem className='relative'>
                    <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>
                      Password
                    </label>
                    <FormControl>
                      <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                          <FiLock className='h-4 w-4 text-gray-400' />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          {...field}
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
                    </FormControl>
                    {errors.password && (
                      <div className='absolute left-0 top-[93%] mt-1 z-10'>
                        <p className='text-xs text-red-600 px-2 py-1'>{errors.password.message}</p>
                      </div>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name='confirmPassword'
                rules={confirmPasswordValidation}
                render={({ field }) => (
                  <FormItem className='relative'>
                    <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-1'>
                      Confirm Password
                    </label>
                    <FormControl>
                      <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                          <FiLock className='h-4 w-4 text-gray-400' />
                        </div>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          {...field}
                          onFocus={() => handleInputFocus('confirmPassword')}
                          className={`w-full pl-9 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm ${
                            errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
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
                    </FormControl>
                    {errors.confirmPassword && (
                      <div className='absolute left-0 top-[93%] mt-1 z-10'>
                        <p className='text-xs text-red-600 px-2 py-1'>{errors.confirmPassword.message}</p>
                      </div>
                    )}
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                disabled={isLoading}
                className='w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? (
                  <div className='flex items-center justify-center'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
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
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-white text-gray-500'>Or continue with</span>
            </div>
          </div>

          {/* Sign In Link */}
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
