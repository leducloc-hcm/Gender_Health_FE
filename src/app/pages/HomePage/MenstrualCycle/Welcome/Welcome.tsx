import { useState, useEffect } from 'react'
import { Heart, Calendar, TrendingUp, ChevronRight, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'

interface WelcomeProps {
  onNext?: () => void
}

interface UserProfile {
  id: number
  customer_profile_id: number
  email: string
  name: string
  role: string
  status: string
  created_at: string
  updated_at: string
  bio: string | null
  location: string | null
  username: string
  avatar: string | null
  cover_photo: string | null
  date_of_birth: string
  website: string | null
  phone_number: string | null
  description: string | null
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

export default function Welcome({ onNext }: WelcomeProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  // Get user profile on component mount
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
      <div className='p-6 text-center border-b'>
        <div className='mx-auto mb-4 w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center'>
          <Heart className='w-8 h-8 text-pink-600' />
        </div>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Welcome, {userProfile?.name || 'User'}!</h1>
        <p className='text-lg text-gray-600'>
          Track your cycle, symptoms, and get personalized predictions for better health management.
        </p>
      </div>
      <div className='p-6 space-y-6'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='text-center p-4 bg-rose-50 rounded-lg'>
            <Calendar className='w-8 h-8 text-pink-600 mx-auto mb-2' />
            <h3 className='font-semibold'>Cycle Tracking</h3>
            <p className='text-sm text-gray-600'>Monitor your menstrual cycle patterns</p>
          </div>
          <div className='text-center p-4 bg-pink-50 rounded-lg'>
            <TrendingUp className='w-8 h-8 text-rose-600 mx-auto mb-2' />
            <h3 className='font-semibold'>Predictions</h3>
            <p className='text-sm text-gray-600'>Get accurate cycle predictions</p>
          </div>
        </div>

        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <h4 className='font-semibold text-blue-900 mb-2'>Getting Started</h4>
          <p className='text-sm text-blue-800'>
            To provide accurate predictions, we need some basic information about your menstrual cycle. This will only
            take a minute!
          </p>
        </div>

        <button
          onClick={onNext}
          className='w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-md shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-lg'
        >
          Get Started
          <ChevronRight className='w-4 h-4 ml-2' />
        </button>
      </div>
    </div>
  )
}
