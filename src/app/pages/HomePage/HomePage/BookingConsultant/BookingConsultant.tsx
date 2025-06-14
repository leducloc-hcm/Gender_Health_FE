import { useState, useMemo, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/app/components/ui/dialog'
import { Clock, MapPin, Phone, Globe, Search } from 'lucide-react'
import { debounce } from 'lodash'
import type { Consultant, ConsultantsData, Schedule } from '../models/BookingConsultantSectionModel'
import { customerApi } from '@/app/apis/customer.api'
import { sUserProfile } from '@/app/hooks/sUserProfile'
import { toast } from 'react-toastify'

const DEFAULT_AVATAR = '/assets/placeholder.svg'

const BookingConsultant = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  console.log('selectedSchedule: ', selectedSchedule)
  const [consultantsData, setConsultantsData] = useState<ConsultantsData | null>(null)
  const userProfille = sUserProfile.use()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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
      const response = await customerApi.getConsultantWorkSchedule() // Fetch latest data
      setConsultantsData(response)
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
            <div className='bg-white/20 p-4 rounded-full inline-block mb-4'>
              <Clock className='w-12 h-12' />
            </div>
            <h1 className='text-5xl font-bold mb-4'>Book a Consultation</h1>
            <p className='text-xl text-rose-100 max-w-3xl mx-auto'>
              Connect with top experts. Convenient and secure consultations.
            </p>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Search Section */}
        <div className='mb-8'>
          <div className='flex-1 relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
            <Input
              placeholder='Search by name or description...'
              onChange={(e) => debouncedSetSearchTerm(e.target.value)}
              className='pl-10 h-12'
              aria-label='Search for experts'
            />
          </div>
        </div>

        {/* Results Summary */}
        <div className='mb-6'>
          <p className='text-gray-600'>
            Showing {filteredConsultants.length} experts
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className='animate-pulse'>
                  <CardHeader>
                    <div className='flex items-start gap-4'>
                      <div className='w-16 h-16 bg-gray-200 rounded-full' />
                      <div className='flex-1 space-y-2'>
                        <div className='h-6 bg-gray-200 rounded w-3/4' />
                        <div className='h-4 bg-gray-200 rounded w-1/2' />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className='h-4 bg-gray-200 rounded w-full mb-2' />
                    <div className='h-4 bg-gray-200 rounded w-5/6' />
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

        {/* Error State */}
        {error && <p className='text-red-500 text-center'>{error}</p>}

        {/* Consultants Grid */}
        {!isLoading && !error && (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {filteredConsultants.map((consultant) => (
              <Card
                key={consultant.consultantProfile.id}
                className='bg-gradient-to-br from-pink-50 to-rose-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300'
              >
                <CardHeader className='pb-4'>
                  <div className='flex items-start gap-4'>
                    <Avatar className='w-16 h-16 border-4 border-rose-200'>
                      <AvatarImage
                        src={consultant.consultantProfile.avatar || DEFAULT_AVATAR}
                        alt={`Profile picture of ${consultant.consultantProfile.name}`}
                      />
                      <AvatarFallback className='bg-gradient-to-br from-rose-400 to-pink-400 text-white text-lg font-semibold'>
                        {consultant.consultantProfile.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                      <CardTitle className='text-xl text-gray-900'>{consultant.consultantProfile.name}</CardTitle>
                      <div className='flex items-center gap-4 text-sm text-gray-500 mt-2'>
                        {consultant.consultantProfile.location && (
                          <div className='flex items-center gap-1'>
                            <MapPin className='w-4 h-4' />
                            <span>{consultant.consultantProfile.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className='space-y-4'>
                  {/* Bio */}
                  {consultant.consultantProfile.bio && (
                    <p className='text-gray-700 text-sm leading-relaxed'>{consultant.consultantProfile.bio}</p>
                  )}

                  {/* Contact Info */}
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div className='flex items-center gap-2 text-gray-600'>
                      <Phone className='w-4 h-4 text-rose-500' />
                      <span>{consultant.consultantProfile.phoneNumber}</span>
                    </div>
                    {consultant.consultantProfile.website && (
                      <div className='flex items-center gap-2 text-gray-600'>
                        <Globe className='w-4 h-4 text-rose-500' />
                        <span className='truncate'>{consultant.consultantProfile.website}</span>
                      </div>
                    )}
                  </div>

                  {/* Available Sessions */}
                  <div>
                    <h4 className='text-sm font-semibold text-gray-700 mb-3'>Available Consultation Slots</h4>
                    <div className='space-y-2 max-h-64 overflow-y-auto'>
                      {Object.entries(consultant.schedulesByDate).map(([date, schedules]: [string, Schedule[]]) => (
                        <div key={date}>
                          <div className='text-xs font-medium text-gray-500 mb-1'>{formatDate(date)}</div>
                          {schedules.map((schedule) => (
                            <div key={schedule.id} className='bg-white rounded-lg p-3 border border-rose-100 mb-2'>
                              <div className='flex items-center justify-between mb-2'>
                                <h5 className='font-medium text-gray-900'>{schedule.title}</h5>
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
                                </div>
                                <Dialog
                                  onOpenChange={(open) => {
                                    if (!open) {
                                      setSelectedConsultant(null)
                                      setSelectedSchedule(null)
                                    }
                                  }}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      size='sm'
                                      className='bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'
                                      onClick={() => handleBooking(consultant, schedule)}
                                      aria-label={`Book a consultation with ${consultant.consultantProfile.name}`}
                                    >
                                      Book Now
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className='max-w-md'>
                                    <DialogHeader>
                                      <DialogTitle>Confirm Consultation Booking</DialogTitle>
                                      <DialogDescription>
                                        You are booking a consultation with {consultant.consultantProfile.name}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className='space-y-4'>
                                      <div className='bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-lg'>
                                        <h4 className='font-semibold text-gray-900 mb-2'>{schedule.title}</h4>
                                        <div className='space-y-1 text-sm text-gray-600'>
                                          <div>Date: {formatDate(schedule.date)}</div>
                                          <div>
                                            Time:{' '}
                                            {`${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}`}
                                          </div>
                                        </div>
                                      </div>
                                      <div className='flex gap-2'>
                                        <Button
                                          className='flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'
                                          onClick={confirmBooking}
                                        >
                                          Confirm Booking
                                        </Button>
                                        <DialogClose asChild>
                                          <Button variant='outline' className='flex-1'>
                                            Cancel
                                          </Button>
                                        </DialogClose>
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
                    View Detailed Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && filteredConsultants.length === 0 && (
          <div className='text-center py-12'>
            <div className='text-gray-400 mb-4'>
              <Clock className='w-16 h-16 mx-auto' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>No matching experts found</h3>
            <p className='text-gray-600'>Try adjusting your search keywords.</p>
            <Button
              onClick={() => setSearchTerm('')}
              className='mt-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingConsultant
