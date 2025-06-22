import { profileApi } from '@/app/apis/profile.api'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent } from '@/app/components/ui/card'
import type { getProfileResult } from '@/app/pages/Customer/Profile/models/Profile'
import type { WelcomeProps } from '@/app/pages/HomePage/MenstrualCycle/models/menstrual.type'
import { Calendar, ChevronRight, Heart, Loader2, LogIn, TrendingUp, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Welcome({ onNext }: WelcomeProps) {
  const [userProfile, setUserProfile] = useState<getProfileResult | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        setIsLoadingProfile(true)

        const accessToken = localStorage.getItem('access_token')
        if (!accessToken) {
          setShowLoginModal(true)
          setIsLoadingProfile(false)
          return
        }
        const response = await profileApi.getProfile()
        setUserProfile(response.result)
      } catch (error: any) {
        console.error('Failed to fetch user profile:', error)
        if (error.response?.status === 401 || error.response?.status === 403) {
          setShowLoginModal(true)
        } else {
          toast.error(error.response?.data?.message || 'Failed to load user profile')
        }
      } finally {
        setIsLoadingProfile(false)
      }
    }
    getUserProfile()
  }, [])

  const handleLogin = () => {
    navigate('/auth/login')
  }

  const handleCloseModal = () => {
    setShowLoginModal(false)
    navigate('/')
  }

  if (isLoadingProfile) {
    return (
      <div className='w-full max-w-2xl mx-auto'>
        <Card className='shadow-xl border-0 bg-white/90 backdrop-blur-sm'>
          <CardContent className='p-8'>
            <div className='flex flex-col items-center justify-center space-y-4'>
              <div className='w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center'>
                <Loader2 className='w-8 h-8 animate-spin text-white' />
              </div>
              <div className='text-center'>
                <h3 className='text-lg font-semibold text-gray-800'>Loading your profile...</h3>
                <p className='text-gray-600 mt-1'>Please wait a moment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showLoginModal) {
    return (
      <>
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <Card className='w-full max-w-md mx-auto shadow-2xl border-0 bg-white relative'>
            <button
              onClick={handleCloseModal}
              className='absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors'
            >
              <X className='w-4 h-4 text-gray-600' />
            </button>

            <CardContent className='p-8 text-center'>
              <div className='w-20 h-20 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                <LogIn className='w-10 h-10 text-pink-600' />
              </div>

              <h2 className='text-2xl font-bold text-gray-900 mb-3'>Login Required</h2>

              <p className='text-gray-600 mb-6 leading-relaxed'>
                To access your menstrual cycle tracking and get personalized health insights, please log in to your
                account.
              </p>

              <div className='space-y-3'>
                <Button
                  onClick={handleLogin}
                  className='w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200'
                >
                  <LogIn className='w-4 h-4 mr-2' />
                  Login to Continue
                </Button>

                <Button
                  variant='outline'
                  onClick={handleCloseModal}
                  className='w-full py-3 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg'
                >
                  Maybe Later
                </Button>
              </div>

              <p className='text-sm text-gray-500 mt-4'>
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/auth/register')}
                  className='text-pink-600 hover:text-pink-700 font-medium hover:underline'
                >
                  Sign up here
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </>
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
          className='w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-md shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-lg hover:cursor-pointer'
        >
          Get Started
          <ChevronRight className='w-4 h-4 ml-2' />
        </button>
      </div>
    </div>
  )
}
