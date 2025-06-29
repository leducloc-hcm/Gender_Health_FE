import { menstrualApi } from '@/app/apis/menstrual.api'
import { Button } from '@/app/components/ui/button'
import type {
  MedicationData,
  MedicationProps
} from '@/app/pages/HomePage/MenstrualCycle/partials/Medication/models/medication.type'
import { AlertCircle, Clock, Info, Loader2, Pill, SkipForward } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const frequencyOptions = [
  { value: 'once-daily', label: 'Once Daily' },
  { value: 'twice-daily', label: 'Twice Daily' },
  { value: 'three-times-daily', label: 'Three Times Daily' },
  { value: 'as-needed', label: 'As Needed' },
  { value: 'weekly', label: 'Weekly' }
]

export default function Medication({ menstrualCycleId, onNext, onSkipAll }: MedicationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFrequency, setSelectedFrequency] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<MedicationData>({
    defaultValues: {
      name: '',
      dosage: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      notes: ''
    }
  })

  const onSubmit = async (data: MedicationData) => {
    if (!menstrualCycleId) {
      toast.error('Menstrual cycle ID not found')
      return
    }

    if (!selectedFrequency) {
      toast.error('Please select medication frequency')
      return
    }

    try {
      setIsSubmitting(true)

      const requestData = {
        menstrual_cycle_id: menstrualCycleId,
        name: data.name,
        dosage: data.dosage,
        frequency: selectedFrequency,
        startDate: data.startDate,
        endDate: data.endDate || '',
        notes: data.notes || ''
      }

      console.log('Sending medication data:', requestData)

      await menstrualApi.createMedication(requestData)

      if (onNext) {
        onNext()
      }
    } catch (error: any) {
      console.error('Failed to create medication:', error)
      toast.error(error.response?.data?.message || 'Failed to save medication data')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!menstrualCycleId) {
    return (
      <div className='w-full max-w-lg mx-auto'>
        <div className='bg-white rounded-2xl shadow-lg border border-red-100'>
          <div className='flex items-center justify-center py-12'>
            <div className='text-center text-red-500'>
              <AlertCircle className='w-12 h-12 mx-auto mb-4' />
              <p className='font-medium'>Menstrual cycle ID not found</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full max-w-lg mx-auto'>
      <div className='bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden'>
        {/* Header */}
        <div className='bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-5'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center'>
              <Pill className='w-5 h-5 text-white' />
            </div>
            <div>
              <h2 className='text-lg font-semibold text-white'>Medication Tracking</h2>
              <p className='text-sm text-pink-100'>Track your medications and supplements</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='p-6 space-y-2'>
          {/* Medication Name */}
          <div className='space-y-2'>
            <label htmlFor='name' className='flex items-center text-sm font-medium text-gray-700'>
              <Pill className='w-4 h-4 mr-2 text-pink-500' />
              <span>Medication Name</span>
              <span className='text-red-500 ml-1'>*</span>
            </label>
            <input
              id='name'
              type='text'
              {...register('name', {
                required: 'Medication name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
              placeholder='e.g., Ibuprofen, Birth Control'
              className={`w-full px-3 py-2 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors ${
                errors.name
                  ? 'border-red-300 focus:border-red-400 bg-red-50'
                  : 'border-gray-200 focus:border-pink-400 bg-gray-50 focus:bg-white'
              }`}
            />
            {errors.name && (
              <p className='text-xs text-red-600 flex items-center'>
                <Info className='w-3 h-3 mr-1' />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Dosage & Frequency Row */}
          <div className='grid grid-cols-2 gap-4'>
            <div className=''>
              <label htmlFor='dosage' className='text-sm font-medium text-gray-700'>
                Dosage
                <span className='text-red-500 ml-1'>*</span>
              </label>
              <input
                id='dosage'
                type='text'
                {...register('dosage', {
                  required: 'Dosage is required'
                })}
                placeholder='e.g., 200mg'
                className={`w-full px-3 py-2 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors ${
                  errors.dosage
                    ? 'border-red-300 focus:border-red-400 bg-red-50'
                    : 'border-gray-200 focus:border-pink-400 bg-gray-50 focus:bg-white'
                }`}
              />
              {errors.dosage && (
                <p className='text-xs text-red-600 flex items-center'>
                  <Info className='w-3 h-3 mr-1' />
                  {errors.dosage.message}
                </p>
              )}
            </div>

            <div className=''>
              <label className='text-sm font-medium text-gray-700'>
                Frequency
                <span className='text-red-500 ml-1'>*</span>
              </label>
              <div className='relative'>
                <select
                  value={selectedFrequency}
                  onChange={(e) => setSelectedFrequency(e.target.value)}
                  className={`w-full px-3 py-2 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors appearance-none ${
                    !selectedFrequency
                      ? 'border-gray-200 focus:border-pink-400 bg-gray-50 focus:bg-white'
                      : 'border-gray-200 focus:border-pink-400 bg-gray-50 focus:bg-white'
                  }`}
                >
                  <option value=''>Select frequency</option>
                  {frequencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Clock className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
              </div>
            </div>
          </div>

          {/* Start Date & End Date Row */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <label htmlFor='startDate' className='text-sm font-medium text-gray-700'>
                Start Date
                <span className='text-red-500 ml-1'>*</span>
              </label>
              <input
                id='startDate'
                type='date'
                {...register('startDate', {
                  required: 'Start date is required'
                })}
                className={`w-full px-3 py-2 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors ${
                  errors.startDate
                    ? 'border-red-300 focus:border-red-400 bg-red-50'
                    : 'border-gray-200 focus:border-pink-400 bg-gray-50 focus:bg-white'
                }`}
              />
              {errors.startDate && (
                <p className='text-xs text-red-600 flex items-center'>
                  <Info className='w-3 h-3 mr-1' />
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <label htmlFor='endDate' className='text-sm font-medium text-gray-700'>
                End Date
              </label>
              <input
                id='endDate'
                type='date'
                {...register('endDate', {
                  required: 'End date is required'
                })}
                className='w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-pink-400 bg-gray-50 focus:bg-white transition-colors'
              />
            </div>
          </div>

          {/* Notes */}
          <div className='space-y-2'>
            <label htmlFor='notes' className='text-sm font-medium text-gray-700'>
              Additional Notes
            </label>
            <textarea
              id='notes'
              rows={3}
              {...register('notes')}
              placeholder='Any additional notes about this medication...'
              className='w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-pink-400 bg-gray-50 focus:bg-white transition-colors resize-none'
            />
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3 pt-4'>
            <Button
              type='button'
              onClick={onSkipAll}
              disabled={isSubmitting}
              className='flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors'
            >
              <SkipForward className='w-4 h-4 mr-2' />
              Skip All
            </Button>

            <Button
              type='submit'
              disabled={isSubmitting || !selectedFrequency}
              className='flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed'
            >
              {isSubmitting ? (
                <div className='flex items-center justify-center space-x-2'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className='flex items-center justify-center space-x-2'>
                  <span>Save Medication</span>
                  <Pill className='w-4 h-4' />
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
