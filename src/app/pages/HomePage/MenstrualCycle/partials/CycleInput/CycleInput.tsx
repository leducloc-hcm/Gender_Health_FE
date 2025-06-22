import { menstrualApi } from '@/app/apis/menstrual.api'
import { Button } from '@/app/components/ui/button'
import { sUserProfile } from '@/app/hooks/sUserProfile'
import type {
  CycleInputProps,
  FormData
} from '@/app/pages/HomePage/MenstrualCycle/partials/CycleInput/models/cycleinput.type'
import { Calendar, Info, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

export default function CycleInput({ onNext }: CycleInputProps) {
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

  const onSubmit = async (data: FormData) => {
    if (!sUserProfile?.value.customer_profile_id) {
      toast.error('User profile not found')
      return
    }
    try {
      setIsSubmitting(true)
      const requestData = {
        customer_profile_id: sUserProfile.value.customer_profile_id,
        startDate: data.startDate,
        cycleLength: data.cycleLength,
        periodLength: data.periodLength
      }
      const response = await menstrualApi.createMenstrualCycle(requestData)

      const cycleId = response.data?.id
      if (onNext && cycleId) {
        onNext(cycleId)
      }
    } catch (error: any) {
      console.error('Failed to create menstrual cycle:', error)
      toast.error(error.response?.data?.message || 'Failed to save menstrual cycle data')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='w-full max-w-md mx-auto'>
      <div className='bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden'>
        <div className='bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-5'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center'>
              <Calendar className='w-5 h-5 text-white' />
            </div>
            <div>
              <h2 className='text-lg font-semibold text-white'>Cycle Information</h2>
              <p className='text-sm text-pink-100'>Set up your menstrual cycle tracking</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='p-6 space-y-5'>
          <div className='space-y-2'>
            <label htmlFor='startDate' className='flex items-center text-sm font-medium text-gray-700'>
              <span>Last Period Start Date</span>
              <span className='text-red-500 ml-1'>*</span>
            </label>
            <input
              id='startDate'
              type='date'
              {...register('startDate', {
                required: 'Start date is required'
              })}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors ${
                errors.startDate
                  ? 'border-red-300 focus:border-red-400 bg-red-50'
                  : 'border-gray-200 focus:border-pink-400 bg-gray-50 focus:bg-white'
              }`}
            />
            {errors.startDate && (
              <p className='text-xs text-red-600 flex items-center mt-1'>
                <Info className='w-3 h-3 mr-1' />
                {errors.startDate.message}
              </p>
            )}
          </div>

          {/* Cycle Length */}
          <div className='space-y-2'>
            <label htmlFor='cycleLength' className='flex items-center text-sm font-medium text-gray-700'>
              <span>Average Cycle Length</span>
              <span className='text-red-500 ml-1'>*</span>
            </label>
            <div className='relative'>
              <input
                id='cycleLength'
                type='number'
                min='21'
                max='35'
                {...register('cycleLength', {
                  required: 'Cycle length is required',
                  min: {
                    value: 21,
                    message: 'Minimum 21 days'
                  },
                  max: {
                    value: 35,
                    message: 'Maximum 35 days'
                  },
                  valueAsNumber: true
                })}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors ${
                  errors.cycleLength
                    ? 'border-red-300 focus:border-red-400 bg-red-50'
                    : 'border-gray-200 focus:border-pink-400 bg-gray-50 focus:bg-white'
                }`}
                placeholder='28'
              />
            </div>
            {errors.cycleLength ? (
              <p className='text-xs text-red-600 flex items-center mt-1'>
                <Info className='w-3 h-3 mr-1' />
                {errors.cycleLength.message}
              </p>
            ) : (
              <p className='text-xs text-gray-500'>Normal range: 21-35 days</p>
            )}
          </div>

          {/* Period Length */}
          <div className='space-y-2'>
            <label htmlFor='periodLength' className='flex items-center text-sm font-medium text-gray-700'>
              <span>Period Length</span>
              <span className='text-red-500 ml-1'>*</span>
            </label>
            <div className='relative'>
              <input
                id='periodLength'
                type='number'
                min='3'
                max='7'
                {...register('periodLength', {
                  required: 'Period length is required',
                  min: {
                    value: 3,
                    message: 'Minimum 3 days'
                  },
                  max: {
                    value: 7,
                    message: 'Maximum 7 days'
                  },
                  valueAsNumber: true
                })}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors ${
                  errors.periodLength
                    ? 'border-red-300 focus:border-red-400 bg-red-50'
                    : 'border-gray-200 focus:border-pink-400 bg-gray-50 focus:bg-white'
                }`}
                placeholder='5'
              />
            </div>
            {errors.periodLength ? (
              <p className='text-xs text-red-600 flex items-center mt-1'>
                <Info className='w-3 h-3 mr-1' />
                {errors.periodLength.message}
              </p>
            ) : (
              <p className='text-xs text-gray-500'>Normal range: 3-7 days</p>
            )}
          </div>

          {/* Submit Button */}
          <div className='pt-4'>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed'
            >
              {isSubmitting ? (
                <div className='flex items-center justify-center space-x-2'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className='flex items-center justify-center space-x-2'>
                  <span>Continue</span>
                  <Calendar className='w-4 h-4' />
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Info Card */}
    </div>
  )
}
