import { menstrualApi } from '@/app/apis/menstrual.api'
import { Button } from '@/app/components/ui/button'
import type { MoodData, MoodProps } from '@/app/pages/HomePage/MenstrualCycle/partials/Mood/models/mood.type'
import { AlertCircle, Heart, Info, Loader2, SkipForward, Smile } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const moodOptions = [
  { value: 'Happy', label: 'Happy', emoji: '😊', color: 'from-yellow-500 to-orange-400' },
  { value: 'Calm', label: 'Calm', emoji: '😌', color: 'from-blue-400 to-cyan-400' },
  { value: 'Energetic', label: 'Energetic', emoji: '⚡', color: 'from-green-400 to-emerald-400' },
  { value: 'Sad', label: 'Sad', emoji: '😢', color: 'from-blue-500 to-indigo-500' },
  { value: 'Anxious', label: 'Anxious', emoji: '😰', color: 'from-purple-400 to-pink-400' },
  { value: 'Irritable', label: 'Irritable', emoji: '😠', color: 'from-red-400 to-pink-500' }
]

export default function Mood({ menstrualCycleId, onNext, onSkipAll }: MoodProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedMood, setSelectedMood] = useState<string>('')

  const { register, handleSubmit } = useForm<MoodData>({
    defaultValues: {
      description: ''
    }
  })

  const onSubmit = async (data: MoodData) => {
    if (!menstrualCycleId) {
      toast.error('Menstrual cycle ID not found')
      return
    }

    if (!selectedMood) {
      toast.error('Please select your mood')
      return
    }

    try {
      setIsSubmitting(true)

      const requestData = {
        menstrual_cycle_id: menstrualCycleId,
        moodType: selectedMood,
        description: data.description || ''
      }

      await menstrualApi.createMood(requestData)

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
              <Smile className='w-5 h-5 text-white' />
            </div>
            <div>
              <h2 className='text-lg font-semibold text-white'>Mood Tracking</h2>
              <p className='text-sm text-pink-100'>How are you feeling today?</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='p-6 space-y-5'>
          <div className='space-y-3'>
            <label className='flex items-center text-sm font-medium text-gray-700'>
              <Smile className='w-4 h-4 mr-2 text-pink-500' />
              <span>Select Your Mood</span>
              <span className='text-red-500 ml-1'>*</span>
            </label>

            <div className='grid grid-cols-3 gap-3'>
              {moodOptions.map((mood) => {
                const isSelected = selectedMood === mood.value

                return (
                  <button
                    key={mood.value}
                    type='button'
                    onClick={() => setSelectedMood(mood.value)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 h-20 hover:cursor-pointer ${
                      isSelected
                        ? `bg-gradient-to-r ${mood.color} text-white border-transparent shadow-lg scale-105`
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-pink-300 text-gray-700 hover:scale-102'
                    }`}
                  >
                    <div className='flex flex-col items-center justify-center h-full space-y-1'>
                      <span className='text-2xl'>{mood.emoji}</span>
                      <span className='text-xs font-medium text-center leading-tight'>{mood.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className='space-y-2'>
            <textarea
              id='description'
              rows={4}
              {...register('description')}
              placeholder="Tell us more about how you're feeling today..."
              className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-pink-400 bg-gray-50 focus:bg-white transition-colors resize-none'
            />
          </div>

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
              disabled={isSubmitting || !selectedMood}
              className='flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed'
            >
              {isSubmitting ? (
                <div className='flex items-center justify-center space-x-2'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className='flex items-center justify-center space-x-2'>
                  <span>Save Mood</span>
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
