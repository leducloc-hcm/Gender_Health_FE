import { api } from '@/app/apis/fetcherToken'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Label } from '@/app/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group'
import { Textarea } from '@/app/components/ui/textarea'
import type { MoodData, MoodProps } from '@/app/pages/HomePage/MenstrualCycle/partials/Mood/models/mood.type'
import { Loader2, SkipForward, Smile } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

export default function Mood({ menstrualCycleId, onNext, onSkipAll }: MoodProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<MoodData>({
    defaultValues: {
      menstrual_cycle_id: menstrualCycleId || 0,
      moodType: '',
      description: ''
    }
  })

  const watchedMoodType = watch('moodType')

  const onSubmit = async (data: MoodData) => {
    if (!menstrualCycleId) {
      toast.error('Menstrual cycle ID not found')
      return
    }

    try {
      setIsSubmitting(true)

      const requestData = {
        menstrual_cycle_id: menstrualCycleId,
        moodType: data.moodType,
        description: data.description
      }

      console.log('Sending mood data:', requestData)

      const response = await api.post('/mood-tracking/create', requestData)

      console.log('Mood created:', response.data)

      toast.success('Mood data saved successfully!')

      if (onNext) {
        onNext()
      }
    } catch (error: any) {
      console.error('Failed to create mood:', error)
      toast.error(error.response?.data?.message || 'Failed to save mood data')
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
          <Smile className='w-5 h-5' />
          Mood Tracking
        </CardTitle>
        <CardDescription>Track your emotional well-being throughout your cycle.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-3'>
            <Label>How are you feeling today? *</Label>
            <RadioGroup value={watchedMoodType} onValueChange={(value) => setValue('moodType', value)}>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='Happy' id='happy' />
                <Label htmlFor='happy'>😊 Happy</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='Sad' id='sad' />
                <Label htmlFor='sad'>😢 Sad</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='Anxious' id='anxious' />
                <Label htmlFor='anxious'>😰 Anxious</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='Stressed' id='stressed' />
                <Label htmlFor='stressed'>😤 Stressed</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='Irritable' id='irritable' />
                <Label htmlFor='irritable'>😠 Irritable</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='Calm' id='calm' />
                <Label htmlFor='calm'>😌 Calm</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='Energetic' id='energetic' />
                <Label htmlFor='energetic'>⚡ Energetic</Label>
              </div>
            </RadioGroup>
            <input
              type='hidden'
              {...register('moodType', {
                required: 'Please select a mood type'
              })}
            />
            {errors.moodType && <p className='text-sm text-red-500'>{errors.moodType.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='moodDescription'>Describe your mood</Label>
            <Textarea
              id='moodDescription'
              placeholder="Tell us more about how you're feeling..."
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
                'Save Mood'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
