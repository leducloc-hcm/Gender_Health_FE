import type React from 'react'

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
import { Edit3, Eye, EyeOff, Heart, KeyRound, MapPin, Save, Shield, Upload, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import type { getProfileResult, UserProfile } from './models/Profile'

interface PasswordForm {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

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
  const [isEditing, setIsEditing] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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

  const newPassword = watch('newPassword')

  const calculatePasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '' }

    let score = 0
    if (password.length >= 8) score += 25
    if (password.match(/[a-z]/)) score += 25
    if (password.match(/[A-Z]/)) score += 25
    if (password.match(/[0-9]/)) score += 25
    if (password.match(/[^a-zA-Z0-9]/)) score += 25

    if (score <= 25) return { score, label: 'Yếu', color: 'bg-red-500' }
    if (score <= 50) return { score, label: 'Trung bình', color: 'bg-yellow-500' }
    if (score <= 75) return { score, label: 'Mạnh', color: 'bg-blue-500' }
    return { score, label: 'Rất mạnh', color: 'bg-green-500' }
  }

  const passwordStrength = calculatePasswordStrength(newPassword || '')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileApi.getProfile()
        const profile = response.result
        setUserProfile(profile)
        reset(profile)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        toast.error('Failed to load profile.')
      }
    }
    fetchProfile()
  }, [reset])

  const onSubmit = async (data: UserProfile) => {
    try {
      const formData = new FormData()
      if (data.name !== userProfile.name) formData.append('name', data.name)
      if (data.location !== userProfile.location) formData.append('location', data.location)
      if (avatarFile) formData.append('avatar', avatarFile)
      if (coverFile) formData.append('coverPhoto', coverFile)

      if (formData.entries().next().done === false) {
        await profileApi.updateProfile(formData)
        const response = await profileApi.getProfile()
        const profile = response.result
        setUserProfile(profile)
        reset(profile)
        toast.success('Profile updated successfully!')
      } else {
        toast.info('No changes to update.')
      }
      setAvatarFile(null)
      setCoverFile(null)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error('Failed to update profile. Please try again.')
    }
  }

  const handleCancel = () => {
    setAvatarFile(null)
    setCoverFile(null)
    reset(userProfile)
    setIsEditing(false)
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    console.log('file: ', file)
    if (file && file.type.startsWith('image/')) {
      setAvatarFile(file)
      toast.info('Avatar selected. Save to apply changes.')
    } else {
      toast.error('Please select a valid image file.')
    }
  }

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setCoverFile(file)
      toast.info('Cover photo selected. Save to apply changes.')
    } else {
      toast.error('Please select a valid image file.')
    }
  }

  const handlePasswordChange = async (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New passwords do not match.')
      return
    }
    try {
      await profileApi.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      })
      toast.success('Password changed successfully!')
      setIsPasswordModalOpen(false)
      resetPassword()
    } catch (error) {
      console.error('Failed to change password:', error)
      toast.error('Failed to change password. Please try again.')
    }
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
              backgroundImage: `url(${userProfile.coverPhoto || '/placeholder.svg'})`,
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
                  <span className='text-gray-700 font-medium'>Click để thay đổi ảnh bìa</span>
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
                  <AvatarImage src={userProfile.avatar || '/placeholder.svg'} alt={userProfile.name} />
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
                      <KeyRound className='w-4 h-4 mr-2' />
                      Đổi mật khẩu
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-md'>
                    <DialogHeader>
                      <DialogTitle className='flex items-center gap-2 text-gray-900'>
                        <Shield className='w-5 h-5 text-purple-600' />
                        Đổi mật khẩu
                      </DialogTitle>
                      <DialogDescription>Vui lòng nhập mật khẩu cũ và mật khẩu mới để thay đổi.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitPassword(handlePasswordChange)} className='space-y-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='oldPassword' className='text-sm font-medium text-gray-700'>
                          Mật khẩu cũ
                        </Label>
                        <div className='relative'>
                          <Input
                            id='oldPassword'
                            type={showOldPassword ? 'text' : 'password'}
                            {...registerPassword('oldPassword', { required: 'Mật khẩu cũ là bắt buộc' })}
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
                        {passwordErrors.oldPassword && (
                          <p className='text-red-500 text-xs mt-1'>{passwordErrors.oldPassword.message}</p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='newPassword' className='text-sm font-medium text-gray-700'>
                          Mật khẩu mới
                        </Label>
                        <div className='relative'>
                          <Input
                            id='newPassword'
                            type={showNewPassword ? 'text' : 'password'}
                            {...registerPassword('newPassword', {
                              required: 'Mật khẩu mới là bắt buộc',
                              minLength: { value: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' }
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
                        {newPassword && (
                          <div className='space-y-2'>
                            <div className='flex items-center justify-between text-xs'>
                              <span className='text-gray-600'>Độ mạnh mật khẩu:</span>
                              <span
                                className={`font-medium ${passwordStrength.score <= 25 ? 'text-red-600' : passwordStrength.score <= 50 ? 'text-yellow-600' : passwordStrength.score <= 75 ? 'text-blue-600' : 'text-green-600'}`}
                              >
                                {passwordStrength.label}
                              </span>
                            </div>
                            <Progress value={passwordStrength.score} className='h-2' />
                          </div>
                        )}
                        {passwordErrors.newPassword && (
                          <p className='text-red-500 text-xs mt-1'>{passwordErrors.newPassword.message}</p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='confirmPassword' className='text-sm font-medium text-gray-700'>
                          Xác nhận mật khẩu mới
                        </Label>
                        <div className='relative'>
                          <Input
                            id='confirmPassword'
                            type={showConfirmPassword ? 'text' : 'password'}
                            {...registerPassword('confirmPassword', {
                              required: 'Vui lòng xác nhận mật khẩu mới',
                              validate: (value) => value === watch('newPassword') || 'Mật khẩu xác nhận không khớp'
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
                        {passwordErrors.confirmPassword && (
                          <p className='text-red-500 text-xs mt-1'>{passwordErrors.confirmPassword.message}</p>
                        )}
                      </div>

                      <div className='flex gap-2 pt-4'>
                        <Button type='submit' className='flex-1 bg-purple-600 hover:bg-purple-700 text-white'>
                          <Save className='w-4 h-4 mr-2' />
                          Cập nhật mật khẩu
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
                          Hủy
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
                  Chỉnh sửa
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
                        @{userProfile.email}
                      </Badge>
                      <div className='flex items-center gap-1'>
                        <MapPin className='w-4 h-4 text-rose-500' />
                        <span className='text-sm'>{userProfile.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className='pt-4 border-t border-rose-100'>
                    <p className='text-gray-600 leading-relaxed'>
                      Chào mừng đến với hệ thống quản lý dịch vụ chăm sóc sức khỏe giới tính. Chúng tôi cam kết mang đến
                      dịch vụ chăm sóc tốt nhất cho bạn.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <Label htmlFor='name' className='text-sm font-medium text-gray-700'>
                        Họ và tên
                      </Label>
                      <Input
                        id='name'
                        {...register('name', { required: 'Họ và tên là bắt buộc' })}
                        className='border-rose-200 focus:border-rose-400 focus:ring-rose-400'
                      />
                      {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>}
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='location' className='text-sm font-medium text-gray-700'>
                        Địa chỉ
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
                      Lưu thông tin
                    </Button>
                    <Button
                      onClick={handleCancel}
                      size='sm'
                      variant='outline'
                      className='bg-white/90 hover:bg-white border-rose-200'
                    >
                      <X className='w-4 h-4 mr-2' />
                      Hủy
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
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
                  <Heart className='w-5 h-5 text-rose-500' />
                  Lịch đặt hẹn
                </h3>
                <Button size='sm' className='bg-rose-500 hover:bg-rose-600 text-white'>
                  Đặt lịch mới
                </Button>
              </div>

              <div className='space-y-4'>
                <div className='p-4 bg-rose-50 rounded-lg border border-rose-200'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='font-medium text-gray-900'>Tư vấn tâm lý</div>
                    <Badge className='bg-green-100 text-green-700'>Sắp tới</Badge>
                  </div>
                  <div className='text-sm text-gray-600 mb-1'>Bác sĩ: Dr. Sarah Johnson</div>
                  <div className='text-sm text-rose-600 font-medium'>28/01/2024 - 14:00</div>
                  <div className='text-xs text-gray-500 mt-2'>Phòng 205, Tầng 2</div>
                </div>

                <div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='font-medium text-gray-900'>Kiểm tra định kỳ</div>
                    <Badge variant='secondary' className='bg-gray-100 text-gray-600'>
                      Hoàn thành
                    </Badge>
                  </div>
                  <div className='text-sm text-gray-600 mb-1'>Bác sĩ: Dr. Michael Chen</div>
                  <div className='text-sm text-gray-600'>15/01/2024 - 10:30</div>
                  <div className='text-xs text-gray-500 mt-2'>Đã hoàn thành - Kết quả tốt</div>
                </div>

                <div className='p-4 bg-blue-50 rounded-lg border border-blue-200'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='font-medium text-gray-900'>Hormone Therapy</div>
                    <Badge className='bg-blue-100 text-blue-700'>Đã đặt</Badge>
                  </div>
                  <div className='text-sm text-gray-600 mb-1'>Bác sĩ: Dr. Emily Rodriguez</div>
                  <div className='text-sm text-blue-600 font-medium'>05/02/2024 - 09:00</div>
                  <div className='text-xs text-gray-500 mt-2'>Phòng 301, Tầng 3</div>
                </div>
              </div>

              <div className='grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-rose-100'>
                <div className='text-center'>
                  <div className='text-xl font-bold text-rose-600'>12</div>
                  <div className='text-xs text-gray-600'>Tổng lịch hẹn</div>
                </div>
                <div className='text-center'>
                  <div className='text-xl font-bold text-green-600'>8</div>
                  <div className='text-xs text-gray-600'>Hoàn thành</div>
                </div>
                <div className='text-center'>
                  <div className='text-xl font-bold text-blue-600'>2</div>
                  <div className='text-xs text-gray-600'>Sắp tới</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
