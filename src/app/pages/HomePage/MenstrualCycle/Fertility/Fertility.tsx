import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { Textarea } from '@/app/components/ui/textarea'
import { TrendingUp, Loader2, SkipForward } from 'lucide-react'

interface FertilityProps {
  menstrualCycleId: number | null
  onNext?: () => void
  onSkipAll?: () => void
}

interface FertilityData {
  menstrual_cycle_id: number
  temperature: number
  weight: number
  description: string
  cervicalMucus: string
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

export default function Fertility({ menstrualCycleId, onNext, onSkipAll }: FertilityProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<FertilityData>({
    defaultValues: {
      menstrual_cycle_id: menstrualCycleId || 0,
      temperature: 36.5,
      weight: 60,
      description: '',
      cervicalMucus: ''
    }
  })

  const watchedCervicalMucus = watch('cervicalMucus')

  const onSubmit = async (data: FertilityData) => {
    if (!menstrualCycleId) {
      toast.error('Menstrual cycle ID not found')
      return
    }

    try {
      setIsSubmitting(true)

      const requestData = {
        menstrual_cycle_id: menstrualCycleId,
        temperature: data.temperature,
        weight: data.weight,
        description: data.description,
        cervicalMucus: data.cervicalMucus
      }

      console.log('Sending fertility data:', requestData)

      const response = await api.post('/fertility-tracking/create', requestData)

      console.log('Fertility data created:', response.data)

      toast.success('Fertility data saved successfully!')

      // Move to next step after successful submission
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
      <Card className='w-full max-w-2xl mx-auto'>
        <CardContent className='p-6'>
          <div className='text-center text-red-500'>
            <p>Error: Menstrual cycle ID not found. Please go back and complete the previous steps.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <TrendingUp className='w-5 h-5' />
          Fertility Tracking
        </CardTitle>
        <CardDescription>Monitor your fertility indicators for better cycle understanding.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='temperature'>Body Temperature (°C) *</Label>
              <Input
                id='temperature'
                type='number'
                step='0.1'
                {...register('temperature', {
                  required: 'Temperature is required',
                  min: {
                    value: 35,
                    message: 'Temperature must be at least 35°C'
                  },
                  max: {
                    value: 40,
                    message: 'Temperature must not exceed 40°C'
                  },
                  valueAsNumber: true
                })}
                className={errors.temperature ? 'border-red-500' : ''}
              />
              {errors.temperature && <p className='text-sm text-red-500'>{errors.temperature.message}</p>}
              <p className='text-sm text-gray-500'>Normal range: 35-40°C</p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='weight'>Weight (kg) *</Label>
              <Input
                id='weight'
                type='number'
                {...register('weight', {
                  required: 'Weight is required',
                  min: {
                    value: 30,
                    message: 'Weight must be at least 30kg'
                  },
                  max: {
                    value: 200,
                    message: 'Weight must not exceed 200kg'
                  },
                  valueAsNumber: true
                })}
                className={errors.weight ? 'border-red-500' : ''}
              />
              {errors.weight && <p className='text-sm text-red-500'>{errors.weight.message}</p>}
              <p className='text-sm text-gray-500'>Range: 30-200kg</p>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='cervicalMucus'>Cervical Mucus *</Label>
            <Select value={watchedCervicalMucus} onValueChange={(value) => setValue('cervicalMucus', value)}>
              <SelectTrigger className={errors.cervicalMucus ? 'border-red-500' : ''}>
                <SelectValue placeholder='Select cervical mucus type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='dry'>Dry</SelectItem>
                <SelectItem value='sticky'>Sticky</SelectItem>
                <SelectItem value='creamy'>Creamy</SelectItem>
                <SelectItem value='watery'>Watery</SelectItem>
                <SelectItem value='egg-white'>Egg White</SelectItem>
              </SelectContent>
            </Select>
            <input
              type='hidden'
              {...register('cervicalMucus', {
                required: 'Please select cervical mucus type'
              })}
            />
            {errors.cervicalMucus && <p className='text-sm text-red-500'>{errors.cervicalMucus.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='fertilityDescription'>Notes</Label>
            <Textarea
              id='fertilityDescription'
              placeholder='Additional notes about your fertility indicators...'
              {...register('description')}
            />
          </div>

          <div className='flex gap-3 pt-4'>
            <Button type='button' variant='outline' onClick={onSkipAll} className='flex-1' disabled={isSubmitting}>
              <SkipForward className='w-4 h-4 mr-2' />
              Skip All
            </Button>
            <Button
              type='submit'
              className='flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Saving...
                </>
              ) : (
                'Save Fertility Data'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
