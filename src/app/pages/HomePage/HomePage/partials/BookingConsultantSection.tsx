'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/app/components/ui/carousel'
import { Calendar, Clock, Globe, MapPin, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Consultant, ConsultantsData, Schedule } from '../models/BookingConsultantSectionModel'
import { customerApi } from '@/app/apis/customer.api'

const BookingConsultantSection = () => {
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null)
  console.log('selectedConsultant: ', selectedConsultant)
  const [consultantsData, setConsultantsData] = useState<ConsultantsData>()

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const response = await customerApi.getConsultantWorkSchedule()
        console.log('response: ', response)
        setConsultantsData(response)
      } catch (error) {
        console.error('Failed to fetch consultants:', error)
      }
    }
    fetchConsultants()
  }, [])

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTotalAvailableSlots = (schedulesByDate: Record<string, Schedule[]>): number => {
    console.log('1212', Object.values(schedulesByDate).flat().length)
    return Object.values(schedulesByDate).flat().length
  }

  const getNextAvailableDate = (schedulesByDate: Record<string, Schedule[]>): string => {
    const dates = Object.keys(schedulesByDate).sort()
    return dates[0] ? formatDate(dates[0]) : 'No upcoming dates'
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 py-12 px-4'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>Book Your Consultation</h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Choose from our expert consultants and find the perfect time slot for your needs
          </p>
        </div>

        {/* Consultants Carousel */}
        <div className='mb-8'>
          <Carousel className='w-full max-w-5xl mx-auto'>
            <CarouselContent className='-ml-2 md:-ml-4'>
              {consultantsData?.data.map((consultant) => (
                <CarouselItem key={consultant.consultantProfile.id} className='pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3'>
                  <Card className='h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'>
                    <CardHeader className='text-center pb-4'>
                      <div className='flex justify-center mb-4'>
                        <Avatar className='w-20 h-20 border-4 border-rose-200'>
                          <AvatarImage
                            src={consultant.consultantProfile.avatar || `/placeholder.svg?height=80&width=80`}
                            alt={consultant.consultantProfile.name}
                          />
                          <AvatarFallback className='bg-gradient-to-br from-rose-400 to-pink-400 text-white text-xl font-semibold'>
                            {consultant.consultantProfile.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <CardTitle className='text-xl font-bold text-gray-900'>
                        {consultant.consultantProfile.name}
                      </CardTitle>
                      <CardDescription className='text-gray-600'>
                        @{consultant.consultantProfile.username}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className='space-y-4'>
                      {/* Contact Info */}
                      <div className='space-y-2'>
                        {consultant.consultantProfile.phoneNumber && (
                          <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <Phone className='w-4 h-4 text-rose-500' />
                            <span>{consultant.consultantProfile.phoneNumber}</span>
                          </div>
                        )}
                        {consultant.consultantProfile.location && (
                          <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <MapPin className='w-4 h-4 text-rose-500' />
                            <span>{consultant.consultantProfile.location}</span>
                          </div>
                        )}
                        {consultant.consultantProfile.website && (
                          <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <Globe className='w-4 h-4 text-rose-500' />
                            <span className='truncate'>{consultant.consultantProfile.website}</span>
                          </div>
                        )}
                      </div>

                      {/* Availability Stats */}
                      <div className='bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 space-y-3'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium text-gray-700'>Available Slots</span>
                          <Badge variant='secondary' className='bg-rose-100 text-rose-700 hover:bg-rose-200'>
                            {getTotalAvailableSlots(consultant.schedulesByDate)}
                          </Badge>
                        </div>
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                          <Calendar className='w-4 h-4 text-rose-500' />
                          <span>Next: {getNextAvailableDate(consultant.schedulesByDate)}</span>
                        </div>
                      </div>

                      {/* Recent Schedules Preview */}
                      <div className='space-y-2'>
                        <h4 className='text-sm font-semibold text-gray-700 mb-2'>Upcoming Sessions</h4>
                        {Object.entries(consultant.schedulesByDate)
                          .slice(0, 2)
                          .map(([date, schedules]: [string, Schedule[]]) => (
                            <div key={date} className='space-y-1'>
                              {schedules.slice(0, 1).map((schedule) => (
                                <div key={schedule.id} className='bg-white rounded-md p-3 border border-rose-100'>
                                  <div className='flex items-center justify-between mb-1'>
                                    <span className='font-medium text-sm text-gray-900'>{schedule.title}</span>
                                    <Badge
                                      variant={schedule.status === 'AVAILABLE' ? 'default' : 'secondary'}
                                      className='text-xs bg-green-100 text-green-700 hover:bg-green-200'
                                    >
                                      {schedule.status}
                                    </Badge>
                                  </div>
                                  <div className='flex items-center gap-4 text-xs text-gray-500'>
                                    <div className='flex items-center gap-1'>
                                      <Calendar className='w-3 h-3' />
                                      <span>{formatDate(schedule.date)}</span>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                      <Clock className='w-3 h-3' />
                                      <span>
                                        {schedule.startTime} - {schedule.endTime}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                      </div>

                      {/* Action Button */}
                      <Button
                        className='w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium'
                        onClick={() => setSelectedConsultant(consultant)}
                      >
                        View All Schedules
                      </Button>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='hidden md:flex' />
            <CarouselNext className='hidden md:flex' />
          </Carousel>
        </div>

        {/* Stats Section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto'>
          <Card className='bg-white/60 backdrop-blur-sm border-0 shadow-lg text-center'>
            <CardContent className='pt-6'>
              <div className='text-3xl font-bold text-rose-600 mb-2'>{consultantsData?.data.length}</div>
              <div className='text-gray-600 font-medium'>Expert Consultants</div>
            </CardContent>
          </Card>

          <Card className='bg-white/60 backdrop-blur-sm border-0 shadow-lg text-center'>
            <CardContent className='pt-6'>
              <div className='text-3xl font-bold text-rose-600 mb-2'>
                {consultantsData?.data.reduce(
                  (total, consultant) => total + getTotalAvailableSlots(consultant.schedulesByDate),
                  0
                )}
              </div>
              <div className='text-gray-600 font-medium'>Available Slots</div>
            </CardContent>
          </Card>

          <Card className='bg-white/60 backdrop-blur-sm border-0 shadow-lg text-center'>
            <CardContent className='pt-6'>
              <div className='text-3xl font-bold text-rose-600 mb-2'>24/7</div>
              <div className='text-gray-600 font-medium'>Support Available</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BookingConsultantSection
