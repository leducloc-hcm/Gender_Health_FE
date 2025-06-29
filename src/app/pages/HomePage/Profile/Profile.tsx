import { profileApi } from '@/app/apis/profile.api'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent } from '@/app/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Progress } from '@/app/components/ui/progress'
import { Textarea } from '@/app/components/ui/textarea'
import { clearUserProfileSignify, setUserProfileToSignify } from '@/app/hooks/sUserProfile'
import dayjs from 'dayjs'
import { Edit3, Eye, EyeOff, Heart, MapPin, MessageSquare, Save, Star, Upload, X } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import type {
  getProfileResult,
  historyConsultingData,
  PasswordForm,
  UpdateProfileInput,
  UserProfile,
  FeedbackForm
} from './models/Profile'
import { Link } from 'react-router-dom'

export default function Profile() {
  const [userProfile, setUserProfile] = useState<getProfileResult>({
    id: 0,
    email: '',
    role: '',
    status: '',
    created_at: '',
    updated_at: '',
    name: '',
    bio: '',
    location: '',
    username: '',
    avatar: '',
    coverPhoto: '',
    date_of_birth: ''
  })

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userConsultingHistory, setUserConsultingHistory] = useState<historyConsultingData[]>([])
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  console.log('userConsultingHistory: ', userConsultingHistory)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UserProfile>({
    defaultValues: userProfile
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    watch,
    reset: resetPassword
  } = useForm<PasswordForm>()

  const {
    register: registerFeedback,
    handleSubmit: handleSubmitFeedback,
    formState: { errors: feedbackErrors },
    reset: resetFeedback
  } = useForm<FeedbackForm>()

  const password = watch('password', '')

  const calculatePasswordStrength = (password: string) => {
    let score = 0
    if (password.length >= 8) score += 25
    if (/[a-z]/.test(password)) score += 25
    if (/[A-Z]/.test(password)) score += 25
    if (/[0-9]/.test(password)) score += 25
    if (/[^a-zA-Z0-9]/.test(password)) score += 25

    if (score <= 25) return { score, label: 'Weak', color: 'bg-red-500' }
    if (score <= 50) return { score, label: 'Average', color: 'bg-yellow-500' }
    if (score <= 75) return { score, label: 'Strong', color: 'bg-blue-500' }
    return { score, label: 'Very Strong', color: 'bg-green-500' }
  }

  const passwordStrength = calculatePasswordStrength(password)

  const fetchProfile = useCallback(async () => {
    try {
      const response = await profileApi.getProfile()
      const profile = response?.result
      if (profile) {
        const consultingHistoryResponse = await profileApi.getHistoryConsulating(profile.customer_profile_id as number)
        setUserConsultingHistory(consultingHistoryResponse.data)
      }

      setUserProfileToSignify(profile)
      setUserProfile(profile)
      return profile

      reset(profile)
    } catch (error) {
      toast.error('Failed to load profile.')
      console.log(error)
      clearUserProfileSignify()
    }
  }, [reset])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
      if (coverPreview) URL.revokeObjectURL(coverPreview)
    }
  }, [avatarPreview, coverPreview])

  const onSubmit = async (data: UserProfile) => {
    try {
      const updateData: Partial<UpdateProfileInput> = {}
      let hasChanges = false

      if (data.name && data.name !== userProfile.name) {
        updateData.name = data.name
        hasChanges = true
      }
      if (data.location && data.location !== userProfile.location) {
        updateData.location = data.location
        hasChanges = true
      }
      if (avatarFile) {
        updateData.avatar = avatarFile
        hasChanges = true
      }
      if (coverFile) {
        updateData.coverPhoto = coverFile
        hasChanges = true
      }

      if (hasChanges) {
        const response = await profileApi.updateProfile(updateData)
        const profile = response.result
        const fetchedProfile = await profileApi.getProfile()
        setUserProfile(fetchedProfile.result)
        reset(profile)
        toast.success('Profile updated successfully!')
      } else {
        toast.info('No changes to update.')
      }

      setAvatarFile(null)
      setCoverFile(null)
      setAvatarPreview(null)
      setCoverPreview(null)
      setIsEditing(false)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile. Please try again.'
      toast.error(errorMessage)
    }
  }

  const handleCancel = () => {
    setAvatarFile(null)
    setCoverFile(null)
    setAvatarPreview(null)
    setCoverPreview(null)
    reset(userProfile)
    setIsEditing(false)
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    } else {
      setAvatarFile(null)
      setAvatarPreview(null)
    }
  }

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setCoverFile(file)
      setCoverPreview(URL.createObjectURL(file))
    } else {
      setCoverFile(null)
      setCoverPreview(null)
      toast.error('Please select a valid image file.')
    }
  }

  const handlePasswordChange = async (data: PasswordForm) => {
    console.log('data: ', data)
    try {
      const response = await profileApi.updatePassword(data)
      resetPassword()
      setIsPasswordModalOpen(false)
      console.log(response)
      toast.success('Password changed successfully!')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change password. Please try again.'
      toast.error(errorMessage)
    }
  }

  const handleFeedbackSubmit = async (data: FeedbackForm) => {
    if (!selectedHistoryId) return

    try {
      const feedbackData = {
        historyId: selectedHistoryId,
        feedback: data.feedback,
        rating: rating,
        customerNote: data.customerNote
      }

      await profileApi.submitFeedback(feedbackData)
      toast.success('Feedback submitted successfully!')

      // Reset form and close modal
      resetFeedback()
      setRating(0)
      setHoveredRating(0)
      setIsFeedbackModalOpen(false)
      setSelectedHistoryId(null)

      // Refresh the consulting history
      await fetchProfile()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit feedback. Please try again.'
      toast.error(errorMessage)
    }
  }

  const openFeedbackModal = (historyId: number) => {
    setSelectedHistoryId(historyId)
    setIsFeedbackModalOpen(true)
    setRating(0)
    setHoveredRating(0)
    resetFeedback()
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50'>
      <div className='max-w-4xl mx-auto'>
        <div className='relative'>
          <div
            className={`h-80 w-full bg-gradient-to-r from-rose-200 via-pink-200 to-purple-200 rounded-b-3xl shadow-lg ${
              isEditing ? 'cursor-pointer group' : ''
            }`}
            style={{
              backgroundImage: `url(${coverPreview || userProfile.coverPhoto || '/placeholder.svg'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            onClick={isEditing ? () => document.getElementById('cover-upload')?.click() : undefined}
          >
            <div className='absolute inset-0 bg-gradient-to-t from-rose-900/30 to-transparent rounded-b-3xl' />
            {isEditing && (
              <div className='absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-b-3xl'>
                <div className='bg-white/90 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg'>
                  <Upload className='w-5 h-5 text-rose-600' />
                  <span className='text-gray-700 font-medium'>Click to change cover photo</span>
                </div>
              </div>
            )}
            <div className='absolute top-6 left-6'>
              <div className='flex items-center gap-2 text-white'>
                <Heart className='w-6 h-6 text-rose-100' />
                <span className='font-semibold text-white drop-shadow-sm'>Gender Healthcare System</span>
              </div>
            </div>
          </div>

          <div className='absolute -bottom-16 left-8'>
            <div className='relative'>
              <div
                className={`${isEditing ? 'cursor-pointer group' : ''}`}
                onClick={isEditing ? () => document.getElementById('avatar-upload')?.click() : undefined}
              >
                <Avatar className='w-32 h-32 border-4 border-white shadow-xl'>
                  <AvatarImage src={avatarPreview || userProfile.avatar || '/placeholder.svg'} alt={userProfile.name} />
                  <AvatarFallback className='bg-rose-200 text-rose-800 text-2xl font-bold'>
                    {userProfile.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className='absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                    <div className='bg-white/90 p-2 rounded-full'>
                      <Upload className='w-5 h-5 text-rose-600' />
                    </div>
                  </div>
                )}
              </div>
              <div className='absolute -bottom-1 -right-1 w-8 h-8 bg-green-400 border-4 border-white rounded-full shadow-sm'></div>
            </div>
          </div>

          <div className='absolute bottom-6 right-6 flex gap-2'>
            {!isEditing ? (
              <>
                <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size='sm'
                      variant='outline'
                      className='bg-white/90 hover:bg-white text-purple-700 border border-purple-200'
                    >
                      <Edit3 className='w-4 h-4 mr-2' />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-md'>
                    <DialogHeader>
                      <DialogTitle className='flex items-center gap-2 text-gray-900'>
                        <Edit3 className='w-5 h-5 text-purple-600' />
                        Change Password
                      </DialogTitle>
                      <DialogDescription>Please enter your old password and new password to change.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitPassword(handlePasswordChange)} className='space-y-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='old_password' className='text-sm font-medium text-gray-700'>
                          Old Password
                        </Label>
                        <div className='relative'>
                          <Input
                            id='old_password'
                            type={showOldPassword ? 'text' : 'password'}
                            {...registerPassword('old_password', { required: 'Old password is required' })}
                            className='border-purple-200 focus:border-purple-400 focus:ring-purple-400 pr-10'
                          />
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                            onClick={() => setShowOldPassword(!showOldPassword)}
                          >
                            {showOldPassword ? (
                              <EyeOff className='h-4 w-4 text-gray-400' />
                            ) : (
                              <Eye className='h-4 w-4 text-gray-400' />
                            )}
                          </Button>
                        </div>
                        {passwordErrors.old_password && (
                          <p className='text-red-500 text-xs mt-1'>{passwordErrors.old_password.message}</p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='password' className='text-sm font-medium text-gray-700'>
                          New Password
                        </Label>
                        <div className='relative'>
                          <Input
                            id='password'
                            type={showNewPassword ? 'text' : 'password'}
                            {...registerPassword('password', {
                              required: 'New password is required',
                              minLength: { value: 8, message: 'Password must be at least 8 characters' }
                            })}
                            className='border-purple-200 focus:border-purple-400 focus:ring-purple-400 pr-10'
                          />
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className='h-4 w-4 text-gray-400' />
                            ) : (
                              <Eye className='h-4 w-4 text-gray-400' />
                            )}
                          </Button>
                        </div>
                        {password && (
                          <div className='space-y-2'>
                            <div className='flex items-center justify-between text-xs'>
                              <span className='text-gray-600'>Password Strength:</span>
                              <span
                                className={`font-medium ${
                                  passwordStrength.score <= 25
                                    ? 'text-red-600'
                                    : passwordStrength.score <= 50
                                      ? 'text-yellow-600'
                                      : passwordStrength.score <= 75
                                        ? 'text-blue-600'
                                        : 'text-green-600'
                                }`}
                              >
                                {passwordStrength.label}
                              </span>
                            </div>
                            <Progress value={passwordStrength.score} className='h-2' />
                          </div>
                        )}
                        {passwordErrors.password && (
                          <p className='text-red-500 text-xs mt-1'>{passwordErrors.password.message}</p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='confirm_password' className='text-sm font-medium text-gray-700'>
                          Confirm New Password
                        </Label>
                        <div className='relative'>
                          <Input
                            id='confirm_password'
                            type={showConfirmPassword ? 'text' : 'password'}
                            {...registerPassword('confirm_password', {
                              required: 'Please confirm your new password',
                              validate: (value) => value === password || 'Passwords do not match'
                            })}
                            className='border-purple-200 focus:border-purple-400 focus:ring-purple-400 pr-10'
                          />
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className='h-4 w-4 text-gray-400' />
                            ) : (
                              <Eye className='h-4 w-4 text-gray-400' />
                            )}
                          </Button>
                        </div>
                        {passwordErrors.confirm_password && (
                          <p className='text-red-500 text-xs mt-1'>{passwordErrors.confirm_password.message}</p>
                        )}
                      </div>

                      <div className='flex gap-2 pt-4'>
                        <Button type='submit' className='flex-1 bg-purple-600 hover:bg-purple-700 text-white'>
                          <Save className='w-4 h-4 mr-2' />
                          Update Password
                        </Button>
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => {
                            setIsPasswordModalOpen(false)
                            resetPassword()
                          }}
                          className='border-gray-300'
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={isFeedbackModalOpen} onOpenChange={setIsFeedbackModalOpen}>
                  <DialogContent className='sm:max-w-md'>
                    <DialogHeader>
                      <DialogTitle className='flex items-center gap-2 text-gray-900'>
                        <MessageSquare className='w-5 h-5 text-purple-600' />
                        Submit Feedback
                      </DialogTitle>
                      <DialogDescription>Please share your experience with this consultation.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitFeedback(handleFeedbackSubmit)} className='space-y-4'>
                      <div className='space-y-2'>
                        <Label className='text-sm font-medium text-gray-700'>Rating</Label>
                        <div className='flex gap-1'>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type='button'
                              onMouseEnter={() => setHoveredRating(star)}
                              onMouseLeave={() => setHoveredRating(0)}
                              onClick={() => setRating(star)}
                              className='p-1 hover:scale-110 transition-transform'
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  star <= (hoveredRating || rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        {rating === 0 && <p className='text-red-500 text-xs mt-1'>Please select a rating</p>}
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='feedback' className='text-sm font-medium text-gray-700'>
                          Feedback
                        </Label>
                        <Textarea
                          id='feedback'
                          placeholder='Share your experience...'
                          {...registerFeedback('feedback', { required: 'Feedback is required' })}
                          className='border-purple-200 focus:border-purple-400 focus:ring-purple-400 min-h-[80px]'
                        />
                        {feedbackErrors.feedback && (
                          <p className='text-red-500 text-xs mt-1'>{feedbackErrors.feedback.message}</p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='customerNote' className='text-sm font-medium text-gray-700'>
                          Additional Notes
                        </Label>
                        <Textarea
                          id='customerNote'
                          placeholder='Any additional comments...'
                          {...registerFeedback('customerNote')}
                          className='border-purple-200 focus:border-purple-400 focus:ring-purple-400 min-h-[60px]'
                        />
                      </div>

                      <div className='flex gap-2 pt-4'>
                        <Button
                          type='submit'
                          className='flex-1 bg-purple-600 hover:bg-purple-700 text-white'
                          disabled={rating === 0}
                        >
                          <Save className='w-4 h-4 mr-2' />
                          Submit Feedback
                        </Button>
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => {
                            setIsFeedbackModalOpen(false)
                            resetFeedback()
                            setRating(0)
                            setHoveredRating(0)
                            setSelectedHistoryId(null)
                          }}
                          className='border-gray-300'
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={() => setIsEditing(true)}
                  size='sm'
                  className='bg-white/90 hover:bg-white text-rose-700 border border-rose-200'
                >
                  <Edit3 className='w-4 h-4 mr-2' />
                  Edit Profile
                </Button>
              </>
            ) : null}
          </div>
        </div>

        <div className='px-8 pt-20 pb-8'>
          <Card className='bg-white/90 backdrop-blur-sm border-rose-200 shadow-lg rounded-xl overflow-hidden'>
            <CardContent className='p-8'>
              {!isEditing ? (
                <div className='space-y-6'>
                  <div>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>{userProfile.name}</h1>
                    <div className='flex flex-wrap items-center gap-4 text-gray-600'>
                      <Badge variant='secondary' className='bg-rose-100 text-rose-700 hover:bg-rose-200'>
                        @{userProfile?.email}
                      </Badge>
                      <div className='flex items-center gap-1'>
                        <MapPin className='w-4 h-4 text-rose-500' />
                        <span className='text-sm'>{userProfile.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className='pt-4 border-t border-rose-100'>
                    <p className='text-gray-600 leading-relaxed'>
                      Welcome to the Gender Healthcare Management System. We are committed to providing you with the
                      best healthcare services.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <Label htmlFor='name' className='text-sm font-medium text-gray-700'>
                        Full Name
                      </Label>
                      <Input
                        id='name'
                        {...register('name', { required: 'Full name is required' })}
                        className='border-rose-200 focus:border-rose-400 focus:ring-rose-400'
                      />
                      {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>}
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='location' className='text-sm font-medium text-gray-700'>
                        Address
                      </Label>
                      <Input
                        id='location'
                        {...register('location')}
                        className='border-rose-200 focus:border-rose-400 focus:ring-rose-400'
                      />
                      {errors.location && <p className='text-red-500 text-xs mt-1'>{errors.location.message}</p>}
                    </div>
                  </div>
                  <div className='flex gap-2 pt-4'>
                    <Button type='submit' size='sm' className='bg-rose-500 hover:bg-rose-600 text-white'>
                      <Save className='w-4 h-4 mr-2' />
                      Save Information
                    </Button>
                    <Button
                      onClick={handleCancel}
                      size='sm'
                      variant='outline'
                      className='bg-white/90 hover:bg-white border-rose-200'
                    >
                      <X className='w-4 h-4 mr-2' />
                      Cancel
                    </Button>
                  </div>
                  <input
                    id='avatar-upload'
                    type='file'
                    accept='image/*'
                    onChange={handleAvatarUpload}
                    className='hidden'
                  />
                  <input
                    id='cover-upload'
                    type='file'
                    accept='image/*'
                    onChange={handleCoverUpload}
                    className='hidden'
                  />
                </form>
              )}
            </CardContent>
          </Card>

          <Card className='mt-6 bg-white/90 backdrop-blur-sm border-rose-200 shadow-lg rounded-xl overflow-hidden'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center'>
                    <Heart className='w-5 h-5 text-rose-500' />
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-gray-900'>Appointment Schedule</h3>
                    <p className='text-sm text-gray-500'>Manage your consultation appointments</p>
                  </div>
                </div>
                <Link to={'../booking-consultant'}>
                  <Button
                    size='sm'
                    className='bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg transition-all duration-200'
                  >
                    <Heart className='w-4 h-4 mr-2' />
                    Book New Appointment
                  </Button>
                </Link>
              </div>

              <div className='space-y-4'>
                {userConsultingHistory.length > 0 ? (
                  userConsultingHistory.reverse().map((history, index) => (
                    <div
                      key={index}
                      className='group p-5 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200 hover:border-rose-300 hover:shadow-md transition-all duration-200'
                    >
                      <div className='flex items-start justify-between mb-4'>
                        <div className='flex items-start gap-3'>
                          <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-rose-200'>
                            <Heart className='w-6 h-6 text-rose-500' />
                          </div>
                          <div>
                            <h4 className='font-semibold text-gray-900 text-lg'>Consultation Appointment</h4>
                            <p className='text-sm text-gray-600 mt-1'>Gender Health Consultation</p>
                          </div>
                        </div>
                        {new Date(history.scheduleAt) > new Date() ? (
                          <Badge className='bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-blue-300 px-3 py-1 font-medium'>
                            Upcoming
                          </Badge>
                        ) : (
                          <div className='flex gap-2'>
                            <Badge className='bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-green-300 px-3 py-1 font-medium'>
                              Completed
                            </Badge>
                            {!history.feedback && (
                              <Button
                                size='sm'
                                variant='outline'
                                onClick={() => openFeedbackModal(history.id)}
                                className='bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-700 border-purple-200'
                              >
                                <MessageSquare className='w-3 h-3 mr-1' />
                                Feedback
                              </Button>
                            )}
                          </div>
                        )}
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                        <div className='space-y-2'>
                          <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 bg-rose-400 rounded-full'></div>
                            <span className='text-sm font-medium text-gray-700'>Consultant:</span>
                          </div>
                          <p className='text-gray-900 font-medium ml-4'>{history.consultantProfile.name}</p>
                        </div>

                        <div className='space-y-2'>
                          <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 bg-rose-400 rounded-full'></div>
                            <span className='text-sm font-medium text-gray-700'>Schedule:</span>
                          </div>
                          <div className='ml-4'>
                            <p className='text-rose-600 font-semibold'>
                              {dayjs(history.scheduleAt).format('DD/MM/YYYY')}
                            </p>
                            <p className='text-sm text-gray-600'>
                              {dayjs(history.startedAt).format('HH:mm')} - {dayjs(history.endedAt).format('HH:mm')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-rose-200'>
                        <div className='space-y-2'>
                          <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 bg-rose-400 rounded-full'></div>
                            <span className='text-sm font-medium text-gray-700'>Platform:</span>
                          </div>
                          <p className='text-gray-600 ml-4'>{history.meetingPlatform || 'No information'}</p>
                        </div>

                        {new Date(history.scheduleAt) > new Date() && (
                          <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                              <div className='w-2 h-2 bg-rose-400 rounded-full'></div>
                              <span className='text-sm font-medium text-gray-700'>Meeting Link:</span>
                            </div>
                            <div className='ml-4'>
                              {history.meetingLink ? (
                                <a
                                  href={history.meetingLink}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='text-blue-600 hover:text-blue-800 underline text-sm font-medium hover:bg-blue-50 px-2 py-1 rounded transition-colors duration-200'
                                >
                                  Join Meeting →
                                </a>
                              ) : (
                                <span className='text-gray-500 text-sm'>No information</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='text-center py-12'>
                    <div className='w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                      <Heart className='w-8 h-8 text-rose-400' />
                    </div>
                    <h4 className='text-lg font-medium text-gray-900 mb-2'>No appointments yet</h4>
                    <p className='text-gray-500 text-sm mb-6'>
                      Book your first consultation to start your healthcare journey
                    </p>
                    <Link to={'../booking-consultant'}>
                      <Button className='bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg transition-all duration-200'>
                        <Heart className='w-4 h-4 mr-2' />
                        Book Now
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
