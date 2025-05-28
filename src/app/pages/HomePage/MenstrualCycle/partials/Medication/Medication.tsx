import { api } from '@/app/apis/fetcherToken'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { Textarea } from '@/app/components/ui/textarea'
import type {
  MedicationData,
  MedicationProps
} from '@/app/pages/HomePage/MenstrualCycle/partials/Medication/models/medication.type'
import { Loader2, Pill, SkipForward } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

export default function Medication({ menstrualCycleId, onNext, onSkipAll }: MedicationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<MedicationData>({
    defaultValues: {
      menstrual_cycle_id: menstrualCycleId || 0,
      name: '',
      dosage: '',
      frequency: '',
      startDate: '',
      endDate: '',
      notes: ''
    }
  })

  const watchedFrequency = watch('frequency')

  const onSubmit = async (data: MedicationData) => {
    if (!menstrualCycleId) {
      toast.error('Menstrual cycle ID not found')
      return
    }

    try {
      setIsSubmitting(true)

      const requestData = {
        menstrual_cycle_id: menstrualCycleId,
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
        startDate: data.startDate,
        endDate: data.endDate,
        notes: data.notes
      }

      console.log('Sending medication data:', requestData)

      const response = await api.post('/medication-tracking/create', requestData)

      console.log('Medication created:', response.data)

      toast.success('Medication data saved successfully!')

      // Move to next step after successful submission
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
    <Card className='w-full max-w-2xl mx-auto mt-4 pt-4'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Pill className='w-5 h-5' />
          Medication Tracking
        </CardTitle>
        <CardDescription>Keep track of medications and supplements related to your cycle.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='medicationName'>Medication Name *</Label>
            <Input
              id='medicationName'
              placeholder='e.g., Ibuprofen, Birth Control'
              {...register('name', {
                required: 'Medication name is required',
                minLength: {
                  value: 2,
                  message: 'Medication name must be at least 2 characters'
                }
              })}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='dosage'>Dosage *</Label>
              <Input
                id='dosage'
                placeholder='e.g., 200mg'
                {...register('dosage', {
                  required: 'Dosage is required'
                })}
                className={errors.dosage ? 'border-red-500' : ''}
              />
              {errors.dosage && <p className='text-sm text-red-500'>{errors.dosage.message}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='frequency'>Frequency *</Label>
              <Select value={watchedFrequency} onValueChange={(value) => setValue('frequency', value)}>
                <SelectTrigger className={errors.frequency ? 'border-red-500' : ''}>
                  <SelectValue placeholder='Select frequency' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='once-daily'>Once Daily</SelectItem>
                  <SelectItem value='twice-daily'>Twice Daily</SelectItem>
                  <SelectItem value='three-times-daily'>Three Times Daily</SelectItem>
                  <SelectItem value='as-needed'>As Needed</SelectItem>
                  <SelectItem value='weekly'>Weekly</SelectItem>
                </SelectContent>
              </Select>
              <input
                type='hidden'
                {...register('frequency', {
                  required: 'Please select frequency'
                })}
              />
              {errors.frequency && <p className='text-sm text-red-500'>{errors.frequency.message}</p>}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='medicationStartDate'>Start Date *</Label>
              <Input
                id='medicationStartDate'
                type='date'
                {...register('startDate', {
                  required: 'Start date is required'
                })}
                className={errors.startDate ? 'border-red-500' : ''}
              />
              {errors.startDate && <p className='text-sm text-red-500'>{errors.startDate.message}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='medicationEndDate'>End Date</Label>
              <Input
                id='medicationEndDate'
                type='date'
                {...register('endDate')}
                className={errors.endDate ? 'border-red-500' : ''}
              />
              {errors.endDate && <p className='text-sm text-red-500'>{errors.endDate.message}</p>}
              <p className='text-sm text-gray-500'>Leave empty if ongoing</p>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='medicationNotes'>Notes</Label>
            <Textarea
              id='medicationNotes'
              placeholder='Additional notes about this medication...'
              {...register('notes')}
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
                'Save Medication'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
