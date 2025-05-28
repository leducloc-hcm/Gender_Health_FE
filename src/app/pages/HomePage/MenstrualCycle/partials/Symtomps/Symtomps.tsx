import { api } from '@/app/apis/fetcherToken'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group'
import { Textarea } from '@/app/components/ui/textarea'
import type {
  SymptomData,
  SymptomsProps
} from '@/app/pages/HomePage/MenstrualCycle/partials/Symtomps/models/symtomps.type'
import { Heart, Loader2, SkipForward } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

export default function Symptoms({ menstrualCycleId, onNext, onSkipAll }: SymptomsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<SymptomData>({
    defaultValues: {
      menstrual_cycle_id: menstrualCycleId || 0,
      date: new Date().toISOString().split('T')[0],
      symptomType: '',
      description: ''
    }
  })

  const watchedSymptomType = watch('symptomType')

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
        symptomType: data.symptomType,
        description: data.description
      }
      const response = await api.post('/daily-symptoms/create', requestData)
      console.log('Symptom created:', response.data)
      toast.success('Symptom data saved successfully!')
      if (onNext) {
        onNext()
      }
    } catch (error: any) {
      console.error('Failed to create symptom:', error)
      toast.error(error.response?.data?.message || 'Failed to save symptom data')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!menstrualCycleId) {
    return (
      <Card className='w-full max-w-2xl mx-auto'>
        <CardContent className='p-6'>
          <div className='text-center text-red-500'>
            <p>Error: Menstrual cycle ID not found. Please go back and complete the previous step.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='w-full max-w-2xl mx-auto mt-4 pt-4'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Heart className='w-5 h-5' />
          Daily Symptoms
        </CardTitle>
        <CardDescription>Track your daily symptoms to better understand your cycle patterns.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='symptomDate'>Date *</Label>
            <Input
              id='symptomDate'
              type='date'
              {...register('date', {
                required: 'Date is required'
              })}
              className={errors.date ? 'border-red-500' : ''}
            />
            {errors.date && <p className='text-sm text-red-500'>{errors.date.message}</p>}
          </div>

          <div className='space-y-3'>
            <Label>Symptom Type *</Label>
            <RadioGroup value={watchedSymptomType} onValueChange={(value) => setValue('symptomType', value)}>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='Fatigue' id='fatigue' />
                <Label htmlFor='fatigue'>Fatigue</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='Cramps' id='cramps' />
                <Label htmlFor='cramps'>Cramps</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='Headache' id='headache' />
                <Label htmlFor='headache'>Headache</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='Bloating' id='bloating' />
                <Label htmlFor='bloating'>Bloating</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='Breast Tenderness' id='breast' />
                <Label htmlFor='breast'>Breast Tenderness</Label>
              </div>
            </RadioGroup>
            <input
              type='hidden'
              {...register('symptomType', {
                required: 'Please select a symptom type'
              })}
            />
            {errors.symptomType && <p className='text-sm text-red-500'>{errors.symptomType.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='symptomDescription'>Description</Label>
            <Textarea id='symptomDescription' placeholder='Describe your symptoms...' {...register('description')} />
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
                'Submit Symptoms'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
