import { menstrualApi } from '@/app/apis/menstrual.api'
import { Button } from '@/app/components/ui/button'
import type {
  FertilityData,
  FertilityProps
} from '@/app/pages/HomePage/MenstrualCycle/partials/Fertility/models/fertility.type'
import { Activity, AlertCircle, Droplets, Info, Loader2, SkipForward, Thermometer, Weight } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const cervicalMucusOptions = [
  { value: 'dry', label: 'Dry', description: 'No visible mucus' },
  { value: 'sticky', label: 'Sticky', description: 'Thick, tacky texture' },
  { value: 'creamy', label: 'Creamy', description: 'Lotion-like consistency' },
  { value: 'watery', label: 'Watery', description: 'Thin, clear fluid' }
]

export default function Fertility({ menstrualCycleId, onNext, onSkipAll }: FertilityProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedMucus, setSelectedMucus] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FertilityData>({
    defaultValues: {
      temperature: 36.5,
      weight: 60,
      description: ''
    }
  })

  const onSubmit = async (data: FertilityData) => {
    if (!menstrualCycleId) {
      toast.error('Menstrual cycle ID not found')
      return
    }

    if (!selectedMucus) {
      toast.error('Please select cervical mucus type')
      return
    }

    try {
      setIsSubmitting(true)

      const requestData = {
        menstrual_cycle_id: menstrualCycleId,
        temperature: data.temperature,
        weight: data.weight,
        description: data.description || '',
        cervicalMucus: selectedMucus
      }

      console.log('Sending fertility data:', requestData)

      await menstrualApi.createFertility(requestData)

      if (onNext) {
        onNext()
      }
    } catch (error: any) {
      console.error('Failed to create fertility data:', error)
      toast.error(error.response?.data?.message || 'Failed to save fertility data')
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
              <Activity className='w-5 h-5 text-white' />
            </div>
            <div>
              <h2 className='text-lg font-semibold text-white'>Fertility Tracking</h2>
              <p className='text-sm text-pink-100'>Monitor your fertility indicators</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='p-6 space-y-2'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <label htmlFor='temperature' className='flex items-center text-sm font-medium text-gray-700'>
                <Thermometer className='w-4 h-4 text-pink-500' />
                <span>Temperature</span>
                <span className='text-red-500 ml-1'>*</span>
              </label>
              <div className='relative'>
                <input
                  id='temperature'
                  type='number'
                  step='0.1'
                  {...register('temperature', {
                    required: 'Temperature is required',
                    min: {
                      value: 35,
                      message: 'Min 35°C'
                    },
                    max: {
                      value: 40,
                      message: 'Max 40°C'
                    },
                    valueAsNumber: true
                  })}
                  className={`w-full px-3 py-2 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors ${
                    errors.temperature
                      ? 'border-red-300 focus:border-red-400 bg-red-50'
                      : 'border-gray-200 focus:border-pink-400 bg-gray-50 focus:bg-white'
                  }`}
                  placeholder='36.5'
                />
                <span className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm'>°C</span>
              </div>
              {errors.temperature ? (
                <p className='text-xs text-red-600 flex items-center'>
                  <Info className='w-3 h-3 mr-1' />
                  {errors.temperature.message}
                </p>
              ) : (
                <p className='text-xs text-gray-500'>Normal: 35-40°C</p>
              )}
            </div>

            <div className='space-y-2'>
              <label htmlFor='weight' className='flex items-center text-sm font-medium text-gray-700'>
                <Weight className='w-4 h-4 mr-1 text-pink-500' />
                <span>Weight</span>
                <span className='text-red-500 ml-1'>*</span>
              </label>
              <div className='relative'>
                <input
                  id='weight'
                  type='number'
                  {...register('weight', {
                    required: 'Weight is required',
                    min: {
                      value: 30,
                      message: 'Min 30kg'
                    },
                    max: {
                      value: 200,
                      message: 'Max 200kg'
                    },
                    valueAsNumber: true
                  })}
                  className={`w-full px-3 py-2 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors ${
                    errors.weight
                      ? 'border-red-300 focus:border-red-400 bg-red-50'
                      : 'border-gray-200 focus:border-pink-400 bg-gray-50 focus:bg-white'
                  }`}
                  placeholder='60'
                />
                <span className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm'>kg</span>
              </div>
              {errors.weight ? (
                <p className='text-xs text-red-600 flex items-center'>
                  <Info className='w-3 h-3 mr-1' />
                  {errors.weight.message}
                </p>
              ) : (
                <p className='text-xs text-gray-500'>Range: 30-200kg</p>
              )}
            </div>
          </div>

          {/* Cervical Mucus Selection */}
          <div className='space-y-3'>
            <label className='flex items-center text-sm font-medium text-gray-700'>
              <Droplets className='w-4 h-4 mr-1 text-pink-500' />
              <span>Cervical Mucus Type</span>
              <span className='text-red-500 ml-1'>*</span>
            </label>

            <div className='grid grid-cols-2 gap-2'>
              {cervicalMucusOptions.map((option) => {
                const isSelected = selectedMucus === option.value

                return (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() => setSelectedMucus(option.value)}
                    className={`w-full p-3 rounded-xl border-2 transition-all duration-200 hover:cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-transparent shadow-lg'
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-pink-300 text-gray-700'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-white/20' : 'bg-gray-200'
                          }`}
                        >
                          <Droplets className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <div className='text-left'>
                          <span className='font-medium text-sm'>{option.label}</span>
                          <p className={`text-xs ${isSelected ? 'text-pink-100' : 'text-gray-500'}`}>
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className='space-y-2'>
            <textarea
              id='description'
              rows={2}
              {...register('description')}
              placeholder='Additional notes about your fertility indicators (optional)...'
              className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-pink-400 bg-gray-50 focus:bg-white transition-colors resize-none'
            />
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3 '>
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
              disabled={isSubmitting || !selectedMucus}
              className='flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed'
            >
              {isSubmitting ? (
                <div className='flex items-center justify-center space-x-2'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className='flex items-center justify-center space-x-2'>
                  <span>Save Fertility Data</span>
                  <Activity className='w-4 h-4' />
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
