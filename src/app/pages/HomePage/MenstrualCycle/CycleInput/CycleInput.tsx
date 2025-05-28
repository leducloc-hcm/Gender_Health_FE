import { useState, useEffect } from 'react'
import { Calendar, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import axios from 'axios'

interface CycleInputProps {
  onNext?: (cycleId: number) => void // Changed to pass cycleId
}

interface FormData {
  startDate: string
  cycleLength: number
  periodLength: number
}

interface UserProfile {
  id: number
  customer_profile_id: number
  email: string
  name: string
  role: string
  status: string
  created_at: string
  updated_at: string
  bio: string | null
  location: string | null
  username: string
  avatar: string | null
  cover_photo: string | null
  date_of_birth: string
  website: string | null
  phone_number: string | null
  description: string | null
}

// Create axios instance
const api = axios.create({
  baseURL: 'http://52.221.179.12:4000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default function CycleInput({ onNext }: CycleInputProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      startDate: '',
      cycleLength: 28,
      periodLength: 5
    }
  })

  // Get user profile on component mount
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        setIsLoadingProfile(true)
        const response = await api.get('/users/me')

        console.log('User profile response:', response.data)
        setUserProfile(response.data.result)
      } catch (error: any) {
        console.error('Failed to fetch user profile:', error)
        toast.error(error.response?.data?.message || 'Failed to load user profile')
      } finally {
        setIsLoadingProfile(false)
      }
    }

    getUserProfile()
  }, [])

  const onSubmit = async (data: FormData) => {
    if (!userProfile?.customer_profile_id) {
      toast.error('User profile not found')
      return
    }

    try {
      setIsSubmitting(true)

      const requestData = {
        customer_profile_id: userProfile.customer_profile_id,
        startDate: data.startDate,
        cycleLength: data.cycleLength,
        periodLength: data.periodLength
      }

      console.log('Sending menstrual cycle data:', requestData)

      const response = await api.post('/menstrual-cycles/create', requestData)

      console.log('Menstrual cycle created:', response.data)

      toast.success('Menstrual cycle data saved successfully!')

      // Pass the cycle ID to parent component
      if (onNext && response.data.data?.id) {
        onNext(response.data.data.id)
      }
    } catch (error: any) {
      console.error('Failed to create menstrual cycle:', error)
      toast.error(error.response?.data?.message || 'Failed to save menstrual cycle data')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingProfile) {
    return (
      <div className='w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md'>
        <div className='flex items-center justify-center py-8'>
          <Loader2 className='w-8 h-8 animate-spin text-pink-500' />
          <span className='ml-2 text-gray-600'>Loading profile...</span>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md'>
      <div className='p-6 border-b'>
        <div className='flex items-center gap-2 mb-2'>
          <Calendar className='w-5 h-5 text-pink-600' />
          <h2 className='text-xl font-semibold'>Cycle Information</h2>
        </div>
        <p className='text-gray-600'>Enter your basic menstrual cycle information to get started.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='p-6'>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <label htmlFor='startDate' className='block text-sm font-medium text-gray-700'>
              Last Period Start Date *
            </label>
            <input
              id='startDate'
              type='date'
              {...register('startDate', {
                required: 'Start date is required'
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                errors.startDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.startDate && <p className='text-sm text-red-500'>{errors.startDate.message}</p>}
          </div>

          <div className='space-y-2'>
            <label htmlFor='cycleLength' className='block text-sm font-medium text-gray-700'>
              Average Cycle Length (days) *
            </label>
            <input
              id='cycleLength'
              type='number'
              {...register('cycleLength', {
                required: 'Cycle length is required',
                min: {
                  value: 21,
                  message: 'Cycle length must be at least 21 days'
                },
                max: {
                  value: 35,
                  message: 'Cycle length must not exceed 35 days'
                },
                valueAsNumber: true
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                errors.cycleLength ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.cycleLength && <p className='text-sm text-red-500'>{errors.cycleLength.message}</p>}
            <p className='text-sm text-gray-500'>Normal range: 21-35 days</p>
          </div>

          <div className='space-y-2'>
            <label htmlFor='periodLength' className='block text-sm font-medium text-gray-700'>
              Period Length (days) *
            </label>
            <input
              id='periodLength'
              type='number'
              {...register('periodLength', {
                required: 'Period length is required',
                min: {
                  value: 3,
                  message: 'Period length must be at least 3 days'
                },
                max: {
                  value: 7,
                  message: 'Period length must not exceed 7 days'
                },
                valueAsNumber: true
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                errors.periodLength ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.periodLength && <p className='text-sm text-red-500'>{errors.periodLength.message}</p>}
            <p className='text-sm text-gray-500'>Normal range: 3-7 days</p>
          </div>

          <div className='pt-4'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 flex items-center justify-center'
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Saving...
                </>
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
