import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { useEffect, useMemo, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Button } from '@/app/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'

import { Badge } from '@/app/components/ui/badge'

import { customerApi } from '@/app/apis/customer.api'
import { sUserProfile } from '@/app/hooks/sUserProfile'
import { debounce } from 'lodash'
import { Activity, Award, Clock, Globe, Heart, MapPin, Phone, Search, Star, Stethoscope, Users } from 'lucide-react'
import { toast } from 'react-toastify'
import type { Consultant, ConsultantsData, Schedule } from '../models/BookingConsultantSectionModel'

// const DEFAULT_AVATAR = '/assets/placeholder.svg'

const BookingConsultant = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  console.log('selectedSchedule: ', selectedSchedule)
  const [consultantsData, setConsultantsData] = useState<ConsultantsData | null>(null)
  const userProfille = sUserProfile.use()
  const [isLoading, setIsLoading] = useState(false)
  console.log('isLoading: ', isLoading)
  const [error, setError] = useState<string | null>(null)
  console.log('error: ', error)
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')

  const fetchConsultants = async () => {
    setIsLoading(true)
    try {
      const response = await customerApi.getConsultantWorkSchedule()
      console.log('response: ', response)
      setConsultantsData(response)
    } catch (error) {
      console.error('Failed to fetch consultants:', error)
      setError('Failed to load consultants. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchConsultants()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toString() !== 'Invalid Date'
      ? date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'Invalid Date'
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const debouncedSetSearchTerm = debounce((value: string) => {
    setSearchTerm(value)
  }, 300)

  const filteredConsultants = useMemo(() => {
    return (
      consultantsData?.data?.filter((consultant) => {
        const matchesSearch =
          consultant.consultantProfile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (consultant.consultantProfile.description ?? '').toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
      }) ?? []
    )
  }, [searchTerm, consultantsData])

  const handleBooking = (consultant: Consultant, schedule: Schedule) => {
    setSelectedConsultant(consultant)
    setSelectedSchedule(schedule)
  }

  const confirmBooking = async () => {
    if (!selectedConsultant || !selectedSchedule) return
    try {
      await customerApi.bookSchedule(selectedSchedule.id, userProfille.id)
      fetchConsultants() // Refresh consultants data after booking
      toast.success('Schedule booked successfully!')
      setSelectedConsultant(null)
      setSelectedSchedule(null)
    } catch (error) {
      console.error('Failed to book schedule:', error)
      toast.error('Failed to book schedule. Please try again.')
    }
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Header */}
      <div className='bg-gradient-to-r from-rose-500 to-pink-500 text-white py-16'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='text-center'>
            <div className='flex justify-center mb-4'>
              <div className='bg-white/20 p-4 rounded-full'>
                <Stethoscope className='w-12 h-12' />
              </div>
            </div>
            <h1 className='text-5xl font-bold mb-4'>Đặt lịch tư vấn sức khỏe</h1>
            <p className='text-xl text-rose-100 max-w-3xl mx-auto'>
              Kết nối với các bác sĩ chuyên khoa hàng đầu. Tư vấn trực tuyến hoặc khám tại nhà, an toàn và tiện lợi.
            </p>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Search and Filter Section */}
        <div className='mb-8 space-y-4'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <Input
                placeholder='Tìm kiếm bác sĩ theo tên hoặc chuyên khoa...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 h-12'
              />
            </div>
            {/* <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className='w-full md:w-64 h-12'>
                <Filter className='w-4 h-4 mr-2' />
                <SelectValue placeholder='Lọc theo chuyên khoa' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tất cả chuyên khoa</SelectItem>
                {getAllSpecialties().map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
          </div>
        </div>

        {/* Results Summary */}
        <div className='mb-6'>
          <p className='text-gray-600'>
            Hiển thị {filteredConsultants.length} bác sĩ
            {searchTerm && ` cho "${searchTerm}"`}
            {selectedSpecialty !== 'all' && ` chuyên khoa ${selectedSpecialty}`}
          </p>
        </div>

        {/* Consultants Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {filteredConsultants.map((consultant) => (
            <Card
              key={consultant.consultantProfile.id}
              className='bg-gradient-to-br from-pink-50 to-rose-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300'
            >
              <CardHeader className='pb-4'>
                <div className='flex items-start gap-4'>
                  <Avatar className='w-16 h-16 border-4 border-rose-200'>
                    <AvatarImage
                      src={consultant.consultantProfile.avatar || `/placeholder.svg?height=64&width=64`}
                      alt={consultant.consultantProfile.name}
                    />
                    <AvatarFallback className='bg-gradient-to-br from-rose-400 to-pink-400 text-white text-lg font-semibold'>
                      {consultant.consultantProfile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <CardTitle className='text-xl text-gray-900'>{consultant.consultantProfile.name}</CardTitle>
                      <Badge className='bg-green-100 text-green-700 hover:bg-green-200'>
                        <Star className='w-3 h-3 mr-1 fill-current' />
                        {consultant.consultantProfile.rating}
                      </Badge>
                    </div>
                    <CardDescription className='text-gray-600 mb-2'>
                      {consultant.consultantProfile.degree} • {consultant.consultantProfile.experience}
                    </CardDescription>
                    <div className='flex items-center gap-4 text-sm text-gray-500'>
                      <div className='flex items-center gap-1'>
                        <MapPin className='w-4 h-4' />
                        <span>{consultant.consultantProfile.location}</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Users className='w-4 h-4' />
                        <span>{consultant.consultantProfile.totalReviews} đánh giá</span>
                      </div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='text-2xl font-bold text-rose-600'>
                      {consultant.consultantProfile.consultationFee}
                    </div>
                    <div className='text-sm text-gray-500'>phí tư vấn</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className='space-y-4'>
                {/* Bio */}
                <p className='text-gray-700 text-sm leading-relaxed'>{consultant.consultantProfile.bio}</p>

                {/* Hospital */}
                <div className='flex items-center gap-2 text-sm text-gray-600 bg-white/50 p-2 rounded-lg'>
                  <Heart className='w-4 h-4 text-rose-500' />
                  <span className='font-medium'>Công tác tại:</span>
                  <span>{consultant.consultantProfile.hospital}</span>
                </div>

                {/* Specialties */}
                <div>
                  <h4 className='text-sm font-semibold text-gray-700 mb-2'>Chuyên khoa</h4>
                  <div className='flex flex-wrap gap-2'>
                    {consultant.consultantProfile.specialties?.map((specialty) => (
                      <Badge
                        key={specialty}
                        variant='secondary'
                        className='bg-rose-100 text-rose-700 hover:bg-rose-200'
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div className='flex items-center gap-2 text-gray-600'>
                    <Phone className='w-4 h-4 text-rose-500' />
                    <span>{consultant.consultantProfile.phoneNumber}</span>
                  </div>
                  <div className='flex items-center gap-2 text-gray-600'>
                    <Globe className='w-4 h-4 text-rose-500' />
                    <span className='truncate'>{consultant.consultantProfile.website}</span>
                  </div>
                  <div className='flex items-center gap-2 text-gray-600'>
                    <Clock className='w-4 h-4 text-rose-500' />
                    <span>Phản hồi: {consultant.consultantProfile.responseTime}</span>
                  </div>
                  <div className='flex items-center gap-2 text-gray-600'>
                    <Activity className='w-4 h-4 text-rose-500' />
                    <span>Ngôn ngữ: {consultant.consultantProfile.languages?.join(', ')}</span>
                  </div>
                </div>

                {/* Available Sessions */}
                <div>
                  <h4 className='text-sm font-semibold text-gray-700 mb-3'>Lịch tư vấn có sẵn</h4>
                  <div className='space-y-2 max-h-64 overflow-y-auto'>
                    {Object.entries(consultant.schedulesByDate).map(([date, schedules]: [string, any[]]) => (
                      <div key={date}>
                        <div className='text-xs font-medium text-gray-500 mb-1'>{formatDate(date)}</div>
                        {schedules.map((schedule) => (
                          <div key={schedule.id} className='bg-white rounded-lg p-3 border border-rose-100 mb-2'>
                            <div className='flex items-center justify-between mb-2'>
                              <h5 className='font-medium text-gray-900'>{schedule.title}</h5>
                              <Badge className='bg-green-100 text-green-700 hover:bg-green-200'>
                                {formatPrice(schedule.price)}
                              </Badge>
                            </div>
                            <p className='text-sm text-gray-600 mb-2'>{schedule.description}</p>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-4 text-xs text-gray-500'>
                                <div className='flex items-center gap-1'>
                                  <Clock className='w-3 h-3' />
                                  <span>
                                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                  </span>
                                </div>
                                <div className='flex items-center gap-1'>
                                  <Award className='w-3 h-3' />
                                  <span>{schedule.duration} phút</span>
                                </div>
                                <Badge variant='outline' className='text-xs'>
                                  {schedule.consultationType}
                                </Badge>
                              </div>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size='sm'
                                    className='bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'
                                    onClick={() => handleBooking(consultant, schedule)}
                                  >
                                    Đặt lịch
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className='max-w-md'>
                                  <DialogHeader>
                                    <DialogTitle>Xác nhận đặt lịch tư vấn</DialogTitle>
                                    <DialogDescription>
                                      Bạn đang đặt lịch tư vấn với {consultant.consultantProfile.name}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className='space-y-4'>
                                    <div className='bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-lg'>
                                      <h4 className='font-semibold text-gray-900 mb-2'>{schedule?.title}</h4>
                                      <div className='space-y-1 text-sm text-gray-600'>
                                        <div>Ngày: {schedule && formatDate(schedule.date)}</div>
                                        <div>
                                          Giờ:{' '}
                                          {schedule &&
                                            `${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}`}
                                        </div>
                                        <div>Thời gian: {schedule?.duration} phút</div>
                                        <div>Hình thức: {schedule?.consultationType}</div>
                                        <div className='font-semibold text-rose-600'>
                                          Phí tư vấn: {schedule && formatPrice(schedule.price)}
                                        </div>
                                      </div>
                                    </div>
                                    <div className='flex gap-2'>
                                      <Button className='flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'>
                                        Xác nhận đặt lịch
                                      </Button>
                                      <DialogTrigger asChild>
                                        <Button variant='outline' className='flex-1'>
                                          Hủy
                                        </Button>
                                      </DialogTrigger>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* View Profile Button */}
                <Button variant='outline' className='w-full border-rose-200 text-rose-600 hover:bg-rose-50'>
                  Xem hồ sơ chi tiết
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredConsultants.length === 0 && (
          <div className='text-center py-12'>
            <div className='text-gray-400 mb-4'>
              <Stethoscope className='w-16 h-16 mx-auto' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>Không tìm thấy bác sĩ phù hợp</h3>
            <p className='text-gray-600'>Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc chuyên khoa.</p>
            <Button
              onClick={() => {
                setSearchTerm('')
                setSelectedSpecialty('all')
              }}
              className='mt-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingConsultant
