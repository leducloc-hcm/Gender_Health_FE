import { api } from '@/app/apis/fetcherToken'
import { Button } from '@/app/components/ui/button'
import type { UserProfile } from '@/app/pages/HomePage/MenstrualCycle/models/menstrual.type'
import type {
  CycleInputProps,
  FormData
} from '@/app/pages/HomePage/MenstrualCycle/partials/CycleInput/models/cycleinput.type'
import { Calendar, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

export default function CycleInput({ onNext }: CycleInputProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
            <Button
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
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
