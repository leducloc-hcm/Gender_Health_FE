import { profileApi } from '@/app/apis/profile.api'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Edit3, Heart, MapPin, Save, Upload, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import type { getProfileResult, UpdateProfileInput, UserProfile } from './models/Profile'

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
    cover_photo: '',
    date_of_birth: ''
  })

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const [coverPreview, setCoverPreview] = useState<string>('')

  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UserProfile>({
    defaultValues: userProfile
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileApi.getProfile()
        const profile = response.result
        setUserProfile(profile)
        setCoverPreview(profile.cover_photo || '')
        reset(profile)
        console.log(avatarFile)
        console.log(coverFile)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        toast.error('Failed to load profile.')
      }
    }
    fetchProfile()
  }, [reset])

  const onSubmit = async (data: UserProfile) => {
    try {
      const updatedFields: Partial<UpdateProfileInput> = {}
      if (data.name !== userProfile.name) updatedFields.name = data.name
      if (data.location !== userProfile.location) updatedFields.location = data.location
      if (data.avatar !== userProfile.avatar) updatedFields.avatar = data.avatar
      if (data.cover_photo !== userProfile.cover_photo) updatedFields.coverPhoto = data.cover_photo

      if (Object.keys(updatedFields).length > 0) {
        await profileApi.updateProfile(updatedFields)
        const response = await profileApi.getProfile()
        const profile = response.result
        setUserProfile(profile)
        setCoverPreview(profile.cover_photo || '')
        reset(profile)
        toast.success('Profile updated successfully!')
      }
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setAvatarFile(null)
    setCoverFile(null)
    setAvatarPreview('')
    setCoverPreview(userProfile.cover_photo || '')
    reset(userProfile)
    setIsEditing(false)
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          setAvatarPreview(result)
          reset({ ...userProfile, avatar: result })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCoverFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          setCoverPreview(result)
          reset({ ...userProfile, cover_photo: result })
        }
      }
      reader.readAsDataURL(file)
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
              backgroundImage: `url(${coverPreview || userProfile.cover_photo || '/placeholder.svg'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            onClick={isEditing ? () => document.getElementById('cover-upload')?.click() : undefined}
          >
            <div className='absolute inset-0 bg-gradient-to-t from-rose-900/20 to-transparent rounded-b-3xl' />
            {isEditing && (
              <div className='absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-b-3xl'>
                <div className='bg-white/90 px-4 py-2 rounded-lg flex items-center gap-2'>
                  <Upload className='w-5 h-5 text-gray-700' />
                  <span className='text-gray-700 font-medium'>Click để thay đổi ảnh bìa</span>
                </div>
              </div>
            )}
            <div className='absolute top-6 left-6'>
              <div className='flex items-center gap-2 text-white'>
                <Heart className='w-6 h-6' />
                <span className='font-semibold'>Gender Healthcare System</span>
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
                    <Upload className='w-8 h-8 text-white' />
                  </div>
                )}
              </div>
              <div className='absolute -bottom-1 -right-1 w-8 h-8 bg-green-400 border-4 border-white rounded-full'></div>
            </div>
          </div>

          <div className='absolute bottom-6 right-6'>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                size='sm'
                className='bg-white/90 hover:bg-white text-rose-700 border border-rose-200'
              >
                <Edit3 className='w-4 h-4 mr-2' />
                Chỉnh sửa
              </Button>
            ) : (
              <div className='flex gap-2'>
                <Button onClick={handleSubmit(onSubmit)} size='sm' className='bg-rose-500 hover:bg-rose-600 text-white'>
                  <Save className='w-4 h-4 mr-2' />
                  Lưu
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
            )}
          </div>
        </div>

        <div className='px-8 pt-20 pb-8'>
          <Card className='bg-white/90 backdrop-blur-sm border-rose-200 shadow-lg'>
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
                  <div className='pt-4 border-t border-rose-100'>
                    <p className='text-sm text-gray-500'>Vui lòng điền đầy đủ thông tin để cập nhật hồ sơ của bạn.</p>
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

          <Card className='mt-6 bg-white/90 backdrop-blur-sm border-rose-200 shadow-lg'>
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
