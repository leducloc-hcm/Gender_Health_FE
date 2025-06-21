import { customerApi } from '@/app/apis/customer.api'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/app/components/ui/carousel'
import { Award, Briefcase, Building2, Clock, GraduationCap, Languages, MapPin, Phone, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Consultant, ConsultantProfile } from '../models/BookingConsultantSectionModel'

const BookingConsultantSection = () => {
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null)
  console.log('selectedConsultant: ', selectedConsultant)
  const [consultantsData, setConsultantsData] = useState<ConsultantProfile[]>()

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const response = await customerApi.getAllConsultant()
        console.log('response: ', response)
        setConsultantsData(response.result)
      } catch (error) {
        console.error('Failed to fetch consultants:', error)
      }
    }
    fetchConsultants()
  }, [])

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
        {}
        <div className='mb-8'>
          <Carousel className='w-full max-w-6xl mx-auto'>
            <CarouselContent className='-ml-2 md:-ml-4'>
              {consultantsData?.map((consultant) => (
                <CarouselItem
                  key={consultant.consultant_profile_id}
                  className='pl-2 md:pl-4 md:basis-1/2 lg:basis-1/2 xl:basis-1/3'
                >
                  <Card className='h-full bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300'>
                    <CardHeader className='text-center pb-4'>
                      <div className='flex justify-center mb-4 relative'>
                        <Avatar className='w-24 h-24 border-3 border-rose-200 shadow-lg'>
                          <AvatarImage
                            src={consultant.avatar || '/placeholder.svg'}
                            alt={consultant.name}
                            className='object-cover'
                          />
                          <AvatarFallback className='bg-gradient-to-br from-rose-400 to-pink-400 text-white text-xl font-semibold'>
                            {consultant.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className='absolute -top-1 -right-1'>
                          <Badge className='bg-green-500 text-white text-xs px-2 py-1 rounded-full'>✓ Verified</Badge>
                        </div>
                      </div>
                      <CardTitle className='text-xl font-bold text-gray-900 mb-1'>{consultant.name}</CardTitle>
                      <CardDescription className='text-gray-600 mb-2'>@{consultant.username}</CardDescription>
                      {consultant.bio && <p className='text-sm text-gray-700 italic'>{consultant.bio}</p>}
                    </CardHeader>

                    <CardContent className='space-y-4'>
                      {/* Experience */}
                      {consultant.experience && (
                        <div className='flex items-center gap-2 text-sm text-gray-700 bg-blue-50 p-2 rounded-lg'>
                          <Briefcase className='w-4 h-4 text-blue-500' />
                          <span className='font-medium'>{consultant.experience} years experience</span>
                        </div>
                      )}

                      {/* Contact Info */}
                      <div className='space-y-2'>
                        {consultant.phone_number && (
                          <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <Phone className='w-4 h-4 text-rose-500' />
                            <span>{consultant.phone_number}</span>
                          </div>
                        )}
                        {consultant.location && (
                          <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <MapPin className='w-4 h-4 text-rose-500' />
                            <span className='line-clamp-2'>{consultant.location}</span>
                          </div>
                        )}
                        {consultant.hospital && (
                          <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <Building2 className='w-4 h-4 text-rose-500' />
                            <span>{consultant.hospital}</span>
                          </div>
                        )}
                      </div>

                      {/* Specialties */}
                      {consultant.specialties && consultant.specialties.length > 0 && (
                        <div className='space-y-2'>
                          <div className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                            <Award className='w-4 h-4 text-purple-500' />
                            <span>Specialties</span>
                          </div>
                          <div className='flex flex-wrap gap-1'>
                            {consultant.specialties.slice(0, 3).map((specialty, index) => (
                              <Badge
                                key={index}
                                variant='secondary'
                                className='text-xs bg-purple-100 text-purple-700 hover:bg-purple-200'
                              >
                                {specialty}
                              </Badge>
                            ))}
                            {consultant.specialties.length > 3 && (
                              <Badge variant='secondary' className='text-xs bg-gray-100 text-gray-600'>
                                +{consultant.specialties.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Languages */}
                      {consultant.languages && consultant.languages.length > 0 && (
                        <div className='space-y-2'>
                          <div className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                            <Languages className='w-4 h-4 text-green-500' />
                            <span>Languages</span>
                          </div>
                          <div className='flex flex-wrap gap-1'>
                            {consultant.languages.map((language, index) => (
                              <Badge key={index} variant='outline' className='text-xs border-green-200 text-green-700'>
                                {language}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Degree */}
                      {consultant.degree && (
                        <div className='flex items-center gap-2 text-sm text-gray-600 bg-amber-50 p-2 rounded-lg'>
                          <GraduationCap className='w-4 h-4 text-amber-500' />
                          <span>{consultant.degree}</span>
                        </div>
                      )}

                      {/* Action Button */}
                      <Button
                        className='w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium mt-4'
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
          <Card className='bg-white/90 backdrop-blur-sm border-0 shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 group'>
            <CardContent className='pt-8 pb-6'>
              <div className='w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform'>
                <Users className='w-8 h-8 text-white' />
              </div>
              <div className='text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2'>
                {consultantsData?.length}+
              </div>
              <div className='text-gray-700 font-semibold text-lg'>Expert Consultants</div>
              <div className='text-gray-500 text-sm mt-1'>Ready to help you succeed</div>
            </CardContent>
          </Card>

          <Card className='bg-white/90 backdrop-blur-sm border-0 shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 group'>
            <CardContent className='pt-8 pb-6'>
              <div className='w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform'>
                <Clock className='w-8 h-8 text-white' />
              </div>
              <div className='text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2'>
                24/7
              </div>
              <div className='text-gray-700 font-semibold text-lg'>Support Available</div>
              <div className='text-gray-500 text-sm mt-1'>Round-the-clock assistance</div>
            </CardContent>
          </Card>
          <Card className='bg-white/90 backdrop-blur-sm border-0 shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 group'>
            <CardContent className='pt-8 pb-6'>
              <div className='w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform'>
                <Award className='w-8 h-8 text-white' />
              </div>
              <div className='text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2'>
                98%
              </div>
              <div className='text-gray-700 font-semibold text-lg'>Success Rate</div>
              <div className='text-gray-500 text-sm mt-1'>Client satisfaction guaranteed</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BookingConsultantSection
