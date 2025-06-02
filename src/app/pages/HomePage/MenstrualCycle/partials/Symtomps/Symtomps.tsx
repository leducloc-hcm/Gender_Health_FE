import { menstrualApi } from '@/app/apis/menstrual.api'
import { Button } from '@/app/components/ui/button'
import type {
  SymptomData,
  SymptomsProps
} from '@/app/pages/HomePage/MenstrualCycle/partials/Symtomps/models/symtomps.type'
import { Activity, AlertCircle, Brain, Calendar, Heart, Info, Loader2, SkipForward, Zap } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const mainSymptoms = [
  { value: 'Fatigue', label: 'Fatigue', icon: Zap },
  { value: 'Cramps', label: 'Cramps', icon: Activity },
  { value: 'Headache', label: 'Headache', icon: Brain },
  { value: 'Bloating', label: 'Bloating', icon: AlertCircle },
  { value: 'Breast Tenderness', label: 'Breast Tenderness', icon: Heart },
  { value: 'Mood Changes', label: 'Mood Changes', icon: Brain }
]

export default function Symptoms({ menstrualCycleId, onNext, onSkipAll }: SymptomsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedSymptom, setSelectedSymptom] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SymptomData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      description: ''
    }
  })

  const onSubmit = async (data: SymptomData) => {
    if (!menstrualCycleId) {
      toast.error('Menstrual cycle ID not found')
      return
    }

    try {
      setIsSubmitting(true)

      const requestData = {
        menstrual_cycle_id: menstrualCycleId,
        date: data.date,
        symptomType: selectedSymptom,
        description: data.description
      }

      await menstrualApi.createSymptom(requestData)

      if (onNext) {
        onNext()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save symptom data')
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
        <div className='bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-5'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center'>
              <Heart className='w-5 h-5 text-white' />
            </div>
            <div>
              <h2 className='text-lg font-semibold text-white'>Daily Symptoms</h2>
              <p className='text-sm text-pink-100'>Track your symptoms today</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='p-6 space-y-3'>
          <div className='space-y-2'>
            <label htmlFor='date' className='flex items-center text-sm font-medium text-gray-700'>
              <Calendar className='w-4 h-4 mr-2 text-pink-500' />
              <span>Date</span>
              <span className='text-red-500 ml-1'>*</span>
            </label>
            <input
              id='date'
              type='date'
              {...register('date', {
                required: 'Date is required'
              })}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors ${
                errors.date
                  ? 'border-red-300 focus:border-red-400 bg-red-50'
                  : 'border-gray-200 focus:border-pink-400 bg-gray-50 focus:bg-white'
              }`}
            />
            {errors.date && (
              <p className='text-xs text-red-600 flex items-center'>
                <Info className='w-3 h-3 mr-1' />
                {errors.date.message}
              </p>
            )}
          </div>

          <div className='space-y-3'>
            <label className='flex items-center text-sm font-medium text-gray-700'>
              <Activity className='w-4 h-4 mr-2 text-pink-500' />
              <span>Select Symptom Type</span>
              <span className='text-red-500 ml-1'>*</span>
            </label>

            <div className='grid grid-cols-3 gap-3'>
              {mainSymptoms.map((symptom) => {
                const isSelected = selectedSymptom === symptom.value
                const IconComponent = symptom.icon

                return (
                  <button
                    key={symptom.value}
                    type='button'
                    onClick={() => setSelectedSymptom(symptom.value)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 h-16 hover:cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-transparent shadow-lg'
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-pink-300 text-gray-700'
                    }`}
                  >
                    <div className='flex flex-col items-center justify-center h-full space-y-1'>
                      <IconComponent className='w-4 h-4' />
                      <span className='text-xs font-medium text-center leading-tight'>{symptom.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
          <div className=''>
            <textarea
              id='description'
              rows={2}
              {...register('description')}
              placeholder='Describe your symptoms in more detail...'
              className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-pink-400 bg-gray-50 focus:bg-white transition-colors resize-none'
            />
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3'>
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
              disabled={isSubmitting || !selectedSymptom}
              className='flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed'
            >
              {isSubmitting ? (
                <div className='flex items-center justify-center space-x-2'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className='flex items-center justify-center space-x-2'>
                  <span>Save Symptom</span>
                  <Heart className='w-4 h-4' />
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
